import { GoogleGenAI, Type, Part } from "@google/genai";
import { ApiResponse, PitchApiResponse, LearningPathApiResponse, ReelsContentInput, ReelsContentApiResponse, ComplianceInput, ComplianceApiResponse, NewsExplanationApiResponse, StartupDataInput, GrowthDashboardApiResponse, AIEvaluationApiResponse, StartupProfile, FounderCheckinInput, FounderReflectionApiResponse, FundraisingInput, FundraisingApiResponse, User, ProblemSolverApiResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = <T>(jsonStr: string): T => {
    let parsableStr = jsonStr.trim();
    
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = parsableStr.match(fenceRegex);
    if (match && match[1]) {
      parsableStr = match[1].trim();
    } else {
      // If no fences, find the first '{' or '[' and the last '}' or ']'
      const firstBracket = parsableStr.indexOf('{');
      const firstSquare = parsableStr.indexOf('[');
      let firstIndex = -1;

      if (firstBracket > -1 && firstSquare > -1) {
          firstIndex = Math.min(firstBracket, firstSquare);
      } else if (firstBracket > -1) {
          firstIndex = firstBracket;
      } else {
          firstIndex = firstSquare;
      }

      const lastBracket = parsableStr.lastIndexOf('}');
      const lastSquare = parsableStr.lastIndexOf(']');
      let lastIndex = Math.max(lastBracket, lastSquare);
      
      if (firstIndex !== -1 && lastIndex > firstIndex) {
          parsableStr = parsableStr.substring(firstIndex, lastIndex + 1);
      }
    }
    
    try {
        const parsedData: T = JSON.parse(parsableStr);
        return parsedData;
    } catch (e) {
        console.error("Failed to parse JSON response content:", parsableStr);
        throw new Error("The AI returned a response in an unexpected format. Please try again.");
    }
};

// === PROJECT BUILDER SERVICE ===

const getProjectPrompt = (idea: string) => `
You are LEAP, an AI-Powered Project Builder for young Indian students (age 15-24). Your tone is beginner-friendly and encouraging. A student has provided an idea: "${idea}"

First, generate a complete project plan. Then, act as CollabMatch™, an AI teammate matcher. Based on the project, generate 2-3 fictional but realistic student builder profiles from a diverse pool in India who would be excellent collaborators. Ensure skill complementarity.

Your entire response MUST be a single, valid JSON object with no text outside of it. The JSON must follow this structure:

{
  "problemUnderstanding": { "rephrased": "...", "targetAudience": "..." },
  "suggestedMvp": { "description": "...", "features": ["...", "...", "..."] },
  "mvpFlowchart": "A simple Mermaid syntax flowchart using 'graph TD;'. IMPORTANT: Any node text containing special characters like parentheses () or brackets [] MUST be enclosed in double quotes. For example: A[\\"User Inputs (Amount, Category)\\"] --> B{Process Data};",
  "techStack": { "description": "...", "recommendations": [{ "name": "...", "tool": "...", "reason": "..." }] },
  "codeSnippet": { "title": "...", "language": "...", "code": "..." },
  "geminiIntegration": { "suggestion": "...", "apiEndpoint": "..." },
  "learningResources": [{ "title": "...", "url": "..." }],
  "studentBlueprint": { "title": "...", "tagline": "..." },
  "collaboratorMatches": [{ "name": "...", "leapScore": 0, "location": "...", "matchType": "...", "matchReason": "...", "topSkills": ["..."], "icebreaker": "...", "avatarUrl": "https://api.dicebear.com/8.x/adventurer/svg?seed=Rohan" }]
}

If the user's idea is too vague, instead return a JSON object with this structure:
{ "clarificationNeeded": "A friendly, gentle question to help the user clarify their idea." }
`;

export const generateProjectPlan = async (idea: string): Promise<ApiResponse> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [{ text: getProjectPrompt(idea) }] },
        config: { responseMimeType: "application/json", temperature: 0.5 }
    });
    return parseJsonResponse<ApiResponse>(response.text);
  } catch (error) {
    console.error("Error calling Gemini API for Project Plan:", error);
    throw new Error("Failed to get a response from the AI. Please check your connection and API key.");
  }
};


// === PITCH GENERATOR SERVICE ===

const getPitchPrompt = (startup: StartupProfile) => `
You are a world-class startup advisor and pitch deck expert for LEAP, a platform for young Indian student founders. Your tone is sharp, insightful, and encouraging.

A student has a startup idea, detailed in their profile:
- Startup Name: "${startup.name}"
- One-Liner: "${startup.oneLiner}"
- Target User: "${startup.targetAudience}"
- Industry: "${startup.domain}"
- Stage: "${startup.stage}"

Your task is to generate a complete, investor-ready pitch package based on this profile. The content should be professional, compelling, and follow proven templates from accelerators like YC and Sequoia.

Your entire response MUST be a single, valid JSON object with no text outside of it. The JSON must follow this exact structure:

{
  "nameSuggestions": [
    { "name": "StartupName1", "rationale": "Why this name works.", "domains": ["name1.in", "name1.ai"] },
    { "name": "StartupName2", "rationale": "...", "domains": ["name2.tech", "getname2.in"] }
  ],
  "oneLiner": "A clear, powerful one-liner based on the startup's profile. E.g., '${startup.oneLiner}'",
  "elevatorPitch": "A compelling 60-second elevator pitch.",
  "pitchDeck": [
    { "title": "1. The Problem", "content": ["Bullet point 1 about the problem.", "Bullet point 2.", "Bullet point 3, focusing on the pain point for the target user."] },
    { "title": "2. The Solution", "content": ["How your product solves the problem.", "Your unique value proposition.", "Why it's better than existing alternatives."] },
    { "title": "3. Market Opportunity", "content": ["Size of the market (TAM, SAM, SOM).", "Why now is the right time for this solution.", "Key trends in the Indian market."] },
    { "title": "4. The Product", "content": ["Description of the core product.", "Key Feature 1: Description.", "Key Feature 2: Description."] },
    { "title": "5. Business Model", "content": ["How the startup will make money (e.g., Freemium, Subscription, B2B).", "Pricing strategy.", "Lifetime Value (LTV) assumptions."] },
    { "title": "6. Traction & Roadmap", "content": ["Current status based on '${startup.stage}'.", "Product development roadmap for the next 3-6 months.", "Early user acquisition goals."] },
    { "title": "7. Competitor Comparison", "content": ["List 2-3 key competitors.", "A simple 2x2 matrix description (e.g., 'We are easier to use and more affordable than Competitor A').", "Our key defensible advantage."] },
    { "title": "8. Go-to-Market Strategy", "content": ["How you will reach your first 1000 users.", "Specific channels (e.g., College ambassador programs, Instagram marketing, partnerships).", "Initial marketing message."] },
    { "title": "9. The Team", "content": ["Founder 1: Name, background, and why they are the right person to build this.", "(Placeholder for future co-founders based on '${startup.teamMembers}')."] },
    { "title": "10. The Ask", "content": ["What you are asking for (e.g., 'Seeking a pre-seed round of ₹25 Lakhs', or 'Looking for a technical co-founder').", "How the funds will be used (e.g., '60% for product development, 40% for marketing').", "Contact information."] }
  ],
  "videoScript": "A 60-second, first-person video script for a pitch competition or reel. Start with a hook.",
  "linkedInPost": "A bold, engaging LinkedIn post draft announcing the project. Use a hook, tell a brief story, and include a call to action. Use hashtags like #BuildingInPublic #IndianStartup."
}

If the user's idea is too vague, instead return a JSON object with this structure:
{ "clarificationNeeded": "A friendly, gentle question. e.g., 'That's a great starting point! To create a strong pitch, could you tell me more about the specific problem you're solving for these users?'" }
`;

export const generatePitchContent = async (startup: StartupProfile): Promise<PitchApiResponse> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [{ text: getPitchPrompt(startup) }] },
        config: { responseMimeType: "application/json", temperature: 0.6 }
    });
    return parseJsonResponse<PitchApiResponse>(response.text);
  } catch (error) {
    console.error("Error calling Gemini API for Pitch Content:", error);
    throw new Error("Failed to get a response from the AI. Please check your connection and API key.");
  }
};


// === LEARNING PATH GENERATOR SERVICE ===

const getLearningPathPrompt = (idea: string, domain: string) => `
You are an expert mentor on LEAP, an AI platform for young Indian student builders. Your goal is to create a personalized "Zero-to-One Learning Path" based on a student's startup idea.

The student's idea is: "${idea}"
The selected domain is: "${domain}"

Generate a highly relevant, actionable, and personalized learning path. All resources MUST be free and easily accessible (YouTube, Docs, GitHub). Prioritize high-quality, modern resources.

Your entire response MUST be a single, valid JSON object with no text outside of it. The JSON must follow this exact structure:

{
  "youtubePlaylist": [
    { "title": "Full MERN Stack Crash Course", "url": "https://www.youtube.com/watch?v=...", "description": "A comprehensive tutorial covering MongoDB, Express, React, and Node.js, perfect for building the foundation of your app." },
    { "title": "Figma UI/UX Design Tutorial for Beginners", "url": "https://www.youtube.com/watch?v=...", "description": "Learn how to design beautiful and user-friendly interfaces for your EdTech app." }
  ],
  "techStackCrashCourse": [
    { "name": "React.js", "description": "The frontend library for building your user interface. It's component-based and highly popular.", "url": "https://react.dev/learn" },
    { "name": "Firebase", "description": "A great backend-as-a-service for beginners. Use it for authentication, database (Firestore), and hosting.", "url": "https://firebase.google.com/docs" }
  ],
  "caseStudies": [
    { "startupName": "Toppr (India)", "summary": "Toppr is an Indian EdTech company that provides personalized learning for K-12 students...", "keyTakeaways": ["Focused on a specific exam-prep niche initially.", "Used a freemium model to acquire a large user base.", "Strong focus on content quality and teacher-student interaction."] },
    { "startupName": "Vedantu (India)", "summary": "Vedantu offers live online tutoring for students across India...", "keyTakeaways": ["Pioneered the WAVE (Whiteboard Audio Video Environment) for interactive learning.", "Focused on teacher quality as a key differentiator.", "Expanded from K-12 into competitive exam prep."] }
  ],
  "roadmap": [
    { "week": 1, "title": "Fundamentals & Validation", "tasks": ["Complete the 'Intro to React' course.", "Talk to 10 potential users (students) to validate your core problem.", "Create a simple feature list for your MVP."] },
    { "week": 2, "title": "Design & Prototyping", "tasks": ["Watch the Figma tutorial and design the main 3 screens of your app.", "Create a clickable prototype in Figma.", "Set up your Firebase project."] },
    { "week": 3, "title": "Core MVP Development", "tasks": ["Build the user login and signup flow using Firebase Authentication.", "Develop the main dashboard UI in React.", "Connect your frontend to Firestore to save and retrieve data."] },
    { "week": 4, "title": "Testing & Deployment", "tasks": ["Test the application with a few friends for feedback.", "Fix major bugs found during testing.", "Deploy the first version of your application using Firebase Hosting."] }
  ]
}

If the user's idea is too vague, return a JSON object with this structure:
{ "clarificationNeeded": "A friendly, gentle question. e.g., 'That's an exciting idea! To create a focused learning path, could you tell me a bit more about what makes your EdTech app unique?'" }
`;

export const generateLearningPath = async (idea: string, domain: string): Promise<LearningPathApiResponse> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [{ text: getLearningPathPrompt(idea, domain) }] },
        config: { responseMimeType: "application/json", temperature: 0.5 }
    });
    return parseJsonResponse<LearningPathApiResponse>(response.text);
  } catch (error) {
    console.error("Error calling Gemini API for Learning Path:", error);
    throw new Error("Failed to get a response from the AI. Please check your connection and API key.");
  }
};


// === REELS-TO-RICHES AI SERVICE ===

const getReelsPrompt = (inputs: ReelsContentInput) => `
You are "Reels-to-Riches AI", a creative strategist for LEAP, helping young Indian startup founders generate social media content. Your tone is trendy, encouraging, and expert.

A founder provides the following details:
- Startup Name: "${inputs.startupName}"
- Domain: "${inputs.domain}"
- Stage: "${inputs.stage}"
- Target Platforms: ${inputs.platforms.join(', ')}
- Preferred Language: "${inputs.language}"

Your task is to generate a content plan for EACH of the specified platforms. The content must be tailored to the platform's format and audience. For example, LinkedIn should be more professional.

Your entire response MUST be a single, valid JSON object with no text outside of it. The JSON must be an array of objects, where each object follows this exact structure:

{
  "platform": "Instagram" | "LinkedIn" | "YouTube Shorts",
  "idea": {
    "hook": "A 3-second hook to grab attention.",
    "purpose": "e.g., Education, Community Building, Behind-the-Scenes",
    "title": "A catchy title for the content piece."
  },
  "script": {
    "shortCaption": "A concise caption for Instagram/YouTube (under 150 chars).",
    "longDescription": "A more detailed, professional post for LinkedIn. If the platform is not LinkedIn, this can be a slightly longer version of the short caption.",
    "hashtags": ["#relevant", "#hashtags", "#indianstartup"]
  },
  "audio": {
    "recommendation": "Suggest a specific trending audio by name/artist, or recommend a type of voiceover (e.g., 'Confident, upbeat voiceover')."
  },
  "storyboard": {
    "scenes": [
      "Scene 1: Description of the visual shot.",
      "Scene 2: Description of the next shot.",
      "Scene 3: On-screen text suggestion."
    ],
    "moodboard": "Describe the visual style, e.g., 'Minimalist, bright, with pops of brand color.'",
    "transitions": "Suggest transition types, e.g., 'Quick cuts, whip pan.'"
  },
  "cta": {
    "suggestion": "A clear call-to-action for the end of the video/post."
  }
}

Ensure the language used in the generated content (hooks, captions, etc.) reflects the user's preference: "${inputs.language}". Generate one JSON object in the array for each platform in [${inputs.platforms.map(p => `"${p}"`).join(', ')}].

If the user's input is too vague, instead return a JSON object with this structure:
{ "clarificationNeeded": "A friendly question to get more details. e.g., 'That's a great start! To make the best content, could you tell me one unique feature of your startup?'" }
`;

export const generateReelsContent = async (inputs: ReelsContentInput): Promise<ReelsContentApiResponse> => {
  if (inputs.platforms.length === 0) {
      return { clarificationNeeded: "Please select at least one platform to generate content for!" };
  }
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [{ text: getReelsPrompt(inputs) }] },
        config: { responseMimeType: "application/json", temperature: 0.7 }
    });
    return parseJsonResponse<ReelsContentApiResponse>(response.text);
  } catch (error) {
    console.error("Error calling Gemini API for Reels Content:", error);
    throw new Error("Failed to get a response from the AI for Reels content. Please try again.");
  }
};

// === STARTUP COMPLIANCE AI SERVICE ===

const getCompliancePrompt = (inputs: ComplianceInput) => `
You are "Startup Compliance AI", an expert legal assistant on LEAP, designed for young Indian student founders. Your tone is clear, simple, and encouraging, avoiding complex legal jargon.

A founder provides these details:
- Startup Name: "${inputs.startupName}"
- Number of Founders: ${inputs.numFounders}
- Type of Business: "${inputs.businessType}"
- Target Customers: "${inputs.targetCustomers}"
- Current Registration Status: "${inputs.registrationType}"

Your task is to generate a comprehensive, India-specific legal and compliance starter pack. It must be a single, valid JSON object with no text outside of it, following this exact structure:

{
  "registrationGuide": {
    "title": "Your Guide to Registering as a ${inputs.registrationType}",
    "summary": "A simple summary of what this registration means for the startup.",
    "steps": [
      { "step": 1, "title": "Obtain Director Identification Number (DIN)", "description": "Each director needs a DIN. This is a simple online application.", "link": "https://www.mca.gov.in/", "notes": "Keep your PAN card and address proof ready." },
      { "step": 2, "title": "Apply for Digital Signature Certificate (DSC)", "description": "A DSC is required to sign documents electronically.", "link": "https://www.mca.gov.in/content/mca/global/en/foportal/fologin.html", "notes": "This can be obtained from certified agencies." }
    ],
    "estimatedTime": "e.g., 2-3 weeks",
    "estimatedCost": "e.g., ₹5,000 - ₹10,000"
  },
  "cofounderAgreement": {
    "title": "Basic Co-founder Agreement",
    "description": "A simple, non-binding agreement to align all founders. It is highly recommended to consult a lawyer for a formal, legally binding document.",
    "template": "This Co-founder Agreement is made on [DATE] between [FOUNDER_1_NAME], [FOUNDER_2_NAME]. The founders agree to the following equity split: [EQUITY_SPLIT_DETAILS]..."
  },
  "nda": {
    "title": "Standard Non-Disclosure Agreement (NDA)",
    "description": "Use this simple NDA when discussing your idea with potential interns, vendors, or collaborators. It is a one-way NDA protecting your information.",
    "template": "This Non-Disclosure Agreement is entered into between ${inputs.startupName} (the 'Disclosing Party') and [RECIPIENT_NAME] (the 'Receiving Party') for the purpose of preventing the unauthorized disclosure of Confidential Information..."
  },
  "taxChecklist": {
    "title": "GST & Tax Compliance Checklist",
    "items": [
      { "title": "Is GST Mandatory?", "details": "For your business type, GST registration is mandatory if your annual turnover exceeds ₹20 lakhs (₹10 lakhs for special category states).", "link": "https://www.gst.gov.in/" },
      { "title": "PAN & TAN", "details": "Your business will need a PAN (Permanent Account Number) and likely a TAN (Tax Deduction and Collection Account Number) if you plan to deduct TDS.", "link": "https://www.incometaxindia.gov.in/" }
    ]
  },
  "pitchSafeDeck": {
    "title": "Pitch-Safe Deck Tips",
    "footerText": "Confidential and Proprietary. Copyright (c) ${new Date().getFullYear()} ${inputs.startupName}. All Rights Reserved.",
    "disclaimerText": "This presentation is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any securities.",
    "sharingTips": [
      "Always share as a PDF, not an editable file.",
      "Use a 'doc send' service like DocSend or Fynk to track views and add watermarks.",
      "Include the confidentiality footer on every slide."
    ]
  }
}

If the user's input is unclear, return a JSON object with this structure:
{ "clarificationNeeded": "A friendly question to get more details. e.g., 'To give you the right compliance steps, could you clarify if your product is a physical good or a digital service?'" }
`;

export const generateComplianceDocs = async (inputs: ComplianceInput): Promise<ComplianceApiResponse> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [{ text: getCompliancePrompt(inputs) }] },
        config: { responseMimeType: "application/json", temperature: 0.4 }
    });
    return parseJsonResponse<ComplianceApiResponse>(response.text);
  } catch (error) {
    console.error("Error calling Gemini API for Compliance Docs:", error);
    throw new Error("Failed to get a response from the AI for compliance documents. Please try again.");
  }
};


// === NEWS EXPLAINER SERVICE ===

const getNewsExplainerPrompt = (headline: string, url: string) => `
You are an expert startup analyst for LEAP, an AI platform for young Indian entrepreneurs. Your goal is to explain a news article in a simple, insightful way for a student audience.

Here is the article headline and URL:
- Headline: "${headline}"
- URL: "${url}"

Please explain this news in the following structured JSON format. Your tone should be encouraging and focus on actionable takeaways.

Your entire response MUST be a single, valid JSON object with no text outside of it. The JSON must follow this exact structure:

{
  "whatHappened": "A brief, one-sentence summary of the core event. E.g., 'An AgriTech startup just raised $2M to expand its smart farming tools.'",
  "whyItMatters": "Explain the significance for the Indian startup ecosystem or for student founders. E.g., 'This shows strong investor confidence in rural tech and proves that impactful ideas can attract funding.'",
  "whatYouCanLearn": [
    "A takeaway or lesson. e.g., 'Solving a specific, local problem can be more valuable than chasing a global trend.'",
    "Another takeaway. e.g., 'A strong founding team with domain expertise is critical for investor trust.'"
  ]
}

If the article content cannot be accessed or understood, instead return a JSON object with this structure:
{ "clarificationNeeded": "Could not access the article content. The headline suggests it's about a specific topic, but more context is needed." }
`;

export const generateNewsExplanation = async (headline: string, url: string): Promise<NewsExplanationApiResponse> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [{ text: getNewsExplainerPrompt(headline, url) }] },
        config: { responseMimeType: "application/json", temperature: 0.3 }
    });
    return parseJsonResponse<NewsExplanationApiResponse>(response.text);
  } catch (error) {
    console.error("Error calling Gemini API for News Explanation:", error);
    throw new Error("Failed to get a summary from the AI. The article might be inaccessible or the service is busy.");
  }
};


// === AI GROWTH DASHBOARD SERVICE ===

const getGrowthDashboardPrompt = (inputs: StartupDataInput) => `
You are a world-class Growth Partner and Operations AI for startup founders on the LEAP platform. Your mission is to provide actionable, data-driven, and domain-specific growth strategies. A founder has provided the following data about their startup:

- Company Name: "${inputs.name}"
- One-Liner: "${inputs.oneLiner}"
- Domain: "${inputs.domain}"
- Product Type: "${inputs.productType}"
- Stage: "${inputs.stage}"
- Target Audience: "${inputs.targetAudience}"
- Team Size: "${inputs.teamMembers}"
- Has Tech Team: ${inputs.hasTechTeam}
- Acquisition Channels: "${inputs.customerAcquisitionChannels}"
- Key Metrics: 
  - Weekly Active Users: ${inputs.weeklyActiveUsers}
  - New Users per Week: ${inputs.userAcquisition}
  - Engagement Rate: ${inputs.engagementRate}%
  - Churn Rate: ${inputs.churnRate}%
  - Monthly Revenue: ₹${inputs.monthlyRevenue}

Based on this data, generate a comprehensive growth and operations dashboard. Your entire response MUST be a single, valid JSON object. The JSON must follow this exact structure:

{
  "growthExperiments": [
    { "title": "...", "hypothesis": "...", "expectedImpact": "+X% metric", "executionSteps": ["Day 1: ...", "Day 2-3: ..."], "toolsNeeded": ["Tool 1", "Tool 2"], "contentSample": { "title": "...", "body": "..." }, "projection": { "metric": "DAU", "change": "+10%", "rationale": "Based on industry benchmarks for similar apps, this could boost daily active users.", "chartType": "line", "data": [{ "name": "Day 0", "value": ${inputs.weeklyActiveUsers / 7} }, { "name": "Day 15", "value": ${inputs.weeklyActiveUsers / 7 * 1.05} }, { "name": "Day 30", "value": ${inputs.weeklyActiveUsers / 7 * 1.1} }] } }
  ],
  "retentionLevers": [
    { "title": "...", "type": "Habit Loop", "description": "...", "implementationIdea": "...", "projection": { "metric": "Churn", "change": "-5%", "rationale": "Gamified streaks increase user investment and reduce churn.", "chartType": "bar", "data": [{ "name": "Before", "value": ${inputs.churnRate} }, { "name": "After", "value": ${inputs.churnRate * 0.95} }] } }
  ],
  "referralStrategy": {
    "recommendedModel": "Single-Sided" | "Double-Sided" | "Creator-Based", "rationale": "...", "campaignFlow": ["Step 1: ...", "Step 2: ..."], "referralCopy": { "headline": "...", "body": "...", "cta": "..." }, "suggestedTools": ["Tool 1"]
  },
  "monetizationPlaybooks": [
    { "title": "...", "type": "Pricing Experiment", "description": "...", "implementationIdea": "...", "projection": { "metric": "Revenue", "change": "+20%", "rationale": "Introducing a premium tier can significantly increase revenue from power users.", "chartType": "bar", "data": [{ "name": "Current", "value": ${inputs.monthlyRevenue} }, { "name": "Projected", "value": ${inputs.monthlyRevenue * 1.2} }] } }
  ],
  "abTests": [
    { "title": "...", "location": "Homepage", "hypothesis": "...", "variantA": { "description": "Current CTA button" }, "variantB": { "description": "New CTA button with different text" } }
  ],
  "alerts": [
    { "title": "High Churn Rate Alert", "severity": "High", "metric": "Churn Spike", "observation": "Your churn rate of ${inputs.churnRate}% is higher than the industry average for a ${inputs.stage} ${inputs.domain} startup.", "suggestion": "Focus on implementing one of the suggested Retention Levers immediately." }
  ],
  "funnelAnalysis": {
    "weakestStage": "Activation",
    "suggestion": "Your user acquisition is steady but activation is low. Focus on improving the onboarding experience to show users the value faster."
  },
  "teamOps": {
    "templates": [
      { "title": "Founder's Vision Statement", "description": "A template to articulate and share your long-term vision.", "content": "# Our Vision\\n\\n## Mission\\nOur mission is to...\\n\\n## North Star\\nBy 2026, we will be..." },
      { "title": "Weekly Team Stand-up Agenda", "description": "A structured agenda for effective weekly check-ins.", "content": "# Weekly Stand-up\\n\\n**Date:** [DATE]\\n\\n## Agenda\\n1. Wins from last week (5 mins)\\n2. Priorities for this week (10 mins)\\n3. Blockers (5 mins)" }
    ],
    "collaborationBoosters": [
        { "title": "Weekly Burnout Check-in", "type": "Burnout Prevention", "description": "A simple pulse check for team well-being.", "content": "1. On a scale of 1-5, how is your energy this week?\\n2. What's one thing that energized you?\\n3. What's one thing that drained you?" }
    ],
    "brainstormPrompts": [
      { "title": "For All Hands", "audience": "All", "prompt": "If we had an unlimited budget for one week, what is the single most impactful thing we could do for our users?" }
    ]
  }
}

**Instructions:**
- Generate 2-3 items for each array section (growthExperiments, retentionLevers, etc.).
- Ensure all suggestions are highly relevant to the startup's domain (${inputs.domain}), product type (${inputs.productType}), and stage (${inputs.stage}).
- Use the provided metrics to inform your "alerts" and "funnelAnalysis". For example, if churn is high, focus on retention.
- For each experiment, retention lever, and monetization playbook, you MUST provide a 'projection' object.
- Be creative and specific. Instead of "Improve onboarding", suggest "Add a 3-step checklist to the onboarding flow to guide users to their 'aha' moment."
`;

export const generateGrowthInsights = async (inputs: StartupDataInput): Promise<GrowthDashboardApiResponse> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [{ text: getGrowthDashboardPrompt(inputs) }] },
        config: { responseMimeType: "application/json", temperature: 0.7 }
    });
    return parseJsonResponse<GrowthDashboardApiResponse>(response.text);
  } catch (error) {
    console.error("Error calling Gemini API for Growth Insights:", error);
    throw new Error("Failed to get a response from the AI for the Growth Dashboard. Please try again.");
  }
};

// === AI EXAMINER SERVICE ===

const getAIEvaluationPrompt = (transcript: { speaker: string, text: string }[]) => `
You are an expert Pitch Coach and Communication Analyst for LEAP, an AI platform for young Indian entrepreneurs. Your goal is to provide constructive, encouraging, and actionable feedback based on a mock interview transcript.

The transcript below contains a conversation between an AI examiner and a student candidate.
TRANSCRIPT:
${transcript.map(t => `${t.speaker}: ${t.text}`).join('\n')}

Based on the transcript and the provided images, analyze the candidate's performance. Focus on the clarity of their idea, problem definition, solution, market awareness, and overall communication. Evaluate their confidence based on visual cues if available.

Your entire response MUST be a single, valid JSON object. The JSON must follow this exact structure:

{
  "overallScore": 85,
  "strengths": [
    "A clear and concise introduction.",
    "Good articulation of the problem statement."
  ],
  "areasForImprovement": [
    {
      "area": "Market Sizing",
      "suggestion": "The candidate could have provided more specific data (TAM, SAM, SOM) to back up their market claims. The answer was a bit generic."
    },
    {
      "area": "Confidence",
      "suggestion": "While the answers were good, the candidate appeared to look away from the camera frequently, which can be perceived as a lack of confidence. Practice maintaining eye contact."
    }
  ],
  "suggestedResources": [
    {
      "title": "How to Pitch a Company | Y Combinator",
      "description": "A great video on the fundamentals of a strong startup pitch.",
      "url": "https://www.youtube.com/watch?v=small-url"
    },
    {
        "title": "Presenting with Confidence",
        "description": "Tips and tricks for improving on-stage (or on-camera) presence.",
        "url": "https://www.coursera.org/some-course"
    }
  ]
}

If the transcript is too short or doesn't provide enough information for a meaningful evaluation, instead return a JSON object with this structure:
{ "clarificationNeeded": "The interview transcript is too short to provide a detailed evaluation. Please complete a full interview." }
`;

export const generateAIEvaluation = async (transcript: { speaker: string; text: string; }[], imageParts: Part[]): Promise<AIEvaluationApiResponse> => {
    try {
        const textPart = { text: getAIEvaluationPrompt(transcript) };
        const contents: { parts: Part[] } = { parts: [textPart, ...imageParts] };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: { responseMimeType: "application/json", temperature: 0.6 }
        });
        return parseJsonResponse<AIEvaluationApiResponse>(response.text);
    } catch (error) {
        console.error("Error calling Gemini API for AI Evaluation:", error);
        throw new Error("Failed to get a response from the AI for the evaluation. Please try again.");
    }
};

// === STARTUP MIRROR SERVICE ===
const getFounderReflectionPrompt = (checkin: FounderCheckinInput, startup: StartupProfile) => `
You are "Startup Mirror", a private, empathetic AI reflection partner for startup founders on the LEAP platform. Your tone is wise, supportive, and non-judgmental. You are NOT a therapist, but a resilience coach.

A founder has submitted their weekly private reflection. Here is their startup profile and their log:
- Startup: "${startup.name}" (${startup.oneLiner})
- Domain: ${startup.domain}
- Stage: ${startup.stage}

This week's reflection:
- What went wrong? "${checkin.wentWrong}"
- Biggest blocker? "${checkin.biggestBlocker}"
- One system to fix? "${checkin.systemToFix}"

Your task is to analyze this reflection and provide supportive, actionable feedback. Your entire response MUST be a single, valid JSON object with no text outside of it. The JSON must follow this exact structure:

{
  "analysis": {
    "burnoutScore": 85,
    "burnoutAnalysis": "A short, empathetic paragraph (2-3 sentences) acknowledging their struggles without being patronizing. Connect it to the founder journey.",
    "mindfulnessExercises": [
      { "title": "5-Minute Mindful Break", "description": "A simple, actionable exercise. e.g., 'Close your eyes and focus on your breath. Notice the sensation of air. Do this for 5 minutes.'", "type": "Breathing" }
    ],
    "delegationTemplates": [
      { "title": "Weekly Task Delegation SOP", "content": "# Task: [Task Name]\\n## Owner: [Team Member]\\n## Desired Outcome: [Clear goal]\\n## Deadline: [Date]" }
    ]
  },
  "lesson": {
    "title": "A relevant case study title from a well-known startup. e.g., 'How Figma's Async Communication Avoided Burnout'",
    "source": "e.g., 'First Round Review', 'YC Blog', 'Lenny's Newsletter'",
    "takeaways": ["A key lesson from the case study.", "Another key lesson."],
    "actionableSuggestion": "A single, concrete suggestion for this founder based on their startup stage and the lesson. e.g., 'For your MVP stage, try implementing a 15-minute daily async standup in Slack to improve communication.'"
  }
}
Please generate a realistic burnoutScore between 0 and 100 based on the tone, language (e.g., words like 'exhausted', 'overwhelmed', 'stuck'), and severity of issues. High score = high burnout risk.
`;

export const generateFounderReflection = async (checkin: FounderCheckinInput, startup: StartupProfile): Promise<FounderReflectionApiResponse> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [{ text: getFounderReflectionPrompt(checkin, startup) }] },
        config: { responseMimeType: "application/json", temperature: 0.7 }
    });
    return parseJsonResponse<FounderReflectionApiResponse>(response.text);
  } catch (error) {
    console.error("Error calling Gemini API for Founder Reflection:", error);
    throw new Error("Failed to get a response from the AI for your reflection. Please try again.");
  }
};

// === AI FUNDRAISING CO-PILOT SERVICE ===

const getFundraisingPrompt = (input: FundraisingInput) => `
You are an AI Co-pilot for LEAP, simulating a top-tier VC partner from a firm like Sequoia or Accel. Your audience is startup founders in India seeking Series A or later funding. Your analysis must be sharp, investor-grade, and actionable.

A founder provides the following data:
- Pitch Deck Outline: "${input.pitchDeckOutline}"
- Startup Stage: "${input.stage}"
- Sector: "${input.sector}"
- Key Metrics:
  - MRR/ARR: ${input.mrr_arr}
  - DAU/MAU: ${input.dau_mau}
  - CAC: ${input.cac}
  - LTV: ${input.ltv}
  - Retention %: ${input.retention}
  - Growth % (MoM): ${input.growth_mom}
- Traction Summary: "${input.tractionSummary}"

Based on this, generate a comprehensive fundraising assistance package. Your entire response MUST be a single, valid JSON object following this exact structure:

{
  "readiness": {
    "score": 82,
    "guidance": "Your traction is strong, but the deck's narrative needs sharpening for Series A investors. Focus on defensibility and ROI."
  },
  "deckDiagnostics": [
    { "slide": "Problem", "score": 9, "feedback": "Clear and compelling problem statement. Well done." },
    { "slide": "Solution", "score": 7, "feedback": "Good, but needs to better articulate the 'secret sauce' or unique insight." },
    { "slide": "Market Size (TAM, SAM, SOM)", "score": 6, "feedback": "Market sizing feels top-down. Provide a bottoms-up analysis to build more credibility." },
    { "slide": "Go-to-Market", "score": 5, "feedback": "Lacks measurable execution channels. Series A investors need to see a clear, scalable GTM plan." },
    { "slide": "Financials / The Ask", "score": 7, "feedback": "The 'ask' is clear, but the use of funds needs to be more detailed and tied to specific growth milestones." }
  ],
  "enhancedDeck": [
    { "title": "1. The Vision", "content": ["A compelling one-liner vision for the company."] },
    { "title": "2. The Problem", "content": ["Quantify the pain point. Use a relatable user story."] },
    { "title": "3. The Solution", "content": ["Show, don't just tell. Describe the core user experience.", "Highlight the key 'aha' moment for users."] },
    { "title": "4. Why Now?", "content": ["Market trends (e.g., policy changes, tech adoption) that make this the perfect time.", "Your unique insight into the market shift."] },
    { "title": "5. Market Opportunity", "content": ["Bottoms-up TAM, SAM, SOM analysis for the Indian context.", "e.g., (Number of target users) x (Avg. revenue per user) = SAM."] },
    { "title": "6. Traction", "content": ["MRR/ARR Growth: ${input.mrr_arr}", "DAU/MAU Engagement: ${input.dau_mau}", "Key metric charts (e.g., 'Revenue Growth (MoM)', 'User Retention Cohorts'). Describe the chart to be made.", "Key customer logos or testimonials."] },
    { "title": "7. Business Model", "content": ["Clear pricing strategy and justification.", "LTV:CAC ratio: ${input.ltv / input.cac}", "Payback period analysis."] },
    { "title": "8. Go-to-Market Strategy", "content": ["Detail 1-2 primary, scalable acquisition channels.", "Show proof of early success in these channels.", "Unit economics of acquisition."] },
    { "title": "9. Competition", "content": ["A 2x2 matrix showing your unique positioning.", "Acknowledge competitors but highlight your defensible moat (e.g., tech, network effects, brand)."] },
    { "title": "10. The Team", "content": ["Highlight founders' unique qualifications and past successes relevant to this venture."] },
    { "title": "11. The Ask & Financials", "content": ["Asking for $X million to achieve Y milestones over Z months.", "Detailed use of funds (e.g., 40% engineering, 30% sales/marketing, 20% ops).", "3-year financial projections (high-level)."] }
  ],
  "investorPersonas": [
    { "type": "Sector-focused VC", "description": "Look for VCs in India with a dedicated fund or strong portfolio in ${input.sector}. They will understand the nuances of your market and provide relevant expertise.", "examples": ["Blume Ventures", "Kalaari Capital", "3one4 Capital"] },
    { "type": "Growth-Stage Funds", "description": "As you are Series A or later, target funds that specialize in scaling companies with proven product-market fit. They provide capital and operational support for expansion.", "examples": ["Sequoia Capital India (Surge)", "Accel India", "Lightspeed India"] }
  ],
  "outreachTemplates": [
    { "type": "Cold Email", "subject": "Intro: [Your Startup Name] - Scaling ${input.sector} in India", "body": "Hi [Investor Name],\\n\\nI'm the founder of [Startup Name], a [one-liner description]. We're seeing strong traction, including [mention a key metric like ${input.mrr_arr} ARR or ${input.growth_mom}% MoM growth].\\n\\nWe are currently raising our Series A to scale our GTM efforts and expand our engineering team. Given your fund's focus on ${input.sector}, I thought it could be a great fit.\\n\\nWould you be open to a brief 15-minute chat next week?\\n\\nBest,\\n[Your Name]" },
    { "type": "Warm Intro Request", "subject": "Intro request: [Your Startup Name] <> [Investor Name]", "body": "Hi [Connector Name],\\n\\nHope you're well. I'm reaching out because I see you're connected to [Investor Name] at [VC Firm].\\n\\nWe're raising our Series A for [Startup Name] and are seeing strong growth (e.g., ${input.growth_mom}% MoM). Given their thesis, I believe they would be a great value-add investor. Would you be open to making a brief email introduction? I've attached a one-pager for context.\\n\\nThanks,\\n[Your Name]" }
  ],
  "fundingSources": [
    { "name": "Venture Debt Funds", "description": "Consider for non-dilutive capital to extend your runway, especially if you have predictable revenue. Useful for financing inventory, capex, or marketing spend without giving up equity.", "examples": ["Trifecta Capital", "InnoVen Capital", "Alteria Capital"] },
    { "name": "AngelList Syndicates (India)", "description": "A good way to consolidate smaller checks from strategic angels and operators alongside a lead investor. Helps fill out a round quickly.", "examples": ["LetsVenture", "AngelList India"] },
    { "name": "Government Grants", "description": "Explore grants from programs like Startup India Seed Fund Scheme or Nidhi-Prayas if you meet their criteria. Non-dilutive but can have specific application processes.", "examples": ["Startup India Seed Fund", "BIRAC"] }
  ],
  "fundraisingFunnel": {
    "outreach": 150,
    "intro": 50,
    "call": 20,
    "termSheet": 3
  }
}
`;

export const generateFundraisingAnalysis = async (input: FundraisingInput): Promise<FundraisingApiResponse> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: getFundraisingPrompt(input) }] },
            config: { responseMimeType: "application/json", temperature: 0.6 }
        });
        return parseJsonResponse<FundraisingApiResponse>(response.text);
    } catch (error) {
        console.error("Error calling Gemini API for Fundraising Co-pilot:", error);
        throw new Error("Failed to get a response from the AI for your fundraising analysis. Please try again.");
    }
};


// === STARTUP PROBLEM-SOLVER SERVICE ===
const getProblemSolverPrompt = (problem: string, user: User) => {
    if (!user.startup) return ''; // Should be handled before calling
    return `
You are "LEAP Growth Consultant", a 24x7 AI advisor for student startup founders on the LEAP platform. Your tone is that of an experienced, sharp, and encouraging mentor, like a partner from a top VC firm.

A founder, ${user.fullName}, has provided their startup details and a problem they are facing.
**Founder & Startup Context:**
- Founder Name: ${user.fullName}
- Startup Name: ${user.startup.name}
- One-Liner: ${user.startup.oneLiner}
- Domain: ${user.startup.domain}
- Product Type: ${user.startup.productType}
- Stage: ${user.startup.stage}
- Team: ${user.startup.teamMembers}
- Key Metrics: ${JSON.stringify(user.startup.metrics || {})}

**The Founder's Problem:**
"${problem}"

**Your Task:**
Analyze this problem in the context of their startup and generate a comprehensive, actionable solution. Your entire response MUST be a single, valid JSON object following this exact structure. Do not include any text outside the JSON object.

{
  "rootCause": {
    "diagnosis": "A concise, expert diagnosis of the likely root cause. Be specific to the startup's domain and stage.",
    "basedOn": "A short explanation of why you reached this diagnosis, referencing their context (e.g., 'For an early-stage ${user.startup.domain} app like yours...')."
  },
  "strategicBreakdown": {
    "thisWeek": ["Actionable task for this week.", "Another task for this week."],
    "thisMonth": ["A goal for this month.", "A strategic initiative for the month."],
    "in90Days": ["A long-term objective for the quarter."]
  },
  "decisionTree": [
    {
      "id": "start",
      "question": "A logical first question to dig deeper into the problem.",
      "options": [
        { "text": "Yes, we do.", "nextNodeId": "node_yes" },
        { "text": "No, we don't.", "nextNodeId": "node_no" }
      ]
    },
    {
      "id": "node_yes",
      "question": "A follow-up question if they answered yes.",
      "options": [
        { "text": "Option A", "answer": "A concluding piece of advice based on this path." },
        { "text": "Option B", "answer": "Another concluding piece of advice." }
      ]
    },
    {
      "id": "node_no",
      "question": "A follow-up question if they answered no.",
      "options": [
        { "text": "Okay, I understand.", "answer": "Actionable advice for someone without this resource." }
      ]
    }
  ],
  "benchmarks": [
    {
      "metric": "e.g., LTV:CAC Ratio",
      "value": "e.g., 3:1 or higher",
      "source": "e.g., for B2B SaaS at Seed stage"
    }
  ],
  "caseStudies": [
    {
      "title": "e.g., How Superhuman Onboarded Its First 100k Users",
      "source": "First Round Review",
      "takeaway": "A single, powerful takeaway from the case study that is relevant to the founder's problem.",
      "url": "https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit"
    }
  ]
}

If the user's problem is too vague, return a JSON object with this structure:
{ "clarificationNeeded": "A friendly, clarifying question. e.g., 'That's a key challenge. To help, could you tell me more about what you've tried so far to address this?'" }

Make the decision tree practical with 2-4 nodes.
`;
}

export const generateProblemSolution = async (problem: string, user: User): Promise<ProblemSolverApiResponse> => {
    if (!user.startup) {
        throw new Error("User does not have a startup profile.");
    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: getProblemSolverPrompt(problem, user) }] },
            config: { responseMimeType: "application/json", temperature: 0.7 }
        });
        return parseJsonResponse<ProblemSolverApiResponse>(response.text);
    } catch (error) {
        console.error("Error calling Gemini API for Problem Solver:", error);
        throw new Error("Failed to get a response from the AI for the Problem Solver. Please try again.");
    }
};
