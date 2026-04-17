import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ArtisanProfilePage } from './pages/ArtisanProfilePage';
import { ArtisanProductsPage } from './pages/ArtisanProductsPage';
import { ArtisanDashboardPage } from './pages/ArtisanDashboardPage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { PlaceOrderPage } from './pages/PlaceOrderPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ConsultantDashboardPage } from './pages/ConsultantDashboardPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { GlobalErrorBanner } from './components/GlobalErrorBanner';
import { GlobalToast } from './components/GlobalToast';
import './App.css';

function AppContent() {
  return (
    <div className="app">
      <Header />
      <GlobalErrorBanner />
      <GlobalToast />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute allowedRoles={['BUYER']}>
                <MarketplacePage />
              </ProtectedRoute>
            }
          />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/artisan/:id" element={<ArtisanProfilePage />} />
          <Route path="/artisan/:id/products" element={<ArtisanProductsPage />} />
          <Route
            path="/buyer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['BUYER']}>
                <BuyerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/place-order"
            element={
              <ProtectedRoute allowedRoles={['BUYER']}>
                <PlaceOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/artisan/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ARTISAN']}>
                <ArtisanDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consultant/dashboard"
            element={
              <ProtectedRoute allowedRoles={['CONSULTANT']}>
                <ConsultantDashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
