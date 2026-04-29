'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Mengambil semua konfigurasi situs dari tabel site_config
 */
export async function getSiteConfig() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_config')
    .select('key, value')

  if (error) {
    // Log full error object to debug
    console.error('SERVER_ERROR: [getSiteConfig]', JSON.stringify(error, null, 2))
    return {}
  }

  if (!data) return {}

  // Convert array of {key, value} to an object { [key]: value }
  return data.reduce((acc: any, item: any) => {
    acc[item.key] = item.value
    return acc
  }, {})
}

/**
 * Memperbarui konfigurasi situs berdasarkan key-value pair
 */
export async function updateSiteConfig(updates: Record<string, string>) {
  const supabase = await createClient()
  
  // Pastikan user adalah super_admin (Akan divalidasi juga oleh RLS di Supabase)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'super_admin') {
    return { error: 'Akses ditolak. Anda bukan Super Admin.' }
  }

  // Jalankan upsert untuk setiap key agar jika key belum ada otomatis dibuat
  const results = await Promise.all(
    Object.entries(updates).map(([key, value]) => 
      supabase
        .from('site_config')
        .upsert(
          { key, value, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        )
    )
  )

  const errors = results.filter(r => r.error).map(r => r.error?.message)
  if (errors.length > 0) return { error: errors.join(', ') }

  revalidatePath('/') // Revalidate homepage untuk melihat perubahan
  revalidatePath('/admin/settings')
  return { success: true }
}
