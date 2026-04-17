# Frontend Development Guide

Quick reference for building features in the Kalasetu frontend.

## Common Patterns

### Creating a New Page Component

```jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/my-page.css';

function MyPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError('');
        // const response = await api.getData();
        // setData(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="my-page-container">
      {error && <div className="error-message">{error}</div>}
      {/* Page content */}
    </div>
  );
}

export default MyPage;
```

### Fetching Data with Error Handling

```jsx
import { getErrorMessage } from '../utils/helpers';
import { productsAPI } from '../api/products';

async function fetchData() {
  try {
    const response = await productsAPI.getProducts();
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    console.error('Fetch error:', message);
    throw error;
  }
}
```

### Form Submission with Validation

```jsx
import { useState } from 'react';
import { validators, validateForm } from '../utils/validators';
import { getErrorMessage } from '../utils/helpers';

function MyForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const validationRules = {
      email: (val) => validators.email(val),
      password: (val) => validators.password(val),
    };

    const newErrors = validateForm(formData, validationRules);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit
    try {
      setLoading(true);
      // await api.submit(formData);
    } catch (error) {
      setErrors({ submit: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### Using File Uploads

```jsx
const handleFileChange = (e) => {
  const file = e.target.files[0];
  setFormData((prev) => ({
    ...prev,
    image: file,
  }));
};

// When submitting
const submitWithFile = async () => {
  const form = new FormData();
  form.append('name', formData.name);
  form.append('image', formData.image);
  
  await apiClient.post('/endpoint/', form);
};
```

### Protected Routes

```jsx
import { ProtectedRoute } from '../routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Require authentication */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Require specific role */}
      <Route
        path="/consultant"
        element={
          <ProtectedRoute requiredRole="CONSULTANT">
            <ConsultantDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

### Formatting Data

```jsx
import { formatPrice, formatDate } from '../utils/helpers';

// Usage
<p>{formatPrice(2500)}</p>        {/* "₹2,500.00" */}
<p>{formatDate('2024-01-15')}</p> {/* "15 January 2024" */}
```

## Common Pitfalls

### ❌ DON'T: Call async functions in useEffect without cleanup
```jsx
// BAD
useEffect(() => {
  fetchData(); // Race condition
}, []);
```

### ✅ DO: Use a function or abort controller
```jsx
// GOOD
useEffect(() => {
  const fetch = async () => {
    // ...
  };
  fetch();
}, []);
```

### ❌ DON'T: Forget to handle loading state
```jsx
// BAD - User sees stale data while loading
const [data, setData] = useState(null);
setData(newData); // No loading indicator
```

### ✅ DO: Show loading state
```jsx
// GOOD
const [loading, setLoading] = useState(false);
setLoading(true);
const data = await api.fetch();
setData(data);
setLoading(false);
```

## API Integration Checklist

When adding a new API endpoint:

1. **Add method to API module**
   ```jsx
   // api/products.js
   export const productsAPI = {
     newEndpoint: async () => {
       return apiClient.get('/new-endpoint/');
     }
   };
   ```

2. **Update ProtectedRoute if needed** for role requirements

3. **Create page component** that uses the endpoint

4. **Add route to App.jsx**
   ```jsx
   <Route path="/new-page" element={<NewPage />} />
   ```

5. **Create or update stylesheet** following naming convention:
   - Page: `styles/new-page.css`
   - Component: `styles/component-name.css`

6. **Test with real API responses**
   - Check error handling
   - Verify loading states
   - Test with different data amounts

## CSS Guidelines

### Variable Usage
```css
.my-component {
  background: var(--primary);
  color: var(--text-dark);
  border: 1px solid var(--border-light);
  padding: var(--spacing-md);
}
```

### Responsive Design
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
```

### Consistent Naming
- Container/wrapper: `.component-container`
- Card/box: `.component-card`
- Button: `.btn`, `.btn-primary`, `.btn-danger`
- Form field: `.form-group`, `.form-input`

## Debugging Tips

### Check Auth Context
```javascript
// In console
const token = localStorage.getItem('access_token');
console.log(token);
```

### Network Requests
1. Open DevTools → Network tab
2. Filter by XHR/Fetch
3. Check request headers for Authorization
4. Check response status codes

### State Updates
```jsx
// Log state changes
useEffect(() => {
  console.log('Data updated:', data);
}, [data]);
```

## Performance Optimization

### Code Splitting
```jsx
import { lazy, Suspense } from 'react';

const LazyPage = lazy(() => import('../pages/LazPage'));

<Suspense fallback={<div>Loading...</div>}>
  <LazyPage />
</Suspense>
```

### Memoization
```jsx
import { memo } from 'react';

const Card = memo(function Card({ data }) {
  return <div>{data.name}</div>;
});
```

## Testing Locally

### Full Development Flow
```bash
# Terminal 1: Backend
cd kalasetu_backend
python manage.py runserver

# Terminal 2: Frontend
cd kalasetu_frontend
npm run dev
```

### Test Scenarios
1. **Anonymous User**
   - View home page
   - View marketplace
   - View product details
   - Click "Sign In" → redirects to login

2. **Artisan User**
   - Register as artisan
   - Login
   - Should see artisan options
   - View artisan dashboard (if built)

3. **Consultant User**
   - Register as consultant
   - Login
   - Access `/consultant/dashboard`
   - Should see verification form

4. **Error Cases**
   - Invalid login credentials
   - Network error during fetch
   - Missing form fields

---

For more details, see [FRONTEND_README.md](./FRONTEND_README.md)
