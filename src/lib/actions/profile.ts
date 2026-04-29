'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getOrCreateProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Cek apakah profile sudah ada
  const { data: existing } = await supabase
    .from('profiles')
    .select('*, sekolah:sekolah_id(nama, status_langganan), sekolah_nama_raw')
    .eq('id', user.id)
    .single()

  if (existing) return existing

  // Buat profile baru dari metadata registrasi
  const meta = user.user_metadata
  let sekolahId = null

  if (meta?.kode_sekolah) {
    const { data: sekolah } = await supabase
      .from('sekolah')
      .select('id')
      .eq('kode_sekolah', meta.kode_sekolah.toUpperCase())
      .single()
    if (sekolah) sekolahId = sekolah.id
  }

  const { data: newProfile } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      nama_lengkap: meta?.nama_lengkap ?? null,
      role: meta?.role ?? 'guru',
      mapel_utama: meta?.mapel_utama ?? null,
      sekolah_id: sekolahId,
      sekolah_nama_raw: meta?.sekolah_nama_raw ?? null
    })
    .select('*')
    .single()

  return newProfile
}

export async function updateProfile(payload: {
  nama_lengkap: string
  mapel_utama: string
  nip?: string
  kota?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/profil')
  return { success: true }
}

export async function getDashboardStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [soalRes, materiRes, penilaianRes] = await Promise.all([
    supabase.from('soal').select('id', { count: 'exact', head: true }).eq('guru_id', user.id),
    supabase.from('materi').select('id', { count: 'exact', head: true }).eq('guru_id', user.id),
    supabase.from('penilaian').select('id', { count: 'exact', head: true }).eq('guru_id', user.id),
  ])

  return {
    totalSoal: soalRes.count ?? 0,
    totalMateri: materiRes.count ?? 0,
    totalPenilaian: penilaianRes.count ?? 0,
  }
}
