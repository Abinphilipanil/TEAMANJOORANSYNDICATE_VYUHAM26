import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Existing Team Pages
import { CareerExplorerPage } from './pages/CareerExplorerPage';
import { CareerProfilePage } from './pages/CareerProfilePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { ProgressPage } from './pages/ProgressPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { ProfilePage } from './pages/ProfilePage';
import { RoadmapsListPage } from './pages/RoadmapsListPage';

// Integrated CareerAgent Pages
import { HomePage } from './pages/HomePage';
import { ResumeAnalysisPage } from './pages/ResumeAnalysisPage';
import { AnalysisResultsPage } from './pages/AnalysisResultsPage';
import { JobMatchingPage } from './pages/JobMatchingPage';
import { SkillGapsPage } from './pages/SkillGapsPage';
import { LearningRoadmapPage } from './pages/LearningRoadmapPage';
import { SavedPage } from './pages/SavedPage';
import { SettingsPage } from './pages/SettingsPage';
import { HackathonsPage } from './pages/HackathonsPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Main CareerAgent Application Shell (Sidebar + Topbar + Dashboard Body) */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/resume-analysis" element={<ResumeAnalysisPage />} />
            <Route path="/analysis-results" element={<AnalysisResultsPage />} />
            <Route path="/careers" element={<CareerExplorerPage />} />
            <Route path="/careers/:slug" element={<CareerProfilePage />} />
            <Route path="/job-matching" element={<JobMatchingPage />} />
            <Route path="/hackathons" element={<HackathonsPage />} />
            <Route path="/skill-gaps" element={<SkillGapsPage />} />
            <Route path="/learning-roadmap" element={<LearningRoadmapPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/roadmaps" element={<RoadmapsListPage />} />
            <Route path="/track-overview" element={<DashboardPage />} />
          </Route>

          {/* Standalone Team Public Pages with PublicLayout (Navbar & Footer) */}
          <Route element={<PublicLayout />}>
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
