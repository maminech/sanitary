# 🚀 Deployment Guide - Sanitary Platform

## ✅ DEPLOYED - Production URLs

### Frontend (Production)
**🌐 URL:** https://frontend-7kehpe8z0-aminech990000-6355s-projects.vercel.app

### Backend API (Production)
**🔗 API URL:** https://backend-m0m5d94pv-aminech990000-6355s-projects.vercel.app/api/v1

### Demo Credentials
- **Architect:** architect@example.com / Password123!
- **Supplier:** supplier1@example.com / Password123!
- **Client:** client@example.com / Password123!

---

## Prerequisites
- Vercel account (connected to GitHub)
- MongoDB Atlas account (for production database)
- Environment variables ready

## Quick Deploy Steps

### 1. Deploy Backend to Vercel

```bash
cd backend
vercel
```

**Environment Variables to set in Vercel:**
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_ACCESS_SECRET` - Random secure string
- `JWT_REFRESH_SECRET` - Random secure string
- `CORS_ORIGIN` - Your frontend URL (e.g., https://sanitary-platform.vercel.app)
- `NODE_ENV` - production
- `PORT` - 5000

### 2. Deploy Frontend to Vercel

```bash
cd ../frontend
vercel
```

**Environment Variables to set in Vercel:**
- `VITE_API_URL` - Your backend API URL (e.g., https://sanitary-backend.vercel.app/api/v1)

### 3. Update Frontend API URL

After backend is deployed, update `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-url.vercel.app/api/v1
```

## Vercel CLI Deployment

### Install Vercel CLI
```bash
npm i -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Deploy Backend
```bash
cd backend
vercel --prod
```

### Deploy Frontend
```bash
cd ../frontend
vercel --prod
```

## Manual Deployment via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Add New Project"**
3. **Import your Git repository**
4. **Configure Backend Project:**
   - Framework Preset: Other
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Add all environment variables

5. **Configure Frontend Project:**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Add environment variables

## Post-Deployment

### 1. Seed the Database
After backend deployment, run seed script:
```bash
# SSH into backend or run locally pointing to production DB
npm run seed
```

### 2. Test Demo Accounts
- Architect: architect@example.com / Password123!
- Supplier: supplier1@example.com / Password123!
- Client: client@example.com / Password123!

### 3. Update CORS
Make sure backend CORS_ORIGIN matches your frontend domain.

## Troubleshooting

### Backend Issues
- Check Vercel logs: `vercel logs <deployment-url>`
- Verify MongoDB connection string
- Ensure all environment variables are set

### Frontend Issues
- Verify VITE_API_URL points to correct backend
- Check browser console for CORS errors
- Clear browser cache and localStorage

### Database Issues
- Whitelist Vercel IP addresses in MongoDB Atlas
- Use MongoDB Atlas (not local MongoDB)
- Check connection string format

## Production Checklist

✅ MongoDB Atlas cluster created
✅ Database whitelisted for Vercel IPs (0.0.0.0/0 for simplicity)
✅ All environment variables set in Vercel
✅ Backend deployed and responding
✅ Frontend deployed and loads
✅ CORS configured correctly
✅ Demo users seeded
✅ Test login functionality
✅ Test all major features

## Monitoring

- **Vercel Analytics**: Enable in project settings
- **MongoDB Atlas Monitoring**: Check database performance
- **Error Tracking**: Check Vercel logs regularly

## Domain Setup (Optional)

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update CORS_ORIGIN environment variable

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
