import React from 'react';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  EyeOff,
  History,
  AlertTriangle,
  X,
  CheckCircle2,
  Clock,
  Fingerprint,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export interface AuditLogEntry {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  status: 'safe' | 'warning' | 'info';
}

interface SecurityCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoLockSeconds: number;
  onChangeAutoLock: (seconds: number) => void;
  isFlagSecureEnabled: boolean;
  onToggleFlagSecure: () => void;
  isBiometricEnabled: boolean;
  onToggleBiometric: () => void;
  auditLogs: AuditLogEntry[];
  onLockVaultNow: () => void;
}

export const SecurityCenterModal: React.FC<SecurityCenterModalProps> = ({
  isOpen,
  onClose,
  autoLockSeconds,
  onChangeAutoLock,
  isFlagSecureEnabled,
  onToggleFlagSecure,
  isBiometricEnabled,
  onToggleBiometric,
  auditLogs,
  onLockVaultNow,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm max-h-[90vh] rounded-3xl bg-[#06271D] border border-[#24473A] shadow-2xl p-5 text-white flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#24473A] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00B887]/20 border border-[#00B887]/40 flex items-center justify-center text-[#00B887]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Kituo cha Usalama (Security Hub)</h3>
              <p className="text-[10px] text-[#F4C95D] font-medium">Ulinzi wa Hati & Kadi za Benki</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#0B211B] text-[#B7C8C1] hover:text-white border border-[#24473A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1 text-xs text-[#B7C8C1]">
          {/* Security Score Badge */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0B211B] to-[#041712] border border-[#00B887]/40 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#00B887]">
                Kiwango cha Ulinzi
              </span>
              <h4 className="text-base font-extrabold text-white">98% Imara (Maximum Shield)</h4>
              <p className="text-[11px] text-[#B7C8C1]">
                Vault imekingwa na Keystore & PIN ya lazima
              </p>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-[#00B887] flex items-center justify-center bg-[#00B887]/15 text-[#00B887] font-mono font-bold text-sm shadow-[0_0_15px_rgba(0,184,135,0.3)]">
              98%
            </div>
          </div>

          {/* Instant Lock Button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onLockVaultNow();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0B211B] hover:bg-[#FF6B6B]/15 border border-[#FF6B6B]/40 hover:border-[#FF6B6B] text-[#FF6B6B] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Funga Vault Mara Moja (Emergency Lock)</span>
          </button>

          {/* Section: Auto-Lock Interval */}
          <div className="space-y-2 p-3 rounded-2xl bg-[#0B211B] border border-[#24473A]">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Clock className="w-4 h-4 text-[#F4C95D]" />
              <span>Muda wa Kufunga Vault Kiotomatiki (Auto-Lock)</span>
            </div>
            <p className="text-[11px] text-[#B7C8C1] leading-relaxed">
              Kama hutaigusa simu kwa muda huu, wallet itajifunga yenyewe mara moja kulinda taarifa zako.
            </p>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { label: '30s', val: 30 },
                { label: '1m', val: 60 },
                { label: '2m', val: 120 },
                { label: '5m', val: 300 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => onChangeAutoLock(opt.val)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    autoLockSeconds === opt.val
                      ? 'bg-[#00B887] text-[#03120E] shadow-sm'
                      : 'bg-[#06271D] text-[#B7C8C1] border border-[#24473A] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Android FLAG_SECURE (Screenshot Blocker) */}
          <div className="p-3 rounded-2xl bg-[#0B211B] border border-[#24473A] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <EyeOff className="w-4 h-4 text-[#00B887]" />
                <span>Ulinzi wa Screenshot (FLAG_SECURE)</span>
              </div>
              <button
                type="button"
                onClick={onToggleFlagSecure}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  isFlagSecureEnabled ? 'bg-[#00B887]' : 'bg-[#24473A]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isFlagSecureEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-[#B7C8C1] leading-relaxed">
              Huzuia simu kuchukua screenshots, kurekodi video ya kioo au kuonesha taarifa kwenye ukurasa wa 'Recent Apps' wa Android.
            </p>
          </div>

          {/* Section: Biometrics Toggle */}
          <div className="p-3 rounded-2xl bg-[#0B211B] border border-[#24473A] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Fingerprint className="w-4 h-4 text-[#F4C95D]" />
                <span>Ufunguzi kwa Alama ya Kidole (Biometrics)</span>
              </div>
              <button
                type="button"
                onClick={onToggleBiometric}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  isBiometricEnabled ? 'bg-[#00B887]' : 'bg-[#24473A]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isBiometricEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-[#B7C8C1] leading-relaxed">
              Ruhusu kufungua kadi na hati zako kwa haraka bila kuingiza PIN kila wakati.
            </p>
          </div>

          {/* Section: Audit Activity Log */}
          <div className="space-y-2 p-3 rounded-2xl bg-[#0B211B] border border-[#24473A]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <History className="w-4 h-4 text-[#00B887]" />
                <span>Kumbukumbu ya Ufikiaji (Audit Log)</span>
              </div>
              <span className="text-[10px] text-[#F4C95D] font-mono">{auditLogs.length} rekodi</span>
            </div>
            <p className="text-[11px] text-[#B7C8C1]">
              Kila hatua ya kufungua namba au kunakili inarekodiwa hapa ndani ya kifaa chako tu:
            </p>

            <div className="space-y-2 max-h-40 overflow-y-auto pt-1 pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2 rounded-xl bg-[#06271D] border border-[#24473A] flex items-start gap-2 text-[10px]"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                      log.status === 'warning'
                        ? 'bg-[#FF6B6B]'
                        : log.status === 'safe'
                        ? 'bg-[#00B887]'
                        : 'bg-[#F4C95D]'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-white font-semibold">
                      <span className="truncate">{log.action}</span>
                      <span className="text-[9px] text-[#B7C8C1] font-mono flex-shrink-0">{log.timestamp}</span>
                    </div>
                    <span className="text-[#B7C8C1] text-[10px] block truncate">{log.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BoT & Bank Guidelines Notice */}
          <div className="p-3 rounded-2xl bg-[#041712] border border-[#24473A]/80 space-y-1.5">
            <span className="text-[10px] font-bold text-[#F4C95D] uppercase tracking-wider block">
              Sheria za Benki Kuu ya Tanzania (BoT)
            </span>
            <ul className="text-[10px] text-[#B7C8C1] space-y-1 list-disc list-inside">
              <li>99Pay haihifadhi namba ya siri ya ATM (Bank PIN).</li>
              <li>Namba za siri za nyuma (CVV/CVC) hazihifadhiwi kamwe.</li>
              <li>Hakuna miamala ya fedha inayofanyika ndani ya app hii.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#24473A] flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#00B887] hover:bg-[#00B887]/90 text-[#03120E] font-bold text-xs cursor-pointer shadow-md transition-all"
          >
            Funga Kituo cha Usalama
          </button>
        </div>
      </div>
    </div>
  );
};
