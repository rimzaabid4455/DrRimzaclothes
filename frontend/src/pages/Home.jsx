import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api.js';
import ProductCard from '../components/ProductCard.jsx';

const CATEGORIES = [
  { name: 'Abayas', tagline: 'Timeless silhouettes' },
  { name: 'Kaftans', tagline: 'Effortless elegance' },
  { name: 'Dresses', tagline: 'Modern grace' },
  { name: 'Evening Wear', tagline: 'Quiet drama' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/products', { params: { featured: 'true' } });
        if (!cancelled) setFeatured(data.slice(0, 8));
      } catch (_) {
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-ink-900 text-cream-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(207,160,51,0.15),_transparent_60%)]" />
        <div className="section relative grid gap-12 py-24 md:grid-cols-2 md:py-32">
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.4em] text-gold-300">RAS · Dubai</p>
            <h1 className="mt-6 font-display text-5xl leading-tight md:text-7xl">
              Heritage of <span className="text-gold-300">grace</span>,
              <br />
              draped in modernity.
            </h1>
            <p className="mt-6 max-w-md text-cream-50/70">
              A private atelier in Dubai crafting abayas, kaftans and evening wear from the
              finest fabrics — each piece, an heirloom in the making.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/shop" className="btn-gold">Discover Collection</Link>
              <Link to="/shop?category=Evening Wear" className="btn-outline border-cream-50 text-cream-50 hover:bg-cream-50 hover:text-ink-900">
                Evening Wear
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute right-0 top-0 h-[480px] w-[360px] bg-gradient-to-br from-gold-300/20 via-gold-500/10 to-transparent" />
            <div className="absolute right-12 top-12 flex h-[480px] w-[360px] items-center justify-center border border-gold-300/30 bg-ink-800">
              <span className="font-display text-9xl text-gold-300/80">RAS</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-500">The Edit</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Curated Categories</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              to={`/shop?category=${encodeURIComponent(c.name)}`}
              className="group relative aspect-[3/4] overflow-hidden bg-ink-900 text-cream-50"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-900/30 to-ink-900/80 transition-opacity group-hover:opacity-90" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-gold-300">{c.tagline}</p>
                <h3 className="mt-2 font-display text-3xl">{c.name}</h3>
              </div>
              <div className="absolute inset-0 -z-0 flex items-center justify-center text-gold-300/20">
                <span className="font-display text-[8rem]">{c.name[0]}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gold-500">Atelier Picks</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Featured Pieces</h2>
          </div>
          <Link to="/shop" className="hidden text-xs uppercase tracking-widest text-ink-900 hover:text-gold-500 md:inline">
            View all →
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse bg-cream-100" />
              ))
            : featured.length > 0
            ? featured.map((p) => <ProductCard key={p._id} product={p} />)
            : (
              <p className="col-span-full text-center text-ink-700/70">
                No featured pieces yet. Check the boutique soon.
              </p>
            )}
        </div>
      </section>

      <section className="bg-cream-100 py-20">
        <div className="section grid items-center gap-10 md:grid-cols-3">
          {[
            { t: 'Crafted in Dubai', d: 'Hand-finished by master tailors in our private atelier.' },
            { t: 'Luxe Materials', d: 'Silk, chiffon, embroidered tulle, and pearl detailing.' },
            { t: 'Cash on Delivery', d: 'Pay when your order arrives, anywhere in the UAE.' },
          ].map((b) => (
            <div key={b.t} className="text-center">
              <h3 className="font-display text-2xl">{b.t}</h3>
              <p className="mt-2 text-sm text-ink-700">{b.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
