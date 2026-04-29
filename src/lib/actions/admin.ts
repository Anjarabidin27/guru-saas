'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Cek apakah user saat ini adalah Super Admin
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

export async function getAllUsers() {
  const supabase = await createClient()
  const isSuperAdmin = await checkIsSuperAdmin(supabase)
  
  if (!isSuperAdmin) {
    return { error: 'Akses ditolak.' }
  }

  // Ambil semua profil
  const { data, error } = await supabase
    .from('profiles')
    .select('*, sekolah:sekolah_id(nama, status_langganan)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return { error: 'Gagal mengambil data pengguna.' }
  }

  return { users: data }
}

export async function updateUserRole(userId: string, updates: { role?: string, status_langganan?: string }) {
  const supabase = await createClient()
  const isSuperAdmin = await checkIsSuperAdmin(supabase)
  
  if (!isSuperAdmin) return { error: 'Akses ditolak.' }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) return { error: error.message }

  revalidatePath('/admin/pengguna')
  return { success: true }
}

export async function getAnalyticsData() {
  const supabase = await createClient()
  const isSuperAdmin = await checkIsSuperAdmin(supabase)
  
  if (!isSuperAdmin) return { error: 'Akses ditolak.' }

  // Execute count queries in parallel
  const [
    { count: totalUsers },
    { count: totalSchools },
    { count: totalSoal },
    { count: totalPenilaian }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('sekolah').select('*', { count: 'exact', head: true }),
    supabase.from('soal').select('*', { count: 'exact', head: true }),
    supabase.from('penilaian').select('*', { count: 'exact', head: true })
  ])

  // Get recently registered 5 users
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('id, nama_lengkap, role, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return { 
    metrics: {
      users: totalUsers || 0,
      schools: totalSchools || 0,
      soal: totalSoal || 0,
      penilaian: totalPenilaian || 0
    },
    recentUsers 
  }
}

/**
 * NEW: Lead Generation / Lobbying Insights
 */
export async function getLobbyingLeads() {
  const supabase = await createClient()
  const isSuperAdmin = await checkIsSuperAdmin(supabase)
  if (!isSuperAdmin) return { error: 'Akses ditolak.' }

  // Ambil semua profil yang punya sekolah_nama_raw tapi tidak punya sekolah_id
  const { data, error } = await supabase
    .from('profiles')
    .select('sekolah_nama_raw')
    .is('sekolah_id', null)
    .not('sekolah_nama_raw', 'is', null)

  if (error) return { error: error.message }

  // Group by name and count
  const counts: Record<string, number> = {}
  data.forEach((p: any) => {
    const name = p.sekolah_nama_raw.toUpperCase().trim()
    counts[name] = (counts[name] || 0) + 1
  })

  // Sort and transform to array
  const sortedLeads = Object.entries(counts)
    .map(([nama, count]) => ({ nama, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Ambil top 5 saja untuk dashboard

  return { data: sortedLeads }
}
