import React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  Line,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';

const CHART_H = 160;
const PAD = {t: 14, b: 24, l: 38, r: 12};

const TrendChart = ({
  data = [],
  dates = [],
  refLow,
  refHigh,
  color = '#F59E0B',
  width,
  height = CHART_H,
}) => {
  if (!data || data.length < 2) return null;

  const W = width || 320;
  const H = height;
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  // Y range
  const allVals = [...data];
  if (refLow != null) allVals.push(refLow);
  if (refHigh != null) allVals.push(refHigh);
  const rawMin = Math.min(...allVals);
  const rawMax = Math.max(...allVals);
  const margin = (rawMax - rawMin) * 0.15 || 5;
  const minV = rawMin - margin;
  const maxV = rawMax + margin;
  const range = maxV - minV || 1;

  const toX = i => PAD.l + (i / (data.length - 1)) * cW;
  const toY = v => PAD.t + (1 - (v - minV) / range) * cH;

  // Build line path
  const linePts = data.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`);
  const linePath = 'M' + linePts.join('L');

  // Build area path (fill under line)
  const areaPath =
    linePath +
    `L${toX(data.length - 1).toFixed(1)},${(PAD.t + cH).toFixed(1)}` +
    `L${toX(0).toFixed(1)},${(PAD.t + cH).toFixed(1)}Z`;

  // Grid lines (4 horizontal)
  const gridLines = [];
  for (let g = 0; g <= 3; g++) {
    const gy = PAD.t + (cH * g) / 3;
    const val = maxV - (g / 3) * (maxV - minV);
    gridLines.push({y: gy, val});
  }

  // Ref band
  const hasRefBand = refLow != null && refHigh != null;
  const refTop = hasRefBand ? toY(refHigh) : 0;
  const refBottom = hasRefBand ? toY(refLow) : 0;

  // Dot colors
  const dotColor = v => {
    if (refHigh != null && v > refHigh) return '#DC2626';
    if (refLow != null && refLow > 0 && v < refLow) return '#D97706';
    if (refHigh != null && v > refHigh * 0.9 && v <= refHigh) return '#D97706';
    return '#16A34A';
  };

  // Y axis labels
  const yLabels = gridLines.map(g => {
    const v = g.val;
    return {y: g.y, label: Math.abs(v) >= 100 ? Math.round(v).toString() : v.toFixed(1)};
  });

  // X axis labels — show first, middle, last
  const xLabels = [];
  if (dates.length > 0) {
    xLabels.push({x: toX(0), label: dates[0]});
    if (dates.length > 2) {
      const mid = Math.floor(dates.length / 2);
      xLabels.push({x: toX(mid), label: dates[mid]});
    }
    if (dates.length > 1) {
      xLabels.push({x: toX(dates.length - 1), label: dates[dates.length - 1]});
    }
  }

  return (
    <View style={{marginTop: vs(6)}}>
      <Svg width={W} height={H}>
        <Defs>
          <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.25" />
            <Stop offset="1" stopColor={color} stopOpacity="0.03" />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        {gridLines.map((g, i) => (
          <Line
            key={`grid-${i}`}
            x1={PAD.l}
            y1={g.y}
            x2={W - PAD.r}
            y2={g.y}
            stroke="rgba(0,0,0,0.06)"
            strokeWidth={1}
            strokeDasharray="4,4"
          />
        ))}

        {/* Reference band */}
        {hasRefBand && (
          <Rect
            x={PAD.l}
            y={refTop}
            width={cW}
            height={Math.max(0, refBottom - refTop)}
            fill="rgba(13,148,136,0.08)"
          />
        )}

        {/* Ref high dashed line */}
        {refHigh != null && (
          <Line
            x1={PAD.l}
            y1={toY(refHigh)}
            x2={W - PAD.r}
            y2={toY(refHigh)}
            stroke="rgba(13,148,136,0.45)"
            strokeWidth={1}
            strokeDasharray="5,4"
          />
        )}

        {/* Ref low dashed line */}
        {refLow != null && refLow > 0 && toY(refLow) < PAD.t + cH && (
          <Line
            x1={PAD.l}
            y1={toY(refLow)}
            x2={W - PAD.r}
            y2={toY(refLow)}
            stroke="rgba(100,116,139,0.3)"
            strokeWidth={1}
            strokeDasharray="5,4"
          />
        )}

        {/* Area fill */}
        <Path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <Path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dots */}
        {data.map((v, i) => (
          <React.Fragment key={`dot-${i}`}>
            <Circle
              cx={toX(i)}
              cy={toY(v)}
              r={5}
              fill={dotColor(v)}
              stroke="#fff"
              strokeWidth={2}
            />
          </React.Fragment>
        ))}

        {/* Y axis labels */}
        {yLabels.map((yl, i) => (
          <SvgText
            key={`yl-${i}`}
            x={PAD.l - 6}
            y={yl.y + 4}
            fill="#9CA3AF"
            fontSize={9}
            fontFamily="monospace"
            textAnchor="end">
            {yl.label}
          </SvgText>
        ))}

        {/* X axis labels */}
        {xLabels.map((xl, i) => (
          <SvgText
            key={`xl-${i}`}
            x={xl.x}
            y={H - 4}
            fill="#9CA3AF"
            fontSize={8}
            textAnchor="middle">
            {xl.label}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
};

export default TrendChart;
