'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  getProfile, 
  updateProfile, 
  changePassword,
  User,
  UpdateProfileData,
  ChangePasswordData
} from '@/libs/profile-api'
import { useAuthStore } from '@/libs/stores/auth'

export function useProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const authStore = useAuthStore()

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const profileData = await getProfile()
      setUser(profileData.data || null)
    } catch (err) {
      setError('Gagal memuat data profil')
    } finally {
      setLoading(false)
    }
  }

  const updateProfileData = async (data: UpdateProfileData) => {
    try {
      setLoading(true)
      setError(null)
      const updated = await updateProfile(data)
        const updatedUser = updated.data
      setUser(User=> ({...user, ...updatedUser} as User)  )
      
      if (authStore.user) {
        const currentUser = authStore.user;
        if (
          updatedUser.name !== currentUser.name ||
          updatedUser.position !== currentUser.position ||
          updatedUser.phone !== currentUser.phone
        ) {
          authStore.setAuth(
            authStore.token || '',
            authStore.expiresAt || '',
            {
              ...currentUser,
              name: updatedUser.name || currentUser.name,
              position: updatedUser.position,
              phone: updatedUser.phone
            }
          )
        }
      }
      
      return updatedUser
    } catch (err) {
      setError('Gagal memperbarui profil')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const changeUserPassword = async (data: ChangePasswordData) => {
    try {
      setLoading(true)
      setError(null)
      const result = await changePassword(data)
      return result
    } catch (err) {
      setError('Gagal mengganti password')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    await loadProfile()
  }

  useEffect(() => {
    loadProfile()
  }, [])

  return {
    user,
    loading,
    error,
    loadProfile,
    updateProfileData,
    changeUserPassword,
    refreshProfile
  }
}