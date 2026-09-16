const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên món là bắt buộc'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Danh mục là bắt buộc'],
    trim: true,
  },
  basePrice: {
    type: Number,
    required: [true, 'Giá cơ bản là bắt buộc'],
    min: 0,
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  sizes: [
    {
      name: { type: String, required: true },
      extraPrice: { type: Number, default: 0 },
    },
  ],
  toppings: [
    {
      name: { type: String, required: true },
      price: { type: Number, default: 0 },
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
