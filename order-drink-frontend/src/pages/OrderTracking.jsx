import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, RefreshCw, CheckCircle2, Clock, UtensilsCrossed } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { orderService } from '../services/orderService';
import { soundManager } from '../utils/sound';

export const OrderTracking = ({ initialOrderId, onBackToMenu }) => {
  const { socket, joinOrderRoom } = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy orderId từ props hoặc localStorage
  const activeOrderId = initialOrderId || localStorage.getItem('kopi_active_order_id');

  const fetchOrderDetail = async () => {
    if (!activeOrderId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await orderService.getById(activeOrderId);
      if (res.success && res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      console.error('Lỗi tải thông tin đơn:', err);
    } finally {
      setLoading(false);
    }
  };

  // Lắng nghe Socket.io realtime
  useEffect(() => {
    fetchOrderDetail();

    if (activeOrderId) {
      joinOrderRoom(activeOrderId);
    }

    if (socket) {
      const handleStatusUpdate = (updatedOrder) => {
        if (updatedOrder._id === activeOrderId) {
          setOrder(updatedOrder);
          if (updatedOrder.status === 'completed') {
            soundManager.playSuccessSound();
          }
        }
      };

      socket.on('order_status_updated', handleStatusUpdate);

      return () => {
        socket.off('order_status_updated', handleStatusUpdate);
      };
    }
  }, [socket, activeOrderId]);

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p || 0) + ' đ';

  if (!activeOrderId) {
    return (
      <div className="min-h-screen max-w-md mx-auto p-6 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
          <UtensilsCrossed className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900 mb-1">Chưa có đơn hàng</h2>
        <p className="text-xs text-slate-400 mb-5">
          Vui lòng chọn món trên thực đơn để đặt đơn mới.
        </p>
        <button
          onClick={onBackToMenu}
          className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800 transition-all cursor-pointer"
        >
          Xem thực đơn
        </button>
      </div>
    );
  }

  if (loading && !order) {
    return (
      <div className="min-h-screen max-w-md mx-auto p-6 flex flex-col items-center justify-center text-center">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-400 mb-2" />
        <p className="text-xs text-slate-500 font-medium">Đang tải thông tin đơn...</p>
      </div>
    );
  }

  const isCompleted = order?.status === 'completed';
  const isCancelled = order?.status === 'cancelled';

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 font-sans">
      {/* Top Bar tối giản */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-md mx-auto px-4 h-13 flex items-center justify-between">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Thực đơn</span>
          </button>

          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
            Bàn {order?.tableNumber || '01'}
          </span>
        </div>
      </div>

      <main className="max-w-md mx-auto p-4 space-y-4">
        
        {/* Banner trạng thái tinh gọn */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-600'
                  : isCancelled
                  ? 'bg-red-50 text-red-600'
                  : 'bg-amber-50 text-amber-600'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              ) : isCancelled ? (
                <span className="font-bold text-base">✕</span>
              ) : (
                <Clock className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900">
                {isCompleted
                  ? 'Món đã sẵn sàng!'
                  : isCancelled
                  ? 'Đơn đã hủy'
                  : 'Đang chuẩn bị đồ uống'}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isCompleted
                  ? 'Nhân viên đang mang món tới bàn'
                  : isCancelled
                  ? 'Liên hệ thu ngân để được hỗ trợ'
                  : 'Quầy pha chế đã nhận đơn của bạn'}
              </p>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800'
                : isCancelled
                ? 'bg-red-100 text-red-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isCompleted ? 'Hoàn thành' : isCancelled ? 'Đã hủy' : 'Đang pha'}
          </span>
        </div>

        {/* Khối CHI TIẾT MÓN ĐÃ GỌI (Thiết kế tối giản đúng chuẩn ảnh mẫu của bạn) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          
          {/* Header khối */}
          <div className="flex items-center justify-between pb-3 mb-1 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Chi tiết món đã gọi ({order?.items?.length || 0})
            </h4>
            <span className="text-xs font-extrabold text-amber-600">
              Tổng: {formatPrice(order?.totalAmount)}
            </span>
          </div>

          {/* Danh sách từng món */}
          <div className="divide-y divide-slate-100">
            {order?.items?.map((item, i) => (
              <div key={i} className="py-3">
                {/* Dòng tên món & giá */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-black shrink-0">
                      {item.quantity}x
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {item.name}
                    </span>
                    {item.size && (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                        Size {item.size}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-black text-slate-900 shrink-0">
                    {formatPrice(item.itemTotal)}
                  </span>
                </div>

                {/* Dòng thuộc tính tùy chọn & topping */}
                <div className="text-[11px] text-slate-500 mt-1 pl-7 leading-tight space-y-0.5">
                  {(item.ice || item.sugar || (item.toppings && item.toppings.length > 0)) && (
                    <p>
                      {[
                        item.ice ? `${item.ice} đá` : null,
                        item.sugar ? `${item.sugar} đường` : null,
                        item.toppings?.length > 0 ? `Topping: ${item.toppings.join(', ')}` : null,
                      ].filter(Boolean).join(' • ')}
                    </p>
                  )}

                  {/* Ghi chú nếu có */}
                  {item.note && (
                    <p className="text-amber-800 font-medium bg-amber-50/80 px-2 py-0.5 rounded-md inline-block">
                      <span className="font-bold text-amber-700">Ghi chú:</span> {item.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nút Gọi thêm món khác (Giống hệt ảnh mẫu) */}
        <button
          type="button"
          onClick={onBackToMenu}
          className="w-full py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.99] rounded-2xl text-xs font-bold text-slate-800 shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Gọi thêm món khác</span>
        </button>

      </main>
    </div>
  );
};
