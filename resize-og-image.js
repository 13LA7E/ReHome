import sharp from 'sharp';
import fs from 'fs';

async function resizeOGImage() {
  try {
    // Resize to 1200x630 for Facebook, Twitter, LinkedIn
    await sharp('IMG_3091.PNG')
      .resize(1200, 630, {
        fit: 'contain',
        position: 'center',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png({ quality: 90 })
      .toFile('public/og-image-resized.png');
    
    console.log('✅ Standard og-image created (1200x630)');
    
    // Create 1080x1080 square for Instagram
    await sharp('IMG_3091.PNG')
      .resize(1080, 1080, {
        fit: 'contain',
        position: 'center',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png({ quality: 90 })
      .toFile('public/og-image-square.png');
    
    console.log('✅ Instagram square image created (1080x1080)');
    
    console.log('✅ Standard og-image created (1200x630)');
    
    // Create 1080x1080 square for Instagram
    await sharp('IMG_3091.PNG')
      .resize(1080, 1080, {
        fit: 'contain',
        position: 'center',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .jpeg({ quality: 90 })
      .toFile('public/og-image-square.png');
    
    console.log('✅ Instagram square image created (1080x1080)');
    
    console.log('✅ Image resized successfully!');
    console.log('Size: 1200x630px');
    
    // Get file sizes
    const originalSize = fs.statSync('public/og-image.png').size;
    const resizedSize = fs.statSync('public/og-image-resized.png').size;
    
    console.log(`Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`Resized: ${(resizedSize / 1024).toFixed(2)} KB`);
    console.log(`Saved: ${((originalSize - resizedSize) / 1024).toFixed(2)} KB`);
    
    // Replace the original with resized
    fs.copyFileSync('public/og-image-resized.png', 'public/og-image.png');
    fs.unlinkSync('public/og-image-resized.png');
    
    console.log('✅ Original file replaced with optimized version!');
  } catch (error) {
    console.error('❌ Error resizing image:', error);
  }
}

resizeOGImage();
