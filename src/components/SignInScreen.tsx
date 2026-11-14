import React, { useState } from 'react';
import { AndroidStatusBar } from './AndroidStatusBar';
import { AndroidNavigationBar } from './AndroidNavigationBar';
import { NineNinePayLogo } from './NineNinePayLogo';
import { SignInInputField } from './SignInInputField';
import { PasswordInputField } from './PasswordInputField';
import { RememberMeRow } from './RememberMeRow';
import { SignInButton } from './SignInButton';
import { BiometricSignInOption } from './BiometricSignInOption';
import { CreateAccountFooter } from './CreateAccountFooter';
import { PhaseInfoModal, ModalType } from './PhaseInfoModal';
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { syncUserProfileToCloud } from '../services/cloudVaultService';
import { verifyDeviceBiometric } from '../utils/biometrics';

interface SignInScreenProps {
  onOpenCodeInspector?: () => void;
  onNavigateToRegister?: () => void;
  onNavigateToForgotPassword?: () => void;
  onNavigateToDashboard?: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onNavigateToDashboard,
}) => {
  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Error States
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Development stage banner / auth feedback state
  const [devInfoNotice, setDevInfoNotice] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleSignIn = async () => {
    let hasError = false;
    const trimmedId = identifier.trim();

    if (!trimmedId) {
      setIdentifierError('Please enter your phone number or email');
      hasError = true;
    } else {
      setIdentifierError(null);
    }

    if (!password) {
      setPasswordError('Please enter your password');
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (hasError) {
      setDevInfoNotice(null);
      setAuthError(null);
      return;
    }

    setAuthError(null);
    setDevInfoNotice(null);

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedId);
    if (!isEmail) {
      setDevInfoNotice(
        'Phone sign-in uses local offline vault access. To enable cloud backup & sync, sign in with Google or an email address.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, trimmedId, password);
      await syncUserProfileToCloud(cred.user, {
        fullName: cred.user.displayName || '',
        email: cred.user.email || trimmedId,
      });
      if (onNavigateToDashboard) {
        onNavigateToDashboard();
      } else {
        setDevInfoNotice(`Signed in as ${cred.user.email}`);
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/operation-not-allowed') {
        setAuthError(
          'Email/Password sign-in is disabled in Firebase Console. Use Google Sign-In below or open your Local Vault.'
        );
      } else if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found'
      ) {
        setAuthError('Incorrect email or password. Please verify and try again.');
      } else {
        setAuthError(err instanceof Error ? err.message : 'Unable to sign in right now.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setDevInfoNotice(null);
    setIsSubmitting(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      try {
        const existingRaw = window.localStorage.getItem('99pay_vault_state_v1');
        const existing = existingRaw ? JSON.parse(existingRaw) : {};
        const currentProfile = existing.userProfile || {};
        window.localStorage.setItem(
          '99pay_vault_state_v1',
          JSON.stringify({
            ...existing,
            userProfile: {
              ...currentProfile,
              fullName: currentProfile.fullName || cred.user.displayName || '',
              email: cred.user.email || currentProfile.email || '',
            },
          })
        );
      } catch {
        // ignore storage errors
      }
      await syncUserProfileToCloud(cred.user, {
        fullName: cred.user.displayName || '',
        email: cred.user.email || '',
      });
      if (onNavigateToDashboard) {
        onNavigateToDashboard();
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (code !== 'auth/popup-closed-by-user') {
        setAuthError(
          err instanceof Error ? err.message : 'Google Sign-In failed. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBiometricSignIn = async () => {
    setAuthError(null);
    const res = await verifyDeviceBiometric(
      '99Pay Vault',
      'Verify your device biometric to open your 99Pay Vault'
    );
    if (res.verified) {
      if (onNavigateToDashboard) onNavigateToDashboard();
    } else if (res.reason === 'NOT_ENROLLED') {
      setActiveModal('biometric');
    } else {
      setAuthError('Biometric verification failed. Please sign in with Google or email.');
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#03120E] text-white overflow-hidden select-none">
      {/* SECTION A: BACKGROUND AESTHETICS - Subtle emerald gradients and elegant curved lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-Right Emerald Aura */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[100px] opacity-25"
          style={{ background: 'radial-gradient(circle, #00B887 0%, transparent 70%)' }}
        />

        {/* Bottom-Left Luxury Gold Aura */}
        <div
          className="absolute -bottom-28 -left-28 w-72 h-72 rounded-full blur-[90px] opacity-15"
          style={{ background: 'radial-gradient(circle, #F4C95D 0%, transparent 70%)' }}
        />

        {/* Elegant curved SVG decorative hairline (non-interfering) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-15"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 400 800"
        >
          <path
            d="M -50,160 Q 180,120 450,210"
            fill="none"
            stroke="#00B887"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <path
            d="M -30,220 Q 200,180 430,270"
            fill="none"
            stroke="#24473A"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* SECTION A: STATUS BAR */}
      <AndroidStatusBar />

      {/* SCROLLABLE FORM CONTAINER (Safe for all screen sizes, small devices, and mobile keyboards) */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-6 overscroll-contain focus:outline-none scroll-smooth z-10">
        <div className="w-full max-w-sm mx-auto min-h-full flex flex-col justify-between py-2 sm:py-3 pb-8">
          {/* Top & Form Section */}
          <div className="flex flex-col">
            {/* SECTION B: BRAND LOGO */}
            <div className="pt-1 pb-4 sm:pb-5">
              <NineNinePayLogo />
            </div>

            {/* SECTION C: WELCOME MESSAGE */}
            <div className="mb-4 sm:mb-5 text-left">
              <h1
                className="text-2xl sm:text-[26px] font-bold text-white tracking-tight leading-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Welcome Back
              </h1>
              <p className="text-sm text-[#B7C8C1] mt-1 leading-relaxed">
                Sign in to access your cards and IDs.
              </p>
            </div>

            {/* INPUT FIELDS SECTION */}
            <div className="flex flex-col gap-3.5 sm:gap-4">
              {/* SECTION D: EMAIL OR PHONE NUMBER INPUT */}
              <SignInInputField
                value={identifier}
                onChange={setIdentifier}
                error={identifierError}
                onClearError={() => setIdentifierError(null)}
              />

              {/* SECTION E: PASSWORD INPUT */}
              <PasswordInputField
                value={password}
                onChange={setPassword}
                error={passwordError}
                onClearError={() => setPasswordError(null)}
                onEnterPress={handleSignIn}
              />

              {/* SECTION F: REMEMBER ME AND FORGOT PASSWORD */}
              <RememberMeRow
                rememberMe={rememberMe}
                onRememberMeChange={setRememberMe}
                onForgotPasswordClick={() => {
                  if (onNavigateToForgotPassword) {
                    onNavigateToForgotPassword();
                  } else {
                    setActiveModal('forgot_password');
                  }
                }}
              />

              {/* SECTION G: PRIMARY SIGN IN BUTTON */}
              <div className="pt-1 sm:pt-1.5 space-y-2.5">
                <SignInButton onClick={handleSignIn} isLoading={isSubmitting} />

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-2xl bg-[#06271D] hover:bg-[#0B211B] border border-[#24473A] hover:border-[#00B887]/60 text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#EA4335"
                      d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-2H12z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-700/50 flex items-start gap-2 text-xs text-rose-200 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1.5">
                    <span>{authError}</span>
                    {onNavigateToDashboard && (
                      <button
                        type="button"
                        onClick={onNavigateToDashboard}
                        className="block text-[11px] font-bold text-[#F4C95D] hover:underline cursor-pointer"
                      >
                        Open Local Device Vault Offline →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Validation & Local Vault Notice Banner */}
              {devInfoNotice && (
                <div className="p-3.5 rounded-xl bg-[#06271D] border border-[#F4C95D]/40 flex items-start gap-2.5 text-xs text-[#B7C8C1] animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-[#00B887] shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <span className="font-bold text-white block">
                      Local Vault Ready
                    </span>
                    <span className="text-[11px] block text-[#B7C8C1]">
                      {devInfoNotice}
                    </span>
                    {onNavigateToDashboard && (
                      <button
                        type="button"
                        onClick={onNavigateToDashboard}
                        className="mt-2 w-full py-2 px-3 rounded-lg bg-[#00B887] text-[#03120E] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98 transition-transform"
                      >
                        <span>Open 99Pay Wallet Dashboard</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION H: BIOMETRIC SIGN-IN */}
              <div className="pt-2 sm:pt-3">
                <BiometricSignInOption onClick={handleBiometricSignIn} />
              </div>
            </div>
          </div>

          {/* Bottom Anchor: SECTION I REGISTRATION NAVIGATION & Security note */}
          <div className="mt-6 pt-3 flex flex-col items-center shrink-0">
            <CreateAccountFooter
              onCreateAccountClick={() => {
                if (onNavigateToRegister) {
                  onNavigateToRegister();
                } else {
                  setActiveModal('create_account');
                }
              }}
            />

            {/* Subtle Security & Tanzania badge at bottom */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#B7C8C1]/60 mt-1">
              <Shield className="w-3.5 h-3.5 text-[#00B887]/70 shrink-0" />
              <span className="text-center">Bank-grade 256-bit AES · BoT aligned</span>
            </div>
          </div>
        </div>
      </div>

      {/* ANDROID NAVIGATION BAR (Pill) */}
      <AndroidNavigationBar />

      {/* Interactive Modal for Phase limits (no fake logins or fake scans) */}
      <PhaseInfoModal
        type={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};
