import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import AnnouncementBar from './AnnouncementBar.jsx';

const linkClass = ({ isActive }) =>
  `text-xs uppercase tracking-widest transition-colors hover:text-gold-300 ${
    isActive ? 'text-gold-300' : 'text-cream-50'
  }`;

export default function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <AnnouncementBar />
      <div className="bg-ink-900 text-cream-50">
        <div className="section flex items-center justify-between py-5">
          <button
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className="block h-px w-6 bg-cream-50" />
            <span className="mt-1.5 block h-px w-6 bg-cream-50" />
            <span className="mt-1.5 block h-px w-6 bg-cream-50" />
          </button>

          <Link
            to="/"
            className="font-display text-3xl font-semibold tracking-[0.4em] text-gold-300 md:text-4xl"
          >
            RAS
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/shop" className={linkClass}>
              Shop
            </NavLink>
            <NavLink to="/shop?category=Abayas" className={linkClass}>
              Abayas
            </NavLink>
            <NavLink to="/shop?category=Kaftans" className={linkClass}>
              Kaftans
            </NavLink>
            <NavLink to="/shop?category=Evening Wear" className={linkClass}>
              Evening
            </NavLink>
            <NavLink to="/lookbook" className={linkClass}>
              Lookbook
            </NavLink>
          </nav>

          <div className="flex items-center gap-5">
            <button
              className="hidden text-cream-50 transition-colors hover:text-gold-300 md:inline"
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
            <Link
              to="/cart"
              className="relative text-cream-50 transition-colors hover:text-gold-300"
              aria-label="Cart"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 7h12l-1.5 11a2 2 0 0 1-2 1.8H9.5a2 2 0 0 1-2-1.8L6 7Z" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-semibold text-ink-900">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {open && (
          <div className="border-t border-cream-50/10 md:hidden">
            <nav className="section flex flex-col gap-4 py-4">
              <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/shop" className={linkClass} onClick={() => setOpen(false)}>
                Shop
              </NavLink>
              <NavLink
                to="/shop?category=Abayas"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Abayas
              </NavLink>
              <NavLink
                to="/shop?category=Kaftans"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Kaftans
              </NavLink>
              <NavLink
                to="/shop?category=Dresses"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Dresses
              </NavLink>
              <NavLink
                to="/shop?category=Evening Wear"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Evening Wear
              </NavLink>
              <NavLink
                to="/shop?category=Accessories"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Accessories
              </NavLink>
              <NavLink to="/lookbook" className={linkClass} onClick={() => setOpen(false)}>
                Lookbook
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
