# Google OAuth Setup Instructions

## Quick Start

This guide walks you through setting up Google OAuth for the WorkForce Analytics Pro application.

## Part 1: Create Google OAuth Credentials

### Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Sign in with your Google account
3. Create a new project or select an existing one

### Step 2: Enable Google+ API

1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and press **Enable**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth Client ID**
3. If prompted, first click **Configure OAuth Consent Screen**
4. For **User Type**, select **External**
5. Click **Create**

### Step 4: Configure OAuth Consent Screen

1. Fill in **App name**: "WorkForce Analytics Pro"
2. Add your email as **User support email**
3. In **Authorized domains**, add your domain:
   - For local development: Skip this
   - For production: Add your domain (e.g., `workforce.example.com`)
4. Click **Save and Continue**
5. On Developer contact information, add your email
6. Click **Save and Continue**
7. Click **Back to Dashboard**

### Step 5: Create OAuth Credentials

1. Go back to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth Client ID**
3. Select **Web application**
4. Enter a name: "WorkForce Analytics Web App"
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5173` (local development)
   - `http://localhost:3000` (if using different port)
   - Your production domain (e.g., `https://workforce.example.com`)
6. Under **Authorized redirect URIs**, add:
   - `https://YOUR_SUPABASE_URL/auth/v1/callback`
   - Example: `https://0ec90b57d6e95fcbda19832f.supabase.co/auth/v1/callback`
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**
9. Download the credentials JSON file (optional, for backup)

### Step 6: Save Your Credentials Securely

Create a temporary note with:
```
Google OAuth Client ID: [Your Client ID]
Google OAuth Client Secret: [Your Client Secret]
Supabase URL: https://0ec90b57d6e95fcbda19832f.supabase.co
```

Keep these credentials secure and never commit them to version control!

---

## Part 2: Configure Supabase

### Step 1: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **Providers**

### Step 2: Enable Google Provider

1. Find **Google** in the providers list
2. Click on it to expand
3. Toggle **Enabled** to ON
4. Paste your **Client ID** from Google Cloud Console
5. Paste your **Client Secret** from Google Cloud Console
6. Click **Save**

### Step 3: Verify Redirect URL

1. In the Google Provider section, you should see a redirect URL
2. Copy this URL (usually looks like `https://YOUR_PROJECT.supabase.co/auth/v1/callback`)
3. Go back to Google Cloud Console → OAuth credentials
4. Edit the OAuth 2.0 Client
5. Add this URL to **Authorized redirect URIs** if not already there
6. Save in Google Cloud Console

---

## Part 3: Deploy Database Schema

### Step 1: Access Supabase SQL Editor

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**

### Step 2: Create Tables

Copy and paste this SQL to create the necessary tables:

```sql
-- Create worker_settings table
CREATE TABLE IF NOT EXISTS worker_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  worker_id text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, worker_id)
);

-- Create worker_records table
CREATE TABLE IF NOT EXISTS worker_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  worker_id text NOT NULL,
  worker_name text NOT NULL,
  worked boolean NOT NULL DEFAULT false,
  sheets_tapped integer NOT NULL DEFAULT 0,
  salary integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_worker_settings_user_id ON worker_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_worker_settings_worker_id ON worker_settings(user_id, worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_records_user_id ON worker_records(user_id);
CREATE INDEX IF NOT EXISTS idx_worker_records_date ON worker_records(user_id, date);
CREATE INDEX IF NOT EXISTS idx_worker_records_worker_id ON worker_records(user_id, worker_id);

-- Enable Row Level Security
ALTER TABLE worker_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_records ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for worker_settings
CREATE POLICY "Users can select own worker settings"
  ON worker_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own worker settings"
  ON worker_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own worker settings"
  ON worker_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own worker settings"
  ON worker_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS Policies for worker_records
CREATE POLICY "Users can select own worker records"
  ON worker_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own worker records"
  ON worker_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own worker records"
  ON worker_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own worker records"
  ON worker_records FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

### Step 3: Execute the Query

1. Click **Run** (or press Ctrl+Enter)
2. Verify there are no errors
3. You should see success messages for each statement

---

## Part 4: Test the Setup

### Step 1: Start the Application

```bash
npm run dev
```

### Step 2: Test Login

1. Open `http://localhost:5173`
2. You should see the login page
3. Click **Sign in with Google**
4. You should be redirected to Google's login screen
5. After login, you should be redirected back to the dashboard

### Step 3: Test Data Storage

1. Add a worker in Settings
2. Save settings
3. Refresh the page
4. The worker should still be there (proving cloud storage works)
5. Sign out and sign back in
6. Worker data should be preserved

---

## Troubleshooting

### Issue: "Invalid Client" Error

**Solution**:
- Verify Client ID and Client Secret are correct
- Check they're copied exactly (no extra spaces)
- In Google Cloud Console, verify the credentials still exist
- If you deleted them, create new credentials

### Issue: "Redirect URI Mismatch"

**Solution**:
- Check the redirect URL format is exactly correct
- Include the full URL: `https://YOUR_SUPABASE_URL/auth/v1/callback`
- In Google Cloud Console, make sure this URL is in the authorized redirect URIs
- URLs are case-sensitive and must match exactly

### Issue: "Failed to connect to database"

**Solution**:
- Verify VITE_SUPABASE_URL is set correctly in `.env`
- Check database tables were created (no SQL errors)
- Verify Row Level Security policies are enabled
- Check authentication token is valid (sign out and sign back in)

### Issue: "User email not showing"

**Solution**:
- Verify you're signed in (check browser console for user object)
- Check that user.email exists in the Supabase user object
- Try signing out and signing back in

### Issue: "Data not saving"

**Solution**:
- Check browser console for errors
- Verify RLS policies are created correctly
- Confirm user_id matches auth.uid()
- Check database tables have correct schema

---

## Security Checklist

- [ ] Client Secret is never committed to Git
- [ ] Client Secret is stored securely (environment variable)
- [ ] Redirect URIs only include trusted domains
- [ ] Google Cloud Project is restricted to your organization
- [ ] Row Level Security is enabled on all tables
- [ ] RLS policies restrict access to user's own data
- [ ] Supabase project has strong authentication settings
- [ ] Regular backups are enabled in Supabase
- [ ] API keys are rotated periodically
- [ ] Access logs are monitored

---

## Next Steps

1. Customize the login page with your branding
2. Add worker import/export functionality
3. Set up automated data backups
4. Configure email notifications
5. Add two-factor authentication (optional)
6. Deploy to production

---

## Support Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Project GitHub Issues](./../../issues)
