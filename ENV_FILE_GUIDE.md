# .env File Guide - Step by Step

## What is a .env file?

A `.env` file is a **configuration file** that stores sensitive information like API keys and passwords. Think of it as a secret notebook where you write down your passwords - but for your app!

**Why do we need it?**
- Keeps your API keys secret (not in your code)
- Easy to change settings without editing code
- Different keys for development vs production
- Never commit it to GitHub (it's in .gitignore)

## What goes in the .env file?

For Western Guessr, you need:
1. **Supabase URL** - Where your database lives
2. **Supabase Anon Key** - Password to access your database
3. **Mapbox Token** - NOT NEEDED (we use free OpenStreetMap!)

---

## Step-by-Step: Creating Your .env File

### Step 1: Get Your Supabase Keys

1. Go to [supabase.com](https://supabase.com) and log in
2. Click on your project (or create one if you haven't)
3. In the left sidebar, click **"Settings"** (gear icon ⚙️ at the bottom)
4. Click **"API"** in the settings menu
5. You'll see two important things:
   - **Project URL**: Looks like `https://abcdefghijklmnop.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`
6. **Copy both of these** - you'll need them in a moment!

### Step 2: Create the .env File

**Option A: Using File Explorer (Windows)**

1. Open File Explorer
2. Navigate to your project folder: `C:\uwoguessr`
3. Right-click in an empty space
4. Select **"New"** → **"Text Document"**
5. Name it exactly: `.env` (including the dot at the start!)
   - If Windows warns you about changing the extension, click **"Yes"**
   - If you can't see the file, you might need to show hidden files:
     - Go to View tab → Check "Hidden items"

**Option B: Using VS Code / Cursor**

1. In Cursor/VS Code, right-click on the project folder (`uwoguessr`)
2. Select **"New File"**
3. Name it exactly: `.env`

**Option C: Using Command Line**

1. Open PowerShell or Command Prompt
2. Navigate to your project:
   ```powershell
   cd C:\uwoguessr
   ```
3. Create the file:
   ```powershell
   New-Item -Path .env -ItemType File
   ```

### Step 3: Add Your Keys to the .env File

1. Open the `.env` file (double-click it, or open in Cursor/VS Code)
2. Copy and paste this template:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Replace the placeholders:
   - Replace `your_project_url_here` with your actual Supabase Project URL
   - Replace `your_anon_key_here` with your actual anon key

**Example of what it should look like:**

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

### Step 4: Save the File

1. Make sure you saved the file (Ctrl+S)
2. Close the file

### Step 5: Verify It Works

1. Open your terminal/command prompt
2. Navigate to your project:
   ```powershell
   cd C:\uwoguessr
   ```
3. Run:
   ```powershell
   npm run dev
   ```
4. If you see the app start without errors, you're good! ✅
5. If you see "Missing Supabase environment variables", check:
   - File is named exactly `.env` (not `.env.txt`)
   - File is in the root folder (`C:\uwoguessr\.env`)
   - You copied the keys correctly (no extra spaces)

---

## Common Issues & Solutions

### Issue: "I can't create a file starting with a dot"

**Solution:**
- In File Explorer, create a file named `env` (no dot)
- Then rename it to `.env` (add the dot)
- Or use VS Code/Cursor to create it directly

### Issue: "File shows as .env.txt"

**Solution:**
- Windows might be hiding file extensions
- Go to View → Show file extensions
- Rename to remove the `.txt` part
- Or create it in VS Code/Cursor which handles this better

### Issue: "Missing Supabase environment variables" error

**Checklist:**
- ✅ File is named exactly `.env` (not `.env.txt` or `env.txt`)
- ✅ File is in `C:\uwoguessr\.env` (root folder, not a subfolder)
- ✅ You have both `VITE_SUPABASE_URL=` and `VITE_SUPABASE_ANON_KEY=`
- ✅ No spaces around the `=` sign
- ✅ You restarted the dev server after creating the file

### Issue: "I can't see the .env file"

**Solution:**
- In File Explorer: View tab → Check "Hidden items"
- In VS Code/Cursor: It should show up in the file list
- The file might be hidden because it starts with a dot

---

## Security Notes ⚠️

**IMPORTANT:**
- ✅ The `.env` file is already in `.gitignore` - it won't be uploaded to GitHub
- ✅ Never share your `.env` file or commit it to Git
- ✅ Never put your `.env` file in screenshots or public places
- ✅ The anon key is "public" but still keep it private

---

## Quick Reference

**File location:** `C:\uwoguessr\.env`

**File contents:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-long-key-here
```

**How to use:** The app automatically reads this file when you run `npm run dev`

---

## Still Having Issues?

1. Make sure the file is in the **root** of your project (same folder as `package.json`)
2. Restart your dev server after creating/editing `.env`
3. Check for typos in the variable names (they're case-sensitive!)
4. Make sure there are no spaces: `VITE_SUPABASE_URL=...` not `VITE_SUPABASE_URL = ...`
