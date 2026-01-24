# Deploy UwoGuessr to Vercel — Step by Step

Follow these steps in order. Do one, then the next.

---

## Part 1: Get your code on GitHub

You need the project on GitHub before Vercel can deploy it.

### 1.1 — Open a terminal in your project

- In VS Code / Cursor: **Terminal → New Terminal** (or `` Ctrl+` ``).
- Or open **PowerShell** or **Command Prompt** and run:
  ```text
  cd C:\uwoguessr
  ```

### 1.2 — Check for a `index.lock` file

- If `git add` or `git commit` ever said `index.lock: File exists`, run:
  ```powershell
  Remove-Item -Force .git\index.lock -ErrorAction SilentlyContinue
  ```

### 1.3 — Stage all files

```powershell
git add .
```

### 1.4 — Commit

```powershell
git commit -m "Add favicon and prep for Vercel"
```

*(Use any message you like.)*

### 1.5 — Push to GitHub

```powershell
git push origin main
```

- If it asks for login, use your GitHub username and a **Personal Access Token** (not your password).  
- If you don’t have a repo yet: create one at [github.com/new](https://github.com/new), then:

  ```powershell
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
  git push -u origin main
  ```

---

## Part 2: Create a Vercel account

### 2.1 — Go to Vercel

- Open: [vercel.com](https://vercel.com)

### 2.2 — Click “Sign Up”

- Top right: **Sign Up**

### 2.3 — Sign up with GitHub

- Choose **“Continue with GitHub”**
- Approve the popup so Vercel can see your repos (you can limit it to just `uwoguessr` if you want)

### 2.4 — Finish sign‑up

- If needed, enter email or extra details.  
- You should land on the Vercel **Dashboard**.

---

## Part 3: Add your project to Vercel

### 3.1 — Start “Add New”

- On the Dashboard, click **“Add New…”**
- Click **“Project”**

### 3.2 — Find `uwoguessr`

- You should see a list of your GitHub repositories.
- Find **uwoguessr** (or the exact repo name you use).

### 3.3 — Import it

- Click **“Import”** next to `uwoguessr`.

### 3.4 — Check project settings (do not click Deploy yet)

On the “Configure Project” screen, check:

| Field | Value |
|-------|--------|
| **Framework Preset** | Vite |
| **Root Directory** | `./` (leave default) |
| **Build Command** | `npm run build` (or leave default) |
| **Output Directory** | `dist` (Vite’s default) |

- If **Override** is shown, you can set:
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`

---

## Part 4: Add environment variables (Supabase)

Your app needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to talk to Supabase.

### 4.1 — Open the env section

- On the same “Configure Project” page, find **“Environment Variables”**.

### 4.2 — Add `VITE_SUPABASE_URL`

- **Name:** `VITE_SUPABASE_URL`  
- **Value:** paste your Supabase project URL  
  - From [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Settings → API** → **Project URL**
- Leave **Environment** as: Production, Preview, Development (or at least **Production**).
- Click **Add** or **Save**.

### 4.3 — Add `VITE_SUPABASE_ANON_KEY`

- **Name:** `VITE_SUPABASE_ANON_KEY`  
- **Value:** paste your Supabase **anon public** key  
  - Same place: **Settings → API** → **Project API keys** → **anon public**
- **Environment:** same as above.
- Click **Add** or **Save**.

### 4.4 — Confirm

- You should see both variables listed.  
- Do **not** put your `.env` file in the repo; Vercel uses what you typed here.

---

## Part 5: Deploy

### 5.1 — Start the deploy

- Click **“Deploy”** at the bottom of the Configure Project page.

### 5.2 — Wait for the build

- You’ll see a log: “Building…” and then “Deploying…”
- Usually 1–2 minutes.  
- If it turns red, look at the logs (click the failed step) to see the error.

### 5.3 — Get your URL

- When it’s done, you’ll see **“Congratulations”** and a link like:
  ```text
  https://uwoguessr-xxxx.vercel.app
  ```
- Click it to open your site.

---

## Part 6: After the first deploy

### 6.1 — Check the site

- Open the Vercel URL.
- Try: Home, Daily Challenge, Leaderboard, etc.
- If something that needs Supabase doesn’t work, re‑check **Part 4** (env vars) and that RLS / Supabase is set up correctly.

### 6.2 — Custom domain (optional)

- In the Vercel project: **Settings → Domains**.
- Add a domain you own and follow the DNS steps Vercel shows.

### 6.3 — Future updates

Whenever you change the code:

1. In your project folder:
   ```powershell
   git add .
   git commit -m "Describe your changes"
   git push origin main
   ```
2. Vercel will automatically build and deploy.  
3. In 1–2 minutes the live site will match your latest push.

---

## Quick reference

| What | Where / Command |
|------|------------------|
| Vercel | [vercel.com](https://vercel.com) |
| Supabase URL & anon key | Supabase project → **Settings → API** |
| Build command | `npm run build` |
| Output directory | `dist` |
| Env vars in Vercel | Project → **Settings → Environment Variables** (or during “Add New” → Project) |

---

## Favicon (W on purple)

- File: `public/favicon.svg`  
- White **W** on a purple (`#6b21a8`) square with rounded corners.  
- It’s already linked in `index.html` as `/favicon.svg`. After you deploy, the browser tab should show the W icon.

---

## If the build fails

1. In Vercel, open the project → **Deployments** → click the failed deploy.  
2. Open the **“Building”** (or “Build”) step and read the last lines of the log.  
3. Typical causes:
   - **TypeScript error** → fix it locally, commit, push.  
   - **Missing env var** → add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in **Settings → Environment Variables**, then **Redeploy** (Deployments → ⋮ → Redeploy).  
   - **Wrong Output Directory** → set it to `dist` and redeploy.
