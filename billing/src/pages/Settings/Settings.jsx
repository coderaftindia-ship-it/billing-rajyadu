import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Building2, 
  Image as ImageIcon, 
  Hash, 
  FileText, 
  Printer, 
  Database, 
  Save, 
  CloudUpload,
  RotateCcw,
  CheckCircle2,
  Lock,
  Smartphone,
  Globe,
  X,
  Tag
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useBilling } from '../../context/BillingContext';

const settingsTabs = [
  { id: 'company', icon: Building2, label: 'Company Details' },
  { id: 'tax', icon: Tag, label: 'Tax & Billing' },
  // { id: 'invoice', icon: FileText, label: 'Invoice Design' },
  // { id: 'printer', icon: Printer, label: 'Printer Setup' },
  { id: 'backup', icon: Database, label: 'Backup & Security' },
];

export default function SettingsPage() {
  const { settings, updateSettings, performBackup } = useBilling();
  const [activeTab, setActiveTab] = useState('company');
  const [formData, setFormData] = useState({});
  const [backingUp, setBackingUp] = useState(false);

  useEffect(() => {
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    setFormData(settingsMap);
  }, [settings]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleBackup = async () => {
    setBackingUp(true);
    try {
      await performBackup();
      alert('Backup completed successfully!');
    } catch (error) {
      alert('Backup failed.');
    } finally {
      setBackingUp(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert("File size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('companyLogo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await updateSettings(formData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error("Error saving settings:", error);
      alert('Failed to save settings.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm">Configure your business profile and system preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
        >
          <Save size={20} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-72 space-y-2">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold",
                activeTab === tab.id 
                  ? "bg-white text-blue-600 shadow-sm border border-slate-100" 
                  : "text-slate-500 hover:bg-white hover:text-slate-900"
              )}
            >
              <tab.icon size={20} className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-10">
          {activeTab === 'company' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="space-y-4">
                  <div 
                    onClick={() => document.getElementById('logoInput').click()}
                    className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all cursor-pointer group overflow-hidden"
                  >
                    {formData.companyLogo ? (
                      <img src={formData.companyLogo} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <>
                        <ImageIcon size={32} className="group-hover:scale-110 transition-transform" />
                        <p className="text-[10px] font-black uppercase mt-2 text-center px-2">Upload Logo</p>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    id="logoInput" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                  <button 
                    onClick={() => handleChange('companyLogo', '')}
                    className="text-blue-600 text-xs font-bold hover:underline"
                  >
                    Remove logo
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Company Name</label>
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus-within:bg-white focus-within:border-blue-500 transition-all">
                      <Building2 size={18} className="text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.companyName || ''} 
                        onChange={(e) => handleChange('companyName', e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm font-medium" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest">GST Number</label>
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus-within:bg-white focus-within:border-blue-500 transition-all">
                      <Hash size={18} className="text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.gstNumber || ''} 
                        onChange={(e) => handleChange('gstNumber', e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm font-medium uppercase" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Contact Phone</label>
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus-within:bg-white focus-within:border-blue-500 transition-all">
                      <Smartphone size={18} className="text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.phone || ''} 
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm font-medium" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Business Website</label>
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus-within:bg-white focus-within:border-blue-500 transition-all">
                      <Globe size={18} className="text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.website || ''} 
                        onChange={(e) => handleChange('website', e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm font-medium" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Store Address</label>
                <textarea 
                  rows="3" 
                  value={formData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'tax' && (
            <div className="space-y-8">
              <h3 className="text-lg font-bold text-slate-900">Tax & Billing Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Tag size={24} />
                      <h4 className="font-bold">GST Configuration</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500 tracking-widest">CGST (%)</label>
                        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-slate-100 focus-within:border-blue-500 transition-all">
                          <input 
                            type="number" 
                            step="0.1"
                            value={formData.cgstRate || '2.5'} 
                            onChange={(e) => handleChange('cgstRate', e.target.value)}
                            className="bg-transparent border-none outline-none w-full text-sm font-medium" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500 tracking-widest">SGST (%)</label>
                        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-slate-100 focus-within:border-blue-500 transition-all">
                          <input 
                            type="number" 
                            step="0.1"
                            value={formData.sgstRate || '2.5'} 
                            onChange={(e) => handleChange('sgstRate', e.target.value)}
                            className="bg-transparent border-none outline-none w-full text-sm font-medium" 
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium italic">These rates will be applied to all taxable items in the POS.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3 text-slate-700">
                      <FileText size={24} />
                      <h4 className="font-bold">Billing Preferences</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900">Auto-Apply GST</p>
                          <p className="text-[10px] text-slate-500">Automatically calculate tax on items</p>
                        </div>
                        <div 
                          onClick={() => handleChange('autoGst', formData.autoGst === 'true' ? 'false' : 'true')}
                          className={cn("w-10 h-5 rounded-full relative cursor-pointer transition-colors", formData.autoGst === 'true' ? 'bg-blue-600' : 'bg-slate-200')}
                        >
                          <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all", formData.autoGst === 'true' ? 'right-0.5' : 'left-0.5')}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-8">
              <h3 className="text-lg font-bold text-slate-900">Backup & Security</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3 text-blue-700">
                      <Database size={24} />
                      <h4 className="font-bold">Cloud Backup</h4>
                    </div>
                    <p className="text-sm text-blue-600/80">Regularly back up your data to the cloud to prevent data loss.</p>
                    <button 
                      onClick={handleBackup}
                      disabled={backingUp}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                      <CloudUpload size={18} className={backingUp ? 'animate-bounce' : ''} />
                      <span>{backingUp ? 'Backing up...' : 'Backup Now'}</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Auto Backup Frequency</label>
                    <select 
                      value={formData.backupFrequency || 'daily'}
                      onChange={(e) => handleChange('backupFrequency', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Lock size={24} />
                      <h4 className="font-bold">Security Settings</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900">Two-Factor Auth</p>
                          <p className="text-[10px] text-slate-500">Extra layer of security for login</p>
                        </div>
                        <div 
                          onClick={() => handleChange('twoFactor', formData.twoFactor === 'true' ? 'false' : 'true')}
                          className={cn("w-10 h-5 rounded-full relative cursor-pointer transition-colors", formData.twoFactor === 'true' ? 'bg-blue-600' : 'bg-slate-200')}
                        >
                          <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all", formData.twoFactor === 'true' ? 'right-0.5' : 'left-0.5')}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900">Session Timeout</p>
                          <p className="text-[10px] text-slate-500">Auto logout after inactivity</p>
                        </div>
                        <select 
                          value={formData.sessionTimeout || '30'}
                          onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                          className="bg-transparent border-none text-xs font-bold text-blue-600 outline-none"
                        >
                          <option value="15">15 min</option>
                          <option value="30">30 min</option>
                          <option value="60">1 hour</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
