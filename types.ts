// === Shared Types ===
export type View = 'home' | 'project' | 'pitch' | 'learning' | 'reels' | 'compliance' | 'hub' | 'profile' | 'explore' | 'growth' | 'examiner' | 'mirror' | 'fundraising' | 'solver';

export interface Clarification {
    clarificationNeeded: string;
}

export interface StartupProfile {
    name: string;
    oneLiner: string;
    domain: 'EdTech' | 'FinTech' | 'D2C' | 'AgriTech' | 'B2B SaaS' | 'Web3' | 'HealthTech' | 'Other';
    productType: 'Software' | 'Marketplace' | 'B-school' | 'AI tool' | 'NGO' | 'Service-based' | 'Other';
    targetAudience: string;
    stage: 'Idea' | 'Prototype' | 'MVP' | 'Early Traction' | 'Scaling' | 'Pre-Series A' | 'Series A' | 'Series B' | 'Series C';
    teamMembers: string;
    hasTechTeam: boolean;
    website?: string;
    logo?: string; // base64 string
    customerAcquisitionChannels?: string; // e.g., 'SEO, Instagram Ads, Campus Ambassadors'
    metrics?: {
        weeklyActiveUsers: number;
        monthlyActiveUsers: number;
        totalUsers: number;
        monthlyRevenue: number; // in INR
        engagementRate: number; // as percentage
        userAcquisition: number; // new users per week
        churnRate: number; // as percentage
    };
}

export interface User {
  id: string; // Add a unique ID for each user
  username: string;
  email: string;
  fullName: string;
  educationLevel: 'High School' | 'Under-Graduate' | 'Post-Graduate' | 'Other';
  institution: string;
  degree: string;
  graduationYear: string;
  skills: string; // Comma-separated
  interests: string; // Comma-separated, can be used for domains
  isAdmin: boolean;
  bio: string;
  profilePictureUrl: string;
  followers: string[]; // Array of user IDs
  following: string[]; // Array of user IDs
  role: string; // e.g., 'Builder', 'Designer', 'Student Founder'
  location: string; // e.g., 'Mumbai, India'
  startup?: StartupProfile; // Enhanced startup metadata
  founderLogs?: FounderLogEntry[];
  problemSolverHistory?: ProblemSolverSession[];
}


// === Project Builder Types ===
export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    sender: 'user' | 'collaborator'; // Keep for CollabMatch UI, can be deprecated
    timestamp: string;
}

export interface CollaboratorProfile {
  name: string;
  leapScore: number;
  location: string;
  matchReason: string;
  matchType: 'Tech Collaborator' | 'Design Partner' | 'Idea Co-founder' | 'Marketing/Outreach Partner' | 'Data/ML Collaborator';
  topSkills: string[];
  icebreaker: string;
  avatarUrl?: string;
}

export interface LearningResource {
    title: string;
    url: string;
}

export interface ProjectPlan {
  problemUnderstanding: {
    rephrased: string;
    targetAudience: string;
  };
  suggestedMvp: {
    description: string;
    features: string[];
  };
  mvpFlowchart: string;
  techStack: {
    description: string;
    recommendations: {
      name: string;
      tool: string;
      reason: string;
    }[];
  };
  codeSnippet: {
    title: string;
    language: string;
    code: string;
  };
  geminiIntegration: {
    suggestion: string;
    apiEndpoint: string;
  };
  learningResources: LearningResource[];
  studentBlueprint: {
    title: string;
    tagline: string;
  };
  collaboratorMatches: CollaboratorProfile[];
}

export type ApiResponse = ProjectPlan | Clarification;

// === Pitch Generator Types ===

export interface PitchDeckSlide {
    title: string;
    content: string[];
}

export interface NameSuggestion {
    name: string;
    rationale: string;
    domains: string[];
}

export interface PitchGeneratorResponse {
    nameSuggestions: NameSuggestion[];
    oneLiner: string;
    elevatorPitch: string;
    pitchDeck: PitchDeckSlide[];
    videoScript: string;
    linkedInPost: string;
}

export type PitchApiResponse = PitchGeneratorResponse | Clarification;

export interface PDFOptions {
  logo: string | null; // Base64 string
  accentColor: string;
  companyName: string;
  tagline: string;
}

// === Learning Path Types ===

export interface YouTubeVideo {
    title: string;
    url: string;
    description: string;
}

export interface TechResource {
    name: string;
    description: string;
    url: string;
}

export interface CaseStudy {
    startupName: string;
    summary: string;
    keyTakeaways: string[];
}

export interface RoadmapStep {
    week: number;
    title: string;
    tasks: string[];
}

export interface LearningPath {
    youtubePlaylist: YouTubeVideo[];
    techStackCrashCourse: TechResource[];
    caseStudies: CaseStudy[];
    roadmap: RoadmapStep[];
}

export type LearningPathApiResponse = LearningPath | Clarification;

// === Reels-to-Riches AI Types ===
export interface ReelsContentInput {
    startupName: string;
    domain: string;
    stage: 'Idea' | 'MVP' | 'Launch' | 'Revenue';
    platforms: ('Instagram' | 'LinkedIn' | 'YouTube Shorts')[];
    language: 'English' | 'Hindi' | 'Hinglish';
}

export interface ContentIdea {
    platform: 'Instagram' | 'LinkedIn' | 'YouTube Shorts';
    idea: {
        hook: string;
        purpose: string;
        title: string;
    };
    script: {
        shortCaption: string; // for IG/YT
        longDescription: string; // for LI
        hashtags: string[];
    };
    audio: {
        recommendation: string; // "Trending Audio: 'Song Name by Artist'" or "Use a confident, upbeat voiceover."
    };
    storyboard: {
        scenes: string[]; // "Scene 1: Close-up of laptop screen with code...", "Scene 2:..."
        moodboard: string; // "Vibrant, techy, with blues and purples."
        transitions: string; // "Use a quick zoom cut for transitions."
    };
    cta: {
        suggestion: string; // "Follow us to see the launch!"
    };
}

export type ReelsContentResponse = ContentIdea[];

export type ReelsContentApiResponse = ReelsContentResponse | Clarification;

// === Startup Compliance AI Types ===
export interface ComplianceInput {
    startupName: string;
    numFounders: number;
    businessType: string;
    targetCustomers: 'India' | 'International';
    registrationType: 'Individual' | 'Partnership' | 'Private Limited (Pvt Ltd)' | 'LLP' | 'Not registered yet';
}

export interface RegistrationStep {
    step: number;
    title: string;
    description: string;
    link: string;
    notes: string;
}

export interface ComplianceResponse {
    registrationGuide: {
        title: string;
        summary: string;
        steps: RegistrationStep[];
        estimatedTime: string;
        estimatedCost: string;
    };
    cofounderAgreement: {
        title: string;
        description: string;
        template: string; // A string with placeholders like [FOUNDER_1_NAME]
    };
    nda: {
        title: string;
        description: string;
        template: string; // A string with placeholders like [RECIPIENT_NAME]
    };
    taxChecklist: {
        title: string;
        items: {
            title: string;
            details: string;
            link: string;
        }[];
    };
    pitchSafeDeck: {
        title: string;
        footerText: string;
        disclaimerText: string;
        sharingTips: string[];
    };
}

export type ComplianceApiResponse = ComplianceResponse | Clarification;


// === Dashboard & Feed Types ===
export interface TrendingIdea {
    emoji: string;
    title: string;
    description: string;
    domain: string;
}

export interface Testimonial {
    name: string;
    quote: string;
    role: string;
    avatarUrl: string;
}

export interface LiveNewsItem {
    icon: string;
    headline: string;
    source: string;
    url: string;
    domain?: string;
}

export interface Comment {
    id: string;
    authorId: string;
    content: string;
    timestamp: string;
}

export interface Post {
    id: string;
    authorId: string;
    content: string;
    timestamp: string;
    likes: string[]; // Array of user IDs who liked the post
    comments: Comment[];
}

// === News Explainer Types ===
export interface NewsExplanation {
    whatHappened: string;
    whyItMatters: string;
    whatYouCanLearn: string[];
}

export type NewsExplanationApiResponse = NewsExplanation | Clarification;


// === AI Growth Dashboard Types ===
export type StartupDataInput = StartupProfile & {
    weeklyActiveUsers: number;
    userAcquisition: number; // new users per week
    engagementRate: number; // as percentage
    churnRate: number; // as percentage
    monthlyRevenue: number;
};

export interface GrowthProjection {
    metric: string;
    change: string;
    rationale: string;
    chartType: 'line' | 'bar';
    data: { name: string; value: number; }[];
}

export interface GrowthExperiment {
    title: string;
    hypothesis: string;
    expectedImpact: string; // e.g., "+8% retention"
    executionSteps: string[]; // For Day 1-7
    toolsNeeded: string[];
    contentSample: {
        title: string;
        body: string;
    };
    projection?: GrowthProjection;
}

export interface RetentionLever {
    title: string;
    type: 'Habit Loop' | 'Re-engagement' | 'Notification';
    description: string;
    implementationIdea: string;
    projection?: GrowthProjection;
}

export interface ReferralStrategy {
    recommendedModel: 'Single-Sided' | 'Double-Sided' | 'Creator-Based';
    rationale: string;
    campaignFlow: string[];
    referralCopy: {
        headline: string;
        body: string;
        cta: string;
    };
    suggestedTools: string[];
}

export interface MonetizationPlaybook {
    title: string;
    type: 'Pricing Experiment' | 'Feature Gating' | 'Upsell Path';
    description: string;
    implementationIdea: string;
    projection?: GrowthProjection;
}

export interface ABTest {
    title: string;
    location: 'Homepage' | 'Pricing Page' | 'Onboarding' | 'CTA Button';
    hypothesis: string;
    variantA: {
        description: string;
        codeSnippet?: string; // HTML/JS snippet
    };
    variantB: {
        description: string;
        codeSnippet?: string;
    };
}

export interface GrowthAlert {
    title: string;
    severity: 'High' | 'Medium' | 'Low';
    metric: 'DAU Drop' | 'Churn Spike' | 'Feature Surge' | 'Cart Abandonment';
    observation: string;
    suggestion: string;
}

export interface FunnelData {
    acquisition: number;
    activation: number;
    retention: number;
    revenue: number;
    referral: number;
}

export interface TeamOpsTemplate {
    title: string;
    description: string;
    content: string; // Markdown content
}
export interface CollaborationBooster {
    title: string;
    type: 'Icebreaker' | 'Conflict Resolution' | 'Pulse Check' | 'Burnout Prevention';
    description: string;
    content: string; // Can be markdown for checklist or guide
}
export interface TeamOpsBrainstormPrompt {
    title: string;
    audience: 'Tech' | 'Design' | 'Marketing' | 'All';
    prompt: string;
}

export interface TeamOpsInsight {
    templates: TeamOpsTemplate[];
    collaborationBoosters: CollaborationBooster[];
    brainstormPrompts: TeamOpsBrainstormPrompt[];
}

export interface GrowthDashboardResponse {
    growthExperiments: GrowthExperiment[];
    retentionLevers: RetentionLever[];
    referralStrategy: ReferralStrategy;
    monetizationPlaybooks: MonetizationPlaybook[];
    abTests: ABTest[];
    alerts: GrowthAlert[];
    funnelAnalysis: {
        weakestStage: 'Acquisition' | 'Activation' | 'Retention' | 'Revenue' | 'Referral';
        suggestion: string;
    };
    teamOps: TeamOpsInsight;
}

export type GrowthDashboardApiResponse = GrowthDashboardResponse | Clarification;

// === AI Examiner Types ===
export interface AIEvaluation {
    overallScore: number;
    strengths: string[];
    areasForImprovement: {
        area: string;
        suggestion: string;
    }[];
    suggestedResources: {
        title: string;
        url: string;
        description: string;
    }[];
}

export type AIEvaluationApiResponse = AIEvaluation | Clarification;

// === Startup Mirror Types ===
export interface FounderCheckinInput {
    wentWrong: string;
    biggestBlocker: string;
    systemToFix: string;
}

export interface FounderReflectionAnalysis {
    burnoutScore: number; // 0-100
    burnoutAnalysis: string;
    mindfulnessExercises: {
        title: string;
        description: string;
        type: 'Breathing' | 'Journaling' | 'Habit';
    }[];
    delegationTemplates: {
        title: string;
        content: string; // Markdown
    }[];
}

export interface FounderLesson {
    title: string;
    source: string; // e.g., 'Y Combinator Blog'
    takeaways: string[];
    actionableSuggestion: string;
}

export interface FounderLogEntry {
    id: string;
    date: string; // ISO string
    checkin: FounderCheckinInput;
    analysis: FounderReflectionAnalysis;
    lesson: FounderLesson;
}

export interface FounderReflectionResponse {
    analysis: FounderReflectionAnalysis;
    lesson: FounderLesson;
}

export type FounderReflectionApiResponse = FounderReflectionResponse | Clarification;

// === AI Fundraising Co-pilot Types ===

export interface FundraisingInput {
    pitchDeckOutline: string;
    stage: string;
    sector: string;
    mrr_arr: number;
    dau_mau: number;
    cac: number;
    ltv: number;
    retention: number;
    growth_mom: number;
    tractionSummary: string;
}

export interface FundraisingReadiness {
    score: number;
    guidance: string;
}

export interface DeckDiagnostic {
    slide: string;
    score: number;
    feedback: string;
}

export interface InvestorPersona {
    type: string;
    description: string;
    examples: string[];
}

export interface OutreachTemplate {
    type: string;
    subject: string;
    body: string;
}

export interface FundingSource {
    name: string;
    description: string;
    examples: string[];
}

export interface FundraisingFunnel {
    outreach: number;
    intro: number;
    call: number;
    termSheet: number;
}

export interface FundraisingCopilotResponse {
    readiness: FundraisingReadiness;
    deckDiagnostics: DeckDiagnostic[];
    enhancedDeck: PitchDeckSlide[];
    investorPersonas: InvestorPersona[];
    outreachTemplates: OutreachTemplate[];
    fundingSources: FundingSource[];
    fundraisingFunnel: FundraisingFunnel;
}

export type FundraisingApiResponse = FundraisingCopilotResponse | Clarification;

// === Startup Problem-Solver Types ===
export interface DecisionTreeNode {
    id: string;
    question: string;
    options: {
        text: string;
        nextNodeId?: string;
        answer?: string;
    }[];
}

export interface ProblemSolverResponse {
    rootCause: {
        diagnosis: string;
        basedOn: string;
    };
    strategicBreakdown: {
        thisWeek: string[];
        thisMonth: string[];
        in90Days: string[];
    };
    decisionTree: DecisionTreeNode[]; // Array of nodes, starting with the first one
    benchmarks: {
        metric: string;
        value: string;
        source: string;
    }[];
    caseStudies: {
        title: string;
        source: string;
        takeaway: string;
        url: string;
    }[];
}

export interface ProblemSolverSession {
    id: string;
    date: string; // ISO string
    problem: string;
    solution: ProblemSolverResponse;
}

export type ProblemSolverApiResponse = ProblemSolverResponse | Clarification;
