import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Target,
  Layers,
  MessageSquare,
  GitBranch,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe2,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';

export const LandingPage: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Landing Header */}
      <nav className="h-16 border-b border-slate-800/80 px-6 sm:px-12 flex items-center justify-between bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">LeadFlow AI</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 ml-1">
            Enterprise CPaaS
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('interview-demo')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Interview Walkthrough
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Open Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 sm:px-12 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Designed for Enterprise B2B SaaS & CPaaS Sales Teams</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Turn Leads Into Conversations.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
            Conversations Into Revenue.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          AI-powered B2B sales intelligence for smarter prospecting, personalized engagement, and predictable growth.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentView('interview-demo')}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold transition-all flex items-center gap-2"
          >
            <span>View Demo</span>
          </button>
        </div>

        {/* Hero KPI Preview Banner */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-3">
            <div className="text-xs text-slate-400 font-medium">Qualified Pipeline</div>
            <div className="text-2xl font-bold text-white mt-1">₹42.6L</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">84 active accounts</div>
          </div>
          <div className="p-3 border-l border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Avg Lead Score</div>
            <div className="text-2xl font-bold text-white mt-1">87 / 100</div>
            <div className="text-[11px] text-indigo-400 mt-0.5">Automated AI evaluation</div>
          </div>
          <div className="p-3 border-l border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Won Revenue (MTD)</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">₹9.4L</div>
            <div className="text-[11px] text-slate-400 mt-0.5">62.7% quota reached</div>
          </div>
          <div className="p-3 border-l border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Predicted Close Rate</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">86.4%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Calibrated ML engine</div>
          </div>
        </div>
      </section>

      {/* How It Works - The Complete CPaaS Sales Lifecycle */}
      <section className="py-16 px-6 sm:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Complete Sales Lifecycle</h2>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
            Engineered For The Modern B2B Account Executive
          </p>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            From raw customer requirements to qualified pipeline, customized multi-channel pitches, and predictive quota forecasting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 relative">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 font-bold text-sm">
              01
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">Lead Ingestion & Requirement Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sales reps enter unstructured client briefs. AI extracts communication channels, estimated volume, and pain points in seconds.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 relative">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 font-bold text-sm">
              02
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">Lead Scoring & Solution Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Algorithmic scoring prioritizes hot deals (0-100) and matches the client's problem to the ideal CPaaS solution catalog product.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 relative">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 font-bold text-sm">
              03
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">Personalized Pitch & Outreach</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates high-converting Cold Emails, WhatsApp updates, and LinkedIn InMails tailored to buyer persona with editable tone.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 font-bold text-sm">
              04
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">Pipeline, Forecast & Close</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track through Kanban stages, schedule discovery calls, trigger automated follow-ups, and forecast month-end revenue targets.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 px-6 sm:px-12 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Built for High-Growth Sales</h2>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
              Core Capabilities in LeadFlow AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <Cpu className="w-6 h-6 text-indigo-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-2">AI Requirement Analyzer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transforms unstructured customer needs like "50k OTP monthly + WhatsApp order alerts" into structured specifications with channel breakdowns.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <Layers className="w-6 h-6 text-cyan-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-2">CPaaS Solution Catalog</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Covers 9 generic communication products: SMS API, OTP Messaging, WhatsApp Business, AI Voice Agents, and Omnichannel Orchestration.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <Target className="w-6 h-6 text-emerald-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-2">AI Lead Scoring Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Classifies leads into HOT, WARM, COLD, and LOW priority based on deal size, vertical fit, and urgency with actionable next steps.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <MessageSquare className="w-6 h-6 text-amber-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-2">Multi-Channel Pitch Generator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create tailored outreach for Email, LinkedIn, WhatsApp, and Meeting Invites across Consultative, Persuasive, and Concise tones.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <GitBranch className="w-6 h-6 text-purple-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-2">Kanban Pipeline & Meetings</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full drag-and-drop opportunity board from NEW to WON, weighted pipeline metrics, and integrated discovery call scheduling.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <TrendingUp className="w-6 h-6 text-rose-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-2">AI Forecasting & ML Models</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Predict revenue gaps against quota and compute conversion probabilities with transparent synthetic model evaluation metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 sm:px-12 border-t border-slate-800 text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-slate-300">LeadFlow AI</span> — Built for Enterprise Sales Associate & B2B Business Development roles.
        </div>
        <div className="text-[11px] text-slate-500">
          Simulated telecom & communication environment for demonstration purposes.
        </div>
      </footer>
    </div>
  );
};
