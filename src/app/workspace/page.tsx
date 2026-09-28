"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, ChevronRight, Flame, FolderKanban, LockKeyhole, Plus, Sparkles, Target } from "lucide-react";
import { useReducedMotion } from "motion/react";
import SceneView from "@/components/scene-view";
import { PageIntro, SectionTitle, Surface, TrustNote } from "@/components/workspace-primitives";
import { useCareer, readinessIndex } from "@/lib/career-provider";

export default function WorkspaceOverview() {
  const { state, toggleMission, addMission } = useCareer();
  const reducedMotion = Boolean(useReducedMotion());
  const [activeSkill, setActiveSkill] = useState("Python");
  const [taskDraft, setTaskDraft] = useState("");
  const active = state.skills.find((skill) => skill.name === activeSkill) ?? state.skills[0];
  const readiness = readinessIndex(state.skills);
  const doneMissions = state.missions.filter((mission) => mission.done).length;
  const nextStage = state.roadmap.find((step) => !state.completedRoadmap.includes(step.id)) ?? state.roadmap.at(-1);
  const largestGap = [...state.skills].sort((left, right) => (right.target - right.score) - (left.target - left.score))[0];

  function submitMission(event: React.FormEvent) {
    event.preventDefault();
    if (!taskDraft.trim()) return;
    addMission(taskDraft.trim());
    setTaskDraft("");
  }

  return <div className="workspace-overview">
    <PageIntro eyebrow="CAREER ENGINE / LOCAL DEMO PROFILE" title={<>Good morning, <em>{state.profile.name.split(/\s+/)[0]}.</em></>} description="Your career system has been mapping the next move." action={<span className="profile-target-pill"><Target size={14} /> TARGET / {state.profile.targetRole.toUpperCase()}</span>} />
    <Link className="insight-ribbon" href="/workspace/roadmap"><span className="ribbon-icon"><Sparkles size={15} /></span><b>CAREER INTELLIGENCE</b><span>Your strongest signal is <strong>{[...state.skills].sort((left, right) => right.score - left.score)[0]?.name}</strong>. <strong>{largestGap?.name ?? "New evidence"}</strong> is the largest gap to your target.</span><span className="ribbon-action">VIEW PATH <ArrowRight size={13} /></span></Link>

    <div className="overview-layout"><div className="overview-main-column">
      <Surface className="graph-panel"><div className="panel-heading"><div><p className="eyebrow">LIVE CAREER GRAPH <span>/ CG-{state.skills.length.toString().padStart(2, "0")}.24</span></p><h2>Your career ecosystem</h2></div><span className="graph-online"><i /> {state.skills.length} NODES ONLINE</span></div><div className="career-graph"><SceneView mode="galaxy" skills={state.skills} activeSkill={activeSkill} onSelectSkill={setActiveSkill} reducedMotion={reducedMotion} /><div className="profile-node"><i>{state.profile.name.slice(0, 1)}</i><b>{state.profile.name.toUpperCase()}</b><small>USER PROFILE</small></div><div className="graph-caption"><span>CAREER CONSTELLATION</span><small>Drag to orbit · select a skill node</small></div><div className="graph-legend"><span><i className="legend-blue" /> SKILL</span><span><i className="legend-violet" /> INTELLIGENCE</span><span><i className="legend-green" /> DEPLOYMENT</span></div></div>{active && <div className="graph-inspector"><span className="skill-chip" style={{ "--signal": active.color } as React.CSSProperties}>{active.name.slice(0, 2).toUpperCase()}</span><span className="inspector-name"><small>{active.group.toUpperCase()} · EVIDENCE SIGNAL</small><b>{active.name}</b><i>{active.evidence.length} evidence references</i></span><span className="inspector-value"><small>PROFILE SIGNAL</small><b>{active.score}<i> / 100</i></b></span><span className="inspector-target"><small>ROLE TARGET</small><b>{active.target}</b></span><Link className="inspector-open" href="/workspace/skills" aria-label="Explore skill evidence"><ArrowUpRight size={15} /></Link></div>}<div className="graph-disclosure"><span><LockKeyhole size={12} /> AI-ESTIMATED SIGNALS · EVIDENCE SOURCES SHOWN IN SKILL MAP</span><Link href="/workspace/skills">ABOUT THIS SIGNAL <ArrowUpRight size={12} /></Link></div></Surface>

      <Surface className="trajectory-panel"><SectionTitle eyebrow={`FORWARD TRAJECTORY / ${state.profile.targetRole.toUpperCase()}`} title="The path in front of you" action={<Link className="small-link" href="/workspace/roadmap">FULL ROADMAP <ArrowUpRight size={13} /></Link>} /><div className="trajectory-map"><span className="trajectory-track"><i style={{ width: `${Math.max(8, state.completedRoadmap.length / state.roadmap.length * 100)}%` }} /></span>{state.roadmap.map((step, index) => { const done = state.completedRoadmap.includes(step.id); const current = !done && state.completedRoadmap.length === index; return <Link key={step.id} href="/workspace/roadmap" className={`trajectory-node ${done ? "node-done" : ""} ${current ? "node-current" : ""}`} style={{ left: `${8 + index * 21}%` }}><i>{done && <Check size={12} />}</i><b>{step.title.split(/[&,]/)[0].toUpperCase()}</b><small>{step.skills.slice(0, 2).join(" · ")}</small></Link>; })}</div><div className="trajectory-next"><span><i /> NEXT CHECKPOINT <b>{nextStage?.title ?? "Portfolio complete"}</b></span><Link href="/workspace/roadmap">CONTINUE <ArrowRight size={13} /></Link></div></Surface>

      <Surface className="mission-panel"><div className="mission-head"><div><p className="eyebrow">TODAY&apos;S MISSION <span>/ {doneMissions} OF {state.missions.length} COMPLETE</span></p><h2>Momentum compounds.</h2></div><div className="mission-ring" style={{ "--mission": `${doneMissions / Math.max(state.missions.length, 1) * 360}deg` } as React.CSSProperties}><span>{Math.round(doneMissions / Math.max(state.missions.length, 1) * 100)}<small>%</small></span></div></div><div className="mission-list">{state.missions.map((mission, index) => <button type="button" key={mission.id} className={`mission-row ${mission.done ? "mission-done" : ""}`} onClick={() => toggleMission(mission.id)}><span className="mission-index">{String(index + 1).padStart(2, "0")}</span><span className="mission-check">{mission.done && <Check size={12} />}</span><span className="mission-label"><b>{mission.title}</b><small>{mission.detail}</small></span>{mission.done ? <small className="complete-label">COMPLETE</small> : <ArrowRight size={14} />}</button>)}</div><form className="add-mission" onSubmit={submitMission}><input value={taskDraft} onChange={(event) => setTaskDraft(event.target.value)} placeholder="Add a focused task..." aria-label="Add a mission" /><button type="submit" aria-label="Save mission"><Plus size={14} /></button></form></Surface>
    </div>

    <aside className="overview-aside"><Surface className="readiness-panel"><SectionTitle eyebrow="CAREER READINESS" title="Multi-signal index" action={<Link href="/workspace/analytics" className="heading-icon" aria-label="View progress signals"><ArrowUpRight size={15} /></Link>} /><div className="readiness-content"><div className="readiness-orbit" style={{ "--readiness": `${readiness * 3.6}deg` } as React.CSSProperties}><i className="readiness-track track-outer" /><i className="readiness-track track-middle" /><i className="readiness-track track-inner" /><i className="readiness-glow" /><div><b>{readiness}</b><small>READINESS INDEX</small></div></div><div className="readiness-legend"><span><i className="dot-blue" /> TECHNICAL <b>{Math.round(state.skills.slice(0, 3).reduce((sum, skill) => sum + skill.score, 0) / Math.max(state.skills.slice(0, 3).length, 1))}</b></span><span><i className="dot-violet" /> PROJECTS <b>{Math.min(100, state.projects.filter((project) => project.status === "complete").length * 24)}</b></span><span><i className="dot-green" /> INTERVIEW <b>{Math.round(state.assessments.filter((attempt) => attempt.skill.toLowerCase().includes("machine")).reduce((sum, attempt) => sum + attempt.score, 0) / Math.max(1, state.assessments.filter((attempt) => attempt.skill.toLowerCase().includes("machine")).length))}</b></span></div></div><TrustNote>Role-planning signal from current evidence and activity. Not a hiring verdict.</TrustNote></Surface>

      <Surface className="focus-panel"><SectionTitle eyebrow="LARGEST ROLE GAP" title={largestGap?.name ?? "Add profile evidence"} /><div className="gap-measure"><span>{largestGap?.score ?? 0}<small> CURRENT</small></span><i><b style={{ width: `${largestGap ? largestGap.score / largestGap.target * 100 : 0}%` }} /><em style={{ left: `${largestGap?.target ?? 0}%` }} /></i><span>{largestGap?.target ?? 0}<small> TARGET</small></span></div><p>{largestGap ? largestGap.target - largestGap.score : 0} points from your role target. Build proof through a project or a focused assessment.</p><Link href="/workspace/skills">OPEN SKILL LANDSCAPE <ArrowRight size={13} /></Link></Surface>

      <Surface className="project-snapshot"><SectionTitle eyebrow="PORTFOLIO SIGNAL / DEMO DATA" title={`${state.projects.length} projects in motion`} action={<Link className="small-link" href="/workspace/projects">VIEW LAB <ArrowUpRight size={13} /></Link>} />{state.projects.slice(0, 2).map((project) => <Link className="project-mini-row" href="/workspace/projects" key={project.id}><span><FolderKanban size={15} /></span><b>{project.title}<small>{project.status.toUpperCase()} · {project.stack.slice(0, 2).join(" / ")}</small></b><ChevronRight size={14} /></Link>)}</Surface>

      <Surface className="xp-snapshot"><div className="xp-snapshot-head"><span><Flame size={15} /></span>DEMO LEARNING MOMENTUM<b>{state.streak} DAY STREAK</b></div><div className="xp-total">{state.xp.toLocaleString()} <small>XP</small><i>Profile signal</i></div><div className="xp-track"><i style={{ width: `${Math.min(100, state.xp / 10)}%` }} /></div><Link href="/workspace/analytics">VIEW PROGRESS SIGNALS <ArrowRight size={12} /></Link></Surface>

      <div className="job-snapshot"><div><BriefcaseBusiness size={15} /><span><b>{state.jobs.length} job descriptions</b><small>Sample roles are marked as demo data</small></span></div><Link href="/workspace/jobs">COMPARE A ROLE <ArrowRight size={12} /></Link></div>
    </aside></div>
    <TrustNote>Resume skill values are AI-estimated signals from evidence, not measured ability. Assessments are tracked separately as progress indicators.</TrustNote>
  </div>;
}