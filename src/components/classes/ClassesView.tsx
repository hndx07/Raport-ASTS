import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DoorOpen,
  Plus,
  Edit2,
  Trash2,
  Users,
  ArrowRightLeft,
  X,
  CheckCircle2,
} from 'lucide-react';
import { ClassGroup } from '../../types';

export const ClassesView: React.FC = () => {
  const {
    classes,
    selectedClassId,
    setSelectedClassId,
    addClass,
    updateClass,
    deleteClass,
    students,
    transferStudentClass,
    showToast,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassGroup | null>(null);

  const [name, setName] = useState('X TO 4');
  const [gradeLevel, setGradeLevel] = useState<'X' | 'XI' | 'XII'>('X');
  const [major, setMajor] = useState('Teknik Otomotif');
  const [homeroomTeacher, setHomeroomTeacher] = useState('Drs. Supriyanto, M.Pd.');
  const [fase, setFase] = useState<'E' | 'F'>('E');

  // Transfer modal
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [studentToTransfer, setStudentToTransfer] = useState('');
  const [targetClassId, setTargetClassId] = useState('');

  const openAddModal = () => {
    setEditingClass(null);
    setName('');
    setGradeLevel('X');
    setMajor('Teknik Otomotif');
    setHomeroomTeacher('');
    setFase('E');
    setIsModalOpen(true);
  };

  const openEditModal = (c: ClassGroup) => {
    setEditingClass(c);
    setName(c.name);
    setGradeLevel(c.gradeLevel);
    setMajor(c.major);
    setHomeroomTeacher(c.homeroomTeacher);
    setFase(c.fase);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      updateClass(editingClass.id, {
        name,
        gradeLevel,
        major,
        homeroomTeacher,
        fase,
      });
    } else {
      addClass({
        name,
        gradeLevel,
        major,
        homeroomTeacher,
        fase,
      });
    }
    setIsModalOpen(false);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToTransfer || !targetClassId) return;
    transferStudentClass(studentToTransfer, targetClassId);
    setTransferModalOpen(false);
    setStudentToTransfer('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <DoorOpen className="w-6 h-6 text-blue-700" />
            <span>5. Data Rombongan Belajar (Kelas)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola kelas, wali kelas, fase kurikulum merdeka (E / F), dan mutasi siswa antar kelas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTargetClassId(classes.find((c) => c.id !== selectedClassId)?.id || '');
              setTransferModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors border border-slate-300"
          >
            <ArrowRightLeft className="w-4 h-4 text-blue-600" />
            <span>Pindah Siswa</span>
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kelas</span>
          </button>
        </div>
      </div>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls) => {
          const studentCount = students.filter((s) => s.classId === cls.id).length;
          const isSelected = cls.id === selectedClassId;

          return (
            <div
              key={cls.id}
              className={`p-5 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-400 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                      Fase {cls.fase}
                    </span>
                    <span className="text-[11px] text-slate-400">•</span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Tingkat {cls.gradeLevel}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {cls.name}
                  </h3>
                  <div className="text-xs font-medium text-slate-600 mt-0.5">
                    {cls.major}
                  </div>
                </div>

                {isSelected ? (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Terpilih</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setSelectedClassId(cls.id)}
                    className="text-xs text-blue-700 hover:text-blue-900 font-semibold px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    Buka Kelas
                  </button>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/60 text-xs text-slate-600 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Wali Kelas:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                    {cls.homeroomTeacher || 'Belum Ditentukan'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Siswa:</span>
                  <span className="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded-md">
                    {studentCount} Siswa
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(cls)}
                  className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit Data Kelas"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {classes.length > 1 && (
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Hapus kelas ${cls.name}? Siswa dalam kelas ini (${studentCount}) perlu dialihkan.`
                        )
                      ) {
                        deleteClass(cls.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus Kelas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit Class */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {editingClass ? 'Edit Informasi Kelas' : 'Tambah Rombel Kelas Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Kelas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="X TO 4"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Fase Kurikulum
                  </label>
                  <select
                    value={fase}
                    onChange={(e) => setFase(e.target.value as 'E' | 'F')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="E">Fase E (Kelas X)</option>
                    <option value="F">Fase F (Kelas XI / XII)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tingkat
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value as 'X' | 'XI' | 'XII')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Program / Konsentrasi Keahlian
                  </label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    required
                    placeholder="Teknik Otomotif"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Wali Kelas (dengan Gelar)
                </label>
                <input
                  type="text"
                  value={homeroomTeacher}
                  onChange={(e) => setHomeroomTeacher(e.target.value)}
                  placeholder="Drs. Supriyanto, M.Pd."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Transfer Siswa Antar Kelas */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                <span>Pemindahan Siswa Antar Kelas</span>
              </h2>
              <button
                onClick={() => setTransferModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransfer} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Siswa yang Dipindahkan
                </label>
                <select
                  value={studentToTransfer}
                  onChange={(e) => setStudentToTransfer(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="">-- Pilih Siswa --</option>
                  {students.map((s) => {
                    const currentCls = classes.find((c) => c.id === s.classId);
                    return (
                      <option key={s.id} value={s.id}>
                        {s.name} (NIS: {s.nis}) — Kelas Saat Ini: {currentCls?.name || '—'}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pindahkan ke Kelas Tujuan
                </label>
                <select
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="">-- Pilih Kelas Tujuan --</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.major}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                Perhatian: Pemindahan siswa akan memindahkan rekaman siswa ke rombel baru. Nilai yang
                sudah diinput pada semester ini tetap tersimpan.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTransferModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!studentToTransfer || !targetClassId}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-xl"
                >
                  Konfirmasi Pindah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
