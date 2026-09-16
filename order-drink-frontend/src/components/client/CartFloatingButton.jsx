import React from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartFloatingButton = ({ onClick }) => {
  const { totalCount, totalAmount } = useCart();

  if (totalCount === 0) return null;

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p || 0) + ' đ';

  return (
    <div className="fixed bottom-5 inset-x-0 z-40 px-4 pointer-events-none animate-in slide-in-from-bottom-5 duration-300">
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          onClick={onClick}
          className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white p-3.5 rounded-2xl shadow-xl shadow-slate-900/30 flex items-center justify-between transition-all cursor-pointer border border-slate-700/50"
        >
          {/* Trái: Icon túi & số món */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
                {totalCount}
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-300">Giỏ hàng của bạn</p>
              <p className="text-xs text-amber-400 font-medium">{totalCount} món đang chờ</p>
            </div>
          </div>

          {/* Phải: Tổng tiền & icon mũi tên */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium">Tạm tính</p>
              <p className="text-sm font-extrabold text-white">
                {formatPrice(totalAmount)}
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
