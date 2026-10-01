# Dagam Chandramohan — Portfolio

Personal portfolio website of **Dagam Chandramohan**, Full-Stack Developer from Hyderabad, India.

🌐 **Live:** [chandramohandagam.vercel.app](https://chandramohandagam.vercel.app) *(update once deployed)*

---

## 📁 Repository Structure

```
portfolio/
├── index.html              ← Main frontend (single-page portfolio)
├── css/style.css           ← Full design system (2100+ lines, warm neutrals theme)
├── js/main.js              ← Animations, theme toggle, contact form, lightbox
├── assets/
│   ├── images/             ← Profile photo, case study images
│   └── resume.pdf          ← Downloadable resume
├── api/
│   └── contact.js          ← Vercel serverless backend (contact form API)
├── php/
│   ├── contact.php         ← PHP backend (for Apache/cPanel hosting)
│   └── config.sample.php   ← DB config template (copy → config.php)
├── sql/schema.sql          ← MySQL database schema
├── server.js               ← Node.js static server (for Render)
├── vercel.json             ← Vercel deployment configuration
├── render.yaml             ← Render deployment configuration
├── package.json            ← Node.js project manifest
├── .htaccess               ← Apache security + caching headers
├── robots.txt              ← Search engine crawl rules
├── sitemap.xml             ← XML sitemap
└── 404.html                ← Custom 404 page
```

---

## 🚀 Deploy Options

### Option 1: Vercel (Recommended — Free, Fast, Auto SSL)
1. Import this repo at [vercel.com/new](https://vercel.com/new)
2. Framework Preset → `Other`
3. Build Command → *(leave blank)*
4. Output Directory → `.`
5. Click **Deploy** ✅

### Option 2: Render (Static Site — Free, No Sleep)
1. Go to [render.com](https://render.com) → New → **Static Site**
2. Connect this repository
3. Build Command → *(leave blank)*
4. Publish Directory → `.`
5. Click **Create Static Site** ✅

### Option 3: Render (Web Service — Node.js)
1. Go to [render.com](https://render.com) → New → **Web Service**
2. Connect this repository
3. Build Command → `npm install`
4. Start Command → `node server.js`
5. Click **Create Web Service** ✅

---

## 🛠️ Local Development

```bash
# Clone the repo
git clone https://github.com/chandramohandagam/portfolio.git
cd portfolio

# Run locally (no install needed)
npx serve .
# Open http://localhost:3000
```

---

## 📬 Contact Form

The contact form connects to **two backends** in order:
1. **Vercel** → `/api/contact` (Node.js serverless — works on Vercel)
2. **PHP** → `php/contact.php` (works on Apache/cPanel with MySQL)
3. **Fallback** → Direct `mailto:` link (works everywhere)

---

## 🔒 Security

- `php/config.php` is listed in `.gitignore` — **never committed**
- Sensitive paths blocked by `.htaccess` and `server.js`
- Honeypot spam protection on contact form

---

*Built with semantic HTML5, vanilla CSS3, and zero-dependency JavaScript.*
