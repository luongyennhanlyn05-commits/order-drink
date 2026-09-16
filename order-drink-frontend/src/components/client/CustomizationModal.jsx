import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Sparkles, MessageSquare } from 'lucide-react';

const QUICK_NOTES = [
  'Ít đường',
  'Không đường',
  'Ít đá',
  'Đá riêng',
  'Nhiều đá',
  'Mang về',
  'Ly giấy',
  'Không lấy ống hút',
];

export const CustomizationModal = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!isOpen || !product) return null;

  // Sizes mặc định nếu sản phẩm chưa có
  const sizes = product.sizes && product.sizes.length > 0
    ? product.sizes
    : [
        { name: 'S', extraPrice: 0 },
        { name: 'M', extraPrice: 6000 },
        { name: 'L', extraPrice: 12000 },
      ];

  // Toppings mặc định
  const toppings = product.toppings || [];

  // States
  const [selectedSize, setSelectedSize] = useState(sizes[0] || { name: 'M', extraPrice: 0 });
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Reset state mỗi khi mở món mới
  useEffect(() => {
    if (product) {
      setSelectedSize(sizes[0] || { name: 'M', extraPrice: 0 });
      setSelectedToppings([]);
      setNote('');
      setQuantity(1);
    }
  }, [product]);

  // Toggle topping
  const handleToggleTopping = (topping) => {
    setSelectedToppings((prev) => {
      const exists = prev.some((t) => t.name === topping.name);
      if (exists) {
        return prev.filter((t) => t.name !== topping.name);
      } else {
        return [...prev, topping];
      }
    });
  };

  // Tính đơn giá (1 ly)
  const toppingsExtra = selectedToppings.reduce((sum, t) => sum + (t.price || 0), 0);
  const unitPrice = (product.basePrice || 0) + (selectedSize?.extraPrice || 0) + toppingsExtra;
  const totalPrice = unitPrice * quantity;

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p || 0) + ' đ';

  // Xử lý xác nhận thêm vào giỏ
  const handleConfirm = () => {
    const cartItem = {
      productId: product._id,
      name: product.name,
      image: product.image,
      size: selectedSize.name,
      toppings: selectedToppings.map((t) => t.name),
      note: note.trim(),
      quantity,
      unitPrice,
      itemTotal: totalPrice,
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Container Bottom Sheet trên Mobile / Modal trên Desktop */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
        
        {/* Header Modal */}
        <div className="relative p-4 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 pr-8">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80'}
              alt={product.name}
              className="w-14 h-14 rounded-xl object-cover shadow-xs shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                {product.category}
              </span>
              <h3 className="text-base font-bold text-slate-900 line-clamp-1 mt-0.5">
                {product.name}
              </h3>
              <p className="text-sm font-extrabold text-amber-600">
                {formatPrice(unitPrice)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung Tùy chọn Cuộn Được */}
        <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          
          {/* 1. Chọn Size (Bắt buộc) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span>Chọn Size</span>
                <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.2 rounded-full">Bắt buộc</span>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((s) => {
                const isSelected = selectedSize.name === s.name;
                return (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 text-amber-800 font-bold shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="text-sm font-bold">Size {s.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {s.extraPrice > 0 ? `+${formatPrice(s.extraPrice)}` : 'Tiêu chuẩn'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Chọn Topping (Nhiều lựa chọn) */}
          {toppings.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Thêm Topping
                </label>
                <span className="text-[11px] text-slate-400">Chọn tùy ý</span>
              </div>
              <div className="space-y-2">
                {toppings.map((t) => {
                  const isChecked = selectedToppings.some((item) => item.name === t.name);
                  return (
                    <div
                      key={t.name}
                      onClick={() => handleToggleTopping(t)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-amber-500 bg-amber-500/5 text-slate-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-amber-500 border-amber-500 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium">{t.name}</span>
                      </div>
                      <span className="text-xs font-bold text-amber-600">
                        +{formatPrice(t.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Ghi chú cho quán (Khách muốn gì điền đó) */}
          <div className="bg-amber-50/40 p-3.5 rounded-2xl border border-amber-100/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <span>Ghi chú cho quán</span>
              </label>
              <span className="text-[11px] text-amber-700/70 font-medium">Tự do yêu cầu</span>
            </div>

            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Bạn muốn dặn dò gì? (Ví dụ: ít đường, nhiều đá, đá riêng, mang về, không lấy ống hút...)"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none shadow-2xs leading-relaxed"
            />

            {/* Các tag ghi chú nhanh để khách bấm 1 chạm */}
            <div className="mt-2.5">
              <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Gợi ý chọn nhanh:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_NOTES.map((qn) => {
                  const isIncluded = note.includes(qn);
                  return (
                    <button
                      key={qn}
                      type="button"
                      onClick={() => {
                        if (isIncluded) {
                          // Bỏ chọn nếu đã có
                          setNote((prev) =>
                            prev
                              .split(', ')
                              .filter((item) => item !== qn)
                              .join(', ')
                          );
                        } else {
                          // Thêm vào ghi chú
                          setNote((prev) => (prev ? `${prev}, ${qn}` : qn));
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                        isIncluded
                          ? 'bg-amber-500 text-white font-bold shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {isIncluded ? `✓ ${qn}` : `+ ${qn}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Cố Định: Bộ Tăng Giảm & Nút Thêm Vào Giỏ */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center gap-3">
          {/* Bộ tăng giảm số lượng */}
          <div className="flex items-center border border-slate-300 rounded-2xl bg-white shadow-2xs p-1">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-slate-800">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Nút Xác Nhận Thêm Vào Giỏ */}
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-bold text-sm rounded-2xl shadow-md shadow-amber-500/25 flex items-center justify-between transition-all cursor-pointer"
          >
            <span>Thêm vào giỏ</span>
            <span className="text-white/95 font-extrabold">{formatPrice(totalPrice)}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
