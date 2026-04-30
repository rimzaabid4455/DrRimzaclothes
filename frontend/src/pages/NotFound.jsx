import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="section py-32 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-gold-500">404</p>
      <h1 className="mt-3 font-display text-6xl">Page not found</h1>
      <Link to="/" className="btn-primary mt-8 inline-flex">Return Home</Link>
    </div>
  );
}
