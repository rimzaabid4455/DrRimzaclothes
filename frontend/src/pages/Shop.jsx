import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api.js';
import ProductCard from '../components/ProductCard.jsx';

const CATEGORIES = ['Abayas', 'Kaftans', 'Dresses', 'Evening Wear', 'Accessories'];
const SORTS = [
  { value: '', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const params = useMemo(() => {
    const p = {};
    if (category) p.category = category;
    if (sort) p.sort = sort;
    if (minPrice) p.minPrice = minPrice;
    if (maxPrice) p.maxPrice = maxPrice;
    return p;
  }, [category, sort, minPrice, maxPrice]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get('/products', { params })
      .then(({ data }) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params]);

  const update = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="section py-12">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-gold-500">Boutique</p>
        <h1 className="mt-3 font-display text-5xl">
          {category || 'The Collection'}
        </h1>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[240px_1fr]">
        <aside className="space-y-8">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gold-500">Category</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <button
                  onClick={() => update('category', '')}
                  className={`hover:text-gold-500 ${!category ? 'text-gold-500' : ''}`}
                >
                  All
                </button>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => update('category', c)}
                    className={`hover:text-gold-500 ${category === c ? 'text-gold-500' : ''}`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-gold-500">Price (AED)</h3>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                defaultValue={minPrice}
                onBlur={(e) => update('minPrice', e.target.value)}
                className="input"
              />
              <input
                type="number"
                placeholder="Max"
                defaultValue={maxPrice}
                onBlur={(e) => update('maxPrice', e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-gold-500">Sort</h3>
            <select
              value={sort}
              onChange={(e) => update('sort', e.target.value)}
              className="input mt-4"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <section>
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse bg-cream-100" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="py-20 text-center text-ink-700/70">
              No pieces found. Try clearing filters.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
