const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getRevenueSummary,
} = require('../controllers/orderController');

router.route('/')
  .post(createOrder)
  .get(getOrders);

router.get('/revenue/summary', getRevenueSummary);

router.route('/:id')
  .get(getOrderById);

router.put('/:id/status', updateOrderStatus);

module.exports = router;
