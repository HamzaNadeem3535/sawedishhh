import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './src/components/ProtectedRoute';
import { getDefaultRoute } from './src/utils/permissions';
import { LandingPage } from './src/pages/LandingPage';
import { FoundationRegistrationPage } from './src/pages/FoundationRegistrationPage';
import { RegistrationCompletePage } from './src/pages/RegistrationCompletePage';
import { LimitedDashboardPage } from './src/pages/LimitedDashboardPage';
import { AuthLayout } from './src/layouts/AuthLayout';
import { AppLayout } from './src/layouts/AppLayout';
import { LimitedLayout } from './src/layouts/LimitedLayout';
import { LoginPage } from './src/pages/LoginPage';
import { RegisterPage } from './src/pages/RegisterPage';
import { DashboardPage } from './src/pages/DashboardPage';
import { ManagerDashboardPage } from './src/pages/ManagerDashboardPage';
import { FoundationsPage } from './src/pages/FoundationsPage';
import { AccessDeniedPage } from './src/pages/AccessDeniedPage';
import { FoundationDetailsPage } from './src/pages/FoundationDetailsPage';
import { FoundationForm } from './src/components/FoundationForm';
import { DocumentsPage } from './src/pages/DocumentsPage';
import { MeetingsPage } from './src/pages/MeetingsPage';
import { ExpensesPage } from './src/pages/ExpensesPage';
import { InvestmentsPage } from './src/pages/InvestmentsPage';
import { ProjectsPage } from './src/pages/ProjectsPage';
import { GrantsPage } from './src/pages/GrantsPage';
import { ProfilePage } from './src/pages/ProfilePage';
import { SettingsPage } from './src/pages/SettingsPage';
import { ReportsPage } from './src/pages/ReportsPage';
import { GovernancePage } from './src/pages/GovernancePage';
import { FinancialPage } from './src/pages/FinancialPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLimitedAccess, setIsLimitedAccess] = useState(false);
  //const [foundationVerified, setFoundationVerified] = useState(false);
  const [userRole, setUserRole] = useState<string>('member');

  const handleLogin = (role?: string) => {
    setIsAuthenticated(true);
    setUserRole(role || 'member');
    
    // All authenticated users get full access based on their role
    //setFoundationVerified(true);
    setIsLimitedAccess(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsLimitedAccess(false);
    //setFoundationVerified(false);
    setUserRole('member');
  };

  const handleFoundationSubmit = (data: any) => {
    console.log('Foundation data:', data);
    // This would normally send data to the backend
  };

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRoute(userRole)} replace />
            ) : (
              <LandingPage />
            )
          }
        />

        {/* Foundation Registration */}
        <Route
          path="/register-foundation"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <FoundationRegistrationPage />
            )
          }
        />

        <Route
          path="/registration-complete"
          element={<RegistrationCompletePage />}
        />

        {/* Limited Access Routes */}
        <Route
          path="/dashboard-limited"
          element={
            isAuthenticated && isLimitedAccess ? (
              <LimitedLayout onLogout={handleLogout}>
                <LimitedDashboardPage />
              </LimitedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRoute(userRole)} replace />
            ) : (
              <AuthLayout>
                <LoginPage onLogin={handleLogin} />
              </AuthLayout>
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRoute(userRole)} replace />
            ) : (
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="dashboard" userRole={userRole}>
                <AppLayout onLogout={handleLogout}>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/manager-dashboard"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="manager-dashboard" userRole={userRole}>
                <AppLayout onLogout={handleLogout}>
                  <ManagerDashboardPage />
                </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/foundations"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="foundations" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <FoundationsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/foundations/new"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="foundations" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <FoundationForm onSubmit={handleFoundationSubmit} />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/foundations/:id"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="foundations" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <FoundationDetailsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/foundations/:id/edit"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="foundations" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <FoundationForm onSubmit={handleFoundationSubmit} />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/governance"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="governance" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <GovernancePage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/financial"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="financial" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                <FinancialPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/documents"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="documents" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <DocumentsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/meetings"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="meetings" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <MeetingsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/expenses"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="expenses" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <ExpensesPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/investments"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="investments" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <InvestmentsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/projects"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="projects" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <ProjectsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/grants"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="grants" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <GrantsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="profile" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <ProfilePage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="settings" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <SettingsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/reports"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="reports" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <ReportsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        {/* Catch-all route for unauthorized access */}
        <Route
          path="/access-denied"
          element={<AccessDeniedPage />}
        />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRoute(userRole)} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;