'use client'

import React, { useState } from 'react'
import { UserProfileCard } from '@/components/hris/profile/UserProfileCard'
import { useProfile } from '@/hooks/useProfile'
import { UpdateProfileData, uploadProfilePhoto } from '@/libs/profile-api'
import { Toaster, toast } from 'react-hot-toast'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { updateProfileData, changeUserPassword, user, loading } = useProfile()

  const handleSave = async (formData: UpdateProfileData, photoFile?: File | null) => {
    setIsSubmitting(true)
    
    const dataToUpdate: UpdateProfileData = { ...formData };

    try {
      if (photoFile) {
        toast.loading('Mengunggah foto...', { id: 'toast-upload' });
        
        const uploadResponse = await uploadProfilePhoto(photoFile);
        
        if (uploadResponse && uploadResponse.statusCode === 200 && uploadResponse.data.photoUrl) {
          dataToUpdate.photoUrl = uploadResponse.data.photoUrl;
          toast.success('Foto berhasil diunggah!', { id: 'toast-upload' });
        } else {
           toast.error('Gagal mendapatkan URL foto setelah diunggah.', { id: 'toast-upload' });
           throw new Error('URL foto tidak diterima dari server.');
        }
      }

      await updateProfileData(dataToUpdate);
      
      toast.success('Profil berhasil diperbarui!');
      setIsEditing(false); 
    } catch (error) {
      toast.error('Gagal memperbarui profil.');
      toast.dismiss('toast-upload');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Memuat Profil...</p>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="bg-gray-100 min-h-screen w-auto mx-auto p-4 sm:p-8 font-sans">
        <UserProfileCard
          user={user}
          loading={loading}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          onEdit={() => setIsEditing(true)}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
          onChangePassword={changeUserPassword}
        />
      </div>
    </>
  )
}