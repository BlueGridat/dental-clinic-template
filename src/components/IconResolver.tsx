import { Activity, Baby, CalendarClock, HeartHandshake, HeartPulse, ShieldCheck, Smile, Sparkles, Stethoscope, Syringe, UserCheck, Wrench } from "lucide-react";

function ToothSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7.3 3.5c1.2 0 2.2.5 3.1.9.7.3 1.2.5 1.6.5s.9-.2 1.6-.5c.9-.4 1.9-.9 3.1-.9 2.6 0 4.1 2.2 4.1 5 0 2.4-.9 4.1-1.6 5.4-.4.8-.8 1.7-1 2.9-.5 2.8-1.2 4.7-2.7 4.7-1.1 0-1.5-1.1-2-2.9-.4-1.5-.7-2.4-1.5-2.4s-1.1.9-1.5 2.4c-.5 1.8-.9 2.9-2 2.9-1.5 0-2.2-1.9-2.7-4.7-.2-1.2-.6-2.1-1-2.9-.7-1.3-1.6-3-1.6-5.4 0-2.8 1.5-5 4.1-5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconResolver({ name, className }: { name?: string; className?: string }) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    tooth: ToothSvg,
    tools: Wrench,
    wrench: Wrench,
    "heart-hands": HeartHandshake,
    "user-check": UserCheck,
    "shield-check": ShieldCheck,
    shield: ShieldCheck,
    sparkles: Sparkles,
    smile: Smile,
    activity: Activity,
    "heart-pulse": HeartPulse,
    baby: Baby,
    syringe: Syringe,
    calendar: CalendarClock,
    stethoscope: Stethoscope
  };
  const Icon = icons[name || ""] ?? Stethoscope;
  return <Icon className={className} aria-hidden="true" />;
}
