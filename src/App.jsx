import { useState, useRef, createContext, useContext } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, ResponsiveContainer, Tooltip,
} from "recharts";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKEN OBJECTS — DARK + LIGHT
   Every color value in the app comes from one of these objects.
   No hex / rgba appears in any component JSX.
═══════════════════════════════════════════════════════════ */
const DARK = {
  /* ── Page & shell ── */
  bg:             "#0C0917",
  bgAlt:          "#120E22",
  sheetBg:        "#160F2A",
  navBg:          "rgba(12,9,23,0.95)",
  chatHeaderBg:   "rgba(12,9,23,0.90)",
  chatInputBg:    "rgba(12,9,23,0.95)",
  scrim:          "rgba(0,0,0,0.72)",
  gridLine:       "rgba(255,255,255,0.025)",
  shellShadow:    "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.04)",
  shellInner:     "rgba(255,255,255,0.04)",
  shellRing:      "rgba(255,255,255,0.08)",

  /* ── Surfaces ── */
  surface:        "rgba(255,255,255,0.055)",
  surfaceHov:     "rgba(255,255,255,0.09)",
  border:         "rgba(255,255,255,0.10)",
  borderHov:      "rgba(255,255,255,0.20)",

  /* ── Purple scale ── */
  p300:           "#C4B5FD",
  p400:           "#A78BFA",
  p500:           "#8B5CF6",
  p600:           "#7C3AED",
  p700:           "#6D28D9",

  /* ── Status colours ── */
  green:          "#22C55E",
  greenD:         "#16A34A",
  greenBg:        "rgba(34,197,94,0.15)",
  greenBorder:    "rgba(34,197,94,0.25)",
  greenCard:      "rgba(34,197,94,0.07)",
  orange:         "#F97316",
  orangeBg:       "rgba(249,115,22,0.15)",
  orangeCard:     "rgba(249,115,22,0.07)",
  orangeBorder:   "rgba(249,115,22,0.25)",
  red:            "#EF4444",
  redBg:          "rgba(239,68,68,0.15)",
  redCard:        "rgba(239,68,68,0.07)",
  redBorder:      "rgba(239,68,68,0.25)",
  cyan:           "#06B6D4",

  /* ── Text ── */
  white:          "#FFFFFF",
  text1:          "#F8F4FF",
  text2:          "#C4B5FD",
  text3:          "rgba(196,181,253,0.55)",

  /* ── Interactive micro-tokens ── */
  toggleOff:      "rgba(255,255,255,0.12)",
  ringTrack:      "rgba(255,255,255,0.07)",
  spinnerTrack:   "rgba(255,255,255,0.25)",
  aiMsgBg:        "rgba(139,92,246,0.15)",
  aiMsgBorder:    "rgba(139,92,246,0.25)",
  accentBorder:   "rgba(139,92,246,0.30)",
  accentSubtle:   "rgba(139,92,246,0.07)",
  accentMid:      "rgba(139,92,246,0.15)",
  accentFocus:    "rgba(139,92,246,0.20)",
  notchGlow:      "rgba(139,92,246,0.60)",
  selCardSel:     "rgba(139,92,246,0.12)",
  subCard:        "rgba(139,92,246,0.25)",
  subCardBorder:  "rgba(139,92,246,0.40)",
  skeletonBase:   "rgba(255,255,255,0.05)",
  skeletonShim:   "rgba(255,255,255,0.09)",

  /* ── Gradients ── */
  gradAccent:     "linear-gradient(135deg, #C4B5FD, #8B5CF6, #06B6D4)",
  gradGreen:      "linear-gradient(135deg, #22C55E, #06B6D4)",
  gradBtn:        "linear-gradient(135deg, #7C3AED, #8B5CF6)",
  gradBtnRed:     "linear-gradient(135deg, #DC2626, #EF4444)",
  gradLogo:       "linear-gradient(135deg, #7C3AED, #06B6D4)",
  gradHeroCard:   "linear-gradient(135deg, rgba(139,92,246,0.20), rgba(6,182,212,0.10))",
  gradHeroBorder: "rgba(139,92,246,0.30)",
  gradProfile:    "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.08))",
  gradProfileBorder:"rgba(139,92,246,0.25)",
  gradSplash:     "radial-gradient(ellipse at 60% 20%, rgba(139,92,246,0.25) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(6,182,212,0.15) 0%, transparent 60%)",
  gradSignedIn:   "linear-gradient(135deg, rgba(139,92,246,0.20), rgba(6,182,212,0.12))",

  /* ── Mesh defaults ── */
  mesh1:          "rgba(139,92,246,0.15)",
  mesh2:          "rgba(6,182,212,0.08)",
  mesh3:          "rgba(34,197,94,0.06)",
};

const LIGHT = {
  /* ── Page & shell ── */
  bg:             "#F4EFFF",
  bgAlt:          "#FFFFFF",
  sheetBg:        "#FFFFFF",
  navBg:          "rgba(244,239,255,0.97)",
  chatHeaderBg:   "rgba(244,239,255,0.94)",
  chatInputBg:    "rgba(244,239,255,0.97)",
  scrim:          "rgba(26,10,80,0.40)",
  gridLine:       "rgba(109,40,217,0.05)",
  shellShadow:    "0 40px 120px rgba(109,40,217,0.18), 0 0 0 1px rgba(109,40,217,0.12), inset 0 0 0 1px rgba(109,40,217,0.05)",
  shellInner:     "rgba(109,40,217,0.05)",
  shellRing:      "rgba(109,40,217,0.12)",

  /* ── Surfaces ── */
  surface:        "rgba(109,40,217,0.07)",
  surfaceHov:     "rgba(109,40,217,0.12)",
  border:         "rgba(109,40,217,0.16)",
  borderHov:      "rgba(109,40,217,0.32)",

  /* ── Purple scale — darker for light-bg legibility ── */
  p300:           "#6D28D9",
  p400:           "#5B21B6",
  p500:           "#4C1D95",
  p600:           "#7C3AED",   /* button gradient keeps vibrant purple */
  p700:           "#6D28D9",

  /* ── Status colours — darker for light bg contrast ── */
  green:          "#15803D",
  greenD:         "#166534",
  greenBg:        "rgba(21,128,61,0.12)",
  greenBorder:    "rgba(21,128,61,0.25)",
  greenCard:      "rgba(21,128,61,0.06)",
  orange:         "#C2410C",
  orangeBg:       "rgba(194,65,12,0.10)",
  orangeCard:     "rgba(194,65,12,0.06)",
  orangeBorder:   "rgba(194,65,12,0.25)",
  red:            "#B91C1C",
  redBg:          "rgba(185,28,28,0.10)",
  redCard:        "rgba(185,28,28,0.06)",
  redBorder:      "rgba(185,28,28,0.25)",
  cyan:           "#0E7490",

  /* ── Text ── */
  white:          "#FFFFFF",
  text1:          "#1A0A3C",
  text2:          "#4A2D8C",
  text3:          "rgba(74,45,140,0.60)",

  /* ── Interactive micro-tokens ── */
  toggleOff:      "rgba(109,40,217,0.15)",
  ringTrack:      "rgba(109,40,217,0.10)",
  spinnerTrack:   "rgba(109,40,217,0.25)",
  aiMsgBg:        "rgba(109,40,217,0.09)",
  aiMsgBorder:    "rgba(109,40,217,0.20)",
  accentBorder:   "rgba(109,40,217,0.25)",
  accentSubtle:   "rgba(109,40,217,0.06)",
  accentMid:      "rgba(109,40,217,0.12)",
  accentFocus:    "rgba(109,40,217,0.18)",
  notchGlow:      "rgba(109,40,217,0.50)",
  selCardSel:     "rgba(109,40,217,0.10)",
  subCard:        "rgba(109,40,217,0.15)",
  subCardBorder:  "rgba(109,40,217,0.30)",
  skeletonBase:   "rgba(109,40,217,0.05)",
  skeletonShim:   "rgba(109,40,217,0.10)",

  /* ── Gradients ── */
  gradAccent:     "linear-gradient(135deg, #6D28D9, #4C1D95, #0E7490)",
  gradGreen:      "linear-gradient(135deg, #15803D, #0E7490)",
  gradBtn:        "linear-gradient(135deg, #7C3AED, #8B5CF6)",
  gradBtnRed:     "linear-gradient(135deg, #991B1B, #B91C1C)",
  gradLogo:       "linear-gradient(135deg, #7C3AED, #06B6D4)",
  gradHeroCard:   "linear-gradient(135deg, rgba(109,40,217,0.12), rgba(8,145,178,0.07))",
  gradHeroBorder: "rgba(109,40,217,0.25)",
  gradProfile:    "linear-gradient(135deg, rgba(109,40,217,0.10), rgba(8,145,178,0.06))",
  gradProfileBorder:"rgba(109,40,217,0.20)",
  gradSplash:     "radial-gradient(ellipse at 60% 20%, rgba(109,40,217,0.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(8,145,178,0.10) 0%, transparent 60%)",
  gradSignedIn:   "linear-gradient(135deg, rgba(109,40,217,0.12), rgba(8,145,178,0.08))",

  /* ── Mesh defaults ── */
  mesh1:          "rgba(109,40,217,0.10)",
  mesh2:          "rgba(8,145,178,0.07)",
  mesh3:          "rgba(21,128,61,0.06)",
};

/* ═══════════════════════════════════════════════════════════
   THEME CONTEXT
═══════════════════════════════════════════════════════════ */
const ThemeCtx = createContext({ C: DARK, isDark: true, setIsDark: () => {} });
const useTheme     = () => useContext(ThemeCtx).C;
const useIsDark    = () => useContext(ThemeCtx).isDark;
const useSetIsDark = () => useContext(ThemeCtx).setIsDark;

/* ═══════════════════════════════════════════════════════════
   DYNAMIC CSS — generated from current theme tokens
   All class-level colours reference C.* only.
═══════════════════════════════════════════════════════════ */
const makeCSS = (C) => `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:${C.bg};}

.app-shell{
  width:390px;min-height:844px;max-height:844px;
  background:${C.bg};border-radius:48px;overflow:hidden;
  position:relative;display:flex;flex-direction:column;
  box-shadow:${C.shellShadow};font-family:'Inter',sans-serif;
}
.screen{flex:1;overflow-y:auto;overflow-x:hidden;padding-bottom:88px;}
.screen::-webkit-scrollbar{display:none;}

.card{background:${C.surface};border:1px solid ${C.border};border-radius:20px;backdrop-filter:blur(20px);}
.card-sm{border-radius:14px;}

/* Animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
@keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(139,92,246,0.5);}70%{box-shadow:0 0 0 18px rgba(139,92,246,0);}100%{box-shadow:0 0 0 0 rgba(139,92,246,0);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes shimmer{0%{background-position:-300px 0;}100%{background-position:300px 0;}}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}
@keyframes progress-fill{from{width:0;}}
@keyframes score-reveal{from{opacity:0;transform:scale(0.7);}to{opacity:1;transform:scale(1);}}

.anim-fade-up{animation:fadeUp 0.55s cubic-bezier(.22,.68,0,1.2) both;}
.anim-float{animation:float 3s ease-in-out infinite;}
.anim-pulse{animation:pulse-ring 2s infinite;}
.anim-spin{animation:spin 1s linear infinite;}
.anim-blink{animation:blink 1s step-end infinite;}
.anim-score{animation:score-reveal 0.7s cubic-bezier(.22,.68,0,1.2) both;}
.d1{animation-delay:.05s;}.d2{animation-delay:.12s;}.d3{animation-delay:.20s;}
.d4{animation-delay:.28s;}.d5{animation-delay:.38s;}

.grad-text{background:${C.gradAccent};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.grad-green{background:${C.gradGreen};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600;}
.badge-purple{background:${C.accentMid};color:${C.p300};border:1px solid ${C.accentBorder};}
.badge-green{background:${C.greenBg};color:${C.green};border:1px solid ${C.greenBorder};}
.badge-orange{background:${C.orangeBg};color:${C.orange};border:1px solid ${C.orangeBorder};}
.badge-red{background:${C.redBg};color:${C.red};border:1px solid ${C.redBorder};}

.ds-input{
  width:100%;background:${C.surface};border:1px solid ${C.border};
  border-radius:12px;padding:12px 16px;color:${C.text1};
  font-family:'Inter',sans-serif;font-size:14px;outline:none;transition:border .2s;
}
.ds-input::placeholder{color:${C.text3};}
.ds-input:focus{border-color:${C.p500};box-shadow:0 0 0 3px ${C.accentFocus};}

.btn-primary{
  display:flex;align-items:center;justify-content:center;gap:8px;
  width:100%;padding:15px 24px;border-radius:14px;border:none;cursor:pointer;
  font-family:'Inter',sans-serif;font-size:15px;font-weight:600;color:${C.white};
  background:${C.gradBtn};box-shadow:0 8px 24px ${C.accentBorder};
  transition:opacity .2s,transform .15s;
}
.btn-primary:hover{opacity:.92;transform:translateY(-1px);}
.btn-primary:active{transform:scale(.98);}

.btn-ghost{
  display:flex;align-items:center;justify-content:center;gap:8px;
  width:100%;padding:14px 24px;border-radius:14px;border:1px solid ${C.border};
  cursor:pointer;font-family:'Inter',sans-serif;font-size:15px;font-weight:500;
  color:${C.text2};background:${C.surface};transition:border .2s,background .2s;
}
.btn-ghost:hover{border-color:${C.p400};background:${C.accentSubtle};}

.progress-track{height:6px;border-radius:99px;background:${C.ringTrack};overflow:hidden;}
.progress-fill{height:100%;border-radius:99px;animation:progress-fill .8s ease both;}

.ring-container{position:relative;display:inline-flex;align-items:center;justify-content:center;}

.bottom-nav{
  position:absolute;bottom:0;left:0;right:0;height:80px;
  background:${C.navBg};border-top:1px solid ${C.border};
  backdrop-filter:blur(24px);
  display:flex;align-items:center;justify-content:space-around;padding:0 8px 12px;
}
.nav-item{
  display:flex;flex-direction:column;align-items:center;gap:4px;
  cursor:pointer;padding:8px 12px;border-radius:12px;transition:background .2s;flex:1;
}
.nav-item:hover{background:${C.accentSubtle};}
.nav-label{font-size:10px;font-weight:500;}

.chat-ai{
  background:${C.aiMsgBg};border:1px solid ${C.aiMsgBorder};
  border-radius:18px 18px 18px 4px;padding:12px 16px;
  color:${C.text1};font-size:14px;line-height:1.55;max-width:80%;
}
.chat-user{
  background:${C.gradBtn};border-radius:18px 18px 4px 18px;
  padding:12px 16px;color:${C.white};font-size:14px;line-height:1.55;
  max-width:80%;align-self:flex-end;
}

.metric-chip{
  background:${C.surface};border:1px solid ${C.border};
  border-radius:14px;padding:14px 12px;
  display:flex;flex-direction:column;align-items:center;gap:4px;
}
.glow-dot{width:8px;height:8px;border-radius:50%;background:${C.green};box-shadow:0 0 8px ${C.green};}

.toggle{width:44px;height:24px;border-radius:12px;position:relative;cursor:pointer;transition:background .2s;}
.toggle-thumb{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:${C.white};transition:left .2s;}

.skeleton{
  background:linear-gradient(90deg,${C.skeletonBase} 25%,${C.skeletonShim} 50%,${C.skeletonBase} 75%);
  background-size:300px 100%;animation:shimmer 1.4s infinite;border-radius:8px;
}

.sel-card{
  border:1.5px solid ${C.border};border-radius:16px;
  padding:14px 16px;cursor:pointer;transition:all .2s;background:${C.surface};
}
.sel-card.selected{
  border-color:${C.p500};background:${C.selCardSel};box-shadow:0 0 0 1px ${C.p500};
}
.hide-scroll{overflow-x:auto;}
.hide-scroll::-webkit-scrollbar{display:none;}
`;

/* ═══════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════ */
const glucoseData = [
  {day:"Mon",fg:95,pp:138},{day:"Tue",fg:102,pp:145},{day:"Wed",fg:88,pp:126},
  {day:"Thu",fg:97,pp:152},{day:"Fri",fg:91,pp:134},{day:"Sat",fg:85,pp:122},{day:"Sun",fg:93,pp:130},
];
const weightData = [
  {week:"W1",w:84},{week:"W2",w:83.2},{week:"W3",w:82.5},
  {week:"W4",w:81.8},{week:"W5",w:81.1},{week:"W6",w:80.4},
];
const hba1cData = [
  {mo:"Jan",v:6.4},{mo:"Feb",v:6.2},{mo:"Mar",v:6.0},{mo:"Apr",v:5.9},{mo:"May",v:5.7},
];
const chatHistory = [
  {role:"ai",  text:"Hi Aarav! 👋 I'm your GlucoRevive AI coach. How can I help you today?", time:"9:01 AM"},
  {role:"user",text:"Can I eat white rice for lunch?", time:"9:03 AM"},
  {role:"ai",  text:"White rice has a high glycemic index (GI ~73) which causes rapid blood sugar spikes. Switch to basmati (GI ~58) or cauliflower rice. If you do eat white rice, pair it with dal + veggies + raita to slow absorption. Keep portions to ½ cup cooked. 🍚", time:"9:03 AM"},
  {role:"user",text:"Suggest a diabetic-friendly breakfast", time:"9:10 AM"},
  {role:"ai",  text:"Perfect diabetic breakfast:\n\n🥚 2 boiled eggs + whole wheat toast\n🥑 ½ avocado with lemon\n🍵 Green tea or methi water\n\nEstimated glucose impact: Low 📉\nProtein: 18g | Carbs: 24g | Fiber: 6g", time:"9:10 AM"},
];

/* ═══════════════════════════════════════════════════════════
   SMALL SHARED COMPONENTS
═══════════════════════════════════════════════════════════ */
function SvgIcon({d,size=20,color="currentColor",sw=2}){
  return(
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d}/>
    </svg>
  );
}
const IC={
  home:   "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  trend:  "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  chat:   "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  meal:   "M12 2a10 10 0 100 20A10 10 0 0012 2z M12 8v4l3 3",
  user:   "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  bell:   "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  send:   "M22 2L11 13 M22 2L15 22 8 13 2 9l20-7z",
  mic:    "M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z M19 10v2a7 7 0 01-14 0v-2 M12 19v4 M8 23h8",
  camera: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z",
  check:  "M20 6L9 17 4 12",
  right:  "M9 18l6-6-6-6",
  skip:   "M5 4l10 8-10 8V4z M19 4v16",
  upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  eye:    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 100-6 3 3 0 000 6z",
  eyeOff: "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94 M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19 M1 1l22 22",
  sun:    "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42 M12 17a5 5 0 100-10 5 5 0 000 10z",
  moon:   "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
};

function Icon({name,size=20,color}){
  const C=useTheme();
  return <SvgIcon d={IC[name]} size={size} color={color||C.text2} sw={1.8}/>;
}

function CircleProgress({pct=75,size=120,stroke=10,color,children}){
  const C=useTheme();
  const r=(size-stroke)/2;
  const circ=2*Math.PI*r;
  const dash=(pct/100)*circ;
  return(
    <div className="ring-container" style={{width:size,height:size}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.ringTrack} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color||C.p500} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{transition:"stroke-dasharray 1s ease",filter:`drop-shadow(0 0 6px ${color||C.p500}88)`}}/>
      </svg>
      <div style={{position:"absolute",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        {children}
      </div>
    </div>
  );
}

function HabitRing({pct,color,size=60,icon,label,val,unit}){
  const C=useTheme();
  const r=(size-8)/2;
  const circ=2*Math.PI*r;
  const dash=(pct/100)*circ;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
      <div className="ring-container" style={{width:size,height:size}}>
        <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.ringTrack} strokeWidth={6}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{filter:`drop-shadow(0 0 5px ${color}99)`}}/>
        </svg>
        <div style={{position:"absolute",fontSize:20}}>{icon}</div>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{color:C.text1,fontWeight:700,fontSize:14}}>{val}<span style={{fontSize:11,color:C.text3,fontWeight:400}}>{unit}</span></div>
        <div style={{color:C.text3,fontSize:11,marginTop:1}}>{label}</div>
      </div>
    </div>
  );
}

function ToggleSwitch({on,setOn}){
  const C=useTheme();
  return(
    <div className="toggle" style={{background:on?C.p500:C.toggleOff}} onClick={()=>setOn(!on)}>
      <div className="toggle-thumb" style={{left:on?"23px":"3px"}}/>
    </div>
  );
}

function MeshBg({colors}){
  const C=useTheme();
  const[c1,c2,c3]=colors||[C.mesh1,C.mesh2,C.mesh3];
  return(
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-60,right:-60,width:250,height:250,borderRadius:"50%",background:c1,filter:"blur(80px)"}}/>
      <div style={{position:"absolute",bottom:80,left:-80,width:220,height:220,borderRadius:"50%",background:c2,filter:"blur(70px)"}}/>
      <div style={{position:"absolute",top:"40%",right:20,width:150,height:150,borderRadius:"50%",background:c3,filter:"blur(60px)"}}/>
    </div>
  );
}

function Spinner({size=16,color}){
  const C=useTheme();
  return(
    <div className="anim-spin" style={{
      width:size,height:size,
      border:`2px solid ${C.spinnerTrack}`,
      borderTopColor:color||C.white,
      borderRadius:"50%",
    }}/>
  );
}

/* ═══════════════════════════════════════════════════════════
   SPLASH SCREEN
═══════════════════════════════════════════════════════════ */
function SplashScreen({onDone}){
  const C=useTheme();
  const[phase,setPhase]=useState(0);
  useState(()=>{
    const t1=setTimeout(()=>setPhase(1),400);
    const t2=setTimeout(()=>setPhase(2),1200);
    const t3=setTimeout(()=>onDone(),2800);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  });
  return(
    <div style={{
      position:"relative",width:"100%",height:"100%",minHeight:844,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      background:`${C.gradSplash}, ${C.bg}`,overflow:"hidden",
    }}>
      <MeshBg/>
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${C.gridLine} 1px,transparent 1px),linear-gradient(90deg,${C.gridLine} 1px,transparent 1px)`,backgroundSize:"32px 32px",opacity:.5}}/>

      <div className="anim-float" style={{opacity:phase>=1?1:0,transition:"opacity .6s",display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
        <div className={phase>=1?"anim-pulse":""} style={{
          width:100,height:100,borderRadius:28,
          background:C.gradLogo,
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:`0 20px 60px ${C.notchGlow}`,fontSize:48,
        }}>🩺</div>
        <div style={{textAlign:"center"}}>
          <div style={{fontWeight:800,fontSize:28,color:C.text1,letterSpacing:"-0.5px"}}>
            GlucoRevive <span className="grad-text">AI</span>
          </div>
          <div style={{color:C.text3,fontSize:13,marginTop:6}}>Your Personal Diabetes Reversal Coach</div>
        </div>
      </div>

      <div style={{
        opacity:phase>=2?1:0,transform:phase>=2?"translateY(0)":"translateY(12px)",
        transition:"all .6s",position:"absolute",bottom:80,textAlign:"center",padding:"0 40px",
      }}>
        <div style={{color:C.text2,fontSize:16,fontWeight:500,lineHeight:1.5}}>"Reverse Diabetes Naturally with AI"</div>
        <div style={{marginTop:20,display:"flex",gap:4,justifyContent:"center"}}>
          {[0,1,2].map(i=>(
            <div key={i} style={{width:i===1?24:8,height:4,borderRadius:2,background:i===1?C.p500:C.ringTrack,transition:"all .3s"}}/>
          ))}
        </div>
      </div>

      <div style={{position:"absolute",bottom:32,display:"flex",alignItems:"center",gap:8,opacity:phase>=2?1:0,transition:"opacity .4s"}}>
        <Spinner size={16} color={C.p500}/>
        <span style={{color:C.text3,fontSize:12}}>Initializing AI…</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOGIN SCREEN
═══════════════════════════════════════════════════════════ */
function LoginScreen({onDone}){
  const C=useTheme();
  const[mode,setMode]=useState("login");
  const[email,setEmail]=useState("");
  const[pw,setPw]=useState("");
  const[name,setName]=useState("");
  const[showPw,setShowPw]=useState(false);
  const[loading,setLoading]=useState(null);
  const[resetSent,setResetSent]=useState(false);

  const submit=(provider)=>{
    setLoading(provider);
    setTimeout(()=>{setLoading(null);onDone();},1400);
  };

  return(
    <div style={{
      position:"relative",width:"100%",minHeight:844,overflow:"hidden",
      background:`${C.gradSplash}, ${C.bg}`,
      display:"flex",flexDirection:"column",
    }}>
      <MeshBg/>
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${C.gridLine} 1px,transparent 1px),linear-gradient(90deg,${C.gridLine} 1px,transparent 1px)`,backgroundSize:"40px 40px",pointerEvents:"none"}}/>

      {/* Brand */}
      <div className="anim-fade-up" style={{padding:"52px 24px 0",textAlign:"center"}}>
        <div style={{position:"relative",height:110,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>
          <div style={{position:"absolute",width:100,height:100,borderRadius:"50%",background:C.accentMid,filter:"blur(24px)"}}/>
          <div style={{position:"absolute",width:70,height:70,borderRadius:"50%",background:C.mesh2,filter:"blur(18px)",top:10,left:"calc(50% + 20px)"}}/>
          <div style={{position:"relative",width:80,height:80,borderRadius:24,background:C.gradLogo,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 16px 48px ${C.notchGlow}`,fontSize:38}}>🩺</div>
        </div>
        <div style={{fontWeight:800,fontSize:26,color:C.text1,letterSpacing:"-0.5px"}}>
          {mode==="reset"?"Reset Password":(<>GlucoRevive <span className="grad-text">AI</span></>)}
        </div>
        <div style={{color:C.text3,fontSize:13,marginTop:4}}>
          {mode==="login"&&"Welcome back! Sign in to continue your journey."}
          {mode==="signup"&&"Create your account — it's free to start."}
          {mode==="reset"&&"We'll send a reset link to your email."}
        </div>
      </div>

      {/* Tabs */}
      {mode!=="reset"&&(
        <div className="anim-fade-up d1" style={{padding:"18px 24px 0"}}>
          <div style={{display:"flex",background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:4}}>
            {[["login","Sign In"],["signup","Create Account"]].map(([v,l])=>(
              <button key={v} onClick={()=>setMode(v)} style={{
                flex:1,padding:"9px 0",borderRadius:9,border:"none",cursor:"pointer",
                fontFamily:"Inter,sans-serif",fontSize:13,fontWeight:600,
                background:mode===v?C.gradBtn:"transparent",
                color:mode===v?C.white:C.text3,
                transition:"all .2s",
                boxShadow:mode===v?`0 4px 12px ${C.accentBorder}`:"none",
              }}>{l}</button>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      <div style={{padding:"16px 24px 0",display:"flex",flexDirection:"column",gap:12}}>
        {mode==="reset"&&resetSent?(
          <div className="card anim-fade-up" style={{padding:16,textAlign:"center",borderColor:C.greenBorder,background:C.greenCard}}>
            <div style={{fontSize:32,marginBottom:8}}>📧</div>
            <div style={{color:C.green,fontWeight:600,fontSize:14}}>Reset link sent!</div>
            <div style={{color:C.text3,fontSize:12,marginTop:4}}>Check your inbox at {email||"your email"}.</div>
            <button onClick={()=>{setMode("login");setResetSent(false);}} style={{marginTop:12,background:"none",border:"none",color:C.p400,fontSize:13,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>← Back to Sign In</button>
          </div>
        ):(
          <>
            {mode==="signup"&&(
              <div className="anim-fade-up">
                <div style={{color:C.text2,fontSize:12,fontWeight:500,marginBottom:6}}>Full Name</div>
                <div style={{position:"relative"}}>
                  <input className="ds-input" placeholder="Aarav Sharma" value={name} onChange={e=>setName(e.target.value)}/>
                  <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",fontSize:16}}>👤</span>
                </div>
              </div>
            )}
            <div className="anim-fade-up d1">
              <div style={{color:C.text2,fontSize:12,fontWeight:500,marginBottom:6}}>Email Address</div>
              <div style={{position:"relative"}}>
                <input className="ds-input" type="email" placeholder="hello@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
                <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",fontSize:16}}>✉️</span>
              </div>
            </div>
            {mode!=="reset"&&(
              <div className="anim-fade-up d2">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{color:C.text2,fontSize:12,fontWeight:500}}>Password</div>
                  {mode==="login"&&<button onClick={()=>setMode("reset")} style={{background:"none",border:"none",color:C.p400,fontSize:12,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>Forgot password?</button>}
                </div>
                <div style={{position:"relative"}}>
                  <input className="ds-input" type={showPw?"text":"password"} placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} style={{paddingRight:48}}/>
                  <button onClick={()=>setShowPw(s=>!s)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:0,lineHeight:0}}>
                    <SvgIcon d={IC[showPw?"eyeOff":"eye"]} size={18} color={C.text3} sw={1.8}/>
                  </button>
                </div>
              </div>
            )}
            {mode==="signup"&&(
              <>
                <div className="anim-fade-up d3">
                  <div style={{color:C.text2,fontSize:12,fontWeight:500,marginBottom:6}}>Confirm Password</div>
                  <input className="ds-input" type="password" placeholder="••••••••"/>
                </div>
                <div className="anim-fade-up d4" style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:18,height:18,borderRadius:5,border:`1.5px solid ${C.p500}`,background:C.accentMid,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>
                    <SvgIcon d={IC.check} size={11} color={C.p400} sw={3}/>
                  </div>
                  <div style={{color:C.text3,fontSize:12,lineHeight:1.5}}>I agree to the <span style={{color:C.p400}}>Terms of Service</span> and <span style={{color:C.p400}}>Privacy Policy</span></div>
                </div>
              </>
            )}
            <button className="btn-primary anim-fade-up d3" onClick={()=>submit("email")} style={{marginTop:4}}>
              {loading==="email"?<><Spinner/>Please wait…</>:mode==="login"?"Sign In →":mode==="signup"?"Create Account →":"Send Reset Link →"}
            </button>
            {mode==="reset"&&<button onClick={()=>setMode("login")} style={{background:"none",border:"none",color:C.text3,fontSize:13,cursor:"pointer",fontFamily:"Inter,sans-serif",textAlign:"center",marginTop:4}}>← Back to Sign In</button>}
          </>
        )}
      </div>

      {/* Social auth */}
      {mode!=="reset"&&!resetSent&&(
        <div className="anim-fade-up d4" style={{padding:"14px 24px 0"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{flex:1,height:1,background:C.border}}/>
            <div style={{color:C.text3,fontSize:12}}>or continue with</div>
            <div style={{flex:1,height:1,background:C.border}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
            {[
              {id:"google",label:"Google",icon:(
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )},
              {id:"apple",label:"Apple",icon:(
                <svg width="16" height="18" viewBox="0 0 814 1000" fill={C.text1}>
                  <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.7-57.2-155.5-127.4C46.7 790.7 0 663 0 541.8c0-207.8 135.4-317.7 269-317.7 63.3 0 116.2 41.7 155.6 41.7 37.5 0 96.9-44.2 166.4-44.2zm-19.3-168.8c0 100.1-75.2 181-172.9 181-8.7 0-17.4-.6-26.1-2.5 1.9-96.5 73.7-175.5 173.5-175.5 8.4 0 16.4.7 25.5 2z"/>
                </svg>
              )},
            ].map(({id,label,icon})=>(
              <button key={id} onClick={()=>submit(id)} style={{
                display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                padding:"12px 0",borderRadius:12,border:`1px solid ${C.border}`,
                background:C.surface,cursor:"pointer",fontFamily:"Inter,sans-serif",
                fontSize:13,fontWeight:600,color:C.text1,transition:"all .2s",
              }}>
                {loading===id?<Spinner size={16} color={C.text1}/>:<>{icon}{label}</>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Guest */}
      {mode!=="reset"&&!resetSent&&(
        <div className="anim-fade-up d5" style={{padding:"14px 24px 32px",textAlign:"center",marginTop:"auto"}}>
          <button onClick={()=>submit("guest")} style={{
            display:"flex",alignItems:"center",justifyContent:"center",gap:6,
            width:"100%",padding:"12px 0",background:"none",
            border:`1px dashed ${C.border}`,borderRadius:12,cursor:"pointer",
            fontFamily:"Inter,sans-serif",color:C.text3,fontSize:13,transition:"all .2s",
          }}>
            {loading==="guest"?<Spinner size={14} color={C.text3}/>:<><span>👤</span> Continue as Guest — explore without signing up</>}
          </button>
          <div style={{color:C.text3,fontSize:11,marginTop:12}}>
            {mode==="login"
              ?<>No account? <button onClick={()=>setMode("signup")} style={{background:"none",border:"none",color:C.p400,cursor:"pointer",fontFamily:"Inter,sans-serif",fontSize:11}}>Create one free →</button></>
              :<>Have an account? <button onClick={()=>setMode("login")} style={{background:"none",border:"none",color:C.p400,cursor:"pointer",fontFamily:"Inter,sans-serif",fontSize:11}}>Sign in →</button></>
            }
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ONBOARDING
═══════════════════════════════════════════════════════════ */
function OnboardingScreen({onDone}){
  const C=useTheme();
  const[step,setStep]=useState(0);
  const[goals,setGoals]=useState([]);
  const total=5;
  const toggle=(id)=>setGoals(g=>g.includes(id)?g.filter(x=>x!==id):[...g,id]);

  const goalOpts=[
    {id:"reverse",icon:"🔁",label:"Reverse Prediabetes",desc:"Lower HbA1c naturally"},
    {id:"spikes", icon:"📉",label:"Reduce Sugar Spikes", desc:"Stabilise glucose levels"},
    {id:"weight", icon:"⚖️",label:"Lose Weight",        desc:"Reach healthy BMI"},
    {id:"energy", icon:"⚡",label:"Improve Energy",     desc:"No more fatigue & fog"},
    {id:"habits", icon:"🌱",label:"Build Healthy Habits",desc:"Daily lifestyle routines"},
  ];

  return(
    <div style={{
      position:"relative",width:"100%",minHeight:844,
      background:`radial-gradient(ellipse at 70% 10%,${C.mesh1} 0%,transparent 55%),${C.bg}`,
      display:"flex",flexDirection:"column",overflow:"hidden",
    }}>
      <MeshBg/>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"52px 24px 16px"}}>
        <div style={{display:"flex",gap:6}}>
          {Array.from({length:total}).map((_,i)=>(
            <div key={i} style={{height:4,width:i===step?24:8,borderRadius:2,background:i<=step?C.p500:C.ringTrack,transition:"all .3s"}}/>
          ))}
        </div>
        <button onClick={onDone} style={{background:"none",border:"none",cursor:"pointer",color:C.text3,fontSize:13,display:"flex",alignItems:"center",gap:4,fontFamily:"Inter,sans-serif"}}>
          Skip <SvgIcon d={IC.skip} size={14} color={C.text3} sw={1.8}/>
        </button>
      </div>

      <div style={{flex:1,padding:"0 24px",overflow:"auto"}}>
        {step===0&&(
          <div className="anim-fade-up" style={{display:"flex",flexDirection:"column",gap:20,paddingTop:10}}>
            <div className="anim-float" style={{textAlign:"center",fontSize:72,marginBottom:4}}>🩺</div>
            <div>
              <div style={{fontWeight:800,fontSize:28,color:C.text1,lineHeight:1.2,marginBottom:8}}>Welcome to<br/><span className="grad-text">GlucoRevive AI</span></div>
              <div style={{color:C.text2,fontSize:15,lineHeight:1.6}}>Your AI-powered companion to reverse early-stage Type 2 Diabetes through science-backed lifestyle coaching.</div>
            </div>
            {[
              {icon:"🧠",t:"AI-Powered Coaching",s:"Personalised plans based on your unique health data"},
              {icon:"📊",t:"Real-time Insights",  s:"Track glucose, meals, sleep & activity in one place"},
              {icon:"🥗",t:"Indian Diet Friendly", s:"Meal plans crafted for South Asian food preferences"},
            ].map((f,i)=>(
              <div key={i} className={`card anim-fade-up d${i+2}`} style={{padding:"14px 16px",display:"flex",gap:12,alignItems:"flex-start"}}>
                <span style={{fontSize:24}}>{f.icon}</span>
                <div>
                  <div style={{color:C.text1,fontWeight:600,fontSize:14}}>{f.t}</div>
                  <div style={{color:C.text3,fontSize:12,marginTop:2,lineHeight:1.4}}>{f.s}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {step===1&&(
          <div className="anim-fade-up" style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <div style={{fontWeight:800,fontSize:24,color:C.text1,marginBottom:6}}>Health Assessment</div>
              <div style={{color:C.text3,fontSize:13}}>Help us understand your health baseline</div>
            </div>
            {[
              {label:"Age",placeholder:"e.g. 38"},
              {label:"Weight (kg)",placeholder:"e.g. 82"},
              {label:"Height (cm)",placeholder:"e.g. 172"},
              {label:"HbA1c (%)",placeholder:"e.g. 6.2"},
              {label:"Fasting Sugar (mg/dL)",placeholder:"e.g. 108"},
            ].map((f,i)=>(
              <div key={i}>
                <div style={{color:C.text2,fontSize:13,fontWeight:500,marginBottom:6}}>{f.label}</div>
                <input className="ds-input" placeholder={f.placeholder}/>
              </div>
            ))}
            <div>
              <div style={{color:C.text2,fontSize:13,fontWeight:500,marginBottom:8}}>Activity Level</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {["Sedentary","Light","Moderate","Active"].map((l,i)=>(
                  <div key={i} className="sel-card" style={{textAlign:"center",fontSize:13,color:C.text2}}>{l}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step===2&&(
          <div className="anim-fade-up" style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <div style={{fontWeight:800,fontSize:24,color:C.text1,marginBottom:6}}>Your Health Goals</div>
              <div style={{color:C.text3,fontSize:13}}>Select all that apply — we'll personalise your plan</div>
            </div>
            {goalOpts.map((g,i)=>(
              <div key={g.id} className={`sel-card anim-fade-up d${i+1} ${goals.includes(g.id)?"selected":""}`} onClick={()=>toggle(g.id)}
                style={{display:"flex",alignItems:"center",gap:14}}>
                <span style={{fontSize:26}}>{g.icon}</span>
                <div style={{flex:1}}>
                  <div style={{color:C.text1,fontWeight:600,fontSize:14}}>{g.label}</div>
                  <div style={{color:C.text3,fontSize:12,marginTop:2}}>{g.desc}</div>
                </div>
                <div style={{width:22,height:22,borderRadius:6,border:`1.5px solid ${goals.includes(g.id)?C.p500:C.border}`,background:goals.includes(g.id)?C.p500:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {goals.includes(g.id)&&<SvgIcon d={IC.check} size={13} color={C.white} sw={3}/>}
                </div>
              </div>
            ))}
          </div>
        )}

        {step===3&&(
          <div className="anim-fade-up" style={{display:"flex",flexDirection:"column",gap:18,alignItems:"center"}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontWeight:800,fontSize:24,color:C.text1,marginBottom:6}}>AI Health Analysis</div>
              <div style={{color:C.text3,fontSize:13}}>Based on your inputs, here's your health profile</div>
            </div>
            <div className="anim-score">
              <CircleProgress pct={72} size={160} stroke={12} color={C.p500}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontWeight:800,fontSize:32,color:C.text1}}>72</div>
                  <div style={{color:C.text3,fontSize:11}}>Health Score</div>
                </div>
              </CircleProgress>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,width:"100%"}}>
              {[
                {label:"Diabetes Risk",   val:"Moderate",pct:55,color:C.orange,cls:"badge-orange"},
                {label:"Lifestyle Score", val:"Good",     pct:68,color:C.green, cls:"badge-green"},
                {label:"Glucose Control", val:"Fair",     pct:62,color:C.p400,  cls:"badge-purple"},
                {label:"Reversibility",   val:"High",     pct:80,color:C.green, cls:"badge-green"},
              ].map((s,i)=>(
                <div key={i} className={`card anim-fade-up d${i+1}`} style={{padding:14}}>
                  <div style={{color:C.text3,fontSize:11,marginBottom:8}}>{s.label}</div>
                  <div style={{fontWeight:700,fontSize:15,color:C.text1,marginBottom:8}}>{s.val}</div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{width:`${s.pct}%`,background:`linear-gradient(90deg,${s.color}88,${s.color})`}}/>
                  </div>
                </div>
              ))}
            </div>
            <div className="card" style={{padding:"14px 16px",width:"100%",borderColor:C.greenBorder,background:C.greenCard}}>
              <div style={{color:C.green,fontWeight:600,fontSize:13,marginBottom:6}}>🤖 AI Insight</div>
              <div style={{color:C.text2,fontSize:13,lineHeight:1.5}}>Your HbA1c of 6.2% and moderate activity level suggest early prediabetes. <strong style={{color:C.text1}}>With consistent lifestyle changes, reversal is highly achievable within 3–6 months.</strong></div>
            </div>
          </div>
        )}

        {step===4&&(
          <div className="anim-fade-up" style={{display:"flex",flexDirection:"column",gap:16}}>
            <div>
              <div style={{fontWeight:800,fontSize:24,color:C.text1,marginBottom:6}}>Your Personalised Plan</div>
              <div style={{color:C.text3,fontSize:13}}>Designed by AI for your goals and lifestyle</div>
            </div>
            {[
              {icon:"🥗",label:"Daily Meal Goals",  desc:"3 balanced meals + 1 snack · Low GI focus", color:C.green},
              {icon:"💧",label:"Water Intake",       desc:"2.5–3 litres per day",                      color:C.cyan},
              {icon:"🚶",label:"Daily Walking",      desc:"8,000–10,000 steps · 30 min brisk walk",    color:C.p400},
              {icon:"😴",label:"Sleep Quality",      desc:"7–8 hours · Sleep before 11 PM",            color:C.orange},
              {icon:"📅",label:"Weekly Targets",     desc:"HbA1c check · Weight · Sugar logs",         color:C.p500},
            ].map((item,i)=>(
              <div key={i} className={`card anim-fade-up d${i+1}`} style={{padding:"14px 16px",display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:44,height:44,borderRadius:12,background:`${item.color}22`,border:`1px solid ${item.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{item.icon}</div>
                <div style={{flex:1}}>
                  <div style={{color:C.text1,fontWeight:600,fontSize:14}}>{item.label}</div>
                  <div style={{color:C.text3,fontSize:12,marginTop:2}}>{item.desc}</div>
                </div>
                <div style={{width:8,height:8,borderRadius:"50%",background:item.color,boxShadow:`0 0 8px ${item.color}`}}/>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{padding:"16px 24px 36px",display:"flex",flexDirection:"column",gap:10}}>
        {step<total-1
          ?<button className="btn-primary" onClick={()=>setStep(s=>s+1)}>{step===0?"Get Started":"Continue"} <SvgIcon d={IC.right} size={16} color={C.white} sw={2}/></button>
          :<><button className="btn-primary" onClick={onDone}>🚀 Start My Journey</button><button className="btn-ghost" onClick={onDone}>Complete Later</button></>
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOME DASHBOARD
═══════════════════════════════════════════════════════════ */
function HomeScreen({setTab}){
  const C=useTheme();
  return(
    <div className="screen" style={{background:`radial-gradient(ellipse at 80% 0%,${C.mesh1} 0%,transparent 50%),${C.bg}`,position:"relative"}}>
      <MeshBg/>

      {/* Header */}
      <div className="anim-fade-up" style={{padding:"52px 24px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{color:C.text3,fontSize:13}}>Good morning 👋</div>
          <div style={{color:C.text1,fontWeight:700,fontSize:22,marginTop:2}}>Aarav Sharma</div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{position:"relative"}}>
            <div style={{width:40,height:40,borderRadius:12,background:C.surface,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
              <Icon name="bell" size={18}/>
            </div>
            <div style={{position:"absolute",top:8,right:8,width:8,height:8,borderRadius:"50%",background:C.orange,border:`2px solid ${C.bg}`}}/>
          </div>
          <div style={{width:40,height:40,borderRadius:12,background:C.gradLogo,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color:C.white,cursor:"pointer"}}>AS</div>
        </div>
      </div>

      {/* Glucose hero */}
      <div style={{padding:"20px 24px 0"}}>
        <div className="anim-fade-up d1 card" style={{padding:20,background:C.gradHeroCard,borderColor:C.gradHeroBorder,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:C.accentMid,filter:"blur(30px)"}}/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{color:C.text3,fontSize:12,marginBottom:4}}>Today's Glucose Score</div>
              <div style={{color:C.text1,fontWeight:800,fontSize:42,lineHeight:1}}>93 <span style={{fontSize:16,fontWeight:500,color:C.text3}}>mg/dL</span></div>
              <div style={{marginTop:8,display:"flex",gap:6,alignItems:"center"}}>
                <span className="badge badge-green">✓ Normal Range</span>
                <span style={{color:C.text3,fontSize:12}}>Fasting</span>
              </div>
            </div>
            <CircleProgress pct={78} size={90} stroke={8} color={C.green}>
              <div style={{textAlign:"center"}}>
                <div style={{fontWeight:700,fontSize:16,color:C.text1}}>78</div>
                <div style={{color:C.text3,fontSize:9}}>Score</div>
              </div>
            </CircleProgress>
          </div>
          <div style={{marginTop:16,height:40}}>
            <ResponsiveContainer width="100%" height={40}>
              <AreaChart data={glucoseData.slice(-5)} margin={{top:0,right:0,bottom:0,left:0}}>
                <defs>
                  <linearGradient id="gHero" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.green} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={C.green} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="fg" stroke={C.green} strokeWidth={2} fill="url(#gHero)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick metrics */}
      <div style={{padding:"16px 24px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[
            {icon:"💧",label:"Water",val:"1.8L",max:"3L",  pct:60,color:C.cyan},
            {icon:"🚶",label:"Steps",val:"6.4k",max:"10k", pct:64,color:C.p500},
            {icon:"🔥",label:"Cals", val:"1,240",max:"1,800",pct:69,color:C.orange},
          ].map((m,i)=>(
            <div key={i} className={`card anim-fade-up d${i+2}`} style={{padding:"14px 10px",textAlign:"center"}}>
              <div style={{fontSize:22}}>{m.icon}</div>
              <div style={{color:C.text1,fontWeight:700,fontSize:15,marginTop:4}}>{m.val}</div>
              <div style={{color:C.text3,fontSize:10,marginBottom:6}}>of {m.max}</div>
              <div className="progress-track"><div className="progress-fill" style={{width:`${m.pct}%`,background:m.color}}/></div>
            </div>
          ))}
        </div>
      </div>

      {/* Habits */}
      <div style={{padding:"20px 24px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{color:C.text1,fontWeight:700,fontSize:16}}>Today's Habits</div>
          <span className="badge badge-purple">Day 12 🔥</span>
        </div>
        <div style={{display:"flex",gap:20,justifyContent:"space-between"}}>
          {[
            {icon:"🚶",label:"Walking", val:6420,max:10000,unit:"steps",pct:64,color:C.p500},
            {icon:"💧",label:"Water",   val:1.8, max:3,    unit:"L",   pct:60,color:C.cyan},
            {icon:"😴",label:"Sleep",   val:7.2, max:8,    unit:"hrs", pct:90,color:C.orange},
            {icon:"🧘",label:"Exercise",val:25,  max:45,   unit:"min", pct:56,color:C.green},
          ].map((h,i)=><HabitRing key={i} {...h}/>)}
        </div>
      </div>

      {/* Weekly chart */}
      <div style={{padding:"20px 24px 0"}}>
        <div className="card anim-fade-up d3" style={{padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{color:C.text1,fontWeight:700,fontSize:15}}>Weekly Glucose</div>
            <span className="badge badge-green">↓ Improving</span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={glucoseData} margin={{top:4,right:4,bottom:0,left:-20}}>
              <XAxis dataKey="day" tick={{fill:C.text3,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.text3,fontSize:10}} axisLine={false} tickLine={false} domain={[70,170]}/>
              <Tooltip contentStyle={{background:C.bgAlt,border:`1px solid ${C.border}`,borderRadius:12,fontSize:12,color:C.text1}}/>
              <Line type="monotone" dataKey="fg" stroke={C.green} strokeWidth={2.5} dot={{fill:C.green,r:3}} name="Fasting"/>
              <Line type="monotone" dataKey="pp" stroke={C.p400} strokeWidth={2} dot={false} strokeDasharray="4 2" name="Post-meal"/>
            </LineChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:16,marginTop:8}}>
            <div style={{display:"flex",gap:6,alignItems:"center"}}><div style={{width:12,height:3,borderRadius:2,background:C.green}}/><span style={{color:C.text3,fontSize:11}}>Fasting</span></div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}><div style={{width:12,height:3,borderRadius:2,background:C.p400}}/><span style={{color:C.text3,fontSize:11}}>Post-meal</span></div>
          </div>
        </div>
      </div>

      {/* AI recommendation */}
      <div style={{padding:"16px 24px 0"}}>
        <div className="card anim-fade-up d4" style={{padding:16,borderColor:C.accentBorder,background:C.accentSubtle,cursor:"pointer"}} onClick={()=>setTab("coach")}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:36,height:36,borderRadius:10,background:C.gradLogo,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🤖</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <div style={{color:C.text1,fontWeight:600,fontSize:13}}>AI Recommendation</div>
                <span className="badge badge-purple">New</span>
              </div>
              <div style={{color:C.text2,fontSize:12,lineHeight:1.5}}>Your post-meal glucose was elevated yesterday. Try a 15-min walk after lunch today. Tap to ask your coach for more tips.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivation */}
      <div style={{padding:"16px 24px 24px"}}>
        <div className="card" style={{padding:16,textAlign:"center",borderColor:C.greenBorder,background:C.greenCard}}>
          <div style={{fontSize:24,marginBottom:6}}>🌟</div>
          <div style={{color:C.text1,fontWeight:600,fontSize:14}}>You're doing amazing!</div>
          <div style={{color:C.text3,fontSize:12,marginTop:4}}>12-day streak • HbA1c dropped 0.3% this month • Keep it up!</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AI COACH CHAT
═══════════════════════════════════════════════════════════ */
function AICoachScreen(){
  const C=useTheme();
  const[msgs,setMsgs]=useState(chatHistory);
  const[input,setInput]=useState("");
  const[typing,setTyping]=useState(false);
  const bottomRef=useRef();

  const prompts=["Can I eat rice? 🍚","Create Indian meal plan 🥗","Why is my sugar high? 📈","Suggest diabetic breakfast ☀️"];

  const send=(text)=>{
    const t=text||input;
    if(!t.trim())return;
    const time=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    setMsgs(m=>[...m,{role:"user",text:t,time}]);
    setInput("");setTyping(true);
    setTimeout(()=>{
      setTyping(false);
      setMsgs(m=>[...m,{role:"ai",text:"Great question! Based on your glucose trends and goals:\n\n✅ Choose low-GI options\n💪 Pair carbs with protein\n🚶 Short walk after meals\n\nThis will help stabilise your post-meal glucose effectively.",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);
      setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),100);
    },1800);
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),100);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",flex:1,background:C.bg,position:"relative",overflow:"hidden",minHeight:0}}>
      <MeshBg/>
      {/* Chat header */}
      <div style={{padding:"52px 24px 16px",background:C.chatHeaderBg,backdropFilter:"blur(20px)",borderBottom:`1px solid ${C.border}`,zIndex:10,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:14,background:C.gradLogo,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,position:"relative"}}>
            🤖
            <div style={{position:"absolute",bottom:0,right:0,width:12,height:12,borderRadius:"50%",background:C.green,border:`2px solid ${C.bg}`}}/>
          </div>
          <div>
            <div style={{color:C.text1,fontWeight:700,fontSize:16}}>GlucoRevive Coach</div>
            <div style={{color:C.green,fontSize:12,display:"flex",alignItems:"center",gap:4}}>
              <div className="glow-dot" style={{width:6,height:6}}/> Online · Ready to help
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px",display:"flex",flexDirection:"column",gap:14}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start",gap:4}}>
            {m.role==="ai"&&<div style={{width:24,height:24,borderRadius:8,background:C.gradLogo,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🤖</div>}
            <div className={m.role==="ai"?"chat-ai":"chat-user"} style={{whiteSpace:"pre-wrap"}}>{m.text}</div>
            <div style={{color:C.text3,fontSize:10,marginTop:2}}>{m.time}</div>
          </div>
        ))}
        {typing&&(
          <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
            <div style={{width:24,height:24,borderRadius:8,background:C.gradLogo,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🤖</div>
            <div className="chat-ai" style={{display:"flex",gap:4,padding:"14px 16px"}}>
              {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.p400,animation:`blink 1s ${i*0.2}s step-end infinite`}}/>)}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Suggested prompts */}
      <div style={{padding:"0 20px 8px",overflowX:"auto",flexShrink:0}}>
        <div style={{display:"flex",gap:8}}>
          {prompts.map((p,i)=>(
            <button key={i} onClick={()=>send(p)} style={{
              background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,
              padding:"8px 14px",color:C.text2,fontSize:12,fontWeight:500,
              cursor:"pointer",whiteSpace:"nowrap",fontFamily:"Inter,sans-serif",transition:"all .2s",
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div style={{padding:"8px 20px 24px",background:C.chatInputBg,borderTop:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"center",flexShrink:0}}>
        <button style={{width:40,height:40,borderRadius:12,background:C.surface,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <Icon name="mic" size={18}/>
        </button>
        <input className="ds-input" style={{flex:1}} placeholder="Ask your AI coach…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
        <button onClick={()=>send()} style={{width:40,height:40,borderRadius:12,background:C.gradBtn,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:`0 4px 16px ${C.accentBorder}`}}>
          <SvgIcon d={IC.send} size={16} color={C.white} sw={2}/>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MEAL SCANNER
═══════════════════════════════════════════════════════════ */
function MealScreen(){
  const C=useTheme();
  const[scanned,setScanned]=useState(false);
  const[scanning,setScanning]=useState(false);
  const scan=()=>{setScanning(true);setTimeout(()=>{setScanning(false);setScanned(true);},2000);};

  return(
    <div className="screen" style={{background:C.bg,position:"relative"}}>
      <MeshBg colors={[C.greenCard,C.accentSubtle,C.mesh2]}/>
      <div style={{padding:"52px 24px 0"}}>
        <div style={{fontWeight:800,fontSize:24,color:C.text1}}>Meal Scanner</div>
        <div style={{color:C.text3,fontSize:13,marginTop:4}}>AI-powered nutrition analysis</div>
      </div>

      {!scanned?(
        <div style={{padding:"24px 24px 0",display:"flex",flexDirection:"column",gap:16}}>
          <div className="card" style={{padding:0,overflow:"hidden",borderColor:C.accentBorder,aspectRatio:"1/0.75",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",background:C.accentSubtle}}>
            {scanning?(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
                <Spinner size={48} color={C.p500}/>
                <div style={{color:C.text2,fontSize:14}}>Analysing meal…</div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:24}}>
                <div style={{fontSize:64}}>🍽️</div>
                <div style={{color:C.text2,fontSize:14,textAlign:"center"}}>Point camera at your meal or<br/>upload a photo</div>
                {[["0","0","bl"],["0","auto","br"],["auto","0","tl"],["auto","auto","tr"]].map(([t,r,k])=>(
                  <div key={k} style={{position:"absolute",top:t!=="auto"?16:"auto",right:r!=="auto"?16:"auto",bottom:t==="auto"?16:"auto",left:r==="auto"?16:"auto",width:24,height:24,borderTop:k.startsWith("t")?`2px solid ${C.p500}`:"none",borderBottom:k.startsWith("b")?`2px solid ${C.p500}`:"none",borderLeft:k.endsWith("l")?`2px solid ${C.p500}`:"none",borderRight:k.endsWith("r")?`2px solid ${C.p500}`:"none"}}/>
                ))}
              </div>
            )}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <button className="btn-primary" onClick={scan}><Icon name="camera" size={18} color={C.white}/> Camera</button>
            <button className="btn-ghost" onClick={scan}><Icon name="upload" size={18}/> Upload</button>
          </div>
          <div style={{color:C.text1,fontWeight:700,fontSize:15,marginTop:4}}>Recent Scans</div>
          {[
            {name:"Dal Makhani + Rice",time:"Yesterday 1:30 PM",score:62,good:false},
            {name:"Moong Dal Cheela",  time:"Yesterday 8:00 AM",score:85,good:true},
          ].map((m,i)=>(
            <div key={i} className="card" style={{padding:"14px 16px",display:"flex",gap:12,alignItems:"center"}}>
              <div style={{fontSize:32}}>🥘</div>
              <div style={{flex:1}}>
                <div style={{color:C.text1,fontWeight:600,fontSize:13}}>{m.name}</div>
                <div style={{color:C.text3,fontSize:11,marginTop:2}}>{m.time}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontWeight:700,fontSize:18,color:m.good?C.green:C.orange}}>{m.score}</div>
                <span className={`badge ${m.good?"badge-green":"badge-orange"}`} style={{fontSize:10}}>{m.good?"Excellent":"Moderate"}</span>
              </div>
            </div>
          ))}
        </div>
      ):(
        <div style={{padding:"20px 24px 0",display:"flex",flexDirection:"column",gap:14}}>
          <div className="card anim-fade-up" style={{padding:20,borderColor:C.orangeBorder,background:C.orangeCard}}>
            <div style={{display:"flex",gap:14,alignItems:"center"}}>
              <span style={{fontSize:48}}>🍛</span>
              <div>
                <div style={{color:C.text1,fontWeight:700,fontSize:18}}>Dal Makhani + Naan</div>
                <span className="badge badge-orange">⚠️ Moderate GI</span>
              </div>
              <div style={{marginLeft:"auto",textAlign:"right"}}>
                <div style={{fontWeight:800,fontSize:28,color:C.orange}}>58</div>
                <div style={{color:C.text3,fontSize:11}}>Health Score</div>
              </div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {[
              {label:"Calories",val:"486",unit:"kcal",color:C.orange},
              {label:"Carbs",   val:"68", unit:"g",   color:C.p400},
              {label:"Protein", val:"18", unit:"g",   color:C.green},
              {label:"Fat",     val:"14", unit:"g",   color:C.cyan},
              {label:"Fiber",   val:"6",  unit:"g",   color:C.green},
              {label:"Sugar",   val:"8",  unit:"g",   color:C.red},
            ].map((m,i)=>(
              <div key={i} className="metric-chip anim-fade-up" style={{animationDelay:`${i*.06}s`}}>
                <div style={{color:m.color,fontWeight:700,fontSize:18}}>{m.val}<span style={{fontSize:11,color:C.text3}}>{m.unit}</span></div>
                <div style={{color:C.text3,fontSize:11}}>{m.label}</div>
              </div>
            ))}
          </div>
          <div className="card anim-fade-up" style={{padding:"14px 16px",borderColor:C.redBorder,background:C.redCard}}>
            <div style={{color:C.red,fontWeight:600,fontSize:13,marginBottom:4}}>🔺 Sugar Spike Risk</div>
            <div style={{color:C.text2,fontSize:13,lineHeight:1.5}}>Naan has high GI (~85). Estimated post-meal glucose: <strong style={{color:C.red}}>158–172 mg/dL</strong>. Consider a 15-min walk after eating.</div>
          </div>
          <div style={{color:C.text1,fontWeight:700,fontSize:15}}>Better Alternatives</div>
          {[
            {name:"Dal Makhani + Brown Rice",score:72,icon:"🍚"},
            {name:"Dal + 1 Multigrain Roti", score:80,icon:"🫓"},
            {name:"Dal + Cauliflower Rice",  score:88,icon:"🥦"},
          ].map((alt,i)=>(
            <div key={i} className="card anim-fade-up" style={{padding:"12px 16px",display:"flex",gap:12,alignItems:"center"}}>
              <span style={{fontSize:28}}>{alt.icon}</span>
              <div style={{flex:1,color:C.text1,fontSize:13,fontWeight:500}}>{alt.name}</div>
              <div style={{fontWeight:700,fontSize:16,color:C.green}}>{alt.score}</div>
            </div>
          ))}
          <button className="btn-ghost" onClick={()=>setScanned(false)}>← Scan Another Meal</button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROGRESS SCREEN
═══════════════════════════════════════════════════════════ */
function ProgressScreen(){
  const C=useTheme();
  const[view,setView]=useState("glucose");
  return(
    <div className="screen" style={{background:C.bg,position:"relative"}}>
      <MeshBg colors={[C.mesh2,C.accentSubtle,C.greenCard]}/>
      <div style={{padding:"52px 24px 0"}}>
        <div style={{fontWeight:800,fontSize:24,color:C.text1}}>Progress</div>
        <div style={{color:C.text3,fontSize:13,marginTop:4}}>Your health journey so far</div>
      </div>
      <div style={{padding:"16px 24px 0"}}>
        <div style={{display:"flex",gap:6,background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:4}}>
          {[["glucose","🩸 Glucose"],["weight","⚖️ Weight"],["hba1c","🧪 HbA1c"]].map(([v,l])=>(
            <button key={v} onClick={()=>setView(v)} style={{
              flex:1,padding:"8px 0",borderRadius:9,border:"none",cursor:"pointer",
              fontFamily:"Inter,sans-serif",fontSize:12,fontWeight:600,
              background:view===v?C.gradBtn:"transparent",
              color:view===v?C.white:C.text3,transition:"all .2s",
              boxShadow:view===v?`0 4px 12px ${C.accentBorder}`:"none",
            }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"16px 24px 0"}}>
        <div className="card anim-fade-up" style={{padding:20}}>
          {view==="glucose"&&(
            <>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                <div><div style={{color:C.text1,fontWeight:700,fontSize:15}}>Glucose Trends</div><div style={{color:C.text3,fontSize:12}}>This week</div></div>
                <div style={{textAlign:"right"}}><div style={{fontWeight:800,fontSize:22,color:C.text1}}>93 <span style={{fontSize:13,color:C.text3}}>mg/dL</span></div><span className="badge badge-green">Normal ✓</span></div>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={glucoseData} margin={{top:4,right:4,bottom:0,left:-20}}>
                  <defs>
                    <linearGradient id="gFG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={0.3}/><stop offset="95%" stopColor={C.green} stopOpacity={0}/></linearGradient>
                    <linearGradient id="gPP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.p400} stopOpacity={0.3}/><stop offset="95%" stopColor={C.p400} stopOpacity={0}/></linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{fill:C.text3,fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.text3,fontSize:10}} axisLine={false} tickLine={false} domain={[70,180]}/>
                  <Tooltip contentStyle={{background:C.bgAlt,border:`1px solid ${C.border}`,borderRadius:12,fontSize:12,color:C.text1}}/>
                  <Area type="monotone" dataKey="fg" stroke={C.green} strokeWidth={2} fill="url(#gFG)" name="Fasting" dot={{fill:C.green,r:3}}/>
                  <Area type="monotone" dataKey="pp" stroke={C.p400} strokeWidth={1.5} fill="url(#gPP)" name="Post-meal" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </>
          )}
          {view==="weight"&&(
            <>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                <div><div style={{color:C.text1,fontWeight:700,fontSize:15}}>Weight Journey</div><div style={{color:C.text3,fontSize:12}}>Last 6 weeks</div></div>
                <div style={{textAlign:"right"}}><div style={{fontWeight:800,fontSize:22,color:C.text1}}>80.4 <span style={{fontSize:13,color:C.text3}}>kg</span></div><span className="badge badge-green">↓ 3.6 kg lost</span></div>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={weightData} margin={{top:4,right:4,bottom:0,left:-20}}>
                  <defs><linearGradient id="gW" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.cyan} stopOpacity={0.3}/><stop offset="95%" stopColor={C.cyan} stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="week" tick={{fill:C.text3,fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.text3,fontSize:10}} axisLine={false} tickLine={false} domain={[78,86]}/>
                  <Tooltip contentStyle={{background:C.bgAlt,border:`1px solid ${C.border}`,borderRadius:12,fontSize:12,color:C.text1}}/>
                  <Area type="monotone" dataKey="w" stroke={C.cyan} strokeWidth={2.5} fill="url(#gW)" name="Weight (kg)" dot={{fill:C.cyan,r:3}}/>
                </AreaChart>
              </ResponsiveContainer>
            </>
          )}
          {view==="hba1c"&&(
            <>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                <div><div style={{color:C.text1,fontWeight:700,fontSize:15}}>HbA1c Progress</div><div style={{color:C.text3,fontSize:12}}>Jan – May 2026</div></div>
                <div style={{textAlign:"right"}}><div style={{fontWeight:800,fontSize:22,color:C.text1}}>5.7<span style={{fontSize:13,color:C.text3}}>%</span></div><span className="badge badge-green">↓ 0.7% improved</span></div>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={hba1cData} margin={{top:4,right:4,bottom:0,left:-20}}>
                  <XAxis dataKey="mo" tick={{fill:C.text3,fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.text3,fontSize:10}} axisLine={false} tickLine={false} domain={[5,7]}/>
                  <Tooltip contentStyle={{background:C.bgAlt,border:`1px solid ${C.border}`,borderRadius:12,fontSize:12,color:C.text1}}/>
                  <Bar dataKey="v" fill={C.p500} radius={[6,6,0,0]} name="HbA1c %"/>
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>
      <div style={{padding:"16px 24px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[
            {icon:"🩸",label:"Avg Fasting",   val:"93 mg/dL",  sub:"↓ 12 from last week",color:C.green},
            {icon:"🍽️",label:"Post-meal Avg", val:"136 mg/dL", sub:"↓ 8 from last week", color:C.p400},
            {icon:"⚖️",label:"Weight Loss",   val:"3.6 kg",    sub:"In 6 weeks",          color:C.cyan},
            {icon:"🧪",label:"HbA1c Change",  val:"−0.7%",     sub:"6.4% → 5.7%",         color:C.green},
          ].map((s,i)=>(
            <div key={i} className="card anim-fade-up" style={{padding:16}}>
              <div style={{fontSize:22,marginBottom:8}}>{s.icon}</div>
              <div style={{color:C.text3,fontSize:11}}>{s.label}</div>
              <div style={{color:s.color,fontWeight:700,fontSize:20,marginTop:2}}>{s.val}</div>
              <div style={{color:C.text3,fontSize:11,marginTop:2}}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"16px 24px 24px"}}>
        <div style={{color:C.text1,fontWeight:700,fontSize:15,marginBottom:12}}>Milestones 🏆</div>
        {[
          {icon:"🥇",label:"First 5 kg lost",          date:"March 2026",        done:true},
          {icon:"🩺",label:"HbA1c below 6.0%",         date:"April 2026",        done:true},
          {icon:"🔥",label:"30-day streak",             date:"In progress",       done:false},
          {icon:"🎯",label:"Reach normal HbA1c (<5.7%)",date:"Est. June 2026",   done:false},
        ].map((m,i)=>(
          <div key={i} className="card" style={{padding:"12px 16px",display:"flex",gap:12,alignItems:"center",opacity:m.done?1:.6,marginBottom:10}}>
            <span style={{fontSize:24}}>{m.icon}</span>
            <div style={{flex:1}}>
              <div style={{color:C.text1,fontSize:13,fontWeight:600}}>{m.label}</div>
              <div style={{color:C.text3,fontSize:11,marginTop:2}}>{m.date}</div>
            </div>
            {m.done&&<div style={{width:22,height:22,borderRadius:6,background:C.green,display:"flex",alignItems:"center",justifyContent:"center"}}><SvgIcon d={IC.check} size={13} color={C.white} sw={3}/></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROFILE SCREEN — fully interactive, all colours from C.*
═══════════════════════════════════════════════════════════ */
function ProfileScreen({onSignOut,onCompleteProfile}){
  const C          = useTheme();
  const isDark     = useIsDark();
  const setIsDark  = useSetIsDark();

  const[notifs,      setNotifs]      = useState(true);
  const[cgm,         setCgm]         = useState(false);
  const[apple,       setApple]       = useState(true);
  const[google,      setGoogle]      = useState(true);
  const[weightUnit,  setWeightUnit]  = useState("kg");
  const[glucUnit,    setGlucUnit]    = useState("mg/dL");
  const[lang,        setLang]        = useState("English");
  const[shareAnon,   setShareAnon]   = useState(true);
  const[analytics,   setAnalytics]   = useState(true);
  const[crash,       setCrash]       = useState(true);
  const[nGlucose,    setNGlucose]    = useState(true);
  const[nMeal,       setNMeal]       = useState(true);
  const[nHabit,      setNHabit]      = useState(false);
  const[nWeekly,     setNWeekly]     = useState(true);
  const[modal,       setModal]       = useState(null);
  const[cgmStep,     setCgmStep]     = useState(0);

  const openModal  = (m) => setModal(m);
  const closeModal = ()  => setModal(null);

  const handleCgmToggle = (e) => {
    e.stopPropagation();
    if(cgm){setCgm(false);setCgmStep(0);}
    else{setCgmStep(0);openModal("cgm");}
  };

  const modalTitle={
    units:"Units",language:"Language",subscription:"Subscription",
    privacy:"Privacy Settings",notifications:"Notifications",
    apple:"Apple Health",google:"Google Fit",cgm:"CGM Device Setup",signout:"Sign Out",
  }[modal]||"";

  const renderSheet=()=>{
    if(!modal)return null;

    if(modal==="units")return(
      <div style={{padding:"16px 24px 32px"}}>
        <p style={{color:C.text3,fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>Weight</p>
        {["kg","lbs"].map(u=>(
          <div key={u} onClick={()=>setWeightUnit(u)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"15px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
            <span style={{color:C.text1,fontSize:15}}>{u}</span>
            {weightUnit===u&&<div style={{width:22,height:22,borderRadius:6,background:C.p500,display:"flex",alignItems:"center",justifyContent:"center"}}><SvgIcon d={IC.check} size={13} color={C.white} sw={3}/></div>}
          </div>
        ))}
        <p style={{color:C.text3,fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",margin:"16px 0 10px"}}>Blood Glucose</p>
        {["mg/dL","mmol/L"].map(u=>(
          <div key={u} onClick={()=>setGlucUnit(u)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"15px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
            <span style={{color:C.text1,fontSize:15}}>{u}</span>
            {glucUnit===u&&<div style={{width:22,height:22,borderRadius:6,background:C.p500,display:"flex",alignItems:"center",justifyContent:"center"}}><SvgIcon d={IC.check} size={13} color={C.white} sw={3}/></div>}
          </div>
        ))}
        <button className="btn-primary" onClick={closeModal} style={{marginTop:20}}>Save Changes</button>
      </div>
    );

    if(modal==="language"){
      const langs=[
        {l:"English",n:"English",   f:"🇬🇧"},
        {l:"Hindi",  n:"हिन्दी",    f:"🇮🇳"},
        {l:"Tamil",  n:"தமிழ்",     f:"🇮🇳"},
        {l:"Telugu", n:"తెలుగు",    f:"🇮🇳"},
        {l:"Marathi",n:"मराठी",     f:"🇮🇳"},
        {l:"Arabic", n:"العربية",   f:"🇸🇦"},
      ];
      return(
        <div style={{padding:"16px 24px 32px"}}>
          {langs.map(({l,n,f})=>(
            <div key={l} onClick={()=>setLang(l)} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
              <span style={{fontSize:24}}>{f}</span>
              <div style={{flex:1}}>
                <div style={{color:C.text1,fontSize:14,fontWeight:500}}>{l}</div>
                <div style={{color:C.text3,fontSize:12}}>{n}</div>
              </div>
              {lang===l&&<div style={{width:22,height:22,borderRadius:6,background:C.p500,display:"flex",alignItems:"center",justifyContent:"center"}}><SvgIcon d={IC.check} size={13} color={C.white} sw={3}/></div>}
            </div>
          ))}
          <button className="btn-primary" onClick={closeModal} style={{marginTop:20}}>Apply Language</button>
        </div>
      );
    }

    if(modal==="subscription")return(
      <div style={{padding:"16px 24px 32px"}}>
        <div className="card" style={{padding:20,background:C.subCard,borderColor:C.subCardBorder,textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:36,marginBottom:8}}>💎</div>
          <div style={{fontWeight:800,fontSize:20,color:C.text1}}>Pro Plan</div>
          <div style={{color:C.text3,fontSize:13,marginTop:4}}>₹499/month · Renews Jun 9, 2026</div>
          <span className="badge badge-purple" style={{marginTop:10,display:"inline-flex"}}>✓ Active</span>
        </div>
        <div style={{color:C.text2,fontWeight:600,fontSize:13,marginBottom:10}}>What's included</div>
        {["Unlimited AI Coach messages","Full glucose analytics & insights","Advanced meal scanning","Personalised meal plans","CGM device integration","Priority support"].map((f,i)=>(
          <div key={i} style={{display:"flex",gap:10,alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:20,height:20,borderRadius:6,background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><SvgIcon d={IC.check} size={12} color={C.green} sw={3}/></div>
            <span style={{color:C.text1,fontSize:13}}>{f}</span>
          </div>
        ))}
        <button className="btn-ghost" style={{marginTop:20,color:C.red,borderColor:C.redBorder}} onClick={closeModal}>Cancel Subscription</button>
      </div>
    );

    if(modal==="privacy")return(
      <div style={{padding:"16px 24px 32px"}}>
        <div style={{color:C.text3,fontSize:13,lineHeight:1.6,marginBottom:16}}>Control how your health data is used. We never sell personal data to third parties.</div>
        {[
          {label:"Anonymous usage analytics",sub:"Help improve the app with anonymised data",on:analytics,setOn:setAnalytics},
          {label:"Crash & error reports",    sub:"Auto-send crash logs to fix bugs faster",  on:crash,    setOn:setCrash},
          {label:"Share anonymised research",sub:"Contribute to diabetes research (no PII)", on:shareAnon,setOn:setShareAnon},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"14px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{flex:1}}>
              <div style={{color:C.text1,fontSize:14,fontWeight:500}}>{item.label}</div>
              <div style={{color:C.text3,fontSize:12,marginTop:3,lineHeight:1.4}}>{item.sub}</div>
            </div>
            <ToggleSwitch on={item.on} setOn={item.setOn}/>
          </div>
        ))}
        <div style={{marginTop:16,padding:"12px 14px",background:C.greenCard,border:`1px solid ${C.greenBorder}`,borderRadius:12}}>
          <div style={{color:C.green,fontWeight:600,fontSize:12,marginBottom:4}}>🔒 Data Security</div>
          <div style={{color:C.text3,fontSize:12,lineHeight:1.5}}>All health data encrypted with AES-256. Stored on HIPAA-compliant servers. Delete your account and all data anytime.</div>
        </div>
        <button className="btn-ghost" style={{marginTop:16,color:C.red,borderColor:C.redBorder}} onClick={closeModal}>Request Data Deletion</button>
      </div>
    );

    if(modal==="notifications")return(
      <div style={{padding:"16px 24px 32px"}}>
        {[
          {icon:"🩸",label:"Glucose Alerts", sub:"High/low sugar warnings",       on:nGlucose,setOn:setNGlucose},
          {icon:"🍽️",label:"Meal Reminders", sub:"Log meals & scan food",          on:nMeal,   setOn:setNMeal},
          {icon:"🏃",label:"Habit Check-ins", sub:"Daily habit & water reminders",  on:nHabit,  setOn:setNHabit},
          {icon:"📊",label:"Weekly Reports",  sub:"Progress summary every Monday",  on:nWeekly, setOn:setNWeekly},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"center",padding:"14px 0",borderBottom:`1px solid ${C.border}`}}>
            <span style={{fontSize:22}}>{item.icon}</span>
            <div style={{flex:1}}>
              <div style={{color:C.text1,fontSize:14,fontWeight:500}}>{item.label}</div>
              <div style={{color:C.text3,fontSize:12,marginTop:2}}>{item.sub}</div>
            </div>
            <ToggleSwitch on={item.on} setOn={item.setOn}/>
          </div>
        ))}
        <button className="btn-primary" onClick={closeModal} style={{marginTop:20}}>Save Preferences</button>
      </div>
    );

    if(modal==="apple")return(
      <div style={{padding:"16px 24px 32px"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:52,marginBottom:10}}>⌚</div>
          <div style={{fontWeight:700,fontSize:18,color:C.text1}}>Apple Health</div>
          <div style={{marginTop:8}}>{apple?<span className="badge badge-green">✓ Connected</span>:<span className="badge badge-orange">Not Connected</span>}</div>
        </div>
        {apple?(
          <>
            <div style={{color:C.text2,fontWeight:600,fontSize:13,marginBottom:10}}>Currently syncing</div>
            {["Steps & activity","Heart rate","Sleep analysis","Blood glucose (if available)","Weight & BMI"].map((d,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                <div className="glow-dot"/><span style={{color:C.text1,fontSize:13}}>{d}</span>
              </div>
            ))}
            <div style={{color:C.text3,fontSize:12,marginTop:12}}>Last synced: Today at 9:04 AM</div>
            <button className="btn-ghost" style={{marginTop:16,color:C.red,borderColor:C.redBorder}} onClick={()=>{setApple(false);closeModal();}}>Disconnect Apple Health</button>
          </>
        ):(
          <>
            <div style={{color:C.text3,fontSize:13,lineHeight:1.6,marginBottom:16}}>Connect Apple Health to automatically sync steps, sleep, heart rate and more.</div>
            <button className="btn-primary" onClick={()=>{setApple(true);closeModal();}}>Connect Apple Health</button>
          </>
        )}
      </div>
    );

    if(modal==="google")return(
      <div style={{padding:"16px 24px 32px"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:52,marginBottom:10}}>📱</div>
          <div style={{fontWeight:700,fontSize:18,color:C.text1}}>Google Fit</div>
          <div style={{marginTop:8}}>{google?<span className="badge badge-green">✓ Connected</span>:<span className="badge badge-orange">Not Connected</span>}</div>
        </div>
        {google?(
          <>
            <div style={{color:C.text2,fontWeight:600,fontSize:13,marginBottom:10}}>Currently syncing</div>
            {["Daily steps","Active minutes","Distance walked","Calories burned","Workout sessions"].map((d,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                <div className="glow-dot"/><span style={{color:C.text1,fontSize:13}}>{d}</span>
              </div>
            ))}
            <div style={{color:C.text3,fontSize:12,marginTop:12}}>Last synced: Today at 8:47 AM</div>
            <button className="btn-ghost" style={{marginTop:16,color:C.red,borderColor:C.redBorder}} onClick={()=>{setGoogle(false);closeModal();}}>Disconnect Google Fit</button>
          </>
        ):(
          <>
            <div style={{color:C.text3,fontSize:13,lineHeight:1.6,marginBottom:16}}>Connect Google Fit to sync your activity, steps and workouts automatically.</div>
            <button className="btn-primary" onClick={()=>{setGoogle(true);closeModal();}}>Connect Google Fit</button>
          </>
        )}
      </div>
    );

    if(modal==="cgm")return(
      <div style={{padding:"16px 24px 32px"}}>
        {cgmStep===0&&(
          <>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:52}}>💉</div>
              <div style={{fontWeight:700,fontSize:18,color:C.text1,marginTop:10}}>Connect CGM Device</div>
              <div style={{color:C.text3,fontSize:13,marginTop:6,lineHeight:1.5}}>Pair a Continuous Glucose Monitor for real-time blood sugar tracking every 5 minutes.</div>
            </div>
            {["Dexcom G7","Libre 3","Medtronic Guardian"].map((d,i)=>(
              <div key={i} className="sel-card" onClick={()=>setCgmStep(1)} style={{display:"flex",gap:12,alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:24}}>📡</span>
                <div style={{flex:1}}>
                  <div style={{color:C.text1,fontWeight:600,fontSize:14}}>{d}</div>
                  <div style={{color:C.text3,fontSize:12}}>Tap to pair via Bluetooth</div>
                </div>
                <SvgIcon d={IC.right} size={16} color={C.text3} sw={1.8}/>
              </div>
            ))}
            <button className="btn-ghost" onClick={closeModal} style={{marginTop:6}}>Cancel</button>
          </>
        )}
        {cgmStep===1&&(
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <Spinner size={56} color={C.p500}/>
            <div style={{fontWeight:700,fontSize:17,color:C.text1,marginTop:20}}>Scanning for devices…</div>
            <div style={{color:C.text3,fontSize:13,marginTop:6}}>Keep your CGM sensor nearby</div>
            <button className="btn-ghost" style={{marginTop:24}} onClick={()=>{setCgm(true);setCgmStep(2);}}>Simulate Found Device ›</button>
          </div>
        )}
        {cgmStep===2&&(
          <div style={{textAlign:"center",padding:"10px 0"}}>
            <div style={{fontSize:56,marginBottom:16}}>✅</div>
            <div style={{fontWeight:700,fontSize:17,color:C.green}}>Dexcom G7 Connected!</div>
            <div style={{color:C.text3,fontSize:13,marginTop:6,lineHeight:1.5}}>Your CGM is now syncing glucose readings every 5 minutes.</div>
            <div className="card" style={{padding:"14px 16px",marginTop:16,textAlign:"left"}}>
              <div style={{color:C.text3,fontSize:11,marginBottom:4}}>Live Reading</div>
              <div style={{fontWeight:800,fontSize:28,color:C.green}}>94 <span style={{fontSize:14,fontWeight:400,color:C.text3}}>mg/dL</span></div>
              <div style={{color:C.text3,fontSize:12,marginTop:4}}>↔ Stable · Updated just now</div>
            </div>
            <button className="btn-primary" style={{marginTop:20}} onClick={()=>{setCgmStep(0);closeModal();}}>Done</button>
          </div>
        )}
      </div>
    );

    if(modal==="signout")return(
      <div style={{padding:"24px 24px 32px",textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>👋</div>
        <div style={{fontWeight:700,fontSize:18,color:C.text1,marginBottom:8}}>Sign out?</div>
        <div style={{color:C.text3,fontSize:13,lineHeight:1.6,marginBottom:24}}>Your progress and data will be saved. You can sign back in anytime to continue your journey.</div>
        <button className="btn-primary" style={{background:C.gradBtnRed,boxShadow:`0 8px 24px ${C.redBorder}`}} onClick={()=>{closeModal();onSignOut();}}>Sign Out</button>
        <button className="btn-ghost" style={{marginTop:10}} onClick={closeModal}>Cancel</button>
      </div>
    );
    return null;
  };

  /* ── Sections definition ── */
  const sections=[
    {title:"App Settings",items:[
      {icon:"🌙",label:"Dark Mode",   rowClick:null,
        rightEl:<div onClick={e=>{e.stopPropagation();setIsDark(d=>!d);}}><ToggleSwitch on={isDark} setOn={()=>{}}/></div>},
      {icon:"🔔",label:"Notifications",rowClick:()=>openModal("notifications"),
        rightEl:<div onClick={e=>{e.stopPropagation();setNotifs(n=>!n);}}><ToggleSwitch on={notifs} setOn={()=>{}}/></div>},
      {icon:"📊",label:"Units",        rowClick:()=>openModal("units"),
        rightEl:<span style={{color:C.text3,fontSize:13}}>{weightUnit} · {glucUnit} ›</span>},
      {icon:"🌐",label:"Language",     rowClick:()=>openModal("language"),
        rightEl:<span style={{color:C.text3,fontSize:13}}>{lang} ›</span>},
    ]},
    {title:"Connected Devices",items:[
      {icon:"⌚",label:"Apple Health",rowClick:()=>openModal("apple"),
        rightEl:apple?<span className="badge badge-green">Connected ›</span>:<span className="badge badge-orange">Connect ›</span>},
      {icon:"📱",label:"Google Fit",  rowClick:()=>openModal("google"),
        rightEl:google?<span className="badge badge-green">Connected ›</span>:<span className="badge badge-orange">Connect ›</span>},
      {icon:"💉",label:"CGM Device",  rowClick:null,
        rightEl:<div onClick={handleCgmToggle}><ToggleSwitch on={cgm} setOn={()=>{}}/></div>},
    ]},
    {title:"Account",items:[
      {icon:"💎",label:"Subscription",    rowClick:()=>openModal("subscription"),
        rightEl:<span className="badge badge-purple">Pro Plan ›</span>},
      {icon:"🔒",label:"Privacy Settings",rowClick:()=>openModal("privacy"),
        rightEl:<span style={{color:C.text3,fontSize:13}}>›</span>},
      {icon:"📋",label:"Complete Profile",rowClick:onCompleteProfile,
        rightEl:<span style={{color:C.p400,fontSize:13}}>Finish setup ›</span>},
      {icon:"🚪",label:"Sign Out",        rowClick:()=>openModal("signout"),danger:true,
        rightEl:<span style={{color:C.red,fontSize:13}}>›</span>},
    ]},
  ];

  return(
    <div style={{flex:1,position:"relative",display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
      {/* Scrollable area */}
      <div style={{flex:1,overflowY:"auto",overflowX:"hidden",paddingBottom:88,position:"relative"}}>
        <MeshBg/>

        {/* Hero */}
        <div style={{padding:"52px 24px 0",textAlign:"center"}}>
          <div style={{position:"relative",display:"inline-block",marginBottom:16}}>
            <div style={{width:88,height:88,borderRadius:26,background:C.gradLogo,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:700,color:C.white,margin:"0 auto",boxShadow:`0 12px 36px ${C.notchGlow}`}}>AS</div>
            <div style={{position:"absolute",bottom:-2,right:-2,width:26,height:26,borderRadius:"50%",background:C.green,border:`3px solid ${C.bg}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <SvgIcon d={IC.check} size={12} color={C.white} sw={3}/>
            </div>
          </div>
          <div style={{fontWeight:800,fontSize:22,color:C.text1}}>Aarav Sharma</div>
          <div style={{color:C.text3,fontSize:13,marginTop:2}}>aarav.sharma@gmail.com</div>
          <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:10,flexWrap:"wrap"}}>
            <span className="badge badge-purple" style={{cursor:"pointer"}} onClick={()=>openModal("subscription")}>🏆 Pro Member</span>
            <span className="badge badge-green">Day 12 Streak 🔥</span>
          </div>
        </div>

        {/* Health snapshot */}
        <div style={{padding:"20px 24px 0"}}>
          <div className="card" style={{padding:16,background:C.gradProfile,borderColor:C.gradProfileBorder}}>
            <div style={{color:C.text2,fontWeight:600,fontSize:13,marginBottom:12}}>Health Snapshot</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              {[
                {label:"HbA1c", val:"5.7%",          color:C.green},
                {label:"BMI",   val:"26.1",           color:C.orange},
                {label:"Weight",val:`80.4 ${weightUnit}`,color:C.cyan},
              ].map((s,i)=>(
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{fontWeight:800,fontSize:18,color:s.color}}>{s.val}</div>
                  <div style={{color:C.text3,fontSize:11,marginTop:2}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CGM live strip */}
        {cgm&&(
          <div style={{padding:"12px 24px 0"}}>
            <div className="card" onClick={()=>{setCgmStep(2);openModal("cgm");}} style={{padding:"12px 16px",display:"flex",gap:12,alignItems:"center",borderColor:C.greenBorder,background:C.greenCard,cursor:"pointer"}}>
              <div style={{fontSize:22}}>📡</div>
              <div style={{flex:1}}>
                <div style={{color:C.text1,fontWeight:600,fontSize:13}}>Dexcom G7 · Live</div>
                <div style={{color:C.text3,fontSize:12}}>Updated just now · ↔ Stable</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontWeight:800,fontSize:20,color:C.green}}>94</div>
                <div style={{color:C.text3,fontSize:10}}>{glucUnit}</div>
              </div>
            </div>
          </div>
        )}

        {/* Settings sections */}
        {sections.map((section,si)=>(
          <div key={si} style={{padding:si===0?"16px 24px 0":"0 24px"}}>
            <div style={{color:C.text3,fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8,marginTop:si>0?16:0}}>{section.title}</div>
            <div className="card" style={{overflow:"hidden"}}>
              {section.items.map((item,i)=>(
                <div key={i} onClick={item.rowClick||undefined} style={{
                  display:"flex",alignItems:"center",gap:12,padding:"15px 16px",
                  borderBottom:i<section.items.length-1?`1px solid ${C.border}`:"none",
                  cursor:item.rowClick?"pointer":"default",transition:"background .15s",
                }}
                onMouseEnter={e=>{if(item.rowClick)e.currentTarget.style.background=C.surfaceHov;}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
                  <span style={{fontSize:20}}>{item.icon}</span>
                  <div style={{flex:1,color:item.danger?C.red:C.text1,fontSize:14,fontWeight:500}}>{item.label}</div>
                  <div style={{display:"flex",alignItems:"center",flexShrink:0}}>{item.rightEl}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{padding:"20px 24px 24px",textAlign:"center"}}>
          <div style={{color:C.text3,fontSize:11}}>GlucoRevive AI v2.1.0 · Built with ❤️ for better health</div>
        </div>
      </div>

      {/* Bottom sheet overlay */}
      {modal&&(
        <div style={{position:"absolute",inset:0,zIndex:300,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
          <div onClick={closeModal} style={{position:"absolute",inset:0,background:C.scrim,backdropFilter:"blur(8px)"}}/>
          <div style={{position:"relative",background:C.sheetBg,border:`1px solid ${C.border}`,borderRadius:"28px 28px 0 0",maxHeight:"78%",display:"flex",flexDirection:"column",animation:"fadeUp .3s cubic-bezier(.22,.68,0,1.2) both"}}>
            <div style={{display:"flex",justifyContent:"center",padding:"12px 0 6px",flexShrink:0}}>
              <div style={{width:36,height:4,borderRadius:2,background:C.border}}/>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 24px 14px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
              <div style={{fontWeight:700,fontSize:17,color:C.text1}}>{modalTitle}</div>
              <button onClick={closeModal} style={{width:30,height:30,borderRadius:"50%",background:C.surface,border:`1px solid ${C.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.text2,fontSize:20,lineHeight:1,fontFamily:"Inter,sans-serif"}}>×</button>
            </div>
            <div style={{overflowY:"auto",flex:1}}>{renderSheet()}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BOTTOM NAVIGATION
═══════════════════════════════════════════════════════════ */
function BottomNav({tab,setTab}){
  const C=useTheme();
  const tabs=[
    {id:"home",   icon:"home",  label:"Home"},
    {id:"progress",icon:"trend",label:"Progress"},
    {id:"coach",  icon:"chat",  label:"AI Coach"},
    {id:"meals",  icon:"meal",  label:"Meals"},
    {id:"profile",icon:"user",  label:"Profile"},
  ];
  return(
    <div className="bottom-nav">
      {tabs.map(t=>{
        const active=tab===t.id;
        return(
          <div key={t.id} className="nav-item" onClick={()=>setTab(t.id)}>
            {t.id==="coach"?(
              <div style={{width:44,height:44,borderRadius:14,background:active?C.gradBtn:C.accentSubtle,border:`1px solid ${active?"transparent":C.border}`,display:"flex",alignItems:"center",justifyContent:"center",marginTop:-18,boxShadow:active?`0 8px 24px ${C.accentBorder}`:"none",transition:"all .25s"}}>
                <SvgIcon d={IC[t.icon]} size={20} color={active?C.white:C.text3} sw={1.8}/>
              </div>
            ):(
              <SvgIcon d={IC[t.icon]} size={22} color={active?C.p400:C.text3} sw={1.8}/>
            )}
            <span className="nav-label" style={{color:active?C.p400:C.text3,transition:"color .2s"}}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   THEME TOGGLE PILL (floating)
═══════════════════════════════════════════════════════════ */
function ThemeToggle(){
  const C       = useTheme();
  const isDark  = useIsDark();
  const setDark = useSetIsDark();
  return(
    <button onClick={()=>setDark(d=>!d)} style={{
      position:"absolute",top:14,right:14,zIndex:400,
      display:"flex",alignItems:"center",gap:6,
      padding:"6px 12px",borderRadius:20,border:`1px solid ${C.border}`,
      background:C.surface,backdropFilter:"blur(12px)",
      cursor:"pointer",color:C.text2,fontSize:12,fontWeight:600,
      fontFamily:"Inter,sans-serif",transition:"all .2s",
      boxShadow:`0 4px 12px ${C.accentSubtle}`,
    }}>
      <SvgIcon d={IC[isDark?"sun":"moon"]} size={14} color={C.p400} sw={1.8}/>
      {isDark?"Light":"Dark"}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function GlucoReviveAI(){
  const[isDark,  setIsDark] = useState(true);
  const[screen,  setScreen] = useState("splash");
  const[tab,     setTab]    = useState("home");
  const C = isDark ? DARK : LIGHT;

  return(
    <ThemeCtx.Provider value={{C,isDark,setIsDark}}>
      <style>{makeCSS(C)}</style>

      <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 0",fontFamily:"'Inter',sans-serif",transition:"background .4s"}}>
        <div style={{position:"relative"}}>
          {/* Notch glow */}
          <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",width:120,height:4,borderRadius:2,background:`linear-gradient(90deg,transparent,${C.notchGlow},transparent)`,filter:"blur(8px)"}}/>

          <div className="app-shell">
            {/* Theme toggle — always visible */}
            {screen==="app"&&<ThemeToggle/>}

            {screen==="splash"    &&<SplashScreen onDone={()=>setScreen("login")}/>}
            {screen==="login"     &&<LoginScreen  onDone={()=>setScreen("onboarding")}/>}
            {screen==="onboarding"&&<OnboardingScreen onDone={()=>setScreen("app")}/>}

            {screen==="app"&&(
              <>
                {tab==="home"    &&<HomeScreen setTab={setTab}/>}
                {tab==="progress"&&<ProgressScreen/>}
                {tab==="coach"   &&<AICoachScreen/>}
                {tab==="meals"   &&<MealScreen/>}
                {tab==="profile" &&<ProfileScreen onSignOut={()=>setScreen("login")} onCompleteProfile={()=>setScreen("onboarding")}/>}

                {tab==="home"&&(
                  <button onClick={()=>setTab("coach")} style={{
                    position:"absolute",right:20,bottom:96,
                    width:52,height:52,borderRadius:16,
                    background:C.gradLogo,border:"none",cursor:"pointer",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:24,boxShadow:`0 8px 28px ${C.notchGlow}`,
                    zIndex:50,animation:"float 3s ease-in-out infinite",
                  }}>🤖</button>
                )}

                <BottomNav tab={tab} setTab={setTab}/>
              </>
            )}
          </div>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
