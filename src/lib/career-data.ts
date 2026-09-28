export type ViewId =
  | "overview"
  | "profile"
  | "skills"
  | "roadmap"
  | "jobs"
  | "practice"
  | "projects"
  | "library";

export type SkillSignal = {
  name: string;
  score: number;
  evidence: string[];
  source: "resume" | "assessment" | "manual";
};

export type DailyTask = {
  id: string;
  title: string;
  detail: string;
  done: boolean;
};

export type MatchResult = {
  title: string;
  company: string;
  score: number;
  matched: string[];
  missing: string[];
  description: string;
};

export type CareerProfile = {
  name: string;
  targetRole: string;
  education: string;
  experience: string;
  domain: string;
  location: string;
  salary: string;
  timeframe: string;
  interests: string;
  skills: SkillSignal[];
  tasks: DailyTask[];
  completedMilestones: string[];
  savedJobs: MatchResult[];
  completedChallenges: number;
  xp: number;
  streak: number;
  lastPracticeAt: string | null;
  resumeSummary: string;
};

export const ROLE_REQUIREMENTS: Record<string, { name: string; target: number; group: string }[]> = {
  "AI Engineer": [
    { name: "Python", target: 80, group: "Core" },
    { name: "Machine learning", target: 72, group: "AI" },
    { name: "Deep learning", target: 66, group: "AI" },
    { name: "SQL", target: 60, group: "Data" },
    { name: "Docker", target: 58, group: "Engineering" },
    { name: "Cloud", target: 55, group: "Engineering" },
    { name: "Statistics", target: 62, group: "Foundations" },
    { name: "System design", target: 48, group: "Engineering" },
  ],
  "Data Scientist": [
    { name: "Python", target: 78, group: "Core" },
    { name: "Statistics", target: 78, group: "Foundations" },
    { name: "Machine learning", target: 72, group: "AI" },
    { name: "SQL", target: 72, group: "Data" },
    { name: "Data visualization", target: 64, group: "Data" },
    { name: "Experiment design", target: 58, group: "Foundations" },
  ],
  "Frontend Engineer": [
    { name: "JavaScript", target: 78, group: "Core" },
    { name: "React", target: 76, group: "Frontend" },
    { name: "TypeScript", target: 68, group: "Frontend" },
    { name: "Testing", target: 58, group: "Engineering" },
    { name: "Accessibility", target: 52, group: "Frontend" },
    { name: "System design", target: 44, group: "Engineering" },
  ],
  "Product Designer": [
    { name: "Figma", target: 78, group: "Design" },
    { name: "User research", target: 72, group: "Research" },
    { name: "Prototyping", target: 70, group: "Design" },
    { name: "Accessibility", target: 56, group: "Design" },
    { name: "Design systems", target: 64, group: "Design" },
  ],
};

export const ROADMAP_STAGES = [
  {
    id: "python-foundations",
    number: "01",
    title: "Python, data & tooling",
    duration: "Weeks 1–4",
    description: "Build reliable fluency with the language and the tools you will use every day.",
    skills: ["Python", "NumPy", "Pandas", "Git"],
    resource: "Python for Everybody · University of Michigan",
    resourceUrl: "https://www.py4e.com/",
    exercise: "Clean a messy CSV and write five reusable data-quality checks.",
    project: "A small data-quality CLI with a clear README and tests.",
  },
  {
    id: "stats-ml",
    number: "02",
    title: "Statistics & machine learning",
    duration: "Weeks 5–8",
    description: "Connect statistical intuition to the full model-training and evaluation loop.",
    skills: ["Statistics", "Machine learning", "SQL", "Model evaluation"],
    resource: "Machine Learning Specialization · DeepLearning.AI",
    resourceUrl: "https://www.coursera.org/specializations/machine-learning-introduction",
    exercise: "Compare a baseline and two models with a validation strategy you can defend.",
    project: "A documented prediction service with error analysis.",
  },
  {
    id: "deep-learning",
    number: "03",
    title: "Neural networks & specialization",
    duration: "Weeks 9–12",
    description: "Choose a domain and learn to reason about neural models, not just call them.",
    skills: ["Deep learning", "PyTorch", "Feature engineering", "Experiment design"],
    resource: "Practical Deep Learning for Coders · fast.ai",
    resourceUrl: "https://course.fast.ai/",
    exercise: "Run an ablation and explain what changed, what did not, and why.",
    project: "A focused computer-vision or NLP model with reproducible experiments.",
  },
  {
    id: "deployment",
    number: "04",
    title: "APIs, Docker & deployment",
    duration: "Weeks 13–16",
    description: "Turn a notebook into a dependable product someone else can actually use.",
    skills: ["FastAPI", "Docker", "Cloud", "Monitoring"],
    resource: "FastAPI documentation · deployment guide",
    resourceUrl: "https://fastapi.tiangolo.com/deployment/",
    exercise: "Containerize a model API and add input validation and health checks.",
    project: "A deployed ML service with tests, observability, and a demo.",
  },
  {
    id: "portfolio",
    number: "05",
    title: "Portfolio & interview readiness",
    duration: "Weeks 17–20",
    description: "Make your evidence easy to inspect and your technical decisions easy to explain.",
    skills: ["System design", "Communication", "Technical writing"],
    resource: "Google Machine Learning Engineering practices",
    resourceUrl: "https://developers.google.com/machine-learning/guides/rules-of-ml",
    exercise: "Give a five-minute walkthrough of a trade-off in your deployed project.",
    project: "A polished portfolio case study with an architecture diagram.",
  },
];

export const PRACTICE_QUESTIONS = [
  {
    id: "python-iterables",
    skill: "Python",
    prompt: "What does list(map(lambda x: x * 2, [1, 2, 3])) return?",
    choices: ["[1, 2, 3, 2]", "[2, 4, 6]", "[2, 3, 4]", "A map object"],
    answer: 1,
    explanation: "map applies the function to each item; list materializes the results.",
  },
  {
    id: "ml-leakage",
    skill: "Machine learning",
    prompt: "Which split strategy best prevents patient-level leakage in medical data?",
    choices: ["Random row split", "Group split by patient", "Sort by label", "Use the test set for tuning"],
    answer: 1,
    explanation: "Grouping by patient keeps records from the same person in one partition.",
  },
  {
    id: "sql-join",
    skill: "SQL",
    prompt: "Which join keeps every row from the left table, even without a match?",
    choices: ["INNER JOIN", "CROSS JOIN", "LEFT JOIN", "NATURAL JOIN"],
    answer: 2,
    explanation: "A LEFT JOIN preserves all rows from its left input.",
  },
];

export const KNOWLEDGE_RESOURCES = [
  { title: "Rules of Machine Learning", source: "Google for Developers", kind: "Engineering guide", url: "https://developers.google.com/machine-learning/guides/rules-of-ml" },
  { title: "Model evaluation: metrics", source: "Google for Developers", kind: "Reference", url: "https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall" },
  { title: "PyTorch tutorials", source: "PyTorch", kind: "Documentation", url: "https://pytorch.org/tutorials/" },
  { title: "Designing Machine Learning Systems", source: "Chip Huyen", kind: "Reading list", url: "https://huyenchip.com/book/" },
  { title: "FastAPI deployment concepts", source: "FastAPI", kind: "Documentation", url: "https://fastapi.tiangolo.com/deployment/concepts/" },
  { title: "The Missing Semester", source: "MIT", kind: "Course", url: "https://missing.csail.mit.edu/" },
];

export const DEFAULT_PROFILE: CareerProfile = {
  name: "Taylor Morgan",
  targetRole: "AI Engineer",
  education: "Computer Science · B.S.",
  experience: "Early career",
  domain: "Applied AI",
  location: "Remote · United States",
  salary: "Open to market range",
  timeframe: "6–12 months",
  interests: "Responsible AI, developer tools, climate tech",
  skills: [
    { name: "Python", score: 66, evidence: ["Built a data-cleaning CLI", "Coursework: algorithms and data structures"], source: "resume" },
    { name: "Machine learning", score: 48, evidence: ["Trained a scikit-learn classifier", "Model evaluation quiz · 1 attempt"], source: "assessment" },
    { name: "SQL", score: 42, evidence: ["Used joins and aggregations in a course project"], source: "resume" },
    { name: "Statistics", score: 38, evidence: ["Coursework: probability and statistics"], source: "resume" },
    { name: "Deep learning", score: 24, evidence: ["Introductory neural-network notebook"], source: "resume" },
    { name: "Docker", score: 12, evidence: [], source: "manual" },
    { name: "Cloud", score: 8, evidence: [], source: "manual" },
    { name: "System design", score: 18, evidence: [], source: "manual" },
  ],
  tasks: [
    { id: "task-eval", title: "Review model evaluation metrics", detail: "Roadmap · 20 min", done: false },
    { id: "task-practice", title: "Complete a Python skill check", detail: "Practice · 10 min", done: false },
    { id: "task-readme", title: "Add results to your project README", detail: "Portfolio · 15 min", done: true },
  ],
  completedMilestones: ["python-foundations"],
  savedJobs: [],
  completedChallenges: 1,
  xp: 860,
  streak: 4,
  lastPracticeAt: null,
  resumeSummary: "Two hands-on projects and foundational coursework. Add more quantified outcomes and deployment evidence as you build.",
};