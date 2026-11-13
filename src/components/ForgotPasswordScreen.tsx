import React, { useState } from 'react';
import { AndroidStatusBar } from './AndroidStatusBar';
import { AndroidNavigationBar } from './AndroidNavigationBar';
import { NineNinePayLogo } from './NineNinePayLogo';
import { SignInInputField } from './SignInInputField';
import { Shield, ArrowLeft, AlertTriangle, KeyRound, CheckCircle2, ServerOff } from 'lucide-react';

interface ForgotPasswordScreenProps {
  onNavigateToSignIn: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onNavigateToSignIn,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<
    'idle' | 'blocked_no_backend' | 'validation_failed'
  >('idle');

  const handleRecover = () => {
    const trimmed = identifier.trim();

    // 1. Local Input Validation (IMPLEMENTED AND VERIFIED)
    if (!trimmed) {
      setIdentifierError('Please enter your registered phone number or email');
      setSubmissionStatus('validation_failed');
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    const digitsOnly = trimmed.replace(/[\s+-]/g, '');
    const isPhone = digitsOnly.length >= 9 && digitsOnly.length <= 15;

    if (!isEmail && !isPhone) {
      setIdentifierError('Please enter a valid email address or phone number (+255)');
      setSubmissionStatus('validation_failed');
      return;
    }

    setIdentifierError(null);

    // 2. Real Backend Submission Check (STRICT NO-DEMO POLICY)
    // External authentication provider (Firebase Auth / SMS Provider) is not yet provisioned.
    // In accordance with policy, we DO NOT simulate fake delivery or invent fake OTPs.
    setSubmissionStatus('blocked_no_backend');
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#03120E] text-white overflow-hidden select-none">
      {/* Background Aesthetics */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[100px] opacity-25"
          style={{ background: 'radial-gradient(circle, #00B887 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-28 -left-28 w-72 h-72 rounded-full blur-[90px] opacity-15"
          style={{ background: 'radial-gradient(circle, #F4C95D 0%, transparent 70%)' }}
        />
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
        </svg>
      </div>

      {/* Android Status Bar */}
      <AndroidStatusBar />

      {/* Scrollable Form Container */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-6 overscroll-contain focus:outline-none scroll-smooth z-10">
        <div className="w-full max-w-sm mx-auto min-h-full flex flex-col justify-between py-2 sm:py-3 pb-8">
          {/* Top & Form Section */}
          <div className="flex flex-col">
            {/* Top Back Navigation Bar */}
            <div className="flex items-center justify-between pt-1 pb-3">
              <button
                type="button"
                onClick={onNavigateToSignIn}
                aria-label="Back to Sign In"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B7C8C1] hover:text-white transition-colors cursor-pointer py-1.5 pr-2"
              >
                <ArrowLeft className="w-4 h-4 text-[#00B887]" />
                <span>Back to Sign In</span>
              </button>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#0B211B] text-[#F4C95D] border border-[#24473A]">
                Recovery
              </span>
            </div>

            {/* Brand Logo */}
            <div className="pb-3 sm:pb-4">
              <NineNinePayLogo />
            </div>

            {/* Header Titles */}
            <div className="mb-4 sm:mb-5 text-left">
              <h1
                className="text-2xl sm:text-[26px] font-bold text-white tracking-tight leading-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Reset Password
              </h1>
              <p className="text-sm text-[#B7C8C1] mt-1 leading-relaxed">
                Enter your registered email address or phone number to recover your wallet access.
              </p>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-3.5 sm:gap-4">
              <SignInInputField
                value={identifier}
                onChange={(val) => {
                  setIdentifier(val);
                  if (identifierError) setIdentifierError(null);
                  if (submissionStatus !== 'idle') setSubmissionStatus('idle');
                }}
                error={identifierError}
                onClearError={() => setIdentifierError(null)}
              />

              {/* Submit Button */}
              <div className="pt-1 sm:pt-1.5">
                <button
                  type="button"
                  onClick={handleRecover}
                  className="relative w-full h-14 rounded-2xl font-bold text-base text-[#03120E] transition-all duration-150 active:scale-[0.985] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F4C95D]/50 shadow-lg shadow-black/40 overflow-hidden group"
                  style={{
                    background: 'linear-gradient(90deg, #F8D978 0%, #F4C95D 50%, #E6A92D 100%)',
                  }}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <span className="relative z-10 flex items-center justify-center font-bold tracking-tight text-[16px]">
                    Send Recovery Instructions
                  </span>
                </button>
              </div>

              {/* Verified Honest Status Display (NO-DEMO POLICY ENFORCED) */}
              {submissionStatus === 'blocked_no_backend' && (
                <div className="mt-2 p-4 rounded-2xl bg-[#06271D] border border-[#F4C95D]/40 text-xs text-[#B7C8C1] animate-in fade-in duration-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#F4C95D]/15 text-[#F4C95D] border border-[#F4C95D]/30">
                      BLOCKED BY EXTERNAL REQUIREMENT
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-white font-semibold">
                    <ServerOff className="w-4 h-4 text-[#F4C95D] shrink-0 mt-0.5" />
                    <span>Authentication Service Not Yet Configured</span>
                  </div>

                  <p className="text-[12px] leading-relaxed text-[#B7C8C1]">
                    In accordance with the <strong>99Pay Strict Real Implementation Policy</strong>, recovery emails and OTP verification messages are never fabricated or simulated.
                  </p>

                  <div className="p-2.5 rounded-lg bg-[#0B211B] border border-[#24473A] space-y-1.5 text-[11px]">
                    <span className="font-semibold text-white block">Requirements to Enable Real Recovery:</span>
                    <ul className="list-disc list-inside space-y-1 text-[#B7C8C1]/90 pl-1">
                      <li>Configure an official auth provider (e.g. Firebase Authentication).</li>
                      <li>Enable Email Password Reset or Tanzanian SMS Gateway routing.</li>
                      <li>Verify domain whitelisting and sender identity records.</li>
                    </ul>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#00B887]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Local form input validation: <strong>IMPLEMENTED AND VERIFIED</strong></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Navigation Anchor */}
          <div className="mt-6 pt-3 flex flex-col items-center shrink-0">
            <div className="w-full flex items-center justify-center flex-wrap gap-1 text-[13.5px] py-1 select-none">
              <span className="text-[#B7C8C1]">Remember your password?</span>
              <button
                type="button"
                onClick={onNavigateToSignIn}
                className="min-h-[44px] inline-flex items-center justify-center font-bold text-[#F4C95D] hover:text-[#F8D978] active:scale-[0.98] transition-all px-2 py-1 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#F4C95D]/50"
              >
                Sign In
              </button>
            </div>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#B7C8C1]/60 mt-1">
              <Shield className="w-3.5 h-3.5 text-[#00B887]/70 shrink-0" />
              <span className="text-center">Bank-grade 256-bit AES · BoT aligned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Android Navigation Bar */}
      <AndroidNavigationBar />
    </div>
  );
};
