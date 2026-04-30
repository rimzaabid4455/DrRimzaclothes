const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safe = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safe);
  },
});

const fileFilter = (req, file, cb) => {
  if (/^image\/(jpeg|png|jpg|webp|gif)$/.test(file.mimetype)) cb(null, true);
  else cb(new Error('Only image files are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const parseSizes = (raw) => {
  if (!raw) return undefined;
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (_) {}
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
};

router.get('/', async (req, res, next) => {
  try {
    const { category, featured, search, minPrice, maxPrice, sort } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Product.find(filter);
    if (sort === 'price_asc') query = query.sort({ price: 1 });
    else if (sort === 'price_desc') query = query.sort({ price: -1 });
    else query = query.sort({ createdAt: -1 });

    const products = await query.exec();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.post('/', auth, upload.single('image'), async (req, res, next) => {
  try {
    const { name, description, price, category, stock, featured } = req.body;
    const sizes = parseSizes(req.body.sizes);
    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      sizes,
      stock: stock !== undefined ? Number(stock) : undefined,
      featured: featured === 'true' || featured === true,
      image: req.file ? `/uploads/${req.file.filename}` : '',
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, category, stock, featured } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);
    if (featured !== undefined) product.featured = featured === 'true' || featured === true;
    const sizes = parseSizes(req.body.sizes);
    if (sizes) product.sizes = sizes;

    if (req.file) {
      if (product.image && product.image.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', product.image);
        fs.promises.unlink(oldPath).catch(() => {});
      }
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.image && product.image.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', product.image);
      fs.promises.unlink(filePath).catch(() => {});
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
