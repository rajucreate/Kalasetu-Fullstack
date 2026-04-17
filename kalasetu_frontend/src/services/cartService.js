const CART_EVENT = 'kalasetu:cart-updated';
const CART_KEY_PREFIX = 'kalasetu_cart_';
const ORDERS_KEY_PREFIX = 'kalasetu_orders_';

function getCartKey(userId) {
  return `${CART_KEY_PREFIX}${userId || 'guest'}`;
}

function getOrdersKey(userId) {
  return `${ORDERS_KEY_PREFIX}${userId || 'guest'}`;
}

function readJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function notifyCartUpdate(userId) {
  window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: { userId } }));
}

function normalizeQuantity(quantity) {
  const parsed = Number(quantity);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

export const cartService = {
  eventName: CART_EVENT,

  getCart(userId) {
    return readJson(getCartKey(userId), []);
  },

  getOrders(userId) {
    return readJson(getOrdersKey(userId), []);
  },

  getCartCount(userId) {
    return this.getCart(userId).reduce((sum, item) => sum + item.quantity, 0);
  },

  getCartTotal(userId) {
    return this.getCart(userId).reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0);
  },

  addToCart(userId, product, quantity = 1) {
    const cart = this.getCart(userId);
    const qty = normalizeQuantity(quantity);
    const index = cart.findIndex((item) => item.productId === product.id);

    if (index >= 0) {
      cart[index].quantity += qty;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: Number(product.price || 0),
        image: product.image || '',
        artisanName: product.artisan?.first_name || '',
        quantity: qty,
      });
    }

    writeJson(getCartKey(userId), cart);
    notifyCartUpdate(userId);
  },

  updateQuantity(userId, productId, quantity) {
    const cart = this.getCart(userId);
    const nextQuantity = normalizeQuantity(quantity);
    const updated = cart.map((item) => {
      if (item.productId !== productId) return item;
      return { ...item, quantity: nextQuantity };
    });

    writeJson(getCartKey(userId), updated);
    notifyCartUpdate(userId);
  },

  removeFromCart(userId, productId) {
    const cart = this.getCart(userId);
    const updated = cart.filter((item) => item.productId !== productId);
    writeJson(getCartKey(userId), updated);
    notifyCartUpdate(userId);
  },

  clearCart(userId) {
    writeJson(getCartKey(userId), []);
    notifyCartUpdate(userId);
  },

  placeOrder(userId) {
    const cart = this.getCart(userId);
    if (!cart.length) {
      return null;
    }

    const order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      items: cart,
      total: cart.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0),
      status: 'PLACED',
    };

    const orders = this.getOrders(userId);
    writeJson(getOrdersKey(userId), [order, ...orders]);
    this.clearCart(userId);
    return order;
  },
};
