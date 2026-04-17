# Quick Start Guide

Get Kalasetu running locally in 5 minutes!

## Prerequisites

- **Python 3.9+** - Download from [python.org](https://www.python.org/)
- **Node.js 16+** - Download from [nodejs.org](https://nodejs.org/)
- **PostgreSQL 12+** - Download from [postgresql.org](https://www.postgresql.org/)
- **Git** - For cloning repository

## Step 1: Setup Database

### Windows
```powershell
# Open PostgreSQL installer or use pre-installed server
# Default installation creates 'postgres' user
```

### Mac/Linux
```bash
# Install PostgreSQL (if not already installed)
brew install postgresql
# Or: sudo apt-get install postgresql

# Start PostgreSQL service
brew services start postgresql
# Or: sudo systemctl start postgresql
```

### Create Database
```sql
-- Open PostgreSQL terminal/pgAdmin
CREATE DATABASE kalasetu_db;
CREATE USER kalasetu_user WITH PASSWORD 'your_secure_password';
ALTER ROLE kalasetu_user SET client_encoding TO 'utf8';
ALTER ROLE kalasetu_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE kalasetu_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE kalasetu_db TO kalasetu_user;
```

## Step 2: Setup Backend (Django)

```bash
# Navigate to backend
cd kalasetu_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure database in settings.py
# Update DATABASES configuration with your credentials
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'kalasetu_db',
#         'USER': 'kalasetu_user',
#         'PASSWORD': 'your_secure_password',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }

# Run migrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser
# Follow prompts:
# Email: admin@kalasetu.com
# Password: (secure password)
# Name: (your name)
# Role: ADMIN (when prompted)

# Collect static files (optional for dev)
python manage.py collectstatic --noinput

# Run development server
python manage.py runserver

# Backend is now running at http://localhost:8000
# Admin panel at http://localhost:8000/admin
# API at http://localhost:8000/api
```

## Step 3: Setup Frontend (React + Vite)

```bash
# Open NEW terminal (keep backend running)
cd kalasetu_frontend

# Install dependencies
npm install

# Create environment file
# Copy .env.example to .env.local
copy .env.example .env.local
# Or on Mac/Linux:
# cp .env.example .env.local

# Update .env.local with backend URL
# VITE_API_URL=http://localhost:8000/api

# Start development server
npm run dev

# Frontend is now running at http://localhost:5173
```

## Step 4: Test the Application

### Test Flow:

**1. Anonymous User (Public)**
```
1. Open http://localhost:5173
2. Click "Explore Products" 
3. Browse marketplace
4. Click on a product (should see no products initially - backend empty)
```

**2. Register New User**
```
1. Click "Create Account" or go to /register
2. Fill registration form:
   - Email: test@example.com
   - Password: TestPassword123
   - Name: Test User
   - Role: BUYER (or ARTISAN for testing with more fields)
3. Click Register
4. Auto-redirected to login
5. Login with credentials
6. Redirected to home page (now logged in)
7. See "Hello, Test User" in header
```

**3. Create Test Product (with Artisan account)**
```
1. Register as ARTISAN role
2. Login with artisan account
3. (Dashboard not yet implemented - would add product here)
4. Alternatively, use Django admin to create product
```

**4. View Consultant Dashboard**
```
1. Register as CONSULTANT role
2. Visit http://localhost:5173/consultant/dashboard
3. Should see pending products to verify
4. Fill verification form and submit
```

### Using Django Admin:

```
1. Go to http://localhost:8000/admin
2. Login with superuser credentials
3. Create test products, artisans, stories
4. Products will appear in React frontend marketplace
```

## Common Commands

### Backend

```bash
# Activate virtual environment
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Run migrations
python manage.py migrate

# Create migration file (after model changes)
python manage.py makemigrations

# Run tests
python manage.py test

# Run development server
python manage.py runserver

# Create superuser
python manage.py createsuperuser

# Django shell (for testing)
python manage.py shell
```

### Frontend

```bash
# Install new dependency
npm install package-name

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter (if configured)
npm run lint
```

## Verify Everything is Running

### Check Backend:
```bash
curl http://localhost:8000/api/auth/current-user/
# Should return: 401 Unauthorized (no token)
```

### Check Frontend:
```bash
# Open http://localhost:5173 in browser
# Should see Kalasetu homepage
```

### Check Database Connection:
```bash
# In Django shell:
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.count()
# Should return: 1 (your superuser)
```

## Troubleshooting

### Issue: "No module named 'django'"
```bash
# Ensure virtual environment is ACTIVATED
source venv/bin/activate
# Then install requirements
pip install -r requirements.txt
```

### Issue: "Port 8000 already in use"
```bash
# Use different port
python manage.py runserver 8001
```

### Issue: "Port 5173 already in use"
```bash
# Use different port
npm run dev -- --port 3000
```

### Issue: "CORS error" when fetching API
```
- Ensure backend is running
- Check CORS_ALLOWED_ORIGINS in settings.py includes http://localhost:5173
- Restart backend after changes
```

### Issue: "Database doesn't exist"
```bash
# Ensure PostgreSQL is running and database is created
# Windows: Check PostgreSQL services in Task Manager
# Mac: brew services list | grep postgres
# Linux: sudo systemctl status postgresql

# Re-create database if needed:
# psql -U postgres
# CREATE DATABASE kalasetu_db;
```

### Issue: "Invalid token" errors when logged in
```
- Check if access_token is in localStorage (DevTools → Application)
- Try logging out and logging back in
- Backend token may have expired (normal in development)
```

## Next Steps

1. **Add Test Data**
   - Register several users with different roles
   - Create products as artisan
   - Test verification flow as consultant

2. **Test Features**
   - Product browsing
   - User registration/login
   - Product verification workflow
   - Error handling

3. **Customize**
   - Update colors in `src/styles/globals.css`
   - Add more products/artisan data
   - Implement additional features

4. **Deploy**
   - Follow deployment guides in PROJECT_SUMMARY.md
   - Set up production database
   - Configure environment variables

## Getting Help

- Check [FRONTEND_README.md](./kalasetu_frontend/FRONTEND_README.md) for frontend details
- Check [DEVELOPMENT_GUIDE.md](./kalasetu_frontend/DEVELOPMENT_GUIDE.md) for coding patterns
- Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for architecture overview
- Check Django documentation: https://docs.djangoproject.com/
- Check React documentation: https://react.dev/

---

**Ready to start?** Run the commands above and open http://localhost:5173 in your browser!

See you in the Kalasetu community! 🎨
