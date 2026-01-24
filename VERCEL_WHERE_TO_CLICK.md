# Vercel: exactly where to click

Step‑by‑step using only the Vercel web UI.

---

## 1. Open your project

1. Go to **https://vercel.com** and sign in.
2. On the **Dashboard** you see “Your Projects” / a list of projects.
3. Click the project (e.g. **uwoguessr** or **UwoGuessr**).
4. You’re on the project’s main page (Overview / Deployments).

---

## 2. Redeploy (and turn off build cache)

### 2.1 — Go to Deployments

- In the top navigation (tabs under the project name), click **Deployments**.
- You’ll see a list of deployments (timestamps, branches, status).

### 2.2 — Open the latest deployment

- The **top row** is usually the latest.
- Click that row (anywhere on it, or on the deployment name/URL) to open the **deployment detail** page.

### 2.3 — Redeploy

- On the deployment detail page, look for **three dots (⋯)** or a **“Redeploy”** (or “…” then “Redeploy”).
  - Often top‑right, or in a “…” menu.
- Click **⋯** (or the menu) → **Redeploy**.

### 2.4 — Turn off build cache

- A small dialog or panel appears: “Redeploy” with options.
- Find **“Use existing Build Cache”** (or “Use existing cache”).
- **Uncheck** it.
- Click **Redeploy** (or **Confirm** / **Redeploy**).

### 2.5 — Wait

- You’re sent back to the deployment list or the new deployment’s page.
- Wait until the **new** deployment shows **Ready** or a green check. The old one may show “Building” then “Ready”.

---

## 3. Project Settings (General)

### 3.1 — Go to Settings

- From the project’s main page (Overview or Deployments), click **Settings** in the **top** navigation (same bar as Deployments, Logs, etc.).
- You’re in **Project Settings**.

### 3.2 — General

- In the **left sidebar**, under “Project”, click **General**.
- You’ll see: Project Name, Framework Preset, Root Directory, Build & Development Settings, etc.

### 3.3 — Root Directory

- Find **“Root Directory”**.
- It’s usually a text field, sometimes with “Edit” next to it.
- It should be **empty** or **`.`** (project root).
- If it says `uwoguessr` or anything else, click **Edit**, clear it (or set `.`), then **Save**.

### 3.4 — Build & Development Settings

- Scroll to **“Build & Development Settings”** (or “Build Command”, “Output Directory”).
- You may see **“Override”** (switch/toggle). Turn it **On** if you want to set these explicitly.

  | Setting            | What to set        |
  |--------------------|--------------------|
  | **Build Command**  | `npm run build`    |
  | **Output Directory** | `dist`          |

- If “Output Directory” is wrong (e.g. `build`), change it to **dist** and **Save**.

---

## 4. Environment Variables

### 4.1 — Go to Environment Variables

- Still in **Settings** (top tab).
- In the **left sidebar**, find **Environment Variables** (under “Project” or “Configuration”).
- Click **Environment Variables**.

### 4.2 — Add `VITE_SUPABASE_URL`

- You’ll see a list of variables (or “No variables”).
- Find **“Add New”** or **“Add”** or **“Key” / “Value”** fields at the top.

- **Key (Name):**  
  Type exactly: **`VITE_SUPABASE_URL`**

- **Value:**  
  - Open [supabase.com/dashboard](https://supabase.com/dashboard) → your project → **Settings** (gear) → **API**.
  - Copy **“Project URL”** (e.g. `https://xxxxx.supabase.co`).
  - Paste into the **Value** field in Vercel.

- **Environments:**  
  - Check **Production** (and **Preview** if you use preview deployments).

- Click **Save** (or **Add**).

### 4.3 — Add `VITE_SUPABASE_ANON_KEY`

- Click **Add New** / **Add** again (or the next row).

- **Key (Name):**  
  **`VITE_SUPABASE_ANON_KEY`**

- **Value:**  
  - In Supabase: **Settings → API** → **Project API keys**.
  - Copy the **anon** **public** key (long string, starts with `eyJ...`).  
  - Do **not** use the **service_role** (secret) key.
  - Paste into the **Value** field in Vercel.

- **Environments:**  
  - **Production** (and **Preview** if you use it).

- Click **Save** (or **Add**).

### 4.4 — Redeploy after adding variables

- Env vars apply only on the **next build**.
- Go back to **Deployments** (top tab) → open the **⋯** on the latest → **Redeploy** (you can leave “Use existing Build Cache” on this time).
- Wait until the new deployment is **Ready**, then test the site.

---

## 5. Short map of the UI

```
vercel.com
└── Dashboard (list of projects)
    └── [Your project, e.g. uwoguessr]
        ├── Deployments    ← Redeploy (⋯ → Redeploy, uncheck cache)
        ├── Settings      ← Project settings
        │   ├── General   ← Root Directory, Build Command, Output Directory
        │   └── Environment Variables  ← VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
        ├── Logs
        └── ...
```

---

## 6. If your layout looks different

- **New Vercel UI:** Tabs are often: Overview, Deployments, Analytics, Logs, **Settings**. Settings has a left sidebar: General, Domains, **Environment Variables**, etc.
- **Older UI:** “Project Settings” or a gear, then a sidebar with “General”, “Environment Variables”, etc.
- **Redeploy:** It’s always from the **Deployments** list: open a deployment, then use **⋯** or **”Redeploy”**.
- **Environment Variables:** Always under **Settings** for the project, often under a section like “Configuration” or “Environment”.

If you tell me what you see on the main project page (tabs or menu names), I can match it to your screen.
