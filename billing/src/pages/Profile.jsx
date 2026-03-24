import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { User, Mail, Phone, Save } from 'lucide-react';

const Profile = () => {
  const { currentUser, updateUser, addToast } = useBilling();
  const [fullName] = useState(currentUser?.name || currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend expects 'name', 'email' etc.
      const updatedData = { 
        ...currentUser, 
        email, 
        phone 
      };
      await updateUser(currentUser.id, updatedData);
      addToast('Profile updated successfully!');
    } catch (error) {
      console.error("Update failed:", error);
      addToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Edit Profile</h1>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{currentUser?.name || currentUser?.fullName}</h2>
              <p className="text-sm text-slate-500">{currentUser?.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-600 mb-2">Full Name (Non-editable)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text"
                  id="fullName"
                  value={fullName}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-600 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-200">
            <button 
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;