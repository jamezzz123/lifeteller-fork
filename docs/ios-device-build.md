# Building and Running on iOS Device

This guide covers how to build and run the Lifteller Expo app on a physical iOS device without using EAS CLI.

## Prerequisites

Before you begin, ensure you have the following installed:

- **macOS** (required for iOS development)
- **Xcode** (latest version recommended)
  - Download from [Mac App Store](https://apps.apple.com/us/app/xcode/id497799835)
  - Open Xcode once to accept the license agreement and install additional components
- **CocoaPods** - Install with:
  ```bash
  sudo gem install cocoapods
  ```
- **Node.js** (v18 or later recommended)
- **pnpm** - This project uses pnpm as the package manager
  ```bash
  npm install -g pnpm
  ```
- **Apple Developer Account** (free account works for development)
- **iOS Device** (iPhone/iPad) connected via USB

## Quick Start

The fastest way to build and run on your iOS device:

```bash
npx expo run:ios --device
```

This command will automatically:

- Install CocoaPods dependencies
- Build the app for your connected device
- Install the app on your device
- Start the Metro bundler

## Detailed Build Instructions

### Method 1: Using Expo CLI (Recommended)

This is the easiest and most reliable method:

1. **Connect your iOS device** to your Mac via USB

2. **Trust your computer** on the iOS device (if prompted)

3. **Run the build command:**

   ```bash
   npx expo run:ios --device
   ```

4. **Select your device** when prompted (if multiple devices are connected)

5. **Wait for the build** - This may take several minutes on the first build

6. **The app will launch** automatically on your device once the build completes

**Note:** The first build can take 10-15 minutes. Subsequent builds are much faster.

### Method 2: Using Xcode (Manual Build)

If you prefer more control over the build process:

#### Step 1: Install Dependencies

Install JavaScript dependencies:

```bash
pnpm install
```

Install CocoaPods dependencies:

```bash
pnpm run ios:pod-install
```

Or manually:

```bash
cd ios && pod install && cd ..
```

#### Step 2: Open in Xcode

**Important:** Always open the `.xcworkspace` file, not the `.xcodeproj` file!

```bash
open ios/lifteller.xcworkspace
```

#### Step 3: Configure Code Signing

1. In Xcode, select your project in the navigator (top-left)
2. Select the **lifteller** target
3. Click on the **Signing & Capabilities** tab
4. Under **Signing**, check **"Automatically manage signing"**
5. Select your **Team** from the dropdown
   - If you don't see your team, click "Add Account..." and sign in with your Apple ID
   - A free Apple ID works for development builds

Xcode will automatically:

- Create a provisioning profile
- Configure code signing
- Handle certificate management

#### Step 4: Select Your Device

1. In the top toolbar, click the device selector (next to the Play button)
2. Select your connected iOS device from the list
   - Make sure your device is unlocked
   - Trust the computer if prompted on the device

#### Step 5: Build and Run

1. Press **⌘R** (or click the Play button)
2. Xcode will:
   - Build the app (this may take several minutes the first time)
   - Install it on your device
   - Launch the app automatically

#### Step 6: Start Development Server

After the app launches on your device:

1. Open a terminal in the project root
2. Start the Expo development server:
   ```bash
   pnpm start
   ```
3. The app will automatically connect to the dev server
4. You can now make changes and see them reflected on your device

### Method 3: Command Line Build

For advanced users who want to build from the command line:

#### Build for iOS Simulator

```bash
pnpm run ios:build
```

#### Build for iOS Device

```bash
pnpm run ios:build-device
```

**Note:** This method requires proper code signing configuration in Xcode first.

After building, you'll need to:

1. Install the app manually (via Xcode or command line)
2. Start the development server separately

## Building for Release

To create a release build for TestFlight or App Store:

1. **Update version numbers** in `app.json`:

   ```json
   {
     "expo": {
       "version": "1.0.0",
       "ios": {
         "buildNumber": "1"
       }
     }
   }
   ```

2. **Configure release signing** in Xcode:
   - Use a distribution certificate
   - Select App Store or Ad Hoc provisioning profile

3. **Archive the app:**
   - In Xcode: **Product → Archive**
   - Wait for the archive to complete

4. **Distribute:**
   - Click **Distribute App**
   - Follow the prompts for TestFlight or App Store

## Additional Resources

- [Expo Development Builds Documentation](https://docs.expo.dev/develop/development-builds/introduction/)
- [React Native iOS Setup](https://reactnative.dev/docs/environment-setup)
- [Xcode Documentation](https://developer.apple.com/documentation/xcode)
- [CocoaPods Guide](https://guides.cocoapods.org/)
