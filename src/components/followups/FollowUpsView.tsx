import React, { useEffect, useState } from 'react';
import { ClockAlert, CheckCircle2, AlertTriangle, Flame, ArrowRight, Check, Plus, X } from 'lucide-react';
import { FollowUp, FollowUpPriority } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useApp } from '../../context/AppContext.js';

export const FollowUpsView: React.FC = () => {
  const { showToast, triggerOpenLead, setCurrentView } = useApp();
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchFollowUps = async () => {
    setLoading(true);
    try {
      const data = await api.getFollowUps();
      setFollowups(data);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const handleComplete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.completeFollowUp(id);
      showToast('Follow-up marked completed', 'success');
      fetchFollowUps();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const overdueList = followups.filter(f => f.status === 'OVERDUE' || (f.status === 'PENDING' && f.dueDate < todayStr));
  const todayList = followups.filter(f => f.status === 'PENDING' && f.dueDate === todayStr);
  const upcomingList = followups.filter(f => f.status === 'PENDING' && f.dueDate > todayStr);
  const completedList = followups.filter(f => f.status === 'COMPLETED');

  const renderCard = (fu: FollowUp) => (
    <div
      key={fu.id}
      onClick={() => { if (fu.leadId) triggerOpenLead(fu.leadId); }}
      className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all shadow-md space-y-2.5 group"
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-white text-xs group-hover:text-indigo-300 transition-colors">
          {fu.companyName}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          fu.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
          fu.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
          'bg-blue-500/20 text-blue-300 border-blue-500/30'
        }`}>
          {fu.priority} PRIORITY
        </span>
      </div>

      <div className="text-xs text-slate-300 font-medium">
        Contact: {fu.contactName}
      </div>

      <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
        <strong>Action:</strong> {fu.actionRequired}
      </p>

      {fu.aiReasoning && (
        <p className="text-[11px] text-indigo-300 italic">
          💡 {fu.aiReasoning}
        </p>
      )}

      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
        <span className="text-slate-400 font-mono">Due: {fu.dueDate}</span>
        {fu.status !== 'COMPLETED' ? (
          <button
            onClick={(e) => handleComplete(fu.id, e)}
            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-semibold transition-colors flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Complete</span>
          </button>
        ) : (
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>AI Follow-up Engine</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            Zero Dropped Leads
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Every active B2B prospect must have a defined next step. Priority scored by deal probability and last contact cadence.
        </p>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/40">
          <div className="text-slate-400 text-xs font-semibold mb-1">Overdue Follow-ups</div>
          <div className="text-2xl font-bold text-rose-400 font-mono">{overdueList.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Immediate outreach required</div>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/40">
          <div className="text-slate-400 text-xs font-semibold mb-1">Follow-ups Today</div>
          <div className="text-2xl font-bold text-amber-300 font-mono">{todayList.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Scheduled for today's cadence</div>
        </div>

        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/40">
          <div className="text-slate-400 text-xs font-semibold mb-1">Upcoming Cadence</div>
          <div className="text-2xl font-bold text-indigo-300 font-mono">{upcomingList.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Next 7 days pipeline touches</div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/40">
          <div className="text-slate-400 text-xs font-semibold mb-1">Completed This Week</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{completedList.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Logged & synchronized</div>
        </div>
      </div>

      {/* Overdue Section */}
      {overdueList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Overdue Follow-ups ({overdueList.length}) — High Churn Risk</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overdueList.map(renderCard)}
          </div>
        </div>
      )}

      {/* Due Today Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
          <ClockAlert className="w-4 h-4" />
          <span>Due Today ({todayList.length})</span>
        </div>
        {todayList.length === 0 ? (
          <div className="p-6 text-center text-slate-500 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            All tasks for today completed!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayList.map(renderCard)}
          </div>
        )}
      </div>

      {/* Upcoming Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
          <span>Upcoming Schedule ({upcomingList.length})</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingList.slice(0, 6).map(renderCard)}
        </div>
      </div>
    </div>
  );
};
