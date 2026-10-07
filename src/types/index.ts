export type SubjectCategory =
  | 'A. KELOMPOK MATA PELAJARAN UMUM'
  | 'B. KELOMPOK MATA PELAJARAN KEJURUAN'
  | 'C. KELOMPOK ISMUBA';

export interface SchoolProfile {
  id: string;
  name: string;
  npsn: string;
  address: string;
  postalCode: string;
  subdistrict: string;
  district: string;
  city: string;
  logoUrl: string;
  headmasterName: string;
  headmasterNbm: string;
  headmasterSignatureUrl: string;
  showHeadmasterSignature: boolean;
}

export interface AcademicPeriod {
  id: string;
  academicYear: string; // e.g. "2026/2027"
  semester: 'Ganjil' | 'Genap';
  assessmentType: 'PTS' | 'PAS' | 'SAS' | string;
  reportDate: string; // e.g. "8 Oktober 2026"
  isCurrent: boolean;
}

export interface ClassGroup {
  id: string;
  name: string; // e.g. "X TO 4"
  gradeLevel: 'X' | 'XI' | 'XII';
  major: string; // e.g. "Teknik Otomotif"
  homeroomTeacher: string; // e.g. "Wali Kelas X TO 4"
  fase: 'E' | 'F';
}

export interface Teacher {
  id: string;
  name: string;
  nipOrNbm: string;
  subjectTaught: string;
  phone?: string;
  email?: string;
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  classId: string;
  parentName: string;
  status: 'Aktif' | 'Mutasi' | 'Lulus';
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  category: SubjectCategory;
  orderIndex: number;
  isActive: boolean;
  defaultCompetencyDesc?: string;
}

export interface GradeRecord {
  id: string; // composite `${studentId}_${subjectId}_${periodId}`
  studentId: string;
  subjectId: string;
  periodId: string;
  formativeScore: number | null;
  summativeScore: number | null;
  competencyDesc: string;
  updatedAt?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  periodId: string;
  sick: number;
  permitted: number;
  unexcused: number;
}

export interface ExtracurricularRecord {
  id: string;
  studentId: string;
  periodId: string;
  name: string;
  predicate: string; // e.g. "Sangat Baik"
  description?: string;
}

export type RankingMethod = 'competition' | 'dense';

export interface StudentRankSummary {
  studentId: string;
  student: Student;
  totalSummative: number;
  totalFormative: number;
  averageScore: number;
  gradedCount: number;
  totalSubjects: number;
  missingCount: number;
  isComplete: boolean;
  rank: number;
}

export interface PrintSettings {
  paperSize: 'A4' | 'A3' | 'F4';
  orientation: 'portrait' | 'landscape';
  fontFamily: 'times' | 'sans';
  fontSize: 'compact' | 'normal' | 'spacious';
  showHeadmasterSignature: boolean;
  showHomeroomSignature: boolean;
  showParentSignature: boolean;
  signatureSpacing: 'compact' | 'normal' | 'tall';
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}
