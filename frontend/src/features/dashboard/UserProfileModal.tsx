import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  FileText,
  Camera,
  Trash2,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Save,
  KeyRound,
} from 'lucide-react';
import { IUser } from '@/types';
import { updateMyProfileApi, uploadAvatarApi, removeAvatarApi } from '@/services/api';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: IUser | null;
  onProfileUpdated: (updatedUser: IUser) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setDesignation(currentUser.designation || '');
      setBio(currentUser.bio || '');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        try {
          const updated = await uploadAvatarApi(base64String);
          onProfileUpdated(updated);
          setSuccessMsg('Profile image updated successfully');
          setTimeout(() => setSuccessMsg(''), 3000);
        } catch {
          // Keep local preview
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatar('');
    try {
      const updated = await removeAvatarApi();
      onProfileUpdated(updated);
      setSuccessMsg('Profile image removed');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch {
      // Ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const updated = await updateMyProfileApi({
        name,
        phone,
        designation,
        bio,
        avatar,
      });

      onProfileUpdated(updated);
      setSuccessMsg('Profile details saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile details');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (r: string) => {
    switch (r) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'staff':
        return 'Staff';
      default:
        return 'Super Admin';
    }
  };

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden font-sans flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-200 bg-gray-50/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900 leading-snug">User Profile Settings</h2>
                <p className="text-xs text-gray-500">Manage your personal account details, designation, and avatar.</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-black hover:bg-gray-200/60 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}

            {successMsg && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Profile Avatar Card Header */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center font-serif text-3xl font-bold overflow-hidden shadow-md border-2 border-white">
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{name ? name[0].toUpperCase() : 'A'}</span>
                  )}
                </div>

                {/* Upload Image Overlay Trigger */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload profile picture"
                  className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full hover:bg-gray-800 shadow-md cursor-pointer border-2 border-white transition-all"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-serif text-xl font-bold text-gray-900">{name || 'Admin User'}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-black text-white">
                    {getRoleLabel(currentUser.role)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-mono">{email}</p>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-gray-200 hover:border-black text-xs font-semibold text-gray-800 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Change Avatar
                  </button>

                  {avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="px-3 py-1.5 bg-white border border-red-200 hover:border-red-600 text-xs font-semibold text-red-600 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form id="user-profile-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-gray-700 font-bold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-black" /> Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-black text-xs font-sans"
                    placeholder="Arshath Founder"
                  />
                </div>

                {/* Email Address (Disabled for self-service) */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-gray-700 font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-black" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 text-xs font-mono cursor-not-allowed"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-gray-700 font-bold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-black" /> Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-black text-xs font-sans"
                    placeholder="+91 98765 43210"
                  />
                </div>

                {/* Designation / Job Title */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-gray-700 font-bold flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-black" /> Designation / Role
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-black text-xs font-sans"
                    placeholder="Founder & Managing Director"
                  />
                </div>
              </div>

              {/* Bio / Description */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-gray-700 font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-black" /> Personal Bio & Notes
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-black text-xs font-sans resize-none"
                  placeholder="Enter account bio or operational responsibilities..."
                />
              </div>
            </form>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-3 px-6 sm:px-8 py-4 border-t border-gray-200 bg-gray-50/80 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white border border-gray-200 hover:border-black text-xs font-bold text-gray-700 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="user-profile-form"
              disabled={loading}
              className="px-6 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
