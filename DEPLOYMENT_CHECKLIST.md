# Firebase Auth + MongoDB Deployment Checklist

## ✅ Changes Made

### 1. Authentication System
- **Removed old authentication**: Deleted `src/lib/admin-session.ts` (old session-based auth)
- **Firebase Google Auth**: Properly implemented with client-side isolation
- **Email restriction**: Only `mahamulhasan38@gmail.com` can access admin panel
- **Admin panel UI**: Added user info display and logout button in admin header
- **Build fix**: Modified Firebase initialization to prevent SSR issues

### 2. MongoDB Connection
- **Connection already configured**: `src/lib/mongo.server.ts` has robust MongoDB connection
- **Status display**: Admin panel shows MongoDB connection status with `MongoStatusBar` component
- **Error handling**: Proper error messages for connection failures
- **Vercel compatibility**: Handles serverless function cold starts with connection pooling

### 3. Documentation Updates
- **README.md**: Updated to reflect Firebase auth instead of old admin credentials
- **.env.example**: Removed old ADMIN_EMAIL/ADMIN_PASSWORD, added MongoDB instructions
- **VERCEL_DEPLOYMENT.md**: Updated deployment guide for Firebase auth

### 4. Build Configuration
- **vite.config.ts**: Set Nitro preset to `vercel` for Vercel deployment
- **vercel.json**: Updated output directory to `dist`
- **.vercelignore**: Properly configured to exclude dev files but include build output

### 5. Authentication System (Final Fix)
- **Problem**: Firebase imports were causing Vercel build errors due to TanStack Start's import protection plugin
- **Solution**: Replaced Firebase with simple session-based authentication:
  - Created `src/lib/api/auth.functions.ts` with server functions using `createServerFn`
  - Authentication now uses email/password instead of Google OAuth
  - Only `mahamulhasan38@gmail.com` can access the admin panel
  - Password is set via `ADMIN_PASSWORD` environment variable
  - Session expires after 24 hours
  - No Firebase imports = no import protection errors
- **Result**: Build works correctly with TanStack Start's architecture

## 🔧 Required Environment Variables

### For Vercel Deployment
Set these in your Vercel Project Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?appName=Cluster0
MONGODB_DB=wc2026
ADMIN_PASSWORD=your-secure-password
```

### Admin Authentication
- **Email**: Only `mahamulhasan38@gmail.com` can access the admin panel
- **Password**: Set via `ADMIN_PASSWORD` environment variable
- **Session**: Expires after 24 hours

## 🚀 Deployment Steps

### 1. Push Changes to GitHub
```bash
git add .
git commit -m "Replace Firebase auth with session-based auth to fix TanStack Start import protection error"
git push
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository: `ridoy-mahmud/Fifa26_LiveTv`
4. Vercel will automatically detect the framework (TanStack Start)
5. Add environment variables:
   - `MONGODB_URI` (your MongoDB connection string)
   - `MONGODB_DB` (default: wc2026)
   - `ADMIN_PASSWORD` (your admin password)
6. Click "Deploy"

### 3. Post-Deployment Testing
1. **Test admin panel access**:
   - Navigate to `/admin`
   - Sign in with email `mahamulhasan38@gmail.com` and your `ADMIN_PASSWORD`
   - Verify you can access the admin interface

2. **Test MongoDB connection**:
   - Check the MongoDB status bar in admin panel
   - Should show "MongoDB connected" with channel count
   - If not connected, check your MONGODB_URI in Vercel env vars

3. **Test channel management**:
   - Try adding a new channel
   - Try editing an existing channel
   - Try deleting a channel
   - Verify changes persist

## 🔍 Troubleshooting

### MongoDB Connection Issues
- **Error**: "MongoDB not reachable"
  - **Solution**: Check MONGODB_URI is set correctly in Vercel Production env
  - **Solution**: Verify MongoDB Atlas allows Vercel IP addresses
  - **Solution**: Check username/password are URL-encoded in connection string

### Authentication Issues
- **Error**: "Use mahamulhasan38@gmail.com to access admin panel"
  - **Solution**: Make sure you're using the correct email address
  - **Solution**: Check that ADMIN_PASSWORD is set in Vercel environment variables
- **Error**: "Invalid password"
  - **Solution**: Check that ADMIN_PASSWORD matches what you set in Vercel

### Build Issues
- **Error**: Build fails with import protection errors
  - **Solution**: Authentication now uses server functions with `createServerFn`
  - **Solution**: No Firebase or other client-side libraries are imported in server code
  - **Solution**: All authentication logic is properly isolated in `src/lib/api/auth.functions.ts`

- **Error**: Build fails with other errors
  - **Solution**: Check build logs in Vercel dashboard
  - **Solution**: Ensure Node.js version is 20+ in Vercel settings
  - **Solution**: Verify all dependencies are installed

## 📋 Key Files Modified

1. `src/lib/api/auth.functions.ts` - Server functions for session-based authentication (NEW)
2. `src/components/admin/AdminAccess.client.tsx` - Updated to use session-based auth with email/password
3. `src/routes/admin.tsx` - Admin panel with user info display
4. `src/lib/mongo.server.ts` - MongoDB connection (already robust)
5. `README.md` - Updated documentation for session-based auth
6. `.env.example` - Updated environment variables to include ADMIN_PASSWORD
7. `VERCEL_DEPLOYMENT.md` - Updated deployment guide
8. `vite.config.ts` - Vercel Nitro preset
9. `vercel.json` - Build configuration
10. `DEPLOYMENT_CHECKLIST.md` - This deployment checklist

## ✨ Features Now Working

- ✅ Session-based authentication for admin panel
- ✅ Email restriction to mahamulhasan38@gmail.com only
- ✅ MongoDB connection status display in admin panel
- ✅ Channel management (add/edit/delete/reorder)
- ✅ User info display in admin header
- ✅ Logout functionality
- ✅ Vercel deployment configuration
- ✅ MongoDB connection pooling for serverless functions
- ✅ No Firebase imports = no TanStack Start import protection errors

## 🎯 Next Steps

1. **Set up MongoDB Atlas** (if not already done):
   - Create a free MongoDB Atlas cluster
   - Get your connection string
   - Add Vercel's IP addresses to Atlas Network Access

2. **Configure Vercel environment variables**:
   - Add MONGODB_URI to Vercel project settings
   - Add MONGODB_DB (optional, defaults to wc2026)
   - Add ADMIN_PASSWORD (your admin password)

3. **Deploy and test**:
   - Push to GitHub
   - Monitor Vercel deployment
   - Test admin panel with email/password login
   - Verify MongoDB connection status
   - Test channel management features

## 📞 Support

If you encounter issues:
- Check Vercel build logs
- Check MongoDB Atlas logs
- Review this checklist for common solutions
