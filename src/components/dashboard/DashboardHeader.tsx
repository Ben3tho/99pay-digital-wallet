import React from 'react';
import { Menu } from 'lucide-react';
import { Language } from '../../i18n/translations';
import { getFirstName } from '../../utils/vaultSecurity';

interface DashboardHeaderProps {
  onOpenNavigationDrawer: () => void;
  lang: Language;
  userFullName?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenNavigationDrawer,
  lang,
  userFullName,
}) => {
  const firstName = getFirstName(userFullName);

  const greetingText = firstName
    ? lang === 'sw'
      ? `Habari, ${firstName}`
      : `Hello, ${firstName}`
    : lang === 'sw'
    ? 'Karibu, 99Pay'
    : 'Welcome to 99Pay';

  return (
    <div className="w-full flex items-center justify-between pb-3 pt-1 select-none border-b border-[#24473A]/60">
      {/* Top Left Menu Button (Navigation Bar Trigger) & User Greeting */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Navigation Bar Hamburger Button */}
        <button
          type="button"
          onClick={onOpenNavigationDrawer}
          aria-label="Fungua Mipangilio na Menyu"
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#06271D] to-[#0B211B] border border-[#24473A] hover:border-[#00B887] flex items-center justify-center text-[#F4C95D] hover:text-white transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
          title="Mipangilio & Menyu"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Dynamic User Greeting */}
        <div className="min-w-0">
          <h1 className="font-extrabold text-base sm:text-lg text-white tracking-tight truncate">
            {greetingText}
          </h1>
          <span className="text-[11px] text-[#B7C8C1] block truncate">
            {lang === 'sw' ? 'Vault yako ya 99Pay ipo salama' : 'Your 99Pay wallet is secure'}
          </span>
        </div>
      </div>

      {/* Subtle App Badge */}
      <div className="px-2.5 py-1 rounded-xl bg-[#06271D] border border-[#00B887]/30 text-[#00B887] text-[10px] font-bold tracking-wider uppercase shrink-0">
        99Pay
      </div>
    </div>
  );
};
