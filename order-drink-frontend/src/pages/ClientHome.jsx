import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../components/client/Header';
import { SearchAndFilter } from '../components/client/SearchAndFilter';
import { ProductCard } from '../components/client/ProductCard';
import { CustomizationModal } from '../components/client/CustomizationModal';
import { CartFloatingButton } from '../components/client/CartFloatingButton';
import { CartDrawer } from '../components/client/CartDrawer';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import { RefreshCw, Coffee, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Tất cả', 'Trà sữa', 'Cà phê', 'Trà trái cây', 'Đá xay'];

export const ClientHome = ({ onNavigateToTracking }) => {
  const { tableNumber, setTableNumber, addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  // Modal tùy chỉnh món
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Drawer Giỏ hàng
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Đọc số bàn từ URL query (?table=05)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      setTableNumber(tableParam);
    }
  }, [setTableNumber]);

  // Tải danh sách món từ Backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await productService.getAll();
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Lỗi tải sản phẩm:', err);
      setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra backend!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Lọc sản phẩm theo Category & Search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        selectedCategory === 'Tất cả' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery || p.name?.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Mở modal tùy chỉnh món
  const handleOpenCustomization = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Xác nhận thêm vào giỏ
  const handleAddToCart = (customizedItem) => {
    addToCart(customizedItem);
  };

  // Sau khi đặt đơn thành công -> chuyển sang trang Tracking
  const handleOrderPlaced = (orderData) => {
    if (onNavigateToTracking) {
      onNavigateToTracking(orderData._id);
    }
  };

  const hasActiveOrder = !!localStorage.getItem('kopi_active_order_id');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header cố định phía trên với số bàn và nút quay lại */}
      <Header
        tableNumber={tableNumber}
        onBack={() => window.history.back()}
        onOpenTracking={() => onNavigateToTracking && onNavigateToTracking()}
        hasActiveOrder={hasActiveOrder}
      />

      {/* Main Container - Mobile First (max-w-md căn giữa màn hình) */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pb-28">
        
        {/* Thanh tìm kiếm & lọc danh mục */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          totalResults={filteredProducts.length}
        />

        {/* Trạng thái Lỗi */}
        {error && (
          <div className="my-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-xs text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchProducts}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg font-bold text-red-800 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Trạng thái Đang tải */}
        {loading && (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mb-3" />
            <p className="text-xs font-semibold text-slate-500">Đang chuẩn bị thực đơn...</p>
          </div>
        )}

        {/* Danh Sách Món Ăn Dạng Lưới (2 cột trên Mobile) */}
        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Coffee className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">Không tìm thấy món phù hợp</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Hãy thử tìm bằng từ khóa khác hoặc chuyển danh mục
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onSelect={handleOpenCustomization}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Nút Giỏ Hàng Nổi (FAB) */}
      <CartFloatingButton onClick={() => setIsCartOpen(true)} />

      {/* Drawer Giỏ Hàng & Checkout */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Modal Tùy Chỉnh Món (Size, Đá, Đường, Topping, Note) */}
      <CustomizationModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};
