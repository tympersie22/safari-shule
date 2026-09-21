import React from 'react';
import { Image, ImageBackground, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { CopyKey, Language, pair, Zone } from './content';
import { Question } from './engine';
import { Visual } from './visual';

const guide = require('../assets/market-guide.png');
const backgrounds: Record<Zone, ImageSourcePropType> = {
  sokoni: require('../assets/market-background.png'),
  bahari: require('../assets/coast-background.png'),
  pori: require('../assets/savanna-background.png'),
  nyumbani: require('../assets/home-background.png'),
  shuleni: require('../assets/school-background.png'),
};
const thumbnails: Record<'memory' | 'sort' | 'build' | 'stopGo', ImageSourcePropType> = {
  memory: require('../assets/memory-thumbnail.png'), sort: require('../assets/sort-thumbnail.png'), build: require('../assets/village-thumbnail.png'), stopGo: require('../assets/stopgo-thumbnail.png'),
};
const TEAL = '#1B8A87';
const INK = '#243C43';
const CREAM = 'rgba(255,248,234,0.96)';

export function WorldShell({ zone, language, stars, onBack, backgroundSource, children }: { zone: Zone; language: Language; stars: number; onBack: () => void; backgroundSource?: ImageSourcePropType; children: React.ReactNode }) {
  return <ImageBackground source={backgroundSource ?? backgrounds[zone]} resizeMode="cover" style={styles.background}>
    <View style={styles.shade} />
    <View style={styles.safe}>
      <View style={styles.topbar}><Pressable onPress={onBack} style={styles.brand}><Text style={styles.brandName}>‹  SAFARI SHULE</Text><Text style={styles.brandSub}>{pair(zone, language).primary.toUpperCase()}</Text></Pressable><View style={styles.starPill}><Text style={styles.star}>★</Text><Text style={styles.starNumber}>{stars}</Text></View></View>
      {children}
    </View>
  </ImageBackground>;
}

export function QuizWorld({ zone, stars, question, primary, index, total, feedback, onAnswer, onBack }: {
  zone: Zone; stars: number; question: Question; primary: Language; index: number; total: number; feedback: CopyKey | null; onAnswer: (choice: string) => void; onBack: () => void;
}) {
  const prompt = pair(question.prompt, primary);
  return <WorldShell zone={zone} language={primary} stars={stars} onBack={onBack}>
    <View style={styles.quizBody}>
      <Image source={guide} resizeMode="contain" style={styles.guide} />
      <View style={styles.quizColumn}>
        <View style={styles.promptCard}><Text style={styles.progress}>{index + 1} / {total}</Text><Text style={styles.promptPrimary}>{prompt.primary}</Text></View>
        <View style={styles.visualCard}><Visual value={question.visual} size={56} /></View>
        <View style={styles.options}>{question.choices.map((choice, choiceIndex) => {
          const choiceCopy = question.choiceLabels?.[choice] ? pair(question.choiceLabels[choice], primary) : null;
          return <Pressable key={choice} accessibilityRole="button" onPress={() => onAnswer(choice)} style={[styles.option, choiceIndex === 1 && styles.optionGold]}>{choiceCopy ? <Text style={styles.optionLabel}>{choiceCopy.primary}</Text> : <Visual value={choice} size={54} />}</Pressable>;
        })}</View>
        <View style={[styles.feedback, feedback === 'correct' && styles.correct, feedback === 'retry' && styles.retry]}>{feedback && <><Text style={styles.feedbackMark}>{feedback === 'correct' ? '★' : '↻'}</Text><Text style={styles.feedbackText}>{pair(feedback, primary).primary}</Text></>}</View>
      </View>
    </View>
  </WorldShell>;
}

export function WorldMap({ primary, stars, onZone, onActivity, onTest, onParent }: {
  primary: Language; stars: number; onZone: (zone: Zone) => void; onActivity: (activity: 'memory' | 'sort' | 'build' | 'stopGo') => void; onTest: () => void; onParent: () => void;
}) {
  const activities: Array<{ id: 'memory' | 'sort' | 'build' | 'stopGo' }> = [
    { id: 'memory' }, { id: 'sort' }, { id: 'build' }, { id: 'stopGo' },
  ];
  return <ImageBackground source={backgrounds.sokoni} resizeMode="cover" style={styles.background}><View style={styles.mapShade} /><View style={styles.mapSafe}>
    <View style={styles.mapHeader}><Text style={styles.mapTitle}>{pair('chooseZone', primary).primary}</Text><View style={styles.mapTools}><View style={styles.starPill}><Text style={styles.star}>★</Text><Text style={styles.starNumber}>{stars}</Text></View><Pressable style={styles.toolButton} onPress={onTest}><Text style={styles.toolText}>★ {pair('test', primary).primary}</Text></Pressable><Pressable style={styles.toolButton} onPress={onParent}><Text style={styles.toolText}>{pair('parent', primary).primary}</Text></Pressable></View></View>
    <View style={styles.zoneRow}>{(Object.keys(backgrounds) as Zone[]).map(zone => <Pressable key={zone} onPress={() => onZone(zone)} style={styles.zoneCard}><ImageBackground source={backgrounds[zone]} resizeMode="cover" imageStyle={styles.zoneImage} style={styles.zoneImage}><View style={styles.zoneScrim} /><Text style={styles.zoneName}>{pair(zone, primary).primary}</Text></ImageBackground></Pressable>)}</View>
    <Text style={styles.miniHeading}>{primary === 'sw' ? 'MICHEZO MIDOGO' : 'MINI GAMES'}</Text>
    <View style={styles.miniRow}>{activities.map(item => <Pressable key={item.id} onPress={() => onActivity(item.id)} style={styles.miniCard}><ImageBackground source={thumbnails[item.id]} resizeMode="cover" imageStyle={styles.miniImage} style={styles.miniImage}><View style={styles.miniScrim} /><Text style={styles.miniName}>{pair(item.id, primary).primary}</Text></ImageBackground></Pressable>)}</View>
  </View></ImageBackground>;
}

export const worldStyles = StyleSheet.create({
  activityBody: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 12 }, activityCard: { width: '76%', minHeight: 350, padding: 26, borderRadius: 30, alignItems: 'center', justifyContent: 'center', gap: 18, backgroundColor: CREAM, shadowColor: '#123', shadowOpacity: .25, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } }, activityTitle: { color: INK, fontSize: 31, fontWeight: '700', textAlign: 'center' }, activitySub: { color: '#527077', fontSize: 20, textAlign: 'center' }, row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15 }, tile: { minWidth: 105, minHeight: 94, borderRadius: 22, padding: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderWidth: 2, borderColor: TEAL }, primaryButton: { minWidth: 270, minHeight: 70, borderRadius: 22, padding: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: TEAL }, primaryButtonText: { color: 'white', fontWeight: '800', fontSize: 20 }, buildStage: { minWidth: '70%', minHeight: 100, borderRadius: 22, backgroundColor: 'rgba(255,255,255,.72)', padding: 14, alignItems: 'center', justifyContent: 'center' }, stopTile: { minWidth: 190, minHeight: 190, borderRadius: 95, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,.75)' },
});

const styles = StyleSheet.create({
  background: { flex: 1 }, shade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(18,28,26,.14)' }, safe: { flex: 1, paddingHorizontal: 24, paddingTop: 4, paddingBottom: 4 }, topbar: { height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, brand: { width: 285, height: 58, borderRadius: 19, paddingHorizontal: 18, justifyContent: 'center', backgroundColor: CREAM }, brandName: { color: INK, fontSize: 21, fontWeight: '400' }, brandSub: { color: TEAL, fontSize: 12, letterSpacing: .5 }, starPill: { height: 58, minWidth: 126, borderRadius: 19, paddingHorizontal: 17, backgroundColor: CREAM, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }, star: { color: '#AD6D26', fontSize: 32 }, starNumber: { color: '#AD6D26', fontSize: 27 }, quizBody: { flex: 1, flexDirection: 'row' }, guide: { width: '22%', height: '78%', alignSelf: 'flex-end' }, quizColumn: { flex: 1, paddingTop: 7, paddingLeft: 8 }, promptCard: { height: 94, padding: 12, justifyContent: 'center', borderRadius: 24, backgroundColor: CREAM }, progress: { position: 'absolute', top: 7, right: 14, color: TEAL, fontSize: 14 }, promptPrimary: { color: INK, fontSize: 27, textAlign: 'center', fontWeight: '600' }, promptSecondary: { color: '#527077', fontSize: 19, textAlign: 'center', marginTop: 3 }, visualCard: { height: 118, marginTop: 7, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: CREAM }, options: { flexDirection: 'row', justifyContent: 'center', gap: 28, marginTop: 7 }, option: { width: 150, height: 68, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: TEAL, shadowColor: '#123', shadowOpacity: .2, shadowRadius: 6, shadowOffset: { width: 0, height: 4 } }, optionGold: { backgroundColor: '#B8733C' }, optionLabel: { color: 'white', fontSize: 19, fontWeight: '800' }, optionSub: { color: '#F5EDE0', fontSize: 13 }, feedback: { height: 52, marginTop: 7, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }, correct: { backgroundColor: 'rgba(219,247,229,.96)' }, retry: { backgroundColor: 'rgba(255,235,218,.96)' }, feedbackMark: { color: '#B8733C', fontSize: 28 }, feedbackText: { color: INK, fontSize: 17, fontWeight: '700' }, mapShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(15,28,25,.48)' }, mapSafe: { flex: 1, padding: 18 }, mapHeader: { height: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, mapTitle: { color: 'white', fontSize: 27, fontWeight: '800' }, mapSubtitle: { color: '#DDF4EE', fontSize: 15 }, mapTools: { flexDirection: 'row', alignItems: 'center', gap: 9 }, toolButton: { minWidth: 130, height: 48, paddingHorizontal: 14, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: TEAL }, toolText: { color: 'white', fontSize: 14, fontWeight: '800' }, zoneRow: { flexDirection: 'row', gap: 11, marginTop: 5 }, zoneCard: { flex: 1, height: 160, borderRadius: 22, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(255,255,255,.85)' }, zoneImage: { flex: 1, borderRadius: 20, justifyContent: 'flex-end', padding: 12, overflow: 'hidden' }, zoneScrim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(15,32,30,.25)' }, zoneName: { color: 'white', fontSize: 21, fontWeight: '900', textShadowColor: '#132', textShadowRadius: 4 }, zoneSub: { color: 'white', fontSize: 13, fontWeight: '700' }, miniHeading: { color: 'white', fontSize: 14, fontWeight: '900', letterSpacing: 2, marginTop: 9, marginBottom: 5 }, miniRow: { flexDirection: 'row', gap: 12 }, miniCard: { flex: 1, height: 110, borderRadius: 20, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(255,255,255,.75)' }, miniImage: { flex: 1, padding: 8, borderRadius: 18, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }, miniScrim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(16,39,38,.48)' }, miniName: { color: 'white', fontSize: 16, fontWeight: '900' }, miniSub: { color: '#E9F5EF', fontSize: 11 },
});
