import React from 'react';
import { LogOut } from 'lucide-react';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
  adminUsername: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn,
  onLogout,
  onLoginClick,
  adminUsername,
}) => {
  return (
    <header className="bg-[#002147] text-white border-b-4 border-[#f1c40f] shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Brand */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-sm sm:text-base text-amber-300 uppercase">
                  National Treasury ICT Inventory
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Official ICT Asset Management System
              </p>
            </div>
          </div>

          {/* Simple Auth status */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-300 hidden sm:inline">
                  Logged in as: <strong className="text-white">{adminUsername}</strong>
                </span>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-700/80 hover:bg-red-700 text-white transition shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
