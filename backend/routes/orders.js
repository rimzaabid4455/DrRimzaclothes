const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

const VALID_STATUS = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

router.post('/', async (req, res, next) => {
  try {
    const { customer, address, items, shipping = 0, paymentMethod = 'COD' } = req.body;

    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({ message: 'Customer name and phone are required' });
    }
    if (!address || !address.line1 || !address.city) {
      return res.status(400).json({ message: 'Address line and city are required' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    const productIds = items.map((i) => i.product).filter(Boolean);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    const orderItems = items.map((i) => {
      const p = productMap.get(String(i.product));
      const price = p ? p.price : Number(i.price) || 0;
      const name = p ? p.name : i.name;
      const image = p ? p.image : i.image || '';
      const quantity = Math.max(1, Number(i.quantity) || 1);
      return {
        product: p ? p._id : undefined,
        name,
        price,
        image,
        size: i.size || '',
        quantity,
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = subtotal + Number(shipping || 0);

    const order = await Order.create({
      customer,
      address,
      items: orderItems,
      subtotal,
      shipping: Number(shipping || 0),
      total,
      paymentMethod,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

router.get('/', auth, async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get('/stats', auth, async (req, res, next) => {
  try {
    const [totalOrders, totalProducts, revenueAgg, statusAgg] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);
    const revenue = revenueAgg[0]?.total || 0;
    const byStatus = statusAgg.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {});
    res.json({ totalOrders, totalProducts, revenue, byStatus });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUS.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
