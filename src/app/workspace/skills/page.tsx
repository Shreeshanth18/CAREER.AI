"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BadgeCheck, Check, ChevronRight, Code2, Layers3, RotateCcw, Sparkles, Target } from "lucide-react";
import SceneView from "@/components/scene-view";
import { PageIntro, SectionTitle, Surface, TrustNote } from "@/components/workspace-primitives";
import { useCareer, sourceColor } from "@/lib/career-provider";

const questions = [
  { skill: "Python", prompt: "What does `list(map(lambda x: x * 2, [1, 2, 3]))` return?", options: ["[1, 2, 3, 2]", "[2, 4, 6]", "[2, 3, 4]", "A map object"], answer: 1, detail: "Iteration and transformation · checkpoint" },
  { skill: "Machine learning", prompt: "Which validation split best prevents patient-level data leakage?", options: ["Random row split", "Group split by patient", "Sort by label", "Tune against the test set"], answer: 1, detail: "Validation strategy · checkpoint" },
  { skill: "SQL", prompt: "Which join preserves all rows from its left-hand table?", options: ["INNER JOIN", "CROSS JOIN", "LEFT JOIN", "NATURAL JOIN"], answer: 2, detail: "Join semantics · checkpoint" },
];

export default function SkillsRoute() {
  const { state, recordAssessment } = useCareer();
  const [selected, setSelected] = useState("Python");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const skill = state.skills.find((item) => item.name === selected) ?? state.skills[0];
  const question = questions[questionIndex];
  const correct = choice === question.answer;

  function submit() {
    if (choice === null) return;
    setChecked(true);
    recordAssessment(question.skill, choice === question.answer, question.detail);
  }

  function nextQuestion() {
    setQuestionIndex((index) => (index + 1) % questions.length);
    setChoice(null);
    setChecked(false);
  }

  return <div className="skills-route"><PageIntro eyebrow="SKILL LANDSCAPE / PROFILE × TARGET ROLE" title={<>A map, <em>not a grade.</em></>} description="Nodes connect skills to your goal. Stronger evidence shines brighter; a smaller signal means less evidence on file, not less potential." action={<Link className="button button-outline" href="/workspace/roadmap"><Target size={14} /> ROLE REQUIREMENTS <ArrowRight size={13} /></Link>} />
    <div className="skills-route-grid"><Surface className="skills-graph-surface"><div className="skills-graph-heading"><SectionTitle eyebrow="INTERACTIVE SKILL GRAPH" title="Select a node to inspect evidence" /><span><i /> {state.skills.length} SKILLS</span></div><div className="skills-graph-canvas"><SceneView mode="skills" skills={state.skills} activeSkill={selected} onSelectSkill={setSelected} /></div><div className="skills-picker">{state.skills.map((item) => <button className={selected === item.name ? "skill-picker-active" : ""} key={item.name} type="button" onClick={() => setSelected(item.name)}><i style={{ "--signal": item.color } as React.CSSProperties} />{item.name}<small>{item.score}</small></button>)}</div></Surface>

    <Surface className="skill-evidence-card"><span className="skill-evidence-glow" style={{ "--signal": skill.color } as React.CSSProperties}>{skill.name.slice(0, 2).toUpperCase()}</span><p className="eyebrow">{skill.group.toUpperCase()} / PROFILE SIGNAL</p><h2>{skill.name}</h2><p className="skill-evidence-summary">{skill.evidence.length ? `${skill.evidence.length} evidence references are attached to this skill.` : "No evidence is attached yet. Use a project or assessment to build a clearer signal."}</p><div className="skill-target-meter"><div><span>CURRENT SIGNAL</span><b>{skill.score}<small> / 100</small></b></div><i><b style={{ width: `${skill.score}%`, background: skill.color }} /></i><div><span>ROLE PLANNING TARGET</span><b>{skill.target}</b></div></div><div className="skill-evidence-list"><span className="evidence-list-title">EVIDENCE TRAIL</span>{skill.evidence.slice(-4).reverse().map((item, index) => <div key={`${item.label}-${index}`}><i style={{ background: sourceColor(item.source) }} /><span><b>{item.label}</b><small>{item.source.toUpperCase()} <em>·</em> {item.date}</small></span></div>)}</div><Link href="/workspace/projects" className="evidence-next-action"><Sparkles size={14} /><span><small>RECOMMENDED NEXT</small><b>Build a project that demonstrates {skill.name}.</b></span><ChevronRight size={15} /></Link></Surface></div>

    <div className="assessment-route-grid"><Surface className="assessment-surface"><div className="assessment-heading"><div><p className="eyebrow">SKILL LAB / QUICK CHECK</p><h2>Build assessment history.</h2><p>Small checkpoints add evidence to your progress trail. A single response is not a comprehensive skill measurement.</p></div><span><Code2 size={17} /></span></div><div className="question-meta"><span><Layers3 size={13} />{question.skill}</span><small>QUESTION {String(questionIndex + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</small></div><h3>{question.prompt}</h3><div className="assessment-options">{question.options.map((option, index) => <button type="button" key={option} onClick={() => !checked && setChoice(index)} className={`${choice === index ? "option-selected" : ""} ${checked && index === question.answer ? "option-correct" : ""} ${checked && choice === index && !correct ? "option-incorrect" : ""}`}><i>{String.fromCharCode(65 + index)}</i>{option}{checked && index === question.answer && <Check size={14} />}</button>)}</div>{checked && <p className={`assessment-feedback ${correct ? "feedback-good" : "feedback-review"}`}><BadgeCheck size={14} />{correct ? "Correct response. An assessment signal was added to your profile." : "This response was not scored as evidence. Review the concept and try another checkpoint."}</p>}<div className="assessment-actions"><span><RotateCcw size={12} /> {state.assessments.length} previous assessment records</span>{checked ? <button type="button" className="button button-primary" onClick={nextQuestion}>NEXT CHECKPOINT <ArrowRight size={13} /></button> : <button type="button" className="button button-primary" disabled={choice === null} onClick={submit}>CHECK RESPONSE <Check size={13} /></button>}</div></Surface>

    <Surface className="assessment-history"><SectionTitle eyebrow="ASSESSMENT TIMELINE" title="Progress over attempts" /><div className="history-list">{state.assessments.slice(-7).reverse().map((attempt) => <div key={attempt.id}><span className="history-dot" /><span><b>{attempt.skill}</b><small>{attempt.detail} · {attempt.date}</small></span><strong>{attempt.score}<small>/100</small></strong></div>)}</div><TrustNote>Assessment values are progress indicators derived from this app&apos;s checkpoints, not scientific proficiency scores.</TrustNote></Surface></div>
  </div>;
}