import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

import Dashboard from "./pages/Dashboard";
import CreateEntryPage from "./pages/CreateEntryPage";
import EditEntryPage from "./pages/EditEntryPage";
import ProfilePage from "./pages/ProfilePage";
import JournalPage from "./pages/JournalPage";
import EntryDetailsPage from "./pages/EntryDetailsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SettingsPage from "./pages/SettingsPage";
import MainLayout from "./layouts/MainLayout";

import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes: no application sidebar */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Protected application routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/profile" element={<ProfilePage />} />

              <Route path="/settings" element={<SettingsPage />} />

              <Route path="/journal" element={<JournalPage />} />

              <Route
                path="/learning-entries/:id"
                element={<EntryDetailsPage />}
              />

              <Route
                path="/learning-entries/new"
                element={<CreateEntryPage />}
              />

              <Route
                path="/learning-entries/:id/edit"
                element={<EditEntryPage />}
              />
            </Route>
          </Route>

          {/* Unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
