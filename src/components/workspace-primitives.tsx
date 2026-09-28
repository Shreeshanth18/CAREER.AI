import type { ReactNode } from "react";
import { LockKeyhole, Sparkles } from "lucide-react";

export function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: ReactNode; description: string; action?: ReactNode }) {
  return <header className="route-intro"><div><p className="eyebrow"><i className="label-rule" /> {eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{action && <div className="route-intro-action">{action}</div>}</header>;
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{action}</div>;
}

export function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`surface ${className}`}>{children}</section>;
}

export function TrustNote({ children }: { children: ReactNode }) {
  return <p className="trust-note"><LockKeyhole size={13} />{children}</p>;
}

export function EmptySignal({ title, description }: { title: string; description: string }) {
  return <div className="empty-signal"><Sparkles size={19} /><strong>{title}</strong><span>{description}</span></div>;
}

export function SignalBar({ label, value, color = "#77d8f4", target }: { label: string; value: number; color?: string; target?: number }) {
  return <div className="signal-bar-row"><span>{label}</span><i className="signal-bar-track"><b style={{ width: `${Math.max(0, Math.min(value, 100))}%`, background: color }} />{target !== undefined && <em style={{ left: `${Math.max(0, Math.min(target, 100))}%` }} />}</i><strong>{value}</strong></div>;
}