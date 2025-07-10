# Portfolio Website

This repository contains the source code for a JSON-driven, single-page portfolio site.

## 📦 Project structure
```
├── assets/
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript modules
│   └── data/           # Content (edit these JSON files)
├── index.html          # Main HTML file
└── scripts/            # Utility scripts (build / deploy)
```

## 🚀 Quick start
```bash
# Clone
git clone <repo-url>
cd twahirwa.com

# Serve locally (Python ≥3.7)
python3 -m http.server 8000
# Visit http://localhost:8000 in your browser
```

## ✍️ Updating content
All site content lives in the `assets/data` directory.  
Edit the JSON files to update profile details, projects, research, music, and social links—no HTML or JS changes required.

| File | Purpose |
|------|---------|
| `profile.json`  | Biography, contact blurb, education, fun facts |
| `skills.json`   | Programming languages, frameworks, tools |
| `projects.json` | Featured projects with descriptions & tags |
| `research.json` | Publications and current research interests |
| `music.json`    | Tracks, genres, platform URLs |
| `social.json`   | Social-media handles & external links |

## 🛠️ Building / deployment
The site is 100 % static and can be hosted on any static file service (GitHub Pages, Netlify, Cloudflare Pages, etc.).

1. Commit & push your changes to the `main` branch.
2. Ensure your hosting provider points to the root of the repository (or the `/` build output if using a custom build script).

_No private API keys or secrets are required for normal operation._

---
© 2025 – Feel free to fork and adapt this template for your own portfolio.
