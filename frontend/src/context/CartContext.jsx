import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const STORAGE_KEY = 'ras_cart_v1';

const CartContext = createContext(null);

const initialState = { items: [] };

const itemKey = (item) => `${item.product}__${item.size || ''}`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return action.payload || initialState;
    case 'ADD': {
      const next = action.payload;
      const key = itemKey(next);
      const existing = state.items.find((i) => itemKey(i) === key);
      if (existing) {
        return {
          items: state.items.map((i) =>
            itemKey(i) === key ? { ...i, quantity: i.quantity + next.quantity } : i
          ),
        };
      }
      return { items: [...state.items, next] };
    }
    case 'UPDATE_QTY': {
      const { key, quantity } = action.payload;
      if (quantity <= 0) {
        return { items: state.items.filter((i) => itemKey(i) !== key) };
      }
      return {
        items: state.items.map((i) => (itemKey(i) === key ? { ...i, quantity } : i)),
      };
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => itemKey(i) !== action.payload) };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'INIT', payload: JSON.parse(raw) });
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }, [state]);

  const value = useMemo(() => {
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = state.items.reduce((sum, i) => sum + i.quantity, 0);
    return {
      items: state.items,
      subtotal,
      count,
      addItem: (item) => dispatch({ type: 'ADD', payload: item }),
      updateQty: (key, quantity) =>
        dispatch({ type: 'UPDATE_QTY', payload: { key, quantity } }),
      removeItem: (key) => dispatch({ type: 'REMOVE', payload: key }),
      clear: () => dispatch({ type: 'CLEAR' }),
      itemKey,
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
