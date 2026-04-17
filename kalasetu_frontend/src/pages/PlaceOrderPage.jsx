import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { cartService } from '../services/cartService';
import '../styles/place-order.css';

function formatCurrency(value) {
  return `₹${Number(value || 0).toFixed(2)}`;
}

export function PlaceOrderPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState('');

  const userId = user?.id;

  const refreshItems = () => {
    setItems(cartService.getCart(userId));
  };

  useEffect(() => {
    refreshItems();

    const onCartUpdated = () => {
      refreshItems();
    };

    window.addEventListener(cartService.eventName, onCartUpdated);
    return () => window.removeEventListener(cartService.eventName, onCartUpdated);
  }, [userId]);

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0),
    [items]
  );

  const decreaseQuantity = (productId, quantity) => {
    if (quantity <= 1) {
      cartService.removeFromCart(userId, productId);
      return;
    }
    cartService.updateQuantity(userId, productId, quantity - 1);
  };

  const increaseQuantity = (productId, quantity) => {
    cartService.updateQuantity(userId, productId, quantity + 1);
  };

  const removeItem = (productId) => {
    cartService.removeFromCart(userId, productId);
  };

  const confirmPlaceOrder = () => {
    if (!items.length || placing) return;

    setPlacing(true);
    const order = cartService.placeOrder(userId);

    if (order) {
      setMessage(`Order ${order.id} placed successfully.`);
      setTimeout(() => {
        navigate('/buyer/dashboard');
      }, 600);
      return;
    }

    setPlacing(false);
  };

  if (!items.length) {
    return (
      <div className="place-order-page">
        <section className="place-order-panel empty">
          <h1>Your cart is empty</h1>
          <p>Add products from the marketplace to continue placing your order.</p>
          <Link className="back-link" to="/marketplace">
            Go to Marketplace
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="place-order-page">
      <section className="place-order-header">
        <div>
          <p className="kicker">Place Order</p>
          <h1>Review and Confirm</h1>
          <p>Adjust quantities, remove items, and verify your total before checkout.</p>
        </div>
        <Link className="back-link" to="/buyer/dashboard">
          Back to Dashboard
        </Link>
      </section>

      {message ? <p className="success-message">{message}</p> : null}

      <section className="place-order-panel">
        <h2>Order Items</h2>
        <div className="order-list">
          {items.map((item) => {
            const lineTotal = Number(item.price || 0) * item.quantity;

            return (
              <article key={item.productId} className="order-row">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="order-image" />
                ) : (
                  <div className="order-image placeholder">No Image</div>
                )}

                <div className="order-meta">
                  <h3>{item.name}</h3>
                  <p>Unit Cost: {formatCurrency(item.price)}</p>
                  <p>Line Total: {formatCurrency(lineTotal)}</p>
                </div>

                <div className="order-controls">
                  <div className="quantity-box">
                    <button onClick={() => decreaseQuantity(item.productId, item.quantity)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.productId, item.quantity)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeItem(item.productId)}>
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="order-summary">
          <div>
            <p>Total Amount</p>
            <strong>{formatCurrency(totalAmount)}</strong>
          </div>
          <button className="confirm-btn" onClick={confirmPlaceOrder} disabled={placing}>
            {placing ? 'Placing Order...' : 'Confirm Place Order'}
          </button>
        </div>
      </section>
    </div>
  );
}
