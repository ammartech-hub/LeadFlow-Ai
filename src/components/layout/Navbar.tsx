import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  RotateCcw,
  Plus,
  Shield,
  Briefcase,
  UserCheck,
  Check,
  ExternalLink,
  ChevronDown,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useApp } from '../../context/AppContext.js';
import { api } from '../../lib/api.js';

interface NavbarProps {
  onOpenCreateLead: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateLead }) => {
  const { user, users, switchRole, switchUserById } = useAuth();
  const {
    setIsSearchOpen,
    unreadNotifCount,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    showToast,
    demoModeActive,
    setDemoModeActive,
    setCurrentView,
    triggerOpenLead,
    setMobileSidebarOpen
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetDemo = async () => {
    if (confirm('Restore the demo workspace with fresh synthetic leads, deals, and activities?')) {
      setIsResetting(true);
      try {
        await api.resetDemo();
        showToast('Demo workspace restored to pristine synthetic state', 'success');
        window.location.reload();
      } catch (err: any) {
        showToast(err.message, 'error');
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-3 sm:px-6 bg-slate-900 border-b border-slate-800 text-slate-100">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                LeadFlow AI
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                CPaaS B2B
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden md:block">
              Sales Intelligence & Engagement
            </p>
          </div>
        </div>

        {/* Interview Demo Guided Walkthrough Button */}
        <button
          onClick={() => {
            setDemoModeActive(!demoModeActive);
            setCurrentView('interview-demo');
          }}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            demoModeActive
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white'
          }`}
          title="Guided interview demo workflow showcasing end-to-end sales lifecycle"
        >
          <span className={`w-2 h-2 rounded-full ${demoModeActive ? 'bg-amber-400 animate-ping' : 'bg-slate-400'}`} />
          <span>Interview Demo Mode</span>
        </button>
      </div>

      {/* Center Search Trigger */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs transition-colors group cursor-text"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
            <span>Search leads, companies, contacts, deals...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded border border-slate-700 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Add Lead */}
        <button
          onClick={onOpenCreateLead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Lead</span>
        </button>

        {/* Reset Demo Data */}
        <button
          onClick={handleResetDemo}
          disabled={isResetting}
          title="Reset database to initial synthetic demo state"
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
        >
          <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Notifications ({unreadNotifCount} unread)</span>
                {unreadNotifCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead()}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.leadId) triggerOpenLead(n.leadId);
                        setShowNotifMenu(false);
                      }}
                      className={`p-3 text-xs cursor-pointer hover:bg-slate-800/60 transition-colors ${
                        n.read ? 'opacity-60' : 'bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-200">{n.title}</span>
                        {n.priority === 'HIGH' && (
                          <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-bold">
                            URGENT
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role & User Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2.5 pl-2.5 pr-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-left transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
              {user?.name.slice(0, 2).toUpperCase() || 'AK'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-none">{user?.name || 'Ammar Khan'}</div>
              <div className="text-[10px] text-indigo-400 font-medium leading-none mt-1">
                {user?.role === 'ADMIN' ? 'Admin' : user?.role === 'SALES_MANAGER' ? 'Sales Manager' : 'Sales Executive'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3.5 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Demo User / Role
              </div>
              <div className="p-1 space-y-1">
                {users.map(u => {
                  const isCurrent = user?.id === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUserById(u.id);
                        setShowRoleMenu(false);
                        showToast(`Switched to ${u.name} (${u.role})`, 'info');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isCurrent ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-medium">
                          {u.role === 'ADMIN' ? <Shield className="w-3.5 h-3.5 text-purple-400" /> : u.role === 'SALES_MANAGER' ? <Briefcase className="w-3.5 h-3.5 text-blue-400" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>{u.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{u.title}</div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
              <div className="px-3 py-2 border-t border-slate-800 text-[11px] text-slate-500">
                Demo role simulation enabled for interview evaluation.
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
