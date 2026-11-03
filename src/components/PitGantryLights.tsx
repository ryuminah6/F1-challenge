import React from 'react';

interface PitGantryLightsProps {
  countdownCount: number; // 0 to 5, where 5 is ready to launch, -1 is inactive
  isPitActive: boolean;
  isGreenRelease: boolean;
}

export const PitGantryLights: React.FC<PitGantryLightsProps> = ({
  countdownCount,
  isPitActive,
  isGreenRelease,
}) => {
  // If countdown mode is active (0 to 5)
  if (countdownCount >= 0) {
    return (
      <div className="flex flex-col items-center justify-center p-3 bg-neutral-900/90 rounded-xl border border-neutral-800 shadow-2xl backdrop-blur-sm">
        <div className="text-xs uppercase tracking-widest text-neutral-400 font-mono-f1 mb-2 font-semibold">
          FIA STARTING GANTRY · LIGHTS COUNTDOWN
        </div>
        <div className="flex items-center gap-3 md:gap-4 px-4 py-2 bg-neutral-950 rounded-lg border border-neutral-800">
          {[1, 2, 3, 4, 5].map((lightNum) => {
            const isLit = countdownCount >= lightNum;
            return (
              <div key={lightNum} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-7 h-7 md:w-9 md:h-9 rounded-full border-2 transition-all duration-150 flex items-center justify-center ${
                    isLit
                      ? 'bg-red-600 border-red-400 shadow-[0_0_18px_rgba(239,68,68,0.9)] ring-2 ring-red-500/50'
                      : 'bg-neutral-900 border-neutral-700 opacity-30'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${isLit ? 'bg-red-200' : 'bg-neutral-800'}`} />
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-xs font-display text-neutral-400 tracking-wider">
          {countdownCount < 5 ? `RED LIGHTS FORMING (${countdownCount}/5)` : 'LIGHTS OUT AND AWAY WE GO!'}
        </div>
      </div>
    );
  }

  // Normal Pit Stop lollipop / gantry light
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/90 rounded-xl border border-neutral-800 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs font-mono-f1 text-neutral-400 tracking-wider font-semibold">
          PIT GANTRY STATUS
        </span>
      </div>

      <div className="flex items-center gap-3">
        {isGreenRelease ? (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-500/60 rounded-lg animate-pulse-fast">
            <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
            <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
            <span className="text-sm font-display font-bold text-emerald-400 tracking-wider">
              GREEN LIGHT · GO GO GO!
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-600/50 rounded-lg">
            <div className={`w-3.5 h-3.5 rounded-full ${isPitActive ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-neutral-800'}`} />
            <div className={`w-3.5 h-3.5 rounded-full ${isPitActive ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-neutral-800'}`} />
            <span className="text-xs font-display font-bold text-red-400 tracking-wider">
              {isPitActive ? 'PIT STOP IN PROGRESS' : 'STANDBY'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
