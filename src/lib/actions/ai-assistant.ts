'use server'

import { createClient } from '@/lib/supabase/server'
import { subjectAssistantChat, AIModel } from '@/lib/services/ai'

export async function askAiAssistant(payload: {
  message: string
  history: { role: 'user' | 'assistant'; content: string }[]
  model: AIModel
  materiId?: string
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
  if (payload.materiId) {
    const { data: materi } = await supabase
      .from('materi')
      .select('isi_ekstraksi')
      .eq('id', payload.materiId)
      .eq('guru_id', user.id)
      .single()
    
    konteks = materi?.isi_ekstraksi || ''
  }

  // Convert history format if needed (service expects role: 'user' | 'model' | 'assistant')
  const formattedHistory = payload.history.map(h => ({
    role: h.role === 'assistant' ? 'assistant' : 'user' as any,
    content: h.content
  }))

  const answer = await subjectAssistantChat({
    model: payload.model,
    mapel,
    history: formattedHistory,
    message: payload.message,
    konteks
  })

  return answer
}
