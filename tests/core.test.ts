import { copy, pair } from '../src/content';
import { awardStar, buildZoneRounds, isCorrect, questions, testQuestions } from '../src/engine';

test('every content key has both languages', () => {
  for (const value of Object.values(copy)) {
    expect(value.sw.trim().length).toBeGreaterThan(0);
    expect(value.en.trim().length).toBeGreaterThan(0);
  }
});
test('language order changes without hiding either language', () => {
  expect(pair('play', 'sw')).toEqual({ primary: 'Cheza', secondary: 'Play' });
  expect(pair('play', 'en')).toEqual({ primary: 'Play', secondary: 'Cheza' });
});
test('first try alone earns a star', () => {
  expect(awardStar(true, true)).toBe(1);
  expect(awardStar(true, false)).toBe(0);
  expect(awardStar(false, true)).toBe(0);
});
test('quiz answer checking uses the answer key', () => {
  const q = questions[0];
  expect(isCorrect(q, q.answer)).toBe(true);
  expect(isCorrect(q, q.choices.find(choice => choice !== q.answer)!)).toBe(false);
});
test('star test contains five questions in each section', () => {
  const selected = testQuestions();
  expect(selected).toHaveLength(15);
  for (const section of ['hesabu', 'maneno', 'duniaYetu']) expect(selected.filter(q => q.section === section)).toHaveLength(5);
});
test('every adventure world builds a five-round session from its own curriculum', () => {
  for (const zone of ['bahari', 'pori', 'nyumbani', 'shuleni'] as const) {
    const rounds = buildZoneRounds(zone);
    expect(rounds).toHaveLength(5);
    expect(rounds.every(question => question.zone === zone)).toBe(true);
  }
});
