'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Audit Log Helper
 */
async function recordAuditLog(aksi: string, entitas_tipe: string, entitas_id: string, detail: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('audit_logs').insert({
    user_id: user.id,
    aksi,
    entitas_tipe,
    entitas_id,
    detail
  })
}

/**
 * NOTIFIKASI / BROADCAST
 */
export async function getBroadcasts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('notifikasi')
    .select('*')
    .order('created_at', { ascending: false })

  return { data: data || [], error: error?.message }
}

export async function createBroadcast(formData: any) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication required' }

  const { data, error } = await supabase
    .from('notifikasi')
    .insert({
      ...formData,
      created_by: user.id
    })
    .select()
    .single()

  if (error) return { error: error.message }
  
  await recordAuditLog('BROADCAST_CREATED', 'notifikasi', data.id, formData)
  revalidatePath('/admin/notifikasi')
  return { success: true }
}

export async function toggleBroadcast(id: string, is_active: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('notifikasi')
    .update({ is_active })
    .eq('id', id)

  if (error) return { error: error.message }
  
  await recordAuditLog('BROADCAST_TOGGLED', 'notifikasi', id, { is_active })
  revalidatePath('/admin/notifikasi')
  return { success: true }
}

/**
 * AUDIT LOGS
 */
export async function getAuditLogs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('audit_logs')
    .select(`
      *,
      user:profiles(nama_lengkap)
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  return { data: data || [], error: error?.message }
}
