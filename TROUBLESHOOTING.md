# Troubleshooting Guide

Solutions for common issues when running Kalasetu locally.

## Backend Issues

### 1. Module Import Errors

**Error:** `ModuleNotFoundError: No module named 'rest_framework'`

**Solution:**
```bash
# Activate virtual environment
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Try again
python manage.py runserver
```

### 2. Database Connection Error

**Error:** `psycopg2.OperationalError: FATAL:  role "kalasetu_user" does not exist`

**Solution:**
```bash
# 1. Verify PostgreSQL is running
# Windows: Services app → PostgreSQL
# Mac: brew services list | grep postgres
# Linux: sudo systemctl status postgresql

# 2. Check PostgreSQL connection
psql -U postgres -h localhost

# 3. Create missing user:
CREATE USER kalasetu_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE kalasetu_db TO kalasetu_user;

# 4. Update settings.py with correct credentials
# 5. Run migrations
python manage.py migrate
```

### 3. Port Already in Use

**Error:** `Address already in use`

**Solution:**
```bash
# Find process using port 8000 (Windows)
netstat -ano | findstr :8000

# Kill process (replace PID with actual ID)
taskkill /PID <PID> /F

# Or use different port
python manage.py runserver 8001
```

### 4. Migration Errors

**Error:** `django.db.utils.ProgrammingError: relation "accounts_user" does not exist`

**Solution:**
```bash
# 1. Check migration status
python manage.py showmigrations

# 2. Run all pending migrations
python manage.py migrate

# 3. If still failing, reset (WARNING: deletes data)
# Delete latest migrations and run again
python manage.py migrate accounts zero  # Revert all
python manage.py migrate  # Re-apply all
```

### 5. Static Files Not Found

**Error:** `Not Found: /static/admin/...`

**Solution:**
```bash
# Collect static files
python manage.py collectstatic --noinput

# For development, ensure STATIC_ROOT is configured
# In settings.py:
# STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
```

## Frontend Issues

### 1. Dependencies Not Installed

**Error:** `Cannot find module 'axios'`

**Solution:**
```bash
# Install all dependencies
npm install

# Or specific package
npm install axios
```

### 2. Port Already in Use

**Error:** `Port 5173 is in use`

**Solution:**
```bash
# Find process using port 5173 (Windows)
netstat -ano | findstr :5173

# Kill process
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3000
```

### 3. CORS Error

**Error:** `Access to XMLHttpRequest at 'http://localhost:8000/...' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution:**

Check Django `settings.py`:
```python
# 1. Ensure django-cors-headers is installed
pip install django-cors-headers

# 2. Add to INSTALLED_APPS
INSTALLED_APPS = [
    ...
    'corsheaders',
]

# 3. Add middleware (BEFORE CommonMiddleware)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

# 4. Configure allowed origins
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

# 5. Allow credentials (for cookies/auth)
CORS_ALLOW_CREDENTIALS = True
```

Then restart Django server.

### 4. .env.local Not Working

**Error:** `API URL is undefined` or requests go to wrong URL

**Solution:**
```bash
# 1. Ensure .env.local exists in kalasetu_frontend/
ls .env.local  # Mac/Linux
dir .env.local # Windows

# 2. Config should be:
VITE_API_URL=http://localhost:8000/api

# 3. Verify in browser console:
console.log(import.meta.env.VITE_API_URL)

# 4. Restart dev server
npm run dev

# 5. Clear browser cache
# DevTools → Application → Storage → Clear Site Data
```

### 5. Build Errors

**Error:** `ReferenceError: React is not defined`

**Solution:**
```bash
# 1. Ensure React is imported in files using JSX
import React from 'react';

# 2. Or use new JSX transform (no import needed)
# Verify vite.config.js:
export default {
  plugins: [react()]
}

# 3. Install missing dependencies
npm install react react-dom

# 4. Clear node_modules and reinstall (last resort)
rm -rf node_modules package-lock.json
npm install
```

### 6. Token Not Persisting

**Error:** `localStorage is not defined` or tokens disappear on refresh

**Solution:**
```bash
# 1. Ensure you're in browser environment (not Node.js)
# 2. Check localStorage in DevTools:
# - Open DevTools → Application → Local Storage
# - Should see: access_token, refresh_token

# 3. If empty, verify login successful:
# - Network tab → POST /auth/login/
# - Response should have access and refresh tokens

# 4. Check storage.js wrapper:
# src/utils/storage.js should have storage methods
```

### 7. Blank Page or 500 Error

**Error:** White screen, nothing loads

**Solution:**
```bash
# 1. Check browser console for errors
# DevTools → Console tab

# 2. Check if backend is running
curl http://localhost:8000/api/

# 3. Check API URL in .env.local
# Should be: VITE_API_URL=http://localhost:8000/api

# 4. Clear browser cache and restart
# DevTools → Application → Clear Site Data
# npm run dev

# 5. Check syntax errors in components
# Look for red underlines in editor

# 6. Check network tab for failed requests
# Should see requests to http://localhost:8000/api/
```

## Authentication Issues

### 1. "Invalid Credentials" on Login

**Solution:**
```bash
# 1. Verify user exists in Django admin
# http://localhost:8000/admin/auth/user/

# 2. Check password is correct
# Try resetting in Django admin

# 3. Check email is being used (not username)
# API expects email field

# 4. Check backend response
# Network tab → POST /auth/login/
# Should return: { access: "...", refresh: "..." }
```

### 2. "Unauthorized" After Login

**Error:** `401 Unauthorized` on subsequent requests after login

**Solution:**
```bash
# 1. Check token in localStorage
# DevTools → Application → Local Storage
# Should have: access_token

# 2. Check request headers
# Network tab → GET /products/
# Should have: Authorization: Bearer <token>

# 3. Verify token freshness
# Tokens expire after 1 hour by default
# Try logging out and back in

# 4. Check API client interceptor
# src/api/client.js should add Authorization header
```

### 3. "Token Refresh Failed"

**Error:** `401 when refreshing token` or stuck on login

**Solution:**
```bash
# 1. Check refresh token in localStorage
# Should exist and be non-empty

# 2. Verify refresh endpoint works
curl -X POST http://localhost:8000/api/auth/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "YOUR_REFRESH_TOKEN"}'

# 3. If refresh fails, tokens may be expired
# Clear localStorage and login again:
# DevTools → Application → Local Storage → Clear All

# 4. Check SimpleJWT settings in Django
# Access token lifetime: 1 hour
# Refresh token lifetime: 30 days
```

### 4. Logout Not Working

**Error:** Still logged in after clicking logout

**Solution:**
```bash
# 1. Check logout method removes tokens
# src/context/AuthContext.jsx logout()
# Should call: localStorage.removeItem('access_token')

# 2. Force clear localStorage
# DevTools → Application → Local Storage → Clear All

# 3. Close and reopen browser tab
# Sometimes cached state persists

# 4. Hard refresh page
# Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

## Data & Display Issues

### 1. "No Products Showing"

**Error:** Marketplace is empty

**Solution:**
```bash
# 1. Create test data in Django admin
# http://localhost:8000/admin/

# 2. Or use API to create product
# POST http://localhost:8000/api/products/
# (requires authentication as ARTISAN)

# 3. Check products are verified
# In admin: Products → Set verified=True

# 4. Refresh frontend
# Ctrl+R or Cmd+R

# 5. Check browser console for errors
# Network tab → GET /products/
# Should return product list
```

### 2. Images Not Loading

**Error:** Product images show as broken

**Solution:**
```bash
# 1. Ensure media files are uploaded
# Django: media/product_images/ folder exists
# With image files inside

# 2. Configure media URLs in Django
# settings.py should have:
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# 3. Add media routes to URLs
# kalasetu_backend/urls.py:
from django.conf import settings
from django.conf.urls.static import static
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# 4. Restart Django
python manage.py runserver

# 5. Try uploading test image via admin
```

### 3. Form Validation Not Working

**Error:** Invalid input still submits

**Solution:**
```javascript
// Check validators.js exists
// src/utils/validators.js

// Verify form uses validation:
const rules = {
  email: (val) => validators.email(val),
  password: (val) => validators.password(val),
};

const errors = validateForm(formData, rules);
if (Object.keys(errors).length > 0) {
  setErrors(errors);
  return;
}

// Check form shows error messages
{errors.field && <span className="field-error">{errors.field}</span>}
```

## Performance Issues

### 1. Slow API Responses

**Error:** Requests take 5+ seconds

**Solution:**
```bash
# 1. Check database query performance
# Django shell:
python manage.py shell
>>> from django.db import connection
>>> from django.test.utils import override_settings
>>> # Run query and check connection.queries

# 2. Enable query logging
# settings.py (development only):
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {'class': 'logging.StreamHandler'},
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}

# 3. Check network tab
# Should see response times < 200ms for simple queries

# 4. Optimize database queries
# Use select_related() and prefetch_related()
```

### 2. Large Bundle Size

**Error:** Frontend loads slowly

**Solution:**
```bash
# 1. Analyze bundle
npm install --save-dev webpack-bundle-analyzer

# 2. Check what's large
npm run build -- --visualizer

# 3. Lazy load pages
import { lazy, Suspense } from 'react';
const ProductPage = lazy(() => import('./ProductPage'));

# 4. Remove unused dependencies
npm ls
npm prune
```

## Development Issues

### 1. Hot Module Replacement Not Working

**Error:** Changes not reflecting without page refresh

**Solution:**
```bash
# 1. Restart dev server
npm run dev

# 2. Check file is being saved (auto-save enabled)
# VS Code: File → Auto Save (should be checked)

# 3. Check Vite config
# vite.config.js should have plugin: react()

# 4. Check file changes are valid JavaScript
# Check browser console for syntax errors
```

### 2. CSS Not Updating

**Error:** Style changes don't appear

**Solution:**
```bash
# 1. Hard refresh browser
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)

# 2. Check CSS file is imported
# src/App.css should import:
@import './styles/globals.css';

# 3. Check CSS variable names
# Should be: var(--primary)
# Not: $primary or #{primary}

# 4. Check CSS file path
# Should be relative to location:
// src/App.css → @import './styles/globals.css';
// src/pages/HomePage.jsx → @import '../styles/home.css';
```

## Git & Version Control Issues

### 1. Merge Conflicts

**Solution:**
```bash
# 1. See conflicted files
git status

# 2. Open files and resolve (marked with <<<<< ===== >>>>>)

# 3. Mark as resolved
git add <file>

# 4. Commit
git commit -m "Resolved merge conflicts"
```

### 2. Accidentally Deleted Files

**Solution:**
```bash
# 1. Check git log
git log --oneline

# 2. Restore from commit
git checkout <commit> -- <file>

# Or just restore
git restore <file>
```

## Still Stuck?

1. **Check Logs**
   - Backend: `python manage.py runserver` console output
   - Frontend: Browser DevTools Console tab
   - Network: Browser DevTools Network tab

2. **Use Debugging Tools**
   - Browser DevTools (inspect elements, network, console)
   - Django Debug Toolbar (install django-debug-toolbar)
   - React DevTools browser extension

3. **Ask for Help**
   - Check documentation files (README, DEVELOPMENT_GUIDE)
   - Review similar issues in code
   - Search error message online

4. **Nuclear Option**
   - Delete virtual environment/node_modules
   - Start fresh: `pip install -r requirements.txt` or `npm install`
   - Reset database: Delete, recreate as per QUICK_START.md

---

**Having issues?** Check the relevant section above. Most issues have simple solutions!
