import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Target, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { SalesForecast } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useApp } from '../../context/AppContext.js';

export const SalesForecastingView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [forecast, setForecast] = useState<SalesForecast | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadForecast() {
      try {
        const data = await api.getSalesForecast();
        setForecast(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadForecast();
  }, []);

  if (loading || !forecast) {
    return <div className="p-8 text-slate-500">Generating AI Sales Forecast...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>AI Sales Forecasting Engine</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Predictive Model
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Machine-learning pipeline forecasting incorporating weighted deal stages, historical velocity, and seasonal win rates.
        </p>
      </div>

      {/* AI Commentary Executive Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-white">AI Executive Forecast Commentary</h2>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
            {forecast.achievementProbability}% Quota Confidence
          </span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-normal">
          {forecast.executiveSummary}
        </p>
        <div className="pt-2 flex items-center justify-between text-xs text-indigo-300 font-medium">
          <span>🎯 <strong>Prescribed Action:</strong> {forecast.recommendedAction}</span>
          <button
            onClick={() => setCurrentView('pipeline')}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
          >
            <span>Prioritize Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Forecast KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold mb-1">Monthly Quota Goal</div>
          <div className="text-2xl font-bold text-white font-mono">
            ₹{(forecast.targetRevenue / 100000).toFixed(1)}L
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Enterprise team quota</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold mb-1">Projected Won Revenue</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            ₹{(forecast.expectedRevenue / 100000).toFixed(1)}L
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5">{forecast.achievementProbability}% probability</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold mb-1">Forecast Pipeline Gap</div>
          <div className="text-2xl font-bold text-amber-300 font-mono">
            ₹{(forecast.pipelineGap / 100000).toFixed(1)}L
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Deficit to 100% quota</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold mb-1">Expected Deals Closed</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">
            {forecast.expectedDealsCount} Deals
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Avg cycle: {forecast.averageSalesCycleDays} days</div>
        </div>
      </div>

      {/* Model Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-500">
        <strong>Transparency & Ethics Note:</strong> Forecast projections are computed using weighted pipeline probability matrices and synthetic historical CPaaS benchmarks for demonstration purposes.
      </div>
    </div>
  );
};
