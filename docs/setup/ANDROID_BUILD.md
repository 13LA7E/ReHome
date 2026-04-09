# Android App Build Instructions

Your React web app has been successfully converted to an Android application using Capacitor! 🎉

## What's Been Done

1. ✅ Installed Capacitor core packages (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`)
2. ✅ Initialized Capacitor with:
   - App Name: **ReHome**
   - Package ID: **com.ReHome.app**
3. ✅ Updated Vite config to work with Capacitor (set base to "/")
4. ✅ Created Android project structure in `/android` folder
5. ✅ Added build scripts to package.json
6. ✅ Built and synced the app to Android platform

## Prerequisites

To build and run the Android app, you need:

### 1. Android Studio
- Download from: https://developer.android.com/studio
- Install with Android SDK and Android Virtual Device (AVD)

### 2. Java Development Kit (JDK)
- JDK 11 or higher
- Download from: https://www.oracle.com/java/technologies/javase-downloads.html
- Or use OpenJDK: https://adoptium.net/

### 3. Environment Variables (Windows)
Add these to your system environment variables:
```
JAVA_HOME=C:\Program Files\Java\jdk-11
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
```

Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

## Available Scripts

### Build and Open in Android Studio
```bash
npm run android
```
This will build the web app, sync to Android, and open Android Studio.

### Just Build and Sync
```bash
npm run android:sync
```
Builds the web app and syncs changes to the Android project.

### Just Open Android Studio
```bash
npm run android:open
```
Opens the Android project in Android Studio.

## How to Build APK

### Option 1: Using Android Studio (Recommended)

1. Run `npm run android` to open Android Studio
2. Wait for Gradle sync to complete
3. Connect your Android device or start an emulator
4. Click the green "Run" button (▶️) or press Shift+F10
5. Your app will be installed and launched!

### Option 2: Build APK from Command Line

After Android Studio setup:

```bash
# Debug APK (for testing)
cd android
./gradlew assembleDebug

# Find APK at: android/app/build/outputs/apk/debug/app-debug.apk
```

```bash
# Release APK (for distribution) - requires signing
cd android
./gradlew assembleRelease

# Find APK at: android/app/build/outputs/apk/release/app-release.apk
```

## Development Workflow

1. Make changes to your React code in `src/`
2. Test in browser: `npm run dev`
3. Build and sync to Android: `npm run android:sync`
4. Run in Android Studio or emulator

## Important Notes

### HashRouter
Your app already uses `HashRouter` which is perfect for Capacitor! No routing changes needed.

### Supabase Integration
Your Supabase integration will work on Android, but make sure:
- API keys are secure (consider environment variables)
- CORS settings on Supabase allow your Android app domain

### Permissions
If you need device permissions (camera, location, etc.), you'll need to:
1. Install Capacitor plugins (e.g., `@capacitor/camera`)
2. Add permissions to `android/app/src/main/AndroidManifest.xml`

Example plugins:
```bash
npm install @capacitor/camera
npm install @capacitor/geolocation
npm install @capacitor/filesystem
```

### App Icons and Splash Screen
To customize your app icon and splash screen:
1. Install the assets plugin: `npm install @capacitor/assets`
2. Place icons in `resources/icon.png` (1024x1024)
3. Place splash in `resources/splash.png` (2732x2732)
4. Run: `npx capacitor-assets generate`

## Troubleshooting

### "SDK location not found"
Create `android/local.properties`:
```
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

### Gradle Build Fails
1. Open Android Studio
2. Let it download missing SDK components
3. File → Invalidate Caches → Invalidate and Restart

### White Screen on App Launch
1. Check browser console in Chrome: `chrome://inspect/#devices`
2. Verify API keys are correct
3. Check network requests to Supabase

### Changes Not Reflecting
Always run `npm run android:sync` after making code changes!

## App Signing for Release

To publish on Google Play Store, you need to sign your APK:

1. Generate a keystore:
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Update `android/app/build.gradle` with signing config
3. Build: `./gradlew assembleRelease`

## Next Steps

1. **Test thoroughly** on real Android devices
2. **Customize app icon** and splash screen
3. **Add required permissions** in AndroidManifest.xml
4. **Configure signing** for release builds
5. **Submit to Google Play Store**

## Useful Links

- Capacitor Docs: https://capacitorjs.com/docs
- Android Developer Guide: https://developer.android.com/studio/run
- Capacitor Android Guide: https://capacitorjs.com/docs/android

---

Your app is now ready to run on Android! 🚀
