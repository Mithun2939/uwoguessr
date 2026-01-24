# ✅ You Ran the SQL! What's Next?

Great job running the SQL schema! Now follow these steps to finish setup:

## ✅ Step 1: Create Storage Bucket (2 minutes)

1. In Supabase, click **"Storage"** in the left sidebar
2. Click **"Create a new bucket"** button
3. Fill in:
   - **Name**: Type exactly `images` (lowercase)
   - **Public bucket**: Toggle this **ON** (very important!)
4. Click **"Create bucket"**

### Set Up Storage Policies

1. Click on the **"images"** bucket you just created
2. Click the **"Policies"** tab at the top
3. Click **"New Policy"** button
4. Select **"For full customization"**
5. Name it: `Allow public uploads`
6. In the policy definition box, paste this:

```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow public viewing"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');
```

7. Click **"Review"** then **"Save policy"**

---

## ✅ Step 2: Get Your API Keys (1 minute)

1. In Supabase, click **"Settings"** (gear icon ⚙️ at bottom of sidebar)
2. Click **"API"** in the settings menu
3. You'll see:
   - **Project URL**: Copy this (looks like `https://xxxxx.supabase.co`)
   - **anon public key**: Copy this (long string starting with `eyJ...`)
4. **Save both somewhere** - you'll paste them in the next step!

---

## ✅ Step 3: Create .env File (2 minutes)

1. In Cursor/VS Code, right-click on the `uwoguessr` folder
2. Click **"New File"**
3. Name it exactly: `.env` (with the dot!)
4. Open the file and paste this:

```env
VITE_SUPABASE_URL=paste_your_url_here
VITE_SUPABASE_ANON_KEY=paste_your_key_here
```

5. Replace:
   - `paste_your_url_here` with your Project URL from Step 2
   - `paste_your_key_here` with your anon key from Step 2
6. Save the file (Ctrl+S)

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.abcdefghijklmnopqrstuvwxyz
```

---

## ✅ Step 4: Add Test Locations (5 minutes)

You need at least 5 locations to test the game. Here's how:

1. In Supabase, click **"Table Editor"** in the left sidebar
2. Click on the **"locations"** table
3. Click **"Insert"** → **"Insert row"**
4. Fill in the form for each location:

### Location 1: University College
- **name**: `University College`
- **latitude**: `43.0096`
- **longitude**: `-81.2737`
- **image_url**: `https://images.unsplash.com/photo-1562774053-701939374585?w=800`
- **description**: `The iconic Gothic Revival building` (optional)
- **is_active**: ✅ Check the box
- **usage_count**: `0`
- Click **"Save"**

### Location 2: Weldon Library
- **name**: `Weldon Library`
- **latitude**: `43.0089`
- **longitude**: `-81.2731`
- **image_url**: `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800`
- **is_active**: ✅ Check the box
- **usage_count**: `0`
- Click **"Save"**

### Location 3: Alumni Hall
- **name**: `Alumni Hall`
- **latitude**: `43.0102`
- **longitude**: `-81.2744`
- **image_url**: `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800`
- **is_active**: ✅ Check the box
- **usage_count**: `0`
- Click **"Save"**

### Location 4: Physics Building
- **name**: `Physics & Astronomy Building`
- **latitude**: `43.0083`
- **longitude**: `-81.2722`
- **image_url**: `https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800`
- **is_active**: ✅ Check the box
- **usage_count**: `0`
- Click **"Save"**

### Location 5: UCC
- **name**: `University Community Centre`
- **latitude**: `43.0094`
- **longitude**: `-81.2749`
- **image_url**: `https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800`
- **is_active**: ✅ Check the box
- **usage_count**: `0`
- Click **"Save"**

---

## ✅ Step 5: Install Dependencies & Run (2 minutes)

1. Open terminal/command prompt
2. Navigate to your project:
   ```powershell
   cd C:\uwoguessr
   ```
3. Install packages:
   ```powershell
   npm install
   ```
   (This might take 1-2 minutes)

4. Start the app:
   ```powershell
   npm run dev
   ```

5. You should see something like:
   ```
   VITE v6.x.x  ready in xxx ms
   
   ➜  Local:   http://localhost:5173/
   ```

6. Open your browser and go to: **http://localhost:5173**

7. **You should see your app!** 🎉

---

## 🎮 Test It Out!

1. Click **"Start Daily Challenge"**
2. You should see a photo and a map
3. Click on the map to place your guess
4. Click **"Submit Guess"**
5. See your score!

---

## ❌ Troubleshooting

### "Missing Supabase environment variables"
- Check your `.env` file exists in `C:\uwoguessr\.env`
- Make sure it's named exactly `.env` (not `.env.txt`)
- Restart the dev server after creating `.env`

### "Failed to load challenge"
- Make sure you added at least 5 locations
- Check that all locations have `is_active` checked (true)

### Map not showing
- That's okay! The map uses OpenStreetMap and should work automatically
- If it doesn't show, check browser console for errors

### Can't see locations in Table Editor
- Make sure you're in the right project
- Click "Table Editor" → "locations" table
- You should see the 5 locations you added

---

## 🎉 You're Done!

Once you see the app running, you're all set! You can:
- Add more campus locations
- Test the daily challenge
- Try the contribution page
- Check the leaderboard

**Next Steps:**
- Add more locations (aim for 150-200 for launch)
- Replace test images with real campus photos
- Customize the styling if you want
