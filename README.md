# 🎮 SGGames

> The ultimate open-source HTML5 game hub — fork, host, and play instantly.

**Quick Links:**  
👉 [What is SGGames?](#-what-is-sggames)  
👉 [How to Host Your Own Version](#-how-to-host-your-own-version)

---

## 🕹️ What is SGGames?

**SGGames** is a free, open-source web platform that hosts hundreds of HTML5 and Flash-style games directly in your browser.  
It’s built for speed, simplicity, and independence — no logins, no paywalls, no ads, just pure gaming fun.  

### 🌟 Key Features
- test
- 200+ classic and modern web games  
- Works offline and on school networks (depending on host setup)  
- Fully forkable and customizable  
- Auto-updates from the original repo using GitHub Actions  
- Deploys to GitHub Pages in minutes  

**© 2025 Santiago Gutierrez** — Open source under the [MIT License](https://opensource.org/licenses/MIT).

---

## 🧠 How to Host Your Own Version

This guide shows you how to **fork**, **sync**, and **host** your own SGGames website — perfect for anyone, even if you’ve never coded before!

---

### 1️⃣ Fork the Repository

1. Go to the original repo:  
   👉 [https://github.com/SantiagoGutierrez/SGGames](https://github.com/santigutierrezsch/SGGames)  
2. Click **“Fork”** (top-right corner).  
3. Wait for GitHub to make your own copy.

---

### 2️⃣ Enable GitHub Pages (from `main` branch)

1. In your forked repo, go to **Settings → Pages**.  
2. Under **Source**, choose:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
3. Save.  
4. After a few minutes, your site will appear at:  
   `https://<your-username>.github.io/SGGames/`

> 💡 If this is your only project on GitHub, rename your repository to  
> `your-username.github.io` — then your site will appear at:  
> `https://your-username.github.io/` (no `/SGGames/` at the end).

> ⚠️ If your site ever gets blocked, you can create a new GitHub account with a school-related name (example: `googledocs1234`) and host again.

---

### 3️⃣ Set Up Auto Sync + Hosting (GitHub Actions)

This step makes your site **automatically update** every day when the main SGGames repo gets new games or changes.

1. Go to your repo’s **Actions** tab.  
2. Click **“New workflow” → “set up a workflow yourself.”**  
3. Name it `sync.yml`.  
4. Paste this code inside:

```yaml
name: 🔄 Sync Fork + Auto Deploy to Pages

on:
  schedule:
    - cron: '0 0 * * *'  # runs every day at midnight UTC
  workflow_dispatch:     # allows manual run

permissions:
  contents: write        # needed for pushing updates

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Sync from the original SGGames repo
        uses: repo-sync/github-sync@v2
        with:
          source_repo: SantiagoGutierrez/SGGames
          source_branch: main
          destination_branch: main
          github_token: ${{ secrets.GITHUB_TOKEN }}

  deploy:
    needs: sync
    runs-on: ubuntu-latest
    steps:
      - name: Checkout updated main branch
        uses: actions/checkout@v4
        with:
          ref: main

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./       # root folder of your site
          publish_branch: main  # ✅ deploy directly from main
````

---

### 💡 Important: About the GitHub Token

When you see `${{ secrets.GITHUB_TOKEN }}` in the workflow, don’t worry —
you **don’t need to find or create anything** yourself.

GitHub automatically gives every repository a **temporary built-in token** each time a workflow runs.
This token is what lets your Action push updates and redeploy your Pages site safely.

You **won’t see it in your Settings → Secrets**, because it’s created behind the scenes just for GitHub Actions.
As long as Actions are enabled in your repo, everything will work automatically ✅

---

### ✅ After Setup

Your fork will now:

* Pull the newest version of SGGames **every day automatically**
* Rebuild and redeploy your GitHub Pages site
* Stay synced forever — no extra work needed

---

## 🧩 Optional Customization

| File / Folder | What It Does                                      |
| ------------- | ------------------------------------------------- |
| `index.html`  | The main homepage — edit title, colors, or layout |
| `/assets/`    | Store custom icons, logos, or scripts             |
| `/games/`     | Add or remove game folders (each game = 1 folder) |
| `/css/`       | Customize fonts, colors, or themes                |
| `/js/`        | Stores JavaScript files                           |

---

## 💬 Credits

Created by **© 2025 Santiago Gutierrez**
Open source under the [MIT License](https://opensource.org/licenses/MIT).
Please credit the original project if you use or remix this site ❤️

---

**Happy gaming! 🎮**
