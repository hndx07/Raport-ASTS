import * as XLSX from 'xlsx';
import {
  Student,
  Subject,
  GradeRecord,
  ClassGroup,
  AcademicPeriod,
  StudentRankSummary,
} from '../types';

/**
 * Generates and downloads the full class Leger in Excel format matching the official structure.
 */
export function exportClassLegerToExcel(
  schoolName: string,
  classGroup: ClassGroup,
  period: AcademicPeriod,
  students: Student[],
  subjects: Subject[],
  grades: GradeRecord[],
  rankSummaries: StudentRankSummary[]
) {
  const wb = XLSX.utils.book_new();

  const rankMap = new Map<string, StudentRankSummary>();
  rankSummaries.forEach((r) => rankMap.set(r.studentId, r));

  const activeSubjects = subjects.filter((s) => s.isActive);

  // Build rows
  const rows: any[][] = [];

  // Title rows
  rows.push([`LEGER NILAI SISWA — ${schoolName.toUpperCase()}`]);
  rows.push([
    `Kelas: ${classGroup.name}`,
    `Fase: ${classGroup.fase}`,
    `Tahun Pelajaran: ${period.academicYear}`,
    `Semester: ${period.semester}`,
    `Penilaian: ${period.assessmentType}`,
    `Wali Kelas: ${classGroup.homeroomTeacher}`,
  ]);
  rows.push([]); // blank

  // Header row 1 (Subject groups / titles)
  const headerRow1: string[] = ['NO', 'Nama peserta didik', 'NIS', 'NISN', 'Kelas', 'Fase'];
  activeSubjects.forEach((sub) => {
    headerRow1.push(sub.name, '', '');
  });
  headerRow1.push('Rata-rata', 'Mapel Terisi', 'Belum Lengkap', 'Peringkat');
  rows.push(headerRow1);

  // Header row 2 (Sub-headers)
  const headerRow2: string[] = ['', '', '', '', '', ''];
  activeSubjects.forEach(() => {
    headerRow2.push('Formatif', 'Sumatif', 'Capaian Kompetensi');
  });
  headerRow2.push('', '', '', '');
  rows.push(headerRow2);

  // Data rows
  students.forEach((st, idx) => {
    const summary = rankMap.get(st.id);
    const row: any[] = [
      idx + 1,
      st.name,
      st.nis,
      st.nisn,
      classGroup.name,
      classGroup.fase,
    ];

    activeSubjects.forEach((sub) => {
      const g = grades.find(
        (grade) =>
          grade.studentId === st.id &&
          grade.subjectId === sub.id &&
          grade.periodId === period.id
      );
      row.push(
        g && typeof g.formativeScore === 'number' ? g.formativeScore : '',
        g && typeof g.summativeScore === 'number' ? g.summativeScore : '',
        g && g.competencyDesc ? g.competencyDesc : ''
      );
    });

    row.push(
      summary ? summary.averageScore : '',
      summary ? summary.gradedCount : '',
      summary ? summary.missingCount : '',
      summary && summary.rank > 0 ? summary.rank : '—'
    );

    rows.push(row);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Merge headers for subjects (3 columns per subject)
  const merges: XLSX.Range[] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 + activeSubjects.length * 3 + 3 } }, // Title
  ];

  let colIdx = 6;
  activeSubjects.forEach(() => {
    merges.push({
      s: { r: 3, c: colIdx },
      e: { r: 3, c: colIdx + 2 },
    });
    colIdx += 3;
  });

  ws['!merges'] = merges;

  // Set column widths
  const colWidths: { wch: number }[] = [
    { wch: 5 }, // NO
    { wch: 32 }, // Nama
    { wch: 10 }, // NIS
    { wch: 14 }, // NISN
    { wch: 10 }, // Kelas
    { wch: 8 }, // Fase
  ];

  activeSubjects.forEach(() => {
    colWidths.push({ wch: 10 }, { wch: 10 }, { wch: 35 });
  });
  colWidths.push({ wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 10 });
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'LEGER');
  const fileName = `LEGER_${classGroup.name.replace(/\s+/g, '_')}_${period.academicYear.replace('/', '-')}_${period.semester}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * Exports class rankings table to Excel.
 */
export function exportRankingToExcel(
  schoolName: string,
  className: string,
  period: AcademicPeriod,
  rankings: StudentRankSummary[]
) {
  const wb = XLSX.utils.book_new();
  const rows: any[][] = [];

  rows.push([`REKAP PERINGKAT KELAS — ${schoolName.toUpperCase()}`]);
  rows.push([`Kelas: ${className} | Semester: ${period.semester} | TP: ${period.academicYear} | Penilaian: ${period.assessmentType}`]);
  rows.push([]);
  rows.push(['Peringkat', 'NIS', 'NISN', 'Nama Peserta Didik', 'Nilai Rata-rata', 'Total Nilai Sumatif', 'Mapel Terisi', 'Status']);

  rankings.forEach((r) => {
    rows.push([
      r.rank > 0 ? r.rank : 'Belum Lengkap',
      r.student.nis,
      r.student.nisn,
      r.student.name,
      r.averageScore,
      r.totalSummative,
      `${r.gradedCount} / ${r.totalSubjects}`,
      r.isComplete ? 'Lengkap' : `${r.missingCount} Mapel Kosong`,
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [
    { wch: 12 },
    { wch: 12 },
    { wch: 16 },
    { wch: 32 },
    { wch: 14 },
    { wch: 18 },
    { wch: 14 },
    { wch: 16 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Peringkat');
  XLSX.writeFile(wb, `PERINGKAT_${className.replace(/\s+/g, '_')}_${period.semester}.xlsx`);
}

/**
 * Downloads a template for importing student data.
 */
export function downloadStudentTemplate() {
  const wb = XLSX.utils.book_new();
  const headers = [
    'NIS',
    'NISN',
    'Nama Lengkap',
    'Jenis Kelamin (L/P)',
    'Tempat Lahir',
    'Tanggal Lahir (YYYY-MM-DD)',
    'Nama Orang Tua / Wali',
    'Status (Aktif/Mutasi/Lulus)',
  ];

  const sampleRows = [
    headers,
    ['5421', '0084510101', 'ADHITYA WAHYU PRADANA', 'L', 'Batang', '2008-05-12', 'Bambang Sudarsono', 'Aktif'],
    ['5422', '0084510102', 'AHMAD ASIF FEBRIAN', 'L', 'Batang', '2008-08-20', 'Siti Rahmawati', 'Aktif'],
    ['5423', '0084510103', 'AHMAD REZA SAPUTRA', 'L', 'Batang', '2008-11-04', 'Agus Prayitno', 'Aktif'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleRows);
  ws['!cols'] = [
    { wch: 10 },
    { wch: 14 },
    { wch: 30 },
    { wch: 20 },
    { wch: 16 },
    { wch: 25 },
    { wch: 25 },
    { wch: 20 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Template_Siswa');
  XLSX.writeFile(wb, 'Template_Import_Siswa_Muhiba.xlsx');
}

/**
 * Parses uploaded Excel files with smart header detection.
 */
export interface LegerParseResult {
  success: boolean;
  studentsToUpsert: Omit<Student, 'id'>[];
  gradesToUpsert: {
    studentName: string;
    studentNis: string;
    subjectId: string;
    formativeScore: number | null;
    summativeScore: number | null;
    competencyDesc: string;
  }[];
  studentCount: number;
  gradeCount: number;
  detectedSubjects: string[];
  message: string;
}

/**
 * Specifically parses official Leger Excel files (e.g. FORMAT_RAPORT__X-1.xlsx).
 * Automatically extracts students, subjects, formative, summative, and competency descriptions.
 */
export function parseLegerExcel(
  fileData: ArrayBuffer,
  targetClassId: string,
  targetPeriodId: string,
  existingSubjects: Subject[]
): LegerParseResult {
  try {
    const wb = XLSX.read(fileData, { type: 'array' });

    // Look for sheet named 'LEGER' or containing 'leger', else fallback to first sheet
    let targetSheetName = wb.SheetNames[0];
    const legerSheet = wb.SheetNames.find(
      (s) => s.toLowerCase().includes('leger')
    );
    if (legerSheet) {
      targetSheetName = legerSheet;
    }

    const ws = wb.Sheets[targetSheetName];
    if (!ws) {
      return {
        success: false,
        studentsToUpsert: [],
        gradesToUpsert: [],
        studentCount: 0,
        gradeCount: 0,
        detectedSubjects: [],
        message: 'Lembar kerja (sheet) tidak ditemukan.',
      };
    }

    const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    if (rows.length < 5) {
      return {
        success: false,
        studentsToUpsert: [],
        gradesToUpsert: [],
        studentCount: 0,
        gradeCount: 0,
        detectedSubjects: [],
        message: 'File tidak memiliki baris data yang cukup untuk format leger.',
      };
    }

    // Find header rows: usually around row 4, 5, or 6
    let subjectHeaderRowIdx = -1;
    let subColHeaderRowIdx = -1;
    let studentDataStartRowIdx = -1;

    for (let r = 0; r < Math.min(15, rows.length); r++) {
      const rowStr = rows[r].map((c) => String(c).toLowerCase()).join(' ');
      if (
        (rowStr.includes('pendidikan agama') || rowStr.includes('matematika') || rowStr.includes('pancasila')) &&
        subjectHeaderRowIdx === -1
      ) {
        subjectHeaderRowIdx = r;
      }
      if (
        (rowStr.includes('formatif') || rowStr.includes('sumatif') || rowStr.includes('capaian')) &&
        subColHeaderRowIdx === -1
      ) {
        subColHeaderRowIdx = r;
      }
      // Check where student names start (e.g. col B has capital letters and row has a number in col A)
      if (
        r > 3 &&
        typeof rows[r][0] === 'number' &&
        String(rows[r][1]).trim().length > 3 &&
        studentDataStartRowIdx === -1
      ) {
        studentDataStartRowIdx = r;
      }
    }

    // Fallbacks if not strictly found
    if (subColHeaderRowIdx === -1 && subjectHeaderRowIdx !== -1) {
      subColHeaderRowIdx = subjectHeaderRowIdx + 1;
    }
    if (studentDataStartRowIdx === -1) {
      studentDataStartRowIdx = Math.max(subColHeaderRowIdx + 1, 6);
    }

    // Map column indices to subjects
    // Typically in FORMAT_RAPORT__X-1.xlsx:
    // Col 0: NO
    // Col 1: Nama peserta didik
    // Col 2: NIS (or NISN)
    // Col 3: Kelas
    // Col 4: Fase
    // Then 3 columns per subject: Formatif, Sumatif, Capaian
    const activeSubjects = existingSubjects.filter((s) => s.isActive);
    interface SubjectColMap {
      subject: Subject;
      formativeCol: number;
      summativeCol: number;
      capaianCol: number;
    }
    const subjectMappings: SubjectColMap[] = [];
    const detectedSubjectNames: string[] = [];

    // Attempt to map by header names if subjectHeaderRowIdx is valid
    if (subjectHeaderRowIdx !== -1) {
      const subjRow = rows[subjectHeaderRowIdx];
      for (let c = 5; c < subjRow.length; c++) {
        const headerText = String(subjRow[c] || '').trim();
        if (headerText) {
          // Find matching subject from existingSubjects
          const match = activeSubjects.find((s) => {
            const hLow = headerText.toLowerCase();
            const sLow = s.name.toLowerCase();
            return (
              hLow === sLow ||
              hLow.includes(sLow) ||
              sLow.includes(hLow) ||
              (hLow.includes('agama') && sLow.includes('agama')) ||
              (hLow.includes('pancasila') && sLow.includes('pancasila')) ||
              (hLow.includes('indonesia') && sLow.includes('indonesia')) ||
              (hLow.includes('jasmani') && sLow.includes('jasmani')) ||
              (hLow.includes('sejarah') && sLow.includes('sejarah')) ||
              (hLow.includes('seni') && sLow.includes('seni')) ||
              (hLow.includes('jawa') && sLow.includes('jawa')) ||
              (hLow.includes('matematika') && sLow.includes('matematika')) ||
              (hLow.includes('inggris') && sLow.includes('inggris')) ||
              (hLow.includes('informatika') && sLow.includes('informatika')) ||
              (hLow.includes('alam dan sosial') && sLow.includes('alam dan sosial')) ||
              (hLow.includes('keahlian') && sLow.includes('keahlian')) ||
              (hLow.includes('kemuhammadiyahan') && sLow.includes('kemuhammadiyahan')) ||
              (hLow.includes('ismuba') && sLow.includes('ismuba'))
            );
          });

          if (match && !subjectMappings.some((m) => m.subject.id === match.id)) {
            subjectMappings.push({
              subject: match,
              formativeCol: c,
              summativeCol: c + 1,
              capaianCol: c + 2,
            });
            detectedSubjectNames.push(match.name);
          }
        }
      }
    }

    // Fallback: If header matching detected few or zero, map sequentially starting at col 5
    if (subjectMappings.length < 5) {
      subjectMappings.length = 0;
      detectedSubjectNames.length = 0;
      let startCol = 5;
      activeSubjects.forEach((sub) => {
        if (startCol + 2 < (rows[studentDataStartRowIdx]?.length || 100)) {
          subjectMappings.push({
            subject: sub,
            formativeCol: startCol,
            summativeCol: startCol + 1,
            capaianCol: startCol + 2,
          });
          detectedSubjectNames.push(sub.name);
          startCol += 3;
        }
      });
    }

    const studentsToUpsert: Omit<Student, 'id'>[] = [];
    const gradesToUpsert: {
      studentName: string;
      studentNis: string;
      subjectId: string;
      formativeScore: number | null;
      summativeScore: number | null;
      competencyDesc: string;
    }[] = [];

    // Extract students and grades
    for (let r = studentDataStartRowIdx; r < rows.length; r++) {
      const row = rows[r];
      // Check if row has valid student name
      const rawName = String(row[1] || '').trim();
      if (!rawName || rawName.toLowerCase().includes('rata') || rawName.toLowerCase().includes('total')) {
        continue;
      }

      const stName = rawName.toUpperCase();
      const stNis = String(row[2] || (5400 + r)).trim();
      const stNisn = String(row[3] || '').trim();

      studentsToUpsert.push({
        nis: stNis,
        nisn: stNisn,
        name: stName,
        gender: 'L',
        birthPlace: 'Batang',
        birthDate: '2008-01-01',
        classId: targetClassId,
        parentName: `Orang Tua / Wali dari ${stName}`,
        status: 'Aktif',
      });

      // Extract grades for each mapped subject
      subjectMappings.forEach((map) => {
        const rawForm = row[map.formativeCol];
        const rawSum = row[map.summativeCol];
        const rawCap = row[map.capaianCol];

        const formNum =
          rawForm !== '' && !isNaN(parseFloat(rawForm)) ? parseFloat(rawForm) : null;
        const sumNum =
          rawSum !== '' && !isNaN(parseFloat(rawSum)) ? parseFloat(rawSum) : null;
        const capDesc = rawCap ? String(rawCap).trim() : map.subject.defaultCompetencyDesc || '';

        gradesToUpsert.push({
          studentName: stName,
          studentNis: stNis,
          subjectId: map.subject.id,
          formativeScore: formNum,
          summativeScore: sumNum,
          competencyDesc: capDesc,
        });
      });
    }

    return {
      success: true,
      studentsToUpsert,
      gradesToUpsert,
      studentCount: studentsToUpsert.length,
      gradeCount: gradesToUpsert.length,
      detectedSubjects: detectedSubjectNames,
      message: `Berhasil mengekstrak ${studentsToUpsert.length} siswa dan ${gradesToUpsert.length} nilai untuk ${detectedSubjectNames.length} mata pelajaran.`,
    };
  } catch (err: any) {
    return {
      success: false,
      studentsToUpsert: [],
      gradesToUpsert: [],
      studentCount: 0,
      gradeCount: 0,
      detectedSubjects: [],
      message: `Gagal membaca file Excel Leger: ${err.message}`,
    };
  }
}

/**
 * Parses uploaded Excel files with smart header detection.
 */
export function parseExcelFile(
  fileData: ArrayBuffer
): {
  type: 'students' | 'leger' | 'unknown';
  data: any[];
  headers: string[];
  errors: string[];
} {
  const wb = XLSX.read(fileData, { type: 'array' });
  const firstSheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[firstSheetName];

  if (!sheet) {
    return { type: 'unknown', data: [], headers: [], errors: ['File Excel tidak memiliki lembar kerja (sheet).'] };
  }

  const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  if (rawRows.length === 0) {
    return { type: 'unknown', data: [], headers: [], errors: ['Lembar kerja kosong.'] };
  }

  // Look for header row index by scanning first 10 rows for keywords like "Nama", "NIS", or "Formatif"
  let headerRowIndex = -1;
  for (let r = 0; r < Math.min(10, rawRows.length); r++) {
    const row = rawRows[r];
    const rowStr = row.map((cell) => String(cell).toLowerCase()).join(' ');
    if (rowStr.includes('nama') || rowStr.includes('nis')) {
      headerRowIndex = r;
      break;
    }
  }

  if (headerRowIndex === -1) {
    headerRowIndex = 0;
  }

  const headerRow = rawRows[headerRowIndex].map((h) => String(h).trim());
  const rowData = rawRows.slice(headerRowIndex + 1).filter((r) => r.some((c) => c !== ''));

  // Detect type
  const joinedHeaders = headerRow.join(' ').toLowerCase();
  if (joinedHeaders.includes('formatif') || joinedHeaders.includes('sumatif') || joinedHeaders.includes('capaian')) {
    return {
      type: 'leger',
      headers: headerRow,
      data: rowData,
      errors: [],
    };
  } else if (joinedHeaders.includes('nama') && (joinedHeaders.includes('nis') || joinedHeaders.includes('nisn'))) {
    return {
      type: 'students',
      headers: headerRow,
      data: rowData,
      errors: [],
    };
  }

  return {
    type: 'unknown',
    headers: headerRow,
    data: rowData,
    errors: ['Format kolom belum teridentifikasi otomatis, silakan sesuaikan pemetaan kolom.'],
  };
}
