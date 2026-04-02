# OAuth Setup Guide for Supabase

This guide explains how to enable Google and GitHub OAuth authentication in your Supabase project.

## Prerequisites

- Supabase project: https://mkcimanpcghmzqwievsz.supabase.co
- Already configured: Email/password authentication

## Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application**
6. In **Authorized JavaScript origins**, add:
   - `http://localhost:3000`
   - `http://localhost:3001`
   - `https://mkcimanpcghmzqwievsz.supabase.co`
7. In **Authorized redirect URIs**, add:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3001/auth/callback`
   - `https://mkcimanpcghmzqwievsz.supabase.co/auth/v1/callback`
   - `https://mkcimanpcghmzqwievsz.supabase.co/auth/v1/callback?provider=google`
8. Copy your **Client ID** and **Client Secret**

### Step 2: Configure in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Click on **Google**
5. Enable it with the toggle
6. Paste your **Client ID** and **Client Secret**
7. Click **Save**

## GitHub OAuth Setup

### Step 1: Create GitHub OAuth App

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: NIhongood
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `https://mkcimanpcghmzqwievsz.supabase.co/auth/v1/callback?provider=github`
4. Click **Register application**
5. Copy your **Client ID**
6. Click **Generate a new client secret** and copy it

### Step 2: Configure in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Click on **GitHub**
5. Enable it with the toggle
6. Paste your **Client ID** and **Client Secret**
7. Click **Save**

## Local Testing

### Update Redirect URL

After setting up OAuth, test the flow:

1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:3000/login`
3. Click **Google** or **GitHub** button
4. You should be redirected to the provider's login page
5. After logging in, you'll be redirected back to the app
6. Check that user profile is created and you're logged in

## Production Deployment

When deploying to production, you'll need to:

1. Add your production domain to Google OAuth and GitHub OAuth
2. Update the callback URL in Supabase to use your production domain
3. Test the full OAuth flow on your production domain

## Troubleshooting

### "Invalid redirect URI" error

- Ensure the callback URL matches exactly in both the OAuth provider and Supabase
- Check that `http://localhost:3000/auth/callback` is in your browser's URL bar

### Redirect loop

- Make sure the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Clear browser cookies and try again

### Provider not showing

- Refresh the page
- Check that the provider is enabled in Supabase dashboard
- Verify that Client ID and Client Secret are correctly set
