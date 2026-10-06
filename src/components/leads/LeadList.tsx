import React, { useEffect, useState, useCallback } from 'react';
import {
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Flame,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ArrowUpDown,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Radio
} from 'lucide-react';
import { Lead, LeadStatus, LeadPriority, Industry, LeadSource } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useApp } from '../../context/AppContext.js';
import { useSupabase } from '../../lib/supabase.js';

interface LeadListProps {
  onOpenCreate: () => void;
  onSelectLead: (lead: Lead) => void;
  onOpenPitch: (lead: Lead) => void;
}

export const LeadList: React.FC<LeadListProps> = ({ onOpenCreate, onSelectLead, onOpenPitch }) => {
  const { showToast } = useApp();
  const { supabase, isConfigured } = useSupabase();
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [leadSource, setLeadSource] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Import modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJson, setImportJson] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getLeads({
        search,
        industry: industry !== 'ALL' ? industry : undefined,
        status: status !== 'ALL' ? status : undefined,
        priority: priority !== 'ALL' ? priority : undefined,
        leadSource: leadSource !== 'ALL' ? leadSource : undefined,
        sortBy,
        sortOrder,
        limit: pageSize,
        offset: (page - 1) * pageSize
      });
      setLeads(res.leads);
      setTotal(res.total);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [search, industry, status, priority, leadSource, sortBy, sortOrder, page, showToast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Subscribe to 'INSERT', 'UPDATE', and 'DELETE' events on the 'leads' table using Supabase realtime client
  useEffect(() => {
    if (!supabase || !isConfigured) return;

    const channel = supabase
      .channel('realtime:leads_events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads'
        },
        (payload) => {
          console.log('[Supabase Realtime] Leads INSERT event received:', payload);
          fetchLeads();
          showToast('New lead added (real-time sync)', 'info');
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'leads'
        },
        (payload) => {
          console.log('[Supabase Realtime] Leads UPDATE event received:', payload);
          fetchLeads();
          showToast('Lead updated (real-time sync)', 'info');
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'leads'
        },
        (payload) => {
          console.log('[Supabase Realtime] Leads DELETE event received:', payload);
          fetchLeads();
          showToast('Lead removed (real-time sync)', 'info');
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeConnected(true);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setRealtimeConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, isConfigured, fetchLeads, showToast]);

  const handleExportCsv = () => {
    window.location.href = '/api/leads/export/csv';
    showToast('Exported leads to CSV', 'success');
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importJson);
      const res = await api.importLeads(Array.isArray(parsed) ? parsed : [parsed]);
      showToast(`Imported ${res.count} leads successfully`, 'success');
      setShowImportModal(false);
      setImportJson('');
      fetchLeads();
    } catch (err: any) {
      showToast(`Import error: ${err.message}`, 'error');
    }
  };

  const handleDeleteLead = async (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Archive lead for ${lead.companyName}?`)) {
      try {
        await api.deleteLead(lead.id);
        showToast('Lead archived', 'info');
        fetchLeads();
      } catch (err: any) {
        showToast(err.message, 'error');
      }
    }
  };

  const getPriorityStyle = (p: LeadPriority) => {
    switch (p) {
      case 'HOT':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'WARM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'COLD':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getStatusStyle = (s: LeadStatus) => {
    switch (s) {
      case 'WON':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'LOST':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'NEGOTIATION':
      case 'PROPOSAL':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'MEETING':
      case 'QUALIFIED':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Lead Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              {total} Total Leads
            </span>
            {realtimeConnected && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Realtime Active</span>
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track prospective client requirements, AI score rankings, and communication deal stages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={onOpenCreate}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-3 text-xs">
        {/* Search */}
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by company, contact, requirement..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
          />
        </div>

        {/* Industry Filter */}
        <select
          value={industry}
          onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none text-xs"
        >
          <option value="ALL">All Industries</option>
          {['Banking', 'Fintech', 'E-commerce', 'Healthcare', 'EdTech', 'SaaS', 'Logistics', 'Retail', 'Telecom', 'Real Estate'].map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none text-xs"
        >
          <option value="ALL">All Stages</option>
          {['NEW', 'CONTACTED', 'QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'].map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={priority}
          onChange={(e) => { setPriority(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none text-xs"
        >
          <option value="ALL">All Priorities</option>
          <option value="HOT">HOT</option>
          <option value="WARM">WARM</option>
          <option value="COLD">COLD</option>
          <option value="LOW">LOW</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none text-xs"
        >
          <option value="createdAt">Sort: Created Date</option>
          <option value="estimatedDealValue">Sort: Deal Value</option>
          <option value="leadScore">Sort: Lead Score</option>
          <option value="conversionProbability">Sort: Conversion Prob</option>
        </select>

        <button
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
          title={`Order: ${sortOrder.toUpperCase()}`}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Leads Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/70">
                <th className="py-3 px-4">Company & Contact</th>
                <th className="py-3 px-3">Industry</th>
                <th className="py-3 px-3 text-right">Deal Value</th>
                <th className="py-3 px-3 text-center">AI Score</th>
                <th className="py-3 px-3 text-center">Priority</th>
                <th className="py-3 px-3 text-center">Stage</th>
                <th className="py-3 px-3">Next Action</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No leads found matching current filters.
                  </td>
                </tr>
              ) : (
                leads.map(lead => (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {lead.companyName}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{lead.contactName}</span>
                        <span>•</span>
                        <span>{lead.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                        {lead.industry}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      ₹{(lead.estimatedDealValue / 100000).toFixed(1)}L
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-mono font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                        {lead.leadScore}/100
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getPriorityStyle(lead.priority)}`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusStyle(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>Due {lead.nextFollowUpDate || 'Today'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenPitch(lead);
                          }}
                          title="Generate AI Pitch"
                          className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteLead(lead, e)}
                          title="Archive Lead"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-3 px-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{Math.min(total, (page - 1) * pageSize + 1)}</strong> to{' '}
            <strong className="text-white">{Math.min(total, page * pageSize)}</strong> of{' '}
            <strong className="text-white">{total}</strong> leads
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs text-slate-300">
              Page {page} of {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CSV / JSON Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-lg p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Import B2B Leads</h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <p className="text-slate-400">
              Paste JSON array of lead objects with companyName, contactName, email, industry, estimatedDealValue:
            </p>
            <textarea
              rows={6}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='[{"companyName": "TechCorp", "contactName": "Vikram", "email": "v@tech.com", "industry": "Fintech", "estimatedDealValue": 500000}]'
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 rounded text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
              >
                Upload Leads
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
