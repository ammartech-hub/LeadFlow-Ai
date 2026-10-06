import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, PieChart, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { api } from '../../lib/api.js';
import { DailyConversionTrendChart } from '../dashboard/DailyConversionTrendChart.js';

export const SalesAnalyticsView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await api.getAnalytics();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading || !data) return <div className="p-8 text-slate-500">Loading sales analytics...</div>;

  const { winRate, averageSalesCycleDays, pipelineVelocity, lostDealReasons, leadSourcePerformance } = data;

  const lossColors = ['#f43f5e', '#fb923c', '#eab308', '#a855f7', '#64748b'];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Enterprise Sales Analytics & Win/Loss Intelligence</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            B2B Benchmarks
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Deep-dive telemetry into sales velocity, channel ROI, and competitive loss analysis.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold mb-1">Win Rate</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{winRate}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Closed Won vs Closed Total</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold mb-1">Avg Sales Cycle</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">{averageSalesCycleDays} Days</div>
          <div className="text-[11px] text-slate-400 mt-0.5">First contact to contract signature</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold mb-1">Pipeline Velocity</div>
          <div className="text-2xl font-bold text-indigo-400 font-mono">{pipelineVelocity}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Capital velocity through funnel</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold mb-1">Avg Enterprise Deal Size</div>
          <div className="text-2xl font-bold text-amber-300 font-mono">₹6.4L</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Annual recurring commit</div>
        </div>
      </div>

      {/* Daily Lead Conversion Rate Trends vs Last Month */}
      <DailyConversionTrendChart data={data.dailyConversionTrend} />

      {/* Charts: Lost Deal Reasons & Lead Source ROI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lost Deal Reasons Bar */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Lost Deal Root Cause Analysis</h2>
              <p className="text-xs text-slate-400">Primary objections identified during closed-lost postmortems</p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400">100% Normalized</span>
          </div>

          <div className="space-y-3">
            {lostDealReasons.map((lr: any, idx: number) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>{lr.reason}</span>
                  <span className="font-mono font-bold text-rose-300">{lr.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full bg-rose-500"
                    style={{ width: `${lr.percentage}%`, backgroundColor: lossColors[idx % lossColors.length] }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            <strong>Key takeaway for Sales Reps:</strong> 38% of lost deals stem from initial volume pricing misunderstandings. Introduce tiered commit discount brackets early during proposal delivery.
          </div>
        </div>

        {/* Lead Source Win Rates */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Lead Source Win Rates</h2>
              <p className="text-xs text-slate-400">Conversion efficiency across inbound and outbound channels</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadSourcePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="source" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="won" fill="#10b981" radius={[4, 4, 0, 0]} name="Won Deals" />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            <strong>Inbound & Referral Channels</strong> show 3.2x higher win velocity than cold email blasts.
          </div>
        </div>
      </div>
    </div>
  );
};
