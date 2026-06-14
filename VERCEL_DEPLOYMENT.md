# Vercel Deployment Guide

This guide covers deploying the WC 2026 Live application to Vercel.

## Prerequisites

- Node.js 18+ installed
- Vercel account ([signup](https://vercel.com/signup))
- GitHub repository with the project code

## Environment Variables

Configure these environment variables in your Vercel project settings:

### Required Variables
- `ADMIN_EMAIL` - Admin email for authentication
- `ADMIN_PASSWORD` - Secure password for admin access

### Optional Variables
- `NODE_ENV` - Set to `production` (automatically set by Vercel)

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will automatically detect the project configuration

### 2. Configure Project Settings

#### Build & Development Settings
- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `.vercel/output`
- **Install Command**: `npm install`

#### Environment Variables
Add the required environment variables in:
- Project Settings → Environment Variables
- Or add them during the initial setup

### 3. Deploy

Click "Deploy" and Vercel will:
1. Install dependencies
2. Build the application
3. Deploy to their global edge network

## Configuration Files

### vercel.json
The project includes a simplified `vercel.json` file with essential settings:
- **Build Command**: `npm run build`
- **Output Directory**: `.vercel/output`
- **Framework**: null (let Nitro handle routing)

Nitro's Vercel preset automatically handles routing, caching, and serverless function configuration.

### .nvmrc
Specifies Node.js version 20 for consistent builds across environments.

### package.json
Includes `engines` field specifying Node.js >= 20.0.0 requirement.

### vite.config.ts
The Vite configuration is set up for Vercel deployment:
```typescript
nitro: {
  preset: "vercel",
}
```

This ensures the build output is compatible with Vercel's serverless functions.

## Post-Deployment Checklist

- [ ] Verify the site loads correctly
- [ ] Test live TV streaming functionality
- [ ] Check admin panel login
- [ ] Test mobile responsiveness
- [ ] Verify all channel groups load
- [ ] Test channel switching
- [ ] Check player controls on mobile devices

## Troubleshooting

### Build Failures

#### Common Vercel Build Issues

**Issue: Build fails with "Module not found" errors**
- Ensure all dependencies are in package.json
- Check that node_modules are properly installed
- Verify the build command works locally: `npm run build`

**Issue: Node.js version errors**
- The project requires Node.js >= 20.0.0
- Check `.nvmrc` file specifies Node 20
- In Vercel project settings, set Node.js Version to 20.x

**Issue: Nitro/Vercel preset errors**
- Ensure `nitro: { preset: "vercel" }` is in vite.config.ts
- Remove any conflicting rewrites in vercel.json
- Let Nitro handle routing automatically

**Issue: Memory errors during build**
- Vercel free tier has 8GB memory limit
- Large node_modules can cause issues
- Try adding `.vercelignore` to exclude unnecessary files

#### Debug Steps

If the build fails:
1. Check the Build Logs in Vercel dashboard
2. Compare with local build: `npm run build`
3. Verify Node.js version: `node --version` (should be 20+)
4. Check for any dependency conflicts
5. Ensure environment variables don't have syntax errors

### Runtime Errors

#### Common Runtime Issues

**Issue: 404 errors on routes**
- Nitro handles routing automatically
- Check that `.vercel/output/config.json` was generated
- Verify the build completed successfully

**Issue: Serverless function timeouts**
- Default timeout is 10 seconds on free tier
- Live streaming should work within timeout limits
- Check Vercel function logs for timeout errors

**Issue: Environment variables not available**
- Ensure variables are set in Vercel project settings
- Check variable names match exactly (case-sensitive)
- Some variables may need to be rebuilt to take effect

#### Debug Steps

If you encounter runtime errors:
1. Check the Function Logs in Vercel
2. Verify environment variables are set correctly
3. Ensure the Nitro preset is configured for Vercel
4. Test the build locally: `npm run build && npm run preview`
5. Check browser console for client-side errors

### Streaming Issues

If video streaming doesn't work:
1. Check browser console for HLS.js errors
2. Verify HLS.js compatibility with the browser
3. Check if stream URLs are accessible
4. Test with different channels
5. Ensure CORS headers allow video streaming
6. Check Vercel function logs for proxy errors

## Performance Optimization

The Vercel configuration includes:
- **Static asset caching**: Long-term caching for images and CSS
- **Edge deployment**: Automatic deployment to edge locations
- **Serverless functions**: Optimized for fast cold starts
- **Build optimization**: TanStack Start with Nitro for optimal SSR

## Updating Deployment

After making changes:
1. Push to GitHub
2. Vercel automatically triggers a new deployment
3. Monitor deployment status in dashboard
4. Test the production URL

## Custom Domains

To use a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed
4. Enable automatic HTTPS (free SSL certificates)

## Monitoring

Vercel provides built-in monitoring:
- **Analytics**: Page views, visitors, geographic distribution
- **Logs**: Real-time function and build logs
- **Performance**: Core Web Vitals and performance metrics
- **Error tracking**: Runtime error monitoring

## Cost

- **Hobby Plan**: Free for personal projects
  - 100GB bandwidth per month
  - 6,000 minutes of execution time
  - Unlimited deployments
- **Pro Plan**: $20/month for production workloads
  - 1TB bandwidth
  - Additional execution time
  - Priority support

## Support

For issues specific to:
- **Vercel**: Check [Vercel Docs](https://vercel.com/docs)
- **This project**: Open an issue on GitHub
- **TanStack Start**: [TanStack Start Docs](https://tanstack.com/start)