import React, { useState } from 'react';
import { ShoppingCart, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useBilling } from '../../context/BillingContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('login'); // login or 2fa
  const [otp, setOtp] = useState('');
  const [tempUser, setTempUser] = useState(null);
  
  const { login, completeLogin } = useBilling();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Small delay to simulate network request
    setTimeout(() => {
      const result = login(username, password);
      if (result.success) {
        if (result.needs2FA) {
          setTempUser(result.user);
          setStep('2fa');
        } else {
          completeLogin(result.user);
          navigate('/');
        }
      } else {
        setError(result.message);
      }
      setIsLoading(false);
    }, 800);
  };

  const handle2FAVerify = (e) => {
    e.preventDefault();
    if (otp === '123456') { // Mock OTP
      completeLogin(tempUser);
      navigate('/');
    } else {
      setError('Invalid OTP. Please try 123456');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        {/* Logo & Welcome */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 mb-4 transition-transform hover:scale-105">
            <ShoppingCart size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Rajyadu</h1>
          <p className="text-slate-500 font-medium mt-2">
            {step === 'login' ? 'Sign in to manage your business' : 'Enter 2FA verification code'}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-10">
            {step === 'login' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Username</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <User size={20} />
                    </div>
                    <input
                      required
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                 
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl py-4 font-black shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Sign In to Dashboard
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handle2FAVerify} className="space-y-6">
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    {error}
                  </div>
                )}
                <div className="space-y-2 text-center">
                  <p className="text-sm text-slate-600 font-medium">A verification code has been sent to your registered device.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1 text-center block">Enter 6-digit Code</label>
                  <input
                    required
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-6 text-center text-3xl font-black tracking-[0.5em] outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    placeholder="000000"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-black shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
                >
                  Verify & Login
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  type="button"
                  onClick={() => setStep('login')}
                  className="w-full text-xs font-black uppercase text-slate-400 hover:text-blue-600 transition-colors"
                >
                  Back to Login
                </button>
              </form>
            )}
          </div>
          
         
        </div>

        {/* Footer Info */}
        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-8">
          Rajyadu v2.4.0 &copy; 2026 All Rights Reserved
        </p>
      </div>
    </div>
  );
}
