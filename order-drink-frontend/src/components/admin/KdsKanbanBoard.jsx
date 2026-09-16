import React, { useState, useEffect } from 'react';
import { Coffee, CheckCircle2, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { KdsOrderCard } from './KdsOrderCard';
import { orderService } from '../../services/orderService';
import { useSocket } from '../../context/SocketContext';
import { soundManager } from '../../utils/sound';

export const KdsKanbanBoard = ({ onPendingCountChange }) => {
  const { socket, joinAdminRoom } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewTab, setViewTab] = useState('active'); // 'active' (đang chờ) | 'completed' (đã xong)

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderService.getAll();
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải đơn hàng KDS:', err);
      setError('Không thể kết nối Backend để lấy danh sách đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    joinAdminRoom();

    if (socket) {
      const handleNewOrder = (newOrder) => {
        soundManager.playNewOrderChime();
        setOrders((prev) => {
          const exists = prev.some((o) => o._id === newOrder._id);
          if (exists) return prev;
          return [newOrder, ...prev];
        });
      };

      const handleStatusUpdated = (updatedOrder) => {
        setOrders((prev) =>
          prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
        );
      };

      socket.on('new_order', handleNewOrder);
      socket.on('order_status_updated', handleStatusUpdated);

      return () => {
        socket.off('new_order', handleNewOrder);
        socket.off('order_status_updated', handleStatusUpdated);
      };
    }
  }, [socket]);

  // Cập nhật số lượng đơn đang chờ
  const activeOrders = orders.filter((o) => o.status === 'pending' || o.status === 'preparing');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  useEffect(() => {
    if (onPendingCountChange) {
      onPendingCountChange(activeOrders.length);
    }
  }, [activeOrders.length, onPendingCountChange]);

  // Hành động cập nhật status: Quán bấm "Hoàn thành" 1-chạm là xong ngay!
  const handleUpdateStatus = async (orderId, status) => {
    try {
      // Cập nhật giao diện tức thời
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );

      await orderService.updateStatus(orderId, { status, estimatedMinutes: 0 });
    } catch (err) {
      console.error('Lỗi khi đổi trạng thái đơn:', err);
      fetchOrders();
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-medium">Đang tải danh sách đơn...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Điều Khiển & Bộ Lọc Tab */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          {/* Nút Tab Đang chờ làm */}
          <button
            onClick={() => setViewTab('active')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewTab === 'active'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Đơn cần làm</span>
            <span
              className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeOrders.length > 0
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-300 text-slate-700'
              }`}
            >
              {activeOrders.length}
            </span>
          </button>

          {/* Nút Tab Đã xong */}
          <button
            onClick={() => setViewTab('completed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewTab === 'completed'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Đã hoàn thành</span>
            <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-700">
              {completedOrders.length}
            </span>
          </button>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Làm mới</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Danh Sách Các Đơn Cần Làm (Chỉ cần bấm "Hoàn thành" 1 cái là xong) */}
      {viewTab === 'active' ? (
        activeOrders.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-3xl border border-slate-200/80 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Không có đơn nào đang chờ</h3>
            <p className="text-xs text-slate-400 mt-1">
              Đơn hàng mới từ khách quét mã tại bàn sẽ tự động xuất hiện tại đây kèm tiếng chuông
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeOrders.map((order) => (
              <KdsOrderCard
                key={order._id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )
      ) : (
        /* Danh Sách Các Đơn Đã Hoàn Thành */
        completedOrders.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="text-xs">Chưa có đơn hàng nào hoàn tất trong ca này</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {completedOrders.slice(0, 16).map((order) => (
              <KdsOrderCard
                key={order._id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};
