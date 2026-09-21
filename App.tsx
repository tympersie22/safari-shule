import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CopyKey, Language, Zone, pair, zones } from './src/content';
import { awardStar, isCorrect, Question, testQuestions } from './src/engine';
import { narrate } from './src/audio';
import { deleteProgress, initialProgress, loadProgress, Progress, saveProgress } from './src/storage';
import { ParentArea } from './src/parent';
import { Visual } from './src/visual';
import { MarketGame } from './src/MarketGame';
import { ZoneAdventureGame } from './src/ZoneAdventureGame';
import { QuizWorld, WorldMap, WorldShell, worldStyles } from './src/WorldGame';
import { BuildVillageGame, StopGoGame } from './src/MiniGames';

type Screen = 'home' | 'map' | 'market' | 'zoneAdventure' | 'quiz' | 'test' | 'report' | 'memory' | 'sort' | 'build' | 'stopGo' | 'gate' | 'parent';
const colors = { ink: '#20334A', cream: '#FFF8EA', navy: '#17445E', white: '#FFFFFF', accent: '#FFDA73', soft: '#F2E9D7' };

function Bilingual({ k, first, large = false }: { k: CopyKey; first: Language; large?: boolean }) {
  const value = pair(k, first);
  return <View accessible accessibilityLabel={value.primary}><Text style={[styles.primary, large && styles.large]}>{value.primary}</Text></View>;
}
function Action({ k, first, onPress, symbol, tint = colors.accent }: { k: CopyKey; first: Language; onPress: () => void; symbol?: string; tint?: string }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={pair(k, first).primary} onPress={onPress} style={[styles.action, { backgroundColor: tint }]}>{symbol && <Visual value={symbol} size={34} />}<Bilingual k={k} first={first} /></Pressable>;
}
export default function App() {
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [screen, setScreen] = useState<Screen>('market');
  const [queue, setQueue] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [firstTry, setFirstTry] = useState(true);
  const [feedback, setFeedback] = useState<CopyKey | null>(null);
  const [sessionStars, setSessionStars] = useState(0);
  const [zone, setZone] = useState<Zone>('sokoni');
  const [gateAnswer, setGateAnswer] = useState('');
  const [gateSum, setGateSum] = useState([8, 7]);
  const [breakShown, setBreakShown] = useState(false);
  const [memoryCards, setMemoryCards] = useState(['🦒','🐘','🍌','🦒','🐘','🍌']);
  const [memoryOpen, setMemoryOpen] = useState<number[]>([]);
  const [memoryMatched, setMemoryMatched] = useState<number[]>([]);
  const [sortStep, setSortStep] = useState(0);
  const [promptLanguage, setPromptLanguage] = useState<Language>('sw');
  const first = progress.firstLanguage;
  const current = queue[index];

  useEffect(() => { loadProgress().then(setProgress); }, []);
  useEffect(() => { if (current) void narrate(current.prompt, promptLanguage, progress.volume); }, [current?.id, promptLanguage]);
  useEffect(() => {
    if ((screen !== 'quiz' && screen !== 'test') || feedback !== 'correct') return;
    const timer = setTimeout(nextQuestion, 900);
    return () => clearTimeout(timer);
  }, [feedback, screen, index]);
  useEffect(() => {
    if (breakShown || screen === 'parent' || screen === 'gate') return;
    const timer = setInterval(() => {
      if (Date.now() - progress.startedAt >= progress.breakMinutes * 60000) { setBreakShown(true); void narrate('break', first, progress.volume); }
    }, 10000);
    return () => clearInterval(timer);
  }, [breakShown, screen, progress.startedAt, progress.breakMinutes, first]);

  async function updateProgress(next: Progress) {
    setProgress(next);
    if (!await saveProgress(next)) Alert.alert(pair('savedError', first).primary);
  }
  function startQuiz(items: Question[], selectedZone: Zone, test = false) {
    setZone(selectedZone); setQueue(items); setIndex(0); setFirstTry(true); setFeedback(null); setSessionStars(0); setPromptLanguage(first); setScreen(test ? 'test' : 'quiz');
  }
  function answer(choice: string) {
    if (!current || feedback === 'correct') return;
    if (!isCorrect(current, choice)) { setFirstTry(false); setFeedback('retry'); void narrate('retry', first, progress.volume); return; }
    const gained = awardStar(true, firstTry);
    setSessionStars(s => s + gained);
    if (gained) void updateProgress({ ...progress, stars: progress.stars + 1, byZone: { ...progress.byZone, [current.zone]: (progress.byZone[current.zone] || 0) + 1 } });
    setFeedback('correct'); void narrate('correct', first, progress.volume);
  }
  function nextQuestion() {
    if (index + 1 >= queue.length) { setScreen('report'); return; }
    setIndex(index + 1); setPromptLanguage(first); setFirstTry(true); setFeedback(null);
  }
  function openGate() { setGateAnswer(''); setGateSum([7 + Math.floor(Math.random() * 6), 8 + Math.floor(Math.random() * 6)]); setScreen('gate'); }
  function solveGate() { if (Number(gateAnswer) === gateSum[0] + gateSum[1]) setScreen('parent'); else { setGateAnswer(''); Alert.alert(pair('gateWrong', first).primary); } }
  const tabs = <View style={styles.tabs}><Action k="home" first={first} symbol="🗺️" onPress={() => setScreen('map')} /><Action k="test" first={first} symbol="⭐" onPress={() => startQuiz(testQuestions(), 'shuleni', true)} /><Action k="parent" first={first} symbol="👨🏾‍👩🏾‍👧🏾" onPress={openGate} /></View>;
  const title = useMemo(() => screen === 'test' ? 'test' : screen === 'quiz' ? zone : screen === 'map' ? 'chooseZone' : screen === 'report' ? 'report' : screen === 'parent' ? 'dashboard' : screen === 'gate' ? 'parentGate' : screen === 'memory' ? 'memory' : screen === 'sort' ? 'sort' : screen === 'build' ? 'build' : screen === 'stopGo' ? 'stopGo' : 'appName', [screen, zone]);

  if (screen === 'market') return <MarketGame initialLanguage={first} totalStars={progress.stars} onExit={() => setScreen('map')} onLanguageChange={language => void updateProgress({ ...progress, firstLanguage: language })} onAward={() => {
    setProgress(previous => {
      const next = { ...previous, stars: previous.stars + 1, byZone: { ...previous.byZone, sokoni: (previous.byZone.sokoni || 0) + 1 } };
      void saveProgress(next);
      return next;
    });
  }} />;

  if (screen === 'zoneAdventure' && zone !== 'sokoni') return <ZoneAdventureGame zone={zone} initialLanguage={first} totalStars={progress.stars} onExit={() => setScreen('map')} onLanguageChange={language => void updateProgress({ ...progress, firstLanguage: language })} onAward={awardedZone => {
    setProgress(previous => {
      const next = { ...previous, stars: previous.stars + 1, byZone: { ...previous.byZone, [awardedZone]: (previous.byZone[awardedZone] || 0) + 1 } };
      void saveProgress(next);
      return next;
    });
  }} />;

  if (screen === 'map') return <WorldMap primary={first} stars={progress.stars} onZone={selected => { setZone(selected); setScreen(selected === 'sokoni' ? 'market' : 'zoneAdventure'); }} onActivity={activity => {
    if (activity === 'memory') { setZone('pori'); setMemoryCards(['🦒','🐘','🍌','🦒','🐘','🍌']); setMemoryMatched([]); setMemoryOpen([]); }
    if (activity === 'sort') { setZone('bahari'); setSortStep(0); }
    if (activity === 'build') setZone('nyumbani');
    if (activity === 'stopGo') setZone('shuleni');
    setScreen(activity);
  }} onTest={() => startQuiz(testQuestions(), 'shuleni', true)} onParent={openGate} />;

  if ((screen === 'quiz' || screen === 'test') && current) return <QuizWorld zone={current.zone} stars={progress.stars} question={current} primary={promptLanguage} index={index} total={queue.length} feedback={feedback} onAnswer={answer} onBack={() => setScreen('map')} />;

  if (screen === 'report') return <WorldShell zone={zone} language={first} stars={progress.stars} onBack={() => setScreen('map')}><View style={worldStyles.activityBody}><View style={worldStyles.activityCard}><Visual value={'⭐'.repeat(Math.min(sessionStars, 5)) || '🌾'} size={62} /><Text style={worldStyles.activityTitle}>{pair(sessionStars ? 'done' : 'zero', first).primary}</Text><Pressable style={worldStyles.primaryButton} onPress={() => setScreen('map')}><Text style={worldStyles.primaryButtonText}>{pair('chooseZone', first).primary}</Text></Pressable></View></View></WorldShell>;

  if (screen === 'memory') return <WorldShell zone="pori" language={first} stars={progress.stars} onBack={() => setScreen('map')}><View style={worldStyles.activityBody}><View style={worldStyles.activityCard}><Text style={worldStyles.activityTitle}>{pair('memoryPrompt', first).primary}</Text><View style={worldStyles.row}>{memoryCards.map((card, i) => <Pressable key={i} style={worldStyles.tile} onPress={() => {
    if (memoryMatched.includes(i) || memoryOpen.includes(i) || memoryOpen.length === 2) return;
    const opened = [...memoryOpen, i]; setMemoryOpen(opened);
    if (opened.length === 2) setTimeout(() => { if (memoryCards[opened[0]] === memoryCards[opened[1]]) { setMemoryMatched(old => { const next = [...old, ...opened]; if (next.length === 6) { setSessionStars(1); void updateProgress({ ...progress, stars: progress.stars + 1 }); setScreen('report'); } return next; }); } setMemoryOpen([]); }, 650);
  }}><Visual value={memoryMatched.includes(i) || memoryOpen.includes(i) ? card : '❓'} size={55} /></Pressable>)}</View></View></View></WorldShell>;

  if (screen === 'sort') return <WorldShell zone="bahari" language={first} stars={progress.stars} onBack={() => setScreen('map')}><View style={worldStyles.activityBody}><View style={worldStyles.activityCard}><Text style={worldStyles.activityTitle}>{pair(sortStep < 2 ? 'sortColor' : 'sortSize', first).primary}</Text><Visual value={sortStep < 2 ? '🔵 🐚' : '🐚'} size={66} /><View style={worldStyles.row}>{(sortStep < 2 ? ['🔵','🟡','🟣'] : ['🐚','🐚🐚','🐚🐚🐚']).map((item, i) => <Pressable key={i} style={worldStyles.tile} onPress={() => {
    if (i !== (sortStep < 2 ? 0 : 2)) { void narrate('retry', first, progress.volume); return; }
    if (sortStep === 2) { setSessionStars(1); void updateProgress({ ...progress, stars: progress.stars + 1 }); setScreen('report'); } else setSortStep(sortStep + 1);
  }}><Visual value={item} size={52} /></Pressable>)}</View></View></View></WorldShell>;

  if (screen === 'build') return <BuildVillageGame language={first} stars={progress.stars} onBack={() => setScreen('map')} onComplete={() => { setSessionStars(1); void updateProgress({ ...progress, stars: progress.stars + 1, byZone: { ...progress.byZone, nyumbani: (progress.byZone.nyumbani || 0) + 1 } }); setZone('nyumbani'); setScreen('report'); }} />;

  if (screen === 'stopGo') return <StopGoGame language={first} stars={progress.stars} onBack={() => setScreen('map')} onComplete={() => { setSessionStars(1); void updateProgress({ ...progress, stars: progress.stars + 1, byZone: { ...progress.byZone, shuleni: (progress.byZone.shuleni || 0) + 1 } }); setZone('shuleni'); setScreen('report'); }} />;

  return <SafeAreaView style={styles.root}><ScrollView contentContainerStyle={styles.scroll}>
    <View style={styles.header}><Bilingual k={title} first={first} large /><View style={styles.starCount}><Visual value="⭐" size={24} /><Text style={styles.starTotal}>{progress.stars}</Text></View></View>
    {screen === 'home' && <View style={styles.center}><Visual value="🦒🌴🏠" size={72} /><Action k="play" first={first} symbol="▶️" tint="#F5C760" onPress={() => setScreen('market')} /><Action k="language" first={first} symbol="🌐" tint={colors.soft} onPress={() => void updateProgress({ ...progress, firstLanguage: first === 'sw' ? 'en' : 'sw' })} /></View>}
    {screen === 'gate' && <View style={styles.center}><Bilingual k="gatePrompt" first={first} large /><Text style={styles.visual}>{gateSum[0]} + {gateSum[1]} = ?</Text><TextInput style={styles.input} keyboardType="number-pad" value={gateAnswer} onChangeText={setGateAnswer} accessibilityLabel={pair('gatePrompt', first).primary} /><Action k="next" first={first} onPress={solveGate} /></View>}
    {screen === 'parent' && <ParentArea progress={progress} first={first} onChange={updateProgress} onDelete={async () => { if (await deleteProgress()) { setProgress(initialProgress); setScreen('home'); } else Alert.alert(pair('savedError', first).primary); }} />}
    {breakShown && screen !== 'parent' && screen !== 'gate' && <View style={styles.breakCard}><Visual value="🌙" size={40} /><Bilingual k="break" first={first} large /><Action k="done" first={first} onPress={() => { setBreakShown(false); void updateProgress({ ...progress, startedAt: Date.now() }); setScreen('home'); }} /></View>}
  </ScrollView>{tabs}</SafeAreaView>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream }, scroll: { padding: 20, paddingBottom: 36, flexGrow: 1 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }, primary: { fontSize: 19, fontWeight: '800', color: colors.ink, textAlign: 'center' }, large: { fontSize: 28 }, secondary: { fontSize: 13, color: colors.navy, textAlign: 'center', marginTop: 2 }, starCount: { flexDirection: 'row', alignItems: 'center', gap: 5 }, starTotal: { fontSize: 22, color: colors.ink, fontWeight: '700' }, center: { alignItems: 'center', gap: 20, flex: 1, justifyContent: 'center' }, action: { minWidth: 130, minHeight: 82, borderRadius: 24, alignItems: 'center', justifyContent: 'center', padding: 12, margin: 4, borderWidth: 2, borderColor: colors.navy }, tabs: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.white, paddingVertical: 6, borderTopWidth: 2, borderColor: colors.soft }, grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }, counter: { fontSize: 18, fontWeight: '700', color: colors.navy }, visual: { fontSize: 56, textAlign: 'center', marginVertical: 20 }, choices: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }, option: { minWidth: 88, minHeight: 88, borderRadius: 22, padding: 12, backgroundColor: colors.white, borderWidth: 3, borderColor: colors.navy, alignItems: 'center', justifyContent: 'center' }, feedback: { alignItems: 'center', gap: 4 }, input: { backgroundColor: colors.white, borderColor: colors.navy, borderWidth: 2, borderRadius: 12, minWidth: 160, padding: 16, fontSize: 28, textAlign: 'center' }, breakCard: { alignItems: 'center', gap: 10, padding: 20, marginTop: 20, borderRadius: 20, backgroundColor: '#DCE8E0' },
});
