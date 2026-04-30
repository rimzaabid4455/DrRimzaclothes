import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { assetUrl } from '../lib/api.js';
import { formatAED } from '../lib/format.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        if (cancelled) return;
        setProduct(data);
        setSize(data.sizes?.[0] || '');
      })
      .catch(() => {
        if (!cancelled) setProduct(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="section grid gap-10 py-16 md:grid-cols-2">
        <div className="aspect-[3/4] animate-pulse bg-cream-100" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse bg-cream-100" />
          <div className="h-4 w-full animate-pulse bg-cream-100" />
          <div className="h-4 w-3/4 animate-pulse bg-cream-100" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section py-24 text-center">
        <h1 className="font-display text-4xl">Piece not found</h1>
        <Link to="/shop" className="mt-6 inline-block text-sm uppercase tracking-widest text-gold-500">
          Back to shop
        </Link>
      </div>
    );
  }

  const handleAdd = (goCheckout = false) => {
    if (product.sizes && product.sizes.length > 0 && !size) {
      setError('Please select a size');
      return;
    }
    addItem({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      quantity: qty,
    });
    setError('');
    if (goCheckout) navigate('/checkout');
    else navigate('/cart');
  };

  const img = product.image ? assetUrl(product.image) : null;

  return (
    <div className="section py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-[3/4] overflow-hidden bg-cream-100">
          {img ? (
            <img src={img} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-ink-900">
              <span className="font-display text-7xl text-gold-300">RAS</span>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-500">{product.category}</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-2xl text-ink-900">{formatAED(product.price)}</p>

          {product.description && (
            <p className="mt-6 leading-relaxed text-ink-700">{product.description}</p>
          )}

          {product.sizes?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xs uppercase tracking-widest text-gold-500">Size</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[48px] border px-4 py-2 text-sm uppercase tracking-widest transition-colors ${
                      size === s
                        ? 'border-ink-900 bg-ink-900 text-cream-50'
                        : 'border-ink-900/30 text-ink-900 hover:border-ink-900'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-xs uppercase tracking-widest text-gold-500">Quantity</h3>
            <div className="mt-3 inline-flex items-center border border-ink-900/30">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-2 hover:bg-cream-100"
              >
                –
              </button>
              <span className="w-12 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-4 py-2 hover:bg-cream-100"
              >
                +
              </button>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => handleAdd(false)} className="btn-primary">
              Add to Cart
            </button>
            <button onClick={() => handleAdd(true)} className="btn-gold">
              Buy Now
            </button>
          </div>

          <div className="mt-10 border-t border-ink-900/10 pt-6 text-sm text-ink-700">
            <p>· Cash on Delivery available across the UAE</p>
            <p>· Hand-finished in our Dubai atelier</p>
            <p>· Free exchanges within 7 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
