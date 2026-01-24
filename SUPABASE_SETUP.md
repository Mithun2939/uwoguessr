# Supabase Setup Guide - Step by Step

Follow these steps to set up Supabase for Western Guessr.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with:
   - GitHub (recommended - easiest)
   - Email
   - Google
4. Verify your email if needed

## Step 2: Create a New Project

1. Once logged in, click **"New Project"** (green button)
2. Fill in the project details:
   - **Name**: `western-guessr` (or any name you like)
   - **Database Password**: Create a strong password (SAVE THIS - you'll need it)
   - **Region**: Choose closest to you (e.g., `US East` or `US West`)
   - **Pricing Plan**: Select **"Free"** (perfect for getting started)
3. Click **"Create new project"**
4. Wait 2-3 minutes for your project to be created

## Step 3: Get Your API Keys

1. Once your project is ready, click on your project name
2. In the left sidebar, click **"Settings"** (gear icon at the bottom)
3. Click **"API"** in the settings menu
4. You'll see two important things:
   - **Project URL**: Copy this (looks like `https://xxxxx.supabase.co`)
   - **anon public key**: Copy this (long string starting with `eyJ...`)
5. **Save both of these** - you'll need them in Step 6

## Step 4: Create the Database Tables

1. In the left sidebar, click **"SQL Editor"**
2. Click **"New query"**
3. Open the file `supabase-schema.sql` from your project folder
4. Copy **ALL** the contents of that file
5. Paste it into the SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. You should see "Success. No rows returned" - this means it worked!

## Step 5: Set Up Storage for Images

1. In the left sidebar, click **"Storage"**
2. Click **"Create a new bucket"**
3. Fill in:
   - **Name**: `images` (exactly this name)
   - **Public bucket**: Toggle this to **ON** (very important!)
4. Click **"Create bucket"**

### Set Up Storage Policies (Important!)

1. Click on the **"images"** bucket you just created
2. Click the **"Policies"** tab
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Name it: `Allow public uploads`
6. Paste this SQL in the policy definition:

```sql
-- Allow anyone to upload
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'images');

-- Allow anyone to view
CREATE POLICY "Allow public viewing"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');
```

7. Click **"Review"** then **"Save policy"**

## Step 6: Add Environment Variables

1. In your project folder (`c:\uwoguessr`), create a file named `.env`
   - **Important**: The file name starts with a dot (`.env`)
   - If you can't create it, you might need to show hidden files in your file explorer
2. Open the `.env` file and paste this:

```env
VITE_SUPABASE_URL=paste_your_project_url_here
VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here
VITE_MAPBOX_ACCESS_TOKEN=you_will_add_this_later
```

3. Replace:
   - `paste_your_project_url_here` with the Project URL from Step 3
   - `paste_your_anon_key_here` with the anon key from Step 3
   - Leave Mapbox token for now (we'll add it later)

**Example of what it should look like:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.abcdefghijklmnopqrstuvwxyz1234567890
VITE_MAPBOX_ACCESS_TOKEN=
```

## Step 7: Add Some Test Data (Optional but Recommended)

To test the app, you'll need at least 5 locations. Here's how to add them:

1. In Supabase, go to **"Table Editor"** in the left sidebar
2. Click on the **"locations"** table
3. Click **"Insert"** → **"Insert row"**
4. Fill in the form:
   - **name**: `University College`
   - **latitude**: `43.0096`
   - **longitude**: `-81.2737`
   - **image_url**: `https://images.unsplash.com/photo-1562774053-701939374585?w=800` (or any image URL)
   - **description**: `The iconic Gothic Revival building` (optional)
   - **is_active**: Check the box (true)
   - **usage_count**: `0`
5. Click **"Save"**
6. Repeat for a few more locations (you need at least 5):
   - Weldon Library: `43.0089, -81.2731`
   - Alumni Hall: `43.0102, -81.2744`
   - Physics Building: `43.0083, -81.2722`
   - UCC: `43.0094, -81.2749`

## Step 8: Verify Everything Works

1. Go back to your project folder
2. Open terminal/command prompt
3. Run:
   ```bash
   npm install
   ```
4. Then run:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:5173`
6. You should see the app! (Map might not work yet until you add Mapbox token)

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure your `.env` file is in the root folder (`c:\uwoguessr\.env`)
- Make sure the file name is exactly `.env` (not `.env.txt`)
- Restart your dev server after creating `.env`

### "Failed to load challenge" error
- Make sure you added at least 5 locations in the database
- Check that locations have `is_active` set to `true`

### Can't see the SQL Editor
- Make sure you're in your project (click on project name in top left)
- SQL Editor is in the left sidebar

### Storage bucket not working
- Make sure the bucket is named exactly `images`
- Make sure "Public bucket" is toggled ON
- Make sure you added the storage policies

## Next Steps

Once Supabase is set up:
1. Set up Mapbox (see `SETUP.md`)
2. Add more campus locations (aim for 150-200)
3. Test the daily challenge feature
4. Test the contribution feature

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Check the browser console for error messages
