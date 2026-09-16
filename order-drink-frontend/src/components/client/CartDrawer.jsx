import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, UtensilsCrossed, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/orderService';

export const CartDrawer = ({ isOpen, onClose, onOrderPlaced }) => {
  const { cartItems, tableNumber, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p || 0) + ' đ';

  // Xử lý gửi đơn hàng POST /api/orders
  const handleCheckout = async () => {
    if (!cartItems.length) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        tableNumber: tableNumber || '01',
        totalAmount,
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          size: item.size,
          ice: item.ice,
          sugar: item.sugar,
          toppings: item.toppings || [],
          note: item.note || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          itemTotal: item.itemTotal,
        })),
      };

      const res = await orderService.create(orderPayload);

      if (res.success && res.data) {
        // Lưu orderId vào localStorage
        localStorage.setItem('kopi_active_order_id', res.data._id);
        localStorage.setItem('kopi_active_order_table', res.data.tableNumber);

        // Xóa giỏ hàng
        clearCart();
        onClose();

        // Chuyển sang màn hình Theo Dõi Đơn
        if (onOrderPlaced) {
          onOrderPlaced(res.data);
        }
      } else {
        setErrorMessage(res.message || 'Không thể tạo đơn hàng, vui lòng thử lại');
      }
    } catch (err) {
      console.error('Lỗi khi đặt đơn:', err);
      setErrorMessage(err.message || 'Lỗi kết nối máy chủ. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Container Drawer */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
        
        {/* Header Giỏ hàng */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-none">
                Giỏ Hàng
              </h2>
              <p className="text-xs font-semibold text-amber-600 mt-1">
                Số bàn: <span className="font-extrabold text-slate-900">Bàn {tableNumber || '01'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="m-4 mb-0 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Danh sách món trong giỏ */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(92vh-190px)]">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">Giỏ hàng của bạn đang trống</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.key}
                className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-start gap-3 transition-all hover:bg-slate-50"
              >
                {/* Ảnh món */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 mt-0.5 border border-slate-200"
                  />
                )}

                {/* Thông tin món & tùy chọn */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="text-slate-400 hover:text-red-500 p-1 -mr-1 transition-colors cursor-pointer"
                      title="Xóa món"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Chi tiết size & tùy chọn */}
                  <div className="flex flex-wrap items-center gap-1 mt-1">
                    {item.size && (
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">
                        Size {item.size}
                      </span>
                    )}
                    {item.ice && (
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                        {item.ice} đá
                      </span>
                    )}
                    {item.sugar && (
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                        {item.sugar} đường
                      </span>
                    )}
                  </div>

                  {/* Toppings nếu có */}
                  {item.toppings && item.toppings.length > 0 && (
                    <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                      + Topping: <span className="text-slate-700 font-medium">{item.toppings.join(', ')}</span>
                    </p>
                  )}

                  {/* Ghi chú riêng nếu có (Khách muốn gì hiển thị nổi bật) */}
                  {item.note && (
                    <div className="mt-1 bg-amber-50/90 border border-amber-200/70 px-2 py-1 rounded-lg">
                      <p className="text-[11px] text-amber-900 font-medium">
                        <span className="font-bold text-amber-700">Yêu cầu:</span> {item.note}
                      </p>
                    </div>
                  )}

                  {/* Giá & Bộ điều khiển số lượng */}
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-600">
                      {formatPrice(item.itemTotal)}
                    </span>

                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                      <button
                        onClick={() => updateQuantity(item.key, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.key, 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Tổng kết & Đặt hàng */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Tổng thanh toán</p>
                <p className="text-lg font-black text-slate-900 leading-tight">
                  {formatPrice(totalAmount)}
                </p>
              </div>
              <div className="text-right text-[11px] text-slate-500">
                <span>Thanh toán tại bàn sau</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang gửi đơn xuống bếp...</span>
                </>
              ) : (
                <>
                  <span>Xác nhận đặt đơn (Bàn {tableNumber || '01'})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
