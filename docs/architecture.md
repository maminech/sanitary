# 🏗️ Sanitary Platform - Architecture Documentation

## Overview

The Sanitary Platform is a full-stack web application that enables architects to upload 2D/3D building plans, automatically detect sanitary products, visualize them in 3D, and generate dynamic quotes.

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: JWT (Access + Refresh tokens)
- **File Upload**: Multer
- **Validation**: Zod
- **3D Processing**: Three.js (server-side)

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **3D Rendering**: Three.js + React Three Fiber + Drei
- **Styling**: TailwindCSS
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (for frontend)
- **Database**: PostgreSQL

## Architecture Patterns

### Backend Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     API Layer                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │   Routes   │→ │Controllers │→ │  Services  │       │
│  └────────────┘  └────────────┘  └────────────┘       │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  Business Logic                         │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │ AI Detection │  │ Quote Engine │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │    Prisma    │→ │  PostgreSQL  │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

### Clean Architecture Layers

1. **Routes** (`/routes`): HTTP endpoint definitions
2. **Controllers** (`/controllers`): Request/response handling
3. **Services** (`/services`): Business logic
4. **Models** (`/models`): Data models (via Prisma)
5. **Middleware** (`/middleware`): Auth, validation, error handling
6. **Utils** (`/utils`): Helper functions

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     UI Layer                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │   Pages    │→ │ Components │→ │     3D     │       │
│  └────────────┘  └────────────┘  └────────────┘       │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  State Management                       │
│  ┌──────────────────────────────────────┐              │
│  │    Zustand Stores (Auth, etc.)       │              │
│  └──────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    Services                             │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐       │
│  │  Auth  │  │  Plan  │  │Product │  │ Quote  │       │
│  └────────┘  └────────┘  └────────┘  └────────┘       │
│                    ↓                                    │
│               ┌─────────┐                               │
│               │   API   │                               │
│               └─────────┘                               │
└─────────────────────────────────────────────────────────┘
```

## Key Components

### 1. Authentication System

**JWT Token Strategy**:
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), stored in database, used to refresh access tokens
- **Token Rotation**: Old refresh tokens are revoked when new ones are generated

**Flow**:
1. User logs in → receives access + refresh tokens
2. Access token stored in memory, refresh token in localStorage
3. On API request, access token sent in Authorization header
4. If access token expires, automatically refresh using refresh token
5. If refresh fails, user is logged out

### 2. AI Product Detection

**Detection Strategy** (Rule-based with ML-readiness):

1. **File Parsing**:
   - DWG/DXF: Extract objects with names and coordinates
   - OBJ/FBX/STL: Parse 3D mesh data
   
2. **Object Analysis**:
   - Keyword matching in object names
   - Dimensional analysis (width, height, depth)
   - Bounding box extraction
   
3. **Product Classification**:
   - Match detected objects to product types
   - Assign confidence scores
   - Store coordinates for 3D visualization

4. **Future ML Integration**:
   - Ready to plug in TensorFlow/PyTorch models
   - Feature extraction pipeline prepared
   - Training data structure defined

### 3. Quote Engine

**Calculation Logic**:

```typescript
Item Total = (Unit Price × Quantity) - Item Discount
Subtotal = Sum of all Item Totals
After Discount = Subtotal - Global Discount
Tax = After Discount × Tax Rate
Total = After Discount + Tax
```

**Dynamic Updates**:
- Real-time recalculation when items change
- Product replacement updates pricing automatically
- Material selection affects unit price

### 4. 3D Visualization

**Three.js Scene Setup**:
- **Camera**: Perspective camera with orbit controls
- **Lighting**: Ambient + directional + point lights
- **Environment**: HDR environment mapping
- **Grid**: Reference grid for spatial orientation

**Product Rendering**:
- Each detected product rendered as 3D mesh
- Color-coded by product type
- Interactive selection and highlighting
- Real-time material swapping

**User Interactions**:
- Left-click + drag: Rotate camera
- Right-click + drag: Pan view
- Scroll: Zoom in/out
- Click product: Select and show alternatives

## Database Schema

### Core Entities

1. **User**: Authentication and profile data
2. **Plan**: Uploaded building plans
3. **DetectedProduct**: Products found in plans
4. **Product**: Product catalog
5. **ProductMaterial**: Material options for products
6. **Quote**: Generated quotations
7. **QuoteItem**: Items in quotes
8. **Asset3D**: 3D model files
9. **RefreshToken**: JWT refresh tokens

### Relationships

```
User (1) ──┬─→ (N) Plan
           ├─→ (N) Product (as supplier)
           └─→ (N) Quote

Plan (1) ──┬─→ (N) DetectedProduct
           └─→ (N) Quote

Product (1) ──┬─→ (N) DetectedProduct
              ├─→ (N) ProductMaterial
              ├─→ (1) Asset3D
              └─→ (N) QuoteItem

Quote (1) ───→ (N) QuoteItem

DetectedProduct (1) ───→ (N) QuoteItem
```

## API Design

### RESTful Principles

- **Resources**: Nouns (plans, products, quotes)
- **Actions**: HTTP verbs (GET, POST, PUT, DELETE)
- **Status Codes**: Proper HTTP status codes
- **Response Format**: Consistent JSON structure

### Standard Response Format

```json
{
  "success": true|false,
  "message": "Human-readable message",
  "data": { /* Response data */ },
  "errors": [ /* Validation errors */ ]
}
```

### Authentication Flow

```
POST /api/v1/auth/register → Access + Refresh tokens
POST /api/v1/auth/login → Access + Refresh tokens
POST /api/v1/auth/refresh → New token pair
POST /api/v1/auth/logout → Revoke refresh token
GET /api/v1/auth/profile → User data
PUT /api/v1/auth/profile → Updated user data
```

## Security Measures

1. **Authentication**:
   - Password hashing with bcrypt (salt rounds: 10)
   - JWT with secret keys
   - Token expiration and rotation
   
2. **Authorization**:
   - Role-based access control (RBAC)
   - Resource ownership validation
   - Protected routes
   
3. **Input Validation**:
   - Zod schema validation
   - File type/size restrictions
   - SQL injection prevention (Prisma)
   
4. **HTTP Security**:
   - Helmet.js security headers
   - CORS configuration
   - Rate limiting
   
5. **Data Protection**:
   - Environment variables for secrets
   - No sensitive data in logs
   - Secure database connections

## Performance Optimizations

### Backend
- Database query optimization with Prisma
- Pagination for large datasets
- File upload streaming
- Background processing for plan parsing

### Frontend
- Code splitting by route
- Lazy loading of 3D models
- Image optimization
- Caching strategies
- Virtualized lists for large datasets

### 3D Rendering
- Instanced meshes for duplicated objects
- Level of Detail (LOD) for complex models
- Frustum culling
- Texture compression

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- JWT tokens (no session storage)
- Database connection pooling
- Load balancer ready

### Vertical Scaling
- Efficient algorithms
- Database indexing
- Caching layer (Redis - ready to add)
- CDN for static assets

### Future Enhancements
- Message queue (Bull/RabbitMQ) for background jobs
- Microservices architecture potential
- S3 for file storage
- Elasticsearch for product search
- Redis for caching and sessions

## Deployment Architecture

```
┌─────────────┐
│   Nginx     │ ← Frontend (Port 80)
└─────────────┘
      ↓
┌─────────────┐
│  React App  │
└─────────────┘
      ↓
┌─────────────┐
│  Express    │ ← Backend API (Port 5000)
└─────────────┘
      ↓
┌─────────────┐
│ PostgreSQL  │ ← Database (Port 5432)
└─────────────┘
```

## Monitoring & Logging

### Backend Logs
- Morgan for HTTP request logging
- Console logs for development
- Structured logging for production (Winston - ready to add)

### Error Tracking
- Global error handler
- Prisma error mapping
- Multer error handling
- JWT error handling

### Health Checks
- `/health` endpoint
- Database connectivity check
- Service status monitoring

## Testing Strategy (Recommended)

### Backend
- Unit tests: Services and utilities (Jest)
- Integration tests: API endpoints (Supertest)
- E2E tests: Critical workflows (Playwright)

### Frontend
- Unit tests: Components and hooks (Vitest)
- Integration tests: User flows (React Testing Library)
- E2E tests: Complete scenarios (Playwright/Cypress)

## Development Workflow

1. **Local Development**:
   ```bash
   # Backend
   cd backend
   npm install
   npm run dev
   
   # Frontend
   cd frontend
   npm install
   npm run dev
   ```

2. **Docker Development**:
   ```bash
   docker-compose up
   ```

3. **Database Management**:
   ```bash
   npx prisma migrate dev  # Create migrations
   npx prisma generate     # Generate client
   npx prisma studio       # GUI for database
   npx prisma db seed      # Seed database
   ```

## Maintenance Guidelines

### Code Quality
- TypeScript strict mode enabled
- ESLint for code linting
- Prettier for code formatting
- Clear naming conventions
- Comprehensive comments

### Version Control
- Feature branches
- Pull request reviews
- Semantic versioning
- Changelog maintenance

### Documentation
- API documentation (OpenAPI/Swagger - ready to add)
- Code comments
- README files
- Architecture diagrams

---

**Last Updated**: November 2025
**Version**: 1.0.0
