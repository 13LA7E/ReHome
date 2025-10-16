import sharp from 'sharp';
import fs from 'fs';

async function resizeOGImage() {
  try {
    // Resize to 1200x630 (Open Graph recommended size)
    await sharp('public/og-image.png')
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toFile('public/og-image-resized.png');
    
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
