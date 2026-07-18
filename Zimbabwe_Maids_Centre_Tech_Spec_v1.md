# Technical Specification & Implementation Guide
## Zimbabwe Maids Centre — Full-Stack PWA Platform

**Version:** 1.0  
**Date:** 18 July 2026  
**Stack:** Vite + React + TypeScript + Firebase + PWA + Vercel  
**Target:** Production-ready for 1,000+ placements/month

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (PWA)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐   │
│  │  React 18     │  │  Vite Build │  │  Service Worker         │   │
│  │  TypeScript   │  │  (SWC)      │  │  (Workbox)              │   │
│  │  Tailwind CSS │  │  PWA Assets │  │  Offline Cache          │   │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐   │
│  │ React Query   │  │ Zustand     │  │ React Router v6         │   │
│  │ (Data Sync)   │  │ (State)     │  │ (Navigation)            │   │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘   │
└──────────────────────────┬────────────────────────────────────────┘
                           │ HTTPS (Firebase Hosting / Vercel)
┌──────────────────────────▼────────────────────────────────────────┐
│                     FIREBASE BACKEND                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐    │
│  │ Firebase Auth  │ │ Cloud Firestore│ │ Cloud Functions        │    │
│  │ (Auth + JWT)   │ │ (NoSQL DB)     │ │ (Serverless API)       │    │
│  └──────────────┘ └──────────────┘ └────────────────────────┘    │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐    │
│  │ Cloud Storage  │ │ Firebase       │ │ Cloud Messaging        │    │
│  │ (Files/Photos) │ │ Extensions     │ │ (Push/Topic)           │    │
│  └──────────────┘ └──────────────┘ └────────────────────────┘    │
│  ┌──────────────┐ ┌──────────────┐                               │
│  │ Algolia Search │ │ Stripe/Paynow  │                               │
│  │ (Full-text)    │ │ (Payments)     │                               │
│  └──────────────┘ └──────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack Deep Dive

### 2.1 Frontend

| Technology | Purpose | Why |
|------------|---------|-----|
| **Vite** | Build tool | 10-100x faster than CRA, native ESM, instant HMR |
| **React 18** | UI Framework | Concurrent features, Suspense, automatic batching |
| **TypeScript** | Type safety | Catch errors at build time, better DX, self-documenting |
| **Tailwind CSS** | Styling | Utility-first, tiny bundle, responsive by default |
| **shadcn/ui** | Component library | Copy-paste accessible components, no dependency bloat |
| **React Router v6** | Routing | Declarative, lazy loading, protected routes |
| **TanStack Query (React Query)** | Server state | Caching, background sync, optimistic updates, offline support |
| **Zustand** | Client state | Lightweight, no boilerplate, TypeScript native |
| **React Hook Form + Zod** | Forms | Performance, validation, type-safe schemas |
| **Framer Motion** | Animations | Smooth transitions, gesture support, AnimatePresence |
| **Workbox** | Service Worker | Precaching, runtime caching, background sync for PWA |

### 2.2 Backend (Firebase — Serverless)

| Service | Purpose | Why |
|---------|---------|-----|
| **Firebase Auth** | Authentication | Phone OTP, email/password, social login, JWT tokens |
| **Cloud Firestore** | Primary database | Real-time sync, offline persistence, scalable NoSQL |
| **Cloud Functions** | Serverless API | Pay-per-use, auto-scaling, secure backend logic |
| **Firebase Storage** | File storage | Secure uploads, image resizing, CDN delivery |
| **Firebase Cloud Messaging** | Push notifications | Cross-platform, topic-based, reliable delivery |
| **Firebase Extensions** | Add-ons | Algolia search, image processing, Stripe payments |
| **Firebase Analytics** | User analytics | Free, integrated, cohort tracking |
| **Firebase Crashlytics** | Error monitoring | Real-time crash reports, performance traces |

### 2.3 Third-Party Integrations

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| **Algolia** | Full-text search | Firebase Extension: sync Firestore → Algolia index |
| **Paynow** | Zimbabwe payments | Cloud Function calling Paynow API |
| **EcoCash** | Mobile money | Cloud Function via EcoCash merchant API |
| **WhatsApp Business API** | Chatbot + alerts | Cloud Function → Meta Business API webhooks |
| **OpenAI / Gemini** | AI chatbot | Cloud Function calling OpenAI API |
| **Cloudinary** (optional) | Image optimization | Firebase Extension for auto-resize |

### 2.4 Hosting & Deployment

| Platform | Purpose | Why |
|----------|---------|-----|
| **Vercel** | Primary hosting | Zero-config deploy, edge network, preview deployments |
| **Firebase Hosting** | Fallback / CDN | Fast global CDN, custom domain, automatic SSL |
| **GitHub Actions** | CI/CD | Automated testing, building, deployment on push |

---

## 3. PWA Configuration

### 3.1 PWA Features

```
✅ Installable (Add to Home Screen on Android & iOS)
✅ Offline Capability (Cached pages, forms, images)
✅ Background Sync (Queue actions when offline)
✅ Push Notifications (Job alerts, match confirmations)
✅ Responsive (Mobile-first, tablet, desktop)
✅ App-like Navigation (Bottom tab bar on mobile, sidebar on desktop)
```

### 3.2 vite-plugin-pwa Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firestore-api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'firebase-storage-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 604800 },
            },
          },
        ],
      },
      manifest: {
        name: 'Zimbabwe Maids Centre',
        short_name: 'ZimMaids',
        description: 'Find trusted domestic workers with peace of mind',
        theme_color: '#166534', // green-800
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icon-72x72.png', sizes: '72x72', type: 'image/png' },
          { src: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
          { src: '/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: '/icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: '/icon-152x152.png', sizes: '152x152', type: 'image/png' },
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
});
```

### 3.3 iOS PWA Specifics

```html
<!-- index.html -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="ZimMaids">
<link rel="apple-touch-icon" href="/icon-192x192.png">
<link rel="apple-touch-startup-image" href="/splash-640x1136.png" media="(device-width: 320px)">
<link rel="apple-touch-startup-image" href="/splash-750x1334.png" media="(device-width: 375px)">
<link rel="apple-touch-startup-image" href="/splash-828x1792.png" media="(device-width: 414px)">
```

---

## 4. Firebase Configuration

### 4.1 Project Structure

```
zimbabwe-maids-centre/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── public/
│   ├── icons/                  # PWA icons (all sizes)
│   ├── splash/                 # iOS splash screens
│   └── manifest.json           # Auto-generated by vite-plugin-pwa
├── src/
│   ├── components/             # Reusable UI components
│   ├── features/               # Feature-based modules
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── jobs/
│   │   ├── matching/
│   │   ├── messaging/
│   │   ├── payments/
│   │   ├── profile/
│   │   ├── verification/
│   │   └── admin/
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Firebase init, utilities
│   ├── stores/                 # Zustand stores
│   ├── types/                  # TypeScript types/interfaces
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── firebase/
│   ├── functions/              # Cloud Functions
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── payments/
│   │   │   ├── matching/
│   │   │   ├── verification/
│   │   │   ├── notifications/
│   │   │   ├── chatbot/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── firestore.rules         # Security rules
│   ├── firestore.indexes.json  # Composite indexes
│   ├── storage.rules           # Storage security
│   └── firebase.json           # Project config
├── vercel.json                 # Vercel routing/headers
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── package.json
└── README.md
```

### 4.2 Firebase Initialization

```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
export const functions = getFunctions(app);
export const analytics = getAnalytics(app);

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence enabled in first tab only');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser does not support offline persistence');
  }
});

export default app;
```

### 4.3 Firestore Security Rules

```javascript
// firebase/firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    function isVerifier() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'verifier';
    }

    function hasPaidForMatch(workerId) {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/matches/$(request.auth.uid + '_' + workerId)) &&
        get(/databases/$(database)/documents/matches/$(request.auth.uid + '_' + workerId)).data.placementFeePaid == true;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }

    // Worker profiles - contact details encrypted
    match /workerProfiles/{workerId} {
      allow read: if isAuthenticated() && 
        (resource.data.contactVisible == true || 
         isAdmin() || 
         isVerifier() ||
         hasPaidForMatch(workerId));
      allow create: if isOwner(workerId);
      allow update: if isOwner(workerId) || isAdmin() || isVerifier();
    }

    // Employer profiles
    match /employerProfiles/{employerId} {
      allow read: if isAuthenticated();
      allow create: if isOwner(employerId);
      allow update: if isOwner(employerId) || isAdmin();
    }

    // Job listings
    match /jobs/{jobId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'employer';
      allow update, delete: if isAdmin() || 
        (resource.data.employerId == request.auth.uid);
    }

    // Matches
    match /matches/{matchId} {
      allow read: if isAuthenticated() && 
        (resource.data.employerId == request.auth.uid || 
         resource.data.workerId == request.auth.uid || 
         isAdmin());
      allow create: if isAuthenticated();
      allow update: if isAdmin() || 
        resource.data.employerId == request.auth.uid || 
        resource.data.workerId == request.auth.uid;
    }

    // Messages
    match /conversations/{conversationId}/messages/{messageId} {
      allow read: if isAuthenticated() && 
        request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants;
      allow create: if isAuthenticated() && 
        request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants;
    }

    // Verification records
    match /verifications/{verificationId} {
      allow read: if isAuthenticated() && 
        (resource.data.workerId == request.auth.uid || isAdmin() || isVerifier());
      allow create: if isAuthenticated();
      allow update: if isAdmin() || isVerifier();
    }

    // Payments
    match /payments/{paymentId} {
      allow read: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated();
      allow update: if isAdmin();
    }

    // Admin settings
    match /settings/{docId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

---

## 5. Core Implementation Modules

### 5.1 Authentication Module

```typescript
// src/features/auth/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type UserRole = 'employer' | 'worker' | 'admin' | 'verifier';

export interface UserData {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Phone OTP Sign In
  const sendOTP = async (phoneNumber: string, recaptchaVerifier: any) => {
    const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    setConfirmationResult(result);
    return result;
  };

  const verifyOTP = async (code: string) => {
    if (!confirmationResult) throw new Error('No confirmation result');
    const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, code);
    const result = await signInWithCredential(auth, credential);

    // Create user document if new
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      await createUserDocument(result.user, 'worker'); // Default role, can be changed
    }
    return result;
  };

  // Email/Password Registration
  const registerWithEmail = async (email: string, password: string, role: UserRole, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await createUserDocument(result.user, role);
    return result;
  };

  const loginWithEmail = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const createUserDocument = async (firebaseUser: User, role: UserRole) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userData: Omit<UserData, 'uid'> & { uid: string } = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      phoneNumber: firebaseUser.phoneNumber,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      role,
      isVerified: false,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    };
    await setDoc(userRef, userData);
  };

  return {
    user,
    userData,
    loading,
    sendOTP,
    verifyOTP,
    registerWithEmail,
    loginWithEmail,
    logout,
    isAuthenticated: !!user,
    isAdmin: userData?.role === 'admin',
    isEmployer: userData?.role === 'employer',
    isWorker: userData?.role === 'worker',
  };
}
```

### 5.2 Worker Profile with Encrypted Contacts

```typescript
// src/features/profile/types/worker.ts
export interface WorkerProfile {
  uid: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  location: {
    city: string;
    suburb: string;
    coordinates?: { lat: number; lng: number };
  };
  skills: string[];
  experienceYears: number;
  expectedSalary: {
    min: number;
    max: number;
    currency: 'USD' | 'ZWL';
  };
  availability: {
    type: 'fulltime' | 'parttime' | 'livein' | 'liveout';
    days: string[];
    startDate: string;
  };
  languages: string[];
  bio: string;
  photoURL: string;
  documents: {
    idCard: string;
    certificates: string[];
    referenceLetters: string[];
  };
  verificationStatus: {
    kyc: 'pending' | 'approved' | 'rejected';
    backgroundCheck: 'pending' | 'approved' | 'rejected';
    referenceCheck: 'pending' | 'approved' | 'rejected';
    training: 'pending' | 'approved' | 'rejected';
    overall: 'pending' | 'verified' | 'fully_verified';
  };
  contactEncrypted: boolean; // TRUE until match fee paid
  phoneNumber: string; // Encrypted field
  whatsappNumber: string; // Encrypted field
  email: string; // Encrypted field
  contactVisible: boolean; // Set to true after payment
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// src/features/profile/hooks/useWorkerProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { WorkerProfile } from '../types/worker';

export function useWorkerProfile(uid: string) {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['workerProfile', uid],
    queryFn: async () => {
      const docRef = doc(db, 'workerProfiles', uid);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return { id: snapshot.id, ...snapshot.data() } as WorkerProfile;
    },
    enabled: !!uid,
  });

  const updateProfile = useMutation({
    mutationFn: async (data: Partial<WorkerProfile>) => {
      const docRef = doc(db, 'workerProfiles', uid);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile', uid] });
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    updateProfile,
  };
}

// Contact visibility logic (used in UI)
export function canViewContact(
  viewerRole: string,
  viewerId: string,
  workerId: string,
  profile: WorkerProfile,
  matchData?: { placementFeePaid: boolean }
): boolean {
  if (viewerRole === 'admin' || viewerRole === 'verifier') return true;
  if (viewerId === workerId) return true;
  if (matchData?.placementFeePaid) return true;
  return profile.contactVisible === true;
}
```

### 5.3 Matching Engine (Cloud Function)

```typescript
// firebase/functions/src/matching/index.ts
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

initializeApp();
const db = getFirestore();

interface MatchScore {
  workerId: string;
  score: number;
  reasons: string[];
}

export const onJobCreated = onDocumentCreated('jobs/{jobId}', async (event) => {
  const job = event.data?.data();
  if (!job) return;

  // Query potential workers
  const workersQuery = db.collection('workerProfiles')
    .where('verificationStatus.overall', 'in', ['verified', 'fully_verified'])
    .where('location.city', '==', job.location.city);

  const workers = await workersQuery.get();
  const scores: MatchScore[] = [];

  workers.forEach((doc) => {
    const worker = doc.data();
    let score = 0;
    const reasons: string[] = [];

    // Location proximity (30%)
    if (worker.location.suburb === job.location.suburb) {
      score += 30;
      reasons.push('Same suburb');
    } else {
      score += 15;
      reasons.push('Same city');
    }

    // Skill match (25%)
    const skillOverlap = worker.skills.filter((s: string) => 
      job.requirements.skills?.includes(s)
    ).length;
    if (skillOverlap > 0) {
      score += Math.min(25, skillOverlap * 5);
      reasons.push(`${skillOverlap} matching skills`);
    }

    // Salary alignment (20%)
    const workerMin = worker.expectedSalary.min;
    const jobMax = job.salaryRange.max;
    const jobMin = job.salaryRange.min;
    if (workerMin <= jobMax && workerMin >= jobMin) {
      score += 20;
      reasons.push('Salary expectations match');
    } else if (workerMin <= jobMax * 1.2) {
      score += 10;
      reasons.push('Salary close to range');
    }

    // Availability (15%)
    if (worker.availability.type === job.requirements.type) {
      score += 15;
      reasons.push('Availability type matches');
    }

    // Experience (10%)
    if (worker.experienceYears >= (job.requirements.minExperience || 0)) {
      score += 10;
      reasons.push('Meets experience requirement');
    }

    // Verification bonus
    if (worker.verificationStatus.overall === 'fully_verified') {
      score += 5;
      reasons.push('Fully verified');
    }

    scores.push({ workerId: doc.id, score, reasons });
  });

  // Sort by score and take top 10
  const topMatches = scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  // Store matches
  const batch = db.batch();
  topMatches.forEach((match, index) => {
    const matchRef = db.collection('matches').doc(`${event.params.jobId}_${match.workerId}`);
    batch.set(matchRef, {
      jobId: event.params.jobId,
      workerId: match.workerId,
      score: match.score,
      reasons: match.reasons,
      status: 'pending',
      placementFeePaid: false,
      connectionFeePaid: false,
      rank: index + 1,
      createdAt: new Date(),
    });
  });

  await batch.commit();

  // Send notification to top workers
  for (const match of topMatches.slice(0, 5)) {
    await db.collection('notifications').add({
      userId: match.workerId,
      type: 'job_match',
      title: 'New Job Match!',
      body: 'A new job matching your profile is available',
      data: { jobId: event.params.jobId },
      read: false,
      createdAt: new Date(),
    });
  }
});
```

### 5.4 Payment Integration (Paynow + EcoCash)

```typescript
// firebase/functions/src/payments/index.ts
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

interface PaymentRequest {
  userId: string;
  type: 'placement_fee' | 'connection_fee' | 'retainer';
  amount: number;
  currency: 'USD' | 'ZWL';
  matchId?: string;
  method: 'paynow' | 'ecocash';
  phoneNumber?: string; // For EcoCash
}

export const initiatePayment = onCall(async (request) => {
  const { userId, type, amount, currency, matchId, method, phoneNumber } = request.data as PaymentRequest;

  // Validate user
  if (request.auth?.uid !== userId) {
    throw new HttpsError('permission-denied', 'Unauthorized');
  }

  // Create payment record
  const paymentRef = db.collection('payments').doc();
  await paymentRef.set({
    id: paymentRef.id,
    userId,
    type,
    amount,
    currency,
    matchId: matchId || null,
    method,
    status: 'pending',
    gatewayReference: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Initiate based on method
  if (method === 'paynow') {
    const paynowResponse = await initiatePaynow(paymentRef.id, amount, currency);
    await paymentRef.update({
      gatewayReference: paynowResponse.reference,
      paynowUrl: paynowResponse.redirectUrl,
    });
    return { paymentId: paymentRef.id, redirectUrl: paynowResponse.redirectUrl };
  } 

  if (method === 'ecocash') {
    if (!phoneNumber) {
      throw new HttpsError('invalid-argument', 'Phone number required for EcoCash');
    }
    const ecocashResponse = await initiateEcoCash(paymentRef.id, amount, phoneNumber);
    await paymentRef.update({
      gatewayReference: ecocashResponse.reference,
      ecocashStatus: 'pending_ussd',
    });
    return { paymentId: paymentRef.id, status: 'pending_ussd', message: 'Please check your phone for EcoCash prompt' };
  }

  throw new HttpsError('invalid-argument', 'Invalid payment method');
});

// Paynow webhook handler
export const paynowWebhook = onCall(async (request) => {
  const { reference, status, amount } = request.data;

  const paymentQuery = await db.collection('payments')
    .where('gatewayReference', '==', reference)
    .limit(1)
    .get();

  if (paymentQuery.empty) {
    throw new HttpsError('not-found', 'Payment not found');
  }

  const paymentDoc = paymentQuery.docs[0];
  const payment = paymentDoc.data();

  if (status === 'paid') {
    await paymentDoc.ref.update({ status: 'success', updatedAt: new Date() });

    // Unlock contact if placement fee
    if (payment.type === 'placement_fee' && payment.matchId) {
      await db.collection('matches').doc(payment.matchId).update({
        placementFeePaid: true,
        contactUnlockedAt: new Date(),
      });

      // Update worker profile contact visibility
      const matchDoc = await db.collection('matches').doc(payment.matchId).get();
      const match = matchDoc.data();
      if (match) {
        await db.collection('workerProfiles').doc(match.workerId).update({
          contactVisible: true,
        });
      }
    }

    // Send confirmation
    await db.collection('notifications').add({
      userId: payment.userId,
      type: 'payment_success',
      title: 'Payment Successful',
      body: `Your payment of ${payment.currency} ${payment.amount} was successful`,
      read: false,
      createdAt: new Date(),
    });
  } else {
    await paymentDoc.ref.update({ status: 'failed', updatedAt: new Date() });
  }

  return { success: true };
});

// Helper functions (simplified)
async function initiatePaynow(paymentId: string, amount: number, currency: string) {
  // Integration with Paynow API
  // Return mock response for now
  return {
    reference: `PN-${paymentId}`,
    redirectUrl: `https://www.paynow.co.zw/invoice/${paymentId}`,
  };
}

async function initiateEcoCash(paymentId: string, amount: number, phoneNumber: string) {
  // Integration with EcoCash API
  return {
    reference: `EC-${paymentId}`,
    status: 'pending',
  };
}
```

### 5.5 WhatsApp Chatbot Integration

```typescript
// firebase/functions/src/chatbot/index.ts
import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { OpenAI } from 'openai';

const db = getFirestore();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const whatsappWebhook = onRequest(async (req, res) => {
  const { Body, From, ProfileName } = req.body;

  if (!Body || !From) {
    res.status(400).send('Invalid request');
    return;
  }

  const phoneNumber = From.replace('whatsapp:', '');

  // Get or create user by phone
  const userQuery = await db.collection('users')
    .where('phoneNumber', '==', phoneNumber)
    .limit(1)
    .get();

  let userId = userQuery.empty ? null : userQuery.docs[0].id;

  // Store message
  await db.collection('chatbotMessages').add({
    userId,
    phoneNumber,
    message: Body,
    direction: 'incoming',
    timestamp: new Date(),
  });

  // Generate AI response
  const systemPrompt = `You are ZimMaids Assistant, a helpful chatbot for Zimbabwe Maids Centre. 
You help employers find domestic workers and workers find jobs. 
Key info: Placement fees apply to employers. Connection fees apply to workers. 
Contact: +263 785 458 828. Services: Maids, Nannies, Chefs, Caregivers, Cleaners, Gardeners.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: Body },
    ],
    max_tokens: 300,
  });

  const reply = completion.choices[0].message.content || 
    'Sorry, I did not understand. Please call +263 785 458 828 for assistance.';

  // Store response
  await db.collection('chatbotMessages').add({
    userId,
    phoneNumber,
    message: reply,
    direction: 'outgoing',
    timestamp: new Date(),
  });

  // Send via WhatsApp Business API (Meta)
  // Implementation would use axios to call Meta's API

  res.status(200).send({ reply });
});

// Scheduled job alerts via WhatsApp
export const sendJobAlerts = onCall(async (request) => {
  const { workerId } = request.data;

  const workerDoc = await db.collection('workerProfiles').doc(workerId).get();
  if (!workerDoc.exists) return;

  const worker = workerDoc.data();
  const matches = await db.collection('matches')
    .where('workerId', '==', workerId)
    .where('status', '==', 'pending')
    .orderBy('score', 'desc')
    .limit(3)
    .get();

  if (matches.empty) return;

  let message = '🔔 *New Job Matches!*\n\n';
  matches.forEach((match, i) => {
    const data = match.data();
    message += `${i + 1}. Job in ${data.location} - Score: ${data.score}%\n`;
  });

  message += '\nReply APPLY to see details or visit: https://zimmaidscentre.co.zw';

  // Send via WhatsApp API
  // await sendWhatsAppMessage(worker.phoneNumber, message);
});
```

### 5.6 Zustand Store (Global State)

```typescript
// src/stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserData } from '@/features/auth/hooks/useAuth';

interface AuthState {
  user: User | null;
  userData: UserData | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmployer: boolean;
  isWorker: boolean;
  setUser: (user: User | null, userData: UserData | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      userData: null,
      isAuthenticated: false,
      isAdmin: false,
      isEmployer: false,
      isWorker: false,
      setUser: (user, userData) => set({
        user,
        userData,
        isAuthenticated: !!user,
        isAdmin: userData?.role === 'admin',
        isEmployer: userData?.role === 'employer',
        isWorker: userData?.role === 'worker',
      }),
      logout: () => set({
        user: null,
        userData: null,
        isAuthenticated: false,
        isAdmin: false,
        isEmployer: false,
        isWorker: false,
      }),
    }),
    {
      name: 'zimmaids-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// src/stores/uiStore.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  theme: 'light',
  toast: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}));
```

---

## 6. PWA Offline Strategy

### 6.1 Background Sync for Forms

```typescript
// src/lib/offlineSync.ts
export async function queueAction(action: string, data: any) {
  const registration = await navigator.serviceWorker.ready;

  if ('sync' in registration) {
    // Store in IndexedDB
    await addToQueue({ action, data, timestamp: Date.now() });

    // Register background sync
    await registration.sync.register(action);
  } else {
    // Fallback: retry immediately when online
    window.addEventListener('online', async () => {
      await processQueue();
    }, { once: true });
  }
}

async function addToQueue(item: any) {
  // Using idb-keyval or similar
  const queue = await get('syncQueue') || [];
  queue.push(item);
  await set('syncQueue', queue);
}

export async function processQueue() {
  const queue = await get('syncQueue') || [];

  for (const item of queue) {
    try {
      switch (item.action) {
        case 'applyToJob':
          await applyToJob(item.data);
          break;
        case 'updateProfile':
          await updateProfile(item.data);
          break;
        case 'sendMessage':
          await sendMessage(item.data);
          break;
      }
    } catch (err) {
      console.error('Failed to sync:', err);
    }
  }

  await set('syncQueue', []);
}
```

### 6.2 Service Worker Strategy

```javascript
// sw.js (auto-generated by Workbox via vite-plugin-pwa)
// Custom additions for background sync

self.addEventListener('sync', (event) => {
  if (event.tag === 'applyToJob') {
    event.waitUntil(processJobApplicationQueue());
  }
  if (event.tag === 'sendMessage') {
    event.waitUntil(processMessageQueue());
  }
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'ZimMaids', {
      body: data.body || 'You have a new notification',
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      data: data.data || {},
      actions: [
        { action: 'open', title: 'Open App' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});
```

---

## 7. Deployment Configuration

### 7.1 Vercel Deployment

```json
// vercel.json
{
  "version": 2,
  "name": "zimbabwe-maids-centre",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://firebasestorage.googleapis.com https://*.googleapis.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://api.openai.com; font-src 'self';"
        }
      ]
    }
  ]
}
```

### 7.2 GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Test
        run: npm run test:ci

      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
          VITE_FIREBASE_MEASUREMENT_ID: ${{ secrets.VITE_FIREBASE_MEASUREMENT_ID }}
          VITE_ALGOLIA_APP_ID: ${{ secrets.VITE_ALGOLIA_APP_ID }}
          VITE_ALGOLIA_SEARCH_KEY: ${{ secrets.VITE_ALGOLIA_SEARCH_KEY }}

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 7.3 Firebase Deployment

```json
// firebase/firebase.json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log"
      ]
    }
  ],
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/service-worker.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  },
  "storage": {
    "rules": "storage.rules"
  },
  "extensions": {
    "algolia-firestore": "algolia/firestore-algolia-search@latest"
  }
}
```

---

## 8. Environment Variables

```bash
# .env.local (NEVER commit this)

# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Algolia Search
VITE_ALGOLIA_APP_ID=your_algolia_app_id
VITE_ALGOLIA_SEARCH_KEY=your_algolia_search_key

# API Base (for Cloud Functions)
VITE_API_BASE_URL=https://your-region-your-project.cloudfunctions.net

# App Config
VITE_APP_NAME=Zimbabwe Maids Centre
VITE_APP_URL=https://zimmaidscentre.co.zw
VITE_SUPPORT_PHONE=+263785458828
VITE_SUPPORT_WHATSAPP=+263773022135

# Feature Flags
VITE_ENABLE_PAYNOW=true
VITE_ENABLE_ECOCASH=true
VITE_ENABLE_WHATSAPP_BOT=true
VITE_ENABLE_PUSH_NOTIFICATIONS=true
```

---

## 9. Performance Budget

| Metric | Target | Budget |
|--------|--------|--------|
| First Contentful Paint (FCP) | < 1.5s | 1.2s |
| Largest Contentful Paint (LCP) | < 2.5s | 2.0s |
| Time to Interactive (TTI) | < 3.5s | 3.0s |
| Total Bundle Size | < 200KB (gzipped) | 180KB |
| JavaScript Bundle | < 150KB (gzipped) | 130KB |
| CSS Bundle | < 30KB (gzipped) | 25KB |
| Images (lazy loaded) | WebP/AVIF format | < 100KB per image |

---

## 10. Testing Strategy

| Type | Tool | Coverage Target |
|------|------|-----------------|
| Unit Tests | Vitest | 80%+ |
| Component Tests | React Testing Library | 70%+ |
| E2E Tests | Playwright | Critical flows |
| Visual Regression | Chromatic | All components |
| Performance | Lighthouse CI | 90+ score |
| Accessibility | axe-core | 0 violations |

---

## 11. Security Checklist

- [ ] Firebase Security Rules reviewed and tested
- [ ] Input validation on all forms (Zod schemas)
- [ ] XSS prevention (React escapes by default + CSP)
- [ ] CSRF protection (Firebase Auth handles this)
- [ ] Rate limiting on Cloud Functions
- [ ] Phone number verification via OTP
- [ ] Encrypted contact details (Firestore rules + field-level encryption)
- [ ] HTTPS only (enforced by Firebase/Vercel)
- [ ] Dependency scanning (Dependabot/Snyk)
- [ ] Secrets management (GitHub Actions + Firebase Config)

---

## 12. Development Commands

```bash
# Setup
npm install

# Development
npm run dev          # Start Vite dev server

# Build
npm run build        # Production build
npm run preview      # Preview production build

# Testing
npm run test         # Run Vitest
npm run test:ui      # Vitest UI mode
npm run test:e2e     # Playwright E2E tests

# Linting
npm run lint         # ESLint
npm run lint:fix     # Auto-fix ESLint
npm run typecheck    # TypeScript check
npm run format       # Prettier

# Firebase
npm run firebase:emulators  # Start local Firebase emulators
npm run deploy:functions    # Deploy Cloud Functions
npm run deploy:rules        # Deploy Firestore rules
npm run deploy:hosting      # Deploy to Firebase Hosting

# PWA
npm run generate-pwa-assets  # Generate icons and splash screens
```

---

## 13. Package.json Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.24.0",
    "@tanstack/react-query": "^5.51.0",
    "zustand": "^4.5.0",
    "firebase": "^10.12.0",
    "react-hook-form": "^7.52.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.9.0",
    "framer-motion": "^11.3.0",
    "lucide-react": "^0.408.0",
    "date-fns": "^3.6.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.4.0",
    "class-variance-authority": "^0.7.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0",
    "@radix-ui/react-tooltip": "^1.1.0",
    "algoliasearch": "^4.24.0",
    "react-instantsearch": "^7.12.0",
    "workbox-window": "^7.1.0",
    "idb-keyval": "^6.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react-swc": "^3.7.0",
    "vite": "^5.3.0",
    "vite-plugin-pwa": "^0.20.0",
    "typescript": "^5.5.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^7.16.0",
    "@typescript-eslint/parser": "^7.16.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.0",
    "prettier": "^3.3.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "jsdom": "^24.1.0",
    "playwright": "^1.45.0",
    "@playwright/test": "^1.45.0"
  }
}
```

---

## 14. Folder Structure (Final)

```
zimbabwe-maids-centre/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── firebase/
│   ├── functions/
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   │   └── index.ts
│   │   │   ├── matching/
│   │   │   │   └── index.ts
│   │   │   ├── payments/
│   │   │   │   └── index.ts
│   │   │   ├── verification/
│   │   │   │   └── index.ts
│   │   │   ├── notifications/
│   │   │   │   └── index.ts
│   │   │   ├── chatbot/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   ├── storage.rules
│   └── firebase.json
├── public/
│   ├── icons/
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   └── icon-512x512.png
│   └── splash/
│       ├── splash-640x1136.png
│       ├── splash-750x1334.png
│       └── splash-828x1792.png
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── toast.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── Footer.tsx
│   │   └── shared/
│   │       ├── ProtectedRoute.tsx
│   │       ├── RoleGuard.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── OfflineBanner.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   ├── PhoneOTP.tsx
│   │   │   │   └── RoleSelector.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   └── types/
│   │   │       └── index.ts
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── EmployerDashboard.tsx
│   │   │   │   ├── WorkerDashboard.tsx
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   └── StatsCards.tsx
│   │   │   └── hooks/
│   │   │       └── useDashboard.ts
│   │   ├── jobs/
│   │   │   ├── components/
│   │   │   │   ├── JobList.tsx
│   │   │   │   ├── JobCard.tsx
│   │   │   │   ├── JobForm.tsx
│   │   │   │   ├── JobFilters.tsx
│   │   │   │   └── JobDetail.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useJobs.ts
│   │   │   │   └── useJobMutations.ts
│   │   │   └── types/
│   │   │       └── index.ts
│   │   ├── matching/
│   │   │   ├── components/
│   │   │   │   ├── MatchList.tsx
│   │   │   │   ├── MatchCard.tsx
│   │   │   │   ├── MatchScore.tsx
│   │   │   │   └── SmartMatch.tsx
│   │   │   └── hooks/
│   │   │       └── useMatches.ts
│   │   ├── messaging/
│   │   │   ├── components/
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   ├── MessageList.tsx
│   │   │   │   ├── MessageInput.tsx
│   │   │   │   └── ConversationList.tsx
│   │   │   └── hooks/
│   │   │       └── useMessaging.ts
│   │   ├── payments/
│   │   │   ├── components/
│   │   │   │   ├── PaymentForm.tsx
│   │   │   │   ├── PaymentHistory.tsx
│   │   │   │   ├── PaynowButton.tsx
│   │   │   │   └── EcoCashButton.tsx
│   │   │   ├── hooks/
│   │   │   │   └── usePayments.ts
│   │   │   └── types/
│   │   │       └── index.ts
│   │   ├── profile/
│   │   │   ├── components/
│   │   │   │   ├── ProfileForm.tsx
│   │   │   │   ├── PhotoUpload.tsx
│   │   │   │   ├── DocumentUpload.tsx
│   │   │   │   ├── VerificationStatus.tsx
│   │   │   │   └── SkillsSelector.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProfile.ts
│   │   │   │   └── useWorkerProfile.ts
│   │   │   └── types/
│   │   │       └── index.ts
│   │   ├── verification/
│   │   │   ├── components/
│   │   │   │   ├── KYCUpload.tsx
│   │   │   │   ├── BackgroundCheck.tsx
│   │   │   │   ├── ReferenceForm.tsx
│   │   │   │   └── VerificationQueue.tsx
│   │   │   └── hooks/
│   │   │       └── useVerification.ts
│   │   └── admin/
│   │       ├── components/
│   │       │   ├── UserManagement.tsx
│   │       │   ├── VerificationReview.tsx
│   │       │   ├── PaymentAudit.tsx
│   │       │   ├── RefundProcessor.tsx
│   │       │   ├── ChatbotLogs.tsx
│   │       │   └── SystemSettings.tsx
│   │       └── hooks/
│   │           └── useAdmin.ts
│   ├── hooks/
│   │   ├── useFirestoreQuery.ts
│   │   ├── useFirestoreMutation.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useOnlineStatus.ts
│   │   ├── usePushNotifications.ts
│   │   └── useDebounce.ts
│   ├── lib/
│   │   ├── firebase.ts
│   │   ├── algolia.ts
│   │   ├── offlineSync.ts
│   │   ├── encryption.ts
│   │   ├── notifications.ts
│   │   └── utils.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   └── notificationStore.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── job.ts
│   │   ├── match.ts
│   │   ├── payment.ts
│   │   └── verification.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── .env.local
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── vercel.json
├── package.json
└── README.md
```

---

## 15. Implementation Roadmap (12 Weeks)

| Week | Focus | Deliverables |
|------|-------|-------------|
| 1 | Setup & Auth | Vite project, Firebase config, Phone OTP, Email auth, Role selection |
| 2 | Profiles | Employer profile, Worker profile, Photo upload, Basic Firestore rules |
| 3 | Job Market | Job posting, Job listing, Search filters, Algolia integration |
| 4 | Matching | Matching algorithm (Cloud Function), Match display, Apply flow |
| 5 | Payments | Paynow integration, EcoCash integration, Placement/Connection fee collection |
| 6 | Contact Unlock | Encrypted contacts, Unlock on payment, Privacy enforcement |
| 7 | Messaging | In-app chat, Real-time messages, Push notifications |
| 8 | Verification | KYC upload, Admin review queue, Background check workflow |
| 9 | Chatbot | WhatsApp Business API, OpenAI integration, FAQ handling |
| 10 | Admin Panel | Dashboard, User management, Verification review, Payment audit |
| 11 | PWA & Polish | Service worker, Offline mode, iOS splash screens, Performance optimization |
| 12 | Testing & Deploy | E2E tests, Security audit, Vercel deployment, Firebase deploy, Go-live |

---

**End of Technical Specification**

*Stack: Vite + React 18 + TypeScript + Firebase + PWA + Vercel*
*Target: Production-ready, 1,000+ placements/month*
