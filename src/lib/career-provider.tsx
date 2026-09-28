"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export type EvidenceSource = "resume estimate" | "assessment" | "self reported" | "project";
export type Evidence = { label: string; source: EvidenceSource; date: string };
export type SkillSignal = { name: string; score: number; target: number; group: string; evidence: Evidence[]; color: string };
export type Mission = { id: string; title: string; detail: string; skill?: string; done: boolean; date: string };
export type RoadmapStep = { id: string; title: string; period: string; skills: string[]; summary: string; resource: string; exercise: string; project: string };
export type PortfolioProject = { id: string; title: string; status: "in progress" | "planned" | "complete"; stack: string[]; summary: string; skills: string[]; progress: number };
export type JobMatch = { id: string; title: string; company: string; label: string; score: number; matched: string[]; missing: string[]; description: string };
export type AssessmentRecord = { id: string; skill: string; score: number; date: string; detail: string };
export type CareerProfile = { name: string; targetRole: string; education: string; experience: string; domain: string; location: string; salary: string; timeframe: string; interests: string };
export type ResumeExperience = { organization: string; role: string; duration: string; internship: boolean; achievements: string[] };
export type ResumeProject = { name: string; summary: string; technologies: string[]; outcomes: string[] };
export type ResumeIntelligence = { summary: string; education: string[]; technicalSkills: string[]; softSkills: string[]; experience: ResumeExperience[]; yearsOfExperience: number | null; projects: ResumeProject[]; certifications: string[]; achievements: string[]; technologies: string[]; quantifiedAchievements: string[] };
export type CareerState = { profile: CareerProfile; resume: ResumeIntelligence | null; skills: SkillSignal[]; missions: Mission[]; roadmap: RoadmapStep[]; completedRoadmap: string[]; projects: PortfolioProject[]; jobs: JobMatch[]; assessments: AssessmentRecord[]; xp: number; streak: number };

export const CAREER_STORAGE_KEY = "careeros-career-engine-v2";

export const ROADMAP: RoadmapStep[] = [
  { id: "foundations", title: "Python, data & tooling", period: "WEEKS 01—04", skills: ["Python", "Statistics", "SQL", "Git"], summary: "Build reliable fluency in the language, statistics, and tools behind applied AI.", resource: "Python for Everybody · University of Michigan", exercise: "Clean a messy dataset and create five reusable data-quality checks.", project: "A data-quality CLI with reproducible tests and a thoughtful README." },
  { id: "machine-learning", title: "Machine learning & evaluation", period: "WEEKS 05—08", skills: ["Machine learning", "Feature engineering", "Model evaluation"], summary: "Connect statistical intuition to training, validation, error analysis, and model choice.", resource: "Machine Learning Specialization · DeepLearning.AI", exercise: "Compare a baseline and two models using a validation strategy you can defend.", project: "A documented prediction service with error analysis and reproducible runs." },
  { id: "deep-learning", title: "Neural networks & specialization", period: "WEEKS 09—12", skills: ["Deep learning", "PyTorch", "NLP", "Experiment design"], summary: "Choose a domain and learn to reason about neural models, not just call them.", resource: "Practical Deep Learning for Coders · fast.ai", exercise: "Run an ablation and explain what changed, what did not, and why.", project: "A focused vision or NLP model with reproducible experiments." },
  { id: "deployment", title: "APIs, Docker & cloud", period: "WEEKS 13—16", skills: ["FastAPI", "Docker", "Cloud", "Monitoring"], summary: "Turn a notebook into a dependable product that someone else can use.", resource: "FastAPI deployment documentation", exercise: "Containerize a model API and add validation, health checks, and logs.", project: "A deployed ML service with tests, observability, and a demo." },
  { id: "portfolio", title: "Portfolio & interview readiness", period: "WEEKS 17—20", skills: ["System design", "Communication", "Technical writing"], summary: "Make evidence easy to inspect and your technical decisions easy to explain.", resource: "Google Machine Learning Engineering practices", exercise: "Give a five-minute walkthrough of a trade-off in your deployed project.", project: "A portfolio case study with architecture and failure analysis." },
];

const initialState: CareerState = {
  profile: { name: "Shreeshanth", targetRole: "AI Engineer", education: "Computer Science · B.S.", experience: "Early career", domain: "Applied AI", location: "Remote · India", salary: "Open to market range", timeframe: "6–12 months", interests: "Developer tools, responsible AI, climate technology" },
  resume: null,
  skills: [
    { name: "Python", score: 68, target: 80, group: "Engineering", color: "#82d7f1", evidence: [{ label: "Built a data-cleaning CLI", source: "project", date: "Sep 18" }, { label: "Algorithms and data structures coursework", source: "resume estimate", date: "Sep 18" }, { label: "8 short practice checks", source: "assessment", date: "Sep 24" }] },
    { name: "Machine learning", score: 53, target: 72, group: "Intelligence", color: "#aa9aff", evidence: [{ label: "Trained a scikit-learn classifier", source: "project", date: "Sep 17" }, { label: "Model evaluation checkpoint", source: "assessment", date: "Sep 22" }] },
    { name: "SQL", score: 44, target: 60, group: "Data systems", color: "#e4b67a", evidence: [{ label: "Joins and aggregations in a course project", source: "resume estimate", date: "Sep 18" }] },
    { name: "Deep learning", score: 32, target: 66, group: "Intelligence", color: "#aa9aff", evidence: [{ label: "Introductory neural-network notebook", source: "project", date: "Sep 12" }] },
    { name: "Statistics", score: 39, target: 62, group: "Foundations", color: "#e99bbb", evidence: [{ label: "Probability and statistics coursework", source: "resume estimate", date: "Sep 18" }] },
    { name: "System design", score: 27, target: 48, group: "Engineering", color: "#82d7f1", evidence: [{ label: "Architecture review: inference API", source: "assessment", date: "Sep 20" }] },
    { name: "Docker", score: 18, target: 58, group: "Deployment", color: "#7bd5b7", evidence: [{ label: "Self-reported familiarity", source: "self reported", date: "Sep 18" }] },
    { name: "Cloud", score: 14, target: 55, group: "Deployment", color: "#7bd5b7", evidence: [{ label: "Self-reported familiarity", source: "self reported", date: "Sep 18" }] },
  ],
  missions: [
    { id: "mission-python", title: "Solve 2 Python problems", detail: "Skill check · 15 min", skill: "Python", done: false, date: "Today" },
    { id: "mission-eval", title: "Review model evaluation metrics", detail: "Learning path · 20 min", skill: "Machine learning", done: true, date: "Today" },
    { id: "mission-readme", title: "Document one project decision", detail: "Portfolio · 10 min", done: false, skill: "System design", date: "Today" },
  ],
  roadmap: ROADMAP,
  completedRoadmap: ["foundations"],
  projects: [
    { id: "project-churn", title: "Customer churn signals", status: "complete", stack: ["Python", "Pandas", "scikit-learn"], summary: "Compared three baselines and documented where model recall fell short across segments.", skills: ["Python", "Machine learning", "Statistics"], progress: 100 },
    { id: "project-data-cli", title: "Data quality CLI", status: "in progress", stack: ["Python", "Pandas", "pytest"], summary: "A reusable command-line tool for validating messy tabular datasets.", skills: ["Python", "Testing", "Technical writing"], progress: 62 },
    { id: "project-model-api", title: "Model deployment observatory", status: "planned", stack: ["FastAPI", "Docker", "Cloud"], summary: "Turn a model into a dependable service with input checks and observable behavior.", skills: ["Docker", "Cloud", "System design"], progress: 0 },
  ],
  jobs: [
    { id: "job-northstar", title: "Applied AI Engineer Intern", company: "Northstar Labs", label: "SAMPLE ROLE · NOT A LIVE POSTING", score: 64, matched: ["Python", "Machine learning", "SQL"], missing: ["Docker", "Cloud", "Model serving"], description: "Example role for a small applied AI team. Build and evaluate retrieval and classification features; partner with product engineers to deliver APIs. Desired: Python, SQL, model evaluation, Docker, and cloud deployment." },
    { id: "job-fieldnotes", title: "Junior Machine Learning Engineer", company: "Fieldnotes Systems", label: "SAMPLE ROLE · NOT A LIVE POSTING", score: 58, matched: ["Python", "Machine learning"], missing: ["Deep learning", "Docker", "Monitoring"], description: "Example early-career position. Support model experimentation, write tested data pipelines, and help operate inference services. Desired: Python, ML foundations, data validation, Docker, and observability." },
  ],
  assessments: [
    { id: "assessment-python-1", skill: "Python", score: 61, date: "Sep 03", detail: "Collection types · 8 question checkpoint" },
    { id: "assessment-python-2", skill: "Python", score: 68, date: "Sep 24", detail: "Iteration and complexity · 10 question checkpoint" },
    { id: "assessment-ml-1", skill: "Machine learning", score: 47, date: "Sep 12", detail: "Validation strategy · 6 question checkpoint" },
    { id: "assessment-ml-2", skill: "Machine learning", score: 53, date: "Sep 22", detail: "Model evaluation · 8 question checkpoint" },
  ],
  xp: 860,
  streak: 4,
};

type CoachTask = "resume" | "job" | "interview" | "project" | "coach";
type CareerContextValue = {
  state: CareerState;
  ready: boolean;
  synced: boolean;
  syncStatus: "restoring" | "local" | "syncing" | "synced" | "error";
  updateProfile: (patch: Partial<CareerProfile>) => void;
  addMission: (title: string, detail?: string, skill?: string) => void;
  toggleMission: (id: string) => void;
  toggleRoadmap: (id: string) => void;
  addProject: (project: Omit<PortfolioProject, "id">) => void;
  recordAssessment: (skill: string, correct: boolean, detail: string) => void;
  analyzeResume: (resumeText: string) => Promise<string>;
  compareJob: (description: string, title?: string, company?: string) => Promise<JobMatch>;
  requestAI: (task: CoachTask, text: string, context?: string) => Promise<unknown>;
};


type PersistenceStatus = "restoring" | "local" | "syncing" | "synced" | "error";
let careerSnapshot = initialState;
let persistenceStatus: PersistenceStatus = "restoring";
let localSnapshotLoaded = false;
let localSnapshotExists = false;
let remoteSaveTimer: number | null = null;
const careerSubscribers = new Set<() => void>();
const persistenceSubscribers = new Set<() => void>();

function notifySubscribers(subscribers: Set<() => void>) {
  subscribers.forEach((subscriber) => subscriber());
}

function getCareerSnapshot() {
  if (typeof window !== "undefined" && !localSnapshotLoaded) {
    localSnapshotLoaded = true;
    try {
      const stored = window.localStorage.getItem(CAREER_STORAGE_KEY);
      if (stored) {
        localSnapshotExists = true;
        const parsed = JSON.parse(stored) as Partial<CareerState>;
        careerSnapshot = { ...initialState, ...parsed, profile: { ...initialState.profile, ...parsed.profile }, resume: parsed.resume ?? null };
      }
    } catch {
      window.localStorage.removeItem(CAREER_STORAGE_KEY);
    }
  }
  return careerSnapshot;
}

function subscribeCareer(listener: () => void) {
  careerSubscribers.add(listener);
  return () => careerSubscribers.delete(listener);
}

function subscribePersistence(listener: () => void) {
  persistenceSubscribers.add(listener);
  return () => persistenceSubscribers.delete(listener);
}

function setPersistenceStatus(status: PersistenceStatus) {
  if (persistenceStatus === status) return;
  persistenceStatus = status;
  notifySubscribers(persistenceSubscribers);
}

function getPersistenceStatus() {
  return persistenceStatus;
}

function getServerPersistenceStatus(): PersistenceStatus {
  return "restoring";
}

async function getAnonymousUser(client: NonNullable<ReturnType<typeof getSupabaseClient>>) {
  const { data: sessionData, error: sessionError } = await client.auth.getSession();
  if (sessionError) throw sessionError;
  if (sessionData.session?.user) return sessionData.session.user;
  const { data, error } = await client.auth.signInAnonymously();
  if (error) throw error;
  if (!data.user) throw new Error("Supabase did not return an anonymous profile.");
  return data.user;
}

function queueRemoteSave(snapshot: CareerState, userId?: string) {
  const client = getSupabaseClient();
  if (!client || typeof window === "undefined") {
    setPersistenceStatus("local");
    return;
  }
  setPersistenceStatus("syncing");
  if (remoteSaveTimer !== null) window.clearTimeout(remoteSaveTimer);
  remoteSaveTimer = window.setTimeout(async () => {
    try {
      const user = userId ? { id: userId } : await getAnonymousUser(client);
      const { error } = await client.from("career_profiles").upsert({ user_id: user.id, profile: snapshot, updated_at: new Date().toISOString() });
      if (error) throw error;
      setPersistenceStatus("synced");
    } catch {
      setPersistenceStatus("error");
    }
  }, 500);
}

async function initializePersistence() {
  const client = getSupabaseClient();
  if (!client) {
    setPersistenceStatus("local");
    return;
  }
  setPersistenceStatus("syncing");
  try {
    const user = await getAnonymousUser(client);
    const { data, error } = await client.from("career_profiles").select("profile").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    if (data?.profile && !localSnapshotExists) {
      const remoteProfile = data.profile as Partial<CareerState>;
      careerSnapshot = { ...initialState, ...remoteProfile, profile: { ...initialState.profile, ...remoteProfile.profile }, resume: remoteProfile.resume ?? null };
      window.localStorage.setItem(CAREER_STORAGE_KEY, JSON.stringify(careerSnapshot));
      localSnapshotExists = true;
      notifySubscribers(careerSubscribers);
    }
    setPersistenceStatus("synced");
    if (localSnapshotExists && !data?.profile) queueRemoteSave(careerSnapshot, user.id);
  } catch {
    setPersistenceStatus("error");
  }
}

function commitCareer(update: (current: CareerState) => CareerState) {
  careerSnapshot = update(getCareerSnapshot());
  localSnapshotExists = true;
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(CAREER_STORAGE_KEY, JSON.stringify(careerSnapshot));
  } catch {
    setPersistenceStatus("error");
  }
  notifySubscribers(careerSubscribers);
  queueRemoteSave(careerSnapshot);
}
const CareerContext = createContext<CareerContextValue | null>(null);

export function CareerProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribeCareer, getCareerSnapshot, () => initialState);
  const syncStatus = useSyncExternalStore(subscribePersistence, getPersistenceStatus, getServerPersistenceStatus);
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CAREER_STORAGE_KEY || !event.newValue) return;
      try {
        const parsed = JSON.parse(event.newValue) as Partial<CareerState>;
        careerSnapshot = { ...initialState, ...parsed, profile: { ...initialState.profile, ...parsed.profile }, resume: parsed.resume ?? null };
        localSnapshotExists = true;
        notifySubscribers(careerSubscribers);
      } catch {
        setPersistenceStatus("error");
      }
    };
    window.addEventListener("storage", onStorage);
    void initializePersistence();
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function updateProfile(patch: Partial<CareerProfile>) {
    commitCareer((current) => ({ ...current, profile: { ...current.profile, ...patch } }));
  }

  function addMission(title: string, detail = "Added just now · 15 min", skill?: string) {
    commitCareer((current) => ({ ...current, missions: [{ id: crypto.randomUUID(), title, detail, skill, done: false, date: "Today" }, ...current.missions] }));
  }

  function toggleMission(id: string) {
    commitCareer((current) => {
      const mission = current.missions.find((item) => item.id === id);
      const done = !mission?.done;
      const skills = mission?.skill && done
        ? current.skills.map((skill) => skill.name === mission.skill ? { ...skill, score: Math.min(skill.score + 1, 100), evidence: [...skill.evidence, { label: `Completed mission: ${mission.title}`, source: "assessment" as const, date: "Today" }] } : skill)
        : current.skills;
      return { ...current, skills, missions: current.missions.map((item) => item.id === id ? { ...item, done } : item), xp: done ? current.xp + 30 : Math.max(0, current.xp - 30) };
    });
  }

  function toggleRoadmap(id: string) {
    commitCareer((current) => ({ ...current, completedRoadmap: current.completedRoadmap.includes(id) ? current.completedRoadmap.filter((step) => step !== id) : [...current.completedRoadmap, id] }));
  }

  function addProject(project: Omit<PortfolioProject, "id">) {
    commitCareer((current) => ({ ...current, projects: [{ ...project, id: crypto.randomUUID() }, ...current.projects] }));
  }

  function recordAssessment(skillName: string, correct: boolean, detail: string) {
    commitCareer((current) => {
      const nextScore = correct ? 4 : 0;
      const skills = current.skills.map((skill) => skill.name === skillName ? { ...skill, score: Math.min(skill.score + nextScore, 100), evidence: correct ? [...skill.evidence, { label: detail, source: "assessment" as const, date: "Today" }] : skill.evidence } : skill);
      const skillScore = skills.find((skill) => skill.name === skillName)?.score ?? 0;
      return { ...current, skills, assessments: [...current.assessments, { id: crypto.randomUUID(), skill: skillName, score: skillScore, date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" }), detail }], xp: correct ? current.xp + 100 : current.xp };
    });
  }

  async function requestAI(task: CoachTask, text: string, context = "") {
    const response = await fetch("/api/coach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task, text, targetRole: state.profile.targetRole, context }) });
    const payload = await response.json() as { result?: unknown; error?: string };
    if (!response.ok) throw new Error(payload.error ?? "AI analysis could not be completed.");
    return payload.result;
  }

  async function analyzeResume(resumeText: string) {
    try {
      const result = await requestAI("resume", resumeText) as Partial<ResumeIntelligence> & { skills?: { name: string; score: number; evidence: string[] }[] };
      const resume: ResumeIntelligence = {
        summary: result.summary ?? "Resume evidence extracted. Review each field before using it to guide your plan.",
        education: result.education ?? [],
        technicalSkills: result.technicalSkills ?? result.skills?.map((skill) => skill.name) ?? [],
        softSkills: result.softSkills ?? [],
        experience: result.experience ?? [],
        yearsOfExperience: result.yearsOfExperience ?? null,
        projects: result.projects ?? [],
        certifications: result.certifications ?? [],
        achievements: result.achievements ?? [],
        technologies: result.technologies ?? [],
        quantifiedAchievements: result.quantifiedAchievements ?? [],
      };
      if (result.skills?.length) commitCareer((current) => {
        const byName = new Map(current.skills.map((skill) => [skill.name.toLowerCase(), skill]));
        result.skills?.forEach((incoming) => {
          const old = byName.get(incoming.name.toLowerCase());
          byName.set(incoming.name.toLowerCase(), { name: incoming.name, score: Math.max(old?.score ?? 0, Math.min(100, incoming.score)), target: old?.target ?? 50, group: old?.group ?? "Resume evidence", color: old?.color ?? "#82d7f1", evidence: [...(old?.evidence ?? []), ...incoming.evidence.map((label) => ({ label, source: "resume estimate" as const, date: "Today" }))] });
        });
        return { ...current, resume, skills: [...byName.values()], profile: { ...current.profile, education: resume.education[0] ?? current.profile.education, experience: resume.yearsOfExperience === null ? current.profile.experience : `${resume.yearsOfExperience} years` } };
      });
      if (!result.skills?.length) commitCareer((current) => ({ ...current, resume }));
      return resume.summary;
    } catch {
      const lines = resumeText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      const normalized = resumeText.toLowerCase();
      const skillAliases: Record<string, string[]> = {
        Python: ["python", "pandas", "numpy", "scikit-learn", "pytorch", "tensorflow"],
        "Machine learning": ["machine learning", "scikit-learn", "classification", "regression", "model training"],
        "Deep learning": ["deep learning", "neural network", "pytorch", "tensorflow", "transformer"],
        SQL: ["sql", "postgres", "mysql", "sqlite"],
        Docker: ["docker", "container", "dockerfile"],
        Cloud: ["aws", "azure", "gcp", "cloud", "s3", "ec2"],
        Statistics: ["statistics", "probability", "hypothesis test"],
        "System design": ["system design", "distributed", "microservice", "scalability", "architecture"],
      };
      const detectedSkills = state.skills.filter((skill) => (skillAliases[skill.name] ?? [skill.name.toLowerCase()]).some((alias) => normalized.includes(alias)));
      const technologyAliases: Record<string, string[]> = {
        Python: ["python"],
        SQL: ["sql"],
        "JavaScript": ["javascript", "node.js", "nodejs"],
        "TypeScript": ["typescript"],
        React: ["react", "react.js"],
        "Next.js": ["next.js", "nextjs"],
        FastAPI: ["fastapi"],
        Django: ["django"],
        Flask: ["flask"],
        Pandas: ["pandas"],
        NumPy: ["numpy"],
        "scikit-learn": ["scikit-learn", "sklearn"],
        PyTorch: ["pytorch"],
        TensorFlow: ["tensorflow"],
        PostgreSQL: ["postgresql", "postgres"],
        MySQL: ["mysql"],
        Docker: ["docker"],
        Kubernetes: ["kubernetes", "k8s"],
        AWS: ["aws", "amazon web services"],
        Azure: ["azure"],
        Git: ["git", "github"],
        Linux: ["linux"],
        Figma: ["figma"],
      };
      const technologies = Object.entries(technologyAliases).filter(([, aliases]) => aliases.some((alias) => normalized.includes(alias))).map(([name]) => name);
      const softTerms = ["communication", "leadership", "collaboration", "mentoring", "problem solving", "teamwork", "technical writing", "project management"];
      const softSkills = softTerms.filter((term) => normalized.includes(term));
      const education = lines.filter((line) => /\b(bachelor|master|ph\.?d|degree|university|college|diploma|education)\b/i.test(line)).slice(0, 5);
      const experienceLines = lines.filter((line) => /\b(intern|internship|engineer|developer|analyst|researcher|designer|worked at|experience)\b/i.test(line)).slice(0, 8);
      const internshipLines = experienceLines.filter((line) => /\bintern(?:ship)?\b/i.test(line));
      const projectLines = lines.filter((line) => /\b(project|built|developed|implemented|created|launched)\b/i.test(line)).slice(0, 8);
      const certifications = lines.filter((line) => /\b(certification|certificate|certified)\b/i.test(line)).slice(0, 6);
      const achievementLines = lines.filter((line) => /\b(improved|increased|reduced|delivered|launched|award|achievement|recognized|saved)\b/i.test(line)).slice(0, 8);
      const quantified = lines.filter((line) => /\b\d+(?:\.\d+)?\s?%|\b\d+(?:\.\d+)?\s?x\b|\b\d+(?:\.\d+)?\s+(?:hours?|days?|users?|customers?|projects?|ms|seconds?|dollars?)\b|\$\s?\d/i.test(line)).slice(0, 8);
      const experienceMatch = normalized.match(/\b(\d+(?:\.\d+)?)\+?\s+years?\b/);
      const yearsOfExperience = experienceMatch ? Number(experienceMatch[1]) : null;
      const resume: ResumeIntelligence = {
        summary: `Local evidence scan found ${detectedSkills.length} skill references, ${projectLines.length} project/action lines, ${experienceLines.length} experience-related lines, including ${internshipLines.length} internship references. Review every extracted field.`,
        education,
        technicalSkills: [...new Set([...detectedSkills.map((skill) => skill.name), ...technologies])],
        softSkills,
        experience: experienceLines.map((line) => {
          const atMatch = line.match(/\bat\s+([^,|]+)(?:[,|]\s*(.*))?/i);
          const role = atMatch ? line.slice(0, atMatch.index).trim() : line;
          return { organization: atMatch?.[1]?.trim() ?? "Organization not identified", role, duration: atMatch?.[2]?.trim() || "Not stated", internship: /\bintern(?:ship)?\b/i.test(line), achievements: [] };
        }),
        yearsOfExperience,
        projects: projectLines.map((line, index) => ({ name: `Project reference ${index + 1}`, summary: line, technologies: technologies.filter((technology) => line.toLowerCase().includes(technology.toLowerCase())), outcomes: [] })),
        certifications,
        achievements: achievementLines,
        technologies,
        quantifiedAchievements: quantified,
      };
      commitCareer((current) => ({ ...current, resume, skills: current.skills.map((skill) => detectedSkills.some((match) => match.name === skill.name) ? { ...skill, evidence: [...skill.evidence, { label: `Resume mentions ${skill.name}`, source: "resume estimate", date: "Today" }] } : skill), profile: { ...current.profile, education: education[0] ?? current.profile.education, experience: yearsOfExperience === null ? current.profile.experience : `${yearsOfExperience} years` } }));
      return `${resume.summary} Add GEMINI_API_KEY for structured AI interpretation.`;
    }
  }

  async function compareJob(description: string, title = "Pasted opportunity", company = "Company not specified") {
    const skills = state.skills;
    const matched = skills.filter((skill) => description.toLowerCase().includes(skill.name.toLowerCase())).map((skill) => skill.name);
    const missing = skills.filter((skill) => !matched.includes(skill.name) && skill.target - skill.score >= 15).map((skill) => skill.name);
    let result: JobMatch = { id: crypto.randomUUID(), title, company, label: "USER-SUPPLIED ROLE", score: Math.round(matched.length / Math.max(matched.length + missing.length, 1) * 100), matched, missing, description: description.slice(0, 420) };
    try {
      const ai = await requestAI("job", description, JSON.stringify(skills.map(({ name, score, evidence }) => ({ name, score, evidence })) )) as Partial<JobMatch>;
      result = { ...result, ...ai, id: result.id, title: ai.title ?? title, company: ai.company ?? company, label: "USER-SUPPLIED ROLE", score: Math.max(0, Math.min(100, ai.score ?? result.score)), matched: ai.matched ?? result.matched, missing: ai.missing ?? result.missing };
    } catch {
      result.label = "LOCAL EVIDENCE MATCH · AI OFFLINE";
    }
    commitCareer((current) => ({ ...current, jobs: [result, ...current.jobs.filter((job) => job.id !== result.id)] }));
    return result;
  }

  const ready = syncStatus !== "restoring";
  const synced = syncStatus === "local" || syncStatus === "synced";
  return <CareerContext.Provider value={{ state, ready, synced, syncStatus, updateProfile, addMission, toggleMission, toggleRoadmap, addProject, recordAssessment, analyzeResume, compareJob, requestAI }}>{children}</CareerContext.Provider>;
}

export function useCareer() {
  const context = useContext(CareerContext);
  if (!context) throw new Error("useCareer must be used within CareerProvider.");
  return context;
}

export function readinessIndex(skills: SkillSignal[]) {
  if (!skills.length) return 0;
  return Math.round(skills.reduce((total, skill) => total + Math.min(skill.score / skill.target, 1), 0) / skills.length * 100);
}

export function sourceColor(source: EvidenceSource) {
  if (source === "assessment") return "#82d7f1";
  if (source === "project") return "#7bd5b7";
  if (source === "resume estimate") return "#aa9aff";
  return "#e4b67a";
}