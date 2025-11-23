import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import NewNavigation from './components/NewNavigation';
import NewHome from './components/NewHome';
import ProductsComponent from './components/Products';
import ProductDetail from './components/ProductDetail';
import CartComponent from './components/Cart';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import Login from './components/Login';
import Footer from './components/Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import ProductsPage from './components/admin/products/ProductsPage';
import ProductForm from './components/admin/products/ProductForm';
import CategoriesPage from './components/admin/categories/CategoriesPage';
import OrdersPage from './components/admin/orders/OrdersPage';
import SettingsPage from './components/admin/SettingsPage';
import SettingsHomePage from './components/admin/settings/SettingsHomePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode, adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {/* Public Routes */}
      <Route path="/" element={<NewHome />} />
      <Route path="/products" element={<ProductsComponent />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cart" element={<CartComponent />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="users" element={<div>Users Page</div>} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/home" element={<SettingsHomePage />} />
      </Route>

      {/* Default route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <ToastProvider>
        <div className="flex flex-col min-h-screen bg-neutral-50">
          <NewNavigation />
          <main className="flex-grow pt-20">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;