const mongoose = require('mongoose');

const CATEGORIES = ['Abayas', 'Kaftans', 'Dresses', 'Evening Wear', 'Accessories'];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: CATEGORIES, required: true },
    sizes: { type: [String], default: ['S', 'M', 'L', 'XL'] },
    image: { type: String, default: '' },
    stock: { type: Number, default: 100, min: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
module.exports.CATEGORIES = CATEGORIES;
