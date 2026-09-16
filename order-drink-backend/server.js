const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Nạp .env từ thư mục hiện tại hoặc thư mục cha
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const server = http.createServer(app);

// Cấu hình Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

// Lưu io vào app để các controllers có thể truy cập
app.set('io', io);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io Events
io.on('connection', (socket) => {
  console.log(`[Socket] Khách kết nối: ${socket.id}`);

  // Khách hàng vào phòng theo dõi đơn cụ thể
  socket.on('join_order_room', (orderId) => {
    if (orderId) {
      const room = `order_${orderId}`;
      socket.join(room);
      console.log(`[Socket] ${socket.id} đã tham gia room: ${room}`);
    }
  });

  // Admin / KDS tham gia phòng quản lý đơn
  socket.on('join_admin_room', () => {
    socket.join('admin_orders');
    console.log(`[Socket] Admin/KDS đã tham gia room: admin_orders`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Ngắt kết nối: ${socket.id}`);
  });
});

// Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'order-drink-backend',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Lỗi hệ thống máy chủ',
  });
});

// Kết nối MongoDB và Khởi động Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/order_drink_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`✅ Đã kết nối MongoDB thành công: ${MONGO_URI}`);
    server.listen(PORT, () => {
      console.log(`🚀 Máy chủ Backend đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
    // Vẫn lắng nghe server để phát hiện lỗi rõ ràng
    server.listen(PORT, () => {
      console.log(`⚠️ Máy chủ chạy tại http://localhost:${PORT} (Chưa có MongoDB kết nối)`);
    });
  });
