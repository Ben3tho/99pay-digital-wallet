import React, { useEffect, useState } from 'react';
import { Wifi, Signal } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full flex items-center justify-between px-6 pt-3 pb-2 text-xs font-semibold text-white/90 select-none z-20"
      style={{ letterSpacing: '0.01em' }}
    >
      {/* Status Bar Clock */}
      <span className="font-medium text-[13px] tracking-tight">{timeStr}</span>

      {/* Camera punch hole representation (Pixel style) */}
      <div className="w-3.5 h-3.5 rounded-full bg-black/80 border border-emerald-950/60 shadow-inner" />

      {/* Status Bar System Icons */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-emerald-400 tracking-wider">5G</span>
        <Signal className="w-3.5 h-3.5 text-white/90" strokeWidth={2.5} />
        <Wifi className="w-3.5 h-3.5 text-white/90" strokeWidth={2.5} />

        {/* Android Battery (99% for 99Pay) */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-medium text-emerald-400">99%</span>
          <div className="w-5 h-2.5 rounded-sm border border-white/80 p-[1px] flex items-center">
            <div className="h-full w-[99%] bg-emerald-400 rounded-[1px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
