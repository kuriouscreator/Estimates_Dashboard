# Supabase Setup Instructions

Your Estimate Dashboard has been successfully configured to work with Supabase! Here's what you need to do to complete the setup:

## 1. Database Setup

1. Go to your Supabase project dashboard at [supabase.com](https://supabase.com)
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-schema.sql` into the SQL Editor
4. Run the SQL to create the database tables and sample data

## 2. Environment Configuration

The `.env.local` file has been created with your Supabase credentials. Make sure the values are correct:

```env
VITE_SUPABASE_URL=https://wqrksemxhclgafkmnrjl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcmtzZW14aGNsZ2Fma21ucmpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNzAwNzAsImV4cCI6MjA3Mjc0NjA3MH0.REsp3NWt7EcdfVMUBa1wh76IXKvaSxN20Mmr6Dof6Gs
```

## 3. What's Been Added

### New Files:
- `src/lib/supabase.js` - Supabase client configuration
- `src/services/estimatesService.js` - Data service layer for CRUD operations
- `src/hooks/useEstimates.js` - Custom React hook for managing estimates data
- `database-schema.sql` - Database schema and sample data
- `.env.local` - Environment variables for Supabase credentials

### Updated Files:
- `src/App.jsx` - Now uses Supabase instead of localStorage
- `package.json` - Added @supabase/supabase-js dependency

## 4. Features

Your app now includes:

✅ **Real-time data synchronization** - Changes are automatically synced across browser tabs
✅ **Persistent storage** - Data is stored in Supabase database instead of localStorage
✅ **Error handling** - Proper error states and loading indicators
✅ **Offline resilience** - Better error handling for network issues
✅ **Data validation** - Database-level constraints and validation

## 5. Database Schema

The `estimates` table includes:
- All the same fields as your original data structure
- Automatic timestamps (`created_at_iso`, `updated_at`)
- Database indexes for better performance
- Row Level Security (RLS) enabled
- Sample data for testing

## 6. Running the Application

1. Make sure you've run the database schema SQL in Supabase
2. Start your development server:
   ```bash
   npm run dev
   ```
3. Your app should now load data from Supabase!

## 7. Testing

- The app will show a loading state while fetching data
- If there are connection issues, you'll see an error message with a retry button
- All CRUD operations (Create, Read, Update, Delete) now work with Supabase
- Real-time updates are enabled - try opening the app in multiple browser tabs

## 8. Security Notes

- The current setup allows anonymous access to all data
- For production use, consider implementing proper authentication
- You can modify the RLS policies in Supabase to restrict access as needed

## 9. Troubleshooting

If you encounter issues:

1. **Check your Supabase credentials** in `.env.local`
2. **Verify the database schema** was created successfully
3. **Check the browser console** for any error messages
4. **Ensure your Supabase project** is active and accessible

The app will gracefully handle connection errors and show appropriate error messages to users.
