'use client'

import { apiFetch } from '@/libs/http'
import { useAuthStore } from '@/libs/stores/auth'

export type User = {
  id: string;
  email: string;
  name: string;
  position: string | null;
  phone: string | null;
  photoUrl: string | null;
  role: string;
}

export type data={
  data:User
}


export type UpdateProfileData = {
  photoUrl: string;
  name?: string;
  position?: string;
  phone?: string;
  email?: string;
}

export type UpdateProfileDto={
  data:UpdateProfileData
  statusCode:number
  message:string
}
export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
}

export async function getProfile(): Promise<data> {
  return apiFetch('/profile')
}

export async function updateProfile(data: UpdateProfileData): Promise<UpdateProfileDto> {
  const filteredData: any = {}
  Object.keys(data).forEach(key => {
    if (data[key as keyof UpdateProfileData] !== undefined && data[key as keyof UpdateProfileData] !== null) {
      filteredData[key] = data[key as keyof UpdateProfileData]
    }
  })
  
  return apiFetch('/profile', {
    method: 'PATCH',
    body: JSON.stringify(filteredData)
  })
}

export async function changePassword(data: ChangePasswordData): Promise<{ message: string }> {
  return apiFetch('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function uploadProfilePhoto(photoFile: File): Promise<UpdateProfileDto> {
  const formData = new FormData();
  
  formData.append('photo', photoFile);

   let res=await apiFetch('/profile/photo', {
    method: 'POST',
    body: formData,
  });
  return res
}