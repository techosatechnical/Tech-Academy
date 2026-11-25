# Tech Academy – Multi-Organisation Platform Deployment Guide

This guide details the exact steps to deploy the **Tech Academy Multi-Organisation Tuition Platform** to production hosting platforms (such as **Vercel**, **Netlify**, or **AWS / GCP Cloud Run**).

---

## 1. Prerequisites & Environment Variables

To run in production, configure the following environment variables in your hosting dashboard:

### A. Firebase Client SDK (Public Environment Variables)
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `<project-id>.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Optional / `<project-id>.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Cloud Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Web App ID |

### B. Firebase Admin SDK (Server-Side Only - Secret)
| Variable | Description |
|---|---|
| `FIREBASE_PROJECT_ID` | Your Firebase Project ID |
| `FIREBASE_CLIENT_EMAIL` | Service account email (`firebase-adminsdk-...@<project-id>.iam.gserviceaccount.com`) |
| `FIREBASE_PRIVATE_KEY` | Private key string starting with `-----BEGIN PRIVATE KEY-----\n...` |

> [!IMPORTANT]
> **Formatting `FIREBASE_PRIVATE_KEY` in Vercel / Netlify:**
> When adding `FIREBASE_PRIVATE_KEY` to the Vercel dashboard, paste the exact key including the header and footer (`"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`). Our backend automatically handles newline unescaping (`\n`).

---

## 2. Deploying to Vercel (Recommended)

1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**:
   ```bash
   git add .
   git commit -m "feat: complete multi-organisation full-stack tuition platform"
   git push origin main
   ```
2. Log in to **[Vercel](https://vercel.com/)** and click **"Add New..." → "Project"**.
3. Select your repository.
4. Under **Build & Development Settings**, keep default Next.js settings:
   - Framework Preset: `Next.js`
   - Build Command: `next build`
   - Output Directory: `.next`
5. Expand the **Environment Variables** section and paste the variables from your `.env.local` file.
6. Click **Deploy**.

---

## 3. Post-Deployment Database Initialization

Once deployed to your production URL (e.g. `https://tech-academy-production.vercel.app`):

1. **Seed Content Collections**:
   - Open: `https://your-domain.com/api/seed`
   - This writes the sample organisations (`tuition-001` and `tuition-002`) and all subcollections (settings, pages, courses, faculty, gallery, announcements) into production Firestore.
2. **Seed Initial Administrators**:
   - Open: `https://your-domain.com/api/seed-users`
   - This provisions the 4 standard administrative test accounts in production Firebase Auth and Firestore:
     - `superadmin@techacademy.edu` (SUPER_ADMIN)
     - `bright.admin@techacademy.edu` (ORGANISATION_ADMIN)
     - `excellence.admin@techacademy.edu` (ORGANISATION_ADMIN)
     - `editor@techacademy.edu` (EDITOR)
     - Default initial password: `Admin@123456`

---

## 4. Security Rules Deployment

Ensure your production Firestore has the security rules enabled:
* Either publish [firestore.rules](./firestore.rules) through the **Firebase Console → Firestore Database → Rules** tab.
* Or deploy using the Firebase CLI:
  ```bash
  firebase deploy --only firestore:rules
  ```

---

## 5. Live Architecture & Organization Slugs

| Tenant ID | Organisation Name | URL Path | Custom Theme |
|---|---|---|---|
| `tuition-001` | **Bright Academy** | `/bright` (and `/`) | Academic Blue (`#1E40AF`, `#172554`) |
| `tuition-002` | **Excellence Tutorials** | `/excellence` | Vibrant Orange & Maroon (`#EA580C`, `#7C2D12`) |
| Platform | **Management Console** | `/admin` | Navy Administration Panel |
| Platform | **Admin Sign-In** | `/admin/login` | Secure Role Portal |
