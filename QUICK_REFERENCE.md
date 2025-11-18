# 🚀 Quick Deployment Guide

## One-Command Deploy
```powershell
.\deploy.ps1
```

## Manual Deploy

### Frontend (Vercel)
```powershell
cd frontend
vercel --prod
```

### Backend (Render - Auto-deploys)
```powershell
git add .
git commit -m "Update backend"
git push origin main
```

## 🌐 Live URLs

### Production (Permanent URLs)
- **Frontend**: https://frontend-aminech990000-6355s-projects.vercel.app
- **Login**: https://frontend-aminech990000-6355s-projects.vercel.app/login
- **Backend**: https://sanitary-platform-backend.onrender.com
- **Health**: https://sanitary-platform-backend.onrender.com/health

> **✅ These URLs are permanent!** The Vercel production domain always points to your latest deployment.

### Demo Accounts
All passwords: `Password123!`

| Role | Email |
|------|-------|
| Architect | architect@example.com |
| Supplier | supplier1@example.com |
| Client | client@example.com |

## 🧪 Quick Test

```powershell
# Test backend
Invoke-RestMethod -Uri "https://sanitary-platform-backend.onrender.com/health"

# Test login
$body = @{ email = "architect@example.com"; password = "Password123!" } | ConvertTo-Json
$headers = @{ "Content-Type" = "application/json" }
Invoke-RestMethod -Uri "https://sanitary-platform-backend.onrender.com/api/v1/auth/login" -Method Post -Body $body -Headers $headers
```

## 🔧 Common Issues

### Issue: "401 Unauthorized"
**Solution**: Token expired, login again

### Issue: "Cannot read properties of null"
**Solution**: Clear localStorage and login again
```javascript
localStorage.clear()
```

### Issue: "Network Error"
**Solution**: Backend is cold-starting (first request takes ~30s on Render free tier)

### Issue: CORS Error
**Solution**: Check if your frontend URL matches the pattern: `frontend-*.vercel.app`

## 📁 Project Structure

```
sanitary/
├── frontend/          # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/    # All page components
│   │   ├── stores/   # Zustand state management
│   │   ├── services/ # API calls
│   │   └── components/
│   ├── .env          # API URL configuration
│   └── vercel.json   # Vercel config
│
├── backend/          # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── models/   # MongoDB schemas
│   │   └── middleware/
│   └── render.yaml   # Render config
│
└── deploy.ps1       # Unified deployment script
```

## 🎯 Development Workflow

1. **Make changes** to frontend or backend
2. **Test locally** (optional)
   ```powershell
   # Frontend
   cd frontend
   npm run dev
   
   # Backend
   cd backend
   npm run dev
   ```
3. **Deploy** with one command
   ```powershell
   .\deploy.ps1
   ```
4. **Verify** deployment at the URLs above

## 💡 Tips

- First request to backend may take 30s (cold start)
- Frontend deploys in ~30s
- Backend auto-deploys on Git push (~2-3 min)
- Use demo accounts for quick testing
- Check browser console for debug logs
- Vercel creates new preview URLs on each deploy

## 📝 Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://sanitary-platform-backend.onrender.com/api/v1
```

### Backend (Render Dashboard)
- MONGODB_URI
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- CORS_ORIGIN
- NODE_ENV=production

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/aminech990000-6355s-projects)
- [Render Dashboard](https://dashboard.render.com/)
- [GitHub Repo](https://github.com/maminech/sanitary)
- [MongoDB Atlas](https://cloud.mongodb.com/)

---

**Last Updated**: 2025-11-18
**Frontend Version**: Latest build
**Backend Version**: Latest commit on main branch
