import React, { useEffect, useState } from 'react';
import {
  GitBranch,
  DollarSign,
  TrendingUp,
  Plus,
  Flame,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Building2,
  User,
  Calendar
} from 'lucide-react';
import { Deal, LeadStatus } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useApp } from '../../context/AppContext.js';

interface KanbanPipelineProps {
  onOpenDealDetail?: (dealId: string) => void;
  onOpenLeadDetail?: (leadId: string) => void;
}

export const KanbanPipeline: React.FC<KanbanPipelineProps> = ({ onOpenLeadDetail }) => {
  const { showToast, triggerOpenLead } = useApp();
  const [pipelineData, setPipelineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const STAGES: LeadStatus[] = [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'MEETING',
    'PROPOSAL',
    'NEGOTIATION',
    'WON',
    'LOST'
  ];

  const fetchPipeline = async () => {
    setLoading(true);
    try {
      const res = await api.getPipeline();
      setPipelineData(res);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const handleMoveStage = async (dealId: string, newStage: LeadStatus) => {
    try {
      await api.updateDealStage(dealId, newStage);
      showToast(`Deal moved to ${newStage}`, 'success');
      fetchPipeline();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  if (loading || !pipelineData) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-64 bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-96 bg-slate-800/60 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { columns, totalPipelineFormatted, weightedPipelineFormatted } = pipelineData;

  const getStageHeaderColor = (stage: LeadStatus) => {
    switch (stage) {
      case 'WON':
        return 'border-t-emerald-500 text-emerald-400';
      case 'LOST':
        return 'border-t-rose-500 text-rose-400';
      case 'NEGOTIATION':
        return 'border-t-purple-500 text-purple-400';
      case 'PROPOSAL':
        return 'border-t-indigo-500 text-indigo-400';
      case 'MEETING':
        return 'border-t-blue-500 text-blue-400';
      case 'QUALIFIED':
        return 'border-t-cyan-500 text-cyan-400';
      default:
        return 'border-t-slate-500 text-slate-300';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-full">
      {/* Pipeline Header & Financial Metrics */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Sales Opportunity Pipeline</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              Kanban Board
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise CPaaS opportunities progressing through consultative evaluation stages.
          </p>
        </div>

        {/* Financial Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Active Pipeline</span>
            <span className="text-base font-bold font-mono text-white">{totalPipelineFormatted}</span>
          </div>

          <div className="px-4 py-2 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs">
            <span className="text-indigo-300 block text-[10px] uppercase font-bold">Weighted Pipeline</span>
            <span className="text-base font-bold font-mono text-indigo-200">{weightedPipelineFormatted}</span>
          </div>

          <div className="px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs">
            <span className="text-emerald-300 block text-[10px] uppercase font-bold">Formula</span>
            <span className="text-xs font-mono text-emerald-200">Deal Value × Win Prob</span>
          </div>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1500px]">
          {columns.map((col: any) => {
            const currentStageIndex = STAGES.indexOf(col.stage as LeadStatus);
            const prevStage = currentStageIndex > 0 ? STAGES[currentStageIndex - 1] : null;
            const nextStage = currentStageIndex < STAGES.length - 1 ? STAGES[currentStageIndex + 1] : null;

            return (
              <div
                key={col.stage}
                className={`flex-1 min-w-[270px] max-w-[320px] rounded-xl bg-slate-900 border border-slate-800/80 border-t-4 flex flex-col max-h-[75vh] shadow-xl ${getStageHeaderColor(col.stage)}`}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-slate-800/80 bg-slate-950/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs tracking-tight text-white flex items-center gap-1.5">
                      <span>{col.stage}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {col.count}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {col.totalValueFormatted}
                    </div>
                  </div>
                </div>

                {/* Deal Cards Container */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                  {col.deals.length === 0 ? (
                    <div className="p-6 text-center text-[11px] text-slate-600 border border-dashed border-slate-800 rounded-lg">
                      No deals in this stage
                    </div>
                  ) : (
                    col.deals.map((deal: Deal) => (
                      <div
                        key={deal.id}
                        onClick={() => triggerOpenLead(deal.leadId)}
                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer transition-all shadow-md group"
                      >
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <span className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                            {deal.companyName}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0">
                            {deal.probability}%
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-300 font-medium mb-1.5">
                          Deal Value: <strong className="text-white font-mono">₹{(deal.value / 100000).toFixed(1)}L</strong>
                        </div>

                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mb-2">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>{deal.contactName}</span>
                          <span>•</span>
                          <span>{deal.assignedSalespersonName.split(' ')[0]}</span>
                        </div>

                        {/* Solutions Badges */}
                        <div className="flex flex-wrap gap-1 mb-2.5">
                          {deal.solutions.map((sol, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                            >
                              {sol}
                            </span>
                          ))}
                        </div>

                        {/* Quick Stage Mover Controls */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                          {prevStage ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveStage(deal.id, prevStage);
                              }}
                              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center gap-0.5"
                              title={`Move back to ${prevStage}`}
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span className="hidden sm:inline">{prevStage.slice(0, 4)}</span>
                            </button>
                          ) : <div />}

                          {nextStage && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveStage(deal.id, nextStage);
                              }}
                              className="p-1 px-1.5 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white flex items-center gap-0.5 font-semibold"
                              title={`Advance to ${nextStage}`}
                            >
                              <span>Advance</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
