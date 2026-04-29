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

const TABS = [
  { id: 'add',     icon: '＋', label: 'Add Product'   },
  { id: 'catalog', icon: '🗂', label: 'My Catalog'    },
  { id: 'status',  icon: '📋', label: 'Approval Status' },
  { id: 'reviews', icon: '⭐', label: 'Reviews'       },
];

function StatusBadge({ product }) {
  if (product.verification_status === 'REJECTED') {
    return <span className="ad-badge ad-badge--rejected">Rejected</span>;
  }
  if (product.is_approved) {
    return <span className="ad-badge ad-badge--approved">Approved</span>;
  }
  return <span className="ad-badge ad-badge--pending">Pending</span>;
}

export function ArtisanDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('add');
  const [products, setProducts]   = useState([]);
  const [formData, setFormData]   = useState(initialFormState);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  /* ─ Derived counts ─ */
  const approvedCount = products.filter((p) => p.is_approved).length;
  const pendingCount  = products.filter(
    (p) => !p.is_approved && p.verification_status !== 'REJECTED'
  ).length;
  const rejectedCount = products.filter(
    (p) => p.verification_status === 'REJECTED'
  ).length;

  /* ─ Fetch ─ */
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

  useEffect(() => { fetchProducts(); }, []);

  /* ─ Form handlers ─ */
  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((cur) => ({
      ...cur,
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
      setSuccess('Product added successfully! It will appear in your catalog after review.');
      setFormData(initialFormState);
      await fetchProducts();
    } catch (err) {
      setError(normalizeApiError(err, 'Failed to add product.'));
    } finally {
      setSubmitting(false);
    }
  };

  /* ─ Render helpers ─ */
  const renderAddProduct = () => (
    <section className="ad-panel" key="add">
      <div className="ad-panel-head">
        <div>
          <p className="ad-panel-kicker">Add Product</p>
          <h2>Publish a new craft</h2>
        </div>
      </div>

      <ErrorAlert message={error} />

      {success && (
        <div className="ad-success-banner">
          <span className="ad-success-icon">✓</span>
          {success}
        </div>
      )}

      <form className="ad-product-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="ad-field">
          <span>Product Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Handwoven Banarasi Silk Dupatta"
            disabled={submitting}
          />
        </label>

        <label className="ad-field">
          <span>Price (₹)</span>
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

        <label className="ad-field ad-field--full">
          <span>Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Describe the craft, materials, and cultural significance…"
            disabled={submitting}
          />
        </label>

        <label className="ad-field ad-field--full ad-field--file">
          <span>Product Image</span>
          <div className="ad-file-wrap">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
              disabled={submitting}
            />
            <div className="ad-file-hint">
              {formData.image ? (
                <span className="ad-file-name">📎 {formData.image.name}</span>
              ) : (
                <span>Click to upload or drag & drop — JPG, PNG, WebP</span>
              )}
            </div>
          </div>
        </label>

        <div className="ad-form-actions ad-field--full">
          <Button type="submit" disabled={submitting} className="ad-submit">
            {submitting ? (
              <><span className="ad-spinner" /> Adding…</>
            ) : (
              '+ Add Product'
            )}
          </Button>
        </div>
      </form>
    </section>
  );

  const renderCatalog = () => (
    <section className="ad-panel" key="catalog">
      <div className="ad-panel-head">
        <div>
          <p className="ad-panel-kicker">My Catalog</p>
          <h2>All your crafted products</h2>
        </div>
        <span className="ad-count-badge">{products.length} products</span>
      </div>

      {loading ? (
        <LoadingState />
      ) : products.length > 0 ? (
        <div className="ad-product-list">
          {products.map((product, i) => (
            <article
              key={product.id}
              className="ad-product-row"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              {product.image ? (
                <img src={product.image} alt={product.name} className="ad-thumb" />
              ) : (
                <div className="ad-thumb ad-thumb--placeholder">
                  <span>🖼</span>
                </div>
              )}
              <div className="ad-product-meta">
                <h3>{product.name}</h3>
                <p className="ad-product-price">₹{product.price}</p>
                {product.description && (
                  <p className="ad-product-desc">{product.description}</p>
                )}
              </div>
              <StatusBadge product={product} />
            </article>
          ))}
        </div>
      ) : (
        <div className="ad-empty">
          <span className="ad-empty-icon">🧶</span>
          <p>You haven't added any products yet.</p>
          <button className="ad-empty-cta" onClick={() => setActiveTab('add')}>
            Add your first product →
          </button>
        </div>
      )}
    </section>
  );

  const renderStatus = () => {
    const rejected = products.filter((p) => p.verification_status === 'REJECTED');
    const approved = products.filter((p) => p.is_approved);
    const pending  = products.filter((p) => !p.is_approved && p.verification_status !== 'REJECTED');

    return (
      <section className="ad-panel" key="status">
        <div className="ad-panel-head">
          <div>
            <p className="ad-panel-kicker">Approval Status</p>
            <h2>Track your product reviews</h2>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : (
          <>
            {/* Summary pills */}
            <div className="ad-status-summary">
              <div className="ad-summary-pill ad-summary-pill--approved">
                <strong>{approvedCount}</strong>
                <span>Approved</span>
              </div>
              <div className="ad-summary-pill ad-summary-pill--pending">
                <strong>{pendingCount}</strong>
                <span>Pending</span>
              </div>
              <div className="ad-summary-pill ad-summary-pill--rejected">
                <strong>{rejectedCount}</strong>
                <span>Rejected</span>
              </div>
            </div>

            {/* Rejected products with reasons */}
            {rejected.length > 0 && (
              <div className="ad-status-group">
                <h3 className="ad-group-label ad-group-label--rejected">❌ Rejected</h3>
                <div className="ad-product-list">
                  {rejected.map((product, i) => (
                    <article
                      key={product.id}
                      className="ad-product-row ad-product-row--rejected"
                      style={{ animationDelay: `${0.05 * i}s` }}
                    >
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="ad-thumb" />
                      ) : (
                        <div className="ad-thumb ad-thumb--placeholder"><span>🖼</span></div>
                      )}
                      <div className="ad-product-meta">
                        <h3>{product.name}</h3>
                        <p className="ad-product-price">₹{product.price}</p>
                        <p className="ad-rejection-reason">
                          <strong>Reason:</strong>{' '}
                          {product.verification_note || 'No reason provided yet.'}
                        </p>
                      </div>
                      <span className="ad-badge ad-badge--rejected">Rejected</span>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Pending products */}
            {pending.length > 0 && (
              <div className="ad-status-group">
                <h3 className="ad-group-label ad-group-label--pending">⏳ Awaiting Review</h3>
                <div className="ad-product-list">
                  {pending.map((product, i) => (
                    <article
                      key={product.id}
                      className="ad-product-row"
                      style={{ animationDelay: `${0.05 * i}s` }}
                    >
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="ad-thumb" />
                      ) : (
                        <div className="ad-thumb ad-thumb--placeholder"><span>🖼</span></div>
                      )}
                      <div className="ad-product-meta">
                        <h3>{product.name}</h3>
                        <p className="ad-product-price">₹{product.price}</p>
                      </div>
                      <span className="ad-badge ad-badge--pending">Pending</span>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Approved products */}
            {approved.length > 0 && (
              <div className="ad-status-group">
                <h3 className="ad-group-label ad-group-label--approved">✅ Approved & Live</h3>
                <div className="ad-product-list">
                  {approved.map((product, i) => (
                    <article
                      key={product.id}
                      className="ad-product-row ad-product-row--approved"
                      style={{ animationDelay: `${0.05 * i}s` }}
                    >
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="ad-thumb" />
                      ) : (
                        <div className="ad-thumb ad-thumb--placeholder"><span>🖼</span></div>
                      )}
                      <div className="ad-product-meta">
                        <h3>{product.name}</h3>
                        <p className="ad-product-price">₹{product.price}</p>
                      </div>
                      <span className="ad-badge ad-badge--approved">Approved</span>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {products.length === 0 && (
              <div className="ad-empty">
                <span className="ad-empty-icon">📋</span>
                <p>No products to review yet.</p>
                <button className="ad-empty-cta" onClick={() => setActiveTab('add')}>
                  Add your first product →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    );
  };

  const renderReviews = () => (
    <section className="ad-panel" key="reviews">
      <div className="ad-panel-head">
        <div>
          <p className="ad-panel-kicker">Customer Reviews</p>
          <h2>What buyers are saying</h2>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="ad-empty">
          <span className="ad-empty-icon">⭐</span>
          <p>Add products first to start receiving reviews.</p>
          <button className="ad-empty-cta" onClick={() => setActiveTab('add')}>
            Add a product →
          </button>
        </div>
      ) : (
        <div className="ad-reviews-list">
          {products.map((product) => (
            <div key={product.id} className="ad-review-card">
              <div className="ad-review-product-info">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="ad-review-thumb" />
                ) : (
                  <div className="ad-review-thumb ad-thumb--placeholder"><span>🖼</span></div>
                )}
                <div>
                  <h3>{product.name}</h3>
                  <p className="ad-product-price">₹{product.price}</p>
                </div>
              </div>

              {/* Reviews placeholder — wire to real API when available */}
              {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
                <div className="ad-review-items">
                  {product.reviews.map((review, idx) => (
                    <div key={idx} className="ad-review-item">
                      <div className="ad-review-stars">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                      <p className="ad-review-text">{review.comment}</p>
                      <span className="ad-review-author">— {review.buyer_name || 'Anonymous'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ad-review-empty">
                  <span>💬</span>
                  <p>No reviews yet for this product</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );

  const tabContent = {
    add:     renderAddProduct,
    catalog: renderCatalog,
    status:  renderStatus,
    reviews: renderReviews,
  };
  const safeActiveTab = tabContent[activeTab] ? activeTab : 'add';
  const activeTabRenderer = tabContent[safeActiveTab] || renderAddProduct;
  const activeTabPanel = activeTabRenderer() || renderAddProduct();

  return (
    <div className="artisan-dashboard">

      {/* ── Hero banner ── */}
      <section className="ad-hero">
        <div className="ad-hero-left">
          <p className="ad-eyebrow">Artisan Dashboard</p>
          <h1>Welcome{user?.first_name ? `, ${user.first_name}` : ''} 🎨</h1>
          <p className="ad-hero-copy">
            Add new crafts, track approvals, and connect with your buyers — all in one place.
          </p>
        </div>

        <div className="ad-stats-row">
          <div className="ad-stat">
            <strong>{products.length}</strong>
            <span>Total Products</span>
          </div>
          <div className="ad-stat">
            <strong>{approvedCount}</strong>
            <span>Live</span>
          </div>
          <div className="ad-stat">
            <strong>{pendingCount}</strong>
            <span>Pending</span>
          </div>
          <div className="ad-stat ad-stat--danger">
            <strong>{rejectedCount}</strong>
            <span>Rejected</span>
          </div>
        </div>
      </section>

      {/* ── Tab Navigation ── */}
      <nav className="ad-tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`ad-tab${activeTab === tab.id ? ' ad-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="ad-tab-icon">{tab.icon}</span>
            <span className="ad-tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Panel ── */}
      <div className="ad-content">
        {activeTabPanel}
      </div>
    </div>
  );
}
