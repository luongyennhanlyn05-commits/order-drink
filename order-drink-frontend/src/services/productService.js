import api from './api';

export const productService = {
  // Lấy danh sách sản phẩm với các filter (category, search, availableOnly)
  getAll: async (params = {}) => {
    return await api.get('/products', { params });
  },

  // Lấy chi tiết 1 sản phẩm
  getById: async (id) => {
    return await api.get(`/products/${id}`);
  },

  // Thêm sản phẩm mới (Admin)
  create: async (productData) => {
    return await api.post('/products', productData);
  },

  // Cập nhật sản phẩm (Admin)
  update: async (id, productData) => {
    return await api.put(`/products/${id}`, productData);
  },

  // Bật/tắt trạng thái còn hàng/hết hàng
  toggleStatus: async (id, isAvailable) => {
    return await api.patch(`/products/${id}/status`, { isAvailable });
  },

  // Xóa sản phẩm
  delete: async (id) => {
    return await api.delete(`/products/${id}`);
  },
};
