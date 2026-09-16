const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/order_drink_db';

const defaultSizes = [
  { name: 'S', extraPrice: 0 },
  { name: 'M', extraPrice: 6000 },
  { name: 'L', extraPrice: 12000 },
];

const defaultToppings = [
  { name: 'Trân châu đen', price: 8000 },
  { name: 'Trân châu trắng hoàng kim', price: 10000 },
  { name: 'Thạch củ năng giòn', price: 9000 },
  { name: 'Pudding trứng béo', price: 10000 },
  { name: 'Kem Cheese Macchiato', price: 12000 },
  { name: 'Đào miếng giòn', price: 10000 },
];

const sampleProducts = [
  {
    name: 'Trà Sữa Ô Long Nướng Kem Cheese',
    category: 'Trà sữa',
    basePrice: 42000,
    image: 'https://images.unsplash.com/photo-1558857563-b37cf05d8a58?w=700&auto=format&fit=crop&q=80',
    isAvailable: true,
    sizes: defaultSizes,
    toppings: defaultToppings,
  },
  {
    name: 'Trà Sữa Trân Châu Đường Đen',
    category: 'Trà sữa',
    basePrice: 45000,
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=700&auto=format&fit=crop&q=80',
    isAvailable: true,
    sizes: defaultSizes,
    toppings: defaultToppings,
  },
  {
    name: 'Trà Sữa Matcha Nhật Bản',
    category: 'Trà sữa',
    basePrice: 48000,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=700&auto=format&fit=crop&q=80',
    isAvailable: true,
    sizes: defaultSizes,
    toppings: defaultToppings,
  },
  {
    name: 'Cà Phê Muối Cố Đô',
    category: 'Cà phê',
    basePrice: 32000,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=700&auto=format&fit=crop&q=80',
    isAvailable: true,
    sizes: [
      { name: 'S', extraPrice: 0 },
      { name: 'M', extraPrice: 5000 },
    ],
    toppings: [
      { name: 'Thêm shot Espresso', price: 12000 },
      { name: 'Kem mặn muối biển', price: 8000 },
    ],
  },
  {
    name: 'Cà Phê Sữa Đá Sài Gòn',
    category: 'Cà phê',
    basePrice: 28000,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=700&auto=format&fit=crop&q=80',
    isAvailable: true,
    sizes: [
      { name: 'S', extraPrice: 0 },
      { name: 'M', extraPrice: 5000 },
      { name: 'L', extraPrice: 10000 },
    ],
    toppings: [
      { name: 'Thạch cà phê giòn', price: 8000 },
    ],
  },
  {
    name: 'Bạc Xỉu Kem Trứng Cháy',
    category: 'Cà phê',
    basePrice: 38000,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=700&auto=format&fit=crop&q=80',
    isAvailable: true,
    sizes: defaultSizes,
    toppings: defaultToppings,
  },
  {
    name: 'Trà Đào Cam Sả Tươi Mát',
    category: 'Trà trái cây',
    basePrice: 42000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=700&auto=format&fit=crop&q=80',
    isAvailable: true,
    sizes: defaultSizes,
    toppings: defaultToppings,
  },
  {
    name: 'Trà Mãng Cầu Đắk Lắk',
    category: 'Trà trái cây',
    basePrice: 45000,
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=700&auto=format&fit=crop&q=80',
    isAvailable: true,
    sizes: defaultSizes,
    toppings: defaultToppings,
  },
  {
    name: 'Trà Vải Hoa Hồng Ruby',
    category: 'Trà trái cây',
    basePrice: 45000,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700&auto=format&fit=crop&q=80',
    isAvailable: false, // Thử nghiệm 1 món hết hàng
    sizes: defaultSizes,
    toppings: defaultToppings,
  },
  {
    name: 'Đá Xay Matcha Đậu Đỏ',
    category: 'Đá xay',
    basePrice: 52000,
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=700&auto=format&fit=crop&q=80',
    isAvailable: true,
    sizes: defaultSizes,
    toppings: defaultToppings,
  },
  {
    name: 'Đá Xay Cà Phê Caramel Bánh Quy',
    category: 'Đá xay',
    basePrice: 55000,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700&auto=format&fit=crop&q=80',
    isAvailable: true,
    sizes: defaultSizes,
    toppings: defaultToppings,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Kết nối MongoDB thành công: ${MONGO_URI}`);

    // Xóa sản phẩm cũ để làm mới
    await Product.deleteMany({});
    console.log('Đã làm sạch bộ sưu tập Products cũ');

    const created = await Product.insertMany(sampleProducts);
    console.log(`✅ Đã nạp thành công ${created.length} sản phẩm mẫu chất lượng cao!`);

    // Tạo sẵn 2 đơn hàng mẫu để KDS và Báo cáo có dữ liệu trực quan
    const pendingOrder = {
      tableNumber: '03',
      totalAmount: 98000,
      status: 'pending',
      estimatedMinutes: 0,
      items: [
        {
          productId: created[0]._id,
          name: created[0].name,
          size: 'M',
          ice: '50%',
          sugar: '70%',
          toppings: ['Trân châu đen', 'Kem Cheese Macchiato'],
          note: 'Cho ít đá thôi nhé',
          quantity: 1,
          unitPrice: 60000,
          itemTotal: 60000,
        },
        {
          productId: created[3]._id,
          name: created[3].name,
          size: 'S',
          ice: '100%',
          sugar: '100%',
          toppings: [],
          note: '',
          quantity: 1,
          unitPrice: 38000,
          itemTotal: 38000,
        },
      ],
    };

    const preparingOrder = {
      tableNumber: '08',
      totalAmount: 110000,
      status: 'preparing',
      estimatedMinutes: 10,
      items: [
        {
          productId: created[1]._id,
          name: created[1].name,
          size: 'L',
          ice: '100%',
          sugar: '50%',
          toppings: ['Pudding trứng béo'],
          note: 'Mang ly giấy',
          quantity: 2,
          unitPrice: 55000,
          itemTotal: 110000,
        },
      ],
    };

    await Order.deleteMany({});
    await Order.create([pendingOrder, preparingOrder]);
    console.log('✅ Đã tạo đơn hàng mẫu cho KDS!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi nạp dữ liệu mẫu:', error);
    process.exit(1);
  }
}

seedDatabase();
