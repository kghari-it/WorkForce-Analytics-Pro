# WorkForce Analytics Pro - Setup Guide

## Overview

This application now includes secure authentication with Google OAuth and cloud-based data storage using Supabase. Users can sign in with their Google account, and all their data is automatically saved to the cloud without any risk of data loss.

## Prerequisites

- Supabase project (free tier available at https://supabase.com)
- Google OAuth credentials
- Node.js and npm installed

## Step 1: Set Up Google OAuth in Supabase

### 1.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth Client ID**
5. Select **Web application**
6. Add authorized redirect URIs:
   - `https://YOUR_SUPABASE_URL/auth/v1/callback`
   - `http://localhost:5173` (for local development)
7. Copy the **Client ID** and **Client Secret**

### 1.2 Configure Google Provider in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find and enable **Google**
4. Paste the **Client ID** and **Client Secret** from Google Cloud Console
5. Save the provider configuration

## Step 2: Set Up Database Schema

Once Supabase API is stable, run the database migration:

```sql
-- This migration creates the necessary tables for storing worker data
-- It will be applied automatically when the Supabase API is available

CREATE TABLE IF NOT EXISTS worker_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  worker_id text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, worker_id)
);

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

-- Create indexes for better query performance
CREATE INDEX idx_worker_settings_user_id ON worker_settings(user_id);
CREATE INDEX idx_worker_records_user_id ON worker_records(user_id);
CREATE INDEX idx_worker_records_date ON worker_records(user_id, date);

-- Enable Row Level Security
ALTER TABLE worker_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_records ENABLE ROW LEVEL SECURITY;

-- Add security policies
CREATE POLICY "Users can view own worker settings"
  ON worker_settings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own worker settings"
  ON worker_settings FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own worker records"
  ON worker_records FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own worker records"
  ON worker_records FOR ALL TO authenticated
  USING (auth.uid() = user_id);
```

## Step 3: Update Environment Variables

Ensure your `.env` file contains:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

These are already configured in the project.

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Run the Application

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## Architecture

### Authentication Flow

1. User visits the application
2. AuthProvider checks for existing session
3. If no session, user is redirected to login page
4. User clicks "Sign in with Google"
5. Supabase handles OAuth flow with Google
6. User is redirected back to dashboard
7. All subsequent requests include authenticated user context

### Data Storage

- **Frontend**: React components with Supabase integration
- **Backend**: Supabase PostgreSQL database with Row Level Security (RLS)
- **Authentication**: Supabase Auth with Google OAuth provider
- **Data Isolation**: Each user can only access their own data via RLS policies

### File Structure

```
client/src/
├── contexts/
│   └── AuthContext.tsx          # Authentication state management
├── lib/
│   ├── supabase.ts              # Supabase client initialization
│   └── supabase-storage.ts      # Supabase data operations
├── pages/
│   ├── login.tsx                # Google OAuth login page
│   └── home.tsx                 # Main dashboard (requires auth)
└── components/
    ├── Dashboard.tsx            # Analytics dashboard
    ├── DailyEntry.tsx          # Daily work entry form
    └── Settings.tsx            # Worker settings management
```

## Features

### Authentication
- Google OAuth sign-in
- Automatic session management
- User logout with data preservation
- Protected routes (redirects unauthenticated users to login)

### Data Management
- Cloud-based storage (no local data loss)
- Real-time sync with Supabase
- Automatic data isolation per user
- Backup and recovery via Supabase

### User Interface
- Modern, responsive design
- Professional dark/light theme support
- Smooth animations and transitions
- Mobile-friendly interface

## Troubleshooting

### Issue: "Google sign-in not working"
**Solution**:
- Verify Google OAuth credentials are correctly configured in Supabase
- Check that redirect URIs include your application URL
- Clear browser cache and cookies

### Issue: "Database connection error"
**Solution**:
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
- Check Supabase project status in dashboard
- Ensure Google provider is enabled in Supabase Auth settings

### Issue: "Cannot save worker data"
**Solution**:
- Verify database tables are created (migration applied)
- Check Row Level Security policies are correctly configured
- Verify user is authenticated (check auth.uid() in browser console)

## Security

- All data is encrypted in transit (HTTPS)
- Row Level Security policies ensure users only access their own data
- Authentication tokens are managed by Supabase
- No sensitive data is stored in local storage
- Google OAuth handles password security

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs
2. Review Google OAuth setup: https://console.cloud.google.com/
3. Check application logs for error messages

## Next Steps

After setup is complete:
1. Create worker profiles in Settings
2. Enter daily work records in Daily Entry
3. View analytics in Dashboard
4. All data is automatically synced to cloud
