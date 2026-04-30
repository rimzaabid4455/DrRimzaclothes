const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: '' },
    size: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String, default: '' },
      phone: { type: String, required: true },
    },
    address: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      emirate: { type: String, default: 'Dubai' },
      country: { type: String, default: 'UAE' },
      notes: { type: String, default: '' },
    },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: 'COD' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
