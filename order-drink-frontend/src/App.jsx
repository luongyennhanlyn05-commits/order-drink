import React, { useState, useEffect } from 'react';
import { SocketProvider } from './context/SocketContext';
import { CartProvider } from './context/CartContext';
import { StoreSettingsProvider } from './context/StoreSettingsContext';
import { ClientHome } from './pages/ClientHome';
import { OrderTracking } from './pages/OrderTracking';
import { AdminDashboard } from './pages/AdminDashboard';
import { PhoneMockupWrapper } from './components/common/PhoneMockupWrapper';
import { Smartphone, Monitor, Maximize2 } from 'lucide-react';

export function AppContent() {
  const [view, setView] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('role') === 'admin' || window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }
    if (params.get('view') === 'tracking') {
      return 'tracking';
    }
    return 'client';
  });

  // Chế độ mô phỏng khung điện thoại (chỉ bật trên màn hình máy tính)
  const [isPhoneMode, setIsPhoneMode] = useState(() => {
    return window.innerWidth >= 640;
  });

  const [currentTrackingOrderId, setCurrentTrackingOrderId] = useState(null);

  // Lắng nghe thay đổi kích thước màn hình: nếu là điện thoại thật (< 640px) thì tự tắt khung
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsPhoneMode(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lắng nghe thay đổi URL nếu có
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('role') === 'admin') {
        setView('admin');
      } else if (params.get('view') === 'tracking') {
        setView('tracking');
      } else {
        setView('client');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigateToTracking = (orderId) => {
    if (orderId) {
      setCurrentTrackingOrderId(orderId);
    }
    setView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToMenu = () => {
    setView('client');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-slate-50 font-sans">
      {/* View Switcher Floating Tool (Thanh chuyển đổi nhanh dành cho Demo/Kiểm thử) */}
      <div className="fixed top-3 right-3 z-50 flex items-center bg-slate-900/90 backdrop-blur-md p-1 rounded-full shadow-2xl border border-slate-700 text-white text-[11px] font-bold">
        {/* Nút Chế độ Khung Điện Thoại */}
        {view !== 'admin' && (
          <button
            onClick={() => setIsPhoneMode(!isPhoneMode)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              isPhoneMode
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title={isPhoneMode ? 'Tắt khung điện thoại' : 'Bật khung điện thoại'}
          >
            <Smartphone className="w-3 h-3" />
            <span className="hidden sm:inline">Khung ĐT</span>
          </button>
        )}

        {/* Nút Toàn Màn Hình Khách */}
        <button
          onClick={() => {
            setView('client');
            setIsPhoneMode(false);
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            view === 'client' && !isPhoneMode
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Xem dưới góc độ Web Khách thông thường"
        >
          <Maximize2 className="w-3 h-3" />
          <span className="hidden sm:inline">Web Khách</span>
        </button>

        {/* Nút Admin KDS */}
        <button
          onClick={() => setView('admin')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            view === 'admin'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Xem dưới góc độ Bếp / Quản trị viên KDS"
        >
          <Monitor className="w-3 h-3" />
          <span>KDS/Admin</span>
        </button>
      </div>

      {/* Render màn hình Khách hàng */}
      {view === 'client' && (
        <PhoneMockupWrapper
          isPhoneMode={isPhoneMode}
          onTogglePhoneMode={() => setIsPhoneMode(false)}
        >
          <ClientHome onNavigateToTracking={handleNavigateToTracking} />
        </PhoneMockupWrapper>
      )}

      {/* Render màn hình Theo dõi đơn */}
      {view === 'tracking' && (
        <PhoneMockupWrapper
          isPhoneMode={isPhoneMode}
          onTogglePhoneMode={() => setIsPhoneMode(false)}
        >
          <OrderTracking
            initialOrderId={currentTrackingOrderId}
            onBackToMenu={handleBackToMenu}
          />
        </PhoneMockupWrapper>
      )}

      {/* Render màn hình Admin Dashboard */}
      {view === 'admin' && (
        <AdminDashboard onSwitchToClient={() => setView('client')} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreSettingsProvider>
      <SocketProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </SocketProvider>
    </StoreSettingsProvider>
  );
}
