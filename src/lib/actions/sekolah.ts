'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Cek hak akses Super Admin
async function checkIsSuperAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return data?.role === 'super_admin'
}

// Generate Kode Acak untuk Sekolah (misal: S-A9F2)
function generateKodeSekolah() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'S-'
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function getDaftarSekolah() {
  const adminClient = await createAdminClient()
  const userClient = await createClient()
  
  const { data: { user } } = await userClient.auth.getUser()
  if (!user) return { error: 'Belum login' }

  const { data, error } = await adminClient
    .from('sekolah')
    .select(`
      id, nama, alamat, kota, kode_sekolah, status_langganan, kuota_guru, created_at,
      admin:admin_id(id, nama_lengkap),
      guru_count:profiles!sekolah_id(count)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching schools:', error)
    return { error: 'Gagal memuat data sekolah: ' + error.message }
  }

  // Transform data sedikit agar count mudah dibaca
  const sekolahParsed = data.map((d: any) => ({
    ...d,
    guru_count: d.guru_count?.[0]?.count || 0
  }))

  return { data: sekolahParsed }
}

export async function createSekolah(formData: {
  nama: string
  kota: string
  alamat?: string
  status_langganan: 'free' | 'pro' | 'enterprise'
  kuota_guru: number
}) {
  const adminClient = await createAdminClient()
  const userClient = await createClient()
  if (!(await checkIsSuperAdmin(userClient))) return { error: 'Akses Ditolak.' }

  const kodeBaru = generateKodeSekolah()

  const { error } = await adminClient
    .from('sekolah')
    .insert({
      ...formData,
      kode_sekolah: kodeBaru
    })

  if (error) {
    if (error.code === '23505') return { error: 'Kode bentrok, coba lagi.' }
    return { error: error.message }
  }

  revalidatePath('/admin/sekolah')
  return { success: true }
}

export async function updateLanggananSekolah(id: string, payload: { status_langganan: string; kuota_guru: number }) {
  const adminClient = await createAdminClient()
  const userClient = await createClient()
  if (!(await checkIsSuperAdmin(userClient))) return { error: 'Akses Ditolak.' }

  const { error } = await adminClient
    .from('sekolah')
    .update(payload)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/sekolah')
  return { success: true }
}

export async function hapusSekolah(id: string) {
  const adminClient = await createAdminClient()
  const userClient = await createClient()
  if (!(await checkIsSuperAdmin(userClient))) return { error: 'Akses Ditolak.' }

  const { error } = await adminClient
    .from('sekolah')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/sekolah')
  return { success: true }
}
