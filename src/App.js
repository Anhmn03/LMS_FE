import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AdminDataProvider } from "./context/AdminDataContext";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import OtpVerification from "./pages/auth/OtpVerification";
import Dashboard from "./pages/dashboard/Dashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";

const App = () => {
  return (
    <AuthProvider>
      <AdminDataProvider>
        <Router>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="/student/dashboard" element={<Dashboard />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/*" element={<TeacherDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/teachers" element={<AdminDashboard />} />
            <Route path="/students" element={<AdminDashboard />} />
            <Route path="/courses" element={<AdminDashboard />} />
            <Route path="/revenue" element={<AdminDashboard />} />
            <Route path="/categories" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </AdminDataProvider>
    </AuthProvider>
  );
};

export default App;
