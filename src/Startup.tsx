import React from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { Language } from './content';

const background = require('../assets/market-background.png');
const icon = require('../assets/safari-shule-emblem.png');

export function LanguageWelcome({ onChoose }: { onChoose: (language: Language) => void }) {
  return <ImageBackground source={background} resizeMode="cover" style={styles.background}>
    <View style={styles.shade} />
    <View style={styles.content}>
      <View style={styles.brandCard}>
        <Image source={icon} resizeMode="contain" style={styles.icon} />
        <Text style={styles.brand}>SAFARI SHULE</Text>
        <View style={styles.rule} />
        <View style={styles.actions}>
          <LanguageButton label="KISWAHILI" detail="Anza safari" onPress={() => onChoose('sw')} />
          <LanguageButton label="ENGLISH" detail="Start the journey" onPress={() => onChoose('en')} />
        </View>
      </View>
    </View>
  </ImageBackground>;
}

function LanguageButton({ label, detail, onPress }: { label: string; detail: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
    <Text style={styles.buttonLabel}>{label}</Text>
    <Text style={styles.buttonDetail}>{detail}</Text>
    <Text style={styles.arrow}>›</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  shade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(14,42,38,.42)' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  brandCard: { width: '66%', maxWidth: 850, minHeight: 430, alignItems: 'center', justifyContent: 'center', padding: 32, borderRadius: 34, backgroundColor: 'rgba(255,248,234,.96)', shadowColor: '#071D1A', shadowOpacity: .3, shadowRadius: 22, shadowOffset: { width: 0, height: 12 } },
  icon: { width: 150, height: 150, marginBottom: -8 },
  brand: { color: '#243C43', fontSize: 38, fontWeight: '300', letterSpacing: 2 },
  rule: { width: 72, height: 4, borderRadius: 2, marginTop: 15, marginBottom: 28, backgroundColor: '#C47B37' },
  actions: { width: '100%', flexDirection: 'row', gap: 18 },
  button: { flex: 1, minHeight: 112, borderRadius: 24, paddingHorizontal: 24, justifyContent: 'center', backgroundColor: '#1B8A87', shadowColor: '#102D2B', shadowOpacity: .18, shadowRadius: 8, shadowOffset: { width: 0, height: 5 } },
  buttonPressed: { opacity: .82, transform: [{ scale: .985 }] },
  buttonLabel: { color: 'white', fontSize: 23, fontWeight: '900', letterSpacing: 1 },
  buttonDetail: { color: '#DDF4EE', fontSize: 15, marginTop: 5 },
  arrow: { position: 'absolute', right: 22, top: 28, color: 'white', fontSize: 42, fontWeight: '300' },
});
