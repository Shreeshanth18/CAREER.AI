import { BadgeCheck, BriefcaseBusiness, Building2, Code2, GraduationCap, Sparkles, Target } from "lucide-react";
import { Surface, TrustNote } from "@/components/workspace-primitives";
import type { ResumeIntelligence } from "@/lib/career-provider";

export default function ResumeReview({ resume }: { resume: ResumeIntelligence | null }) {
  if (!resume) return <Surface className="resume-review-surface resume-review-empty"><span><Sparkles size={15}/></span><div><small>RESUME INTELLIGENCE / READY</small><b>Structured evidence appears here after analysis.</b><p>Education, roles, projects, technologies, achievements, and quantitative outcomes remain reviewable in one place.</p></div></Surface>;

  return <Surface className="resume-review-surface"><header className="resume-review-header"><span className="resume-review-mark"><Sparkles size={15}/></span><span><small>STRUCTURED RESUME / REVIEW EACH FIELD</small><b>Profile evidence extracted</b></span><span className="resume-experience-total">{resume.yearsOfExperience === null ? "EXPERIENCE YEARS / NOT STATED" : `${resume.yearsOfExperience} YEARS EXPERIENCE`}</span></header><p className="resume-review-summary">{resume.summary}</p><div className="resume-review-grid">
    <ResumeSection icon={<GraduationCap size={14}/>} title="Education" items={resume.education}/>
    <ResumeSection icon={<Code2 size={14}/>} title="Technical skills" items={resume.technicalSkills}/>
    <ResumeSection icon={<Sparkles size={14}/>} title="Soft skills" items={resume.softSkills}/>
    <ResumeSection icon={<Target size={14}/>} title="Technologies" items={resume.technologies}/>
    <div className="resume-review-block"><span className="resume-block-heading"><BriefcaseBusiness size={14}/>Experience & internships <small>{resume.experience.length}</small></span>{resume.experience.length?resume.experience.map((role,index)=><article className="resume-experience-row" key={`${role.role}-${index}`}><span><Building2 size={13}/></span><div><b>{role.role || role.organization}</b><small>{role.organization}{role.duration?` · ${role.duration}`:""}{role.internship?" · INTERNSHIP":""}</small>{role.achievements.map(item=><p key={item}>{item}</p>)}</div></article>):<span className="resume-empty-copy">No roles identified from the supplied text.</span>}</div>
    <div className="resume-review-block"><span className="resume-block-heading"><Code2 size={14}/>Projects <small>{resume.projects.length}</small></span>{resume.projects.length?resume.projects.map((project,index)=><article className="resume-project-row" key={`${project.name}-${index}`}><b>{project.name}</b><p>{project.summary}</p>{project.technologies.length>0&&<div>{project.technologies.map(tech=><span key={tech}>{tech}</span>)}</div>}{project.outcomes.map(outcome=><small key={outcome}>{outcome}</small>)}</article>):<span className="resume-empty-copy">No project descriptions identified.</span>}</div>
    <ResumeSection icon={<BadgeCheck size={14}/>} title="Certifications" items={resume.certifications}/>
    <ResumeSection icon={<Target size={14}/>} title="Achievements" items={resume.achievements}/>
    <div className="resume-review-block quantified-block"><span className="resume-block-heading"><TrendingUpIcon/>Quantified outcomes <small>{resume.quantifiedAchievements.length}</small></span>{resume.quantifiedAchievements.length?<ul>{resume.quantifiedAchievements.map((item,index)=><li key={`${item}-${index}`}>{item}</li>)}</ul>:<span className="resume-empty-copy">No measurable outcomes found. Add metrics to the resume where you can substantiate them.</span>}</div>
  </div><TrustNote>Resume-derived proficiency values are AI-estimated signals based on cited evidence, not objective measurements. Review this extraction before relying on it.</TrustNote></Surface>;
}

function ResumeSection({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return <div className="resume-review-block"><span className="resume-block-heading">{icon}{title}<small>{items.length}</small></span>{items.length?<ul>{items.map((item,index)=><li key={`${item}-${index}`}>{item}</li>)}</ul>:<span className="resume-empty-copy">No evidence found in the provided text.</span>}</div>;
}

function TrendingUpIcon() {
  return <span className="resume-trend-glyph">%</span>;
}