# Environment Variables Quick Reference

## 📋 Copy-Paste Guide for Vercel

When setting up environment variables in Vercel Dashboard, copy each variable **exactly as shown** from your `.env.local` file.

---

## ✅ How to Add Variables in Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Go to your project in Vercel
2. Click **Settings** → **Environment Variables**
3. For each variable below:
   - **Name**: Copy the variable name (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - **Value**: Copy the value from your `.env.local`
   - **Environment**: Select **Production**, **Preview**, and **Development**
   - Click **Save**

### Method 2: Vercel CLI

```bash
# From your project directory
vercel env add VARIABLE_NAME
# Paste the value when prompted
# Select environments: Production, Preview, Development
```

---

## 🔑 Variables to Add

### Client-Side Variables (6 total)

These are safe to expose (NEXT_PUBLIC_* prefix):

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### Server-Side Variables (1 total)

⚠️ **KEEP THIS SECRET** - Never expose in browser:

```
FIREBASE_SERVICE_ACCOUNT_KEY
```

**CRITICAL:** This must be a single-line JSON string with no line breaks!

---

## ⚡ Quick Setup Commands

### Step 1: Verify local environment
```bash
npm run check-env
```

### Step 2: View your .env.local
```bash
cat .env.local
```

### Step 3: Add to Vercel (one-by-one)
```bash
# Client variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID

# Server variable (paste entire JSON as one line)
vercel env add FIREBASE_SERVICE_ACCOUNT_KEY
```

### Step 4: Pull environment variables from Vercel (optional)
```bash
vercel env pull .env.local
```

---

## 📝 Your Current Configuration

From your `.env.local`:

### Client Variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB10W2-e1SPnodI7csdu_gkUK0Vfr0Srk4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=campussos-a1bb1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=campussos-a1bb1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=campussos-a1bb1.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=979318544088
NEXT_PUBLIC_FIREBASE_APP_ID=1:979318544088:web:ecb383fa9acae579e1a9ad
```

### Server Variable:
```
FIREBASE_SERVICE_ACCOUNT_KEY=<your-single-line-json>
```
⚠️ **Copy the entire JSON string from your `.env.local`** - it's very long!

---

## 🔍 Validation Checklist

After adding all variables to Vercel:

- [ ] Total of 7 environment variables added
- [ ] All NEXT_PUBLIC_* variables are correct
- [ ] FIREBASE_SERVICE_ACCOUNT_KEY is valid JSON (single line)
- [ ] All environments selected (Production, Preview, Development)
- [ ] Triggered a new deployment after adding variables
- [ ] Checked deployment logs for errors

---

## 🚨 Common Mistakes

### ❌ WRONG - Multi-line JSON
```
FIREBASE_SERVICE_ACCOUNT_KEY={
  "type": "service_account",
  "project_id": "...",
  ...
}
```

### ✅ CORRECT - Single-line JSON
```
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",...}
```

### ❌ WRONG - Missing quotes in private_key
```
"private_key": -----BEGIN PRIVATE KEY-----...
```

### ✅ CORRECT - Properly escaped
```
"private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 🔄 Update Process

When you need to update environment variables:

1. **Update locally**
   ```bash
   # Edit .env.local with new values
   npm run check-env
   ```

2. **Update in Vercel**
   - Go to Settings → Environment Variables
   - Click the variable to edit
   - Update the value
   - Save

3. **Trigger new deployment**
   ```bash
   # Option 1: Redeploy current build
   vercel redeploy --prod

   # Option 2: Push a new commit
   git commit --allow-empty -m "Trigger rebuild"
   git push
   ```

---

## 📚 Related Documentation

- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Get Firebase credentials
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Complete deployment guide
- [.env.example](.env.example) - Template file
- [README.md](README.md) - Project overview

---

## 🆘 Troubleshooting

### Variable not taking effect?
- Variables only apply to **new builds**
- Redeploy after changing variables
- Check you selected the right environment

### Build failing with Firebase error?
- Run `npm run check-env` locally first
- Verify FIREBASE_SERVICE_ACCOUNT_KEY is valid JSON
- Check Firebase Console for project status

### Still having issues?
- View Vercel deployment logs
- Check Firebase Console logs
- Verify all 7 variables are present
- Try removing and re-adding the problematic variable

---

**Last updated:** Check your `.env.local` for current values
