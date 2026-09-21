import React, { useEffect, useMemo, useState } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { Language } from './content';

type Round = { count: number; choices: number[] };
type Phase = 'welcome' | 'play' | 'report';

const background = require('../assets/market-background.png');
const guide = require('../assets/market-guide.png');
const mango = require('../assets/mango.png');
const TEAL = '#1B8A87';
const INK = '#243C43';
const CREAM = 'rgba(255,248,234,0.96)';

function nextRound(previous = -1): Round {
  let count = 2 + Math.floor(Math.random() * 6);
  if (count === previous) count = count === 7 ? 3 : count + 1;
  const choices = new Set<number>([count]);
  while (choices.size < 3) choices.add(Math.max(1, Math.min(9, count + Math.floor(Math.random() * 5) - 2)));
  return { count, choices: [...choices].sort(() => Math.random() - 0.5) };
}

function Duo({ sw, en, primary, title = false, light = false }: { sw: string; en: string; primary: Language; title?: boolean; light?: boolean }) {
  return <Text style={[styles.duoPrimary, title && styles.title, light && styles.light]}>{primary === 'sw' ? sw : en}</Text>;
}

export function MarketGame({ initialLanguage, totalStars, onAward, onExit, onLanguageChange }: {
  initialLanguage: Language;
  totalStars: number;
  onAward: () => void;
  onExit: () => void;
  onLanguageChange: (language: Language) => void;
}) {
  const [primary, setPrimary] = useState(initialLanguage);
  const [phase, setPhase] = useState<Phase>('welcome');
  const [roundNumber, setRoundNumber] = useState(1);
  const [round, setRound] = useState(() => nextRound());
  const [counted, setCounted] = useState<number[]>([]);
  const [firstTry, setFirstTry] = useState(true);
  const [feedback, setFeedback] = useState<'retry' | 'correct' | null>(null);
  const [earned, setEarned] = useState(0);
  const mangoes = useMemo(() => Array.from({ length: round.count }, (_, index) => index), [round.count]);

  useEffect(() => {
    if (feedback !== 'correct') return;
    const timer = setTimeout(continueGame, 900);
    return () => clearTimeout(timer);
  }, [feedback]);

  function start() {
    setRoundNumber(1); setRound(nextRound()); setCounted([]); setFirstTry(true); setFeedback(null); setEarned(0); setPhase('play');
  }
  function choose(value: number) {
    if (feedback === 'correct') return;
    if (value !== round.count) { setFirstTry(false); setFeedback('retry'); return; }
    if (firstTry) { setEarned(value => value + 1); onAward(); }
    setFeedback('correct');
  }
  function continueGame() {
    if (roundNumber === 5) { setPhase('report'); return; }
    setRoundNumber(value => value + 1); setRound(nextRound(round.count)); setCounted([]); setFirstTry(true); setFeedback(null);
  }
  function tapMango(index: number) {
    if (!counted.includes(index)) setCounted(value => [...value, index]);
  }

  return <ImageBackground source={background} resizeMode="cover" style={styles.background}>
    <View style={styles.shade} />
    <View style={styles.safe}>
      <View style={styles.topbar}>
        <Pressable style={styles.brand} onPress={onExit} accessibilityRole="button"><Text style={styles.brandName}>SAFARI SHULE</Text><Text style={styles.brandSub}>{primary === 'sw' ? 'SOKONI' : 'MARKET'}</Text></Pressable>
        <View style={styles.topActions}><View style={styles.starPill}><Text style={styles.star}>★</Text><Text style={styles.starNumber}>{totalStars}</Text></View><Pressable style={styles.language} onPress={() => setPrimary(value => { const next = value === 'sw' ? 'en' : 'sw'; onLanguageChange(next); return next; })}><Text style={styles.languageText}>{primary === 'sw' ? 'SW' : 'EN'}</Text></Pressable></View>
      </View>

      {phase === 'welcome' && <View style={styles.welcomeBody}>
        <View style={styles.welcomeCard}><Duo sw="Karibu Sokoni!" en="Welcome to the Market!" primary={primary} title /><Duo sw="Twende tukahesabu maembe." en="Let's count some mangoes." primary={primary} /><Pressable style={styles.playButton} onPress={start}><Duo sw="ANZA KUCHEZA" en="LET'S PLAY" primary={primary} light /></Pressable></View>
        <Image source={guide} resizeMode="contain" style={styles.heroGuide} />
      </View>}

      {phase === 'play' && <View style={styles.gameBody}>
        <Image source={guide} resizeMode="contain" style={styles.sideGuide} />
        <View style={styles.gameColumn}>
          <View style={styles.promptCard}><Text style={styles.progress}>{roundNumber} / 5</Text><Duo sw="Kuna maembe mangapi?" en="How many mangoes can you see?" primary={primary} title /></View>
          <View style={styles.fruitCard}><Text style={styles.tapHint}>{primary === 'sw' ? 'GUSA MAEMBE' : 'TAP MANGOES'}   {counted.length} / {round.count}</Text><View style={styles.fruitRow}>{mangoes.map(index => <Pressable key={index} onPress={() => tapMango(index)} style={[styles.fruitTouch, counted.includes(index) && styles.counted]}><Image source={mango} resizeMode="contain" style={styles.mango} />{counted.includes(index) && <View style={styles.badge}><Text style={styles.badgeText}>{counted.indexOf(index) + 1}</Text></View>}</Pressable>)}</View></View>
          <View style={styles.answerRow}>{round.choices.map((choice, index) => <Pressable key={choice} onPress={() => choose(choice)} style={[styles.answer, index === 1 && styles.answerGold]}><Text style={styles.answerText}>{choice}</Text></Pressable>)}</View>
          <View style={styles.feedbackRow}>{feedback && <Duo sw={feedback === 'correct' ? 'Umeweza!' : 'Angalia tena, unaweza!'} en={feedback === 'correct' ? 'You got it!' : 'Look again, you can do it!'} primary={primary} />}</View>
        </View>
      </View>}

      {phase === 'report' && <View style={styles.reportBody}><Image source={guide} resizeMode="contain" style={styles.reportGuide} /><View style={styles.reportCard}><Duo sw="Umefanya vizuri!" en="Lovely work!" primary={primary} title /><Text style={styles.reportStars}>{'★'.repeat(earned)}{'☆'.repeat(5 - earned)}</Text><Pressable onPress={start} style={styles.playAgain}><Duo sw="CHEZA TENA" en="PLAY AGAIN" primary={primary} light /></Pressable></View></View>}
    </View>
  </ImageBackground>;
}

const styles = StyleSheet.create({
  background: { flex: 1 }, shade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(15,28,25,0.08)' }, safe: { flex: 1, paddingHorizontal: 24, paddingTop: 4, paddingBottom: 4 },
  topbar: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }, brand: { width: 285, height: 58, borderRadius: 19, backgroundColor: CREAM, paddingHorizontal: 19, justifyContent: 'center' }, brandName: { color: INK, fontSize: 22, fontWeight: '300', letterSpacing: .5 }, brandSub: { color: TEAL, fontSize: 12, letterSpacing: .5 }, topActions: { flexDirection: 'row', gap: 10 }, starPill: { height: 58, minWidth: 126, borderRadius: 19, paddingHorizontal: 17, backgroundColor: CREAM, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }, star: { color: '#AD6D26', fontSize: 32 }, starNumber: { color: '#AD6D26', fontSize: 27, fontWeight: '300' }, language: { width: 82, height: 58, backgroundColor: TEAL, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }, languageText: { color: 'white', fontSize: 14 },
  welcomeBody: { flex: 1, flexDirection: 'row', alignItems: 'center' }, welcomeCard: { width: '55%', marginLeft: 28, padding: 22, gap: 12, borderRadius: 28, backgroundColor: CREAM, zIndex: 2 }, heroGuide: { position: 'absolute', width: '43%', height: '96%', right: 30, bottom: -10 }, duoPrimary: { textAlign: 'center', color: INK, fontSize: 19, fontWeight: '500' }, duoSecondary: { textAlign: 'center', color: '#527077', fontSize: 15, marginTop: 2 }, light: { color: 'white' }, lightSecondary: { color: '#DFF4EF' }, title: { fontSize: 31, fontWeight: '300' }, subtitle: { fontSize: 24, fontWeight: '300', color: INK, marginTop: 4 }, playButton: { alignSelf: 'center', width: '82%', height: 72, borderRadius: 21, backgroundColor: TEAL, padding: 10, justifyContent: 'center', shadowColor: '#123', shadowOpacity: .25, shadowRadius: 8, shadowOffset: { width: 0, height: 6 } },
  gameBody: { flex: 1, flexDirection: 'row' }, sideGuide: { alignSelf: 'flex-end', width: '22%', height: '78%' }, gameColumn: { flex: 1, paddingTop: 7, paddingLeft: 8 }, promptCard: { height: 78, paddingHorizontal: 22, borderRadius: 22, backgroundColor: CREAM, justifyContent: 'center' }, progress: { position: 'absolute', top: 5, right: 14, color: TEAL, fontSize: 15 }, fruitCard: { height: 118, marginTop: 7, padding: 7, borderRadius: 22, backgroundColor: CREAM }, tapHint: { textAlign: 'center', color: TEAL, fontSize: 12, fontWeight: '700', letterSpacing: 1 }, fruitRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 }, fruitTouch: { width: 68, height: 73, justifyContent: 'center', alignItems: 'center', borderRadius: 36 }, counted: { backgroundColor: 'rgba(232,173,77,0.20)' }, mango: { width: 66, height: 66 }, badge: { position: 'absolute', top: -2, right: 1, width: 25, height: 25, borderRadius: 13, backgroundColor: '#B36F2F', alignItems: 'center', justifyContent: 'center' }, badgeText: { color: 'white', fontWeight: '800', fontSize: 14 }, answerRow: { flexDirection: 'row', justifyContent: 'center', gap: 34, marginTop: 7 }, answer: { width: 142, height: 62, borderRadius: 19, backgroundColor: TEAL, alignItems: 'center', justifyContent: 'center', shadowColor: '#123', shadowOpacity: .2, shadowRadius: 7, shadowOffset: { width: 0, height: 4 } }, answerGold: { backgroundColor: '#B8733C' }, answerText: { color: 'white', fontSize: 38, fontWeight: '300' }, feedbackRow: { minHeight: 49, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20 }, next: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#E8AD4D', alignItems: 'center', justifyContent: 'center' }, nextText: { color: 'white', fontSize: 35, lineHeight: 39 },
  reportBody: { flex: 1, flexDirection: 'row', alignItems: 'flex-end' }, reportGuide: { width: '28%', height: '75%' }, reportCard: { flex: 1, alignSelf: 'center', marginHorizontal: 35, padding: 35, gap: 27, borderRadius: 34, backgroundColor: CREAM }, reportStars: { color: '#C58E38', fontSize: 67, textAlign: 'center', letterSpacing: 8 }, playAgain: { alignSelf: 'center', width: '70%', padding: 20, borderRadius: 24, backgroundColor: TEAL },
});
