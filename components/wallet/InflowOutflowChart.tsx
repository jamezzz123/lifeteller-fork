import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { colors } from '@/theme/colors';
import { formatAmount } from '@/utils/formatAmount';

interface InflowOutflowChartProps {
  totalInflow: number;
  totalOutflow: number;
}

// Chart colors
const INFLOW_COLOR = colors.state.green;
const OUTFLOW_COLOR = '#D97A0D'; // Orange color
const INFLOW_BADGE_BG = colors['green-tint']['100']; // Light green background
const OUTFLOW_BADGE_BG = colors['yellow-tint']['50']; // Light beige background

export function InflowOutflowChart({
  totalInflow,
  totalOutflow,
}: InflowOutflowChartProps) {
  // Calculate percentages for donut chart
  const totalFlow = totalInflow + totalOutflow;
  const inflowPercentage = totalFlow > 0 ? (totalInflow / totalFlow) * 100 : 0;
  const outflowPercentage =
    totalFlow > 0 ? (totalOutflow / totalFlow) * 100 : 0;

  const roundedInflowPercentage = Math.round(inflowPercentage);
  const roundedOutflowPercentage = Math.round(outflowPercentage);

  // Prepare data for PieChart
  const pieData = [
    {
      value: inflowPercentage,
      color: INFLOW_COLOR,
      gradientCenterColor: INFLOW_COLOR,
    },
    {
      value: outflowPercentage,
      color: OUTFLOW_COLOR,
      gradientCenterColor: OUTFLOW_COLOR,
    },
  ];

  // Chart dimensions - larger size with thinner ring
  const chartRadius = 70;
  const innerRadius = 55; // Increased inner radius to reduce thickness
  const chartSize = 160;

  return (
    <View className="flex-row items-center">
      {/* Donut Chart with Percentage Badges */}
      <View
        className="relative mr-6 items-center justify-center"
        style={{ width: chartSize, height: chartSize }}
      >
        <PieChart
          data={pieData}
          donut
          radius={chartRadius}
          innerRadius={innerRadius}
          innerCircleColor={colors['grey-plain']['50']}
        />

        {/* Inflow Percentage Badge (on the green segment, top-right) */}
        <View
          className="absolute items-center justify-center rounded-lg px-2 py-1"
          style={{
            backgroundColor: INFLOW_BADGE_BG,
            top: chartSize / 2 - chartRadius + 10, // Position on the ring
            right: chartSize / 2 - chartRadius + 10, // Position on the ring
          }}
        >
          <Text className="text-xs font-semibold text-grey-alpha-500">
            {roundedInflowPercentage}%
          </Text>
        </View>

        {/* Outflow Percentage Badge (on the orange segment, bottom-left) */}
        <View
          className="absolute items-center justify-center rounded-lg px-2 py-1"
          style={{
            backgroundColor: OUTFLOW_BADGE_BG,
            bottom: chartSize / 2 - chartRadius + 10, // Position on the ring
            left: chartSize / 2 - chartRadius + 10, // Position on the ring
          }}
        >
          <Text className="text-xs font-semibold text-grey-alpha-500">
            {roundedOutflowPercentage}%
          </Text>
        </View>
      </View>

      {/* Chart Legend */}
      <View className="flex-1 gap-4">
        {/* Total Inflow */}
        <View className="flex-row items-center gap-3">
          <View
            className="size-2 rounded-full"
            style={{ backgroundColor: INFLOW_COLOR }}
          />
          <View className="flex-1">
            <Text className="text-sm text-grey-plain-550">Total inflow</Text>
            <Text className="text-base font-bold text-grey-alpha-500">
              {formatAmount(totalInflow, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>

        {/* Total Outflow */}
        <View className="flex-row items-center gap-3">
          <View
            className="size-2 rounded-full"
            style={{ backgroundColor: OUTFLOW_COLOR }}
          />
          <View className="flex-1">
            <Text className="text-sm text-grey-plain-550">Total outflow</Text>
            <Text className="text-base font-bold text-grey-alpha-500">
              {formatAmount(totalOutflow, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
