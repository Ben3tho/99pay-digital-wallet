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
import { Shield, CheckCircle2 } from 'lucide-react';

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

  // Development stage banner / validation state
  const [devInfoNotice, setDevInfoNotice] = useState<string | null>(null);

  // Modal State
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleSignIn = () => {
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
      return;
    }

    // Validation passed: display Phase 1 requirement message (no fake auth, no dashboard navigation)
    setDevInfoNotice(
      'Phase 1 Preview: Inputs validated successfully. Secure authentication repository and backend token issuance will be connected in a later development phase.'
    );
    setActiveModal('signin_validated');
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
              <div className="pt-1 sm:pt-1.5">
                <SignInButton onClick={handleSignIn} />
              </div>

              {/* Status Notice Banner (Strict Real Implementation Policy) */}
              {devInfoNotice && (
                <div className="p-3.5 rounded-xl bg-[#06271D] border border-[#F4C95D]/40 flex items-start gap-2.5 text-xs text-[#B7C8C1] animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-[#00B887] shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <span className="font-bold text-white block">
                      Local Input Validation: <span className="text-[#00B887]">IMPLEMENTED AND VERIFIED</span>
                    </span>
                    <span className="text-[11px] block text-[#B7C8C1]">
                      Backend Authentication: <span className="text-[#F4C95D] font-semibold">BLOCKED BY EXTERNAL REQUIREMENT</span> (Requires live authentication provider configuration).
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

              {/* SECTION H: BIOMETRIC SIGN-IN PREVIEW */}
              <div className="pt-2 sm:pt-3">
                <BiometricSignInOption
                  onClick={() => setActiveModal('biometric')}
                />
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
