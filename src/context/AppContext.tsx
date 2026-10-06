import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead, NotificationItem } from '../types/index.js';
import { api } from '../lib/api.js';

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'leads'
  | 'pipeline'
  | 'accounts'
  | 'meetings'
  | 'followups'
  | 'requirement-analyzer'
  | 'pitch-generator'
  | 'solutions'
  | 'targets'
  | 'analytics'
  | 'forecasting'
  | 'ml-prediction'
  | 'interview-demo'
  | 'tests';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  unreadNotifCount: number;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  demoModeActive: boolean;
  setDemoModeActive: (active: boolean) => void;
  triggerOpenLead: (leadId: string) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [demoModeActive, setDemoModeActive] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Keyboard shortcut for Cmd+K / Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const markNotificationRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const triggerOpenLead = (leadId: string) => {
    setSelectedLeadId(leadId);
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedLeadId,
        setSelectedLeadId,
        isSearchOpen,
        setIsSearchOpen,
        notifications,
        unreadNotifCount,
        refreshNotifications: fetchNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        toasts,
        showToast,
        demoModeActive,
        setDemoModeActive,
        triggerOpenLead,
        mobileSidebarOpen,
        setMobileSidebarOpen
      }}
    >
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg border text-sm font-medium flex items-center gap-2.5 transition-all transform animate-in fade-in slide-in-from-bottom-2 ${
              t.type === 'success'
                ? 'bg-emerald-950 border-emerald-800 text-emerald-200'
                : t.type === 'error'
                ? 'bg-rose-950 border-rose-800 text-rose-200'
                : 'bg-slate-900 border-slate-700 text-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
