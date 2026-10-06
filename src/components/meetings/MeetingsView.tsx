import React, { useEffect, useState } from 'react';
import { CalendarCheck2, Clock, Users, Plus, CheckCircle2, Video, X } from 'lucide-react';
import { Meeting, MeetingType } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useApp } from '../../context/AppContext.js';

export const MeetingsView: React.FC = () => {
  const { showToast, triggerOpenLead } = useApp();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'ALL' | 'TODAY' | 'UPCOMING' | 'COMPLETED'>('ALL');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // New Meeting Form
  const [companyName, setCompanyName] = useState('NovaCart India Pvt Ltd');
  const [contactName, setContactName] = useState('Rohan Deshmukh');
  const [contactEmail, setContactEmail] = useState('rohan.d@novacart.in');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:30');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [meetingType, setMeetingType] = useState<MeetingType>('Product Demo');
  const [agenda, setAgenda] = useState('Live demonstration of OTP carrier routing, latency failover, and WhatsApp order notification webhooks.');

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const data = await api.getMeetings();
      setMeetings(data);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createMeeting({
        companyName,
        contactName,
        contactEmail,
        date,
        time,
        durationMinutes,
        meetingType,
        agenda,
        attendees: [contactName, 'Ammar Khan (Sales Exec)', 'Solutions Architect']
      });
      showToast('Meeting scheduled successfully', 'success');
      setShowScheduleModal(false);
      fetchMeetings();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredMeetings = meetings.filter(m => {
    if (filterTab === 'TODAY') return m.date === todayStr;
    if (filterTab === 'UPCOMING') return m.date > todayStr;
    if (filterTab === 'COMPLETED') return m.status === 'COMPLETED' || m.date < todayStr;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Meeting Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              {meetings.length} Total
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Coordinate discovery calls, technical deep-dives, and pricing negotiations with B2B stakeholders.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Meeting</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        {['ALL', 'TODAY', 'UPCOMING', 'COMPLETED'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterTab === tab
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500">Loading meetings...</div>
        ) : filteredMeetings.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">No meetings in this category.</div>
        ) : (
          filteredMeetings.map(m => {
            const isToday = m.date === todayStr;
            return (
              <div
                key={m.id}
                onClick={() => { if (m.leadId) triggerOpenLead(m.leadId); }}
                className={`p-4 rounded-xl border bg-slate-900/80 hover:border-indigo-500/50 cursor-pointer transition-all shadow-md space-y-3 ${
                  isToday ? 'border-indigo-500/80 ring-1 ring-indigo-500/40' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {m.meetingType}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    m.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {m.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{m.companyName}</h3>
                  <div className="text-xs text-slate-300 mt-0.5">{m.contactName} ({m.contactEmail})</div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{m.date} at {m.time} ({m.durationMinutes}m)</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <strong>Agenda:</strong> {m.agenda}
                </p>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Host: {m.assignedSalespersonName}</span>
                  <span className="text-indigo-400 font-medium">View Lead →</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-lg p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Schedule Discovery / Demo Call</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Key Attendee</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Meeting Type</label>
                  <select
                    value={meetingType}
                    onChange={(e) => setMeetingType(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Discovery Call">Discovery Call</option>
                    <option value="Product Demo">Product Demo</option>
                    <option value="Technical Discussion">Technical Discussion</option>
                    <option value="Pricing Discussion">Pricing Discussion</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Discussion Agenda</label>
                <textarea
                  rows={3}
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Schedule Call
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
