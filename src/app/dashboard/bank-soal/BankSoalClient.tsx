'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { deleteSoal, duplicateSoal, toggleFavoriteSoal } from '@/lib/actions/soal'

// Local Components
import SoalFilterBar from './components/SoalFilterBar'
import SoalListTable from './components/SoalListTable'
import SoalDetailDrawer from './components/SoalDetailDrawer'
import SoalModal from './components/SoalModal'
import SoalBreadcrumbs from './components/SoalBreadcrumbs'
import SoalGenerateModal from './components/SoalGenerateModal'

interface Soal {
  id: string
  teks_soal: string
  mapel: string
  kelas: string
  jenis_soal: string
  level_kognitif: string
  pilihan_a?: string
  pilihan_b?: string
  pilihan_c?: string
  pilihan_d?: string
  pilihan_e?: string
  kunci_jawaban?: string
  is_favorite?: boolean
  created_at: string
  bab?: string
  pembahasan?: string
}

export default function BankSoalClient({ soalList = [], profile }: { soalList: Soal[], profile: any }) {
  const router = useRouter()
  
  const [selectedSoal, setSelectedSoal] = useState<Soal | null>(null)
  const [search, setSearch] = useState('')
  const [filterMapel, setFilterMapel] = useState<string[]>([])
  const [filterKelas, setFilterKelas] = useState<string[]>([])
  const [path, setPath] = useState<string[]>([]) // [Mapel, Kelas, Bab]
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGenModalOpen, setIsGenModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const viewData = useMemo(() => {
    const baseList = soalList.filter(s => {
      const matchSearch = !search || 
        s.teks_soal.toLowerCase().includes(search.toLowerCase()) || 
        (s.bab && s.bab.toLowerCase().includes(search.toLowerCase()))
      const matchMapelFilter = filterMapel.length === 0 || filterMapel.includes(s.mapel)
      const matchKelasFilter = filterKelas.length === 0 || filterKelas.includes(s.kelas)
      return matchSearch && matchMapelFilter && matchKelasFilter
    })

    if (search.trim()) {
      return { folders: [], items: baseList }
    }

    if (path.length === 0) {
      const mapels = Array.from(new Set(baseList.map(s => s.mapel)))
      return { 
        folders: mapels.map(m => ({ name: m, type: 'Mata Pelajaran', count: baseList.filter(s => s.mapel === m).length })), 
        items: [] 
      }
    }

    if (path.length === 1) {
      const currentMapel = path[0]
      const filteredByMapel = baseList.filter(s => s.mapel === currentMapel)
      const kelasList = Array.from(new Set(filteredByMapel.map(s => s.kelas)))
      return { 
        folders: kelasList.map(k => ({ name: `Kelas ${k}`, type: 'Tingkat', originalValue: k, count: filteredByMapel.filter(s => s.kelas === k).length })), 
        items: [] 
      }
    }

    if (path.length === 2) {
      const [m, k] = path
      const kelasVal = k.replace('Kelas ', '')
      const filteredByMK = baseList.filter(s => s.mapel === m && s.kelas === kelasVal)
      const babList = Array.from(new Set(filteredByMK.map(s => s.bab || 'Lainnya')))
      return { 
        folders: babList.map(b => ({ name: b, type: 'Modul / Bab', count: filteredByMK.filter(s => (s.bab || 'Lainnya') === b).length })), 
        items: [] 
      }
    }

    const [m, k, b] = path
    const kelasVal = k.replace('Kelas ', '')
    const finalItems = baseList.filter(s => s.mapel === m && s.kelas === kelasVal && (s.bab || 'Lainnya') === b)
    return { folders: [], items: finalItems }

  }, [soalList, search, filterMapel, filterKelas, path])

  const handleToggleFavorite = async (id: string, currentStatus: boolean) => {
    await toggleFavoriteSoal(id, currentStatus)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('KONFIRMASI: Hapus permanen instrumen ini?')) return
    await deleteSoal(id)
    if (selectedSoal?.id === id) {
      setSelectedSoal(null)
      setIsDrawerOpen(false)
    }
    router.refresh()
  }

  const handleDuplicate = async (id: string) => {
    await duplicateSoal(id)
    router.refresh()
  }

  const handleEdit = (id: string) => {
    const soal = soalList.find(s => s.id === id)
    if (soal) {
      setModalData(soal)
      setIsModalOpen(true)
    }
  }

  const handleSelect = (soal: Soal) => {
    setSelectedSoal(soal)
    setIsDrawerOpen(true)
  }

  const handleFolderClick = (folder: any) => {
    if (folder.type === 'Mata Pelajaran') setPath([folder.name])
    else if (folder.type === 'Tingkat') setPath([path[0], folder.name])
    else if (folder.type === 'Modul / Bab') setPath([path[0], path[1], folder.name])
  }

  const onAddClick = () => {
    const prefilledData: any = {}
    if (path.length >= 1) prefilledData.mapel = path[0]
    if (path.length >= 2) prefilledData.kelas = path[1].replace('Kelas ', '')
    if (path.length >= 3 && path[2] !== 'Lainnya') prefilledData.bab = path[2]
    
    setModalData(prefilledData)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] lg:h-[calc(100vh-28px)] -mx-4 lg:-mx-7 -mt-4 lg:-mt-7 -mb-24 lg:-mb-8 bg-white font-sans relative overflow-hidden border-x-0 lg:border-l lg:border-slate-200">
      
      <SoalFilterBar 
        search={search} setSearch={setSearch}
        filterMapel={filterMapel} setFilterMapel={setFilterMapel}
        filterKelas={filterKelas} setFilterKelas={setFilterKelas}
        onAddClick={onAddClick}
        onGenerateClick={() => setIsGenModalOpen(true)}
      />

      <SoalBreadcrumbs path={path} setPath={setPath} />

      <div className="flex-1 flex overflow-hidden relative bg-[#f8fafc]">
        <SoalListTable 
          folders={viewData.folders}
          soalList={viewData.items}
          selectedId={selectedSoal?.id}
          onSelect={handleSelect}
          onFolderClick={handleFolderClick}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onToggleFavorite={handleToggleFavorite}
          onEdit={handleEdit}
        />

        {/* DETAILS PANEL */}
        {isDrawerOpen && (
          <SoalDetailDrawer 
            soal={selectedSoal}
            onClose={() => setIsDrawerOpen(false)}
            onEdit={handleEdit}
          />
        )}
      </div>

      {/* MODALS */}
      <SoalGenerateModal 
        isOpen={isGenModalOpen}
        onClose={() => setIsGenModalOpen(false)}
        onSuccess={() => { router.refresh(); setIsGenModalOpen(false); }}
        profile={profile}
      />

      <SoalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { router.refresh(); setIsModalOpen(false); }}
        initialData={modalData}
      />

      {/* INDUSTRIAL STATUS BAR */}
      <footer className="h-8 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-between shrink-0 z-40">
         <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            <div className="flex items-center gap-2 text-emerald-400">
               <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
               <span>Terminal Connected</span>
            </div>
            <span className="border-l border-slate-800 pl-4 text-slate-500">Total: {soalList.length}</span>
            <span className="text-slate-500">Filtered: {viewData.items.length + viewData.folders.length}</span>
         </div>
         <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
            WiyataGuru Asset // v4.5.2
         </div>
      </footer>
    </div>
  )
}
