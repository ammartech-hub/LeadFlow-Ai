import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  SlidersHorizontal,
  Info,
  Calendar,
  Layers,
  BarChart2,
  Download
} from 'lucide-react';

interface DailyConversionTrendProps {
  data?: {
    trend: Array<{
      day: string;
      date: string;
      lastMonthDate: string;
      dayNumber: number;
      currentMonthRate: number;
      lastMonthRate: number;
      variance: number;
      isProjected: boolean;
      currentWonCount: number;
      currentClosedCount: number;
      lastWonCount: number;
      lastClosedCount: number;
      cumulativeCurrentRate: number;
      cumulativeLastMonthRate: number;
    }>;
    summary: {
      currentMonthAvg: number;
      lastMonthAvg: number;
      liftPct: number;
      liftRelativePct: number;
      bestDay: string;
      worstDay: string;
      momentum: string;
      insight: string;
    };
  };
  onExportCSV?: () => void;
}

export const DailyConversionTrendChart: React.FC<DailyConversionTrendProps> = ({ data, onExportCSV }) => {
  const [metricView, setMetricView] = useState<'DAILY' | 'CUMULATIVE' | 'VARIANCE'>('DAILY');
  const [horizonFilter, setHorizonFilter] = useState<'ALL' | 'MTD' | 'FIRST_15'>('ALL');

  if (!data || !data.trend) {
    return (
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse text-center">
        <div className="h-6 w-64 bg-slate-800 rounded mx-auto mb-2" />
        <div className="h-64 w-full bg-slate-950/60 rounded" />
      </div>
    );
  }

  const { trend, summary } = data;

  const filteredTrend = trend.filter(item => {
    if (horizonFilter === 'MTD') return !item.isProjected;
    if (horizonFilter === 'FIRST_15') return item.dayNumber <= 15;
    return true;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="p-3.5 rounded-xl bg-slate-950/95 border border-slate-800 shadow-2xl text-xs space-y-2 min-w-[220px]">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="font-bold text-white">{point.date}</span>
            <span className="text-[10px] text-slate-400 font-mono">
              vs {point.lastMonthDate}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-indigo-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>This Month (Oct):</span>
              </span>
              <span className="font-mono font-bold text-white">
                {metricView === 'CUMULATIVE' ? `${point.cumulativeCurrentRate}%` : `${point.currentMonthRate}%`}
                {point.isProjected && <span className="text-[10px] text-slate-400 font-normal ml-1">(proj)</span>}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-cyan-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Last Month (Sep):</span>
              </span>
              <span className="font-mono font-bold text-slate-300">
                {metricView === 'CUMULATIVE' ? `${point.cumulativeLastMonthRate}%` : `${point.lastMonthRate}%`}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 font-semibold">
              <span className="text-slate-400">Day-over-Day Lift:</span>
              <span className={`font-mono ${point.variance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {point.variance >= 0 ? `+${point.variance}%` : `${point.variance}%`}
              </span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-800/60 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Deals Closed: {point.currentWonCount} won</span>
            <span>Sep Baseline: {point.lastWonCount} won</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Daily Lead Conversion Rate Trends vs Last Month</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Granular Executive Intelligence
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Day-by-day conversion percentage tracking comparing October 2026 MTD to the September 2026 historical baseline.
          </p>
        </div>

        {/* View Mode & Horizon Toggle Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric View Mode */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setMetricView('DAILY')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                metricView === 'DAILY'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Daily Rate (%)
            </button>
            <button
              onClick={() => setMetricView('CUMULATIVE')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                metricView === 'CUMULATIVE'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cumulative MTD (%)
            </button>
            <button
              onClick={() => setMetricView('VARIANCE')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                metricView === 'VARIANCE'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Variance Delta (±%)
            </button>
          </div>

          {/* Horizon Scope */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setHorizonFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                horizonFilter === 'ALL'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All 30 Days
            </button>
            <button
              onClick={() => setHorizonFilter('MTD')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                horizonFilter === 'MTD'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MTD (Days 1–6)
            </button>
            <button
              onClick={() => setHorizonFilter('FIRST_15')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                horizonFilter === 'FIRST_15'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Days 1–15
            </button>
          </div>

          {/* Export to CSV Button */}
          {onExportCSV && (
            <button
              onClick={onExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all active:scale-95 shadow-sm"
              title="Download daily conversion rate trends CSV for external reporting"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export to CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Recharts Chart Visualization */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={filteredTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="currentMonthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="lastMonthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              domain={metricView === 'VARIANCE' ? [-5, 12] : [10, 30]}
              tickFormatter={(val) => `${val}%`}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />

            {/* Reference Line for Current Month Average */}
            <ReferenceLine
              y={summary.currentMonthAvg}
              stroke="#818cf8"
              strokeDasharray="4 4"
              label={{
                value: `MTD Avg: ${summary.currentMonthAvg}%`,
                fill: '#a5b4fc',
                fontSize: 10,
                position: 'right'
              }}
            />

            {metricView === 'DAILY' && (
              <>
                <Area
                  type="monotone"
                  dataKey="currentMonthRate"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#currentMonthGradient)"
                  name="This Month (October)"
                  activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="lastMonthRate"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Last Month Baseline (September)"
                />
              </>
            )}

            {metricView === 'CUMULATIVE' && (
              <>
                <Area
                  type="monotone"
                  dataKey="cumulativeCurrentRate"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#currentMonthGradient)"
                  name="Cumulative This Month (Oct)"
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeLastMonthRate"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                  name="Cumulative Last Month (Sep)"
                />
              </>
            )}

            {metricView === 'VARIANCE' && (
              <>
                <Bar
                  dataKey="variance"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Variance Lift vs Sep (±%)"
                />
                <ReferenceLine y={0} stroke="#475569" />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Executive Key Takeaways & Granular Metric Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[11px] text-slate-400 mb-0.5">MTD Conversion Rate</div>
          <div className="text-xl font-bold font-mono text-white">
            {summary.currentMonthAvg}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">October (Days 1–6)</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[11px] text-slate-400 mb-0.5">Last Month Benchmark</div>
          <div className="text-xl font-bold font-mono text-slate-300">
            {summary.lastMonthAvg}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">September Baseline</div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40">
          <div className="text-[11px] text-emerald-300 mb-0.5">Net Conversion Lift</div>
          <div className="text-xl font-bold font-mono text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            <span>+{summary.liftPct}%</span>
          </div>
          <div className="text-[10px] text-emerald-300/80 mt-0.5">+{summary.liftRelativePct}% relative lift</div>
        </div>

        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40">
          <div className="text-[11px] text-indigo-300 mb-0.5">Peak Velocity Day</div>
          <div className="text-sm font-bold font-mono text-indigo-200 mt-1">
            {summary.bestDay}
          </div>
          <div className="text-[10px] text-indigo-300/80 mt-0.5">Post-demo close velocity</div>
        </div>
      </div>

      {/* AI Executive Insight Callout */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/40 to-slate-950 border border-indigo-800/40 flex items-start gap-3 text-xs text-indigo-200">
        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Executive Insight:</strong> {summary.insight}
        </div>
      </div>
    </div>
  );
};
