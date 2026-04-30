import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { assetUrl } from '../lib/api.js';
import { formatAED } from '../lib/format.js';

export default function Cart() {
  const { items, subtotal, updateQty, removeItem, itemKey } = useCart();

  if (items.length === 0) {
    return (
      <div className="section py-24 text-center">
        <h1 className="font-display text-5xl">Your cart is empty</h1>
        <p className="mt-3 text-ink-700">Begin curating your wardrobe.</p>
        <Link to="/shop" className="btn-primary mt-8 inline-flex">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="section py-12">
      <h1 className="font-display text-4xl md:text-5xl">Your Cart</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-ink-900/10">
          {items.map((item) => {
            const key = itemKey(item);
            const img = item.image ? assetUrl(item.image) : null;
            return (
              <li key={key} className="flex gap-4 py-6">
                <div className="h-32 w-24 flex-shrink-0 overflow-hidden bg-cream-100">
                  {img ? (
                    <img src={img} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-ink-900 text-gold-300">
                      <span className="font-display text-2xl">RAS</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl">{item.name}</h3>
                      {item.size && (
                        <p className="mt-1 text-xs uppercase tracking-widest text-ink-700">
                          Size: {item.size}
                        </p>
                      )}
                    </div>
                    <p className="text-sm">{formatAED(item.price * item.quantity)}</p>
                  </div>
                  <div className="mt-auto flex items-end justify-between">
                    <div className="inline-flex items-center border border-ink-900/30">
                      <button
                        onClick={() => updateQty(key, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-cream-100"
                      >
                        –
                      </button>
                      <span className="w-10 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(key, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-cream-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(key)}
                      className="text-xs uppercase tracking-widest text-ink-700 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="card h-fit p-6">
          <h2 className="font-display text-2xl">Order Summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatAED(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-ink-700">
              <dt>Shipping</dt>
              <dd>Calculated at checkout</dd>
            </div>
          </dl>
          <div className="mt-6 flex justify-between border-t border-ink-900/10 pt-4 font-display text-xl">
            <span>Total</span>
            <span>{formatAED(subtotal)}</span>
          </div>
          <Link to="/checkout" className="btn-primary mt-6 w-full">
            Proceed to Checkout
          </Link>
          <Link
            to="/shop"
            className="mt-3 block text-center text-xs uppercase tracking-widest text-ink-700 hover:text-gold-500"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
