import React, { useEffect, useState } from 'react';
import { Sparkles, Calendar, Clock, Flame, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useApp } from '../../context/AppContext.js';

export const DailySalesAssistantCard: React.FC = () => {
  const { triggerOpenLead, setCurrentView } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssistant() {
      try {
        const res = await api.getDailySalesAssistant();
        setData(res);
      } catch (err) {
        console.error('Failed to load daily assistant brief:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAssistant();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 animate-pulse">
        <div className="h-4 w-48 bg-slate-800 rounded mb-3" />
        <div className="h-10 w-full bg-slate-800/60 rounded" />
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>AI Sales Assistant Daily Briefing</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Data
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{data.greeting}</p>
          </div>
        </div>

        {/* Quick KPI pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span><strong className="text-white">{data.stats.followUpsToday}</strong> follow-ups today</span>
          </div>
          <div className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span><strong className="text-white">{data.stats.meetingsToday}</strong> meetings</span>
          </div>
          <div className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5 text-slate-300">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span><strong className="text-white">{data.stats.hotLeadsCount}</strong> hot leads</span>
          </div>
          <div className="px-3 py-1 rounded-lg bg-indigo-900/40 border border-indigo-700/40 text-indigo-200">
            <span>Pipeline: <strong className="text-white">{data.stats.activePipelineFormatted}</strong></span>
          </div>
        </div>
      </div>

      {/* Priorities and recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80">
        {data.topPriorities.map((item: any, idx: number) => (
          <div
            key={item.leadId || idx}
            onClick={() => triggerOpenLead(item.leadId)}
            className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-600/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                #{idx + 1} {item.companyName}
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {item.conversionProb}% Prob
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-medium mb-1">
              Deal Value: <span className="text-white font-semibold">{item.dealValueFormatted}</span>
            </div>
            <div className="text-[11px] text-slate-400 line-clamp-1">
              {item.action}
            </div>
          </div>
        ))}
      </div>

      {/* Recommended action footer */}
      <div className="mt-3.5 p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-between text-xs text-indigo-200">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span><strong>Next Best Action:</strong> {data.executiveRecommendation}</span>
        </div>
        <button
          onClick={() => setCurrentView('followups')}
          className="text-indigo-400 hover:text-indigo-300 text-[11px] font-semibold flex items-center gap-1 shrink-0 ml-3"
        >
          <span>View Queue</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
