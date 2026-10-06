import { GoogleGenAI } from '@google/genai';
import {
  RequirementAnalysisResult,
  LeadScoringResult,
  SolutionRecommendation,
  Lead,
  User,
  Solution,
  Meeting,
  FollowUp
} from '../../src/types/index.js';
import { SOLUTIONS } from '../data/seedData.js';

let genAIClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (genAIClient) return genAIClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  try {
    genAIClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    return genAIClient;
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

// 1. Analyze Requirement
export async function analyzeRequirement(userInput: string): Promise<RequirementAnalysisResult> {
  const client = getAIClient();

  if (client) {
    try {
      const prompt = `You are a Principal Solutions Architect at a leading Enterprise CPaaS and B2B Communication SaaS company.
Analyze this prospective customer's business requirement:
"${userInput}"

Extract structured B2B sales intelligence in JSON format with these exact keys:
{
  "industry": "Industry sector (e.g., E-commerce, Fintech, Healthcare, EdTech, Logistics, SaaS, Retail, Banking)",
  "businessType": "Business model (e.g. D2C Marketplace, NBFC Lender, Telehealth Provider, B2B SaaS)",
  "businessProblem": "Concise summary of their core bottleneck or operational hurdle",
  "painPoints": ["Array of 3-4 specific operational or customer pain points"],
  "communicationRequirements": ["Array of communication needs like 2FA OTP, automated WhatsApp dispatches, order updates"],
  "requiredChannels": ["Array of required channels from SMS, WhatsApp, Voice, Email, Push"],
  "estimatedCommunicationVolume": "One of: 'Low (<10k/mo)', 'Medium (10k-100k/mo)', 'High (100k-1M/mo)', 'Enterprise (>1M/mo)'",
  "urgency": "One of: 'Immediate (<2 weeks)', 'High (1 month)', 'Moderate (1-3 months)', 'Low'",
  "buyingIntent": "One of: 'Very High', 'High', 'Medium', 'Exploratory'",
  "potentialUseCases": ["Array of 3 practical B2B use cases"],
  "recommendedNextAction": "Actionable sales advice for the Account Executive (e.g., Schedule technical discovery meeting)",
  "summary": "2-sentence executive summary of the deal requirement"
}`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.industry && parsed.painPoints) {
        return parsed as RequirementAnalysisResult;
      }
    } catch (e) {
      console.warn('Gemini API call failed, falling back to expert rule engine:', e);
    }
  }

  // Expert Hybrid Fallback
  return fallbackRequirementAnalysis(userInput);
}

function fallbackRequirementAnalysis(input: string): RequirementAnalysisResult {
  const lower = input.toLowerCase();

  let industry = 'SaaS';
  let businessType = 'Digital Platform';
  let estimatedVolume: RequirementAnalysisResult['estimatedCommunicationVolume'] = 'Medium (10k-100k/mo)';
  let urgency: RequirementAnalysisResult['urgency'] = 'High (1 month)';
  let buyingIntent: RequirementAnalysisResult['buyingIntent'] = 'High';

  const channels: string[] = [];
  const painPoints: string[] = [];
  const commReqs: string[] = [];
  const useCases: string[] = [];

  if (lower.includes('e-commerce') || lower.includes('cart') || lower.includes('order') || lower.includes('checkout')) {
    industry = 'E-commerce';
    businessType = 'D2C & Online Marketplace';
    painPoints.push('Cart abandonment due to authentication friction');
    painPoints.push('High volume of customer queries regarding order and delivery status');
    commReqs.push('Instant 2FA OTP verification');
    commReqs.push('WhatsApp order and delivery dispatch notifications');
    useCases.push('Checkout OTP authentication');
    useCases.push('Automated order dispatch & live delivery tracking');
    useCases.push('Personalized WhatsApp re-engagement for abandoned carts');
  } else if (lower.includes('fintech') || lower.includes('loan') || lower.includes('bank') || lower.includes('payment') || lower.includes('credit')) {
    industry = 'Fintech';
    businessType = 'Digital Lending & Financial Services';
    painPoints.push('High latency and regulatory compliance in transaction alerts');
    painPoints.push('Drop-offs during mandatory KYC document submission');
    commReqs.push('Zero-latency dedicated OTP routes with carrier failover');
    commReqs.push('WhatsApp KYC document submission bot');
    useCases.push('Payment authorization 2FA');
    useCases.push('Disbursement SMS alerts');
    useCases.push('Proactive EMI payment reminders');
    urgency = 'Immediate (<2 weeks)';
    buyingIntent = 'Very High';
  } else if (lower.includes('health') || lower.includes('doctor') || lower.includes('clinic') || lower.includes('patient')) {
    industry = 'Healthcare';
    businessType = 'Telehealth & Clinical Diagnostics';
    painPoints.push('Patient no-shows and missed consultation appointments');
    painPoints.push('Privacy concerns regarding doctor-patient phone interactions');
    commReqs.push('Virtual number privacy masking');
    commReqs.push('WhatsApp automated lab report delivery');
    useCases.push('Appointment confirmation & reminder drip');
    useCases.push('Virtual consultation number masking');
  } else if (lower.includes('edtech') || lower.includes('student') || lower.includes('course') || lower.includes('admission')) {
    industry = 'EdTech';
    businessType = 'Online Learning & Upskilling Institute';
    painPoints.push('High lead drop-off on manual SDR counseling call queues');
    painPoints.push('Low open rate on traditional email webinar invites');
    commReqs.push('Autonomous AI Voice Agent for preliminary lead triage');
    commReqs.push('WhatsApp live masterclass reminders');
    useCases.push('Automated screening call qualification');
    useCases.push('Admissions onboarding drip sequences');
  } else if (lower.includes('logistics') || lower.includes('driver') || lower.includes('delivery') || lower.includes('shipment')) {
    industry = 'Logistics';
    businessType = 'Supply Chain & Last-Mile Delivery';
    painPoints.push('Driver and customer phone number privacy risks');
    painPoints.push('High rate of fake delivery attempt disputes');
    commReqs.push('Cloud telephony number masking');
    commReqs.push('Real-time transactional SMS with tracking links');
    useCases.push('Buyer-driver anonymized calling');
    useCases.push('Proof of delivery OTP verification');
  } else {
    painPoints.push('Fragmented communication channels causing poor customer engagement');
    painPoints.push('Lack of centralized delivery reporting and SLA guarantees');
    commReqs.push('High-throughput enterprise API integration');
    commReqs.push('Multi-channel failover redundancy');
    useCases.push('Transactional customer alerts');
    useCases.push('Automated lifecycle re-engagement');
  }

  // Detect channels
  if (lower.includes('otp') || lower.includes('sms') || lower.includes('text')) channels.push('SMS');
  if (lower.includes('whatsapp')) channels.push('WhatsApp');
  if (lower.includes('voice') || lower.includes('call') || lower.includes('ivr')) channels.push('Voice');
  if (lower.includes('email')) channels.push('Email');
  if (channels.length === 0) {
    channels.push('SMS', 'WhatsApp');
  }

  // Volume estimation
  if (lower.includes('50,000') || lower.includes('50k') || lower.includes('100,000') || lower.includes('100k')) {
    estimatedVolume = 'High (100k-1M/mo)';
  } else if (lower.includes('million') || lower.includes('lakh') || lower.includes('enterprise')) {
    estimatedVolume = 'Enterprise (>1M/mo)';
    urgency = 'Immediate (<2 weeks)';
    buyingIntent = 'Very High';
  }

  return {
    industry,
    businessType,
    businessProblem: `Customer seeks scalable communication infrastructure for ${commReqs.join(', ')} with high deliverability SLAs.`,
    painPoints,
    communicationRequirements: commReqs,
    requiredChannels: channels,
    estimatedCommunicationVolume: estimatedVolume,
    urgency,
    buyingIntent,
    potentialUseCases: useCases.length > 0 ? useCases : ['Transactional notifications', 'Customer verification', 'Engagement campaigns'],
    recommendedNextAction: 'Schedule a discovery meeting with the engineering/product lead to demo carrier latency benchmarks and review volume tier pricing.',
    summary: `Prospect in ${industry} with ${estimatedVolume} communication traffic requiring ${channels.join(' & ')} solutions. Strong qualification fit for enterprise CPaaS deployment.`
  };
}

// 2. Score Lead
export function scoreLeadLocally(lead: Lead): LeadScoringResult {
  let score = 50;
  const factors: LeadScoringResult['factors'] = [];
  const reasoning: string[] = [];

  // Deal Value Factor (Weight 25)
  if (lead.estimatedDealValue >= 1000000) {
    score += 25;
    factors.push({ name: 'Deal Value', score: 95, weight: 25, description: 'Enterprise deal size exceeding ₹10 Lakhs' });
    reasoning.push('High contract value represents tier-1 enterprise CPaaS opportunity.');
  } else if (lead.estimatedDealValue >= 500000) {
    score += 18;
    factors.push({ name: 'Deal Value', score: 80, weight: 25, description: 'Mid-market deal value between ₹5L - ₹10L' });
    reasoning.push('Healthy deal value with substantial recurring revenue potential.');
  } else {
    score += 8;
    factors.push({ name: 'Deal Value', score: 50, weight: 25, description: 'Standard deal value (< ₹5L)' });
    reasoning.push('Moderate deal value suitable for standard package tiers.');
  }

  // Requirement Specificity & Channels (Weight 25)
  const reqLower = (lead.businessRequirement || '').toLowerCase();
  let reqScore = 60;
  if (reqLower.includes('otp') && reqLower.includes('whatsapp')) {
    reqScore = 95;
    score += 20;
    reasoning.push('Clear requirement combining high-margin OTP and WhatsApp conversational channels.');
  } else if (reqLower.length > 50) {
    reqScore = 75;
    score += 14;
    reasoning.push('Well-defined technical problem statement with concrete metrics.');
  } else {
    reqScore = 40;
    score += 5;
    reasoning.push('Brief requirement; discovery call needed to establish volume parameters.');
  }
  factors.push({ name: 'Requirement Clarity', score: reqScore, weight: 25, description: 'Depth and clarity of CPaaS use case' });

  // Industry & Company Size (Weight 20)
  if (['Fintech', 'Banking', 'E-commerce', 'Logistics'].includes(lead.industry)) {
    score += 18;
    factors.push({ name: 'Industry Fit', score: 92, weight: 20, description: `${lead.industry} is a core CPaaS high-volume vertical` });
    reasoning.push(`${lead.industry} enterprises have strict mission-critical delivery SLA requirements.`);
  } else {
    score += 10;
    factors.push({ name: 'Industry Fit', score: 65, weight: 20, description: `${lead.industry} vertical` });
  }

  // Engagement & Stage (Weight 15)
  if (['PROPOSAL', 'NEGOTIATION'].includes(lead.status)) {
    score += 14;
    factors.push({ name: 'Pipeline Velocity', score: 90, weight: 15, description: 'Active proposal / negotiation stage' });
  } else if (['QUALIFIED', 'MEETING'].includes(lead.status)) {
    score += 10;
    factors.push({ name: 'Pipeline Velocity', score: 75, weight: 15, description: 'Qualified opportunity with scheduled discussions' });
  } else {
    score += 4;
    factors.push({ name: 'Pipeline Velocity', score: 50, weight: 15, description: 'Early stage lead' });
  }

  // Lead Source Credibility (Weight 15)
  if (['Referral', 'Inbound', 'Event'].includes(lead.leadSource)) {
    score += 12;
    factors.push({ name: 'Lead Source Intent', score: 88, weight: 15, description: `High-intent ${lead.leadSource} channel` });
  } else {
    score += 6;
    factors.push({ name: 'Lead Source Intent', score: 60, weight: 15, description: `Outbound ${lead.leadSource} channel` });
  }

  // Normalize 0-100
  const finalScore = Math.min(98, Math.max(22, Math.round(score * 0.95)));
  const conversionProb = Math.min(94, Math.max(15, Math.round(finalScore * 0.92)));

  let priority: Lead['priority'] = 'LOW';
  let recommendedAction = 'Nurture via automated email sequence';

  if (finalScore >= 80) {
    priority = 'HOT';
    recommendedAction = 'Contact prospect within 24 hours to review enterprise pricing and schedule technical demo.';
  } else if (finalScore >= 60) {
    priority = 'WARM';
    recommendedAction = 'Follow up within 48 hours with customized solution brief and customer case studies.';
  } else if (finalScore >= 40) {
    priority = 'COLD';
    recommendedAction = 'Share technical documentation and invite to upcoming product webinar.';
  }

  return {
    score: finalScore,
    priority,
    conversionProbability: conversionProb,
    factors,
    reasoning,
    recommendedAction
  };
}

// 3. Solution Recommendation Engine (Hybrid Rules + Catalog + Reasoning)
export function recommendSolutions(requirement: string, lead?: Lead): SolutionRecommendation[] {
  const reqLower = requirement.toLowerCase();
  const recommendations: SolutionRecommendation[] = [];

  // Match: OTP Messaging
  if (reqLower.includes('otp') || reqLower.includes('2fa') || reqLower.includes('auth') || reqLower.includes('verification') || reqLower.includes('password') || reqLower.includes('banking') || reqLower.includes('login')) {
    recommendations.push({
      solutionId: 'sol-otp-messaging',
      solutionName: 'OTP Messaging',
      matchScore: 94,
      businessReason: 'Direct telecom routes ensure sub-5s delivery for critical sign-in and transactional 2FA with automatic voice fallback.',
      expectedBenefit: 'Eliminates verification timeouts and preserves high customer signup completion rates.',
      suggestedPitch: 'We provide dedicated carrier-grade OTP routes that guarantee 99.8% delivery within 5 seconds, backed by automatic voice OTP fallback if mobile reception fails.',
      nextAction: 'Offer sandbox credentials to benchmark delivery latency against current provider.'
    });
  }

  // Match: WhatsApp Business Communication
  if (reqLower.includes('whatsapp') || reqLower.includes('notification') || reqLower.includes('order') || reqLower.includes('update') || reqLower.includes('support') || reqLower.includes('interactive') || reqLower.includes('delivery')) {
    recommendations.push({
      solutionId: 'sol-whatsapp-biz',
      solutionName: 'WhatsApp Business Communication',
      matchScore: 91,
      businessReason: 'Official Meta WhatsApp Business API allows rich media updates, interactive CTA buttons, and automated delivery tracking directly in WhatsApp.',
      expectedBenefit: 'Achieves 98% open rates and 5x higher engagement compared to traditional email alerts.',
      suggestedPitch: 'Engage customers where they already spend time. Our WhatsApp Business solution enables verified green-tick notifications, rich PDF invoice sharing, and live location delivery tracking.',
      nextAction: 'Share demo sample interactive WhatsApp template designs tailored for their brand.'
    });
  }

  // Match: SMS API
  if (reqLower.includes('sms') || reqLower.includes('text') || reqLower.includes('broadcast') || reqLower.includes('alert') || reqLower.includes('bulk')) {
    recommendations.push({
      solutionId: 'sol-sms-api',
      solutionName: 'SMS API',
      matchScore: 88,
      businessReason: 'High-throughput carrier routes with automated DLT header management and real-time delivery receipts.',
      expectedBenefit: 'Guaranteed 99.9% uptime SLA and compliant sender ID routing across all telecom circles.',
      suggestedPitch: 'Our enterprise SMS API connects directly to tier-1 telecom carriers with sub-second latency and intelligent routing redundancy to prevent delivery outages.',
      nextAction: 'Provide API documentation and volume bracket tier pricing.'
    });
  }

  // Match: Transactional Messaging
  if (reqLower.includes('transaction') || reqLower.includes('receipt') || reqLower.includes('invoice') || reqLower.includes('order update') || reqLower.includes('disbursement')) {
    recommendations.push({
      solutionId: 'sol-transactional-msg',
      solutionName: 'Transactional Messaging',
      matchScore: 87,
      businessReason: 'Unified event-driven engine dispatching mission-critical purchase receipts, payment alerts, and account changes.',
      expectedBenefit: 'Automates customer touchpoints and cuts customer service status inquiries by up to 40%.',
      suggestedPitch: 'Streamline every customer milestone with automated transactional events triggered directly from your backend webhooks.',
      nextAction: 'Review current webhook payload architecture with their development team.'
    });
  }

  // Match: AI Voice Agent
  if (reqLower.includes('voice') || reqLower.includes('agent') || reqLower.includes('call') || reqLower.includes('ivr') || reqLower.includes('drop-off') || reqLower.includes('counsel') || reqLower.includes('sdr')) {
    recommendations.push({
      solutionId: 'sol-ai-voice',
      solutionName: 'AI Voice Agent',
      matchScore: 89,
      businessReason: 'Autonomous low-latency conversational voice agent that qualifies inbound/outbound leads 24/7 with human-like natural conversation.',
      expectedBenefit: 'Reduces repetitive SDR calling workload by 65% while responding to new inquiries within 30 seconds.',
      suggestedPitch: 'Never miss an interested prospect. Our AI Voice Agent conducts human-like qualification calls, answers questions, and books meetings on your team calendar automatically.',
      nextAction: 'Schedule a live 5-minute interactive voice bot call demonstration.'
    });
  }

  // Match: Cloud Communication / Telephony
  if (reqLower.includes('masking') || reqLower.includes('privacy') || reqLower.includes('virtual number') || reqLower.includes('telephony') || reqLower.includes('pbx')) {
    recommendations.push({
      solutionId: 'sol-cloud-comm',
      solutionName: 'Cloud Communication',
      matchScore: 86,
      businessReason: 'Protects buyer and seller customer phone numbers using virtual number bridging and recorded IVR channels.',
      expectedBenefit: '100% customer phone number privacy compliance and complete auditability of client interactions.',
      suggestedPitch: 'Eliminate direct phone number sharing between delivery partners and customers with automated cloud call bridging and recording.',
      nextAction: 'Demonstrate number masking API workflow and call recording storage.'
    });
  }

  // Match: Communication Automation / Omnichannel
  if (recommendations.length < 3 || reqLower.includes('automation') || reqLower.includes('workflow') || reqLower.includes('omnichannel') || reqLower.includes('multiple channels')) {
    recommendations.push({
      solutionId: 'sol-omnichannel',
      solutionName: 'Omnichannel Messaging',
      matchScore: 85,
      businessReason: 'Consolidates SMS, WhatsApp, and Voice under a single unified API with automated failover and single billing.',
      expectedBenefit: 'Replaces multiple disjointed vendors, reducing procurement overhead and operational latency.',
      suggestedPitch: 'Manage your entire communication stack through one unified SLA, developer API, and consolidated monthly invoice with automatic channel fallback.',
      nextAction: 'Propose a unified CPaaS consolidation plan with volume bundle incentives.'
    });
  }

  return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);
}

// 4. Generate Sales Pitch (Multi-channel & Tone selector)
export async function generateSalesPitch(params: {
  company: string;
  industry: string;
  requirement: string;
  painPoints?: string[];
  recommendedSolution: string;
  contactName: string;
  salespersonName: string;
  channel: 'Cold Email' | 'Follow-up Email' | 'LinkedIn' | 'WhatsApp' | 'Meeting Invitation' | 'Proposal Follow-up';
  tone: 'Professional' | 'Friendly' | 'Consultative' | 'Persuasive' | 'Concise';
}): Promise<{ subject?: string; content: string }> {
  const client = getAIClient();

  if (client) {
    try {
      const prompt = `You are an elite Enterprise B2B Sales Executive at LeadFlow AI (a modern enterprise CPaaS & B2B communications platform).
Generate an impactful, highly customized sales communication for:
- Prospect Company: ${params.company} (${params.industry})
- Contact Person: ${params.contactName}
- Sales Executive: ${params.salespersonName}
- Customer Requirement: ${params.requirement}
- Recommended Solution: ${params.recommendedSolution}
- Channel: ${params.channel}
- Desired Tone: ${params.tone}

Formatting instructions:
- If channel is 'Cold Email', 'Follow-up Email', 'Meeting Invitation', or 'Proposal Follow-up', output JSON:
{"subject": "Compelling subject line", "content": "Full message body"}
- If channel is 'LinkedIn' or 'WhatsApp', output JSON:
{"subject": null, "content": "Message content suitable for direct messaging"}
Do not include generic fluff. Mention specific CPaaS value (delivery SLA, latency, WhatsApp engagement, failover routes).`;

      const res = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(res.text || '{}');
      if (parsed.content) {
        return parsed;
      }
    } catch (e) {
      console.warn('Pitch generation AI fallback:', e);
    }
  }

  // Fallback High-Quality Templates
  const firstName = params.contactName.split(' ')[0] || 'there';

  if (params.channel === 'Cold Email') {
    return {
      subject: `Accelerating ${params.company}'s customer engagement & OTP deliverability`,
      content: `Hi ${firstName},

I noticed ${params.company}'s strong growth in the ${params.industry} space. Rapid scaling often brings communication bottlenecks—specifically around OTP delivery latency and high support inquiries on order updates.

At LeadFlow AI, we help high-growth companies achieve:
• 99.8% OTP delivery within 5 seconds via dedicated direct carrier routes
• 5x higher customer engagement by automating rich WhatsApp Business updates & interactive buttons
• Sub-second failover routing that prevents verification drop-offs during peak sale events

Given your requirement for ${params.recommendedSolution}, I would love to share a 10-minute overview of how our platform can benchmark against your current carrier routes.

Would you be open to a quick discovery call this Thursday at 3:00 PM?

Best regards,
${params.salespersonName}
Enterprise CPaaS Solutions | LeadFlow AI`
    };
  }

  if (params.channel === 'Follow-up Email') {
    return {
      subject: `Following up: Tailored CPaaS benchmark for ${params.company}`,
      content: `Hi ${firstName},

Following up on my previous note regarding ${params.company}'s communication infrastructure.

We recently helped a leading ${params.industry} platform reduce OTP latency by 42% while migrating transactional order updates to verified WhatsApp Business notifications.

I have assembled a preliminary volume comparison for ${params.recommendedSolution} tailored to your estimated monthly traffic.

Are you available for a brief 15-minute sync tomorrow afternoon?

Best regards,
${params.salespersonName}
LeadFlow AI`
    };
  }

  if (params.channel === 'LinkedIn') {
    return {
      content: `Hi ${firstName}, loved following ${params.company}'s expansion in ${params.industry}! 

We are working with engineering & product leaders to resolve peak-hour OTP delivery delays and streamline WhatsApp customer notifications.

Given your focus on ${params.recommendedSolution}, would love to connect and share our latest CPaaS latency benchmark report. Let's connect!`
    };
  }

  if (params.channel === 'WhatsApp') {
    return {
      content: `Hello ${firstName}, this is ${params.salespersonName} from LeadFlow AI. Reaching out regarding your requirement for ${params.recommendedSolution} for ${params.company}. 

We guarantee 99.8% OTP delivery under 5 seconds and verified WhatsApp Business notifications with interactive buttons. 

Would love to share a quick 1-pager or coordinate a brief discovery call this week. Let me know what time works best for you!`
    };
  }

  if (params.channel === 'Meeting Invitation') {
    return {
      subject: `Discovery & Technical Architecture Demo: LeadFlow AI <> ${params.company}`,
      content: `Hi ${firstName},

Thank you for your interest in LeadFlow AI's ${params.recommendedSolution}.

Proposed Agenda (30 mins):
1. Review ${params.company}'s monthly communication volumes and delivery SLAs
2. Technical demo: Direct carrier routing, WhatsApp API sandbox, and webhook failover
3. Custom volume tier pricing and implementation timeline
4. Q&A with Solutions Architect

Looking forward to connecting!

Best regards,
${params.salespersonName}`
    };
  }

  // Proposal Follow-up
  return {
    subject: `Reviewing custom ${params.recommendedSolution} proposal for ${params.company}`,
    content: `Hi ${firstName},

I wanted to check in on the customized CPaaS proposal we shared earlier this week for ${params.company}.

As discussed, the proposed commercial model includes dedicated carrier routes, DLT registration assistance, and enterprise volume discounts for ${params.recommendedSolution}.

Do you or the finance team have any questions regarding the SLA guarantees or implementation milestones? Happy to hop on a quick 10-minute call to finalize details.

Best regards,
${params.salespersonName}
LeadFlow AI`
  };
}

// 5. Daily Sales Assistant Generator
export function getDailySalesAssistantBrief(user: User, leads: Lead[], meetings: Meeting[], followups: FollowUp[]): {
  greeting: string;
  stats: {
    followUpsToday: number;
    meetingsToday: number;
    hotLeadsCount: number;
    activePipelineFormatted: string;
  };
  topPriorities: {
    companyName: string;
    dealValueFormatted: string;
    conversionProb: number;
    action: string;
    leadId: string;
  }[];
  executiveRecommendation: string;
} {
  const todayStr = new Date().toISOString().split('T')[0];

  const userFollowups = followups.filter(f => f.assignedSalespersonId === user.id || user.role === 'SALES_MANAGER' || user.role === 'ADMIN');
  const followUpsToday = userFollowups.filter(f => f.dueDate <= todayStr && f.status !== 'COMPLETED').length;

  const userMeetings = meetings.filter(m => m.assignedSalespersonId === user.id || user.role === 'SALES_MANAGER' || user.role === 'ADMIN');
  const meetingsToday = userMeetings.filter(m => m.date === todayStr && m.status === 'SCHEDULED').length;

  const userLeads = leads.filter(l => l.assignedSalespersonId === user.id || user.role === 'SALES_MANAGER' || user.role === 'ADMIN');
  const hotLeads = userLeads.filter(l => l.priority === 'HOT' && !['WON', 'LOST'].includes(l.status));
  const activePipeline = userLeads.filter(l => !['WON', 'LOST'].includes(l.status)).reduce((s, l) => s + l.estimatedDealValue, 0);

  // Sort hot leads by value and probability
  const sortedPriorities = [...hotLeads]
    .sort((a, b) => (b.estimatedDealValue * b.conversionProbability) - (a.estimatedDealValue * a.conversionProbability))
    .slice(0, 3)
    .map(l => ({
      companyName: l.companyName,
      dealValueFormatted: `₹${(l.estimatedDealValue / 100000).toFixed(1)}L`,
      conversionProb: l.conversionProbability,
      action: l.status === 'PROPOSAL' ? 'Call CTO to review revised SLA terms' : l.status === 'MEETING' ? 'Conduct scheduled technical demo' : 'Initiate immediate discovery outreach',
      leadId: l.id
    }));

  const topLead = sortedPriorities[0];
  const rec = topLead
    ? `Prioritize reaching out to ${topLead.companyName} (${topLead.dealValueFormatted}, ${topLead.conversionProb}% probability) before 1:00 PM to lock in current quarter closing velocity.`
    : 'Review active pipeline opportunities in Qualification stage and initiate follow-up sequences.';

  return {
    greeting: `Good day, ${user.name.split(' ')[0]}! Here is your AI Sales Briefing:`,
    stats: {
      followUpsToday,
      meetingsToday,
      hotLeadsCount: hotLeads.length,
      activePipelineFormatted: `₹${(activePipeline / 100000).toFixed(1)}L`
    },
    topPriorities: sortedPriorities,
    executiveRecommendation: rec
  };
}
