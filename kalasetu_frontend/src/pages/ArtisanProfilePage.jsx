import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { artisanService } from '../services/artisanService';
import { normalizeApiError } from '../services/errorService';
import { Link } from 'react-router-dom';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorAlert } from '../components/ui/ErrorAlert';
import '../styles/artisan-profile.css';

export function ArtisanProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtisan = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await artisanService.getArtisan(id);
      setArtisan(data);
    } catch (err) {
      setError(normalizeApiError(err, 'Failed to load artisan profile'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArtisan();
  }, [fetchArtisan]);

  if (loading) {
    return (
      <div className="artisan-profile-container">
        <LoadingState />
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="artisan-profile-container">
        <div className="error-state">
          <ErrorAlert message={error || 'Artisan not found'} />
          <button onClick={() => navigate('/marketplace')}>Back to Marketplace</button>
        </div>
      </div>
    );
  }

  return (
    <div className="artisan-profile-container">
      <button className="back-button" onClick={() => navigate('/marketplace')}>
        ← Back to Marketplace
      </button>

      <section className="artisan-header">
        <div className="artisan-header-grid">
          <div className="artisan-avatar-large">
            {artisan.profile_image ? (
              <img src={artisan.profile_image} alt={artisan.first_name} />
            ) : (
              <div className="avatar-placeholder-large">
                {artisan.first_name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="artisan-header-info">
            <h1>{artisan.first_name} {artisan.last_name}</h1>
            <p className="artisan-title">Master Artisan</p>
            <div className="artisan-stats">
              <div className="stat">
                <span className="stat-value">{artisan.experience_years}</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat">
                <span className="stat-value">{artisan.region}</span>
                <span className="stat-label">Region</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="artisan-content">
        {artisan.bio && (
          <div className="content-section">
            <h2>About</h2>
            <p>{artisan.bio}</p>
          </div>
        )}

        <div className="content-section">
          <h2>Background</h2>
          <ul className="info-list">
            <li><strong>Location:</strong> {artisan.region}</li>
            <li><strong>Experience:</strong> {artisan.experience_years} years</li>
            <li><strong>Email:</strong> {artisan.email}</li>
            {artisan.phone_number && <li><strong>Phone:</strong> {artisan.phone_number}</li>}
          </ul>
        </div>

        <div className="content-section">
          <h2>Featured Works</h2>
          <p className="section-description">
            Explore the products created by this artisan
          </p>
          <Link
            to={`/artisan/${id}/products`}
            className="view-products-button"
          >
            View artisan products
          </Link>
          {Array.isArray(artisan.products) && artisan.products.length > 0 ? (
            <div className="artisan-product-grid">
              {artisan.products.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} className="artisan-product-card">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="artisan-product-image" />
                  ) : (
                    <div className="artisan-product-image placeholder">No Image</div>
                  )}
                  <div className="artisan-product-body">
                    <h3>{product.name}</h3>
                    <p className="artisan-product-price">₹{product.price}</p>
                    <p className="artisan-product-description">
                      {product.description?.substring(0, 120)}
                      {product.description?.length > 120 ? '...' : ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <>
              <p className="empty-profile-products">This artisan has not published any products yet.</p>
              <Link
                to="/marketplace"
                className="view-products-button"
              >
                Browse Marketplace
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
