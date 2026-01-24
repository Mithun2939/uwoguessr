# Add Locations in Table Editor - Step by Step

## Step 1: Open Table Editor

1. In Supabase, look at the **left sidebar**
2. Click **"Table Editor"** (icon looks like a grid/table)
3. You’ll see a list of tables: `locations`, `daily_challenges`, `leaderboard`, `submissions`

---

## Step 2: Open the locations table

1. Click the **"locations"** table
2. The table will open; it may be empty or have rows

---

## Step 3: Add a new row

1. Click the **"Insert"** button (top right, or **"Insert row"**)
2. A form will appear with columns: `name`, `latitude`, `longitude`, `image_url`, `description`, `is_active`, `usage_count`, etc.

---

## Step 4: Fill in Location 1 – University College

Type or paste exactly:

| Column       | Value |
|-------------|-------|
| **name**    | `University College` |
| **latitude**| `43.0096` |
| **longitude**| `-81.2737` |
| **image_url**| `https://images.unsplash.com/photo-1562774053-701939374585?w=800` |
| **description**| `The iconic Gothic Revival building` (or leave blank) |
| **is_active**| Turn **ON** (check the box) |
| **usage_count**| `0` |

- **id** and **created_at**: leave as default (Supabase fills these)
- Click **"Save"** (or ✓)

---

## Step 5: Add Location 2 – Weldon Library

1. Click **"Insert"** → **"Insert row"** again
2. Fill in:

| Column       | Value |
|-------------|-------|
| **name**    | `Weldon Library` |
| **latitude**| `43.0089` |
| **longitude**| `-81.2731` |
| **image_url**| `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800` |
| **is_active**| **ON** |
| **usage_count**| `0` |

3. Click **"Save"**

---

## Step 6: Add Location 3 – Alumni Hall

1. **Insert** → **Insert row**
2. Fill in:

| Column       | Value |
|-------------|-------|
| **name**    | `Alumni Hall` |
| **latitude**| `43.0102` |
| **longitude**| `-81.2744` |
| **image_url**| `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800` |
| **is_active**| **ON** |
| **usage_count**| `0` |

3. Click **"Save"**

---

## Step 7: Add Location 4 – Physics & Astronomy Building

1. **Insert** → **Insert row**
2. Fill in:

| Column       | Value |
|-------------|-------|
| **name**    | `Physics & Astronomy Building` |
| **latitude**| `43.0083` |
| **longitude**| `-81.2722` |
| **image_url**| `https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800` |
| **is_active**| **ON** |
| **usage_count**| `0` |

3. Click **"Save"**

---

## Step 8: Add Location 5 – University Community Centre

1. **Insert** → **Insert row**
2. Fill in:

| Column       | Value |
|-------------|-------|
| **name**    | `University Community Centre` |
| **latitude**| `43.0094` |
| **longitude**| `-81.2749` |
| **image_url**| `https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800` |
| **is_active**| **ON** |
| **usage_count**| `0` |

3. Click **"Save"**

---

## Step 9: Check you have 5 rows

1. In the **locations** table you should see **5 rows**
2. Each has: name, latitude, longitude, image_url, is_active = true, usage_count = 0

---

## Done

You now have 5 locations. The daily challenge can pick 5 images, so the game will work.

---

## Tips

- **description**: optional; you can leave it empty
- **is_active**: must be **ON** (true) for the game to use the location
- **usage_count**: must be `0`
- **latitude / longitude**: use the numbers exactly as shown (including minus for longitude)
- **image_url**: must be a full URL; the Unsplash links above are valid

---

## If a column is missing or different

If you don’t see `latitude`, `longitude`, `image_url`, `is_active`, or `usage_count`, the `locations` table might not match the schema. In that case, run the `supabase-schema.sql` in the SQL Editor again, or say what columns you see and we can adjust.
