import { HeartHandshake, Stethoscope, UserCheck, Wrench } from "lucide-react";

export function IconResolver({ name, className }: { name?: string; className?: string }) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    tooth: Stethoscope,
    tools: Wrench,
    "heart-hands": HeartHandshake,
    "user-check": UserCheck
  };
  const Icon = icons[name || ""] ?? Stethoscope;
  return <Icon className={className} aria-hidden="true" />;
}
