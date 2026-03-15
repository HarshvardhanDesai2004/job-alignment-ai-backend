const SKILL_MAP = {
 // ════════════════════════════════
  // PROGRAMMING LANGUAGES
  // ════════════════════════════════
  js:                        "javascript",
  "java script":             "javascript",
  ts:                        "typescript",
  "type script":             "typescript",
  py:                        "python",
  python3:                   "python",
  python2:                   "python",
  rb:                        "ruby",
  "ruby on rails":           "rails",
  ror:                       "rails",
  cpp:                       "c++",
  "c plus plus":             "c++",
  cplusplus:                 "c++",
  csharp:                    "c#",
  "c sharp":                 "c#",
  golang:                    "go",
  "go lang":                 "go",
  rs:                        "rust",
  rustlang:                  "rust",
  kt:                        "kotlin",
  rlang:                     "r",
  "r language":              "r",
  objc:                      "objective-c",
  "objective c":             "objective-c",
  vba:                       "visual basic for applications",
  "visual basic":            "visual basic for applications",
  shellscript:               "bash",
  "shell script":            "bash",
  "shell scripting":         "bash",

  // ════════════════════════════════
  // FRONTEND FRAMEWORKS
  // ════════════════════════════════
  reactjs:                   "react",
  "react js":                "react",
  "react.js":                "react",
  rn:                        "react native",
  "react native":            "react native",
  nextjs:                    "next.js",
  "next js":                 "next.js",
  nuxtjs:                    "nuxt.js",
  "nuxt js":                 "nuxt.js",
  vuejs:                     "vue.js",
  "vue js":                  "vue.js",
  "vue 3":                   "vue.js",
  angularjs:                 "angular",
  "angular js":              "angular",
  "angular 2":               "angular",
  sveltekit:                 "svelte",
  emberjs:                   "ember.js",
  backbonejs:                "backbone.js",
  alpinejs:                  "alpine.js",
  "alpine js":               "alpine.js",
  gatsbyjs:                  "gatsby",
  "gatsby js":               "gatsby",

  // ════════════════════════════════
  // BACKEND FRAMEWORKS
  // ════════════════════════════════
  node:                      "node.js",
  nodejs:                    "node.js",
  "node js":                 "node.js",
  express:                   "express.js",
  expressjs:                 "express.js",
  "express js":              "express.js",
  nestjs:                    "nest.js",
  "nest js":                 "nest.js",
 "fastapi":  "fastapi",
"fast api": "fastapi",
  spring:                    "spring boot",
  "spring mvc":              "spring boot",
  aspnet:                    "asp.net",
  "asp net":                 "asp.net",
  dotnet:                    ".net",
  "dot net":                 ".net",
  dotnetcore:                ".net core",
  "dot net core":            ".net core",
  ror:                       "rails",
  koajs:                     "koa.js",
  hapiJS:                    "hapi.js",

  // ════════════════════════════════
  // DATABASES
  // ════════════════════════════════
  db:                        "database",
  mongo:                     "mongodb",
  "mongo db":                "mongodb",
  mongoose:                  "mongodb",
  postgres:                  "postgresql",
  "postgre sql":             "postgresql",
  pg:                        "postgresql",
  "my sql":                  "mysql",
  sqlite:                    "sqlite",
  mssql:                     "microsoft sql server",
  "sql server":              "microsoft sql server",
  "ms sql":                  "microsoft sql server",
  "oracle db":               "oracle database",
  "oracle sql":              "oracle database",
  "maria db":                "mariadb",
  "dynamo db":               "amazon dynamodb",
  "amazon dynamodb":         "amazon dynamodb",
  "cloud firestore":         "google firestore",
  "neo 4j":                  "neo4j",
  "influx db":               "influxdb",
  "couch db":                "couchdb",
  "couch base":              "couchbase",
  "elastic search":          "elasticsearch",
  "elk stack":               "elasticsearch",
  "arango db":               "arangodb",
  "fauna db":                "faunadb",

  // ════════════════════════════════
  // CLOUD PLATFORMS
  // ════════════════════════════════
  "aws cloud":               "amazon web services",
  amazon:                    "amazon web services",
  gcp:                       "google cloud platform",
  "google cloud":            "google cloud platform",
  "ms azure":                "microsoft azure",
  "azure cloud":             "microsoft azure",
  "ibm cloud":               "ibm cloud services",
  "digital ocean":           "digitalocean",

  // ════════════════════════════════
  // DEVOPS & INFRA
  // ════════════════════════════════
  "ci/cd":                   "ci/cd",
  cicd:                      "ci/cd",
  "ci cd":                   "ci/cd",
  k8s:                       "kubernetes",
  "github actions":          "github actions",
  "gitlab ci":               "gitlab ci/cd",
  "infra as code":           "infrastructure as code",
  iac:                       "infrastructure as code",
  "load balancing":          "load balancing",

  // ════════════════════════════════
  // APIs & PROTOCOLS
  // ════════════════════════════════
  api:                       "api development",
  rest:                      "rest api",
  restful:                   "rest api",
  "restful api":             "rest api",
  graphqlapi:                "graphql",
  grpc:                      "grpc",
  websocket:                 "websockets",
  "web sockets":             "websockets",
  "soap api":                "soap",
  oauth:                     "oauth2",
  "oauth 2":                 "oauth2",
  "json web token":          "jwt",
  swagger:                   "openapi / swagger",
  openapi:                   "openapi / swagger",
  "api gateway":             "api gateway",

  // ════════════════════════════════
  // AI / ML / DATA SCIENCE
  // ════════════════════════════════
  ai:                        "artificial intelligence",
  ml:                        "machine learning",
  dl:                        "deep learning",
  "machine-learning":        "machine learning",
  nlp:                       "natural language processing",
  "natural language processing": "nlp",
  cv:                        "computer vision",
  tf:                        "tensorflow",
  "scikit learn":            "scikit-learn",
  scikitlearn:               "scikit-learn",
  sklearn:                   "scikit-learn",
  "hugging face":            "huggingface",
  "lang chain":              "langchain",
  "gpt api":                 "openai api",
  llm:                       "large language models",
  "large language model":    "large language models",
  "gen ai":                  "generative ai",
  "generative ai":           "generative ai",
  rag:                       "retrieval augmented generation",
  "fine tuning":             "fine-tuning",
  finetuning:                "fine-tuning",
  rl:                        "reinforcement learning",
  ann:                       "artificial neural network",
  cnn:                       "convolutional neural network",
  rnn:                       "recurrent neural network",
  "ml ops":                  "mlops",
  "ab testing":              "a/b testing",
  "a b testing":             "a/b testing",
  "predictive modelling":    "predictive modeling",
  "data wrangling":          "data wrangling",

  // ════════════════════════════════
  // DATA ENGINEERING & ANALYTICS
  // ════════════════════════════════
  etl:                       "etl pipelines",
  "extract transform load":  "etl pipelines",
  "apache spark":            "spark",
  "apache kafka":            "kafka",
  "apache airflow":          "airflow",
  "data build tool":         "dbt",
  "big query":               "google bigquery",
  bi:                        "business intelligence",
  "data warehouse":          "data warehousing",
  "data lake":               "data lake architecture",
  "stream processing":       "real-time stream processing",
  powerbi:                   "power bi",
  "power bi":                "power bi",
  "google analytics":        "google analytics",
  ga4:                       "google analytics 4",

  // ════════════════════════════════
  // UI / UX & DESIGN
  // ════════════════════════════════
  ui:                        "ui design",
  ux:                        "ux design",
  "ui/ux":                   "ui/ux design",
  "user interface":          "ui design",
  "user experience":         "ux design",
  xd:                        "adobe xd",
  "adobe xd":                "adobe xd",
  "design system":           "design systems",
  a11y:                      "web accessibility",
  wcag:                      "wcag accessibility",
  ixd:                       "interaction design",
  ia:                        "information architecture",
  "mobile first":            "mobile-first design",
  photoshop:                 "adobe photoshop",
  illustrator:               "adobe illustrator",
  indesign:                  "adobe indesign",
  "after effects":           "adobe after effects",
  "premiere pro":            "adobe premiere pro",
  "motion graphics":         "motion graphics",

  // ════════════════════════════════
  // CYBERSECURITY
  // ════════════════════════════════
  "cyber security":          "cybersecurity",
  infosec:                   "information security",
  appsec:                    "application security",
  "pen testing":             "penetration testing",
  pentest:                   "penetration testing",
  "ethical hacking":         "penetration testing",
  soc:                       "security operations center",
  iam:                       "identity & access management",
  "identity management":     "identity & access management",
  sso:                       "single sign-on",
  "single sign on":          "single sign-on",
  ssl:                       "ssl/tls",
  tls:                       "ssl/tls",
  "ssl/tls":                 "ssl/tls",
  "cloud security":          "cloud security",
  devsecops:                 "devsecops",
  "iso 27001":               "iso 27001",
  soc2:                      "soc 2",
  "burp suite":              "burp suite",
  burpsuite:                 "burp suite",

  // ════════════════════════════════
  // BUSINESS / MBA
  // ════════════════════════════════
  mba:                       "business administration",
  "biz dev":                 "business development",
  swot:                      "swot analysis",
  "go to market":             "go-to-market strategy",
  "go-to-market":             "go-to-market strategy",
  "p&l":                     "p&l management",
  "profit and loss":         "p&l management",
  kpi:                       "kpi management",
  okr:                       "okr framework",
  scm:                       "supply chain management",
  "supply chain":            "supply chain management",
  bpm:                       "business process management",
  "business process":        "business process management",
  erp:                       "enterprise resource planning",
  crm:                       "customer relationship management",
  "sap erp":                 "sap",
  "salesforce crm":          "salesforce",
  "ms dynamics":             "microsoft dynamics",
  "gap analysis":            "gap analysis",
  "requirements gathering":  "requirements gathering",

  // ════════════════════════════════
  // PROJECT MANAGEMENT
  // ════════════════════════════════
  pmp:                       "project management",
  po:                        "product owner",
  "product owner":           "product owner",
  "scrum master":            "scrum master",
  "safe agile":              "scaled agile framework",
  "scaled agile":            "scaled agile framework",
  "ms project":              "microsoft project",
  "monday.com":              "monday.com",
  "sprint planning":         "sprint planning",
  "backlog management":      "backlog management",
  waterfall:                 "waterfall methodology",
  prince2:                   "prince2",

  // ════════════════════════════════
  // MARKETING
  // ════════════════════════════════
  smm:                       "social media marketing",
  seo:                       "search engine optimization",
  sem:                       "search engine marketing",
  ppc:                       "ppc advertising",
  "pay per click":           "ppc advertising",
  "google ads":              "google ads",
  "facebook ads":            "meta ads",
  "meta ads":                "meta ads",
  cro:                       "conversion rate optimization",
  "conversion rate optimization": "cro",
  "funnel optimization":     "funnel optimization",
  "copy writing":            "copywriting",
  "technical writing":       "technical writing",
  "growth hacking":          "growth hacking",
  "customer journey":        "customer journey mapping",
  "brand management":        "brand management",
  "content strategy":        "content strategy",
  "marketing automation":    "marketing automation",
  "inbound marketing":       "inbound marketing",
  "affiliate marketing":     "affiliate marketing",
  "influencer marketing":    "influencer marketing",
  gtm:                       "google tag manager",
  "google tag manager":      "google tag manager",
  pr:                        "public relations",

  // ════════════════════════════════
  // SALES
  // ════════════════════════════════
  "b2b":                     "b2b sales",
  "b2c":                     "b2c sales",
  kam:                       "key account management",
  "key account management":  "key account management",
  "pipeline management":     "sales pipeline management",
  "solution selling":        "solution selling",
  "consultative selling":    "consultative selling",
  revops:                    "revenue operations",
  "revenue operations":      "revenue operations",
  "sales enablement":        "sales enablement",
  "cross selling":           "cross-selling",

  // ════════════════════════════════
  // FINANCE & ACCOUNTING
  // ════════════════════════════════
  "tally erp":               "tally",
  "tally prime":             "tally",
  "quick books":             "quickbooks",
  ap:                        "accounts payable",
  ar:                        "accounts receivable",
  "bank recon":              "bank reconciliation",
  ib:                        "investment banking",
  "equity research":         "equity research",
  "m&a":                     "mergers & acquisitions",
  "mergers and acquisitions":"mergers & acquisitions",
  pe:                        "private equity",
  vc:                        "venture capital",
  "algo trading":            "algorithmic trading",
  "algorithmic trading":     "algorithmic trading",
  "fp&a":                    "financial planning & analysis",
  "financial planning":      "financial planning & analysis",
  "cash flow":               "cash flow management",
  "working capital":         "working capital management",
  "credit risk":             "credit risk analysis",
  esg:                       "esg investing",
  gaap:                      "us gaap",
  "us gaap":                 "us gaap",
  ifrs:                      "ifrs",
  "ind as":                  "ind as",
  gst:                       "gst compliance",
  "income tax":              "income tax",

  // ════════════════════════════════
  // HUMAN RESOURCES
  // ════════════════════════════════
  hr:                        "human resources",
  hrbp:                      "hr business partner",
  "hr business partner":     "hr business partner",
  "l&d":                     "learning & development",
  "learning and development":"learning & development",
  "t&d":                     "training & development",
  "c&b":                     "compensation & benefits",
  "compensation and benefits":"compensation & benefits",
  "people analytics":        "hr analytics",
  hris:                      "hr information systems",
  "hr information system":   "hr information systems",
  dei:                       "diversity equity & inclusion",
  "d&i":                     "diversity & inclusion",
  "diversity and inclusion": "diversity & inclusion",
  od:                        "organizational development",
  "talent acquisition":      "talent acquisition",
  "employer branding":       "employer branding",
  "workforce planning":      "workforce planning",
  "succession planning":     "succession planning",

  // ════════════════════════════════
  // LEGAL
  // ════════════════════════════════
  "contract drafting":       "contract drafting",
  "legal research":          "legal research",
  "ip law":                  "intellectual property law",
  "legal ops":               "legal operations",
  "regulatory compliance":   "compliance",
  "data privacy law":        "data privacy",
  "due diligence":           "due diligence",

  // ════════════════════════════════
  // HEALTHCARE & MEDICAL
  // ════════════════════════════════
  ehr:                       "electronic health records",
  emr:                       "electronic medical records",
  "icd 10":                  "icd-10 coding",
  icd10:                     "icd-10 coding",
  "cpt coding":              "cpt medical coding",
  "drug safety":             "pharmacovigilance",
  "physical therapy":        "physiotherapy",
  "lab technician":          "laboratory skills",

  // ════════════════════════════════
  // MECHANICAL / CIVIL ENGINEERING
  // ════════════════════════════════
  "auto cad":                "autocad",
  "solid works":             "solidworks",
  "finite element analysis": "fea",
  "computational fluid dynamics": "cfd",
  "3d printing":             "additive manufacturing",
  "cnc machining":           "cnc",
  qc:                        "quality control",
  qa:                        "quality assurance",
  "lean manufacturing":      "lean",
  "six sigma":               "six sigma",
  "bill of materials":       "bom",
  bom:                       "bill of materials",
  cad:                       "cad design",
  cam:                       "cam manufacturing",
  plc:                       "plc programming",
  scada:                     "scada systems",
  "hvac":                    "hvac systems",
  "structural analysis":     "structural engineering",
  "project estimation":      "cost estimation",

  // ════════════════════════════════
  // ELECTRICAL / ELECTRONICS
  // ════════════════════════════════
  iot:                       "internet of things",
  "internet of things":      "internet of things",
  embedded:                  "embedded systems",
  "embedded c":              "embedded systems",
  pcb:                       "pcb design",
  "pcb design":              "pcb design",
  vhdl:                      "vhdl",
  verilog:                   "verilog",
  fpga:                      "fpga",
  "signal processing":       "digital signal processing",
  dsp:                       "digital signal processing",
  "power electronics":       "power electronics",
  rtos:                      "real-time operating systems",
  arduino:                   "arduino",
  "raspberry pi":            "raspberry pi",
  arm:                       "arm architecture",
  microcontroller:           "microcontroller programming",

  // ════════════════════════════════
  // EDUCATION & TRAINING
  // ════════════════════════════════
  "e learning":              "e-learning",
  elearning:                 "e-learning",
  lms:                       "learning management systems",
  ece:                       "early childhood education",
  "instructional design":    "instructional design",
  "curriculum development":  "curriculum development",
  "lesson planning":         "lesson planning",
  pedagogy:                  "pedagogy",
  "online teaching":         "online teaching",

  // ════════════════════════════════
  // RESEARCH & ACADEMIA
  // ════════════════════════════════
  "academic writing":        "academic writing",
  "literature review":       "literature review",
  "research methodology":    "research methodology",
  "quantitative research":   "quantitative research",
  "qualitative research":    "qualitative research",
  spss:                      "spss",
  "stata":                   "stata",
  "data collection":         "data collection",
  "survey design":           "survey design",
  "grant writing":           "grant writing",

  // ════════════════════════════════
  // SUPPLY CHAIN & LOGISTICS
  // ════════════════════════════════
  "supply chain":            "supply chain management",
  scm:                       "supply chain management",
  "inventory management":    "inventory management",
  "warehouse management":    "warehouse management",
  wms:                       "warehouse management systems",
  "logistics management":    "logistics",
  "demand planning":         "demand planning",
  "procurement":             "procurement",
  "vendor management":       "vendor management",
  "last mile delivery":      "last mile logistics",
  "cold chain":              "cold chain logistics",
  "freight management":      "freight management",
  "3pl":                     "third-party logistics",
  edi:                       "electronic data interchange",

  // ════════════════════════════════
  // HOSPITALITY & TOURISM
  // ════════════════════════════════
  "hotel management":        "hospitality management",
  "front office":            "front office operations",
  "food and beverage":       "f&b management",
  "f&b":                     "f&b management",
  "revenue management":      "hotel revenue management",
  pms:                       "property management systems",
  "guest relations":         "guest relations management",
  "event management":        "event management",
  "tour operations":         "tour operations",
  gds:                       "global distribution systems",

  // ════════════════════════════════
  // MEDIA, JOURNALISM & COMMUNICATION
  // ════════════════════════════════
  "content writing":         "content writing",
  "news writing":            "journalism",
  "feature writing":         "feature writing",
  "press release":           "press release writing",
  "media relations":         "media relations",
  "broadcast journalism":    "broadcast journalism",
  "photo journalism":        "photojournalism",
  "social media":            "social media management",
  "script writing":          "scriptwriting",
  "video editing":           "video editing",
  "audio production":        "audio production",
  "podcast production":      "podcast production",
  "seo writing":             "seo content writing",

  // ════════════════════════════════
  // SOFT SKILLS — NORMALIZED
  // ════════════════════════════════
  "problem solving":         "problem solving",
  "problem-solving":         "problem solving",
  "critical thinking":       "critical thinking",
  "decision making":         "decision making",
  "decision-making":         "decision making",
  "time management":         "time management",
  "team management":         "team management",
  "team lead":               "team leadership",
  "team leader":             "team leadership",
  "cross functional":        "cross-functional collaboration",
  "cross-functional":        "cross-functional collaboration",
  "conflict resolution":     "conflict resolution",
  "presentation skills":     "presentations",
  "public speaking":         "public speaking",
  "written communication":   "written communication",
  "verbal communication":    "verbal communication",
};

exports.normalizeSkills = (skills = []) => {

  if (!Array.isArray(skills)) return [];

  const normalized = skills.map((skill) => {

    if (!skill || typeof skill !== "string") return null;

    let clean = skill
      .toLowerCase()
      .trim()

      /* normalize punctuation */
      .replace(/[._-]/g, " ")

      /* normalize js variations */
      .replace(/\.js/g, " js")

      /* remove extra spaces */
      .replace(/\s+/g, " ")
      .trim();

    /* map synonyms */
    if (SKILL_MAP[clean]) {
      return SKILL_MAP[clean];
    }

    return clean;
  });

  return [...new Set(normalized.filter(Boolean))];
};