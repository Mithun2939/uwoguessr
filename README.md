# Western Guessr 🎓

A GeoGuessr-style game for Western University's campus. Test your knowledge of campus locations by guessing where photos were taken!

## Features

- 🎯 **Daily Challenges**: 5 random campus locations each day
- 🗺️ **Interactive Map**: Click on Mapbox maps to place your guesses
- 🏆 **Leaderboard**: Compete with daily, weekly, and all-time rankings
- 📸 **Contribute**: Submit your own campus photos for review
- 📊 **Score System**: Points based on distance (closer = more points!)

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL
- **Backend**: Supabase (PostgreSQL + Storage)
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- A Mapbox account (free tier works)

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the SQL from `supabase-schema.sql`
3. Go to Storage and create a bucket named `images` (make it public)
4. Get your project URL and anon key from Settings > API

### 3. Set Up Mapbox

1. Create an account at [mapbox.com](https://mapbox.com)
2. Get your access token from Account > Access Tokens

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
```

### 5. Add Initial Locations

You'll need to add some initial campus locations to the database. You can do this through:

- Supabase Dashboard > Table Editor > locations
- Or create a script to seed initial data

Example location:
```sql
INSERT INTO locations (name, latitude, longitude, image_url, description, is_active)
VALUES (
  'University College',
  43.0096,
  -81.2737,
  'https://your-image-url.com/image.jpg',
  'The iconic Gothic Revival building',
  true
);
```

**Important**: You'll need at least 150-200 images to launch properly. Make sure to:
- Compress images before uploading (the app does this automatically for submissions)
- Use consistent image dimensions (recommended: 1920x1080 or similar)
- Store images in Supabase Storage or a CDN

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## Project Structure

```
uwoguessr/
├── src/
│   ├── components/      # Reusable components (Map, Navbar)
│   ├── pages/          # Page components (Home, Game, Leaderboard, etc.)
│   ├── services/       # API services (Supabase calls)
│   ├── lib/            # Configuration (Supabase client)
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions (game logic, image compression)
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── supabase-schema.sql # Database schema
└── README.md
```

## Key Features Explained

### Daily Challenge System

- Each day, 5 locations are selected sequentially (not randomly) to avoid repeats
- Locations are selected based on lowest `usage_count` to ensure fair distribution
- Once a location is used, its `usage_count` is incremented

### Scoring System

- Maximum 5000 points per round
- Points decrease based on distance from actual location
- Formula: `5000 * (1 - distance / 500)` for distances up to 500m
- Beyond 500m, score is 0

### Image Compression

- All user-submitted images are automatically compressed
- Max dimensions: 1920x1080
- Quality: 80% JPEG
- Helps with loading times and storage costs

### Contribution System

- Users can submit photos with location data
- All submissions start as `pending`
- Admin review required before approval
- Approved submissions become active locations

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically:
- Build your app
- Deploy on every push to main
- Provide a free SSL certificate

## Admin Functions

To manage submissions and locations, you can:

1. Use Supabase Dashboard directly
2. Create admin pages (not included in this starter)
3. Use Supabase CLI for bulk operations

To approve a submission:
```sql
-- First, add to locations
INSERT INTO locations (name, latitude, longitude, image_url, description, is_active)
SELECT name, latitude, longitude, image_url, description, true
FROM submissions
WHERE id = 'submission-id';

-- Then update submission status
UPDATE submissions
SET status = 'approved'
WHERE id = 'submission-id';
```

## Tips from the Community

- Start with 150-200 images minimum
- Compress all images before uploading
- Use sequential selection (not random) to avoid repeats
- Review all user submissions before approving
- Consider adding a moderation queue UI for easier management

## License

This is a student project. Feel free to use and modify for your own campus!

## Contributing

This is a personal project, but suggestions and improvements are welcome!

---

Built with ❤️ for Western University students
