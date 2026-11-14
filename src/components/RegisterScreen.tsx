import React, { useState } from 'react';
import { AndroidStatusBar } from './AndroidStatusBar';
import { AndroidNavigationBar } from './AndroidNavigationBar';
import { NineNinePayLogo } from './NineNinePayLogo';
import { RegisterFullNameField } from './RegisterFullNameField';
import { RegisterPhoneField } from './RegisterPhoneField';
import { RegisterEmailField } from './RegisterEmailField';
import { RegisterPasswordField } from './RegisterPasswordField';
import { TermsCheckboxRow } from './TermsCheckboxRow';
import { RegisterFooter } from './RegisterFooter';
import { PhaseInfoModal, ModalType } from './PhaseInfoModal';
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { syncUserProfileToCloud } from '../services/cloudVaultService';

interface RegisterScreenProps {
  onNavigateToSignIn: () => void;
  onNavigateToDashboard?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigateToSignIn,
  onNavigateToDashboard,
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Field Errors
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<string | null>(null);

  // Phase Validation Notice
  const [validationSuccessNotice, setValidationSuccessNotice] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleCreateAccount = async () => {
    setRegisterError(null);
    let hasError = false;

    // 1. Full Name Validation
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setFullNameError('Please enter your full name');
      hasError = true;
    } else if (trimmedName.length < 2) {
      setFullNameError('Full name must be at least 2 characters');
      hasError = true;
    } else {
      setFullNameError(null);
    }

    // 2. Phone Number Validation (Required for mobile money linking: M-Pesa, Airtel, Tigo, Halopesa)
    const trimmedPhone = phoneNumber.trim();
    const phoneDigits = trimmedPhone.replace(/[\s+-]/g, '');
    if (!trimmedPhone) {
      setPhoneError('Please enter your phone number for wallet linking');
      hasError = true;
    } else if (phoneDigits.length < 9 || phoneDigits.length > 15) {
      setPhoneError('Please enter a valid phone number (e.g. +255 7XX XXX XXX or 07XX XXX XXX)');
      hasError = true;
    } else {
      setPhoneError(null);
    }

    // 3. Email Validation (Required for official e-statements and card receipts)
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      setEmailError('Please enter your email address for account statements');
      hasError = true;
    } else if (!emailRegex.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address (e.g. name@domain.com)');
      hasError = true;
    } else {
      setEmailError(null);
    }

    // 4. Create Password Validation (Min 8 chars, letters and numbers)
    if (!password) {
      setPasswordError('Please create a password');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      hasError = true;
    } else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setPasswordError('Password must contain both letters and numbers');
      hasError = true;
    } else {
      setPasswordError(null);
    }

    // 5. Confirm Password Validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    } else {
      setConfirmPasswordError(null);
    }

    // 6. Terms Acceptance Validation
    if (!agreeTerms) {
      setTermsError('You must agree to the Terms & Conditions and Privacy Policy');
      hasError = true;
    } else {
      setTermsError(null);
    }

    if (hasError) {
      setValidationSuccessNotice(null);
      return;
    }

    try {
      const existingRaw = localStorage.getItem('99pay_vault_state_v1');
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      localStorage.setItem(
        '99pay_vault_state_v1',
        JSON.stringify({
          ...existing,
          userProfile: {
            fullName: trimmedName,
            phoneNumber: trimmedPhone,
            email: trimmedEmail,
          },
        })
      );
    } catch {
      // Ignore storage errors if quota restricted
    }

    setIsSubmitting(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      await updateProfile(cred.user, { displayName: trimmedName });
      await syncUserProfileToCloud(cred.user, {
        fullName: trimmedName,
        phoneNumber: trimmedPhone,
        email: trimmedEmail,
      });
      setValidationSuccessNotice(
        `Cloud account created for ${trimmedEmail} and synced securely.`
      );
      if (onNavigateToDashboard) {
        onNavigateToDashboard();
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/email-already-in-use') {
        setRegisterError('An account with this email already exists. Please Sign In instead.');
      } else if (code === 'auth/operation-not-allowed') {
        setValidationSuccessNotice(
          'Your profile was saved locally on this device. Email/Password registration requires enabling Email/Password provider in Firebase Console, or you can use Google Sign-In.'
        );
      } else {
        setRegisterError(err instanceof Error ? err.message : 'Unable to register account.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#03120E] text-white overflow-hidden select-none">
      {/* BACKGROUND AESTHETICS - Subtle emerald & gold ambient glow and curved vector lines */}
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

        {/* Decorative vector hairline */}
        <svg
          className="absolute inset-0 w-full h-full opacity-15"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 400 800"
        >
          <path
            d="M -50,140 Q 180,110 450,190"
            fill="none"
            stroke="#00B887"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <path
            d="M -30,210 Q 200,170 430,260"
            fill="none"
            stroke="#24473A"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* ANDROID STATUS BAR */}
      <AndroidStatusBar />

      {/* SCROLLABLE FORM CONTAINER (Responsive to all heights, small phones, and virtual keyboard) */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-6 overscroll-contain focus:outline-none scroll-smooth z-10">
        <div className="w-full max-w-sm mx-auto min-h-full flex flex-col justify-between py-2 sm:py-3 pb-8">
          {/* Top & Form Section */}
          <div className="flex flex-col">
            {/* SECTION A: BRAND HEADER */}
            <div className="pt-1 pb-3 sm:pb-4">
              <NineNinePayLogo />
            </div>

            <div className="mb-4 sm:mb-5 text-left">
              <h1
                className="text-2xl sm:text-[26px] font-bold text-white tracking-tight leading-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Create Your Account
              </h1>
              <p className="text-sm text-[#B7C8C1] mt-1 leading-relaxed">
                Your cards and IDs, organized in one secure place.
              </p>
            </div>

            {/* FORM INPUT FIELDS */}
            <div className="flex flex-col gap-3 sm:gap-3.5">
              {/* SECTION B: FULL NAME FIELD */}
              <RegisterFullNameField
                value={fullName}
                onChange={setFullName}
                error={fullNameError}
                onClearError={() => setFullNameError(null)}
              />

              {/* SECTION C: PHONE NUMBER FIELD */}
              <RegisterPhoneField
                value={phoneNumber}
                onChange={setPhoneNumber}
                error={phoneError}
                onClearError={() => setPhoneError(null)}
              />

              {/* SECTION D: EMAIL FIELD */}
              <RegisterEmailField
                value={email}
                onChange={setEmail}
                error={emailError}
                onClearError={() => setEmailError(null)}
              />

              {/* SECTION E: PASSWORD FIELD */}
              <RegisterPasswordField
                id="register-password"
                label="Create Password"
                placeholder="Create a strong password"
                value={password}
                onChange={setPassword}
                error={passwordError}
                onClearError={() => setPasswordError(null)}
                showStrength={true}
              />

              {/* SECTION F: CONFIRM PASSWORD FIELD */}
              <RegisterPasswordField
                id="register-confirm-password"
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                error={confirmPasswordError}
                onClearError={() => setConfirmPasswordError(null)}
                showStrength={false}
              />

              {/* SECTION G: TERMS AND PRIVACY CHECKBOX */}
              <div className="pt-1">
                <TermsCheckboxRow
                  agreed={agreeTerms}
                  onAgreedChange={setAgreeTerms}
                  onOpenTerms={() => setActiveModal('terms_privacy')}
                  error={termsError}
                />
              </div>

              {/* SECTION H: CREATE ACCOUNT BUTTON */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCreateAccount}
                  disabled={isSubmitting}
                  aria-label="Submit account creation"
                  className="relative w-full h-14 rounded-2xl font-bold text-base text-[#03120E] transition-all duration-150 active:scale-[0.985] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F4C95D]/50 shadow-lg shadow-black/40 overflow-hidden group disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(90deg, #F8D978 0%, #F4C95D 50%, #E6A92D 100%)',
                  }}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <span className="relative z-10 flex items-center justify-center font-bold tracking-tight text-[16px]">
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </span>
                </button>
              </div>

              {registerError && (
                <div className="mt-1 p-3 rounded-xl bg-rose-950/40 border border-rose-700/50 flex items-start gap-2 text-xs text-rose-200 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{registerError}</span>
                </div>
              )}

              {/* Profile Saved Notice Banner */}
              {validationSuccessNotice && (
                <div className="mt-1 p-3.5 rounded-xl bg-[#06271D] border border-[#00B887]/40 flex items-start gap-2.5 text-xs text-[#B7C8C1] animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-[#00B887] shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <span className="font-bold text-white block">
                      Profile Saved
                    </span>
                    <span className="text-[11px] block text-[#B7C8C1]">
                      {validationSuccessNotice}
                    </span>
                    {onNavigateToDashboard && (
                      <button
                        type="button"
                        onClick={onNavigateToDashboard}
                        className="mt-1.5 text-[11px] font-bold text-[#F4C95D] hover:underline cursor-pointer"
                      >
                        Open 99Pay Dashboard →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Anchor: SECTION I EXISTING ACCOUNT FOOTER */}
          <div className="mt-6 pt-3 flex flex-col items-center shrink-0">
            <RegisterFooter onSignInClick={onNavigateToSignIn} />

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

      {/* Informative Modal for Terms or Validation feedback */}
      <PhaseInfoModal
        type={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};
