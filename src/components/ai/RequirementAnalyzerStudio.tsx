import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
  AlertCircle,
  Copy,
  Plus,
  RefreshCw,
  Send
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { RequirementAnalysisResult } from '../../types/index.js';
import { useApp } from '../../context/AppContext.js';

interface RequirementAnalyzerStudioProps {
  initialRequirement?: string;
  onOpenCreateWithAnalysis?: (analysis: RequirementAnalysisResult, text: string) => void;
  onOpenPitchGenerator?: (analysis: RequirementAnalysisResult) => void;
}

export const RequirementAnalyzerStudio: React.FC<RequirementAnalyzerStudioProps> = ({
  initialRequirement = '',
  onOpenCreateWithAnalysis,
  onOpenPitchGenerator
}) => {
  const { showToast, setCurrentView } = useApp();
  const [inputText, setInputText] = useState(
    initialRequirement ||
    'We are an e-commerce company processing around 50,000 OTP requests every month. We also want WhatsApp order notifications and automated customer updates.'
  );
  const [analysis, setAnalysis] = useState<RequirementAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    {
      title: 'E-commerce OTP & WhatsApp (NovaCart)',
      text: 'We are an e-commerce company processing around 50,000 OTP requests every month. We also want WhatsApp order notifications and automated customer updates.'
    },
    {
      title: 'Fintech Loan 2FA & KYC Verification',
      text: 'Digital NBFC personal loan app needs sub-3s delivery SLA for transaction OTPs, automated loan disbursement SMS, and WhatsApp bot for KYC document submission.'
    },
    {
      title: 'Healthcare Clinic Virtual Consultation',
      text: 'Telehealth network with 40,000 monthly patient consultations requires phone number masking between doctors and patients, plus automated WhatsApp lab report delivery.'
    },
    {
      title: 'EdTech Admissions AI Voice Screening',
      text: 'Executive education bootcamps experiencing 45% drop-off in counselor outreach. Need an AI Voice Agent to conduct preliminary outbound screening calls and WhatsApp webinar reminders.'
    },
    {
      title: 'Logistics Courier Delivery Privacy Masking',
      text: 'Last-mile logistics delivery fleet wants virtual number privacy masking between delivery drivers and customers to protect personal phone numbers and avoid dispute calls.'
    }
  ];

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze || inputText;
    if (!text.trim()) {
      showToast('Please provide a client requirement statement', 'info');
      return;
    }
    setLoading(true);
    try {
      const res = await api.analyzeRequirement(text);
      setAnalysis(res);
      showToast('Structured requirement extraction complete', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>AI Requirement Analyzer Studio</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            NLP Engine
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Paste unstructured customer requirement notes. The AI extracts telecom channels, volume tiers, pain points, and recommended sales actions.
        </p>
      </div>

      {/* Input Box & Sample Presets */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        {/* Preset Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Load Enterprise CPaaS Scenario Presets:
          </label>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(p.text);
                  handleAnalyze(p.text);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-300">
              Customer Business Requirement / Sales Notes:
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              Natural Language Input
            </span>
          </div>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe what the prospect needs (e.g. volume, channels, current issues, goals)..."
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500">
            Uses Gemini 3.8 Flash structured JSON schema extraction with telecom domain rules.
          </span>
          <button
            onClick={() => handleAnalyze()}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Analyzing Requirement...' : 'Extract B2B Intelligence'}</span>
          </button>
        </div>
      </div>

      {/* Structured Output Render */}
      {analysis && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-3">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-lg font-bold text-white">{analysis.industry}</span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                  {analysis.businessType}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  {analysis.buyingIntent} Intent
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">{analysis.summary}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('pitch-generator')}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Generate Outreach Pitch</span>
              </button>
            </div>
          </div>

          {/* Grid of Extracted Parameters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-slate-400 text-[11px] mb-1">Required Channels</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysis.requiredChannels.map((ch, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {ch}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-slate-400 text-[11px] mb-1">Estimated Volume</div>
              <div className="text-xs font-bold text-white mt-1">
                {analysis.estimatedCommunicationVolume}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-slate-400 text-[11px] mb-1">Urgency Window</div>
              <div className="text-xs font-bold text-amber-300 mt-1">
                {analysis.urgency}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-slate-400 text-[11px] mb-1">Buying Intent</div>
              <div className="text-xs font-bold text-emerald-400 mt-1">
                {analysis.buyingIntent}
              </div>
            </div>
          </div>

          {/* Pain Points & Use Cases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-2">
                Customer Pain Points & Operational Risks
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {analysis.painPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
                Identified CPaaS Use Cases
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {analysis.potentialUseCases.map((uc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span>{uc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Next Action */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-slate-950 border border-indigo-800/40 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-indigo-300 mb-0.5">Recommended AE Next Action:</div>
              <p className="text-slate-200">{analysis.recommendedNextAction}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
