import React from 'react';
import { View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Button } from './ui/button';
import { cn } from '@/lib/cn';

type DayColors = {
  [key: string]: { bg: string; opposite: string };
};

const dayColors: DayColors = {
  Monday: { bg: 'bg-red-500', opposite: 'bg-green-500' },
  Tuesday: { bg: 'bg-blue-500', opposite: 'bg-orange-500' },
  Wednesday: { bg: 'bg-orange-500', opposite: 'bg-blue-500' },
  Thursday: { bg: 'bg-yellow-500', opposite: 'bg-purple-500' },
  Friday: { bg: 'bg-purple-500', opposite: 'bg-yellow-500' },
  Saturday: { bg: 'bg-pink-500', opposite: 'bg-teal-500' },
  Sunday: { bg: 'bg-orange-500', opposite: 'bg-blue-500' },
};

const pointColors = [
  { max: -100, color: 'text-red-900' },
  { max: -50, color: 'text-red-700' },
  { max: 0, color: 'text-red-500' },
  { max: 100, color: 'text-red-300' },
  { max: 200, color: 'text-red-100' },
  { max: 300, color: 'text-yellow-500' },
  { max: 400, color: 'text-yellow-300' },
  { max: 500, color: 'text-yellow-100' },
  { max: 600, color: 'text-green-500' },
  { max: 700, color: 'text-green-300' },
  { max: 800, color: 'text-green-100' },
  { max: 900, color: 'text-blue-500' },
  { max: 1000, color: 'text-blue-300' },
  { max: 1100, color: 'text-blue-100' },
  { max: 1200, color: 'text-purple-500' },
  { max: 1300, color: 'text-purple-300' },
  { max: 1400, color: 'text-purple-100' },
  { max: 1500, color: 'text-pink-500' },
  { max: 1600, color: 'text-pink-300' },
  { max: 1700, color: 'text-pink-100' },
  { max: 1800, color: 'text-gray-500' },
  { max: 1900, color: 'text-gray-300' },
  { max: 2000, color: 'text-gray-100' },
];

const getColorForPoints = (points: number): string => {
  for (const { max, color } of pointColors) {
    if (points <= max) {
      return color;
    }
  }
  return 'text-gray-500';
};

const getFontSizeForPoints = (points: number): number => {
  const numDigits = points.toString().length;
  if (numDigits <= 2) return 48; // Large font size for 1-2 digits
  if (numDigits <= 4) return 36; // Medium font size for 3-4 digits
  if (numDigits <= 6) return 24; // Small font size for 5-6 digits
  return 18; // Extra small font size for 7+ digits
};

const ScoreCard: React.FC<{ points: number }> = ({ points }) => {
  const { colorScheme } = useColorScheme();
  const dayOfWeek = new Date().toLocaleString('en-US', { weekday: 'long' });
  const { bg: bgColor, opposite: oppositeColor } = dayColors[dayOfWeek] || {
    bg: 'bg-green-600',
    opposite: 'bg-red-600',
  };

  return (
    <View className={cn('rounded-lg p-4', bgColor, 'flex flex-row items-center justify-between')}>
      <View className="flex flex-col items-start justify-center">
        <Text className="text-center text-xs text-gray-900">Total Points</Text>
        <Text
          className={cn('font-bold', getColorForPoints(points))}
          style={{ fontSize: getFontSizeForPoints(points) }}>
          {points}
        </Text>
      </View>
      <View>
        <Button className="rounded-3xl bg-black px-2">
          <Text className="text-white">Start</Text>
        </Button>
      </View>
    </View>
  );
};

export default ScoreCard;
