# Contribute & Approve – User uploads and coordinates

## Flow

1. **Contribute** – Anyone uploads a photo, clicks the map to set **latitude & longitude**, and adds a name. Submission is stored with `image_url`, `latitude`, `longitude`, `name`, `description`, `status: pending`.
2. **Approve** – You approve in the **Supabase Dashboard** only (no Approve page in the app). Approve = copy the submission into `locations` (image, lat/lng, name, description, `is_active = true`, `usage_count = 0`) and set `status = approved`. Reject = set `status = rejected` only.

See **`SUPABASE_APPROVE.md`** for step‑by‑step instructions (Table Editor and SQL).

---

## One-time SQL (Supabase)

You only need policies for **Contribute** (insert into `submissions`). The schema and existing submission policies cover that.

If you ever added **“Anyone can insert locations”** or **“Anyone can update submission status”** for the old in‑app Approve page, you can remove them for security. See **`SUPABASE_APPROVE.md`** § “(Optional) Tighten security”.

---

## Storage (images bucket)

For **Contribute** uploads to work, the **`images`** bucket must:

- Exist and be **public**
- Have **INSERT** and **SELECT** policies on `storage.objects` for the `images` bucket.

**One-time setup:** run **`supabase-storage-setup.sql`** in the Supabase **SQL Editor**. It creates the bucket (if missing) and the needed storage policies.

Or manually: **Storage** → **New bucket** → name **`images`**, set **Public** ON → Create. Then **Policies** → New policy: allow **INSERT** and **SELECT** for `bucket_id = 'images'`.

---

## Pages

- **Contribute** – Upload photo, click map for lat/lng, name, optional description, Submit. Image is compressed and stored; the chosen coordinates are saved in `submissions` with `status: pending`.

---

## Summary

| Step       | Who   | What |
|------------|-------|------|
| Contribute | Anyone | Upload image, set lat/lng on map, add name → stored in `submissions` |
| Approve    | You (in Supabase Dashboard) | Copy into `locations` and set `status = approved`; or Reject = `status = rejected` only |
