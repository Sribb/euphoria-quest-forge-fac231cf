import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Circle, Text as SvgText, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DataPoint {
  date: string;
  value: number;
}

interface PortfolioChartProps {
  data: DataPoint[];
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  lineColor?: string;
  fillColor?: string;
}

export function PortfolioChart({
  data,
  height = 200,
  showGrid = true,
  showLabels = true,
  lineColor = Colors.dark.success,
  fillColor = Colors.dark.success + '30',
}: PortfolioChartProps) {
  const width = SCREEN_WIDTH - 40;
  const padding = { top: 20, right: 10, bottom: 30, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  if (data.length < 2) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.noData}>Not enough data to display chart</Text>
      </View>
    );
  }

  const values = data.map(d => d.value);
  const minValue = Math.min(...values) * 0.95;
  const maxValue = Math.max(...values) * 1.05;
  const valueRange = maxValue - minValue;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (value: number) => padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;

  // Create path for line
  const linePath = data
    .map((point, index) => {
      const x = getX(index);
      const y = getY(point.value);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  // Create path for fill area
  const fillPath = `${linePath} L ${getX(data.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

  // Calculate change
  const firstValue = data[0].value;
  const lastValue = data[data.length - 1].value;
  const change = ((lastValue - firstValue) / firstValue) * 100;
  const isPositive = change >= 0;

  // Grid lines
  const gridLines = 5;
  const gridStep = valueRange / gridLines;

  return (
    <View style={[styles.container, { height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={lineColor} stopOpacity={0.3} />
            <Stop offset="100%" stopColor={lineColor} stopOpacity={0.05} />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        {showGrid && Array.from({ length: gridLines + 1 }).map((_, i) => {
          const y = padding.top + (i / gridLines) * chartHeight;
          const value = maxValue - (i / gridLines) * valueRange;
          return (
            <React.Fragment key={i}>
              <Line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke={Colors.dark.border}
                strokeWidth={1}
                strokeDasharray="4,4"
              />
              {showLabels && (
                <SvgText
                  x={padding.left - 5}
                  y={y + 4}
                  fontSize={10}
                  fill={Colors.dark.textSecondary}
                  textAnchor="end"
                >
                  ${(value / 1000).toFixed(1)}k
                </SvgText>
              )}
            </React.Fragment>
          );
        })}

        {/* Fill area */}
        <Path d={fillPath} fill="url(#fillGradient)" />

        {/* Line */}
        <Path
          d={linePath}
          stroke={lineColor}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* End point circle */}
        <Circle
          cx={getX(data.length - 1)}
          cy={getY(lastValue)}
          r={5}
          fill={lineColor}
          stroke={Colors.dark.background}
          strokeWidth={2}
        />

        {/* Date labels */}
        {showLabels && [0, Math.floor(data.length / 2), data.length - 1].map((index) => (
          <SvgText
            key={index}
            x={getX(index)}
            y={height - 5}
            fontSize={10}
            fill={Colors.dark.textSecondary}
            textAnchor="middle"
          >
            {data[index].date}
          </SvgText>
        ))}
      </Svg>

      {/* Value indicator */}
      <View style={styles.valueIndicator}>
        <Text style={styles.currentValue}>${lastValue.toLocaleString()}</Text>
        <Text style={[styles.changeValue, { color: isPositive ? Colors.dark.success : Colors.dark.error }]}>
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </Text>
      </View>
    </View>
  );
}

interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  data: CandlestickData[];
  height?: number;
}

export function CandlestickChart({ data, height = 250 }: CandlestickChartProps) {
  const width = SCREEN_WIDTH - 40;
  const padding = { top: 20, right: 10, bottom: 30, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  if (data.length < 2) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.noData}>Not enough data</Text>
      </View>
    );
  }

  const allPrices = data.flatMap(d => [d.high, d.low]);
  const minPrice = Math.min(...allPrices) * 0.99;
  const maxPrice = Math.max(...allPrices) * 1.01;
  const priceRange = maxPrice - minPrice;

  const candleWidth = (chartWidth / data.length) * 0.7;
  const candleGap = (chartWidth / data.length) * 0.3;

  const getY = (price: number) => padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;

  return (
    <View style={[styles.container, { height }]}>
      <Svg width={width} height={height}>
        {/* Grid lines */}
        {Array.from({ length: 5 }).map((_, i) => {
          const y = padding.top + (i / 4) * chartHeight;
          const price = maxPrice - (i / 4) * priceRange;
          return (
            <React.Fragment key={i}>
              <Line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke={Colors.dark.border}
                strokeWidth={1}
                strokeDasharray="4,4"
              />
              <SvgText
                x={padding.left - 5}
                y={y + 4}
                fontSize={10}
                fill={Colors.dark.textSecondary}
                textAnchor="end"
              >
                ${price.toFixed(0)}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Candlesticks */}
        {data.map((candle, index) => {
          const x = padding.left + index * (candleWidth + candleGap) + candleGap / 2;
          const isGreen = candle.close >= candle.open;
          const color = isGreen ? Colors.dark.success : Colors.dark.error;

          const bodyTop = getY(Math.max(candle.open, candle.close));
          const bodyBottom = getY(Math.min(candle.open, candle.close));
          const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

          return (
            <React.Fragment key={index}>
              {/* Wick */}
              <Line
                x1={x + candleWidth / 2}
                y1={getY(candle.high)}
                x2={x + candleWidth / 2}
                y2={getY(candle.low)}
                stroke={color}
                strokeWidth={1}
              />
              {/* Body */}
              <Rect
                x={x}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={isGreen ? color : color}
                stroke={color}
                strokeWidth={1}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
}

export function PieChart({ data, size = 200 }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 10;

  let currentAngle = -90; // Start from top

  const slices = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    return { ...item, pathData, percentage };
  });

  return (
    <View style={styles.pieContainer}>
      <Svg width={size} height={size}>
        {slices.map((slice, index) => (
          <Path
            key={index}
            d={slice.pathData}
            fill={slice.color}
            stroke={Colors.dark.background}
            strokeWidth={2}
          />
        ))}
        {/* Center circle for donut effect */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.5}
          fill={Colors.dark.card}
        />
      </Svg>
      <View style={styles.pieLegend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
            <Text style={styles.legendValue}>
              {((item.value / total) * 100).toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  height?: number;
}

export function BarChart({ data, height = 200 }: BarChartProps) {
  const width = SCREEN_WIDTH - 40;
  const padding = { top: 20, right: 10, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value)) * 1.1;
  const barWidth = (chartWidth / data.length) * 0.7;
  const barGap = (chartWidth / data.length) * 0.3;

  return (
    <View style={[styles.container, { height }]}>
      <Svg width={width} height={height}>
        {/* Grid lines */}
        {Array.from({ length: 5 }).map((_, i) => {
          const y = padding.top + (i / 4) * chartHeight;
          const value = maxValue - (i / 4) * maxValue;
          return (
            <React.Fragment key={i}>
              <Line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke={Colors.dark.border}
                strokeWidth={1}
                strokeDasharray="4,4"
              />
              <SvgText
                x={padding.left - 5}
                y={y + 4}
                fontSize={10}
                fill={Colors.dark.textSecondary}
                textAnchor="end"
              >
                {value.toFixed(0)}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Bars */}
        {data.map((item, index) => {
          const x = padding.left + index * (barWidth + barGap) + barGap / 2;
          const barHeight = (item.value / maxValue) * chartHeight;
          const y = padding.top + chartHeight - barHeight;
          const color = item.color || Colors.dark.primary;

          return (
            <React.Fragment key={index}>
              <Defs>
                <LinearGradient id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={color} stopOpacity={1} />
                  <Stop offset="100%" stopColor={color} stopOpacity={0.6} />
                </LinearGradient>
              </Defs>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={`url(#barGradient${index})`}
                rx={4}
              />
              <SvgText
                x={x + barWidth / 2}
                y={height - 10}
                fontSize={10}
                fill={Colors.dark.textSecondary}
                textAnchor="middle"
              >
                {item.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  noData: {
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 80,
  },
  valueIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    alignItems: 'flex-end',
  },
  currentValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  changeValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  pieContainer: {
    alignItems: 'center',
  },
  pieLegend: {
    marginTop: 16,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 14,
  },
  legendValue: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
});
