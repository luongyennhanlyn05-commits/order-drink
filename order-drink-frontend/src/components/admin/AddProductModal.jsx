import React, { useState } from 'react';
import { X, Plus, Trash2, Loader2, Sparkles } from 'lucide-react';
import { productService } from '../../services/productService';

const CATEGORIES = ['Trà sữa', 'Cà phê', 'Trà trái cây', 'Đá xay', 'Topping/Khác'];

export const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Trà sữa');
  const [basePrice, setBasePrice] = useState(40000);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80');
  
  // Sizes cấu hình
  const [sizes, setSizes] = useState([
    { name: 'S', extraPrice: 0 },
    { name: 'M', extraPrice: 6000 },
    { name: 'L', extraPrice: 12000 },
  ]);

  // Toppings cấu hình
  const [toppings, setToppings] = useState([
    { name: 'Trân châu đen', price: 8000 },
    { name: 'Trân châu trắng hoàng kim', price: 10000 },
    { name: 'Kem Cheese Macchiato', price: 12000 },
  ]);

  const [newToppingName, setNewToppingName] = useState('');
  const [newToppingPrice, setNewToppingPrice] = useState(8000);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddCustomTopping = () => {
    if (!newToppingName.trim()) return;
    setToppings([...toppings, { name: newToppingName.trim(), price: Number(newToppingPrice) || 0 }]);
    setNewToppingName('');
    setNewToppingPrice(8000);
  };

  const handleRemoveTopping = (index) => {
    setToppings(toppings.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập tên món!');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        name: name.trim(),
        category,
        basePrice: Number(basePrice) || 0,
        image: image.trim() || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        sizes,
        toppings,
      };

      const res = await productService.create(payload);
      if (res.success && res.data) {
        onProductAdded(res.data);
        onClose();
      } else {
        setError(res.message || 'Không thể tạo món mới');
      }
    } catch (err) {
      console.error('Lỗi khi thêm món:', err);
      setError(err.message || 'Lỗi hệ thống khi lưu món');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Thêm Món Nước Mới Vào Menu
            </h3>
            <p className="text-xs text-slate-500">Thiết lập giá, hình ảnh, size và toppings</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Tên món & Danh mục */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tên món nước *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Trà Sữa Thái Xanh"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Danh mục
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Giá cơ bản & Link ảnh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Giá gốc (VNĐ) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                URL Hình ảnh món
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Preview Ảnh */}
          {image && (
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
              <img
                src={image}
                alt="Preview"
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80';
                }}
              />
              <span className="text-xs text-slate-500 font-medium">Hình ảnh hiển thị trực tiếp trên thẻ món của khách</span>
            </div>
          )}

          {/* Cấu hình Sizes */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Cấu hình Size & Phụ thu
            </label>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((s, idx) => (
                <div key={s.name} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-xs font-black text-slate-800">Size {s.name}</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={s.extraPrice}
                    onChange={(e) => {
                      const newSizes = [...sizes];
                      newSizes[idx].extraPrice = Number(e.target.value) || 0;
                      setSizes(newSizes);
                    }}
                    className="mt-1 w-full text-center text-xs p-1 border border-slate-200 rounded-lg bg-white"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Phụ thu (+đ)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cấu hình Toppings */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Toppings đi kèm ({toppings.length})
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {toppings.map((t, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                >
                  <span className="font-semibold text-slate-800">{t.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-600">
                      +{new Intl.NumberFormat('vi-VN').format(t.price)} đ
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTopping(idx)}
                      className="text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Thêm topping mới */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={newToppingName}
                onChange={(e) => setNewToppingName(e.target.value)}
                placeholder="Tên topping (VD: Thạch nha đam)"
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <input
                type="number"
                step="1000"
                value={newToppingPrice}
                onChange={(e) => setNewToppingPrice(e.target.value)}
                className="w-24 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddCustomTopping}
                className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Nút submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Lưu Món Mới</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
