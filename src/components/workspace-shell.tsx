"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Activity, Bell, BriefcaseBusiness, ChevronRight, Compass, FolderKanban, GraduationCap, LockKeyhole, Menu, MessageSquareText, Network, Orbit, Plus, Search, Send, Settings2, ShieldCheck, Sparkles, Target, X } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { useCareer, readinessIndex } from "@/lib/career-provider";

const navGroups = [
  { label: "COMMAND", items: [{ href: "/workspace", title: "Overview", icon: Compass }, { href: "/workspace/profile", title: "Career profile", icon: GraduationCap }] },
  { label: "BUILD", items: [{ href: "/workspace/skills", title: "Skill landscape", icon: Network }, { href: "/workspace/roadmap", title: "Roadmap", icon: Orbit }, { href: "/workspace/projects", title: "Project lab", icon: FolderKanban }] },
  { label: "OPPORTUNITY", items: [{ href: "/workspace/jobs", title: "Job matching", icon: BriefcaseBusiness }, { href: "/workspace/interview", title: "Interview room", icon: MessageSquareText }] },
  { label: "INTELLIGENCE", items: [{ href: "/workspace/coach", title: "AI coach", icon: Sparkles }, { href: "/workspace/analytics", title: "Progress signals", icon: Activity }] },
];

const routeTitles: Record<string, string> = {
  "/workspace": "Career command",
  "/workspace/profile": "Career profile",
  "/workspace/skills": "Skill landscape",
  "/workspace/roadmap": "Career trajectory",
  "/workspace/projects": "Project forge",
  "/workspace/jobs": "Opportunity radar",
  "/workspace/interview": "Interview room",
  "/workspace/coach": "AI copilot",
  "/workspace/analytics": "Progress signals",
};

export default function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { state, ready, synced, syncStatus, addMission, requestAI } = useCareer();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [copilotBusy, setCopilotBusy] = useState(false);
  const name = state.profile.name.split(/\s+/)[0] || "there";
  const readiness = readinessIndex(state.skills);
  const largestGap = [...state.skills].sort((left, right) => (right.target - right.score) - (left.target - left.score))[0];

  async function submitCopilot(event: FormEvent) {
    event.preventDefault();
    if (!message.trim() || copilotBusy) return;
    setCopilotBusy(true);
    try {
      const result = await requestAI("coach", message, JSON.stringify({ profile: state.profile, skills: state.skills.map(({ name: skillName, score, target, evidence }) => ({ name: skillName, score, target, evidence: evidence.map((item) => item.label) })), roadmap: state.completedRoadmap, projects: state.projects.map(({ title, status, skills }) => ({ title, status, skills })) })) as { reply?: string };
      setReply(result.reply ?? "No response returned.");
    } catch {
      setReply("Add GEMINI_API_KEY to .env.local to enable contextual AI replies. Your career data remains saved locally.");
    }
    setCopilotBusy(false);
  }

  return <div className="command-layout">
    <aside className={`command-sidebar ${menuOpen ? "sidebar-open" : ""}`}>
      <Link href="/workspace" className="brand-lockup" onClick={() => setMenuOpen(false)}><span><Sparkles size={16} /></span><b>CAREER<span>.AI</span><small>CAREER OPERATING SYSTEM</small></b></Link>
      <div className="workspace-switch"><i>{name.slice(0, 1).toUpperCase()}</i><span><b>{name}&apos;s career</b><small>{state.profile.targetRole} · local profile</small></span></div>
      <nav aria-label="Career workspace">{navGroups.map((group) => <div className="nav-group" key={group.label}><p>{group.label}</p>{group.items.map(({ href, title, icon: Icon }) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={`nav-item ${pathname === href ? "nav-selected" : ""}`} aria-current={pathname === href ? "page" : undefined}><Icon size={16} /><span>{title}</span>{href === "/workspace/coach" && <i className="nav-pulse" />}</Link>)}</div>)}</nav>
      <div className="sidebar-bottom"><div className="engine-status-card"><span className="engine-status-icon"><Sparkles size={14} /></span><span><b>Your career engine</b><small>{ready ? syncStatus === "synced" ? "Synced to private profile" : syncStatus === "error" ? "Local save · sync unavailable" : "Saved in this browser" : "Restoring career state"}</small></span><i /></div><Link className="user-profile" href="/workspace/profile"><span>{name.slice(0, 1).toUpperCase()}</span><b>{state.profile.name}<small>{state.profile.targetRole} path</small></b><Settings2 size={16} /></Link></div>
    </aside>

    {menuOpen && <button className="sidebar-backdrop" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}

    <div className="command-main">
      <header className="command-topbar"><button className="mobile-menu-button" aria-label="Open navigation" type="button" onClick={() => setMenuOpen(true)}><Menu size={19} /></button><div className="breadcrumb"><span>WORKSPACE</span><ChevronRight size={12} /><b>{routeTitles[pathname] ?? "CAREER ENGINE"}</b></div><div className="topbar-actions"><span className="engine-pill"><i /> {syncStatus === "synced" ? "PROFILE SYNCED" : "LOCAL DEMO"}</span><button type="button" aria-label="Search skill landscape" onClick={() => router.push("/workspace/skills")}><Search size={16} /></button><button type="button" aria-label="Open career copilot" onClick={() => setCopilotOpen(true)}><Bell size={16} /><i /></button><button className="top-user" type="button" onClick={() => router.push("/workspace/profile")} aria-label="Open profile">{name.slice(0, 1).toUpperCase()}</button></div></header>
      <div className="route-stage"><AnimatePresence mode="wait" initial={false}><motion.div key={pathname} className="route-page" initial={reduceMotion ? false : { opacity: 0, y: 9, filter: "blur(2px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={reduceMotion ? undefined : { opacity: 0, y: -5 }} transition={{ duration: reduceMotion ? 0 : .24, ease: [.2, .7, .3, 1] }}>{children}</motion.div></AnimatePresence></div>
      <footer className="command-footer"><span><i /> CAREER ENGINE OPERATIONAL</span><span>{synced ? "PROFILE SAVED" : "RESTORING PROFILE"} <LockKeyhole size={12} /></span><span>CAREER.AI / 01.04</span></footer>
    </div>

    <button type="button" className="copilot-launcher" onClick={() => setCopilotOpen(true)} aria-label="Open AI career copilot"><span><Sparkles size={16} /></span><i /></button>
    {copilotOpen && <><button className="copilot-scrim" aria-label="Close career copilot" type="button" onClick={() => setCopilotOpen(false)} /><aside className="copilot-drawer" aria-label="Career Copilot"><header><span className="copilot-orb"><i /><i /><i /></span><div><b>CAREER COPILOT</b><small><i /> CONTEXT-AWARE AGENT</small></div><button type="button" aria-label="Close copilot" onClick={() => setCopilotOpen(false)}><X size={16} /></button></header><div className="copilot-drawer-body"><p className="eyebrow">CAREER SIGNAL / NOW</p><h2>Your next move<br />is coming into <em>focus.</em></h2><p className="copilot-context">Your largest measured gap is <strong>{largestGap?.name ?? "adding evidence"}</strong> for the {state.profile.targetRole} role. You have a {readiness}% planning signal and {state.projects.filter((project) => project.status === "complete").length} completed portfolio projects.</p><div className="copilot-drawer-suggestion"><span><Target size={14} /> SUGGESTED 20-MINUTE SESSION</span><b>Build a model health-check endpoint.</b><small>Connects model evaluation to your deployment gap.</small><button type="button" onClick={() => { addMission("Build a model health-check endpoint", "Career copilot · 20 min", "Docker"); setReply("Added a model health-check session to your shared mission list."); }}>ADD TO TODAY&apos;S MISSION <Plus size={13} /></button></div>{reply && <div className="copilot-reply"><Sparkles size={14} /><p>{reply}</p></div>}<div className="copilot-prompts"><small>START WITH A FOCUSED QUESTION</small><button type="button" onClick={() => setMessage("What should I focus on this week given my target role and current evidence?")}>What should I focus on this week?</button><button type="button" onClick={() => setMessage("How can I turn my next project into evidence of deployment skill?")}>How do I show deployment skills?</button></div></div><form className="copilot-composer" onSubmit={submitCopilot}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about your career path..." aria-label="Message the career copilot" /><button type="submit" disabled={copilotBusy} aria-label="Send to the career copilot">{copilotBusy ? <span className="composer-pulse" /> : <Send size={15} />}</button></form><p className="copilot-privacy"><ShieldCheck size={12} /> Uses profile context · saved locally by default</p></aside></>}
  </div>;
}