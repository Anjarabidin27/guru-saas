import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedAdmin() {
  console.log('🚀 Memulai Proses Inisialisasi Admin...')

  // 1. Ambil User Terakhir yang Mendaftar
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
  if (authError || !users.length) {
    console.error('❌ Gagal mengambil daftar user:', authError?.message)
    return
  }

  const mainUser = users[0] // Asumsi user pertama adalah pengembang
  console.log(`👤 Menemukan User: ${mainUser.email} (${mainUser.id})`)

  // 2. Buat Sekolah Default (Wiyata Nusantara Academy)
  const { data: school, error: schoolError } = await supabase
    .from('sekolah')
    .upsert({
      nama: 'Wiyata Nusantara Academy (Pusat)',
      alamat: 'Jl. Merdeka No. 1, Jakarta Pusat',
      status_langganan: 'premium_ultra'
    }, { onConflict: 'nama' })
    .select()
    .single()

  if (schoolError) {
    console.error('❌ Gagal membuat sekolah:', schoolError.message)
    return
  }
  console.log(`🏫 Sekolah Berhasil Disiapkan: ${school.nama}`)

  // 3. Update Profile User Jadi Super Admin & Link ke Sekolah
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: mainUser.id,
      nama_lengkap: mainUser.user_metadata?.full_name || 'Administrator Wiyata',
      role: 'super_admin',
      sekolah_id: school.id,
      mapel_utama: 'Teknologi Informasi'
    }, { onConflict: 'id' })

  if (profileError) {
    console.error('❌ Gagal mengupdate profil admin:', profileError.message)
    return
  }

  console.log('✅ SUKSES: Akun Bapak sudah menjadi SUPER ADMIN dan terhubung ke Sekolah Pusat!')
}

seedAdmin()
