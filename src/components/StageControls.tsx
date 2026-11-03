import React, { useState, useEffect, useRef } from 'react';
import { ArrowKey, PitStage } from '../types/game';

interface StageControlsProps {
  stage: PitStage;
  nutCount: number; // 0 to 4
  nutSequence: string[]; // randomized array of 4 keys e.g. ['d', 's', 'a', 'f']
  arrowSequence: ArrowKey[];
  arrowIdx: number; // 0 to 3
  onNutClick: (key: string) => void;
  onSpaceClick: (isPerfect: boolean) => void;
  onArrowClick: (key: ArrowKey) => void;
  activeKeyError: boolean;
  isFever: boolean;
  floatingText: string | null;
}

export const StageControls: React.FC<StageControlsProps> = ({
  stage,
  nutCount,
  nutSequence,
  arrowSequence,
  arrowIdx,
  onNutClick,
  onSpaceClick,
  onArrowClick,
  activeKeyError,
  isFever,
  floatingText,
}) => {
  // Timing needle position for Stage 2
  const [needlePos, setNeedlePos] = useState<number>(50);
  const needleAnimRef = useRef<number | null>(null);
  const needleDirRef = useRef<number>(1);

  // Animate the timing bar in Stage 2
  useEffect(() => {
    if (stage !== 2) {
      if (needleAnimRef.current) cancelAnimationFrame(needleAnimRef.current);
      return;
    }

    let pos = 10;
    const speed = isFever ? 3.0 : 2.4;

    const loop = () => {
      pos += speed * needleDirRef.current;
      if (pos >= 92) {
        pos = 92;
        needleDirRef.current = -1;
      } else if (pos <= 8) {
        pos = 8;
        needleDirRef.current = 1;
      }
      setNeedlePos(pos);
      needleAnimRef.current = requestAnimationFrame(loop);
    };

    needleAnimRef.current = requestAnimationFrame(loop);
    return () => {
      if (needleAnimRef.current) cancelAnimationFrame(needleAnimRef.current);
    };
  }, [stage, isFever]);

  const handleSpacePress = () => {
    const isPerfect = needlePos >= 38 && needlePos <= 62;
    onSpaceClick(isPerfect);
  };

  const getArrowSymbol = (key: ArrowKey) => {
    switch (key) {
      case 'ArrowUp':
        return '↑';
      case 'ArrowDown':
        return '↓';
      case 'ArrowLeft':
        return '←';
      case 'ArrowRight':
        return '→';
    }
  };

  return (
    <div
      className={`relative w-full bg-neutral-900/90 rounded-2xl border p-4 transition-all duration-150 backdrop-blur-md shadow-xl ${
        isFever
          ? 'fever-border-pulse border-amber-400/80 bg-neutral-900'
          : activeKeyError
          ? 'border-red-500 bg-red-950/30 ring-2 ring-red-500/50'
          : 'border-neutral-800'
      }`}
    >
      {/* Floating Feedback Popup */}
      {floatingText && (
        <div className="absolute -top-3 right-4 z-30 pointer-events-none animate-float-fade">
          <span className="px-3 py-1 rounded-full font-display font-extrabold text-xs md:text-sm tracking-wide shadow-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-950 border border-yellow-200">
            {floatingText}
          </span>
        </div>
      )}

      {/* Stage Action Prompt (Single concise line) */}
      <div className="text-center mb-3">
        <span className="text-xs font-mono-f1 uppercase tracking-widest text-neutral-400 font-semibold">
          {stage === 1 && `1단계: 휠 너트 풀기 (${nutCount}/4)`}
          {stage === 2 && '2단계: 타이어 타이밍 장착'}
          {stage === 3 && `3단계: 토크 체결 (${arrowIdx}/3)`}
          {stage === 4 && '완료 · 출차'}
        </span>
      </div>

      {/* Main Interactive Controls */}
      <div className="flex flex-col items-center justify-center min-h-[110px]">
        {/* STAGE 1: 4 Nut Buttons */}
        {stage === 1 && (
          <div className="flex items-center justify-center gap-2.5 md:gap-4 flex-wrap">
            {nutSequence.map((k, index) => {
              const isCompleted = nutCount > index;
              const isCurrent = nutCount === index;
              return (
                <button
                  key={`${k}-${index}`}
                  onClick={() => onNutClick(k)}
                  className={`group relative flex flex-col items-center justify-center w-16 h-20 md:w-20 md:h-24 rounded-xl font-display font-bold transition-all duration-100 transform active:scale-95 cursor-pointer shadow select-none ${
                    isCompleted
                      ? 'bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 opacity-70'
                      : isCurrent
                      ? 'bg-neutral-800 border-2 border-yellow-400 text-yellow-300 ring-4 ring-yellow-400/30 scale-105 shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-500 opacity-50'
                  }`}
                >
                  <span className="text-[10px] font-mono-f1 text-neutral-400 absolute top-1 left-1.5">
                    #{index + 1}
                  </span>
                  <span className="text-2xl md:text-3xl uppercase tracking-wider font-extrabold">
                    {isCompleted ? '✔' : k}
                  </span>
                  <span className="text-[10px] font-mono-f1 mt-0.5">
                    {isCompleted ? '완료' : isCurrent ? '지금 입력!' : '대기'}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* STAGE 2: Clean Timing Bar + Spacebar Button */}
        {stage === 2 && (
          <div className="w-full max-w-md flex flex-col items-center gap-3">
            <div className="w-full relative h-7 bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800 flex items-center">
              {/* Perfect Zone */}
              <div
                className="absolute inset-y-0 bg-emerald-500/80 border-x border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)] flex items-center justify-center"
                style={{ left: '38%', width: '24%' }}
              >
                <span className="text-[9px] font-mono-f1 font-extrabold text-neutral-950 uppercase">
                  PERFECT
                </span>
              </div>
              {/* Needle */}
              <div
                className="absolute top-0 bottom-0 w-2.5 bg-white rounded shadow z-10"
                style={{ left: `calc(${needlePos}% - 5px)` }}
              />
            </div>

            <button
              onClick={handleSpacePress}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-neutral-950 font-display font-bold text-lg md:text-xl rounded-xl shadow-lg border border-yellow-300 transform active:scale-95 transition-all cursor-pointer select-none"
            >
              [SPACEBAR] 타이어 장착
            </button>
          </div>
        )}

        {/* STAGE 3: Arrow sequence fastening */}
        {stage === 3 && (
          <div className="w-full flex flex-col items-center gap-3">
            {/* 3 Arrow Badges */}
            <div className="flex items-center gap-3">
              {arrowSequence.map((key, idx) => {
                const isPassed = arrowIdx > idx;
                const isCurrent = arrowIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl font-mono-f1 font-bold text-xl md:text-2xl border transition-all ${
                      isPassed
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                        : isCurrent
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300 ring-4 ring-cyan-400/30 scale-105 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'bg-neutral-900 border-neutral-700 text-neutral-500 opacity-50'
                    }`}
                  >
                    {isPassed ? '✔' : getArrowSymbol(key)}
                  </div>
                );
              })}
            </div>

            {/* Compact D-Pad for touch/mouse */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => onArrowClick('ArrowLeft')}
                className="w-10 h-9 rounded bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-base font-bold text-neutral-200 border border-neutral-700 cursor-pointer"
              >
                ←
              </button>
              <button
                onClick={() => onArrowClick('ArrowUp')}
                className="w-10 h-9 rounded bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-base font-bold text-neutral-200 border border-neutral-700 cursor-pointer"
              >
                ↑
              </button>
              <button
                onClick={() => onArrowClick('ArrowDown')}
                className="w-10 h-9 rounded bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-base font-bold text-neutral-200 border border-neutral-700 cursor-pointer"
              >
                ↓
              </button>
              <button
                onClick={() => onArrowClick('ArrowRight')}
                className="w-10 h-9 rounded bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-base font-bold text-neutral-200 border border-neutral-700 cursor-pointer"
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* STAGE 4: Launching */}
        {stage === 4 && (
          <div className="text-xl md:text-2xl font-display font-bold text-emerald-400 tracking-wider animate-bounce py-2">
            🟢 PIT STOP COMPLETED!
          </div>
        )}
      </div>
    </div>
  );
};
