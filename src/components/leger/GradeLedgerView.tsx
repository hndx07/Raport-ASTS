import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TableProperties,
  Printer,
  FileSpreadsheet,
  Search,
  ArrowUpDown,
  Filter,
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { exportClassLegerToExcel } from '../../utils/excel';

export const GradeLedgerView: React.FC = () => {
  const {
    schoolProfile,
    periods,
    selectedPeriodId,
    setSelectedPeriodId,
    classes,
    selectedClassId,
    setSelectedClassId,
    subjects,
    grades,
    classStudents,
    selectedClass,
    currentPeriod,
    getClassRankings,
    rankingMethod,
    setRankingMethod,
    includeIncompleteInRanking,
    setIncludeIncompleteInRanking,
    rankingScoreBasis,
    setRankingScoreBasis,
    setActiveMenu,
    setSelectedStudentIdForReport,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'average' | 'rank'>('default');
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false);

  const activeSubjects = subjects.filter((s) => s.isActive);

  // Compute rankings
  const rankings = useMemo(() => {
    return getClassRankings(selectedClassId, selectedPeriodId);
  }, [selectedClassId, selectedPeriodId, grades, rankingMethod, includeIncompleteInRanking, rankingScoreBasis]);

  const rankMap = useMemo(() => {
    const map = new Map<string, typeof rankings[0]>();
    rankings.forEach((r) => map.set(r.studentId, r));
    return map;
  }, [rankings]);

  // Filter & sort students
  const displayedStudents = useMemo(() => {
    let list = classStudents.filter((st) => {
      const matchSearch =
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.nis.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;

      if (showOnlyIncomplete) {
        const sum = rankMap.get(st.id);
        return sum && !sum.isComplete;
      }
      return true;
    });

    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'average') {
      list.sort((a, b) => {
        const avgA = rankMap.get(a.id)?.averageScore || 0;
        const avgB = rankMap.get(b.id)?.averageScore || 0;
        return avgB - avgA;
      });
    } else if (sortBy === 'rank') {
      list.sort((a, b) => {
        const rankA = rankMap.get(a.id)?.rank || 9999;
        const rankB = rankMap.get(b.id)?.rank || 9999;
        return (rankA === 0 ? 9999 : rankA) - (rankB === 0 ? 9999 : rankB);
      });
    }

    return list;
  }, [classStudents, searchQuery, showOnlyIncomplete, sortBy, rankMap]);

  const handleExportExcel = () => {
    if (!selectedClass || !currentPeriod) return;
    exportClassLegerToExcel(
      schoolProfile.name,
      selectedClass,
      currentPeriod,
      classStudents,
      subjects,
      grades,
      rankings
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const openStudentReport = (studentId: string) => {
    setSelectedStudentIdForReport(studentId);
    setActiveMenu('raport');
  };

  return (
    <div className="space-y-6 max-w-[100vw]">
      {/* Top Controls Header */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <TableProperties className="w-6 h-6 text-blue-700" />
            <span>9. Leger Nilai Siswa (Kurikulum Merdeka)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rekapitulasi lengkap nilai formatif, sumatif, capaian kompetensi, rata-rata, dan peringkat kelas.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor ke Excel</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Leger (Landscape)</span>
          </button>
        </div>
      </div>

      {/* Filter and Configuration Card */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Class Select */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Rombel / Kelas
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.major}
                </option>
              ))}
            </select>
          </div>

          {/* Period Select */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Tahun & Penilaian
            </label>
            <select
              value={selectedPeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  TP {p.academicYear} {p.semester} ({p.assessmentType})
                </option>
              ))}
            </select>
          </div>

          {/* Ranking Method Toggle */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Metode Peringkat
            </label>
            <select
              value={rankingMethod}
              onChange={(e) => setRankingMethod(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="competition">Competition Ranking (1, 2, 2, 4)</option>
              <option value="dense">Dense Ranking (1, 2, 2, 3)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Urutan Tabel
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="default">Sesuai Nomor Absen Asli</option>
              <option value="name">Nama Siswa (A - Z)</option>
              <option value="average">Rata-rata Tertinggi</option>
              <option value="rank">Peringkat 1 s/d Akhir</option>
            </select>
          </div>
        </div>

        {/* Search & Incomplete Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari siswa dalam leger..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={showOnlyIncomplete}
                onChange={(e) => setShowOnlyIncomplete(e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 rounded"
              />
              <span>Hanya tampilkan siswa dengan nilai belum lengkap</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={includeIncompleteInRanking}
                onChange={(e) => setIncludeIncompleteInRanking(e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 rounded"
              />
              <span>Sertakan nilai belum lengkap dalam ranking</span>
            </label>
          </div>
        </div>
      </div>

      {/* Printable Leger Document */}
      <div className="printable-document bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Printable Formal Header */}
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={schoolProfile.logoUrl}
                alt="Logo"
                className="w-12 h-12 object-contain shrink-0"
              />
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  LEGER NILAI HASIL BELAJAR PESERTA DIDIK
                </h2>
                <div className="text-xs text-slate-600 font-medium">
                  {schoolProfile.name} • {schoolProfile.address}
                </div>
              </div>
            </div>

            <div className="text-right text-xs space-y-0.5">
              <div className="font-bold text-slate-800">
                Kelas: <span className="text-blue-900 font-extrabold">{selectedClass?.name}</span> (Fase {selectedClass?.fase})
              </div>
              <div className="text-slate-600">
                Tahun Pelajaran: {currentPeriod?.academicYear} | Semester {currentPeriod?.semester}
              </div>
              <div className="text-slate-500 text-[11px]">
                Wali Kelas: {selectedClass?.homeroomTeacher}
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Level Hierarchical Ledger Table */}
        <div className="overflow-x-auto max-h-[72vh] custom-scrollbar border-t border-slate-200">
          <table className="w-full text-xs report-table border-collapse border border-slate-300">
            {/* Header Row 1: Groups */}
            <thead className="bg-slate-100 text-slate-800 sticky top-0 z-20 shadow-xs font-semibold">
              <tr className="border-b border-slate-300">
                <th
                  rowSpan={2}
                  className="py-2.5 px-2 w-10 text-center border-r border-slate-300 bg-slate-100 sticky left-0 z-30"
                >
                  NO
                </th>
                <th
                  rowSpan={2}
                  className="py-2.5 px-3 min-w-[210px] text-left border-r border-slate-300 bg-slate-100 sticky left-10 z-30"
                >
                  Nama Peserta Didik
                </th>
                <th
                  rowSpan={2}
                  className="py-2.5 px-2 min-w-[70px] text-center border-r border-slate-300 bg-slate-100 font-mono"
                >
                  NIS
                </th>
                <th
                  rowSpan={2}
                  className="py-2.5 px-2 min-w-[80px] text-center border-r border-slate-300 bg-slate-100 font-mono"
                >
                  NISN
                </th>
                <th
                  rowSpan={2}
                  className="py-2.5 px-2 min-w-[65px] text-center border-r border-slate-300 bg-slate-100"
                >
                  Kelas
                </th>
                <th
                  rowSpan={2}
                  className="py-2.5 px-2 min-w-[50px] text-center border-r border-slate-300 bg-slate-100"
                >
                  Fase
                </th>

                {/* Subject Group Headers (3 sub-columns per subject) */}
                {activeSubjects.map((sub) => (
                  <th
                    key={sub.id}
                    colSpan={3}
                    className="py-2 px-2 text-center border-r border-slate-300 bg-slate-200/90 text-slate-900 font-bold max-w-[260px] truncate"
                    title={sub.name}
                  >
                    {sub.name}
                  </th>
                ))}

                {/* Summary Group Header */}
                <th
                  colSpan={4}
                  className="py-2 px-3 text-center border-l-2 border-blue-400 bg-blue-900 text-white font-bold"
                >
                  RINGKASAN & PERINGKAT
                </th>
              </tr>

              {/* Header Row 2: Sub-headers */}
              <tr className="border-b-2 border-slate-400 bg-slate-50 text-[11px] text-slate-600">
                {activeSubjects.map((sub) => (
                  <React.Fragment key={`sub-col-${sub.id}`}>
                    <th className="py-1 px-1.5 w-14 text-center border-r border-slate-300 font-medium">
                      Formatif
                    </th>
                    <th className="py-1 px-1.5 w-14 text-center border-r border-slate-300 font-bold text-slate-900 bg-blue-50/50">
                      Sumatif
                    </th>
                    <th className="py-1 px-2 min-w-[160px] text-left border-r border-slate-300 font-normal">
                      Capaian
                    </th>
                  </React.Fragment>
                ))}

                <th className="py-1 px-2 min-w-[65px] text-center border-r border-slate-300 bg-blue-800 text-white font-bold">
                  Rata-rata
                </th>
                <th className="py-1 px-2 min-w-[55px] text-center border-r border-slate-300 bg-blue-800 text-white font-medium">
                  Terisi
                </th>
                <th className="py-1 px-2 min-w-[55px] text-center border-r border-slate-300 bg-blue-800 text-white font-medium">
                  Kosong
                </th>
                <th className="py-1 px-2 min-w-[65px] text-center bg-amber-500 text-slate-950 font-black">
                  Peringkat
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200">
              {displayedStudents.map((st, idx) => {
                const summary = rankMap.get(st.id);
                const isOdd = idx % 2 === 1;

                return (
                  <tr
                    key={st.id}
                    className={`hover:bg-blue-50/60 transition-colors ${
                      isOdd ? 'bg-slate-50/40' : 'bg-white'
                    }`}
                  >
                    {/* Sticky Student Index */}
                    <td className="py-2 px-2 text-center font-mono text-slate-500 border-r border-slate-300 sticky left-0 z-10 bg-inherit font-semibold">
                      {idx + 1}
                    </td>

                    {/* Sticky Student Name with quick action */}
                    <td className="py-2 px-3 border-r border-slate-300 sticky left-10 z-10 bg-inherit font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2 group">
                        <span className="truncate">{st.name}</span>
                        <button
                          onClick={() => openStudentReport(st.id)}
                          className="no-print opacity-0 group-hover:opacity-100 p-1 text-blue-700 hover:bg-blue-100 rounded transition-all shrink-0"
                          title="Lihat Rapor Siswa"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="py-2 px-2 text-center font-mono text-slate-600 border-r border-slate-300">
                      {st.nis}
                    </td>

                    <td className="py-2 px-2 text-center font-mono text-slate-500 border-r border-slate-300">
                      {st.nisn || '—'}
                    </td>

                    <td className="py-2 px-2 text-center text-slate-700 border-r border-slate-300">
                      {selectedClass?.name}
                    </td>

                    <td className="py-2 px-2 text-center text-slate-700 border-r border-slate-300 font-semibold">
                      {selectedClass?.fase}
                    </td>

                    {/* Subject columns */}
                    {activeSubjects.map((sub) => {
                      const g = grades.find(
                        (grade) =>
                          grade.studentId === st.id &&
                          grade.subjectId === sub.id &&
                          grade.periodId === selectedPeriodId
                      );

                      const hasFormative = g && typeof g.formativeScore === 'number';
                      const hasSummative = g && typeof g.summativeScore === 'number';

                      return (
                        <React.Fragment key={`grade-${st.id}-${sub.id}`}>
                          {/* Formative */}
                          <td className="py-1 px-1.5 text-center font-mono border-r border-slate-300 text-slate-600">
                            {hasFormative ? g!.formativeScore : '—'}
                          </td>

                          {/* Summative */}
                          <td
                            className={`py-1 px-1.5 text-center font-mono font-bold border-r border-slate-300 ${
                              hasSummative
                                ? 'text-blue-900 bg-blue-50/30'
                                : 'text-amber-600 bg-amber-50/30'
                            }`}
                          >
                            {hasSummative ? g!.summativeScore : '—'}
                          </td>

                          {/* Competency */}
                          <td className="py-1 px-2 border-r border-slate-300 text-[11px] text-slate-600 leading-tight">
                            <span className="line-clamp-2" title={g?.competencyDesc || ''}>
                              {g?.competencyDesc || '—'}
                            </span>
                          </td>
                        </React.Fragment>
                      );
                    })}

                    {/* Summary Columns */}
                    <td className="py-2 px-2 text-center font-mono font-black text-blue-950 border-r border-slate-300 bg-blue-50/70 text-xs">
                      {summary ? summary.averageScore.toFixed(2) : '—'}
                    </td>

                    <td className="py-2 px-1 text-center font-mono text-slate-700 border-r border-slate-300 text-xs">
                      {summary ? summary.gradedCount : 0}
                    </td>

                    <td
                      className={`py-2 px-1 text-center font-mono text-xs border-r border-slate-300 ${
                        summary && summary.missingCount > 0
                          ? 'text-amber-700 font-bold bg-amber-50/50'
                          : 'text-slate-400'
                      }`}
                    >
                      {summary ? summary.missingCount : 0}
                    </td>

                    {/* Rank */}
                    <td className="py-2 px-2 text-center font-mono font-black border-slate-300 bg-amber-100 text-amber-950 text-xs">
                      {summary && summary.rank > 0 ? (
                        <span className="inline-flex items-center justify-center font-extrabold">
                          #{summary.rank}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-normal">
                          Belum Lengkap
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info and signoff */}
        <div className="p-4 bg-slate-50 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            Total Peserta Didik: <b>{classStudents.length} Siswa</b> | Mata Pelajaran Aktif: <b>{activeSubjects.length} Mapel</b>
          </div>

          <div className="text-right">
            <span>Bawang, {currentPeriod?.reportDate} • Wali Kelas: </span>
            <span className="font-bold text-slate-800">{selectedClass?.homeroomTeacher}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
