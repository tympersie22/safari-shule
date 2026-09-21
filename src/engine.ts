import { CopyKey, Zone } from './content';

export type Question = { id: string; zone: Zone; section: 'hesabu' | 'maneno' | 'duniaYetu'; prompt: CopyKey; visual: string; choices: string[]; answer: string; choiceLabels?: Record<string, CopyKey> };
export const questions: Question[] = [
  { id: 'm1', zone: 'sokoni', section: 'hesabu', prompt: 'count', visual: '🍌🍌🍌', choices: ['2','3','4'], answer: '3' },
  { id: 'm2', zone: 'sokoni', section: 'hesabu', prompt: 'count', visual: '🥭🥭🥭🥭', choices: ['4','5','6'], answer: '4' },
  { id: 'm3', zone: 'sokoni', section: 'hesabu', prompt: 'count', visual: '🍍🍍', choices: ['1','2','3'], answer: '2' },
  { id: 'm4', zone: 'sokoni', section: 'hesabu', prompt: 'count', visual: '🍅🍅🍅🍅🍅', choices: ['4','5','6'], answer: '5' },
  { id: 'm5', zone: 'sokoni', section: 'hesabu', prompt: 'count', visual: '🥥🥥🥥🥥🥥🥥', choices: ['5','6','7'], answer: '6' },
  { id: 'b1', zone: 'bahari', section: 'duniaYetu', prompt: 'shape', visual: '🔺', choices: ['🔴','🔺','🟦'], answer: '🔺' },
  { id: 'b2', zone: 'bahari', section: 'duniaYetu', prompt: 'shape', visual: '🟦', choices: ['🟦','🔺','⭐'], answer: '🟦' },
  { id: 'b3', zone: 'bahari', section: 'duniaYetu', prompt: 'shape', visual: '⭐', choices: ['🔴','⭐','🟦'], answer: '⭐' },
  { id: 'p1', zone: 'pori', section: 'duniaYetu', prompt: 'findGiraffe', visual: '🌳', choices: ['🦓','🦒','🐘'], answer: '🦒' },
  { id: 'p2', zone: 'pori', section: 'duniaYetu', prompt: 'findElephant', visual: '🌾', choices: ['🐘','🦁','🦓'], answer: '🐘' },
  { id: 'p3', zone: 'pori', section: 'duniaYetu', prompt: 'findZebra', visual: '🌳', choices: ['🦒','🦓','🦁'], answer: '🦓' },
  { id: 'n1', zone: 'nyumbani', section: 'maneno', prompt: 'letter', visual: 'A', choices: ['M','A','S'], answer: 'A' },
  { id: 'n2', zone: 'nyumbani', section: 'maneno', prompt: 'letter', visual: 'M', choices: ['N','M','A'], answer: 'M' },
  { id: 'n3', zone: 'nyumbani', section: 'maneno', prompt: 'letter', visual: 'S', choices: ['S','K','T'], answer: 'S' },
  { id: 'n4', zone: 'nyumbani', section: 'maneno', prompt: 'findMother', visual: '🏠', choices: ['👩🏾','👨🏾','👶🏾'], answer: '👩🏾' },
  { id: 'n5', zone: 'nyumbani', section: 'maneno', prompt: 'findFather', visual: '🏠', choices: ['👨🏾','👶🏾','👩🏾'], answer: '👨🏾' },
  { id: 'n6', zone: 'nyumbani', section: 'maneno', prompt: 'nextDay', visual: '📅', choices: ['monday','tuesday','wednesday'], answer: 'tuesday', choiceLabels: { monday: 'monday', tuesday: 'tuesday', wednesday: 'wednesday' } },
  { id: 's1', zone: 'shuleni', section: 'hesabu', prompt: 'time', visual: '🕒', choices: ['2:00','3:00','4:00'], answer: '3:00' },
  { id: 's2', zone: 'shuleni', section: 'hesabu', prompt: 'time', visual: '🕕', choices: ['5:00','6:00','7:00'], answer: '6:00' },
  { id: 's3', zone: 'shuleni', section: 'maneno', prompt: 'letter', visual: 'K', choices: ['K','B','P'], answer: 'K' },
  { id: 's4', zone: 'shuleni', section: 'maneno', prompt: 'letter', visual: 'T', choices: ['F','T','L'], answer: 'T' },
  { id: 's5', zone: 'shuleni', section: 'duniaYetu', prompt: 'world', visual: '🏖️', choices: ['🏖️','🌳','🏠'], answer: '🏖️' },
  { id: 's6', zone: 'shuleni', section: 'duniaYetu', prompt: 'world', visual: '🏠', choices: ['🏖️','🏠','🛒'], answer: '🏠' },
  { id: 'm6', zone: 'sokoni', section: 'hesabu', prompt: 'add', visual: '🥭🥭 + 🥭', choices: ['2','3','4'], answer: '3' },
  { id: 'm7', zone: 'sokoni', section: 'hesabu', prompt: 'count', visual: '🥥'.repeat(10), choices: ['9','10','11'], answer: '10' },
  { id: 'm8', zone: 'sokoni', section: 'hesabu', prompt: 'count', visual: '🍌'.repeat(20), choices: ['18','19','20'], answer: '20' },
];

export function isCorrect(question: Question, choice: string) { return question.answer === choice; }
export function awardStar(correct: boolean, firstTry: boolean) { return correct && firstTry ? 1 : 0; }
export function buildZoneRounds(zone: Exclude<Zone, 'sokoni'>): Question[] {
  const source = questions.filter(question => question.zone === zone);
  if (!source.length) return [];
  const offset = Math.floor(Math.random() * source.length);
  return Array.from({ length: 5 }, (_, index) => source[(offset + index) % source.length]);
}
export function testQuestions() {
  const sections = ['hesabu', 'maneno', 'duniaYetu'] as const;
  return sections.flatMap(section => questions.filter(q => q.section === section).slice(0, 5));
}
