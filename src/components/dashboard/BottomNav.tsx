import React from 'react';
import { CreditCard, Store, Calculator, ShieldCheck } from 'lucide-react';
import { Language } from '../../i18n/translations';

export type DashboardTab = 'wallet' | 'lipa' | 'tariff' | 'vault';

interface BottomNavProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  lang: Language;
  walletCount: number;
  lipaCount: number;
  vaultCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  lang,
  walletCount,
  lipaCount,
  vaultCount,
}) => {
  const tabs: {
    id: DashboardTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
  }[] = [
    {
      id: 'wallet',
      label: lang === 'sw' ? 'Pochi' : 'Wallet',
      icon: CreditCard,
      badge: walletCount,
    },
    {
      id: 'lipa',
      label: lang === 'sw' ? 'Lipa & Tills' : 'Pay & Tills',
      icon: Store,
      badge: lipaCount,
    },
    {
      id: 'tariff',
      label: lang === 'sw' ? 'Kikokotoo' : 'Tariff',
      icon: Calculator,
    },
    {
      id: 'vault',
      label: lang === 'sw' ? 'Nyaraka & Mipangilio' : 'Vault & Settings',
      icon: ShieldCheck,
      badge: vaultCount,
    },
  ];

  return (
    <div className="w-full shrink-0 bg-[#06271D]/95 backdrop-blur-md border-t border-[#24473A] z-20 select-none">
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 cursor-pointer min-w-[64px] ${
                isActive
                  ? 'text-[#F4C95D]'
                  : 'text-[#B7C8C1] hover:text-white active:scale-95'
              }`}
            >
              {/* Active Highlight Pill */}
              {isActive && (
                <div className="absolute inset-0 bg-[#00B887]/15 rounded-xl border border-[#00B887]/30 -z-10" />
              )}

              {/* Icon with Optional Badge */}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 px-1 min-w-[15px] h-[15px] text-[9px] font-black rounded-full flex items-center justify-center ${
                      isActive
                        ? 'bg-[#F4C95D] text-[#03120E]'
                        : 'bg-[#24473A] text-[#B7C8C1] border border-[#03120E]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] mt-1 font-semibold truncate max-w-[76px] ${
                  isActive ? 'text-[#F4C95D]' : 'text-[#B7C8C1]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
