# Thibault Twahirwa - Portfolio

🌐 **Live Site**: [twahirwa.com](https://twahirwa.com)

## ✨ New Features (v2.0)

### 🔄 Dynamic Content Management
All content is now driven by JSON files for easy updates:
- **Profile**: `assets/data/profile.json` - Personal info, education, interests
- **Skills**: `assets/data/skills.json` - Technical skills, languages, research areas
- **Projects**: `assets/data/projects.json` - Featured projects with metadata
- **Research**: `assets/data/research.json` - Publications, interests, current work
- **Music**: `assets/data/music.json` - Tracks, genres, platforms
- **Social**: `assets/data/social.json` - Social media links and descriptions

### 🎵 Automatic Spotify Integration
Your music data automatically updates from your Spotify artist profile daily!

## 🚀 Quick Start

### Local Development
```bash
# Clone the repository
git clone https://github.com/twahirwa/twahirwa.com.git
cd twahirwa.com

# Install dependencies (for Spotify integration)
npm install

# Start local server
npm start
# or
python3 -m http.server 8000
```

Visit `http://localhost:8000`

### Content Updates

#### Update Personal Info
Edit `assets/data/profile.json`:
```json
{
  "name": "Your Name",
  "title": "Your Title",
  "education": [
    {"degree": "Your Degree", "school": "Your School"}
  ],
  "currentFocus": ["Area 1", "Area 2"],
  "funFacts": ["Fact 1", "Fact 2"]
}
```

#### Add New Projects
Edit `assets/data/projects.json`:
```json
{
  "projects": [
    {
      "title": "Project Name",
      "description": "Project description",
      "technologies": ["Tech1", "Tech2"],
      "github": "https://github.com/user/repo",
      "featured": true,
      "category": "AI/ML"
    }
  ]
}
```

#### Update Skills
Edit `assets/data/skills.json`:
```json
{
  "technicalSkills": {
    "programming": ["Python", "JavaScript"],
    "frameworks": ["React", "Django"]
  },
  "languages": {
    "fluent": ["English", "French"],
    "conversational": ["Spanish"]
  }
}
```

## 🎵 Spotify Integration Setup

### 1. Get Spotify API Credentials
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Note your `Client ID` and `Client Secret`

### 2. Add GitHub Secrets
In your GitHub repository:
1. Go to Settings → Secrets and variables → Actions
2. Add these secrets:
   - `SPOTIFY_CLIENT_ID`: Your Spotify Client ID
   - `SPOTIFY_CLIENT_SECRET`: Your Spotify Client Secret

### 3. Test Locally (Optional)
```bash
# Set environment variables
export SPOTIFY_CLIENT_ID="your_client_id"
export SPOTIFY_CLIENT_SECRET="your_client_secret"

# Test the integration
npm run test-spotify
```

### 4. Automatic Updates
- Music data updates daily at 6 AM UTC
- Manual trigger: Go to Actions → "Update Music Data" → "Run workflow"
- Changes are automatically committed to your repository

## 🛠️ Enhanced Features

### About Window
Now displays:
- Complete education history
- Technical skills breakdown (Programming, Frameworks, Tools)
- All languages with proficiency levels
- Current focus areas and fun facts

### Projects Window
Shows all featured projects with:
- Complete descriptions and metadata
- Technology tags with categories
- Direct GitHub repository links

### Research Window
Comprehensive research display:
- All publications with full details
- Research interests and current projects
- Links to academic profiles

### Music Window
Dynamic T-SquareJ content:
- Latest tracks from Spotify
- All genres and musical styles
- Direct platform links (Spotify, YouTube)

## 📁 Enhanced Structure

```
├── assets/
│   ├── data/           # JSON files for easy content management
│   │   ├── profile.json
│   │   ├── skills.json
│   │   ├── projects.json
│   │   ├── research.json
│   │   ├── music.json
│   │   └── social.json
│   ├── js/             # Modular JavaScript
│   └── css/            # Organized stylesheets
├── .github/workflows/  # GitHub Actions for automation
├── scripts/            # Build and automation scripts
└── package.json        # Node.js dependencies
```

## 🔧 Deployment

### GitHub Pages (Automatic)
1. Push changes to `main` branch
2. GitHub Pages automatically deploys
3. Spotify data updates daily via GitHub Actions

### Manual Deployment
```bash
git add .
git commit -m "Update content"
git push origin main
```

## 🌐 Custom Domain Setup

DNS Configuration for `twahirwa.com`:
```
A Record: 185.199.108.153
A Record: 185.199.109.153
A Record: 185.199.110.153
A Record: 185.199.111.153
CNAME: www → username.github.io
```

## 🎨 Features

- **Matrix Rain Effect**: Custom symbols and animations
- **Draggable Windows**: Full desktop OS experience
- **Interactive Terminal**: Custom commands and data access
- **Konami Code Easter Egg**: Hidden features
- **Responsive Design**: Works on all devices
- **JSON-Driven Content**: Easy updates without code changes
- **Automatic Music Updates**: Sync with Spotify artist profile

## 🔄 Regular Maintenance

### Update Content
1. Edit appropriate JSON file in `assets/data/`
2. Commit and push changes
3. Site updates automatically

### Add New Features
1. Update JSON structure if needed
2. Modify JavaScript in `assets/js/app.js`
3. Test locally before deploying

### Monitor Automation
- Check GitHub Actions tab for successful runs
- Review auto-generated commits for music updates

## 📧 Contact

- **Email**: thibault.twahirwa@gmail.com
- **GitHub**: [@twahirwa](https://github.com/twahirwa)
- **LinkedIn**: [/in/thibault-j-t](https://linkedin.com/in/thibault-j-t)
- **Spotify**: [T-SquareJ](https://open.spotify.com/artist/1zMYW2mNBr1VFO6iuOh7F9)

---

## 🎯 Pro Tips

1. **Easy Updates**: Change JSON files instead of HTML/JS for content updates
2. **Music Sync**: Your latest Spotify releases automatically appear on the site
3. **Skills Management**: Update `skills.json` to showcase new technologies
4. **Project Showcase**: Set `"featured": true` in `projects.json` to highlight projects
5. **Research Display**: Add new publications to `research.json` with full metadata

*Built with ❤️ using data-driven architecture for easy content management*
