# Estimate Dashboard

A modern, responsive estimate tracking application built with React, Vite, Tailwind CSS, and Supabase. Track initial and final estimates with real-time data synchronization and persistent storage.

## 🚀 Features

- **Real-time Data Sync** - Changes sync across browser tabs instantly
- **Persistent Storage** - Data stored in Supabase database
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Estimate Tracking** - Track initial and final estimates with status management
- **Productivity Calculator** - Calculate estimates per hour/day based on work hours
- **Period Views** - Daily, weekly, and monthly estimate queues
- **Modern UI** - Clean, accessible interface with customizable accent colors

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account

## 🎨 Frontend Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kuriouscreator/Estimates_Dashboard.git
cd Estimates_Dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** Replace the placeholder values with your actual Supabase project credentials.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### 5. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🗄️ Backend Setup (Supabase)

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name:** `estimate-dashboard` (or your preferred name)
   - **Database Password:** Create a strong password
   - **Region:** Choose the closest region to your users
6. Click "Create new project"

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

3. Update your `.env.local` file with these values:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 3. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database-schema.sql` from this repository
3. Paste the SQL into the editor
4. Click **Run** to execute the schema

This will create:
- `estimates` table with all necessary fields
- Database indexes for better performance
- Row Level Security (RLS) policies
- Sample data for testing

### 4. Configure Row Level Security (Optional)

The default setup allows anonymous access for development. For production:

1. Go to **Authentication** → **Policies**
2. Review and modify the RLS policies as needed
3. Consider implementing user authentication for better security

### 5. Test the Connection

1. Start your development server: `npm run dev`
2. Open the application in your browser
3. Check the browser console for connection logs
4. Try creating, editing, or deleting an estimate

## 🏗️ Project Structure

```
Estimate_Dashboard/
├── src/
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   │   └── useEstimates.js # Estimates data management
│   ├── lib/                # External library configurations
│   │   └── supabase.js     # Supabase client setup
│   ├── services/           # Data service layer
│   │   └── estimatesService.js # CRUD operations
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── database-schema.sql     # Database setup script
├── .env.local             # Environment variables (create this)
├── .gitignore             # Git ignore rules
└── package.json           # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🎯 Usage

### Creating Estimates
1. Fill out the estimate form with required fields
2. Click "Save" to store in Supabase
3. Estimates appear in real-time across all browser tabs

### Managing Estimates
- **Work Queue:** View and update estimates in progress
- **Final Queue:** Track final estimates awaiting billing
- **Period Queues:** Filter estimates by daily, weekly, or monthly periods

### Productivity Calculator
- Set overtime and PTO hours for the week
- View estimates per hour and per day calculations
- Navigate between different weeks

## 🔒 Security Notes

- The current setup allows anonymous access to all data
- For production use, consider implementing proper authentication
- Environment variables are excluded from version control
- Row Level Security is enabled on the database

## 🐛 Troubleshooting

### Connection Issues
- Verify your Supabase credentials in `.env.local`
- Check that the database schema has been created
- Ensure your Supabase project is active

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify all environment variables are set

### Database Issues
- Check Supabase dashboard for any error logs
- Verify RLS policies if you're getting permission errors
- Ensure the estimates table exists and has the correct schema

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the Supabase documentation
3. Open an issue on GitHub

---

**Happy estimating!** 🎯
