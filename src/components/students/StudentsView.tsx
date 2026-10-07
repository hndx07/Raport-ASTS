import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users2,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  X,
  FileSpreadsheet,
  CheckCircle,
} from 'lucide-react';
import { Student } from '../../types';

export const StudentsView: React.FC = () => {
  const {
    students,
    classes,
    selectedClassId,
    setSelectedClassId,
    addStudent,
    updateStudent,
    deleteStudent,
    setActiveMenu,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>(selectedClassId || 'all');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'nis_asc' | 'nis_desc'>('name_asc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form states
  const [nis, setNis] = useState('');
  const [nisn, setNisn] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [birthPlace, setBirthPlace] = useState('Batang');
  const [birthDate, setBirthDate] = useState('2008-01-01');
  const [classId, setClassId] = useState(selectedClassId);
  const [parentName, setParentName] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Mutasi' | 'Lulus'>('Aktif');

  // Filtered and sorted students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesClass = filterClass === 'all' || s.classId === filterClass;
        const matchesSearch =
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.nisn.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesClass && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
        if (sortBy === 'nis_asc') return a.nis.localeCompare(b.nis);
        if (sortBy === 'nis_desc') return b.nis.localeCompare(a.nis);
        return 0;
      });
  }, [students, filterClass, searchQuery, sortBy]);

  const openAddModal = () => {
    setEditingStudent(null);
    setNis('');
    setNisn('');
    setName('');
    setGender('L');
    setBirthPlace('Batang');
    setBirthDate('2008-01-01');
    setClassId(selectedClassId);
    setParentName('');
    setStatus('Aktif');
    setIsModalOpen(true);
  };

  const openEditModal = (s: Student) => {
    setEditingStudent(s);
    setNis(s.nis);
    setNisn(s.nisn);
    setName(s.name);
    setGender(s.gender);
    setBirthPlace(s.birthPlace);
    setBirthDate(s.birthDate);
    setClassId(s.classId);
    setParentName(s.parentName);
    setStatus(s.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent(editingStudent.id, {
        nis,
        nisn,
        name: name.toUpperCase(),
        gender,
        birthPlace,
        birthDate,
        classId,
        parentName,
        status,
      });
    } else {
      addStudent({
        nis,
        nisn,
        name: name.toUpperCase(),
        gender,
        birthPlace,
        birthDate,
        classId,
        parentName,
        status,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Users2 className="w-6 h-6 text-blue-700" />
            <span>6. Data Siswa Peserta Didik</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manajemen identitas siswa, NIS, NISN, orang tua wali, dan status aktif.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMenu('excel')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold rounded-xl text-xs sm:text-sm transition-colors border border-emerald-200"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Impor Excel</span>
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa, NIS, atau NISN..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
            <select
              value={filterClass}
              onChange={(e) => {
                setFilterClass(e.target.value);
                if (e.target.value !== 'all') {
                  setSelectedClassId(e.target.value);
                }
              }}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">Semua Kelas ({students.length})</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Kelas {c.name} ({students.filter((s) => s.classId === c.id).length})
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="name_asc">Nama (A - Z)</option>
              <option value="name_desc">Nama (Z - A)</option>
              <option value="nis_asc">NIS (Terkecil)</option>
              <option value="nis_desc">NIS (Terbesar)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">NO</th>
                <th className="py-3 px-4">NAMA LENGKAP SISWA</th>
                <th className="py-3 px-4">NIS</th>
                <th className="py-3 px-4">NISN</th>
                <th className="py-3 px-4">KELAS</th>
                <th className="py-3 px-4">L/P</th>
                <th className="py-3 px-4">ORANG TUA / WALI</th>
                <th className="py-3 px-4 text-center">STATUS</th>
                <th className="py-3 px-4 text-center w-24">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Tidak ditemukan data siswa yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, index) => {
                  const studentClass = classes.find((c) => c.id === st.classId);
                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      <td className="py-3 px-4 text-center font-mono text-slate-500 text-xs">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {st.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {st.birthPlace}, {st.birthDate}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {st.nis}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {st.nisn || '—'}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs">
                          {studentClass?.name || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600">
                        {st.gender}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-xs truncate max-w-[180px]">
                        {st.parentName || '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {st.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(st)}
                            className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus data siswa ${st.name}? Seluruh nilai akan ikut terhapus.`)) {
                                deleteStudent(st.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Menampilkan <b>{filteredStudents.length}</b> dari total <b>{students.length}</b> siswa
          </div>
          <div className="text-[11px] text-slate-400">
            Urutan alfabetis nama siswa aktif secara default
          </div>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="ADHITYA WAHYU PRADANA"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIS <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    required
                    placeholder="5421"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NISN
                  </label>
                  <input
                    type="text"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    placeholder="0084510101"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kelas Penempatan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.major}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    <option value="L">Laki-Laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="Batang"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Orang Tua / Wali
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Nama Bapak / Ibu / Wali Siswa"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
