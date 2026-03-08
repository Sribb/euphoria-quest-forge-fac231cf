export const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming","District of Columbia",
] as const;

export const STATE_ADDENDA: Record<string, { title: string; summary: string; clauses: string[] }> = {
  California: {
    title: "California Addendum — SOPIPA & CCPA",
    summary: "Ensures compliance with the Student Online Personal Information Protection Act and acknowledges the CCPA student data exemption.",
    clauses: [
      "Provider shall not use student data for targeted advertising or build advertising profiles.",
      "Provider shall not sell student information, including covered information, as defined by SOPIPA.",
      "Provider acknowledges that student data processed under this Agreement is exempt from the California Consumer Privacy Act (CCPA) per Cal. Civ. Code § 1798.145(o).",
      "Provider shall implement and maintain reasonable security procedures to protect student data from unauthorized access.",
    ],
  },
  "New York": {
    title: "New York Addendum — Education Law 2-d",
    summary: "Meets New York Education Law 2-d requirements and includes the Parents' Bill of Rights provisions.",
    clauses: [
      "Provider agrees to comply with New York Education Law § 2-d and 8 NYCRR Part 121.",
      "Provider shall not sell or release personally identifiable information (PII) of students.",
      "Provider shall implement an information security program aligned with the NIST Cybersecurity Framework.",
      "A Parents' Bill of Rights for Data Privacy and Security is appended and incorporated by reference.",
      "Provider shall notify the District of any breach of student data within 24 hours of discovery.",
    ],
  },
  Illinois: {
    title: "Illinois Addendum — SOPPA Compliance",
    summary: "Addresses Student Online Personal Protection Act requirements including data destruction certification.",
    clauses: [
      "Provider shall comply with the Illinois Student Online Personal Protection Act (105 ILCS 85/).",
      "Provider shall provide a data destruction certification within 60 days of contract termination.",
      "Provider shall not use covered information to engage in targeted advertising.",
      "Provider shall provide a list of all student data elements collected, maintained, and generated.",
      "Provider shall allow the District or parent to review and correct student data.",
    ],
  },
  Colorado: {
    title: "Colorado Addendum — CPA Student Data",
    summary: "Incorporates Colorado Privacy Act provisions specific to student data processing.",
    clauses: [
      "Provider shall comply with the Colorado Student Data Transparency and Security Act (C.R.S. § 22-16-101 et seq.).",
      "Provider shall maintain a comprehensive data security plan.",
      "Provider shall not use student PII for commercial purposes unrelated to contracted services.",
    ],
  },
  Connecticut: {
    title: "Connecticut Addendum — Student Data Privacy",
    summary: "Meets Connecticut's student data privacy act requirements.",
    clauses: [
      "Provider shall comply with Connecticut Public Act No. 16-189, An Act Concerning Student Data Privacy.",
      "Provider shall implement and maintain a comprehensive security program.",
      "Provider shall delete student information within 30 days of a deletion request.",
    ],
  },
  Virginia: {
    title: "Virginia Addendum — VCDPA Education Exemption",
    summary: "Addresses Virginia Consumer Data Protection Act's education exemption provisions.",
    clauses: [
      "Provider acknowledges that student data processed under this Agreement is exempt from the Virginia Consumer Data Protection Act (VCDPA) per Va. Code § 59.1-578(C).",
      "Provider shall comply with all applicable provisions of the Family Educational Rights and Privacy Act (FERPA).",
      "Provider shall not process student data for purposes other than those specified in this Agreement.",
    ],
  },
};

export const EXHIBIT_A_DATA_ELEMENTS = [
  { category: "Student Identifiers", elements: ["First and last name", "Email address", "School-assigned student ID (if provided by the district)", "Grade level"], purpose: "Account creation and platform access" },
  { category: "Academic Data", elements: ["Lesson progress and completion status", "Quiz scores and assessment results", "Learning pathway selections", "Mastery level indicators"], purpose: "Personalized learning and progress tracking" },
  { category: "Usage Data", elements: ["Login timestamps and session duration", "Feature interaction events", "Device type and browser (anonymized)"], purpose: "Platform improvement and technical support" },
  { category: "Gamification Data", elements: ["Experience points and level", "Achievement badges earned", "Streak data"], purpose: "Student engagement and motivation" },
];

export const EXHIBIT_B_SECURITY = [
  { title: "Encryption", description: "All data is encrypted in transit (TLS 1.2+) and at rest (AES-256). Database backups are encrypted using provider-managed keys." },
  { title: "Access Controls", description: "Role-based access controls (RBAC) limit data access to authorized personnel. Multi-factor authentication is required for administrative access. Row-level security (RLS) policies enforce data isolation between districts." },
  { title: "Breach Notification", description: "In the event of a data breach affecting student information, Provider shall notify the District within 72 hours of discovery, provide a detailed incident report within 10 business days, and cooperate with the District's response plan." },
  { title: "Data Retention & Deletion", description: "Student data is retained only for the duration of the contract term. Upon contract expiration or termination, all student data will be deleted within 30 days, and a deletion certification will be provided upon request." },
  { title: "Employee Training", description: "All Provider employees with access to student data complete annual data privacy and security training, including FERPA awareness." },
];

export const EXHIBIT_C_SUBPROCESSORS = [
  { name: "Amazon Web Services (AWS)", service: "Cloud infrastructure and hosting", location: "United States", dataProcessed: "All platform data (encrypted)" },
  { name: "Supabase", service: "Database and authentication services", location: "United States", dataProcessed: "User accounts, application data" },
  { name: "Vercel", service: "Content delivery and edge computing", location: "United States (CDN global)", dataProcessed: "Static assets, anonymized performance data" },
  { name: "Google AI (Gemini)", service: "AI-powered educational content generation", location: "United States", dataProcessed: "De-identified learning prompts (no PII transmitted)" },
];
