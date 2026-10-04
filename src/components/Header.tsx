import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Award,
  Download,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  User,
  ShieldCheck,
  CheckCircle2,
  Menu,
  X,
  Laptop,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { UserProfile } from '../types';
import { playClick, getMuted, setMuted } from '../utils/soundEffects';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  deferredPrompt: any;
  onInstallPwa: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onUpdateProfile,
  deferredPrompt,
  onInstallPwa,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setSoundMuted(getMuted());

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSound = () => {
    const next = !soundMuted;
    setMuted(next);
    setSoundMuted(next);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'simulator', label: 'Simulator Lab', icon: '⚡' },
    { id: 'curriculum', label: 'Curriculum (30h)', icon: '📚' },
    { id: 'labs', label: '10 Business Labs', icon: '🏢' },
    { id: 'capstone', label: 'Capstone', icon: '🏆' },
    { id: 'certificates', label: 'Certificates & Badges', icon: '🏅' },
    { id: 'verify', label: 'Verify Portal', icon: '🔍' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '📊' },
    { id: 'admin', label: 'Admin', icon: '⚙️' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#08090d]/95 backdrop-blur-xl border-b border-amber-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* BRAND LOGO & PRESENTER TAG */}
            <div
              onClick={() => {
                playClick();
                setActiveTab('dashboard');
              }}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1b1e2c] to-[#0c0d14] border border-amber-500/50 flex items-center justify-center shadow-lg group-hover:border-amber-400 transition-all">
                <span className="text-xl">📊</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base md:text-lg tracking-wider text-white group-hover:text-amber-300 transition">
                    VISUAL BUSINESS ENGINE
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    PWA Ready
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                  <span className="text-amber-400 font-semibold">SarlaYash Mission</span>
                  <span>•</span>
                  <span>Powered By Kapil</span>
                </div>
              </div>
            </div>

            {/* DESKTOP NAVIGATION TABS */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      playClick();
                      setActiveTab(item.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* RIGHT WIDGETS: ONLINE BADGE, AUDIO, PWA INSTALL, XP & GOOGLE SIGN-IN */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Online/Offline Status */}
              <div
                className={`hidden sm:flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border ${
                  isOnline
                    ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                }`}
                title={isOnline ? 'Online - Cloud Sync active' : 'Offline - Operating 100% locally from device cache'}
              >
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
                <span className="font-mono">{isOnline ? 'Online' : 'Offline Mode'}</span>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                className="p-2 rounded-lg bg-[#141622] border border-white/5 text-gray-400 hover:text-white transition"
                title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {soundMuted ? <VolumeX className="w-4 h-4 text-gray-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              </button>

              {/* PWA Install Button */}
              {deferredPrompt && (
                <button
                  onClick={onInstallPwa}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition shadow-sm"
                  title="Install on Phone / Desktop for 100% Offline Access"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install PWA</span>
                </button>
              )}

              {/* Streak & XP Pill */}
              <div className="hidden sm:flex items-center gap-2 bg-[#12141e] border border-amber-500/30 px-2.5 py-1 rounded-lg">
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold font-mono">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  <span>{userProfile.streakDays}d</span>
                </div>
                <div className="h-3 w-px bg-white/10"></div>
                <div className="flex items-center gap-1 text-amber-300 text-xs font-bold font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{userProfile.xp.toLocaleString()} XP</span>
                </div>
              </div>

              {/* Google Sign-in / Avatar Trigger */}
              <button
                onClick={() => {
                  playClick();
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-[#151722] border border-white/10 hover:border-amber-500/40 transition"
              >
                <span className="text-xs font-semibold text-gray-200 hidden sm:inline">
                  {userProfile.name}
                </span>
                <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-400/50 bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-300">
                  {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    userProfile.name[0]
                  )}
                </div>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-[#141622] border border-white/10 text-gray-300 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0c0d14] border-b border-amber-500/20 px-4 py-3 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span className="text-xs text-amber-300 font-bold">{userProfile.streakDays} Days Streak</span>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold">{userProfile.xp} XP</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    playClick();
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    activeTab === item.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {deferredPrompt && (
              <button
                onClick={() => {
                  onInstallPwa();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full mt-2 py-2.5 rounded-lg gold-gradient-btn text-black font-bold text-xs flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" /> Install App to Phone Home Screen
              </button>
            )}
          </div>
        )}
      </header>

      {/* ================= GOOGLE SIGN-IN MODAL (PRD Section 6) ================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f1118] border border-amber-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg text-black font-extrabold text-xl">
                V
              </div>
              <h3 className="text-xl font-bold text-white">Google Sign-In</h3>
              <p className="text-xs text-gray-400 mt-1">
                Visual Business Engine • 100% Browser Simulation Portal
              </p>
            </div>

            {/* Current Learner Profile */}
            <div className="bg-[#171924] border border-white/5 rounded-xl p-4 mb-4 flex items-center gap-3">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-12 h-12 rounded-full border-2 border-amber-400/50 object-cover"
              />
              <div className="flex-1 text-left">
                <h4 className="text-sm font-bold text-white">{userProfile.name}</h4>
                <p className="text-xs text-gray-400">{userProfile.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono">
                    Tier: {userProfile.level}
                  </span>
                  <span className="text-[10px] text-gray-400">{userProfile.xp} XP</span>
                </div>
              </div>
            </div>

            {/* Quick Profile Switcher / Customizer */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Display Name (Printed on Certificate):</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => onUpdateProfile({ ...userProfile, name: e.target.value })}
                  className="w-full bg-[#171924] text-white text-sm px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Google Email:</label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => onUpdateProfile({ ...userProfile, email: e.target.value })}
                  className="w-full bg-[#171924] text-white text-sm px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Google Authentication One-Tap style buttons */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  playClick();
                  setIsAuthModalOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-semibold text-sm flex items-center justify-center gap-3 shadow transition active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue as {userProfile.name}
              </button>

              <button
                onClick={() => {
                  playClick();
                  onUpdateProfile({
                    ...userProfile,
                    id: 'usr_guest_' + Date.now(),
                    name: 'Business Scholar',
                    email: 'scholar@sarlayash.org',
                  });
                  setIsAuthModalOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-[#171924] hover:bg-white/10 text-gray-300 font-medium text-xs border border-white/10 transition"
              >
                Switch to Guest Learner
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
