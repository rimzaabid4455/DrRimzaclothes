import { Link } from 'react-router-dom';
import { LOOKBOOK, HERO_IMAGES } from '../lib/showcase.js';

const LOOKS = [
  { title: 'Look 01 — Dawn in the Old Quarter', tag: 'Abayas' },
  { title: 'Look 02 — The Pearl Hour', tag: 'Evening Wear' },
  { title: 'Look 03 — Marble & Linen', tag: 'Kaftans' },
  { title: 'Look 04 — Desert Whisper', tag: 'Dresses' },
  { title: 'Look 05 — A Private Garden', tag: 'Kaftans' },
  { title: 'Look 06 — Beneath the Chandelier', tag: 'Evening Wear' },
  { title: 'Look 07 — Marina at Dusk', tag: 'Abayas' },
  { title: 'Look 08 — The Last Light', tag: 'Dresses' },
];

export default function Lookbook() {
  return (
    <div>
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden bg-ink-900 text-cream-50">
        <img
          src={HERO_IMAGES.main}
          alt="Lookbook"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
        <div className="relative z-10 flex h-full items-end pb-16">
          <div className="section">
            <p className="kicker-light">Editorial · 2026</p>
            <h1 className="mt-4 font-display text-6xl md:text-8xl">Lookbook</h1>
            <p className="mt-3 max-w-md text-cream-50/80">
              Eight stories told through fabric, light, and stillness.
            </p>
          </div>
        </div>
      </section>

      <section className="section py-20">
        <div className="space-y-24">
          {LOOKS.map((look, i) => (
            <article
              key={look.title}
              className={`grid gap-8 md:grid-cols-2 md:items-center ${
                i % 2 === 1 ? 'md:[&>*:first-child]:order-last' : ''
              }`}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
                <img
                  src={LOOKBOOK[i % LOOKBOOK.length]}
                  alt={look.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="kicker">{look.tag}</p>
                <h2 className="mt-4 font-display text-4xl md:text-5xl">{look.title}</h2>
                <p className="mt-6 text-ink-700">
                  Captured in our Dubai atelier, each look celebrates the
                  silent dialogue between heritage embroidery and modern cut.
                  Hand-finished, never rushed, made to live in your wardrobe
                  for a lifetime.
                </p>
                <Link
                  to={`/shop?category=${encodeURIComponent(look.tag)}`}
                  className="btn-outline mt-8 inline-flex"
                >
                  Shop {look.tag}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink-900 py-20 text-center text-cream-50">
        <div className="section">
          <p className="kicker-light">Ready to wear</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            Step into the collection.
          </h2>
          <Link to="/shop" className="btn-gold mt-8 inline-flex">
            Shop the Lookbook
          </Link>
        </div>
      </section>
    </div>
  );
}
