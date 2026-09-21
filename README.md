# Safari Shule

A local-first React Native / Expo app for early learners. It opens with an illustrated Sokoni game where a child taps mangoes to count, answers generated questions, retries gently, earns persistent stars, and switches the entire interface between English and Swahili without losing the round. The learning map, Star Test, activities, and parent-gated area live in the same Expo app.

## Run

```bash
npm install
npm run typecheck
npm test
npx expo start
```

The reference phone layout is landscape. The market, coast, savanna, home, and school environments are bundled locally, so every learning world works offline. Every world now uses the complete Sokoni-style loop: a themed welcome with the guide, five interactive rounds, gentle retry feedback, first-try stars, in-game language switching, and a replayable world report. Sokoni creates fresh values and distractors on the device; the four other worlds build five-round sessions from their own bundled curriculum. Correct scored answers celebrate for 0.9 seconds and advance automatically; an incorrect answer keeps the current question open.

Each activity has its own polished 3D thumbnail. Build a Village is a goal-based sandbox with six plots, four placeable item types, live goal counters, removal, reset, and a locked finish action until the mission is complete. Stop & Go is a randomized reaction game with five checkpoints, early-tap feedback, and a new delay on each round.

Native store billing requires an Expo development build, store products, and a receipt-verification service. Expo Go cannot run `react-native-iap`. The app deliberately refuses to start a purchase until `EXPO_PUBLIC_PURCHASE_VERIFY_URL` is configured. Learning content still works.

## Architecture

React Native was selected for one TypeScript codebase on Android and iOS, with Expo for bundling and native builds. The app is intentionally local-first: content is bundled in `src/content.ts` and `src/engine.ts`; progress and preferences are persisted in AsyncStorage. No account, network, ad SDK, analytics SDK, or child profile is needed. The only network request is a parent-initiated purchase verification call. `App.tsx` owns navigation and session state; `src/engine.ts` owns answer checks and star awards; `src/storage.ts` owns persistence; `src/parent.tsx` owns the gated adult area and native IAP; `src/audio.ts` owns narrated playback.

The child tabs are Map, Star Test, and Parents. A zone is reached in two taps from Home. Zone questions, five questions in each of the three Star Test sections, memory match, rule-switch sorting, goal-based village building, and the stop/go reaction run are implemented. Correct first attempts earn a star; attempts after a mistake can continue without penalty. Every learning zone remains open even with zero stars. Stars are visual progress and can later be used for cosmetic art only. The generated 3D scene art and vector interaction pieces are bundled assets and have been checked in the iOS simulator; a final release should still include art-direction and low-end device review.

## Required external inputs before release

1. **Human narration:** `src/audio.ts` has a typed voice manifest. Record every `src/content.ts` key in Tanzanian Swahili and English, then add static `require('../assets/audio/sw/<key>.m4a')` / `en` entries. The app handles missing audio without crashing, but the child accessibility requirement is incomplete until these files exist. Each prompt and instruction must be tested on a phone with screen off and on. Native-speaker review is mandatory.
2. **Artwork:** The current emoji and template icons prove the mechanics, but are not finished Tanzanian illustrations. Replace them using `docs/ASSETS.md`. The visual target and low-end performance target need device review.
3. **Store setup:** Create `com.safarishule.extras.weekly` with the exact 3-day free trial and $2.99/week terms, plus `com.safarishule.extras.lifetime` for $19.99 in both stores. The app displays both alternatives without a preselected plan and links to real platform subscription management. Localized store prices are shown when available. Verify prices and offer eligibility in each storefront and region.
4. **Receipt service:** Set `EXPO_PUBLIC_PURCHASE_VERIFY_URL` to an HTTPS endpoint. It receives `{ purchase, platform }`, verifies the signed Apple transaction with App Store Server API or Google purchase token with Google Play Developer API, and returns `{ "verified": true, "trialEndsAt": "ISO-8601" }` only for an active, valid entitlement. Reject expired, revoked, canceled, and mismatched product/package transactions. Keep store credentials on the server. This service is not in this repository, so paid purchases are disabled by default.
5. **Legal and curriculum review:** See `docs/PRELAUNCH.md`. This code does not itself certify COPPA, GDPR-K, store policy, or Cambridge/TIE alignment.

## Native builds

Set real bundle identifiers, signing credentials and store capabilities before building. Use `npx expo prebuild` or EAS build for iOS and Android. Test Play Billing and StoreKit using store sandbox accounts. Do not publish from Expo Go.

Production build profiles, submission commands, store metadata, a privacy-policy draft, and the release sequence are documented in `docs/RELEASE.md`. Run `npm run release:check` before every preview or production build. Local validation artifacts are saved under `artifacts/`; they prove the native release graphs compile but are not signed for store submission.

The generated native iOS project is at `ios/SafariShule.xcodeproj`. Run `cd ios && pod install`, then open `SafariShule.xcworkspace` in Xcode. On this Mac, Xcode 27 built the app successfully and the iPhone 17 Pro simulator running iOS 26.3 launched it. The home screen was visually checked.

This Mac's Documents folder attaches File Provider/Finder metadata to generated Expo frameworks, which made their code-signing script fail when building in place. The successful build used a local copy outside Documents (`/tmp/safari-shule-xcode`) with Xcode derived data in `/tmp/safari-shule-derived`. If building this saved project in Documents hits `resource fork, Finder information, or similar detritus not allowed`, copy the project to a local unsynced folder, run `pod install` there, and open that copy's `.xcworkspace`.
