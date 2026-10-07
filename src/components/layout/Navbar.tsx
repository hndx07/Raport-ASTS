import React from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, Calendar, Users, Menu, X, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const {
    schoolProfile,
    periods,
    selectedPeriodId,
    setSelectedPeriodId,
    classes,
    selectedClassId,
    setSelectedClassId,
    setActiveMenu,
  } = useApp();

  return (
    <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 lg:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & School Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg lg:hidden"
            title="Buka Navigasi"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActiveMenu('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center p-1 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
              <img
                src={schoolProfile.logoUrl}
                alt={schoolProfile.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-blue-950">
                  MUHIBA RAPORT
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.5 rounded uppercase">
                  Kurikulum Merdeka
                </span>
              </div>
              <div className="text-xs text-slate-500 hidden sm:block truncate max-w-[280px]">
                {schoolProfile.name}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Context Selectors (Period & Class) and Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Period Selector */}
          <div className="flex items-center bg-slate-100 rounded-lg px-2.5 py-1.5 border border-slate-200">
            <Calendar className="w-4 h-4 text-blue-600 mr-1.5 shrink-0" />
            <select
              value={selectedPeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-medium text-slate-700 outline-none cursor-pointer pr-1"
            >
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.academicYear} {p.semester} ({p.assessmentType})
                </option>
              ))}
            </select>
          </div>

          {/* Class Selector */}
          <div className="flex items-center bg-slate-100 rounded-lg px-2.5 py-1.5 border border-slate-200">
            <Users className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-none cursor-pointer pr-1"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fast action: View Report */}
          <button
            onClick={() => setActiveMenu('raport')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rapor</span>
          </button>
        </div>
      </div>
    </header>
  );
};
