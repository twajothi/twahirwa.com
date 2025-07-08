#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Twahirwa Portfolio...');

const buildDir = path.join(__dirname, '..', 'build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

const filesToCopy = [
    'index.html',
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

const cssDir = path.join(buildDir, 'assets', 'css');
if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
    
    cssFiles.forEach(file => {
        const filePath = path.join(cssDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        content = content
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
            .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
            .replace(/;\s*/g, ';') // Remove spaces after semicolon
            .trim();
        
        fs.writeFileSync(filePath, content);
        console.log(`🗜️  Minified ${file}`);
    });
}

const jsDir = path.join(buildDir, 'assets', 'js');
if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
    
    jsFiles.forEach(file => {
        const filePath = path.join(jsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        content = content
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*$/gm, '') // Remove line comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/;\s*}/g, ';}') // Clean up semicolons
            .trim();
        
        fs.writeFileSync(filePath, content);
        console.log(`🗜️  Minified ${file}`);
    });
}

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
