import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

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

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Navbar and Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<CareerExplorerPage />} />
            <Route path="/careers" element={<CareerExplorerPage />} />
            <Route path="/careers/:slug" element={<CareerProfilePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>

          {/* Personalized Application with Sidebar and Topbar */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/roadmaps" element={<RoadmapsListPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;

