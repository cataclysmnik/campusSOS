# CampusSOS 🚨

A Next.js 16 web platform for students and staff to report campus emergencies and incidents in real-time.

## Features

- 🔐 **User Authentication** - Role-based access (Student / Staff / Admin / Responder)
- 📝 **Incident Reporting** - Submit emergencies with location, images, and descriptions
- ⚡ **Real-time Updates** - Live status tracking and notifications
- 👥 **Admin Dashboard** - Manage, verify, assign, and resolve incidents
- 🔔 **Notifications** - Stay informed about incident status changes
- 🔍 **Search & Filter** - Find incidents by category, status, and severity
- 📊 **Analytics** - Track incident trends and response times

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage, Cloud Functions)
- **Deployment**: Vercel
- **Real-time**: Firestore listeners

## Quick Start

### Prerequisites

- Node.js 20+ and npm
- Firebase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd campussos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase credentials
   ```

4. **Configure Firebase**
   - Follow the detailed guide: [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Add credentials to `.env.local`

5. **Validate environment setup**
   ```bash
   npm run check-env
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
campussos/
├── app/                      # Next.js 16 App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── lib/                      # Core libraries
│   └── firebase/            # Firebase configuration
│       ├── config.ts        # Client-side initialization
│       ├── admin.ts         # Server-side admin SDK
│       ├── auth.ts          # Authentication functions
│       ├── firestore.ts     # Database operations
│       └── storage.ts       # File upload functions
├── types/                    # TypeScript definitions
│   └── firebase.ts          # Firebase data models
├── scripts/                  # Utility scripts
│   └── check-env.js         # Environment validation
├── public/                   # Static assets
├── firestore.rules          # Firestore security rules
├── storage.rules            # Storage security rules
├── .env.local               # Local environment variables (not in git)
├── .env.example             # Environment template
├── FIREBASE_SETUP.md        # Firebase setup guide
└── VERCEL_DEPLOYMENT.md     # Vercel deployment guide
```

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Deployment
npm run check-env       # Validate environment variables
npm run deploy          # Deploy to Vercel production
npm run deploy-preview  # Deploy preview to Vercel
```

## Environment Variables

### Required Variables

All variables are documented in [`.env.example`](.env.example).

**Client-side (NEXT_PUBLIC_*):**
- Firebase configuration (API key, auth domain, project ID, etc.)

**Server-side (SECRET):**
- Firebase Admin SDK service account key

### Setup Instructions

See detailed instructions in:
- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Firebase configuration
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Vercel deployment

## Data Models

### User Roles
- **Student** - Report incidents, view own reports
- **Staff** - View all incidents, limited management
- **Responder** - Handle assigned incidents, update status
- **Admin** - Full access, verification, assignment, analytics

### Incident Status Flow
```
submitted → verified → assigned → in-progress → resolved → closed
            ↓
         rejected
```

### Incident Categories
- Medical Emergency
- Fire
- Harassment
- Theft
- Vandalism
- Lost/Found Items
- Lab Accident
- Facility Issue
- Security Concern
- Other

### Severity Levels
- Low
- Medium
- High
- Critical

## Security

### Firebase Security Rules

Security rules are defined in:
- [`firestore.rules`](firestore.rules) - Database access control
- [`storage.rules`](storage.rules) - File upload restrictions

Deploy rules:
```bash
firebase deploy --only firestore:rules,storage
```

### Best Practices

- ✅ Never commit `.env.local` to git
- ✅ Use role-based access control
- ✅ Validate user input on client and server
- ✅ Sanitize file uploads (max 5MB, images only)
- ✅ Use HTTPS in production
- ✅ Rotate API keys periodically
- ✅ Enable 2FA on Firebase and Vercel accounts

## Deployment

### Deploy to Vercel

1. **Quick deploy**
   ```bash
   npm run deploy
   ```

2. **Or follow the detailed guide**
   - See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

### Post-Deployment

- Add Vercel domain to Firebase authorized domains
- Test all functionality in production
- Set up monitoring and analytics
- Configure custom domain (optional)

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test locally**
   ```bash
   npm run dev
   npm run check-env
   ```

3. **Commit and push**
   ```bash
   git add .
   git commit -m "Add feature description"
   git push origin feature/your-feature-name
   ```

4. **Create pull request**
   - Vercel will automatically create a preview deployment
   - Review changes in preview environment

5. **Merge to main**
   - Automatic production deployment on merge

## API Routes (Coming Soon)

- `POST /api/incidents` - Create incident
- `GET /api/incidents/:id` - Get incident details
- `PATCH /api/incidents/:id` - Update incident
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/notifications` - Send notifications

## Testing (Coming Soon)

```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:watch    # Run tests in watch mode
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## Troubleshooting

### Common Issues

**Firebase not connecting:**
- Verify `.env.local` has correct credentials
- Check Firebase project is active
- Ensure security rules are deployed

**Authentication errors:**
- Add localhost and Vercel domain to Firebase authorized domains
- Check user role is properly set in Firestore

**Image upload fails:**
- Verify Storage rules are deployed
- Check file size is under 5MB
- Ensure file is valid image type

**Build fails:**
- Run `npm run check-env` to validate environment
- Clear `.next` folder and rebuild
- Check for TypeScript errors

### Getting Help

- Check [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- Check [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- Review Firebase Console logs
- Check Vercel deployment logs

## Roadmap

- [ ] Push notifications (web push)
- [ ] Email notifications
- [ ] Campus map integration
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] SMS alerts for critical incidents
- [ ] Advanced analytics dashboard
- [ ] Incident report export (PDF)
- [ ] Integration with campus security systems

## License

This project is for educational purposes. Modify as needed for your campus.

## Support

For issues, questions, or suggestions:
- Create an issue in the repository
- Contact campus IT support
- Review documentation in this repository

---

**Built with ❤️ for campus safety**
