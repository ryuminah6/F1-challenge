import React, { useState } from 'react';
import { PitRecord, HighScoreRecord } from '../types/game';
import { Trophy, Zap, Clock, RotateCcw, Copy, Check, Sparkles } from 'lucide-react';

interface RoundSummaryModalProps {
  carsServiced: number;
  totalScore: number;
  records: PitRecord[];
  fastestStop: number | null;
  onRestart: () => void;
  highScores: HighScoreRecord[];
}

export const RoundSummaryModal: React.FC<RoundSummaryModalProps> = ({
  carsServiced,
  totalScore,
  records,
  fastestStop,
  onRestart,
  highScores,
}) => {
  const [copied, setCopied] = useState(false);

  // Compute stats
  const totalDuration = records.reduce((acc, r) => acc + r.duration, 0);
  const avgStop = records.length > 0 ? totalDuration / records.length : 0;
  const worldRecordCount = records.filter((r) => r.isWorldRecord).length;
  const purpleCount = records.filter((r) => r.isPurple).length;
  const perfectMounts = records.filter((r) => r.isPerfect).length;

  // Grade classification
  let grade = 'C';
  let gradeTitle = '피트레인 수습생 (Trainee)';
  let gradeColor = 'text-neutral-400 border-neutral-700';

  if (carsServiced >= 18 && fastestStop && fastestStop <= 1.9) {
    grade = 'S+';
    gradeTitle = '전설의 피트 크루 (World Record Legend)';
    gradeColor = 'text-amber-300 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)]';
  } else if (carsServiced >= 14 || (fastestStop && fastestStop <= 2.1)) {
    grade = 'S';
    gradeTitle = '레드불 챔피언급 크루 (Red Bull Grade)';
    gradeColor = 'text-fuchsia-400 border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.4)]';
  } else if (carsServiced >= 10 || (fastestStop && fastestStop <= 2.5)) {
    grade = 'A';
    gradeTitle = '맥라렌 스피드스터 (Pro Crew)';
    gradeColor = 'text-cyan-400 border-cyan-500';
  } else if (carsServiced >= 6) {
    grade = 'B';
    gradeTitle = '숙련된 페라리 미케닉 (Experienced)';
    gradeColor = 'text-yellow-400 border-yellow-500';
  }

  const handleCopy = () => {
    const text = `🏎️ [1분 F1 피트스탑 챌린지 세션 결과]
🏆 완료 차량: ${carsServiced}대
✨ 최종 점수: ${totalScore.toLocaleString()} PTS
⚡ 최고 스톱: ${fastestStop ? fastestStop.toFixed(2) + 's' : '0.00s'}
⏱️ 평균 스톱: ${avgStop.toFixed(2)}s
🎯 퍼펙트 장착: ${perfectMounts}회
🎖️ 최종 랭크: ${grade} (${gradeTitle})
당신도 F1 피트 크루 세계 기록에 도전해보세요!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Banner Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-red-700 via-red-600 to-neutral-900 border-b border-red-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono-f1 uppercase tracking-widest text-red-200 font-bold">
              SESSION FINISHED · 60s EXPIRED
            </span>
            <h2 className="text-2xl font-display font-bold text-white tracking-wide">
              🏁 피트스탑 챌린지 세션 리포트
            </h2>
          </div>
          <div
            className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-display font-extrabold text-2xl ${gradeColor} bg-neutral-950/70`}
          >
            {grade}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Rank highlight & Total Points */}
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="text-amber-400" size={24} />
              <div>
                <span className="text-xs font-mono-f1 text-neutral-400">등급 판정:</span>
                <div className="text-lg font-display font-bold text-neutral-100">
                  {gradeTitle}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono-f1 text-neutral-400 uppercase">최종 획득 스코어</span>
              <div className="text-2xl font-mono-f1 font-extrabold text-amber-400">
                {totalScore.toLocaleString()}
                <span className="text-xs text-neutral-400 ml-1">PTS</span>
              </div>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
              <span className="text-[11px] font-mono-f1 text-neutral-400 uppercase">
                총 완료 차량
              </span>
              <div className="text-2xl font-mono-f1 font-extrabold text-amber-400 mt-1">
                {carsServiced}
                <span className="text-xs font-normal text-neutral-500 ml-1">대</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
              <span className="text-[11px] font-mono-f1 text-neutral-400 uppercase">
                최고 속도
              </span>
              <div className="text-2xl font-mono-f1 font-extrabold text-cyan-400 mt-1">
                {fastestStop ? `${fastestStop.toFixed(2)}s` : '--'}
              </div>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
              <span className="text-[11px] font-mono-f1 text-neutral-400 uppercase">
                평균 스톱 시간
              </span>
              <div className="text-2xl font-mono-f1 font-extrabold text-neutral-200 mt-1">
                {avgStop > 0 ? `${avgStop.toFixed(2)}s` : '--'}
              </div>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
              <span className="text-[11px] font-mono-f1 text-neutral-400 uppercase">
                퍼펙트 장착
              </span>
              <div className="text-2xl font-mono-f1 font-extrabold text-emerald-400 mt-1">
                {perfectMounts}
                <span className="text-xs font-normal text-neutral-500 ml-1">회</span>
              </div>
            </div>
          </div>

          {/* Car-by-car history list */}
          {records.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-f1 text-neutral-400 font-bold uppercase">
                <span>차량별 피트스탑 기록</span>
                <span>정비 시간 / 획득 점수</span>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {records.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 bg-neutral-950/70 rounded-lg border border-neutral-800/80 text-xs font-mono-f1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500">#{i + 1}</span>
                      <span className="font-bold text-neutral-200">{r.team.name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] ${r.toTire.bgBadge}`}>
                        {r.toTire.code}
                      </span>
                      {r.isPerfect && (
                        <span className="px-1 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[9px] border border-emerald-500/50">
                          PERFECT
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {r.isWorldRecord && (
                        <span className="px-1.5 py-0.5 rounded bg-fuchsia-950 text-fuchsia-300 font-bold text-[10px] border border-fuchsia-600">
                          WR
                        </span>
                      )}
                      <span
                        className={`font-bold ${
                          r.duration <= 2.0
                            ? 'text-fuchsia-400'
                            : r.duration <= 2.5
                            ? 'text-cyan-400'
                            : 'text-neutral-300'
                        }`}
                      >
                        {r.duration.toFixed(2)}s
                      </span>
                      <span className="text-neutral-400 text-[10px]">
                        (+{r.pointsEarned}P)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* High Score History */}
          {highScores.length > 0 && (
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <div className="flex items-center justify-between text-xs font-mono-f1 text-neutral-400 font-bold uppercase mb-2">
                <span>🏆 명예의 전당 (BEST CREW RECORDS)</span>
                <span>완료수 / 최고점수</span>
              </div>
              <div className="space-y-1 text-xs font-mono-f1">
                {highScores.slice(0, 3).map((score, idx) => (
                  <div key={idx} className="flex items-center justify-between text-neutral-300 py-1 border-b border-neutral-800/40 last:border-0">
                    <span className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold">#{idx + 1}</span>
                      <span>{score.playerRank}</span>
                      <span className="text-neutral-500">{score.date}</span>
                    </span>
                    <span className="font-bold text-neutral-100">
                      {score.carsServiced}대 · {score.totalScore ? `${score.totalScore.toLocaleString()}P` : `${score.fastestStop.toFixed(2)}s`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={onRestart}
              className="w-full sm:flex-1 py-3.5 bg-red-600 hover:bg-red-500 active:scale-98 text-white font-display font-bold text-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw size={18} />
              <span>다시 도전하기 (단축키 R)</span>
            </button>

            <button
              onClick={handleCopy}
              className="w-full sm:w-auto px-5 py-3.5 bg-neutral-800 hover:bg-neutral-700 active:scale-98 text-neutral-200 font-sans font-medium text-sm rounded-xl border border-neutral-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              <span>{copied ? '복사 완료!' : '기록 복사'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
