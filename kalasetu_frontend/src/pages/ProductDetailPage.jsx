import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { normalizeApiError } from '../services/errorService';
import { useAuth } from '../hooks/useAuth';
import { cartService } from '../services/cartService';
import { emitToast } from '../services/toastService';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorAlert } from '../components/ui/ErrorAlert';
import '../styles/product-detail.css';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProduct(id);
      setProduct(data);
    } catch (err) {
      setError(normalizeApiError(err, 'Failed to load product'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    if (!product) return;
    cartService.addToCart(user?.id, product);
    emitToast('Item added to cart');
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <LoadingState />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="error-state">
          <ErrorAlert message={error || 'Product not found'} />
          <button onClick={() => navigate('/marketplace')}>Back to Marketplace</button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <button className="back-button" onClick={() => navigate('/marketplace')}>
        ← Back to Marketplace
      </button>

      <div className="product-detail-grid">
        <div className="product-image-section">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500';
              }}
            />
          ) : (
            <div className="placeholder-image-large">No Image Available</div>
          )}
        </div>

        <div className="product-info-section">
          <div className="product-header">
            <h1>{product.name}</h1>
            <div className="product-meta">
              <span className="price-large">₹{product.price}</span>
              {product.is_approved && product.verification_status === 'VERIFIED' && (
                <span className="badge verified">Verified</span>
              )}
            </div>
          </div>

          <div className="product-basic-info">
            <p><strong>Region:</strong> {product.region}</p>
            {product.impact_score > 0 && (
              <p><strong>Impact Score:</strong> {product.impact_score}%</p>
            )}
          </div>

          {product.description && (
            <div className="product-section">
              <h2>Description</h2>
              <p>{product.description}</p>
            </div>
          )}

          {product.cultural_story && (
            <div className="product-section">
              <h2>Cultural Story</h2>
              <p>{product.cultural_story}</p>
            </div>
          )}

          {product.craft_process && (
            <div className="product-section">
              <h2>Craft Process</h2>
              <p>{product.craft_process}</p>
            </div>
          )}

          {product.artisan && (
            <div className="product-section artisan-section">
              <h2>Meet the Artisan</h2>
              <div className="artisan-card-simple">
                <div className="artisan-avatar-small">
                  {product.artisan.profile_image ? (
                    <img src={product.artisan.profile_image} alt={product.artisan.first_name} />
                  ) : (
                    <div className="avatar-placeholder-small">
                      {product.artisan.first_name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="artisan-details">
                  <h3>{product.artisan.first_name} {product.artisan.last_name}</h3>
                  <p>{product.artisan.region}</p>
                  <p className="experience">{product.artisan.experience_years} years experience</p>
                  <button
                    className="view-artisan-button"
                    onClick={() => navigate(`/artisan/${product.artisan.id}`)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {product.verified_by && (
            <div className="product-section verification-section">
              <h2>Verification</h2>
              <p><strong>Status:</strong> {product.verification_status}</p>
              {product.verification_note && (
                <p><strong>Note:</strong> {product.verification_note}</p>
              )}
            </div>
          )}

          <div className="product-actions">
            <button className="action-button primary" onClick={handleAddToCart}>Add to Cart</button>
            <button className="action-button secondary">Share</button>
          </div>
        </div>
      </div>
    </div>
  );
}
