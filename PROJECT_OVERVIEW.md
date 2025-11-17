# 🏗️ 2D/3D Sanitary Platform for Architects

A complete full-stack web platform that allows architects to upload 2D/3D building plans, automatically detect sanitary products, visualize in interactive 3D, and generate dynamic quotes.

## ✨ Features

### 🎨 For Architects
- Upload 2D/3D building plans (DWG, DXF, OBJ, FBX, STL)
- Automatic sanitary product detection (toilets, sinks, showers, etc.)
- Interactive 3D visualization with Three.js
- Click products to view alternatives
- Real-time material selection
- Dynamic quote generation
- Project management dashboard

### 🏭 For Suppliers
- Product catalog management
- Upload 3D models and specifications
- Set pricing and materials
- Track product usage in projects
- Manage inventory and lead times

### 👥 For Clients
- Read-only 3D plan viewer
- Product customization preview
- Quote approval workflow

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** with **Prisma ORM**
- **JWT** Authentication (Access + Refresh tokens)
- **Multer** for file uploads
- **Zod** for validation
- **AI Recognition Module** (rule-based, ML-ready)
- **Quote Engine** (dynamic calculations)

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Three.js** + **React Three Fiber** (3D rendering)
- **TailwindCSS** (styling)
- **Zustand** (state management)
- **React Hook Form** + **Zod** (forms)
- **Axios** (HTTP client)

### Infrastructure
- **Docker** + **Docker Compose**
- **Nginx** (frontend web server)
- **PostgreSQL** database

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm 9+

### Installation

```bash
# Backend
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

**Access**: http://localhost:3000

### Test Accounts
- Architect: `architect@example.com` / `Password123!`
- Supplier: `supplier1@example.com` / `Password123!`

### Docker Setup

```bash
docker-compose -f infrastructure/docker-compose.yml up --build
```

For complete setup instructions, see **[README.md](/README.md)**

## 📖 Documentation

- **[Setup Guide](README.md)** - Complete installation & configuration
- **[Architecture](docs/architecture.md)** - System design & patterns
- **[API Specification](docs/api-specification.md)** - REST API reference

## 🏛️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   React     │─────▶│   Express   │─────▶│ PostgreSQL  │
│  Frontend   │      │   Backend   │      │  Database   │
└─────────────┘      └─────────────┘      └─────────────┘
     ↓                      ↓
┌─────────────┐      ┌─────────────┐
│  Three.js   │      │AI Detection │
│  3D Viewer  │      │Quote Engine │
└─────────────┘      └─────────────┘
```

## 🔑 Key Features

### AI Product Detection
- Automatic recognition from plan files
- Keyword matching + dimensional analysis
- Confidence scoring
- Ready for ML model integration

### 3D Visualization
- Interactive Three.js scene
- Click-to-select products
- Real-time material swapping
- Orbit/pan/zoom controls

### Dynamic Quoting
- Auto-generate from detected products
- Real-time price updates
- Multiple tax/discount options
- Product alternatives

### Role-Based Access
- **Architects**: Manage plans & quotes
- **Suppliers**: Manage product catalog
- **Clients**: View & approve quotes
- **Admin**: Full system access

## 📂 Project Structure

```
sanitary-platform/
├── backend/          # Node.js API server
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── ai-recognition/
│   │   └── quote-engine/
│   └── prisma/       # Database schema & migrations
├── frontend/         # React application
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── 3d/
│       └── services/
├── infrastructure/   # Docker configs
└── docs/            # Documentation
```

## 🔐 Security

- Password hashing with bcrypt
- JWT access & refresh tokens
- Role-based authorization
- Input validation with Zod
- CORS & rate limiting
- Helmet.js security headers

## 🎯 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token

### Plans
- `POST /api/v1/plans/upload` - Upload plan
- `GET /api/v1/plans` - List plans
- `GET /api/v1/plans/:id` - Plan details
- `GET /api/v1/plans/:id/products` - Detected products

### Products
- `GET /api/v1/products` - Browse catalog
- `POST /api/v1/products` - Add product (supplier)
- `GET /api/v1/products/:id/similar` - Similar products

### Quotes
- `POST /api/v1/quotes/from-plan` - Generate from plan
- `GET /api/v1/quotes/:id` - Quote details
- `PUT /api/v1/quotes/:quoteId/items/:itemId` - Update item

See **[API Specification](docs/api-specification.md)** for complete reference.

## 🛠️ Development

### Backend Commands
```bash
npm run dev          # Start dev server
npm run build        # Build TypeScript
npx prisma studio    # Open DB GUI
npx prisma migrate   # Run migrations
```

### Frontend Commands
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
```

## 🚢 Deployment

### Production Build
```bash
# Backend
npm run build
npm start

# Frontend
npm run build
# Serve dist/ folder with nginx/apache
```

### Docker Production
```bash
docker-compose -f infrastructure/docker-compose.yml up -d --build
```

## 📊 Database Schema

**Core Entities**:
- Users (architects, suppliers, clients)
- Plans (building plans)
- DetectedProducts (AI-detected items)
- Products (catalog)
- Quotes (quotations)
- QuoteItems (quote line items)

See Prisma schema for complete structure.

## 🎨 Frontend Features

- Responsive design with TailwindCSS
- Protected routes with authentication
- Real-time 3D rendering
- Form validation
- Toast notifications
- Loading states & error handling

## 🧩 Backend Features

- Clean architecture (controllers → services → DB)
- Prisma ORM with migrations
- File upload handling
- JWT token refresh logic
- Error handling middleware
- Request validation

## 🔮 Future Enhancements

- [ ] ML model for advanced product detection
- [ ] Real-time collaboration
- [ ] Advanced 3D features (measuring tools, annotations)
- [ ] Export quotes to PDF
- [ ] Email notifications
- [ ] Payment integration
- [ ] Mobile app
- [ ] Multi-language support

## 🤝 Contributing

Contributions welcome! Please follow:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push and create PR

## 📄 License

MIT License - See LICENSE file

## 👨‍💻 Developer Notes

- TypeScript strict mode enabled
- ESLint configured
- Comprehensive error handling
- Modular and maintainable code
- Production-ready architecture

## 📞 Support

For issues or questions, refer to documentation or open an issue.

---

**Built with ❤️ for Architects**

*Version 1.0.0 - November 2025*
