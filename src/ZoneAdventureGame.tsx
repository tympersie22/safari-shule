import React, { useEffect, useMemo, useState } from 'react';
import { Image, ImageBackground, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { Language, pair, Zone } from './content';
import { buildZoneRounds, Question } from './engine';
import { Visual } from './visual';

type PlayableZone = Exclude<Zone, 'sokoni'>;
type Phase = 'welcome' | 'play' | 'report';

type ZoneTheme = {
  background: ImageSourcePropType;
  accent: string;
  warm: string;
  welcome: Record<Language, string>;
  invitation: Record<Language, string>;
  activity: Record<Language, string>;
  objectLabel: Record<Language, string>;
  celebration: Record<Language, string>;
};

const guide = require('../assets/market-guide.png');
const themes: Record<PlayableZone, ZoneTheme> = {
  bahari: {
    background: require('../assets/coast-background.png'), accent: '#177F91', warm: '#C66F47',
    welcome: { sw: 'Karibu Baharini!', en: 'Welcome to the Coast!' },
    invitation: { sw: 'Tuchunguze maumbo na rangi za pwani.', en: 'Let’s explore shapes and colours by the sea.' },
    activity: { sw: 'Hazina za Bahari', en: 'Coastal Treasures' },
    objectLabel: { sw: 'ANGALIA UMBO', en: 'LOOK AT THE SHAPE' },
    celebration: { sw: 'Mtaalamu wa bahari!', en: 'Coast explorer!' },
  },
  pori: {
    background: require('../assets/savanna-background.png'), accent: '#8C6530', warm: '#347B61',
    welcome: { sw: 'Karibu Porini!', en: 'Welcome to the Savanna!' },
    invitation: { sw: 'Twende tukawatafute wanyama.', en: 'Let’s find the animals together.' },
    activity: { sw: 'Safari ya Wanyama', en: 'Animal Safari' },
    objectLabel: { sw: 'TAFUTA MNYAMA', en: 'FIND THE ANIMAL' },
    celebration: { sw: 'Mlinzi wa wanyama!', en: 'Wildlife champion!' },
  },
  nyumbani: {
    background: require('../assets/home-background.png'), accent: '#9A5C52', warm: '#2C8178',
    welcome: { sw: 'Karibu Nyumbani!', en: 'Welcome Home!' },
    invitation: { sw: 'Tujifunze herufi, familia na siku.', en: 'Let’s learn letters, family and days.' },
    activity: { sw: 'Hadithi za Nyumbani', en: 'Home Stories' },
    objectLabel: { sw: 'ANGALIA NA UCHAGUE', en: 'LOOK AND CHOOSE' },
    celebration: { sw: 'Nyota ya familia!', en: 'Family star!' },
  },
  shuleni: {
    background: require('../assets/school-background.png'), accent: '#287451', warm: '#B46D37',
    welcome: { sw: 'Karibu Shuleni!', en: 'Welcome to School!' },
    invitation: { sw: 'Tujifunze saa, herufi na dunia yetu.', en: 'Let’s learn time, letters and our world.' },
    activity: { sw: 'Darasa la Nyota', en: 'Star Classroom' },
    objectLabel: { sw: 'FIKIRI KISHA CHAGUA', en: 'THINK, THEN CHOOSE' },
    celebration: { sw: 'Mwanafunzi hodari!', en: 'Brilliant learner!' },
  },
};

function LocalText({ value, language, title = false, light = false }: { value: Record<Language, string>; language: Language; title?: boolean; light?: boolean }) {
  return <Text style={[styles.copy, title && styles.title, light && styles.light]}>{value[language]}</Text>;
}

export function ZoneAdventureGame({ zone, initialLanguage, totalStars, onAward, onExit, onLanguageChange }: {
  zone: PlayableZone;
  initialLanguage: Language;
  totalStars: number;
  onAward: (zone: PlayableZone) => void;
  onExit: () => void;
  onLanguageChange: (language: Language) => void;
}) {
  const theme = themes[zone];
  const [language, setLanguage] = useState(initialLanguage);
  const [phase, setPhase] = useState<Phase>('welcome');
  const [rounds, setRounds] = useState<Question[]>(() => buildZoneRounds(zone));
  const [roundIndex, setRoundIndex] = useState(0);
  const [firstTry, setFirstTry] = useState(true);
  const [feedback, setFeedback] = useState<'retry' | 'correct' | null>(null);
  const [earned, setEarned] = useState(0);
  const question = rounds[roundIndex];
  const prompt = useMemo(() => question ? pair(question.prompt, language).primary : '', [question, language]);

  useEffect(() => {
    if (feedback !== 'correct') return;
    const timer = setTimeout(() => {
      if (roundIndex === 4) setPhase('report');
      else { setRoundIndex(value => value + 1); setFirstTry(true); setFeedback(null); }
    }, 900);
    return () => clearTimeout(timer);
  }, [feedback, roundIndex]);

  function start() {
    setRounds(buildZoneRounds(zone)); setRoundIndex(0); setFirstTry(true); setFeedback(null); setEarned(0); setPhase('play');
  }

  function choose(choice: string) {
    if (!question || feedback === 'correct') return;
    if (choice !== question.answer) { setFirstTry(false); setFeedback('retry'); return; }
    if (firstTry) { setEarned(value => value + 1); onAward(zone); }
    setFeedback('correct');
  }

  function toggleLanguage() {
    setLanguage(current => {
      const next = current === 'sw' ? 'en' : 'sw';
      onLanguageChange(next);
      return next;
    });
  }

  return <ImageBackground source={theme.background} resizeMode="cover" style={styles.background}>
    <View style={styles.shade} />
    <View style={styles.safe}>
      <View style={styles.topbar}>
        <Pressable style={styles.brand} onPress={onExit} accessibilityRole="button" accessibilityLabel={pair('back', language).primary}>
          <Text style={styles.brandName}>‹  SAFARI SHULE</Text>
          <Text style={[styles.brandSub, { color: theme.accent }]}>{pair(zone, language).primary.toUpperCase()}</Text>
        </Pressable>
        <View style={styles.topActions}>
          <View style={styles.starPill}><Text style={styles.star}>★</Text><Text style={styles.starNumber}>{totalStars}</Text></View>
          <Pressable style={[styles.language, { backgroundColor: theme.accent }]} onPress={toggleLanguage} accessibilityRole="button" accessibilityLabel={pair('language', language).primary}><Text style={styles.languageText}>{language === 'sw' ? 'SW' : 'EN'}</Text></Pressable>
        </View>
      </View>

      {phase === 'welcome' && <View style={styles.welcomeBody}>
        <View style={styles.welcomeCard}>
          <Text style={[styles.eyebrow, { color: theme.accent }]}>{theme.activity[language].toUpperCase()}</Text>
          <LocalText value={theme.welcome} language={language} title />
          <LocalText value={theme.invitation} language={language} />
          <Pressable style={[styles.playButton, { backgroundColor: theme.accent }]} onPress={start} accessibilityRole="button"><Text style={styles.playText}>{language === 'sw' ? 'ANZA KUCHEZA' : 'LET’S PLAY'}</Text></Pressable>
        </View>
        <Image source={guide} resizeMode="contain" style={styles.heroGuide} />
      </View>}

      {phase === 'play' && question && <View style={styles.gameBody}>
        <Image source={guide} resizeMode="contain" style={styles.sideGuide} />
        <View style={styles.gameColumn}>
          <View style={styles.promptCard}>
            <Text style={[styles.progress, { color: theme.accent }]}>{roundIndex + 1} / 5</Text>
            <Text style={styles.prompt}>{prompt}</Text>
          </View>
          <View style={styles.objectCard}>
            <Text style={[styles.objectLabel, { color: theme.accent }]}>{theme.objectLabel[language]}</Text>
            <Visual value={question.visual} size={68} />
          </View>
          <View style={styles.answerRow}>{question.choices.map((choice, index) => {
            const labelKey = question.choiceLabels?.[choice];
            return <Pressable key={`${question.id}-${choice}`} onPress={() => choose(choice)} style={[styles.answer, { backgroundColor: index === 1 ? theme.warm : theme.accent }]} accessibilityRole="button">
              {labelKey ? <Text style={styles.choiceLabel}>{pair(labelKey, language).primary}</Text> : <Visual value={choice} size={50} />}
            </Pressable>;
          })}</View>
          <View style={[styles.feedback, feedback === 'correct' && styles.feedbackCorrect, feedback === 'retry' && styles.feedbackRetry]}>
            {feedback && <><Text style={styles.feedbackMark}>{feedback === 'correct' ? '★' : '↻'}</Text><Text style={styles.feedbackText}>{feedback === 'correct' ? (language === 'sw' ? 'Umeweza!' : 'You got it!') : (language === 'sw' ? 'Angalia tena, unaweza!' : 'Look again, you can do it!')}</Text></>}
          </View>
        </View>
      </View>}

      {phase === 'report' && <View style={styles.reportBody}>
        <Image source={guide} resizeMode="contain" style={styles.reportGuide} />
        <View style={styles.reportCard}>
          <LocalText value={theme.celebration} language={language} title />
          <Text style={styles.reportStars}>{'★'.repeat(earned)}{'☆'.repeat(5 - earned)}</Text>
          <Text style={styles.reportNote}>{language === 'sw' ? `Umepata nyota ${earned} kati ya 5` : `You earned ${earned} of 5 stars`}</Text>
          <View style={styles.reportActions}>
            <Pressable onPress={onExit} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>{language === 'sw' ? 'RAMANI' : 'MAP'}</Text></Pressable>
            <Pressable onPress={start} style={[styles.playAgain, { backgroundColor: theme.accent }]}><Text style={styles.playText}>{language === 'sw' ? 'CHEZA TENA' : 'PLAY AGAIN'}</Text></Pressable>
          </View>
        </View>
      </View>}
    </View>
  </ImageBackground>;
}

const INK = '#243C43';
const CREAM = 'rgba(255,248,234,0.96)';
const styles = StyleSheet.create({
  background: { flex: 1 }, shade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(15,28,25,0.12)' }, safe: { flex: 1, paddingHorizontal: 24, paddingTop: 4, paddingBottom: 4 },
  topbar: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }, brand: { width: 285, height: 58, borderRadius: 19, backgroundColor: CREAM, paddingHorizontal: 19, justifyContent: 'center' }, brandName: { color: INK, fontSize: 21, fontWeight: '400', letterSpacing: .4 }, brandSub: { fontSize: 12, letterSpacing: .6, fontWeight: '700' }, topActions: { flexDirection: 'row', gap: 10 }, starPill: { height: 58, minWidth: 126, borderRadius: 19, paddingHorizontal: 17, backgroundColor: CREAM, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }, star: { color: '#AD6D26', fontSize: 32 }, starNumber: { color: '#AD6D26', fontSize: 27, fontWeight: '300' }, language: { width: 82, height: 58, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }, languageText: { color: 'white', fontSize: 14, fontWeight: '800' },
  welcomeBody: { flex: 1, flexDirection: 'row', alignItems: 'center' }, welcomeCard: { width: '56%', marginLeft: 28, padding: 24, gap: 12, borderRadius: 28, backgroundColor: CREAM, zIndex: 2 }, eyebrow: { textAlign: 'center', fontSize: 12, fontWeight: '900', letterSpacing: 1.7 }, heroGuide: { position: 'absolute', width: '43%', height: '96%', right: 30, bottom: -10 }, copy: { textAlign: 'center', color: INK, fontSize: 19, fontWeight: '500' }, title: { fontSize: 31, fontWeight: '300' }, light: { color: 'white' }, playButton: { alignSelf: 'center', width: '82%', height: 72, borderRadius: 21, padding: 10, justifyContent: 'center', shadowColor: '#123', shadowOpacity: .25, shadowRadius: 8, shadowOffset: { width: 0, height: 6 } }, playText: { color: 'white', textAlign: 'center', fontSize: 18, fontWeight: '800' },
  gameBody: { flex: 1, flexDirection: 'row' }, sideGuide: { alignSelf: 'flex-end', width: '22%', height: '78%' }, gameColumn: { flex: 1, paddingTop: 7, paddingLeft: 8 }, promptCard: { height: 82, paddingHorizontal: 22, borderRadius: 22, backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center' }, progress: { position: 'absolute', top: 6, right: 14, fontSize: 15, fontWeight: '800' }, prompt: { color: INK, fontSize: 26, lineHeight: 31, textAlign: 'center', fontWeight: '600' }, objectCard: { height: 118, marginTop: 7, padding: 7, borderRadius: 22, backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center' }, objectLabel: { position: 'absolute', top: 8, fontSize: 11, fontWeight: '900', letterSpacing: 1.1 }, answerRow: { flexDirection: 'row', justifyContent: 'center', gap: 28, marginTop: 7 }, answer: { width: 150, height: 68, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: '#123', shadowOpacity: .2, shadowRadius: 7, shadowOffset: { width: 0, height: 4 } }, choiceLabel: { color: 'white', fontSize: 18, fontWeight: '900', textAlign: 'center' }, feedback: { minHeight: 50, marginTop: 7, borderRadius: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }, feedbackCorrect: { backgroundColor: 'rgba(222,246,226,.96)' }, feedbackRetry: { backgroundColor: 'rgba(255,237,211,.96)' }, feedbackMark: { color: '#A66B22', fontSize: 25, fontWeight: '900' }, feedbackText: { color: INK, fontSize: 17, fontWeight: '800' },
  reportBody: { flex: 1, flexDirection: 'row', alignItems: 'flex-end' }, reportGuide: { width: '28%', height: '75%' }, reportCard: { flex: 1, alignSelf: 'center', marginHorizontal: 35, padding: 30, gap: 15, borderRadius: 34, backgroundColor: CREAM }, reportStars: { color: '#C58E38', fontSize: 58, textAlign: 'center', letterSpacing: 7 }, reportNote: { color: '#527077', fontSize: 17, fontWeight: '700', textAlign: 'center' }, reportActions: { flexDirection: 'row', justifyContent: 'center', gap: 12 }, secondaryButton: { width: '27%', minHeight: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8DECC' }, secondaryButtonText: { color: INK, fontWeight: '900', fontSize: 16 }, playAgain: { width: '53%', minHeight: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
