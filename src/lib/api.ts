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
  RequirementAnalysisResult,
  LeadScoringResult,
  SolutionRecommendation,
  MLModelMetrics,
  SalesForecast
} from '../types/index.js';
import { MLPredictionResult } from '../../server/services/mlService.js';

class ApiClient {
  private currentUserId: string = 'user-sales';

  setCurrentUserId(id: string) {
    this.currentUserId = id;
  }

  getCurrentUserId(): string {
    return this.currentUserId;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      'x-user-id': this.currentUserId,
      ...(options.headers || {})
    };

    const res = await fetch(endpoint, {
      ...options,
      headers
    });

    if (!res.ok) {
      let errorMsg = `API Error ${res.status}: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData.message) errorMsg = errorData.message;
      } catch {
        // ignore json parse error
      }
      throw new Error(errorMsg);
    }

    return res.json() as Promise<T>;
  }

  // Auth
  async login(email: string): Promise<{ success: boolean; user: User }> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async getMe(): Promise<{ user: User }> {
    return this.request('/api/auth/me');
  }

  async switchRole(role: 'ADMIN' | 'SALES_MANAGER' | 'SALES_EXECUTIVE'): Promise<{ success: boolean; user: User }> {
    return this.request('/api/auth/demo-switch', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
  }

  async getUsers(): Promise<User[]> {
    return this.request('/api/users');
  }

  // Leads
  async getLeads(params: {
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
  } = {}): Promise<{ total: number; leads: Lead[] }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') query.append(k, String(v));
    });
    return this.request(`/api/leads?${query.toString()}`);
  }

  async getLeadById(id: string): Promise<{
    lead: Lead;
    communications: Communication[];
    meetings: Meeting[];
    deals: Deal[];
    activities: Activity[];
    followups: FollowUp[];
    mlPrediction: MLPredictionResult;
  }> {
    return this.request(`/api/leads/${id}`);
  }

  async createLead(data: Partial<Lead>): Promise<Lead> {
    return this.request('/api/leads', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
    return this.request(`/api/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteLead(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/leads/${id}`, {
      method: 'DELETE'
    });
  }

  async importLeads(leads: Partial<Lead>[]): Promise<{ success: boolean; count: number }> {
    return this.request('/api/leads/import', {
      method: 'POST',
      body: JSON.stringify({ leads })
    });
  }

  // Companies & Contacts
  async getCompanies(): Promise<Company[]> {
    return this.request('/api/companies');
  }

  async getCompanyById(id: string): Promise<{
    company: Company;
    contacts: Contact[];
    leads: Lead[];
    deals: Deal[];
    meetings: Meeting[];
    activities: Activity[];
  }> {
    return this.request(`/api/companies/${id}`);
  }

  async getContacts(): Promise<Contact[]> {
    return this.request('/api/contacts');
  }

  // Pipeline & Deals
  async getPipeline(): Promise<{
    columns: { stage: string; deals: Deal[]; count: number; totalValue: number; totalValueFormatted: string }[];
    totalPipeline: number;
    totalPipelineFormatted: string;
    weightedPipeline: number;
    weightedPipelineFormatted: string;
  }> {
    return this.request('/api/pipeline');
  }

  async getDeals(): Promise<Deal[]> {
    return this.request('/api/deals');
  }

  async updateDealStage(id: string, stage: string): Promise<Deal> {
    return this.request(`/api/deals/${id}/stage`, {
      method: 'PUT',
      body: JSON.stringify({ stage })
    });
  }

  // Meetings
  async getMeetings(): Promise<Meeting[]> {
    return this.request('/api/meetings');
  }

  async createMeeting(data: Partial<Meeting>): Promise<Meeting> {
    return this.request('/api/meetings', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Follow-ups
  async getFollowUps(): Promise<FollowUp[]> {
    return this.request('/api/followups');
  }

  async createFollowUp(data: Partial<FollowUp>): Promise<FollowUp> {
    return this.request('/api/followups', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async completeFollowUp(id: string): Promise<FollowUp> {
    return this.request(`/api/followups/${id}/complete`, {
      method: 'PUT'
    });
  }

  // Communications & Activities
  async getCommunications(leadId?: string): Promise<Communication[]> {
    const q = leadId ? `?leadId=${leadId}` : '';
    return this.request(`/api/communications${q}`);
  }

  async createCommunication(data: Partial<Communication>): Promise<Communication> {
    return this.request('/api/communications', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getActivities(leadId?: string): Promise<Activity[]> {
    const q = leadId ? `?leadId=${leadId}` : '';
    return this.request(`/api/activities${q}`);
  }

  // Solutions Catalog
  async getSolutions(): Promise<Solution[]> {
    return this.request('/api/solutions');
  }

  // Targets
  async getTargets(): Promise<SalesTarget[]> {
    return this.request('/api/targets');
  }

  async updateTarget(id: string, updates: Partial<SalesTarget>): Promise<SalesTarget> {
    return this.request(`/api/targets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // Dashboard & Analytics
  async getDashboard(period: string = 'THIS_MONTH'): Promise<any> {
    return this.request(`/api/dashboard?period=${period}`);
  }

  async getAnalytics(): Promise<any> {
    return this.request('/api/analytics');
  }

  // AI Modules
  async analyzeRequirement(requirementText: string): Promise<RequirementAnalysisResult> {
    return this.request('/api/ai/analyze-requirement', {
      method: 'POST',
      body: JSON.stringify({ requirementText })
    });
  }

  async scoreLead(leadData: Partial<Lead>): Promise<LeadScoringResult> {
    return this.request('/api/ai/score-lead', {
      method: 'POST',
      body: JSON.stringify(leadData)
    });
  }

  async recommendSolutions(requirement: string, lead?: Lead): Promise<{ recommendations: SolutionRecommendation[] }> {
    return this.request('/api/ai/recommend-solution', {
      method: 'POST',
      body: JSON.stringify({ requirement, lead })
    });
  }

  async generateSalesPitch(params: {
    company: string;
    industry: string;
    requirement: string;
    painPoints?: string[];
    recommendedSolution: string;
    contactName: string;
    salespersonName: string;
    channel: string;
    tone: string;
  }): Promise<{ subject?: string; content: string }> {
    return this.request('/api/ai/generate-pitch', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  async getDailySalesAssistant(): Promise<{
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
  }> {
    return this.request('/api/ai/sales-assistant');
  }

  async getSalesForecast(): Promise<SalesForecast> {
    return this.request('/api/ai/forecast-sales');
  }

  // ML Module
  async getMLMetrics(): Promise<MLModelMetrics> {
    return this.request('/api/ml/metrics');
  }

  async predictConversion(lead: Lead, interactionsCount: number = 3, meetingsCount: number = 1): Promise<MLPredictionResult> {
    return this.request('/api/ml/predict-conversion', {
      method: 'POST',
      body: JSON.stringify({ lead, interactionsCount, meetingsCount })
    });
  }

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    return this.request('/api/notifications');
  }

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/notifications/${id}/read`, {
      method: 'PUT'
    });
  }

  async markAllNotificationsRead(): Promise<{ success: boolean }> {
    return this.request('/api/notifications/read-all', {
      method: 'POST'
    });
  }

  // Search
  async search(q: string): Promise<any> {
    return this.request(`/api/search?q=${encodeURIComponent(q)}`);
  }

  // Demo Reset
  async resetDemo(): Promise<{ success: boolean; message: string }> {
    return this.request('/api/reset-demo', {
      method: 'POST'
    });
  }

  // Run Integration Tests
  async runTests(): Promise<any> {
    return this.request('/api/tests/run');
  }
}

export const api = new ApiClient();
