# Debug white screen – do this and send the results

Follow **all** steps. The answers will show what’s wrong.

---

## Step 1: Hard refresh and incognito

1. Close all tabs with uwoguessr.com.
2. Open a **new Incognito/Private** window (Ctrl+Shift+N in Chrome).
3. Go to **https://uwoguessr.com**.
4. Does it load or stay white?  
   - If it loads: the problem was cache; you can stop.  
   - If it’s still white: go to Step 2.

---

## Step 2: Open DevTools before loading

1. In the **same** incognito window, press **F12** (or right‑click → Inspect).
2. Open the **Console** tab. Leave it open.
3. Open the **Network** tab. Leave it open.
4. In the Network tab, check **“Disable cache”** (if you see it).
5. **Refresh** the page (F5 or Ctrl+R).

---

## Step 3: Console – copy the errors

1. In the **Console** tab, look for **red** lines.
2. If there are any, **click the first red line** to expand it.
3. **Copy the full text** of that error (or take a screenshot).
   - Examples: `Failed to load resource: 404`, `Uncaught Error: ...`, `Uncaught TypeError: ...`
4. If there are **no red** lines, write: **“No red errors in Console.”**

---

## Step 4: Network – which files fail?

1. In the **Network** tab, find the rows for the page and its assets.
2. For each of these, note the **Status** (number) and the **Name** (or URL):
   - The first row (often `uwoguessr.com` or `(document)` or `index.html`)  
     → Status: _____
   - Any row whose **Name** contains **`.js`** (e.g. `index-xxxxx.js` or `App-xxxxx.js`)  
     → Status: _____  Name: _____________
   - Any row whose **Name** contains **`.css`**  
     → Status: _____  Name: _____________
3. If a `.js` or `.css` has Status **404** (red), click it. In the **Headers** or **Request URL** section, **copy the full URL** that was requested (e.g. `https://uwoguessr.com/assets/index-xxx.js` or `https://uwoguessr.com/uwoguessr/assets/...`).

---

## Step 5: What to send back

Reply with something like:

```
CONSOLE:
[Paste the first red error, or: No red errors in Console.]

NETWORK:
- Document (first row): Status ___
- A .js file: Status ___ , full URL: _______________
- A .css file: Status ___ , full URL: _______________
```

If you can, add a **screenshot** of:
- The **Console** tab (showing any red errors), and  
- The **Network** tab (showing the list of requests and their Status).

---

## If you can’t do DevTools

Say: **“I can’t use F12/DevTools.”**  
Then we’ll try other fixes (e.g. `vercel.json`, different base path, or inspect the built `dist`).
