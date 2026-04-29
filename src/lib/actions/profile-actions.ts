'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(newRole: 'super_admin' | 'admin_sekolah' | 'guru') {
  const adminClient = await createAdminClient()
  const userClient = await createClient()
  const { data: { user } } = await userClient.auth.getUser()
  
  if (!user) return { error: 'Tidak terautentikasi.' }

  // Gunakan Admin Client (Bypass RLS)
  const { error } = await adminClient
    .from('profiles')
    .upsert({ 
      id: user.id, 
      role: newRole,
      nama_lengkap: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User Wiyata'
    }, { onConflict: 'id' })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profil')
  return { success: true }
}

export async function updateProfile(payload: { nama_lengkap: string; mapel_utama: string }) {
  const adminClient = await createAdminClient()
  const userClient = await createClient()
  const { data: { user } } = await userClient.auth.getUser()

  if (!user) return { error: 'Tidak terautentikasi.' }

  const { error } = await adminClient
    .from('profiles')
    .update(payload)
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/profil')
  return { success: true }
}
