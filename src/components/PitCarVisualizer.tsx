import React from 'react';
import { F1Team, TireCompound, PitStage, ArrowKey } from '../types/game';

interface PitCarVisualizerProps {
  team: F1Team;
  fromTire: TireCompound;
  toTire: TireCompound;
  stage: PitStage;
  nutCount: number; // 0 to 4
  nutSequence: string[]; // e.g. ['d', 'a', 's', 'f']
  arrowIdx: number; // 0 to 3
  arrowSequence: ArrowKey[];
  isLaunching: boolean;
  carArriving: boolean;
  jammed: boolean;
  activeKeyError: boolean;
  countdownCount: number; // -1 if not in countdown
}

export const PitCarVisualizer: React.FC<PitCarVisualizerProps> = ({
  team,
  fromTire,
  toTire,
  stage,
  nutCount,
  nutSequence,
  arrowIdx,
  isLaunching,
  carArriving,
  jammed,
  activeKeyError,
  countdownCount,
}) => {
  const currentCompound = stage >= 2 ? toTire : fromTire;

  // Calculate dynamic physical offset of active wheel
  let tireTranslateX = 0;
  let isTireWobbling = false;

  if (stage === 1) {
    if (nutCount === 1) {
      tireTranslateX = -12;
      isTireWobbling = true;
    } else if (nutCount === 2) {
      tireTranslateX = -24;
      isTireWobbling = true;
    } else if (nutCount === 3) {
      tireTranslateX = -36;
      isTireWobbling = true;
    } else if (nutCount === 4) {
      tireTranslateX = -48;
      isTireWobbling = true;
    }
  } else if (stage === 2) {
    tireTranslateX = -20;
  } else if (stage === 3) {
    if (arrowIdx === 0) tireTranslateX = -16;
    else if (arrowIdx === 1) tireTranslateX = -8;
    else if (arrowIdx === 2) tireTranslateX = -3;
    else tireTranslateX = 0;
  }

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border transition-all duration-200 f1-carbon-bg ${
        activeKeyError || jammed
          ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)] ring-2 ring-red-500/40'
          : 'border-neutral-800 shadow-xl'
      }`}
    >
      {/* Pit Lane Asphalt */}
      <div className="absolute inset-0 pit-asphalt opacity-90" />

      {/* Top Header Bar: Clean Team & Strategy Info + Built-in Gantry Lights */}
      <div className="relative z-10 flex items-center justify-between px-4 py-2 bg-neutral-900/90 border-b border-neutral-800 backdrop-blur-sm">
        {/* Team & Driver */}
        <div className="flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 rounded shadow-sm"
            style={{
              backgroundColor: team.carColor,
              border: `2px solid ${team.accentColor}`,
            }}
          />
          <span className="text-sm font-display font-bold text-neutral-100">
            {team.name}
          </span>
          <span className="text-xs font-mono-f1 text-neutral-400">
            #{team.number}
          </span>
        </div>

        {/* Integrated Gantry Lights or Pit Status */}
        {countdownCount >= 0 ? (
          <div className="flex items-center gap-2 px-3 py-1 bg-neutral-950 rounded-lg border border-neutral-800">
            {[1, 2, 3, 4, 5].map((lightNum) => {
              const isLit = countdownCount >= lightNum;
              return (
                <div
                  key={lightNum}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    isLit
                      ? 'bg-red-600 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.9)] ring-1 ring-red-400'
                      : 'bg-neutral-800 border-neutral-700 opacity-40'
                  }`}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {stage === 4 ? (
              <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-400 font-mono-f1 text-xs font-bold animate-pulse">
                🟢 GO GO GO!
              </span>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-mono-f1">
                <span className="text-neutral-400 font-semibold">타이어:</span>
                <span className={`px-2 py-0.2 rounded text-[11px] font-bold ${fromTire.bgBadge}`}>
                  {fromTire.code}
                </span>
                <span className="text-neutral-500">➜</span>
                <span className={`px-2 py-0.2 rounded text-[11px] font-bold ${toTire.bgBadge}`}>
                  {toTire.code}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Car Illustration View */}
      <div className="relative z-10 py-4 px-3 md:px-6 flex items-center justify-center min-h-[220px] md:min-h-[240px]">
        <div
          className={`relative w-full max-w-3xl transition-transform duration-200 ${
            isLaunching
              ? 'animate-car-launch'
              : carArriving
              ? 'animate-car-arrive'
              : ''
          }`}
        >
          <svg
            viewBox="0 0 680 220"
            className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="brakeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff4500" stopOpacity="0.9" />
                <stop offset="65%" stopColor="#b91c1c" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#1f2937" stopOpacity="0.9" />
              </radialGradient>
            </defs>

            {/* Asphalt Ground Shadow */}
            <ellipse cx="340" cy="190" rx="300" ry="14" fill="black" fillOpacity="0.65" />

            {/* Background Wheels */}
            <g transform="translate(515, 142)">
              <rect x="-18" y="-36" width="36" height="48" rx="8" fill="#111318" stroke="#334155" strokeWidth="2" />
              <ellipse cx="0" cy="-12" rx="14" ry="20" fill="#090a0f" stroke={fromTire.color} strokeWidth="3" />
            </g>
            <g transform="translate(130, 142)">
              <rect x="-20" y="-38" width="40" height="50" rx="8" fill="#111318" stroke="#334155" strokeWidth="2" />
              <ellipse cx="0" cy="-13" rx="16" ry="22" fill="#090a0f" stroke={fromTire.color} strokeWidth="3" />
            </g>

            {/* Rear Wing */}
            <g id="rear-wing">
              <path d="M40 70 L95 65 L88 175 L35 175 Z" fill="#0f1117" stroke="#334155" strokeWidth="1.5" />
              <rect x="42" y="70" width="12" height="100" fill={team.carColor} />
              <rect x="52" y="75" width="55" height="14" rx="3" fill="#1e293b" />
              <rect x="50" y="93" width="57" height="10" rx="2" fill={team.accentColor} />
              <text x="56" y="86" fill="#ffffff" fontSize="9" fontFamily="Chakra Petch" fontWeight="bold">
                DRS
              </text>
            </g>

            {/* Shark Fin & Engine Airbox Intake */}
            <path
              d="M100 160 L180 140 L260 85 L285 70 L305 72 L310 92 L280 115 L220 155 Z"
              fill={team.carColor}
            />
            <ellipse cx="295" cy="80" rx="9" ry="12" fill="#0a0a0d" stroke="#475569" strokeWidth="1.5" />

            {/* Main Chassis & Sidepod */}
            <path
              d="M85 175 L150 170 L240 148 L350 135 L480 155 L580 168 L620 175 L625 182 L80 182 Z"
              fill={team.carColor}
            />
            <path
              d="M210 150 L360 142 L420 160 L210 172 Z"
              fill={team.accentColor}
              fillOpacity="0.9"
            />

            {/* Driver Cockpit, Halo & Helmet */}
            <g id="cockpit">
              <ellipse cx="330" cy="120" rx="35" ry="15" fill="#090a0f" />
              <circle cx="325" cy="115" r="13" fill={team.accentColor} />
              <path d="M328 112 Q 338 112 336 118 Q 328 118 328 112 Z" fill="#0f172a" />
              <path
                d="M305 118 C305 98, 360 98, 365 118"
                stroke="#cbd5e1"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path d="M335 102 L335 125" stroke="#94a3b8" strokeWidth="4" />
            </g>

            {/* Racing Number */}
            <text
              x="200"
              y="130"
              fill="#ffffff"
              fontFamily="Chakra Petch, sans-serif"
              fontWeight="bold"
              fontSize="24"
              fontStyle="italic"
            >
              {team.number}
            </text>

            {/* Front Wing */}
            <g id="front-wing">
              <path d="M480 152 L610 168 L645 174 L610 180 L480 176 Z" fill={team.carColor} />
              <path d="M580 174 L665 174 L660 186 L575 186 Z" fill="#0f1117" stroke="#334155" strokeWidth="1.5" />
              <rect x="585" y="169" width="65" height="4" rx="1.5" fill={team.accentColor} />
              <rect x="660" y="158" width="6" height="32" rx="2" fill={team.carColor} />
            </g>

            {/* Foreground Front Wheel */}
            <g transform="translate(530, 178)">
              <rect x="-24" y="-30" width="48" height="48" rx="8" fill="#111827" stroke="#374151" strokeWidth="2" />
              <circle cx="0" cy="-6" r="22" fill="#090a0f" stroke={fromTire.color} strokeWidth="4" />
              <circle cx="0" cy="-6" r="10" fill="#334155" />
            </g>

            {/* ACTIVE REAR-LEFT WHEEL HUB */}
            <g transform="translate(135, 178)">
              {/* Brake Rotor Disc (Visible as wheel loosens) */}
              <circle
                cx="0"
                cy="-6"
                r="26"
                fill="url(#brakeGlow)"
                stroke="#f97316"
                strokeWidth="2"
                className={nutCount >= 2 ? 'animate-pulse' : ''}
              />
              <circle cx="0" cy="-6" r="18" fill="none" stroke="#78350f" strokeWidth="2" strokeDasharray="3 3" />
              {/* Axle center spindle shaft */}
              <rect x="-6" y="-12" width="12" height="12" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
            </g>

            {/* The Moving Active Tire & Wheel Rim */}
            <g
              transform={`translate(${135 + tireTranslateX}, 178)`}
              style={{
                transition: 'transform 0.16s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className={`${isTireWobbling ? 'animate-wheel-wobble' : ''} ${
                stage === 2 ? 'animate-tire-slam' : ''
              }`}
            >
              <rect
                x="-32"
                y="-38"
                width="64"
                height="64"
                rx="12"
                fill="#121319"
                stroke="#1f242e"
                strokeWidth="2"
                className="drop-shadow-lg"
              />

              {/* Colored Compound Stripe Circle */}
              <circle
                cx="0"
                cy="-6"
                r="27"
                fill="#0a0a0f"
                stroke={currentCompound.color}
                strokeWidth="5"
                className={stage === 4 ? 'animate-spin' : ''}
                style={{ animationDuration: '0.4s' }}
              />

              <circle cx="0" cy="-6" r="16" fill="#1e2430" stroke="#475569" strokeWidth="2" />
              <circle cx="0" cy="-6" r="8" fill="#0f172a" />

              {/* STAGE 1: The 4 Wheel Nuts (A, S, D, F in randomized order) */}
              {stage === 1 && (
                <g id="wheel-nuts">
                  {[
                    { cx: 0, cy: -18 },
                    { cx: 12, cy: -6 },
                    { cx: 0, cy: 6 },
                    { cx: -12, cy: -6 },
                  ].map((pos, idx) => {
                    const keyChar = nutSequence[idx] ? nutSequence[idx].toUpperCase() : '';
                    const isRemoved = nutCount > idx;
                    const isCurrentTarget = nutCount === idx;

                    if (isRemoved) {
                      return (
                        <circle key={idx} cx={pos.cx} cy={pos.cy} r="4" fill="#090a0f" stroke="#334155" strokeWidth="1" />
                      );
                    }

                    return (
                      <g key={idx} className={isCurrentTarget ? 'animate-pulse' : ''}>
                        <circle
                          cx={pos.cx}
                          cy={pos.cy}
                          r={isCurrentTarget ? 6.5 : 5}
                          fill={isCurrentTarget ? '#f59e0b' : '#64748b'}
                          stroke={isCurrentTarget ? '#fef08a' : '#cbd5e1'}
                          strokeWidth={isCurrentTarget ? 2 : 1}
                        />
                        <text
                          x={pos.cx}
                          y={pos.cy + 3}
                          fill={isCurrentTarget ? '#000000' : '#ffffff'}
                          fontSize="7"
                          fontFamily="Chakra Petch"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {keyChar}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* STAGE 3: Torque Fastening Pins */}
              {stage === 3 && (
                <g id="torque-bolts">
                  {[
                    { cx: 0, cy: -15 },
                    { cx: 10, cy: 2 },
                    { cx: -10, cy: 2 },
                  ].map((pin, pIdx) => {
                    const isLocked = arrowIdx > pIdx;
                    const isTarget = arrowIdx === pIdx;
                    return (
                      <g key={pIdx}>
                        <circle
                          cx={pin.cx}
                          cy={pin.cy}
                          r={isTarget ? 5.5 : 4.5}
                          fill={isLocked ? '#10b981' : isTarget ? '#06b6d4' : '#334155'}
                          stroke={isLocked ? '#a7f3d0' : isTarget ? '#67e8f9' : '#64748b'}
                          strokeWidth="1.5"
                        />
                        <text
                          x={pin.cx}
                          y={pin.cy + 2.5}
                          fill={isLocked || isTarget ? '#ffffff' : '#94a3b8'}
                          fontSize="6"
                          fontFamily="Chakra Petch"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {isLocked ? '✔' : pIdx + 1}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* STAGE 4: Release Green Glow */}
              {stage === 4 && (
                <circle cx="0" cy="-6" r="10" fill="#10b981" stroke="#34d399" strokeWidth="2" className="animate-ping" />
              )}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
