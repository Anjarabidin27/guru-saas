'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  nama_lengkap: string | null
  role: 'super_admin' | 'admin_sekolah' | 'guru'
  mapel_utama: string | null
  avatar_url: string | null
  sekolah_id: string | null
  sekolah?: { nama: string; status_langganan: string } | null
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  initials: string
  displayName: string
  sekolahNama: string
  tier: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        
        if (!mounted) return

        setUser(supabaseUser)

        if (supabaseUser) {
          const { data } = await supabase
            .from('profiles')
            .select('*, sekolah:sekolah_id(nama, status_langganan)')
            .eq('id', supabaseUser.id)
            .single()
          
          if (mounted) {
            setProfile(data)
          }
        }
      } catch (error) {
        console.error('Error loading user auth:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    load()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      if (session) {
        setUser(session.user)
        // Optionally reload profile if session changes
        if (event === 'SIGNED_IN') {
          load()
        }
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const initials = profile?.nama_lengkap?.trim()
    ? profile.nama_lengkap
        .split(' ')
        .filter(n => n.length > 0)
        .slice(0, 2)
        .map(n => n[0].toUpperCase())
        .join('')
    : user?.email?.slice(0, 2).toUpperCase() ?? 'GU'

  const displayName = profile?.nama_lengkap ?? user?.email ?? 'Guru'
  const sekolahNama = (profile?.sekolah as any)?.nama ?? 'Belum ada sekolah'
  const tier = (profile?.sekolah as any)?.status_langganan ?? 'gratis'

  const value = {
    user,
    profile,
    loading,
    initials,
    displayName,
    sekolahNama,
    tier
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
