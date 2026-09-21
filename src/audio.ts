import { createAudioPlayer } from 'expo-audio';
import { CopyKey, Language } from './content';

// The voice team must populate this manifest with bundled, human-recorded files before release.
export const voiceFiles: Partial<Record<CopyKey, Partial<Record<Language, number>>>> = {};

export async function narrate(key: CopyKey, first: Language, volume: number): Promise<boolean> {
  const second = first === 'sw' ? 'en' : 'sw';
  const sources = [voiceFiles[key]?.[first], voiceFiles[key]?.[second]];
  if (sources.some(source => !source)) return false;
  for (const source of sources) {
    const player = createAudioPlayer(source!);
    try {
      player.volume = volume;
      player.play();
      const completed = await new Promise<boolean>(resolve => {
        const timer = setTimeout(() => { subscription.remove(); resolve(false); }, 15000);
        const subscription = player.addListener('playbackStatusUpdate', status => {
          if (status.didJustFinish) { clearTimeout(timer); subscription.remove(); resolve(true); }
        });
      });
      if (!completed) { player.release(); return false; }
    } catch { player.release(); return false; }
    player.release();
  }
  return true;
}
