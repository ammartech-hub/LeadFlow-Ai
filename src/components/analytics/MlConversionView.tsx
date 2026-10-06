import React, { useEffect, useState } from 'react';
import {
  BrainCircuit,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Lead, MLModelMetrics } from '../../types/index.js';
import { MLPredictionResult } from '../../../server/services/mlService.js';
import { api } from '../../lib/api.js';
import { useApp } from '../../context/AppContext.js';

export const MlConversionView: React.FC = () => {
  const { triggerOpenLead } = useApp();
  const [metrics, setMetrics] = useState<MLModelMetrics | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [prediction, setPrediction] = useState<MLPredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [mRes, lRes] = await Promise.all([
          api.getMLMetrics(),
          api.getLeads({ limit: 20 })
        ]);
        setMetrics(mRes);
        setLeads(lRes.leads);
        if (lRes.leads.length > 0) {
          setSelectedLead(lRes.leads[0]);
          runPredict(lRes.leads[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const runPredict = async (lead: Lead) => {
    setPredicting(true);
    try {
      const pred = await api.predictConversion(lead, 4, 1);
      setPrediction(pred);
    } catch (err) {
      console.error(err);
    } finally {
      setPredicting(false);
    }
  };

  if (loading || !metrics) {
    return <div className="p-8 text-slate-500">Loading ML Conversion Model...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Machine Learning Lead Conversion Prediction Engine</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Scikit-Learn Calibrated
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Multivariate classification model estimating B2B deal closing probabilities and identifying pipeline risk factors.
        </p>
      </div>

      {/* Synthetic Evaluation Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold mb-1">Model Accuracy</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">{metrics.accuracy}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Overall correctness</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold mb-1">Precision</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{metrics.precision}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Won deal positive value</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold mb-1">Recall (Sensitivity)</div>
          <div className="text-2xl font-bold text-indigo-400 font-mono">{metrics.recall}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Coverage of real wins</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold mb-1">F1 Score</div>
          <div className="text-2xl font-bold text-purple-400 font-mono">{metrics.f1Score}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Harmonic balance</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold mb-1">ROC-AUC Score</div>
          <div className="text-2xl font-bold text-teal-400 font-mono">{metrics.rocAuc}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Discriminative power</div>
        </div>
      </div>

      {/* Model Transparency Banner */}
      <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200 flex items-center gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>{metrics.disclaimer}</span>
      </div>

      {/* Interactive Inference Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lead Selector (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 text-xs">
          <div className="font-bold text-white text-sm mb-1">Select Lead for Live Inference:</div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {leads.map(lead => {
              const isSel = selectedLead?.id === lead.id;
              return (
                <div
                  key={lead.id}
                  onClick={() => {
                    setSelectedLead(lead);
                    runPredict(lead);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSel ? 'bg-cyan-950/40 border-cyan-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{lead.companyName}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-300">
                      ₹{(lead.estimatedDealValue / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{lead.industry} • {lead.status}</span>
                    <span className="text-indigo-400">Score: {lead.leadScore}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prediction Results & Feature Importance (7 Cols) */}
        {prediction && (
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 text-xs">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Target Opportunity:</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  prediction.riskLevel === 'LOW' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                  prediction.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                  'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}>
                  {prediction.riskLevel} CHURN RISK
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{prediction.companyName}</h2>

              {/* Conversion Prob Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="text-slate-300">Predicted Conversion Probability</span>
                  <span className="font-mono font-bold text-cyan-400 text-base">
                    {prediction.predictedConversionProbability}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${prediction.predictedConversionProbability}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Feature Weights Breakdown */}
            <div>
              <div className="font-bold text-white mb-2 text-xs uppercase tracking-wider text-slate-400">
                Top Model Feature Contributions
              </div>
              <div className="space-y-2">
                {prediction.featureWeights.map((fw: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">{fw.feature}</span>
                      <span className="font-mono text-[11px] text-slate-400 font-bold">{fw.contributionPct}% Impact</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{fw.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategy Recommendation */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-900/40 text-slate-200">
              <strong className="text-indigo-400 block mb-1">Recommended Closing Action:</strong>
              {prediction.recommendedAction}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
