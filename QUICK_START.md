# 🚀 Quick Start - Get Running in 10 Minutes

## Step 1: Supabase Setup (5 min)

1. **Sign up**: https://supabase.com → Sign up with GitHub
2. **Create project**: New Project → Name: `western-guessr` → Free plan
3. **Get keys**: Settings → API → Copy URL and anon key
4. **Run SQL**: SQL Editor → Paste `supabase-schema.sql` → Run
5. **Storage**: Storage → New bucket → Name: `images` → Public: ON

## Step 2: Environment Variables (1 min)

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
VITE_MAPBOX_ACCESS_TOKEN=
```

## Step 3: Add Test Data (2 min)

1. Table Editor → locations → Insert row
2. Add 5 locations with these coordinates:
   - University College: `43.0096, -81.2737`
   - Weldon Library: `43.0089, -81.2731`
   - Alumni Hall: `43.0102, -81.2744`
   - Physics Building: `43.0083, -81.2722`
   - UCC: `43.0094, -81.2749`

## Step 4: Run the App (2 min)

```bash
npm install
npm run dev
```

Open: http://localhost:5173

## ⚠️ Mapbox (Optional for now)

The app will work without Mapbox, but the map won't show. To add it later:
1. Sign up at mapbox.com
2. Get access token
3. Add to `.env` file

---

**Full detailed guide**: See `SUPABASE_SETUP.md`
