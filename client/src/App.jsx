import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

import AppNavbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';

// Pages
import Home from './pages/Home.jsx';
import Marketplace from './pages/Marketplace.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Livestock from './pages/Livestock.jsx';
import LivestockDetail from './pages/LivestockDetail.jsx';
import Rentals from './pages/Rentals.jsx';
import RentalDetail from './pages/RentalDetail.jsx';
import Lands from './pages/Lands.jsx';
import LandDetail from './pages/LandDetail.jsx';
import Fertilizers from './pages/Fertilizers.jsx';
import AiDiseaseFinder from './pages/AiDiseaseFinder.jsx';
import KnowledgeHub from './pages/KnowledgeHub.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import Community from './pages/Community.jsx';
import WeatherMarket from './pages/WeatherMarket.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import CreateListing from './pages/CreateListing.jsx';
import NotFound from './pages/NotFound.jsx';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CartProvider>
          <Router>
            <div className="d-flex flex-column min-vh-100">
              <AppNavbar />
              <main className="flex-grow-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/livestock" element={<Livestock />} />
                  <Route path="/livestock/:id" element={<LivestockDetail />} />
                  <Route path="/rentals" element={<Rentals />} />
                  <Route path="/rentals/:id" element={<RentalDetail />} />
                  <Route path="/lands" element={<Lands />} />
                  <Route path="/lands/:id" element={<LandDetail />} />
                  <Route path="/fertilizers" element={<Fertilizers />} />
                  <Route path="/ai-doctor" element={<AiDiseaseFinder />} />
                  <Route path="/knowledge" element={<KnowledgeHub />} />
                  <Route path="/knowledge/:slug" element={<ArticleDetail />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/weather" element={<WeatherMarket />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Authenticated Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-listing"
                    element={
                      <ProtectedRoute>
                        <CreateListing />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Catch-All */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;

