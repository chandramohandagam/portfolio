# DAGAM CHANDRAMOHAN — Personal Portfolio Website
### Full-Stack Developer | Computer Science Engineer · Hyderabad, Telangana, India

A production-quality, accessible, high-performance personal portfolio website built with semantic HTML5, modern CSS3 (custom design system, fluid tokens, dark/light themes), vanilla JavaScript, and an optional secure PHP/MySQL contact backend.

---

## 1. Project Overview & File Structure

This project is organized as a lightweight, framework-free web application that prioritizes visual elegance, Core Web Vitals, recruiter readability, and strict accessibility.

```text
chandramohan-portfolio/
├── index.html               # Main single-page application & content
├── 404.html                 # Accessible, branded 404 error page
├── css/
│   └── style.css            # Fluid design tokens, layout grid, themes, print & reduced-motion styles
├── js/
│   └── main.js              # Theme switcher, typing animation, project filter, and contact handler
├── php/
│   ├── config.sample.php    # Sample configuration template with environment parameters
│   └── contact.php          # Secure submission endpoint (CSRF, honeypot, time-trap, rate-limiting)
├── sql/
│   └── schema.sql           # MySQL database schema for contact submissions
├── assets/
│   ├── images/
│   │   └── og-cover.svg     # 1200x630 Open Graph / Twitter social preview card
│   ├── icons/               # Directory for custom icons
│   └── resume.pdf           # Verified resume document
├── favicon.svg              # Scalable vector monogram favicon ("DC")
├── robots.txt               # Search engine crawling rules
├── sitemap.xml              # XML sitemap with production canonical placeholders
├── .htaccess                # Apache security headers (CSP), caching rules, and file protection
├── .gitignore               # Ignores credentials, secrets, logs, and editor files
└── README.md                # Technical guide, setup instructions, and placeholder checklist
```

---

## 2. Local Setup & Development

### Option 1: Quick Static Preview (Frontend Only)
You can preview the entire portfolio immediately in any web browser or via a local static server:

```bash
# Using Python's built-in HTTP server:
cd chandramohan-portfolio
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser. All interactive features (theme toggle, animated typing, project filtering, expandable project drawers, email copy, back-to-top) work natively. In this mode, the contact form automatically detects that the PHP backend is offline and offers an honest, instant mailto fallback.

---

### Option 2: Full Local Stack (PHP 8.x + MySQL 8.x)

1. **Import the Database Schema:**
   Ensure your MySQL server is running. Create a new database and import `sql/schema.sql`:
   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS chandramohan_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   mysql -u root -p chandramohan_portfolio < sql/schema.sql
   ```

2. **Configure Database Credentials:**
   Copy `php/config.sample.php` to `php/config.php`:
   ```bash
   cp php/config.sample.php php/config.php
   ```
   Edit `php/config.php` and supply your database credentials:
   ```php
   'db' => [
       'host'     => '127.0.0.1',
       'port'     => 3306,
       'database' => 'chandramohan_portfolio',
       'username' => 'portfolio_user',
       'password' => 'YOUR_STRONG_PASSWORD',
       'charset'  => 'utf8mb4'
   ],
   'security' => [
       'rate_limit_max'     => 5,
       'rate_limit_window'  => 3600,
       'min_submit_seconds' => 3,
       'ip_salt'            => 'generate_a_random_salt_string_here'
   ]
   ```

3. **Launch PHP Development Server:**
   ```bash
   php -S 127.0.0.1:8000
   ```
   Visit [http://127.0.0.1:8000](http://127.0.0.1:8000). The contact form will now validate inputs, issue CSRF tokens, verify honeypots, rate-limit by IP hash, and persist inquiries into MySQL.

---

## 3. How to Customize and Edit Content

### A. Updating Technical Skill Levels
Skills are defined in `index.html` inside `#skills`. Each row utilizes a `data-level` attribute and has a verification comment:
```html
<!-- VERIFY LEVEL -->
<li class="skill-row" data-level="comfortable" aria-label="JavaScript, Comfortable">
  <span class="skill-name">JavaScript</span>
  <div class="skill-level-meta">
    <span class="skill-level-label">Comfortable</span>
    <div class="segmented-dots" aria-hidden="true">
      <span class="seg-dot"></span><span class="seg-dot"></span><span class="seg-dot"></span><span class="seg-dot"></span>
    </div>
  </div>
</li>
```
Available values for `data-level`:
- `learning`: 1 filled dot (Currently Learning)
- `working`: 2 filled dots (Working Knowledge — Python and Flask mandatory)
- `familiar`: 3 filled dots (Familiar)
- `comfortable`: 4 filled dots (Comfortable)

Changing the `data-level` attribute automatically updates the segmented dots indicator through CSS.

### B. Displaying Unverified Tech Stack Chips (Specification C5)
In `index.html` under Project 01, unconfirmed technologies (such as React.js, Node.js, and MySQL) are wrapped in `data-verified="false"`. These are hidden by default via `[data-verified="false"] { display: none; }`.
To display them after confirmation, change:
```html
<span class="chip" data-verified="false">React.js</span>
```
to:
```html
<span class="chip" data-verified="true">React.js</span>
```
or simply remove the `data-verified` attribute.

### C. Project Filtering Categories
Projects in `index.html` are categorized using `data-categories`:
- `data-categories="full-stack,agritech"`
- `data-categories="ai-applications"`

To assign a card to additional filters, add comma-separated values matching the filter button's `data-filter` attribute in `.projects-filter-bar`.

---

## 4. Deployment Routes

### Route A: Full PHP + MySQL Hosting (cPanel, LAMP, VPS)
1. Upload all files to your `public_html` or web root directory.
2. Create a MySQL database and user on your hosting control panel.
3. Import `sql/schema.sql` via phpMyAdmin or the MySQL command line.
4. Copy `php/config.sample.php` to `php/config.php` on the server and insert your database credentials.
5. The `.htaccess` file automatically enforces HTTPS, injects strict Content Security Policy (CSP) headers, prevents directory indexing, and denies direct web access to `php/config.php` and `sql/`.

### Route B: Static Hosting (GitHub Pages, Vercel, Netlify, Cloudflare Pages)
1. Push this repository to GitHub or connect the folder to your static hosting provider.
2. In static environments, PHP scripts will not execute. The client JavaScript in `js/main.js` detects that `php/contact.php` is unavailable and displays an honest notice:
   > *"The message service is unavailable right now. Please email me directly instead."*
   alongside a pre-filled direct `mailto:` button. The site never falsely claims a message was sent when the backend is offline.

---

## 5. Search Engine Optimization (SEO) & Social Sharing

1. **Set Canonical Domain:**
   In `index.html`, update line 18:
   ```html
   <link rel="canonical" href="https://chandramohandagam.com/">
   ```
2. **Update Open Graph & Twitter Cards:**
   Update lines 22, 29 in `index.html` with your live domain name.
3. **Configure Sitemap:**
   In `sitemap.xml`, replace `https://yourdomain.com/` with your live URL.
4. **Configure robots.txt:**
   In `robots.txt`, update the `Sitemap:` directive with your live domain.
5. **Search Console Submission:**
   Submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools once deployed.

---

## 6. Placeholders & Pre-Publishing Checklist (Sections 21 & 33)

Before publishing the portfolio to production, verify each of the following placeholder items:

| Item | Location in Code | Status / Action Needed |
| :--- | :--- | :--- |
| **Email Address** | `index.html`, `js/main.js`, `resume.pdf` | Verified: `mohandagam04@gmail.com` |
| **LinkedIn URL** | `index.html` (Lines 850, 949) | Verify and update your public LinkedIn profile slug. |
| **Graduation Date** | `index.html` (Line 233) | 2027 is a placeholder; update with confirmed month and year. |
| **Resume PDF** | `assets/resume.pdf` | A valid resume summary is generated. Replace with your customized official resume if desired. |
| **Remote Sensing Cert** | `index.html` (Line 722) | Verify issuer institution and completion year. |
| **AI Smart Care Repo** | `index.html` (Line 580) | Update GitHub repository link once published. |
| **Diagnosphere Repo** | `index.html` (Line 661) | Update GitHub repository link once published. |
| **Canonical Domain** | `index.html` (Lines 18, 22, 29); `sitemap.xml`; `robots.txt` | Replace `yourdomain.com` with your purchased domain. |
| **Project 01 Technologies** | `index.html` (Lines 482–484) | Confirm whether React.js, Node.js, and MySQL were utilized before enabling `data-verified="true"`. |
| **Academic Records** | `index.html` (Lines 688, 701, 714) | Confirm CGPA (7.38), Intermediate (93.5%), and SSC (100%) against physical certificates. |

---

## 7. Accessibility, Motion & Performance Standards

- **Semantic HTML5:** Native landmark hierarchy (`<header>`, `<nav>`, `<main>`, `<section aria-labelledby>`, `<aside>`, `<footer>`).
- **Accessible Color Contrast:** Normal text >= 4.5:1, UI components and large headers >= 3:1 in both dark and light modes.
- **Form Error Feedback:** Validates with `:user-invalid` and mirrors state to `aria-invalid` and `aria-describedby` error strings.
- **Focus Indicators:** High-contrast `outline: 2px solid var(--primary-accent); outline-offset: 3px` on `:focus-visible`.
- **Reduced Motion Support:** `@media (prefers-reduced-motion: reduce)` disables typing loops, pulsing dots, panel floating animations, and transitions while preserving full readability.
- **Print Optimization:** Dedicated print styles hide interactive controls, navigation bars, and background colors to generate a clean, readable one-column resume format.
