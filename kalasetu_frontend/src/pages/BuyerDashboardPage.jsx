import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { cartService } from '../services/cartService';
import '../styles/buyer-dashboard.css';

function formatCurrency(value) {
  return `₹${Number(value || 0).toFixed(2)}`;
}

export function BuyerDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cart');
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  const userId = user?.id;

  const refreshData = () => {
    setCartItems(cartService.getCart(userId));
    setOrders(cartService.getOrders(userId));
  };

  useEffect(() => {
    refreshData();

    const onCartUpdated = () => {
      refreshData();
    };

    window.addEventListener(cartService.eventName, onCartUpdated);
    return () => window.removeEventListener(cartService.eventName, onCartUpdated);
  }, [userId]);

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0),
    [cartItems]
  );

  const handleQuantityChange = (productId, value) => {
    cartService.updateQuantity(userId, productId, Number(value));
  };

  const handleRemove = (productId) => {
    cartService.removeFromCart(userId, productId);
    setMessage('Item removed from cart.');
  };

  const handlePlaceOrder = () => {
    navigate('/buyer/place-order');
  };

  return (
    <div className="buyer-dashboard">
      <section className="buyer-hero">
        <div>
          <p className="kicker">Buyer Dashboard</p>
          <h1>Welcome{user?.first_name ? `, ${user.first_name}` : ''}</h1>
          <p>Track your cart and review your placed orders in one place.</p>
        </div>
        <Link className="marketplace-link" to="/marketplace">
          Continue Shopping
        </Link>
      </section>

      <div className="buyer-tabs">
        <button
          className={activeTab === 'cart' ? 'active' : ''}
          onClick={() => setActiveTab('cart')}
        >
          Cart ({cartItems.length})
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({orders.length})
        </button>
      </div>

      {message ? <p className="buyer-message">{message}</p> : null}

      {activeTab === 'cart' ? (
        <section className="buyer-panel">
          <h2>Your Cart</h2>
          {cartItems.length ? (
            <>
              <div className="cart-list">
                {cartItems.map((item) => (
                  <article key={item.productId} className="cart-row">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="cart-image" />
                    ) : (
                      <div className="cart-image placeholder">No Image</div>
                    )}
                    <div className="cart-meta">
                      <h3>{item.name}</h3>
                      <p>{formatCurrency(item.price)}</p>
                      <p className="cart-artisan">by {item.artisanName || 'Artisan'}</p>
                    </div>
                    <div className="cart-actions">
                      <label>
                        Qty
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                        />
                      </label>
                      <button className="danger" onClick={() => handleRemove(item.productId)}>
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="cart-summary">
                <strong>Total: {formatCurrency(cartTotal)}</strong>
                <button className="checkout" onClick={handlePlaceOrder}>Place Order</button>
              </div>
            </>
          ) : (
            <p className="empty">Your cart is empty.</p>
          )}
        </section>
      ) : (
        <section className="buyer-panel">
          <h2>Your Orders</h2>
          {orders.length ? (
            <div className="order-list">
              {orders.map((order) => (
                <article key={order.id} className="order-card">
                  <div className="order-header">
                    <h3>{order.id}</h3>
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <ul>
                    {order.items.map((item) => (
                      <li key={`${order.id}-${item.productId}`}>
                        {item.name} x {item.quantity} - {formatCurrency(Number(item.price) * item.quantity)}
                      </li>
                    ))}
                  </ul>
                  <div className="order-footer">
                    <span className="status">{order.status}</span>
                    <strong>{formatCurrency(order.total)}</strong>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty">No orders yet. Place your first order from the cart.</p>
          )}
        </section>
      )}
    </div>
  );
}
