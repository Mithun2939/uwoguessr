# ✅ No Mapbox Required!

Good news! The app now uses **Leaflet with OpenStreetMap** instead of Mapbox. This means:

- ✅ **100% FREE** - No account needed
- ✅ **No credit card required**
- ✅ **No API keys needed**
- ✅ **Works immediately** - Just install dependencies and run!

## What Changed?

The app now uses:
- **Leaflet** - Free, open-source mapping library
- **OpenStreetMap** - Free, community-driven map tiles
- Same functionality, zero cost!

## Setup

You can skip the Mapbox setup entirely. Just:

1. Set up Supabase (see `SUPABASE_SETUP.md`)
2. Create `.env` file with only Supabase keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
3. Run `npm install` and `npm run dev`

That's it! The map will work without any Mapbox configuration.

## Why OpenStreetMap?

- **Free forever** - No usage limits
- **No registration** - Just works
- **Community maintained** - Updated by volunteers worldwide
- **Privacy friendly** - No tracking

Perfect for student projects! 🎓
