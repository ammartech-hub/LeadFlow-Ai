// LeadFlow AI - Domain Types

export type UserRole = 'ADMIN' | 'SALES_MANAGER' | 'SALES_EXECUTIVE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  title: string;
  monthlyTarget: number;
}

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'MEETING'
  | 'PROPOSAL'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

export type LeadPriority = 'HOT' | 'WARM' | 'COLD' | 'LOW';

export type LeadSource =
  | 'LinkedIn'
  | 'Website'
  | 'Referral'
  | 'Cold Email'
  | 'Event'
  | 'Inbound'
  | 'Advertisement'
  | 'Partner'
  | 'Other';

export type Industry =
  | 'Banking'
  | 'Fintech'
  | 'E-commerce'
  | 'Healthcare'
  | 'EdTech'
  | 'SaaS'
  | 'Logistics'
  | 'Retail'
  | 'Telecom'
  | 'Real Estate';

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: Industry;
  size: string; // e.g. "50-200 employees", "1000+ employees"
  location: string;
  website: string;
  description?: string;
  annualRevenueRange?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  linkedInUrl?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  companyId: string;
  companyName: string;
  contactId: string;
  contactName: string;
  email: string;
  phone: string;
  industry: Industry;
  companySize: string;
  location: string;
  website: string;
  leadSource: LeadSource;
  businessRequirement: string;
  estimatedDealValue: number; // in INR e.g. 500000 = 5 Lakhs
  leadScore: number; // 0 - 100
  conversionProbability: number; // 0 - 100%
  priority: LeadPriority;
  status: LeadStatus;
  assignedSalespersonId: string;
  assignedSalespersonName: string;
  createdAt: string;
  lastContactedAt?: string;
  nextFollowUpDate?: string;
  notes?: string;
  aiRequirementAnalysis?: RequirementAnalysisResult;
  recommendedSolutionIds?: string[];
}

export interface Deal {
  id: string;
  leadId: string;
  companyId: string;
  companyName: string;
  contactId: string;
  contactName: string;
  title: string;
  value: number; // in INR
  stage: LeadStatus;
  probability: number; // 0 - 100%
  expectedCloseDate: string;
  assignedSalespersonId: string;
  assignedSalespersonName: string;
  solutions: string[]; // Solution IDs or Names
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type MeetingType =
  | 'Discovery Call'
  | 'Product Demo'
  | 'Technical Discussion'
  | 'Pricing Discussion'
  | 'Negotiation'
  | 'Follow-up';

export interface Meeting {
  id: string;
  leadId?: string;
  companyId: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  meetingType: MeetingType;
  attendees: string[];
  agenda: string;
  notes?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  assignedSalespersonId: string;
  assignedSalespersonName: string;
}

export type FollowUpPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface FollowUp {
  id: string;
  leadId: string;
  companyName: string;
  contactName: string;
  dueDate: string; // YYYY-MM-DD
  priority: FollowUpPriority;
  actionRequired: string;
  aiReasoning?: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  assignedSalespersonId: string;
  createdAt: string;
  completedAt?: string;
}

export type CommunicationChannel = 'Email' | 'LinkedIn' | 'WhatsApp' | 'Call' | 'SMS';
export type CommunicationStatus = 'Draft' | 'Sent' | 'Delivered' | 'Opened' | 'Replied' | 'No Response';

export interface Communication {
  id: string;
  leadId: string;
  companyName: string;
  contactName: string;
  channel: CommunicationChannel;
  direction: 'OUTBOUND' | 'INBOUND';
  status: CommunicationStatus;
  subject?: string;
  content: string;
  timestamp: string;
  salespersonName: string;
}

export interface Activity {
  id: string;
  leadId?: string;
  companyName: string;
  userId: string;
  userName: string;
  type: 'CALL' | 'EMAIL' | 'LINKEDIN' | 'WHATSAPP' | 'MEETING' | 'NOTE' | 'STAGE_CHANGE' | 'PROPOSAL' | 'CREATED';
  description: string;
  outcome?: string;
  timestamp: string;
}

export interface Solution {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  useCases: string[];
  targetIndustries: Industry[];
  customerProfile: string;
  pricingModel: string;
  benefits: string[];
}

export interface SolutionRecommendation {
  solutionId: string;
  solutionName: string;
  matchScore: number; // 0 - 100%
  businessReason: string;
  expectedBenefit: string;
  suggestedPitch: string;
  nextAction: string;
}

export interface RequirementAnalysisResult {
  industry: string;
  businessType: string;
  businessProblem: string;
  painPoints: string[];
  communicationRequirements: string[];
  requiredChannels: string[];
  estimatedCommunicationVolume: 'Low (<10k/mo)' | 'Medium (10k-100k/mo)' | 'High (100k-1M/mo)' | 'Enterprise (>1M/mo)';
  urgency: 'Immediate (<2 weeks)' | 'High (1 month)' | 'Moderate (1-3 months)' | 'Low';
  buyingIntent: 'Very High' | 'High' | 'Medium' | 'Exploratory';
  potentialUseCases: string[];
  recommendedNextAction: string;
  summary: string;
}

export interface LeadScoringResult {
  score: number; // 0-100
  priority: LeadPriority;
  conversionProbability: number;
  factors: {
    name: string;
    score: number;
    weight: number;
    description: string;
  }[];
  reasoning: string[];
  recommendedAction: string;
}

export interface SalesTarget {
  id: string;
  userId: string;
  userName: string;
  period: string; // e.g. "October 2026"
  targetRevenue: number;
  achievedRevenue: number;
  targetDeals: number;
  achievedDeals: number;
  targetQualifiedLeads: number;
  achievedQualifiedLeads: number;
  targetMeetings: number;
  achievedMeetings: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'FOLLOW_UP' | 'MEETING' | 'LEAD' | 'DEAL' | 'SYSTEM' | 'TARGET';
  priority: 'HIGH' | 'NORMAL';
  createdAt: string;
  read: boolean;
  leadId?: string;
}

export interface MLModelMetrics {
  algorithm: string;
  datasetSize: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  featureImportance: {
    feature: string;
    importance: number;
  }[];
  trainedOnSyntheticData: boolean;
  disclaimer: string;
}

export interface SalesForecast {
  targetRevenue: number;
  currentPipelineValue: number;
  weightedPipelineValue: number;
  expectedRevenue: number;
  achievementProbability: number;
  pipelineGap: number;
  expectedDealsCount: number;
  averageSalesCycleDays: number;
  recommendedAction: string;
  executiveSummary: string;
}
