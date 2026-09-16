import api from './api';

export const orderService = {
  // Tạo đơn hàng mới từ giỏ hàng khách hàng
  create: async (orderData) => {
    return await api.post('/orders', orderData);
  },

  // Lấy danh sách đơn hàng (cho Admin KDS)
  getAll: async (params = {}) => {
    return await api.get('/orders', { params });
  },

  // Lấy chi tiết đơn hàng (cho trang Tracking)
  getById: async (id) => {
    return await api.get(`/orders/${id}`);
  },

  // Cập nhật trạng thái và số phút ước tính (cho Admin KDS)
  updateStatus: async (id, { status, estimatedMinutes }) => {
    return await api.put(`/orders/${id}/status`, { status, estimatedMinutes });
  },

  // Lấy tổng quan doanh thu, số đơn, số ly đã bán
  getRevenueSummary: async () => {
    return await api.get('/orders/revenue/summary');
  },
};
