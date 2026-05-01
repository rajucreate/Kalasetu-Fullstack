import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { artisanService } from '../services/artisanService';
import { normalizeApiError } from '../services/errorService';
import { useAuth } from '../hooks/useAuth';
import { cartService } from '../services/cartService';
import { emitToast } from '../services/toastService';
import { ErrorAlert } from '../components/ui/ErrorAlert';
import { LoadingState } from '../components/ui/LoadingState';
import '../styles/marketplace.css';

export function MarketplacePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'products') {
        const data = await productService.getProducts(page);
        setProducts(data.results || data);
      } else {
        const data = await artisanService.getArtisans(page);
        setArtisans(data.results || data);
      }
    } catch (err) {
      setError(normalizeApiError(err, 'Failed to fetch data'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddToCart = (event, product) => {
    event.preventDefault();
    event.stopPropagation();
    cartService.addToCart(user?.id, product);
    emitToast('Item added to cart');
  };

  return (
    <div className="marketplace-container">
      <section className="marketplace-hero">
        <div className="hero-content">
          <h1>Discover Authentic Crafts</h1>
          <p>Support artisans and explore culturally significant handmade products</p>
        </div>
      </section>

      <section className="marketplace-tabs">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('products');
              setPage(1);
            }}
          >
            Products
          </button>
          <button
            className={`tab-button ${activeTab === 'artisans' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('artisans');
              setPage(1);
            }}
          >
            Artisans
          </button>
        </div>

        <ErrorAlert message={error} />

        {loading ? (
          <LoadingState />
        ) : activeTab === 'products' ? (
          <div className="grid-container">
            {products && products.length > 0 ? (
              products.map((product) => (
                <article key={product.id} className="product-card">
                  <Link to={`/products/${product.id}`} className="product-card-link">
                    <div className="card-image">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300';
                          }}
                        />
                      ) : (
                        <div className="placeholder-image">No Image</div>
                      )}
                    </div>
                    <div className="card-content">
                      <h3>{product.name}</h3>
                      <p className="product-region">{product.region}</p>
                      {product.artisan && (
                        <p className="product-artisan">by {product.artisan.first_name}</p>
                      )}
                      <div className="product-footer">
                        <span className="price">₹{product.price}</span>
                        {product.verification_status === 'VERIFIED' && (
                          <span className="badge verified">Verified</span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="card-actions">
                    <button className="add-cart-button" onClick={(event) => handleAddToCart(event, product)}>
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="empty-state">No products available</p>
            )}
          </div>
        ) : (
          <div className="grid-container">
            {artisans && artisans.length > 0 ? (
              artisans.map((artisan) => (
                <Link
                  key={artisan.id}
                  to={`/artisan/${artisan.id}`}
                  className="artisan-card"
                >
                  <div className="artisan-avatar">
                    {artisan.profile_image ? (
                      <img src={artisan.profile_image} alt={artisan.first_name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {artisan.first_name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="artisan-info">
                    <h3>{artisan.first_name} {artisan.last_name}</h3>
                    <p className="artisan-region">{artisan.region}</p>
                    <p className="artisan-experience">
                      {artisan.experience_years} years experience
                    </p>
                    {artisan.bio && (
                      <p className="artisan-bio">{artisan.bio.substring(0, 100)}...</p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <p className="empty-state">No artisans found</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
