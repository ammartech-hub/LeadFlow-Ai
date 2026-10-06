import React from 'react';
import {
  LayoutDashboard,
  Users,
  GitBranch,
  Building2,
  CalendarCheck2,
  ClockAlert,
  Cpu,
  MailCheck,
  Layers,
  Target,
  BarChart3,
  TrendingUp,
  BrainCircuit,
  Compass,
  TestTube2,
  ChevronRight,
  Flame,
  Globe,
  X
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext.js';
import { useAuth } from '../../context/AuthContext.js';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, mobileSidebarOpen, setMobileSidebarOpen } = useApp();
  const { user } = useAuth();

  const coreNav: NavItem[] = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Lead Management', icon: Users, badge: '105' },
    { id: 'pipeline', label: 'Sales Pipeline', icon: GitBranch, badge: '₹42.6L' },
    { id: 'accounts', label: 'Customer Accounts', icon: Building2, badge: '30+' }
  ];

  const engagementNav: NavItem[] = [
    { id: 'meetings', label: 'Scheduled Meetings', icon: CalendarCheck2, badge: '32' },
    { id: 'followups', label: 'Follow-up Engine', icon: ClockAlert, badge: 'Due', badgeColor: 'bg-amber-500/20 text-amber-300' }
  ];

  const aiSalesNav: NavItem[] = [
    { id: 'requirement-analyzer', label: 'AI Requirement Studio', icon: Cpu, badge: 'AI', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
    { id: 'pitch-generator', label: 'AI Sales Pitch Generator', icon: MailCheck, badge: 'Multi-Tone' },
    { id: 'solutions', label: 'CPaaS Solutions Catalog', icon: Layers, badge: '9' }
  ];

  const intelligenceNav: NavItem[] = [
    { id: 'targets', label: 'Sales Targets & Quota', icon: Target },
    { id: 'analytics', label: 'Sales Analytics & Funnel', icon: BarChart3 },
    { id: 'forecasting', label: 'AI Sales Forecasting', icon: TrendingUp },
    { id: 'ml-prediction', label: 'ML Conversion Model', icon: BrainCircuit, badge: '86% Acc' }
  ];

  const portfolioNav: NavItem[] = [
    { id: 'interview-demo', label: 'Interview Demo Journey', icon: Compass, badge: 'Guided', badgeColor: 'bg-amber-500/20 text-amber-300' },
    { id: 'tests', label: 'System Verification Tests', icon: TestTube2, badge: 'Passed', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'landing', label: 'Public SaaS Landing Page', icon: Globe }
  ];

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-5">
      <div className="px-3 mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                if (mobileSidebarOpen) setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    isActive
                      ? 'bg-indigo-800 text-indigo-100'
                      : item.badgeColor || 'bg-slate-800 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Responsive Sidebar / Mobile Drawer */}
      <aside
        className={`bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 overflow-y-auto p-3 text-slate-300 transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen
            ? 'fixed inset-y-0 left-0 z-50 w-72 h-full shadow-2xl translate-x-0'
            : 'hidden lg:flex lg:w-64 lg:h-[calc(100vh-4rem)] lg:translate-x-0'
        }`}
      >
        <div>
          {/* Mobile Header with Close Button */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 lg:hidden">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation Menu
            </span>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {renderNavGroup('Core Workspace', coreNav)}
          {renderNavGroup('Engagement & Activity', engagementNav)}
          {renderNavGroup('AI CPaaS Sales Studio', aiSalesNav)}
          {renderNavGroup('Analytics & Intelligence', intelligenceNav)}
          {renderNavGroup('Portfolio & Testing', portfolioNav)}
        </div>

        {/* Monthly Quota Mini-Widget */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-300">October Quota Progress</span>
            <span className="text-[11px] font-bold text-emerald-400">62.7%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" style={{ width: '62.7%' }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>₹9.4L closed</span>
            <span className="text-slate-500">Target: ₹15.0L</span>
          </div>
        </div>
      </aside>
    </>
  );
};
