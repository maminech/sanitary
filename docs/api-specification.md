# 📚 API Specification

## Base URL

```
http://localhost:5000/api/v1
```

## Authentication

Most endpoints require authentication via JWT Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "ARCHITECT",
  "company": "Company Name",
  "phone": "+1234567890"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "ARCHITECT"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

---

### Login

**POST** `/auth/login`

Authenticate user and receive tokens.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user data */ },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

---

### Refresh Token

**POST** `/auth/refresh`

Get new access and refresh tokens.

**Request Body**:
```json
{
  "refreshToken": "current_refresh_token"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

---

### Get Profile

**GET** `/auth/profile`

🔒 **Requires Authentication**

Get current user profile.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "ARCHITECT",
    "company": "Company Name",
    "phone": "+1234567890"
  }
}
```

---

## Plan Endpoints

### Upload Plan

**POST** `/plans/upload`

🔒 **Requires Authentication**

Upload a 2D/3D building plan for processing.

**Request** (multipart/form-data):
- `plan` (file): Plan file (DWG, DXF, OBJ, FBX, STL)
- `name` (string): Plan name
- `description` (string, optional): Description
- `buildingType` (string, optional): Building type
- `floor` (string, optional): Floor identifier
- `area` (number, optional): Area in m²

**Response** (201):
```json
{
  "success": true,
  "message": "Plan uploaded successfully and processing started",
  "data": {
    "id": "uuid",
    "name": "Building Plan",
    "fileUrl": "/uploads/plans/file.dwg",
    "status": "PROCESSING",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Get All Plans

**GET** `/plans`

🔒 **Requires Authentication**

Get all plans for the authenticated user.

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Building Plan",
      "status": "COMPLETED",
      "_count": {
        "detectedProducts": 15,
        "quotes": 2
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Get Plan by ID

**GET** `/plans/:id`

🔒 **Requires Authentication**

Get detailed information about a specific plan.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Building Plan",
    "description": "Main floor plan",
    "status": "COMPLETED",
    "detectedProducts": [
      {
        "id": "uuid",
        "type": "TOILET",
        "name": "Toilet_01",
        "confidence": 0.95,
        "posX": 2.5,
        "posY": 0,
        "posZ": 1.5,
        "width": 0.4,
        "height": 0.75,
        "depth": 0.6
      }
    ],
    "quotes": []
  }
}
```

---

### Update Plan

**PUT** `/plans/:id`

🔒 **Requires Authentication**

Update plan metadata.

**Request Body**:
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Plan updated successfully",
  "data": { /* updated plan */ }
}
```

---

### Delete Plan

**DELETE** `/plans/:id`

🔒 **Requires Authentication**

Delete a plan and all related data.

**Response** (200):
```json
{
  "success": true,
  "message": "Plan deleted successfully"
}
```

---

### Get Detected Products

**GET** `/plans/:id/products`

🔒 **Requires Authentication**

Get all detected products in a plan.

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "SINK",
      "name": "Sink_Wall_Mount",
      "confidence": 0.88,
      "position": { "x": 1.2, "y": 0.85, "z": 0.5 },
      "dimensions": { "width": 0.5, "height": 0.2, "depth": 0.45 },
      "product": { /* linked product if available */ }
    }
  ]
}
```

---

## Product Endpoints

### Create Product

**POST** `/products`

🔒 **Requires Authentication** (SUPPLIER or ADMIN only)

Add a new product to the catalog.

**Request Body**:
```json
{
  "reference": "TOI-001",
  "name": "Modern Wall-Hung Toilet",
  "description": "Contemporary design",
  "type": "TOILET",
  "brand": "AquaModern",
  "basePrice": 450.00,
  "currency": "EUR",
  "width": 0.36,
  "height": 0.40,
  "depth": 0.54,
  "weight": 25.5,
  "inStock": true,
  "leadTime": 7
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { /* product data */ }
}
```

---

### Get All Products

**GET** `/products`

Get products with optional filters.

**Query Parameters**:
- `type`: Product type (TOILET, SINK, etc.)
- `supplierId`: Filter by supplier
- `inStock`: Boolean
- `minPrice`, `maxPrice`: Price range
- `search`: Text search
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "reference": "TOI-001",
        "name": "Modern Wall-Hung Toilet",
        "type": "TOILET",
        "basePrice": 450.00,
        "thumbnailUrl": "/uploads/products/thumb.jpg",
        "supplier": {
          "company": "Premium Sanitary Co."
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

---

### Get Product by ID

**GET** `/products/:id`

Get detailed product information.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "reference": "TOI-001",
    "name": "Modern Wall-Hung Toilet",
    "description": "Full description",
    "type": "TOILET",
    "basePrice": 450.00,
    "specifications": {
      "flushType": "Dual flush",
      "waterUsage": "3/6 liters"
    },
    "materials": [
      {
        "name": "White Ceramic",
        "type": "CERAMIC",
        "color": "#FFFFFF"
      }
    ],
    "supplier": { /* supplier info */ }
  }
}
```

---

### Update Product

**PUT** `/products/:id`

🔒 **Requires Authentication** (Owner or ADMIN)

Update product information.

---

### Delete Product

**DELETE** `/products/:id`

🔒 **Requires Authentication** (Owner or ADMIN)

Delete a product from catalog.

---

### Get Similar Products

**GET** `/products/:id/similar`

Get products similar to the specified product.

**Query Parameters**:
- `limit`: Number of results (default: 10)

**Response** (200):
```json
{
  "success": true,
  "data": [
    { /* similar product 1 */ },
    { /* similar product 2 */ }
  ]
}
```

---

## Quote Endpoints

### Create Quote from Plan

**POST** `/quotes/from-plan`

🔒 **Requires Authentication**

Automatically create a quote from detected products in a plan.

**Request Body**:
```json
{
  "planId": "uuid",
  "title": "Main Floor Quote"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Quote created successfully",
  "data": {
    "id": "uuid",
    "reference": "QT-202411-0001",
    "title": "Main Floor Quote",
    "status": "DRAFT",
    "subtotal": 1250.50,
    "tax": 250.10,
    "discount": 0,
    "total": 1500.60,
    "items": []
  }
}
```

---

### Create Custom Quote

**POST** `/quotes`

🔒 **Requires Authentication**

Create a quote with custom items.

**Request Body**:
```json
{
  "planId": "uuid",
  "title": "Custom Quote",
  "description": "Quote description",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "discount": 5
    }
  ]
}
```

---

### Get All Quotes

**GET** `/quotes`

🔒 **Requires Authentication**

Get all quotes for the user.

**Query Parameters**:
- `status`: Filter by status (DRAFT, PENDING, APPROVED, etc.)
- `planId`: Filter by plan

---

### Get Quote by ID

**GET** `/quotes/:id`

🔒 **Requires Authentication**

Get detailed quote information.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "reference": "QT-202411-0001",
    "title": "Main Floor Quote",
    "status": "DRAFT",
    "subtotal": 1250.50,
    "tax": 250.10,
    "total": 1500.60,
    "items": [
      {
        "id": "uuid",
        "name": "Modern Wall-Hung Toilet",
        "reference": "TOI-001",
        "unitPrice": 450.00,
        "quantity": 2,
        "discount": 0,
        "total": 900.00,
        "product": { /* full product details */ }
      }
    ]
  }
}
```

---

### Update Quote Item

**PUT** `/quotes/:quoteId/items/:itemId`

🔒 **Requires Authentication**

Update a specific item in a quote.

**Request Body**:
```json
{
  "productId": "new_product_uuid",
  "quantity": 3,
  "discount": 10,
  "selectedMaterial": "Black Porcelain"
}
```

---

### Add Item to Quote

**POST** `/quotes/:quoteId/items`

🔒 **Requires Authentication**

Add a new item to an existing quote.

---

### Remove Item from Quote

**DELETE** `/quotes/:quoteId/items/:itemId`

🔒 **Requires Authentication**

Remove an item from a quote.

---

### Update Quote Status

**PUT** `/quotes/:id/status`

🔒 **Requires Authentication**

Change the status of a quote.

**Request Body**:
```json
{
  "status": "APPROVED"
}
```

---

### Delete Quote

**DELETE** `/quotes/:id`

🔒 **Requires Authentication**

Delete a quote.

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Response** (429):
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

---

**API Version**: v1
**Last Updated**: November 2025
