'use server'

import { createClient } from '@/lib/supabase/server'
import { generateQuestions } from '@/lib/services/ai'
import { revalidatePath } from 'next/cache'

export async function aiGenerateQuestions(payload: {
  topik: string
  jumlahPG?: number
  jumlahEssay?: number
  tingkat: 'mudah' | 'sedang' | 'sulit' | 'campuran'
  formatOpsi?: 'A-C' | 'A-D' | 'A-E'
  sourceType?: string
  sourceId?: string
  sourceContent?: string
  model?: any
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Ambil profil untuk tahu Mapel
  const { data: profile } = await supabase
    .from('profiles')
    .select('mapel_utama')
    .eq('id', user.id)
    .single()

  const mapel = profile?.mapel_utama || 'Umum'

  let konteks = ''
  
  if (payload.sourceType === 'materi' && payload.sourceId) {
    const { data: materi } = await supabase
      .from('materi')
      .select('deskripsi, judul') // In actual app, might rely on 'isi_ekstraksi' if you have it
      .eq('id', payload.sourceId)
      .single()
    konteks = `Berikut adalah materi sebagai referensi utama: Judul: ${materi?.judul}. Deskripsi/Konten: ${materi?.deskripsi}`
  } else if (payload.sourceType === 'bank' && payload.sourceId) {
    const { data: soal } = await supabase
      .from('soal')
      .select('pertanyaan, jawaban_benar')
      .eq('id', payload.sourceId)
      .single()
    konteks = `Berikut adalah contoh soal referensi: Pertanyaan: ${soal?.pertanyaan}. Jawaban: ${soal?.jawaban_benar}`
  } else if (payload.sourceType === 'upload' && payload.sourceContent) {
    konteks = `Gunakan teks berikut sebagai sumber materi utama pembuatan soal: ${payload.sourceContent}`
  }

  const baseConfig = {
    model: payload.model || 'gemini-2.0-flash',
    mapel,
    topik: payload.topik,
    tingkat: payload.tingkat,
    konteks
  }

  let allQuestions: any[] = []

  // Generate Pilihan Ganda jika diminta
  if (payload.jumlahPG && payload.jumlahPG > 0) {
    const pgResult = await generateQuestions({
      ...baseConfig,
      jumlah: payload.jumlahPG,
      jenisSoal: 'pilihan_ganda',
      formatOpsi: payload.formatOpsi
    })
    // Tambahkan label tipe agar UI tahu cara merender
    const pgSoal = (pgResult.soal || []).map((s: any) => ({ ...s, jenis_soal: 'pilihan_ganda' }))
    allQuestions = [...allQuestions, ...pgSoal]
  }

  // Generate Essay jika diminta
  if (payload.jumlahEssay && payload.jumlahEssay > 0) {
    const essayResult = await generateQuestions({
      ...baseConfig,
      jumlah: payload.jumlahEssay,
      jenisSoal: 'essay'
    })
    const essaySoal = (essayResult.soal || []).map((s: any) => ({ ...s, jenis_soal: 'essay' }))
    allQuestions = [...allQuestions, ...essaySoal]
  }

  return allQuestions
}

export async function saveGeneratedSoal(payload: {
  pertanyaan: string
  opsi?: any
  jawaban: string
  topik: string
  tingkat: string
  jenis_soal: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Ambil mapel
  const { data: profile } = await supabase
    .from('profiles')
    .select('mapel_utama')
    .eq('id', user.id)
    .single()

  // Handle jika tipe soal adalah essay, maka opsi_ tidak diisi
  const opsi_a = payload.opsi?.A || null
  const opsi_b = payload.opsi?.B || null
  const opsi_c = payload.opsi?.C || null
  const opsi_d = payload.opsi?.D || null
  const opsi_e = payload.opsi?.E || null

  const { error } = await supabase
    .from('soal')
    .insert({
      guru_id: user.id,
      mapel: profile?.mapel_utama || 'Umum',
      topik: payload.topik,
      pertanyaan: payload.pertanyaan,
      jenis_soal: payload.jenis_soal || 'pilihan_ganda',
      opsi_a,
      opsi_b,
      opsi_c,
      opsi_d,
      opsi_e,
      jawaban_benar: payload.jawaban,
      tingkat_kesulitan: payload.tingkat === 'campuran' ? 'MOTS' : payload.tingkat // fallback standar
    })

  if (error) throw new Error(error.message)
  
  revalidatePath('/dashboard/bank-soal')
  return { success: true }
}
