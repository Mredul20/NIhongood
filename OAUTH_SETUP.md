# OAuth Setup Guide for Supabase

This guide explains how to enable Google and GitHub OAuth authentication in your Supabase project.

## URLs Reference

| Environment | URL |
|-------------|-----|
| Production  | `https://nihongood.app` |
| Local dev   | `http://localhost:3000` |
| Supabase    | `https://mkcimanpcghmzqwievsz.supabase.co` |

---

## Google OAuth Setup

### Step 1: Create / Update Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials** → select your OAuth client
3. Under **Authorized JavaScript origins**, ensure these are listed:
   ```
   https://nihongood.app
   http://localhost:3000
   http://localhost:3001
   ```
4. Under **Authorized redirect URIs**, ensure these are listed:
   ```
   https://nihongood.app/auth/callback
   http://localhost:3000/auth/callback
   http://localhost:3001/auth/callback
   https://mkcimanpcghmzqwievsz.supabase.co/auth/v1/callback
   ```
5. Click **Save**
6. Copy your **Client ID** and **Client Secret**

### Step 2: Configure in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com/) → your project
2. Navigate to **Authentication** → **Providers** → **Google**
3. Enable with the toggle
4. Paste your **Client ID** and **Client Secret**
5. Click **Save**

---

## GitHub OAuth Setup

### Step 1: Update GitHub OAuth App

1. Go to [GitHub → Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Select your **NIhongood** app → **Edit**
3. Set:
   - **Homepage URL**: `https://nihongood.app`
   - **Authorization callback URL**: `https://mkcimanpcghmzqwievsz.supabase.co/auth/v1/callback`
4. Click **Update application**
5. Copy your **Client ID** and regenerate / copy **Client Secret**

### Step 2: Configure in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com/) → your project
2. Navigate to **Authentication** → **Providers** → **GitHub**
3. Enable with the toggle
4. Paste your **Client ID** and **Client Secret**
5. Click **Save**

---

## Supabase URL Configuration

1. Go to [Supabase Dashboard](https://app.supabase.com/) → your project
2. Navigate to **Authentication** → **URL Configuration**
3. Set **Site URL**:
   ```
   https://nihongood.app
   ```
4. Under **Redirect URLs**, add both:
   ```
   https://nihongood.app/auth/callback
   http://localhost:3000/auth/callback
   ```
5. Click **Save**

---

## Vercel Environment Variables

Go to [vercel.com](https://vercel.com) → your project → **Settings** → **Environment Variables**

Add the following for the **Production** environment:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://mkcimanpcghmzqwievsz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(from .env.local)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(from .env.local)* |
| `NEXTAUTH_URL` | `https://nihongood.app` |
| `NEXTAUTH_SECRET` | *(generate below)* |

Generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

After adding env vars → **Redeploy** on Vercel (Settings → Deployments → Redeploy, or `git push`).

---

## Testing

### Local
1. `npm run dev`
2. Go to `http://localhost:3000/login`
3. Click Google or GitHub → complete sign-in → should land on `/dashboard`

### Production
1. Go to `https://nihongood.app/login`
2. Click Google or GitHub → complete sign-in → should land on `https://nihongood.app/dashboard`

---

## Troubleshooting

### "redirect_uri_mismatch" / "Invalid redirect URI"
- The callback URL in Google/GitHub must **exactly match** what Supabase sends
- For Google: make sure `https://nihongood.app/auth/callback` is in the redirect URIs list
- For GitHub: the callback URL must be `https://mkcimanpcghmzqwievsz.supabase.co/auth/v1/callback`

### Redirect loop after sign-in
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correctly set in Vercel
- Clear browser cookies and try again
- Verify Site URL in Supabase is set to `https://nihongood.app` (not localhost)

### Provider button missing
- Refresh the page
- Confirm provider is **enabled** in Supabase dashboard
- Verify Client ID and Secret are correctly pasted (no extra spaces)

### Works locally but not in production
- Confirm Vercel env vars are set for **Production** (not just Preview/Development)
- Trigger a fresh redeploy after adding env vars
- Check Vercel function logs for any `Missing Supabase env vars` errors
