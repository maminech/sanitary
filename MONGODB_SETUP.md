# 🚀 MongoDB Atlas Setup (5 minutes)

## Why MongoDB Atlas?
- ✅ **Free Forever** - M0 Free Tier (512MB storage)
- ✅ **No Installation** - Cloud-hosted, ready in minutes
- ✅ **No PostgreSQL/Docker needed**

## Step-by-Step Setup

### 1. Create MongoDB Atlas Account
1. Visit: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with email or Google account (it's free!)

### 2. Create a Free Cluster
1. Choose **"Create a deployment"**
2. Select **M0 FREE** tier
3. Choose a cloud provider (AWS, Google Cloud, or Azure)
4. Select a region closest to you
5. Click **"Create Deployment"**
6. Wait 1-3 minutes for cluster creation

### 3. Create Database User
1. You'll see a **"Security Quickstart"** screen
2. Choose **"Username and Password"**
3. Create username (e.g., `admin`) and password (e.g., `MyPassword123`)
4. **IMPORTANT**: Save these credentials!
5. Click **"Create Database User"**

### 4. Whitelist IP Address
1. On the same screen, under **"Where would you like to connect from?"**
2. Choose **"My Local Environment"**
3. Click **"Add My Current IP Address"**
4. **For testing only**: You can also use `0.0.0.0/0` to allow from anywhere
5. Click **"Add Entry"**
6. Click **"Finish and Close"**

### 5. Get Connection String
1. Click **"Database"** in the left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select **Driver: Node.js** and **Version: 5.5 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Update Backend .env File
1. Open `e:\sanitary\backend\.env`
2. Replace the `MONGODB_URI` line with your connection string
3. **IMPORTANT**: Replace `<password>` with your actual password
4. Add the database name: `sanitary_platform`

**Example:**
```env
MONGODB_URI="mongodb+srv://admin:MyPassword123@cluster0.abc123.mongodb.net/sanitary_platform?retryWrites=true&w=majority"
```

### 7. Test Connection
```powershell
cd e:\sanitary\backend
npm run seed
```

You should see:
```
✅ MongoDB connected successfully
✅ Created 4 users
✅ Created 9 products
✅ Database seeded successfully!
```

### 8. Start Backend Server
```powershell
npm run dev
```

## 🎉 Done!

Your backend is now running with MongoDB Atlas!

Test it: http://localhost:5000/health

---

## Troubleshooting

### Connection Error: "Authentication failed"
- Check username and password in connection string
- Make sure you replaced `<password>` with actual password
- Password must be URL-encoded if it contains special characters

### Connection Error: "IP not whitelisted"
- Go to Atlas dashboard → Network Access
- Add your current IP or use `0.0.0.0/0` for testing

### Can't find cluster
- Wait a few minutes if just created
- Check the "Database" section in Atlas dashboard

---

## Alternative: Local MongoDB (If you prefer)

If you want to install MongoDB locally instead:

1. **Download**: https://www.mongodb.com/try/download/community
2. **Install** with default settings
3. **Update .env**:
   ```env
   MONGODB_URI="mongodb://localhost:27017/sanitary_platform"
   ```
4. **Run**: The MongoDB service should start automatically

---

**Need help?** The setup is really quick with Atlas - give it a try!
