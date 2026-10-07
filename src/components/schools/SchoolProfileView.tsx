import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Image,
  PenTool,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { initialSchoolProfile } from '../../data/initialData';

export const SchoolProfileView: React.FC = () => {
  const { schoolProfile, updateSchoolProfile, showToast } = useApp();

  const [formData, setFormData] = useState({ ...schoolProfile });
  const [logoLoadError, setLogoLoadError] = useState(false);
  const [sigLoadError, setSigLoadError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const resetToOfficialBranding = () => {
    setFormData({
      ...formData,
      logoUrl: initialSchoolProfile.logoUrl,
      headmasterSignatureUrl: initialSchoolProfile.headmasterSignatureUrl,
      headmasterName: initialSchoolProfile.headmasterName,
      headmasterNbm: initialSchoolProfile.headmasterNbm,
    });
    setLogoLoadError(false);
    setSigLoadError(false);
    showToast('info', 'Tautan logo dan tanda tangan resmi telah direset ke tautan awal.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-blue-700" />
            <span>2. Data & Identitas Resmi Sekolah</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pengaturan identitas sekolah, kepala sekolah, NBM, serta URL logo dan stempel tanda tangan.
          </p>
        </div>

        <button
          onClick={resetToOfficialBranding}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset URL Branding Asli</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identitas Umum */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Identitas Lembaga Pendidikan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Sekolah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Pokok Sekolah Nasional (NPSN) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.npsn}
                onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Lengkap Sekolah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kecamatan / Kota Penerbitan Dokumen <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                placeholder="Bawang"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Digunakan pada titimangsa rapor: "Bawang, 8 Oktober 2026"
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kode Pos
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {/* Kepala Sekolah & Pengesahan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <PenTool className="w-4 h-4 text-blue-600" />
            <span>Pejabat Penandatangan & Kepala Sekolah</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Kepala Sekolah (dengan Gelar) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.headmasterName}
                onChange={(e) => setFormData({ ...formData, headmasterName: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Baku Muhammadiyah (NBM) / NIP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.headmasterNbm}
                onChange={(e) => setFormData({ ...formData, headmasterNbm: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium font-mono"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showHeadmasterSignature}
                  onChange={(e) =>
                    setFormData({ ...formData, showHeadmasterSignature: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs sm:text-sm font-medium text-slate-800">
                  Tampilkan gambar tanda tangan digital pada cetakan Rapor PTS
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Media URLs & Verification Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo URL & Preview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Image className="w-4 h-4 text-blue-600" />
                <span>Logo Resmi Sekolah</span>
              </h3>
              <span className="text-[11px] text-blue-800 bg-blue-50 font-semibold px-2 py-0.5 rounded">
                Proporsional
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL Gambar Logo
              </label>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => {
                  setFormData({ ...formData, logoUrl: e.target.value });
                  setLogoLoadError(false);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Preview Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[160px]">
              {logoLoadError ? (
                <div className="text-center p-3 text-red-600 space-y-1">
                  <AlertCircle className="w-6 h-6 mx-auto" />
                  <div className="text-xs font-semibold">Gagal memuat gambar logo!</div>
                  <div className="text-[11px] text-slate-500">
                    Periksa kembali URL gambar di atas atau periksa koneksi internet Anda.
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-center">
                  <img
                    src={formData.logoUrl}
                    alt="Logo SMK Muhammadiyah Bawang"
                    className="max-h-24 max-w-[140px] object-contain mx-auto transition-transform hover:scale-105"
                    onError={() => setLogoLoadError(true)}
                  />
                  <div className="text-[11px] text-emerald-700 font-medium flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Logo resmi terverifikasi</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Signature URL & Preview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PenTool className="w-4 h-4 text-blue-600" />
                <span>Tanda Tangan Kepala Sekolah</span>
              </h3>
              <span className="text-[11px] text-emerald-800 bg-emerald-50 font-semibold px-2 py-0.5 rounded">
                Pengesahan
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL Gambar Tanda Tangan
              </label>
              <input
                type="url"
                value={formData.headmasterSignatureUrl}
                onChange={(e) => {
                  setFormData({ ...formData, headmasterSignatureUrl: e.target.value });
                  setSigLoadError(false);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Manual Size Adjustment Controls */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Pengaturan Manual Ukuran Tanda Tangan</span>
                <span className="text-[11px] font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  {formData.headmasterSignatureHeight || 65}px × {formData.headmasterSignatureWidth || 140}px
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Tinggi (Height)</span>
                    <span className="font-mono font-bold text-slate-800">{formData.headmasterSignatureHeight || 65} px</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="140"
                    step="5"
                    value={formData.headmasterSignatureHeight || 65}
                    onChange={(e) =>
                      setFormData({ ...formData, headmasterSignatureHeight: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Lebar Maksimal (Width)</span>
                    <span className="font-mono font-bold text-slate-800">{formData.headmasterSignatureWidth || 140} px</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="260"
                    step="10"
                    value={formData.headmasterSignatureWidth || 140}
                    onChange={(e) =>
                      setFormData({ ...formData, headmasterSignatureWidth: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Preview Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[160px]">
              {sigLoadError ? (
                <div className="text-center p-3 text-red-600 space-y-1">
                  <AlertCircle className="w-6 h-6 mx-auto" />
                  <div className="text-xs font-semibold">Gagal memuat gambar tanda tangan!</div>
                  <div className="text-[11px] text-slate-500">
                    Pastikan URL gambar tanda tangan dapat diakses publik.
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-center">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 inline-flex items-center justify-center shadow-2xs overflow-hidden">
                    <img
                      src={formData.headmasterSignatureUrl}
                      alt="Tanda Tangan Kepala Sekolah"
                      style={{
                        height: `${formData.headmasterSignatureHeight || 65}px`,
                        maxWidth: `${formData.headmasterSignatureWidth || 140}px`,
                      }}
                      className="object-contain mx-auto transition-all duration-150"
                      onError={() => setSigLoadError(true)}
                    />
                  </div>
                  <div className="text-[11px] text-slate-700 font-medium">
                    {formData.headmasterName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    NBM. {formData.headmasterNbm}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-md transition-all text-sm"
          >
            {isSaved ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span>Perubahan Tersimpan!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Identitas</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
