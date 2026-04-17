# API Reference Guide

Complete documentation of all Kalasetu REST API endpoints.

## Base URL

- **Development:** `http://localhost:8000/api`
- **Production:** `https://api.kalasetu.com/api` (configure in .env)

## Authentication

All endpoints (except registration and login) require JWT token in the Authorization header:

```
Authorization: Bearer {access_token}
```

Token is automatically added by `src/api/client.js` request interceptor.

---

## Authentication Endpoints

### Register User

**Endpoint:** `POST /api/auth/register/`

**Description:** Create a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "password_confirm": "SecurePassword123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "ARTISAN",
  "phone_number": "9876543210",
  "region": "Kerala",
  "experience_years": 5
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "ARTISAN",
  "phone_number": "9876543210",
  "region": "Kerala"
}
```

**Frontend Usage:**
```javascript
import { authAPI } from '@/api/auth';

const user = await authAPI.register({
  email: 'user@example.com',
  password: 'SecurePassword123',
  password_confirm: 'SecurePassword123',
  first_name: 'John',
  last_name: 'Doe',
  role: 'ARTISAN',
  phone_number: '9876543210',
  region: 'Kerala',
  experience_years: 5,
});
```

---

### Login User

**Endpoint:** `POST /api/auth/login/`

**Description:** Authenticate user and receive JWT tokens

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:** `200 OK`
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "ARTISAN"
  }
}
```

**Frontend Usage:**
```javascript
import { useAuth } from '@/hooks/useAuth';

const { login } = useAuth();
await login('user@example.com', 'SecurePassword123');
```

---

### Get Current User

**Endpoint:** `GET /api/auth/current-user/`

**Description:** Fetch details of authenticated user

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "ARTISAN",
  "bio": "Professional weaver for 5 years",
  "experience_years": 5,
  "phone_number": "9876543210",
  "region": "Kerala",
  "profile_image": "https://example.com/media/profile.jpg"
}
```

**Frontend Usage:**
```javascript
import { authAPI } from '@/api/auth';

const { data: user } = await authAPI.getCurrentUser();
```

---

### Update User Profile

**Endpoint:** `PUT /api/auth/update-profile/`

**Description:** Update current user's profile information

**Auth Required:** Yes (own profile)

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "bio": "Updated bio",
  "experience_years": 6
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "bio": "Updated bio",
  "experience_years": 6
}
```

**Frontend Usage:**
```javascript
import { authAPI } from '@/api/auth';

const updated = await authAPI.updateProfile({
  first_name: 'John',
  bio: 'New bio',
  experience_years: 6,
});
```

---

### Refresh Token

**Endpoint:** `POST /api/auth/refresh/`

**Description:** Get new access token using refresh token

**Auth Required:** No

**Request Body:**
```json
{
  "refresh": "{refresh_token}"
}
```

**Response:** `200 OK`
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Note:** Automatically handled by `src/api/client.js` response interceptor on 401 errors.

---

## Product Endpoints

### List All Products

**Endpoint:** `GET /api/products/?page=1`

**Description:** Get paginated list of verified products

**Auth Required:** No

**Query Parameters:**
- `page` (optional): Page number, default 1
- `search` (optional): Search by name/description
- `region` (optional): Filter by region
- `price_min` and `price_max` (optional): Filter by price range

**Response:** `200 OK`
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Handmade Wood Bowl",
      "description": "Traditional wooden bowl",
      "price": "2500.00",
      "image": "http://localhost:8000/media/product_images/bowl.jpg",
      "cultural_story": "This bowl is crafted using traditional methods...",
      "craft_process": "The wood is soaked, shaped, and finished...",
      "creator": {
        "id": 2,
        "first_name": "Artisan",
        "last_name": "Name",
        "role": "ARTISAN"
      },
      "verified": true,
      "verification_score": 9.5
    }
  ]
}
```

**Frontend Usage:**
```javascript
import { productsAPI } from '@/api/products';

const { data } = await productsAPI.getProducts(1);
// data = { count, next, previous, results: [...] }
```

---

### Get Product Details

**Endpoint:** `GET /api/products/{id}/`

**Description:** Get full details of a specific product

**Auth Required:** No

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Handmade Wood Bowl",
  "description": "Traditional wooden bowl",
  "price": "2500.00",
  "stock_quantity": 10,
  "image": "http://localhost:8000/media/product_images/bowl.jpg",
  "cultural_story": "This bowl is crafted using traditional methods...",
  "craft_process": "The wood is soaked, shaped, and finished...",
  "creator": {
    "id": 2,
    "first_name": "Artisan",
    "last_name": "Name",
    "role": "ARTISAN",
    "bio": "Master woodworker",
    "experience_years": 10
  },
  "verified": true,
  "verified_by": {
    "id": 3,
    "first_name": "Consultant",
    "last_name": "Name"
  },
  "verification_score": 9.5,
  "verification_notes": "Authentic traditional craft",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Frontend Usage:**
```javascript
import { productsAPI } from '@/api/products';

const { data: product } = await productsAPI.getProduct(1);
```

---

### Create Product

**Endpoint:** `POST /api/products/`

**Description:** Create a new product listing

**Auth Required:** Yes (ARTISAN role)

**Request Type:** `multipart/form-data`

**Request Body:**
```
name: "Handmade Basket"
description: "Beautiful woven basket with traditional patterns"
price: "1500.00"
stock_quantity: 5
image: <File>
cultural_story: "This basket uses techniques passed down through generations..."
craft_process: "The basket is woven using locally sourced palm leaves..."
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Handmade Basket",
  "description": "Beautiful woven basket with traditional patterns",
  "price": "1500.00",
  "image": "http://localhost:8000/media/product_images/basket.jpg",
  "creator": { ... },
  "verified": false
}
```

**Frontend Usage:**
```javascript
import { productsAPI } from '@/api/products';

const formData = new FormData();
formData.append('name', 'Handmade Basket');
formData.append('description', 'Beautiful basket');
formData.append('price', '1500.00');
formData.append('image', imageFile);
formData.append('cultural_story', 'Story text');
formData.append('craft_process', 'Process text');

const { data } = await productsAPI.createProduct(formData);
```

---

### Update Product

**Endpoint:** `PUT /api/products/{id}/`

**Description:** Update product details

**Auth Required:** Yes (product creator or ADMIN)

**Request Type:** `multipart/form-data` (same as create)

**Response:** `200 OK` (updated product)

**Frontend Usage:**
```javascript
const formData = new FormData();
formData.append('name', 'Updated Name');
formData.append('price', '2000.00');

const { data } = await productsAPI.updateProduct(1, formData);
```

---

### Delete Product

**Endpoint:** `DELETE /api/products/{id}/`

**Description:** Delete a product listing

**Auth Required:** Yes (product creator or ADMIN)

**Response:** `204 No Content`

**Frontend Usage:**
```javascript
import { productsAPI } from '@/api/products';

await productsAPI.deleteProduct(1);
```

---

### Get My Products

**Endpoint:** `GET /api/products/my-products/?page=1`

**Description:** Get current user's product listings (ARTISAN only)

**Auth Required:** Yes (ARTISAN role)

**Response:** `200 OK` (paginated product list)

**Frontend Usage:**
```javascript
const { data } = await productsAPI.getMyProducts(1);
```

---

## Artisan Endpoints

### List All Artisans

**Endpoint:** `GET /api/artisans/?page=1`

**Description:** Get paginated list of artisan profiles

**Auth Required:** No

**Query Parameters:**
- `page` (optional): Page number
- `region` (optional): Filter by region
- `search` (optional): Search by name

**Response:** `200 OK`
```json
{
  "count": 20,
  "results": [
    {
      "id": 2,
      "first_name": "Artisan",
      "last_name": "Name",
      "email": "artisan@example.com",
      "bio": "Master craftsperson with 20 years experience",
      "experience_years": 20,
      "region": "Kerala",
      "phone_number": "9876543210",
      "profile_image": "http://localhost:8000/media/profile.jpg",
      "role": "ARTISAN"
    }
  ]
}
```

**Frontend Usage:**
```javascript
import { artisansAPI } from '@/api/artisans';

const { data } = await artisansAPI.getArtisans(1);
```

---

### Get Artisan Details

**Endpoint:** `GET /api/artisans/{id}/`

**Description:** Full profile of specific artisan

**Auth Required:** No

**Response:** `200 OK` (artisan object with products)

**Frontend Usage:**
```javascript
const { data: artisan } = await artisansAPI.getArtisan(2);
```

---

## Story Endpoints

### List All Stories

**Endpoint:** `GET /api/stories/?page=1`

**Description:** Get paginated list of artisan stories

**Auth Required:** No

**Response:** `200 OK`
```json
{
  "count": 50,
  "results": [
    {
      "id": 1,
      "title": "My Journey as an Artisan",
      "content": "I started this journey 20 years ago...",
      "creator": {
        "id": 2,
        "first_name": "Artisan",
        "last_name": "Name"
      },
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Frontend Usage:**
```javascript
import { storiesAPI } from '@/api/stories';

const { data } = await storiesAPI.getStories(1);
```

---

### Get Story Details

**Endpoint:** `GET /api/stories/{id}/`

**Description:** Full text of specific story

**Auth Required:** No

**Response:** `200 OK` (story object)

---

### Create Story

**Endpoint:** `POST /api/stories/`

**Description:** Create new artisan story

**Auth Required:** Yes (ARTISAN role)

**Request Body:**
```json
{
  "title": "My Craft Journey",
  "content": "This is the story of my journey in traditional craftsmanship..."
}
```

**Response:** `201 Created`

**Frontend Usage:**
```javascript
const { data } = await storiesAPI.createStory({
  title: 'My Craft Journey',
  content: 'Long story text here...',
});
```

---

### Update Story

**Endpoint:** `PUT /api/stories/{id}/`

**Description:** Update existing story

**Auth Required:** Yes (story creator or ADMIN)

---

### Delete Story

**Endpoint:** `DELETE /api/stories/{id}/`

**Description:** Delete story

**Auth Required:** Yes (story creator or ADMIN)

---

### Get My Stories

**Endpoint:** `GET /api/stories/my-stories/?page=1`

**Description:** Get current user's stories

**Auth Required:** Yes (ARTISAN)

---

## Consultant Verification Endpoints

### List Pending Products

**Endpoint:** `GET /api/consultant/pending-products/?page=1`

**Description:** Get products awaiting verification

**Auth Required:** Yes (CONSULTANT role)

**Response:** `200 OK`
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "name": "Handmade Bowl",
      "creator": { ... },
      "verified": false,
      "verification_score": null,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Frontend Usage:**
```javascript
import { consultantAPI } from '@/api/consultant';

const { data } = await consultantAPI.getPendingProducts(1);
```

---

### Verify Product

**Endpoint:** `POST /api/consultant/verify-product/`

**Description:** Submit product verification

**Auth Required:** Yes (CONSULTANT role)

**Request Body:**
```json
{
  "product_id": 1,
  "verification_score": 9.5,
  "verification_notes": "This is an authentic traditional craft with excellent cultural value",
  "approved": true
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "product": 1,
  "verified_by": 3,
  "verification_score": 9.5,
  "verification_notes": "Authentic traditional craft",
  "verification_date": "2024-01-20T15:45:00Z"
}
```

**Frontend Usage:**
```javascript
const { data } = await consultantAPI.verifyProduct({
  product_id: 1,
  verification_score: 9.5,
  verification_notes: 'Authentic craft',
  approved: true,
});
```

---

## Error Handling

### Error Response Format

All errors return JSON with detail message:

```json
{
  "detail": "Error message here"
}
```

Or with field errors:

```json
{
  "email": ["This field may not be blank."],
  "password": ["This password is too common."]
}
```

### Common Status Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 204 | No Content | Success (delete) |
| 400 | Bad Request | Invalid data, check request body |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error, check logs |

### Frontend Error Handling

```javascript
import { getErrorMessage } from '@/utils/helpers';

try {
  const data = await api.call();
} catch (error) {
  const message = getErrorMessage(error);
  console.error(message);
  // Display to user
}
```

---

## Testing Endpoints

### With cURL

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "password_confirm": "TestPass123",
    "first_name": "Test",
    "last_name": "User",
    "role": "BUYER"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "TestPass123"}'

# Get Products
curl -X GET http://localhost:8000/api/products/

# Authenticated request
curl -X GET http://localhost:8000/api/auth/current-user/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### With Postman

1. Create collection "Kalasetu API"
2. Create environments: "Development" and "Production"
3. Set variable: `base_url = http://localhost:8000/api`
4. Set variable: `access_token` after login
5. Use `{{base_url}}/products/` in requests
6. Add `Authorization: Bearer {{access_token}}` to authenticated requests

---

## Rate Limiting

Currently no rate limiting. Implement for production:
- 100 requests per minute for authenticated users
- 20 requests per minute for anonymous users

---

## API Versioning

Current API version: **v1**
- Base URL: `/api/v1/`
- Future versions: `/api/v2/`, etc.

---

## Webhooks (Future)

Planned webhooks for:
- Product verification complete
- New review posted
- Order status changed

---

**API Last Updated:** 2024
**Version:** 1.0.0
**Maintained by:** Kalasetu Team

For more information, see [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
