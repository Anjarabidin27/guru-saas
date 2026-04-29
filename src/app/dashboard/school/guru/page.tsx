import { cn } from '@/lib/utils'

const teachers = [
  { id: '1', nama: 'Bu Sari Rahayu, S.Pd.', mapel: 'Matematika', soal: 48, materi: 12, status: 'aktif', joined: '6 bln lalu', initials: 'SR', color: 'from-blue-500 to-indigo-500' },
  { id: '2', nama: 'Pak Budi Santoso, M.Pd.', mapel: 'Fisika', soal: 31, materi: 8, status: 'aktif', joined: '4 bln lalu', initials: 'BS', color: 'from-orange-500 to-red-500' },
  { id: '3', nama: 'Ibu Anita Wijaya, S.Pd.', mapel: 'Bahasa Indonesia', soal: 62, materi: 20, status: 'aktif', joined: '1 thn lalu', initials: 'AW', color: 'from-green-500 to-teal-500' },
  { id: '4', nama: 'Pak Dedi Kusuma, S.T.', mapel: 'Informatika', soal: 15, materi: 5, status: 'tidak_aktif', joined: '2 bln lalu', initials: 'DK', color: 'from-purple-500 to-pink-500' },
  { id: '5', nama: 'Ibu Rani Puspita, S.Pd.', mapel: 'Bahasa Inggris', soal: 39, materi: 14, status: 'aktif', joined: '8 bln lalu', initials: 'RP', color: 'from-teal-500 to-cyan-500' },
]

export default function DataGuruPage() {
  return (
    <div className="flex flex-col gap-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">👩‍🏫 Data Guru Sekolah</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola akun dan pantau kontribusi setiap guru.</p>
        </div>
        <div className="flex gap-2">
          <button className="border-2 border-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all text-sm">
            📥 Unduh Data
          </button>
          <button className="bg-amber-500 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-100 text-sm">
            ➕ Tambah Guru
          </button>
        </div>
      </div>

      {/* Quota Banner */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-3xl">👥</span>
          <div>
            <p className="font-bold text-amber-900 text-base">Kuota Guru: 8 dari 20 terpakai</p>
            <p className="text-amber-700 text-sm">Paket Freemium Anda mendukung hingga 20 akun guru aktif.</p>
          </div>
        </div>
        <div className="w-full md:w-48">
          <div className="flex justify-between text-xs font-bold text-amber-700 mb-1.5">
            <span>8 / 20 guru</span>
            <span>40%</span>
          </div>
          <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-[40%] rounded-full" />
          </div>
        </div>
      </div>

      {/* Teacher Table */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Daftar Guru Aktif</h2>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Cari nama guru..."
              className="pl-8 pr-4 py-2 bg-slate-50 rounded-xl text-xs font-medium outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Guru</th>
                <th className="px-6 py-4">Kontribusi</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{t.nama}</p>
                        <p className="text-xs text-slate-400">{t.mapel} · Bergabung {t.joined}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <div className="text-center">
                        <div className="text-sm font-black text-blue-600">{t.soal}</div>
                        <div className="text-[10px] text-slate-400 font-bold">Soal</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-black text-green-600">{t.materi}</div>
                        <div className="text-[10px] text-slate-400 font-bold">Materi</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border',
                      t.status === 'aktif'
                        ? 'bg-green-50 text-green-600 border-green-200'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    )}>
                      {t.status === 'aktif' ? '● Aktif' : '○ Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                        Detail
                      </button>
                      <button className="text-[10px] font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                        Nonaktifkan
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Undangan Guru */}
      <div className="bg-slate-900 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between text-white shadow-2xl">
        <div>
          <h3 className="font-extrabold text-lg">Undang Guru via Link</h3>
          <p className="text-slate-400 text-sm mt-1">Bagikan link khusus ini agar guru bisa daftar dan langsung terhubung ke sekolah Anda.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex-1 bg-white/10 border border-white/20 text-sm font-mono px-4 py-2.5 rounded-xl text-slate-300 truncate">
            wiyataguru.id/join/sman1contoh
          </div>
          <button className="bg-blue-600 text-white font-black text-xs px-4 py-2.5 rounded-xl hover:bg-blue-500 transition-colors uppercase tracking-widest flex-shrink-0">
            Salin
          </button>
        </div>
      </div>
    </div>
  )
}
