'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ocrQuestionImage } from '@/lib/services/ai'

export interface SoalPayload {
  mapel: string
  kelas: string
  teks_soal: string
  jenis_soal: string
  level_kognitif: string
  pilihan_a?: string
  pilihan_b?: string
  pilihan_c?: string
  pilihan_d?: string
  pilihan_e?: string
  kunci_jawaban?: string
  pembahasan?: string
  is_public: boolean
  gambar_url?: string 
  bab?: string // Field baru untuk kategori materi
  is_favorite?: boolean // Field baru untuk bookmark
  tags?: string[] // Field baru untuk tagging fleksibel
}

export async function uploadSoalImage(formData: FormData) {
  const supabase = await createClient()
  const file = formData.get('file') as File
  if (!file) return { error: 'Tidak ada file.' }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
  const filePath = `soal/${fileName}`

  const { data, error } = await supabase.storage
    .from('soal-images')
    .upload(filePath, file)

  if (error) return { error: error.message }

  const { data: { publicUrl } } = supabase.storage
    .from('soal-images')
    .getPublicUrl(filePath)

  return { publicUrl }
}

export async function createSoal(payload: SoalPayload) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  // Ambil sekolah_id dari profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('sekolah_id')
    .eq('id', user.id)
    .single()

  const { error } = await supabase.from('soal').insert({
    guru_id: user.id,
    sekolah_id: profile?.sekolah_id ?? null,
    ...payload,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/bank-soal')
  revalidatePath('/dashboard/bank-soal/baru')
  return { success: true }
}

export async function updateSoal(id: string, payload: SoalPayload) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { error } = await supabase
    .from('soal')
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('guru_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/bank-soal')
  return { success: true }
}

export async function bulkCreateSoal(payloads: SoalPayload[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('sekolah_id')
    .eq('id', user.id)
    .single()

  const items = payloads.map(p => ({
    ...p,
    guru_id: user.id,
    sekolah_id: profile?.sekolah_id ?? null,
  }))

  const { error } = await supabase.from('soal').insert(items)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/bank-soal')
  return { success: true, count: items.length }
}

export async function duplicateSoal(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  // 1. Ambil data soal lama
  const { data: oldSoal, error: fetchError } = await supabase
    .from('soal')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !oldSoal) return { error: 'Soal tidak ditemukan.' }

  // 2. Buat soal baru (tanpa ID lama dan created_at)
  const { id: _, created_at: __, updated_at: ___, ...rest } = oldSoal
  const { error: insertError } = await supabase.from('soal').insert({
    ...rest,
    teks_soal: `${rest.teks_soal} (Salinan)`,
    created_at: new Date().toISOString()
  })

  if (insertError) return { error: insertError.message }

  revalidatePath('/dashboard/bank-soal')
  return { success: true }
}

export async function toggleFavoriteSoal(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { error } = await supabase
    .from('soal')
    .update({ is_favorite: !currentStatus })
    .eq('id', id)
    .eq('guru_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/bank-soal')
  return { success: true }
}

export async function deleteSoal(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { error } = await supabase
    .from('soal')
    .delete()
    .eq('id', id)
    .eq('guru_id', user.id) // pastikan hanya milik user ini

  if (error) return { error: error.message }
  revalidatePath('/dashboard/bank-soal')
  return { success: true }
}

export async function getSoalByGuru() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('soal')
    .select('*')
    .eq('guru_id', user.id)
    .order('created_at', { ascending: false })

  return data ?? []
}
export async function aiExtractSoalFromImage(base64Image: string) {
  try {
    const data = await ocrQuestionImage(base64Image)
    return { data }
  } catch (error: any) {
    return { error: error.message }
  }
}
