import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Smartphone } from 'lucide-react';

export const PhoneMockupWrapper = ({ children, isPhoneMode, onTogglePhoneMode }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isPhoneMode) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/40 p-2 sm:p-6 lg:p-8 flex flex-col items-center justify-center relative overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(245,158,11,0.15),transparent_60%)] pointer-events-none" />

      {/* Thanh Điều Khiển Giả Lập Phía Trên */}
      <div className="mb-4 z-40 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white shadow-lg text-xs">
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <Smartphone className="w-4 h-4" />
          <span>Chế độ mô phỏng màn hình Smartphone</span>
        </div>
        <span className="text-white/40">•</span>
        <button
          onClick={onTogglePhoneMode}
          className="text-white hover:text-amber-300 font-semibold underline underline-offset-4 cursor-pointer transition-colors"
        >
          Chuyển sang xem toàn màn hình
        </button>
      </div>

      {/* KHUNG ĐIỆN THOẠI (SMARTPHONE CHASSIS) */}
      <div className="relative w-full max-w-[412px] h-[860px] max-h-[92vh] bg-slate-950 rounded-[52px] p-3 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-slate-800 flex flex-col transition-all duration-300">
        
        {/* Nút vật lý bên sườn máy (Volume buttons bên trái, Power button bên phải) */}
        <div className="absolute -left-1.5 top-28 w-1.5 h-12 bg-slate-700 rounded-l-md" />
        <div className="absolute -left-1.5 top-44 w-1.5 h-12 bg-slate-700 rounded-l-md" />
        <div className="absolute -right-1.5 top-36 w-1.5 h-16 bg-slate-700 rounded-r-md" />

        {/* MÀN HÌNH BÊN TRONG CỦA ĐIỆN THOẠI */}
        {/* Chú ý: transform: translateZ(0) tạo containing block cho fixed elements để modal & drawer nằm trọn trong khung */}
        <div
          className="relative w-full h-full bg-slate-50 rounded-[42px] overflow-hidden flex flex-col shadow-inner"
          style={{ transform: 'translateZ(0)' }}
        >
          {/* Status Bar của điện thoại */}
          <div className="h-10 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between z-40 select-none shrink-0 border-b border-slate-100/50">
            {/* Giờ hiện tại */}
            <span className="text-[13px] font-bold text-slate-800 tracking-tight">
              {currentTime || '09:41'}
            </span>

            {/* Dynamic Island / Tai thỏ */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>

            {/* Các icon tín hiệu (Sóng, Wifi, Pin) */}
            <div className="flex items-center gap-1.5 text-slate-800">
              <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
              <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
              <div className="flex items-center">
                <Battery className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Vùng Cuộn Nội Dung Web Khách Hàng */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
            {children}
          </div>

          {/* Thanh Home Bar ở dưới đáy điện thoại */}
          <div className="h-4 bg-white/90 backdrop-blur-xs flex items-center justify-center z-40 shrink-0 select-none">
            <div className="w-32 h-1 bg-slate-400 rounded-full" />
          </div>
        </div>
      </div>

    </div>
  );
};
