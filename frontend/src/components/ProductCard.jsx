import { useState } from 'react';
import { Link } from 'react-router-dom';
import { assetUrl } from '../lib/api.js';
import { formatAED } from '../lib/format.js';

export default function ProductCard({ product }) {
  const initial = product.image ? assetUrl(product.image) : null;
  const [src, setSrc] = useState(initial);

  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
        {src ? (
          <img
            src={src}
            alt={product.name}
            loading="lazy"
            onError={() => setSrc(null)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-900 via-ink-800 to-ink-700 text-gold-300">
            <span className="font-display text-6xl tracking-[0.2em]">RAS</span>
          </div>
        )}
        {product.featured && (
          <span className="absolute left-3 top-3 bg-ink-900/85 px-2 py-1 text-[10px] uppercase tracking-widest text-gold-300">
            Featured
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-ink-900/85 p-3 text-center text-xs uppercase tracking-widest text-cream-50 transition-transform duration-300 group-hover:translate-y-0">
          View Piece
        </div>
      </div>
      <div className="space-y-1 p-4 text-center">
        <p className="kicker">{product.category}</p>
        <h3 className="font-display text-xl text-ink-900">{product.name}</h3>
        <p className="text-sm text-ink-700">{formatAED(product.price)}</p>
      </div>
    </Link>
  );
}
