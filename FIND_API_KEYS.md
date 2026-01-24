# Where to Find Your Supabase API Keys

## Step-by-Step Guide

### Step 1: Go to Settings
1. In Supabase, look at the **left sidebar**
2. Scroll down to the bottom
3. Click **"Settings"** (it has a gear icon ⚙️)

### Step 2: Click on "API"
1. In the Settings menu, you'll see several options
2. Click **"API"** (it's usually the first or second option)

### Step 3: Find Your Keys

On the API page, you'll see several sections. Here's what you need:

#### 📍 Project URL
- Look for a section called **"Project URL"** or **"Project API URL"**
- It will look like: `https://abcdefghijklmnop.supabase.co`
- **Copy this entire URL** (including the `https://` part)

#### 🔑 anon public key
- Look for a section called **"Project API keys"** or **"API Keys"**
- You'll see several keys listed:
  - `anon` `public` - **THIS IS THE ONE YOU NEED!**
  - `service_role` `secret` - DON'T USE THIS ONE (it's secret!)
- Click the **"Reveal"** or **"Copy"** button next to the `anon` `public` key
- It's a long string starting with `eyJ...`
- **Copy this entire key**

---

## Visual Guide

The page should look something like this:

```
Settings > API
─────────────────────────────────

Project URL
https://abcdefghijklmnop.supabase.co
[Copy button]

─────────────────────────────────

Project API keys

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
[Reveal] [Copy]

service_role secret
[Reveal] [Copy]  ← DON'T USE THIS ONE!
```

---

## What You Need

✅ **Project URL**: `https://xxxxx.supabase.co`  
✅ **anon public key**: `eyJ...` (long string)

❌ **DON'T use**: `service_role` key (that's secret and dangerous!)

---

## Quick Checklist

- [ ] Went to Settings → API
- [ ] Found "Project URL" section
- [ ] Copied the URL (starts with `https://`)
- [ ] Found "Project API keys" section
- [ ] Found the `anon` `public` key
- [ ] Copied the anon key (starts with `eyJ...`)
- [ ] Did NOT copy the `service_role` key

---

## Still Can't Find It?

If you're on a different page:

1. **Make sure you're in the right project** - Check the project name in the top left
2. **Look for "Settings"** - It's always at the bottom of the left sidebar
3. **Click "API"** - It's in the Settings submenu
4. **Look for "Project URL"** - It's usually at the top of the API page
5. **Look for "anon public"** - It's in the API keys section

---

## Common Confusion

**"I see JWT keys, what are those?"**
- JWT keys are for advanced use - you don't need them!
- Just use the **Project URL** and **anon public key**

**"I see service_role key, should I use that?"**
- NO! The `service_role` key is secret and gives full access
- Only use the `anon` `public` key for your app

**"I see multiple keys, which one?"**
- Use the one labeled `anon` and `public`
- It's safe to use in frontend code
- The `service_role` key is secret and should never be in your frontend!

---

## Next Step

Once you have both:
1. Project URL
2. anon public key

Go to Step 3 in `AFTER_SQL_SETUP.md` to create your `.env` file!
