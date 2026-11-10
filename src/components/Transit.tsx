import React from 'react';

/** Each course is a line. Colours follow a classic transit palette; red stays reserved for conflicts. */
const LINES: Record<string, { bg: string; fg: string }> = {
  'CS 301': { bg: '#0039a6', fg: '#fff' },
  'CS 350': { bg: '#ff6319', fg: '#fff' },
  'CS 405': { bg: '#00933c', fg: '#fff' },
  'CS 210': { bg: '#b933ad', fg: '#fff' },
  'MATH 210': { bg: '#fccc0a', fg: '#111' },
};
const SPARE = [{ bg: '#00add0', fg: '#fff' }, { bg: '#996633', fg: '#fff' }, { bg: '#6cbe45', fg: '#111' }, { bg: '#808183', fg: '#fff' }];
export const line = (code: string) => {
  if (LINES[code]) return LINES[code];
  let h = 0; for (const ch of code) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return SPARE[h % SPARE.length];
};

/** Round route bullet: the course number inside a coloured disc. */
export const Bullet: React.FC<{ code: string; size?: number; hollow?: boolean }> = ({ code, size = 32, hollow }) => {
  const c = line(code);
  const [dept, n] = code.split(' ');
  const num = n ? (dept === 'CS' ? n : dept[0] + n) : code;
  return (
    <span aria-label={code} title={code}
      className="inline-grid place-items-center rounded-full font-extrabold shrink-0 leading-none"
      style={{ width: size, height: size, fontSize: size * (num.length > 3 ? 0.3 : 0.36), background: hollow ? 'transparent' : c.bg, color: hollow ? c.bg : c.fg, boxShadow: hollow ? `inset 0 0 0 ${Math.max(2, size / 12)}px ${c.bg}` : undefined }}>
      {num}
    </span>
  );
};

export const hh = (h: number) => `${String(h).padStart(2, '0')}:00`;

/** Black sign band used as the section header on every page. */
export const Sign: React.FC<{ title: string; note?: string; right?: React.ReactNode }> = ({ title, note, right }) => (
  <div className="band rounded-md px-5 pt-5 pb-4 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-3">
    <div>
      <h1 className="signtext text-[30px] md:text-[40px] leading-none">{title}</h1>
      {note && <p className="text-white/70 mt-2 max-w-[64ch]">{note}</p>}
    </div>
    {right}
  </div>
);
