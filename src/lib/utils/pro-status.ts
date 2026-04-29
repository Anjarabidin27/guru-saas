import { createClient } from '@/lib/supabase/server'

/**
 * Pengecekan status Pro dengan model Hybrid (B2B & B2C)
 * Returns { isPro: boolean, source: 'personal' | 'school' | null }
 */
export async function checkProStatus(userId: string) {
  const supabase = await createClient()

  // Fetch profile dan status langganan sekolah sekaligus
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      status_langganan,
      sekolah_id,
      sekolah:sekolah_id(status_langganan)
    `)
    .eq('id', userId)
    .single()

  if (error || !profile) return { isPro: false, source: null }

  // 1. Cek Jalur B2C (Personal)
  if (profile.status_langganan === 'pro') {
    return { isPro: true, source: 'personal' }
  }

  // 2. Cek Jalur B2B (Sekolah)
  const schoolStatus = (profile.sekolah as any)?.status_langganan
  if (schoolStatus === 'pro' || schoolStatus === 'enterprise') {
    return { isPro: true, source: 'school' }
  }

  return { isPro: false, source: null }
}
