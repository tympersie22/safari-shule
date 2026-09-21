# Safari Shule production release runbook

## Release position

The codebase can now produce native release builds for iOS and Android. The first public release should go through TestFlight and Google Play internal testing before store review. Do not submit the local validation AAB in `artifacts/`: it is signed with the generated debug key and exists only to prove that the Android release graph compiles.

The store-ready IPA and AAB require the owner's Apple, Google Play, and Expo accounts. Those credentials must stay in Apple, Google, or EAS credential storage and must never be committed to this repository.

## Inputs still required from the owner

- Apple Developer Program team and App Store Connect access.
- Google Play Console developer account.
- Expo account or organization that will own the EAS project.
- Confirmation that `com.safarishule.app` is the permanent bundle ID/package name. It cannot be changed after store release without creating a new app.
- Public privacy policy URL, support URL, support email, legal publisher name, and copyright owner.
- App Store Connect app ID and Google service-account key after the app records are created.
- Store products for `com.safarishule.extras.weekly` and `com.safarishule.extras.lifetime` if paid extras ship in 1.0.
- Production HTTPS receipt-verification endpoint for `EXPO_PUBLIC_PURCHASE_VERIFY_URL` if paid extras ship in 1.0.
- Human Swahili narration and native-speaker copy approval.

## One-time EAS setup

Run these commands from the app directory:

```bash
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest build:version:set
```

Choose remote version management and initialize both platforms at build 1. The checked-in `eas.json` increments the iOS build number and Android version code for later production builds.

If purchases are enabled, add the receipt service URL to the EAS production environment:

```bash
npx eas-cli@latest env:create --environment production --name EXPO_PUBLIC_PURCHASE_VERIFY_URL --value https://YOUR-DOMAIN.example/verify --visibility sensitive
```

## Build and test

```bash
npm ci
npm run release:check
npm run build:preview
```

Install the preview APK and iOS Simulator build. Complete `docs/QA.md`, then create store builds:

```bash
npm run build:production
```

The production Android profile creates an AAB. The production iOS profile creates a signed archive for App Store Connect. EAS can generate and securely retain the first Android upload key, Apple distribution certificate, and provisioning profile.

## Submission order

1. Upload iOS to TestFlight with `npm run submit:ios`.
2. Upload Android as a draft on the internal testing track with `npm run submit:android`.
3. Test purchases with StoreKit sandbox and Google license testers on real devices.
4. Complete privacy, age rating, Families/Kids, data safety, export compliance, content rights, and review-notes forms.
5. Run a small closed beta with adults and supervised child usability sessions.
6. Promote Android from internal to closed testing, then production. Submit iOS for review with manual release selected.

## Release blockers

- No public privacy/support URLs have been supplied.
- Narration assets and native-speaker review are incomplete.
- The purchase verification service and live store products do not exist yet. Keep purchases disabled or remove paid offers from 1.0 until both are ready.
- Real-device QA, accessibility QA, child usability testing, and curriculum/legal review remain open in `docs/QA.md` and `docs/PRELAUNCH.md`.
- The 10 moderate `npm audit` findings are in Expo build tooling and its `xcode`/`uuid` chain. There are no high or critical findings. Do not use the suggested forced Expo 46 downgrade; recheck before each release and upgrade through an Expo-supported SDK update.

## Recommended 1.0 scope

Ship the learning worlds, Star Test, and four mini games first. If receipt verification, product configuration, and purchase QA are not complete, defer subscriptions and lifetime extras to 1.1. This keeps the first Kids/Families review focused on the learning experience and privacy model.
