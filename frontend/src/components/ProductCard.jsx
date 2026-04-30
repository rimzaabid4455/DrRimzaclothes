import { Link } from 'react-router-dom';
import { assetUrl } from '../lib/api.js';
import { formatAED } from '../lib/format.js';

export default function ProductCard({ product }) {
  const img = product.image ? assetUrl(product.image) : null;
  return (
    <Link to={`/product/${product._id}`} className="card group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
        {img ? (
          <img
            src={img}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-900 to-ink-700 text-gold-300">
            <span className="font-display text-5xl">RAS</span>
          </div>
        )}
        {product.featured && (
          <span className="absolute left-3 top-3 bg-gold-400 px-2 py-1 text-[10px] uppercase tracking-widest text-ink-900">
            Featured
          </span>
        )}
      </div>
      <div className="space-y-1 p-4 text-center">
        <p className="text-[10px] uppercase tracking-widest text-gold-500">{product.category}</p>
        <h3 className="font-display text-xl text-ink-900">{product.name}</h3>
        <p className="text-sm text-ink-700">{formatAED(product.price)}</p>
      </div>
    </Link>
  );
}
