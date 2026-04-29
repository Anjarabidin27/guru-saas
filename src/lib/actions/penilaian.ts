'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPenilaian(payload: {
  nama_penilaian: string
  kelas: string
  mapel: string
  kkm: number
  siswa: { nama_siswa: string; skor: number; catatan?: string }[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { data: profile } = await supabase
    .from('profiles').select('sekolah_id').eq('id', user.id).single()

  // Insert header penilaian
  const { data: penilaian, error } = await supabase
    .from('penilaian')
    .insert({
      guru_id: user.id,
      sekolah_id: profile?.sekolah_id ?? null,
      nama_penilaian: payload.nama_penilaian,
      kelas: payload.kelas,
      mapel: payload.mapel,
      kkm: payload.kkm,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  // Insert nilai siswa
  if (payload.siswa.length > 0) {
    const { error: skorError } = await supabase.from('skor_siswa').insert(
      payload.siswa.map(s => ({ penilaian_id: penilaian.id, ...s }))
    )
    if (skorError) return { error: skorError.message }
  }

  revalidatePath('/dashboard/penilaian')
  return { success: true }
}

export async function getPenilaianDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  // Ambil daftar penilaian beserta nilai masing-masing siswa (relasi)
  const { data: penilaianList, error } = await supabase
    .from('penilaian')
    .select(`
      id, nama_penilaian, mapel, kelas, kkm, status,
      skor_siswa ( id, skor )
    `)
    .eq('guru_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching penilaian:', error)
    return { error: 'Gagal memuat rekap nilai.' }
  }

  // Kalkulasi agregasi di Node layer
  let globalRataRata = 0
  let globalLulusCount = 0
  let globalTotalSiswa = 0

  const processedData = penilaianList.map((p: any) => {
    const listSkor = p.skor_siswa || []
    const jumlahSiswa = listSkor.length
    
    // Rata-rata per ujian
    const totalSkor = listSkor.reduce((sum: number, s: any) => sum + Number(s.skor), 0)
    const avg = jumlahSiswa > 0 ? totalSkor / jumlahSiswa : 0

    // Anak yang lulus KKM di ujian ini
    const lulusCount = listSkor.filter((s: any) => Number(s.skor) >= Number(p.kkm)).length
    const progress = jumlahSiswa > 0 ? Math.round((lulusCount / jumlahSiswa) * 100) : 0

    // Tambah ke global metrics
    globalTotalSiswa += jumlahSiswa
    globalLulusCount += lulusCount
    globalRataRata += totalSkor

    return {
      id: p.id,
      nama: p.nama_penilaian,
      kelas: p.kelas,
      mapel: p.mapel,
      status: p.status,
      kkm: p.kkm,
      average: avg.toFixed(1),
      progress: progress,
      jumlahSiswa
    }
  })

  return {
    data: processedData,
    metrics: {
      rataRataGlobal: globalTotalSiswa > 0 ? (globalRataRata / globalTotalSiswa).toFixed(1) : 0,
      tingkatKelulusan: globalTotalSiswa > 0 ? Math.round((globalLulusCount / globalTotalSiswa) * 100) : 0,
      kkmSekolah: '75.0' // Disetel fixed dulu atau ambil dari setting sekolah nantinya
    }
  }
}
