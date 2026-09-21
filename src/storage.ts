import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from './content';

export type Progress = { stars: number; byZone: Record<string, number>; firstLanguage: Language; languageJump: boolean; volume: number; breakMinutes: number; startedAt: number };
export const initialProgress: Progress = { stars: 0, byZone: {}, firstLanguage: 'sw', languageJump: false, volume: 1, breakMinutes: 18, startedAt: Date.now() };
const key = 'safariShule.progress.v1';

export async function loadProgress(): Promise<Progress> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return initialProgress;
    const saved = JSON.parse(raw) as Partial<Progress>;
    return { ...initialProgress, ...saved, byZone: saved.byZone ?? {} };
  } catch {
    return initialProgress;
  }
}

export async function saveProgress(progress: Progress): Promise<boolean> {
  try { await AsyncStorage.setItem(key, JSON.stringify(progress)); return true; }
  catch { return false; }
}

export async function deleteProgress(): Promise<boolean> {
  try { await AsyncStorage.removeItem(key); return true; }
  catch { return false; }
}
