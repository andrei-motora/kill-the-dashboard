import { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function I({ children, size = 16, ...props }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      {...props}
    >{children}</svg>
  );
}

export function LogoMark({ size = 28, color = "#0ea5e9", glow = true }: { size?: number; color?: string; glow?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id="lm-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <filter id="lm-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path
        d="M16 2.5 L28 6.5 V15.2 C28 22.4 22.6 27.6 16 29.5 C9.4 27.6 4 22.4 4 15.2 V6.5 Z"
        fill="rgba(14,165,233,0.08)"
        stroke="url(#lm-grad)"
        strokeWidth="1.6"
      />
      <path
        d="M17.6 7.4 L9.8 17.2 H14.6 L13 24.8 L22.6 13.4 H17.4 Z"
        fill={color}
        filter={glow ? "url(#lm-glow)" : undefined}
      />
    </svg>
  );
}

export function SparklesIcon(p: IconProps) {
  return <I {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /><circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" /></I>;
}

export function SettingsIcon(p: IconProps) {
  return <I {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></I>;
}

export function SendIcon(p: IconProps) {
  return <I {...p}><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9 22 2Z"/></I>;
}

export function SearchIcon(p: IconProps) {
  return <I {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></I>;
}

export function TrendUpIcon(p: IconProps) {
  return <I {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></I>;
}

export function TrendDownIcon(p: IconProps) {
  return <I {...p}><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></I>;
}

export function GlobeIcon(p: IconProps) {
  return <I {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18a13 13 0 0 1 0-18Z"/></I>;
}

export function DatabaseIcon(p: IconProps) {
  return <I {...p}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></I>;
}

export function ShieldBotIcon(p: IconProps) {
  return <I {...p}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z"/><circle cx="12" cy="12" r="2.4"/><path d="M12 9.6V8M9.6 12H8M14.4 12H16M12 14.4V16"/></I>;
}

export function UserDotIcon(p: IconProps) {
  return <I {...p}><circle cx="12" cy="8" r="3.4"/><path d="M5 21a7 7 0 0 1 14 0"/></I>;
}

export function KeyIcon(p: IconProps) {
  return <I {...p}><circle cx="7.5" cy="15.5" r="3.5"/><path d="m9.7 13.3 8.6-8.6"/><path d="m15.4 7.6 2.5 2.5"/><path d="m13 10 2.5 2.5"/></I>;
}

export function LockIcon(p: IconProps) {
  return <I {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></I>;
}

export function ArrowRightIcon(p: IconProps) {
  return <I {...p}><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></I>;
}

export function XIcon(p: IconProps) {
  return <I {...p}><path d="m6 6 12 12"/><path d="m18 6-12 12"/></I>;
}

export function FilterIcon(p: IconProps) {
  return <I {...p}><path d="M3 5h18l-7 9v6l-4-2v-4Z"/></I>;
}

export function CalendarIcon(p: IconProps) {
  return <I {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></I>;
}

export function LayersIcon(p: IconProps) {
  return <I {...p}><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/><path d="m3 18 9 5 9-5"/></I>;
}

export function PanelOpenIcon(p: IconProps) {
  return <I {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/><path d="m13 10 3 2-3 2"/></I>;
}

export function ChevronLeftIcon(p: IconProps) {
  return <I {...p}><polyline points="15 18 9 12 15 6"/></I>;
}

export function ChevronRightIcon(p: IconProps) {
  return <I {...p}><polyline points="9 18 15 12 9 6"/></I>;
}
