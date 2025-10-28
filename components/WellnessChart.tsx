import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WellnessEntry } from '../types';
import { motion } from 'framer-motion';

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

// Numerical mapping for mood plotting
const moodScores: { [key in WellnessEntry['mood'] & string]: number } = {
    'Sad': 1,
    'Anxious': 2,
    'Neutral': 3,
    'Happy': 4,
    'Energetic': 5
};

const scoreToMood: { [key: number]: WellnessEntry['mood'] } = {
    1: 'Sad',
    2: 'Anxious',
    3: 'Neutral',
    4: 'Happy',
    5: 'Energetic'
};


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const moodInfo = dataPoint.mood ? moodMapping[dataPoint.mood] : null;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-surface p-3 rounded-lg shadow-lg border border-border text-sm"
      >
        <p className="font-bold text-textPrimary">{label}</p>
        {moodInfo && (
          <p className="flex items-center font-semibold" style={{ color: moodInfo.color }}>
            <span className="text-lg">{moodInfo.emoji}</span> <span className="ml-2">{dataPoint.mood}</span>
          </p>
        )}
        {payload.map((pld: any) => {
            if (pld.dataKey === 'sleepHours') {
                return <p key={pld.dataKey} style={{ color: 'rgb(var(--color-primary-DEFAULT))' }}>Sleep: <span className="font-medium text-textPrimary">{pld.value} hrs</span></p>;
            }
            if (pld.dataKey === 'waterIntakeLiters') {
                return <p key={pld.dataKey} style={{ color: 'rgb(var(--color-secondary-DEFAULT))' }}>Water: <span className="font-medium text-textPrimary">{pld.value} L</span></p>;
            }
            return null;
        })}
        {dataPoint.activity && <p className="text-textSecondary">Activity: <span className="font-medium text-textPrimary">{dataPoint.activity}</span></p>}
      </motion.div>
    );
  }
  return null;
};

const CustomMoodDot = (props: any) => {
    const { cx, cy, payload, index } = props;
    if (payload.mood && moodMapping[payload.mood]) {
        return (
            <motion.circle 
                cx={cx} cy={cy} r={6} 
                fill={moodMapping[payload.mood].color} 
                stroke="rgb(var(--color-surface))" 
                strokeWidth={2}
                animate={{
                    scale: [1, 1.3, 1], // A slightly larger pulse for visibility
                    opacity: [1, 0.7, 1], // A bit more fade
                }}
                transition={{
                    duration: 2, // Faster pulse cycle
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: "easeInOut",
                    // Controls the timing of the keyframes: quick expand, slower shrink
                    times: [0, 0.2, 1], 
                    delay: index * 0.15 // Stagger the animation start for each dot
                }}
            />
        );
    }
    return null;
};

export const WellnessChart: React.FC<WellnessChartProps> = ({ data }) => {
    if (data.length < 1) {
        return (
            <div className="flex items-center justify-center h-80 bg-surface-soft rounded-lg">
                <p className="text-textSecondary text-center px-4">Log some wellness entries to see your trends over time.</p>
            </div>
        );
    }

    const chartData = data
        .map(entry => ({
            ...entry,
            name: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            moodScore: entry.mood ? moodScores[entry.mood] : undefined,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer>
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border) / 0.5)" />
                    <XAxis dataKey="name" stroke="rgb(var(--color-text-secondary))" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" stroke="rgb(var(--color-primary-DEFAULT))" tick={{ fontSize: 12 }} label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: 'rgb(var(--color-primary-DEFAULT))' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="rgb(var(--color-secondary-DEFAULT))" tick={{ fontSize: 12 }} label={{ value: 'Liters', angle: 90, position: 'insideRight', fill: 'rgb(var(--color-secondary-DEFAULT))' }} />
                    <YAxis 
                        yAxisId="mood" 
                        orientation="right" 
                        stroke="transparent" 
                        tickLine={false} 
                        axisLine={false}
                        domain={[0, 6]} 
                        ticks={[1,2,3,4,5]}
                        tickFormatter={(value) => moodMapping[scoreToMood[value]]?.emoji || ''}
                    />

                    <Tooltip content={<CustomTooltip />} />
                    <Legend />

                    <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="sleepHours" 
                        name="Sleep" 
                        stroke="rgb(var(--color-primary-DEFAULT))" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 6 }} 
                        connectNulls 
                    />
                    <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="waterIntakeLiters" 
                        name="Water Intake" 
                        stroke="rgb(var(--color-secondary-DEFAULT))" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 6 }} 
                        connectNulls
                    />
                     <Line 
                        yAxisId="mood" 
                        dataKey="moodScore" 
                        name="Mood" 
                        stroke="none" 
                        dot={<CustomMoodDot />} 
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};