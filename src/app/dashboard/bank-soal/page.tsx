import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import { DAFTAR_MAPEL, DAFTAR_KELAS, WARNA_MAPEL } from '@/lib/constants'
import BankSoalClient from './BankSoalClient'

export const dynamic = 'force-dynamic'

export default async function BankSoalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [soalRes, profileRes] = await Promise.all([
    supabase.from('soal').select('*', { count: 'exact' }).eq('guru_id', user?.id ?? '').order('created_at', { ascending: false }),
    supabase.from('profiles').select('nama_lengkap, sekolah:sekolah_id(nama, alamat, npsn)').eq('id', user?.id ?? '').single()
  ])

  const soalList = soalRes.data
  const count = soalRes.count
  const profile = profileRes.data

  return (
    <div className="flex flex-col gap-6 text-black">
      {/* Komponen Utama - Full Control */}
      <BankSoalClient 
        soalList={soalList ?? []} 
        profile={profile}
      />
    </div>
  )
}
