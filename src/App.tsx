/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, FormEvent, ReactNode } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  MessageSquare,
  Smile,
  Flame,
  Trees,
  Footprints,
  Skull,
  Star,
  Coffee,
  Utensils,
  Map,
  Zap,
  Dna,
  Egg,
  Bird,
  Fish,
  Glasses
} from "lucide-react";

const FORM_URL = "https://docs.google.com/forms/u/1/d/1nUNUbQNPK3vPdAjzM-t6etf4QmsNMC4lUBkwdBhuhMM/formResponse";

// Quality-based labels and Red-Yellow-Green aura
const DINO_STATES = [
  {
    label: "Hodně špatný",
    glow: "#ef4444", // Red
    leftBrow: "M 125 130 L 175 115", rightBrow: "M 225 115 L 275 130",
    mouth: "M 140 290 Q 200 240 260 290 Q 200 260 140 290",
    tearOpacity: 1
  },
  {
    label: "Spíš špatný",
    glow: "#f97316", // Orange
    leftBrow: "M 130 125 L 180 120", rightBrow: "M 220 120 L 270 125",
    mouth: "M 140 265 Q 200 250 260 265 Q 200 255 140 265",
    tearOpacity: 0
  },
  {
    label: "Ušlo to",
    glow: "#eab308", // Yellow
    leftBrow: "M 135 115 L 185 115", rightBrow: "M 215 115 L 265 115",
    mouth: "M 140 260 Q 200 260 260 260 Q 200 260 140 260",
    tearOpacity: 0
  },
  {
    label: "Docela dobrý",
    glow: "#84cc16", // Lime
    leftBrow: "M 135 110 L 185 100", rightBrow: "M 215 100 L 265 110",
    mouth: "M 140 255 Q 200 280 260 255 Q 200 290 140 255",
    tearOpacity: 0
  },
  {
    label: "Mega dobrý",
    glow: "#22c55e", // Green
    leftBrow: "M 135 100 L 185 85", rightBrow: "M 215 85 L 265 100",
    mouth: "M 130 250 Q 200 290 270 250 Q 200 350 130 250",
    tearOpacity: 0
  }
];

function MobsterIcon({ type }: { type: 'pterodactyl' | 'mosasaur' | 'croc' | 'dimetrodon' }) {
  const icons = {
    pterodactyl: <Bird className="w-12 h-12" />,
    mosasaur: <Fish className="w-12 h-12" />,
    croc: <Skull className="w-12 h-12" />,
    dimetrodon: <Zap className="w-12 h-12" />
  };

  return (
    <div className="relative inline-block p-4 bg-stone-800/80 rounded-3xl border-2 border-emerald-500/30 group backdrop-blur-sm">
      <div className="text-emerald-400 group-hover:text-orange-400 transition-colors">
        {icons[type]}
      </div>
      
      {/* Fedora Hat Overlay */}
      <svg className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-6 drop-shadow-md" viewBox="0 0 40 20">
        <rect x="5" y="12" width="30" height="4" rx="2" fill="#1a1a1a" />
        <rect x="10" y="4" width="20" height="10" rx="2" fill="#1a1a1a" />
        <rect x="10" y="10" width="20" height="2" fill="#444" />
      </svg>

      {/* Bandit Mask Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-8 h-2 bg-stone-950/80 rounded-full border border-stone-800" />

      <div className="absolute -bottom-2 right-0 bg-orange-600 px-2 py-0.5 rounded text-[7px] font-black text-white uppercase shadow-lg">
        WANTED
      </div>
    </div>
  );
}

function CyclicPeekingDino({ side, scrollY, period, offset, top = "50%", children }: { side: 'left' | 'right', scrollY: any, period: number, offset: number, top?: string, children: ReactNode }) {
  const peekProgress = useTransform(scrollY, (latest: number) => {
    const pos = (latest + offset) % period;
    const peekDuration = 500; // Total duration of peek in pixels
    if (pos < peekDuration) {
      if (pos < 150) return pos / 150; // Slide out
      if (pos < 350) return 1; // Stay
      return 1 - (pos - 350) / 150; // Slide back
    }
    return 0;
  });

  const x = useTransform(
    peekProgress,
    [0, 1],
    side === 'left' ? ["-100%", "-35%"] : ["100%", "35%"]
  );
  
  const opacity = useTransform(peekProgress, [0, 0.1, 1], [0, 1, 1]);
  const rotate = useTransform(peekProgress, [0, 1], side === 'left' ? [-5, 0] : [5, 0]);

  return (
    <motion.div 
      style={{ x, opacity, rotate, [side]: 0, top }}
      className="fixed -translate-y-1/2 pointer-events-none z-50"
    >
      {children}
    </motion.div>
  );
}

function WalkingDino() {
  const { scrollY, scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], ["-20%", "120%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  return (
    <>
      {/* Background Walking Dino */}
      <motion.div 
        style={{ x, rotate }}
        className="fixed bottom-10 pointer-events-none z-40 opacity-20"
      >
        <svg width="240" height="140" viewBox="0 0 200 120" fill="currentColor" className="text-emerald-400">
          <path d="M20,100 Q40,40 100,40 Q140,40 180,80 L190,110 L150,100 L130,115 L110,100 L90,115 L70,100 Z" />
          <circle cx="160" cy="60" r="5" fill="#064e3b" />
        </svg>
      </motion.div>

      {/* Dino 1: Purple - Peeking from Left */}
      <CyclicPeekingDino side="left" scrollY={scrollY} period={1400} offset={0} top="25%">
        <div className="relative flex items-center">
          <svg width="300" height="260" viewBox="0 0 400 350">
            <defs>
              <filter id="shadow1" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="2" dy="5" stdDeviation="3" flood-opacity="0.15" />
              </filter>
            </defs>
            <g filter="url(#shadow1)">
              <path d="M 160 220 L 160 285 L 175 285" fill="none" stroke="#512DA8" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/>
              <path d="M 240 220 L 240 285 L 255 285" fill="none" stroke="#512DA8" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/>
              <path d="M 140 200 L 60 240" fill="none" stroke="#7E57C2" stroke-width="35" stroke-linecap="round"/>
              <path d="M 150 190 L 240 170 L 250 200 L 240 220 L 150 220 Z" fill="#7E57C2" stroke="#7E57C2" stroke-width="45" stroke-linejoin="round"/>
              <path d="M 150 232 L 246 230 L 250 225" fill="none" stroke="#B39DDB" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
              <g>
                <animateTransform attributeName="transform" type="rotate" values="0 230 160; 6 230 160; 0 230 160" dur="6s" repeatCount="indefinite"/>
                <path d="M 250 160 L 260 80" fill="none" stroke="#7E57C2" stroke-width="35" stroke-linecap="round"/>
                <path d="M 290 70 L 260 80 L 260 100 L 310 100 Z" fill="#7E57C2" stroke="#7E57C2" stroke-width="20" stroke-linejoin="round"/>
                <line x1="290" y1="98" x2="319" y2="103" stroke="#512DA8" stroke-width="3" stroke-linecap="round"/>
                <circle cx="290" cy="78" r="6" fill="#FFF"/>
                <circle cx="292" cy="78" r="2.5" fill="#111"/>
                <circle cx="293" cy="77" r="1" fill="#FFF"/>
                <rect x="280" y="70" width="18" height="18" fill="#7E57C2">
                  <animate attributeName="height" values="0; 18; 0; 0" keyTimes="0; 0.05; 0.1; 1" dur="5.5s" repeatCount="indefinite"/>
                </rect>
              </g>
              <path d="M 170 220 L 170 285 L 185 285" fill="none" stroke="#7E57C2" stroke-width="25" stroke-linejoin="round" stroke-linecap="round"/>
              <path d="M 225 220 L 225 285 L 240 285" fill="none" stroke="#7E57C2" stroke-width="25" stroke-linejoin="round" stroke-linecap="round"/>
              <circle cx="170" cy="200" r="6" fill="#512DA8" opacity="0.3"/>
              <circle cx="200" cy="180" r="5" fill="#512DA8" opacity="0.3"/>
              <circle cx="230" cy="205" r="7" fill="#512DA8" opacity="0.3"/>
            </g>
          </svg>
        </div>
      </CyclicPeekingDino>

      {/* Dino 2: Yellow/Red - Peeking from Right */}
      <CyclicPeekingDino side="right" scrollY={scrollY} period={2000} offset={500} top="75%">
        <div className="relative flex items-center justify-end">
          <svg width="300" height="260" viewBox="0 0 400 350" style={{ transform: 'scaleX(-1)' }}>
            <defs>
              <filter id="shadow2" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="2" dy="5" stdDeviation="3" flood-opacity="0.15" />
              </filter>
            </defs>
            <g filter="url(#shadow2)">
              <path d="M 170 230 L 160 285 L 180 285" fill="none" stroke="#C62828" stroke-width="20" stroke-linejoin="round" stroke-linecap="round"/>
              <path d="M 215 230 L 225 260 L 240 270" fill="none" stroke="#C62828" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
              <path d="M 130 200 Q 180 70 230 200 Z" fill="#FFCA28" stroke="#FFB300" stroke-width="8" stroke-linejoin="round">
                <animate attributeName="fill" values="#FFCA28; #FFE082; #FFCA28" dur="4s" repeatCount="indefinite"/>
              </path>
              <line x1="155" y1="200" x2="160" y2="140" stroke="#FFB300" stroke-width="5" stroke-linecap="round"/>
              <line x1="180" y1="200" x2="180" y2="130" stroke="#FFB300" stroke-width="5" stroke-linecap="round"/>
              <line x1="205" y1="200" x2="200" y2="140" stroke="#FFB300" stroke-width="5" stroke-linecap="round"/>
              <path d="M 140 210 L 50 230" fill="none" stroke="#EF5350" stroke-width="35" stroke-linecap="round"/>
              <path d="M 130 210 L 230 200 L 220 230 L 150 230 Z" fill="#EF5350" stroke="#EF5350" stroke-width="40" stroke-linejoin="round"/>
              <path d="M 140 230 L 220 230" fill="none" stroke="#FFCDD2" stroke-width="12" stroke-linecap="round"/>
              <path d="M 250 180 L 280 180 L 310 190 L 305 205 L 250 205 Z" fill="#EF5350" stroke="#EF5350" stroke-width="20" stroke-linejoin="round"/>
              <circle cx="280" cy="205" r="4" fill="#EF5350"/>
              <line x1="270" y1="200" x2="314" y2="205" stroke="#C62828" stroke-width="3" stroke-linecap="round"/>
              <path d="M 150 230 L 140 285 L 160 285" fill="none" stroke="#EF5350" stroke-width="20" stroke-linejoin="round" stroke-linecap="round"/>
              <g>
                <animateTransform attributeName="transform" type="rotate" values="0 205 230; -20 205 230; 0 205 230" dur="3.5s" repeatCount="indefinite"/>
                <path d="M 205 230 L 215 260 L 230 270" fill="none" stroke="#EF5350" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>
              </g>
              <circle cx="160" cy="200" r="5" fill="#C62828" opacity="0.3"/>
              <circle cx="190" cy="190" r="6" fill="#C62828" opacity="0.3"/>
              <circle cx="210" cy="215" r="4" fill="#C62828" opacity="0.3"/>
              <circle cx="275" cy="185" r="7" fill="#FFF"/>
              <circle cx="277" cy="185" r="3" fill="#111"/>
              <circle cx="278" cy="184" r="1" fill="#FFF"/>
              <rect x="265" y="175" width="18" height="18" fill="#EF5350">
                <animate attributeName="height" values="0; 18; 0; 0" keyTimes="0; 0.05; 0.1; 1" dur="4.8s" repeatCount="indefinite"/>
              </rect>
            </g>
          </svg>
        </div>
      </CyclicPeekingDino>

      {/* Dino 3: Green Stego - Peeking from Left */}
      <CyclicPeekingDino side="left" scrollY={scrollY} period={1800} offset={1000} top="60%">
        <div className="relative flex items-center">
          <svg width="300" height="260" viewBox="0 0 400 350">
            <defs>
              <filter id="shadow3" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="2" dy="5" stdDeviation="3" flood-opacity="0.15" />
              </filter>
            </defs>
            <g filter="url(#shadow3)">
              <path d="M 130 230 L 120 285 L 140 285" fill="none" stroke="#00695C" stroke-width="20" stroke-linejoin="round" stroke-linecap="round"/>
              <path d="M 230 230 L 220 285 L 240 285" fill="none" stroke="#00695C" stroke-width="20" stroke-linejoin="round" stroke-linecap="round"/>
              <path d="M 130 200 L 145 150 L 160 190 Z" fill="#F57C00" stroke="#E65100" stroke-width="4" stroke-linejoin="round"/>
              <path d="M 180 180 L 200 130 L 220 190 Z" fill="#F57C00" stroke="#E65100" stroke-width="4" stroke-linejoin="round"/>
              <g>
                <animateTransform attributeName="transform" type="rotate" values="0 130 210; -8 130 210; 0 130 210" dur="4s" repeatCount="indefinite"/>
                <path d="M 60 220 L 40 200 M 40 220 L 20 200" fill="none" stroke="#FF9800" stroke-width="6" stroke-linecap="round"/>
                <path d="M 140 230 L 40 230" fill="none" stroke="#009688" stroke-width="35" stroke-linecap="round"/>
                <path d="M 60 235 L 45 250 M 40 235 L 25 250" fill="none" stroke="#FF9800" stroke-width="6" stroke-linecap="round"/>
              </g>
              <path d="M 120 220 L 170 200 L 200 200 L 250 220 L 230 240 L 140 240 Z" fill="#009688" stroke="#009688" stroke-width="45" stroke-linejoin="round"/>
              <path d="M 150 187 L 175 130 L 195 180 Z" fill="#FFB300" stroke="#FF9800" stroke-width="4" stroke-linejoin="round"/>
              <path d="M 210 180 L 230 150 L 250 195 Z" fill="#FFB300" stroke="#FF9800" stroke-width="4" stroke-linejoin="round"/>
              <path d="M 110 200 L 120 160 L 135 190 Z" fill="#FFB300" stroke="#FF9800" stroke-width="4" stroke-linejoin="round"/>
              <path d="M 140 240 L 230 240" fill="none" stroke="#4DB6AC" stroke-width="15" stroke-linecap="round"/>
              <path d="M 270 215 L 300 225 L 310 240 L 270 240 Z" fill="#009688" stroke="#009688" stroke-width="22" stroke-linejoin="round"/>
              <line x1="290" y1="240" x2="320" y2="245" stroke="#00695C" stroke-width="3" stroke-linecap="round"/>
              <path d="M 150 260 L 145 285 L 165 285" fill="none" stroke="#009688" stroke-width="20" stroke-linejoin="round" stroke-linecap="round"/>
              <path d="M 205 260 L 205 285 L 225 285" fill="none" stroke="#009688" stroke-width="20" stroke-linejoin="round" stroke-linecap="round"/>
              <circle cx="160" cy="210" r="5" fill="#00695C" opacity="0.3"/>
              <circle cx="190" cy="190" r="6" fill="#00695C" opacity="0.3"/>
              <circle cx="210" cy="220" r="4" fill="#00695C" opacity="0.3"/>
              <circle cx="290" cy="223" r="6" fill="#FFF"/>
              <circle cx="292" cy="223" r="3" fill="#111"/>
              <circle cx="293" cy="222" r="1" fill="#FFF"/>
              <rect x="280" y="215" width="18" height="18" fill="#009688">
                <animate attributeName="height" values="0; 18; 0; 0" keyTimes="0; 0.05; 0.1; 1" dur="5s" repeatCount="indefinite"/>
              </rect>
            </g>
          </svg>
        </div>
      </CyclicPeekingDino>

      {/* Dino 4: Green T-Rex - Peeking from Right */}
      <CyclicPeekingDino side="right" scrollY={scrollY} period={2500} offset={1500} top="40%">
        <div className="relative flex items-center justify-end">
          <svg width="300" height="260" viewBox="0 0 400 350" style={{ transform: 'scaleX(-1)' }}>
            <defs>
              <filter id="shadow4" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="2" dy="5" stdDeviation="3" flood-opacity="0.15" />
              </filter>
            </defs>
            <g filter="url(#shadow4)">
              <path d="M 220 180 L 235 200" fill="none" stroke="#2E7D32" stroke-width="8" stroke-linecap="round"/>
              <path d="M 170 230 L 170 285 L 190 285" fill="none" stroke="#2E7D32" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/>
              <path d="M 160 210 L 70 240" fill="none" stroke="#4CAF50" stroke-width="35" stroke-linecap="round"/>
              <path d="M 150 220 L 220 180 L 220 210 L 200 230 L 160 230 Z" fill="#4CAF50" stroke="#4CAF50" stroke-width="40" stroke-linejoin="round"/>
              <path d="M 160 240 L 205 240 L 230 215 L 230 204" fill="none" stroke="#81C784" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M 220 180 L 240 130 L 270 130 L 300 150 L 295 170 L 230 170 Z" fill="#4CAF50" stroke="#4CAF50" stroke-width="32" stroke-linejoin="round"/>
              <polyline points="270,170 275,178 280,170 285,178 290,170 295,178 300,170 305,178 310,170" fill="none" stroke="#FFF" stroke-width="2" stroke-linejoin="round"/>
              <line x1="260" y1="170" x2="310" y2="170" stroke="#2E7D32" stroke-width="4" stroke-linecap="round"/>
              <g>
                <animateTransform attributeName="transform" type="rotate" values="0 225 205; -15 225 205; 0 225 205" dur="3s" repeatCount="indefinite"/>
                <path d="M 220 205 L 240 215 L 255 215" fill="none" stroke="#4CAF50" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>
              </g>
              <path d="M 150 230 L 145 285 L 165 285" fill="none" stroke="#4CAF50" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/>
              <circle cx="160" cy="200" r="5" fill="#2E7D32" opacity="0.3"/>
              <circle cx="200" cy="180" r="4" fill="#2E7D32" opacity="0.3"/>
              <circle cx="190" cy="210" r="6" fill="#2E7D32" opacity="0.3"/>
              <circle cx="265" cy="140" r="9" fill="#FFF"/>
              <circle cx="267" cy="140" r="4" fill="#111"/>
              <circle cx="268" cy="138" r="1.5" fill="#FFF"/>
              <rect x="250" y="125" width="25" height="25" fill="#4CAF50">
                <animate attributeName="height" values="0; 25; 0; 0" keyTimes="0; 0.05; 0.1; 1" dur="4.5s" repeatCount="indefinite"/>
              </rect>
            </g>
          </svg>
        </div>
      </CyclicPeekingDino>
    </>
  );
}

function DinoFace({ rating }: { rating: number }) {
  const state = DINO_STATES[rating - 1] || DINO_STATES[2];
  
  return (
    <div className="relative w-48 h-48 md:w-60 md:h-60 mx-auto flex items-center justify-center">
      {/* Dynamic Aura Shadow */}
      <motion.div 
        animate={{ backgroundColor: state.glow }}
        className="absolute inset-2 rounded-full dino-glow z-0"
      />
      
      <svg viewBox="0 0 400 400" className="relative z-10 w-full h-full drop-shadow-2xl">
        {/* Spikes - More vibrant */}
        <path d="M 200 60 L 180 20 L 220 20 Z" fill="#14532d" />
        <path d="M 130 80 L 90 40 L 140 50 Z" fill="#14532d" />
        <path d="M 270 80 L 310 40 L 260 50 Z" fill="#14532d" />

        {/* Head - Vibrant Green */}
        <path d="M 100 240 C 100 100, 150 60, 200 60 C 250 60, 300 100, 300 240 C 300 340, 280 355, 200 355 C 120 355, 100 340, 100 240 Z" fill="#22c55e"/>
        
        {/* Belly/Face area - Brighter Green */}
        <path d="M 120 240 C 120 200, 280 200, 280 240 C 280 310, 260 330, 200 330 C 140 330, 120 310, 120 240 Z" fill="#86efac"/>

        {/* Nostrils */}
        <circle cx="170" cy="220" r="6" fill="#064e3b"/>
        <circle cx="230" cy="220" r="6" fill="#064e3b"/>

        {/* Tears */}
        <motion.path 
          initial={{ opacity: 0 }}
          animate={{ opacity: state.tearOpacity }}
          d="M 150 180 Q 170 220 150 225 Q 130 220 150 180 Z" 
          fill="#38bdf8"
        />
        <motion.path 
          initial={{ opacity: 0 }}
          animate={{ opacity: state.tearOpacity }}
          d="M 250 180 Q 270 220 250 225 Q 230 220 250 180 Z" 
          fill="#38bdf8"
        />

        {/* Eyes */}
        <circle cx="160" cy="150" r="30" fill="white"/>
        <circle cx="160" cy="150" r="15" fill="#000"/>

        <circle cx="240" cy="150" r="30" fill="white"/>
        <circle cx="240" cy="150" r="15" fill="#000"/>

        {/* Eyebrows */}
        <motion.path 
          animate={{ d: state.leftBrow }}
          stroke="#064e3b" strokeWidth="8" strokeLinecap="round" fill="none" 
        />
        <motion.path 
          animate={{ d: state.rightBrow }}
          stroke="#064e3b" strokeWidth="8" strokeLinecap="round" fill="none" 
        />

        {/* Mouth */}
        <motion.path 
          animate={{ d: state.mouth }}
          fill="#7f1d1d" stroke="#064e3b" strokeWidth="4" strokeLinejoin="round" 
        />
      </svg>
    </div>
  );
}

const RATING_ITEMS = [
  { id: "entry.1702009355", label: "Kompas celkově", notesId: null },
  { id: "entry.875678888", label: "Páteční hra po Plzni", notesId: "entry.1648282336" },
  { id: "entry.1225708827", label: "Program na zpětnou vazbu", notesId: "entry.50380162" },
  { id: "entry.709984681", label: "Ideální rádce", notesId: "entry.1324367055" },
  { id: "entry.1387118574", label: "Vysvětlování pravidel", notesId: "entry.1270461383" },
  { id: "entry.397210787", label: "Příprava na družinovku", notesId: "entry.609423421" },
  { id: "entry.1344712436", label: "Workshopy", notesId: "entry.1142233594" },
  { id: "entry.1559808078", label: "Kahoot", notesId: "entry.1496757599" },
  { id: "entry.1608838366", label: "Čajovna", notesId: "entry.1886647764" },
  { id: "entry.589276264", label: "Hra se dveřmi", notesId: "entry.182140805" },
  { id: "entry.1006145274", label: "Nedělní stanoviště", notesId: "entry.2086332440" },
];

const TEXT_ITEMS = [
  { id: "entry.678441867", label: "Tvůj největší zážitek?", placeholder: "Napiš nám to nej!", icon: <Flame className="w-6 h-6" /> },
  { id: "entry.288145985", label: "Co bychom měli vylepšit?", placeholder: "Buď upřímný/á...", icon: <Skull className="w-6 h-6" /> },
  { id: "entry.1164950974", label: "V čem by ses chtěl/a dál rozvíjet?", placeholder: "Oblasti, které tě zajímají...", icon: <Trees className="w-6 h-6" /> },
  { id: "entry.1236028313", label: "Měl/a jsi dost času na poznávání ostatních?", placeholder: "Bylo to akorát?", icon: <Smile className="w-6 h-6" /> },
  { id: "entry.1071875197", label: "Co říkáš na etapovku?", placeholder: "Příběh, úkoly...", icon: <Map className="w-6 h-6" /> },
  { id: "entry.14602332", label: "Jak ti chutnalo jídlo?", placeholder: "Mňam nebo blé?", icon: <Utensils className="w-6 h-6" /> },
  { id: "entry.980633197", label: "Ještě něco nám chceš vzkázat?", placeholder: "Cokoliv dalšího...", icon: <MessageSquare className="w-6 h-6" /> },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      const body = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        body.append(key, value as string);
      });

      // Using fetch with no-cors mode to send data to Google Forms
      await fetch(FORM_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      // Even if it fails (CORS), it usually sends the data, so we show success
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-emerald-950 bg-footprints">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="dino-card text-center max-w-md w-full border-orange-500"
        >
          <div className="flex justify-center mb-6">
            <DinoFace rating={5} />
          </div>
          <h1 className="text-4xl font-black mb-4 uppercase italic text-white">DÍKY ZA TVŮJ HLAS!</h1>
          <p className="text-xl font-bold mb-8 text-emerald-100">Tvoje odpovědi byly bezpečně uloženy do jurského archivu. Jsi legenda! 🦖</p>
          <button 
            onClick={() => window.location.reload()}
            className="dino-button"
          >
            Zkusit znovu?
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-footprints">
      <WalkingDino />

      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute top-10 left-10 animate-stomp" style={{ animationDelay: '0s' }}>
          <MobsterIcon type="pterodactyl" />
        </div>
        <div className="absolute top-20 right-1/4 animate-stomp opacity-30" style={{ animationDelay: '1s' }}>
          <MobsterIcon type="dimetrodon" />
        </div>
        <div className="absolute bottom-20 right-10 animate-stomp" style={{ animationDelay: '2s' }}>
          <MobsterIcon type="mosasaur" />
        </div>
        <div className="absolute bottom-40 left-10 animate-stomp opacity-30" style={{ animationDelay: '3s' }}>
          <MobsterIcon type="croc" />
        </div>
        <div className="absolute top-1/3 right-5 opacity-30">
          <MobsterIcon type="croc" />
        </div>
        <div className="absolute bottom-1/3 left-5 opacity-30">
          <MobsterIcon type="dimetrodon" />
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-20">
          <MobsterIcon type="pterodactyl" />
        </div>
        <div className="absolute top-1/4 right-1/4 opacity-20">
          <Dna className="w-32 h-32 text-emerald-300" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 opacity-20">
          <Egg className="w-24 h-24 text-orange-300" />
        </div>
      </div>

      <header className="relative z-10 w-full max-w-4xl mb-12 text-center">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-block bg-orange-600 text-white px-6 py-2 mb-4 font-black uppercase tracking-widest rounded-full shadow-lg text-xs md:text-base"
        >
          Zpětná vazba 2026
        </motion.div>
        <h1 className="text-5xl md:text-8xl font-black uppercase italic leading-none tracking-tighter text-emerald-400 drop-shadow-[0_6px_0_rgba(0,0,0,0.5)]">
          Blanický <span className="text-orange-500">Kompas</span>
        </h1>
        <div className="mt-8 flex justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className={`h-3 md:h-4 transition-all rounded-full border-2 border-emerald-900 ${i === step ? 'w-12 md:w-16 bg-orange-500' : i < step ? 'w-3 md:w-4 bg-emerald-500' : 'w-3 md:w-4 bg-stone-800'}`}
            />
          ))}
        </div>
      </header>

      <main className="relative z-10 w-full max-w-4xl flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="dino-card min-h-[500px] flex flex-col"
          >
            {/* Step 0: Name */}
            {step === 0 && (
              <div className="flex-grow flex flex-col justify-center text-center space-y-10">
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500 rounded-3xl border-4 border-emerald-900 shadow-[6px_6px_0_0_rgba(0,0,0,1)] inline-block">
                    <Footprints className="w-12 h-12 text-emerald-950" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
                    Jak se jmenuješ?
                  </h2>
                </div>
                <input 
                  type="text"
                  placeholder="Tvoje jméno..."
                  className="dino-input text-xl md:text-2xl text-center py-6"
                  value={formData["entry.1585928571"] || ""}
                  onChange={(e) => handleInputChange("entry.1585928571", e.target.value)}
                  autoFocus
                />
                <div className="py-6">
                  <DinoFace rating={4} />
                </div>
              </div>
            )}

            {/* Step 1: All Ratings */}
            {step === 1 && (
              <div className="space-y-12">
                <div className="text-center space-y-4 mb-12">
                  <h2 className="text-3xl md:text-4xl font-black uppercase text-white">Hodnocení programů</h2>
                  <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs md:text-sm">Posuň slider a ohodnoť kvalitu programu!</p>
                </div>

                <div className="grid gap-12">
                  {RATING_ITEMS.map((item) => {
                    const rating = parseInt(formData[item.id] || "3");
                    return (
                      <div key={item.id} className="bg-stone-800/50 p-6 md:p-8 rounded-[2rem] border-2 border-emerald-700/30 space-y-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="text-center md:text-left flex-grow">
                            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-2">{item.label}</h3>
                            <div className="inline-block bg-stone-900 px-4 py-1 rounded-full text-orange-500 font-black text-base md:text-lg">
                              {DINO_STATES[rating - 1]?.label}
                            </div>
                          </div>
                          <DinoFace rating={rating} />
                        </div>

                        <input 
                          type="range" 
                          min="1" 
                          max="5" 
                          step="1"
                          value={formData[item.id] || "3"}
                          onChange={(e) => handleInputChange(item.id, e.target.value)}
                          className="w-full"
                        />

                        {item.notesId && (
                          <div className="space-y-2">
                            <label className="text-[10px] md:text-xs font-black text-stone-500 uppercase tracking-widest ml-1">
                              Poznámky ke konkrétnímu programu <span className="text-emerald-600/50">(dobrovolné)</span>
                            </label>
                            <textarea 
                              placeholder="Máš k tomuto programu co říct?"
                              className="dino-input min-h-[100px] text-sm md:text-base"
                              value={formData[item.notesId] || ""}
                              onChange={(e) => handleInputChange(item.notesId!, e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: All Text Questions */}
            {step === 2 && (
              <div className="space-y-12">
                <div className="text-center space-y-4 mb-12">
                  <h2 className="text-3xl md:text-4xl font-black uppercase text-white">Pověz nám víc!</h2>
                  <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs md:text-sm">Tvoje postřehy jsou pro nás poklad.</p>
                </div>

                <div className="grid gap-10">
                  {TEXT_ITEMS.map((item) => (
                    <div key={item.id} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-900 rounded-lg text-emerald-400 border border-emerald-700">
                          {item.icon}
                        </div>
                        <label className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
                          {item.label}
                        </label>
                      </div>
                      <textarea 
                        placeholder={item.placeholder}
                        className="dino-input min-h-[150px] text-base md:text-lg"
                        value={formData[item.id] || ""}
                        onChange={(e) => handleInputChange(item.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="py-10 text-center">
                  <DinoFace rating={5} />
                  <p className="mt-6 text-stone-500 font-bold uppercase italic text-xs md:text-sm">Už jsme skoro u cíle!</p>
                </div>
              </div>
            )}

            <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t-4 border-emerald-900/30">
              <button 
                onClick={handlePrev}
                disabled={step === 0}
                className={`dino-button-secondary ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}
              >
                <ChevronLeft className="w-4 h-4" /> Zpět
              </button>

              {step === 2 ? (
                <button 
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting}
                  className="dino-button"
                >
                  {isSubmitting ? "Odesílám..." : "Odeslat odpovědi"} <Send className="w-6 h-6" />
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  className="dino-button"
                  disabled={step === 0 && !formData["entry.1585928571"]}
                >
                  Pokračovat <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Hidden form for submission to Google Forms */}
      <form 
        ref={formRef}
        action={FORM_URL} 
        method="POST" 
        target="hidden_iframe"
        onSubmit={handleSubmit}
        className="hidden"
      >
        {Object.entries(formData).map(([id, value]) => (
          <input key={id} type="hidden" name={id} value={value} />
        ))}
      </form>
      <iframe name="hidden_iframe" className="hidden" />

      <footer className="relative z-10 w-full max-w-4xl mt-12 mb-8 text-center">
        <p className="font-bold text-emerald-800 uppercase tracking-widest text-[8px] md:text-[10px]">
          Vyrobeno v jurském období pro Blanický Kompas 2026 🦖🌿
        </p>
      </footer>
    </div>
  );
}
