import React from 'react';
import { X, Info, ShieldCheck, Fingerprint, KeyRound, UserPlus, FileCheck } from 'lucide-react';

export type ModalType =
  | 'biometric'
  | 'forgot_password'
  | 'create_account'
  | 'signin_validated'
  | 'terms_privacy'
  | 'registration_validated'
  | null;

interface PhaseInfoModalProps {
  type: ModalType;
  onClose: () => void;
}

export const PhaseInfoModal: React.FC<PhaseInfoModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const contentMap: Record<
    Exclude<ModalType, null>,
    {
      icon: React.ReactNode;
      badge: string;
      title: string;
      subtitle: string;
      description: string;
    }
  > = {
    biometric: {
      icon: <Fingerprint className="w-8 h-8 text-[#00B887]" />,
      badge: "DEVICE BIOMETRIC HARDWARE",
      title: "Biometric Authentication",
      subtitle: "Requires Native Android Keystore & BiometricPrompt",
      description:
        "Hardware biometric sign-in uses Android Keystore & BiometricPrompt when native biometric enrollment is linked. You can open and protect your local 99Pay Vault using your 4-digit Vault PIN.",
    },
    forgot_password: {
      icon: <KeyRound className="w-8 h-8 text-[#F4C95D]" />,
      badge: "CLOUD AUTH REQUIRED",
      title: "Password Recovery",
      subtitle: "External Authentication Provider Not Configured",
      description:
        "Online password reset emails and SMS OTPs require provisioning an authentication backend (e.g. Firebase Authentication or an authorized SMS/SMTP gateway).",
    },
    create_account: {
      icon: <UserPlus className="w-8 h-8 text-[#00B887]" />,
      badge: "SCREEN NAVIGATION",
      title: "Account Registration",
      subtitle: "Navigating to Registration Screen",
      description:
        "Navigating to the 99Pay Create Account screen.",
    },
    signin_validated: {
      icon: <ShieldCheck className="w-8 h-8 text-[#00B887]" />,
      badge: "LOCAL VALIDATION VERIFIED",
      title: "Inputs Validated Successfully",
      subtitle: "Local Vault Ready • Cloud Auth Pending",
      description:
        "Input validation succeeded. Cloud authentication and session issuance require a configured backend provider; you can continue directly into your local device vault.",
    },
    registration_validated: {
      icon: <ShieldCheck className="w-8 h-8 text-[#00B887]" />,
      badge: "LOCAL VALIDATION VERIFIED",
      title: "Registration Form Validated",
      subtitle: "Cloud Account Sync Not Yet Provisioned",
      description:
        "Full Name, Phone Number, Email, Password matching, and Terms acceptance are valid. Cloud user account storage requires provisioning an external authentication backend.",
    },
    terms_privacy: {
      icon: <FileCheck className="w-8 h-8 text-[#F4C95D]" />,
      badge: "PRE-LAUNCH NOTICE",
      title: "Terms & Privacy Policy",
      subtitle: "Legal Documentation Notice",
      description:
        "99Pay digital card and identity wallet is engineered for 256-bit AES encryption aligned with Bank of Tanzania (BoT) personal-data protection guidelines. Binding legal documents and formal privacy agreements will be published and verified prior to production launch.",
    },
  };

  const current = contentMap[type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-[#06271D] border border-[#24473A] shadow-2xl p-6 text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 184, 135, 0.1)',
        }}
      >
        {/* Subtle decorative emerald glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00B887]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-[#B7C8C1] hover:text-white rounded-full bg-[#0B211B] border border-[#24473A] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#0B211B] border border-[#24473A] flex items-center justify-center mb-4">
          {current.icon}
        </div>

        {/* Phase Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B211B] border border-[#24473A] text-xs font-medium text-[#F4C95D] mb-2.5">
          <Info className="w-3 h-3 text-[#F4C95D]" />
          <span>{current.badge}</span>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl font-bold tracking-tight text-white mb-1">
          {current.title}
        </h3>
        <p className="text-xs font-semibold text-[#00B887] mb-3">
          {current.subtitle}
        </p>

        {/* Description */}
        <p className="text-sm leading-relaxed text-[#B7C8C1] mb-6">
          {current.description}
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#F8D978] via-[#F4C95D] to-[#E6A92D] text-[#03120E] font-bold text-sm tracking-tight active:scale-[0.99] transition-transform cursor-pointer"
        >
          Understood
        </button>
      </div>
    </div>
  );
};
