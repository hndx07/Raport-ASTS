import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  DoorOpen,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Edit3,
  TableProperties,
  Printer,
  Sparkles,
  Trophy,
  Award,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    schoolProfile,
    periods,
    selectedPeriodId,
    setSelectedPeriodId,
    classes,
    selectedClassId,
    setSelectedClassId,
    students,
    subjects,
    grades,
    classStudents,
    selectedClass,
    currentPeriod,
    setActiveMenu,
    getClassRankings,
  } = useApp();

  const activeSubjects = subjects.filter((s) => s.isActive);
  const totalSlots = classStudents.length * activeSubjects.length;

  // Count filled grades in selected class and period
  let filledCount = 0;
  classStudents.forEach((st) => {
    activeSubjects.forEach((sub) => {
      const g = grades.find(
        (x) =>
          x.studentId === st.id &&
          x.subjectId === sub.id &&
          x.periodId === selectedPeriodId
      );
      if (g && typeof g.summativeScore === 'number' && !isNaN(g.summativeScore)) {
        filledCount++;
      }
    });
  });

  const missingCount = Math.max(0, totalSlots - filledCount);
  const completionPercentage = totalSlots > 0 ? Math.round((filledCount / totalSlots) * 100) : 0;

  // Top 3 students
  const rankings = getClassRankings(selectedClassId, selectedPeriodId);
  const topStudents = rankings.filter((r) => r.rank > 0).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-500/30 text-blue-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Sistem Rapor & Leger Resmi Kurikulum Merdeka</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang di {schoolProfile.name}
            </h1>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Kelola pengolahan nilai, hitung leger dan peringkat otomatis, serta cetak dokumen
              Laporan Hasil Belajar Asesmen Sumatif Tengah Semester (PTS) secara praktis dan rapi.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveMenu('input_nilai')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-900 font-semibold rounded-xl shadow-md hover:bg-blue-50 transition-all text-sm"
            >
              <Edit3 className="w-4 h-4 text-blue-700" />
              <span>Input Nilai</span>
            </button>
            <button
              onClick={() => setActiveMenu('leger')}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/90 hover:bg-blue-600 text-white font-semibold rounded-xl border border-blue-400/40 transition-all text-sm"
            >
              <TableProperties className="w-4 h-4 text-amber-300" />
              <span>Buka Leger</span>
            </button>
            <button
              onClick={() => setActiveMenu('raport')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-sm transition-all text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Rapor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>Filter Pengolahan Aktif:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-xs text-slate-500 block mb-1">Tahun & Semester</label>
            <select
              value={selectedPeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-medium rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  TP {p.academicYear} — Semester {p.semester} ({p.assessmentType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-500 block mb-1">Kelas Aktif</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-medium rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.major}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Siswa */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Siswa Terdaftar
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {classStudents.length} <span className="text-xs font-normal text-slate-500">di kelas ini</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Total {students.length} siswa sekolah
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Kelas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Jumlah Rombel
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {classes.length} <span className="text-xs font-normal text-slate-500">Kelas</span>
            </div>
            <div className="text-xs text-slate-600 mt-1 truncate max-w-[150px]">
              Wali: {selectedClass?.homeroomTeacher || '—'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DoorOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Mata Pelajaran */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Mata Pelajaran
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {activeSubjects.length} <span className="text-xs font-normal text-slate-500">Aktif</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Umum, Kejuruan & ISMUBA
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Kelengkapan Nilai */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Kelengkapan Nilai
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {completionPercentage}%
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {filledCount} terisi / {missingCount} belum
            </div>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              completionPercentage === 100
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            {completionPercentage === 100 ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
        </div>
      </div>

      {/* Progress & Quick Links Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Bar & Class Status */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Status Penginputan Nilai Kelas {selectedClass?.name}
            </h2>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                completionPercentage === 100
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {completionPercentage === 100 ? 'Siap Cetak' : 'Penginputan Berjalan'}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
              <span>Progres Pengisian Sel Nilai ({filledCount} dari {totalSlots} nilai)</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <div className="text-xs text-slate-500">Mata Pelajaran Umum</div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">
                {subjects.filter((s) => s.category.includes('UMUM') && s.isActive).length} Mapel
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <div className="text-xs text-slate-500">Mata Pelajaran Kejuruan</div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">
                {subjects.filter((s) => s.category.includes('KEJURUAN') && s.isActive).length} Mapel
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <div className="text-xs text-slate-500">Kelompok ISMUBA</div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">
                {subjects.filter((s) => s.category.includes('ISMUBA') && s.isActive).length} Mapel
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Penerbitan Rapor: <span className="font-semibold text-slate-700">{currentPeriod?.reportDate}</span>
            </div>
            <button
              onClick={() => setActiveMenu('leger')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 group"
            >
              <span>Lihat Detail di Tabel Leger</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Top 3 Rankings Leaderboard Preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">Peringkat Teratas</h2>
            </div>
            <button
              onClick={() => setActiveMenu('peringkat')}
              className="text-xs text-blue-700 font-semibold hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {topStudents.length === 0 ? (
              <div className="text-xs text-slate-500 py-6 text-center">
                Belum ada siswa dengan nilai lengkap untuk dihitung peringkatnya.
              </div>
            ) : (
              topStudents.map((item, idx) => (
                <div
                  key={item.studentId}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        idx === 0
                          ? 'bg-amber-400 text-amber-950 shadow-xs'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-800'
                          : 'bg-amber-700/20 text-amber-800'
                      }`}
                    >
                      {item.rank}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {item.student.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        NIS: {item.student.nis}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-blue-900">
                      {item.averageScore.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500">Rata-rata</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-900 flex items-start gap-2">
            <Award className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <span>
              Perhitungan peringkat menggunakan metode <b>Competition Ranking</b> sesuai standar evaluasi sekolah.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
