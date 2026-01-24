# Quick Setup Guide

## Initial Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** and paste the contents of `supabase-schema.sql`
4. Go to **Storage** and create a new bucket:
   - Name: `images`
   - Public: Yes
5. Go to **Settings > API** and copy:
   - Project URL
   - Anon/Public key

### 3. Set Up Mapbox

1. Go to [mapbox.com](https://mapbox.com) and create a free account
2. Go to **Account > Access Tokens**
3. Copy your default public token

### 4. Create Environment File

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-token-here
```

### 5. Add Initial Data

Before you can play, you need to add some locations to the database. You can do this through the Supabase dashboard:

1. Go to **Table Editor > locations**
2. Click **Insert > Insert row**
3. Fill in:
   - `name`: Location name (e.g., "University College")
   - `latitude`: 43.0096 (example)
   - `longitude`: -81.2737 (example)
   - `image_url`: URL to your image (can be from Supabase Storage or external)
   - `description`: Optional description
   - `is_active`: true
   - `usage_count`: 0

**Important**: You need at least 5 locations to start, but ideally 150-200 for a good experience.

### 6. Upload Images to Supabase Storage

1. Go to **Storage > images**
2. Upload your campus photos
3. Copy the public URL for each image
4. Use these URLs in the `image_url` field when creating locations

### 7. Run the App

```bash
npm run dev
```

Visit `http://localhost:5173`

## Git Setup (When Ready)

If you want to push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit: Western Guessr setup"
git branch -M main
git remote add origin https://github.com/yourusername/uwoguessr.git
git push -u origin main
```

## Next Steps

1. Add more campus locations (aim for 150-200)
2. Test the daily challenge system
3. Test the contribution flow
4. Deploy to Vercel when ready

## Troubleshooting

### Map not showing
- Check that `VITE_MAPBOX_ACCESS_TOKEN` is set correctly
- Make sure you're using a valid Mapbox token

### Supabase errors
- Verify your Supabase URL and anon key
- Check that you've run the SQL schema
- Make sure RLS policies are set up correctly

### Images not loading
- Check image URLs are accessible
- Verify Supabase Storage bucket is public
- Check browser console for CORS errors
