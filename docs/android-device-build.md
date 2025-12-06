## Building and Running on Android Device

This guide covers how to build and run the Lifteller Expo app on a physical Android device without using EAS CLI.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Windows, macOS, or Linux**
- **Android Studio** (includes Android SDK and platform tools)
  - Download from the [Android Studio website](https://developer.android.com/studio)
  - Open once to finish setup and install SDK components
- **Java Development Kit (JDK 17 recommended)**
- **Node.js** (v18 or later recommended)
- **pnpm** - This project uses pnpm as the package manager

  ```bash
  npm install -g pnpm
  ```

- **Android device** (phone/tablet) connected via USB
- **USB debugging enabled** on the device
  - Settings → About phone → Tap *Build number* 7 times to enable Developer options
  - Settings → System → Developer options → Enable **USB debugging**

### Quick Start

The fastest way to build and run on your Android device:

```bash
npx expo run:android
```

This command will automatically:

- Generate the native Android project (if needed)
- Install Gradle dependencies
- Build the app for your connected device or emulator
- Install the app on the device
- Start the Metro bundler

If both an emulator and a device are available, Expo CLI will guide you to choose where to run the app.

### Detailed Build Instructions

#### Method 1: Using Expo CLI (Recommended)

This is the easiest and most reliable method:

1. **Connect your Android device** to your computer via USB
2. Make sure **USB debugging is enabled** and the device is trusted by your computer
3. **Run the build command:**

   ```bash
   npx expo run:android
   ```

4. If prompted, **select your device**
5. **Wait for the build** - The first build can take several minutes
6. The app will be installed and launched on your device automatically

Subsequent builds are much faster because the native project and Gradle caches are reused.

#### Method 2: Using Android Studio (Manual Build)

If you prefer more control over the build process:

##### Step 1: Install JavaScript dependencies

```bash
pnpm install
```

##### Step 2: Generate / update the Android project (if needed)

If you have not run this before (or after major config changes):

```bash
npx expo prebuild --platform android
```

##### Step 3: Open the project in Android Studio

1. Open **Android Studio**
2. Click **Open**
3. Select the `android` folder in the project root
4. Wait for Gradle sync to complete (this may take a few minutes)

##### Step 4: Select Your Device

1. Connect your Android device via USB
2. In Android Studio, in the top toolbar, open the device selector
3. Select your physical device from the list
4. Make sure the device is unlocked and USB debugging is allowed

##### Step 5: Build and Run

1. Click the **Run** button (green play icon) or press **Shift+F10**
2. Android Studio will:
   - Build the app
   - Install it on your device
   - Launch the app automatically

##### Step 6: Start the Development Server

After the app launches on your device:

1. Open a terminal in the project root
2. Start the Expo development server:

   ```bash
   pnpm start
   ```

3. The app will automatically connect to the dev server
4. You can now make changes and see them reflected on your device

#### Method 3: Command Line Build Only

For advanced users who want to build from the command line using the Gradle wrappers exposed in `package.json`:

##### Build Debug APK (Development)

```bash
pnpm run android:build
```

This runs:

- `cd android && ./gradlew assembleDebug`

Resulting APKs are placed under:

- `android/app/build/outputs/apk/debug/`

##### Build Release APK (Device / Distribution)

```bash
pnpm run android:build-device
```

This runs:

- `cd android && ./gradlew assembleRelease`

Resulting APKs are placed under:

- `android/app/build/outputs/apk/release/`

> **Note:** For signed release builds, you must configure signing in `android/app/build.gradle` and provide a keystore. Unsigned release APKs are still useful for local testing or signing later.

### Building for Release

To create a release build suitable for distribution:

1. **Update version numbers** in `app.json`:

   ```json
   {
     "expo": {
       "version": "1.0.0",
       "android": {
         "versionCode": 1
       }
     }
   }
   ```

2. **Configure Android signing** in `android/app/build.gradle`:
   - Define your keystore path, passwords, and key alias
   - Reference the signing config in the `release` build type

3. **Build the release APK or App Bundle:**

   ```bash
   cd android
   ./gradlew assembleRelease      # APK
   # or
   ./gradlew bundleRelease        # AAB for Play Store
   ```

4. **Distribute:**
   - Upload the signed APK/AAB to the Google Play Console
   - Or sideload the APK directly to devices

### Additional Resources

- [Expo Development Builds Documentation](https://docs.expo.dev/develop/development-builds/introduction/)
- [React Native Android Setup](https://reactnative.dev/docs/environment-setup)
- [Android Studio User Guide](https://developer.android.com/studio/intro)
- [Publishing to Google Play Store](https://developer.android.com/studio/publish)


