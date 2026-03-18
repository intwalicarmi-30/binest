import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminMemberDetail from "./pages/admin/AdminMemberDetail";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminContributions from "./pages/admin/AdminContributions";
import AdminAddPayment from "./pages/admin/AdminAddPayment";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

import MemberDashboard from "./pages/member/MemberDashboard";
import MemberContributions from "./pages/member/MemberContributions";
import MemberTransactions from "./pages/member/MemberTransactions";
import MemberProgress from "./pages/member/MemberProgress";
import MemberNotifications from "./pages/member/MemberNotifications";
import MemberProfile from "./pages/member/MemberProfile";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><DashboardLayout role="admin" /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="members" element={<AdminMembers />} />
              <Route path="members/:id" element={<AdminMemberDetail />} />
              <Route path="contributions" element={<AdminContributions />} />
              <Route path="add-payment" element={<AdminAddPayment />} />
              <Route path="transactions" element={<AdminTransactions />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Member */}
            <Route path="/member" element={<ProtectedRoute requiredRole="member"><DashboardLayout role="member" /></ProtectedRoute>}>
              <Route index element={<MemberDashboard />} />
              <Route path="contributions" element={<MemberContributions />} />
              <Route path="transactions" element={<MemberTransactions />} />
              <Route path="progress" element={<MemberProgress />} />
              <Route path="notifications" element={<MemberNotifications />} />
              <Route path="profile" element={<MemberProfile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
