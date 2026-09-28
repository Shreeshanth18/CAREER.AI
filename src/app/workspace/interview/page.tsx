"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, AudioLines, BrainCircuit, CheckCircle2, MessageSquareText, Mic2, ShieldCheck, Sparkles, Waves } from "lucide-react";
  import { PageIntro, TrustNote } from "@/components/workspace-primitives";
import { useCareer } from "@/lib/career-provider";

const prompts = [
  { topic: "MACHINE LEARNING", question: "Explain overfitting to someone who has never trained a model.", nudge: "Ground your answer in a concrete example, then describe one way you would address it." },
  { topic: "PYTHON", question: "When would you choose a generator instead of returning a list?", nudge: "Consider memory, laziness, and how a caller consumes the result." },
  { topic: "SYSTEM DESIGN", question: "How would you make an ML inference endpoint safer to operate?", nudge: "Think about input validation, timeouts, logging, and what happens when the model is unavailable." },
];
type Feedback = { score?: number; accuracy?: string; completeness?: string; communication?: string; followUp?: string };

export default function InterviewRoute(){
  const {state,requestAI}=useCareer();
  const [promptIndex,setPromptIndex]=useState(0);
  const [answer,setAnswer]=useState("");
  const [feedback,setFeedback]=useState<Feedback|null>(null);
  const [aiFeedback,setAiFeedback]=useState(false);
  const [busy,setBusy]=useState(false);
  const prompt=prompts[promptIndex];

  async function submit(event:FormEvent){event.preventDefault();if(!answer.trim())return;setBusy(true);setAiFeedback(false);try{const result=await requestAI("interview",answer,prompt.question) as Feedback;setFeedback(result);setAiFeedback(true);}catch{setFeedback({accuracy:"Your answer is saved only in this page preview. Add one precise technical detail to support your main claim.",completeness:"Try a short example, then connect it to a practical consequence.",communication:"Use a clear opening statement, then explain your reasoning in order.",followUp:"What trade-off would you consider if the dataset were very large?"});}setBusy(false);}
  function next(){setPromptIndex(index=>(index+1)%prompts.length);setAnswer("");setFeedback(null);}

  return <div className="interview-route"><PageIntro eyebrow="INTERVIEW ROOM / ADAPTIVE TECHNICAL PRACTICE" title={<>Think clearly <em>under pressure.</em></>} description="Practice explaining ideas with a focused follow-up. Feedback is specific, reviewable, and never presented as a hiring verdict." action={<span className="profile-target-pill"><AudioLines size={14}/> TEXT MODE / 01</span>}/>
    <div className="interview-chamber"><div className="interviewer-stage"><span className="chamber-grid"/><div className="interviewer-entity"><i/><b/><em/></div><span className="entity-caption"><i/> INTERVIEWER / SYSTEM 01</span><span className="chamber-coordinate">SIGNAL STABLE / {state.profile.targetRole.toUpperCase()}</span></div><section className="interview-dialogue"><span className="question-tag"><MessageSquareText size={14}/>{prompt.topic} <i>·</i> PROMPT {String(promptIndex+1).padStart(2,"0")}</span><h2>{prompt.question}</h2><p>{prompt.nudge}</p><form onSubmit={submit}><label htmlFor="interview-answer">YOUR RESPONSE</label><textarea id="interview-answer" rows={6} value={answer} onChange={event=>setAnswer(event.target.value)} placeholder="Take a moment. Explain it as if you were talking to a teammate..."/><div className="interview-form-actions"><span><Mic2 size={13}/> KEYBOARD INPUT <i>·</i> VOICE CAPTURE NOT ENABLED</span><button className="button button-primary" type="submit" disabled={busy||!answer.trim()}>{busy?<span className="loading-pulse"/>:<Waves size={14}/>} {busy?"REVIEWING RESPONSE":"SUBMIT FOR FEEDBACK"}<ArrowRight size={13}/></button></div></form>
      {feedback&&<div className="interview-feedback"><div className="feedback-title"><Sparkles size={15}/><span><b>{aiFeedback?"AI FEEDBACK · ESTIMATED SIGNAL":"REFLECTION PROMPTS"}</b><small>{aiFeedback?`${feedback.score ?? "—"} / 100 · model-generated feedback, not objective measurement`:"Local preview · no assessment score was generated"}</small></span>{aiFeedback&&<strong>{feedback.score ?? "—"}<small>/100</small></strong>}</div><div className="feedback-dimensions">{[["TECHNICAL ACCURACY",feedback.accuracy],["COMPLETENESS",feedback.completeness],["COMMUNICATION",feedback.communication]].map(([label,value])=><div key={label}><small>{label}</small><p>{value}</p></div>)}</div><div className="follow-up"><span>ADAPTIVE FOLLOW-UP</span><p>{feedback.followUp}</p></div><button className="text-action" type="button" onClick={next}>NEXT QUESTION <ArrowRight size={13}/></button></div>}</section></div>
    <div className="interview-bottom"><div><span><BrainCircuit size={15}/></span><p><b>Conversation over checklist.</b><small>One prompt at a time. Each follow-up builds on your explanation.</small></p></div><div><span><ShieldCheck size={15}/></span><p><b>Progress indicator, not a verdict.</b><small>Model-generated ratings can be imperfect. Use the feedback as a practice cue.</small></p></div><div><span><CheckCircle2 size={15}/></span><p><b>{state.assessments.length} recorded skill checkpoints</b><small>Assessment history is tracked separately from resume estimates.</small></p></div></div>
    <TrustNote>Interview feedback is practice guidance only. Model-generated scores are estimates, not validated measures of communication or job performance.</TrustNote>
  </div>;
}