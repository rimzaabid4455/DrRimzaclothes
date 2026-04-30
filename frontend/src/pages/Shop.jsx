import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { CATEGORY_IMAGES, HERO_IMAGES, SHOWCASE_PRODUCTS } from '../lib/showcase.js';
import { formatAED } from '../lib/format.js';
import { Link } from 'react-router-dom';

const CATEGORIES = ['Abayas', 'Kaftans', 'Dresses', 'Evening Wear', 'Accessories'];

const ShowcaseTile = ({ p }) => (
  <Link to="/shop" className="group block">
    <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
      <img
        src={p.image}
        alt={p.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>
    <div className="space-y-1 p-4 text-center">
      <p className="kicker">{p.category}</p>
      <h3 className="font-display text-xl">{p.name}</h3>
      <p className="text-sm text-ink-700">{formatAED(p.price)}</p>
    </div>
  </Link>
);
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

  const heroImg = (category && CATEGORY_IMAGES[category]) || HERO_IMAGES.main;

  return (
    <div>
      <section className="relative h-[44vh] min-h-[300px] overflow-hidden bg-ink-900 text-cream-50">
        <img
          src={heroImg}
          alt={category || 'Boutique'}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/50 to-transparent" />
        <div className="relative z-10 flex h-full items-end pb-12">
          <div className="section">
            <p className="kicker-light">Boutique</p>
            <h1 className="mt-3 font-display text-5xl md:text-7xl">
              {category || 'The Collection'}
            </h1>
          </div>
        </div>
      </section>

      <div className="section py-12">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
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
            <div>
              <div className="mb-8 border border-gold-300/40 bg-cream-100 p-6 text-center">
                <p className="kicker">Atelier Preview</p>
                <p className="mt-2 text-sm text-ink-700">
                  Our boutique is being curated. Below is a glimpse of the
                  upcoming collection — admin can add live products from the
                  panel.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(category
                  ? SHOWCASE_PRODUCTS.filter((p) => p.category === category)
                  : SHOWCASE_PRODUCTS
                ).map((p) => (
                  <ShowcaseTile key={p.id} p={p} />
                ))}
              </div>
            </div>
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
    </div>
  );
}
