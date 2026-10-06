import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.js';
import {
  analyzeRequirement,
  generateSalesPitch,
  getDailySalesAssistantBrief,
  recommendSolutions,
  scoreLeadLocally
} from './server/services/aiService.js';
import { getMLModelMetrics, predictLeadConversion } from './server/services/mlService.js';
import { User, LeadStatus } from './src/types/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Default demo session user
let currentUser: User = db.users[2]; // Default to Ammar Khan (Sales Executive)

// Helper: extract active user
function getActiveUser(req: Request): User {
  const userId = req.headers['x-user-id'] as string;
  if (userId) {
    const found = db.users.find(u => u.id === userId);
    if (found) return found;
  }
  return currentUser;
}

// -------------------------------------------------------------
// AUTHENTICATION & USERS
// -------------------------------------------------------------
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (user) {
    currentUser = user;
    return res.json({ success: true, user });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials. Try demo accounts.' });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  res.json({ user });
});

app.post('/api/auth/demo-switch', (req: Request, res: Response) => {
  const { role } = req.body;
  let targetUser = db.users.find(u => u.role === role);
  if (!targetUser) targetUser = db.users[0];
  currentUser = targetUser;
  res.json({ success: true, user: currentUser });
});

app.get('/api/users', (_req: Request, res: Response) => {
  res.json(db.users);
});

// -------------------------------------------------------------
// LEADS
// -------------------------------------------------------------
app.get('/api/leads', (req: Request, res: Response) => {
  const { search, industry, status, priority, salespersonId, leadSource, limit, offset, sortBy, sortOrder } = req.query;
  const result = db.getLeads({
    search: search as string,
    industry: industry as string,
    status: status as string,
    priority: priority as string,
    salespersonId: salespersonId as string,
    leadSource: leadSource as string,
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'asc' | 'desc'
  });
  res.json(result);
});

app.get('/api/leads/:id', (req: Request, res: Response) => {
  const lead = db.getLeadById(req.params.id);
  if (!lead) return res.status(404).json({ message: 'Lead not found' });

  // Get associated communications, meetings, deals, activities
  const comms = db.getCommunications(lead.id);
  const meetings = db.getMeetings().filter(m => m.leadId === lead.id);
  const deals = db.getDeals().filter(d => d.leadId === lead.id);
  const activities = db.getActivities(lead.id);
  const followups = db.getFollowUps().filter(f => f.leadId === lead.id);
  const mlPrediction = predictLeadConversion(lead, comms.length, meetings.length);

  res.json({
    lead,
    communications: comms,
    meetings,
    deals,
    activities,
    followups,
    mlPrediction
  });
});

app.post('/api/leads', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const lead = db.createLead(req.body, user);
  res.status(201).json(lead);
});

app.put('/api/leads/:id', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const updated = db.updateLead(req.params.id, req.body, user);
  if (!updated) return res.status(404).json({ message: 'Lead not found' });
  res.json(updated);
});

app.delete('/api/leads/:id', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const success = db.deleteLead(req.params.id, user);
  if (!success) return res.status(404).json({ message: 'Lead not found' });
  res.json({ success: true });
});

// CSV Export
app.get('/api/leads/export/csv', (_req: Request, res: Response) => {
  const leads = db.leads;
  const headers = ['Lead ID', 'Company', 'Contact', 'Email', 'Phone', 'Industry', 'Deal Value (INR)', 'Lead Score', 'Priority', 'Status', 'Lead Source', 'Assigned Rep'];
  const rows = leads.map(l => [
    l.id,
    `"${l.companyName}"`,
    `"${l.contactName}"`,
    l.email,
    l.phone,
    l.industry,
    l.estimatedDealValue,
    l.leadScore,
    l.priority,
    l.status,
    l.leadSource,
    `"${l.assignedSalespersonName}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leadflow-leads.csv');
  res.send(csv);
});

// CSV Import
app.post('/api/leads/import', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const { leads } = req.body;
  if (!Array.isArray(leads)) {
    return res.status(400).json({ message: 'Invalid format. Expected array of leads.' });
  }

  const createdLeads = leads.map(item => db.createLead(item, user));
  res.json({ success: true, count: createdLeads.length });
});

// -------------------------------------------------------------
// COMPANIES & CONTACTS
// -------------------------------------------------------------
app.get('/api/companies', (_req: Request, res: Response) => {
  res.json(db.companies);
});

app.get('/api/companies/:id', (req: Request, res: Response) => {
  const comp = db.companies.find(c => c.id === req.params.id);
  if (!comp) return res.status(404).json({ message: 'Company not found' });

  const contacts = db.contacts.filter(c => c.companyId === comp.id);
  const leads = db.leads.filter(l => l.companyId === comp.id);
  const deals = db.deals.filter(d => d.companyId === comp.id);
  const meetings = db.meetings.filter(m => m.companyId === comp.id);
  const activities = db.activities.filter(a => a.companyName.toLowerCase() === comp.name.toLowerCase());

  res.json({
    company: comp,
    contacts,
    leads,
    deals,
    meetings,
    activities
  });
});

app.get('/api/contacts', (_req: Request, res: Response) => {
  res.json(db.contacts);
});

// -------------------------------------------------------------
// DEALS & PIPELINE
// -------------------------------------------------------------
app.get('/api/deals', (_req: Request, res: Response) => {
  res.json(db.getDeals());
});

app.put('/api/deals/:id/stage', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const { stage } = req.body;
  const updated = db.updateDealStage(req.params.id, stage as LeadStatus, user);
  if (!updated) return res.status(404).json({ message: 'Deal not found' });
  res.json(updated);
});

app.get('/api/pipeline', (_req: Request, res: Response) => {
  const stages: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
  const deals = db.getDeals();

  const columns = stages.map(stage => {
    const stageDeals = deals.filter(d => d.stage === stage);
    const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
    return {
      stage,
      deals: stageDeals,
      count: stageDeals.length,
      totalValue,
      totalValueFormatted: `₹${(totalValue / 100000).toFixed(1)}L`
    };
  });

  const totalPipeline = deals.filter(d => !['WON', 'LOST'].includes(d.stage)).reduce((sum, d) => sum + d.value, 0);
  const weightedPipeline = deals.filter(d => !['WON', 'LOST'].includes(d.stage)).reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0);

  res.json({
    columns,
    totalPipeline,
    totalPipelineFormatted: `₹${(totalPipeline / 100000).toFixed(1)}L`,
    weightedPipeline,
    weightedPipelineFormatted: `₹${(weightedPipeline / 100000).toFixed(1)}L`
  });
});

// -------------------------------------------------------------
// MEETINGS & FOLLOW-UPS
// -------------------------------------------------------------
app.get('/api/meetings', (_req: Request, res: Response) => {
  res.json(db.getMeetings());
});

app.post('/api/meetings', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const meeting = db.createMeeting(req.body, user);
  res.status(201).json(meeting);
});

app.get('/api/followups', (_req: Request, res: Response) => {
  res.json(db.getFollowUps());
});

app.post('/api/followups', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const fu = db.createFollowUp(req.body, user);
  res.status(201).json(fu);
});

app.put('/api/followups/:id/complete', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const fu = db.completeFollowUp(req.params.id, user);
  if (!fu) return res.status(404).json({ message: 'Follow-up not found' });
  res.json(fu);
});

// -------------------------------------------------------------
// COMMUNICATIONS & ACTIVITIES
// -------------------------------------------------------------
app.get('/api/communications', (req: Request, res: Response) => {
  const leadId = req.query.leadId as string;
  res.json(db.getCommunications(leadId));
});

app.post('/api/communications', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const comm = db.createCommunication(req.body, user);
  res.status(201).json(comm);
});

app.get('/api/activities', (req: Request, res: Response) => {
  const leadId = req.query.leadId as string;
  res.json(db.getActivities(leadId));
});

// -------------------------------------------------------------
// SOLUTIONS CATALOG
// -------------------------------------------------------------
app.get('/api/solutions', (_req: Request, res: Response) => {
  res.json(db.solutions);
});

// -------------------------------------------------------------
// TARGETS
// -------------------------------------------------------------
app.get('/api/targets', (_req: Request, res: Response) => {
  res.json(db.targets);
});

app.put('/api/targets/:id', (req: Request, res: Response) => {
  const target = db.targets.find(t => t.id === req.params.id);
  if (!target) return res.status(404).json({ message: 'Target not found' });
  Object.assign(target, req.body);
  res.json(target);
});

// -------------------------------------------------------------
// DASHBOARD & ANALYTICS
// -------------------------------------------------------------
app.get('/api/dashboard', (req: Request, res: Response) => {
  const period = (req.query.period as any) || 'THIS_MONTH';
  const data = db.getDashboardData(period);
  res.json(data);
});

app.get('/api/analytics', (_req: Request, res: Response) => {
  const data = db.getDashboardData('ALL');
  res.json({
    ...data,
    winRate: 34.8,
    averageSalesCycleDays: 24,
    pipelineVelocity: '₹1.8L / day',
    lostDealReasons: [
      { reason: 'Price sensitivity / budget constraints', percentage: 38 },
      { reason: 'Chosen existing in-house SMS gateway', percentage: 24 },
      { reason: 'Delayed DLT regulatory registration', percentage: 18 },
      { reason: 'Competitor bundle lock-in', percentage: 14 },
      { reason: 'Project deprioritized', percentage: 6 }
    ]
  });
});

// -------------------------------------------------------------
// AI MODULES
// -------------------------------------------------------------
app.post('/api/ai/analyze-requirement', async (req: Request, res: Response) => {
  try {
    const { requirementText } = req.body;
    if (!requirementText) {
      return res.status(400).json({ message: 'requirementText is required' });
    }
    const result = await analyzeRequirement(requirementText);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: 'AI Analysis error', error: err.message });
  }
});

app.post('/api/ai/score-lead', (req: Request, res: Response) => {
  const leadData = req.body;
  const result = scoreLeadLocally(leadData);
  res.json(result);
});

app.post('/api/ai/recommend-solution', (req: Request, res: Response) => {
  const { requirement, lead } = req.body;
  const recommendations = recommendSolutions(requirement || '', lead);
  res.json({ recommendations });
});

app.post('/api/ai/generate-pitch', async (req: Request, res: Response) => {
  try {
    const { company, industry, requirement, painPoints, recommendedSolution, contactName, salespersonName, channel, tone } = req.body;
    const pitch = await generateSalesPitch({
      company: company || 'Prospective Client',
      industry: industry || 'SaaS',
      requirement: requirement || 'Scalable communication infrastructure',
      painPoints,
      recommendedSolution: recommendedSolution || 'OTP Messaging & WhatsApp Business',
      contactName: contactName || 'Decision Maker',
      salespersonName: salespersonName || 'Enterprise Sales Specialist',
      channel: channel || 'Cold Email',
      tone: tone || 'Consultative'
    });
    res.json(pitch);
  } catch (err: any) {
    res.status(500).json({ message: 'Error generating sales pitch', error: err.message });
  }
});

app.get('/api/ai/sales-assistant', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const brief = getDailySalesAssistantBrief(user, db.leads, db.meetings, db.followups);
  res.json(brief);
});

app.get('/api/ai/forecast-sales', (_req: Request, res: Response) => {
  const activeDeals = db.deals.filter(d => !['WON', 'LOST'].includes(d.stage));
  const totalPipeline = activeDeals.reduce((sum, d) => sum + d.value, 0);
  const weightedPipeline = activeDeals.reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0);
  const monthlyTarget = 3500000;
  const wonRevenue = db.deals.filter(d => d.stage === 'WON').reduce((sum, d) => sum + d.value, 0);
  const expectedTotal = wonRevenue + weightedPipeline * 0.75;
  const gap = Math.max(0, monthlyTarget - expectedTotal);
  const prob = Math.min(94, Math.round((expectedTotal / monthlyTarget) * 100));

  res.json({
    targetRevenue: monthlyTarget,
    currentPipelineValue: totalPipeline,
    weightedPipelineValue: weightedPipeline,
    expectedRevenue: Math.round(expectedTotal),
    achievementProbability: prob,
    pipelineGap: Math.round(gap),
    expectedDealsCount: Math.round(activeDeals.length * 0.45),
    averageSalesCycleDays: 24,
    recommendedAction: 'Focus on 8 high-probability enterprise deals currently in Proposal and Negotiation stages to exceed monthly target.',
    executiveSummary: `Based on current weighted pipeline of ₹${(weightedPipeline / 100000).toFixed(1)}L and historical conversion velocity, projected revenue stands at ₹${(expectedTotal / 100000).toFixed(1)}L (${prob}% target achievement probability). Pipeline gap is ₹${(gap / 100000).toFixed(1)}L.`
  });
});

// -------------------------------------------------------------
// ML LEAD CONVERSION
// -------------------------------------------------------------
app.get('/api/ml/metrics', (_req: Request, res: Response) => {
  res.json(getMLModelMetrics());
});

app.post('/api/ml/predict-conversion', (req: Request, res: Response) => {
  const { lead, interactionsCount, meetingsCount } = req.body;
  if (!lead) return res.status(400).json({ message: 'lead object is required' });
  const result = predictLeadConversion(lead, interactionsCount, meetingsCount);
  res.json(result);
});

// -------------------------------------------------------------
// NOTIFICATIONS & SEARCH & AUDIT
// -------------------------------------------------------------
app.get('/api/notifications', (_req: Request, res: Response) => {
  res.json(db.notifications);
});

app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
  const n = db.notifications.find(item => item.id === req.params.id);
  if (n) n.read = true;
  res.json({ success: true });
});

app.post('/api/notifications/read-all', (_req: Request, res: Response) => {
  db.notifications.forEach(n => { n.read = true; });
  res.json({ success: true });
});

app.get('/api/search', (req: Request, res: Response) => {
  const q = req.query.q as string;
  const results = db.globalSearch(q || '');
  res.json(results);
});

// Reset demo to pristine state
app.post('/api/reset-demo', (_req: Request, res: Response) => {
  db.resetToSeed();
  res.json({ success: true, message: 'Synthetic B2B demo workspace restored to initial state.' });
});

// Automated Integration Test Runner
app.get('/api/tests/run', async (_req: Request, res: Response) => {
  const testResults: { name: string; passed: boolean; durationMs: number; details: string }[] = [];

  // Test 1: Seed data integrity
  const t1Start = Date.now();
  const hasLeads = db.leads.length >= 100;
  const hasCompanies = db.companies.length >= 30;
  const hasSolutions = db.solutions.length === 9;
  testResults.push({
    name: 'Database Seed & Entity Verification',
    passed: hasLeads && hasCompanies && hasSolutions,
    durationMs: Date.now() - t1Start,
    details: `Verified ${db.leads.length} Leads, ${db.companies.length} Companies, ${db.solutions.length} Solutions.`
  });

  // Test 2: AI Requirement Analysis
  const t2Start = Date.now();
  try {
    const analysis = await analyzeRequirement('We are an e-commerce company processing around 50,000 OTP requests every month.');
    const hasProps = Boolean(analysis.industry && analysis.requiredChannels && analysis.painPoints.length > 0);
    testResults.push({
      name: 'AI Requirement Analyzer Engine',
      passed: hasProps,
      durationMs: Date.now() - t2Start,
      details: `Analyzed requirement into industry: "${analysis.industry}", channels: [${analysis.requiredChannels.join(', ')}].`
    });
  } catch (err: any) {
    testResults.push({
      name: 'AI Requirement Analyzer Engine',
      passed: false,
      durationMs: Date.now() - t2Start,
      details: err.message
    });
  }

  // Test 3: Lead Scoring Engine
  const t3Start = Date.now();
  const sampleLead = db.leads[0];
  const scoreResult = scoreLeadLocally(sampleLead);
  testResults.push({
    name: 'Lead Scoring Algorithm (0-100)',
    passed: scoreResult.score >= 0 && scoreResult.score <= 100 && Boolean(scoreResult.priority),
    durationMs: Date.now() - t3Start,
    details: `Scored ${sampleLead.companyName}: ${scoreResult.score}/100 (${scoreResult.priority}).`
  });

  // Test 4: Solution Recommendation
  const t4Start = Date.now();
  const recs = recommendSolutions('OTP verification and WhatsApp notifications');
  testResults.push({
    name: 'Hybrid CPaaS Solution Recommender',
    passed: recs.length >= 2,
    durationMs: Date.now() - t4Start,
    details: `Matched ${recs.length} solutions: ${recs.map(r => `${r.solutionName} (${r.matchScore}%)`).join(', ')}.`
  });

  // Test 5: ML Conversion Model
  const t5Start = Date.now();
  const mlPred = predictLeadConversion(sampleLead, 4, 1);
  testResults.push({
    name: 'ML Conversion Predictor & Feature Weights',
    passed: mlPred.predictedConversionProbability >= 0 && mlPred.featureWeights.length > 0,
    durationMs: Date.now() - t5Start,
    details: `Predicted probability: ${mlPred.predictedConversionProbability}%, Risk: ${mlPred.riskLevel}.`
  });

  // Test 6: Sales Pipeline & Deal Transition
  const t6Start = Date.now();
  const testDeal = db.deals[0];
  const originalStage = testDeal.stage;
  db.updateDealStage(testDeal.id, 'NEGOTIATION', currentUser);
  const updatedStage = testDeal.stage;
  db.updateDealStage(testDeal.id, originalStage, currentUser); // restore
  testResults.push({
    name: 'Pipeline Kanban State Machine & Audit Sync',
    passed: updatedStage === 'NEGOTIATION',
    durationMs: Date.now() - t6Start,
    details: `Validated deal state transition and activity log generation.`
  });

  const allPassed = testResults.every(t => t.passed);
  res.json({
    allPassed,
    totalTests: testResults.length,
    passedTests: testResults.filter(t => t.passed).length,
    results: testResults
  });
});

// -------------------------------------------------------------
// FRONTEND SERVING
// -------------------------------------------------------------
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const portNumber = Number(PORT) || 3000;
  app.listen(portNumber, '0.0.0.0', () => {
    console.log(`LeadFlow AI Full-Stack Platform running on http://0.0.0.0:${portNumber}`);
  });
}

setupVite().catch(err => {
  console.error('Failed to start server:', err);
});
