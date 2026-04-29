'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadMateriAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const file = formData.get('file') as File
  const judul = formData.get('judul') as string
  const mapel = formData.get('mapel') as string
  const kelas = formData.get('kelas') as string
  const deskripsi = formData.get('deskripsi') as string || ''

  if (!file) throw new Error('File tidak ditemukan')

  // 1. Upload ke Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${Date.now()}.${fileExt}`
  const filePath = `uploads/${fileName}`

  const { data: storageData, error: storageError } = await supabase.storage
    .from('materi')
    .upload(filePath, file)

  if (storageError) {
    throw new Error(`Gagal upload storage: ${storageError.message}`)
  }

  // 2. Simpan Metadata ke Database
  const { error: dbError } = await supabase
    .from('materi')
    .insert({
      guru_id: user.id,
      judul,
      deskripsi,
      mapel,
      kelas,
      file_path: filePath,
      file_type: fileExt?.toLowerCase() || 'unknown',
      is_shared: false
    })

  if (dbError) {
    // Cleanup storage if db fails
    await supabase.storage.from('materi').remove([filePath])
    throw new Error(`Gagal simpan database: ${dbError.message}`)
  }

  revalidatePath('/dashboard/materi')
  return { success: true }
}

export async function deleteMateriAction(id: string, filePath: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 1. Hapus dari Database
  const { error: dbError } = await supabase
    .from('materi')
    .delete()
    .eq('id', id)
    .eq('guru_id', user.id)

  if (dbError) throw new Error(dbError.message)

  // 2. Hapus dari Storage
  await supabase.storage.from('materi').remove([filePath])

  revalidatePath('/dashboard/materi')
  return { success: true }
}

export async function getMateriByGuru() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('materi')
    .select('*')
    .eq('guru_id', user.id)
    .order('created_at', { ascending: false })

  return data ?? []
}
