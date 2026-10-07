import React from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, Sliders, CheckCircle2, RotateCcw } from 'lucide-react';
import { initialPrintSettings } from '../../data/initialData';

export const PrintSettingsView: React.FC = () => {
  const { printSettings, updatePrintSettings, showToast } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Printer className="w-6 h-6 text-blue-700" />
            <span>13. Pengaturan Tata Letak Dokumen & Cetak</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kustomisasi ukuran kertas, tipografi, dan area tanda tangan dokumen Rapor PTS dan Leger.
          </p>
        </div>

        <button
          onClick={() => {
            updatePrintSettings(initialPrintSettings);
            showToast('info', 'Pengaturan cetak dikembalikan ke pengaturan awal standar.');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Pengaturan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kertas & Orientasi */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Format Kertas & Tata Letak
          </h2>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ukuran Kertas Standar Rapor
              </label>
              <select
                value={printSettings.paperSize}
                onChange={(e) => updatePrintSettings({ paperSize: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none font-semibold text-slate-800"
              >
                <option value="A4">A4 (210 x 297 mm) — Standar Resmi</option>
                <option value="F4">F4 / Folio (215 x 330 mm)</option>
                <option value="A3">A3 (297 x 420 mm) — Khusus Leger Besar</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Gaya Tipografi Dokumen
              </label>
              <select
                value={printSettings.fontFamily}
                onChange={(e) => updatePrintSettings({ fontFamily: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none font-semibold text-slate-800"
              >
                <option value="times">Times New Roman (Formal Tradisional)</option>
                <option value="sans">Arial / Sans-Serif (Modern & Bersih)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kerapatan Spasi Tabel
              </label>
              <select
                value={printSettings.fontSize}
                onChange={(e) => updatePrintSettings({ fontSize: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none font-semibold text-slate-800"
              >
                <option value="compact">Kompak (Satu Halaman Penuh - Direkomendasikan)</option>
                <option value="normal">Normal (Proporsional & Seimbang)</option>
                <option value="spacious">Lebar (Lebih Renggang)</option>
              </select>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-blue-200 bg-blue-50/60 cursor-pointer">
              <input
                type="checkbox"
                checked={printSettings.fitToOnePage}
                onChange={(e) => updatePrintSettings({ fitToOnePage: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <div className="font-bold text-blue-950">
                  Kunci Rapor Pasti 1 Halaman A4
                </div>
                <div className="text-xs text-blue-800">
                  Secara otomatis mengoptimalkan skala, margin, dan tinggi baris agar rapor tidak tumpah ke lembar kedua.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Pengesahan & Tanda Tangan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Pengesahan & Ukuran Tanda Tangan
          </h2>

          <div className="space-y-3 text-xs sm:text-sm">
            {/* Signature Height Slider */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Ukuran Tinggi Tanda Tangan Kepala Sekolah</span>
                <span className="font-mono text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {printSettings.headmasterSignatureHeight || 65} px
                </span>
              </div>
              <input
                type="range"
                min="35"
                max="130"
                step="5"
                value={printSettings.headmasterSignatureHeight || 65}
                onChange={(e) =>
                  updatePrintSettings({ headmasterSignatureHeight: Number(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="text-[11px] text-slate-500">
                * Geser untuk mengecilkan atau membesarkan gambar tanda tangan agar pas dengan halaman rapor.
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={printSettings.showHeadmasterSignature}
                onChange={(e) => updatePrintSettings({ showHeadmasterSignature: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <div className="font-semibold text-slate-800">
                  Tanda Tangan Digital Kepala Sekolah
                </div>
                <div className="text-xs text-slate-500">
                  Sertakan stempel dan tanda tangan resmi kepala sekolah di bagian bawah.
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={printSettings.showHomeroomSignature}
                onChange={(e) => updatePrintSettings({ showHomeroomSignature: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <div className="font-semibold text-slate-800">
                  Kolom Tanda Tangan Wali Kelas
                </div>
                <div className="text-xs text-slate-500">
                  Sediakan ruang tanda tangan manual wali kelas di kanan bawah.
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={printSettings.showParentSignature}
                onChange={(e) => updatePrintSettings({ showParentSignature: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <div className="font-semibold text-slate-800">
                  Kolom Tanda Tangan Orang Tua / Wali
                </div>
                <div className="text-xs text-slate-500">
                  Sediakan garis tanda tangan orang tua/wali siswa di kiri bawah.
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
