import React from 'react'
import { UserIcon,BanIcon , BriefcaseIcon, PhoneIcon } from 'lucide-react'

const icons: { [key: string]: React.ElementType } = {
  UserIcon,
  BanIcon,
  BriefcaseIcon,
  PhoneIcon,
}

interface ProfileDetailItemProps {
  id: string;
  iconName: string;
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

export const ProfileDetailItem: React.FC<ProfileDetailItemProps> = ({ id, iconName, label, value, isEditing, onChange, placeholder, type = 'text' }) => {
  const IconComponent = icons[iconName] || UserIcon;

  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
        <IconComponent className="h-6 w-6 text-gray-500" />
      </div>
      <div className="flex-grow">
        <label className="text-xs font-semibold text-gray-500 uppercase">{label}</label>
        {isEditing  ? (
          <input
            type={type}
            name={id}
            disabled={id === 'email' || id ==='position'}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full text-md font-medium text-gray-900 bg-gray-50 rounded-md p-2 -m-2 mt-1 border-2 border-transparent focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
          />
        ) : (
          <p className="text-md font-medium text-gray-900 mt-1">
            {value || <span className="text-gray-400 italic">{placeholder}</span>}
          </p>
        )}
      </div>
    </div>
  )
}