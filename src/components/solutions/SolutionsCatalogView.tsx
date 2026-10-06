import React, { useEffect, useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Zap,
  PhoneCall,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { Solution } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useApp } from '../../context/AppContext.js';

export const SolutionsCatalogView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSolutions() {
      try {
        const data = await api.getSolutions();
        setSolutions(data);
        if (data.length > 0) setSelectedSolution(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSolutions();
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-500">Loading CPaaS Solution Catalog...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Enterprise CPaaS Solutions Catalog</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            9 Products
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Standardized communication building blocks for B2B enterprise client problem-solution mapping.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Solution Grid / List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {solutions.map(sol => {
            const isSelected = selectedSolution?.id === sol.id;
            return (
              <div
                key={sol.id}
                onClick={() => setSelectedSolution(sol)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white text-xs">{sol.name}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800">
                    {sol.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {sol.shortDescription}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{sol.targetIndustries.slice(0, 3).join(', ')}</span>
                  <span className="text-indigo-400 font-semibold flex items-center gap-1">
                    Details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Solution Deep-Dive View (7 Cols) */}
        {selectedSolution && (
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 text-xs">
            {/* Header */}
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  {selectedSolution.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[11px]">
                  Enterprise Ready
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{selectedSolution.name}</h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {selectedSolution.fullDescription}
              </p>
            </div>

            {/* Target Customer Profile & Pricing Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-slate-400 font-semibold mb-1">Target Customer Profile</div>
                <p className="text-slate-200">{selectedSolution.customerProfile}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-slate-400 font-semibold mb-1">Commercial Pricing Model</div>
                <p className="text-emerald-400 font-medium">{selectedSolution.pricingModel}</p>
              </div>
            </div>

            {/* Key Technical Features */}
            <div>
              <h3 className="font-bold text-white mb-2 text-xs uppercase tracking-wider text-slate-400">
                Core Architectural Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedSolution.features.map((feat, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="text-slate-200">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Use Cases */}
            <div>
              <h3 className="font-bold text-white mb-2 text-xs uppercase tracking-wider text-slate-400">
                Primary B2B Sales Use Cases
              </h3>
              <ul className="space-y-1.5">
                {selectedSolution.useCases.map((uc, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{uc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business Benefits */}
            <div>
              <h3 className="font-bold text-white mb-2 text-xs uppercase tracking-wider text-slate-400">
                Measurable Client ROI Benefits
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedSolution.benefits.map((ben, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 text-xs font-medium"
                  >
                    ★ {ben}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Want to pitch this solution to a lead?</span>
              <button
                onClick={() => setCurrentView('pitch-generator')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5"
              >
                <span>Generate Outreach Pitch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
