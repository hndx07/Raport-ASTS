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
