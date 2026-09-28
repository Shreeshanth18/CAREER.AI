"use client";

import dynamic from "next/dynamic";
import type { SkillSignal } from "@/lib/career-provider";

const CareerScene = dynamic(() => import("@/components/career-scene"), { ssr: false, loading: () => <div className="scene-loading" aria-label="Initializing career graph"><span /><i>INITIALIZING CAREER ENGINE</i></div> });

export default function SceneView({ mode, skills = [], activeSkill, onSelectSkill, reducedMotion = false }: { mode: "hero" | "galaxy" | "skills"; skills?: SkillSignal[]; activeSkill?: string; onSelectSkill?: (name: string) => void; reducedMotion?: boolean }) {
  const sceneSkills = skills.map((skill) => ({ ...skill, evidence: skill.evidence.map((evidence) => evidence.label).join(" · ") }));
  return <CareerScene mode={mode} skills={sceneSkills} activeSkill={activeSkill} onSelectSkill={onSelectSkill} reducedMotion={reducedMotion} />;
}