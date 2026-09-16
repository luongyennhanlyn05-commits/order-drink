import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, RefreshCw, AlertCircle, Check, X, Coffee } from 'lucide-react';
import { productService } from '../../services/productService';
import { AddProductModal } from './AddProductModal';

export const MenuManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Tải danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await productService.getAll();
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải thực đơn:', err);
      setError('Không thể tải danh sách món từ Backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Xử lý nút gạt Toggle trạng thái isAvailable (Còn hàng / Hết hàng)
  const handleToggleStatus = async (productId, currentStatus) => {
    const nextStatus = !currentStatus;

    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, isAvailable: nextStatus } : p))
    );

    try {
      await productService.toggleStatus(productId, nextStatus);
    } catch (err) {
      console.error('Lỗi khi toggle trạng thái món:', err);
      // Hoàn nguyên nếu lỗi
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, isAvailable: currentStatus } : p))
      );
    }
  };

  // Xử lý xóa món
  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa món "${productName}" khỏi thực đơn?`)) {
      return;
    }

    try {
      await productService.delete(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error('Lỗi khi xóa món:', err);
      alert('Không thể xóa món, vui lòng thử lại');
    }
  };

  // Sau khi thêm món thành công
  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p || 0) + ' đ';

  // Lọc sản phẩm
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'Tất cả' || p.category === selectedCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase().trim());
    return matchCat && matchSearch;
  });

  const categories = ['Tất cả', ...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="space-y-4">
      {/* Header & Thanh Công Cụ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            Quản Lý Thực Đơn (Menu Management)
          </h2>
          <p className="text-xs text-slate-500">
            Bật/tắt món còn hay hết hàng, thêm món mới và cập nhật giá
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/25 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Món Mới</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên món..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bảng Danh Sách Món */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Đang tải thực đơn...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Món nước</th>
                  <th className="py-3.5 px-4">Danh mục</th>
                  <th className="py-3.5 px-4">Giá cơ bản</th>
                  <th className="py-3.5 px-4">Sizes & Toppings</th>
                  <th className="py-3.5 px-4 text-center">Trạng thái (Còn/Hết)</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Không có món nào phù hợp với bộ lọc
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isAvailable = p.isAvailable !== false;
                    return (
                      <tr
                        key={p._id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          !isAvailable ? 'bg-slate-50/50 opacity-75' : ''
                        }`}
                      >
                        {/* Ảnh & Tên món */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80'}
                              alt={p.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                              <span className="text-[10px] text-slate-400">#{p._id.slice(-4)}</span>
                            </div>
                          </div>
                        </td>

                        {/* Danh mục */}
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {p.category}
                          </span>
                        </td>

                        {/* Giá */}
                        <td className="py-3 px-4 font-black text-amber-600">
                          {formatPrice(p.basePrice)}
                        </td>

                        {/* Sizes & Toppings */}
                        <td className="py-3 px-4 text-slate-500">
                          <div className="flex items-center gap-1">
                            {p.sizes?.map((s) => (
                              <span key={s.name} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold">
                                {s.name}
                              </span>
                            ))}
                            <span className="text-[11px] text-slate-400 ml-1">
                              • {p.toppings?.length || 0} toppings
                            </span>
                          </div>
                        </td>

                        {/* Nút Gạt Toggle Trạng Thái isAvailable */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(p._id, isAvailable)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
                              }`}
                              title={isAvailable ? 'Bấm để đánh dấu Hết hàng' : 'Bấm để đánh dấu Còn hàng'}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                  isAvailable ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                            <span
                              className={`text-[11px] font-bold w-16 text-left ${
                                isAvailable ? 'text-emerald-700' : 'text-slate-400'
                              }`}
                            >
                              {isAvailable ? 'Còn hàng' : 'Hết hàng'}
                            </span>
                          </div>
                        </td>

                        {/* Xóa món */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p._id, p.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Xóa món"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Thêm Món Mới */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
};
