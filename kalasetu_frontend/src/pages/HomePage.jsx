import { Link } from 'react-router-dom';
import '../styles/home.css';

export function HomePage() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="hero-content reveal rise-1">
          <p className="eyebrow">Craft Marketplace Reimagined</p>
          <h1>
            Bring handmade traditions
            <span>into modern homes</span>
          </h1>
          <p>
            Kalasetu helps buyers discover meaningful handcrafted products while giving artisans
            better visibility, fairer reach, and recognition for their craft heritage.
          </p>
          <div className="hero-actions">
            <Link to="/marketplace" className="button primary">
              Explore Products
            </Link>
            <Link to="/register" className="button secondary">
              Join as Artisan
            </Link>
          </div>

          <div className="hero-metrics">
            <div>
              <strong>500+</strong>
              <span>Curated Craft Listings</span>
            </div>
            <div>
              <strong>40+</strong>
              <span>Regions Represented</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Artisan-first Mission</span>
            </div>
          </div>
        </div>

        <div className="hero-showcase reveal rise-2">
          <article className="showcase-card card-a">
            <h3>Handloom Textiles</h3>
            <p>Soft textures with stories woven over generations.</p>
          </article>
          <article className="showcase-card card-b">
            <h3>Metal Craft</h3>
            <p>Bold statement pieces shaped by master artisans.</p>
          </article>
          <article className="showcase-card card-c">
            <h3>Natural Clay Work</h3>
            <p>Functional artistry rooted in local traditions.</p>
          </article>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading reveal rise-1">
          <p className="eyebrow">Why Kalasetu</p>
          <h2>Designed for trust, discovery, and artisan growth</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card reveal rise-1">
            <div className="feature-icon">🎨</div>
            <h3>Authentic Crafts</h3>
            <p>Support traditional artisans and sustainable handmade products.</p>
          </div>

          <div className="feature-card reveal rise-2">
            <div className="feature-icon">✓</div>
            <h3>Verified Quality</h3>
            <p>Expert verification ensures cultural authenticity and quality.</p>
          </div>

          <div className="feature-card reveal rise-3">
            <div className="feature-icon">🌍</div>
            <h3>Global Reach</h3>
            <p>Connect with artisans from diverse regions and cultures.</p>
          </div>

          <div className="feature-card reveal rise-4">
            <div className="feature-icon">💼</div>
            <h3>Fair Trade</h3>
            <p>Direct support to artisans with transparent pricing.</p>
          </div>
        </div>
      </section>

      <section className="journey-section reveal rise-2">
        <div className="journey-panel">
          <h2>How your purchase creates impact</h2>
          <div className="journey-steps">
            <div className="step-item">
              <span>01</span>
              <p>Discover verified handmade products in the marketplace.</p>
            </div>
            <div className="step-item">
              <span>02</span>
              <p>Support artisans directly through transparent pricing.</p>
            </div>
            <div className="step-item">
              <span>03</span>
              <p>Help preserve cultural craft traditions with every order.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section reveal rise-3">
        <h2>Ready to Support Artisans?</h2>
        <p>Start exploring our collection of handcrafted masterpieces.</p>
        <Link to="/marketplace" className="button large cta-button">
          Browse Marketplace
        </Link>
      </section>
    </div>
  );
}
