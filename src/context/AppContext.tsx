import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SchoolProfile,
  AcademicPeriod,
  ClassGroup,
  Teacher,
  Student,
  Subject,
  GradeRecord,
  AttendanceRecord,
  ExtracurricularRecord,
  RankingMethod,
  PrintSettings,
  ToastNotification,
  StudentRankSummary,
} from '../types';
import {
  initialSchoolProfile,
  initialPeriods,
  initialClasses,
  initialTeachers,
  initialStudents,
  initialSubjects,
  initialGrades,
  initialAttendances,
  initialExtracurriculars,
  initialPrintSettings,
} from '../data/initialData';
import { calculateClassRankings, RankingOptions } from '../utils/ranking';

interface AppContextType {
  // Navigation
  activeMenu: string;
  setActiveMenu: (menu: string) => void;

  // Selected filters
  selectedClassId: string;
  setSelectedClassId: (id: string) => void;
  selectedPeriodId: string;
  setSelectedPeriodId: (id: string) => void;

  // Data states
  schoolProfile: SchoolProfile;
  setSchoolProfile: (profile: SchoolProfile) => void;
  updateSchoolProfile: (patch: Partial<SchoolProfile>) => void;

  periods: AcademicPeriod[];
  currentPeriod: AcademicPeriod | undefined;
  addPeriod: (period: Omit<AcademicPeriod, 'id'>) => void;
  updatePeriod: (id: string, period: Partial<AcademicPeriod>) => void;
  deletePeriod: (id: string) => void;

  classes: ClassGroup[];
  selectedClass: ClassGroup | undefined;
  addClass: (cls: Omit<ClassGroup, 'id'>) => void;
  updateClass: (id: string, cls: Partial<ClassGroup>) => void;
  deleteClass: (id: string) => void;

  teachers: Teacher[];
  addTeacher: (t: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, t: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  students: Student[];
  classStudents: Student[];
  addStudent: (s: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, s: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  batchAddOrUpdateStudents: (
    newStudents: Omit<Student, 'id'>[],
    mode: 'skip_duplicate' | 'update_duplicate'
  ) => { added: number; updated: number; skipped: number };
  transferStudentClass: (studentId: string, targetClassId: string) => void;

  subjects: Subject[];
  addSubject: (sub: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, sub: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  reorderSubjects: (reordered: Subject[]) => void;

  grades: GradeRecord[];
  saveGrade: (
    studentId: string,
    subjectId: string,
    periodId: string,
    formative: number | null,
    summative: number | null,
    competencyDesc: string
  ) => void;
  batchSaveGrades: (newGrades: GradeRecord[]) => void;
  getStudentGrade: (
    studentId: string,
    subjectId: string,
    periodId: string
  ) => GradeRecord | undefined;

  attendances: AttendanceRecord[];
  getAttendance: (studentId: string, periodId: string) => AttendanceRecord;
  updateAttendance: (
    studentId: string,
    periodId: string,
    data: { sick: number; permitted: number; unexcused: number }
  ) => void;

  extracurriculars: ExtracurricularRecord[];
  getStudentExtracurriculars: (
    studentId: string,
    periodId: string
  ) => ExtracurricularRecord[];
  addExtracurricular: (record: Omit<ExtracurricularRecord, 'id'>) => void;
  updateExtracurricular: (
    id: string,
    record: Partial<ExtracurricularRecord>
  ) => void;
  deleteExtracurricular: (id: string) => void;

  // Ranking
  rankingMethod: RankingMethod;
  setRankingMethod: (method: RankingMethod) => void;
  includeIncompleteInRanking: boolean;
  setIncludeIncompleteInRanking: (include: boolean) => void;
  rankingScoreBasis: 'summative' | 'average_both';
  setRankingScoreBasis: (basis: 'summative' | 'average_both') => void;
  getClassRankings: (classId?: string, periodId?: string) => StudentRankSummary[];

  // Print settings
  printSettings: PrintSettings;
  updatePrintSettings: (settings: Partial<PrintSettings>) => void;

  // Selected student for report card view
  selectedStudentIdForReport: string;
  setSelectedStudentIdForReport: (id: string) => void;

  // Toasts
  toasts: ToastNotification[];
  showToast: (
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    title?: string
  ) => void;
  dismissToast: (id: string) => void;

  // Backup & Reset
  exportBackupJson: () => string;
  restoreBackupJson: (jsonData: string) => boolean;
  resetToDefaultData: () => void;
  storageUsageKb: number;
}

const STORAGE_KEY_PREFIX = 'muhiba_raport_v1_';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');

  // Load state with fallback
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      console.warn(`Error reading localStorage for ${key}`, e);
      return fallback;
    }
  };

  const [schoolProfile, setSchoolProfileState] = useState<SchoolProfile>(() =>
    loadStored('schoolProfile', initialSchoolProfile)
  );

  const [periods, setPeriods] = useState<AcademicPeriod[]>(() =>
    loadStored('periods', initialPeriods)
  );
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(() => {
    const stored = loadStored('selectedPeriodId', '');
    return stored || initialPeriods[0]?.id || '';
  });

  const [classes, setClasses] = useState<ClassGroup[]>(() =>
    loadStored('classes', initialClasses)
  );
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    const stored = loadStored('selectedClassId', '');
    return stored || initialClasses[0]?.id || '';
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() =>
    loadStored('teachers', initialTeachers)
  );
  const [students, setStudents] = useState<Student[]>(() =>
    loadStored('students', initialStudents)
  );
  const [subjects, setSubjects] = useState<Subject[]>(() =>
    loadStored('subjects', initialSubjects)
  );
  const [grades, setGrades] = useState<GradeRecord[]>(() =>
    loadStored('grades', initialGrades)
  );
  const [attendances, setAttendances] = useState<AttendanceRecord[]>(() =>
    loadStored('attendances', initialAttendances)
  );
  const [extracurriculars, setExtracurriculars] = useState<ExtracurricularRecord[]>(() =>
    loadStored('extracurriculars', initialExtracurriculars)
  );

  const [rankingMethod, setRankingMethodState] = useState<RankingMethod>(() =>
    loadStored('rankingMethod', 'competition')
  );
  const [includeIncompleteInRanking, setIncludeIncompleteInRankingState] = useState<boolean>(() =>
    loadStored('includeIncomplete', false)
  );
  const [rankingScoreBasis, setRankingScoreBasisState] = useState<'summative' | 'average_both'>(() =>
    loadStored('scoreBasis', 'summative')
  );

  const [printSettings, setPrintSettings] = useState<PrintSettings>(() =>
    loadStored('printSettings', initialPrintSettings)
  );

  const [selectedStudentIdForReport, setSelectedStudentIdForReport] = useState<string>('s-1');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [storageUsageKb, setStorageUsageKb] = useState<number>(0);

  // Sync to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'schoolProfile', JSON.stringify(schoolProfile));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'periods', JSON.stringify(periods));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'selectedPeriodId', JSON.stringify(selectedPeriodId));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'classes', JSON.stringify(classes));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'selectedClassId', JSON.stringify(selectedClassId));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'teachers', JSON.stringify(teachers));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'students', JSON.stringify(students));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'subjects', JSON.stringify(subjects));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'grades', JSON.stringify(grades));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'attendances', JSON.stringify(attendances));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'extracurriculars', JSON.stringify(extracurriculars));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'rankingMethod', JSON.stringify(rankingMethod));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'includeIncomplete', JSON.stringify(includeIncompleteInRanking));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'scoreBasis', JSON.stringify(rankingScoreBasis));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'printSettings', JSON.stringify(printSettings));

      // Calculate approximate localStorage size
      let total = 0;
      for (const x in localStorage) {
        if (localStorage.hasOwnProperty(x) && x.startsWith(STORAGE_KEY_PREFIX)) {
          total += (localStorage[x].length * 2) / 1024;
        }
      }
      setStorageUsageKb(Math.round(total * 10) / 10);
    } catch (e) {
      console.error('Storage sync error:', e);
    }
  }, [
    schoolProfile,
    periods,
    selectedPeriodId,
    classes,
    selectedClassId,
    teachers,
    students,
    subjects,
    grades,
    attendances,
    extracurriculars,
    rankingMethod,
    includeIncompleteInRanking,
    rankingScoreBasis,
    printSettings,
  ]);

  // Toast notifier
  const showToast = (
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    title?: string
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper selectors
  const currentPeriod = periods.find((p) => p.id === selectedPeriodId) || periods[0];
  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // School profile
  const setSchoolProfile = (profile: SchoolProfile) => {
    setSchoolProfileState(profile);
  };
  const updateSchoolProfile = (patch: Partial<SchoolProfile>) => {
    setSchoolProfileState((prev) => ({ ...prev, ...patch }));
    showToast('success', 'Profil dan identitas sekolah berhasil diperbarui.');
  };

  // Periods
  const addPeriod = (period: Omit<AcademicPeriod, 'id'>) => {
    const newId = `p-${Date.now()}`;
    const newPeriod: AcademicPeriod = { ...period, id: newId };
    setPeriods((prev) => [...prev, newPeriod]);
    setSelectedPeriodId(newId);
    showToast('success', `Tahun pelajaran ${period.academicYear} ${period.semester} ditambahkan.`);
  };
  const updatePeriod = (id: string, patch: Partial<AcademicPeriod>) => {
    setPeriods((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    showToast('success', 'Tahun pelajaran diperbarui.');
  };
  const deletePeriod = (id: string) => {
    if (periods.length <= 1) {
      showToast('error', 'Tidak dapat menghapus satu-satunya tahun pelajaran aktif.');
      return;
    }
    setPeriods((prev) => prev.filter((p) => p.id !== id));
    if (selectedPeriodId === id) {
      setSelectedPeriodId(periods[0].id);
    }
    showToast('info', 'Tahun pelajaran dihapus.');
  };

  // Classes
  const addClass = (cls: Omit<ClassGroup, 'id'>) => {
    const newId = `c-${Date.now()}`;
    const newClass: ClassGroup = { ...cls, id: newId };
    setClasses((prev) => [...prev, newClass]);
    setSelectedClassId(newId);
    showToast('success', `Kelas ${cls.name} berhasil ditambahkan.`);
  };
  const updateClass = (id: string, patch: Partial<ClassGroup>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    showToast('success', 'Informasi kelas berhasil diperbarui.');
  };
  const deleteClass = (id: string) => {
    if (classes.length <= 1) {
      showToast('error', 'Minimal harus ada satu kelas dalam sistem.');
      return;
    }
    setClasses((prev) => prev.filter((c) => c.id !== id));
    if (selectedClassId === id) {
      setSelectedClassId(classes[0].id);
    }
    showToast('info', 'Kelas berhasil dihapus.');
  };

  // Teachers
  const addTeacher = (t: Omit<Teacher, 'id'>) => {
    const newId = `t-${Date.now()}`;
    setTeachers((prev) => [...prev, { ...t, id: newId }]);
    showToast('success', `Data guru ${t.name} tersimpan.`);
  };
  const updateTeacher = (id: string, patch: Partial<Teacher>) => {
    setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    showToast('success', 'Data guru diperbarui.');
  };
  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    showToast('info', 'Guru dihapus.');
  };

  // Students
  const addStudent = (s: Omit<Student, 'id'>) => {
    // Check duplicate NIS/NISN
    const isDup = students.some((x) => x.nis === s.nis || (s.nisn && x.nisn === s.nisn));
    if (isDup) {
      showToast('error', 'Gagal: NIS atau NISN sudah terdaftar pada siswa lain.');
      return;
    }
    const newId = `s-${Date.now()}`;
    setStudents((prev) => [...prev, { ...s, id: newId }]);
    showToast('success', `Siswa ${s.name} berhasil didaftarkan.`);
  };
  const updateStudent = (id: string, patch: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    showToast('success', 'Data siswa berhasil diperbarui.');
  };
  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setGrades((prev) => prev.filter((g) => g.studentId !== id));
    setAttendances((prev) => prev.filter((a) => a.studentId !== id));
    showToast('info', 'Data siswa berhasil dihapus.');
  };

  const batchAddOrUpdateStudents = (
    newStudents: Omit<Student, 'id'>[],
    mode: 'skip_duplicate' | 'update_duplicate'
  ) => {
    let added = 0;
    let updated = 0;
    let skipped = 0;

    const currentMap = new Map<string, Student>();
    students.forEach((s) => {
      currentMap.set(s.nis, s);
      if (s.nisn) currentMap.set(s.nisn, s);
    });

    const updatedList = [...students];

    newStudents.forEach((st) => {
      const existing = currentMap.get(st.nis) || (st.nisn ? currentMap.get(st.nisn) : undefined);
      if (existing) {
        if (mode === 'update_duplicate') {
          const idx = updatedList.findIndex((s) => s.id === existing.id);
          if (idx !== -1) {
            updatedList[idx] = { ...updatedList[idx], ...st };
            updated++;
          }
        } else {
          skipped++;
        }
      } else {
        const newStudent: Student = {
          ...st,
          id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        };
        updatedList.push(newStudent);
        added++;
      }
    });

    setStudents(updatedList);
    return { added, updated, skipped };
  };

  const transferStudentClass = (studentId: string, targetClassId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, classId: targetClassId } : s))
    );
    showToast('success', 'Siswa berhasil dipindahkan ke kelas tujuan.');
  };

  // Subjects
  const addSubject = (sub: Omit<Subject, 'id'>) => {
    const newId = `sub-${Date.now()}`;
    setSubjects((prev) => [...prev, { ...sub, id: newId }]);
    showToast('success', `Mata pelajaran ${sub.name} berhasil ditambahkan.`);
  };
  const updateSubject = (id: string, patch: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    showToast('success', 'Mata pelajaran diperbarui.');
  };
  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    showToast('info', 'Mata pelajaran dihapus.');
  };
  const reorderSubjects = (reordered: Subject[]) => {
    setSubjects(reordered);
  };

  // Grades
  const saveGrade = (
    studentId: string,
    subjectId: string,
    periodId: string,
    formative: number | null,
    summative: number | null,
    competencyDesc: string
  ) => {
    const id = `${studentId}_${subjectId}_${periodId}`;
    setGrades((prev) => {
      const existingIdx = prev.findIndex((g) => g.id === id);
      const record: GradeRecord = {
        id,
        studentId,
        subjectId,
        periodId,
        formativeScore: formative,
        summativeScore: summative,
        competencyDesc,
        updatedAt: new Date().toISOString(),
      };
      if (existingIdx !== -1) {
        const next = [...prev];
        next[existingIdx] = record;
        return next;
      }
      return [...prev, record];
    });
  };

  const batchSaveGrades = (newGrades: GradeRecord[]) => {
    setGrades((prev) => {
      const map = new Map<string, GradeRecord>();
      prev.forEach((g) => map.set(g.id, g));
      newGrades.forEach((g) => map.set(g.id, g));
      return Array.from(map.values());
    });
    showToast('success', `${newGrades.length} nilai berhasil disimpan.`);
  };

  const getStudentGrade = (
    studentId: string,
    subjectId: string,
    periodId: string
  ) => {
    const id = `${studentId}_${subjectId}_${periodId}`;
    return grades.find((g) => g.id === id);
  };

  // Attendances
  const getAttendance = (studentId: string, periodId: string): AttendanceRecord => {
    const found = attendances.find((a) => a.studentId === studentId && a.periodId === periodId);
    if (found) return found;
    return {
      id: `att-${studentId}-${periodId}`,
      studentId,
      periodId,
      sick: 0,
      permitted: 0,
      unexcused: 0,
    };
  };

  const updateAttendance = (
    studentId: string,
    periodId: string,
    data: { sick: number; permitted: number; unexcused: number }
  ) => {
    setAttendances((prev) => {
      const idx = prev.findIndex((a) => a.studentId === studentId && a.periodId === periodId);
      const record: AttendanceRecord = {
        id: `att-${studentId}-${periodId}`,
        studentId,
        periodId,
        ...data,
      };
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = record;
        return next;
      }
      return [...prev, record];
    });
  };

  // Extracurriculars
  const getStudentExtracurriculars = (
    studentId: string,
    periodId: string
  ): ExtracurricularRecord[] => {
    return extracurriculars.filter(
      (e) => e.studentId === studentId && e.periodId === periodId
    );
  };

  const addExtracurricular = (record: Omit<ExtracurricularRecord, 'id'>) => {
    const newId = `extra-${Date.now()}`;
    setExtracurriculars((prev) => [...prev, { ...record, id: newId }]);
    showToast('success', `Ekstrakurikuler ${record.name} ditambahkan.`);
  };

  const updateExtracurricular = (
    id: string,
    patch: Partial<ExtracurricularRecord>
  ) => {
    setExtracurriculars((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
    showToast('success', 'Ekstrakurikuler diperbarui.');
  };

  const deleteExtracurricular = (id: string) => {
    setExtracurriculars((prev) => prev.filter((e) => e.id !== id));
    showToast('info', 'Ekstrakurikuler dihapus.');
  };

  // Ranking calculation
  const setRankingMethod = (method: RankingMethod) => {
    setRankingMethodState(method);
    showToast('info', `Metode pemeringkatan: ${method === 'competition' ? 'Competition Ranking (1,2,2,4)' : 'Dense Ranking (1,2,2,3)'}`);
  };

  const setIncludeIncompleteInRanking = (include: boolean) => {
    setIncludeIncompleteInRankingState(include);
    showToast(
      'info',
      include
        ? 'Siswa dengan nilai belum lengkap diikutsertakan dalam peringkat.'
        : 'Siswa dengan nilai belum lengkap dikecualikan dari peringkat final.'
    );
  };

  const setRankingScoreBasis = (basis: 'summative' | 'average_both') => {
    setRankingScoreBasisState(basis);
    showToast(
      'info',
      basis === 'summative'
        ? 'Dasar rata-rata: Nilai Sumatif (Standar Rapor PTS)'
        : 'Dasar rata-rata: Gabungan Formatif & Sumatif'
    );
  };

  const getClassRankings = (
    classId = selectedClassId,
    periodId = selectedPeriodId
  ): StudentRankSummary[] => {
    const targetStudents = students.filter((s) => s.classId === classId);
    const options: RankingOptions = {
      method: rankingMethod,
      includeIncomplete: includeIncompleteInRanking,
      scoreBasis: rankingScoreBasis,
    };
    return calculateClassRankings(targetStudents, subjects, grades, periodId, options);
  };

  // Print settings
  const updatePrintSettings = (patch: Partial<PrintSettings>) => {
    setPrintSettings((prev) => ({ ...prev, ...patch }));
    showToast('success', 'Pengaturan cetak diperbarui.');
  };

  // Backup & Reset
  const exportBackupJson = () => {
    const backupObj = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      schoolProfile,
      periods,
      classes,
      teachers,
      students,
      subjects,
      grades,
      attendances,
      extracurriculars,
      rankingMethod,
      includeIncompleteInRanking,
      rankingScoreBasis,
      printSettings,
    };
    return JSON.stringify(backupObj, null, 2);
  };

  const restoreBackupJson = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (!data.schoolProfile || !data.students || !data.classes) {
        throw new Error('Format berkas cadangan (backup) tidak valid.');
      }
      setSchoolProfileState(data.schoolProfile);
      setPeriods(data.periods || initialPeriods);
      setClasses(data.classes || initialClasses);
      setTeachers(data.teachers || initialTeachers);
      setStudents(data.students || initialStudents);
      setSubjects(data.subjects || initialSubjects);
      setGrades(data.grades || initialGrades);
      setAttendances(data.attendances || initialAttendances);
      setExtracurriculars(data.extracurriculars || initialExtracurriculars);
      if (data.rankingMethod) setRankingMethodState(data.rankingMethod);
      if (data.printSettings) setPrintSettings(data.printSettings);
      showToast('success', 'Data cadangan berhasil dipulihkan secara menyeluruh!');
      return true;
    } catch (e: any) {
      showToast('error', `Gagal memulihkan cadangan: ${e.message}`);
      return false;
    }
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setSchoolProfileState(initialSchoolProfile);
    setPeriods(initialPeriods);
    setSelectedPeriodId(initialPeriods[0].id);
    setClasses(initialClasses);
    setSelectedClassId(initialClasses[0].id);
    setTeachers(initialTeachers);
    setStudents(initialStudents);
    setSubjects(initialSubjects);
    setGrades(initialGrades);
    setAttendances(initialAttendances);
    setExtracurriculars(initialExtracurriculars);
    setRankingMethodState('competition');
    setIncludeIncompleteInRankingState(false);
    setRankingScoreBasisState('summative');
    setPrintSettings(initialPrintSettings);
    showToast('info', 'Database dikembalikan ke data awal X TO 4 SMK Muhammadiyah Bawang.');
  };

  return (
    <AppContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        selectedClassId,
        setSelectedClassId,
        selectedPeriodId,
        setSelectedPeriodId,
        schoolProfile,
        setSchoolProfile,
        updateSchoolProfile,
        periods,
        currentPeriod,
        addPeriod,
        updatePeriod,
        deletePeriod,
        classes,
        selectedClass,
        addClass,
        updateClass,
        deleteClass,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        students,
        classStudents,
        addStudent,
        updateStudent,
        deleteStudent,
        batchAddOrUpdateStudents,
        transferStudentClass,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        reorderSubjects,
        grades,
        saveGrade,
        batchSaveGrades,
        getStudentGrade,
        attendances,
        getAttendance,
        updateAttendance,
        extracurriculars,
        getStudentExtracurriculars,
        addExtracurricular,
        updateExtracurricular,
        deleteExtracurricular,
        rankingMethod,
        setRankingMethod,
        includeIncompleteInRanking,
        setIncludeIncompleteInRanking,
        rankingScoreBasis,
        setRankingScoreBasis,
        getClassRankings,
        printSettings,
        updatePrintSettings,
        selectedStudentIdForReport,
        setSelectedStudentIdForReport,
        toasts,
        showToast,
        dismissToast,
        exportBackupJson,
        restoreBackupJson,
        resetToDefaultData,
        storageUsageKb,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
