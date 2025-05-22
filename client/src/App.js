import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import RentPage from "./pages/RentPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary"; // Import ErrorBoundary
import EditProfilePage from "./pages/EditProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import PurchasesPage from "./pages/PurchasesPage";

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <Router>
        <ErrorBoundary>
          {" "}
          {/* Wrap components with ErrorBoundary */}
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/properties/:id"
                  element={<PropertyDetailPage />}
                />
                <Route path="/rent-your-place" element={<RentPage />} />
                <Route path="/dashboard" element={<UserDashboard />} />{" "}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/purchases" element={<PurchasesPage />} />
                <Route path="/profile/edit" element={<EditProfilePage />} />
                <Route
                  path="/profile/change-password"
                  element={<ChangePasswordPage />}
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
