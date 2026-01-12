# CampusSOS Firebase Setup Guide

## Overview
This guide will help you set up Firebase for the CampusSOS project.

## Prerequisites
- A Google account
- Node.js and npm installed
- Firebase CLI installed (`npm install -g firebase-tools`)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `campussos` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** provider
4. (Optional) Enable other providers like Google Sign-In

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Select **Start in test mode** (we'll add security rules later)
4. Choose a Cloud Firestore location (closest to your users)
5. Click "Enable"

## Step 4: Set Up Storage

1. In Firebase Console, go to **Storage**
2. Click "Get started"
3. Start in **Test mode**
4. Click "Done"

## Step 5: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Register app with nickname: `CampusSOS Web`
5. Copy the `firebaseConfig` object

## Step 6: Configure Environment Variables

1. Open `.env.local` in your project
2. Fill in the values from the `firebaseConfig`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 7: Set Up Firebase Admin SDK (for Server-Side)

### Option A: Service Account Key (Recommended for Local Development)

1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click "Generate new private key"
3. Save the JSON file securely
4. Copy the entire JSON content
5. In `.env.local`, add (as a single-line string):

```env
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'
```

### Option B: Use Application Default Credentials (for Cloud Deployment)

For production on Vercel or other cloud platforms, set individual fields:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
```

## Step 8: Deploy Security Rules

### Deploy Firestore Rules

```bash
firebase login
firebase init firestore
# Select existing project
# Use 'firestore.rules' as rules file
# Skip indexes file or use 'firestore.indexes.json'

firebase deploy --only firestore:rules
```

### Deploy Storage Rules

```bash
firebase init storage
# Select existing project
# Use 'storage.rules' as rules file

firebase deploy --only storage
```

## Step 9: Initialize Firestore Collections (Optional)

You can create initial collections manually or wait for the app to create them:

### Create Users Collection
1. Go to Firestore Database
2. Click "Start collection"
3. Collection ID: `users`
4. Add a test document (or let the app create it)

### Create Incidents Collection
1. Collection ID: `incidents`
2. Will be populated when users submit reports

### Create Notifications Collection
1. Collection ID: `notifications`
2. Will be populated by the system

## Step 10: Test the Setup

1. Start the development server:
```bash
npm run dev
```

2. The Firebase SDK should initialize without errors
3. Check browser console for any Firebase connection issues

## Security Checklist

- ✅ Environment variables are in `.env.local` (not committed to git)
- ✅ `.env.local` is listed in `.gitignore`
- ✅ Service account key is stored securely
- ✅ Firestore security rules are deployed
- ✅ Storage security rules are deployed
- ✅ Authentication is enabled

## Firestore Data Structure

```
users/
  {userId}/
    - uid: string
    - email: string
    - displayName: string
    - role: 'student' | 'staff' | 'admin' | 'responder'
    - status: 'active' | 'suspended' | 'inactive'
    - createdAt: timestamp
    - updatedAt: timestamp

incidents/
  {incidentId}/
    - reportedBy: string (userId)
    - category: string
    - title: string
    - description: string
    - location: object
    - severity: 'low' | 'medium' | 'high' | 'critical'
    - status: 'submitted' | 'verified' | 'assigned' | 'resolved' | 'closed'
    - imageUrls: string[]
    - createdAt: timestamp
    - updatedAt: timestamp
    
    updates/
      {updateId}/
        - userId: string
        - type: string
        - message: string
        - createdAt: timestamp

notifications/
  {notificationId}/
    - userId: string
    - type: string
    - title: string
    - message: string
    - incidentId: string (optional)
    - read: boolean
    - createdAt: timestamp
```

## Common Issues

### Issue: Firebase not initializing
- Check that all environment variables are set correctly
- Ensure `.env.local` is in the project root
- Restart the development server after changing env vars

### Issue: Permission denied errors
- Deploy Firestore and Storage security rules
- Check that user is authenticated
- Verify user role in Firestore

### Issue: Images not uploading
- Check Storage rules are deployed
- Verify file size is under 5MB
- Ensure file is an image type

## Next Steps

1. Implement authentication UI components
2. Create incident reporting form
3. Build admin dashboard
4. Set up Cloud Functions for notifications
5. Add real-time listeners

## Production Deployment

For Vercel deployment:

1. Add all environment variables to Vercel project settings
2. Use service account credentials (not the JSON file)
3. Enable billing on Firebase for production usage
4. Update security rules to production mode
5. Set up custom domain and SSL

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Firebase Integration](https://nextjs.org/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
