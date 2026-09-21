# Asset handoff

## Illustration inventory

Produce rounded, high-contrast SVG or PNG art at 1x/2x/3x where appropriate. Filenames use `scene_<zone>`, `npc_<zone>`, `item_<name>`, and `icon_<action>` in lowercase snake case. Keep the cue recognizable at 48 dp. Include clear outlines so shape, not colour alone, identifies it. `src/visual.tsx` contains temporary native SVG pictograms to be replaced after the final art review.

- Five scenes: `scene_sokoni` (Tanzanian market stalls, bananas, mangoes, coconuts), `scene_bahari` (coastal shells and dhow), `scene_pori` (savanna), `scene_nyumbani` (home), `scene_shuleni` (school).
- Five local guide characters: `npc_sokoni`, `npc_bahari`, `npc_pori`, `npc_nyumbani`, `npc_shuleni`; character designs and clothing require Tanzanian artist review.
- Countable items: banana, mango, pineapple, tomato, coconut, each as an isolated icon.
- Sorting shells: three colours, three sizes, and three shapes with non-colour cues.
- Animals: giraffe, elephant, zebra, lion; habitat cards.
- Family and calendar icons; clock faces for 3:00 and 6:00.
- Navigation/action icons: map, test star, parents, play, replay audio, next, break, correct star, gentle retry cue.
- Cosmetic extras only: kanga pattern and kofia variations.

## Human voice inventory

Record one file for each language and every key in `src/content.ts`: `assets/audio/sw/<camelCaseKey>.m4a` and `assets/audio/en/<camelCaseKey>.m4a`. Narrate exact reviewed text. Keep warm, unhurried pacing and consistent levels. Record each multiple-choice word as an individual clip as well. Add each file to `voiceFiles` in `src/audio.ts` with static `require`; test both sequence orders and missing-file handling. No synthesized voice should be shipped as final narration.

## Feedback sounds

`feedback_correct.m4a`: short warm chime. `feedback_retry.m4a`: soft two-note cue. No harsh buzzer. Ensure feedback is also represented by star bounce or gentle motion, icon shape, and accessible label.
