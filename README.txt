MY BUDGET — PRIVATE ACCOUNT EDITION (v2, Nov 13 2026)

WHAT'S NEW IN v2
- Connected to your Supabase project (URL already in config.js).
- Saves to the user_budgets table, column budget_data.
- Two-way sync: the newest copy wins, and the other copy is ALWAYS kept as a
  "safety copy" you can download from History > Backup.
- First time a device with its own budget signs in, the app asks which copy to keep.
- Works offline; changes sync when you're back online or reopen the app.
- Offline helper (sw.js) caches only the app's own files, never your budget data.
- Refuses to run cloud sync if a secret/service_role key is put in config.js.

ONE THING YOU STILL NEED TO DO
Open config.js and replace PASTE_YOUR_PUBLISHABLE_KEY_HERE with your publishable key
(starts with sb_publishable_). Keep the quote marks. Never use a secret key.

SAFETY
- The publishable key is meant to be public; Row Level Security protects your data.
- This app is a planner only. It does not connect to your bank or move money.
- Keep using Export backup now and then as an extra copy.

FILES
index.html — the app
config.js — Supabase URL + publishable key
sw.js, manifest.webmanifest, icons — iPhone install + offline
supabase-setup.sql — database setup (already done)
