import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink-900 text-cream-50">
      <div className="section grid gap-10 py-16 md:grid-cols-4">
        <div>
          <div className="font-display text-3xl tracking-[0.3em] text-gold-300">RAS</div>
          <p className="mt-4 max-w-xs text-sm text-cream-50/70">
            Crafted in Dubai. Designed for women who carry quiet confidence.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-gold-300">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream-50/80">
            <li><Link to="/shop?category=Abayas" className="hover:text-gold-300">Abayas</Link></li>
            <li><Link to="/shop?category=Kaftans" className="hover:text-gold-300">Kaftans</Link></li>
            <li><Link to="/shop?category=Dresses" className="hover:text-gold-300">Dresses</Link></li>
            <li><Link to="/shop?category=Evening Wear" className="hover:text-gold-300">Evening Wear</Link></li>
            <li><Link to="/shop?category=Accessories" className="hover:text-gold-300">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-gold-300">Atelier</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream-50/80">
            <li>Dubai, UAE</li>
            <li>+971 50 000 0000</li>
            <li>hello@rasdubai.com</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-gold-300">Newsletter</h4>
          <p className="mt-4 text-sm text-cream-50/70">
            Receive new collections and private invitations.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-4 flex border border-cream-50/20"
          >
            <input
              type="email"
              required
              placeholder="Your email"
              className="flex-1 bg-transparent px-3 py-2 text-sm text-cream-50 placeholder:text-cream-50/40 focus:outline-none"
            />
            <button className="bg-gold-400 px-4 text-xs uppercase tracking-widest text-ink-900 hover:bg-gold-500">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-cream-50/10 py-6 text-center text-xs uppercase tracking-widest text-cream-50/50">
        © {new Date().getFullYear()} RAS Dubai · All rights reserved
      </div>
    </footer>
  );
}
