import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import RegisterForm from "./components/auth/RegisterForm";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import SkillsPage from "./pages/SkillsPage";
import MatchesPage from "./pages/MatchesPage";
import ChatPage from "./pages/ChatPage";
import ReviewsPage from "./pages/ReviewsPage";
import ReviewPage from "./pages/ReviewPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./components/admin/UserManagement";
import ReviewManagement from "./components/admin/ReviewManagement";
import SkillManagement from "./components/admin/SkillManagement";
import StatsOverview from "./components/admin/StatsOverview";
import UserDetailPage from "./pages/UserDetailPage";
import { SocketProvider } from "./contexts/SocketContext";
import UserReviewsPage from "./pages/UserReviewsPage";

export default function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Protected Routes wrapped inside layout */}
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="matches" element={<MatchesPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="/chat/:userId" element={<ChatPage />} />
            <Route path="chat/match/:matchId" element={<ChatPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="review/:matchId" element={<ReviewPage />} />
            <Route path="user/:id" element={<UserDetailPage />} />
            <Route path="user/:userId/reviews" element={<UserReviewsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="reviews" element={<ReviewManagement />} />
            <Route path="skills" element={<SkillManagement />} />
            <Route path="stats" element={<StatsOverview />} />
          </Route>
        </Routes>
      </Router>
    </SocketProvider>
  );
}
