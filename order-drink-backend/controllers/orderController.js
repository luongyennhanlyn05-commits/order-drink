const Order = require('../models/Order');

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const { tableNumber, items, totalAmount } = req.body;

    if (!tableNumber || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Thông tin đơn hàng không đầy đủ (cần số bàn và danh sách món)',
      });
    }

    const order = await Order.create({
      tableNumber,
      items,
      totalAmount,
      status: 'pending',
      estimatedMinutes: 0,
    });

    // Phát socket realtime tới phân hệ Bếp/Admin
    const io = req.app.get('io');
    if (io) {
      io.to('admin_orders').emit('new_order', order);
      // Phát cả broadcast chung đề phòng admin chưa join room
      io.emit('new_order', order);
    }

    res.status(201).json({
      success: true,
      message: 'Đặt đơn thành công',
      data: order,
    });
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đơn hàng',
      error: error.message,
    });
  }
};

// Lấy danh sách đơn hàng
exports.getOrders = async (req, res) => {
  try {
    const { status, tableNumber } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }
    if (tableNumber) {
      filter.tableNumber = tableNumber;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: error.message });
  }
};

// Lấy chi tiết 1 đơn hàng
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: error.message });
  }
};

// Cập nhật trạng thái đơn hàng và thời gian ước tính (KDS Bếp)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, estimatedMinutes } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    if (status) {
      order.status = status;
    }
    if (typeof estimatedMinutes === 'number') {
      order.estimatedMinutes = estimatedMinutes;
    }

    await order.save();

    // Phát socket realtime cập nhật trạng thái
    const io = req.app.get('io');
    if (io) {
      // Gửi vào room riêng của order khách hàng
      io.to(`order_${order._id}`).emit('order_status_updated', order);
      // Gửi cho admin / kds
      io.to('admin_orders').emit('order_status_updated', order);
      io.emit('order_status_updated', order);
    }

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái',
      error: error.message,
    });
  }
};

// Thống kê doanh thu: tổng doanh thu, tổng đơn hàng, tổng số ly
exports.getRevenueSummary = async (req, res) => {
  try {
    // Chỉ tính các đơn không bị hủy (pending, preparing, completed)
    const validOrders = await Order.find({ status: { $ne: 'cancelled' } });

    const totalOrders = validOrders.length;
    const totalRevenue = validOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    // Đếm tổng số ly (tổng quantity của tất cả items)
    const totalItems = validOrders.reduce((sum, order) => {
      const itemsCount = order.items.reduce((iSum, item) => iSum + (item.quantity || 1), 0);
      return sum + itemsCount;
    }, 0);

    // Thống kê theo trạng thái
    const statusCounts = {
      pending: 0,
      preparing: 0,
      completed: 0,
      cancelled: 0,
    };

    const allOrders = await Order.find();
    allOrders.forEach((o) => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      }
    });

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalItems,
        statusCounts,
      },
    });
  } catch (error) {
    console.error('Lỗi khi tính doanh thu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy dữ liệu doanh thu',
      error: error.message,
    });
  }
};
