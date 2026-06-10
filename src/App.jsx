import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { DonationProvider } from "./context/DonationContext";
import { DonationModal } from "./components/DonationModal";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useDonationModal } from "./context/DonationContext";
import { HomePage } from "./pages/HomePage";
import { UrgentNeedsPage } from "./pages/UrgentNeedsPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { DashboardAdmin } from "./pages/admin/DashboardAdmin";
import { MomentsAdmin } from "./pages/admin/MomentsAdmin";
import { BlogAdmin } from "./pages/admin/BlogAdmin";
import { DonationsAdmin } from "./pages/admin/DonationsAdmin";
import { PartnersAdmin } from "./pages/admin/PartnersAdmin";
import { SettingsAdmin } from "./pages/admin/SettingsAdmin";
import { ServicesAdmin } from "./pages/admin/ServicesAdmin";
import { TeamAdmin } from "./pages/admin/TeamAdmin";

function AppShell() {
  const { openDonation } = useDonationModal();

  return (
    <div className="min-h-screen bg-midnight text-white">
      <DonationModal />
      <div className="fixed inset-x-0 top-0 z-50">
        <Navbar />
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/urgent-needs" element={<UrgentNeedsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardAdmin />} />
          <Route path="moments" element={<MomentsAdmin />} />
          <Route path="blog" element={<BlogAdmin />} />
          <Route path="inquiries" element={<DonationsAdmin />} />
          <Route path="programmes" element={<ServicesAdmin />} />
          <Route path="team" element={<TeamAdmin />} />
          <Route path="partners" element={<PartnersAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>
      </Routes>

      <Footer openDonation={openDonation} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <DonationProvider>
        <AppShell />
      </DonationProvider>
    </ThemeProvider>
  );
}

export default App;
