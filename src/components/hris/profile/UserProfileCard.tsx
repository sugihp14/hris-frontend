'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChangePasswordModal } from './ChangePasswordModal'
import { ProfileDetailItem } from './ProfileDetailItem'
import { User, ChangePasswordData, UpdateProfileData } from '@/libs/profile-api'
import { toast } from 'react-hot-toast'
import { CameraIcon, CheckIcon, KeyIcon, PencilIcon, XCircle } from 'lucide-react'

interface UserProfileCardProps {
  user: User | null
  loading: boolean
  isEditing: boolean
  isSubmitting: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: (formData: UpdateProfileData, photoFile?: File | null) => void
  onChangePassword: (data: ChangePasswordData) => Promise<any>
}

export function UserProfileCard({ user, isEditing, isSubmitting, onEdit, onCancel, onSave, onChangePassword }: UserProfileCardProps) {
  const [formData, setFormData] = useState<UpdateProfileData>({
    name: '',
    position: '',
    phone: '',
    photoUrl: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        position: user.position || '',
        phone: user.phone || '',
        photoUrl: user.photoUrl || ''
      })
    }
    if (!isEditing) {
      setImagePreview(null)
      setSelectedFile(null)
    }
  }, [user, isEditing])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleCancelEdit = () => {
    onCancel()
    if (user) {
      setFormData({
        name: user.name || '',
        position: user.position || '',
        phone: user.phone || '',
        photoUrl: user.photoUrl || ''
      })
    }
  }

  const handleSaveClick = () => {
    onSave(formData, selectedFile)
  }

  const handleChangePassword = async (data: ChangePasswordData) => {
    try {
      await onChangePassword(data)
      toast.success('Password berhasil diubah!')
      setIsModalOpen(false)
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengubah password.')
      throw error
    }
  }

  if (!user) {
    return <div className="text-center p-8 bg-white rounded-lg shadow-md">Tidak ada data profil.</div>
  }

  const userAvatar = imagePreview || user.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || '')}&background=0D89EC&color=fff`
  
  const profileDetails = [
    { id: 'name', label: 'Nama Lengkap', value: formData.name, type: 'text', icon: 'UserIcon' },
    { id: 'email', label: 'Email', value: user.email, isStatic: true, icon: 'EnvelopeIcon' },
    { id: 'position', label: 'Posisi', value: formData.position, placeholder: 'Belum diatur', type: 'text', icon: 'BriefcaseIcon' },
    { id: 'phone', label: 'Telepon', value: formData.phone, placeholder: 'Belum diatur', type: 'text', icon: 'PhoneIcon' },
  ]

  return (
    <>
      <div className="bg-white rounded-2xl  shadow-xl p-6 sm:p-8 transition-all duration-300 ">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
          <div className="relative group">
            <img src={userAvatar} alt="Avatar" className="w-28 h-28 rounded-full border-4 border-gray-100 shadow-lg" />
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <CameraIcon className="w-8 h-8" />
              </button>
            )}
            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
          </div>

          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-md text-gray-500 capitalize">{user.role.toLowerCase()}</p>
            <p className="text-sm text-gray-400 mt-1">{user.email}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveClick}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-all"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : <CheckIcon className="h-5 w-5" />}
                  Simpan
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all"
                >
                  <XCircle className="h-5 w-5" />
                  Batal
                </button>
              </>
            ) : (
              <>
                <button onClick={onEdit} className="w-full flex items-center justify-center gap-2 bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-600 transition-all">
                  <PencilIcon className="h-5 w-5" /> Edit Profil
                </button>
               <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="group flex items-center justify-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  <KeyIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
                  Ganti Password
                </button>
              </>
            )}
          </div>
        </div>

        <hr className="my-8 border-gray-200" />
        
        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {profileDetails.map(item => (
            <ProfileDetailItem
              key={item.id}
              id={item.id}
              iconName={item.icon}
              label={item.label}
              value={item.value || ''}
              isEditing={isEditing && !item.isStatic}
              onChange={handleInputChange}
              placeholder={item.placeholder}
              type={item.type}
            />
          ))}
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleChangePassword} loading={false} error={null}      />
    </>
  )
}