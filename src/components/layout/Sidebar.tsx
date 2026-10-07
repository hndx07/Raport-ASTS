import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  CalendarDays,
  DoorOpen,
  Users2,
  BookOpen,
  Edit3,
  TableProperties,
  FileText,
  Trophy,
  FileSpreadsheet,
  Printer,
  DatabaseBackup,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const {
    activeMenu,
    setActiveMenu,
    classStudents,
    subjects,
    grades,
    selectedPeriodId,
  } = useApp();

  // Calculate missing grades in current class for badge
  const activeSubjectCount = subjects.filter((s) => s.isActive).length;
  let incompleteCount = 0;
  classStudents.forEach((student) => {
    let studentGraded = 0;
    subjects.filter((s) => s.isActive).forEach((sub) => {
      const g = grades.find(
        (x) =>
          x.studentId === student.id &&
          x.subjectId === sub.id &&
          x.periodId === selectedPeriodId
      );
      if (g && typeof g.summativeScore === 'number') {
        studentGraded++;
      }
    });
    if (studentGraded < activeSubjectCount) {
      incompleteCount++;
    }
  });

  const menuSections = [
    {
      title: 'UTAMA',
      items: [
        { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
        { id: 'input_nilai', label: '8. Input Nilai', icon: Edit3, badge: 'Cepat' },
        { id: 'leger', label: '9. Leger Nilai', icon: TableProperties, highlight: true },
        { id: 'raport', label: '10. Raport PTS', icon: FileText, highlight: true },
        { id: 'peringkat', label: '11. Rekap Peringkat', icon: Trophy },
      ],
    },
    {
      title: 'DATA MASTER',
      items: [
        { id: 'sekolah', label: '2. Data Sekolah', icon: Building2 },
        { id: 'guru', label: '3. Data Guru', icon: GraduationCap },
        { id: 'tahun_pelajaran', label: '4. Data Tahun & Semester', icon: CalendarDays },
        { id: 'kelas', label: '5. Data Kelas', icon: DoorOpen },
        { id: 'siswa', label: '6. Data Siswa', icon: Users2, badge: `${classStudents.length}` },
        { id: 'mapel', label: '7. Data Mata Pelajaran', icon: BookOpen, badge: `${activeSubjectCount}` },
      ],
    },
    {
      title: 'ALAT & UTILITAS',
      items: [
        { id: 'excel', label: '12. Impor & Ekspor Excel', icon: FileSpreadsheet },
        { id: 'pengaturan_cetak', label: '13. Pengaturan Cetak', icon: Printer },
        { id: 'backup', label: '14. Backup & Pemulihan', icon: DatabaseBackup },
      ],
    },
  ];

  const handleSelect = (id: string) => {
    setActiveMenu(id);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="no-print fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`no-print sidebar-container fixed lg:sticky top-0 lg:top-[57px] bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:h-[calc(100vh-57px)]`}
      >
        {/* Navigation scrollable area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar text-xs">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {section.title}
              </div>
              <div className="space-y-0.5 mt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-all group ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive
                              ? 'text-white'
                              : item.highlight
                              ? 'text-amber-400'
                              : 'text-slate-400 group-hover:text-blue-400'
                          }`}
                        />
                        <span className="truncate text-left">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                            isActive
                              ? 'bg-blue-800 text-blue-100'
                              : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
            <span>SMK MUHIBA</span>
            <span className="text-[10px] text-emerald-400 font-mono">v1.2 Live</span>
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            Sistem Nilai & Raport Merdeka
          </div>
        </div>
      </aside>
    </>
  );
};
