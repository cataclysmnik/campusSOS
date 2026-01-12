# CampusSOS Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Firebase project fully configured (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md))
- GitHub repository (recommended for automatic deployments)

## Quick Start

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import project to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your CampusSOS repository
   - Click "Import"

3. **Configure Environment Variables**
   - In the import wizard, expand "Environment Variables"
   - Add all variables from your `.env.local` (see below)
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

## Environment Variables Configuration

In Vercel Dashboard, go to **Settings** → **Environment Variables** and add these:

### Client-side Firebase Config (exposed to browser)

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB10W2-e1SPnodI7csdu_gkUK0Vfr0Srk4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=campussos-a1bb1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=campussos-a1bb1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=campussos-a1bb1.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=979318544088
NEXT_PUBLIC_FIREBASE_APP_ID=1:979318544088:web:ecb383fa9acae579e1a9ad
```

### Server-side Firebase Admin Config (SECRET - do not expose)

**IMPORTANT:** Copy the exact single-line JSON string from your `.env.local`:

```
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"campussos-a1bb1",...}
```

**✅ Correct format:** Single line, no line breaks inside the JSON

**❌ Wrong format:** Multi-line JSON or with literal `\n` in wrong places

### How to add in Vercel Dashboard:

1. Name: `FIREBASE_SERVICE_ACCOUNT_KEY`
2. Value: Paste the entire single-line JSON from your `.env.local`
3. Environment: Select **Production**, **Preview**, and **Development**
4. Click "Save"

### Alternative: Add via CLI

```bash
# Navigate to your project
cd /home/cataclysmnik/Repos/campussos

# Add variables (replace with your actual values)
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
vercel env add FIREBASE_SERVICE_ACCOUNT_KEY production
```

## Deployment Settings

### Recommended Vercel Configuration

Create `vercel.json` in your project root:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Build Settings in Vercel Dashboard

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)
- **Development Command:** `npm run dev`

## Post-Deployment Steps

### 1. Update Firebase Authentication Settings

Add your Vercel domain to Firebase authorized domains:

1. Go to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your Vercel domains:
   - `your-app.vercel.app`
   - `your-custom-domain.com` (if using custom domain)

### 2. Test Deployment

Visit your deployed site and test:
- ✅ User registration
- ✅ User login
- ✅ Incident submission
- ✅ Image upload
- ✅ Real-time updates

### 3. Check Logs

If issues occur:
- Go to Vercel Dashboard → **Deployments** → Click your deployment → **Functions** tab
- Check for errors in serverless function logs

### 4. Set Up Custom Domain (Optional)

1. Go to Vercel Dashboard → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update Firebase authorized domains

## Environment-Specific Configurations

### Development Environment
- Uses `.env.local`
- Firebase emulator support (optional)
- Hot reload enabled

### Preview Environment (Pull Requests)
- Uses Vercel environment variables
- Separate Firebase project recommended
- Automatic deployments on PR

### Production Environment
- Uses Vercel environment variables
- Production Firebase project
- Automatic deployments on `main` branch push

## Security Best Practices

### 1. Keep Secrets Safe
- ✅ Never commit `.env.local` to git
- ✅ Use Vercel environment variables for secrets
- ✅ Rotate Firebase service account keys periodically
- ✅ Enable 2FA on Vercel account

### 2. Firebase Security Rules
Ensure rules are deployed:
```bash
firebase deploy --only firestore:rules,storage
```

### 3. Vercel Security Headers

Add to `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

## Troubleshooting

### Issue: "Firebase Admin initialization error"

**Cause:** `FIREBASE_SERVICE_ACCOUNT_KEY` is not properly formatted

**Solution:**
1. Make sure it's a single-line JSON string
2. No line breaks inside the JSON
3. Escape special characters properly
4. Redeploy after updating env vars

### Issue: "Authentication not working"

**Cause:** Domain not authorized in Firebase

**Solution:**
1. Add Vercel domain to Firebase Console → Authentication → Authorized domains
2. Wait 5-10 minutes for propagation
3. Clear browser cache and try again

### Issue: "Images not uploading"

**Cause:** Storage rules not deployed or CORS issue

**Solution:**
1. Deploy storage rules: `firebase deploy --only storage`
2. Check Firebase Console → Storage → Rules
3. Verify bucket name in env variables

### Issue: "Build fails on Vercel"

**Cause:** Missing dependencies or environment variables

**Solution:**
1. Check Vercel build logs
2. Ensure all env variables are added
3. Run `npm run build` locally to test
4. Check `package.json` dependencies

### Issue: "Environment variables not updating"

**Cause:** Vercel caches deployments

**Solution:**
1. Update env variables in Vercel Dashboard
2. Trigger a new deployment (redeploy or push commit)
3. Environment variables only apply to new builds

## Monitoring & Analytics

### Vercel Analytics
Enable in Vercel Dashboard → **Analytics**

### Firebase Monitoring
- Go to Firebase Console → **Performance**
- Enable Performance Monitoring
- Add to `lib/firebase/config.ts`:
  ```typescript
  import { getPerformance } from 'firebase/performance';
  const perf = getPerformance(app);
  ```

### Error Tracking
Consider adding Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## Continuous Deployment

Vercel automatically deploys:
- **Production:** On push to `main` branch
- **Preview:** On pull requests
- **Manual:** Via Vercel Dashboard or CLI

### Branch Protection
Recommended GitHub settings:
- Require PR reviews before merging
- Require status checks to pass
- Enable automatic security fixes

## Performance Optimization

1. **Enable Edge Functions** (if needed)
   - Move API routes to edge runtime
   - Faster response times globally

2. **Image Optimization**
   - Use Next.js `<Image>` component
   - Automatic optimization by Vercel

3. **Caching Strategy**
   - Configure cache headers
   - Use Vercel's CDN effectively

## Cost Considerations

### Vercel Free Tier Limits
- 100GB bandwidth/month
- 6,000 build minutes/month
- Serverless function execution: 100GB-hours
- Usually sufficient for campus-scale deployment

### Firebase Free Tier (Spark Plan)
- 10GB storage
- 1GB/day downloads
- 50K reads/day
- 20K writes/day

**Recommendation:** Start with free tiers, upgrade to Blaze plan when needed

## Scaling for Production

When your campus grows:

1. **Upgrade Firebase to Blaze Plan**
   - Pay-as-you-go pricing
   - No daily limits

2. **Upgrade Vercel Plan** (if needed)
   - Pro plan: $20/month
   - More bandwidth and build minutes

3. **Enable Caching**
   - Redis for session management
   - CDN for static assets

4. **Database Optimization**
   - Add Firestore indexes
   - Use batch operations
   - Implement pagination

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Hosting + Vercel](https://firebase.google.com/docs/hosting)
- [CampusSOS Firebase Setup](FIREBASE_SETUP.md)

## Quick Reference Commands

```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Open project in browser
vercel open

# Remove deployment
vercel rm <deployment-url>

# Pull environment variables locally
vercel env pull .env.local
```

## Checklist Before Going Live

- [ ] All environment variables added to Vercel
- [ ] Firebase security rules deployed
- [ ] Vercel domain added to Firebase authorized domains
- [ ] Test user registration and login
- [ ] Test incident submission and image upload
- [ ] Test real-time updates
- [ ] Test admin dashboard functionality
- [ ] Set up custom domain (if applicable)
- [ ] Enable monitoring and analytics
- [ ] Document admin procedures
- [ ] Train initial admin users
- [ ] Prepare support documentation

---

**Your CampusSOS is now ready for deployment! 🚀**
