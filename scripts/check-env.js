#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Checks if all required environment variables are properly set
 * Usage: node scripts/check-env.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const requiredEnvVars = {
  client: [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET',
  ],
  server: [
    'FIREBASE_SERVICE_ACCOUNT_KEY',
  ],
};

let hasErrors = false;

console.log('🔍 Checking environment variables...\n');

// Check client-side variables
console.log('📱 Client-side variables (NEXT_PUBLIC_*):');
requiredEnvVars.client.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.log(`  ❌ ${varName} - Missing`);
    hasErrors = true;
  } else if (value.includes('your_') || value.includes('xxxxx')) {
    console.log(`  ⚠️  ${varName} - Not configured (placeholder value)`);
    hasErrors = true;
  } else {
    console.log(`  ✅ ${varName} - Set`);
  }
});

console.log('\n🔒 Server-side variables (SECRET):');
requiredEnvVars.server.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.log(`  ❌ ${varName} - Missing`);
    hasErrors = true;
  } else {
    // Validate it's valid JSON
    try {
      const parsed = JSON.parse(value);
      if (parsed.type === 'service_account' && parsed.project_id && parsed.private_key) {
        console.log(`  ✅ ${varName} - Set and valid JSON`);
      } else {
        console.log(`  ⚠️  ${varName} - Invalid service account JSON format`);
        hasErrors = true;
      }
    } catch (e) {
      console.log(`  ❌ ${varName} - Invalid JSON format`);
      hasErrors = true;
    }
  }
});

console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.log('❌ Environment validation FAILED');
  console.log('\n📝 Next steps:');
  console.log('  1. Copy .env.example to .env.local if you haven\'t');
  console.log('  2. Fill in your Firebase credentials in .env.local');
  console.log('  3. See FIREBASE_SETUP.md for detailed instructions');
  console.log('  4. For Vercel deployment, see VERCEL_DEPLOYMENT.md\n');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are properly configured!');
  console.log('\n🚀 You can now:');
  console.log('  - Run "npm run dev" for local development');
  console.log('  - Deploy to Vercel (see VERCEL_DEPLOYMENT.md)\n');
  process.exit(0);
}
