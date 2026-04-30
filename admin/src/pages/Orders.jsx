import { Fragment, useEffect, useState } from 'react';
import api from '../lib/api.js';
import { formatAED, formatDate } from '../lib/format.js';

const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const statusColor = (s) =>
  ({
    Pending: 'bg-amber-100 text-amber-800',
    Confirmed: 'bg-blue-100 text-blue-800',
    Shipped: 'bg-indigo-100 text-indigo-800',
    Delivered: 'bg-emerald-100 text-emerald-800',
    Cancelled: 'bg-red-100 text-red-800',
  })[s] || 'bg-slate-100 text-slate-700';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = (status) => {
    setLoading(true);
    const params = status ? { status } : {};
    api
      .get('/orders', { params })
      .then(({ data }) => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(filter);
  }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/orders/${id}`, { status });
      setOrders((list) => list.map((o) => (o._id === id ? data : o)));
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input w-48">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 card overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center text-slate-500">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No orders found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th className="px-6 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <Fragment key={o._id}>
                  <tr
                    onClick={() => setExpanded((cur) => (cur === o._id ? null : o._id))}
                    className="cursor-pointer hover:bg-slate-50"
                  >
                    <td className="px-6 py-3">{formatDate(o.createdAt)}</td>
                    <td className="font-medium">{o.customer?.name}</td>
                    <td>{o.customer?.phone}</td>
                    <td>{o.items?.reduce((s, i) => s + i.quantity, 0)}</td>
                    <td>{formatAED(o.total)}</td>
                    <td>
                      <span className={`rounded px-2 py-0.5 text-xs ${statusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        className="input w-36"
                      >
                        {STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {expanded === o._id && (
                    <tr className="bg-slate-50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Items
                            </h3>
                            <ul className="mt-2 space-y-1">
                              {o.items?.map((i, idx) => (
                                <li key={idx} className="flex justify-between">
                                  <span>
                                    {i.name}
                                    {i.size ? ` · ${i.size}` : ''} × {i.quantity}
                                  </span>
                                  <span>{formatAED(i.price * i.quantity)}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-3 border-t border-slate-200 pt-3 text-sm">
                              <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{formatAED(o.subtotal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>{formatAED(o.shipping)}</span>
                              </div>
                              <div className="mt-1 flex justify-between font-semibold">
                                <span>Total</span>
                                <span>{formatAED(o.total)}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Delivery
                            </h3>
                            <p className="mt-2 text-sm">
                              {o.customer?.name}
                              <br />
                              {o.customer?.phone}
                              {o.customer?.email ? ` · ${o.customer.email}` : ''}
                              <br />
                              {o.address?.line1}
                              <br />
                              {o.address?.city}, {o.address?.emirate}, {o.address?.country}
                              {o.address?.notes && (
                                <>
                                  <br />
                                  <span className="text-slate-500">Notes: {o.address.notes}</span>
                                </>
                              )}
                            </p>
                            <p className="mt-3 text-xs text-slate-500">
                              Payment: {o.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
