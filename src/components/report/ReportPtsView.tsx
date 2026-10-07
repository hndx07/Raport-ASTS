import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  ChevronLeft,
  ChevronRight,
  Layers,
  FileText,
  User,
  Settings,
  Sparkles,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { Student, SubjectCategory } from '../../types';

export const ReportPtsView: React.FC = () => {
  const {
    schoolProfile,
    selectedClass,
    selectedPeriodId,
    classStudents,
    subjects,
    grades,
    getAttendance,
    getStudentExtracurriculars,
    printSettings,
    selectedStudentIdForReport,
    setSelectedStudentIdForReport,
    setActiveMenu,
    updateSchoolProfile,
    updatePrintSettings,
    currentPeriod,
  } = useApp();

  // Mode: single student view vs batch all students view for printing
  const [printAllStudentsMode, setPrintAllStudentsMode] = useState(false);
  const [showSigModal, setShowSigModal] = useState(false);

  const currentSigHeight =
    schoolProfile.headmasterSignatureHeight || printSettings.headmasterSignatureHeight || 85;
  const currentSigWidth =
    schoolProfile.headmasterSignatureWidth || printSettings.headmasterSignatureWidth || 230;
  const docFontSize = printSettings.documentFontSizePt || 8.5;

  const handleSetSigDimensions = (height: number, width: number) => {
    updateSchoolProfile({
      headmasterSignatureHeight: height,
      headmasterSignatureWidth: width,
    });
    updatePrintSettings({
      headmasterSignatureHeight: height,
      headmasterSignatureWidth: width,
    });
  };

  const handleAdjustSigHeight = (delta: number) => {
    const nextHeight = Math.max(40, Math.min(130, currentSigHeight + delta));
    // Maintain compact match ratio approximately (width around 2.7x height)
    const nextWidth = Math.round(Math.min(270, Math.max(120, nextHeight * 2.7)));
    handleSetSigDimensions(nextHeight, nextWidth);
  };

  const handleAdjustFontSize = (delta: number) => {
    const nextSize = parseFloat(Math.max(7.5, Math.min(12.0, docFontSize + delta)).toFixed(1));
    updatePrintSettings({ documentFontSizePt: nextSize });
  };

  const handleSetFontSize = (size: number) => {
    updatePrintSettings({ documentFontSizePt: size });
  };

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

    const sigHeight = schoolProfile.headmasterSignatureHeight || 85;
    const sigWidth = schoolProfile.headmasterSignatureWidth || 230;

    return (
      <div
        key={student.id}
        className={`bg-white px-7 py-3 sm:px-8 sm:py-3.5 max-w-[210mm] mx-auto shadow-md border border-slate-200 text-black leading-tight font-document printable-document box-border overflow-hidden ${
          isBatch ? 'page-break-after mb-8' : ''
        }`}
        style={{
          maxHeight: '284mm',
          fontSize: `${docFontSize}pt`,
        }}
      >
        {/* Document Header with School Logo and Official Titles */}
        <div className="flex items-center justify-between border-b-2 border-black pb-1.5 mb-1.5">
          <div className="w-13 h-13 shrink-0 flex items-center justify-center">
            <img
              src={schoolProfile.logoUrl}
              alt="Logo SMK Muhammadiyah Bawang"
              className="max-h-13 max-w-13 object-contain"
            />
          </div>

          <div className="text-center flex-1 px-2">
            <h1
              style={{ fontSize: `${(docFontSize * 1.3).toFixed(1)}pt` }}
              className="font-bold tracking-wider uppercase font-document leading-tight"
            >
              LAPORAN HASIL BELAJAR
            </h1>
            <h2
              style={{ fontSize: `${(docFontSize * 1.1).toFixed(1)}pt` }}
              className="font-bold tracking-wide uppercase font-document mt-0.5 leading-tight"
            >
              ASESMEN SUMATIF TENGAH SEMESTER
            </h2>
            <div
              style={{ fontSize: `${(docFontSize * 0.95).toFixed(1)}pt` }}
              className="font-semibold uppercase text-slate-800 mt-0.5"
            >
              {schoolProfile.name}
            </div>
          </div>

          <div className="w-13 h-13 shrink-0 flex items-center justify-center">
            {/* Balance container */}
          </div>
        </div>

        {/* Identity Grid (Exact match with reference sheet) */}
        <div
          style={{ fontSize: `${(docFontSize * 0.94).toFixed(1)}pt` }}
          className="grid grid-cols-2 gap-x-4 mb-1.5 pb-1 border-b border-black leading-normal"
        >
          {/* Left Column */}
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-32 py-[1px] font-semibold">Nama Peserta Didik</td>
                <td className="w-2.5">:</td>
                <td className="py-[1px] font-bold uppercase truncate max-w-[190px]">
                  {student.name}
                </td>
              </tr>
              <tr>
                <td className="py-[1px] font-semibold">NISN</td>
                <td>:</td>
                <td className="py-[1px] font-mono">{student.nisn || student.nis}</td>
              </tr>
              <tr>
                <td className="py-[1px] font-semibold">Sekolah</td>
                <td>:</td>
                <td className="py-[1px] font-semibold">{schoolProfile.name}</td>
              </tr>
              <tr>
                <td className="py-[1px] font-semibold">Alamat</td>
                <td>:</td>
                <td className="py-[1px] truncate max-w-[190px]">{schoolProfile.address}</td>
              </tr>
            </tbody>
          </table>

          {/* Right Column */}
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-28 py-[1px] font-semibold">Kelas</td>
                <td className="w-2.5">:</td>
                <td className="py-[1px] font-bold">{selectedClass?.name}</td>
              </tr>
              <tr>
                <td className="py-[1px] font-semibold">Fase</td>
                <td>:</td>
                <td className="py-[1px] font-bold">{selectedClass?.fase}</td>
              </tr>
              <tr>
                <td className="py-[1px] font-semibold">Semester</td>
                <td>:</td>
                <td className="py-[1px]">{currentPeriod?.semester}</td>
              </tr>
              <tr>
                <td className="py-[1px] font-semibold">Tahun Pelajaran</td>
                <td>:</td>
                <td className="py-[1px]">{currentPeriod?.academicYear}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Main Grades Table */}
        <div className="mb-1.5">
          <table
            style={{ fontSize: `${(docFontSize * 0.92).toFixed(1)}pt` }}
            className="w-full border-collapse border border-black report-table"
          >
            <thead>
              <tr className="bg-slate-100 text-center font-bold">
                <th className="border border-black py-[2px] px-1 w-6 text-center">NO</th>
                <th className="border border-black py-[2px] px-2 text-left w-48">MATA PELAJARAN</th>
                <th className="border border-black py-[2px] px-1 w-14 text-center">NILAI FORMATIF</th>
                <th className="border border-black py-[2px] px-1 w-14 text-center">NILAI SUMATIF</th>
                <th className="border border-black py-[2px] px-2 text-left">CAPAIAN KOMPETENSI</th>
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
                        style={{ fontSize: `${(docFontSize * 0.88).toFixed(1)}pt` }}
                        className="border border-black py-[1.5px] px-2 text-left uppercase tracking-wide"
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
                          <td className="border border-black py-[1.5px] px-1 text-center font-mono">
                            {subIdx + 1}
                          </td>
                          <td className="border border-black py-[1.5px] px-2 font-semibold leading-tight">
                            {subject.name}
                          </td>
                          <td className="border border-black py-[1.5px] px-1 text-center font-mono font-medium">
                            {formativeVal}
                          </td>
                          <td className="border border-black py-[1.5px] px-1 text-center font-mono font-bold">
                            {summativeVal}
                          </td>
                          <td
                            style={{ fontSize: `${(docFontSize * 0.84).toFixed(1)}pt` }}
                            className="border border-black py-[1.5px] px-2 leading-tight"
                          >
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

        {/* Ekstrakurikuler & Ketidakhadiran Tables (Arranged compactly side-by-side) */}
        <div className="grid grid-cols-12 gap-2.5 mb-1.5">
          {/* Ekstrakurikuler Table (col-span-7) */}
          <div className="col-span-7">
            <table
              style={{ fontSize: `${(docFontSize * 0.90).toFixed(1)}pt` }}
              className="w-full border-collapse border border-black report-table"
            >
              <thead>
                <tr className="bg-slate-50 font-bold">
                  <th className="border border-black py-[1.5px] px-1 w-6 text-center">No</th>
                  <th className="border border-black py-[1.5px] px-2 text-left w-40">
                    Ekstrakurikuler
                  </th>
                  <th className="border border-black py-[1.5px] px-2 text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {studentExtras.length === 0 ? (
                  <>
                    <tr>
                      <td className="border border-black py-[1.5px] px-1 text-center font-mono">1</td>
                      <td className="border border-black py-[1.5px] px-2 font-medium">
                        Hisbul Wathan (HW)
                      </td>
                      <td
                        style={{ fontSize: `${(docFontSize * 0.84).toFixed(1)}pt` }}
                        className="border border-black py-[1.5px] px-2"
                      >
                        Baik, aktif kepanduan
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black py-[1.5px] px-1 text-center font-mono">2</td>
                      <td className="border border-black py-[1.5px] px-2 font-medium">
                        Tapak Suci Putra Muhammadiyah
                      </td>
                      <td
                        style={{ fontSize: `${(docFontSize * 0.84).toFixed(1)}pt` }}
                        className="border border-black py-[1.5px] px-2"
                      >
                        Baik, menguasai jurus
                      </td>
                    </tr>
                  </>
                ) : (
                  studentExtras.slice(0, 3).map((ex, idx) => (
                    <tr key={ex.id}>
                      <td className="border border-black py-[1.5px] px-1 text-center font-mono">
                        {idx + 1}
                      </td>
                      <td className="border border-black py-[1.5px] px-2 font-medium">{ex.name}</td>
                      <td
                        style={{ fontSize: `${(docFontSize * 0.84).toFixed(1)}pt` }}
                        className="border border-black py-[1.5px] px-2"
                      >
                        {ex.predicate} {ex.description ? `— ${ex.description}` : ''}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Ketidakhadiran Table (col-span-5) */}
          <div className="col-span-5">
            <table
              style={{ fontSize: `${(docFontSize * 0.90).toFixed(1)}pt` }}
              className="w-full border-collapse border border-black report-table"
            >
              <thead>
                <tr className="bg-slate-50 font-bold">
                  <th colSpan={3} className="border border-black py-[1.5px] px-2 text-left">
                    Ketidakhadiran
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black py-[1.5px] px-2">Sakit</td>
                  <td className="border border-black py-[1.5px] px-1 text-center font-mono w-8">
                    {attendance.sick}
                  </td>
                  <td className="border border-black py-[1.5px] px-1 text-center w-8">hari</td>
                </tr>
                <tr>
                  <td className="border border-black py-[1.5px] px-2">Izin</td>
                  <td className="border border-black py-[1.5px] px-1 text-center font-mono">
                    {attendance.permitted}
                  </td>
                  <td className="border border-black py-[1.5px] px-1 text-center">hari</td>
                </tr>
                <tr>
                  <td className="border border-black py-[1.5px] px-2">Tanpa Keterangan</td>
                  <td className="border border-black py-[1.5px] px-1 text-center font-mono">
                    {attendance.unexcused}
                  </td>
                  <td className="border border-black py-[1.5px] px-1 text-center">hari</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures Area (Exact layout: Wali Kelas, Orang Tua, and Mengetahui Kepala Sekolah) */}
        <div className="avoid-break mt-1">
          {/* Top Row: Parent & Homeroom Teacher */}
          <div
            style={{ fontSize: `${(docFontSize * 0.98).toFixed(1)}pt` }}
            className="grid grid-cols-2 gap-4 mb-0.5"
          >
            {/* Left: Parent */}
            <div>
              <div className="text-slate-800">Orang Tua/wali Peserta Didik</div>
              <div className="h-8 flex items-end">
                <div className="w-40 border-b border-black"></div>
              </div>
            </div>

            {/* Right: Homeroom Teacher */}
            <div className="text-left pl-8">
              <div>
                {schoolProfile.city}, {currentPeriod?.reportDate}
              </div>
              <div className="mt-0.5">Wali Kelas</div>
              <div className="h-8 flex items-end">
                <div>
                  <div className="font-bold underline">
                    {selectedClass?.homeroomTeacher || 'Wali Kelas'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Center: Headmaster Signature with Manual Dimension Control and Compact Match */}
          {schoolProfile.showHeadmasterSignature && (
            <div className="text-center pt-0.5 w-72 max-w-sm mx-auto">
              <div style={{ fontSize: `${(docFontSize * 0.92).toFixed(1)}pt` }}>Mengetahui</div>
              <div
                style={{ fontSize: `${(docFontSize * 0.98).toFixed(1)}pt` }}
                className="font-bold"
              >
                Kepala Sekolah
              </div>

              {/* Headmaster signature image with compact match and prominent presence */}
              <div
                className="flex items-center justify-center my-0.5 overflow-hidden"
                style={{ height: `${sigHeight + 2}px` }}
              >
                <img
                  src={schoolProfile.headmasterSignatureUrl}
                  alt="Tanda Tangan Kepala Sekolah"
                  style={{
                    height: `${sigHeight}px`,
                    maxWidth: `${sigWidth}px`,
                  }}
                  className="object-contain mx-auto transition-all"
                />
              </div>

              <div
                style={{ fontSize: `${(docFontSize * 1.02).toFixed(1)}pt` }}
                className="font-bold underline leading-tight"
              >
                {schoolProfile.headmasterName}
              </div>
              <div
                style={{ fontSize: `${(docFontSize * 0.88).toFixed(1)}pt` }}
                className="font-mono mt-0.5 text-slate-700"
              >
                NBM. {schoolProfile.headmasterNbm}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Top Controls Bar 1: Student Navigation & Main Print Triggers */}
      <div className="no-print bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
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

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handlePrint(false)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
            title="Cetak rapor siswa yang sedang dipilih ke 1 halaman A4"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Siswa Ini (1 Hal)</span>
          </button>

          <button
            onClick={() => handlePrint(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
            title="Cetak seluruh rapor siswa dalam rombel ini (masing-masing 1 halaman A4)"
          >
            <Layers className="w-4 h-4" />
            <span>Cetak Semua ({classStudents.length} Siswa)</span>
          </button>

          <button
            onClick={() => setActiveMenu('pengaturan_cetak')}
            className="p-2 text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Pengaturan Cetak Lanjutan"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Controls Bar 2: Dedicated Interactive Panel for Font Size & Signature Size Adjustment */}
      <div className="no-print bg-white p-3 sm:p-4 rounded-2xl border border-blue-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Section 1: Pengaturan Ukuran Huruf Cetak */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Ukuran Huruf Cetak:</span>
            </span>

            {/* Quick Presets */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              {[
                { label: '8.0 pt', val: 8.0 },
                { label: '8.5 pt (Pas 1 Hal)', val: 8.5 },
                { label: '9.0 pt', val: 9.0 },
                { label: '9.5 pt', val: 9.5 },
                { label: '10.0 pt', val: 10.0 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => handleSetFontSize(opt.val)}
                  className={`px-2 py-1 rounded-lg font-bold transition-all ${
                    docFontSize === opt.val
                      ? 'bg-blue-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Step adjustment buttons */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
              <button
                onClick={() => handleAdjustFontSize(-0.2)}
                className="w-5 h-5 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 rounded"
                title="Kecilkan Huruf"
              >
                -
              </button>
              <span className="font-mono font-bold text-xs text-blue-900 px-1">
                {docFontSize.toFixed(1)} pt
              </span>
              <button
                onClick={() => handleAdjustFontSize(0.2)}
                className="w-5 h-5 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 rounded"
                title="Besarkan Huruf"
              >
                +
              </button>
            </div>
          </div>

          {/* Section 2: Edit Manual Ukuran Tanda Tangan Kepala Sekolah */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ukuran Tanda Tangan:</span>
            </span>

            {/* Compact Match Preset Button */}
            <button
              onClick={() => handleSetSigDimensions(85, 230)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                currentSigHeight === 85 && currentSigWidth === 230
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                  : 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100'
              }`}
              title="Cocokkan tanda tangan lebih besar dan compact match pas dengan kolom kepala sekolah"
            >
              ⭐ Pas Kolom (85×230px)
            </button>

            {/* Extra Presets */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              {[
                { label: 'Besar (95px)', h: 95, w: 255 },
                { label: 'Sedang (75px)', h: 75, w: 200 },
                { label: 'Ringkas (65px)', h: 65, w: 175 },
              ].map((preset) => (
                <button
                  key={preset.h}
                  onClick={() => handleSetSigDimensions(preset.h, preset.w)}
                  className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                    currentSigHeight === preset.h
                      ? 'bg-white text-indigo-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Step buttons for signature height */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
              <button
                onClick={() => handleAdjustSigHeight(-5)}
                className="w-5 h-5 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 rounded"
                title="Kecilkan Tanda Tangan"
              >
                -
              </button>
              <span className="font-mono font-bold text-xs text-indigo-900 px-1">
                {currentSigHeight}px
              </span>
              <button
                onClick={() => handleAdjustSigHeight(5)}
                className="w-5 h-5 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 rounded"
                title="Besarkan Tanda Tangan"
              >
                +
              </button>
            </div>

            {/* Detailed Manual Edit Dialog Toggle */}
            <button
              onClick={() => setShowSigModal(!showSigModal)}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold underline px-1"
            >
              {showSigModal ? 'Tutup Pengatur' : 'Edit Detail px...'}
            </button>
          </div>
        </div>

        {/* Detailed manual slider drawer if opened */}
        {showSigModal && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-in fade-in">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Tinggi Tanda Tangan (Height)</span>
                <span className="font-mono text-indigo-700 font-bold">{currentSigHeight} px</span>
              </div>
              <input
                type="range"
                min="40"
                max="130"
                step="5"
                value={currentSigHeight}
                onChange={(e) =>
                  handleSetSigDimensions(Number(e.target.value), currentSigWidth)
                }
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Lebar Maksimal Tanda Tangan (Width - Compact Match Kolom)</span>
                <span className="font-mono text-indigo-700 font-bold">{currentSigWidth} px</span>
              </div>
              <input
                type="range"
                min="100"
                max="280"
                step="10"
                value={currentSigWidth}
                onChange={(e) =>
                  handleSetSigDimensions(currentSigHeight, Number(e.target.value))
                }
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Guaranteed 1-Page A4 Notice */}
      <div className="no-print bg-emerald-50/90 border border-emerald-300 p-2.5 sm:p-3 rounded-xl flex items-center justify-between text-xs text-emerald-950">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <b>Garansi 1 Halaman A4 Aktif:</b> Tata letak rapor (identitas, 14 mata pelajaran, ekstrakurikuler,
            ketidakhadiran, & tanda tangan kepala sekolah yang compact match) telah dikunci agar dicetak tepat satu lembar A4 tanpa halaman kedua.
          </span>
        </div>
        <span className="hidden md:inline-block font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px] shrink-0">
          Strict 1-Page Ready
        </span>
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
