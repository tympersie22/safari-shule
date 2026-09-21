import React, { useEffect, useState } from 'react';
import { Alert, Linking, Platform, Pressable, Share, StyleSheet, Switch, Text, View } from 'react-native';
import { Purchase, useIAP } from 'react-native-iap';
import { CopyKey, Language, pair, zones } from './content';
import { Progress } from './storage';
import { Visual } from './visual';

const weeklySku = 'com.safarishule.extras.weekly';
const lifetimeSku = 'com.safarishule.extras.lifetime';
const verificationUrl = process.env.EXPO_PUBLIC_PURCHASE_VERIFY_URL;
type Verification = { verified: boolean; trialEndsAt?: string };
async function verifyWithServer(purchase: Purchase): Promise<Verification> {
  if (!verificationUrl) return { verified: false };
  try {
    const response = await fetch(verificationUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ purchase, platform: Platform.OS }) });
    if (!response.ok) return { verified: false };
    const result = await response.json() as Verification;
    return result.verified === true ? result : { verified: false };
  } catch { return { verified: false }; }
}
function Label({ name, first }: { name: CopyKey; first: Language }) {
  const text = pair(name, first);
  return <View><Text style={styles.main}>{text.primary}</Text></View>;
}
function Row({ name, first, onPress }: { name: CopyKey; first: Language; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}><Label name={name} first={first} /></Pressable>;
}

export function ParentArea({ progress, first, onChange, onDelete }: { progress: Progress; first: Language; onChange: (next: Progress) => Promise<void>; onDelete: () => Promise<void> }) {
  const [selected, setSelected] = useState<'weekly' | 'lifetime' | null>(null);
  const [storeError, setStoreError] = useState(false);
  const [hasExtras, setHasExtras] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const { connected, products, subscriptions, availablePurchases, fetchProducts, requestPurchase, getAvailablePurchases, finishTransaction } = useIAP({
    onPurchaseSuccess: async purchase => {
      if (purchase.productId !== weeklySku && purchase.productId !== lifetimeSku) return;
      try { const result = await verifyWithServer(purchase); if (!result.verified) throw new Error('Verification failed'); await finishTransaction({ purchase, isConsumable: false }); setHasExtras(true); setTrialEndsAt(result.trialEndsAt || null); await getAvailablePurchases(); }
      catch { setStoreError(true); }
    },
    onPurchaseError: () => setStoreError(true),
    onError: () => setStoreError(true),
  });
  useEffect(() => { if (!connected) return; void Promise.all([fetchProducts({ skus: [lifetimeSku], type: 'in-app' }), fetchProducts({ skus: [weeklySku], type: 'subs' }), getAvailablePurchases()]).catch(() => setStoreError(true)); }, [connected]);
  useEffect(() => { void (async () => { for (const purchase of availablePurchases) { if (purchase.productId !== weeklySku && purchase.productId !== lifetimeSku) continue; const result = await verifyWithServer(purchase); if (result.verified) { setHasExtras(true); setTrialEndsAt(result.trialEndsAt || null); return; } } })(); }, [availablePurchases]);
  const weekly = subscriptions.find(p => p.id === weeklySku);
  const lifetime = products.find(p => p.id === lifetimeSku);
  async function buy() {
    if (!verificationUrl) { setStoreError(true); return; }
    if (!connected || !selected) return;
    try {
      if (selected === 'lifetime') {
        if (!lifetime) { setStoreError(true); return; }
        await requestPurchase({ request: { apple: { sku: lifetimeSku }, google: { skus: [lifetimeSku] } }, type: 'in-app' });
      } else {
        if (!weekly) { setStoreError(true); return; }
        const offers = weekly.platform === 'android' ? weekly.subscriptionOffers.filter(offer => !!offer.offerTokenAndroid).map(offer => ({ sku: weeklySku, offerToken: offer.offerTokenAndroid! })) : [];
        await requestPurchase({ request: { apple: { sku: weeklySku }, google: { skus: [weeklySku], ...(offers.length ? { subscriptionOffers: offers } : {}) } }, type: 'subs' });
      }
    } catch { setStoreError(true); }
  }
  async function manage() {
    const url = Platform.OS === 'ios' ? 'https://apps.apple.com/account/subscriptions' : 'https://play.google.com/store/account/subscriptions';
    try { await Linking.openURL(url); } catch { setStoreError(true); }
  }
  async function restore() { try { await getAvailablePurchases(); } catch { setStoreError(true); } }
  async function exportData() { try { await Share.share({ message: JSON.stringify(progress) }); } catch { setStoreError(true); } }
  return <View style={styles.container}>
    <Label name="dashboard" first={first} />
    <View style={styles.card}><View style={styles.statRow}><Visual value="⭐" size={26} /><Text style={styles.stat}>{progress.stars}</Text></View>{zones.map(zone => <View key={zone.id} style={styles.statRow}><Visual value={zone.symbol} size={26} /><Text style={styles.stat}>{pair(zone.id, first).primary}: {progress.byZone[zone.id] || 0}</Text></View>)}</View>
    <Label name="settings" first={first} />
    <Row name="language" first={first} onPress={() => void onChange({ ...progress, firstLanguage: first === 'sw' ? 'en' : 'sw' })} />
    <View style={styles.row}><Label name="volume" first={first} /><Pressable onPress={() => void onChange({ ...progress, volume: Math.max(0, progress.volume - 0.25) })}><Text style={styles.control}>−</Text></Pressable><Text>{Math.round(progress.volume * 100)}%</Text><Pressable onPress={() => void onChange({ ...progress, volume: Math.min(1, progress.volume + 0.25) })}><Text style={styles.control}>+</Text></Pressable></View>
    <View style={styles.row}><Label name="minutes" first={first} /><Pressable onPress={() => void onChange({ ...progress, breakMinutes: Math.max(10, progress.breakMinutes - 5) })}><Text style={styles.control}>−</Text></Pressable><Text>{progress.breakMinutes}</Text><Pressable onPress={() => void onChange({ ...progress, breakMinutes: Math.min(30, progress.breakMinutes + 5) })}><Text style={styles.control}>+</Text></Pressable></View>
    <Label name="purchase" first={first} /><Label name="noAccessNeeded" first={first} />
    <View style={styles.plans}><Pressable accessibilityRole="radio" accessibilityState={{ selected: selected === 'weekly' }} style={[styles.plan, selected === 'weekly' && styles.selected]} onPress={() => setSelected('weekly')}><Label name="trial" first={first} /><Text>{weekly?.displayPrice || '$2.99/week'}</Text></Pressable><Pressable accessibilityRole="radio" accessibilityState={{ selected: selected === 'lifetime' }} style={[styles.plan, selected === 'lifetime' && styles.selected]} onPress={() => setSelected('lifetime')}><Label name="lifetime" first={first} /><Text>{lifetime?.displayPrice || '$19.99'}</Text></Pressable></View>
    <Row name="selectPlan" first={first} onPress={() => void buy()} />
    <Row name="manage" first={first} onPress={() => void manage()} />
    <Row name="restore" first={first} onPress={() => void restore()} />
    {hasExtras && <Visual value="⭐" size={32} />}
    {trialEndsAt && Date.parse(trialEndsAt) > Date.now() && <View style={styles.card}><Label name="reminder" first={first} /></View>}
    {!verificationUrl && <Label name="purchaseNotReady" first={first} />}
    {storeError && <Label name="storeUnavailable" first={first} />}
    <Row name="export" first={first} onPress={() => void exportData()} />
    <Row name="privacy" first={first} onPress={() => Alert.alert(pair('privacy', first).primary, '', [{ text: pair('back', first).primary }, { text: pair('privacy', first).primary, onPress: () => void onDelete() }])} />
  </View>;
}
const styles = StyleSheet.create({ container: { gap: 14 }, main: { fontSize: 19, color: '#20334A', fontWeight: '800' }, sub: { fontSize: 13, color: '#17445E' }, card: { backgroundColor: 'white', borderRadius: 16, padding: 18 }, statRow: { flexDirection: 'row', alignItems: 'center', gap: 8 }, stat: { fontSize: 18, marginBottom: 5 }, row: { backgroundColor: '#F2E9D7', padding: 15, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 60 }, control: { fontSize: 28, paddingHorizontal: 8 }, plans: { flexDirection: 'row', gap: 8 }, plan: { flex: 1, padding: 14, backgroundColor: 'white', borderWidth: 2, borderColor: '#17445E', borderRadius: 16 }, selected: { backgroundColor: '#FFDA73' } });
