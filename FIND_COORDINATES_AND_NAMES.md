# How to Get Latitude/Longitude & Names for Western Guessr

Like MacGuessr, your locations can be **anywhere on campus** — indoors, outdoors, paths, courtyards, entrances, lawns, etc. The **name** describes the spot; the **coordinates** are the exact point on the map.

---

## 1. What the "name" is for

The **name** is what players see when they get the answer right (e.g. after "Next Round"). It should clearly identify **that specific spot**, not always the whole building.

### Examples of good names

| Type of spot | Example names |
|--------------|----------------|
| **Building** | `University College`, `Weldon Library`, `Alumni Hall` |
| **Outdoor area** | `UC Courtyard`, `Concrete Beach`, `Middlesex College lawn` |
| **Path or walkway** | `Path between Weldon and UC`, `Sidewalk near UCC` |
| **Entrance or corner** | `Alumni Hall main entrance`, `North side of Physics Building` |
| **Landmark** | `The Mustang statue`, `Fountain near UC`, `Garden by Somerset` |
| **Indoor** | `Weldon Library 2nd floor`, `UCC food court`, `Alumni Hall lobby` |

Rules of thumb:
- Short and clear.
- Describes the spot in the photo (courtyard, path, entrance, etc.).
- Can be a building name, area name, or a short phrase.

---

## 2. How to get latitude and longitude

You need the **exact point** where the photo was taken (or the center of the area). Two easy ways:

---

### Method A: Google Maps (easiest)

1. Go to [Google Maps](https://www.google.com/maps).
2. Search for **Western University, London, ON** (or the building, e.g. `University College Western University`).
3. **Right‑click** on the exact spot on the map (where the photo was taken).
4. In the menu, click the **coordinates** at the top (e.g. `43.0096, -81.2737`).
   - They’re copied. First number = **latitude**, second = **longitude**.
5. In Supabase:
   - **latitude** = first number (e.g. `43.0096`)
   - **longitude** = second number (e.g. `-81.2737`) — keep the minus if it’s there.

**Tip:** Zoom in so you’re clicking the right building, courtyard, or path.

---

### Method B: Google Maps – manual copy

1. Right‑click the spot → click the coordinates to copy.
2. They look like: `43.0096, -81.2737`.
3. Split them:
   - Before the comma → **latitude**
   - After the comma → **longitude** (include the `-` for West).

---

### Method C: On your phone (if the photo was taken there)

1. Open the **photo** in your phone’s gallery.
2. Check **Info** / **Details** (or “Location”).
3. If it has a location, tap it to open in Maps, then get the coordinates from there, or use an EXIF app to read latitude/longitude.

---

## 3. What the numbers mean

- **Latitude** (first): how far north/south. Western is around **43.00–43.02**.
- **Longitude** (second): how far east/west. Western is around **-81.27 to -81.28** (negative = West).

Example: `43.0096, -81.2737` = a point on Western’s main campus.

---

## 4. Examples for Western (outdoor + indoor)

You can use these as templates and **swap in your own coordinates** from Google Maps.

| Name | Type | latitude | longitude | Notes |
|------|------|----------|-----------|-------|
| University College | Building | 43.0096 | -81.2737 | Classic UC |
| UC Courtyard | Outdoor | 43.0095 | -81.2738 | Inner yard |
| Concrete Beach | Outdoor | 43.0090 | -81.2740 | Lawn area |
| Path between Weldon and UC | Path | 43.0092 | -81.2735 | Walkway |
| Weldon Library entrance | Entrance | 43.0089 | -81.2731 | Main doors |
| Middlesex College lawn | Outdoor | 43.0085 | -81.2728 | Grass in front |
| UCC main entrance | Entrance | 43.0094 | -81.2749 | Student centre |
| Alumni Hall south side | Outdoor | 43.0102 | -81.2744 | Building + surroundings |

For each, take a photo of that spot, get the exact point from Google Maps, and use:
- **name**: as in the table (or your own better name).
- **latitude** / **longitude**: from the right‑click.

---

## 5. Filling the `locations` row in Supabase

For each location:

| Column | What to put |
|--------|-------------|
| **name** | Short, clear name of the spot (see examples above). |
| **latitude** | From Google Maps (e.g. `43.0096`). |
| **longitude** | From Google Maps (e.g. `-81.2737`). |
| **image_url** | Link to the photo (yours in Supabase Storage, or a URL). |
| **description** | Optional, e.g. `Courtyard between UC and Weldon`. |
| **is_active** | ON. |
| **usage_count** | `0`. |

---

## 6. Location = the spot, not only “inside”

As in MacGuessr:

- **Indoors:** “Weldon Library 2nd floor”, “UCC food court”.
- **Outdoors:** “UC Courtyard”, “Concrete Beach”, “Path near Somerset”.
- **Buildings:** “University College”, “Alumni Hall”.
- **Mixed:** “Alumni Hall main entrance” (could be the steps/plaza outside).

The **coordinates** should match the **exact place in the photo**; the **name** should describe that place.

---

## 7. Quick checklist for each new location

1. Take or pick a photo of a **specific spot** on campus.
2. In Google Maps, **right‑click that spot** and copy the coordinates.
3. Put **latitude** and **longitude** into Supabase (first and second number).
4. Choose a **name** that identifies that spot (building, area, path, entrance, etc.).
5. Add **image_url**, set **is_active** ON, **usage_count** 0, and save.

---

## 8. If you’re still using test/placeholder images

Until you have real campus photos:

- You can keep using the Unsplash URLs from `ADD_LOCATIONS_STEPS.md` for testing.
- **name** and **latitude/longitude** can still be real Western spots from Google Maps; that way the map and the “answer” make sense.

When you’re ready, replace those `image_url` values with your own Western campus images.
