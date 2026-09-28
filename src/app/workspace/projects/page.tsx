"use client";

import { useState, type FormEvent } from "react";
  import { ArrowRight, Check, ChevronDown, Code2, FolderKanban, Plus, Sparkles, Target } from "lucide-react";
import { PageIntro, SectionTitle, Surface, TrustNote } from "@/components/workspace-primitives";
import { useCareer, type PortfolioProject } from "@/lib/career-provider";

type Brief = { title:string; problem:string; stack:string[]; milestones:{title:string;detail:string}[]; evaluation:string[] };

export default function ProjectsRoute() {
  const {state,requestAI,addProject,addMission} = useCareer();
  const [prompt,setPrompt]=useState("");
  const [brief,setBrief]=useState<Brief|null>(null);
  const [busy,setBusy]=useState(false);
  const [expanded,setExpanded]=useState(state.projects[0]?.id ?? "");
  const [notice,setNotice]=useState("");

  async function generate(event:FormEvent){
    event.preventDefault();setBusy(true);setNotice("");
    const request=prompt.trim()||`Design a student-sized ${state.profile.domain} project for my ${state.profile.targetRole} path.`;
    try{
      const result=await requestAI("project",request,JSON.stringify({target:state.profile.targetRole,skills:state.skills.map(skill=>({name:skill.name,signal:skill.score,evidence:skill.evidence.map(item=>item.label)}))})) as Brief;
      setBrief(result);
    }catch{
      setBrief({title:"Model deployment observatory",problem:"Turn a small, evaluated model into a service a real user can try. Compare the deployed behavior with the notebook baseline and document the limitations.",stack:["Python","scikit-learn","FastAPI","Docker"],milestones:[{title:"Define a user and baseline",detail:"Write down who the tool helps, the baseline, and one failure case to watch."},{title:"Build a validated inference API",detail:"Add typed inputs, safe error responses, and tests for boundary cases."},{title:"Deploy and inspect",detail:"Containerize the service, add health checks, and document trade-offs."}],evaluation:["Setup can be repeated from the README","Model is compared with a baseline","Failure cases are visible","Demo and API have basic tests"]});
      setNotice("Local project brief ready. Add GEMINI_API_KEY for tailored AI generation.");
    }
    setBusy(false);
  }

  function saveBrief(){
    if(!brief)return;
    const project:Omit<PortfolioProject,"id">={title:brief.title,status:"planned",stack:brief.stack,summary:brief.problem,skills:brief.stack,progress:0};
    addProject(project);setExpanded("newest");setNotice("Project added to your shared portfolio workspace.");
  }

  const complete=state.projects.filter(project=>project.status==="complete").length;
  return <div className="projects-route"><PageIntro eyebrow="PROJECT LAB / PORTFOLIO EVIDENCE" title={<>Build the work, <em>not just the demo.</em></>} description="Projects make your reasoning inspectable. The forge scopes a challenge; you make the technical decisions and write the code." action={<span className="profile-target-pill"><FolderKanban size={14}/>{complete} COMPLETED PROJECTS</span>}/>
    {notice&&<div className="inline-notice" role="status"><Sparkles size={14}/>{notice}<button type="button" onClick={()=>setNotice("")} aria-label="Dismiss">×</button></div>}
    <div className="project-forge-layout"><Surface className="project-forge-form"><div className="forge-heading"><span><Sparkles size={14}/> PROJECT FORGE</span><small>PROFILE-AWARE BRIEF GENERATOR</small></div><h2>Start with the problem.<br/><em>Grow the evidence.</em></h2><p>Describe an area you care about or use your current skill context to get a project blueprint.</p><form onSubmit={generate}><label htmlFor="forge-prompt">WHAT DO YOU WANT TO EXPLORE?</label><textarea id="forge-prompt" rows={4} value={prompt} onChange={event=>setPrompt(event.target.value)} placeholder={`I know Python and basic ML. I want to solve a problem in ${state.profile.domain.toLowerCase()}...`}/><div className="forge-context"><span><Target size={13}/>{state.profile.targetRole}</span><span><Code2 size={13}/>{state.skills.filter(skill=>skill.score>=35).length} developing skill signals</span></div><button className="button button-primary" type="submit" disabled={busy}>{busy?<span className="loading-pulse"/>:<Sparkles size={14}/>} {busy?"ASSEMBLING PROJECT BRIEF":"GENERATE A PROJECT BRIEF"}<ArrowRight size={14}/></button></form><div className="forge-pipeline">{["YOUR SKILLS","CAREER GOAL","SKILL GAP","PROJECT PLAN"].map((stage,index)=><span key={stage}><i>{String(index+1).padStart(2,"0")}</i>{stage}{index<3&&<b/>}</span>)}</div></Surface>
    <Surface className={`project-blueprint ${brief?"blueprint-ready":""}`}><div className="blueprint-head"><span><Code2 size={14}/> {brief?"PROJECT BLUEPRINT":"PROJECT ENGINE / STANDBY"}</span>{brief&&<button className="blueprint-save" type="button" onClick={saveBrief}><Plus size={13}/> ADD TO PROJECTS</button>}</div>{brief?<><h2>{brief.title}</h2><p className="blueprint-problem">{brief.problem}</p><div className="blueprint-stack"><small>TECHNOLOGY TO EXPLORE</small><div>{brief.stack.map(skill=><span key={skill}>{skill}<i>{state.skills.some(item=>item.name.toLowerCase()===skill.toLowerCase())?<Check size={11}/>:<Plus size={11}/>}</i></span>)}</div></div><div className="blueprint-milestones"><small>BUILD MILESTONES</small>{brief.milestones.map((milestone,index)=><div key={milestone.title}><i>{String(index+1).padStart(2,"0")}</i><span><b>{milestone.title}</b><small>{milestone.detail}</small></span><button type="button" aria-label={`Add ${milestone.title} to today's mission`} onClick={()=>addMission(milestone.title,"Project milestone",brief.stack[0])}><Plus size={13}/></button></div>)}</div><div className="blueprint-checklist"><small>HOW YOU WILL KNOW IT WORKS</small>{brief.evaluation.map(item=><span key={item}><Check size={13}/>{item}</span>)}</div></>:<div className="blueprint-empty"><div><Code2 size={24}/></div><b>YOUR NEXT PORTFOLIO SIGNAL</b><span>Share your starting point to create a project plan that builds adjacent skills without doing the work for you.</span></div>}</Surface></div>
    <section className="portfolio-section"><SectionTitle eyebrow="PORTFOLIO / ACTIVE WORK" title="Projects with a point of view"/><div className="portfolio-projects">{state.projects.map((project,index)=><ProjectModule key={project.id} project={project} index={index} expanded={expanded===project.id||expanded==="newest"&&index===0} onToggle={()=>setExpanded(expanded===project.id?"":project.id)} onAddMission={addMission}/>)}</div></section>
    <TrustNote>Generated briefs are scaffolding for student work. Your project should contain your implementation, experiments, and decisions.</TrustNote>
  </div>;
}

function ProjectModule({project,index,expanded,onToggle,onAddMission}:{project:PortfolioProject;index:number;expanded:boolean;onToggle:()=>void;onAddMission:(title:string,detail?:string,skill?:string)=>void}){
  return <article className={`portfolio-module ${expanded?"portfolio-expanded":""}`}><button type="button" className="portfolio-module-toggle" onClick={onToggle}><span className="portfolio-index">0{index+1}</span><span className="portfolio-main"><small>{project.status.toUpperCase()} · {project.progress}%</small><b>{project.title}</b><i>{project.summary}</i></span><span className="portfolio-status" data-status={project.status}>{project.status}</span><ChevronDown size={15}/></button><div className="portfolio-stack">{project.stack.map(skill=><span key={skill}>{skill}</span>)}</div>{expanded&&<div className="portfolio-module-detail"><div><small>SKILLS DEMONSTRATED</small><span>{project.skills.join(" · ")}</span></div><div className="project-progress"><small>PROJECT MILESTONE</small><i><b style={{width:`${project.progress}%`}}/></i><span>{project.progress}% complete</span></div><button type="button" onClick={()=>onAddMission(`Continue: ${project.title}`,"Portfolio build session",project.skills[0])}><Plus size={13}/> ADD BUILD SESSION TO TODAY</button></div>}</article>;
}