import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Polygon, Rect } from 'react-native-svg';

const symbols = ['👨🏾‍👩🏾‍👧🏾','🏖️','🗺️','▶️','➡️','👩🏾','👨🏾','👶🏾','🦒','🐘','🦓','🦁','🍌','🥭','🍍','🍅','🥥','🔺','🔴','🟦','⭐','🏠','🕒','🕕','🌳','🛒','📚','🐚','🏘️','🟢','🌍','🌾','🐓','🃏','🔵','🟡','🟣','✋','🌐','🌙','🔊','❓','🌴','↝'].sort((a, b) => b.length - a.length);
const ink = '#20334A';

function Glyph({ name, size }: { name: string; size: number }) {
  const common = { stroke: ink, strokeWidth: 2.5 };
  let art: React.ReactNode;
  switch (name) {
    case '🍌': art = <><Path d="M9 44 Q33 60 54 15 Q48 45 24 51 Q12 52 9 44Z" fill="#EFCB4F" {...common}/><Path d="M51 15 L56 10" {...common}/></>; break;
    case '🥭': art = <><Ellipse cx="32" cy="33" rx="22" ry="17" fill="#F7A748" {...common}/><Path d="M31 16 Q38 7 49 13 Q38 15 31 16Z" fill="#5E9B62" {...common}/></>; break;
    case '🍍': art = <><Path d="M18 24 L46 24 L43 54 L21 54Z" fill="#EDBC50" {...common}/><Path d="M32 24 L19 8 L31 15 L33 5 L37 16 L49 8 L40 24" fill="#60A66C" {...common}/><Path d="M21 30 L43 48 M43 30 L21 48" stroke="#B97A39" strokeWidth="2"/></>; break;
    case '🍅': art = <><Circle cx="32" cy="35" r="21" fill="#DB655D" {...common}/><Polygon points="32,13 37,22 49,23 39,28 32,25 24,28 16,23 28,22" fill="#66A169" {...common}/></>; break;
    case '🥥': art = <><Circle cx="32" cy="34" r="21" fill="#A77D5B" {...common}/><Circle cx="25" cy="32" r="2" fill={ink}/><Circle cx="38" cy="32" r="2" fill={ink}/><Circle cx="32" cy="40" r="2" fill={ink}/></>; break;
    case '🔺': art = <Polygon points="32,7 57,54 7,54" fill="#E2846B" {...common}/>; break;
    case '🟦': art = <Rect x="9" y="9" width="46" height="46" rx="3" fill="#70AFD1" {...common}/>; break;
    case '🔴': case '🔵': case '🟡': case '🟣': case '🟢': art = <Circle cx="32" cy="32" r="24" fill={{'🔴':'#D86168','🔵':'#5C9DCF','🟡':'#EAC859','🟣':'#9E7DBA','🟢':'#71AE82'}[name]} {...common}/>; break;
    case '⭐': art = <Polygon points="32,5 39,24 59,24 43,37 49,57 32,45 15,57 21,37 5,24 25,24" fill="#F4C85B" {...common}/>; break;
    case '🦒': art = <><Ellipse cx="29" cy="43" rx="18" ry="9" fill="#E6B464" {...common}/><Path d="M40 42 L41 15 L47 13 L50 44" fill="#E6B464" {...common}/><Circle cx="47" cy="13" r="7" fill="#E6B464" {...common}/><Circle cx="48" cy="12" r="1.5" fill={ink}/><Path d="M17 50 L17 59 M40 50 L40 59 M43 7 L43 3 M50 7 L52 3" {...common}/><Circle cx="25" cy="40" r="3" fill="#A87949"/><Circle cx="35" cy="45" r="3" fill="#A87949"/></>; break;
    case '🐘': art = <><Ellipse cx="27" cy="36" rx="20" ry="16" fill="#9DA9AE" {...common}/><Circle cx="43" cy="30" r="11" fill="#9DA9AE" {...common}/><Circle cx="39" cy="30" r="6" fill="#BBC2C2" {...common}/><Path d="M52 32 Q60 52 52 52 Q47 52 49 45" fill="none" {...common}/><Line x1="16" y1="47" x2="16" y2="57" {...common}/><Line x1="37" y1="47" x2="37" y2="57" {...common}/></>; break;
    case '🦓': art = <><Ellipse cx="27" cy="39" rx="19" ry="12" fill="white" {...common}/><Path d="M39 36 L40 18 L51 13 L54 22 L46 40" fill="white" {...common}/><Path d="M16 29 L24 48 M26 27 L34 50 M37 29 L42 43 M42 18 L48 27 M49 15 L53 22" stroke={ink} strokeWidth="3"/><Line x1="16" y1="48" x2="16" y2="58" {...common}/><Line x1="37" y1="48" x2="37" y2="58" {...common}/></>; break;
    case '🦁': art = <><Circle cx="32" cy="31" r="23" fill="#B98252" {...common}/><Circle cx="32" cy="31" r="15" fill="#F1C98C" {...common}/><Circle cx="26" cy="27" r="2" fill={ink}/><Circle cx="38" cy="27" r="2" fill={ink}/><Path d="M27 38 Q32 43 37 38" fill="none" {...common}/></>; break;
    case '🏠': case '🏘️': art = <><Rect x="13" y="28" width="38" height="29" rx="2" fill="#E8AD82" {...common}/><Polygon points="8,29 32,8 56,29" fill="#BA735A" {...common}/><Rect x="27" y="39" width="10" height="18" fill="#775B50" {...common}/>{name === '🏘️' && <Circle cx="8" cy="45" r="5" fill="#79AD79"/>}</>; break;
    case '🌳': case '🌴': art = <><Rect x="29" y="31" width="7" height="27" fill="#9A7657" {...common}/><Circle cx="22" cy="29" r="13" fill="#79B285" {...common}/><Circle cx="40" cy="27" r="14" fill="#79B285" {...common}/><Circle cx="32" cy="17" r="14" fill="#79B285" {...common}/></>; break;
    case '🌾': art = <><Path d="M32 57 L32 15 M32 45 L18 30 M32 35 L46 20" fill="none" {...common}/><Ellipse cx="20" cy="29" rx="5" ry="10" fill="#E5C56C" {...common}/><Ellipse cx="45" cy="19" rx="5" ry="10" fill="#E5C56C" {...common}/></>; break;
    case '🐚': art = <><Path d="M9 48 Q9 18 32 13 Q55 18 55 48 Q32 58 9 48Z" fill="#E5B1A3" {...common}/><Path d="M32 16 L32 52 M20 21 L25 53 M44 21 L39 53 M12 33 L18 51 M52 33 L46 51" fill="none" stroke="#B77E7E" strokeWidth="2"/></>; break;
    case '📚': art = <><Rect x="10" y="13" width="10" height="42" fill="#719EB7" {...common}/><Rect x="22" y="9" width="12" height="46" fill="#E6AA6C" {...common}/><Rect x="36" y="17" width="12" height="38" fill="#9AB579" {...common}/><Line x1="8" y1="55" x2="55" y2="55" {...common}/></>; break;
    case '🛒': art = <><Path d="M8 13 L15 13 L22 44 L49 44 L56 22 L18 22" fill="none" {...common}/><Circle cx="26" cy="52" r="4" fill={ink}/><Circle cx="46" cy="52" r="4" fill={ink}/></>; break;
    case '🕒': case '🕕': art = <><Circle cx="32" cy="32" r="24" fill="#FAF7EE" {...common}/><Path d={name === '🕒' ? 'M32 16 L32 32 L46 32' : 'M32 16 L32 32 L32 47'} fill="none" stroke={ink} strokeWidth="4"/></>; break;
    case '👩🏾': case '👨🏾': case '👶🏾': case '👨🏾‍👩🏾‍👧🏾': art = <><Circle cx="32" cy="19" r={name === '👶🏾' ? 9 : 12} fill="#A87957" {...common}/><Path d="M14 57 Q15 34 32 34 Q49 34 50 57Z" fill={name === '👩🏾' ? '#B481A9' : name === '👶🏾' ? '#E6BE6E' : '#79A6BA'} {...common}/>{name === '👩🏾' && <Path d="M20 18 Q21 4 32 5 Q43 4 44 18" fill="none" stroke={ink} strokeWidth="5"/>}</>; break;
    case '🏖️': art = <><Path d="M5 48 Q32 37 59 48 L59 59 L5 59Z" fill="#EBC985" {...common}/><Path d="M32 42 L32 15 M12 21 Q31 2 51 21Z" fill="#E08479" {...common}/></>; break;
    case '🌍': case '🌐': art = <><Circle cx="32" cy="32" r="24" fill="#80BBD0" {...common}/><Path d="M20 16 L29 15 L34 25 L26 34 L18 29Z M43 36 L52 36 L47 49 L37 51 L36 43Z" fill="#75A974" {...common}/></>; break;
    case '🐓': art = <><Ellipse cx="29" cy="38" rx="17" ry="14" fill="#F2E6C8" {...common}/><Circle cx="43" cy="23" r="9" fill="#F2E6C8" {...common}/><Polygon points="50,22 59,26 50,29" fill="#D8A451" {...common}/><Circle cx="43" cy="21" r="1.5" fill={ink}/><Path d="M40 14 L43 8 L47 14 M23 51 L23 59 M35 51 L35 59" fill="none" {...common}/></>; break;
    case '▶️': art = <Polygon points="17,8 53,32 17,56" fill="#5FAE8D" {...common}/>; break;
    case '➡️': case '↝': art = <Path d="M8 32 L47 32 M36 19 L51 32 L36 45" fill="none" stroke={ink} strokeWidth="7" strokeLinecap="round"/>; break;
    case '🗺️': art = <><Path d="M7 13 L23 9 L40 15 L57 10 L57 49 L40 54 L23 48 L7 53Z" fill="#DDE6BD" {...common}/><Path d="M23 9 L23 48 M40 15 L40 54" fill="none" {...common}/></>; break;
    case '🔊': art = <><Polygon points="8,24 20,24 34,12 34,52 20,40 8,40" fill="#7BAED0" {...common}/><Path d="M40 20 Q52 32 40 44 M47 13 Q62 32 47 51" fill="none" {...common}/></>; break;
    case '🌙': art = <Path d="M43 8 Q18 12 19 34 Q20 52 47 53 Q29 63 14 46 Q1 24 22 10 Q32 4 43 8Z" fill="#E8D18D" {...common}/>; break;
    case '✋': art = <><Path d="M18 54 L12 39 Q9 34 14 31 Q18 29 22 37 L22 14 Q22 9 26 9 Q30 9 30 14 L30 33 L31 9 Q31 5 35 5 Q39 5 39 10 L39 33 L40 16 Q40 12 44 12 Q48 12 48 17 L48 42 Q47 57 35 58Z" fill="#B98965" {...common}/></>; break;
    case '🃏': art = <><Rect x="12" y="11" width="40" height="45" rx="5" fill="#E8B5A6" {...common}/><Circle cx="32" cy="32" r="9" fill="#F8E9CF" {...common}/></>; break;
    case '❓': art = <><Rect x="9" y="9" width="46" height="46" rx="5" fill="#F8E9CF" {...common}/><Path d="M24 24 Q25 16 33 16 Q42 16 42 24 Q42 29 33 34 L33 39" fill="none" {...common}/><Circle cx="33" cy="47" r="2" fill={ink}/></>; break;
    default: art = <Circle cx="32" cy="32" r="20" fill="#D9E0D5" {...common}/>;
  }
  return <Svg width={size} height={size} viewBox="0 0 64 64" accessibilityLabel={name}>{art}</Svg>;
}

export function Visual({ value, size = 48 }: { value: string; size?: number }) {
  const parts: { value: string; icon: boolean }[] = [];
  for (let i = 0; i < value.length;) {
    const symbol = symbols.find(item => value.startsWith(item, i));
    if (symbol) { parts.push({ value: symbol, icon: true }); i += symbol.length; }
    else { parts.push({ value: value[i], icon: false }); i += 1; }
  }
  return <View style={styles.visual}>{parts.map((part, index) => part.icon ? <Glyph key={index} name={part.value} size={size} /> : <Text key={index} style={[styles.text, { fontSize: size * 0.7 }]}>{part.value}</Text>)}</View>;
}
const styles = StyleSheet.create({ visual: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }, text: { color: ink, fontWeight: '800' } });
