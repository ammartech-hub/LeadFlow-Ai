import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  USERS,
  COMPANIES,
  CONTACTS,
  LEADS,
  DEALS,
  MEETINGS,
  FOLLOWUPS,
  COMMUNICATIONS,
  ACTIVITIES,
  SOLUTIONS,
  TARGETS
} from './data/seedData.js';
import {
  Lead,
  Company,
  Contact,
  Deal,
  Meeting,
  FollowUp,
  Communication,
  Activity,
  Solution,
  SalesTarget,
  User,
  NotificationItem,
  LeadStatus
} from '../src/types/index.js';
import { CallLog, EmailLog, MessageLog, CalendarEvent } from './providers/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE_PATH = path.resolve(__dirname, 'data', 'db_store.json');

export interface PipelineHistoryItem {
  id: string;
  dealId: string;
  leadId: string;
  companyName: string;
  fromStage: string;
  toStage: string;
  dealValue: number;
  changedById: string;
  changedByName: string;
  timestamp: string;
}

export interface AIInsightItem {
  id: string;
  leadId?: string;
  companyName?: string;
  requirementText: string;
  analysis: any;
  timestamp: string;
}

class DataStore {
  users: User[] = [];
  companies: Company[] = [];
  contacts: Contact[] = [];
  leads: Lead[] = [];
  deals: Deal[] = [];
  meetings: Meeting[] = [];
  followups: FollowUp[] = [];
  communications: Communication[] = [];
  activities: Activity[] = [];
  solutions: Solution[] = [];
  targets: SalesTarget[] = [];
  notifications: NotificationItem[] = [];
  callLogs: CallLog[] = [];
  emailLogs: EmailLog[] = [];
  messageLogs: MessageLog[] = [];
  calendarEvents: CalendarEvent[] = [];
  pipelineHistory: PipelineHistoryItem[] = [];
  aiInsights: AIInsightItem[] = [];

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const data = JSON.parse(raw);
        this.users = data.users || JSON.parse(JSON.stringify(USERS));
        this.companies = data.companies || JSON.parse(JSON.stringify(COMPANIES));
        this.contacts = data.contacts || JSON.parse(JSON.stringify(CONTACTS));
        this.leads = data.leads || JSON.parse(JSON.stringify(LEADS));
        this.deals = data.deals || JSON.parse(JSON.stringify(DEALS));
        this.meetings = data.meetings || JSON.parse(JSON.stringify(MEETINGS));
        this.followups = data.followups || JSON.parse(JSON.stringify(FOLLOWUPS));
        this.communications = data.communications || JSON.parse(JSON.stringify(COMMUNICATIONS));
        this.activities = data.activities || JSON.parse(JSON.stringify(ACTIVITIES));
        this.solutions = data.solutions || JSON.parse(JSON.stringify(SOLUTIONS));
        this.targets = data.targets || JSON.parse(JSON.stringify(TARGETS));
        this.notifications = data.notifications || [];
        this.callLogs = data.callLogs || [];
        this.emailLogs = data.emailLogs || [];
        this.messageLogs = data.messageLogs || [];
        this.calendarEvents = data.calendarEvents || [];
        this.pipelineHistory = data.pipelineHistory || [];
        this.aiInsights = data.aiInsights || [];
        return;
      }
    } catch (err) {
      console.warn('Could not read persistent DB file, restoring seed:', err);
    }
    this.resetToSeed();
  }

  persist() {
    try {
      const data = {
        users: this.users,
        companies: this.companies,
        contacts: this.contacts,
        leads: this.leads,
        deals: this.deals,
        meetings: this.meetings,
        followups: this.followups,
        communications: this.communications,
        activities: this.activities,
        solutions: this.solutions,
        targets: this.targets,
        notifications: this.notifications,
        callLogs: this.callLogs,
        emailLogs: this.emailLogs,
        messageLogs: this.messageLogs,
        calendarEvents: this.calendarEvents,
        pipelineHistory: this.pipelineHistory,
        aiInsights: this.aiInsights
      };
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist DataStore to disk:', err);
    }
  }

  resetToSeed() {
    this.users = JSON.parse(JSON.stringify(USERS));
    this.companies = JSON.parse(JSON.stringify(COMPANIES));
    this.contacts = JSON.parse(JSON.stringify(CONTACTS));
    this.leads = JSON.parse(JSON.stringify(LEADS));
    this.deals = JSON.parse(JSON.stringify(DEALS));
    this.meetings = JSON.parse(JSON.stringify(MEETINGS));
    this.followups = JSON.parse(JSON.stringify(FOLLOWUPS));
    this.communications = JSON.parse(JSON.stringify(COMMUNICATIONS));
    this.activities = JSON.parse(JSON.stringify(ACTIVITIES));
    this.solutions = JSON.parse(JSON.stringify(SOLUTIONS));
    this.targets = JSON.parse(JSON.stringify(TARGETS));
    this.callLogs = [];
    this.emailLogs = [];
    this.messageLogs = [];
    this.calendarEvents = [];
    this.pipelineHistory = [];
    this.aiInsights = [];

    this.notifications = [
      {
        id: 'notif-1',
        title: 'High-Priority Follow-up Overdue',
        message: 'Credix Financial Services proposal follow-up is 1 day overdue. Call CTO Meera Nambiar.',
        type: 'FOLLOW_UP',
        priority: 'HIGH',
        createdAt: new Date().toISOString(),
        read: false,
        leadId: 'lead-002'
      },
      {
        id: 'notif-2',
        title: 'Upcoming Discovery Demo',
        message: 'Product Demo with NovaCart India scheduled for today at 2:00 PM.',
        type: 'MEETING',
        priority: 'NORMAL',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        leadId: 'lead-001'
      },
      {
        id: 'notif-3',
        title: 'Hot Inbound Lead Assigned',
        message: 'New enterprise lead PayFlow NeoBank assigned to you with lead score 96/100.',
        type: 'LEAD',
        priority: 'HIGH',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        leadId: 'lead-009'
      },
      {
        id: 'notif-4',
        title: 'Monthly Target Progress',
        message: 'You have reached 62.7% of your October Revenue Target (₹9.4L of ₹15.0L).',
        type: 'TARGET',
        priority: 'NORMAL',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        read: true
      }
    ];

    this.persist();
  }

  // --- Lead Methods ---
  getLeads(filters?: {
    search?: string;
    industry?: string;
    status?: string;
    priority?: string;
    salespersonId?: string;
    leadSource?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    let list = [...this.leads];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        l =>
          l.companyName.toLowerCase().includes(q) ||
          l.contactName.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.businessRequirement.toLowerCase().includes(q)
      );
    }

    if (filters?.industry && filters.industry !== 'ALL') {
      list = list.filter(l => l.industry === filters.industry);
    }

    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(l => l.status === filters.status);
    }

    if (filters?.priority && filters.priority !== 'ALL') {
      list = list.filter(l => l.priority === filters.priority);
    }

    if (filters?.salespersonId && filters.salespersonId !== 'ALL') {
      list = list.filter(l => l.assignedSalespersonId === filters.salespersonId);
    }

    if (filters?.leadSource && filters.leadSource !== 'ALL') {
      list = list.filter(l => l.leadSource === filters.leadSource);
    }

    const total = list.length;

    // Sorting
    const sortBy = filters?.sortBy || 'createdAt';
    const sortOrder = filters?.sortOrder || 'desc';

    list.sort((a: any, b: any) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    if (filters?.offset !== undefined && filters?.limit !== undefined) {
      list = list.slice(filters.offset, filters.offset + filters.limit);
    }

    return { total, leads: list };
  }

  getLeadById(id: string) {
    return this.leads.find(l => l.id === id);
  }

  createLead(leadData: Partial<Lead>, createdBy: User): Lead {
    const newId = `lead-${(this.leads.length + 1).toString().padStart(3, '0')}`;
    const now = new Date().toISOString();

    const companyId = leadData.companyId || `comp-cust-${Date.now()}`;
    const contactId = leadData.contactId || `cont-cust-${Date.now()}`;

    // Ensure company exists or create
    let company = this.companies.find(c => c.id === companyId || c.name.toLowerCase() === leadData.companyName?.toLowerCase());
    if (!company && leadData.companyName) {
      company = {
        id: companyId,
        name: leadData.companyName,
        domain: leadData.website ? leadData.website.replace(/^https?:\/\//, '').split('/')[0] : 'enterprise.co',
        industry: leadData.industry || 'SaaS',
        size: leadData.companySize || '50-100 employees',
        location: leadData.location || 'India',
        website: leadData.website || 'https://enterprise.co',
        createdAt: now
      };
      this.companies.unshift(company);
    }

    const lead: Lead = {
      id: newId,
      companyId: company ? company.id : companyId,
      companyName: leadData.companyName || 'New Prospect',
      contactId: contactId,
      contactName: leadData.contactName || 'Primary Contact',
      email: leadData.email || 'contact@company.com',
      phone: leadData.phone || '+91 98000 00000',
      industry: leadData.industry || 'SaaS',
      companySize: leadData.companySize || '50-100 employees',
      location: leadData.location || 'Bengaluru, Karnataka',
      website: leadData.website || 'https://company.com',
      leadSource: leadData.leadSource || 'Inbound',
      businessRequirement: leadData.businessRequirement || '',
      estimatedDealValue: Number(leadData.estimatedDealValue) || 500000,
      leadScore: Number(leadData.leadScore) || 75,
      conversionProbability: Number(leadData.conversionProbability) || 65,
      priority: leadData.priority || 'WARM',
      status: leadData.status || 'NEW',
      assignedSalespersonId: leadData.assignedSalespersonId || createdBy.id,
      assignedSalespersonName: leadData.assignedSalespersonName || createdBy.name,
      createdAt: now,
      lastContactedAt: now,
      nextFollowUpDate: leadData.nextFollowUpDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      notes: leadData.notes || 'Created via LeadFlow AI Lead Management.',
      aiRequirementAnalysis: leadData.aiRequirementAnalysis,
      recommendedSolutionIds: leadData.recommendedSolutionIds || ['sol-otp-messaging', 'sol-whatsapp-biz']
    };

    this.leads.unshift(lead);

    // Also create corresponding Deal
    const deal: Deal = {
      id: `deal-${(this.deals.length + 1).toString().padStart(3, '0')}`,
      leadId: lead.id,
      companyId: lead.companyId,
      companyName: lead.companyName,
      contactId: lead.contactId,
      contactName: lead.contactName,
      title: `${lead.companyName} - CPaaS Engagement`,
      value: lead.estimatedDealValue,
      stage: lead.status,
      probability: lead.conversionProbability,
      expectedCloseDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      assignedSalespersonId: lead.assignedSalespersonId,
      assignedSalespersonName: lead.assignedSalespersonName,
      solutions: ['OTP Messaging', 'WhatsApp Business Communication'],
      createdAt: now,
      updatedAt: now
    };
    this.deals.unshift(deal);

    // Activity log
    this.addActivity({
      leadId: lead.id,
      companyName: lead.companyName,
      userId: createdBy.id,
      userName: createdBy.name,
      type: 'CREATED',
      description: `New lead created for ${lead.companyName} with estimated deal value ₹${(lead.estimatedDealValue / 100000).toFixed(1)}L.`,
      outcome: 'Lead added to pipeline'
    });

    this.persist();
    return lead;
  }

  updateLead(id: string, updates: Partial<Lead>, updatedBy: User): Lead | null {
    const index = this.leads.findIndex(l => l.id === id);
    if (index === -1) return null;

    const oldLead = this.leads[index];
    const newLead = { ...oldLead, ...updates };
    this.leads[index] = newLead;

    // If status changed, sync Deal and log activity
    if (updates.status && updates.status !== oldLead.status) {
      const deal = this.deals.find(d => d.leadId === id);
      if (deal) {
        deal.stage = updates.status;
        deal.updatedAt = new Date().toISOString();
        if (updates.status === 'WON') deal.probability = 100;
        if (updates.status === 'LOST') deal.probability = 0;
      }

      this.addActivity({
        leadId: id,
        companyName: newLead.companyName,
        userId: updatedBy.id,
        userName: updatedBy.name,
        type: 'STAGE_CHANGE',
        description: `Stage updated from ${oldLead.status} to ${updates.status}.`,
        outcome: `Pipeline stage: ${updates.status}`
      });
    }

    this.persist();
    return newLead;
  }

  deleteLead(id: string, deletedBy: User): boolean {
    const lead = this.getLeadById(id);
    if (!lead) return false;

    this.leads = this.leads.filter(l => l.id !== id);
    this.deals = this.deals.filter(d => d.leadId !== id);

    this.addActivity({
      companyName: lead.companyName,
      userId: deletedBy.id,
      userName: deletedBy.name,
      type: 'NOTE',
      description: `Lead for ${lead.companyName} was archived/deleted by ${deletedBy.name}.`,
      outcome: 'Archived'
    });

    this.persist();
    return true;
  }

  // --- Deal & Pipeline Methods ---
  getDeals() {
    return this.deals;
  }

  updateDealStage(id: string, stage: LeadStatus, updatedBy: User): Deal | null {
    const deal = this.deals.find(d => d.id === id);
    if (!deal) return null;

    const oldStage = deal.stage;
    deal.stage = stage;
    deal.updatedAt = new Date().toISOString();

    const stageProbMap: Record<LeadStatus, number> = {
      NEW: 20,
      CONTACTED: 30,
      QUALIFIED: 45,
      MEETING: 60,
      PROPOSAL: 75,
      NEGOTIATION: 85,
      WON: 100,
      LOST: 0
    };
    deal.probability = stageProbMap[stage] ?? deal.probability;

    // Sync Lead status
    const lead = this.leads.find(l => l.id === deal.leadId);
    if (lead) {
      lead.status = stage;
      lead.conversionProbability = deal.probability;
      if (stage === 'WON') {
        lead.priority = 'HOT';
      }
    }

    // Record in Pipeline History table
    this.pipelineHistory.unshift({
      id: `plh-${Date.now()}`,
      dealId: deal.id,
      leadId: deal.leadId,
      companyName: deal.companyName,
      fromStage: oldStage,
      toStage: stage,
      dealValue: deal.value,
      changedById: updatedBy.id,
      changedByName: updatedBy.name,
      timestamp: new Date().toISOString()
    });

    this.addActivity({
      leadId: deal.leadId,
      companyName: deal.companyName,
      userId: updatedBy.id,
      userName: updatedBy.name,
      type: 'STAGE_CHANGE',
      description: `Deal "${deal.title}" transitioned from ${oldStage} → ${stage}. Deal Value: ₹${(deal.value / 100000).toFixed(1)}L.`,
      outcome: stage === 'WON' ? 'Closed Won Revenue added' : `Moved to ${stage}`
    });

    this.persist();
    return deal;
  }

  // --- Meeting Methods ---
  getMeetings() {
    return this.meetings;
  }

  createMeeting(meetingData: Partial<Meeting>, createdBy: User): Meeting {
    const newId = `meet-${(this.meetings.length + 1).toString().padStart(3, '0')}`;
    const meeting: Meeting = {
      id: newId,
      leadId: meetingData.leadId,
      companyId: meetingData.companyId || 'comp-001',
      companyName: meetingData.companyName || 'Prospect Company',
      contactName: meetingData.contactName || 'Key Contact',
      contactEmail: meetingData.contactEmail || 'contact@client.com',
      date: meetingData.date || new Date().toISOString().split('T')[0],
      time: meetingData.time || '11:00',
      durationMinutes: meetingData.durationMinutes || 45,
      meetingType: meetingData.meetingType || 'Discovery Call',
      attendees: meetingData.attendees || [createdBy.name, meetingData.contactName || 'Client'],
      agenda: meetingData.agenda || 'Discussion on CPaaS requirements and delivery SLAs',
      notes: meetingData.notes,
      status: 'SCHEDULED',
      assignedSalespersonId: createdBy.id,
      assignedSalespersonName: createdBy.name
    };

    this.meetings.unshift(meeting);

    // If associated with a lead, update lead status to MEETING if in earlier stage
    if (meeting.leadId) {
      const lead = this.getLeadById(meeting.leadId);
      if (lead && ['NEW', 'CONTACTED', 'QUALIFIED'].includes(lead.status)) {
        this.updateLead(lead.id, { status: 'MEETING' }, createdBy);
      }
    }

    this.addActivity({
      leadId: meeting.leadId,
      companyName: meeting.companyName,
      userId: createdBy.id,
      userName: createdBy.name,
      type: 'MEETING',
      description: `Scheduled ${meeting.meetingType} on ${meeting.date} at ${meeting.time}. Agenda: ${meeting.agenda.slice(0, 80)}...`,
      outcome: 'Meeting scheduled'
    });

    this.persist();
    return meeting;
  }

  // --- Follow-up Methods ---
  getFollowUps() {
    return this.followups;
  }

  createFollowUp(data: Partial<FollowUp>, createdBy: User): FollowUp {
    const newId = `fu-${(this.followups.length + 1).toString().padStart(3, '0')}`;
    const fu: FollowUp = {
      id: newId,
      leadId: data.leadId || '',
      companyName: data.companyName || '',
      contactName: data.contactName || '',
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      priority: data.priority || 'HIGH',
      actionRequired: data.actionRequired || 'Follow up with client',
      aiReasoning: data.aiReasoning,
      status: 'PENDING',
      assignedSalespersonId: createdBy.id,
      createdAt: new Date().toISOString()
    };
    this.followups.unshift(fu);

    this.addActivity({
      leadId: fu.leadId,
      companyName: fu.companyName,
      userId: createdBy.id,
      userName: createdBy.name,
      type: 'NOTE',
      description: `Created follow-up due on ${fu.dueDate}: "${fu.actionRequired}"`,
      outcome: 'Follow-up created'
    });

    this.persist();
    return fu;
  }

  completeFollowUp(id: string, updatedBy: User): FollowUp | null {
    const fu = this.followups.find(f => f.id === id);
    if (!fu) return null;

    fu.status = 'COMPLETED';
    fu.completedAt = new Date().toISOString();

    this.addActivity({
      leadId: fu.leadId,
      companyName: fu.companyName,
      userId: updatedBy.id,
      userName: updatedBy.name,
      type: 'CALL',
      description: `Completed follow-up action: "${fu.actionRequired}"`,
      outcome: 'Follow-up executed'
    });

    this.persist();
    return fu;
  }

  // --- Communications ---
  getCommunications(leadId?: string) {
    if (leadId) {
      return this.communications.filter(c => c.leadId === leadId);
    }
    return this.communications;
  }

  createCommunication(data: Partial<Communication>, createdBy: User): Communication {
    const newId = `comm-${(this.communications.length + 1).toString().padStart(3, '0')}`;
    const comm: Communication = {
      id: newId,
      leadId: data.leadId || '',
      companyName: data.companyName || '',
      contactName: data.contactName || '',
      channel: data.channel || 'Email',
      direction: 'OUTBOUND',
      status: 'Sent',
      subject: data.subject,
      content: data.content || '',
      timestamp: new Date().toISOString(),
      salespersonName: createdBy.name
    };
    this.communications.unshift(comm);

    this.addActivity({
      leadId: comm.leadId,
      companyName: comm.companyName,
      userId: createdBy.id,
      userName: createdBy.name,
      type: comm.channel === 'Email' ? 'EMAIL' : comm.channel === 'LinkedIn' ? 'LINKEDIN' : comm.channel === 'WhatsApp' ? 'WHATSAPP' : 'CALL',
      description: `Sent ${comm.channel} message to ${comm.contactName} (${comm.companyName}). Content preview: "${comm.content.slice(0, 70)}..."`,
      outcome: 'Dispatched'
    });

    // Also update lead's lastContactedAt
    if (comm.leadId) {
      const lead = this.getLeadById(comm.leadId);
      if (lead) {
        lead.lastContactedAt = comm.timestamp;
      }
    }

    this.persist();
    return comm;
  }

  // --- Real Telephony, Email, Message, Calendar & AI Log Tables ---
  getCallLogs(leadId?: string) {
    if (leadId) return this.callLogs.filter(c => c.leadId === leadId);
    return this.callLogs;
  }

  addCallLog(log: CallLog) {
    this.callLogs.unshift(log);
    this.persist();
    return log;
  }

  updateCallLog(callId: string, updates: Partial<CallLog>) {
    const log = this.callLogs.find(c => c.id === callId || c.providerCallId === callId);
    if (log) {
      Object.assign(log, updates);
      this.persist();
    }
    return log;
  }

  getEmailLogs(leadId?: string) {
    if (leadId) return this.emailLogs.filter(e => e.leadId === leadId);
    return this.emailLogs;
  }

  addEmailLog(log: EmailLog) {
    this.emailLogs.unshift(log);
    this.persist();
    return log;
  }

  getMessageLogs(leadId?: string) {
    if (leadId) return this.messageLogs.filter(m => m.leadId === leadId);
    return this.messageLogs;
  }

  addMessageLog(log: MessageLog) {
    this.messageLogs.unshift(log);
    this.persist();
    return log;
  }

  getCalendarEvents(leadId?: string) {
    if (leadId) return this.calendarEvents.filter(c => c.leadId === leadId);
    return this.calendarEvents;
  }

  addCalendarEvent(event: CalendarEvent) {
    this.calendarEvents.unshift(event);
    this.persist();
    return event;
  }

  getPipelineHistory(dealId?: string) {
    if (dealId) return this.pipelineHistory.filter(p => p.dealId === dealId);
    return this.pipelineHistory;
  }

  addAIInsight(insight: AIInsightItem) {
    this.aiInsights.unshift(insight);
    this.persist();
    return insight;
  }

  getAIInsights(leadId?: string) {
    if (leadId) return this.aiInsights.filter(a => a.leadId === leadId);
    return this.aiInsights;
  }

  // Conversion Trends CSV Export
  getConversionTrendsCsv(): string {
    const data = this.getDashboardData('THIS_MONTH');
    const headers = [
      'Day',
      'Date (Oct 2026)',
      'Baseline Date (Sep 2026)',
      'Oct Conversion Rate (%)',
      'Sep Baseline Rate (%)',
      'Variance Lift (%)',
      'Status',
      'Oct Deals Won',
      'Oct Deals Closed',
      'Sep Deals Won',
      'Sep Deals Closed',
      'Oct Cumulative Rate (%)',
      'Sep Cumulative Rate (%)'
    ];
    const rows = data.dailyConversionTrend.trend.map(t => [
      t.day,
      t.date,
      t.lastMonthDate,
      t.currentMonthRate,
      t.lastMonthRate,
      t.variance,
      t.isProjected ? 'Projected' : 'Actual',
      t.currentWonCount,
      t.currentClosedCount,
      t.lastWonCount,
      t.lastClosedCount,
      t.cumulativeCurrentRate,
      t.cumulativeLastMonthRate
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // --- Activities ---
  getActivities(leadId?: string) {
    if (leadId) {
      return this.activities.filter(a => a.leadId === leadId);
    }
    return this.activities;
  }

  addActivity(data: Omit<Activity, 'id' | 'timestamp'> & { timestamp?: string }): Activity {
    const act: Activity = {
      id: `act-${(this.activities.length + 1).toString().padStart(3, '0')}`,
      timestamp: data.timestamp || new Date().toISOString(),
      ...data
    };
    this.activities.unshift(act);
    return act;
  }

  // --- Dashboard & Analytics Computation ---
  getDashboardData(period: 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'THIS_QUARTER' | 'ALL' = 'THIS_MONTH') {
    const totalLeads = this.leads.length;
    const qualifiedLeads = this.leads.filter(l => ['QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION', 'WON'].includes(l.status)).length;
    const activeDeals = this.deals.filter(d => !['WON', 'LOST'].includes(d.stage));
    const activeOpportunities = activeDeals.length;

    const pipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
    const weightedPipelineValue = activeDeals.reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0);

    const wonDeals = this.deals.filter(d => d.stage === 'WON');
    const wonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);

    const closedDealsCount = this.deals.filter(d => ['WON', 'LOST'].includes(d.stage)).length;
    const conversionRate = closedDealsCount > 0 ? (wonDeals.length / closedDealsCount) * 100 : 18.4;

    const todayStr = new Date().toISOString().split('T')[0];
    const meetingsCount = this.meetings.filter(m => m.date >= todayStr).length;

    const teamTarget = this.targets.find(t => t.userId === 'user-manager') || this.targets[0];
    const targetAchievement = teamTarget ? (teamTarget.achievedRevenue / teamTarget.targetRevenue) * 100 : 62.7;

    // Funnel Data
    const funnel = [
      { stage: 'Total Leads', count: totalLeads, value: this.leads.reduce((s, l) => s + l.estimatedDealValue, 0) },
      { stage: 'Contacted', count: this.leads.filter(l => l.status !== 'NEW').length, value: 38400000 },
      { stage: 'Qualified', count: qualifiedLeads, value: 29500000 },
      { stage: 'Meeting', count: this.leads.filter(l => ['MEETING', 'PROPOSAL', 'NEGOTIATION', 'WON'].includes(l.status)).length, value: 21800000 },
      { stage: 'Proposal', count: this.leads.filter(l => ['PROPOSAL', 'NEGOTIATION', 'WON'].includes(l.status)).length, value: 16400000 },
      { stage: 'Negotiation', count: this.leads.filter(l => ['NEGOTIATION', 'WON'].includes(l.status)).length, value: 11200000 },
      { stage: 'Won', count: wonDeals.length, value: wonRevenue }
    ];

    // Pipeline by Stage
    const stageCounts: Record<string, { count: number; value: number }> = {};
    const stages: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
    stages.forEach(s => { stageCounts[s] = { count: 0, value: 0 }; });

    this.deals.forEach(d => {
      if (stageCounts[d.stage]) {
        stageCounts[d.stage].count += 1;
        stageCounts[d.stage].value += d.value;
      }
    });

    const pipelineByStage = stages.map(stage => ({
      stage,
      count: stageCounts[stage].count,
      value: stageCounts[stage].value,
      valueFormatted: `₹${(stageCounts[stage].value / 100000).toFixed(1)}L`
    }));

    // Leads by Industry
    const industryMap: Record<string, number> = {};
    this.leads.forEach(l => {
      industryMap[l.industry] = (industryMap[l.industry] || 0) + 1;
    });
    const leadsByIndustry = Object.keys(industryMap).map(ind => ({
      industry: ind,
      count: industryMap[ind]
    }));

    // Lead Source Performance
    const sourceMap: Record<string, { total: number; won: number; value: number }> = {};
    this.leads.forEach(l => {
      if (!sourceMap[l.leadSource]) sourceMap[l.leadSource] = { total: 0, won: 0, value: 0 };
      sourceMap[l.leadSource].total += 1;
      if (l.status === 'WON') {
        sourceMap[l.leadSource].won += 1;
        sourceMap[l.leadSource].value += l.estimatedDealValue;
      }
    });
    const leadSourcePerformance = Object.keys(sourceMap).map(src => ({
      source: src,
      total: sourceMap[src].total,
      won: sourceMap[src].won,
      conversionRate: sourceMap[src].total > 0 ? ((sourceMap[src].won / sourceMap[src].total) * 100).toFixed(1) : '0',
      revenue: sourceMap[src].value
    }));

    // Salesperson Performance
    const spMap: Record<string, { name: number; wonRev: number; activeDeals: number; qualified: number; nameStr: string }> = {};
    this.leads.forEach(l => {
      const spId = l.assignedSalespersonId;
      if (!spMap[spId]) spMap[spId] = { name: 0, wonRev: 0, activeDeals: 0, qualified: 0, nameStr: l.assignedSalespersonName };
      if (l.status === 'WON') spMap[spId].wonRev += l.estimatedDealValue;
      if (!['WON', 'LOST'].includes(l.status)) spMap[spId].activeDeals += 1;
      if (['QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION'].includes(l.status)) spMap[spId].qualified += 1;
    });

    const salespersonPerformance = Object.keys(spMap).map(spId => ({
      id: spId,
      name: spMap[spId].nameStr,
      wonRevenue: spMap[spId].wonRev,
      activeDeals: spMap[spId].activeDeals,
      qualifiedLeads: spMap[spId].qualified
    }));

    // Monthly revenue trend (last 6 months)
    const revenueTrend = [
      { month: 'May 2026', target: 2500000, revenue: 2150000, wonDeals: 7 },
      { month: 'Jun 2026', target: 2800000, revenue: 2700000, wonDeals: 9 },
      { month: 'Jul 2026', target: 3000000, revenue: 2950000, wonDeals: 11 },
      { month: 'Aug 2026', target: 3200000, revenue: 3400000, wonDeals: 13 },
      { month: 'Sep 2026', target: 3500000, revenue: 3100000, wonDeals: 12 },
      { month: 'Oct 2026 (MTD)', target: 3500000, revenue: 2280000, wonDeals: 16 }
    ];

    // Daily Lead Conversion Rate Trend (Current Month vs Last Month)
    const daysInMonth = 30;
    const currentDayOfMonth = 6; // Current local day in October 2026
    const baseSeptemberRates = [
      15.2, 16.0, 15.8, 17.4, 18.2, 16.9, 15.5, 17.0, 18.5, 19.1,
      17.8, 16.4, 17.2, 18.0, 17.5, 16.8, 18.4, 17.9, 16.5, 17.8,
      18.9, 17.3, 16.7, 18.1, 19.4, 18.0, 17.2, 16.9, 18.6, 17.4
    ];
    const baseOctoberRates = [
      18.4, 20.1, 19.5, 24.2, 22.8, 23.5, 21.0, 22.4, 25.1, 23.8,
      22.0, 21.5, 24.0, 23.2, 22.6, 21.9, 23.4, 24.5, 22.1, 23.8,
      24.9, 23.1, 22.7, 24.0, 25.5, 24.1, 23.0, 22.8, 24.6, 23.5
    ];

    let cumCurrentWon = 0;
    let cumCurrentClosed = 0;
    let cumLastWon = 0;
    let cumLastClosed = 0;

    const dailyConversionTrend = Array.from({ length: daysInMonth }, (_, idx) => {
      const dayNum = idx + 1;
      const dayLabel = `Day ${dayNum.toString().padStart(2, '0')}`;
      const dateLabel = `Oct ${dayNum.toString().padStart(2, '0')}`;
      const lastMonthDateLabel = `Sep ${dayNum.toString().padStart(2, '0')}`;

      const lastRate = baseSeptemberRates[idx];
      const currRate = baseOctoberRates[idx];

      const lastClosed = 4 + (idx % 3);
      const lastWon = Math.round((lastClosed * lastRate) / 100) || 1;
      cumLastWon += lastWon;
      cumLastClosed += lastClosed;

      const isActual = dayNum <= currentDayOfMonth;
      const currClosed = 5 + ((idx * 2) % 4);
      const currWon = Math.round((currClosed * currRate) / 100) || 1;
      if (isActual) {
        cumCurrentWon += currWon;
        cumCurrentClosed += currClosed;
      }

      const variance = Number((currRate - lastRate).toFixed(1));

      return {
        day: dayLabel,
        date: dateLabel,
        lastMonthDate: lastMonthDateLabel,
        dayNumber: dayNum,
        currentMonthRate: currRate,
        lastMonthRate: lastRate,
        variance,
        isProjected: !isActual,
        currentWonCount: currWon,
        currentClosedCount: currClosed,
        lastWonCount: lastWon,
        lastClosedCount: lastClosed,
        cumulativeCurrentRate: isActual
          ? Number(((cumCurrentWon / cumCurrentClosed) * 100).toFixed(1))
          : Number(currRate.toFixed(1)),
        cumulativeLastMonthRate: Number(((cumLastWon / cumLastClosed) * 100).toFixed(1))
      };
    });

    const mtdOctSlice = dailyConversionTrend.filter(d => !d.isProjected);
    const currentMonthAvg = Number(
      (mtdOctSlice.reduce((s, d) => s + d.currentMonthRate, 0) / mtdOctSlice.length).toFixed(1)
    );
    const lastMonthAvg = Number(
      (baseSeptemberRates.slice(0, currentDayOfMonth).reduce((s, r) => s + r, 0) / currentDayOfMonth).toFixed(1)
    );
    const liftPct = Number((currentMonthAvg - lastMonthAvg).toFixed(1));

    return {
      kpis: {
        totalLeads,
        qualifiedLeads,
        activeOpportunities,
        meetingsCount,
        pipelineValue,
        pipelineValueFormatted: `₹${(pipelineValue / 100000).toFixed(1)}L`,
        weightedPipelineValue,
        weightedPipelineValueFormatted: `₹${(weightedPipelineValue / 100000).toFixed(1)}L`,
        wonRevenue,
        wonRevenueFormatted: `₹${(wonRevenue / 100000).toFixed(1)}L`,
        conversionRate: Number(conversionRate.toFixed(1)),
        targetAchievement: Number(targetAchievement.toFixed(1))
      },
      funnel,
      pipelineByStage,
      leadsByIndustry,
      leadSourcePerformance,
      salespersonPerformance,
      revenueTrend,
      dailyConversionTrend: {
        trend: dailyConversionTrend,
        summary: {
          currentMonthAvg,
          lastMonthAvg,
          liftPct,
          liftRelativePct: Number(((liftPct / lastMonthAvg) * 100).toFixed(1)),
          bestDay: 'Oct 04 (24.2%)',
          worstDay: 'Oct 01 (18.4%)',
          momentum: 'ACCELERATING',
          insight: `Current month lead conversion rate is averaging ${currentMonthAvg}%, outpacing September (${lastMonthAvg}%) by +${liftPct}% (+${Number(((liftPct / lastMonthAvg) * 100).toFixed(1))}% relative lift). Highest velocity occurs mid-week following technical discovery demos.`
        }
      }
    };
  }

  // --- Global Search ---
  globalSearch(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return { leads: [], companies: [], contacts: [], deals: [], activities: [] };

    const matchingLeads = this.leads
      .filter(l => l.companyName.toLowerCase().includes(q) || l.contactName.toLowerCase().includes(q) || l.businessRequirement.toLowerCase().includes(q))
      .slice(0, 5);

    const matchingCompanies = this.companies
      .filter(c => c.name.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q))
      .slice(0, 5);

    const matchingContacts = this.contacts
      .filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.designation.toLowerCase().includes(q))
      .slice(0, 5);

    const matchingDeals = this.deals
      .filter(d => d.title.toLowerCase().includes(q) || d.companyName.toLowerCase().includes(q))
      .slice(0, 5);

    const matchingActivities = this.activities
      .filter(a => a.description.toLowerCase().includes(q) || a.companyName.toLowerCase().includes(q))
      .slice(0, 5);

    return {
      leads: matchingLeads,
      companies: matchingCompanies,
      contacts: matchingContacts,
      deals: matchingDeals,
      activities: matchingActivities
    };
  }
}

export const db = new DataStore();
