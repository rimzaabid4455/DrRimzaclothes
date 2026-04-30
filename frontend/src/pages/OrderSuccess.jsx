import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import api from '../lib/api.js';
import { formatAED } from '../lib/format.js';

export default function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const initial = location.state?.order || null;
  const [order, setOrder] = useState(initial);
  const [loading, setLoading] = useState(!initial);

  useEffect(() => {
    if (initial) return;
    let cancelled = false;
    api
      .get(`/orders/${id}`)
      .then(({ data }) => !cancelled && setOrder(data))
      .catch(() => !cancelled && setOrder(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, initial]);

  return (
    <div className="section py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold-400 text-gold-500">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.4em] text-gold-500">Thank you</p>
        <h1 className="mt-3 font-display text-5xl">Your order has been placed</h1>
        <p className="mt-4 text-ink-700">
          We've received your order and will reach out shortly to confirm delivery.
        </p>

        {loading ? (
          <div className="mt-10 h-32 animate-pulse bg-cream-100" />
        ) : order ? (
          <div className="mt-10 border border-ink-900/10 bg-white p-6 text-left">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-ink-700">Order ID</p>
                <p className="font-mono text-sm">{order._id}</p>
              </div>
              <span className="bg-gold-100 px-3 py-1 text-xs uppercase tracking-widest text-gold-700">
                {order.status}
              </span>
            </div>
            <ul className="mt-6 space-y-2 text-sm">
              {order.items?.map((i, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>
                    {i.name}
                    {i.size ? ` · ${i.size}` : ''} × {i.quantity}
                  </span>
                  <span>{formatAED(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-ink-900/10 pt-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatAED(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatAED(order.shipping)}</span>
              </div>
              <div className="mt-2 flex justify-between font-display text-xl">
                <span>Total</span>
                <span>{formatAED(order.total)}</span>
              </div>
            </div>
            <div className="mt-6 text-sm text-ink-700">
              <p className="font-medium text-ink-900">Delivering to</p>
              <p>{order.customer?.name} · {order.customer?.phone}</p>
              <p>{order.address?.line1}, {order.address?.city}, {order.address?.emirate}</p>
            </div>
          </div>
        ) : (
          <p className="mt-10 text-ink-700">We couldn't load your order details.</p>
        )}

        <div className="mt-10">
          <Link to="/shop" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
