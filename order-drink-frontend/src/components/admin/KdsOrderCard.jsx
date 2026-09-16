import React from 'react';
import { Clock, Check, X, AlertTriangle } from 'lucide-react';

export const KdsOrderCard = ({ order, onUpdateStatus }) => {
  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p || 0) + ' đ';

  const formatOrderTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const getElapsedMinutes = (isoString) => {
    if (!isoString) return 0;
    const diffMs = Date.now() - new Date(isoString).getTime();
    return Math.floor(diffMs / 60000);
  };

  const elapsed = getElapsedMinutes(order.createdAt);
  const isPending = order.status === 'pending' || order.status === 'preparing';
  const isCompleted = order.status === 'completed';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col">
      {/* Header Card */}
      <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-slate-900 text-white font-extrabold text-xs rounded-lg">
            BÀN {order.tableNumber}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            #{order._id?.slice(-4)?.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatOrderTime(order.createdAt)}</span>
          {elapsed > 0 && isPending && (
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                elapsed >= 15
                  ? 'bg-red-100 text-red-700'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {elapsed}p
            </span>
          )}
        </div>
      </div>

      {/* Danh Sách Món Trong Đơn */}
      <div className="p-3 space-y-2.5 flex-1 overflow-y-auto max-h-72">
        {order.items?.map((item, idx) => (
          <div
            key={idx}
            className="pb-2 border-b border-slate-100 last:border-0 last:pb-0"
          >
            {/* Tên món & số lượng */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-900 font-black text-[11px] flex items-center justify-center shrink-0">
                  {item.quantity}x
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {item.name}
                </span>
              </div>
              {item.size && (
                <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded text-[10px] font-bold shrink-0">
                  Size {item.size}
                </span>
              )}
            </div>

            {/* Thuộc tính topping và ghi chú */}
            <div className="pl-6.5 text-[11px] text-slate-500 mt-0.5 space-y-0.5">
              {(item.ice || item.sugar || (item.toppings && item.toppings.length > 0)) && (
                <p>
                  {[
                    item.ice ? `${item.ice} đá` : null,
                    item.sugar ? `${item.sugar} đường` : null,
                    item.toppings?.length > 0 ? `+${item.toppings.join(', ')}` : null,
                  ].filter(Boolean).join(' • ')}
                </p>
              )}
              {item.note && (
                <div className="flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                  <span>{item.note}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer & Duy Nhất 1 Nút "Hoàn Thành" */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs font-bold mb-2.5">
          <span className="text-slate-400">Tổng tiền</span>
          <span className="text-slate-900 font-extrabold">{formatPrice(order.totalAmount)}</span>
        </div>

        {isPending ? (
          <div className="flex items-center gap-2">
            {/* Nút Hoàn thành 1-chạm (Bấm xong là đơn hoàn tất ngay) */}
            <button
              onClick={() => onUpdateStatus(order._id, 'completed')}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Hoàn thành</span>
            </button>

            {/* Nút Hủy nhẹ nhàng */}
            <button
              onClick={() => onUpdateStatus(order._id, 'cancelled')}
              className="py-2 px-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-400 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              title="Hủy đơn này"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="py-1.5 text-center bg-emerald-50 rounded-xl text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Đã giao bàn</span>
          </div>
        )}
      </div>
    </div>
  );
};
