# App Icons Setup

## Instructions

To set your custom app icon:

1. **Save your icon image** as `icon.png` in this folder
   - The image should be **1024x1024 pixels** minimum
   - PNG format with transparent background (recommended)
   - This will be your app icon (the leaf design)

2. **(Optional) Save splash screen** as `splash.png` in this folder
   - Recommended size: 2732x2732 pixels
   - This will be shown when the app launches

3. **Run the icon generator:**
   ```bash
   npm run generate-icons
   ```

4. **Rebuild the app:**
   ```bash
   npm run android:sync
   ```

The generator will automatically create all required icon sizes for Android!

## Current Status

The leaf icon image needs to be saved as `icon.png` in this folder.
