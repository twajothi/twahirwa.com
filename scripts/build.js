#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Twahirwa Portfolio...');

const buildDir = path.join(__dirname, '..', 'build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

// Load data files for dynamic content generation
const loadDataFiles = () => {
    const dataDir = path.join(__dirname, '..', 'assets', 'data');
    const data = {};
    
    const dataFiles = ['profile', 'projects', 'skills', 'research', 'music', 'social'];
    
    dataFiles.forEach(file => {
        try {
            const filePath = path.join(dataDir, `${file}.json`);
            if (fs.existsSync(filePath)) {
                data[file] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
        } catch (error) {
            console.error(`Error loading ${file}.json:`, error);
            data[file] = {};
        }
    });
    
    return data;
};

// Generate dynamic HTML content
const generateDynamicHTML = (data) => {
    const indexPath = path.join(__dirname, '..', 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    
    if (data.social && data.social.socialMedia) {
        const socialMedia = data.social.socialMedia;
        
        // Update JSON-LD structured data
        const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
        const jsonLdMatch = html.match(jsonLdRegex);
        
        if (jsonLdMatch) {
            try {
                const structuredData = JSON.parse(jsonLdMatch[1]);
                
                // Update sameAs array with dynamic social links
                structuredData.sameAs = socialMedia
                    .filter(platform => platform.primary)
                    .map(platform => platform.url);
                
                const updatedJsonLd = `<script type="application/ld+json">\n    ${JSON.stringify(structuredData, null, 6)}\n    </script>`;
                html = html.replace(jsonLdRegex, updatedJsonLd);
            } catch (error) {
                console.error('Error updating structured data:', error);
            }
        }
        
        // Create platform URL mapping
        const platformUrls = {};
        socialMedia.forEach(platform => {
            platformUrls[platform.platform.toLowerCase()] = platform.url;
        });
        
        // Update social links
        const linkReplacements = [
            {
                pattern: /href="https:\/\/github\.com\/twahirwa"/g,
                replacement: `href="${platformUrls.github || 'https://github.com/twajothi'}"`
            },
            {
                pattern: /href="https:\/\/linkedin\.com\/in\/thibault-j-t"/g,
                replacement: `href="${platformUrls.linkedin || 'https://linkedin.com/in/thibault-j-t'}"`
            },
            {
                pattern: /href="https:\/\/instagram\.com\/twahirwa"/g,
                replacement: `href="${platformUrls.instagram || 'https://instagram.com/dj_t_square_j'}"`
            },
            {
                pattern: /href="https:\/\/(?:www\.)?youtube\.com\/@[^"]+"/g,
                replacement: `href="${platformUrls.youtube || 'https://youtube.com/@tjtmusic5833'}"`
            },
            {
                pattern: /href="https:\/\/tiktok\.com\/@twahirwa"/g,
                replacement: `href="${platformUrls.tiktok || 'https://tiktok.com/@twahirwa'}"`
            }
        ];
        
        linkReplacements.forEach(({ pattern, replacement }) => {
            html = html.replace(pattern, replacement);
        });
    }
    
    return html;
};

// Load data and generate dynamic content
const data = loadDataFiles();
const dynamicHTML = generateDynamicHTML(data);

// Write the generated HTML
const indexBuildPath = path.join(buildDir, 'index.html');
fs.writeFileSync(indexBuildPath, dynamicHTML);
console.log('✅ Generated dynamic index.html');

const filesToCopy = [
    'CNAME',
    'robots.txt',
    'sitemap.xml',
    '404.html',
    'assets/'
];

filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, '..', file);
    const destPath = path.join(buildDir, file);
    
    if (fs.existsSync(srcPath)) {
        if (fs.statSync(srcPath).isDirectory()) {
            execSync(`cp -r "${srcPath}" "${destPath}"`);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
        console.log(`✅ Copied ${file}`);
    }
});

// Minification disabled due to syntax breaking issues
// For production, consider using a proper minifier like terser or uglify-js
console.log('📄 Assets copied without minification for code stability');

const sitemapPath = path.join(buildDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
    let sitemap = fs.readFileSync(sitemapPath, 'utf8');
    const currentDate = new Date().toISOString().split('T')[0];
    sitemap = sitemap.replace('2025-01-01', currentDate);
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`📅 Updated sitemap with current date: ${currentDate}`);
}

console.log('✨ Build complete! Files are ready in the build/ directory.');
console.log('📁 Build directory:', buildDir);
