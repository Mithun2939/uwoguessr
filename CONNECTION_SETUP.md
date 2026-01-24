# How the App Is Linked to Supabase (and How to Fix "Loading then Back to Start")

The app is already wired to Supabase. The link is your **.env** file. If "Start Daily Challenge" shows loading and then returns to home, do these 3 steps.

---

## 1. Run the fix in Supabase (required)

The database was missing a policy that lets the app **create** daily challenges.

1. In Supabase, open **SQL Editor**.
2. Click **New query**.
3. Open the file **`supabase-fix-policies.sql`** in your project and copy its contents.
4. Paste into the SQL Editor and click **Run**.

You should see something like "Success."

---

## 2. Check your .env file

The app reads Supabase from `.env` in the project root (`C:\uwoguessr\.env`).

It must contain **exactly**:

```
VITE_SUPABASE_URL=https://xlxnyeqzcsktfeisdpgx.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

- **VITE_SUPABASE_URL** – your Project URL from Supabase (Settings → API).
- **VITE_SUPABASE_ANON_KEY** – the **anon public** key from Settings → API.

**Important:** After changing `.env`, stop the dev server (`Ctrl+C`) and run `npm run dev` again.

---

## 3. Use the correct anon key

The **anon public** key usually looks like:

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...` (long, starts with `eyJ`).

If your key starts with **`sb_publishable_`** and it still fails:

1. In Supabase go to **Settings** → **API**.
2. Find the key labeled **anon** and **public** (not `service_role` and not `sb_publishable_`).
3. Copy that value and put it in `.env` as `VITE_SUPABASE_ANON_KEY=...`.
4. Restart `npm run dev`.

---

## 4. Confirm in Supabase

- **Table Editor → locations**: at least 5 rows, each with **is_active** = ON (checked).
- **SQL**: `supabase-fix-policies.sql` has been run so the app can insert into `daily_challenges`.

---

## 5. Restart the app

```powershell
cd C:\uwoguessr
npm run dev
```

Open http://localhost:5173 and try **Start Daily Challenge** again.

---

## 6. If it still fails

1. Open **Developer Tools** in the browser (F12).
2. Go to the **Console** tab.
3. Click **Start Daily Challenge** and check for red error messages.
4. If you see messages about "JWT" or "Invalid API key", your **VITE_SUPABASE_ANON_KEY** is wrong — use the anon public key from Settings → API (the long `eyJ...` one).

---

## Summary

| What | Where |
|------|--------|
| **Connection to Supabase** | `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` |
| **Allow creating challenges** | Run `supabase-fix-policies.sql` in Supabase SQL Editor |
| **Data for the game** | 5+ rows in `locations` with `is_active` = ON |
