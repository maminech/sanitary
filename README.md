# 🚀 Sanitary Platform - Complete Setup Guide

## Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL**: v15 or higher
- **npm**: v9 or higher
- **Docker** (optional): For containerized deployment

---

## 🏃‍♂️ Quick Start (Local Development)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sanitary-platform
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://postgres:password@localhost:5432/sanitary_platform?schema=public"

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database with sample data
npx prisma db seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create environment file (optional)
echo VITE_API_URL=http://localhost:5000/api/v1 > .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health
- **Prisma Studio**: Run `npx prisma studio` in backend folder

### 5. Test Accounts

After seeding, you can login with:

- **Architect**: `architect@example.com` / `Password123!`
- **Supplier 1**: `supplier1@example.com` / `Password123!`
- **Supplier 2**: `supplier2@example.com` / `Password123!`
- **Client**: `client@example.com` / `Password123!`

---

## 🐳 Docker Setup

### Quick Start with Docker Compose

```bash
# From project root
cd sanitary-platform

# Build and start all containers
docker-compose -f infrastructure/docker-compose.yml up --build

# Or run in detached mode
docker-compose -f infrastructure/docker-compose.yml up -d --build
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- PostgreSQL: localhost:5432

### Stop Containers

```bash
docker-compose -f infrastructure/docker-compose.yml down

# With volume cleanup
docker-compose -f infrastructure/docker-compose.yml down -v
```

---

## 📦 Production Deployment

### Backend Production Build

```bash
cd backend

# Install dependencies
npm ci --only=production

# Generate Prisma Client
npx prisma generate

# Build TypeScript
npm run build

# Run migrations
npx prisma migrate deploy

# Start production server
npm start
```

### Frontend Production Build

```bash
cd frontend

# Install dependencies
npm ci --only=production

# Build for production
npm run build

# Preview build (optional)
npm run preview
```

Build output will be in `frontend/dist/`

### Environment Variables

**Backend** (`.env`):
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=https://your-domain.com
```

**Frontend** (`.env.production`):
```env
VITE_API_URL=https://api.your-domain.com/api/v1
```

---

## 🗃️ Database Management

### Create New Migration

```bash
cd backend
npx prisma migrate dev --name migration_name
```

### Apply Migrations (Production)

```bash
npx prisma migrate deploy
```

### Reset Database

```bash
npx prisma migrate reset
```

### View Database with Prisma Studio

```bash
npx prisma studio
```

Opens GUI at http://localhost:5555

### Seed Database

```bash
npx prisma db seed
```

---

## 🛠️ Development Workflow

### Backend Development

```bash
cd backend

# Development with auto-reload
npm run dev

# Build TypeScript
npm run build

# Generate Prisma types after schema changes
npx prisma generate
```

### Frontend Development

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 📁 Project Structure

```
sanitary-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   ├── ai-recognition/  # Product detection
│   │   ├── quote-engine/    # Quote calculations
│   │   └── index.ts         # Entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Seed data
│   ├── uploads/             # Uploaded files
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   └── layouts/     # Layout components
│   │   ├── pages/           # Page components
│   │   ├── 3d/              # Three.js components
│   │   ├── services/        # API services
│   │   ├── stores/          # Zustand stores
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── infrastructure/
│   ├── docker-compose.yml
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── nginx.conf
│
└── docs/
    ├── architecture.md
    ├── api-specification.md
    └── database-schema.md
```

---

## 🧪 Testing

### Backend Tests (To Implement)

```bash
cd backend

# Unit tests
npm test

# Integration tests
npm run test:integration

# Coverage
npm run test:coverage
```

### Frontend Tests (To Implement)

```bash
cd frontend

# Unit tests
npm test

# E2E tests
npm run test:e2e
```

---

## 🔧 Troubleshooting

### Backend Won't Start

1. **Check PostgreSQL is running**:
   ```bash
   # Windows
   sc query postgresql-x64-15
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. **Verify database connection**:
   ```bash
   npx prisma db push
   ```

3. **Check for port conflicts**:
   Port 5000 might be in use. Change in `.env`:
   ```env
   PORT=5001
   ```

### Frontend Can't Connect to API

1. **Verify backend is running**: http://localhost:5000/health

2. **Check CORS settings** in backend `config.ts`

3. **Check API URL** in frontend:
   ```bash
   # .env.local
   VITE_API_URL=http://localhost:5000/api/v1
   ```

### Database Migration Issues

```bash
# Reset and recreate database
npx prisma migrate reset

# Force push schema
npx prisma db push --force-reset
```

### Docker Issues

```bash
# Remove all containers and volumes
docker-compose -f infrastructure/docker-compose.yml down -v

# Rebuild without cache
docker-compose -f infrastructure/docker-compose.yml build --no-cache

# View logs
docker-compose -f infrastructure/docker-compose.yml logs -f
```

---

## 📝 Common Tasks

### Add New API Endpoint

1. Create controller in `backend/src/controllers/`
2. Add route in `backend/src/routes/`
3. Register route in `backend/src/index.ts`
4. Create service function in `frontend/src/services/`

### Add New Page

1. Create page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Add navigation link if needed

### Modify Database Schema

1. Edit `backend/prisma/schema.prisma`
2. Generate migration:
   ```bash
   npx prisma migrate dev --name change_description
   ```
3. Update seed file if needed

### Add New Product Type

1. Update `ProductType` enum in Prisma schema
2. Add to `PRODUCT_KEYWORDS` in `ai-recognition/detector.ts`
3. Add to `TYPICAL_DIMENSIONS` if applicable
4. Update frontend type definitions

---

## 🎯 Next Steps

After setup, you can:

1. **Upload a Plan**: Go to Plans page and upload a 2D/3D file
2. **Browse Products**: Explore the product catalog
3. **Create Quote**: Generate quotes from detected products
4. **3D Visualization**: View plans in interactive 3D viewer

---

## 📚 Documentation

- **Architecture**: See `/docs/architecture.md`
- **API Reference**: See `/docs/api-specification.md`
- **Database Schema**: See `/docs/database-schema.md`

---

## 🆘 Getting Help

For issues or questions:

1. Check this setup guide
2. Review documentation in `/docs`
3. Check backend logs: `npm run dev` output
4. Check frontend console in browser DevTools
5. Verify database with Prisma Studio

---

## 🔐 Security Notes

**Before Production**:

1. Change all secret keys in `.env`
2. Use strong passwords
3. Enable HTTPS
4. Set up proper CORS
5. Configure rate limiting
6. Set up monitoring and logging
7. Regular backups of database
8. Keep dependencies updated

---

## 📦 Package Scripts

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npx prisma generate` - Generate Prisma Client
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma migrate deploy` - Apply migrations (production)
- `npx prisma db seed` - Seed database
- `npx prisma studio` - Open database GUI

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

**Happy Coding! 🎉**
