// FIX: Removed circular import of FamilyMember.
export enum Relationship {
  SELF = 'Self',
  SPOUSE = 'Spouse',
  CHILD = 'Child',
  PARENT = 'Parent',
  SIBLING = 'Sibling',
  OTHER = 'Other',
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface FamilyMember {
  id:string;
  name: string;
  dateOfBirth: string;
  relationship: Relationship;
  medicalHistorySummary: string;
  bloodType?: string;
  allergies?: string[];
  profilePhotoUrl?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  uploadDate: string;
  fileUrl?: string; // Placeholder for actual file link
  fileName?: string;
  familyMemberId?: string; // Optional: link document to a family member
  version?: number;
}

export interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  prescribingDoctor: string;
  pharmacy?: string;
  familyMemberId: string; 
  startDate: string;
  endDate?: string;
  notes?: string;
  // Phase 2 Enhancements
  supplyDays?: number;
  refillsRemaining?: number;
  adherence?: { [date: string]: 'taken' | 'skipped' };
  conditionId?: string;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  notes: string;
  type: 'Check-up' | 'Ultrasound' | 'Lab Test' | 'Consultation' | 'Dental' | 'Specialist';
  familyMemberId: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface MedicalNote {
  id: string;
  title: string;
  content: string;
  date: string;
  isCritical: boolean;
  familyMemberId?: string;
}

export interface InsurancePolicy {
  id: string;
  providerName: string;
  policyNumber: string;
  groupNumber?: string;
  memberId: string; // Family member this policy applies to
  coverageDetails?: string;
  effectiveDate: string;
  expirationDate?: string;
  paymentMethod?: string;
  copayAmount?: number;
}

export interface Bill {
  id: string;
  serviceProvider: string;
  serviceDate: string;
  amountDue: number;
  dueDate: string;
  isPaid: boolean;
  notes?: string;
  paymentDate?: string;
  // Phase 2 Enhancements
  familyMemberId?: string;
  appointmentId?: string;
}

export interface InsuranceClaim {
  id: string;
  billId: string;
  policyId: string;
  claimNumber: string;
  submissionDate: string;
  status: 'Submitted' | 'Processing' | 'Approved' | 'Denied';
  amountCovered?: number;
  notes?: string;
}

export interface WellnessEntry {
  id: string;
  date: string;
  mood?: 'Happy' | 'Neutral' | 'Sad' | 'Anxious' | 'Energetic';
  sleepHours?: number;
  activity?: string; // e.g., '30 min walk'
  waterIntakeLiters?: number;
  notes?: string;
  familyMemberId: string; // Add familyMemberId to link wellness to a person
  calories?: number;
  mealNotes?: string;
}

export interface VitalSign {
    id: string;
    familyMemberId: string;
    date: string;
    heightCm?: number;
    weightKg?: number;
    bloodPressure?: string; // e.g., '120/80'
    heartRate?: number; // beats per minute
    notes?: string;
}

export interface VaccinationRecord {
    id: string;
    familyMemberId: string;
    vaccineName: string;
    dateAdministered: string;
    notes?: string;
}

export interface Condition {
    id: string;
    familyMemberId: string;
    name: string;
    dateOfDiagnosis: string;
    status: 'Active' | 'Resolved';
    notes?: string;
}

export type TimelineEventType = 'document' | 'prescription' | 'note' | 'bill' | 'vital' | 'vaccination' | 'wellness' | 'appointment' | 'condition';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  date: string;
  isCritical?: boolean;
}

// ===============================================
// PREGNANCY TRACKER TYPES
// ===============================================
export interface PregnancyData {
    dueDate: string | null; // Stored as 'YYYY-MM-DD'
}

export type PregnancyMood = 'Happy' | 'Excited' | 'Neutral' | 'Anxious' | 'Tired' | 'Nauseous';

export interface PregnancyLogEntry {
    id: string;
    date: string;
    symptoms: string[];
    mood: PregnancyMood;
    notes?: string;
}

export interface KickCounterSession {
    id: string;
    date: string; // 'YYYY-MM-DD'
    startTime: number; // timestamp
    endTime: number; // timestamp
    kicks: { time: number }[]; // array of kick timestamps
    durationSeconds: number;
}

// ===============================================
// SETTINGS TYPES
// ===============================================
export interface WellnessSettings {
    defaultMood: WellnessEntry['mood'];
    waterIntakeGoalLiters: number;
    sleepGoalHours: number;
    remindersEnabled: boolean;
    reminderTime: string; // HH:mm format
}

export interface BillingSettings {
    defaultPaymentMethod: string;
    dueDateRemindersEnabled: boolean;
    policyVisibility: { [policyId: string]: boolean };
}

export interface DashboardSettings {
    widgetVisibility: { [widgetId: string]: boolean };
}

export interface AppSettings {
    wellness: WellnessSettings;
    billing: BillingSettings;
    dashboard: DashboardSettings;
}