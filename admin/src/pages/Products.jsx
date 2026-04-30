import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { assetUrl } from '../lib/api.js';
import { formatAED } from '../lib/format.js';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/products')
      .then(({ data }) => setProducts(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link to="/products/new" className="btn-gold">+ Add Product</Link>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 card overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center text-slate-500">Loading…</div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No products yet.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3">Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th className="px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="px-6 py-3">
                    {p.image ? (
                      <img src={assetUrl(p.image)} alt={p.name} className="h-12 w-12 rounded object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">N/A</div>
                    )}
                  </td>
                  <td className="font-medium">{p.name}</td>
                  <td>{p.category}</td>
                  <td>{formatAED(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>{p.featured ? 'Yes' : 'No'}</td>
                  <td className="px-6 text-right">
                    <Link to={`/products/${p._id}/edit`} className="btn-ghost mr-2">Edit</Link>
                    <button onClick={() => remove(p._id)} className="btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
