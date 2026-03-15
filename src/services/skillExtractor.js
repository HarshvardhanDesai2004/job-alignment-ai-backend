// semanticSkillExtractor.js

const ABBREVIATIONS = {

  // Tech
  js:           "javascript",
  ts:           "typescript",
  py:           "python",
  rb:           "ruby",
  kt:           "kotlin",
  rs:           "rust",
  cpp:          "c++",
  csharp:       "c#",
  golang:       "go",
  rlang:        "r",

  // Web & APIs
  ui:           "user interface",
  ux:           "user experience",
  api:          "application programming interface",
  rest:         "rest api",
  restful:      "rest api",
  graphqlapi:   "graphql",
  grpc:         "grpc",
  ws:           "websockets",
  oauth:        "oauth2",
  jwt:          "json web token",
  swagger:      "openapi",

  // Databases
  db:           "database",
  mongo:        "mongodb",
  postgres:     "postgresql",
  mssql:        "microsoft sql server",

  // Cloud & DevOps
  aws:          "amazon web services",
  gcp:          "google cloud platform",
  "ci/cd":      "continuous integration continuous deployment",
  cicd:         "continuous integration continuous deployment",
  iac:          "infrastructure as code",
  k8s:          "kubernetes",

  // AI / ML / Data
  ai:           "artificial intelligence",
  ml:           "machine learning",
  dl:           "deep learning",
  nlp:          "natural language processing",
  cv:           "computer vision",
  tf:           "tensorflow",
  rl:           "reinforcement learning",
  rag:          "retrieval augmented generation",
  llm:          "large language models",
  "gen ai":     "generative ai",
  mlops:        "machine learning operations",
  etl:          "extract transform load",
  bi:           "business intelligence",
  "power bi":   "power bi",

  // Business
  mba:          "business administration",
  kpi:          "key performance indicator",
  okr:          "objectives and key results",
  crm:          "customer relationship management",
  erp:          "enterprise resource planning",
  scm:          "supply chain management",
  bpm:          "business process management",
  gtm:          "go to market strategy",
  "p&l":        "profit and loss",
  swot:         "strengths weaknesses opportunities threats analysis",
  cro:          "conversion rate optimization",
  ppc:          "pay per click",
  seo:          "search engine optimization",
  sem:          "search engine marketing",
  smm:          "social media marketing",
  pr:           "public relations",
  revops:       "revenue operations",
  kam:          "key account management",

  // Finance
  gaap:         "generally accepted accounting principles",
  ifrs:         "international financial reporting standards",
  gst:          "goods and services tax",
  "fp&a":       "financial planning and analysis",
  ib:           "investment banking",
  "m&a":        "mergers and acquisitions",
  pe:           "private equity",
  vc:           "venture capital",
  esg:          "environmental social governance",
  ap:           "accounts payable",
  ar:           "accounts receivable",

  // HR
  hr:           "human resources",
  hrbp:         "hr business partner",
  hris:         "hr information systems",
  "l&d":        "learning and development",
  "c&b":        "compensation and benefits",
  dei:          "diversity equity inclusion",
  od:           "organizational development",

  // Healthcare
  ehr:          "electronic health records",
  emr:          "electronic medical records",
  icd10:        "icd 10 medical coding",

  // Cybersecurity
  iam:          "identity and access management",
  soc:          "security operations center",
  sso:          "single sign on",
  ssl:          "secure sockets layer",
  tls:          "transport layer security",
  pki:          "public key infrastructure",
  appsec:       "application security",
  devsecops:    "development security operations",

  // Project Management
  pmp:          "project management professional",
  po:           "product owner",
  prince2:      "projects in controlled environments",

  // Engineering
  cad:          "computer aided design",
  cam:          "computer aided manufacturing",
  fea:          "finite element analysis",
  cfd:          "computational fluid dynamics",
  plc:          "programmable logic controller",
  scada:        "supervisory control and data acquisition",
  iot:          "internet of things",
  dsp:          "digital signal processing",
  pcb:          "printed circuit board",
  rtos:         "real time operating systems",
  fpga:         "field programmable gate array",
  bom:          "bill of materials",
  cnc:          "computer numerical control",
  qc:           "quality control",
  qa:           "quality assurance",

  // Education
  lms:          "learning management system",
  ece:          "early childhood education",

  // Logistics
  wms:          "warehouse management systems",
  "3pl":        "third party logistics",
  edi:          "electronic data interchange",


  // Soft Skills
  "d&i":        "diversity and inclusion",
};


// ════════════════════════════════════════════
// COMMON SKILLS — all global domains
// ════════════════════════════════════════════
const COMMON_SKILLS = [

  // ── Programming Languages ──────────────────
  "javascript", "typescript", "python", "java", "c++", "c#", "go",
  "rust", "kotlin", "swift", "ruby", "php", "scala", "perl", "lua",
  "haskell", "dart", "r", "matlab", "cobol", "fortran", "bash",
  "powershell", "vba",

  // ── Frontend ───────────────────────────────
  "react", "next.js", "vue.js", "angular", "svelte", "gatsby",
  "remix", "nuxt.js", "jquery", "htmx", "astro",
  "html", "css", "sass", "tailwind css", "bootstrap", "material ui",

  // ── Backend ────────────────────────────────
  "node.js", "express.js", "nest.js", "django", "flask", "fastapi",
  "spring boot", "laravel", "rails", "asp.net", ".net", "phoenix",
  "gin", "fiber", "fastify",

  // ── Mobile ─────────────────────────────────
  "react native", "flutter", "swift", "kotlin", "xamarin",
  "ionic", "android development", "ios development", "expo",

  // ── Databases ──────────────────────────────
  "mongodb", "postgresql", "mysql", "sqlite",
  "microsoft sql server", "oracle database", "mariadb",
  "redis", "cassandra", "dynamodb", "firebase", "firestore",
  "elasticsearch", "neo4j", "influxdb", "supabase", "couchdb",

  // ── Cloud ──────────────────────────────────
  "amazon web services", "google cloud platform", "microsoft azure",
  "heroku", "vercel", "netlify", "digitalocean", "cloudflare",

  // ── DevOps & Infra ─────────────────────────
  "docker", "kubernetes", "terraform", "ansible", "jenkins",
  "github actions", "gitlab ci/cd", "ci/cd", "nginx", "linux",
  "prometheus", "grafana", "helm", "vagrant",
  "infrastructure as code",

  // ── APIs & Protocols ───────────────────────
  "rest api", "graphql", "grpc", "websockets", "soap",
  "oauth2", "jwt", "openapi", "webhooks",

  // ── AI / ML / Data Science ─────────────────
  "machine learning", "deep learning", "artificial intelligence",
  "natural language processing", "computer vision",
  "tensorflow", "pytorch", "scikit-learn", "keras",
  "pandas", "numpy", "matplotlib", "huggingface", "langchain",
  "openai api", "generative ai", "large language models",
  "retrieval augmented generation", "fine-tuning",
  "reinforcement learning", "xgboost", "feature engineering",
  "a/b testing", "statistical analysis", "predictive modeling",

  // ── Data Engineering & Analytics ───────────
  "spark", "kafka", "airflow", "dbt", "snowflake",
  "google bigquery", "amazon redshift", "databricks",
  "tableau", "power bi", "looker", "google analytics",
  "etl pipelines", "data warehousing", "data lake",
  "business intelligence", "data visualization",
  "real-time stream processing",

  // ── Cybersecurity ──────────────────────────
  "cybersecurity", "penetration testing", "ethical hacking",
  "information security", "network security",
  "application security", "cloud security",
  "identity and access management", "single sign-on",
  "ssl/tls", "gdpr", "iso 27001", "soc 2",
  "security operations center", "devsecops",
  "vulnerability assessment", "incident response",
  "digital forensics", "malware analysis",
  "owasp", "burp suite", "wireshark", "nmap",

  // ── UI/UX & Design ─────────────────────────
  "ui design", "ux design", "figma", "sketch", "adobe xd",
  "prototyping", "wireframing", "design systems",
  "web accessibility", "user research", "usability testing",
  "information architecture", "interaction design",
  "design thinking", "responsive design",
  "adobe photoshop", "adobe illustrator", "adobe indesign",
  "adobe after effects", "adobe premiere pro",
  "motion graphics", "canva", "brand identity",
  "typography", "color theory",

  // ── Business & MBA ─────────────────────────
  "business administration", "business strategy",
  "business development", "market research", "market analysis",
  "competitive analysis", "swot analysis", "go-to-market strategy",
  "business modeling", "p&l management", "revenue growth",
  "cost optimization", "budget management", "forecasting",
  "financial modeling", "kpi management", "okr framework",
  "stakeholder management", "change management",
  "operations management", "supply chain management",
  "lean management", "six sigma", "process improvement",
  "enterprise resource planning", "customer relationship management",
  "sap", "salesforce", "hubspot", "microsoft dynamics",
  "business analysis", "requirements gathering", "gap analysis",

  // ── Project Management ─────────────────────
  "project management", "agile", "scrum", "kanban",
  "scrum master", "product owner", "sprint planning",
  "backlog management", "roadmap planning",
  "waterfall methodology", "prince2", "scaled agile framework",
  "jira", "confluence", "trello", "asana",
  "monday.com", "notion", "clickup",
  "risk mitigation", "resource allocation",

  // ── Marketing ──────────────────────────────
  "digital marketing", "content marketing",
  "social media marketing", "search engine optimization",
  "search engine marketing", "ppc advertising",
  "google ads", "meta ads", "email marketing",
  "marketing automation", "inbound marketing",
  "affiliate marketing", "influencer marketing",
  "brand management", "copywriting", "technical writing",
  "content strategy", "growth hacking",
  "conversion rate optimization", "customer acquisition",
  "customer journey mapping", "market segmentation",
  "product marketing", "public relations",
  "community management", "google tag manager",

  // ── Sales ──────────────────────────────────
  "b2b sales", "b2c sales", "enterprise sales",
  "lead generation", "cold calling", "sales pipeline management",
  "account management", "key account management",
  "contract negotiation", "upselling", "cross-selling",
  "saas sales", "solution selling", "consultative selling",
  "sales forecasting", "revenue operations", "sales enablement",

  // ── Finance & Accounting ───────────────────
  "financial accounting", "management accounting",
  "auditing", "taxation", "financial reporting",
  "gst compliance", "income tax", "corporate tax",
  "us gaap", "ifrs", "tally", "quickbooks", "xero",
  "accounts payable", "accounts receivable",
  "bank reconciliation", "payroll management",
  "investment banking", "equity research",
  "portfolio management", "wealth management",
  "mergers and acquisitions", "private equity",
  "venture capital", "capital markets", "forex",
  "algorithmic trading", "bloomberg",
  "financial planning and analysis", "corporate finance",
  "cash flow management", "working capital management",
  "credit risk analysis", "treasury management",
  "esg investing", "business valuation",

  // ── Human Resources ────────────────────────
  "human resources", "talent acquisition", "recruitment",
  "talent management", "performance management",
  "learning and development", "training and development",
  "employee engagement", "compensation and benefits",
  "hr analytics", "workforce planning", "succession planning",
  "organizational development", "hr business partner",
  "hr information systems", "workday", "sap hr",
  "diversity and inclusion", "employment law",
  "employer branding", "onboarding", "exit management",

  // ── Legal ──────────────────────────────────
  "corporate law", "contract drafting", "legal research",
  "litigation", "arbitration", "mediation",
  "intellectual property law", "patent law",
  "regulatory compliance", "data privacy", "gdpr",
  "employment law", "due diligence", "legal operations",

  // ── Healthcare & Medical ───────────────────
  "clinical research", "clinical trials", "medical writing",
  "pharmacovigilance", "regulatory affairs",
  "electronic health records", "medical coding",
  "icd-10 coding", "medical billing", "patient care",
  "nursing", "critical care", "emergency medicine",
  "pharmacology", "drug discovery", "epidemiology",
  "public health", "mental health", "psychology",
  "physiotherapy", "nutrition", "radiology", "pathology",
  "bioinformatics", "genomics", "hospital management",

  // ── Education & Training ───────────────────
  "teaching", "curriculum development", "lesson planning",
  "instructional design", "e-learning",
  "learning management systems", "classroom management",
  "special education", "early childhood education",
  "academic research", "academic writing", "pedagogy",
  "blended learning", "online teaching", "corporate training",

  // ── Mechanical / Civil Engineering ─────────
  "autocad", "solidworks", "catia", "ansys",
  "fea", "cfd", "product design", "mechanical design",
  "3d modeling", "additive manufacturing", "cnc machining",
  "manufacturing", "quality control", "quality assurance",
  "lean manufacturing", "six sigma", "bill of materials",
  "hvac systems", "structural engineering", "cost estimation",

  // ── Electrical / Electronics ───────────────
  "internet of things", "embedded systems", "pcb design",
  "vhdl", "verilog", "fpga",
  "digital signal processing", "power electronics",
  "real-time operating systems", "arduino", "raspberry pi",
  "microcontroller programming", "arm architecture",

  // ── Supply Chain & Logistics ───────────────
  "inventory management", "warehouse management",
  "logistics", "demand planning", "procurement",
  "vendor management", "last mile logistics",
  "cold chain logistics", "freight management",
  "third-party logistics", "electronic data interchange",

  // ── Hospitality & Tourism ──────────────────
  "hospitality management", "front office operations",
  "f&b management", "hotel revenue management",
  "property management systems", "guest relations",
  "event management", "tour operations",
  "global distribution systems",

  // ── Media & Communication ──────────────────
  "content writing", "journalism", "feature writing",
  "press release writing", "media relations",
  "broadcast journalism", "photojournalism",
  "social media management", "scriptwriting",
  "video editing", "audio production", "podcast production",
  "seo content writing",

  // ── Research & Academia ────────────────────
  "research methodology", "quantitative research",
  "qualitative research", "spss", "literature review",
  "survey design", "grant writing", "stata",

  // ── Soft Skills ────────────────────────────
  "problem solving", "critical thinking", "decision making",
  "time management", "team leadership", "cross-functional collaboration",
  "conflict resolution", "public speaking",
  "written communication", "verbal communication",
  "presentations", "mentoring", "coaching", "negotiation",
];

// Normalize text
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[\n\r]/g, " ")
    .replace(/[\/!$%\^&\*;:{}=\-_`~()]/g, " ") 
    .replace(/\s+/g, " ")
    .trim();
};

// Normalize skill
const normalizeSkill = (skill) => { 
  skill = skill.toLowerCase().trim();
  return ABBREVIATIONS[skill] || skill;
};

// Skill extractor
exports.extractSkills = (text) => {
  const normalizedText = normalizeText(text);
  const matchedSkills = new Set();

  for (const skill of COMMON_SKILLS) {
    const normalizedSkill = normalizeSkill(skill);

    // ← ADD THIS LINE
    const escaped = normalizedSkill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(normalizedText)) {
      matchedSkills.add(skill);
    }
  }
  return Array.from(matchedSkills);
};
// Education extractor
exports.extractEducation = (text) => {

  const keywords = [
    "bachelor",
    "master",
    "phd",
    "btech",
    "mtech",
    "degree",
    "university",
  ];

  const normalizedText = normalizeText(text);

  return keywords.filter((k) => normalizedText.includes(k));
};

// Experience extractor
exports.extractExperience = (text) => {

  const regex = /\b\d+\+?\s+(years?|months?)\b/gi;

  return text.match(regex) || [];
};