import React, { useState } from 'react';
import { X, Sparkles, Plus, Building2, User, Mail, Phone, DollarSign, Globe } from 'lucide-react';
import { Lead, Industry, LeadSource } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useApp } from '../../context/AppContext.js';

interface CreateLeadModalProps {
  onClose: () => void;
  onLeadCreated: (newLead: Lead) => void;
}

export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({ onClose, onLeadCreated }) => {
  const { showToast } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analyzingAI, setAnalyzingAI] = useState(false);

  // Form Fields
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [industry, setIndustry] = useState<Industry>('E-commerce');
  const [companySize, setCompanySize] = useState('100-250 employees');
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [website, setWebsite] = useState('https://');
  const [leadSource, setLeadSource] = useState<LeadSource>('Inbound');
  const [businessRequirement, setBusinessRequirement] = useState('');
  const [estimatedDealValue, setEstimatedDealValue] = useState(650000);
  const [leadScore, setLeadScore] = useState(82);
  const [notes, setNotes] = useState('');

  // AI autofill helper
  const handleAutoAnalyze = async () => {
    if (!businessRequirement.trim()) {
      showToast('Please type a client requirement first', 'info');
      return;
    }
    setAnalyzingAI(true);
    try {
      const res = await api.analyzeRequirement(businessRequirement);
      if (res.industry) setIndustry(res.industry as any);
      if (res.estimatedCommunicationVolume.includes('Enterprise')) {
        setEstimatedDealValue(1200000);
        setLeadScore(94);
      } else if (res.estimatedCommunicationVolume.includes('High')) {
        setEstimatedDealValue(750000);
        setLeadScore(88);
      }
      showToast(`AI extracted industry (${res.industry}) and estimated volume`, 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setAnalyzingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName || !email) {
      showToast('Please fill company, contact, and email', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const newLead = await api.createLead({
        companyName,
        contactName,
        email,
        phone,
        industry,
        companySize,
        location,
        website,
        leadSource,
        businessRequirement: businessRequirement || 'Requirement discussion scheduled during initial discovery call.',
        estimatedDealValue: Number(estimatedDealValue),
        leadScore: Number(leadScore),
        status: 'NEW',
        notes
      });
      showToast(`Lead created for ${newLead.companyName}`, 'success');
      onLeadCreated(newLead);
      onClose();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create New B2B Lead</h2>
              <p className="text-xs text-slate-400">Ingest prospect requirement & evaluate CPaaS qualification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Quick Demo Pre-fill */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40">
            <span className="text-slate-300">Quick template:</span>
            <button
              type="button"
              onClick={() => {
                setCompanyName('NovaCart India');
                setContactName('Rohan Deshmukh');
                setEmail('rohan.d@novacart.in');
                setPhone('+91 98201 44321');
                setIndustry('E-commerce');
                setWebsite('https://novacart.in');
                setBusinessRequirement('We are an e-commerce platform processing around 50,000 OTP requests every month. We also want WhatsApp order notifications and automated customer updates.');
                setEstimatedDealValue(680000);
                setLeadScore(88);
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px] underline"
            >
              Fill Sample E-commerce Lead (NovaCart)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Apex FinTech Solutions"
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Primary Contact Name *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Work Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="r.sharma@apexfintech.in"
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Industry Vertical</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as Industry)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none"
              >
                {['Banking', 'Fintech', 'E-commerce', 'Healthcare', 'EdTech', 'SaaS', 'Logistics', 'Retail', 'Telecom', 'Real Estate'].map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Lead Source</label>
              <select
                value={leadSource}
                onChange={(e) => setLeadSource(e.target.value as LeadSource)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none"
              >
                {['LinkedIn', 'Website', 'Referral', 'Cold Email', 'Event', 'Inbound', 'Advertisement', 'Partner'].map(src => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Deal Value (₹ INR)</label>
              <input
                type="number"
                step="10000"
                value={estimatedDealValue}
                onChange={(e) => setEstimatedDealValue(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Business Requirement & AI Helper */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-medium">Customer Business Requirement</label>
              <button
                type="button"
                onClick={handleAutoAnalyze}
                disabled={analyzingAI}
                className="text-indigo-400 hover:text-indigo-300 text-[11px] font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>{analyzingAI ? 'Analyzing...' : 'AI Extract & Score'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={businessRequirement}
              onChange={(e) => setBusinessRequirement(e.target.value)}
              placeholder="e.g. Processing 50k OTPs monthly for mobile login. Experiencing SMS delivery delays during peak flash sales. Want WhatsApp order confirmation automation..."
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Creating Lead...' : 'Create Lead & Pipeline Deal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
