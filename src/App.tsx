/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, PitStage, ArrowKey, PitRecord, HighScoreRecord, TireCompound, F1Team } from './types/game';
import { TIRE_COMPOUNDS, F1_TEAMS, ENGINEER_RADIO_QUOTES } from './utils/constants';
import { soundFx } from './utils/audio';
import { PitCarVisualizer } from './components/PitCarVisualizer';
import { StageControls } from './components/StageControls';
import { TelemetryHUD } from './components/TelemetryHUD';
import { RaceEngineerRadio } from './components/RaceEngineerRadio';
import { RoundSummaryModal } from './components/RoundSummaryModal';
import { Flag, Play, HelpCircle, Flame } from 'lucide-react';

const ARROW_POOL: ArrowKey[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const NUT_KEY_POOL = ['a', 's', 'd', 'f'];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function App() {
  // Game lifecycle
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [countdownCount, setCountdownCount] = useState<number>(-1);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [timeBonusNotice, setTimeBonusNotice] = useState<number | null>(null);
  const [carsServiced, setCarsServiced] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [fastestStop, setFastestStop] = useState<number | null>(null);
  const [combo, setCombo] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showRules, setShowRules] = useState<boolean>(false);

  // Addictive Game Feel / Juice states
  const [feverGauge, setFeverGauge] = useState<number>(0);
  const [isFever, setIsFever] = useState<boolean>(false);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [floatingText, setFloatingText] = useState<string | null>(null);
  const [lastMountWasPerfect, setLastMountWasPerfect] = useState<boolean>(false);

  // Pit stop state for active car
  const [stage, setStage] = useState<PitStage>(1);
  const [nutCount, setNutCount] = useState<number>(0);
  const [nutSequence, setNutSequence] = useState<string[]>(['a', 's', 'd', 'f']);
  const [arrowSequence, setArrowSequence] = useState<ArrowKey[]>(['ArrowUp', 'ArrowRight', 'ArrowDown']);
  const [arrowIdx, setArrowIdx] = useState<number>(0);

  // Active Car & Team info
  const [currentTeam, setCurrentTeam] = useState<F1Team>(F1_TEAMS[0]);
  const [fromTire, setFromTire] = useState<TireCompound>(TIRE_COMPOUNDS.SOFT);
  const [toTire, setToTire] = useState<TireCompound>(TIRE_COMPOUNDS.MEDIUM);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [carArriving, setCarArriving] = useState<boolean>(false);
  const [activeKeyError, setActiveKeyError] = useState<boolean>(false);
  const [jammed, setJammed] = useState<boolean>(false);
  const [isMistakeFreeCar, setIsMistakeFreeCar] = useState<boolean>(true);

  // Stop Timer
  const [currentStopTime, setCurrentStopTime] = useState<number>(0);
  const stopStartTimeRef = useRef<number>(0);
  const stopwatchIntervalRef = useRef<number | null>(null);

  // Radio commentary
  const [radioMsg, setRadioMsg] = useState<string>(
    '🏎️ "피트 크루 전원 대기! 시작 버튼을 눌러 1분 챌린지를 시작하세요!"'
  );

  // Round summary & storage
  const [records, setRecords] = useState<PitRecord[]>([]);
  const [highScores, setHighScores] = useState<HighScoreRecord[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('f1_pit_high_scores');
      if (saved) {
        setHighScores(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveHighScore = useCallback((cars: number, best: number | null, score: number) => {
    if (cars === 0 && !best) return;
    const newRecord: HighScoreRecord = {
      date: new Date().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      carsServiced: cars,
      fastestStop: best || 9.99,
      accuracy: 100,
      playerRank: cars >= 15 ? 'World Record Grade' : cars >= 10 ? 'Pro Mechanic' : 'Junior Pit Crew',
      totalScore: score,
    };

    setHighScores((prev) => {
      const updated = [newRecord, ...prev].slice(0, 5);
      try {
        localStorage.setItem('f1_pit_high_scores', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const triggerScreenShake = () => {
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 160);
  };

  const showFloatingPopup = (text: string) => {
    setFloatingText(text);
    setTimeout(() => setFloatingText(null), 800);
  };

  const addTimeBonus = useCallback((seconds: number, reason: string) => {
    setTimeLeft((prev) => Math.min(prev + seconds, 99));
    setTimeBonusNotice(seconds);
    soundFx.playTimeBonus();
    showFloatingPopup(`+${seconds}s! (${reason})`);
    setTimeout(() => setTimeBonusNotice(null), 1200);
  }, []);

  const boostFever = useCallback((amount: number) => {
    setFeverGauge((prev) => {
      const next = Math.min(prev + amount, 100);
      if (next >= 100 && !isFever) {
        setIsFever(true);
        soundFx.playFeverSurge();
        showFloatingPopup('⚡ FEVER x2!');
      }
      return next;
    });
  }, [isFever]);

  const generateArrowSequence = () => {
    const seq: ArrowKey[] = [];
    for (let i = 0; i < 3; i++) {
      seq.push(ARROW_POOL[Math.floor(Math.random() * ARROW_POOL.length)]);
    }
    return seq;
  };

  const generateNutSequence = () => {
    return shuffleArray(NUT_KEY_POOL);
  };

  const spawnCar = useCallback(() => {
    const randomTeam = F1_TEAMS[Math.floor(Math.random() * F1_TEAMS.length)];
    const compoundKeys = Object.keys(TIRE_COMPOUNDS);
    const randomFromKey = compoundKeys[Math.floor(Math.random() * compoundKeys.length)];
    let randomToKey = compoundKeys[Math.floor(Math.random() * compoundKeys.length)];
    if (randomToKey === randomFromKey) {
      randomToKey = randomFromKey === 'SOFT' ? 'MEDIUM' : 'HARD';
    }

    setCurrentTeam(randomTeam);
    setFromTire(TIRE_COMPOUNDS[randomFromKey]);
    setToTire(TIRE_COMPOUNDS[randomToKey]);
    setStage(1);
    setNutCount(0);
    setNutSequence(generateNutSequence());
    setArrowSequence(generateArrowSequence());
    setArrowIdx(0);
    setIsLaunching(false);
    setCarArriving(true);
    setJammed(false);
    setIsMistakeFreeCar(true);
    setLastMountWasPerfect(false);

    setTimeout(() => setCarArriving(false), 300);

    stopStartTimeRef.current = performance.now();
    setCurrentStopTime(0);

    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current);
    }
    stopwatchIntervalRef.current = window.setInterval(() => {
      const elapsed = (performance.now() - stopStartTimeRef.current) / 1000;
      setCurrentStopTime(elapsed);
    }, 30);
  }, []);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundFx.enabled = newState;
  };

  const triggerPenalty = () => {
    soundFx.playErrorBuzz();
    setActiveKeyError(true);
    setJammed(true);
    setIsMistakeFreeCar(false);
    setCombo(1);
    setFeverGauge((prev) => Math.max(0, prev - 30));
    setIsFever(false);

    triggerScreenShake();
    showFloatingPopup('❌ MISCLICK!');

    const penaltyQuotes = ENGINEER_RADIO_QUOTES.jammed;
    setRadioMsg(penaltyQuotes[Math.floor(Math.random() * penaltyQuotes.length)]);

    setTimeout(() => setActiveKeyError(false), 200);
    setTimeout(() => setJammed(false), 500);
  };

  const finishCurrentCar = useCallback(() => {
    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current);
      stopwatchIntervalRef.current = null;
    }

    const duration = (performance.now() - stopStartTimeRef.current) / 1000;
    setCurrentStopTime(duration);
    setStage(4);
    setIsLaunching(true);
    soundFx.playCarLaunch();
    triggerScreenShake();

    const isWorldRec = duration <= 1.82;
    const isPurple = duration <= 2.2;

    if (isWorldRec) {
      addTimeBonus(2.5, 'WORLD RECORD!');
    } else if (isPurple) {
      addTimeBonus(1.5, 'PURPLE STOP!');
    }

    const basePts = 1000;
    const speedBonus = Math.max(0, Math.floor((3.5 - duration) * 800));
    const perfectBonus = lastMountWasPerfect ? 500 : 0;
    const currentMultiplier = (isFever ? 2 : 1) * (combo >= 4 ? 2 : combo >= 2 ? 1.5 : 1);
    const earnedPoints = Math.floor((basePts + speedBonus + perfectBonus) * currentMultiplier);

    setTotalScore((prev) => prev + earnedPoints);
    setFastestStop((prev) => (prev === null || duration < prev ? duration : prev));

    if (isMistakeFreeCar) {
      setCombo((prev) => Math.min(prev + 1, 8));
      boostFever(25);
    }

    const newRecord: PitRecord = {
      carNumber: carsServiced + 1,
      team: currentTeam,
      fromTire,
      toTire,
      duration,
      isWorldRecord: isWorldRec,
      isPurple,
      isPerfect: lastMountWasPerfect,
      penalties: isMistakeFreeCar ? 0 : 1,
      pointsEarned: earnedPoints,
    };
    setRecords((prev) => [...prev, newRecord]);
    setCarsServiced((prev) => prev + 1);

    soundFx.playRadioBeep();
    if (isWorldRec) {
      setRadioMsg(ENGINEER_RADIO_QUOTES.worldRecord[0]);
    } else if (isPurple) {
      setRadioMsg(ENGINEER_RADIO_QUOTES.fast[0]);
    } else {
      setRadioMsg(ENGINEER_RADIO_QUOTES.good[0]);
    }

    setTimeout(() => {
      setGameState((currentState) => {
        if (currentState === 'PLAYING') {
          spawnCar();
        }
        return currentState;
      });
    }, 400);
  }, [
    carsServiced,
    currentTeam,
    fromTire,
    toTire,
    isMistakeFreeCar,
    lastMountWasPerfect,
    isFever,
    combo,
    spawnCar,
    addTimeBonus,
    boostFever,
  ]);

  const handleNutAction = (key: string) => {
    if (gameState !== 'PLAYING' || stage !== 1) return;

    const expectedKey = nutSequence[nutCount];
    if (key.toLowerCase() === expectedKey) {
      const nextNut = nutCount + 1;
      setNutCount(nextNut);
      soundFx.playWheelGunNut(nextNut, isFever);
      triggerScreenShake();
      boostFever(8);

      if (nextNut === 4) {
        setStage(2);
        showFloatingPopup('🔓 TIRE OFF!');
      }
    } else {
      triggerPenalty();
    }
  };

  const handleSpaceAction = (isPerfect: boolean) => {
    if (gameState !== 'PLAYING' || stage !== 2) return;

    setLastMountWasPerfect(isPerfect);
    soundFx.playTireMount(isPerfect);
    triggerScreenShake();

    if (isPerfect) {
      addTimeBonus(1.5, 'PERFECT!');
      boostFever(35);
      showFloatingPopup('🎯 PERFECT! +1.5s');
    } else {
      boostFever(10);
      showFloatingPopup('GOOD!');
    }

    setStage(3);
  };

  const handleArrowAction = (key: ArrowKey) => {
    if (gameState !== 'PLAYING' || stage !== 3) return;

    const expectedKey = arrowSequence[arrowIdx];
    if (key === expectedKey) {
      const nextIdx = arrowIdx + 1;
      setArrowIdx(nextIdx);
      soundFx.playFastenTorque(nextIdx, isFever);
      triggerScreenShake();
      boostFever(12);

      if (nextIdx === 3) {
        showFloatingPopup('🔒 LOCKED!');
        finishCurrentCar();
      }
    } else {
      triggerPenalty();
    }
  };

  const startChallenge = useCallback(() => {
    setTimeLeft(60);
    setTimeBonusNotice(null);
    setCarsServiced(0);
    setTotalScore(0);
    setFastestStop(null);
    setCombo(1);
    setFeverGauge(0);
    setIsFever(false);
    setRecords([]);
    setGameState('COUNTDOWN');
    setCountdownCount(0);
    setRadioMsg('🔴 "포메이션 랩 완료. 스타트 라이트 점등..."');

    let count = 0;
    const lightInterval = setInterval(() => {
      count++;
      setCountdownCount(count);
      soundFx.playCountdownLight(count === 5);

      if (count === 5) {
        clearInterval(lightInterval);

        const randomOutDelay = 500 + Math.random() * 400;
        setTimeout(() => {
          soundFx.playCountdownLight(true);
          setCountdownCount(-1);
          setGameState('PLAYING');
          setRadioMsg('🟢 "LIGHTS OUT AND AWAY WE GO! 피트인!"');
          spawnCar();
        }, randomOutDelay);
      }
    }, 800);
  }, [spawnCar]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r' && gameState !== 'COUNTDOWN') {
        startChallenge();
        return;
      }

      if (gameState !== 'PLAYING') return;

      const key = e.key.toLowerCase();

      if (stage === 1) {
        if (['a', 's', 'd', 'f'].includes(key)) {
          e.preventDefault();
          handleNutAction(key);
        }
      } else if (stage === 2) {
        if (e.code === 'Space' || key === ' ') {
          e.preventDefault();
          const isPerfect = Math.random() > 0.35;
          handleSpaceAction(isPerfect);
        }
      } else if (stage === 3) {
        let arrow: ArrowKey | null = null;
        if (e.key === 'ArrowUp' || key === 'w') arrow = 'ArrowUp';
        else if (e.key === 'ArrowDown' || key === 's') arrow = 'ArrowDown';
        else if (e.key === 'ArrowLeft' || key === 'a') arrow = 'ArrowLeft';
        else if (e.key === 'ArrowRight' || key === 'd') arrow = 'ArrowRight';

        if (arrow) {
          e.preventDefault();
          handleArrowAction(arrow);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, stage, nutCount, nutSequence, arrowIdx, arrowSequence, finishCurrentCar, startChallenge]);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('FINISHED');
          if (stopwatchIntervalRef.current) {
            clearInterval(stopwatchIntervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });

      setFeverGauge((prev) => {
        const next = Math.max(0, prev - 3);
        if (next === 0) setIsFever(false);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'FINISHED') {
      saveHighScore(carsServiced, fastestStop, totalScore);
    }
  }, [gameState, carsServiced, fastestStop, totalScore, saveHighScore]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-between">
      {/* Clean Header Bar */}
      <header className="w-full border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-red-600 rounded-sm" />
            <h1 className="text-base md:text-lg font-display font-extrabold tracking-wide text-white">
              🏎️ F1 PIT STOP 1-MIN CHALLENGE
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRules(true)}
              className="text-xs font-mono-f1 text-neutral-400 hover:text-neutral-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle size={14} />
              <span className="hidden sm:inline">규칙 (Rules)</span>
            </button>

            {gameState === 'IDLE' && (
              <button
                onClick={startChallenge}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-display font-bold text-xs rounded-lg shadow transition-all flex items-center gap-1 cursor-pointer"
              >
                <Play size={13} />
                <span>시작</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Single-Glance Game Area */}
      <main
        className={`w-full max-w-3xl px-4 py-4 flex flex-col gap-3.5 flex-1 justify-center transition-transform ${
          isScreenShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Sleek Horizontal Telemetry HUD */}
        <TelemetryHUD
          timeLeft={timeLeft}
          timeBonusNotice={timeBonusNotice}
          carsServiced={carsServiced}
          totalScore={totalScore}
          currentStopTime={currentStopTime}
          fastestStop={fastestStop}
          combo={combo}
          isFever={isFever}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onRestart={startChallenge}
          isGameActive={gameState === 'PLAYING'}
        />

        {/* Clear Car & Wheel Visualizer */}
        <PitCarVisualizer
          team={currentTeam}
          fromTire={fromTire}
          toTire={toTire}
          stage={stage}
          nutCount={nutCount}
          nutSequence={nutSequence}
          arrowIdx={arrowIdx}
          arrowSequence={arrowSequence}
          isLaunching={isLaunching}
          carArriving={carArriving}
          jammed={jammed}
          activeKeyError={activeKeyError}
          countdownCount={countdownCount}
        />

        {/* Focused Interactive Action Control */}
        {gameState === 'PLAYING' ? (
          <StageControls
            stage={stage}
            nutCount={nutCount}
            nutSequence={nutSequence}
            arrowSequence={arrowSequence}
            arrowIdx={arrowIdx}
            onNutClick={handleNutAction}
            onSpaceClick={handleSpaceAction}
            onArrowClick={handleArrowAction}
            activeKeyError={activeKeyError}
            isFever={isFever}
            floatingText={floatingText}
          />
        ) : gameState === 'IDLE' ? (
          <div className="w-full bg-neutral-900/90 rounded-2xl border border-neutral-800 p-6 text-center flex flex-col items-center justify-center gap-4 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-neutral-100">
              F1 1분 피트스탑 챌린지
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 max-w-md">
              60초 동안 정확하고 신속하게 타이어를 교체하세요! 2.2초 미만 기록 시 <strong>+1.5초~2.5초 시간 연장</strong> 보너스가 주어집니다.
            </p>
            <button
              onClick={startChallenge}
              className="px-8 py-3.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-display font-bold text-lg rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play size={20} />
              <span>챌린지 시작 (START 60s)</span>
            </button>
          </div>
        ) : null}

        {/* Compact Radio Message Bar */}
        <RaceEngineerRadio message={radioMsg} isUrgent={activeKeyError || jammed} />
      </main>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="text-base font-display font-bold text-neutral-100 flex items-center gap-1.5">
                <Flag className="text-red-500" size={16} />
                <span>조작 가이드</span>
              </h3>
              <button
                onClick={() => setShowRules(false)}
                className="text-neutral-400 hover:text-white text-xs font-mono-f1 cursor-pointer"
              >
                닫기 ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-sans text-neutral-300">
              <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                <strong className="text-yellow-400 font-mono-f1">1. 너트 풀기</strong>
                <p>화면에 뜨는 4개 키(A, S, D, F)를 순서대로 빠르게 누르기</p>
              </div>

              <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                <strong className="text-amber-400 font-mono-f1">2. 타이어 장착</strong>
                <p>게이지 바늘이 초록색에 올 때 <strong>[Spacebar]</strong> 탭 (+1.5초 연장)</p>
              </div>

              <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                <strong className="text-cyan-400 font-mono-f1">3. 토크 체결</strong>
                <p>제시된 3개 방향키 순서대로 누르면 완전 체결 및 출차</p>
              </div>

              <div className="text-[11px] text-neutral-400 font-mono-f1">
                💡 언제든 <strong>[R] 키</strong>를 누르면 0.1초 만에 즉시 재시작할 수 있습니다.
              </div>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-mono-f1 text-xs rounded-xl border border-neutral-700 font-semibold cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* Finished Summary Modal */}
      {gameState === 'FINISHED' && (
        <RoundSummaryModal
          carsServiced={carsServiced}
          totalScore={totalScore}
          records={records}
          fastestStop={fastestStop}
          onRestart={startChallenge}
          highScores={highScores}
        />
      )}

      {/* Compact Quiet Footer */}
      <footer className="w-full py-2 px-4 text-center text-[11px] font-mono-f1 text-neutral-600">
        F1 Pit Stop Challenge · Instant Restart: [R]
      </footer>
    </div>
  );
}
