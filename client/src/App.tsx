import { useCallback, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RitualLoader from './components/RitualLoader';
import Landing from './pages/Landing';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
});

function shouldShowIntro(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return true;
}

export default function App() {
  const [introVisible, setIntroVisible] = useState(shouldShowIntro);

  const handleIntroDone = useCallback(() => {
    setIntroVisible(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          {introVisible && <RitualLoader onComplete={handleIntroDone} />}
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/"       element={<Landing />} />
              <Route path="/menu"   element={<Menu />} />
              <Route path="/cart"   element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/login"  element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin"  element={<Admin />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
