# 🚀 Quick Start Guide - MongoDB Version

## ✅ Setup Complete!

All dependencies are installed. Now you just need to set up MongoDB!

---

## 📋 Option 1: MongoDB Atlas (Recommended - 5 minutes)

**FREE cloud database - no installation needed!**

### Steps:

1. **Create account**: https://www.mongodb.com/cloud/atlas/register

2. **Create FREE cluster** (M0 tier)

3. **Create database user** and save credentials

4. **Whitelist IP**: Add your IP or `0.0.0.0/0` for testing

5. **Get connection string** (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Update** `backend\.env`:
   ```env
   MONGODB_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/sanitary_platform?retryWrites=true&w=majority"
   ```
   Replace `username` and `password` with your credentials!

7. **Seed database**:
   ```powershell
   cd backend
   npm run seed
   ```

8. **Start backend**:
   ```powershell
   npm run dev
   ```

9. **Start frontend** (new terminal):
   ```powershell
   cd frontend
   npm run dev
   ```

**📖 Detailed guide**: See [MONGODB_SETUP.md](./MONGODB_SETUP.md)

---

## 📋 Option 2: Local MongoDB

If you prefer local installation:

1. **Download**: https://www.mongodb.com/try/download/community

2. **Install** with default settings

3. **Update** `backend\.env`:
   ```env
   MONGODB_URI="mongodb://localhost:27017/sanitary_platform"
   ```

4. **Follow steps 7-9 above**

---

## 🧪 Test the Application

Once both servers are running:

1. **Frontend**: http://localhost:3000
2. **Backend**: http://localhost:5000
3. **Health Check**: http://localhost:5000/health

### Login Credentials:
- **Architect**: `architect@example.com` / `Password123!`
- **Supplier**: `supplier1@example.com` / `Password123!`
- **Client**: `client@example.com` / `Password123!`

---

## 📁 Project Structure

```
sanitary/
├── backend/              # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── models/      # Mongoose models
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/      # API endpoints
│   │   └── config/      # Configuration
│   └── package.json
│
├── frontend/            # React + TypeScript + Three.js
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   ├── 3d/         # Three.js components
│   │   └── services/   # API calls
│   └── package.json
│
└── docs/               # Documentation
```

---

## 🆘 Troubleshooting

### "MongooseServerSelectionError"
- Check your MongoDB URI in `backend/.env`
- Make sure your IP is whitelisted in Atlas
- Verify your username/password are correct

### "Authentication failed"
- Check credentials in MongoDB Atlas
- Make sure password is correct in connection string
- Password must be URL-encoded if it contains special characters

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check `VITE_API_URL` in `frontend/.env.local`

### Port already in use
- Backend port 5000: Change `PORT` in `backend/.env`
- Frontend port 3000: Vite will prompt for different port

---

## 🎯 What's Next?

After setup:
1. ✅ Upload a building plan
2. ✅ Browse the product catalog
3. ✅ Generate quotes from detected products
4. ✅ View plans in 3D viewer

---

## 📚 Documentation

- **Setup**: [MONGODB_SETUP.md](./MONGODB_SETUP.md)
- **Architecture**: [docs/architecture.md](./docs/architecture.md)
- **API Docs**: [docs/api-specification.md](./docs/api-specification.md)
- **Main README**: [README.md](./README.md)

---

**Need help?** MongoDB Atlas setup is super fast - give it a try! 🚀
