import React, { useEffect, useState } from 'react';
import { Building2, Globe, MapPin, Users, GitBranch, CalendarCheck2, ArrowRight } from 'lucide-react';
import { Company } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useApp } from '../../context/AppContext.js';

export const AccountsView: React.FC = () => {
  const { triggerOpenLead } = useApp();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [compDetails, setCompDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const data = await api.getCompanies();
        setCompanies(data);
        if (data.length > 0) {
          setSelectedCompId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCompanies();
  }, []);

  useEffect(() => {
    if (!selectedCompId) return;
    async function fetchCompDetails() {
      try {
        const res = await api.getCompanyById(selectedCompId!);
        setCompDetails(res);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCompDetails();
  }, [selectedCompId]);

  if (loading) return <div className="p-8 text-slate-500">Loading customer accounts...</div>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Customer & Account Management (360°)</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            {companies.length} Accounts
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Company-level relationship hierarchy, associated contacts, historical opportunities, and interaction logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Companies List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[75vh] overflow-y-auto">
          {companies.map(c => {
            const isSel = selectedCompId === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCompId(c.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSel
                    ? 'bg-slate-900 border-indigo-500 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs">{c.name}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {c.industry}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>{c.size}</span>
                  <span>•</span>
                  <span>{c.location}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Company 360 Profile (8 Cols) */}
        {compDetails && (
          <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 text-xs">
            {/* Header */}
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{compDetails.company.name}</h2>
                  <p className="text-slate-400 mt-1">{compDetails.company.description}</p>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-300 px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">
                  {compDetails.company.annualRevenueRange || '₹50Cr+'}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mt-3 text-slate-300 text-xs">
                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-slate-500" /> {compDetails.company.website}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {compDetails.company.location}</span>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-500" /> {compDetails.company.size}</span>
              </div>
            </div>

            {/* Key Contacts */}
            <div>
              <div className="font-bold text-white mb-2 text-xs uppercase tracking-wider text-slate-400">
                Key Decision Makers ({compDetails.contacts.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {compDetails.contacts.map((ct: any) => (
                  <div key={ct.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="font-bold text-white">{ct.name}</div>
                    <div className="text-[11px] text-indigo-400">{ct.designation}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{ct.email} • {ct.phone}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Leads & Deals */}
            <div>
              <div className="font-bold text-white mb-2 text-xs uppercase tracking-wider text-slate-400">
                Pipeline Deals ({compDetails.deals.length})
              </div>
              <div className="space-y-2">
                {compDetails.deals.map((dl: any) => (
                  <div
                    key={dl.id}
                    onClick={() => triggerOpenLead(dl.leadId)}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-bold text-white">{dl.title}</div>
                      <div className="text-[11px] text-slate-400">Assigned: {dl.assignedSalespersonName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-white">₹{(dl.value / 100000).toFixed(1)}L</div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                        {dl.stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div>
              <div className="font-bold text-white mb-2 text-xs uppercase tracking-wider text-slate-400">
                Relationship History ({compDetails.activities.length} Events)
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {compDetails.activities.slice(0, 5).map((act: any) => (
                  <div key={act.id} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                      <span className="font-semibold text-slate-300">{act.type} • {act.userName}</span>
                      <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-300">{act.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
