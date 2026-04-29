const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    content.split('\n').forEach(line => {
      const [key, ...val] = line.split('=')
      if (key && val) {
        process.env[key.trim()] = val.join('=').trim().replace(/^"(.*)"$/, '$1')
      }
    })
  }
}

loadEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedAdmin() {
  console.log('🚀 Memulai Inisialisasi Admin Resilien...')

  // 1. Cari User
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
  if (authError || !users || users.length === 0) {
    console.error('❌ User tidak ditemukan.')
    return
  }
  const mainUser = users[users.length - 1]
  console.log(`👤 Target: ${mainUser.email}`)

  // 2. Ambil atau Buat Sekolah (Tanpa ON CONFLICT yang ribet)
  const schoolName = 'Akademi Wiyata Nusantara'
  let schoolId = null

  const { data: existingSchool } = await supabase
    .from('sekolah')
    .select('id')
    .eq('nama', schoolName)
    .single()

  if (existingSchool) {
    schoolId = existingSchool.id
    console.log(`🏫 Menggunakan Sekolah Eksis: ${schoolId}`)
  } else {
    const { data: newSchool, error: insertError } = await supabase
      .from('sekolah')
      .insert({
        nama: schoolName,
        alamat: 'Jl. Raya Pendidikan No. 1',
        status_langganan: 'premium_ultra'
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ Gagal membuat sekolah:', insertError.message)
      // Coba ambil ID dari sekolah pertama yang ada sebagai fallback
      const { data: firstSchool } = await supabase.from('sekolah').select('id').limit(1).single()
      schoolId = firstSchool?.id
    } else {
      schoolId = newSchool.id
    }
  }

  // 3. Paksa Update Profile
  console.log('🛠️ Mengupdate profil ke database...')
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: mainUser.id,
      nama_lengkap: mainUser.user_metadata?.full_name || 'Super Administrator',
      role: 'super_admin',
      sekolah_id: schoolId,
      mapel_utama: 'Dewan Pengawas'
    }, { onConflict: 'id' })

  if (profileError) {
    console.error('❌ Gagal update profil:', profileError.message)
    return
  }

  console.log('✅ SUKSES MUTLAK: Bapak sekarang adalah SUPER ADMIN!')
}

seedAdmin()
