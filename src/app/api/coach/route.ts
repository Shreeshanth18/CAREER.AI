import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const MAX_TEXT_LENGTH = 32_000;
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

export async function POST(request: Request) {
  if (!ai) {
    return NextResponse.json({ error: "Gemini is not configured. Add GEMINI_API_KEY to .env.local." }, { status: 503 });
  }

  let body: { task?: string; text?: string; targetRole?: string; context?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const task = body.task;
  const text = typeof body.text === "string" ? body.text.slice(0, MAX_TEXT_LENGTH) : "";
  const targetRole = typeof body.targetRole === "string" ? body.targetRole.slice(0, 120) : "AI Engineer";
  const context = typeof body.context === "string" ? body.context.slice(0, 8_000) : "";

  if (!text.trim()) return NextResponse.json({ error: "Add text before requesting an analysis." }, { status: 400 });
  if (!["resume", "job", "interview", "project", "coach"].includes(task ?? "")) {
    return NextResponse.json({ error: "Unsupported analysis task." }, { status: 400 });
  }

  const instructions: Record<string, string> = {
    coach: `You are a concise, evidence-grounded career coach for a student targeting ${targetRole}. Use the candidate context: ${context}. Answer the user's question using only the supplied evidence. Return JSON with keys reply (string), suggestedAction (string), and caveat (string). Keep suggestedAction small and specific. Distinguish resume estimates from assessment evidence. Never claim a score predicts hiring outcomes or invent job-market facts.`,
    resume: `Analyze this resume for a student targeting ${targetRole}. Return JSON with exactly these keys: summary (string), education (string[]), technicalSkills (string[]), softSkills (string[]), experience (array of {organization:string, role:string, duration:string, internship:boolean, achievements:string[]}), yearsOfExperience (number|null), projects (array of {name:string, summary:string, technologies:string[], outcomes:string[]}), certifications (string[]), achievements (string[]), technologies (string[]), quantifiedAchievements (string[]), and skills (array of {name:string, score:number, evidence:string[]}). Extract only details supported by the resume. Keep quotes or faithful paraphrases concise. Keep technologies explicit and avoid inferring fluency from a mention alone. Scores are AI-estimated proficiency signals based on strength and frequency of evidence, not objective ability measurements. Use 0-100 and do not create numeric scores for soft skills. Preserve exact metrics and units for quantified achievements; use an empty array when evidence is absent. Use an empty experience array when no roles are described and null when years cannot be established.`,
    job: `Compare this job description to the candidate context: ${context}. Return JSON with keys title (string), company (string), score (integer 0-100), matched (string[]), missing (string[]), explanation (string). Score represents keyword and evidence coverage for this one description, not hiring probability. Do not invent employer facts.`,
    interview: `Evaluate this candidate answer for a ${targetRole} interview question. Question: ${context}. Return JSON with keys score (integer 0-100), accuracy (string), completeness (string), communication (string), followUp (string). Be specific, constructive, and do not claim objective measurement.`,
    project: `Suggest a student-sized portfolio project for ${targetRole}, based on the candidate context: ${context}. Return JSON with keys title (string), problem (string), stack (string[]), milestones (array of {title:string, detail:string}), evaluation (string[]). The student should build it; do not generate the completed project.`,
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${instructions[task!] as string}\n\nInput:\n${text}`,
      config: { responseMimeType: "application/json" },
    });
    const raw = response.text;
    if (!raw) throw new Error("The model returned an empty response.");
    return NextResponse.json({ result: JSON.parse(raw) });
  } catch {
    return NextResponse.json({ error: "Gemini could not complete the analysis. Try again or use the local evidence scan." }, { status: 502 });
  }
}