import React, { useEffect, useState } from 'react';
import {
  Users,
  Target,
  GitBranch,
  CalendarCheck2,
  DollarSign,
  Trophy,
  Percent,
  TrendingUp,
  Filter,
  ArrowUpRight,
  ChevronRight,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';
import { api } from '../../lib/api.js';
import { DailySalesAssistantCard } from './DailySalesAssistantCard.js';
import { DailyConversionTrendChart } from './DailyConversionTrendChart.js';
import { useApp } from '../../context/AppContext.js';

export const ExecutiveDashboard: React.FC = () => {
  const { setCurrentView, showToast } = useApp();
  const [period, setPeriod] = useState<string>('THIS_MONTH');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleExportConversionTrendsCSV = () => {
    if (!data?.dailyConversionTrend?.trend || data.dailyConversionTrend.trend.length === 0) {
      showToast('No daily conversion trend data available to export', 'error');
      return;
    }

    const { trend, summary } = data.dailyConversionTrend;

    const headers = [
      'Day',
      'Date (Oct 2026)',
      'Baseline Date (Sep 2026)',
      'Day Number',
      'This Month Conversion Rate (%)',
      'Last Month Conversion Rate (%)',
      'Day-over-Day Variance Delta (%)',
      'Current Deals Won',
      'Current Closed Deals',
      'Last Month Deals Won',
      'Last Month Closed Deals',
      'Cumulative MTD Current Rate (%)',
      'Cumulative Last Month Rate (%)',
      'Forecast Status'
    ];

    const rows = trend.map((item: any) => [
      `"${item.day}"`,
      `"${item.date}"`,
      `"${item.lastMonthDate}"`,
      item.dayNumber,
      item.currentMonthRate,
      item.lastMonthRate,
      item.variance,
      item.currentWonCount,
      item.currentClosedCount,
      item.lastWonCount,
      item.lastClosedCount,
      item.cumulativeCurrentRate,
      item.cumulativeLastMonthRate,
      item.isProjected ? '"Projected"' : '"Actual MTD"'
    ]);

    const summarySection = [
      [],
      ['"--- EXECUTIVE SUMMARY BENCHMARKS ---"'],
      ['"Metric"', '"Value"'],
      ['"October MTD Conversion Rate Average"', `"${summary.currentMonthAvg}%"`],
      ['"September Baseline Average"', `"${summary.lastMonthAvg}%"`],
      ['"Net Conversion Lift Delta"', `"+${summary.liftPct}%"`],
      ['"Relative Conversion Lift"', `"+${summary.liftRelativePct}%"`],
      ['"Peak Velocity Day"', `"${summary.bestDay}"`],
      ['"Lowest Velocity Day"', `"${summary.worstDay}"`],
      ['"Pacing Momentum"', `"${summary.momentum}"`],
      ['"Executive Insight"', `"${(summary.insight || '').replace(/"/g, '""')}"`]
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.join(',')),
      ...summarySection.map((row: any[]) => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leadflow_daily_conversion_trends_${period.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Daily conversion rate trends exported to CSV successfully!', 'success');
  };

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const res = await api.getDashboard(period);
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [period]);

  if (loading || !data) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-64 bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { kpis, funnel, pipelineByStage, leadsByIndustry, leadSourcePerformance, salespersonPerformance, revenueTrend } = data;

  const kpiCards = [
    {
      title: 'Total Leads',
      value: kpis.totalLeads,
      subtext: '+12 this week',
      icon: Users,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
      action: () => setCurrentView('leads')
    },
    {
      title: 'Qualified Leads',
      value: kpis.qualifiedLeads,
      subtext: '45.7% qualification rate',
      icon: Target,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
      action: () => setCurrentView('leads')
    },
    {
      title: 'Active Opportunities',
      value: kpis.activeOpportunities,
      subtext: 'In active pipeline',
      icon: GitBranch,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      action: () => setCurrentView('pipeline')
    },
    {
      title: 'Scheduled Meetings',
      value: kpis.meetingsCount,
      subtext: 'Discovery & Demos',
      icon: CalendarCheck2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      action: () => setCurrentView('meetings')
    },
    {
      title: 'Pipeline Value',
      value: kpis.pipelineValueFormatted,
      subtext: `Weighted: ${kpis.weightedPipelineValueFormatted}`,
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      action: () => setCurrentView('pipeline')
    },
    {
      title: 'Won Revenue (MTD)',
      value: kpis.wonRevenueFormatted,
      subtext: '16 closed contracts',
      icon: Trophy,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      action: () => setCurrentView('targets')
    },
    {
      title: 'Win Conversion Rate',
      value: `${kpis.conversionRate}%`,
      subtext: 'Closed Won / Closed Total',
      icon: Percent,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10 border-teal-500/20',
      action: () => setCurrentView('analytics')
    },
    {
      title: 'Target Achievement',
      value: `${kpis.targetAchievement}%`,
      subtext: 'Quota: ₹15.0L target',
      icon: TrendingUp,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      action: () => setCurrentView('targets')
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Period Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Executive Sales Dashboard</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-normal">
              Enterprise CPaaS
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pipeline metrics, communication solution opportunities, and team quota pacing.
          </p>
        </div>

        {/* Top Actions: Export to CSV & Period Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportConversionTrendsCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 hover:border-slate-600 text-xs font-medium transition-all shadow-sm active:scale-95"
            title="Download daily conversion rate trends CSV for external reporting"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export to CSV</span>
          </button>

          {/* Period Selector Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            {['TODAY', 'THIS_WEEK', 'THIS_MONTH', 'THIS_QUARTER', 'ALL'].map(tab => (
              <button
                key={tab}
                onClick={() => setPeriod(tab)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  period === tab
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Sales Assistant Daily Briefing */}
      <DailySalesAssistantCard />

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={kpi.action}
              className={`p-4 rounded-xl border bg-slate-900/80 hover:border-slate-700 cursor-pointer transition-all hover:scale-[1.01] ${kpi.bgColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">{kpi.title}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">{kpi.value}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                <span>{kpi.subtext}</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Lead Conversion Rate Trends vs Last Month (Granular Executive Insights) */}
      <DailyConversionTrendChart
        data={data.dailyConversionTrend}
        onExportCSV={handleExportConversionTrendsCSV}
      />

      {/* Charts Row 1: Funnel & Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Funnel Chart */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Sales Conversion Funnel</h2>
              <p className="text-xs text-slate-400">Prospect pipeline drop-off at each stage</p>
            </div>
            <button
              onClick={() => setCurrentView('pipeline')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>View Pipeline</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {funnel.map((step: any, index: number) => {
              const maxCount = funnel[0].count;
              const widthPct = Math.max(12, Math.round((step.count / maxCount) * 100));
              const prevCount = index > 0 ? funnel[index - 1].count : step.count;
              const stageConv = index > 0 ? ((step.count / prevCount) * 100).toFixed(1) : '100';

              return (
                <div key={step.stage} className="text-xs">
                  <div className="flex items-center justify-between mb-1 text-slate-300">
                    <span className="font-semibold text-slate-200">{step.stage}</span>
                    <div className="flex items-center gap-3">
                      {index > 0 && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {stageConv}% step conv
                        </span>
                      )}
                      <span className="font-mono font-bold text-white">{step.count} leads</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Trend Area Chart */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Monthly Target vs Achieved Revenue</h2>
              <p className="text-xs text-slate-400">Past 6 months enterprise contract trajectory</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ₹35.0L Oct Goal
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${(Number(val) / 100000).toFixed(1)}L`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorTarget)" name="Target" />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Achieved Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2: Pipeline by Stage & Leads by Industry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Value by Stage */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Pipeline Value by Stage</h2>
              <p className="text-xs text-slate-400">Total deal capital distributed across pipeline</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-400">{kpis.pipelineValueFormatted} Total</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineByStage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="stage" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${(Number(val) / 100000).toFixed(1)}L`, 'Value']}
                />
                <Bar dataKey="value" fill="#818cf8" radius={[4, 4, 0, 0]} name="Deal Value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads by Industry */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Lead Volume by Industry Vertical</h2>
              <p className="text-xs text-slate-400">Fintech, E-commerce, Healthcare, EdTech, Logistics</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              10 Verticals
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsByIndustry} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis dataKey="industry" type="category" stroke="#64748b" tick={{ fontSize: 10 }} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} Leads`, 'Total']}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[0, 4, 4, 0]} name="Leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row: Lead Source Performance & Team Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Source Performance */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-white">Lead Source Performance</h2>
              <p className="text-xs text-slate-400">Inbound vs Outbound channel conversion</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-2">Channel Source</th>
                  <th className="pb-2 text-center">Total Leads</th>
                  <th className="pb-2 text-center">Won Deals</th>
                  <th className="pb-2 text-center">Win Rate</th>
                  <th className="pb-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leadSourcePerformance.map((src: any) => (
                  <tr key={src.source} className="hover:bg-slate-800/40">
                    <td className="py-2.5 font-medium text-slate-200">{src.source}</td>
                    <td className="py-2.5 text-center font-mono text-slate-300">{src.total}</td>
                    <td className="py-2.5 text-center font-mono text-emerald-400">{src.won}</td>
                    <td className="py-2.5 text-center font-mono font-semibold text-slate-300">
                      {src.conversionRate}%
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold text-white">
                      ₹{(src.revenue / 100000).toFixed(1)}L
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Rep Leaderboard */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-white">Sales Team Quota Pacing</h2>
              <p className="text-xs text-slate-400">Account executive pipeline & won revenue</p>
            </div>
            <button
              onClick={() => setCurrentView('targets')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>Manage Quotas</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {salespersonPerformance.map((rep: any) => (
              <div key={rep.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-white">{rep.name}</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ₹{(rep.wonRevenue / 100000).toFixed(1)}L Won
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span>{rep.activeDeals} Active Pipeline Deals</span>
                  <span>{rep.qualifiedLeads} Qualified Leads</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((rep.wonRevenue / 1500000) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
