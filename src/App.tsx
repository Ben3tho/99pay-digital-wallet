/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SignInScreen } from './components/SignInScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { CodeInspectorModal } from './components/CodeInspectorModal';
import {
  Smartphone,
  Maximize2,
  Code2,
  Info,
  CreditCard,
  FileText,
  ShieldCheck,
  Keyboard,
  UserPlus,
  LogIn,
  KeyRound,
  CheckCircle2,
  ServerOff,
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'signin' | 'register' | 'forgot_password' | 'dashboard'>('dashboard');
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
  const [showProjectSpecs, setShowProjectSpecs] = useState(false);

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
          <DashboardScreen onSignOut={() => setCurrentScreen('signin')} />
        )}
        {currentScreen === 'signin' && (
          <SignInScreen
            onNavigateToRegister={() => setCurrentScreen('register')}
            onNavigateToForgotPassword={() => setCurrentScreen('forgot_password')}
            onNavigateToDashboard={() => setCurrentScreen('dashboard')}
          />
        )}
        {currentScreen === 'register' && (
          <RegisterScreen onNavigateToSignIn={() => setCurrentScreen('signin')} />
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

          {/* Engineering Policy & Status toggle */}
          <button
            type="button"
            onClick={() => setShowProjectSpecs((prev) => !prev)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              showProjectSpecs
                ? 'bg-[#00B887]/20 text-[#00B887] border border-[#00B887]/40'
                : 'bg-[#0B211B] text-[#B7C8C1] hover:text-white border border-[#24473A]'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Engineering Status</span>
          </button>

          {/* Jetpack Compose Kotlin Code Inspector */}
          <button
            type="button"
            onClick={() => setIsCodeModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0B211B] hover:bg-[#06271D] text-[#F4C95D] border border-[#24473A] hover:border-[#F4C95D]/40 transition-all cursor-pointer shadow-sm"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kotlin Compose (.kt)</span>
            <span className="sm:hidden">Kotlin</span>
          </button>

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
              title="Android Phone Mockup (Google Pixel 8 Pro)"
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

      {/* Engineering Policy & Verifiable Status Drawer */}
      {showProjectSpecs && (
        <div className="w-full bg-[#06271D] border-b border-[#24473A] px-4 py-3 text-xs text-[#B7C8C1] animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-5xl mx-auto space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#24473A] pb-1.5">
              <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00B887]" />
                99Pay — Strict Real Implementation Policy &amp; Status Register
              </span>
              <span className="text-[10px] text-[#F4C95D] font-mono">BoT Aligned · Non-Custodial Card Organizer</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-2.5 rounded-xl bg-[#0B211B] border border-[#24473A]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">Local Form Validation</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#00B887]/20 text-[#00B887] border border-[#00B887]/40">
                    IMPLEMENTED AND VERIFIED
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#B7C8C1]">
                  Sign In, Register &amp; Forgot Password input validation passes in browser (empty fields, Tanzania phone format, email regex, 8+ char password &amp; match checks).
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0B211B] border border-[#24473A]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">Live Auth Provider</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#F4C95D]/20 text-[#F4C95D] border border-[#F4C95D]/40">
                    BLOCKED BY EXTERNAL REQUIREMENT
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#B7C8C1]">
                  Neither Firebase Auth nor SMS Gateway is provisioned yet. No fake accounts, fake recovery emails, or simulated OTPs are permitted.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0B211B] border border-[#24473A]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">Biometric Keystore</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-[#B7C8C1] border border-white/20">
                    NOT IMPLEMENTED (PHASE 3)
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#B7C8C1]">
                  Hardware-backed Android BiometricPrompt and Keystore will be integrated once user accounts are wired to persistent secure storage.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <DashboardScreen onSignOut={() => setCurrentScreen('signin')} />
              )}
              {currentScreen === 'signin' && (
                <SignInScreen
                  onNavigateToRegister={() => setCurrentScreen('register')}
                  onNavigateToForgotPassword={() => setCurrentScreen('forgot_password')}
                  onNavigateToDashboard={() => setCurrentScreen('dashboard')}
                />
              )}
              {currentScreen === 'register' && (
                <RegisterScreen onNavigateToSignIn={() => setCurrentScreen('signin')} />
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
              <DashboardScreen onSignOut={() => setCurrentScreen('signin')} />
            )}
            {currentScreen === 'signin' && (
              <SignInScreen
                onNavigateToRegister={() => setCurrentScreen('register')}
                onNavigateToForgotPassword={() => setCurrentScreen('forgot_password')}
                onNavigateToDashboard={() => setCurrentScreen('dashboard')}
              />
            )}
            {currentScreen === 'register' && (
              <RegisterScreen onNavigateToSignIn={() => setCurrentScreen('signin')} />
            )}
            {currentScreen === 'forgot_password' && (
              <ForgotPasswordScreen onNavigateToSignIn={() => setCurrentScreen('signin')} />
            )}
          </div>
        )}
      </main>

      {/* Kotlin Jetpack Compose Code Inspector Modal */}
      <CodeInspectorModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
