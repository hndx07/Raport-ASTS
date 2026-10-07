import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  ChevronLeft,
  ChevronRight,
  Layers,
  FileText,
  User,
  Settings,
  Download,
  AlertCircle,
} from 'lucide-react';
import { Student, SubjectCategory } from '../../types';

export const ReportPtsView: React.FC = () => {
  const {
    schoolProfile,
    classes,
    selectedClass,
    selectedClassId,
    setSelectedClassId,
    periods,
    currentPeriod,
    selectedPeriodId,
    setSelectedPeriodId,
    classStudents,
    subjects,
    grades,
    attendances,
    getAttendance,
    extracurriculars,
    getStudentExtracurriculars,
    printSettings,
    selectedStudentIdForReport,
    setSelectedStudentIdForReport,
    setActiveMenu,
  } = useApp();

  // Mode: single student view vs batch all students view for printing
  const [printAllStudentsMode, setPrintAllStudentsMode] = useState(false);

  // Selected student
  const activeStudent =
    classStudents.find((s) => s.id === selectedStudentIdForReport) || classStudents[0];

  const activeIndex = classStudents.findIndex((s) => s.id === activeStudent?.id);

  const prevStudent = () => {
    if (activeIndex > 0) {
      setSelectedStudentIdForReport(classStudents[activeIndex - 1].id);
    }
  };

  const nextStudent = () => {
    if (activeIndex < classStudents.length - 1) {
      setSelectedStudentIdForReport(classStudents[activeIndex + 1].id);
    }
  };

  const handlePrint = (all = false) => {
    setPrintAllStudentsMode(all);
    // Allow React state to flush into DOM before calling print
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const categories: SubjectCategory[] = [
    'A. KELOMPOK MATA PELAJARAN UMUM',
    'B. KELOMPOK MATA PELAJARAN KEJURUAN',
    'C. KELOMPOK ISMUBA',
  ];

  // Helper renderer for a single formal report page
  const renderSingleReport = (student: Student, isBatch = false) => {
    const studentGrades = grades.filter(
      (g) => g.studentId === student.id && g.periodId === selectedPeriodId
    );
    const attendance = getAttendance(student.id, selectedPeriodId);
    const studentExtras = getStudentExtracurriculars(student.id, selectedPeriodId);

    return (
      <div
        key={student.id}
        className={`bg-white p-8 sm:p-12 max-w-[210mm] mx-auto shadow-md border border-slate-200 text-black leading-normal font-document printable-document ${
          isBatch ? 'page-break-after mb-12' : ''
        }`}
        style={{ minHeight: '297mm' }}
      >
        {/* Document Header with Logo and Official Titles */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <div className="w-16 h-16 shrink-0 flex items-center justify-center">
            <img
              src={schoolProfile.logoUrl}
              alt="Logo Sekolah"
              className="max-h-16 max-w-16 object-contain"
            />
          </div>

          <div className="text-center flex-1 px-4">
            <h1 className="text-base sm:text-lg font-bold tracking-wider uppercase font-document">
              LAPORAN HASIL BELAJAR
            </h1>
            <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase font-document mt-0.5">
              ASESMEN SUMATIF TENGAH SEMESTER
            </h2>
            <div className="text-xs font-semibold uppercase text-slate-800">
              {schoolProfile.name}
            </div>
          </div>

          <div className="w-16 h-16 shrink-0 flex items-center justify-center text-xs font-bold font-mono">
            {/* Balance container */}
          </div>
        </div>

        {/* Identity Grid (Exact match with Screenshot 1) */}
        <div className="grid grid-cols-2 gap-x-6 text-[12px] sm:text-[13px] mb-4 pb-2 border-b border-black">
          {/* Left Column */}
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-36 py-0.5 font-semibold">Nama Peserta Didik</td>
                <td className="w-4">:</td>
                <td className="py-0.5 font-bold uppercase">{student.name}</td>
              </tr>
              <tr>
                <td className="py-0.5 font-semibold">NISN</td>
                <td>:</td>
                <td className="py-0.5 font-mono">{student.nisn || student.nis}</td>
              </tr>
              <tr>
                <td className="py-0.5 font-semibold">Sekolah</td>
                <td>:</td>
                <td className="py-0.5 font-semibold">{schoolProfile.name}</td>
              </tr>
              <tr>
                <td className="py-0.5 font-semibold">Alamat</td>
                <td>:</td>
                <td className="py-0.5">{schoolProfile.address}</td>
              </tr>
            </tbody>
          </table>

          {/* Right Column */}
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-32 py-0.5 font-semibold">Kelas</td>
                <td className="w-4">:</td>
                <td className="py-0.5 font-bold">{selectedClass?.name}</td>
              </tr>
              <tr>
                <td className="py-0.5 font-semibold">Fase</td>
                <td>:</td>
                <td className="py-0.5 font-bold">{selectedClass?.fase}</td>
              </tr>
              <tr>
                <td className="py-0.5 font-semibold">Semester</td>
                <td>:</td>
                <td className="py-0.5">{currentPeriod?.semester}</td>
              </tr>
              <tr>
                <td className="py-0.5 font-semibold">Tahun Pelajaran</td>
                <td>:</td>
                <td className="py-0.5">{currentPeriod?.academicYear}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Main Grades Table */}
        <div className="mb-4">
          <table className="w-full border-collapse border border-black text-[11px] report-table">
            <thead>
              <tr className="bg-slate-100 text-center font-bold">
                <th className="border border-black py-1.5 px-1 w-8">NO</th>
                <th className="border border-black py-1.5 px-3 text-left w-52">MATA PELAJARAN</th>
                <th className="border border-black py-1.5 px-1 w-16">NILAI FORMATIF</th>
                <th className="border border-black py-1.5 px-1 w-16">NILAI SUMATIF</th>
                <th className="border border-black py-1.5 px-3 text-left">CAPAIAN KOMPETENSI</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const catSubjects = subjects.filter(
                  (s) => s.category === category && s.isActive
                );
                if (catSubjects.length === 0) return null;

                return (
                  <React.Fragment key={category}>
                    {/* Category Title Row */}
                    <tr className="bg-slate-50 font-bold">
                      <td
                        colSpan={5}
                        className="border border-black py-1 px-3 text-left uppercase tracking-wide text-[11px]"
                      >
                        {category}
                      </td>
                    </tr>

                    {/* Subjects in this category */}
                    {catSubjects.map((subject, subIdx) => {
                      const grade = studentGrades.find((g) => g.subjectId === subject.id);
                      const formativeVal =
                        grade && typeof grade.formativeScore === 'number'
                          ? grade.formativeScore
                          : '—';
                      const summativeVal =
                        grade && typeof grade.summativeScore === 'number'
                          ? grade.summativeScore
                          : '—';
                      const desc =
                        grade?.competencyDesc || subject.defaultCompetencyDesc || '—';

                      return (
                        <tr key={subject.id}>
                          <td className="border border-black py-1 px-1 text-center font-mono">
                            {subIdx + 1}
                          </td>
                          <td className="border border-black py-1 px-3 font-semibold">
                            {subject.name}
                          </td>
                          <td className="border border-black py-1 px-1 text-center font-mono font-medium">
                            {formativeVal}
                          </td>
                          <td className="border border-black py-1 px-1 text-center font-mono font-bold">
                            {summativeVal}
                          </td>
                          <td className="border border-black py-1 px-3 text-[10.5px] leading-snug">
                            {desc}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Ekstrakurikuler Table */}
        <div className="mb-4">
          <table className="w-full border-collapse border border-black text-[11px] report-table">
            <thead>
              <tr className="bg-slate-50 font-bold">
                <th className="border border-black py-1 px-2 w-8 text-center">No</th>
                <th className="border border-black py-1 px-3 text-left w-64">Ekstrakurikuler</th>
                <th className="border border-black py-1 px-3 text-left">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {studentExtras.length === 0 ? (
                <>
                  <tr>
                    <td className="border border-black py-1 px-2 text-center font-mono">1</td>
                    <td className="border border-black py-1 px-3">Hisbul Wathan (HW)</td>
                    <td className="border border-black py-1 px-3">Baik, aktif dalam kepanduan</td>
                  </tr>
                  <tr>
                    <td className="border border-black py-1 px-2 text-center font-mono">2</td>
                    <td className="border border-black py-1 px-3">Tapak Suci Putra Muhammadiyah</td>
                    <td className="border border-black py-1 px-3">Baik, menguasai jurus dasar</td>
                  </tr>
                </>
              ) : (
                studentExtras.map((ex, idx) => (
                  <tr key={ex.id}>
                    <td className="border border-black py-1 px-2 text-center font-mono">
                      {idx + 1}
                    </td>
                    <td className="border border-black py-1 px-3 font-semibold">{ex.name}</td>
                    <td className="border border-black py-1 px-3">
                      {ex.predicate} {ex.description ? `— ${ex.description}` : ''}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Ketidakhadiran Table */}
        <div className="mb-6 w-72">
          <table className="w-full border-collapse border border-black text-[11px] report-table">
            <thead>
              <tr className="bg-slate-50 font-bold">
                <th colSpan={3} className="border border-black py-1 px-3 text-left">
                  Ketidakhadiran
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black py-1 px-3">Sakit</td>
                <td className="border border-black py-1 px-2 text-center font-mono w-12">
                  {attendance.sick}
                </td>
                <td className="border border-black py-1 px-2 text-center w-12">hari</td>
              </tr>
              <tr>
                <td className="border border-black py-1 px-3">Izin</td>
                <td className="border border-black py-1 px-2 text-center font-mono">
                  {attendance.permitted}
                </td>
                <td className="border border-black py-1 px-2 text-center">hari</td>
              </tr>
              <tr>
                <td className="border border-black py-1 px-3">Tanpa Keterangan</td>
                <td className="border border-black py-1 px-2 text-center font-mono">
                  {attendance.unexcused}
                </td>
                <td className="border border-black py-1 px-2 text-center">hari</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures Area (Exact layout from Screenshot 1) */}
        <div className="avoid-break mt-6">
          {/* Top Row: Parent & Homeroom Teacher */}
          <div className="grid grid-cols-2 gap-8 text-[12px] mb-8">
            {/* Left: Parent */}
            <div>
              <div className="text-slate-800">Orang Tua/wali Peserta Didik</div>
              <div className="h-20 flex items-end">
                <div className="w-48 border-b border-black"></div>
              </div>
            </div>

            {/* Right: Homeroom Teacher */}
            <div className="text-left pl-12">
              <div>
                {schoolProfile.city}, {currentPeriod?.reportDate}
              </div>
              <div className="mt-0.5">Wali Kelas</div>
              <div className="h-20 flex items-end">
                <div>
                  <div className="font-bold underline">
                    {selectedClass?.homeroomTeacher || 'Wali Kelas'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Center: Headmaster Signature */}
          {schoolProfile.showHeadmasterSignature && (
            <div className="text-center pt-2">
              <div className="text-[12px]">Mengetahui</div>
              <div className="text-[12px] font-bold">Kepala Sekolah</div>

              {/* Headmaster signature image */}
              <div className="h-24 flex items-center justify-center my-1">
                <img
                  src={schoolProfile.headmasterSignatureUrl}
                  alt="Tanda Tangan Kepala Sekolah"
                  className="max-h-20 object-contain mx-auto"
                />
              </div>

              <div className="font-bold underline text-[12.5px]">
                {schoolProfile.headmasterName}
              </div>
              <div className="text-[11px] font-mono mt-0.5">
                NBM. {schoolProfile.headmasterNbm}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Controls Bar */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation & Student Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={prevStudent}
              disabled={activeIndex <= 0}
              className="p-1.5 text-slate-700 hover:text-blue-900 disabled:opacity-30 rounded-lg hover:bg-white transition-colors"
              title="Siswa Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2 text-slate-700 font-mono">
              {activeIndex + 1} / {classStudents.length}
            </span>
            <button
              onClick={nextStudent}
              disabled={activeIndex >= classStudents.length - 1}
              className="p-1.5 text-slate-700 hover:text-blue-900 disabled:opacity-30 rounded-lg hover:bg-white transition-colors"
              title="Siswa Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <select
              value={activeStudent?.id || ''}
              onChange={(e) => {
                setSelectedStudentIdForReport(e.target.value);
                setPrintAllStudentsMode(false);
              }}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 max-w-xs truncate"
            >
              {classStudents.map((s, idx) => (
                <option key={s.id} value={s.id}>
                  {idx + 1}. {s.name} ({s.nis})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Print Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handlePrint(false)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Siswa Ini</span>
          </button>

          <button
            onClick={() => handlePrint(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>Cetak Semua Siswa ({classStudents.length})</span>
          </button>

          <button
            onClick={() => setActiveMenu('pengaturan_cetak')}
            className="p-2 text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Pengaturan Cetak"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notice info */}
      <div className="no-print bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            Pratinjau Dokumen Rapor Standar A4 Portrait. Tata letak, logo proporsional, tabel asesmen,
            dan tanda tangan telah disesuaikan dengan format resmi SMK Muhammadiyah Bawang.
          </span>
        </div>
      </div>

      {/* Render Document(s) */}
      <div className="print-area">
        {printAllStudentsMode ? (
          <div>{classStudents.map((st) => renderSingleReport(st, true))}</div>
        ) : (
          activeStudent && renderSingleReport(activeStudent, false)
        )}
      </div>
    </div>
  );
};
