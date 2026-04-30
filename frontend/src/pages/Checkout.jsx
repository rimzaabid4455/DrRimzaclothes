import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import { useCart } from '../context/CartContext.jsx';
import { formatAED } from '../lib/format.js';

const SHIPPING_FEE = 25;

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    line1: '',
    city: 'Dubai',
    emirate: 'Dubai',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="section py-24 text-center">
        <h1 className="font-display text-4xl">Your cart is empty</h1>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const total = subtotal + SHIPPING_FEE;

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        customer: { name: form.name, email: form.email, phone: form.phone },
        address: {
          line1: form.line1,
          city: form.city,
          emirate: form.emirate,
          country: 'UAE',
          notes: form.notes,
        },
        items: items.map((i) => ({
          product: i.product,
          quantity: i.quantity,
          size: i.size,
          name: i.name,
          price: i.price,
          image: i.image,
        })),
        shipping: SHIPPING_FEE,
        paymentMethod: 'COD',
      };
      const { data } = await api.post('/orders', payload);
      clear();
      navigate(`/order/${data._id}`, { state: { order: data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section py-12">
      <h1 className="font-display text-4xl md:text-5xl">Checkout</h1>

      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-2xl">Contact</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Full name</label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={change}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  required
                  name="phone"
                  value={form.phone}
                  onChange={change}
                  placeholder="+971 50 000 0000"
                  className="input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Email (optional)</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={change}
                  className="input"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl">Delivery Address</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="label">Address</label>
                <input
                  required
                  name="line1"
                  value={form.line1}
                  onChange={change}
                  placeholder="Building, street, area"
                  className="input"
                />
              </div>
              <div>
                <label className="label">City</label>
                <input
                  required
                  name="city"
                  value={form.city}
                  onChange={change}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Emirate</label>
                <select
                  name="emirate"
                  value={form.emirate}
                  onChange={change}
                  className="input"
                >
                  {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'].map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">Notes (optional)</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={change}
                  className="input min-h-[80px]"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl">Payment</h2>
            <div className="mt-4 border border-gold-400 bg-cream-100 p-4">
              <p className="text-sm font-medium">Cash on Delivery</p>
              <p className="mt-1 text-xs text-ink-700">
                Pay in cash when your order is delivered to your address.
              </p>
            </div>
          </section>

          {error && <p className="text-sm text-red-700">{error}</p>}
        </div>

        <aside className="card h-fit p-6">
          <h2 className="font-display text-2xl">Your Order</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <li key={`${i.product}__${i.size || ''}`} className="flex justify-between">
                <span className="pr-2">
                  {i.name}
                  {i.size ? ` · ${i.size}` : ''} × {i.quantity}
                </span>
                <span>{formatAED(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-3 border-t border-ink-900/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatAED(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{formatAED(SHIPPING_FEE)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-ink-900/10 pt-4 font-display text-xl">
            <span>Total</span>
            <span>{formatAED(total)}</span>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full disabled:opacity-60">
            {submitting ? 'Placing order…' : 'Place Order (COD)'}
          </button>
        </aside>
      </form>
    </div>
  );
}
