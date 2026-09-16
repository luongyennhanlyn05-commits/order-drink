import React from 'react';
import { ArrowLeft, Coffee, UtensilsCrossed, Clock } from 'lucide-react';
import { useStoreSettings } from '../../context/StoreSettingsContext';

export const Header = ({ tableNumber, onBack, onOpenTracking, hasActiveOrder }) => {
  const { settings } = useStoreSettings();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs transition-all">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Nút Quay lại hoặc Logo quán */}
        <div className="flex items-center gap-2.5">
          {onBack ? (
            <button
              onClick={onBack}
              aria-label="Quay lại"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
              <Coffee className="w-4 h-4" />
            </div>
          )}
          
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
              {settings?.storeName || 'Tiệm Trà & Cà Phê'}
            </h1>
            <p className="text-[10px] font-medium text-slate-400 mt-0.5">
              {settings?.storeSubtitle || 'Gọi món tại bàn'}
            </p>
          </div>
        </div>

        {/* Thông tin Bàn & Nút xem đơn đang xử lý */}
        <div className="flex items-center gap-2">
          {hasActiveOrder && (
            <button
              onClick={onOpenTracking}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-[11px] font-bold hover:bg-amber-100 active:scale-95 transition-all"
            >
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Xem đơn</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 text-white rounded-full text-xs font-bold">
            <UtensilsCrossed className="w-3 h-3 text-amber-400" />
            <span>Bàn {tableNumber || '01'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
