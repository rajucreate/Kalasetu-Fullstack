import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/footer.css';

export function Footer() {
  const { user } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h4>About Kalasetu</h4>
            <p>Connecting artisans with buyers worldwide. Supporting traditional crafts and cultural heritage.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              {user?.role === 'BUYER' && (
                <>
                  <li><Link to="/buyer/dashboard">Buyer Dashboard</Link></li>
                  <li><Link to="/marketplace">Marketplace</Link></li>
                </>
              )}
              <li><Link to="/">Home</Link></li>
              <li><Link to="/register">Join Us</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>For Artisans</h4>
            <ul>
              <li><a href="#sell">Start Selling</a></li>
              <li><a href="#support">Get Support</a></li>
              <li><a href="#learn">Learn More</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: support@kalasetu.com</p>
            <p>Phone: +91 XXXX-XXX-XXX</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Kalasetu. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
