import React, { useState, useEffect } from 'react';
import { Search, X, Building2, User, GitBranch, Users, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useApp } from '../../context/AppContext.js';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, triggerOpenLead } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>({
    leads: [],
    companies: [],
    contacts: [],
    deals: [],
    activities: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ leads: [], companies: [], contacts: [], deals: [], activities: [] });
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.search(query);
        setResults(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, companies, contacts, deals, requirements..."
            className="flex-1 bg-transparent text-white text-sm focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          {loading && (
            <div className="py-8 text-center text-slate-500">Searching database...</div>
          )}

          {!loading && !query && (
            <div className="py-8 text-center text-slate-500">
              Type a company name, prospect, or requirement keyword to search.
            </div>
          )}

          {!loading && query && results.leads.length === 0 && results.companies.length === 0 && results.deals.length === 0 && (
            <div className="py-8 text-center text-slate-500">
              No results found for "{query}".
            </div>
          )}

          {/* Leads */}
          {results.leads.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Leads ({results.leads.length})
              </div>
              <div className="space-y-1.5">
                {results.leads.map((l: any) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      triggerOpenLead(l.id);
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/50 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-bold text-white">{l.companyName}</div>
                      <div className="text-[11px] text-slate-400">{l.contactName} • {l.industry}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-emerald-400 font-semibold">₹{(l.estimatedDealValue / 100000).toFixed(1)}L</div>
                      <span className="text-[10px] text-slate-400">{l.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Companies */}
          {results.companies.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Companies ({results.companies.length})
              </div>
              <div className="space-y-1.5">
                {results.companies.map((c: any) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">{c.name}</div>
                      <div className="text-[11px] text-slate-400">{c.industry} • {c.location}</div>
                    </div>
                    <span className="text-slate-400 text-[11px]">{c.size}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deals */}
          {results.deals.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Deals ({results.deals.length})
              </div>
              <div className="space-y-1.5">
                {results.deals.map((d: any) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      triggerOpenLead(d.leadId);
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/50 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">{d.title}</div>
                      <div className="text-[11px] text-slate-400">{d.companyName}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-white font-semibold">₹{(d.value / 100000).toFixed(1)}L</span>
                      <div className="text-[10px] text-indigo-400">{d.stage}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
