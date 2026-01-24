# Vercel white screen – checklist

Do these in order. After each block, **redeploy** and test.

---

## 1. Base path (done in code)

`vite.config.ts` is set to `base: '/'`. Commit and push if you haven’t:

```powershell
git add vite.config.ts
git commit -m "Fix: use base / for Vercel"
git push origin main
```

---

## 2. Environment variables in Vercel

Your app needs these at **build time**. If they’re missing, the app can show a white screen.

### Add them

1. **Vercel** → your project → **Settings** → **Environment Variables**.
2. Add:

   | Name                 | Value                         | Environment  |
   |----------------------|-------------------------------|--------------|
   | `VITE_SUPABASE_URL`  | `https://xxxxx.supabase.co`   | Production   |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbG...` (long token) | Production   |

3. Get the values from **Supabase**: [supabase.com/dashboard](https://supabase.com/dashboard) → your project → **Settings** → **API**:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

4. **Save** each variable.

### Redeploy after adding

- **Deployments** → **⋯** on the latest → **Redeploy**  
  or  
- Push a small change (e.g. add a space in `README.md`) and `git push origin main`.

---

## 3. Check the browser

1. Open **https://uwoguessr.com**.
2. Press **F12** → **Console**.
3. Note any **red** errors, e.g.:
   - `Missing Supabase environment variables` → add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel and **redeploy**.
   - `Failed to load resource: 404` for `*.js` or `*.css` → base/build issue; ensure `base: '/'` and a fresh deploy.
   - CORS or network errors → could be Supabase URL/key or Supabase project settings.

4. Open the **Network** tab → refresh. Check:
   - Does `index.html` return 200?
   - Do the `.js` (and `.css`) files return 200 or 404?  
   If the main `.js` is 404, the build or `base` is still wrong.

---

## 4. Check the Vercel build

1. **Vercel** → your project → **Deployments**.
2. Open the **latest** deployment.
3. Confirm **Build** (and Deploy) are **green**.
4. Open **Build** logs and look for:
   - `vite build` (or `npm run build`) finishing without errors.
   - No messages about missing env vars during build (Vite inlines `import.meta.env` at build time; missing vars become `undefined`, which then causes a runtime error in the browser).

---

## 5. Force a clean deploy

1. **Deployments** → **⋯** on latest → **Redeploy**.
2. Leave **Use existing Build Cache** **unchecked**.
3. Redeploy, wait for it to finish, then test **https://uwoguessr.com** in an **incognito** window.

---

## 6. Test the Vercel URL

- Open **https://uwoguessr-app.vercel.app** (or the `*.vercel.app` URL from the project).
- If that works but **uwoguessr.com** doesn’t, the problem is with the custom domain or caching. Try:
  - Another network or device.
  - `https://www.uwoguessr.com` if you added `www`.
- If both `*.vercel.app` and **uwoguessr.com** are white, the issue is in the app or build (base, env, or code).

---

## Quick checklist

- [ ] `vite.config.ts` has `base: '/'` and that commit is pushed.
- [ ] `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Vercel **Environment Variables** for **Production**.
- [ ] A **Redeploy** (or new push) was done **after** adding/env vars.
- [ ] Latest deployment’s **Build** and **Deploy** are green.
- [ ] Tested in **incognito** and checked **F12 → Console** for errors.
- [ ] Tried **https://uwoguessr-app.vercel.app** as well as **https://uwoguessr.com**.
