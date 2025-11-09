import { ComposedChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, Line, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandlestickChartProps {
  pattern: string;
  height?: number;
}

// Generate synthetic candlestick data based on pattern type
const generatePatternData = (pattern: string): CandleData[] => {
  const basePrice = 100;
  const data: CandleData[] = [];

  switch (pattern) {
    case "uptrend": {
      // Clear uptrend with higher highs and higher lows
      for (let i = 0; i < 30; i++) {
        const trendUp = i * 1.5;
        const noise = Math.random() * 2 - 1;
        const open = basePrice + trendUp + noise;
        const close = open + Math.random() * 3;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random() * 1,
          volume: Math.random() * 1000 + 500
        });
      }
      break;
    }

    case "downtrend": {
      // Clear downtrend with lower highs and lower lows
      for (let i = 0; i < 30; i++) {
        const trendDown = -i * 1.5;
        const noise = Math.random() * 2 - 1;
        const open = basePrice + trendDown + noise;
        const close = open - Math.random() * 3;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1,
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 1000 + 500
        });
      }
      break;
    }

    case "sideways": {
      // Sideways consolidation - horizontal movement
      for (let i = 0; i < 30; i++) {
        const noise = Math.random() * 4 - 2;
        const open = basePrice + noise;
        const close = open + (Math.random() * 2 - 1);
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 800 + 400
        });
      }
      break;
    }

    case "breakout": {
      // Consolidation then sharp breakout
      for (let i = 0; i < 20; i++) {
        const noise = Math.random() * 2 - 1;
        const open = basePrice + noise;
        const close = open + (Math.random() * 1 - 0.5);
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 600 + 300
        });
      }
      // Breakout candles
      for (let i = 20; i < 30; i++) {
        const boost = (i - 19) * 3;
        const open = basePrice + boost;
        const close = open + Math.random() * 4 + 2;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: close + Math.random() * 2,
          low: open - Math.random(),
          volume: Math.random() * 1500 + 1000
        });
      }
      break;
    }

    case "pullback": {
      // Uptrend with a pullback
      for (let i = 0; i < 15; i++) {
        const trendUp = i * 2;
        const open = basePrice + trendUp;
        const close = open + Math.random() * 3;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1000 + 500
        });
      }
      // Pullback
      for (let i = 15; i < 20; i++) {
        const pullback = (i - 15) * -2;
        const open = basePrice + 30 + pullback;
        const close = open - Math.random() * 2;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 800 + 400
        });
      }
      // Resume uptrend
      for (let i = 20; i < 30; i++) {
        const resume = (i - 20) * 2;
        const open = basePrice + 20 + resume;
        const close = open + Math.random() * 3;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1000 + 500
        });
      }
      break;
    }

    case "reversal": {
      // Downtrend then reversal to uptrend
      for (let i = 0; i < 15; i++) {
        const trendDown = -i * 1.5;
        const open = basePrice + trendDown;
        const close = open - Math.random() * 2;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 900 + 400
        });
      }
      // Reversal point
      for (let i = 15; i < 30; i++) {
        const trendUp = (i - 15) * 2;
        const open = basePrice - 22 + trendUp;
        const close = open + Math.random() * 3;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1200 + 600
        });
      }
      break;
    }

    case "double-top": {
      // Rise, peak, dip, peak again, then fall
      for (let i = 0; i < 10; i++) {
        const rise = i * 3;
        const open = basePrice + rise;
        const close = open + Math.random() * 2;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1000 + 500
        });
      }
      // Dip
      for (let i = 10; i < 15; i++) {
        const dip = (i - 10) * -2;
        const open = basePrice + 30 + dip;
        const close = open - Math.random() * 1.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 800 + 400
        });
      }
      // Second peak
      for (let i = 15; i < 20; i++) {
        const rise = (i - 15) * 2;
        const open = basePrice + 20 + rise;
        const close = open + Math.random() * 1.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1000 + 500
        });
      }
      // Fall
      for (let i = 20; i < 30; i++) {
        const fall = (i - 20) * -2.5;
        const open = basePrice + 30 + fall;
        const close = open - Math.random() * 2;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 1100 + 600
        });
      }
      break;
    }

    case "double-bottom": {
      // Fall, bottom, rise, bottom again, then rally
      for (let i = 0; i < 10; i++) {
        const fall = -i * 3;
        const open = basePrice + fall;
        const close = open - Math.random() * 2;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 1000 + 500
        });
      }
      // Rise
      for (let i = 10; i < 15; i++) {
        const rise = (i - 10) * 2;
        const open = basePrice - 30 + rise;
        const close = open + Math.random() * 1.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 800 + 400
        });
      }
      // Second bottom
      for (let i = 15; i < 20; i++) {
        const fall = (i - 15) * -2;
        const open = basePrice - 20 + fall;
        const close = open - Math.random() * 1.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 1000 + 500
        });
      }
      // Rally
      for (let i = 20; i < 30; i++) {
        const rally = (i - 20) * 3;
        const open = basePrice - 30 + rally;
        const close = open + Math.random() * 2.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1200 + 700
        });
      }
      break;
    }

    case "head-shoulders": {
      // Left shoulder, head (peak), right shoulder, then fall
      // Left shoulder
      for (let i = 0; i < 7; i++) {
        const rise = i * 2;
        const open = basePrice + rise;
        const close = open + Math.random() * 1.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1000 + 500
        });
      }
      // Dip
      for (let i = 7; i < 10; i++) {
        const dip = (i - 7) * -2;
        const open = basePrice + 14 + dip;
        const close = open - Math.random() * 1.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 800 + 400
        });
      }
      // Head (highest peak)
      for (let i = 10; i < 15; i++) {
        const rise = (i - 10) * 3;
        const open = basePrice + 8 + rise;
        const close = open + Math.random() * 2;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 2,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1100 + 600
        });
      }
      // Dip again
      for (let i = 15; i < 18; i++) {
        const dip = (i - 15) * -3;
        const open = basePrice + 23 + dip;
        const close = open - Math.random() * 2;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 900 + 500
        });
      }
      // Right shoulder
      for (let i = 18; i < 22; i++) {
        const rise = (i - 18) * 2;
        const open = basePrice + 14 + rise;
        const close = open + Math.random() * 1.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1000 + 500
        });
      }
      // Fall
      for (let i = 22; i < 30; i++) {
        const fall = (i - 22) * -2.5;
        const open = basePrice + 22 + fall;
        const close = open - Math.random() * 2;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 1100 + 600
        });
      }
      break;
    }

    case "cup-handle": {
      // U-shaped cup followed by small dip (handle) then breakout
      // Left side of cup
      for (let i = 0; i < 8; i++) {
        const fall = -i * 2;
        const open = basePrice + fall;
        const close = open - Math.random() * 1.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 900 + 400
        });
      }
      // Bottom of cup
      for (let i = 8; i < 12; i++) {
        const noise = Math.random() * 2 - 1;
        const open = basePrice - 16 + noise;
        const close = open + (Math.random() * 1 - 0.5);
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 700 + 300
        });
      }
      // Right side of cup
      for (let i = 12; i < 20; i++) {
        const rise = (i - 12) * 2;
        const open = basePrice - 16 + rise;
        const close = open + Math.random() * 1.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 900 + 500
        });
      }
      // Handle (small dip)
      for (let i = 20; i < 24; i++) {
        const dip = (i - 20) * -1.5;
        const open = basePrice + dip;
        const close = open - Math.random();
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 600 + 300
        });
      }
      // Breakout
      for (let i = 24; i < 30; i++) {
        const breakout = (i - 24) * 3;
        const open = basePrice - 6 + breakout;
        const close = open + Math.random() * 2.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 2,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1300 + 800
        });
      }
      break;
    }

    case "triangle": {
      // Converging highs and lows
      for (let i = 0; i < 30; i++) {
        const upperBound = basePrice + 20 - (i * 0.5);
        const lowerBound = basePrice - (i * 0.3);
        const range = upperBound - lowerBound;
        const open = lowerBound + Math.random() * range;
        const close = lowerBound + Math.random() * range;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.min(upperBound, Math.max(open, close) + Math.random() * (range * 0.2)),
          low: Math.max(lowerBound, Math.min(open, close) - Math.random() * (range * 0.2)),
          volume: Math.random() * 800 + 400
        });
      }
      break;
    }

    case "flag": {
      // Sharp move up (pole) then small consolidation (flag)
      // Pole
      for (let i = 0; i < 10; i++) {
        const rise = i * 4;
        const open = basePrice + rise;
        const close = open + Math.random() * 3;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 2,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1500 + 1000
        });
      }
      // Flag (consolidation)
      for (let i = 10; i < 20; i++) {
        const drift = (i - 10) * -0.5;
        const noise = Math.random() * 2 - 1;
        const open = basePrice + 40 + drift + noise;
        const close = open + (Math.random() * 1 - 0.5);
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 600 + 300
        });
      }
      // Continuation
      for (let i = 20; i < 30; i++) {
        const rise = (i - 20) * 3;
        const open = basePrice + 35 + rise;
        const close = open + Math.random() * 2.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1400 + 900
        });
      }
      break;
    }

    case "wedge": {
      // Converging trendlines sloping upward
      for (let i = 0; i < 30; i++) {
        const upperTrend = basePrice + (i * 1.5);
        const lowerTrend = basePrice + (i * 1.2);
        const range = upperTrend - lowerTrend;
        const open = lowerTrend + Math.random() * range;
        const close = lowerTrend + Math.random() * range;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.min(upperTrend, Math.max(open, close) + Math.random() * (range * 0.3)),
          low: Math.max(lowerTrend, Math.min(open, close) - Math.random() * (range * 0.3)),
          volume: Math.random() * 700 + 400
        });
      }
      break;
    }

    case "support-bounce": {
      // Price tests support level and bounces
      for (let i = 0; i < 10; i++) {
        const fall = -i * 2;
        const open = basePrice + fall;
        const close = open - Math.random() * 1.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 900 + 400
        });
      }
      // Touch support (around 80)
      for (let i = 10; i < 15; i++) {
        const noise = Math.random() * 1 - 0.5;
        const open = basePrice - 20 + noise;
        const close = open + (Math.random() * 0.5);
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 0.5,
          low: Math.min(open, close) - Math.random() * 0.5,
          volume: Math.random() * 1200 + 700
        });
      }
      // Bounce strongly
      for (let i = 15; i < 30; i++) {
        const bounce = (i - 15) * 2.5;
        const open = basePrice - 20 + bounce;
        const close = open + Math.random() * 2.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1300 + 800
        });
      }
      break;
    }

    case "resistance-bounce": {
      // Price tests resistance and bounces down
      for (let i = 0; i < 10; i++) {
        const rise = i * 2;
        const open = basePrice + rise;
        const close = open + Math.random() * 1.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 900 + 400
        });
      }
      // Touch resistance (around 120)
      for (let i = 10; i < 15; i++) {
        const noise = Math.random() * 1 - 0.5;
        const open = basePrice + 20 + noise;
        const close = open - (Math.random() * 0.5);
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 0.5,
          low: Math.min(open, close) - Math.random() * 0.5,
          volume: Math.random() * 1200 + 700
        });
      }
      // Bounce down
      for (let i = 15; i < 30; i++) {
        const bounce = (i - 15) * -2.5;
        const open = basePrice + 20 + bounce;
        const close = open - Math.random() * 2;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 1300 + 800
        });
      }
      break;
    }

    case "channel": {
      // Upward trending channel
      for (let i = 0; i < 30; i++) {
        const upperChannel = basePrice + (i * 1.5) + 10;
        const lowerChannel = basePrice + (i * 1.5) - 5;
        const position = Math.sin(i * 0.4) * 0.5 + 0.5; // Oscillate within channel
        const priceInChannel = lowerChannel + (upperChannel - lowerChannel) * position;
        const open = priceInChannel + (Math.random() * 2 - 1);
        const close = priceInChannel + (Math.random() * 2 - 1);
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 800 + 400
        });
      }
      break;
    }

    case "range-bound": {
      // Clear range between support and resistance
      const resistance = basePrice + 15;
      const support = basePrice - 15;
      for (let i = 0; i < 30; i++) {
        const position = Math.sin(i * 0.5) * 0.5 + 0.5;
        const priceInRange = support + (resistance - support) * position;
        const open = priceInRange + (Math.random() * 2 - 1);
        const close = priceInRange + (Math.random() * 2 - 1);
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.min(resistance, Math.max(open, close) + Math.random() * 2),
          low: Math.max(support, Math.min(open, close) - Math.random() * 2),
          volume: Math.random() * 700 + 400
        });
      }
      break;
    }

    case "fakeout": {
      // Consolidation, fake breakout, then reversal
      for (let i = 0; i < 15; i++) {
        const noise = Math.random() * 2 - 1;
        const open = basePrice + noise;
        const close = open + (Math.random() * 1 - 0.5);
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 600 + 300
        });
      }
      // Fake breakout
      for (let i = 15; i < 20; i++) {
        const fakeBreak = (i - 15) * 3;
        const open = basePrice + fakeBreak;
        const close = open + Math.random() * 2;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 2,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1000 + 600
        });
      }
      // Reversal down
      for (let i = 20; i < 30; i++) {
        const fall = (i - 20) * -2.5;
        const open = basePrice + 15 + fall;
        const close = open - Math.random() * 2.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random() * 2,
          volume: Math.random() * 1100 + 700
        });
      }
      break;
    }

    case "retest": {
      // Breakout, retest, then continuation
      for (let i = 0; i < 10; i++) {
        const noise = Math.random() * 2 - 1;
        const open = basePrice + noise;
        const close = open + (Math.random() * 1 - 0.5);
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 600 + 300
        });
      }
      // Breakout
      for (let i = 10; i < 15; i++) {
        const breakout = (i - 10) * 4;
        const open = basePrice + breakout;
        const close = open + Math.random() * 2.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 2,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1400 + 900
        });
      }
      // Retest (pullback to breakout level)
      for (let i = 15; i < 20; i++) {
        const pullback = (i - 15) * -2;
        const open = basePrice + 20 + pullback;
        const close = open - Math.random() * 1.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 800 + 400
        });
      }
      // Continuation up
      for (let i = 20; i < 30; i++) {
        const continuation = (i - 20) * 3;
        const open = basePrice + 10 + continuation;
        const close = open + Math.random() * 2.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1300 + 800
        });
      }
      break;
    }

    case "parabolic": {
      // Exponential acceleration upward
      for (let i = 0; i < 30; i++) {
        const parabolic = Math.pow(i, 1.7) * 0.5;
        const open = basePrice + parabolic;
        const close = open + Math.random() * (i * 0.3);
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * (i * 0.2),
          low: Math.min(open, close) - Math.random() * 0.5,
          volume: Math.random() * (500 + i * 50) + 500
        });
      }
      break;
    }

    case "correction": {
      // Strong uptrend then 10-20% pullback
      for (let i = 0; i < 15; i++) {
        const rise = i * 3;
        const open = basePrice + rise;
        const close = open + Math.random() * 2.5;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1200 + 600
        });
      }
      // Correction (15% drop)
      for (let i = 15; i < 25; i++) {
        const correction = (i - 15) * -2.5;
        const open = basePrice + 45 + correction;
        const close = open - Math.random() * 2;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random() * 1.5,
          volume: Math.random() * 1000 + 500
        });
      }
      // Stabilize
      for (let i = 25; i < 30; i++) {
        const noise = Math.random() * 2 - 1;
        const open = basePrice + 20 + noise;
        const close = open + (Math.random() * 1 - 0.5);
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random(),
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 800 + 400
        });
      }
      break;
    }

    default: {
      // Default to simple uptrend
      for (let i = 0; i < 30; i++) {
        const trendUp = i * 1.5;
        const noise = Math.random() * 2 - 1;
        const open = basePrice + trendUp + noise;
        const close = open + Math.random() * 2;
        data.push({
          time: `Day ${i + 1}`,
          open,
          close,
          high: Math.max(open, close) + Math.random() * 1.5,
          low: Math.min(open, close) - Math.random(),
          volume: Math.random() * 1000 + 500
        });
      }
    }
  }

  return data;
};

// Custom candlestick shape component
const CandlestickShape = (props: any) => {
  const { x, y, width, payload } = props;
  const { open, close, high, low } = payload;

  const isGreen = close > open;
  // Use explicit green for bullish and red for bearish candles
  const color = isGreen ? "hsl(142, 76%, 45%)" : "hsl(0, 84%, 60%)";
  
  const bodyTop = Math.min(open, close);
  const bodyBottom = Math.max(open, close);
  const bodyHeight = Math.abs(close - open);

  // Scale factor for positioning
  const getY = (price: number) => {
    const dataMin = Math.min(...props.data.map((d: CandleData) => d.low));
    const dataMax = Math.max(...props.data.map((d: CandleData) => d.high));
    const range = dataMax - dataMin;
    const chartHeight = props.chartHeight || 400;
    return chartHeight - ((price - dataMin) / range) * chartHeight;
  };

  const wickX = x + width / 2;
  const bodyWidth = Math.max(width * 0.7, 2);
  const bodyX = x + (width - bodyWidth) / 2;

  return (
    <g>
      {/* Wick (high-low line) */}
      <line
        x1={wickX}
        y1={getY(high)}
        x2={wickX}
        y2={getY(low)}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body (open-close rectangle) */}
      <rect
        x={bodyX}
        y={getY(bodyBottom)}
        width={bodyWidth}
        height={Math.max(getY(bodyTop) - getY(bodyBottom), 1)}
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isGreen = data.close > data.open;
    
    return (
      <Card className="p-3 bg-card/95 backdrop-blur-sm border-primary/20">
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-foreground">{data.time}</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <span className="text-muted-foreground">Open:</span>
            <span className="font-medium text-foreground">${data.open.toFixed(2)}</span>
            
            <span className="text-muted-foreground">High:</span>
            <span className="font-medium" style={{ color: 'hsl(142, 76%, 45%)' }}>${data.high.toFixed(2)}</span>
            
            <span className="text-muted-foreground">Low:</span>
            <span className="font-medium" style={{ color: 'hsl(0, 84%, 60%)' }}>${data.low.toFixed(2)}</span>
            
            <span className="text-muted-foreground">Close:</span>
            <span className="font-medium" style={{ color: isGreen ? 'hsl(142, 76%, 45%)' : 'hsl(0, 84%, 60%)' }}>
              ${data.close.toFixed(2)}
            </span>
            
            <span className="text-muted-foreground">Change:</span>
            <span className="font-medium" style={{ color: isGreen ? 'hsl(142, 76%, 45%)' : 'hsl(0, 84%, 60%)' }}>
              {isGreen ? '+' : ''}{((data.close - data.open) / data.open * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </Card>
    );
  }
  return null;
};

export const CandlestickChart = ({ pattern, height = 500 }: CandlestickChartProps) => {
  const data = generatePatternData(pattern);
  
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <defs>
            <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            opacity={0.2}
            vertical={false}
          />
          
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            tickLine={false}
            domain={['dataMin - 5', 'dataMax + 5']}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Volume bars at bottom */}
          <Bar 
            dataKey="volume" 
            fill="url(#gridGradient)" 
            opacity={0.2}
          />
          
          {/* Candlestick bodies */}
          <Bar
            dataKey="close"
            shape={(props: any) => <CandlestickShape {...props} data={data} chartHeight={height - 60} />}
          />
          
          {/* Hidden line for proper scaling */}
          <Line 
            type="monotone" 
            dataKey="high" 
            stroke="transparent" 
            dot={false}
            isAnimationActive={false}
          />
          <Line 
            type="monotone" 
            dataKey="low" 
            stroke="transparent" 
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
