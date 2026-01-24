# 🚀 How to Run Your Website - Complete Guide

## Part 1: Finish Supabase Setup (5 minutes)

### ✅ Step 1: Create Storage Bucket (You mentioned this)

1. In Supabase, click **"Storage"** in left sidebar
2. Click **"Create a new bucket"**
3. Name: `images` (exactly this)
4. **Public bucket**: Toggle **ON** ✅
5. Click **"Create bucket"**

### ✅ Step 2: Add Storage Policies (Important!)

1. Click on the **"images"** bucket you just created
2. Click **"Policies"** tab at the top
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Name: `Allow public uploads`
6. Paste this in the policy box:

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

7. Click **"Review"** → **"Save policy"**

### ✅ Step 3: Add Test Locations (REQUIRED - You need at least 5!)

1. In Supabase, click **"Table Editor"** in left sidebar
2. Click on **"locations"** table
3. Click **"Insert"** → **"Insert row"**

**Add these 5 locations one by one:**

#### Location 1:
- **name**: `University College`
- **latitude**: `43.0096`
- **longitude**: `-81.2737`
- **image_url**: `https://images.unsplash.com/photo-1562774053-701939374585?w=800`
- **is_active**: ✅ Check box
- **usage_count**: `0`
- Click **"Save"**

#### Location 2:
- **name**: `Weldon Library`
- **latitude**: `43.0089`
- **longitude**: `-81.2731`
- **image_url**: `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800`
- **is_active**: ✅ Check box
- **usage_count**: `0`
- Click **"Save"**

#### Location 3:
- **name**: `Alumni Hall`
- **latitude**: `43.0102`
- **longitude**: `-81.2744`
- **image_url**: `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800`
- **is_active**: ✅ Check box
- **usage_count**: `0`
- Click **"Save"**

#### Location 4:
- **name**: `Physics & Astronomy Building`
- **latitude**: `43.0083`
- **longitude**: `-81.2722`
- **image_url**: `https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800`
- **is_active**: ✅ Check box
- **usage_count**: `0`
- Click **"Save"**

#### Location 5:
- **name**: `University Community Centre`
- **latitude**: `43.0094`
- **longitude**: `-81.2749`
- **image_url**: `https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800`
- **is_active**: ✅ Check box
- **usage_count**: `0`
- Click **"Save"**

**✅ You're done with Supabase!** Now let's run the app.

---

## Part 2: Run the Website (5 minutes)

### Step 1: Open Terminal

**Option A: In Cursor/VS Code**
- Press `` Ctrl + ` `` (backtick key) to open terminal
- Or go to: **Terminal** → **New Terminal**

**Option B: PowerShell/Command Prompt**
- Press `Windows Key + R`
- Type `powershell` and press Enter
- Navigate to your project:
  ```powershell
  cd C:\uwoguessr
  ```

### Step 2: Install Dependencies (First time only)

```powershell
npm install
```

**What this does:** Downloads all the packages your app needs (React, Supabase, Leaflet, etc.)

**Wait for it to finish** - it might take 1-2 minutes. You'll see lots of text scrolling.

**When it's done**, you'll see something like:
```
added 500 packages in 2m
```

### Step 3: Start the App

```powershell
npm run dev
```

**What you'll see:**
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 4: Open in Browser

1. **Copy this URL**: `http://localhost:5173`
2. **Open your browser** (Chrome, Firefox, Edge, etc.)
3. **Paste the URL** in the address bar
4. **Press Enter**

**🎉 You should see your Western Guessr website!**

---

## What You Should See

1. **Home page** with:
   - "Western Guessr" title
   - "Start Daily Challenge" button
   - Navigation (Home, Leaderboard, Contribute, About)

2. **Try it out:**
   - Click **"Start Daily Challenge"**
   - You should see a photo and a map
   - Click on the map to place your guess
   - Click **"Submit Guess"**
   - See your score!

---

## Troubleshooting

### ❌ "npm: command not found"

**Solution:** Node.js isn't installed
1. Go to [nodejs.org](https://nodejs.org)
2. Download and install Node.js (LTS version)
3. Restart your terminal
4. Try `npm install` again

### ❌ "Missing Supabase environment variables"

**Solution:** 
- Check `.env` file exists in `C:\uwoguessr\.env`
- Make sure it has your URL and key
- Restart the dev server (stop with `Ctrl+C`, then run `npm run dev` again)

### ❌ "Failed to load challenge"

**Solution:**
- Make sure you added at least 5 locations in Supabase
- Check all locations have `is_active` checked (true)
- Check your `.env` file has the correct keys

### ❌ Port 5173 already in use

**Solution:**
- Another app is using that port
- Stop the other app, or
- The terminal will show a different port (like 5174) - use that instead

### ❌ Map not showing

**Solution:**
- That's okay! The map uses OpenStreetMap
- Check browser console (F12) for errors
- Make sure you have internet connection

---

## Quick Checklist

**Supabase:**
- [x] SQL schema run
- [x] Storage bucket `images` created (public)
- [ ] Storage policies added
- [ ] At least 5 locations added to database

**Local Setup:**
- [x] `.env` file created with keys
- [ ] Dependencies installed (`npm install`)
- [ ] App running (`npm run dev`)
- [ ] Browser opened to `http://localhost:5173`

---

## Next Steps After It's Running

1. **Test the game:**
   - Play a full round (5 guesses)
   - Check the leaderboard
   - Try the contribute page

2. **Add more locations:**
   - Add real campus photos
   - Aim for 150-200 locations for launch

3. **Customize:**
   - Change colors/styling
   - Add your own branding

---

## Stopping the App

When you're done testing:
- Go back to the terminal
- Press **`Ctrl + C`** to stop the server
- The website will stop working (that's normal!)

To start it again later, just run `npm run dev` again!

---

## 🎉 You're Done!

Once you see the website running in your browser, you've successfully:
- ✅ Set up Supabase
- ✅ Created the database
- ✅ Configured your app
- ✅ Got it running locally!

**Congratulations!** 🎓
