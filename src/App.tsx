/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { SignInScreen } from './components/SignInScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import {
  Smartphone,
  Maximize2,
  CreditCard,
  Keyboard,
  UserPlus,
  LogIn,
  KeyRound,
} from 'lucide-react';

const CodeInspectorModal = lazy(() =>
  import('./components/CodeInspectorModal').then((m) => ({ default: m.CodeInspectorModal }))
);

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'signin' | 'register' | 'forgot_password' | 'dashboard'>('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch {
      // ignore sign-out error on offline webviews
    }
    setCurrentScreen('signin');
  };
  const [deviceMode, setDeviceMode] = useState<'device' | 'fullscreen'>(() => {
    if (typeof window !== 'undefined') {
      const isCapacitorNative = Boolean((window as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.());
      if (isCapacitorNative || window.innerWidth < 640) {
        return 'fullscreen';
      }
    }
    return 'device';
  });
  const [heightPreset, setHeightPreset] = useState<'standard' | 'compact' | 'keyboard'>('standard');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const isNativeApp =
    typeof window !== 'undefined' &&
    Boolean((window as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.());

  // Height configurations for testing various Android screen sizes
  const heightClasses = {
    standard: 'h-[800px] max-h-[92vh]',
    compact: 'h-[640px] max-h-[82vh]', // Small Android devices (e.g. Galaxy A0x, 720p displays)
    keyboard: 'h-[500px] max-h-[68vh]', // Simulates active virtual keyboard taking lower 40%
  };

  const screenTitleMap = {
    signin: 'Sign In Screen',
    register: 'Registration Screen',
    forgot_password: 'Password Recovery Screen',
    dashboard: 'Wallet Dashboard Vault',
  };

  if (isNativeApp) {
    return (
      <div className="h-screen w-full bg-[#03120E] text-white flex flex-col font-sans overflow-hidden">
        {currentScreen === 'dashboard' && (
          <DashboardScreen firebaseUser={firebaseUser} onSignOut={handleSignOut} />
        )}
        {currentScreen === 'signin' && (
          <SignInScreen
            onNavigateToRegister={() => setCurrentScreen('register')}
            onNavigateToForgotPassword={() => setCurrentScreen('forgot_password')}
            onNavigateToDashboard={() => setCurrentScreen('dashboard')}
          />
        )}
        {currentScreen === 'register' && (
          <RegisterScreen
            onNavigateToSignIn={() => setCurrentScreen('signin')}
            onNavigateToDashboard={() => setCurrentScreen('dashboard')}
          />
        )}
        {currentScreen === 'forgot_password' && (
          <ForgotPasswordScreen onNavigateToSignIn={() => setCurrentScreen('signin')} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#020B08] text-white flex flex-col font-sans selection:bg-[#00B887]/30 selection:text-white">
      {/* Top Engineering & Preview Bar */}
      <header className="w-full max-w-full overflow-x-auto scrollbar-none bg-[#03120E] border-b border-[#24473A] px-3 sm:px-4 py-2.5 flex items-center justify-between z-30 shrink-0 gap-2 sm:gap-3">
        {/* Brand & Phase Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#06271D] to-[#03120E] border border-[#00B887]/40 flex items-center justify-center shrink-0">
            <span className="text-xs font-black text-[#F4C95D]">99</span>
          </div>
          <div className="hidden xs:block sm:block">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm font-bold tracking-tight text-white">99Pay</span>
              <span className="hidden md:inline text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#06271D] text-[#00B887] border border-[#24473A]">
                {screenTitleMap[currentScreen]}
              </span>
              <span className="hidden lg:inline text-[11px] text-[#B7C8C1]">
                Tanzania Digital Wallet
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Screen Switcher (Segmented Control) */}
          <div className="flex items-center bg-[#0B211B] p-0.5 rounded-lg border border-[#24473A] text-xs">
            <button
              type="button"
              onClick={() => setCurrentScreen('dashboard')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                currentScreen === 'dashboard'
                  ? 'bg-[#00B887] text-[#03120E] shadow-sm'
                  : 'text-[#B7C8C1] hover:text-white'
              }`}
            >
              <CreditCard className="w-3 h-3" />
              <span>Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentScreen('signin')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                currentScreen === 'signin'
                  ? 'bg-[#00B887] text-[#03120E] shadow-sm'
                  : 'text-[#B7C8C1] hover:text-white'
              }`}
            >
              <LogIn className="w-3 h-3" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentScreen('register')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                currentScreen === 'register'
                  ? 'bg-[#00B887] text-[#03120E] shadow-sm'
                  : 'text-[#B7C8C1] hover:text-white'
              }`}
            >
              <UserPlus className="w-3 h-3" />
              <span>Register</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentScreen('forgot_password')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                currentScreen === 'forgot_password'
                  ? 'bg-[#00B887] text-[#03120E] shadow-sm'
                  : 'text-[#B7C8C1] hover:text-white'
              }`}
            >
              <KeyRound className="w-3 h-3" />
              <span className="hidden sm:inline">Recovery</span>
            </button>
          </div>

          {/* Height tester presets (only shown when in phone frame mode) */}
          {deviceMode === 'device' && (
            <div className="hidden lg:flex items-center bg-[#0B211B] p-0.5 rounded-lg border border-[#24473A] text-xs">
              <span className="text-[10px] text-[#B7C8C1]/70 px-2 uppercase tracking-wider font-semibold">
                Screen:
              </span>
              <button
                type="button"
                onClick={() => setHeightPreset('standard')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  heightPreset === 'standard'
                    ? 'bg-[#06271D] text-[#00B887] font-bold border border-[#00B887]/30'
                    : 'text-[#B7C8C1] hover:text-white'
                }`}
                title="Standard Android device height (~800px)"
              >
                800p
              </button>
              <button
                type="button"
                onClick={() => setHeightPreset('compact')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  heightPreset === 'compact'
                    ? 'bg-[#06271D] text-[#00B887] font-bold border border-[#00B887]/30'
                    : 'text-[#B7C8C1] hover:text-white'
                }`}
                title="Small Android device height (~640px) to verify scroll reachability"
              >
                640p
              </button>
              <button
                type="button"
                onClick={() => setHeightPreset('keyboard')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  heightPreset === 'keyboard'
                    ? 'bg-[#06271D] text-[#00B887] font-bold border border-[#00B887]/30'
                    : 'text-[#B7C8C1] hover:text-white'
                }`}
                title="Simulate keyboard active / limited height (~500px)"
              >
                <Keyboard className="w-3 h-3" />
                <span>500p</span>
              </button>
            </div>
          )}

          {/* Viewport Frame Mode Switcher */}
          <div className="flex items-center bg-[#0B211B] p-0.5 rounded-lg border border-[#24473A]">
            <button
              type="button"
              onClick={() => setDeviceMode('device')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                deviceMode === 'device'
                  ? 'bg-[#00B887] text-[#03120E] font-bold'
                  : 'text-[#B7C8C1] hover:text-white'
              }`}
              title="Mobile Device Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Phone Frame</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('fullscreen')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                deviceMode === 'fullscreen'
                  ? 'bg-[#00B887] text-[#03120E] font-bold'
                  : 'text-[#B7C8C1] hover:text-white'
              }`}
              title="Edge-to-Edge Responsive Mobile Viewport"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Edge-to-Edge</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Stage: Android Screen Container */}
      <main className="flex-1 w-full flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
        {deviceMode === 'device' ? (
          /* Realistic Android Phone Device Shell (Pixel 8 Pro proportions with height presets) */
          <div
            className={`relative w-full max-w-[400px] ${heightClasses[heightPreset]} rounded-[44px] bg-[#0c1814] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(0,184,135,0.12)] border-[3px] border-[#24473A] flex flex-col transition-all duration-300`}
          >
            {/* Phone Hardware Details: Speaker Ear Piece */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#1a382e] rounded-full z-30" />

            {/* Hardware Side Buttons */}
            <div className="absolute -left-[5px] top-28 w-1 h-12 bg-[#24473A] rounded-l-sm" />
            <div className="absolute -right-[5px] top-24 w-1 h-16 bg-[#24473A] rounded-r-sm" />

            {/* Screen Glass Surface */}
            <div className="w-full h-full rounded-[34px] overflow-hidden bg-[#03120E] relative flex flex-col">
              {currentScreen === 'dashboard' && (
                <DashboardScreen firebaseUser={firebaseUser} onSignOut={handleSignOut} />
              )}
              {currentScreen === 'signin' && (
                <SignInScreen
                  onNavigateToRegister={() => setCurrentScreen('register')}
                  onNavigateToForgotPassword={() => setCurrentScreen('forgot_password')}
                  onNavigateToDashboard={() => setCurrentScreen('dashboard')}
                />
              )}
              {currentScreen === 'register' && (
                <RegisterScreen
                  onNavigateToSignIn={() => setCurrentScreen('signin')}
                  onNavigateToDashboard={() => setCurrentScreen('dashboard')}
                />
              )}
              {currentScreen === 'forgot_password' && (
                <ForgotPasswordScreen onNavigateToSignIn={() => setCurrentScreen('signin')} />
              )}
            </div>
          </div>
        ) : (
          /* Fullscreen Mobile Viewport Mode (Edge-to-Edge) */
          <div className="w-full h-full max-w-md mx-auto bg-[#03120E] shadow-2xl flex flex-col border-x border-[#24473A]/40">
            {currentScreen === 'dashboard' && (
              <DashboardScreen firebaseUser={firebaseUser} onSignOut={handleSignOut} />
            )}
            {currentScreen === 'signin' && (
              <SignInScreen
                onNavigateToRegister={() => setCurrentScreen('register')}
                onNavigateToForgotPassword={() => setCurrentScreen('forgot_password')}
                onNavigateToDashboard={() => setCurrentScreen('dashboard')}
              />
            )}
            {currentScreen === 'register' && (
              <RegisterScreen
                onNavigateToSignIn={() => setCurrentScreen('signin')}
                onNavigateToDashboard={() => setCurrentScreen('dashboard')}
              />
            )}
            {currentScreen === 'forgot_password' && (
              <ForgotPasswordScreen onNavigateToSignIn={() => setCurrentScreen('signin')} />
            )}
          </div>
        )}
      </main>

      {/* Lazy-loaded Kotlin Jetpack Compose Code Inspector Modal */}
      {isCodeModalOpen && (
        <Suspense fallback={null}>
          <CodeInspectorModal
            isOpen={isCodeModalOpen}
            onClose={() => setIsCodeModalOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
