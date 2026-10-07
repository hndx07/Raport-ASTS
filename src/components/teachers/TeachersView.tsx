import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Plus, Edit2, Trash2, X, Phone, BookOpen } from 'lucide-react';
import { Teacher } from '../../types';

export const TeachersView: React.FC = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [name, setName] = useState('');
  const [nipOrNbm, setNipOrNbm] = useState('');
  const [subjectTaught, setSubjectTaught] = useState('');
  const [phone, setPhone] = useState('');

  const openAddModal = () => {
    setEditingTeacher(null);
    setName('');
    setNipOrNbm('');
    setSubjectTaught('');
    setPhone('');
    setIsModalOpen(true);
  };

  const openEditModal = (t: Teacher) => {
    setEditingTeacher(t);
    setName(t.name);
    setNipOrNbm(t.nipOrNbm);
    setSubjectTaught(t.subjectTaught);
    setPhone(t.phone || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      updateTeacher(editingTeacher.id, {
        name,
        nipOrNbm,
        subjectTaught,
        phone,
      });
    } else {
      addTeacher({
        name,
        nipOrNbm,
        subjectTaught,
        phone,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-blue-700" />
            <span>3. Data Guru & Tenaga Pendidik</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar guru pengampu mata pelajaran dan wali kelas di lingkungan SMK Muhammadiyah Bawang.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Data Guru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 border border-blue-100">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {t.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    NBM/NIP: {t.nipOrNbm}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-800">{t.subjectTaught}</span>
              </div>
              {t.phone && (
                <div className="flex items-center gap-2 text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.phone}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-1 border-t border-slate-100">
              <button
                onClick={() => openEditModal(t)}
                className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Hapus data guru ${t.name}?`)) {
                    deleteTeacher(t.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {editingTeacher ? 'Edit Data Guru' : 'Tambah Guru Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Drs. Supriyanto, M.Pd."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  NBM / NIP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nipOrNbm}
                  onChange={(e) => setNipOrNbm(e.target.value)}
                  required
                  placeholder="1102.7909.1069421"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mata Pelajaran yang Diampu / Tugas Tambahan
                </label>
                <input
                  type="text"
                  value={subjectTaught}
                  onChange={(e) => setSubjectTaught(e.target.value)}
                  placeholder="Dasar-Dasar Program Keahlian / Wali Kelas X TO 4"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  No. Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
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
                  Simpan Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
