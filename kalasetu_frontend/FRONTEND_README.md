# Kalasetu Frontend

A modern React + Vite frontend for the Kalasetu artisan marketplace platform. Built with clean architecture, JWT authentication, and role-based access control.

## Features

✨ **Authentication**
- User registration with role selection
- JWT-based login system
- Automatic token refresh
- Protected routes based on user roles

🛍️ **Marketplace**
- Browse verified products
- View product details with cultural stories
- Artisan profiles and portfolios
- Search and filter capabilities

💍 **Artisan Dashboard**
- Create and manage products
- Upload product images
- Share artisan stories
- Track product verification status

✅ **Consultant Tools**
- Review pending product verifications
- Add verification notes and impact scores
- Approve or reject products

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors
- **CSS3** - Modern styling (no heavy UI libraries)

## Project Structure

```
src/
├── api/              # API client methods
│   ├── client.js    # Axios instance with interceptors
│   ├── auth.js      # Authentication endpoints
│   ├── products.js  # Product endpoints
│   ├── artisans.js  # Artisan endpoints
│   ├── stories.js   # Story endpoints
│   └── consultant.js # Consultant endpoints
├── components/       # Reusable components
│   ├── Header.jsx
│   └── Footer.jsx
├── context/         # React Context
│   └── AuthContext.jsx # Global auth state
├── pages/           # Page components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── MarketplacePage.jsx
│   ├── ProductDetailPage.jsx
│   ├── ArtisanProfilePage.jsx
│   └── ConsultantDashboardPage.jsx
├── routes/          # Route configuration
│   └── ProtectedRoute.jsx # Auth guard
├── styles/          # Component stylesheets
├── utils/           # Utility functions
│   ├── helpers.js
│   └── storage.js
├── App.jsx          # Main app component with routes
└── main.jsx         # Entry point
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd kalasetu_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure `.env.local`:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:5173`

### Backend Setup

Ensure Django backend is running:
```bash
cd kalasetu_backend
python manage.py runserver
```

API will be at `http://localhost:8000/api`

## Available Routes

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Home page | No |
| `/login` | User login | No |
| `/register` | User registration | No |
| `/marketplace` | Product/artisan marketplace | No |
| `/products/:id` | Product details | No |
| `/artisan/:id` | Artisan profile | No |
| `/consultant/dashboard` | Consultant verification panel | CONSULTANT role |

## Authentication Flow

### Registration
```
1. User fills registration form
2. POST /api/auth/register/ with email, password, role
3. User redirected to login
4. User logs in with credentials
```

### Login
```
1. User enters email and password
2. POST /api/auth/login/ received
3. Access & refresh tokens stored in localStorage
4. User context updated
5. Redirected to home or dashboard
```

### API Calls
```
1. Axios interceptor adds Authorization header
2. Request: Authorization: Bearer <access_token>
3. If 401, automatically refresh token
4. Retry request with new token
5. If refresh fails, logout and redirect to login
```

## Key Components

### AuthContext
Manages global authentication state:
- `user` - Current user data
- `isAuthenticated` - Boolean flag
- `loading` - Loading state
- `error` - Error messages
- Methods: `register()`, `login()`, `logout()`, `updateProfile()`

### ProtectedRoute
Wraps routes requiring authentication:
```jsx
<ProtectedRoute requiredRole="ARTISAN">
  <ArtisanDashboard />
</ProtectedRoute>
```

### API Client
Centralized Axios instance with:
- Base URL configuration
- Request/response interceptors
- Token management
- Auto token refresh

## Development Tips

### Using the API Client

```javascript
import { productsAPI } from '../api/products';

// Fetch products
const { data } = await productsAPI.getProducts();

// Create product
const formData = new FormData();
formData.append('name', 'Product Name');
formData.append('image', imageFile);
await productsAPI.createProduct({...data});
```

### Accessing Auth Context

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (isAuthenticated) {
    return <p>Hello, {user.first_name}</p>;
  }
}
```

### Common Patterns

**Loading State**
```javascript
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);

useEffect(() => {
  const fetch = async () => {
    try {
      setLoading(true);
      const res = await api.getData();
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);
```

**Error Handling**
```javascript
try {
  await apiCall();
} catch (err) {
  const message = getErrorMessage(err);
  setError(message);
}
```

## Styling

The application uses **clean, modern CSS** without heavy UI frameworks:

- **CSS Variables** for theming
- **Flexbox & Grid** for layouts
- **Responsive Design** mobile-first approach
- **Smooth Animations** with CSS transitions
- **BEM-like naming** for maintainability

### Color Scheme
```css
--primary: #c99a5c          /* Gold/brown - Artisan theme */
--primary-dark: #a67c47
--secondary: #2c3e50        /* Dark blue */
--success: #27ae60          /* Green */
--danger: #e74c3c           /* Red */
```

## Building for Production

```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

Output will be in the `dist/` directory.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000/api` |

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of pages
- Image optimization
- CSS minification
- Bundle analysis

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### NetLify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Troubleshooting

### CORS Error
- Ensure backend has CORS enabled
- Check `VITE_API_URL` matches backend

### 401 Unauthorized
- Check token in localStorage
- Try logging out and logging back in
- Check token expiration

### Build Issues
- Clear `node_modules` and reinstall
- Clear Vite cache: `rm -rf .vite`
- Check Node version compatibility

## Project Statistics

- **Pages**: 7
- **Components**: 2
- **API Modules**: 6
- **Stylesheets**: 9
- **Hooks Used**: useContext, useEffect, useState
- **Lines of Code**: 2000+

## Next Steps

- [ ] Add product search/filtering
- [ ] Implement shopping cart
- [ ] Add payment integration
- [ ] User profile editing
- [ ] Product reviews/ratings
- [ ] Notifications
- [ ] Dark mode theme
- [ ] Internationalization (i18n)

## License

MIT

## Support

For issues or questions:
1. Check existing issues on GitHub
2. Review API documentation
3. Check Kalasetu docs

---

**Made with ❤️ for supporting artisans worldwide**
