'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

// Initialize Providers
const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '')
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' })
const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })

export type AIModel = 'gemini-1.5-flash' | 'gpt-4o' | 'claude-3-5-sonnet'

export async function generateQuestions(payload: {
  model: AIModel
  mapel: string
  topik: string
  jumlah: number
  konteks?: string
  tingkat: 'mudah' | 'sedang' | 'sulit' | 'campuran'
  jenisSoal?: 'pilihan_ganda' | 'essay'
  formatOpsi?: 'A-C' | 'A-D' | 'A-E'
}) {

  let instruksiTingkat = `Tingkat kesulitan soal harus: ${payload.tingkat.toUpperCase()}.`
  if (payload.tingkat === 'campuran') {
    instruksiTingkat = `Tingkat kesulitan soal harus CAMPURAN secara acak (proporsi seimbang antara LOTS, MOTS, dan HOTS).`
  }

  let instruksiFormatJSON = ''

  if (payload.jenisSoal === 'essay') {
    instruksiFormatJSON = `
    2. Format jawaban harus berupa JSON yang valid dengan struktur berikut:
       {
         "soal": [
           {
             "pertanyaan": "teks pertanyaan yang bersifat essay/uraian",
             "jawaban": "teks paragraf kunci jawaban lengkap",
             "penjelasan": "panduan/rubrik penilaian atau pembahasan detail mengapa jawaban tersebut benar"
           }
         ]
       }
    `
  } else {
    // Mode Pilihan Ganda (Default)
    const limitHuruf = payload.formatOpsi || 'A-E'
    let templateOpsi = `"A": "opsi a", "B": "opsi b", "C": "opsi c", "D": "opsi d", "E": "opsi e"`
    
    if (limitHuruf === 'A-C') {
       templateOpsi = `"A": "opsi a", "B": "opsi b", "C": "opsi c"`
    } else if (limitHuruf === 'A-D') {
       templateOpsi = `"A": "opsi a", "B": "opsi b", "C": "opsi c", "D": "opsi d"`
    }

    instruksiFormatJSON = `
    2. Format jawaban harus berupa JSON yang valid dengan struktur berikut:
       {
         "soal": [
           {
             "pertanyaan": "teks pertanyaan pilihan ganda",
             "opsi": {
               ${templateOpsi}
             },
             "jawaban": "huruf kunci jawaban yang benar (contoh: A/B/C/D/E)",
             "penjelasan": "pembahasan detail mengapa jawaban ini benar"
           }
         ]
       }
    `
  }

  const prompt = `
    Anda adalah seorang pakar pendidikan senior spesialis mata pelajaran ${payload.mapel}.
    Tugas Anda adalah membuat ${payload.jumlah} butir soal ${payload.jenisSoal === 'essay' ? 'URAIAN/ESSAY' : 'PILIHAN GANDA'} berkualitas tinggi tentang topik: "${payload.topik}".
    
    ${payload.konteks ? `Berikut adalah materi bacaan referensi yang harus Anda gunakan dan bedah sebagai dasar pembuatan butir soal: \n\n ${payload.konteks} \n\n` : 'Gunakan wawasan pendidik Anda untuk membuat soal yang akurat sesuai dengan kurikulum nasional Indonesia.'}

    Kriteria krusial pembuatan soal:
    1. ${instruksiTingkat}
    ${instruksiFormatJSON}

    JANGAN berikan teks basa-basi pembuka atau penutup. Berikan HANYA format JSON murni.
  `

  let responseText = ''

  if (payload.model === 'gpt-4o') {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    })
    responseText = response.choices[0].message.content || ''
  } 
  else if (payload.model === 'claude-3-5-sonnet') {
    const response = await anthropicClient.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    })
    // Anthropic response structure is different
    const content = response.content[0]
    if (content.type === 'text') {
      responseText = content.text
    }
  } 
  else {
    // Default to Gemini
    const model = geminiClient.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    responseText = result.response.text()
  }

  try {
    const cleanedJson = responseText.replace(/```json|```/g, '').trim()
    return JSON.parse(cleanedJson)
  } catch (e) {
    console.error('Failed to parse AI response:', responseText)
    throw new Error(`AI (${payload.model}) gagal menghasilkan format soal yang benar.`)
  }
}

export async function subjectAssistantChat(payload: {
  model: AIModel
  mapel: string
  history: { role: 'user' | 'model' | 'assistant'; content: string }[]
  message: string
  konteks?: string
}) {
  const systemPrompt = `Anda adalah asisten AI profesional untuk Guru mata pelajaran ${payload.mapel}. 
    Tugas Anda membantu guru dalam menyusun RPP, memberikan ide metode mengajar, atau menjelaskan konsep materi yang rumit.
    Gaya bicara Anda: Formal, inspiratif, dan sangat teknis di bidang ${payload.mapel}. 
    ${payload.konteks ? `Gunakan informasi berikut sebagai database utama Anda dalam menjawab: \n ${payload.konteks}` : ''}`

  if (payload.model === 'gpt-4o') {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...payload.history.map(h => ({ role: h.role === 'model' ? 'assistant' : h.role, content: h.content })),
        { role: 'user', content: payload.message }
      ]
    })
    return response.choices[0].message.content
  } 
  else if (payload.model === 'claude-3-5-sonnet') {
    const response = await anthropicClient.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        ...payload.history.map(h => ({ role: h.role === 'model' ? 'assistant' : h.role, content: h.content } as any)),
        { role: 'user', content: payload.message }
      ]
    })
    const content = response.content[0]
    return content.type === 'text' ? content.text : ''
  }
  else {
    const model = geminiClient.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt
    })
    const chat = model.startChat({
      history: payload.history.map(h => ({ role: h.role === 'assistant' ? 'model' : h.role, parts: [{ text: h.content }] })) as any,
    })
    const result = await chat.sendMessage(payload.message)
    return result.response.text()
  }
}
export async function ocrQuestionImage(base64Image: string) {
  const model = geminiClient.getGenerativeModel({ model: 'gemini-2.0-flash' })
  
  const prompt = `
    Tugas: Ubah gambar soal ujian ini menjadi naskah soal digital yang terstruktur.
    
    Analisa gambar berikut dan kembalikan hanya dalam format JSON valid:
    {
      "pertanyaan": "teks lengkap pertanyaan",
      "opsi": {
        "A": "teks opsi A",
        "B": "teks opsi B",
        "C": "teks opsi C",
        "D": "teks opsi D",
        "E": "teks opsi E (jika ada)"
      },
      "jawaban": "huruf kunci jawaban yang paling tepat berdasarkan soal tersebut",
      "penjelasan": "analisa singkat mengapa jawaban tersebut benar"
    }

    Jika soal berbentuk essay, cukup isi "pertanyaan" dan "jawaban", serta kosongkan field "opsi".
    HANYA kembalikan JSON murni.
  `

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: base64Image.split(',')[1] || base64Image,
        mimeType: 'image/jpeg'
      }
    }
  ])

  const responseText = result.response.text()
  try {
    const cleanedJson = responseText.replace(/```json|```/g, '').trim()
    return JSON.parse(cleanedJson)
  } catch (e) {
    throw new Error('Gagal mengekstrak teks dari gambar. Pastikan gambar cukup jelas.')
  }
}
