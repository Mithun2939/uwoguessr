# Put uwoguessr on GitHub – Step by step

---

## 1. Will everything still exist if I close Cursor?

**Yes.**

- **Your code** lives in the folder `c:\uwoguessr` on your computer. Closing Cursor does not delete it.
- **Supabase** (database, storage, submissions, locations) is in the cloud. It stays as long as your Supabase project exists.

---

## 2. Put the project on GitHub

### Step 1 – Create a new repo on GitHub

1. Go to [github.com](https://github.com) and sign in.
2. Click the **+** (top right) → **New repository**.
3. **Repository name:** e.g. `uwoguessr`.
4. **Description:** optional (e.g. `Campus guessing game`).
5. Choose **Public**.
6. **Do not** check “Add a README”, “Add .gitignore”, or “Choose a license” (you already have files).
7. Click **Create repository**.

GitHub will show a page with setup commands. You’ll use the repo URL in Step 5 (e.g. `https://github.com/YOUR-USERNAME/uwoguessr.git`).

---

### Step 2 – Open a terminal in your project

- **In Cursor:** **Terminal** → **New Terminal** (or `` Ctrl+` ``).
- Go to the project folder:
  ```bash
  cd c:\uwoguessr
  ```

---

### Step 3 – Initialize Git and make the first commit

Run these one at a time:

```bash
git init
```

```bash
git add .
```

```bash
git status
```
(You should see your files listed, and **not** `.env` or `node_modules` — they’re in `.gitignore`.)

```bash
git commit -m "Initial commit: uwoguessr game with Contribute and Supabase"
```

---

### Step 4 – Rename the branch to `main` (if needed)

```bash
git branch -M main
```

---

### Step 5 – Connect to GitHub and push

Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your GitHub username and repo name (e.g. `smith` and `uwoguessr`):

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
```

```bash
git push -u origin main
```

- If it asks to sign in, use your GitHub username and a **Personal Access Token** as the password (not your normal GitHub password).  
  To create one: GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Generate new token**, give it `repo` scope.

---

### Step 6 – Check on GitHub

Open `https://github.com/YOUR-USERNAME/YOUR-REPO-NAME`. Your files should be there.

---

## 3. Important: `.env` is not on GitHub

Your **`.env`** file (with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) is in **`.gitignore`**, so it **will not** be pushed. That’s on purpose (you don’t want keys in a public repo).

- **On a new computer** or **when someone clones** the repo: copy **`.env.example`** to **`.env`** and fill in the real values from your Supabase project.
- You can add a short note in **README.md** like: “Copy `.env.example` to `.env` and add your Supabase URL and anon key.”

---

## 4. Later: make changes and push again

After you change files:

```bash
cd c:\uwoguessr
git add .
git commit -m "Describe what you changed"
git push
```

---

## Quick reference

| Step | Command |
|------|---------|
| First-time setup | `git init` → `git add .` → `git commit -m "Initial commit"` → `git branch -M main` |
| Add GitHub | `git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git` |
| First push | `git push -u origin main` |
| Later updates | `git add .` → `git commit -m "message"` → `git push` |
