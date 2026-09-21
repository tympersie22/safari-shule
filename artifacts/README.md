# Local release artifacts

`safari-shule-1.0.0-local-validation.aab` proves that the Android SDK 36 release build, Hermes bundle, native Expo modules, and native in-app purchase module compile together.

This file uses a generated debug signing key and includes only the arm64 ABI to keep the local validation build practical. Do not upload it to Google Play. Create the store AAB with the `production` EAS profile after the permanent upload key is configured.

The iOS simulator ZIP is also a local release-mode validation artifact. It cannot be uploaded to App Store Connect. A store IPA requires the owner's Apple distribution certificate and provisioning profile.
