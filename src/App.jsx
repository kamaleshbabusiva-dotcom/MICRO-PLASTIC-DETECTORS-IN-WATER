import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MusicProvider } from './context/MusicContext';
import { LanguageProvider } from './context/LanguageContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import SocialPage from './pages/SocialPage';
import SafetyPage from './pages/SafetyPage';
import MusicPage from './pages/MusicPage';
import StatsPage from './pages/StatsPage';
import PlannerPage from './pages/PlannerPage';
import ScannerPage from './pages/ScannerPage';
import SpectroscopyPage from './pages/SpectroscopyPage';
import HardwareDemoPage from './pages/HardwareDemoPage';
import CitizenDashboard from './pages/CitizenDashboard';
import QuizPage from './pages/QuizPage';
import SystemArchitecturePage from './pages/SystemArchitecturePage';
import FamilyDashboard from './pages/FamilyDashboard';
import AICameraPage from './pages/AICameraPage';
import Layout from './components/Layout';

// Simple Router protector
const ProtectedRoute = ({ children }) => {
    const { user, isOnboarded, loading } = useAuth();

    if (loading) return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    if (!user) return <Navigate to="/login" replace />;
    if (!isOnboarded) return <Navigate to="/onboarding" replace />;

    return children;
};

const AuthGate = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return children;
    return <Navigate to="/" replace />;
};

const OnboardingGate = ({ children }) => {
    const { user, isOnboarded, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if (isOnboarded) return <Navigate to="/" replace />;
    return children;
};

const RoleGate = ({ children }) => {
    const { userRole } = useAuth();
    const [adminView, citizenView] = React.Children.toArray(children);
    return userRole === 'admin' ? adminView : citizenView;
};

const App = () => {
    return (
        <LanguageProvider>
            <AuthProvider>
                <MusicProvider>
                    <BrowserRouter>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/login" element={
                                <AuthGate>
                                    <LoginPage />
                                </AuthGate>
                            } />

                            {/* Register Route */}
                            <Route path="/register" element={
                                <AuthGate>
                                    <RegisterPage />
                                </AuthGate>
                            } />

                            {/* Onboarding Route */}
                            <Route path="/onboarding" element={
                                <OnboardingGate>
                                    <OnboardingPage />
                                </OnboardingGate>
                            } />

                            {/* Protected Routes with Layout */}
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <Layout />
                                </ProtectedRoute>
                            }>
                                <Route index element={
                                    <RoleGate>
                                        <DashboardPage />
                                        <CitizenDashboard />
                                    </RoleGate>
                                } />
                                <Route path="profile" element={<ProfilePage />} />
                                <Route path="leaderboard" element={<LeaderboardPage />} />
                                <Route path="social" element={<SocialPage />} />
                                <Route path="music" element={<MusicPage />} />
                                <Route path="stats" element={<StatsPage />} />
                                <Route path="safety" element={<SafetyPage />} />
                                <Route path="scanner" element={<ScannerPage />} />
                                <Route path="spectroscopy" element={<SpectroscopyPage />} />
                                <Route path="hardware-demo" element={<HardwareDemoPage />} />
                                <Route path="planner" element={<PlannerPage />} />
                                <Route path="quiz" element={<QuizPage />} />
                                <Route path="architecture" element={<SystemArchitecturePage />} />
                                <Route path="family" element={<FamilyDashboard />} />
                                <Route path="ai-camera" element={<AICameraPage />} />
                            </Route>

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </BrowserRouter>
                </MusicProvider>
            </AuthProvider>
        </LanguageProvider>
    );
};

export default App;
