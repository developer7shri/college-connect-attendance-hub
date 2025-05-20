
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Layouts
import MainLayout from "@/components/Layout/MainLayout";

// Pages
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import HODDashboard from "@/pages/dashboard/HODDashboard";
import TeacherDashboard from "@/pages/dashboard/TeacherDashboard";
import StudentDashboard from "@/pages/dashboard/StudentDashboard";
import QRGenerator from "@/pages/QRGenerator";
import QRScanner from "@/pages/QRScanner";
import NotFound from "@/pages/NotFound";

// Mentoring Pages
import HODMentoring from "@/pages/mentoring/HODMentoring";
import TeacherMentoring from "@/pages/mentoring/TeacherMentoring";
import StudentMentoring from "@/pages/mentoring/StudentMentoring";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<MainLayout allowedRoles={["admin"]} />}>
              <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              {/* Add more admin routes here */}
            </Route>
            
            {/* HOD Routes */}
            <Route path="/hod" element={<MainLayout allowedRoles={["hod"]} />}>
              <Route path="" element={<Navigate to="/hod/dashboard" replace />} />
              <Route path="dashboard" element={<HODDashboard />} />
              <Route path="mentoring" element={<HODMentoring />} />
              {/* Add more HOD routes here */}
            </Route>
            
            {/* Teacher Routes */}
            <Route path="/teacher" element={<MainLayout allowedRoles={["teacher"]} />}>
              <Route path="" element={<Navigate to="/teacher/dashboard" replace />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="qr-generator" element={<QRGenerator />} />
              <Route path="mentoring" element={<TeacherMentoring />} />
              {/* Add more teacher routes here */}
            </Route>
            
            {/* Student Routes */}
            <Route path="/student" element={<MainLayout allowedRoles={["student"]} />}>
              <Route path="" element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="qr-scanner" element={<QRScanner />} />
              <Route path="mentoring" element={<StudentMentoring />} />
              {/* Add more student routes here */}
            </Route>
            
            {/* Generic role routes */}
            <Route path="/dashboard" element={<MainLayout />}>
              <Route path="" element={
                <Navigate to="/login" replace />
              } />
            </Route>

            {/* 404 - Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
