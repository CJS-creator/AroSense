import React from 'react';
import { VitalSign } from '../types';
import { Button, Card, CardContent, CardHeader, CardTitle } from './bits';
import { IconVitals, IconPlus } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VitalsCardProps {
    vitals: VitalSign[];
    onAddVital: () => void;
}

// Calculate BMI
const calculateBMI = (weightKg?: number, heightCm?: number): number | null => {
    if (!weightKg || !heightCm) return null;
    const heightM = heightCm / 100;
    return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload;
    return (
      <div className="bg-surface p-3 rounded-lg shadow-lg border border-border text-sm">
        <p className="font-bold text-textPrimary">{label}</p>
        {typeof entry.weightKg !== 'undefined' && <p className="text-textSecondary">Weight: <span className="font-medium text-textPrimary">{entry.weightKg} kg</span></p>}
        {typeof entry.bmi !== 'undefined' && <p className="text-textSecondary">BMI: <span className="font-medium text-textPrimary">{entry.bmi}</span></p>}
      </div>
    );
  }
  return null;
};

export const VitalsCard: React.FC<VitalsCardProps> = ({ vitals, onAddVital }) => {
    const latestVital = vitals.length > 0 ? vitals[0] : null;

    const chartData = vitals
        .map(v => ({
            ...v,
            name: new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            bmi: calculateBMI(v.weightKg, v.heightCm)
        }))
        .filter(v => v.weightKg && v.heightCm) // Only include data points with both weight and height for BMI chart
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                    <IconVitals className="w-6 h-6 mr-2 text-indigo-500"/>
                    Vitals
                </CardTitle>
                <Button onClick={onAddVital} size="sm" variant="outline" leftIcon={<IconPlus className="w-4 h-4" />}>Log Vitals</Button>
            </CardHeader>
            <CardContent>
                {latestVital ? (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-textSecondary mb-2">Most Recent Reading ({new Date(latestVital.date).toLocaleDateString()})</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                <div className="p-2 bg-surface-soft rounded-lg">
                                    <p className="text-xs text-textSecondary">Height</p>
                                    <p className="font-bold text-lg text-textPrimary">{latestVital.heightCm ? `${latestVital.heightCm} cm` : 'N/A'}</p>
                                </div>
                                <div className="p-2 bg-surface-soft rounded-lg">
                                    <p className="text-xs text-textSecondary">Weight</p>
                                    <p className="font-bold text-lg text-textPrimary">{latestVital.weightKg ? `${latestVital.weightKg} kg` : 'N/A'}</p>
                                </div>
                                <div className="p-2 bg-surface-soft rounded-lg">
                                    <p className="text-xs text-textSecondary">Blood Pressure</p>
                                    <p className="font-bold text-lg text-textPrimary">{latestVital.bloodPressure || 'N/A'}</p>
                                </div>
                                <div className="p-2 bg-surface-soft rounded-lg">
                                    <p className="text-xs text-textSecondary">Heart Rate</p>
                                    <p className="font-bold text-lg text-textPrimary">{latestVital.heartRate ? `${latestVital.heartRate} bpm` : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        {chartData.length > 1 && (
                            <div className="h-60 w-full mt-4">
                                <ResponsiveContainer>
                                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border) / 0.5)" />
                                        <XAxis dataKey="name" stroke="rgb(var(--color-text-secondary))" tick={{ fontSize: 12 }} />
                                        <YAxis yAxisId="left" stroke="rgb(var(--color-text-secondary))" tick={{ fontSize: 12 }} label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', fill: 'rgb(var(--color-text-secondary))' }} />
                                        <YAxis yAxisId="right" orientation="right" stroke="rgb(var(--color-text-secondary))" tick={{ fontSize: 12 }} label={{ value: 'BMI', angle: 90, position: 'insideRight', fill: 'rgb(var(--color-text-secondary))' }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line yAxisId="left" type="monotone" dataKey="weightKg" name="Weight (kg)" stroke="#8884d8" strokeWidth={2} />
                                        <Line yAxisId="right" type="monotone" dataKey="bmi" name="BMI" stroke="#82ca9d" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-textSecondary text-center py-8">No vitals logged for this member yet.</p>
                )}
            </CardContent>
        </Card>
    );
};