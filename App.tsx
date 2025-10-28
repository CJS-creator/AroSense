import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { FamilyPage } from './pages/FamilyPage';
import { FamilyMemberDetailPage } from './pages/FamilyMemberDetailPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { PrescriptionsPage } from './pages/PrescriptionsPage';
import { WellnessPage } from './pages/WellnessPage';
import { PregnancyTrackerPage } from './pages/PregnancyTrackerPage';
import { SettingsPage } from './pages/SettingsPage';
import { InsuranceBillingPage } from './pages/InsuranceBillingPage';
import { ImageAnalyzerPage } from './pages/ImageAnalyzerPage';
import { ToastProvider } from './components/toast/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { FamilyProvider } from './contexts/FamilyContext';
import { HealthRecordsProvider } from './contexts/HealthRecordsContext';
import { FinancialProvider } from './contexts/FinancialContext';
import { WellnessProvider } from './contexts/WellnessContext';
import { PregnancyProvider } from './contexts/PregnancyContext';
import { SettingsProvider } from './contexts/SettingsContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <UserProvider>
          <FamilyProvider>
            <HealthRecordsProvider>
              <FinancialProvider>
                <WellnessProvider>
                  <PregnancyProvider>
                    <SettingsProvider>
                      <HashRouter>
                        <Routes>
                          <Route path="/" element={<Layout><Outlet /></Layout>}>
                            <Route index element={<DashboardPage />} />
                            <Route path="family" element={<FamilyPage />} />
                            <Route path="family/:memberId" element={<FamilyMemberDetailPage />} />
                            <Route path="emergency" element={<EmergencyPage />} />
                            <Route path="documents" element={<DocumentsPage />} />
                            <Route path="prescriptions" element={<PrescriptionsPage />} />
                            <Route path="wellness" element={<WellnessPage />} />
                            <Route path="pregnancy" element={<PregnancyTrackerPage />} />
                            <Route path="insurance" element={<InsuranceBillingPage />} />
                            <Route path="analyzer" element={<ImageAnalyzerPage />} />
                            <Route path="settings" element={<SettingsPage />} />
                          </Route>
                        </Routes>
                      </HashRouter>
                    </SettingsProvider>
                  </PregnancyProvider>
                </WellnessProvider>
              </FinancialProvider>
            </HealthRecordsProvider>
          </FamilyProvider>
        </UserProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;