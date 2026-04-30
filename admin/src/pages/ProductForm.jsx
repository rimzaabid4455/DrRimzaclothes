import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { assetUrl } from '../lib/api.js';

const CATEGORIES = ['Abayas', 'Kaftans', 'Dresses', 'Evening Wear', 'Accessories'];
const DEFAULT_SIZES = ['S', 'M', 'L', 'XL'];

const empty = {
  name: '',
  description: '',
  price: '',
  category: 'Abayas',
  sizes: 'S,M,L,XL',
  stock: 100,
  featured: false,
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        setForm({
          name: data.name || '',
          description: data.description || '',
          price: data.price ?? '',
          category: data.category || 'Abayas',
          sizes: (data.sizes || DEFAULT_SIZES).join(','),
          stock: data.stock ?? 100,
          featured: !!data.featured,
        });
        setCurrentImage(data.image || '');
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('category', form.category);
      fd.append('sizes', form.sizes);
      fd.append('stock', form.stock);
      fd.append('featured', form.featured ? 'true' : 'false');
      if (imageFile) fd.append('image', imageFile);

      if (isEdit) {
        await api.put(`/products/${id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-slate-500">Loading…</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

      <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card space-y-4 p-6">
          <div>
            <label className="label">Name</label>
            <input required name="name" value={form.name} onChange={change} className="input" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              className="input min-h-[120px]"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Price (AED)</label>
              <input
                required
                type="number"
                name="price"
                min="0"
                step="1"
                value={form.price}
                onChange={change}
                className="input"
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select name="category" value={form.category} onChange={change} className="input">
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Stock</label>
              <input
                type="number"
                name="stock"
                min="0"
                value={form.stock}
                onChange={change}
                className="input"
              />
            </div>
            <div>
              <label className="label">Sizes (comma separated)</label>
              <input name="sizes" value={form.sizes} onChange={change} className="input" />
            </div>
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" checked={form.featured} onChange={change} />
            Mark as Featured
          </label>
        </div>

        <div className="card space-y-4 p-6">
          <h2 className="font-semibold">Image</h2>
          {currentImage && !imageFile && (
            <img src={assetUrl(currentImage)} alt="Current" className="h-48 w-full rounded object-cover" />
          )}
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="h-48 w-full rounded object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="block w-full text-sm"
          />
          <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 5MB.</p>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn-outline w-full"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
