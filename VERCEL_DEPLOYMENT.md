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
The project includes a `vercel.json` file with optimized settings:
- **Region**: US East (IAD) for optimal performance
- **Function timeout**: 30 seconds for API routes
- **Caching headers**: Proper cache control for static assets
- **Security headers**: XSS protection, content type options
- **Rewrites**: Proper routing for server-side rendering

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

If the build fails:
1. Check the Build Logs in Vercel dashboard
2. Ensure all dependencies are in package.json
3. Verify Node.js version compatibility (requires 18+)

### Runtime Errors

If you encounter runtime errors:
1. Check the Function Logs in Vercel
2. Verify environment variables are set correctly
3. Ensure the Nitro preset is configured for Vercel

### Streaming Issues

If video streaming doesn't work:
1. Check browser console for errors
2. Verify HLS.js compatibility
3. Check if stream URLs are accessible
4. Test with different channels

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