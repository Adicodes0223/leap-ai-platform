import { TrendingIdea, Testimonial, Post, User, LiveNewsItem } from './types';

// Extended User type for mock DB to include password for login simulation
type UserWithPassword = User & { password?: string };

export const usersDB: UserWithPassword[] = [
    {
        id: 'user-1',
        username: 'shreya',
        email: 'shreya@iitb.ac.in',
        fullName: 'Shreya Kolhatkar',
        educationLevel: 'Under-Graduate',
        institution: 'IIT Bombay',
        degree: 'B.Tech in CS',
        graduationYear: '2025',
        skills: 'React, Python, UI/UX',
        interests: 'EdTech, AI',
        isAdmin: false,
        bio: 'Building the future of education, one line of code at a time. Part of the LEAP community at IIT Bombay.',
        profilePictureUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Shreya&backgroundColor=c0aede',
        followers: ['user-2', 'admin-1'],
        following: ['user-2', 'admin-1', 'user-3', 'user-4'],
        password: 'password123',
        role: 'Founder',
        location: 'Mumbai, India',
        startup: {
            name: 'Attend.ly',
            oneLiner: 'An AI-powered attendance tracker for college students.',
            domain: 'EdTech',
            productType: 'Software',
            targetAudience: 'College students in India',
            stage: 'MVP',
            teamMembers: '1 founder',
            hasTechTeam: true,
            website: 'https://attendly.leap.io',
            metrics: {
                weeklyActiveUsers: 50,
                monthlyActiveUsers: 200,
                totalUsers: 500,
                monthlyRevenue: 0,
                engagementRate: 15,
                userAcquisition: 10,
                churnRate: 8
            }
        },
        founderLogs: [
            {
                id: 'log-1',
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
                checkin: { wentWrong: 'Launch was delayed due to a critical bug.', biggestBlocker: 'Team communication on the bug was slow.', systemToFix: 'Our pre-deployment checklist.' },
                analysis: {
                    burnoutScore: 65,
                    burnoutAnalysis: 'It sounds like a stressful week with the launch delay. It\'s common to feel pressure when plans go awry. Remember to separate the outcome from your effort.',
                    mindfulnessExercises: [{ title: 'Box Breathing', description: 'Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s. Repeat 5 times.', type: 'Breathing' }],
                    delegationTemplates: [{ title: 'Bug Triage SOP', content: '1. Acknowledge bug report...\n2. Assign severity...' }]
                },
                lesson: {
                    title: 'How Superhuman Built an Engine for Product/Market Fit',
                    source: 'First Round Review',
                    takeaways: ['Measure PMF with a leading indicator.', 'Focus on what users would be "very disappointed" to lose.'],
                    actionableSuggestion: 'For your MVP stage, consider sending a simple survey to your first 10 users asking how they would feel if they could no longer use your app.'
                }
            },
            {
                id: 'log-2',
                date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
                checkin: { wentWrong: 'User interviews were not as insightful as I hoped.', biggestBlocker: 'Asking the right questions.', systemToFix: 'My user interview script.' },
                analysis: {
                    burnoutScore: 40,
                    burnoutAnalysis: 'It\'s a great sign that you\'re focused on user feedback this early. Getting insightful feedback is a skill that takes practice. Don\'t be discouraged.',
                    mindfulnessExercises: [{ title: 'Mindful Walk', description: 'Take a 10-minute walk without your phone. Pay attention to the sights, sounds, and smells around you.', type: 'Habit' }],
                    delegationTemplates: []
                },
                lesson: {
                    title: 'The Mom Test by Rob Fitzpatrick',
                    source: 'Book Summary',
                    takeaways: ['Don\'t ask about their idea; ask about their life and problems.', 'Focus on specifics from the past, not hypotheticals about the future.'],
                    actionableSuggestion: 'Next week, try asking three users about the last time they faced the problem you\'re solving, instead of asking if they like your solution.'
                }
            }
        ],
        problemSolverHistory: []
    },
    {
        id: 'user-2',
        username: 'pratiksha',
        email: 'pratiksha@somaiya.edu',
        fullName: 'Pratiksha Satpute',
        educationLevel: 'Under-Graduate',
        institution: 'K J Somaiya College',
        degree: 'B.Sc in IT',
        graduationYear: '2024',
        skills: 'Flutter, Firebase, Marketing',
        interests: 'FinTech, D2C',
        isAdmin: false,
        bio: 'Aspiring founder, currently working on a FinTech app to help students manage their finances. Love discussing new ideas!',
        profilePictureUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Pratiksha&backgroundColor=ffdfbf',
        followers: ['user-1'],
        following: ['user-1', 'admin-1'],
        password: 'password123',
        role: 'Founder',
        location: 'Mumbai, India',
        startup: {
            name: 'PocketSave',
            oneLiner: 'A micro-investment and savings app for Indian students.',
            domain: 'FinTech',
            productType: 'Software',
            targetAudience: 'Indian college students',
            stage: 'Idea',
            teamMembers: '2 co-founders',
            hasTechTeam: true,
        },
        founderLogs: [],
        problemSolverHistory: []
    },
    {
        id: 'admin-1',
        username: 'sabeer',
        email: 'sabeer.bhatia@leap.io',
        fullName: 'Sabeer Bhatia',
        educationLevel: 'Other',
        institution: 'Hotmail',
        degree: 'Co-founder',
        graduationYear: 'N/A',
        skills: 'Entrepreneurship, Scaling, Product Vision',
        interests: 'AI, EdTech, FinTech, Funding',
        isAdmin: true,
        bio: 'Co-founder of Hotmail. Passionate about helping the next generation of Indian entrepreneurs build world-class products.',
        profilePictureUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=SabeerBhatia&backgroundColor=b6e3f4',
        followers: ['user-1', 'user-2'],
        following: ['user-1', 'user-2'],
        password: '123456',
        role: 'Founder',
        location: 'Silicon Valley, USA',
        startup: {
            name: "LEAP",
            oneLiner: "An AI-powered project builder and community for student entrepreneurs in India.",
            domain: "EdTech",
            productType: "AI tool",
            targetAudience: "Indian students (age 15-24) with ideas.",
            stage: "Scaling",
            teamMembers: "10+",
            hasTechTeam: true,
            website: "https://leap.io",
            customerAcquisitionChannels: "Campus Programs, Social Media, University Partnerships",
            metrics: {
                weeklyActiveUsers: 500,
                monthlyActiveUsers: 2000,
                totalUsers: 10000,
                monthlyRevenue: 500000,
                engagementRate: 25,
                userAcquisition: 150,
                churnRate: 5
            }
        },
        founderLogs: [],
        problemSolverHistory: []
    },
    {
        id: 'user-3',
        username: 'arjun',
        email: 'arjun@iitd.ac.in',
        fullName: 'Arjun Verma',
        educationLevel: 'Post-Graduate',
        institution: 'IIT Delhi',
        degree: 'M.Tech in AI',
        graduationYear: '2024',
        skills: 'PyTorch, TensorFlow, NLP',
        interests: 'AI, DeepTech',
        isAdmin: false,
        bio: 'Working on foundational models for Indian languages. Fascinated by the potential of generative AI.',
        profilePictureUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=ArjunVerma',
        followers: ['user-1'],
        following: ['admin-1'],
        password: 'password123',
        role: 'AI Researcher',
        location: 'Delhi, India',
        startup: {
            name: 'Bhasha AI',
            oneLiner: 'Foundation models for vernacular Indian languages.',
            domain: 'B2B SaaS',
            productType: 'AI tool',
            targetAudience: 'Indian businesses',
            stage: 'Prototype',
            teamMembers: '1 researcher',
            hasTechTeam: true
        },
        founderLogs: [],
        problemSolverHistory: []
    },
    {
        id: 'user-4',
        username: 'neha',
        email: 'neha@srishti.ac.in',
        fullName: 'Neha Sharma',
        educationLevel: 'Under-Graduate',
        institution: 'Srishti Institute of Art, Design and Technology',
        degree: 'B.Des in UI/UX',
        graduationYear: '2025',
        skills: 'Figma, Prototyping, User Research',
        interests: 'HealthTech, UI/UX',
        isAdmin: false,
        bio: 'Designing user-centric products that make a difference. Currently exploring opportunities in HealthTech.',
        profilePictureUrl: 'https://api.dicebear.com/8.x/rings/svg?seed=NehaSharma',
        followers: ['user-2'],
        following: ['user-1', 'admin-1'],
        password: 'password123',
        role: 'Designer',
        location: 'Bengaluru, India',
        founderLogs: [],
        problemSolverHistory: []
    },
];


export const trendingIdeasData: TrendingIdea[] = [
    {
        emoji: '🔥',
        title: 'EdTech MVPs trending',
        description: 'Tap to explore 6+ real ideas',
        domain: 'EdTech'
    },
    {
        emoji: '💡',
        title: 'FinTech ideas this week',
        description: 'See who’s building in this space',
        domain: 'FinTech'
    },
    {
        emoji: '🌱',
        title: 'AgriTech matches for you',
        description: 'Generate an idea instantly',
        domain: 'AgriTech'
    },
    {
        emoji: '🛒',
        title: 'D2C tools gaining traction',
        description: 'Explore direct-to-consumer tools',
        domain: 'E-commerce'
    },
    {
        emoji: '🧠',
        title: 'AI + Mental Health buzz',
        description: 'Innovations in mental wellness',
        domain: 'HealthTech'
    },
];

export const testimonials: Testimonial[] = [
    {
        name: 'Sabeer Bhatia',
        role: 'Co-founder, Hotmail',
        quote: 'Empowering entrepreneurship is critical for India’s future — and platforms like LEAP are making it happen.',
        avatarUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=SabeerBhatia&backgroundColor=b6e3f4'
    },
    {
        name: 'Pratiksha Satpute',
        role: 'Student Founder',
        quote: 'The LEAP platform is amazing! It helped me turn my idea into something real.',
        avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Pratiksha&backgroundColor=ffdfbf'
    },
    {
        name: 'Shreya Kolhatkar',
        role: 'IIT Bombay Participant',
        quote: 'Thanks to LEAP, I gained valuable experience and unforgettable memories. The IIT Bombay event taught me so much — I’m truly grateful!',
        avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Shreya&backgroundColor=c0aede'
    },
];

export const postsDB: Post[] = [
    {
        id: 'post-1',
        authorId: 'user-1',
        content: 'Just shipped the first version of my EdTech app built on LEAP! It helps students track their attendance and get alerts. Looking for feedback! #MadeWithLEAP #EdTech',
        timestamp: '2h ago',
        likes: ['user-2', 'admin-1'],
        comments: [
            { id: 'comment-1', authorId: 'admin-1', content: 'Great initiative, Shreya! Happy to see this come to life.', timestamp: '1h ago' },
            { id: 'comment-2', authorId: 'user-2', content: 'This looks so cool! Can I test it out?', timestamp: '30m ago' },
        ],
    },
    {
        id: 'post-2',
        authorId: 'user-2',
        content: 'Exploring FinTech ideas. Generated a pitch deck for a micro-investment app for students. The pitch generator on LEAP is 🔥!',
        timestamp: '5h ago',
        likes: ['user-1'],
        comments: [],
    },
     {
        id: 'post-3',
        authorId: 'admin-1',
        content: 'To all student builders: The most important step is the first one. Don\'t wait for the perfect idea. Start building, get feedback, and iterate. You are the future of India. #Motivation #StartupIndia',
        timestamp: '1d ago',
        likes: ['user-1', 'user-2'],
        comments: [],
    },
];

export const liveNewsData: LiveNewsItem[] = [
    {
        icon: '💸',
        headline: 'KreditBee expands to 12 new cities in India, sees 30% user growth',
        source: 'Google News',
        url: 'https://www.business-standard.com/finance/news/kreditbee-partners-with-tata-motors-finance-to-provide-digital-financing-124032000551_1.html',
        domain: 'Funding',
    },
     {
        icon: '💸',
        headline: 'FinTech startup raises $13M from Sequoia for student-focused credit cards',
        source: 'YourStory',
        url: 'https://yourstory.com/2024/04/fintech-startup-kiwi-raises-13-million-in-series-a-funding-nexus-venture-partners',
        domain: 'FinTech',
    },
    {
        icon: '🤖',
        headline: 'Google launches new AI model competing with GPT-4o, focuses on Indian languages',
        source: 'TechCrunch',
        url: 'https://blog.google/technology/ai/google-gemini-ai/',
        domain: 'AI',
    },
    {
        icon: '💼',
        headline: 'Top 30 SaaS startups to watch this month in India',
        source: 'Economic Times',
        url: 'https://inc42.com/features/30-startups-to-watch-the-startups-that-caught-our-eye-in-april-2024/',
        domain: 'SaaS',
    },
    {
        icon: '🌾',
        headline: 'AgriTech in India is booming: Startups are solving farm distress with new tech',
        source: 'Inc42',
        url: 'https://inc42.com/features/decoding-the-agritech-opportunity-in-india/',
        domain: 'AgriTech'
    },
    {
        icon: '🧠',
        headline: 'EdTech after NEP 2020: What students need to know about the latest platforms',
        source: 'The Hindu',
        url: 'https://www.thehindu.com/education/how-national-education-policy-2020-has-shaped-the-edtech-sector/article67691656.ece',
        domain: 'EdTech'
    },
    {
        icon: '🚀',
        headline: 'ISRO partners with private space-tech startup for new satellite launch',
        source: 'LiveMint',
        url: 'https://www.livemint.com/science/news/isro-to-transfer-its-small-satellite-launch-vehicle-to-private-sector-11698305731777.html',
        domain: 'Product Launches'
    },
    {
        icon: '🌐',
        headline: 'Polygon founder announces new fund for Indian Web3 startups',
        source: 'CoinDesk',
        url: 'https://www.coindesk.com/business/2023/07/13/polygon-labs-proposes-1b-fund-for-zero-knowledge-development/',
        domain: 'Web3'
    }
];