#!/usr/bin/env node

/**
 * Favicon Generator Script
 * 
 * This script helps generate favicon files in different formats from the SVG source.
 * Requires sharp package: npm install sharp
 * 
 * Usage: node scripts/generate-favicons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available (for PNG generation)
let sharp;
try {
  sharp = require('sharp');
  console.log('✅ Sharp library available - will generate PNG files');
} catch (error) {
  console.log('ℹ️  Sharp library not available. Install with: npm install sharp');
  console.log('📝 For now, here are manual steps to create favicon files:');
}

const svgPath = path.join(__dirname, '../assets/images/favicon.svg');
const outputDir = path.join(__dirname, '../assets/images/');

// Favicon sizes to generate
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' }
];

async function generateFavicons() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgPath);
    console.log(`📖 Reading SVG from: ${svgPath}`);

    if (sharp) {
      // Generate PNG files
      for (const { size, name } of sizes) {
        const outputPath = path.join(outputDir, name);
        
        await sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toFile(outputPath);
        
        console.log(`✅ Generated: ${name} (${size}x${size})`);
      }

      // Generate ICO file (basic approach)
      const icoPath = path.join(outputDir, 'favicon.ico');
      await sharp(svgBuffer)
        .resize(32, 32)
        .png()
        .toFile(icoPath.replace('.ico', '-temp.png'));
      
      console.log('✅ Generated temp PNG for ICO conversion');
      console.log('📝 Note: Convert the temp PNG to ICO using online tools or imagemagick');
      
    } else {
      console.log('\n📝 Manual Steps to Create Favicon Files:');
      console.log('1. Open favicon.svg in a vector graphics editor (Inkscape, Illustrator, etc.)');
      console.log('2. Export to PNG at these sizes:');
      sizes.forEach(({ size, name }) => {
        console.log(`   - ${name}: ${size}x${size}px`);
      });
      console.log('3. Convert one PNG to favicon.ico using online tools or imagemagick');
      console.log('\n🌐 Online Tools:');
      console.log('   - https://realfavicongenerator.net/');
      console.log('   - https://favicon.io/');
      console.log('   - https://www.favicon-generator.org/');
    }

    console.log('\n🎯 Your favicon setup includes:');
    console.log('✅ SVG favicon (modern browsers)');
    console.log('✅ Web App Manifest (PWA support)');
    console.log('✅ Multiple PNG sizes (compatibility)');
    console.log('✅ Apple Touch Icon (iOS devices)');
    
  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
  }
}

// Instructions for different icon types
function showIconInstructions() {
  console.log('\n🎨 Types of Web Icons:');
  console.log('\n1. 🏷️  FAVICON (Browser Tab)');
  console.log('   - favicon.svg (32x32, modern browsers)');
  console.log('   - favicon.ico (16x16, 32x32, legacy)');
  console.log('   - Used in browser tabs, bookmarks, address bar');
  
  console.log('\n2. 📱 APP ICONS (Mobile/Desktop)');
  console.log('   - apple-touch-icon.png (180x180, iOS)');
  console.log('   - icon-192.png, icon-512.png (Android PWA)');
  console.log('   - Used when site is added to home screen');
  
  console.log('\n3. 🔗 CONTENT ICONS (Within Pages)');
  console.log('   - Add icons to external links');
  console.log('   - Social media platform icons');
  console.log('   - Technology/skill badges');
  
  console.log('\n📚 Your Current Setup:');
  console.log('✅ Favicon configured in HTML');
  console.log('✅ PWA manifest for installable app');
  console.log('✅ Theme colors for browser UI');
  console.log('✅ Meta tags for social sharing');
}

// Run the generator
if (require.main === module) {
  console.log('🎯 Favicon Generator for Twahirwa Portfolio\n');
  showIconInstructions();
  generateFavicons();
}

module.exports = { generateFavicons }; 