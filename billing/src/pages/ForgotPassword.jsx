import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useBilling } from '../context/BillingContext';

const PasswordInput = ({ id, label, value, onChange, show, onToggle }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-2">{label}</label>
    <div className="relative">
      <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
      <input 
        type={show ? 'text' : 'password'}
        id={id}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        placeholder={`Enter ${label.toLowerCase()}`}
        required
      />
      <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  </div>
);

const ChangePassword = () => {
  const { currentUser, updateUser, addToast } = useBilling();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentPassword !== currentUser?.password) {
      addToast('Current password is incorrect', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast("New passwords don't match!", 'error');
      return;
    }

    if (newPassword.length < 4) {
      addToast('Password must be at least 4 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      const updatedData = { 
        ...currentUser, 
        password: newPassword 
      };
      await updateUser(currentUser.id, updatedData);
      addToast('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Password update failed:", error);
      addToast('Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Change Password</h1>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <PasswordInput 
            id="currentPassword"
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            show={showCurrentPassword}
            onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
          />

          <PasswordInput 
            id="newPassword"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            show={showNewPassword}
            onToggle={() => setShowNewPassword(!showNewPassword)}
          />

          <PasswordInput 
            id="confirmPassword"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <div className="flex justify-end pt-6 border-t border-slate-200">
            <button 
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck size={18} />
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;