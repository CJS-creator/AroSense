import React, { useState, useEffect } from 'react';
// FIX: Replaced incorrect AppContext with usePregnancy hook.
import { usePregnancy } from '../contexts/PregnancyContext';
import { useToast } from './toast/useToast';
import { Card, CardContent, CardHeader, CardTitle, Button } from './bits';
import { KickCounterSession } from '../types';

const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
};

export const KickCounter: React.FC = () => {
    // FIX: Used the usePregnancy hook to correctly get kick session state.
    const { kickSessions, setKickSessions } = usePregnancy();
    const toast = useToast();
    const [isActive, setIsActive] = useState(false);
    const [session, setSession] = useState<Omit<KickCounterSession, 'id' | 'durationSeconds' | 'date'> | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let interval: number | undefined;
        if (isActive && session) {
            interval = window.setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - session.startTime) / 1000));
            }, 1000);
        }
        return () => window.clearInterval(interval);
    }, [isActive, session]);

    const startSession = () => {
        setIsActive(true);
        setSession({
            startTime: Date.now(),
            endTime: 0,
            kicks: [],
        });
        setElapsedTime(0);
        toast.add('Kick counting session started!', 'info');
    };

    const stopSession = (finalKicks: { time: number }[]) => {
        if (!session) return;

        const endTime = Date.now();
        const durationSeconds = Math.floor((endTime - session.startTime) / 1000);
        
        const newSession: KickCounterSession = {
            id: `kc-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            startTime: session.startTime,
            endTime,
            kicks: finalKicks,
            durationSeconds,
        };
        
        setKickSessions(prev => [newSession, ...prev]);
        toast.add(`Session complete! ${finalKicks.length} kicks in ${formatDuration(durationSeconds)}.`, 'success');

        setIsActive(false);
        setSession(null);
        setElapsedTime(0);
    };

    const logKick = () => {
        if (!session) return;
        const newKick = { time: Date.now() };
        const updatedKicks = [...session.kicks, newKick];
        setSession({ ...session, kicks: updatedKicks });

        if (updatedKicks.length >= 10) {
            stopSession(updatedKicks);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Kick Counter</CardTitle>
            </CardHeader>
            <CardContent>
                {!isActive ? (
                    <Button onClick={startSession} className="w-full" size="lg">Start Counting Kicks</Button>
                ) : (
                    <div className="space-y-4">
                        <div className="text-center p-4 bg-primary-DEFAULT/10 rounded-lg">
                            <p className="text-lg font-semibold text-primary-dark dark:text-primary-light">Session in Progress</p>
                            <div className="text-4xl font-bold my-2 text-textPrimary">{session?.kicks.length || 0} / 10</div>
                            <div className="text-sm text-textSecondary">Time: {formatDuration(elapsedTime)}</div>
                        </div>
                        <Button onClick={logKick} className="w-full" size="lg">Log a Kick</Button>
                        <Button onClick={() => stopSession(session?.kicks || [])} variant="outline" className="w-full">End Session</Button>
                    </div>
                )}
                
                <div className="mt-6">
                    <h4 className="font-semibold text-textPrimary mb-2">Recent Sessions</h4>
                    {kickSessions.length > 0 ? (
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {kickSessions.slice(0, 5).map(s => (
                                <li key={s.id} className="text-sm p-2 bg-surface-soft rounded-md flex justify-between">
                                    <span className="text-textSecondary">{new Date(s.date).toLocaleDateString()}</span>
                                    <span className="font-medium text-textPrimary">{s.kicks.length} kicks in {formatDuration(s.durationSeconds)}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-textSecondary text-center py-4">No sessions yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
