"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowRight, BadgeCheck, FileText, GraduationCap, LockKeyhole, Sparkles, Upload } from "lucide-react";
import { PageIntro, SectionTitle, Surface, TrustNote } from "@/components/workspace-primitives";
import ResumeReview from "@/components/resume-review";
import { useCareer } from "@/lib/career-provider";

export default function ProfileRoute() {
  const { state, updateProfile, analyzeResume } = useCareer();
  const [resumeText, setResumeText] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setResumeName(file.name);
    try {
      if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
        setResumeText(await file.text());
      } else if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
        const pages = await Promise.all(Array.from({ length: pdf.numPages }, async (_, index) => {
          const page = await pdf.getPage(index + 1);
          const content = await page.getTextContent();
          return content.items.map((item) => "str" in item ? item.str : "").join(" ");
        }));
        setResumeText(pages.join("\n"));
      } else setNotice("Choose a PDF or plain-text resume.");
    } catch {
      setNotice("Could not read that PDF. Paste its text below or export it as plain text.");
    }
    event.target.value = "";
  }

  async function runAnalysis(event: FormEvent) {
    event.preventDefault();
    if (!resumeText.trim()) return setNotice("Add resume text before analyzing evidence.");
    setBusy(true);
    setNotice(await analyzeResume(resumeText));
    setBusy(false);
  }

  return <div className="profile-route"><PageIntro eyebrow="CAREER PROFILE / CONTEXT THAT GUIDES THE ENGINE" title={<>The person <em>behind the plan.</em></>} description="Your preferences shape recommendations. Skill estimates stay tied to reviewable evidence." />
    {notice && <div className="inline-notice" role="status"><Sparkles size={15}/>{notice}<button type="button" onClick={()=>setNotice("")} aria-label="Dismiss notice">×</button></div>}
    <ResumeReview resume={state.resume}/>
    <div className="profile-route-grid"><Surface className="profile-edit-surface"><SectionTitle eyebrow="CAREER TARGET / LIVING CONTEXT" title="A plan that fits your life"/><p className="surface-description">Update these details any time. They are used to shape your role requirements and next steps.</p><div className="career-form-grid"><label>Name<input value={state.profile.name} onChange={event=>updateProfile({name:event.target.value})}/></label><label>Target role<select value={state.profile.targetRole} onChange={event=>updateProfile({targetRole:event.target.value})}><option>AI Engineer</option><option>Data Scientist</option><option>Frontend Engineer</option><option>Product Designer</option></select></label><label>Education<input value={state.profile.education} onChange={event=>updateProfile({education:event.target.value})}/></label><label>Experience<select value={state.profile.experience} onChange={event=>updateProfile({experience:event.target.value})}><option>Exploring</option><option>Student</option><option>Early career</option><option>Mid-career</option><option>Experienced</option></select></label><label>Preferred domain<input value={state.profile.domain} onChange={event=>updateProfile({domain:event.target.value})}/></label><label>Target location<input value={state.profile.location} onChange={event=>updateProfile({location:event.target.value})}/></label><label>Salary expectations<input value={state.profile.salary} onChange={event=>updateProfile({salary:event.target.value})}/></label><label>Time horizon<select value={state.profile.timeframe} onChange={event=>updateProfile({timeframe:event.target.value})}><option>3–6 months</option><option>6–12 months</option><option>12–18 months</option><option>Exploring timeline</option></select></label><label className="field-wide">Interests and the problems you care about<textarea rows={3} value={state.profile.interests} onChange={event=>updateProfile({interests:event.target.value})}/></label></div><div className="profile-privacy"><LockKeyhole size={14}/><span>Saved to this browser by default. Supabase sync is available when credentials are configured.</span></div></Surface>

    <Surface className="resume-intake-surface"><SectionTitle eyebrow="RESUME INTELLIGENCE" title="Turn experience into evidence"/><p className="surface-description">Extract skills and project evidence. Review each signal; estimates are not objective ability scores.</p><input ref={inputRef} className="visually-hidden" type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={onFile}/><button className="resume-dropzone" type="button" onClick={()=>inputRef.current?.click()}><span><Upload size={18}/></span><b>{resumeName || "Choose a resume"}</b><small>PDF or plain text · only sent for analysis after you submit</small></button><label className="resume-text-label" htmlFor="resume-text">OR PASTE RESUME TEXT</label><textarea id="resume-text" className="resume-textarea" rows={7} value={resumeText} onChange={event=>setResumeText(event.target.value)} placeholder="Add role context, projects, tools, and measurable outcomes..."/><button className="button button-primary resume-analyze" type="button" disabled={busy || !resumeText.trim()} onClick={event=>runAnalysis(event as unknown as FormEvent)}>{busy?<span className="loading-pulse"/>:<Sparkles size={15}/>} {busy?"EXTRACTING EVIDENCE":"ANALYZE RESUME"}<ArrowRight size={14}/></button><div className="resume-categories"><span><GraduationCap size={13}/> EDUCATION</span><span><FileText size={13}/> PROJECTS</span><span><BadgeCheck size={13}/> ACHIEVEMENTS</span></div></Surface>

    <Surface className="profile-evidence-surface"><SectionTitle eyebrow="EVIDENCE ON FILE" title={`${state.skills.length} skill signals`}/><div className="evidence-skill-grid">{state.skills.map(skill=><article key={skill.name}><span className="evidence-skill-icon" style={{"--signal":skill.color} as React.CSSProperties}>{skill.name.slice(0,2).toUpperCase()}</span><span><b>{skill.name}</b><small>{skill.evidence.length} evidence references</small></span><strong>{skill.score}</strong></article>)}</div><TrustNote>Resume-derived percentages are AI-estimated proficiency signals. Practice assessments and project evidence are labeled separately.</TrustNote></Surface></div>
  </div>;
}