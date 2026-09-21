import React, { useEffect, useMemo, useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { Language, pair } from './content';
import { Visual } from './visual';
import { WorldShell } from './WorldGame';

const villageArt = require('../assets/village-thumbnail.png');
const stopGoArt = require('../assets/stopgo-thumbnail.png');
const TEAL = '#1B8A87';
const INK = '#243C43';
const CREAM = 'rgba(255,248,234,.96)';
type Piece = '🏠' | '🌳' | '🌾' | '🐓';

const pieceNames: Record<Language, Record<Piece, string>> = {
  sw: { '🏠': 'Nyumba', '🌳': 'Mti', '🌾': 'Shamba', '🐓': 'Kuku' },
  en: { '🏠': 'Home', '🌳': 'Tree', '🌾': 'Field', '🐓': 'Chicken' },
};

export function BuildVillageGame({ language, stars, onBack, onComplete }: { language: Language; stars: number; onBack: () => void; onComplete: () => void }) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const counts = useMemo(() => ({ homes: pieces.filter(piece => piece === '🏠').length, trees: pieces.filter(piece => piece === '🌳').length, fields: pieces.filter(piece => piece === '🌾').length }), [pieces]);
  const ready = counts.homes >= 2 && counts.trees >= 1 && counts.fields >= 1;
  const add = (piece: Piece) => { if (pieces.length < 6) setPieces(current => [...current, piece]); };
  return <WorldShell zone="nyumbani" language={language} stars={stars} onBack={onBack} backgroundSource={villageArt}>
    <View style={styles.buildBody}>
      <View style={styles.missionCard}><Text style={styles.eyebrow}>{pair('villageMission', language).primary.toUpperCase()}</Text><Text style={styles.mission}>{pair('villageGoal', language).primary}</Text><View style={styles.goals}><Goal icon="🏠" value={counts.homes} target={2} /><Goal icon="🌳" value={counts.trees} target={1} /><Goal icon="🌾" value={counts.fields} target={1} /></View></View>
      <View style={styles.buildPanel}>
        <View style={styles.plots}>{Array.from({ length: 6 }, (_, index) => <Pressable key={index} accessibilityRole="button" onPress={() => index < pieces.length && setPieces(current => current.filter((_, pieceIndex) => pieceIndex !== index))} style={[styles.plot, index < pieces.length && styles.filledPlot]}>{index < pieces.length ? <Visual value={pieces[index]} size={48} /> : <Text style={styles.plus}>+</Text>}</Pressable>)}</View>
        <View style={styles.palette}>{(['🏠','🌳','🌾','🐓'] as Piece[]).map(piece => <Pressable key={piece} onPress={() => add(piece)} style={styles.pieceButton}><Visual value={piece} size={38} /><Text style={styles.pieceName}>{pieceNames[language][piece]}</Text></Pressable>)}</View>
        <View style={styles.buildActions}><Pressable onPress={() => setPieces([])} style={styles.resetButton}><Text style={styles.resetText}>{pair('reset', language).primary}</Text></Pressable><Pressable disabled={!ready} onPress={onComplete} style={[styles.finishButton, !ready && styles.disabled]}><Text style={styles.finishText}>{ready ? pair('villageReady', language).primary : pair('finishVillage', language).primary}</Text></Pressable></View>
      </View>
    </View>
  </WorldShell>;
}

function Goal({ icon, value, target }: { icon: Piece; value: number; target: number }) {
  const complete = value >= target;
  return <View style={[styles.goal, complete && styles.goalDone]}><Visual value={icon} size={25} /><Text style={styles.goalText}>{Math.min(value, target)}/{target}</Text><Text style={styles.goalCheck}>{complete ? '✓' : ''}</Text></View>;
}

type Signal = 'wait' | 'go' | 'early' | 'great';
export function StopGoGame({ language, stars, onBack, onComplete }: { language: Language; stars: number; onBack: () => void; onComplete: () => void }) {
  const [signal, setSignal] = useState<Signal>('wait');
  const [score, setScore] = useState(0);
  useEffect(() => {
    if (signal !== 'wait') return;
    const timer = setTimeout(() => setSignal('go'), 1200 + Math.floor(Math.random() * 1500));
    return () => clearTimeout(timer);
  }, [signal, score]);
  function tapSignal() {
    if (signal === 'wait') { setSignal('early'); setTimeout(() => setSignal('wait'), 750); return; }
    if (signal !== 'go') return;
    const next = score + 1;
    setScore(next); setSignal('great');
    setTimeout(() => { if (next >= 5) onComplete(); else setSignal('wait'); }, 650);
  }
  const title = signal === 'go' ? pair('go', language).primary : signal === 'early' ? pair('tooSoon', language).primary : signal === 'great' ? pair('greatMove', language).primary : pair('stop', language).primary;
  return <WorldShell zone="shuleni" language={language} stars={stars} onBack={onBack} backgroundSource={stopGoArt}>
    <View style={styles.stopBody}>
      <View style={styles.stopCard}><Text style={styles.eyebrow}>{pair('reactionRun', language).primary.toUpperCase()}</Text><Text style={styles.stopHelp}>{pair('reactionHelp', language).primary}</Text><View style={styles.track}>{Array.from({ length: 5 }, (_, index) => <View key={index} style={[styles.checkpoint, index < score && styles.checkpointDone]}><Text style={styles.checkpointText}>{index < score ? '✓' : index + 1}</Text></View>)}</View><Text style={[styles.signalTitle, signal === 'go' && styles.goText, signal === 'early' && styles.earlyText]}>{title}</Text><Pressable accessibilityRole="button" onPress={tapSignal} style={[styles.signalButton, signal === 'go' ? styles.greenSignal : styles.redSignal, signal === 'great' && styles.goldSignal]}><Visual value={signal === 'go' || signal === 'great' ? '🟢' : '✋'} size={94} /></Pressable><Text style={styles.score}>{score} / 5</Text></View>
    </View>
  </WorldShell>;
}

const styles = StyleSheet.create({
  buildBody: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12 }, missionCard: { width: '29%', minHeight: 330, padding: 22, borderRadius: 28, backgroundColor: CREAM, justifyContent: 'center' }, eyebrow: { color: TEAL, fontSize: 14, fontWeight: '900', letterSpacing: 1.8, textAlign: 'center' }, mission: { color: INK, fontSize: 25, lineHeight: 31, fontWeight: '800', textAlign: 'center', marginVertical: 20 }, goals: { gap: 10 }, goal: { height: 49, paddingHorizontal: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F1E8D6' }, goalDone: { backgroundColor: '#D9F2DF' }, goalText: { color: INK, fontSize: 18, fontWeight: '900' }, goalCheck: { color: '#248155', fontSize: 22, fontWeight: '900', marginLeft: 'auto' }, buildPanel: { flex: 1, minHeight: 390, padding: 18, borderRadius: 28, backgroundColor: 'rgba(255,248,234,.92)' }, plots: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }, plot: { width: '29%', height: 91, borderRadius: 20, borderWidth: 2, borderStyle: 'dashed', borderColor: '#B59A69', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,.62)' }, filledPlot: { borderStyle: 'solid', borderColor: TEAL, backgroundColor: '#FFF' }, plus: { color: '#A88B5D', fontSize: 39, fontWeight: '300' }, palette: { flexDirection: 'row', justifyContent: 'center', gap: 9, marginTop: 12 }, pieceButton: { width: '22%', height: 70, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D9CBB2' }, pieceName: { color: INK, fontSize: 13, fontWeight: '800' }, buildActions: { flexDirection: 'row', gap: 10, marginTop: 12 }, resetButton: { width: '27%', height: 53, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E9DECA' }, resetText: { color: INK, fontSize: 16, fontWeight: '800' }, finishButton: { flex: 1, height: 53, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: TEAL }, disabled: { opacity: .38 }, finishText: { color: 'white', fontSize: 17, fontWeight: '900' },
  stopBody: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }, stopCard: { width: '65%', minHeight: 410, padding: 18, borderRadius: 30, alignItems: 'center', backgroundColor: CREAM, shadowColor: '#123', shadowOpacity: .28, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } }, stopHelp: { color: INK, fontSize: 18, textAlign: 'center', marginTop: 7 }, track: { flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 14 }, checkpoint: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E3D7C2', borderWidth: 2, borderColor: '#C1A980' }, checkpointDone: { backgroundColor: '#58B985', borderColor: '#27815A' }, checkpointText: { color: 'white', fontSize: 16, fontWeight: '900' }, signalTitle: { color: '#AA4337', fontSize: 29, lineHeight: 34, fontWeight: '900', textAlign: 'center', marginTop: 8 }, goText: { color: '#14784D' }, earlyText: { color: '#C5652B', fontSize: 24 }, signalButton: { width: 164, height: 164, borderRadius: 82, alignItems: 'center', justifyContent: 'center', marginTop: 7, borderWidth: 7, shadowColor: '#000', shadowOpacity: .25, shadowRadius: 12, shadowOffset: { width: 0, height: 7 } }, redSignal: { backgroundColor: '#F7D9D4', borderColor: '#D84F45' }, greenSignal: { backgroundColor: '#D9F3DF', borderColor: '#27A866', transform: [{ scale: 1.06 }] }, goldSignal: { backgroundColor: '#FFF0C8', borderColor: '#E5AD3C' }, score: { color: INK, fontSize: 19, fontWeight: '900', marginTop: 7 },
});
