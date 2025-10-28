import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WellnessEntry } from '../types';

interface WellnessChartProps {
    data: WellnessEntry[];
}

const moodMapping: { [key in WellnessEntry['mood'] & string]: { emoji: string; color: string } } = {
    Happy: { emoji: '😊', color: '#10B981' }, // emerald-500
    Energetic: { emoji: '⚡', color: '#F59E0B' }, // amber-500
    Neutral: { emoji: '😐', color: '#64748B' }, // slate-500
    Anxious: { emoji: '😟', color: '#6366F1' }, // indigo-500
    Sad: { emoji: '😢', color: '#3B82F6' }, // blue-500
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload;
    const moodInfo = entry.mood ? moodMapping[entry.mood] : null;

    return (
      <div className="bg-surface p-3 rounded-lg shadow-lg border border-border text-sm">
        <p className="font-bold text-textPrimary">{label}</p>
        {moodInfo && (
          <p className="flex items-center font-semibold" style={{ color: moodInfo.color }}>
            <span className="text-lg">{moodInfo.emoji}</span> <span className="ml-2">{entry.mood}</span>
          </p>
        )}
        {typeof entry.sleepHours !== 'undefined' && <p className="text-textSecondary">Sleep: <span className="font-medium text-textPrimary">{entry.sleepHours} hrs</span></p>}
        {typeof entry.waterIntakeLiters !== 'undefined' && <p className="text-textSecondary">Water: <span className="font-medium text-textPrimary">{entry.waterIntakeLiters} L</span></p>}
        {entry.activity && <p className="text-textSecondary">Activity: <span className="font-medium text-textPrimary">{entry.activity}</span></p>}
      </div>
    );
  }
  return null;
};


export const WellnessChart: React.FC<WellnessChartProps> = ({ data }) => {
    if (data.length < 2) {
        return (
            <div className="flex items-center justify-center h-80 bg-surface-soft rounded-lg">
                <p className="text-textSecondary text-center px-4">Not enough data to display a trend. Please add at least two wellness entries.</p>
            </div>
        );
    }

    const chartData = data
        .map(entry => ({
            ...entry,
            // Format date for display on X-axis
            name: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer>
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border) / 0.5)" />
                    <XAxis dataKey="name" stroke="rgb(var(--color-text-secondary))" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: 'rgb(var(--color-text-secondary))', dy: 40 }} stroke="rgb(var(--color-text-secondary))" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Liters', angle: 90, position: 'insideRight', fill: 'rgb(var(--color-text-secondary))', dy: -40 }} stroke="rgb(var(--color-text-secondary))" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="sleepHours" name="Sleep" stroke="rgb(var(--color-primary-DEFAULT))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="waterIntakeLiters" name="Water Intake" stroke="rgb(var(--color-secondary-DEFAULT))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
