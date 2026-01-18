## iOS TestFlight Deployment (Xcode)

This project is deployed to TestFlight using Xcode (manual build, archive, and distribute).

### Steps

1. Open the workspace: `ios/lifteller.xcworkspace`
2. Select the `Lifteller` scheme and a device/simulator
3. Ensure Signing & Capabilities is set to the correct team and bundle ID
4. Archive: Product → Archive
5. Distribute: Distribute App → App Store Connect → Upload
6. In App Store Connect, add the build to TestFlight testers

### Notes

- Use your macOS login keychain password when prompted by codesign
- Bundle ID must match the App Store Connect record
