import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api.js';
import { formatAED, formatDate } from '../lib/format.js';

const StatCard = ({ label, value, accent }) => (
  <div className="card p-6">
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
    <p className={`mt-2 text-3xl font-semibold ${accent || ''}`}>{value}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/orders/stats'), api.get('/orders')])
      .then(([statsRes, ordersRes]) => {
        setStats(statsRes.data);
        setOrders(ordersRes.data.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link to="/products/new" className="btn-gold">+ Add Product</Link>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard label="Total Products" value={stats?.totalProducts ?? 0} />
          <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} />
          <StatCard
            label="Revenue"
            value={formatAED(stats?.revenue ?? 0)}
            accent="text-gold-500"
          />
        </div>
      )}

      {stats?.byStatus && Object.keys(stats.byStatus).length > 0 && (
        <div className="mt-6 card p-6">
          <h2 className="text-lg font-semibold">Orders by Status</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-5">
            {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
              <div key={s} className="rounded border border-slate-200 p-3 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-500">{s}</p>
                <p className="mt-1 text-xl font-semibold">{stats.byStatus[s] || 0}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link to="/orders" className="text-sm text-gold-500 hover:underline">View all →</Link>
        </div>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No orders yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-2">Date</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td className="py-3">{formatDate(o.createdAt)}</td>
                    <td>{o.customer?.name}</td>
                    <td>{formatAED(o.total)}</td>
                    <td>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
