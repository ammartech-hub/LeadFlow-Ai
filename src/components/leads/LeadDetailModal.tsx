import React, { useEffect, useState } from 'react';
import {
  X,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Send,
  Plus,
  MessageSquare,
  Flame,
  CheckCircle2,
  ExternalLink,
  BrainCircuit
} from 'lucide-react';
import { Lead, LeadStatus, LeadPriority } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useApp } from '../../context/AppContext.js';

interface LeadDetailModalProps {
  leadId: string;
  onClose: () => void;
  onOpenPitchGenerator: (lead: Lead) => void;
  onOpenRequirementAnalyzer: (initialText: string) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  leadId,
  onClose,
  onOpenPitchGenerator,
  onOpenRequirementAnalyzer
}) => {
  const { showToast } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'AI_INSIGHTS' | 'SOLUTIONS' | 'TIMELINE' | 'MEETINGS' | 'DEALS'>('OVERVIEW');
  const [newNote, setNewNote] = useState('');

  // Quick action states
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [followUpAction, setFollowUpAction] = useState('Call to review revised SLA terms');
  const [followUpDate, setFollowUpDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);

  // Quick message state
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageChannel, setMessageChannel] = useState<'Email' | 'LinkedIn' | 'WhatsApp' | 'Call'>('WhatsApp');
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const res = await api.getLeadById(leadId);
        setData(res);
      } catch (err: any) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [leadId]);

  if (loading || !data) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="w-full max-w-4xl p-8 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse text-center">
          <div className="h-6 w-48 bg-slate-800 rounded mx-auto mb-4" />
          <div className="h-4 w-72 bg-slate-800/60 rounded mx-auto" />
        </div>
      </div>
    );
  }

  const { lead, communications, meetings, deals, activities, followups, mlPrediction } = data;

  const handleStageChange = async (newStage: LeadStatus) => {
    try {
      const updated = await api.updateLead(lead.id, { status: newStage });
      setData((prev: any) => ({ ...prev, lead: updated }));
      showToast(`Lead status updated to ${newStage}`, 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleCreateFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fu = await api.createFollowUp({
        leadId: lead.id,
        companyName: lead.companyName,
        contactName: lead.contactName,
        actionRequired: followUpAction,
        dueDate: followUpDate,
        priority: 'HIGH'
      });
      setData((prev: any) => ({ ...prev, followups: [fu, ...prev.followups] }));
      setShowFollowUpForm(false);
      showToast('Follow-up scheduled successfully', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleSendSimulatedMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;
    try {
      const comm = await api.createCommunication({
        leadId: lead.id,
        companyName: lead.companyName,
        contactName: lead.contactName,
        channel: messageChannel,
        content: messageContent
      });
      setData((prev: any) => ({
        ...prev,
        communications: [comm, ...prev.communications]
      }));
      setMessageContent('');
      setShowMessageForm(false);
      showToast(`Simulated ${messageChannel} outreach logged`, 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const getPriorityBadge = (prio: LeadPriority) => {
    switch (prio) {
      case 'HOT':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'WARM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'COLD':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl my-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white tracking-tight">{lead.companyName}</h2>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getPriorityBadge(lead.priority)}`}>
                {lead.priority} PRIORITY
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Score: {lead.leadScore}/100
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>{lead.industry}</span>
              <span>•</span>
              <span>{lead.companySize}</span>
              <span>•</span>
              <span>{lead.location}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Pitch Button */}
            <button
              onClick={() => onOpenPitchGenerator(lead)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Pitch</span>
            </button>

            {/* Stage Selector */}
            <select
              value={lead.status}
              onChange={(e) => handleStageChange(e.target.value as LeadStatus)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none"
            >
              {['NEW', 'CONTACTED', 'QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'].map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-800 bg-slate-900/50 text-xs">
          {[
            { id: 'OVERVIEW', label: 'Company & Requirement' },
            { id: 'AI_INSIGHTS', label: 'AI Intelligence & ML' },
            { id: 'SOLUTIONS', label: 'CPaaS Solutions Match' },
            { id: 'TIMELINE', label: `Outreach & Activity (${communications.length + activities.length})` },
            { id: 'MEETINGS', label: `Meetings (${meetings.length})` },
            { id: 'DEALS', label: `Deals & Value (${deals.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Quick Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400 mb-1">Deal Value</div>
                  <div className="text-lg font-bold text-white">
                    ₹{(lead.estimatedDealValue / 100000).toFixed(1)}L
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400 mb-1">Conversion Prob</div>
                  <div className="text-lg font-bold text-emerald-400">
                    {lead.conversionProbability}%
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400 mb-1">Assigned Rep</div>
                  <div className="text-sm font-bold text-slate-200 truncate">
                    {lead.assignedSalespersonName}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400 mb-1">Lead Source</div>
                  <div className="text-sm font-bold text-slate-200">
                    {lead.leadSource}
                  </div>
                </div>
              </div>

              {/* Business Requirement Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-200 text-xs">Business Requirement / Client Brief</span>
                  <button
                    onClick={() => onOpenRequirementAnalyzer(lead.businessRequirement)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Requirement Studio</span>
                  </button>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800/80">
                  "{lead.businessRequirement}"
                </p>
              </div>

              {/* Two Column Info: Contact & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                  <div className="font-bold text-slate-200 mb-2">Primary Decision Maker</div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="font-semibold text-white">{lead.contactName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <a href={`mailto:${lead.email}`} className="text-indigo-400 hover:underline">{lead.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setShowMessageForm(!showMessageForm)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Log Quick Communication</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                  <div className="font-bold text-slate-200 mb-2">Account Overview</div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{lead.companyName} ({lead.industry})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{lead.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <a href={lead.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1">
                      <span>{lead.website}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setShowFollowUpForm(!showFollowUpForm)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Schedule Follow-up</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Log Quick Communication Form */}
              {showMessageForm && (
                <form onSubmit={handleSendSimulatedMessage} className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-300">Log Outreach Interaction</span>
                    <span className="text-[10px] text-slate-400">Simulated Dispatch Tracking</span>
                  </div>
                  <div className="flex gap-2">
                    {['Email', 'LinkedIn', 'WhatsApp', 'Call'].map(ch => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setMessageChannel(ch as any)}
                        className={`px-2.5 py-1 rounded text-xs font-medium border ${
                          messageChannel === ch ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder={`Enter message text or call summary for ${lead.contactName}...`}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowMessageForm(false)}
                      className="px-3 py-1 rounded text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                    >
                      Record Dispatch
                    </button>
                  </div>
                </form>
              )}

              {/* Schedule Follow-up Form */}
              {showFollowUpForm && (
                <form onSubmit={handleCreateFollowUp} className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/50 space-y-3">
                  <div className="font-bold text-emerald-300">Set Next Sales Action</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px]">Action Required</label>
                      <input
                        type="text"
                        value={followUpAction}
                        onChange={(e) => setFollowUpAction(e.target.value)}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px]">Due Date</label>
                      <input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowFollowUpForm(false)}
                      className="px-3 py-1 rounded text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                    >
                      Save Follow-up
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: AI INSIGHTS & ML */}
          {activeTab === 'AI_INSIGHTS' && (
            <div className="space-y-6">
              {/* Lead Scoring Breakdown */}
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-rose-400" />
                    <h3 className="text-sm font-bold text-white">AI Lead Score Analysis</h3>
                  </div>
                  <span className="text-base font-bold font-mono text-white bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                    {lead.leadScore} / 100
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                    <div className="text-slate-400 text-[11px] mb-1">Deal Size & Vertical Fit</div>
                    <p className="text-slate-200 leading-relaxed text-xs">
                      {lead.industry} enterprise requiring high-throughput communication infrastructure. Deal value ₹{(lead.estimatedDealValue / 100000).toFixed(1)}L.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                    <div className="text-slate-400 text-[11px] mb-1">Recommended AE Action</div>
                    <p className="text-emerald-300 font-medium text-xs">
                      Contact prospect within 24 hours to schedule discovery meeting and benchmark carrier delivery SLAs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Machine Learning Conversion Prediction */}
              {mlPrediction && (
                <div className="p-5 rounded-xl bg-slate-950/80 border border-cyan-900/40">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-sm font-bold text-white">ML Conversion Probability Engine</h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded font-bold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {mlPrediction.predictedConversionProbability}% Win Probability
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Risk Assessment</span>
                      <span className={`font-bold ${mlPrediction.riskLevel === 'LOW' ? 'text-emerald-400' : mlPrediction.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'}`}>
                        {mlPrediction.riskLevel} CHURN RISK
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                        style={{ width: `${mlPrediction.predictedConversionProbability}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Predictive Feature Weights</div>
                    {mlPrediction.featureWeights.map((fw: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${fw.impact === 'POSITIVE' ? 'bg-emerald-400' : fw.impact === 'NEGATIVE' ? 'bg-rose-400' : 'bg-slate-400'}`} />
                          <span className="text-slate-200">{fw.feature}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[11px]">{fw.contributionPct}% weight</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 text-xs flex items-center justify-between">
                    <span><strong>ML Recommended Strategy:</strong> {mlPrediction.recommendedAction}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CPaaS SOLUTIONS */}
          {activeTab === 'SOLUTIONS' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Recommended B2B Communication / CPaaS products matched against client requirements:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">OTP Messaging</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      94% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Direct telecom carrier routes with sub-5s delivery SLA for critical sign-in 2FA and transaction verification.
                  </p>
                  <div className="text-[11px] text-indigo-300 font-medium">
                    Expected Benefit: 99.8% verification completion rate, eliminating cart abandonment drop-offs.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">WhatsApp Business Communication</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      91% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Meta-verified WhatsApp API for rich interactive order notifications, live location sharing, and delivery updates.
                  </p>
                  <div className="text-[11px] text-indigo-300 font-medium">
                    Expected Benefit: 98% open rates and 5x higher customer engagement compared to email.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">SMS API</span>
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      88% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    High-volume carrier-grade bulk transactional and marketing SMS gateway with DLT compliance.
                  </p>
                  <div className="text-[11px] text-slate-300">
                    Expected Benefit: Reliable failover routing and full delivery reports (DLR).
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">Transactional Messaging</span>
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      87% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Event-driven notification infrastructure for invoices, billing dispatches, and status milestones.
                  </p>
                  <div className="text-[11px] text-slate-300">
                    Expected Benefit: Reduces incoming customer support status tickets by 40%.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OUTREACH & TIMELINE */}
          {activeTab === 'TIMELINE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Communication & Activity Audit Trail</span>
                <span className="text-[10px] text-slate-500">Chronological timestamped events</span>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {communications.map((comm: any) => (
                  <div key={comm.id} className="relative">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900" />
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-200">
                          {comm.channel} ({comm.status})
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(comm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(comm.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {comm.subject && <div className="text-xs font-medium text-indigo-400 mb-1">{comm.subject}</div>}
                      <p className="text-xs text-slate-300">{comm.content}</p>
                    </div>
                  </div>
                ))}

                {activities.map((act: any) => (
                  <div key={act.id} className="relative">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-slate-600 border-2 border-slate-900" />
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-300">{act.type} Logged by {act.userName}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(act.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MEETINGS */}
          {activeTab === 'MEETINGS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Scheduled Discovery & Demo Calls</span>
                <span className="text-[11px] text-indigo-400 font-semibold">{meetings.length} Scheduled</span>
              </div>

              {meetings.length === 0 ? (
                <div className="p-6 text-center text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                  No meetings currently scheduled for this lead.
                </div>
              ) : (
                <div className="space-y-3">
                  {meetings.map((m: any) => (
                    <div key={m.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-sm">{m.meetingType}</span>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {m.date} at {m.time}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 mb-2">
                        <strong>Agenda:</strong> {m.agenda}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Attendees: {m.attendees.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: DEALS */}
          {activeTab === 'DEALS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Pipeline Opportunity</span>
                <span className="text-xs font-bold text-emerald-400">₹{(lead.estimatedDealValue / 100000).toFixed(1)}L Total Value</span>
              </div>

              {deals.map((d: any) => (
                <div key={d.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">{d.title}</span>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {d.stage}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div>Value: <strong className="text-white">₹{(d.value / 100000).toFixed(1)}L</strong></div>
                    <div>Win Probability: <strong className="text-emerald-400">{d.probability}%</strong></div>
                    <div>Expected Close: <strong className="text-slate-300">{d.expectedCloseDate}</strong></div>
                    <div>Weighted Value: <strong className="text-cyan-400">₹{((d.value * d.probability / 100) / 100000).toFixed(1)}L</strong></div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Products: {d.solutions.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
