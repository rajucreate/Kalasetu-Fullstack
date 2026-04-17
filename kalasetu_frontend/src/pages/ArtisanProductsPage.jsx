import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { artisanService } from '../services/artisanService';
import { normalizeApiError } from '../services/errorService';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorAlert } from '../components/ui/ErrorAlert';
import '../styles/artisan-profile.css';

export function ArtisanProductsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtisanProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await artisanService.getArtisan(id);
      setArtisan(data);
    } catch (err) {
      setError(normalizeApiError(err, 'Failed to load artisan products'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArtisanProducts();
  }, [fetchArtisanProducts]);

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
          <button onClick={() => navigate(`/artisan/${id}`)}>Back to Artisan Profile</button>
        </div>
      </div>
    );
  }

  return (
    <div className="artisan-profile-container">
      <button className="back-button" onClick={() => navigate(`/artisan/${id}`)}>
        ← Back to Artisan Profile
      </button>

      <section className="content-section">
        <h2>{artisan.first_name} {artisan.last_name} - Products</h2>
        <p className="section-description">
          All products produced by this artisan.
        </p>

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
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty-profile-products">This artisan has not published any products yet.</p>
        )}
      </section>
    </div>
  );
}
