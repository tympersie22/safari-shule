# QA checklist

## Functional

- [ ] Fresh install: tap Play, open each of five zones, answer every question, finish Star Test (5 + 5 + 5), reach report.
- [ ] Check first-try star, second-try no star, and progress persistence after forced app close.
- [ ] Complete memory match, Rangi Zangu rule switch, village build, and stop/go.
- [ ] Toggle the language; every child-facing label, prompt, answer, activity, and accessibility label changes to the selected language without mixed English and Swahili.
- [ ] Record and check every voice clip; airplane mode must play all prompts without loading or crashes.
- [ ] Simulate failed storage reads/writes and missing audio: app stays responsive and shows a recoverable cue.
- [ ] Test break cue at 10, 18, and 30 minutes; exit has no friction.

## Devices and accessibility

- [ ] Profile cold start below 3 seconds and animation frames on a mid-range Android phone with no network.
- [ ] Test small screens, tablets, large text, high contrast, colour vision differences, and screen readers on the parent dashboard.
- [ ] Check 44 pt/48 dp touch targets, focus order, selected-language accessibility labels, and visual/audio/shape feedback.
- [ ] Let several children aged 4–7 start play unaided within 10 seconds; observe confusion without coaching. Repeat in both leading languages.

## Commerce and privacy

- [ ] Confirm store products and exact trial duration and price in each territory; no plan preselected; no child-facing purchase UI.
- [ ] Test sandbox purchase, pending purchase, cancel, restore, offline store failure, price change, expired subscription, refund, and revoked purchase.
- [ ] Verify server response from signed receipts only; no credentials in app; finalize transaction after verification.
- [ ] Confirm Parent Dashboard renewal banner appears during trial before conversion; manage/cancel opens actual platform management.
- [ ] Inspect binary and network traffic: no ads, tracking, fingerprinting, or unnecessary personal data.
- [ ] Audit every screen for timers, guilt, urgency, streak penalties, infinite scroll, surprise reward schedules, or resistant exit flow. None may ship.
