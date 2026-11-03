import React from 'react';
import { Radio } from 'lucide-react';

interface RaceEngineerRadioProps {
  message: string;
  isUrgent?: boolean;
}

export const RaceEngineerRadio: React.FC<RaceEngineerRadioProps> = ({
  message,
  isUrgent = false,
}) => {
  return (
    <div
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border backdrop-blur-md transition-colors duration-200 ${
        isUrgent
          ? 'bg-red-950/40 border-red-500/60 text-red-200'
          : 'bg-neutral-900/80 border-neutral-800 text-neutral-200'
      }`}
    >
      <div className="flex items-center gap-1.5 shrink-0">
        <Radio
          size={16}
          className={`${isUrgent ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}
        />
        <span className="text-[11px] font-mono-f1 uppercase font-bold text-neutral-400 tracking-wider">
          PIT WALL RADIO:
        </span>
      </div>

      <div className="flex-1 text-sm font-sans tracking-wide truncate">
        {message}
      </div>

      {/* Audio Waveform visualization effect */}
      <div className="hidden sm:flex items-center gap-0.5 shrink-0 opacity-70">
        <div className="w-1 h-3 bg-cyan-400 animate-pulse rounded-full" />
        <div className="w-1 h-5 bg-cyan-400 animate-pulse rounded-full" style={{ animationDelay: '100ms' }} />
        <div className="w-1 h-2 bg-cyan-400 animate-pulse rounded-full" style={{ animationDelay: '200ms' }} />
        <div className="w-1 h-4 bg-cyan-400 animate-pulse rounded-full" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};
