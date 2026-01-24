# How to approve submissions in Supabase

Approvals are done only in the **Supabase Dashboard** (only people with your Supabase project access can approve). The app no longer has an Approve page.

**When you approve a submission**, you add it to the **main photo pile** (`locations`). The daily challenge picks **5 random photos** from that pile each day, so an approved photo can appear in the game on any future day.

---

## 1. Open your project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Open your **uwoguessr** project.

---

## 2. See pending submissions (you’re here)

You’re in **Table Editor** on the **`submissions`** table. Do this:

1. **Filter (optional)**  
   - **No filter** (or **Remove all filters**): you see *all* submissions. Use this to check if a new one arrived or to see approved/rejected.  
   - **Filter `status` = `pending`**: you see only pending. Use this when you have many rows and want to focus on what’s left to approve.  
   - To add the filter: **Filter** → column **`status`**, **`equals`**, **`pending`** → Apply.

2. **Pick one row to approve**  
   - **Where:** In the big table under the filter — you see a grid: each **row** is one submission (a horizontal line of cells), with columns like `id`, `name`, `image_url`, `latitude`, `longitude`, `description`, `status`, etc.  
   - **What to do:** **Click anywhere on one of those rows** (e.g. on the `name` cell or the `id` cell). The row will highlight and a **panel opens on the right** with that row’s full details. If no panel opens, you can still read the values directly from the cells in that row.  
   - **What to copy:** From that row (panel or cells), **copy or write down** these 5 values — you’ll paste them into `locations` in the next section:
     - **`image_url`** (long URL) — right‑click the cell → Copy, or triple‑click to select then Copy
     - **`latitude`** (e.g. `43.0096`)
     - **`longitude`** (e.g. `-81.2737`)
     - **`name`** (e.g. `University College`)
     - **`description`** (can be empty; if empty, you’ll leave `description` blank in `locations`)

---

## 3. Approve = add to the main photo pile, then mark approved

**Approve** does two things:  
1) Copy that submission into **`locations`** (the main photo pile the game uses).  
2) Set the submission’s **`status`** to **`approved`**.

### Option A: Table Editor (click-by-click)

**Step 1 – Add the photo to the main pile (`locations`)**

1. In the **left sidebar**, under **Table Editor**, click the **`locations`** table.  
   - The `submissions` table will switch to `locations`. You should see columns like `id`, `name`, `latitude`, `longitude`, `image_url`, `description`, `is_active`, `usage_count`, `created_at`.

2. Click **“Insert row”** or the **“+” / “New row”** button (usually top-right of the table).

3. A form or row editor appears. Fill in **only** these; leave **`id`** and **`created_at`** as default/empty so Supabase generates them:

   | Column        | What to enter                          |
   |---------------|----------------------------------------|
   | **name**      | Paste the `name` from the submission.  |
   | **latitude**  | Paste the `latitude` from the submission. |
   | **longitude** | Paste the `longitude` from the submission. |
   | **image_url** | Paste the full `image_url` from the submission. |
   | **description** | Paste the submission’s `description`, or leave **empty** if it was blank. |
   | **is_active** | Set to **`true`** (checkbox on, or choose `true` from the dropdown). |
   | **usage_count** | Set to **`0`**. |

4. Click **Save** (or the checkmark).  
   - The new row appears in `locations`. That photo is now in the **main photo pile** and can be randomly chosen for a future daily challenge.

**Step 2 – Mark the submission as approved**

1. In the **left sidebar**, click the **`submissions`** table again.

2. Find the **same submission** you just approved (same `name` / `image_url` / `created_at`).

3. **Click that row** to open the editor, or click the value in the **`status`** column to edit it.

4. Change **`status`** from **`pending`** to **`approved`**.

5. Click **Save**.  
   - You’re done. That submission is approved and its photo is in the game’s pool.

---

### Option B: SQL Editor (one query per submission)

This also adds the submission to the **main photo pile** (`locations`) and marks it `approved`.

1. In the left sidebar, go to **SQL Editor**.
2. In **Table Editor** → **`submissions`**, find the pending row and copy its **`id`** (e.g. `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).
3. In SQL Editor, **New query**, paste the SQL below. Replace **`'THE-SUBMISSION-UUID'`** with that `id` (keep the quotes).
4. Click **Run**. The submission is added to `locations` (main photo pile) and its `status` is set to `approved`.

```sql
-- Approve: copy into locations and mark approved
WITH sub AS (
  SELECT id, image_url, latitude, longitude, name, description
  FROM submissions
  WHERE id = 'THE-SUBMISSION-UUID' AND status = 'pending'
)
INSERT INTO locations (name, latitude, longitude, image_url, description, is_active, usage_count)
SELECT name, latitude, longitude, image_url, COALESCE(description, ''), true, 0
FROM sub;

-- Mark submission as approved
UPDATE submissions SET status = 'approved' WHERE id = 'THE-SUBMISSION-UUID';
```

---

## 4. Reject a submission

Reject = do **not** add to `locations`; only set `status` to `rejected`.

### Table Editor

1. In **`submissions`**, open the row.
2. Set **status** to **`rejected`** and save.

### SQL Editor

```sql
UPDATE submissions SET status = 'rejected' WHERE id = 'THE-SUBMISSION-UUID';
```

---

## 5. (Optional) Tighten security

If you previously added **“Anyone can insert locations”** or **“Anyone can update submission status”** so the in‑app Approve page could work, you can remove them now. The app no longer does those operations; only the Dashboard (with your Supabase login) does.

In **SQL Editor** run:

```sql
DROP POLICY IF EXISTS "Anyone can insert locations" ON locations;
DROP POLICY IF EXISTS "Anyone can update submission status" ON submissions;
```

If you never created those policies, this is safe to run (it will no‑op).

---

## Summary

| Action   | Where       | What you do |
|----------|-------------|-------------|
| Approve  | Table Editor or SQL | Copy submission → `locations` (is_active=true, usage_count=0), set submission `status` = `approved` |
| Reject   | Table Editor or SQL | Set submission `status` = `rejected` only |

Only users with access to your Supabase project can approve or reject.
