import { F1Team, TireCompound } from '../types/game';

export const TIRE_COMPOUNDS: Record<string, TireCompound> = {
  SOFT: {
    name: 'Soft',
    code: 'S',
    color: '#EF4444',
    border: 'border-red-500',
    bgBadge: 'bg-red-500 text-white',
    labelKo: '소프트 (빨강)',
  },
  MEDIUM: {
    name: 'Medium',
    code: 'M',
    color: '#EAB308',
    border: 'border-yellow-400',
    bgBadge: 'bg-yellow-400 text-neutral-950 font-bold',
    labelKo: '미디엄 (노랑)',
  },
  HARD: {
    name: 'Hard',
    code: 'H',
    color: '#F8FAFC',
    border: 'border-slate-100',
    bgBadge: 'bg-slate-100 text-neutral-900 font-bold',
    labelKo: '하드 (화이트)',
  },
  INTER: {
    name: 'Inter',
    code: 'I',
    color: '#10B981',
    border: 'border-emerald-500',
    bgBadge: 'bg-emerald-500 text-white',
    labelKo: '인터미디어트 (초록)',
  },
  WET: {
    name: 'Wet',
    code: 'W',
    color: '#3B82F6',
    border: 'border-blue-500',
    bgBadge: 'bg-blue-500 text-white',
    labelKo: '웨트 (파랑)',
  },
};

export const F1_TEAMS: F1Team[] = [
  {
    id: 'rbr',
    name: 'Oracle Red Bull Racing',
    driver: 'Max Verstappen',
    carColor: '#06173d',
    accentColor: '#E10600',
    number: 1,
  },
  {
    id: 'ferrari',
    name: 'Scuderia Ferrari HP',
    driver: 'Charles Leclerc',
    carColor: '#C00000',
    accentColor: '#FFD700',
    number: 16,
  },
  {
    id: 'mclaren',
    name: 'McLaren Formula 1 Team',
    driver: 'Lando Norris',
    carColor: '#FF8000',
    accentColor: '#1E1E1E',
    number: 4,
  },
  {
    id: 'mercedes',
    name: 'Mercedes-AMG PETRONAS',
    driver: 'Lewis Hamilton',
    carColor: '#2B2B2B',
    accentColor: '#00D2BE',
    number: 44,
  },
  {
    id: 'aston',
    name: 'Aston Martin Aramco',
    driver: 'Fernando Alonso',
    carColor: '#00594F',
    accentColor: '#CEDC00',
    number: 14,
  },
];

export const ENGINEER_RADIO_QUOTES = {
  worldRecord: [
    '📻 "UNBELIEVABLE! 1.82초 미만! 역대 F1 월드 레코드 경신!"',
    '📻 "박스 박스! 레드불 전성기급 기적의 1초대 피트스탑!"',
    '📻 "Holy smokes, fastest pit stop on earth! GO GO GO!"',
  ],
  fast: [
    '📻 "완벽한 타이어 교체! 퍼플 섹터급 스피드입니다!"',
    '📻 "2초대 초반 완료! 피트레인 델타 그린 유지 중!"',
    '📻 "Great stop boys, absolute clockwork precision!"',
  ],
  good: [
    '📻 "체결 토크 정상 확인. 차분하게 잘 해냈습니다, 다음 차량 인입!"',
    '📻 "안정적인 릴리즈 완료! 페이스 유지하세요!"',
    '📻 "Solid pit stop, tires fitted and confirmed."',
  ],
  jammed: [
    '📻 "너트 헛돌림 발생! 볼트 각도 다시 맞추고 신속히 체결!"',
    '📻 "휠 건 재정렬! 0.5초 손실, 침착하게 다시 체결하세요!"',
  ],
};
