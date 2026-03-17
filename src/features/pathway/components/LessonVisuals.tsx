
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════
   HOOK OPENER CHARTS — Unique per lesson
   ═══════════════════════════════════════════ */

/** Lesson 2: Risk-Return Spectrum scatter (horizontal dots) */
export function HookChartRiskReward({ animPhase }: { animPhase: number }) {
  const assets = [
    { x: 100, y: 240, label: 'Savings', ret: '~2%', color: '#3b82f6' },
    { x: 220, y: 190, label: 'Bonds', ret: '~5%', color: '#06b6d4' },
    { x: 350, y: 140, label: 'Real Estate', ret: '~8%', color: '#10b981' },
    { x: 480, y: 90, label: 'Index Funds', ret: '~10%', color: '#8b5cf6' },
    { x: 600, y: 50, label: 'Stocks', ret: '~12%+', color: '#f59e0b' },
  ];
  return (
    <svg viewBox="0 0 700 320" className="w-full h-auto" style={{ minHeight: '280px' }}>
      {/* Grid */}
      {[80, 140, 200, 260].map(y => (
        <line key={y} x1="50" y1={y} x2="660" y2={y} stroke="rgba(139,92,246,0.08)" strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Axes */}
      <line x1="50" y1="280" x2="660" y2="280" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1="50" y1="280" x2="50" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* Axis labels */}
      <text x="360" y="310" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="12" fontWeight="600">RISK →</text>
      <text x="20" y="155" fill="rgba(255,255,255,0.4)" fontSize="12" fontWeight="600" transform="rotate(-90, 20, 155)">RETURN →</text>
      {/* Trend line */}
      <motion.line x1="80" y1="260" x2="620" y2="40" stroke="rgba(139,92,246,0.2)" strokeWidth="2" strokeDasharray="8 6"
        initial={{ pathLength: 0 }} animate={{ pathLength: animPhase >= 1 ? 1 : 0 }} transition={{ duration: 1 }} />
      {/* Asset dots */}
      {assets.map((a, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: animPhase >= 2 ? 1 : 0, scale: animPhase >= 2 ? 1 : 0.5 }}
          transition={{ delay: 0.15 * i, duration: 0.4 }}>
          <circle cx={a.x} cy={a.y} r="18" fill={a.color} fillOpacity="0.2" stroke={a.color} strokeWidth="2" />
          <circle cx={a.x} cy={a.y} r="5" fill={a.color} />
          <text x={a.x} y={a.y - 26} textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">{a.label}</text>
          <text x={a.x} y={a.y + 36} textAnchor="middle" fill={a.color} fontSize="11" fontWeight="600">{a.ret}</text>
        </motion.g>
      ))}
    </svg>
  );
}

/** Lesson 3: Exponential vs Linear growth curve */
export function HookChartCompounding({ animPhase }: { animPhase: number }) {
  // Linear path (savings at 2%)
  const linearPath = "M60,260 L180,252 L300,244 L420,236 L540,228 L660,220";
  // Exponential path (investing at 10%)
  const expPath = "M60,260 Q180,255 240,240 Q300,220 360,185 Q420,140 480,85 Q540,45 600,25 L660,15";
  return (
    <svg viewBox="0 0 700 320" className="w-full h-auto" style={{ minHeight: '280px' }}>
      <defs>
        <linearGradient id="expGrad3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[80, 140, 200, 260].map(y => (
        <line key={y} x1="60" y1={y} x2="660" y2={y} stroke="rgba(139,92,246,0.08)" strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Linear line (savings) */}
      <motion.path d={linearPath} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 4"
        initial={{ pathLength: 0 }} animate={{ pathLength: animPhase >= 1 ? 1 : 0 }} transition={{ duration: 1.2 }} />
      {/* Exponential line (investing) */}
      <motion.path d={expPath} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: animPhase >= 1 ? 1 : 0 }} transition={{ duration: 1.5, delay: 0.3 }} />
      {/* Area under exp curve */}
      <motion.path d={`${expPath} L660,280 L60,280 Z`} fill="url(#expGrad3)"
        initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 2 ? 0.6 : 0 }} transition={{ duration: 0.8 }} />
      {/* Labels */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 2 ? 1 : 0 }}>
        <text x="60" y="300" fill="rgba(255,255,255,0.5)" fontSize="13" textAnchor="middle">Age 25</text>
        <text x="360" y="300" fill="rgba(255,255,255,0.5)" fontSize="13" textAnchor="middle">Age 45</text>
        <text x="660" y="300" fill="rgba(255,255,255,0.5)" fontSize="13" textAnchor="middle">Age 65</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 3 ? 1 : 0 }}>
        <text x="660" y="230" fill="#ef4444" fontSize="13" fontWeight="bold" textAnchor="end">Savings: $13K</text>
        <text x="660" y="12" fill="#8b5cf6" fontSize="15" fontWeight="bold" textAnchor="end">Invested: $175K</text>
        <circle cx="660" cy="220" r="5" fill="#ef4444" />
        <circle cx="660" cy="15" r="6" fill="#8b5cf6" />
      </motion.g>
    </svg>
  );
}

/** Lesson 4: Stocks vs Bonds diverging in 2008 */
export function HookChartStocksBonds({ animPhase }: { animPhase: number }) {
  // Stocks line: up, then crash 2008, then recovery
  const stockPath = "M60,180 Q120,170 180,150 Q220,140 260,130 L300,135 Q340,200 380,260 L400,250 Q440,220 480,170 Q540,120 600,90 L660,70";
  // Bonds line: gradual up, spike during 2008
  const bondPath = "M60,210 Q120,205 180,200 Q220,195 260,192 L300,188 Q340,160 380,140 L400,150 Q440,160 480,170 Q540,175 600,165 L660,155";
  return (
    <svg viewBox="0 0 700 320" className="w-full h-auto" style={{ minHeight: '280px' }}>
      <defs>
        <linearGradient id="crashZone" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
          <stop offset="30%" stopColor="#ef4444" stopOpacity="0.08" />
          <stop offset="70%" stopColor="#ef4444" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[80, 140, 200, 260].map(y => (
        <line key={y} x1="60" y1={y} x2="660" y2={y} stroke="rgba(139,92,246,0.08)" strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* 2008 crash zone highlight */}
      <motion.rect x="280" y="20" width="140" height="270" fill="url(#crashZone)" rx="8"
        initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 1 ? 1 : 0 }} transition={{ duration: 0.6 }} />
      <motion.text x="350" y="45" textAnchor="middle" fill="rgba(239,68,68,0.6)" fontSize="11" fontWeight="bold"
        initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 1 ? 1 : 0 }}>2008 CRISIS</motion.text>
      {/* Bond line */}
      <motion.path d={bondPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: animPhase >= 1 ? 1 : 0 }} transition={{ duration: 1.5 }} />
      {/* Stock line */}
      <motion.path d={stockPath} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: animPhase >= 1 ? 1 : 0 }} transition={{ duration: 1.5, delay: 0.2 }} />
      {/* Labels */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 2 ? 1 : 0 }}>
        <text x="60" y="300" fill="rgba(255,255,255,0.5)" fontSize="13" textAnchor="middle">2006</text>
        <text x="350" y="300" fill="rgba(255,255,255,0.5)" fontSize="13" textAnchor="middle">2008</text>
        <text x="660" y="300" fill="rgba(255,255,255,0.5)" fontSize="13" textAnchor="middle">2014</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 3 ? 1 : 0 }}>
        {/* Stock label */}
        <rect x="550" y="56" width="100" height="22" rx="4" fill="rgba(16,185,129,0.15)" />
        <text x="600" y="72" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">Stocks</text>
        {/* Bond label */}
        <rect x="550" y="142" width="100" height="22" rx="4" fill="rgba(59,130,246,0.15)" />
        <text x="600" y="158" textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="bold">Bonds</text>
        {/* Annotations */}
        <text x="380" y="275" fill="#ef4444" fontSize="11" fontWeight="600">Stocks: −38%</text>
        <text x="380" y="130" fill="#3b82f6" fontSize="11" fontWeight="600">Bonds: +26%</text>
      </motion.g>
    </svg>
  );
}

/** Lesson 5: Single stock vs diversified comparison bars */
export function HookChartDiversification({ animPhase }: { animPhase: number }) {
  return (
    <svg viewBox="0 0 700 320" className="w-full h-auto" style={{ minHeight: '280px' }}>
      {/* Center line (0%) */}
      <line x1="60" y1="160" x2="640" y2="160" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <text x="50" y="164" textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="11">0%</text>
      {/* Grid */}
      <line x1="60" y1="80" x2="640" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="4 4" />
      <text x="50" y="84" textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="10">+40%</text>
      <line x1="60" y1="240" x2="640" y2="240" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="4 4" />
      <text x="50" y="244" textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="10">-40%</text>
      <line x1="60" y1="290" x2="640" y2="290" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="4 4" />
      <text x="50" y="294" textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="10">-65%</text>

      {/* Meta bar - drops to -64% */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 1 ? 1 : 0 }}>
        <motion.rect x="140" y="160" width="140" height="0" rx="8" fill="rgba(239,68,68,0.25)" stroke="#ef4444" strokeWidth="2"
          animate={{ height: animPhase >= 2 ? 128 : 0 }} transition={{ duration: 0.8, delay: 0.3 }} />
        <motion.text x="210" y="155" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold"
          initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 2 ? 1 : 0 }} transition={{ delay: 0.8 }}>Meta (META)</motion.text>
        <motion.text x="210" y="300" textAnchor="middle" fill="#ef4444" fontSize="22" fontWeight="black"
          initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 3 ? 1 : 0 }} transition={{ delay: 1.2 }}>−64%</motion.text>
      </motion.g>

      {/* S&P 500 bar - drops to -18% */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 1 ? 1 : 0 }}>
        <motion.rect x="420" y="160" width="140" height="0" rx="8" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="2"
          animate={{ height: animPhase >= 2 ? 36 : 0 }} transition={{ duration: 0.8, delay: 0.5 }} />
        <motion.text x="490" y="155" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold"
          initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 2 ? 1 : 0 }} transition={{ delay: 0.8 }}>S&P 500</motion.text>
        <motion.text x="490" y="210" textAnchor="middle" fill="#10b981" fontSize="22" fontWeight="black"
          initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 3 ? 1 : 0 }} transition={{ delay: 1.2 }}>−18%</motion.text>
      </motion.g>

      {/* Year label */}
      <motion.text x="350" y="30" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="14" fontWeight="600"
        initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 1 ? 1 : 0 }}>2022 Performance</motion.text>
    </svg>
  );
}

/* ═══════════════════════════════════════════
   STAKES CARD ILLUSTRATIONS — Unique per lesson
   ═══════════════════════════════════════════ */

/** Lesson 2: Single stock crashing */
export function StakesIllustrationRisk() {
  return (
    <svg viewBox="0 0 320 180" className="w-full" style={{ maxWidth: '380px' }}>
      {/* Stock line crashing */}
      <motion.path d="M30,40 Q60,35 90,38 L120,30 Q150,80 180,120 Q210,150 240,158 L280,160"
        fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
      {/* 80% loss label */}
      <rect x="200" y="130" width="90" height="30" rx="6" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
      <text x="245" y="150" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">−80%</text>
      {/* Arrow down */}
      <line x1="160" y1="70" x2="160" y2="140" stroke="#ef4444" strokeWidth="2" />
      <polygon points="154,138 160,150 166,138" fill="#ef4444" />
      <text x="30" y="30" fill="rgba(255,255,255,0.4)" fontSize="10">$10,000</text>
      <text x="240" y="175" fill="rgba(255,255,255,0.3)" fontSize="10">$2,000</text>
    </svg>
  );
}

/** Lesson 2: Diversified portfolio stability */
export function StakesIllustrationDiversified() {
  return (
    <svg viewBox="0 0 320 180" className="w-full" style={{ maxWidth: '380px' }}>
      {/* Diversified line - shallow dip then recovery */}
      <motion.path d="M30,60 Q60,55 90,58 L120,55 Q150,80 180,90 Q210,85 240,70 L280,50"
        fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.3 }} />
      {/* Only -20% label */}
      <rect x="130" y="95" width="80" height="26" rx="6" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
      <text x="170" y="113" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="bold">−20%</text>
      {/* Recovery arrow */}
      <line x1="240" y1="90" x2="240" y2="55" stroke="#10b981" strokeWidth="2" />
      <polygon points="234,57 240,45 246,57" fill="#10b981" />
      <text x="250" y="42" fill="#10b981" fontSize="10" fontWeight="600">Recovery</text>
      <text x="30" y="50" fill="rgba(255,255,255,0.4)" fontSize="10">$10,000</text>
    </svg>
  );
}

/** Lesson 3: Late starter (small result) */
export function StakesIllustrationLateStart() {
  return (
    <svg viewBox="0 0 320 180" className="w-full" style={{ maxWidth: '380px' }}>
      {/* Timeline bar */}
      <rect x="30" y="85" width="260" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
      {/* Late start marker */}
      <circle cx="120" cy="87" r="6" fill="#ef4444" stroke="#ef4444" strokeWidth="2" />
      <text x="120" y="75" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">Start: 32</text>
      {/* End marker */}
      <circle cx="270" cy="87" r="6" fill="rgba(255,255,255,0.3)" />
      <text x="270" y="75" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">Age 65</text>
      {/* Small stack */}
      <rect x="230" y="105" width="80" height="50" rx="8" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" />
      <text x="270" y="135" textAnchor="middle" fill="#ef4444" fontSize="16" fontWeight="bold">$540K</text>
      <text x="160" y="170" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10">33 years of investing</text>
    </svg>
  );
}

/** Lesson 3: Early starter (huge result) */
export function StakesIllustrationEarlyStart() {
  return (
    <svg viewBox="0 0 320 180" className="w-full" style={{ maxWidth: '380px' }}>
      {/* Timeline bar */}
      <rect x="30" y="85" width="260" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
      {/* Early start marker */}
      <circle cx="50" cy="87" r="6" fill="#10b981" stroke="#10b981" strokeWidth="2" />
      <text x="50" y="75" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">Start: 22</text>
      {/* End marker */}
      <circle cx="270" cy="87" r="6" fill="rgba(255,255,255,0.3)" />
      <text x="270" y="75" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">Age 65</text>
      {/* Large stack */}
      <rect x="200" y="95" width="100" height="75" rx="8" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      <text x="250" y="138" textAnchor="middle" fill="#10b981" fontSize="18" fontWeight="bold">$1.4M</text>
      {/* Sparkle */}
      <text x="260" y="110" fill="#10b981" fontSize="14">✦</text>
      <text x="160" y="170" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10">43 years of investing</text>
    </svg>
  );
}

/** Lesson 4: All-stocks crash */
export function StakesIllustrationAllStocks() {
  return (
    <svg viewBox="0 0 320 180" className="w-full" style={{ maxWidth: '380px' }}>
      {/* Bar chart showing loss */}
      <rect x="60" y="30" width="80" height="110" rx="8" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
      <text x="100" y="80" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="12">$100K</text>
      {/* Arrow down */}
      <line x1="170" y1="70" x2="200" y2="100" stroke="rgba(239,68,68,0.5)" strokeWidth="2" />
      <polygon points="196,96 206,104 200,92" fill="rgba(239,68,68,0.5)" />
      {/* After crash */}
      <rect x="210" y="80" width="80" height="60" rx="8" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />
      <text x="250" y="115" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">$61.5K</text>
      <text x="250" y="155" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="600">−38.5%</text>
      <text x="100" y="160" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10">Before 2008</text>
      <text x="250" y="172" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10">After crash</text>
    </svg>
  );
}

/** Lesson 4: 60/40 balanced */
export function StakesIllustrationBalanced() {
  return (
    <svg viewBox="0 0 320 180" className="w-full" style={{ maxWidth: '380px' }}>
      {/* Before bar */}
      <rect x="60" y="30" width="80" height="110" rx="8" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
      <text x="100" y="80" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="12">$100K</text>
      {/* Arrow (shorter) */}
      <line x1="170" y1="70" x2="200" y2="80" stroke="rgba(245,158,11,0.5)" strokeWidth="2" />
      <polygon points="196,76 206,82 200,72" fill="rgba(245,158,11,0.5)" />
      {/* After - less loss */}
      <rect x="210" y="50" width="80" height="90" rx="8" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.35)" strokeWidth="1.5" />
      <text x="250" y="100" textAnchor="middle" fill="#10b981" fontSize="14" fontWeight="bold">$76K</text>
      <text x="250" y="155" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="600">−24%</text>
      {/* Shield icon suggestion */}
      <rect x="230" y="55" width="40" height="18" rx="4" fill="rgba(59,130,246,0.15)" />
      <text x="250" y="68" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">60/40</text>
      <text x="100" y="160" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10">Before 2008</text>
      <text x="250" y="172" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10">Cushioned</text>
    </svg>
  );
}

/** Lesson 5: Single stock crumbling (Meta) */
export function StakesIllustrationConcentrated() {
  return (
    <svg viewBox="0 0 320 180" className="w-full" style={{ maxWidth: '380px' }}>
      {/* Single large tile cracking */}
      <rect x="100" y="20" width="120" height="100" rx="12" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.3)" strokeWidth="2" />
      {/* Crack lines */}
      <line x1="140" y1="20" x2="160" y2="70" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" />
      <line x1="160" y1="70" x2="180" y2="120" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" />
      <line x1="160" y1="70" x2="130" y2="100" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
      <text x="160" y="65" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">META</text>
      <text x="160" y="85" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11">100% allocation</text>
      {/* Loss label */}
      <text x="160" y="145" textAnchor="middle" fill="#ef4444" fontSize="18" fontWeight="black">−64%</text>
      <text x="160" y="165" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10">In a single year</text>
    </svg>
  );
}

/** Lesson 5: Diversified grid staying intact */
export function StakesIllustrationDiversifiedGrid() {
  const tiles = [
    { x: 60, y: 20, w: 55, h: 40, label: 'AAPL', color: 'rgba(16,185,129,0.15)' },
    { x: 120, y: 20, w: 55, h: 40, label: 'JNJ', color: 'rgba(59,130,246,0.15)' },
    { x: 180, y: 20, w: 55, h: 40, label: 'XOM', color: 'rgba(245,158,11,0.15)' },
    { x: 60, y: 65, w: 55, h: 40, label: 'JPM', color: 'rgba(139,92,246,0.15)' },
    { x: 120, y: 65, w: 55, h: 40, label: 'PG', color: 'rgba(6,182,212,0.15)' },
    { x: 180, y: 65, w: 55, h: 40, label: 'UNH', color: 'rgba(16,185,129,0.12)' },
  ];
  return (
    <svg viewBox="0 0 320 180" className="w-full" style={{ maxWidth: '380px' }}>
      {tiles.map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
          <rect x={t.x} y={t.y} width={t.w} height={t.h} rx="6" fill={t.color} stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
          <text x={t.x + t.w / 2} y={t.y + t.h / 2 + 4} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="600">{t.label}</text>
        </motion.g>
      ))}
      {/* Shield overlay */}
      <rect x="60" y="110" width="175" height="30" rx="6" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
      <text x="147" y="130" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">500 stocks = −18%</text>
      <text x="147" y="160" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10">Diversified portfolio</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════
   TEACHING SLIDE DIAGRAMS — Unique per lesson
   ═══════════════════════════════════════════ */

/** Lesson 2: Risk-Return Spectrum (horizontal with positioned dots) */
export function DiagramRiskSpectrum() {
  const assets = [
    { x: 55, label: 'Savings', risk: 'Very Low', ret: '~2%', color: '#3b82f6' },
    { x: 155, label: 'Bonds', risk: 'Low', ret: '~5%', color: '#06b6d4' },
    { x: 255, label: 'Real Estate', risk: 'Medium', ret: '~8%', color: '#10b981' },
    { x: 345, label: 'Index Funds', risk: 'Med-High', ret: '~10%', color: '#8b5cf6' },
    { x: 435, label: 'Stocks', risk: 'High', ret: '~12%+', color: '#f59e0b' },
  ];
  return (
    <svg viewBox="0 0 500 480" className="w-full h-auto" style={{ minHeight: '420px' }}>
      {/* Title */}
      <text x="250" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Risk-Return Spectrum</text>
      {/* Horizontal gradient bar */}
      <defs>
        <linearGradient id="spectrumGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect x="30" y="230" width="440" height="8" rx="4" fill="url(#spectrumGrad)" opacity="0.4" />
      <text x="30" y="260" fill="rgba(255,255,255,0.4)" fontSize="11">Low Risk</text>
      <text x="470" y="260" textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="11">High Risk</text>
      {/* Asset cards */}
      {assets.map((a, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
          <rect x={a.x - 40} y={70 + i * 28} width="80" height="24" rx="12" fill={`${a.color}22`} stroke={a.color} strokeWidth="1.5" />
          <text x={a.x} y={86 + i * 28} textAnchor="middle" fill={a.color} fontSize="11" fontWeight="bold">{a.label}</text>
          {/* Connector line to spectrum */}
          <line x1={a.x} y1={94 + i * 28} x2={a.x} y2="228" stroke={`${a.color}44`} strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={a.x} cy="234" r="8" fill={a.color} fillOpacity="0.3" stroke={a.color} strokeWidth="2" />
          <circle cx={a.x} cy="234" r="3" fill={a.color} />
          {/* Return label below */}
          <text x={a.x} y="285" textAnchor="middle" fill={a.color} fontSize="13" fontWeight="bold">{a.ret}</text>
          <text x={a.x} y="300" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9">{a.risk}</text>
        </motion.g>
      ))}
      {/* Key insight */}
      <rect x="60" y="340" width="380" height="60" rx="12" fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
      <text x="250" y="365" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="12">Higher risk = Higher potential return</text>
      <text x="250" y="385" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11">but also higher potential loss</text>
    </svg>
  );
}

/** Lesson 3: Snowball rolling downhill getting larger */
export function DiagramSnowball() {
  return (
    <svg viewBox="0 0 500 480" className="w-full h-auto" style={{ minHeight: '420px' }}>
      <text x="250" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">The Snowball Effect</text>
      {/* Hill slope */}
      <motion.path d="M80,80 Q250,120 350,250 Q400,340 440,420" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
      {/* Small snowball at top */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <circle cx="100" cy="85" r="18" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.4)" strokeWidth="2" />
        <text x="100" y="90" textAnchor="middle" fill="#8b5cf6" fontSize="10" fontWeight="bold">$10K</text>
        <text x="145" y="78" fill="rgba(255,255,255,0.4)" fontSize="10">Year 0</text>
      </motion.g>
      {/* Medium snowball */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <circle cx="250" cy="165" r="35" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.35)" strokeWidth="2" />
        <text x="250" y="162" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="bold">$25K</text>
        <text x="250" y="178" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9">Year 10</text>
        <text x="305" y="155" fill="rgba(255,255,255,0.35)" fontSize="10">×2.5</text>
      </motion.g>
      {/* Large snowball */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        <circle cx="350" cy="290" r="55" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.3)" strokeWidth="2.5" />
        <text x="350" y="285" textAnchor="middle" fill="#8b5cf6" fontSize="15" fontWeight="bold">$67K</text>
        <text x="350" y="305" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10">Year 20</text>
        <text x="420" y="280" fill="rgba(255,255,255,0.35)" fontSize="10">×6.7</text>
      </motion.g>
      {/* Massive snowball */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        <circle cx="420" cy="400" r="70" fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.25)" strokeWidth="3" />
        <text x="420" y="392" textAnchor="middle" fill="#8b5cf6" fontSize="18" fontWeight="bold">$175K</text>
        <text x="420" y="415" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11">Year 30</text>
        <text x="420" y="435" textAnchor="middle" fill="rgba(139,92,246,0.5)" fontSize="10">×17.5</text>
      </motion.g>
      {/* Curved arrows between snowballs */}
      <motion.path d="M118,95 Q170,100 230,140" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" markerEnd="url(#arrowP)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.4 }} />
      <motion.path d="M275,190 Q300,220 330,250" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9, duration: 0.4 }} />
      <motion.path d="M380,330 Q400,350 410,370" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.3, duration: 0.4 }} />
    </svg>
  );
}

/** Lesson 4: Stock vs Bond certificate comparison */
export function DiagramStockVsBond() {
  return (
    <svg viewBox="0 0 500 500" className="w-full h-auto" style={{ minHeight: '420px' }}>
      <text x="250" y="28" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Stocks vs. Bonds</text>
      {/* Stock certificate (left) */}
      <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        <rect x="20" y="50" width="210" height="200" rx="14" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.35)" strokeWidth="2" />
        <text x="125" y="80" textAnchor="middle" fill="#10b981" fontSize="15" fontWeight="bold">📈 STOCK</text>
        <text x="125" y="100" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">= Ownership</text>
        <line x1="40" y1="112" x2="210" y2="112" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
        {/* Attributes */}
        {['Variable returns', 'Unlimited upside', 'Higher volatility', 'No maturity date', 'Dividends possible'].map((t, i) => (
          <g key={i}>
            <circle cx="42" cy={130 + i * 22} r="3" fill="#10b981" />
            <text x="52" y={134 + i * 22} fill="rgba(255,255,255,0.6)" fontSize="11">{t}</text>
          </g>
        ))}
      </motion.g>
      {/* VS divider */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <circle cx="250" cy="150" r="18" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <text x="250" y="155" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="12" fontWeight="bold">VS</text>
      </motion.g>
      {/* Bond certificate (right) */}
      <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
        <rect x="270" y="50" width="210" height="200" rx="14" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.35)" strokeWidth="2" />
        <text x="375" y="80" textAnchor="middle" fill="#3b82f6" fontSize="15" fontWeight="bold">📜 BOND</text>
        <text x="375" y="100" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">= Loan</text>
        <line x1="290" y1="112" x2="460" y2="112" stroke="rgba(59,130,246,0.2)" strokeWidth="1" />
        {['Fixed coupon rate', 'Limited upside', 'Lower volatility', 'Set maturity date', 'Guaranteed income'].map((t, i) => (
          <g key={i}>
            <circle cx="292" cy={130 + i * 22} r="3" fill="#3b82f6" />
            <text x="302" y={134 + i * 22} fill="rgba(255,255,255,0.6)" fontSize="11">{t}</text>
          </g>
        ))}
      </motion.g>
      {/* Historical comparison */}
      <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <rect x="40" y="280" width="420" height="100" rx="14" fill="rgba(255,255,255,0.02)" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />
        <text x="250" y="305" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="12" fontWeight="600">Historical Average Annual Returns</text>
        {/* Bars */}
        <rect x="90" y="320" width="120" height="30" rx="6" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
        <text x="150" y="340" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="bold">Stocks: 10.3%</text>
        <rect x="280" y="320" width="100" height="30" rx="6" fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
        <text x="330" y="340" textAnchor="middle" fill="#3b82f6" fontSize="13" fontWeight="bold">Bonds: 5.1%</text>
      </motion.g>
      {/* Key principle */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <rect x="40" y="400" width="420" height="55" rx="12" fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
        <text x="250" y="422" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="12">Stocks = equity (ownership) → higher risk/return</text>
        <text x="250" y="442" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="12">Bonds = debt (loan) → predictable income</text>
      </motion.g>
    </svg>
  );
}

/** Lesson 5: 2x2 correlation matrix */
export function DiagramCorrelationMatrix() {
  const assets = ['U.S. Stocks', "Int'l Stocks", 'Bonds', 'Real Estate'];
  // Correlation values (simplified): 1.0, 0.85, -0.2, 0.5 | 0.85, 1.0, -0.1, 0.4 | -0.2, -0.1, 1.0, 0.1 | 0.5, 0.4, 0.1, 1.0
  const corr = [
    [1.0, 0.85, -0.2, 0.5],
    [0.85, 1.0, -0.1, 0.4],
    [-0.2, -0.1, 1.0, 0.1],
    [0.5, 0.4, 0.1, 1.0],
  ];
  const getColor = (v: number) => {
    if (v >= 0.8) return 'rgba(239,68,68,0.35)';
    if (v >= 0.4) return 'rgba(245,158,11,0.25)';
    if (v >= 0) return 'rgba(139,92,246,0.15)';
    return 'rgba(16,185,129,0.3)';
  };
  const getBorder = (v: number) => {
    if (v >= 0.8) return 'rgba(239,68,68,0.5)';
    if (v >= 0.4) return 'rgba(245,158,11,0.4)';
    if (v >= 0) return 'rgba(139,92,246,0.3)';
    return 'rgba(16,185,129,0.5)';
  };
  const cellSize = 85;
  const startX = 130;
  const startY = 90;
  return (
    <svg viewBox="0 0 500 500" className="w-full h-auto" style={{ minHeight: '420px' }}>
      <text x="250" y="28" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Correlation Matrix</text>
      <text x="250" y="50" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11">How assets move relative to each other</text>
      {/* Column headers */}
      {assets.map((a, i) => (
        <text key={`h${i}`} x={startX + i * cellSize + cellSize / 2} y={80} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10" fontWeight="600">{a}</text>
      ))}
      {/* Row headers + cells */}
      {assets.map((a, row) => (
        <g key={`r${row}`}>
          <text x={startX - 8} y={startY + row * cellSize + cellSize / 2 + 4} textAnchor="end" fill="rgba(255,255,255,0.6)" fontSize="10" fontWeight="600">{a}</text>
          {corr[row].map((v, col) => (
            <motion.g key={`${row}-${col}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * (row * 4 + col) }}>
              <rect x={startX + col * cellSize} y={startY + row * cellSize} width={cellSize - 4} height={cellSize - 4} rx="8"
                fill={getColor(v)} stroke={getBorder(v)} strokeWidth="1.5" />
              <text x={startX + col * cellSize + cellSize / 2 - 2} y={startY + row * cellSize + cellSize / 2 + 5}
                textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{v.toFixed(1)}</text>
            </motion.g>
          ))}
        </g>
      ))}
      {/* Legend */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <rect x="50" y="440" width="400" height="45" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />
        <rect x="70" y="455" width="18" height="12" rx="3" fill="rgba(239,68,68,0.35)" />
        <text x="93" y="465" fill="rgba(255,255,255,0.5)" fontSize="9">High (+0.8)</text>
        <rect x="160" y="455" width="18" height="12" rx="3" fill="rgba(245,158,11,0.25)" />
        <text x="183" y="465" fill="rgba(255,255,255,0.5)" fontSize="9">Moderate</text>
        <rect x="250" y="455" width="18" height="12" rx="3" fill="rgba(139,92,246,0.15)" />
        <text x="273" y="465" fill="rgba(255,255,255,0.5)" fontSize="9">Low</text>
        <rect x="330" y="455" width="18" height="12" rx="3" fill="rgba(16,185,129,0.3)" />
        <text x="353" y="465" fill="rgba(255,255,255,0.5)" fontSize="9">Negative ✓</text>
      </motion.g>
    </svg>
  );
}
