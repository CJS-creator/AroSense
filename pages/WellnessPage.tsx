import React, { useState, useMemo } from 'react';
import { WellnessEntry } from '../types';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select, Textarea } from '../components/bits';
import { IconWellness, IconSparkles } from '../constants';
import { useWellness } from '../contexts/WellnessContext';
import { useFamily } from '../contexts/FamilyContext';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../components/toast/useToast';
import { WellnessChart } from '../components/WellnessChart';
import { SlideInList } from '../components/animations/SlideInList';
import { ExpandCollapse } from '../components/animations/ExpandCollapse';
import { GoogleGenAI } from '@google/genai';

const moodOptions: { value: WellnessEntry['mood'], label: string }[] = [
  { value: 'Happy', label: '😊 Happy' },
  { value: 'Neutral', label: '😐 Neutral' },
  { value: 'Sad', label: '😢 Sad' },
  { value: 'Anxious', label: '😟 Anxious' },
  { value: 'Energetic', label: '⚡ Energetic' },
];

export const WellnessPage: React.FC = () => {
  const { wellnessLog, setWellnessLog } = useWellness();
  const { familyMembers } = useFamily();
  const { currentUser } = useUser();
  const toast = useToast();
  
  const [isNutritionVisible, setIsNutritionVisible] = useState(false);

  const [insights, setInsights] = useState("");
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  const { defaultMemberId, memberOptions } = useMemo(() => {
    const allMembers = [
        { value: currentUser.id, label: `${currentUser.name} (Me)` },
        ...familyMembers.filter(fm => fm.id !== currentUser.id).map(fm => ({ value: fm.id, label: fm.name }))
    ];
    const defaultId = allMembers.find(m => m.value === currentUser.id) ? currentUser.id : allMembers[0]?.value;
    return { defaultMemberId: defaultId, memberOptions: allMembers };
  }, [familyMembers, currentUser]);
  
  const [currentEntry, setCurrentEntry] = useState<Partial<WellnessEntry>>({
    date: new Date().toISOString().split('T')[0],
    familyMemberId: defaultMemberId,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setCurrentEntry(prev => ({
      ...prev,
      [name]: type === 'number' && value !== '' ? parseFloat(value) : value,
    }));
  };

  const addWellnessEntry = () => {
    if (!currentEntry.date || !currentEntry.familyMemberId) {
      toast.add("Date and family member are required.", 'error');
      return;
    }
    const newEntry: WellnessEntry = {
      id: `we-${Date.now()}`,
      date: currentEntry.date,
      familyMemberId: currentEntry.familyMemberId,
      mood: currentEntry.mood,
      sleepHours: currentEntry.sleepHours,
      activity: currentEntry.activity,
      waterIntakeLiters: currentEntry.waterIntakeLiters,
      notes: currentEntry.notes,
      calories: currentEntry.calories,
      mealNotes: currentEntry.mealNotes,
    };
    setWellnessLog(prevLog => [newEntry, ...prevLog].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast.add('Wellness entry logged!', 'success');
    setCurrentEntry({ date: new Date().toISOString().split('T')[0], familyMemberId: defaultMemberId }); // Reset form
    setIsNutritionVisible(false);
  };
  
  const getMemberNameForLog = (memberId: string) => {
    const member = familyMembers.find(fm => fm.id === memberId);
    if (member) return member.name;
    if (memberId === currentUser.id) return currentUser.name;
    return 'Unknown';
  };

  const getWellnessInsights = async () => {
    const userLog = wellnessLog.filter(log => log.familyMemberId === currentUser.id);
    if (userLog.length < 3) {
      toast.add("Log at least 3 wellness entries to get personalized insights.", 'info');
      return;
    }

    setIsLoadingInsights(true);
    setInsights("");
    setInsightsError("");

    const prompt = `Analyze the following wellness data for a user and provide a short, encouraging insight (2-3 sentences). Look for correlations between mood, sleep, and activity. Address the user directly. Data: ${JSON.stringify(userLog.slice(0, 14))}`; // Analyze last 14 entries

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
      });
      setInsights(response.text);
    } catch (error) {
        console.error("Error fetching Gemini insights:", error);
        setInsightsError("Could not load insights. Please try again later.");
    } finally {
        setIsLoadingInsights(false);
    }
  };


  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-textPrimary">Wellness Hub</h2>

      <SlideInList className="space-y-6">
        <Card>
          <CardHeader>
              <CardTitle>Log Today's Wellness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="familyMemberId">For</Label>
                      <Select id="familyMemberId" name="familyMemberId" options={memberOptions} value={currentEntry.familyMemberId || ''} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" name="date" value={currentEntry.date || ''} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="mood">Mood</Label>
                      <Select id="mood" name="mood" options={moodOptions} value={currentEntry.mood || ''} onChange={handleInputChange} />
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="sleepHours">Sleep (hours)</Label>
                      <Input id="sleepHours" type="number" name="sleepHours" min="0" step="0.5" value={currentEntry.sleepHours || ''} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="waterIntakeLiters">Water Intake (liters)</Label>
                      <Input id="waterIntakeLiters" type="number" name="waterIntakeLiters" min="0" step="0.1" value={currentEntry.waterIntakeLiters || ''} onChange={handleInputChange} />
                  </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="activity">Activity</Label>
                  <Input id="activity" placeholder="e.g., 30 min walk" name="activity" value={currentEntry.activity || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="notes">General Notes</Label>
                  <Textarea id="notes" name="notes" value={currentEntry.notes || ''} onChange={handleInputChange} />
              </div>

              <div className="border-t border-border pt-4">
                 <button type="button" onClick={() => setIsNutritionVisible(!isNutritionVisible)} className="text-sm text-primary-DEFAULT hover:underline font-medium p-1">
                    {isNutritionVisible ? 'Hide' : 'Show'} Nutrition Details (Optional)
                </button>
                <ExpandCollapse isExpanded={isNutritionVisible}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="calories">Calories</Label>
                            <Input id="calories" name="calories" type="number" min="0" value={currentEntry.calories || ''} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mealNotes">Meal Notes</Label>
                            <Input id="mealNotes" name="mealNotes" value={currentEntry.mealNotes || ''} onChange={handleInputChange} placeholder="e.g., Healthy lunch, dinner party"/>
                        </div>
                    </div>
                </ExpandCollapse>
              </div>

              <Button onClick={addWellnessEntry} leftIcon={<IconWellness className="w-5 h-5" />} className="mt-4">
                  Add Entry
              </Button>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>AI Wellness Insights</CardTitle></CardHeader>
            <CardContent>
                {isLoadingInsights ? (<p className="text-textSecondary">Generating your personalized insights...</p>)
                : insightsError ? (<p className="text-danger">{insightsError}</p>)
                : insights ? (<p className="text-textSecondary italic">"{insights}"</p>)
                : (<p className="text-textSecondary">Discover trends in your wellness data.</p>)}
            </CardContent>
            <CardContent className="pt-0">
                <Button onClick={getWellnessInsights} disabled={isLoadingInsights} leftIcon={<IconSparkles />}>
                    {isLoadingInsights ? 'Analyzing...' : 'Analyze My Wellness'}
                </Button>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
              <CardTitle>Wellness Trends</CardTitle>
          </CardHeader>
          <CardContent>
              <WellnessChart data={wellnessLog} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
              <CardTitle>Wellness Log</CardTitle>
          </CardHeader>
          <CardContent>
              {wellnessLog.length === 0 ? (
              <p className="text-textSecondary">No wellness entries yet. Start logging above!</p>
              ) : (
              <ul className="space-y-4 max-h-96 overflow-y-auto">
                  {wellnessLog.map(entry => (
                  <li key={entry.id} className="p-4 bg-surface-soft rounded-lg border border-border">
                      <p className="font-semibold text-primary-DEFAULT">{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p className="text-sm font-semibold text-textSecondary">For: {getMemberNameForLog(entry.familyMemberId)}</p>
                      {entry.mood && <p>Mood: {moodOptions.find(mo => mo.value === entry.mood)?.label || entry.mood}</p>}
                      {typeof entry.sleepHours !== 'undefined' && <p>Sleep: {entry.sleepHours} hours</p>}
                      {typeof entry.waterIntakeLiters !== 'undefined' && <p>Water: {entry.waterIntakeLiters} L</p>}
                      {entry.activity && <p>Activity: {entry.activity}</p>}
                      {entry.notes && <p className="mt-1 text-sm text-textSecondary">Notes: {entry.notes}</p>}
                      {(entry.calories || entry.mealNotes) && <div className="mt-2 pt-2 border-t border-border/50 text-xs"><p className="font-semibold">Nutrition:</p>{entry.calories && <p>Calories: {entry.calories} kcal</p>}{entry.mealNotes && <p>Meal Notes: {entry.mealNotes}</p>}</div>}
                  </li>
                  ))}
              </ul>
              )}
          </CardContent>
        </Card>
      </SlideInList>
    </div>
  );
};