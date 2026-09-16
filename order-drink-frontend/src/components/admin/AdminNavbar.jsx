import React from 'react';
import { 
  ChefHat, 
  Coffee, 
  BarChart3, 
  QrCode,
  Settings,
  Volume2, 
  Wifi, 
  WifiOff, 
  ExternalLink 
} from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { soundManager } from '../../utils/sound';

export const AdminNavbar = ({ activeTab, onSelectTab, pendingCount, onSwitchToClient }) => {
  const { isConnected } = useSocket();
  const { settings } = useStoreSettings();

  const handleTestSound = () => {
    soundManager.playNewOrderChime();
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        
        {/* Logo & Brand Tên Quán */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <ChefHat className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold tracking-tight text-white line-clamp-1">
                {settings?.storeName || 'Quản Trị Bếp'}
              </h1>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                KDS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{settings?.storeSubtitle || 'Điều phối đơn hàng'}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onSelectTab('kds')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'kds'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>KDS Bếp</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-red-500 text-white">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('menu')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Menu Món</span>
          </button>

          <button
            onClick={() => onSelectTab('qr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'qr'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Mã QR Bàn</span>
          </button>

          <button
            onClick={() => onSelectTab('revenue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'revenue'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Doanh Thu</span>
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Đổi tên quán, wifi"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Cài Đặt Quán</span>
          </button>
        </nav>

        {/* Trạng thái Socket & Chuyển sang Khách */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleTestSound}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer border border-slate-700"
            title="Thử âm thanh chuông Ting"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={onSwitchToClient}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-all cursor-pointer border border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Giao diện Khách</span>
          </button>
        </div>

      </div>
    </header>
  );
};
