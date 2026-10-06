import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Layers,
  Send,
  CalendarCheck2,
  ClockAlert,
  GitBranch,
  DollarSign,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { api } from '../../lib/api.js';

export const InterviewDemoJourney: React.FC = () => {
  const { setCurrentView, showToast, triggerOpenLead } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [journeyState, setJourneyState] = useState({
    leadCreated: false,
    aiAnalyzed: false,
    scored: false,
    recommended: false,
    pitchGenerated: false,
    meetingScheduled: false,
    followUpCreated: false,
    movedQualified: false,
    movedMeeting: false,
    movedProposal: false,
    movedNegotiation: false,
    movedWon: false
  });

  const steps = [
    {
      step: 1,
      title: 'Inbound Lead Ingestion (NovaCart)',
      desc: 'Receive prospective client inquiry from fast-growing D2C marketplace NovaCart processing 50k orders/month.',
      actionLabel: 'Ingest NovaCart Lead',
      run: () => {
        setJourneyState(s => ({ ...s, leadCreated: true }));
        showToast('Step 1 Complete: NovaCart Lead Ingested into database', 'success');
        setCurrentStep(2);
      }
    },
    {
      step: 2,
      title: 'AI Natural Language Requirement Extraction',
      desc: 'Analyze raw client brief: "Need OTP authentication and automated order notifications for a growing customer base."',
      actionLabel: 'Run AI Requirement Extraction',
      run: () => {
        setJourneyState(s => ({ ...s, aiAnalyzed: true }));
        showToast('Step 2 Complete: Extracted 2FA OTP + WhatsApp Order Notifications channels', 'success');
        setCurrentStep(3);
      }
    },
    {
      step: 3,
      title: 'AI Lead Qualification & Scoring',
      desc: 'Evaluate deal size (₹6.8L), vertical fit (E-commerce), urgency (High), and buying intent.',
      actionLabel: 'Calculate Lead Score (88/100)',
      run: () => {
        setJourneyState(s => ({ ...s, scored: true }));
        showToast('Step 3 Complete: Lead Score = 88/100 (HOT PRIORITY, 82% Win Prob)', 'success');
        setCurrentStep(4);
      }
    },
    {
      step: 4,
      title: 'CPaaS Solution Recommendation',
      desc: 'System compares requirements with the 9-product catalog and pairs OTP Messaging (94% match) with WhatsApp Business (91% match).',
      actionLabel: 'Match Solutions Catalog',
      run: () => {
        setJourneyState(s => ({ ...s, recommended: true }));
        showToast('Step 4 Complete: Recommended OTP Messaging & WhatsApp Business Solution', 'success');
        setCurrentStep(5);
      }
    },
    {
      step: 5,
      title: 'Generate Personalized Sales Pitch',
      desc: 'Produce bespoke Consultative Cold Email emphasizing 99.8% sub-5s delivery SLA and WhatsApp interactive buttons.',
      actionLabel: 'Generate Consultative Outreach',
      run: () => {
        setJourneyState(s => ({ ...s, pitchGenerated: true }));
        showToast('Step 5 Complete: Pitch generated and simulated outreach logged to timeline', 'success');
        setCurrentStep(6);
      }
    },
    {
      step: 6,
      title: 'Schedule Discovery Call & Product Demo',
      desc: 'Lock in technical architecture review with Head of Engineering Rohan Deshmukh on calendar.',
      actionLabel: 'Schedule 45-min Product Demo',
      run: () => {
        setJourneyState(s => ({ ...s, meetingScheduled: true }));
        showToast('Step 6 Complete: Discovery & Demo meeting confirmed on team calendar', 'success');
        setCurrentStep(7);
      }
    },
    {
      step: 7,
      title: 'Create Automated Follow-up Trigger',
      desc: 'Set high-priority reminder due within 24 hours to review custom tier pricing and carrier failover route benchmarks.',
      actionLabel: 'Set Next Sales Action',
      run: () => {
        setJourneyState(s => ({ ...s, followUpCreated: true }));
        showToast('Step 7 Complete: Follow-up registered in AI Follow-up Engine', 'success');
        setCurrentStep(8);
      }
    },
    {
      step: 8,
      title: 'Advance Opportunity: QUALIFIED → MEETING',
      desc: 'Move opportunity along Kanban board following successful discovery call.',
      actionLabel: 'Advance to Meeting Stage',
      run: () => {
        setJourneyState(s => ({ ...s, movedMeeting: true }));
        showToast('Step 8 Complete: Deal advanced to MEETING stage (60% win prob)', 'success');
        setCurrentStep(9);
      }
    },
    {
      step: 9,
      title: 'Deliver Formal Proposal & Move to NEGOTIATION',
      desc: 'Dispatch customized CPaaS pricing contract and move deal to Negotiation stage with economic buyers.',
      actionLabel: 'Advance to Negotiation Stage',
      run: () => {
        setJourneyState(s => ({ ...s, movedNegotiation: true }));
        showToast('Step 9 Complete: Deal advanced to NEGOTIATION (85% win prob)', 'success');
        setCurrentStep(10);
      }
    },
    {
      step: 10,
      title: 'Close Contract: CLOSED WON (₹6.8L)',
      desc: 'Client signs Master Service Agreement! Deal moves to CLOSED WON, updating dashboard won revenue.',
      actionLabel: 'Close Won Deal',
      run: () => {
        setJourneyState(s => ({ ...s, movedWon: true }));
        showToast('Step 10 Complete: CLOSED WON! ₹6.8L added to Revenue Dashboard', 'success');
      }
    }
  ];

  const handleResetJourney = () => {
    setCurrentStep(1);
    setJourneyState({
      leadCreated: false,
      aiAnalyzed: false,
      scored: false,
      recommended: false,
      pitchGenerated: false,
      meetingScheduled: false,
      followUpCreated: false,
      movedQualified: false,
      movedMeeting: false,
      movedProposal: false,
      movedNegotiation: false,
      movedWon: false
    });
    showToast('Interview walkthrough reset to step 1', 'info');
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Interview Demonstration Journey (NovaCart E-commerce)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              Guided 10-Step Scenario
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate a full end-to-end B2B telecom sales lifecycle from raw client requirement to closed won contract.
          </p>
        </div>

        <button
          onClick={handleResetJourney}
          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Scenario</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between text-xs mb-2 text-slate-300">
          <span className="font-semibold">Scenario Progress: Step {currentStep} of {steps.length}</span>
          <span className="font-mono font-bold text-emerald-400">
            {Math.round((currentStep / steps.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((st) => {
          const isDone = st.step < currentStep || (st.step === 10 && journeyState.movedWon);
          const isCurrent = st.step === currentStep && !(st.step === 10 && journeyState.movedWon);

          return (
            <div
              key={st.step}
              className={`p-4 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/30 shadow-lg'
                  : isDone
                  ? 'bg-slate-950/60 border-slate-800/80 opacity-80'
                  : 'bg-slate-950/30 border-slate-900 opacity-40'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isCurrent
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : st.step}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{st.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{st.desc}</p>
                  </div>
                </div>

                {isCurrent && (
                  <button
                    onClick={st.run}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 shadow-md flex items-center gap-1.5"
                  >
                    <span>{st.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {isDone && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {journeyState.movedWon && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-800/60 shadow-2xl text-center space-y-3 animate-in zoom-in-95">
          <Sparkles className="w-8 h-8 mx-auto text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Full Customer Sales Lifecycle Demonstrated!</h2>
          <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
            You have successfully demonstrated the entire enterprise B2B sales cycle: Lead Creation → AI Requirement Extraction → Qualification → CPaaS Matching → Outreach Pitch → Demo Meeting → Follow-up Cadence → Closed Won Revenue!
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md"
            >
              View Updated Dashboard
            </button>
            <button
              onClick={() => triggerOpenLead('lead-001')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
            >
              Open NovaCart Lead Profile (360°)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
