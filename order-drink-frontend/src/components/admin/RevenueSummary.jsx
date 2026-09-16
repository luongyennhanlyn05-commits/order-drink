import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Coffee, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { orderService } from '../../services/orderService';

export const RevenueSummary = () => {
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sumRes, ordersRes] = await Promise.all([
        orderService.getRevenueSummary(),
        orderService.getAll(),
      ]);

      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
      }
      if (ordersRes.success && ordersRes.data) {
        setRecentOrders(ordersRes.data.slice(0, 10));
      }
    } catch (err) {
      console.error('Lỗi khi tải doanh thu:', err);
      setError('Không thể tải dữ liệu báo cáo doanh thu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p || 0) + ' đ';

  const averageOrderValue = summary?.totalOrders > 0
    ? Math.round(summary.totalRevenue / summary.totalOrders)
    : 0;

  if (loading) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-2" />
        <p className="text-xs text-slate-500">Đang tổng hợp số liệu doanh thu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            Báo Cáo Hoạt Động & Doanh Thu
          </h2>
          <p className="text-xs text-slate-500">
            Tổng hợp dữ liệu bán hàng và số lượng ly nước phục vụ tại bàn
          </p>
        </div>

        <button
          onClick={fetchRevenueData}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Cập nhật số liệu</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3 Thẻ KPI Chính (Theo yêu cầu đề bài: Tổng doanh thu, Tổng đơn hàng, Tổng số ly) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: Tổng Doanh Thu */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng Doanh Thu
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {formatPrice(summary?.totalRevenue || 0)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Doanh thu thực tế các đơn hợp lệ</span>
          </div>
        </div>

        {/* Card 2: Tổng Đơn Hàng */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng Đơn Hàng
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {summary?.totalOrders || 0}
            <span className="text-sm font-semibold text-slate-400 ml-1">đơn</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Trung bình: <span className="font-bold text-slate-800">{formatPrice(averageOrderValue)}/đơn</span>
          </div>
        </div>

        {/* Card 3: Tổng Số Ly (Items Sold) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng Số Ly (Đồ Uống)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coffee className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {summary?.totalItems || 0}
            <span className="text-sm font-semibold text-slate-400 ml-1">ly</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Phục vụ thành công tại bàn
          </div>
        </div>

      </div>

      {/* Bảng Các Đơn Hàng Gần Đây */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Lịch sử các đơn gọi gần đây ({recentOrders.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Mã đơn</th>
                <th className="py-3 px-4">Bàn</th>
                <th className="py-3 px-4">Số lượng món</th>
                <th className="py-3 px-4">Tổng tiền</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Chưa có đơn hàng nào phát sinh
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const itemCount = order.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 0;
                  return (
                    <tr key={order._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">
                        Bàn {order.tableNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {itemCount} ly
                      </td>
                      <td className="py-3 px-4 font-black text-amber-600">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'preparing'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.status === 'completed'
                            ? 'Hoàn thành'
                            : order.status === 'preparing'
                            ? 'Đang làm'
                            : order.status === 'cancelled'
                            ? 'Đã hủy'
                            : 'Chờ nhận'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
