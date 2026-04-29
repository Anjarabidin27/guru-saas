'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getIdentities() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('exam_identities')
    .select('*')
    .eq('guru_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching identities:', error)
  }

  return data || []
}

export async function saveIdentity(payload: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const idToUse = payload.id // Jika ada ID, berarti update. Jika tidak, berarti insert baru.
  const isDefault = payload.isDefault === true

  // Jika yang disimpan ingin diset sebagai default, reset dulu yang lain
  if (isDefault) {
    await supabase
      .from('exam_identities')
      .update({ is_default: false })
      .eq('guru_id', user.id)
  }

  const row = {
    guru_id: user.id,
    template_name: payload.templateName || 'Tanpa Nama',
    is_default: isDefault,
    nama_guru: payload.namaGuru,
    nama_sekolah: payload.namaSekolah,
    logo_url: payload.logoSekolah,
    jenjang: payload.jenjang,
    fase: payload.fase,
    kelas: payload.kelas,
    mapel_default: payload.mapel,
    tahun_ajaran: payload.tahunAjaran,
    semester: payload.semester,
    updated_at: new Date().toISOString()
  }

  let result;
  if (idToUse) {
    result = await supabase
      .from('exam_identities')
      .update(row)
      .eq('id', idToUse)
      .eq('guru_id', user.id)
  } else {
    result = await supabase
      .from('exam_identities')
      .insert(row)
  }

  if (result.error) {
    console.error('Error saving identity:', result.error)
    throw new Error(result.error.message)
  }

  revalidatePath('/dashboard/ai-studio')
  return { success: true }
}

export async function deleteIdentity(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('exam_identities')
    .delete()
    .eq('id', id)
    .eq('guru_id', user.id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/dashboard/ai-studio')
  return { success: true }
}

/**
 * Action untuk mengunggah logo ke Supabase Storage
 * Mengambil base64 atau File buffer
 */
export async function uploadSchoolLogo(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const file = formData.get('file') as File
  if (!file) throw new Error('No file provided')

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  // Upload ke bucket 'logos'
  const { data, error } = await supabase.storage
    .from('logos')
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type
    })

  if (error) {
    console.error('Upload error:', error)
    throw new Error(`Gagal mengunggah logo: ${error.message}. Pastikan bucket 'logos' sudah dibuat di Supabase.`)
  }

  // Ambil Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('logos')
    .getPublicUrl(filePath)

  return { publicUrl }
}
