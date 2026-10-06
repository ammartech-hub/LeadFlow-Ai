import React, { useState } from 'react';
import { SupabaseProvider } from './lib/supabase.js';
import { AuthProvider } from './context/AuthContext.js';
import { AppProvider, useApp } from './context/AppContext.js';
import { Navbar } from './components/layout/Navbar.js';
import { Sidebar } from './components/layout/Sidebar.js';
import { LandingPage } from './components/landing/LandingPage.js';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard.js';
import { LeadList } from './components/leads/LeadList.js';
import { CreateLeadModal } from './components/leads/CreateLeadModal.js';
import { LeadDetailModal } from './components/leads/LeadDetailModal.js';
import { KanbanPipeline } from './components/pipeline/KanbanPipeline.js';
import { AccountsView } from './components/accounts/AccountsView.js';
import { MeetingsView } from './components/meetings/MeetingsView.js';
import { FollowUpsView } from './components/followups/FollowUpsView.js';
import { RequirementAnalyzerStudio } from './components/ai/RequirementAnalyzerStudio.js';
import { PitchGeneratorStudio } from './components/ai/PitchGeneratorStudio.js';
import { SolutionsCatalogView } from './components/solutions/SolutionsCatalogView.js';
import { SalesTargetsView } from './components/targets/SalesTargetsView.js';
import { SalesAnalyticsView } from './components/analytics/SalesAnalyticsView.js';
import { SalesForecastingView } from './components/analytics/SalesForecastingView.js';
import { MlConversionView } from './components/analytics/MlConversionView.js';
import { InterviewDemoJourney } from './components/demo/InterviewDemoJourney.js';
import { SystemVerificationView } from './components/tests/SystemVerificationView.js';
import { GlobalSearchModal } from './components/search/GlobalSearchModal.js';
import { Lead } from './types/index.js';
import { LayoutDashboard, Users, GitBranch, Sparkles, Menu } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentView, setCurrentView, selectedLeadId, setSelectedLeadId, setMobileSidebarOpen } = useApp();
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [pitchLead, setPitchLead] = useState<Lead | null>(null);

  if (currentView === 'landing') {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar onOpenCreateLead={() => setShowCreateLead(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-slate-950 pb-20 lg:pb-0">
          {currentView === 'dashboard' && <ExecutiveDashboard />}
          {currentView === 'leads' && (
            <LeadList
              onOpenCreate={() => setShowCreateLead(true)}
              onSelectLead={(l) => setSelectedLeadId(l.id)}
              onOpenPitch={(l) => {
                setPitchLead(l);
                setCurrentView('pitch-generator');
              }}
            />
          )}
          {currentView === 'pipeline' && (
            <KanbanPipeline onOpenLeadDetail={(id) => setSelectedLeadId(id)} />
          )}
          {currentView === 'accounts' && <AccountsView />}
          {currentView === 'meetings' && <MeetingsView />}
          {currentView === 'followups' && <FollowUpsView />}
          {currentView === 'requirement-analyzer' && (
            <RequirementAnalyzerStudio
              onOpenPitchGenerator={() => setCurrentView('pitch-generator')}
            />
          )}
          {currentView === 'pitch-generator' && (
            <PitchGeneratorStudio initialLead={pitchLead} />
          )}
          {currentView === 'solutions' && <SolutionsCatalogView />}
          {currentView === 'targets' && <SalesTargetsView />}
          {currentView === 'analytics' && <SalesAnalyticsView />}
          {currentView === 'forecasting' && <SalesForecastingView />}
          {currentView === 'ml-prediction' && <MlConversionView />}
          {currentView === 'interview-demo' && <InterviewDemoJourney />}
          {currentView === 'tests' && <SystemVerificationView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around py-2 px-1 z-30 lg:hidden shadow-2xl">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentView === 'dashboard' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentView('leads')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentView === 'leads' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Leads</span>
        </button>

        <button
          onClick={() => setCurrentView('pipeline')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentView === 'pipeline' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitBranch className="w-5 h-5" />
          <span>Pipeline</span>
        </button>

        <button
          onClick={() => setCurrentView('requirement-analyzer')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            currentView === 'requirement-analyzer' || currentView === 'pitch-generator' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>AI Studio</span>
        </button>

        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium text-slate-400 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
          <span>More</span>
        </button>
      </nav>

      {/* Global Search Cmd+K */}
      <GlobalSearchModal />

      {/* Lead 360 Detail Modal */}
      {selectedLeadId && (
        <LeadDetailModal
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onOpenPitchGenerator={(l) => {
            setPitchLead(l);
            setSelectedLeadId(null);
            setCurrentView('pitch-generator');
          }}
          onOpenRequirementAnalyzer={(text) => {
            setSelectedLeadId(null);
            setCurrentView('requirement-analyzer');
          }}
        />
      )}

      {/* Create Lead Modal */}
      {showCreateLead && (
        <CreateLeadModal
          onClose={() => setShowCreateLead(false)}
          onLeadCreated={(newLead) => setSelectedLeadId(newLead.id)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <AppProvider>
          <MainAppContent />
        </AppProvider>
      </AuthProvider>
    </SupabaseProvider>
  );
}
