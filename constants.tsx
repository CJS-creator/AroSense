import React from 'react';
import { 
    Squares2X2Icon,
    UsersIcon,
    ExclamationTriangleIcon,
    DocumentTextIcon,
    ClipboardDocumentListIcon,
    HeartIcon,
    CalendarDaysIcon,
    Cog6ToothIcon,
    CreditCardIcon,
    Bars3Icon,
    ArrowRightIcon,
    BellIcon,
    CalendarIcon,
    PencilIcon,
    TrashIcon,
    PlusIcon,
    SparklesIcon,
    CameraIcon,
    ShieldCheckIcon,
    ArrowDownTrayIcon,
    PrinterIcon,
    SunIcon,
    MoonIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon,
    QrCodeIcon,
    ChartBarIcon,
    BuildingOffice2Icon,
    BuildingStorefrontIcon,
    FaceSmileIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { FamilyMember, DocumentItem, Prescription, EmergencyContact, MedicalNote, InsurancePolicy, Bill, Appointment, VitalSign, VaccinationRecord, Relationship } from './types';

// ============================================================================
// ICONS
// A collection of icon components from the Heroicons library, used throughout the application.
// ============================================================================
export const IconDashboard = Squares2X2Icon;
export const IconFamily = UsersIcon;
export const IconEmergency = ExclamationTriangleIcon;
export const IconDocument = DocumentTextIcon;
export const IconPrescription = ClipboardDocumentListIcon;
export const IconWellness = HeartIcon;
export const IconPregnancy = CalendarDaysIcon;
export const IconSettings = Cog6ToothIcon;
export const IconCreditCard = CreditCardIcon;
export const IconBars3 = Bars3Icon;
export const IconArrowRight = ArrowRightIcon;
export const IconBell = BellIcon;
export const IconCheckCircle = CheckCircleIcon; // Solid
export const IconCalendar = CalendarIcon;
export const IconHeart = HeartIcon;
export const IconPencil = PencilIcon;
export const IconTrash = TrashIcon;
export const IconPlus = PlusIcon;
export const IconSparkles = SparklesIcon;
export const IconCamera = CameraIcon;
export const IconShieldCheck = ShieldCheckIcon;
export const IconDownload = ArrowDownTrayIcon;
export const IconPrinter = PrinterIcon;
export const IconSun = SunIcon;
export const IconMoon = MoonIcon;
export const IconComputerDesktop = ComputerDesktopIcon;
export const IconExclamationTriangle = ExclamationTriangleIcon;
export const IconDevicePhoneMobile = DevicePhoneMobileIcon;
export const IconQrCode = QrCodeIcon;
export const IconVitals = ChartBarIcon;
export const IconSyringe = ShieldCheckIcon; // Replacement for syringe
export const IconHospital = BuildingOffice2Icon;
export const IconPharmacy = BuildingStorefrontIcon;
export const IconBaby = FaceSmileIcon;
export const IconImageAnalyzer = SparklesIcon;


// ============================================================================
// CONSTANT DATA
// ============================================================================

export const RelationshipOptions = Object.values(Relationship);
export const DocumentCategories = ['Lab Report', 'Imaging Scan', 'Prescription Slip', 'Doctor\'s Note', 'Insurance Card', 'Surgical Report', 'Other'];


// ============================================================================
// SAMPLE DATA
// Mock data to populate the application on first load.
// ============================================================================

export const SampleFamilyMembers: FamilyMember[] = [
    { id: 'fm1', name: 'Alex Johnson', dateOfBirth: '1988-05-20', relationship: Relationship.SELF, medicalHistorySummary: 'Generally healthy. History of seasonal allergies.', bloodType: 'O+', allergies: ['Pollen', 'Dust Mites'], profilePhotoUrl: 'https://i.pravatar.cc/150?u=fm1' },
    { id: 'fm2', name: 'Brenda Johnson', dateOfBirth: '1990-11-12', relationship: Relationship.SPOUSE, medicalHistorySummary: 'No major health issues. Manages occasional migraines.', bloodType: 'A-', allergies: [], profilePhotoUrl: 'https://i.pravatar.cc/150?u=fm2' },
    { id: 'fm3', name: 'Charlie Johnson', dateOfBirth: '2018-09-01', relationship: Relationship.CHILD, medicalHistorySummary: 'Up to date on all vaccinations. History of minor ear infections.', bloodType: 'O+', allergies: ['Penicillin'], profilePhotoUrl: 'https://i.pravatar.cc/150?u=fm3' },
];

export const SampleDocuments: DocumentItem[] = [
    { id: 'doc1', title: "Charlie's Annual Checkup", category: "Doctor's Note", uploadDate: '2023-09-15', familyMemberId: 'fm3', fileName: 'charlie_checkup_2023.pdf', version: 1 },
    { id: 'doc2', title: 'Blood Panel Results', category: 'Lab Report', uploadDate: '2023-10-22', familyMemberId: 'fm1', fileName: 'alex_bloodwork_2023.pdf', version: 1 },
    { id: 'doc3', title: 'Dental X-Ray', category: 'Imaging Scan', uploadDate: '2023-06-05', familyMemberId: 'fm2', fileName: 'brenda_xray.jpg', version: 1 },
];

const today = new Date();
const fiveDaysFromNow = new Date(today);
fiveDaysFromNow.setDate(today.getDate() + 5);
const startDateForExpiringRx = new Date(today);
startDateForExpiringRx.setDate(today.getDate() - 25);

export const SamplePrescriptions: Prescription[] = [
    { id: 'rx1', medicationName: 'Amoxicillin', dosage: '250mg', frequency: 'Twice a day for 10 days', prescribingDoctor: 'Dr. Evans', familyMemberId: 'fm3', startDate: '2023-11-01', endDate: '2023-11-10', notes: 'For ear infection. Take with food.' },
    { id: 'rx2', medicationName: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', prescribingDoctor: 'Dr. Smith', familyMemberId: 'fm1', startDate: '2022-01-15', notes: 'For blood pressure management.' },
    { id: 'rx3', medicationName: 'Metformin', dosage: '500mg', frequency: 'Once daily', prescribingDoctor: 'Dr. Chen', familyMemberId: 'fm2', startDate: startDateForExpiringRx.toISOString().split('T')[0], endDate: fiveDaysFromNow.toISOString().split('T')[0], notes: 'For glucose control. Refill needed soon.' },
];

export const SampleEmergencyContacts: EmergencyContact[] = [
    { id: 'ec1', name: 'Maria Garcia', phone: '555-123-4567', relationship: 'Neighbor' },
    { id: 'ec2', name: 'David Johnson', phone: '555-987-6543', relationship: 'Brother (Alex)' },
];

export const SampleMedicalNotes: MedicalNote[] = [
    { id: 'note1', title: 'Post-Op Instructions: Wisdom Teeth', content: 'Avoid solid foods for 24 hours. Use salt water rinse. No straws.', date: '2022-08-19', isCritical: false, familyMemberId: 'fm2' },
    { id: 'note2', title: 'CRITICAL: Penicillin Allergy', content: 'Charlie is severely allergic to Penicillin. Alternative is Erythromycin.', date: '2020-03-10', isCritical: true, familyMemberId: 'fm3' },
];

export const SampleInsurancePolicies: InsurancePolicy[] = [
    { id: 'ins1', providerName: 'Blue Shield PPO', policyNumber: 'XF12345678', groupNumber: 'G-98765', memberId: 'fm1', effectiveDate: '2021-01-01' },
    { id: 'ins2', providerName: 'Delta Dental', policyNumber: 'DD98765432', groupNumber: 'G-98765', memberId: 'fm2', effectiveDate: '2021-01-01' },
];

export const SampleBills: Bill[] = [
    { id: 'bill1', serviceProvider: 'City General Hospital', serviceDate: '2023-11-01', amountDue: 150.75, dueDate: '2023-11-30', isPaid: true, notes: "Charlie's ER visit for ear infection" },
    { id: 'bill2', serviceProvider: 'Quest Diagnostics', serviceDate: '2023-10-22', amountDue: 45.50, dueDate: '2023-12-15', isPaid: false, notes: "Alex's annual blood work" },
];

export const SampleAppointments: Appointment[] = [
    { id: 'app1', date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0], time: '10:00 AM', doctor: 'Dr. Evans', notes: 'Annual check-up for Charlie', type: 'Check-up', familyMemberId: 'fm3' },
    { id: 'app2', date: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString().split('T')[0], time: '02:30 PM', doctor: 'Dr. Miller (Dentist)', notes: 'Routine cleaning', type: 'Dental', familyMemberId: 'fm2' },
];

export const SampleVitals: VitalSign[] = [
    { id: 'vt1', familyMemberId: 'fm1', date: '2023-10-22', heightCm: 180, weightKg: 82, bloodPressure: '122/80', heartRate: 65 },
    { id: 'vt2', familyMemberId: 'fm3', date: '2023-09-15', heightCm: 105, weightKg: 18, notes: 'Annual checkup measurements' },
];

export const SampleVaccinations: VaccinationRecord[] = [
    { id: 'vac1', familyMemberId: 'fm3', vaccineName: 'MMR (Dose 2)', dateAdministered: '2023-09-15' },
    { id: 'vac2', familyMemberId: 'fm1', vaccineName: 'Tetanus Booster', dateAdministered: '2021-07-20' },
];