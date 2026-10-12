import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, AlertCircle, X } from 'lucide-react';
import { validatePassword } from '../utils/passwordPolicy';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (username: string) => void;
  adminUsername: string;
  adminPasswordHash: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  adminUsername,
  adminPasswordHash,
}) => {
  const [username, setUsername] = useState(adminUsername);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Backend format validation: 8-32 chars, Upper, Lower, Digit, Special Char
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setLoginError(validation.errors[0] || 'Password does not meet required format standards.');
      return;
    }

    // Verify credentials
    if (username.trim() === adminUsername && password === adminPasswordHash) {
      onSuccessLogin(username);
      onClose();
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#002147] text-white p-5 border-b-4 border-[#f1c40f] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🏛️</span>
            <div>
              <h3 className="font-bold text-base">National Treasury Login</h3>
              <p className="text-xs text-slate-300">ICT Inventory Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {loginError && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-300 rounded-lg text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{loginError}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 focus:border-[#002147] rounded-lg outline-none"
                placeholder="Username"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-slate-400">
                8–32 chars
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                maxLength={32}
                className="w-full pl-9 pr-9 py-2 text-sm border border-slate-300 focus:border-[#002147] rounded-lg outline-none font-mono"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2 bg-[#002147] hover:bg-[#001733] text-white font-bold text-sm rounded-lg shadow-sm transition"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
