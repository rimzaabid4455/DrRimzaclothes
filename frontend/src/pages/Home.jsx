import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api.js';
import ProductCard from '../components/ProductCard.jsx';
import {
  CATEGORY_IMAGES,
  HERO_IMAGES,
  LOOKBOOK,
  SHOWCASE_PRODUCTS,
  TESTIMONIALS,
} from '../lib/showcase.js';
import { formatAED } from '../lib/format.js';

const CATEGORIES = [
  { name: 'Abayas', tagline: 'Timeless silhouettes' },
  { name: 'Kaftans', tagline: 'Effortless elegance' },
  { name: 'Dresses', tagline: 'Modern grace' },
  { name: 'Evening Wear', tagline: 'Quiet drama' },
];

const ShowcaseCard = ({ p }) => (
  <Link to="/shop" className="group block">
    <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
      <img
        src={p.image}
        alt={p.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span className="absolute left-3 top-3 bg-ink-900/80 px-2 py-1 text-[10px] uppercase tracking-widest text-gold-300">
        Atelier Edit
      </span>
    </div>
    <div className="space-y-1 p-4 text-center">
      <p className="kicker">{p.category}</p>
      <h3 className="font-display text-xl">{p.name}</h3>
      <p className="text-sm text-ink-700">{formatAED(p.price)}</p>
    </div>
  </Link>
);

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
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[600px] overflow-hidden bg-ink-900 text-cream-50">
        <img
          src={HERO_IMAGES.main}
          alt="RAS Atelier"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/60 to-transparent" />
        <div className="relative z-10 flex h-full items-center">
          <div className="section">
            <div className="max-w-2xl fade-up">
              <p className="kicker-light">Eid Edit · 2026 · Dubai</p>
              <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-7xl lg:text-8xl">
                A whisper of <span className="italic text-gold-300">silk</span>,
                <br />
                a heritage of <span className="italic text-gold-300">grace</span>.
              </h1>
              <p className="mt-8 max-w-md text-lg text-cream-50/80">
                Hand-finished abayas, kaftans and evening wear, born in our
                private Dubai atelier. Each piece is made to be remembered.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/shop" className="btn-gold">
                  Shop the Collection
                </Link>
                <Link to="/lookbook" className="btn-ghost-gold">
                  View Lookbook
                </Link>
              </div>
              <div className="mt-12 flex items-center gap-6 text-xs uppercase tracking-[0.3em] text-cream-50/70">
                <span>✦ Free UAE shipping</span>
                <span>✦ COD available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand strip */}
      <section className="border-y border-ink-900/10 bg-cream-100 py-10">
        <div className="section grid gap-8 md:grid-cols-4">
          {[
            { t: 'Crafted in Dubai', d: 'Master tailors, private atelier' },
            { t: 'Couture Fabrics', d: 'Italian silk · French chiffon · Pearl' },
            { t: 'Made to Order', d: 'Bespoke fittings on request' },
            { t: 'COD across UAE', d: 'Free shipping above AED 500' },
          ].map((b) => (
            <div key={b.t} className="text-center">
              <h3 className="font-display text-xl">{b.t}</h3>
              <p className="mt-2 text-xs uppercase tracking-widest text-ink-700">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section py-24">
        <div className="text-center">
          <p className="kicker">The Edit</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Curated Categories</h2>
          <div className="shimmer-divider mx-auto mt-6" />
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              to={`/shop?category=${encodeURIComponent(c.name)}`}
              className="group relative aspect-[3/4] overflow-hidden bg-ink-900 text-cream-50"
            >
              <img
                src={CATEGORY_IMAGES[c.name]}
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-900/30 to-ink-900/85" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                <p className="kicker-light">{c.tagline}</p>
                <h3 className="mt-3 font-display text-3xl md:text-4xl">{c.name}</h3>
                <span className="mt-4 inline-block border-b border-gold-300/0 text-xs uppercase tracking-[0.3em] text-gold-300 transition-all group-hover:border-gold-300">
                  Discover →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial split — heritage */}
      <section className="bg-ink-900 text-cream-50">
        <div className="section grid gap-12 py-24 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={HERO_IMAGES.side}
              alt="Heritage"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="kicker-light">The House of RAS</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              A heritage of <span className="italic text-gold-300">embroidery</span>,
              told in modern lines.
            </h2>
            <p className="mt-6 text-cream-50/80">
              Founded in the heart of Dubai, RAS draws from the embroidery houses
              of the Gulf and the cutting tables of Paris. Every garment passes
              through twelve pairs of hands — from initial sketch to the final
              hand-sewn pearl — before it earns the RAS label.
            </p>
            <p className="mt-4 text-cream-50/60">
              Our atelier opens by appointment for bespoke fittings, sourcing
              silks and chiffons from Como and Lyon, and pairing them with
              traditional Khaleeji craftsmanship.
            </p>
            <Link to="/shop" className="btn-ghost-gold mt-10 inline-flex">
              Explore the Atelier
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products (live from DB) + showcase fallback */}
      <section className="section py-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="kicker">Atelier Picks</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Featured Pieces</h2>
            <div className="shimmer-divider mt-6" />
          </div>
          <Link
            to="/shop"
            className="hidden text-xs uppercase tracking-widest text-ink-900 hover:text-gold-500 md:inline"
          >
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
            : SHOWCASE_PRODUCTS.slice(0, 4).map((p) => <ShowcaseCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Lookbook full-bleed grid */}
      <section className="bg-cream-100 py-24">
        <div className="section">
          <div className="text-center">
            <p className="kicker">Spring Lookbook</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Editorial 2026</h2>
            <div className="shimmer-divider mx-auto mt-6" />
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-4">
          {LOOKBOOK.map((src, i) => (
            <Link
              to="/lookbook"
              key={i}
              className="group relative aspect-[3/4] overflow-hidden bg-ink-900"
            >
              <img
                src={src}
                alt={`Look ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink-900/0 transition-colors group-hover:bg-ink-900/30" />
              <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.3em] text-cream-50 opacity-0 transition-opacity group-hover:opacity-100">
                Look 0{i + 1}
              </span>
            </Link>
          ))}
        </div>
        <div className="section mt-12 text-center">
          <Link to="/lookbook" className="btn-outline">
            View Full Lookbook
          </Link>
        </div>
      </section>

      {/* New Arrivals showcase grid */}
      <section className="section py-24">
        <div className="text-center">
          <p className="kicker">Just Arrived</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">New This Week</h2>
          <div className="shimmer-divider mx-auto mt-6" />
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SHOWCASE_PRODUCTS.slice(4, 8).map((p) => (
            <ShowcaseCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-ink-900 py-24 text-cream-50">
        <div className="section">
          <div className="text-center">
            <p className="kicker-light">In Their Words</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Whispers from our muse</h2>
            <div className="shimmer-divider mx-auto mt-6" />
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="border border-cream-50/10 p-8 text-center"
              >
                <div className="text-3xl text-gold-300">“</div>
                <blockquote className="mt-4 text-cream-50/80">{t.quote}</blockquote>
                <figcaption className="mt-6">
                  <p className="font-display text-xl">{t.name}</p>
                  <p className="text-xs uppercase tracking-widest text-gold-300">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram strip */}
      <section className="section py-24">
        <div className="text-center">
          <p className="kicker">Follow the Atelier</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">@rasdubai</h2>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {LOOKBOOK.slice(0, 6).map((src, i) => (
            <a
              href="#"
              key={i}
              className="group relative aspect-square overflow-hidden bg-ink-900"
            >
              <img
                src={src}
                alt={`Instagram ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink-900/0 transition-colors group-hover:bg-ink-900/40">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-gold-300 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gold-400 text-ink-900">
        <div className="section grid gap-8 py-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="kicker text-ink-900">Private Invitation</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              Join the RAS circle.
            </h2>
            <p className="mt-3 max-w-md text-ink-900/80">
              Be the first to view new collections, atelier openings, and
              private events. No noise — just couture.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              placeholder="Your email"
              required
              className="flex-1 border border-ink-900 bg-transparent px-4 py-3 text-sm placeholder:text-ink-900/50 focus:outline-none"
            />
            <button className="btn-primary">Join</button>
          </form>
        </div>
      </section>
    </div>
  );
}
