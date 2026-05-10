AMNA'S PHOTOGRAPHY — STATIC WEBSITE
====================================

This is a hand-built static website (HTML, CSS, vanilla JS).
No frameworks, no build step. Open index.html in any modern browser.

PAGES
-----
  index.html        Home — editorial hero, signature work, story preview
  about.html        About Amna — story, principles, timeline, gear
  portfolio.html    Full portfolio with category filtering
  newborn.html      Gallery: The Newborn Series
  families.html     Gallery: The Family Series
  weddings.html     Gallery: Weddings & Bridal
  lifestyle.html    Gallery: Lifestyle, Editorial, Brand, Travel
  services.html     Sessions, weddings, brand pricing, process
  testimonials.html 40+ real client reviews, columned layout
  journal.html      Blog placeholder with featured post and grid
  contact.html      Inquiry form, direct lines, travel area, FAQ

DESIGN
------
  Typography:  Fraunces (display, variable serif) + Manrope (body)
               Loaded from Google Fonts.
  Colors:      Cream paper #f4eee4, deep ink #1a1714, warm clay #a85a32, gold #b48a4a
  Aesthetic:   Editorial / magazine. Asymmetric grids, numbered chapters,
               italic pull quotes, generous whitespace, soft grain overlay.

ASSETS
------
  assets/css/style.css     Single design-system stylesheet (~22 KB)
  assets/js/main.js        Vanilla JS: nav, mobile drawer, reveal-on-scroll,
                           portfolio filter, lightbox, contact form stub
  assets/images/full/      142 web-optimized images, 1600px max, ~30 MB
  assets/images/thumb/     142 web-optimized thumbnails, 800px, ~9 MB

HOW TO PREVIEW
--------------
  Option A: Double-click index.html
  Option B: From a terminal in this folder, run a tiny static server:
             python3 -m http.server 8000
            Then open http://localhost:8000

NEXT STEPS (PHASE 2)
--------------------
  1. Replace the contact form stub with a real backend (Formspree, HoneyBook,
     Netlify Forms, or your own server) — line by replacing the submit
     handler in assets/js/main.js.
  2. Add a real booking calendar (Calendly, HoneyBook, Acuity).
  3. Wire the journal posts to a CMS (Notion, Sanity, or simple markdown).
  4. Set up domain + hosting (Cloudflare Pages, Netlify, or Vercel are free
     and excellent for this stack).
  5. Add Open Graph / Twitter card meta tags once the live URL is set.
  6. Compress / convert images to WebP for ~30% smaller payload if desired.

CONTENT NOTES
-------------
  Pricing on services.html is placeholder using American-market rates suited
  to the Bay Area photography ecosystem. Adjust to your actual numbers
  before going live. All testimonial quotes are real, pulled directly from
  the Facebook reviews uploaded in the source notes.

BUILT
-----
  May 2026 — first build.
