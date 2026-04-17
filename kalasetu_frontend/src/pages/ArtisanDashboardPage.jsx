import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { productService } from '../services/productService';
import { normalizeApiError } from '../services/errorService';
import { ErrorAlert } from '../components/ui/ErrorAlert';
import { LoadingState } from '../components/ui/LoadingState';
import { Button } from '../components/ui/Button';
import '../styles/artisan-dashboard.css';

const initialFormState = {
  name: '',
  price: '',
  description: '',
  image: null,
};

export function ArtisanDashboardPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getMyProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(normalizeApiError(err, 'Failed to load your products.'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === 'image' ? files?.[0] ?? null : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.price || !formData.description || !formData.image) {
      setError('Please fill in name, price, description, and image.');
      return;
    }

    try {
      setSubmitting(true);
      await productService.createProduct({
        name: formData.name,
        price: formData.price,
        description: formData.description,
        image: formData.image,
      });
      setSuccess('Product added successfully.');
      setFormData(initialFormState);
      const data = await productService.getMyProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(normalizeApiError(err, 'Failed to add product.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="artisan-dashboard">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Artisan Dashboard</p>
          <h1>Welcome{user?.first_name ? `, ${user.first_name}` : ''}</h1>
          <p className="hero-copy">Add new products, track your submissions, and manage your catalog.</p>
        </div>
        <div className="dashboard-stats">
          <div className="stat-card">
            <span>Total Products</span>
            <strong>{products.length}</strong>
          </div>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="panel add-product-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Add Product</p>
              <h2>Publish a new craft</h2>
            </div>
          </div>

          <ErrorAlert message={error} />
          {success ? <div className="success-banner">{success}</div> : null}

          <form className="product-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <label>
              Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Product name"
                disabled={submitting}
              />
            </label>

            <label>
              Price
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                disabled={submitting}
              />
            </label>

            <label className="full-width">
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Describe the craft, materials, and cultural significance"
                disabled={submitting}
              />
            </label>

            <label className="full-width">
              Image
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </label>

            <div className="form-actions full-width">
              <Button type="submit" disabled={submitting} className="submit-button">
                {submitting ? 'Adding Product...' : 'Add Product'}
              </Button>
            </div>
          </form>
        </section>

      </div>

      <section className="panel view-products-panel">
        <div className="panel-header">
          <div>
            <p className="panel-kicker">View Your Products</p>
            <h2>All products produced by you</h2>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : products.length > 0 ? (
          <div className="product-list">
            {products.map((product) => (
              <article key={product.id} className="product-row">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="product-thumb" />
                ) : (
                  <div className="product-thumb placeholder" />
                )}
                <div className="product-meta">
                  <h3>{product.name}</h3>
                  <p>₹{product.price}</p>
                  <span
                    className={`status ${
                      product.verification_status === 'REJECTED'
                        ? 'rejected'
                        : product.is_approved
                          ? 'approved'
                          : 'pending'
                    }`}
                  >
                    {product.verification_status === 'REJECTED'
                      ? 'Rejected'
                      : product.is_approved
                        ? 'Approved'
                        : 'Pending'}
                  </span>
                  {product.verification_status === 'REJECTED' ? (
                    <p className="rejection-reason">
                      Rejection reason: {product.verification_note || 'No reason provided yet.'}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">You have not added any products yet.</div>
        )}
      </section>
    </div>
  );
}
