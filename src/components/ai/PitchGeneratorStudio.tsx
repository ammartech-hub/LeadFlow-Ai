import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Send,
  RefreshCw,
  Mail,
  Linkedin,
  MessageSquare,
  Calendar,
  FileText,
  User,
  Building2,
  SlidersHorizontal
} from 'lucide-react';
import { Lead } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.js';
import { useApp } from '../../context/AppContext.js';

interface PitchGeneratorStudioProps {
  initialLead?: Lead | null;
}

export const PitchGeneratorStudio: React.FC<PitchGeneratorStudioProps> = ({ initialLead }) => {
  const { user } = useAuth();
  const { showToast } = useApp();

  const [company, setCompany] = useState(initialLead?.companyName || 'NovaCart India');
  const [industry, setIndustry] = useState<string>(initialLead?.industry || 'E-commerce');
  const [contactName, setContactName] = useState(initialLead?.contactName || 'Rohan Deshmukh');
  const [salespersonName, setSalespersonName] = useState(user?.name || 'Ammar Khan');
  const [recommendedSolution, setRecommendedSolution] = useState(
    initialLead?.recommendedSolutionIds?.length ? 'OTP Messaging & WhatsApp Business' : 'OTP Messaging'
  );
  const [requirement, setRequirement] = useState(
    initialLead?.businessRequirement ||
    'Processing 50k OTPs monthly for online login. Seeking WhatsApp order notifications and carrier deliverability SLA guarantees.'
  );

  const [channel, setChannel] = useState<'Cold Email' | 'Follow-up Email' | 'LinkedIn' | 'WhatsApp' | 'Meeting Invitation' | 'Proposal Follow-up'>('Cold Email');
  const [tone, setTone] = useState<'Professional' | 'Friendly' | 'Consultative' | 'Persuasive' | 'Concise'>('Consultative');

  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.generateSalesPitch({
        company,
        industry,
        requirement,
        recommendedSolution,
        contactName,
        salespersonName,
        channel,
        tone
      });
      setSubject(res.subject || '');
      setContent(res.content || '');
      showToast(`Generated ${tone} ${channel} pitch`, 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const fullText = subject ? `Subject: ${subject}\n\n${content}` : content;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    showToast('Copied pitch to clipboard', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLogOutreach = async () => {
    if (!content) return;
    try {
      await api.createCommunication({
        leadId: initialLead?.id,
        companyName: company,
        contactName: contactName,
        channel: channel.includes('Email') ? 'Email' : channel.includes('LinkedIn') ? 'LinkedIn' : channel.includes('WhatsApp') ? 'WhatsApp' : 'Call',
        subject: subject,
        content: content
      });
      showToast(`Logged ${channel} dispatch to communication timeline (Simulated)`, 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>AI Sales Pitch & Outreach Generator</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Multi-Channel Engine
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Generate hyper-relevant B2B telecom outreach copy based on buyer requirement, SLA guarantees, and selected communication tone.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 text-xs">
          <div className="font-bold text-slate-200 text-sm mb-1">Prospect & Context Parameters</div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Company Name</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Contact Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Sales Rep Name</label>
              <input
                type="text"
                value={salespersonName}
                onChange={(e) => setSalespersonName(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Recommended Solution</label>
            <select
              value={recommendedSolution}
              onChange={(e) => setRecommendedSolution(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
            >
              <option value="OTP Messaging">OTP Messaging (Dedicated 2FA Routes)</option>
              <option value="WhatsApp Business Communication">WhatsApp Business Communication (Verified Bot)</option>
              <option value="SMS API">SMS API (Direct Telecom Carrier Gateway)</option>
              <option value="AI Voice Agent">AI Voice Agent (Autonomous Outbound Calling)</option>
              <option value="Cloud Communication">Cloud Communication (Virtual Number Masking)</option>
              <option value="Transactional Messaging">Transactional Messaging (Webhook Events)</option>
              <option value="Omnichannel Messaging">Omnichannel Messaging (Unified API)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Customer Business Problem / Requirement</label>
            <textarea
              rows={3}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
            />
          </div>

          {/* Channel Selector */}
          <div>
            <label className="block text-slate-400 font-semibold mb-2">Outreach Channel</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                'Cold Email',
                'Follow-up Email',
                'LinkedIn',
                'WhatsApp',
                'Meeting Invitation',
                'Proposal Follow-up'
              ].map(ch => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setChannel(ch as any)}
                  className={`p-2 rounded-lg text-left text-xs font-medium border transition-colors ${
                    channel === ch
                      ? 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-slate-400 font-semibold mb-2">Pitch Tone</label>
            <div className="flex flex-wrap gap-1.5">
              {['Consultative', 'Professional', 'Persuasive', 'Friendly', 'Concise'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    tone === t
                      ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all mt-2"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Crafting Outreach...' : `Generate ${tone} ${channel}`}</span>
          </button>
        </div>

        {/* Right Output: Generated Pitch with Inline Editing (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between text-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Generated Sales Communication</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono">
                  {channel} • {tone}
                </span>
              </div>

              {content && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {!content && !loading ? (
              <div className="py-24 text-center text-slate-500 space-y-3">
                <Sparkles className="w-8 h-8 mx-auto text-slate-600" />
                <p>Click "Generate" to create a bespoke pitch tailored to {company}.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {subject !== '' && (
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1 font-semibold">Subject Line (Editable):</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-semibold">Message Body (Editable):</label>
                  <textarea
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed font-sans text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          {content && (
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Salesperson can edit text directly prior to simulated logging.
              </span>
              <button
                onClick={handleLogOutreach}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-md transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Record Outreach to Timeline</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
