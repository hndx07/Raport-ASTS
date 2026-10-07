import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DatabaseBackup,
  Download,
  Upload,
  RotateCcw,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

export const BackupRestoreView: React.FC = () => {
  const {
    exportBackupJson,
    restoreBackupJson,
    resetToDefaultData,
    storageUsageKb,
    showToast,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);

  const handleDownloadBackup = () => {
    const jsonStr = exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MUHIBA_RAPORT_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Cadangan data sistem berhasil diunduh dalam format JSON.');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (confirm('Apakah Anda yakin ingin memulihkan cadangan ini? Data saat ini akan digantikan oleh isi file cadangan.')) {
        const success = restoreBackupJson(content);
        if (success) {
          setRestoreStatus('Data berhasil dipulihkan!');
          setTimeout(() => setRestoreStatus(null), 3000);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefault = () => {
    if (
      confirm(
        'PERINGATAN: Anda akan mengembalikan database ke dataset default awal (Kelas X TO 4, 35 Siswa, dan Mata Pelajaran Standar). Semua perubahan kustom yang belum dibackup akan hilang. Lanjutkan?'
      )
    ) {
      resetToDefaultData();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <DatabaseBackup className="w-6 h-6 text-blue-700" />
          <span>14. Backup & Pemulihan Basis Data</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Amankan seluruh data sekolah, kelas, siswa, dan nilai rapor dalam satu file JSON terenkapsulasi.
        </p>
      </div>

      {/* Storage Information Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase">
              Mode Penyimpanan Lokal Aktif
            </div>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              Browser Local Storage ({storageUsageKb} KB Digunakan)
            </div>
            <div className="text-xs text-slate-500">
              Data tersimpan aman di perangkat Anda secara real-time dan tidak memerlukan koneksi internet.
            </div>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Stabil & Terisolasi</span>
        </span>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-600" />
              <span>Ekspor Cadangan (Backup JSON)</span>
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Unduh seluruh rekaman database sekolah, meliputi data profil sekolah, guru, rombel,
            siswa, mata pelajaran, nilai, ekstrakurikuler, dan absensi dalam format file cadangan JSON.
          </p>

          <button
            onClick={handleDownloadBackup}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Cadangan Lengkap (.json)</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Pulihkan Data (Restore JSON)</span>
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Muat kembali file cadangan JSON yang pernah Anda unduh sebelumnya untuk memulihkan seluruh
            data ke dalam aplikasi secara instan.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Pilih File Cadangan JSON</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset to Default Dataset */}
      <div className="bg-red-50/60 p-6 rounded-2xl border border-red-200 space-y-3">
        <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span>Zona Pemulihan Standar Awal</span>
        </div>
        <p className="text-xs text-red-800 leading-relaxed">
          Jika Anda ingin mengembalikan aplikasi ke kondisi awal pabrikan dengan data lengkap Kelas X TO 4
          (35 siswa dan nilai asesmen autentik sesuai format SMK Muhammadiyah Bawang), klik tombol berikut:
        </p>

        <div className="pt-2">
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Kembalikan ke Data Contoh Awal (Reset)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
