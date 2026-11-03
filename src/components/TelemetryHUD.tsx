import React from 'react';
import { Volume2, VolumeX, RotateCcw, Zap } from 'lucide-react';

interface TelemetryHUDProps {
  timeLeft: number;
  timeBonusNotice: number | null;
  carsServiced: number;
  totalScore: number;
  currentStopTime: number;
  fastestStop: number | null;
  combo: number;
  isFever: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  isGameActive: boolean;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  timeLeft,
  timeBonusNotice,
  carsServiced,
  totalScore,
  currentStopTime,
  fastestStop,
  combo,
  isFever,
  soundEnabled,
  onToggleSound,
  onRestart,
  isGameActive,
}) => {
  const isTimeCritical = timeLeft <= 10 && timeLeft > 0;

  return (
    <div
      className={`w-full bg-neutral-900/95 border rounded-xl px-4 py-2.5 backdrop-blur-md shadow-lg transition-all ${
        isFever
          ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] bg-gradient-to-r from-neutral-900 via-amber-950/20 to-neutral-900'
          : 'border-neutral-800'
      }`}
    >
      <div className="flex items-center justify-between gap-3 text-center">
        {/* 1. Timer */}
        <div className="flex items-center gap-2">
          <div className="text-left">
            <span className="block text-[10px] font-mono-f1 uppercase tracking-wider text-neutral-400">
              남은 시간
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-2xl font-mono-f1 font-extrabold tabular-nums leading-none ${
                  isTimeCritical ? 'text-red-400 animate-pulse' : 'text-white'
                }`}
              >
                {timeLeft}s
              </span>
              {timeBonusNotice && (
                <span className="text-[10px] font-mono-f1 font-bold text-emerald-400 animate-bounce">
                  +{timeBonusNotice}s
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Cars / Score */}
        <div className="text-left hidden sm:block">
          <span className="block text-[10px] font-mono-f1 uppercase tracking-wider text-neutral-400">
            정비 완료
          </span>
          <span className="text-2xl font-mono-f1 font-extrabold text-amber-400 tabular-nums leading-none">
            {carsServiced}
            <span className="text-xs font-normal text-neutral-400 ml-1">대</span>
            <span className="text-xs text-neutral-500 font-normal ml-2">({totalScore.toLocaleString()}P)</span>
          </span>
        </div>

        {/* 3. Current Live Stopwatch */}
        <div className="text-center">
          <span className="block text-[10px] font-mono-f1 uppercase tracking-wider text-neutral-400">
            현재 스톱
          </span>
          <span
            className={`text-2xl font-mono-f1 font-extrabold tabular-nums leading-none ${
              currentStopTime <= 1.82 && currentStopTime > 0
                ? 'text-fuchsia-400 animate-pulse'
                : currentStopTime <= 2.2 && currentStopTime > 0
                ? 'text-cyan-400'
                : 'text-neutral-100'
            }`}
          >
            {isGameActive ? currentStopTime.toFixed(2) : '0.00'}s
          </span>
        </div>

        {/* 4. Best Record */}
        <div className="text-right hidden sm:block">
          <span className="block text-[10px] font-mono-f1 uppercase tracking-wider text-neutral-400">
            최고 기록
          </span>
          <span className="text-2xl font-mono-f1 font-extrabold text-emerald-400 tabular-nums leading-none">
            {fastestStop ? `${fastestStop.toFixed(2)}s` : '--'}
          </span>
        </div>

        {/* 5. Fever & Quick Actions */}
        <div className="flex items-center gap-2">
          {combo > 1 && (
            <span
              className={`px-2 py-1 rounded text-xs font-mono-f1 font-extrabold tracking-tight ${
                isFever
                  ? 'bg-amber-400 text-neutral-950 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                  : 'bg-neutral-800 text-yellow-400'
              }`}
            >
              {isFever ? '⚡ FEVER x2' : `${combo} COMBO`}
            </span>
          )}

          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
            title={soundEnabled ? '사운드 음소거' : '사운드 켜기'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {isGameActive && (
            <button
              onClick={onRestart}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors text-xs font-mono-f1 cursor-pointer"
              title="즉시 재도전 (단축키 R)"
              aria-label="Restart"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
