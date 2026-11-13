import React from 'react';

export const AndroidNavigationBar: React.FC = () => {
  return (
    <div className="w-full flex justify-center items-center py-2.5 z-20 shrink-0 bg-[#03120E] select-none">
      {/* Android 14/15 Gesture Navigation Pill */}
      <div className="w-28 sm:w-32 h-1 bg-white/35 rounded-full hover:bg-white/55 transition-colors" />
    </div>
  );
};
