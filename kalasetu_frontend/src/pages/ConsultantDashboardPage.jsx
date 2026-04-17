import { useState, useEffect } from 'react';
import { consultantService } from '../services/consultantService';
import { normalizeApiError } from '../services/errorService';
import { ErrorAlert } from '../components/ui/ErrorAlert';
import { LoadingState } from '../components/ui/LoadingState';
import '../styles/consultant-dashboard.css';

export function ConsultantDashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);
  const [verifyData, setVerifyData] = useState({});

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await consultantService.getPendingProducts();
      setProducts(data);
    } catch (err) {
      setError(normalizeApiError(err, 'Failed to load pending products'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (productId, status) => {
    try {
      setVerifyingId(productId);
      const data = {
        verification_status: status,
        verification_note: verifyData[productId]?.note || '',
        impact_score: verifyData[productId]?.score || 50,
      };

      await consultantService.verifyProduct(productId, data);
      
      // Remove from list
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setVerifyData((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    } catch (err) {
      setError(normalizeApiError(err, 'Failed to verify product'));
      console.error(err);
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="consultant-dashboard-container">
      <section className="dashboard-header">
        <h1>Verification Dashboard</h1>
        <p className="header-subtitle">
          Review and verify upcoming artisan products
        </p>
      </section>

      <ErrorAlert message={error} />

      {loading ? (
        <LoadingState message="Loading pending products..." />
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>No pending products for verification</p>
        </div>
      ) : (
        <div className="products-list">
          {products.map((product) => (
            <div key={product.id} className="verification-card">
              <div className="card-grid">
                <div className="product-image-small">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  ) : (
                    <div className="placeholder-small">No Image</div>
                  )}
                </div>

                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="product-price">₹{product.price}</p>
                  <p className="product-region">{product.region}</p>
                  {product.artisan && (
                    <p className="product-artisan">
                      by {product.artisan.first_name} {product.artisan.last_name}
                    </p>
                  )}
                </div>

                <div className="verification-form">
                  <div className="form-group">
                    <label htmlFor={`score-${product.id}`}>Impact Score (0-100)</label>
                    <input
                      id={`score-${product.id}`}
                      type="number"
                      min="0"
                      max="100"
                      value={verifyData[product.id]?.score || 50}
                      onChange={(e) => {
                        setVerifyData((prev) => ({
                          ...prev,
                          [product.id]: {
                            ...prev[product.id],
                            score: parseInt(e.target.value),
                          },
                        }));
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`note-${product.id}`}>Verification Note</label>
                    <textarea
                      id={`note-${product.id}`}
                      value={verifyData[product.id]?.note || ''}
                      onChange={(e) => {
                        setVerifyData((prev) => ({
                          ...prev,
                          [product.id]: {
                            ...prev[product.id],
                            note: e.target.value,
                          },
                        }));
                      }}
                      placeholder="Add your verification note..."
                      rows="3"
                    />
                  </div>

                  <div className="verification-actions">
                    <button
                      className="button verify"
                      onClick={() => handleVerify(product.id, 'VERIFIED')}
                      disabled={verifyingId === product.id}
                    >
                      {verifyingId === product.id ? 'Processing...' : 'Verify'}
                    </button>
                    <button
                      className="button reject"
                      onClick={() => handleVerify(product.id, 'REJECTED')}
                      disabled={verifyingId === product.id}
                    >
                      {verifyingId === product.id ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
