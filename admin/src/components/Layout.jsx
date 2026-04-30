import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const link = ({ isActive }) =>
  `block rounded px-3 py-2 text-sm transition-colors ${
    isActive ? 'bg-gold-400 text-ink-900' : 'text-slate-300 hover:bg-ink-800 hover:text-white'
  }`;

export default function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="grid min-h-full grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="bg-ink-900 p-6 text-white">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-300">RAS</p>
          <h1 className="mt-1 text-lg font-semibold">Admin Panel</h1>
        </div>
        <nav className="space-y-1">
          <NavLink to="/" end className={link}>Dashboard</NavLink>
          <NavLink to="/products" className={link}>Products</NavLink>
          <NavLink to="/products/new" className={link}>Add Product</NavLink>
          <NavLink to="/orders" className={link}>Orders</NavLink>
        </nav>
        <div className="mt-10 border-t border-white/10 pt-4 text-xs text-slate-400">
          {admin?.email && <p className="mb-3 truncate">{admin.email}</p>}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-gold-300 hover:text-gold-400"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
