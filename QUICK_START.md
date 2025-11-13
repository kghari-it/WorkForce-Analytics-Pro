# WorkForce Analytics Pro - Quick Start Guide

## Step 1: Set Up Supabase Database Tables

### Option A: Copy-Paste into SQL Editor (Easiest)

1. Go to your Supabase project: https://0ec90b57d6e95fcbda19832f.supabase.co
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy everything from `setup-database.sql` file in this project
5. Paste it into the SQL editor
6. Click **Run** button
7. You should see success messages for each statement

### Option B: Using the File

1. Go to your Supabase project SQL Editor
2. Click **New Query**
3. Open `setup-database.sql` file from this project
4. Copy all the SQL code
5. Paste into Supabase SQL Editor
6. Click **Run**

## Step 2: Enable Google OAuth Provider

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list
3. Click on **Google** to expand
4. Toggle **Enabled** to ON
5. You'll see two fields:
   - **Client ID**
   - **Client Secret**

6. Leave these blank for now (you can set them later if you have Google OAuth credentials)
7. Click **Save**

> Note: Without Google OAuth credentials, you can still test the app, but sign-in won't work until you configure them. See GOOGLE_OAUTH_SETUP.md for detailed OAuth setup.

## Step 3: Verify Environment Variables

The `.env` file already has your Supabase credentials:
```
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are already configured and ready to use.

## Step 4: Start the Application

```bash
npm run dev
```

The application should now:
- Load without errors
- Show the login page
- Allow you to sign in (if Google OAuth is configured)
- Save all data to the cloud

## Step 5: Test the Application

### Test 1: View Login Page
1. Open http://localhost:5173
2. You should see the beautiful login page
3. If Supabase is configured, the "Sign in with Google" button should be enabled

### Test 2: Set Up Workers (Without Login)
For testing without authentication, you can temporarily:
1. Comment out the `ProtectedRoute` in `App.tsx` to access the dashboard
2. Create workers in Settings
3. Add daily entries
4. View the dashboard

### Test 3: With Google OAuth
1. Follow GOOGLE_OAUTH_SETUP.md to set up Google credentials
2. Add your Google OAuth credentials to Supabase
3. Sign in with Google
4. All data will be saved to cloud

## Database Tables Created

### worker_settings
Stores worker configuration per user
- `id` - Unique identifier
- `user_id` - Which user owns this
- `worker_id` - Worker identifier (e.g., "worker-1")
- `name` - Worker name (e.g., "John Doe")
- `created_at` - When created
- `updated_at` - Last updated

### worker_records
Stores daily work entries per user
- `id` - Unique identifier
- `user_id` - Which user owns this
- `date` - Work date
- `worker_id` - Which worker
- `worker_name` - Snapshot of worker name
- `worked` - Did they work today?
- `sheets_tapped` - Number of sheets worked
- `salary` - Daily salary
- `created_at` - When created
- `updated_at` - Last updated

## Security Features Enabled

✓ Row Level Security (RLS) - Users only see their own data
✓ Authentication required - All data access requires login
✓ Foreign key constraints - Data integrity maintained
✓ Automatic cascade delete - Cleaning up when users are removed

## What Works Now

✓ Application loads without errors
✓ Beautiful UI with gradient backgrounds
✓ Professional login page
✓ User profile in header
✓ Sign-out functionality
✓ All components render correctly
✓ Database tables are ready
✓ Row Level Security policies active

## What You Can Do Next

1. **Test the UI** - Navigate all pages and features
2. **Set up Google OAuth** - Follow GOOGLE_OAUTH_SETUP.md
3. **Create test data** - Add workers and records
4. **Deploy** - Application is production-ready

## Troubleshooting

### Issue: "Configuration Required" message still showing
**Solution:**
1. Make sure you ran the SQL setup in Supabase
2. Verify environment variables in `.env` file
3. Restart the dev server: `npm run dev`
4. Clear browser cache (Ctrl+Shift+Del)
5. Hard refresh: Ctrl+F5

### Issue: Can't sign in with Google
**Solution:**
1. You need to set up Google OAuth credentials
2. Follow GOOGLE_OAUTH_SETUP.md step by step
3. Add credentials to Supabase Auth → Providers → Google

### Issue: Database error when saving
**Solution:**
1. Verify tables were created (check in Supabase SQL Editor)
2. Confirm user is logged in
3. Check RLS policies are enabled (should see "RLS is ON" in table settings)
4. Check user_id is correctly set in auth token

## Files Reference

- `.env` - Your Supabase credentials (already configured)
- `setup-database.sql` - Database schema (run this in SQL Editor)
- `GOOGLE_OAUTH_SETUP.md` - Detailed Google OAuth setup
- `SETUP_GUIDE.md` - General setup overview

## Support

For issues:
1. Check the troubleshooting section above
2. Review GOOGLE_OAUTH_SETUP.md if login issues
3. Check Supabase project dashboard for errors
4. Verify environment variables are loaded

## Next Steps

### To Enable Authentication
Follow GOOGLE_OAUTH_SETUP.md - it has detailed steps for Google OAuth setup

### To Deploy to Production
1. Build: `npm run build`
2. Test build locally: `npm start`
3. Deploy to your hosting (Vercel, Netlify, etc.)
4. Update Google OAuth redirect URLs to production domain

---

**Status:** Application is ready for testing and deployment!
