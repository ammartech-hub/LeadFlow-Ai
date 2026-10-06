import React, { useEffect, useState } from 'react';
import { Target, TrendingUp, DollarSign, Users, CalendarCheck2, Award, Edit3, Check, X } from 'lucide-react';
import { SalesTarget } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.js';
import { useApp } from '../../context/AppContext.js';

export const SalesTargetsView: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useApp();
  const [targets, setTargets] = useState<SalesTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [editRevenue, setEditRevenue] = useState(1500000);

  const fetchTargets = async () => {
    setLoading(true);
    try {
      const data = await api.getTargets();
      setTargets(data);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  const handleSaveTarget = async (target: SalesTarget) => {
    try {
      await api.updateTarget(target.id, { targetRevenue: editRevenue });
      showToast('Quota updated successfully', 'success');
      setEditingTargetId(null);
      fetchTargets();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading quotas...</div>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Sales Targets & Quota Management</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            October 2026
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Individual rep and enterprise team quotas across closed revenue, qualified opportunities, and meetings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {targets.map(t => {
          const revPct = Math.min(100, Math.round((t.achievedRevenue / t.targetRevenue) * 100));
          const dealPct = Math.min(100, Math.round((t.achievedDeals / t.targetDeals) * 100));
          const leadPct = Math.min(100, Math.round((t.achievedQualifiedLeads / t.targetQualifiedLeads) * 100));
          const meetPct = Math.min(100, Math.round((t.achievedMeetings / t.targetMeetings) * 100));
          const isManager = user?.role === 'SALES_MANAGER' || user?.role === 'ADMIN';
          const isEditing = editingTargetId === t.id;

          return (
            <div
              key={t.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-bold text-white text-sm">{t.userName}</h3>
                    <div className="text-[11px] text-indigo-400 mt-0.5 font-medium">{t.period}</div>
                  </div>
                  {isManager && (
                    <button
                      onClick={() => {
                        setEditingTargetId(t.id);
                        setEditRevenue(t.targetRevenue);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="Adjust Quota"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Main Revenue Target */}
                <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Monthly Revenue Quota</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">{revPct}%</span>
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="number"
                        step="50000"
                        value={editRevenue}
                        onChange={(e) => setEditRevenue(Number(e.target.value))}
                        className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                      />
                      <button
                        onClick={() => handleSaveTarget(t)}
                        className="p-1.5 rounded bg-emerald-600 text-white"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingTargetId(null)}
                        className="p-1.5 rounded bg-slate-800 text-slate-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between font-mono font-bold">
                      <span className="text-white text-base">₹{(t.achievedRevenue / 100000).toFixed(1)}L Achieved</span>
                      <span className="text-slate-500 text-xs">Goal: ₹{(t.targetRevenue / 100000).toFixed(1)}L</span>
                    </div>
                  )}

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                      style={{ width: `${revPct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>Remaining: ₹{((t.targetRevenue - t.achievedRevenue) / 100000).toFixed(1)}L</span>
                    <span>Pacing: 76% forecast probability</span>
                  </div>
                </div>

                {/* Sub KPI Quotas: Deals, Qualified Leads, Meetings */}
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>Closed Deals</span>
                      <span className="font-mono font-bold">{t.achievedDeals} / {t.targetDeals} ({dealPct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${dealPct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>Qualified Inbound/Outbound Leads</span>
                      <span className="font-mono font-bold">{t.achievedQualifiedLeads} / {t.targetQualifiedLeads} ({leadPct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${leadPct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>Completed Discovery / Demos</span>
                      <span className="font-mono font-bold">{t.achievedMeetings} / {t.targetMeetings} ({meetPct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: `${meetPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                Pacing toward quarterly attainment. Calculated against enterprise quota milestones.
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
