const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'M',
  },
  ice: {
    type: String,
    default: '100%',
  },
  sugar: {
    type: String,
    default: '100%',
  },
  toppings: [
    {
      type: String,
    },
  ],
  note: {
    type: String,
    default: '',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  itemTotal: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: [true, 'Số bàn là bắt buộc'],
  },
  totalAmount: {
    type: Number,
    required: [true, 'Tổng tiền là bắt buộc'],
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'completed', 'cancelled'],
    default: 'pending',
  },
  estimatedMinutes: {
    type: Number,
    default: 0,
  },
  items: [orderItemSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
