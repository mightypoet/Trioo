import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Agency {
  id: string;
  name: string;
  contact_email: string;
  contact_phone: string;
  verification_status: string;
  logo_url: string;
}

interface AgencyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyToEdit: Agency | null;
  onSuccess: () => void;
}

export default function AgencyFormModal({ isOpen, onClose, agencyToEdit, onSuccess }: AgencyFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_email: '',
    contact_phone: '',
    logo_url: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (agencyToEdit) {
      setFormData({
        name: agencyToEdit.name,
        contact_email: agencyToEdit.contact_email,
        contact_phone: agencyToEdit.contact_phone || '',
        logo_url: agencyToEdit.logo_url || '',
      });
    } else {
      setFormData({
        name: '',
        contact_email: '',
        contact_phone: '',
        logo_url: '',
      });
    }
    setImageFile(null);
  }, [agencyToEdit, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.logo_url;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `agencies/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('trioo-images')
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      throw new Error('Failed to upload image.');
    }

    const { data: publicUrlData } = supabase.storage
      .from('trioo-images')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalLogoUrl = await uploadImage();

      const payload = {
        name: formData.name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        logo_url: finalLogoUrl,
        verification_status: agencyToEdit ? agencyToEdit.verification_status : 'verified', // defaulting new agencies to verified for demo
      };

      if (agencyToEdit) {
        const { error } = await supabase
          .from('agencies')
          .update(payload)
          .eq('id', agencyToEdit.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('agencies')
          .insert([payload]);

        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving agency:', error);
      alert(error.message || 'An error occurred while saving the agency.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {agencyToEdit ? 'Edit Agency' : 'Add New Agency'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Agency Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all font-medium"
                placeholder="e.g., Wanderlust Travels"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all font-medium"
                placeholder="contact@agency.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Contact Phone</label>
              <input
                type="text"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all font-medium"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Agency Logo</label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Click to upload logo</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageFileChange} />
                </label>
                {imageFile && <p className="text-xs text-green-600 mt-2 font-medium">Selected: {imageFile.name}</p>}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-center text-gray-400 text-sm font-bold mb-2">OR</span>
                <input
                  type="url"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleInputChange}
                  disabled={!!imageFile}
                  placeholder="Paste an external image URL"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all font-medium disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[var(--color-primary-hover)] transition-all shadow-md disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Agency'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
