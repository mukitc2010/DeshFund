// Mock data for when database is not available
// This allows the UI to be fully demonstrated without PostgreSQL

export const MOCK_USERS = [
  {
    id: "founder-1",
    email: "rahim@example.com",
    role: "FOUNDER",
    emailVerified: true,
    createdAt: "2025-06-15T00:00:00Z",
    profile: {
      displayName: "Rahim Ahmed",
      avatarUrl: null,
      bio: "Serial entrepreneur building the future of logistics in Bangladesh. Previously founded two successful startups in Dhaka.",
      companyName: "TechStartup BD",
      companyRole: "CEO & Founder",
      location: "Dhaka, Bangladesh",
      website: "https://techstartupbd.com",
      linkedin: "https://linkedin.com/in/rahim-ahmed",
      phone: "+8801712345678",
    },
    trustScore: {
      score: 92,
      kycComplete: true,
      revenueVerified: true,
      businessReg: true,
      teamListed: true,
      financialData: true,
      updatesPosted: true,
      docsUploaded: true,
      badges: ["IDENTITY_VERIFIED", "REVENUE_VERIFIED", "BUSINESS_REGISTERED", "VERIFIED_FOUNDER", "INVESTOR_READY"],
    },
  },
  {
    id: "founder-2",
    email: "nusrat@example.com",
    role: "FOUNDER",
    emailVerified: true,
    createdAt: "2025-07-20T00:00:00Z",
    profile: {
      displayName: "Nusrat Jahan",
      avatarUrl: null,
      bio: "Passionate about sustainable agriculture. MSc in Agricultural Science from BAU.",
      companyName: "EcoFarm Chittagong",
      companyRole: "Founder & CEO",
      location: "Chittagong, Bangladesh",
      website: null,
      linkedin: null,
      phone: null,
    },
    trustScore: {
      score: 88,
      kycComplete: true,
      revenueVerified: true,
      businessReg: true,
      teamListed: true,
      financialData: true,
      updatesPosted: false,
      docsUploaded: true,
      badges: ["IDENTITY_VERIFIED", "REVENUE_VERIFIED", "BUSINESS_REGISTERED", "VERIFIED_FOUNDER", "INVESTOR_READY"],
    },
  },
  {
    id: "founder-3",
    email: "kamal@example.com",
    role: "FOUNDER",
    emailVerified: true,
    createdAt: "2025-05-10T00:00:00Z",
    profile: {
      displayName: "Kamal Hossain",
      avatarUrl: null,
      bio: "EdTech innovator making STEM education accessible. Former professor at BUET.",
      companyName: "Dhaka EdTech Academy",
      companyRole: "Founder & Director",
      location: "Dhaka, Bangladesh",
      website: "https://dhakaedtech.com",
      linkedin: null,
      phone: null,
    },
    trustScore: {
      score: 95,
      kycComplete: true,
      revenueVerified: true,
      businessReg: true,
      teamListed: true,
      financialData: true,
      updatesPosted: true,
      docsUploaded: true,
      badges: ["IDENTITY_VERIFIED", "REVENUE_VERIFIED", "BUSINESS_REGISTERED", "VERIFIED_FOUNDER", "INVESTOR_READY"],
    },
  },
];

export const MOCK_CAMPAIGNS = [
  {
    id: "techstartup-bd",
    founderId: "founder-1",
    title: "TechStartup BD: AI-Powered Logistics",
    slug: "techstartup-bd",
    tagline: "Revolutionizing last-mile delivery in Dhaka with smart route optimization",
    description: `## The Problem

Last-mile delivery in Dhaka is broken. With 22 million people packed into one of the world's most densely populated cities, delivery riders waste 40% of their time stuck in traffic or navigating inefficient routes.

## Our Solution

TechStartup BD uses AI-powered route optimization to cut delivery times by 35% and reduce costs by 28%. Our algorithm processes real-time traffic data, weather conditions, and historical patterns to find the fastest routes.

## How It Works

1. **Smart Routing Engine** — Our AI analyzes thousands of possible routes in milliseconds
2. **Real-Time Adaptation** — Routes adjust dynamically based on live traffic conditions
3. **Fleet Management** — Optimize entire delivery fleets, not just individual riders
4. **Analytics Dashboard** — Track performance, costs, and customer satisfaction

## Traction

- 15+ delivery companies using our platform
- 50,000+ deliveries optimized monthly
- 35% average time reduction
- ৳2.5 crore monthly GMV processed

## The Team

- **Rahim Ahmed** (CEO) — 10 years in logistics tech, ex-Pathao
- **Sabrina Khan** (CTO) — ML engineer, ex-Google
- **Tanvir Islam** (COO) — Operations expert, ex-Chaldal

## Use of Funds

- 40% — Engineering & AI development
- 25% — Market expansion (Chittagong, Sylhet)
- 20% — Sales & partnerships
- 15% — Operations & infrastructure`,
    category: "Technology",
    coverImageUrl: null,
    videoUrl: null,
    goalAmount: 5000000,
    raisedAmount: 3250000,
    contributorCount: 142,
    currency: "BDT",
    startDate: "2025-09-01T00:00:00Z",
    endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE",
    isFeatured: true,
    platformFee: 5,
    createdAt: "2025-08-15T00:00:00Z",
    updatedAt: "2026-03-20T00:00:00Z",
    founder: {
      ...MOCK_USERS[0],
    },
    milestones: [
      { id: "m1", title: "MVP Launch", description: "Launch core routing engine with 5 pilot partners", budgetAllocation: 1500000, targetDate: "2025-12-01T00:00:00Z", completionPct: 100, status: "COMPLETED", sortOrder: 0 },
      { id: "m2", title: "Scale to 20 Partners", description: "Expand to 20 delivery companies in Dhaka", budgetAllocation: 1000000, targetDate: "2026-03-01T00:00:00Z", completionPct: 75, status: "IN_PROGRESS", sortOrder: 1 },
      { id: "m3", title: "Chittagong Expansion", description: "Launch operations in Chittagong", budgetAllocation: 1500000, targetDate: "2026-06-01T00:00:00Z", completionPct: 20, status: "IN_PROGRESS", sortOrder: 2 },
      { id: "m4", title: "AI v2.0 Release", description: "Next-gen algorithm with weather and event prediction", budgetAllocation: 1000000, targetDate: "2026-09-01T00:00:00Z", completionPct: 0, status: "PLANNED", sortOrder: 3 },
    ],
    metrics: [
      { period: "2025-10", revenue: 180000, profit: 45000, customers: 8, users: 1200, orders: 8500, expenses: 135000, cashFlow: 45000, teamSize: 6 },
      { period: "2025-11", revenue: 250000, profit: 72000, customers: 11, users: 2100, orders: 15000, expenses: 178000, cashFlow: 72000, teamSize: 7 },
      { period: "2025-12", revenue: 380000, profit: 120000, customers: 15, users: 4500, orders: 25000, expenses: 260000, cashFlow: 120000, teamSize: 8 },
      { period: "2026-01", revenue: 520000, profit: 185000, customers: 18, users: 8200, orders: 38000, expenses: 335000, cashFlow: 185000, teamSize: 10 },
      { period: "2026-02", revenue: 710000, profit: 265000, customers: 22, users: 14000, orders: 50000, expenses: 445000, cashFlow: 265000, teamSize: 12 },
      { period: "2026-03", revenue: 890000, profit: 340000, customers: 28, users: 21000, orders: 62000, expenses: 550000, cashFlow: 340000, teamSize: 14 },
    ],
    documents: [
      { id: "d1", name: "TechStartup BD Pitch Deck", type: "pitch_deck", fileUrl: "#", fileSize: 2400000, visibility: "PUBLIC", createdAt: "2025-08-15T00:00:00Z" },
      { id: "d2", name: "Financial Projections 2026", type: "financials", fileUrl: "#", fileSize: 850000, visibility: "PUBLIC", createdAt: "2025-09-01T00:00:00Z" },
      { id: "d3", name: "Market Research Report", type: "market_research", fileUrl: "#", fileSize: 3200000, visibility: "PUBLIC", createdAt: "2025-08-20T00:00:00Z" },
      { id: "d4", name: "Product Roadmap 2026", type: "roadmap", fileUrl: "#", fileSize: 1100000, visibility: "PUBLIC", createdAt: "2025-09-15T00:00:00Z" },
    ],
    updates: [
      { id: "u1", title: "We hit 50,000 monthly deliveries!", content: "Excited to share that our platform now processes over 50,000 optimized deliveries every month. Our AI routing engine has saved our partner companies a combined ৳15 lakh in fuel and time costs this quarter alone.", createdAt: "2026-03-15T00:00:00Z" },
      { id: "u2", title: "New partnership with RedX", content: "We're thrilled to announce our partnership with RedX, one of Bangladesh's largest delivery networks. This brings our total partner count to 22.", createdAt: "2026-02-20T00:00:00Z" },
      { id: "u3", title: "Milestone 1 Complete: MVP Launched", content: "Our core routing engine is live and deployed with our first 5 pilot partners. Early results show a 35% reduction in delivery times.", createdAt: "2025-12-01T00:00:00Z" },
    ],
    comments: [
      { id: "c1", userId: "supporter-1", content: "This is exactly what Dhaka needs. The traffic problem is real and your solution is practical. Backed!", createdAt: "2026-01-10T00:00:00Z", user: { profile: { displayName: "Karim Hassan" } }, replies: [] },
      { id: "c2", userId: "supporter-2", content: "Impressive traction numbers. How do you compare with Paperfly's routing?", createdAt: "2026-02-05T00:00:00Z", user: { profile: { displayName: "Fatima Begum" } }, replies: [
        { id: "c3", userId: "founder-1", content: "Great question! Our AI model is specifically trained on Dhaka's unique traffic patterns, which gives us a 15% edge over generic routing solutions.", createdAt: "2026-02-05T00:00:00Z", user: { profile: { displayName: "Rahim Ahmed" } }, replies: [] },
      ]},
    ],
    _count: { contributions: 142, comments: 3 },
  },
  {
    id: "ecofarm-chittagong",
    founderId: "founder-2",
    title: "EcoFarm Chittagong",
    slug: "ecofarm-chittagong",
    tagline: "Sustainable organic farming bringing fresh produce to urban families",
    description: `## Our Mission

EcoFarm Chittagong is building Bangladesh's first tech-enabled organic farming network, connecting rural farmers with urban consumers for fresh, pesticide-free produce.

## The Problem

90% of produce in Bangladesh is treated with harmful pesticides. Urban families have no reliable source of organic food, and rural farmers earn only 20% of the retail price.

## Our Solution

We work directly with 200+ organic farmers in the Chittagong Hill Tracts, providing them with training, organic inputs, and guaranteed fair prices. Our mobile app lets urban consumers order farm-fresh produce for next-day delivery.

## Traction

- 200+ partner farmers
- 5,000+ active subscribers
- ৳18 lakh monthly revenue
- 89% customer retention rate`,
    category: "Agriculture",
    coverImageUrl: null,
    videoUrl: null,
    goalAmount: 2500000,
    raisedAmount: 1800000,
    contributorCount: 89,
    currency: "BDT",
    startDate: "2025-10-01T00:00:00Z",
    endDate: "2026-07-01T00:00:00Z",
    status: "ACTIVE",
    isFeatured: true,
    platformFee: 5,
    createdAt: "2025-09-20T00:00:00Z",
    updatedAt: "2026-03-18T00:00:00Z",
    founder: { ...MOCK_USERS[1] },
    milestones: [
      { id: "m5", title: "Launch Subscription Service", description: "Weekly organic box delivery", budgetAllocation: 800000, targetDate: "2025-12-15T00:00:00Z", completionPct: 100, status: "COMPLETED", sortOrder: 0 },
      { id: "m6", title: "500 Farmer Network", description: "Expand to 500 partner farmers", budgetAllocation: 1000000, targetDate: "2026-06-01T00:00:00Z", completionPct: 40, status: "IN_PROGRESS", sortOrder: 1 },
    ],
    metrics: [
      { period: "2025-11", revenue: 120000, profit: 30000, customers: 3200, users: 4500, orders: 6800, expenses: 90000, cashFlow: 30000, teamSize: 5 },
      { period: "2025-12", revenue: 145000, profit: 40000, customers: 3800, users: 5200, orders: 8200, expenses: 105000, cashFlow: 40000, teamSize: 6 },
      { period: "2026-01", revenue: 165000, profit: 48000, customers: 4200, users: 5800, orders: 9500, expenses: 117000, cashFlow: 48000, teamSize: 6 },
      { period: "2026-02", revenue: 180000, profit: 55000, customers: 4800, users: 6500, orders: 11000, expenses: 125000, cashFlow: 55000, teamSize: 7 },
    ],
    documents: [
      { id: "d5", name: "EcoFarm Pitch Deck", type: "pitch_deck", fileUrl: "#", fileSize: 1800000, visibility: "PUBLIC", createdAt: "2025-09-20T00:00:00Z" },
    ],
    updates: [
      { id: "u4", title: "5,000 subscribers milestone!", content: "We just crossed 5,000 active subscribers. Thank you to all our supporters!", createdAt: "2026-03-01T00:00:00Z" },
    ],
    comments: [],
    _count: { contributions: 89, comments: 0 },
  },
  {
    id: "dhaka-edtech",
    founderId: "founder-3",
    title: "Dhaka EdTech Academy",
    slug: "dhaka-edtech",
    tagline: "Making quality STEM education accessible to every student in Bangladesh",
    description: `## Vision

Every student in Bangladesh deserves access to world-class STEM education, regardless of their family's income.

## What We Do

Dhaka EdTech Academy provides affordable online STEM courses, coding bootcamps, and science labs through our hybrid learning platform. Students learn through interactive lessons, live classes with expert tutors, and hands-on projects.

## Impact

- 15,000+ students enrolled
- 95% course completion rate
- 80% of graduates land tech jobs within 6 months
- Courses starting from ৳500/month`,
    category: "Education",
    coverImageUrl: null,
    videoUrl: null,
    goalAmount: 5000000,
    raisedAmount: 4100000,
    contributorCount: 234,
    currency: "BDT",
    startDate: "2025-07-01T00:00:00Z",
    endDate: "2026-04-01T00:00:00Z",
    status: "ACTIVE",
    isFeatured: true,
    platformFee: 5,
    createdAt: "2025-06-15T00:00:00Z",
    updatedAt: "2026-03-22T00:00:00Z",
    founder: { ...MOCK_USERS[2] },
    milestones: [
      { id: "m7", title: "Platform Launch", description: "Launch online learning platform", budgetAllocation: 2000000, targetDate: "2025-10-01T00:00:00Z", completionPct: 100, status: "COMPLETED", sortOrder: 0 },
      { id: "m8", title: "10,000 Students", description: "Reach 10,000 enrolled students", budgetAllocation: 1500000, targetDate: "2026-01-01T00:00:00Z", completionPct: 100, status: "COMPLETED", sortOrder: 1 },
      { id: "m9", title: "Mobile App", description: "Launch iOS and Android apps", budgetAllocation: 1500000, targetDate: "2026-06-01T00:00:00Z", completionPct: 45, status: "IN_PROGRESS", sortOrder: 2 },
    ],
    metrics: [
      { period: "2025-10", revenue: 320000, profit: 95000, customers: 8500, users: 12000, orders: 8500, expenses: 225000, cashFlow: 95000, teamSize: 10 },
      { period: "2025-11", revenue: 410000, profit: 135000, customers: 10200, users: 15000, orders: 10200, expenses: 275000, cashFlow: 135000, teamSize: 12 },
      { period: "2025-12", revenue: 520000, profit: 190000, customers: 12500, users: 19000, orders: 12500, expenses: 330000, cashFlow: 190000, teamSize: 14 },
      { period: "2026-01", revenue: 650000, profit: 250000, customers: 14800, users: 24000, orders: 14800, expenses: 400000, cashFlow: 250000, teamSize: 15 },
      { period: "2026-02", revenue: 780000, profit: 310000, customers: 17500, users: 30000, orders: 17500, expenses: 470000, cashFlow: 310000, teamSize: 16 },
    ],
    documents: [
      { id: "d6", name: "EdTech Academy Pitch Deck", type: "pitch_deck", fileUrl: "#", fileSize: 2100000, visibility: "PUBLIC", createdAt: "2025-06-15T00:00:00Z" },
      { id: "d7", name: "Impact Report 2025", type: "market_research", fileUrl: "#", fileSize: 4500000, visibility: "PUBLIC", createdAt: "2025-12-30T00:00:00Z" },
    ],
    updates: [
      { id: "u5", title: "15,000 students and counting!", content: "We've reached a major milestone — 15,000 students are now learning on our platform.", createdAt: "2026-03-10T00:00:00Z" },
      { id: "u6", title: "Partnership with BUET", content: "Excited to announce our curriculum partnership with BUET's Computer Science department.", createdAt: "2026-01-15T00:00:00Z" },
    ],
    comments: [
      { id: "c4", userId: "supporter-3", content: "My daughter is enrolled and loves the courses. Thank you for making this accessible!", createdAt: "2026-02-15T00:00:00Z", user: { profile: { displayName: "Amina Rahman" } }, replies: [] },
    ],
    _count: { contributions: 234, comments: 1 },
  },
  {
    id: "greenpower-sylhet",
    founderId: "founder-1",
    title: "GreenPower Sylhet",
    slug: "greenpower-sylhet",
    tagline: "Affordable solar micro-grids for rural communities in the northeast",
    description: `## The Energy Gap

3 million people in the Sylhet division lack reliable electricity. They depend on kerosene lamps and diesel generators — expensive, polluting, and dangerous.

## Our Solution

GreenPower Sylhet installs solar micro-grids that power entire villages. Each micro-grid serves 50-100 households with clean, reliable electricity at 40% lower cost than diesel.

## Impact So Far

- 12 micro-grids installed
- 800+ households connected
- 40% cost reduction vs diesel
- 2,400 tons CO2 offset annually`,
    category: "Green Energy",
    coverImageUrl: null,
    videoUrl: null,
    goalAmount: 3000000,
    raisedAmount: 920000,
    contributorCount: 56,
    currency: "BDT",
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-09-01T00:00:00Z",
    status: "ACTIVE",
    isFeatured: false,
    platformFee: 5,
    createdAt: "2025-12-15T00:00:00Z",
    updatedAt: "2026-03-15T00:00:00Z",
    founder: { ...MOCK_USERS[0] },
    milestones: [
      { id: "m10", title: "First 20 Micro-grids", description: "Install 20 solar micro-grids", budgetAllocation: 2000000, targetDate: "2026-06-01T00:00:00Z", completionPct: 60, status: "IN_PROGRESS", sortOrder: 0 },
    ],
    metrics: [
      { period: "2026-01", revenue: 85000, profit: 20000, customers: 800, users: 800, orders: 800, expenses: 65000, cashFlow: 20000, teamSize: 8 },
      { period: "2026-02", revenue: 110000, profit: 30000, customers: 950, users: 950, orders: 950, expenses: 80000, cashFlow: 30000, teamSize: 8 },
    ],
    documents: [],
    updates: [],
    comments: [],
    _count: { contributions: 56, comments: 0 },
  },
  // --- Additional campaigns for all categories ---
  {
    id: "healthtech-bd", founderId: "founder-2", title: "HealthTech BD: Telemedicine for Rural Areas",
    slug: "healthtech-bd", tagline: "Connecting 50 million rural Bangladeshis to qualified doctors via mobile",
    description: "## The Problem\n\nRural Bangladesh has 1 doctor per 10,000 people. Patients travel hours to reach the nearest clinic.\n\n## Our Solution\n\nHealthTech BD provides video consultations with licensed doctors, AI-powered symptom checking, and medicine delivery — all through a simple mobile app that works on 2G networks.\n\n## Traction\n\n- 25,000+ consultations completed\n- 500+ partner doctors\n- 4.8/5 patient satisfaction\n- Available in 32 districts",
    category: "Healthcare", coverImageUrl: null, videoUrl: null, goalAmount: 4000000, raisedAmount: 2100000,
    contributorCount: 98, currency: "BDT", startDate: "2025-11-01T00:00:00Z", endDate: "2026-08-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-10-15T00:00:00Z", updatedAt: "2026-03-20T00:00:00Z",
    founder: { ...MOCK_USERS[1] },
    milestones: [
      { id: "mh1", title: "Launch in 50 Districts", description: "Expand coverage nationwide", budgetAllocation: 2000000, targetDate: "2026-06-01T00:00:00Z", completionPct: 64, status: "IN_PROGRESS" as const, sortOrder: 0 },
    ],
    metrics: [
      { period: "2026-01", revenue: 320000, profit: 80000, customers: 18000, users: 25000, orders: 18000, expenses: 240000, cashFlow: 80000, teamSize: 12 },
      { period: "2026-02", revenue: 410000, profit: 115000, customers: 22000, users: 32000, orders: 22000, expenses: 295000, cashFlow: 115000, teamSize: 14 },
    ],
    documents: [], updates: [{ id: "uh1", title: "25,000 consultations milestone!", content: "We've crossed 25,000 telemedicine consultations.", createdAt: "2026-03-10T00:00:00Z" }],
    comments: [], _count: { contributions: 98, comments: 0 },
  },
  {
    id: "shohoz-market", founderId: "founder-1", title: "ShohozMarket: Rural E-commerce",
    slug: "shohoz-market", tagline: "Bringing e-commerce to tier-2 and tier-3 cities across Bangladesh",
    description: "## The Gap\n\nE-commerce in Bangladesh is concentrated in Dhaka. 100 million people outside the capital have limited access to online shopping.\n\n## Our Solution\n\nShohozMarket uses a network of local agents in small towns who help customers order, pay, and receive products. We handle logistics through our hub-and-spoke model.\n\n## Traction\n\n- 1,200+ agent partners\n- 45,000 monthly orders\n- Operating in 8 divisions\n- 92% delivery success rate",
    category: "E-commerce", coverImageUrl: null, videoUrl: null, goalAmount: 3500000, raisedAmount: 1750000,
    contributorCount: 73, currency: "BDT", startDate: "2025-10-01T00:00:00Z", endDate: "2026-07-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-09-15T00:00:00Z", updatedAt: "2026-03-18T00:00:00Z",
    founder: { ...MOCK_USERS[0] },
    milestones: [
      { id: "me1", title: "2,000 Agent Network", description: "Scale to 2,000 agents", budgetAllocation: 1500000, targetDate: "2026-05-01T00:00:00Z", completionPct: 60, status: "IN_PROGRESS" as const, sortOrder: 0 },
    ],
    metrics: [
      { period: "2026-01", revenue: 280000, profit: 65000, customers: 35000, users: 45000, orders: 42000, expenses: 215000, cashFlow: 65000, teamSize: 18 },
      { period: "2026-02", revenue: 350000, profit: 90000, customers: 42000, users: 55000, orders: 50000, expenses: 260000, cashFlow: 90000, teamSize: 20 },
    ],
    documents: [], updates: [], comments: [], _count: { contributions: 73, comments: 0 },
  },
  {
    id: "khaddo-express", founderId: "founder-2", title: "Khaddo Express: Cloud Kitchen Network",
    slug: "khaddo-express", tagline: "Affordable home-style meals delivered to offices across Dhaka",
    description: "## The Opportunity\n\n8 million office workers in Dhaka spend ৳150-300 daily on lunch. Most options are unhealthy or overpriced.\n\n## Our Solution\n\nKhaddo Express operates 15 cloud kitchens preparing home-style Bangladeshi meals at ৳80-120 per plate. We deliver to office buildings within 30 minutes.\n\n## Numbers\n\n- 15 cloud kitchens\n- 8,000+ daily orders\n- ৳95 average order value\n- 4.6/5 rating",
    category: "Food & Beverage", coverImageUrl: null, videoUrl: null, goalAmount: 2000000, raisedAmount: 1450000,
    contributorCount: 112, currency: "BDT", startDate: "2025-08-01T00:00:00Z", endDate: "2026-05-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-07-20T00:00:00Z", updatedAt: "2026-03-15T00:00:00Z",
    founder: { ...MOCK_USERS[1] },
    milestones: [
      { id: "mf1", title: "25 Kitchen Expansion", description: "Open 10 more cloud kitchens", budgetAllocation: 1200000, targetDate: "2026-04-01T00:00:00Z", completionPct: 50, status: "IN_PROGRESS" as const, sortOrder: 0 },
    ],
    metrics: [
      { period: "2026-01", revenue: 480000, profit: 145000, customers: 6500, users: 12000, orders: 180000, expenses: 335000, cashFlow: 145000, teamSize: 45 },
      { period: "2026-02", revenue: 560000, profit: 175000, customers: 7800, users: 14500, orders: 210000, expenses: 385000, cashFlow: 175000, teamSize: 50 },
    ],
    documents: [], updates: [], comments: [], _count: { contributions: 112, comments: 0 },
  },
  {
    id: "bangla-crafts", founderId: "founder-3", title: "Bangla Crafts: Artisan Marketplace",
    slug: "bangla-crafts", tagline: "Empowering traditional artisans with a global online marketplace for Bangladeshi crafts",
    description: "## Mission\n\nBangladesh has 2 million traditional artisans — weavers, potters, embroiderers — earning below minimum wage. Their art is dying.\n\n## Our Platform\n\nBangla Crafts connects artisans directly with global buyers. We handle photography, listing, shipping, and payments so artisans can focus on their craft.\n\n## Impact\n\n- 800+ artisans onboarded\n- Products shipped to 15 countries\n- 3x average income increase for partner artisans",
    category: "Creative", coverImageUrl: null, videoUrl: null, goalAmount: 1500000, raisedAmount: 980000,
    contributorCount: 67, currency: "BDT", startDate: "2025-09-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-08-20T00:00:00Z", updatedAt: "2026-03-12T00:00:00Z",
    founder: { ...MOCK_USERS[2] },
    milestones: [
      { id: "mc1", title: "2,000 Artisans", description: "Scale to 2,000 artisan partners", budgetAllocation: 800000, targetDate: "2026-04-01T00:00:00Z", completionPct: 40, status: "IN_PROGRESS" as const, sortOrder: 0 },
    ],
    metrics: [
      { period: "2026-01", revenue: 190000, profit: 55000, customers: 2200, users: 5000, orders: 3100, expenses: 135000, cashFlow: 55000, teamSize: 8 },
      { period: "2026-02", revenue: 230000, profit: 72000, customers: 2800, users: 6200, orders: 3800, expenses: 158000, cashFlow: 72000, teamSize: 9 },
    ],
    documents: [], updates: [], comments: [], _count: { contributions: 67, comments: 0 },
  },
  {
    id: "jute-innovations", founderId: "founder-1", title: "Jute Innovations BD",
    slug: "jute-innovations", tagline: "Turning Bangladesh's golden fiber into sustainable packaging for global brands",
    description: "## The Opportunity\n\nThe global sustainable packaging market is worth $280 billion. Bangladesh produces 30% of the world's jute — the ultimate eco-friendly material.\n\n## What We Do\n\nWe manufacture premium jute-based packaging products — bags, wraps, containers — for international brands replacing single-use plastic.\n\n## Traction\n\n- Contracts with 8 international brands\n- 2 manufacturing facilities\n- 200+ jobs created in rural Khulna\n- ৳1.2 crore annual revenue",
    category: "Manufacturing", coverImageUrl: null, videoUrl: null, goalAmount: 5000000, raisedAmount: 2800000,
    contributorCount: 134, currency: "BDT", startDate: "2025-07-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-06-15T00:00:00Z", updatedAt: "2026-03-20T00:00:00Z",
    founder: { ...MOCK_USERS[0] },
    milestones: [],
    metrics: [
      { period: "2026-01", revenue: 650000, profit: 180000, customers: 12, users: 12, orders: 45, expenses: 470000, cashFlow: 180000, teamSize: 85 },
      { period: "2026-02", revenue: 720000, profit: 210000, customers: 14, users: 14, orders: 52, expenses: 510000, cashFlow: 210000, teamSize: 90 },
    ],
    documents: [], updates: [], comments: [], _count: { contributions: 134, comments: 0 },
  },
  {
    id: "porichoy-fintech", founderId: "founder-3", title: "Porichoy: Digital Identity & Credit Scoring",
    slug: "porichoy-fintech", tagline: "Building Bangladesh's first AI credit scoring system for the unbanked",
    description: "## The Problem\n\n60% of Bangladeshis are unbanked. Without credit history, they can't access loans, insurance, or financial products.\n\n## Our Solution\n\nPorichoy uses alternative data — mobile usage, utility payments, social connections — to build credit profiles for the unbanked. We partner with MFS providers and microfinance institutions.\n\n## Traction\n\n- 150,000+ credit profiles generated\n- 12 partner financial institutions\n- 85% prediction accuracy\n- ৳50 crore in loans facilitated",
    category: "Fintech", coverImageUrl: null, videoUrl: null, goalAmount: 8000000, raisedAmount: 4500000,
    contributorCount: 189, currency: "BDT", startDate: "2025-06-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: true, platformFee: 5, createdAt: "2025-05-15T00:00:00Z", updatedAt: "2026-03-22T00:00:00Z",
    founder: { ...MOCK_USERS[2] },
    milestones: [],
    metrics: [
      { period: "2026-01", revenue: 920000, profit: 380000, customers: 120000, users: 150000, orders: 25000, expenses: 540000, cashFlow: 380000, teamSize: 22 },
      { period: "2026-02", revenue: 1100000, profit: 470000, customers: 145000, users: 180000, orders: 32000, expenses: 630000, cashFlow: 470000, teamSize: 25 },
    ],
    documents: [], updates: [], comments: [], _count: { contributions: 189, comments: 0 },
  },
  {
    id: "asha-fashion", founderId: "founder-2", title: "Asha Fashion: Sustainable Clothing",
    slug: "asha-fashion", tagline: "Ethical fashion brand turning garment factory waste into stylish affordable clothing",
    description: "## The Problem\n\nBangladesh's garment industry produces 400,000 tons of textile waste annually. Most ends up in landfills.\n\n## Our Solution\n\nAsha Fashion upcycles factory waste fabric into trendy, affordable clothing. We employ 150+ women from garment worker communities, paying 2x the industry average.\n\n## Impact\n\n- 80 tons of textile waste upcycled\n- 150+ women employed\n- Sold in 5 countries\n- ৳85 lakh annual revenue",
    category: "Fashion & Lifestyle", coverImageUrl: null, videoUrl: null, goalAmount: 2500000, raisedAmount: 1650000,
    contributorCount: 78, currency: "BDT", startDate: "2025-10-01T00:00:00Z", endDate: "2026-07-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-09-20T00:00:00Z", updatedAt: "2026-03-18T00:00:00Z",
    founder: { ...MOCK_USERS[1] },
    milestones: [],
    metrics: [
      { period: "2026-01", revenue: 420000, profit: 130000, customers: 3500, users: 8000, orders: 4200, expenses: 290000, cashFlow: 130000, teamSize: 155 },
      { period: "2026-02", revenue: 490000, profit: 160000, customers: 4100, users: 9500, orders: 5000, expenses: 330000, cashFlow: 160000, teamSize: 160 },
    ],
    documents: [], updates: [], comments: [], _count: { contributions: 78, comments: 0 },
  },
  {
    id: "shohayota-social", founderId: "founder-3", title: "Shohayota: Disability Employment Platform",
    slug: "shohayota-social", tagline: "Connecting persons with disabilities to remote work opportunities across Bangladesh",
    description: "## The Problem\n\n15 million Bangladeshis live with disabilities. 93% are unemployed despite many being capable and skilled.\n\n## Our Solution\n\nShohayota trains persons with disabilities in digital skills (data entry, graphic design, customer support) and connects them with employers offering remote positions.\n\n## Impact\n\n- 2,500+ people trained\n- 1,200+ placed in jobs\n- ৳15,000 average monthly income for graduates\n- Partnerships with 45 employers",
    category: "Social Impact", coverImageUrl: null, videoUrl: null, goalAmount: 3000000, raisedAmount: 2200000,
    contributorCount: 156, currency: "BDT", startDate: "2025-08-01T00:00:00Z", endDate: "2026-05-01T00:00:00Z",
    status: "ACTIVE", isFeatured: true, platformFee: 5, createdAt: "2025-07-15T00:00:00Z", updatedAt: "2026-03-21T00:00:00Z",
    founder: { ...MOCK_USERS[2] },
    milestones: [],
    metrics: [
      { period: "2026-01", revenue: 180000, profit: 25000, customers: 1800, users: 5000, orders: 350, expenses: 155000, cashFlow: 25000, teamSize: 15 },
      { period: "2026-02", revenue: 210000, profit: 35000, customers: 2200, users: 6200, orders: 420, expenses: 175000, cashFlow: 35000, teamSize: 16 },
    ],
    documents: [], updates: [], comments: [], _count: { contributions: 156, comments: 0 },
  },
  // ── Technology (2 more) ──
  {
    id: "codelab-bd", founderId: "founder-3", title: "CodeLab BD: No-Code Platform for SMEs",
    slug: "codelab-bd", tagline: "Empowering small businesses to build custom apps without writing a single line of code",
    description: "## Problem\n\n95% of Bangladeshi SMEs have no digital presence beyond Facebook. Custom software is too expensive.\n\n## Solution\n\nCodeLab BD is a drag-and-drop platform that lets shop owners, restaurants, and service providers build inventory management, billing, and CRM apps in minutes.\n\n## Traction\n\n- 3,200+ businesses onboarded\n- 12,000+ apps created\n- ৳45 lakh MRR",
    category: "Technology", coverImageUrl: null, videoUrl: null, goalAmount: 6000000, raisedAmount: 3900000,
    contributorCount: 167, currency: "BDT", startDate: "2025-08-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-07-15T00:00:00Z", updatedAt: "2026-03-22T00:00:00Z",
    founder: { ...MOCK_USERS[2] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 450000, profit: 180000, customers: 3200, users: 12000, orders: 3200, expenses: 270000, cashFlow: 180000, teamSize: 11 },
      { period: "2026-02", revenue: 520000, profit: 215000, customers: 3800, users: 14500, orders: 3800, expenses: 305000, cashFlow: 215000, teamSize: 12 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 167, comments: 0 },
  },
  {
    id: "cybershield-bd", founderId: "founder-1", title: "CyberShield BD: Cybersecurity for Banks",
    slug: "cybershield-bd", tagline: "AI-powered threat detection protecting Bangladesh's banking infrastructure",
    description: "## The Threat\n\nBangladeshi banks face 15,000+ cyberattacks daily. The Bangladesh Bank heist of 2016 exposed critical vulnerabilities.\n\n## Our Solution\n\nCyberShield BD provides AI-driven threat detection, real-time monitoring, and incident response for financial institutions.\n\n## Traction\n\n- 8 partner banks\n- 2.5M threats blocked monthly\n- Zero breaches across clients",
    category: "Technology", coverImageUrl: null, videoUrl: null, goalAmount: 10000000, raisedAmount: 5200000,
    contributorCount: 89, currency: "BDT", startDate: "2025-06-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-05-20T00:00:00Z", updatedAt: "2026-03-20T00:00:00Z",
    founder: { ...MOCK_USERS[0] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 1200000, profit: 520000, customers: 8, users: 45, orders: 8, expenses: 680000, cashFlow: 520000, teamSize: 18 },
      { period: "2026-02", revenue: 1350000, profit: 610000, customers: 10, users: 52, orders: 10, expenses: 740000, cashFlow: 610000, teamSize: 20 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 89, comments: 0 },
  },
  // ── Social Impact (2 more) ──
  {
    id: "shikkha-for-all", founderId: "founder-2", title: "Shikkha For All: Free Tutoring Network",
    slug: "shikkha-for-all", tagline: "University volunteers providing free tutoring to underprivileged students across Bangladesh",
    description: "## Mission\n\nOnly 12% of students from low-income families in Bangladesh pass SSC exams. Lack of tutoring is the #1 barrier.\n\n## How It Works\n\nWe recruit university student volunteers and match them 1:1 with underprivileged secondary students for weekly tutoring via video call.\n\n## Impact\n\n- 8,500+ student pairs\n- 78% exam pass rate (vs 12% baseline)\n- Operating in all 8 divisions",
    category: "Social Impact", coverImageUrl: null, videoUrl: null, goalAmount: 1800000, raisedAmount: 1400000,
    contributorCount: 203, currency: "BDT", startDate: "2025-09-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-08-15T00:00:00Z", updatedAt: "2026-03-18T00:00:00Z",
    founder: { ...MOCK_USERS[1] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 95000, profit: 10000, customers: 7200, users: 15000, orders: 0, expenses: 85000, cashFlow: 10000, teamSize: 8 },
      { period: "2026-02", revenue: 110000, profit: 15000, customers: 8500, users: 18000, orders: 0, expenses: 95000, cashFlow: 15000, teamSize: 9 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 203, comments: 0 },
  },
  {
    id: "clean-dhaka", founderId: "founder-1", title: "Clean Dhaka: Waste Management Revolution",
    slug: "clean-dhaka", tagline: "Smart waste collection and recycling system turning Dhaka's trash into treasure",
    description: "## The Crisis\n\nDhaka generates 7,000 tons of waste daily. Only 50% is collected, and almost none is recycled.\n\n## Our Solution\n\nClean Dhaka uses GPS-tracked collection vehicles, an app for residents to schedule pickups, and partnerships with recyclers to process 80% of collected waste.\n\n## Traction\n\n- Serving 25,000 households\n- 200 tons/day processed\n- 80% recycling rate\n- Created 500+ jobs",
    category: "Social Impact", coverImageUrl: null, videoUrl: null, goalAmount: 4500000, raisedAmount: 2800000,
    contributorCount: 178, currency: "BDT", startDate: "2025-07-01T00:00:00Z", endDate: "2026-05-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-06-20T00:00:00Z", updatedAt: "2026-03-15T00:00:00Z",
    founder: { ...MOCK_USERS[0] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 380000, profit: 85000, customers: 25000, users: 30000, orders: 45000, expenses: 295000, cashFlow: 85000, teamSize: 120 },
      { period: "2026-02", revenue: 430000, profit: 105000, customers: 28000, users: 35000, orders: 52000, expenses: 325000, cashFlow: 105000, teamSize: 135 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 178, comments: 0 },
  },
  // ── Agriculture (2 more) ──
  {
    id: "fishtech-bd", founderId: "founder-3", title: "FishTech BD: Smart Aquaculture",
    slug: "fishtech-bd", tagline: "IoT sensors and AI optimizing fish farming yields across Bangladesh's waterways",
    description: "## Opportunity\n\nBangladesh is the world's 5th largest aquaculture producer, but yields are 40% below potential due to poor water management.\n\n## Solution\n\nFishTech installs low-cost IoT sensors in fish ponds that monitor water quality, temperature, and oxygen. Our AI recommends feeding schedules and alerts farmers to disease risks.\n\n## Traction\n\n- 1,800+ ponds connected\n- 35% average yield increase\n- Operating in Mymensingh, Bogura, Jessore",
    category: "Agriculture", coverImageUrl: null, videoUrl: null, goalAmount: 3500000, raisedAmount: 1900000,
    contributorCount: 87, currency: "BDT", startDate: "2025-10-01T00:00:00Z", endDate: "2026-07-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-09-15T00:00:00Z", updatedAt: "2026-03-19T00:00:00Z",
    founder: { ...MOCK_USERS[2] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 240000, profit: 70000, customers: 1500, users: 1800, orders: 1500, expenses: 170000, cashFlow: 70000, teamSize: 10 },
      { period: "2026-02", revenue: 290000, profit: 90000, customers: 1800, users: 2100, orders: 1800, expenses: 200000, cashFlow: 90000, teamSize: 11 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 87, comments: 0 },
  },
  {
    id: "krishibondhu", founderId: "founder-1", title: "KrishiBondhu: Farmer-to-Market Platform",
    slug: "krishibondhu", tagline: "Eliminating middlemen so farmers earn 3x more selling directly to restaurants and retailers",
    description: "## The Problem\n\nBangladeshi farmers earn only 20-30% of the retail price. A chain of 4-5 middlemen takes the rest.\n\n## Our Platform\n\nKrishiBondhu connects farmers directly with restaurants, hotels, and retailers. We handle logistics with cold-chain trucks and guarantee same-day delivery.\n\n## Numbers\n\n- 5,000+ farmers\n- 800+ buyer businesses\n- ৳3 crore monthly GMV\n- 2.8x average farmer income increase",
    category: "Agriculture", coverImageUrl: null, videoUrl: null, goalAmount: 4000000, raisedAmount: 2600000,
    contributorCount: 145, currency: "BDT", startDate: "2025-08-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-07-20T00:00:00Z", updatedAt: "2026-03-17T00:00:00Z",
    founder: { ...MOCK_USERS[0] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 520000, profit: 140000, customers: 4500, users: 5800, orders: 28000, expenses: 380000, cashFlow: 140000, teamSize: 35 },
      { period: "2026-02", revenue: 610000, profit: 175000, customers: 5200, users: 6500, orders: 33000, expenses: 435000, cashFlow: 175000, teamSize: 38 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 145, comments: 0 },
  },
  // ── Education (2 more) ──
  {
    id: "gonit-guru", founderId: "founder-2", title: "Gonit Guru: Math Learning App",
    slug: "gonit-guru", tagline: "Gamified Bengali-language math app making numbers fun for primary school students",
    description: "## The Gap\n\n70% of Bangladeshi 5th graders can't do basic division. Rote learning kills mathematical thinking.\n\n## Our App\n\nGonit Guru teaches math through games, puzzles, and stories — entirely in Bengali. Adaptive difficulty keeps kids challenged but not frustrated.\n\n## Traction\n\n- 120,000+ downloads\n- 45,000 daily active users\n- Used in 200+ schools\n- 2x improvement in test scores",
    category: "Education", coverImageUrl: null, videoUrl: null, goalAmount: 2000000, raisedAmount: 1350000,
    contributorCount: 189, currency: "BDT", startDate: "2025-09-01T00:00:00Z", endDate: "2026-05-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-08-20T00:00:00Z", updatedAt: "2026-03-20T00:00:00Z",
    founder: { ...MOCK_USERS[1] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 180000, profit: 65000, customers: 200, users: 45000, orders: 8500, expenses: 115000, cashFlow: 65000, teamSize: 7 },
      { period: "2026-02", revenue: 220000, profit: 85000, customers: 250, users: 52000, orders: 10200, expenses: 135000, cashFlow: 85000, teamSize: 8 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 189, comments: 0 },
  },
  {
    id: "skill-bridge", founderId: "founder-1", title: "SkillBridge: Vocational Training Platform",
    slug: "skill-bridge", tagline: "Connecting unemployed youth with certified vocational training and guaranteed job placement",
    description: "## The Challenge\n\n40% youth unemployment in Bangladesh. Millions of entry-level jobs go unfilled because employers can't find trained workers.\n\n## Our Model\n\nSkillBridge offers 3-month certified courses in electricals, plumbing, AC repair, mobile repair, and welding — with guaranteed job placement or refund.\n\n## Results\n\n- 6,000+ graduates\n- 94% placement rate\n- ৳18,000 avg starting salary\n- 15 training centers",
    category: "Education", coverImageUrl: null, videoUrl: null, goalAmount: 5500000, raisedAmount: 3200000,
    contributorCount: 210, currency: "BDT", startDate: "2025-06-01T00:00:00Z", endDate: "2026-04-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-05-15T00:00:00Z", updatedAt: "2026-03-21T00:00:00Z",
    founder: { ...MOCK_USERS[0] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 680000, profit: 220000, customers: 5200, users: 8000, orders: 1200, expenses: 460000, cashFlow: 220000, teamSize: 45 },
      { period: "2026-02", revenue: 750000, profit: 260000, customers: 6000, users: 9500, orders: 1400, expenses: 490000, cashFlow: 260000, teamSize: 48 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 210, comments: 0 },
  },
  // ── Healthcare (2 more) ──
  {
    id: "medisupply-bd", founderId: "founder-3", title: "MediSupply BD: Affordable Generic Medicine",
    slug: "medisupply-bd", tagline: "Direct-from-manufacturer generic medicine delivery at 40% lower cost",
    description: "## Problem\n\nMedicine prices in Bangladesh are inflated 30-50% by distributor margins. Counterfeit drugs are widespread in rural areas.\n\n## Solution\n\nMediSupply sources directly from licensed manufacturers and delivers verified generic medicines to pharmacies and patients at wholesale prices.\n\n## Numbers\n\n- 500+ pharmacy partners\n- 2,000+ medicines available\n- 40% avg savings for patients\n- QR verification on every package",
    category: "Healthcare", coverImageUrl: null, videoUrl: null, goalAmount: 6000000, raisedAmount: 3800000,
    contributorCount: 145, currency: "BDT", startDate: "2025-07-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-06-15T00:00:00Z", updatedAt: "2026-03-22T00:00:00Z",
    founder: { ...MOCK_USERS[2] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 890000, profit: 250000, customers: 480, users: 15000, orders: 32000, expenses: 640000, cashFlow: 250000, teamSize: 28 },
      { period: "2026-02", revenue: 1050000, profit: 310000, customers: 520, users: 18000, orders: 38000, expenses: 740000, cashFlow: 310000, teamSize: 30 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 145, comments: 0 },
  },
  {
    id: "manosokhta", founderId: "founder-1", title: "Manosokhta: Mental Health Platform",
    slug: "manosokhta", tagline: "Affordable Bengali-language therapy and counseling for the 30M Bangladeshis who need it",
    description: "## The Crisis\n\n30 million Bangladeshis suffer from mental health conditions. There are only 250 psychiatrists in the entire country. Stigma prevents most from seeking help.\n\n## Our Platform\n\nManosokhta offers anonymous video therapy sessions with trained counselors at ৳500/session (vs ৳3000+ for traditional therapy). All in Bengali.\n\n## Impact\n\n- 12,000+ sessions completed\n- 150+ trained counselors\n- 4.7/5 satisfaction rating\n- 65% of users report improvement after 4 sessions",
    category: "Healthcare", coverImageUrl: null, videoUrl: null, goalAmount: 3000000, raisedAmount: 2100000,
    contributorCount: 234, currency: "BDT", startDate: "2025-09-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-08-15T00:00:00Z", updatedAt: "2026-03-19T00:00:00Z",
    founder: { ...MOCK_USERS[0] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 280000, profit: 90000, customers: 4500, users: 12000, orders: 5600, expenses: 190000, cashFlow: 90000, teamSize: 12 },
      { period: "2026-02", revenue: 340000, profit: 115000, customers: 5200, users: 14500, orders: 6800, expenses: 225000, cashFlow: 115000, teamSize: 14 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 234, comments: 0 },
  },
  // ── E-commerce (2 more) ──
  {
    id: "halal-basket", founderId: "founder-2", title: "HalalBasket: Verified Halal Grocery Delivery",
    slug: "halal-basket", tagline: "Bangladesh's first fully verified halal grocery delivery service with farm traceability",
    description: "## The Need\n\nConsumers want guaranteed halal products but have no way to verify supply chains. Existing delivery apps don't certify halal compliance.\n\n## Our Solution\n\nHalalBasket partners with certified halal farms, processors, and brands. Every product has a QR code linking to its full supply chain journey.\n\n## Traction\n\n- 18,000+ active customers\n- 1,200+ verified products\n- 98% halal certification compliance\n- Dhaka, Chittagong, Sylhet coverage",
    category: "E-commerce", coverImageUrl: null, videoUrl: null, goalAmount: 2800000, raisedAmount: 1900000,
    contributorCount: 156, currency: "BDT", startDate: "2025-10-01T00:00:00Z", endDate: "2026-07-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-09-15T00:00:00Z", updatedAt: "2026-03-20T00:00:00Z",
    founder: { ...MOCK_USERS[1] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 420000, profit: 110000, customers: 15000, users: 18000, orders: 42000, expenses: 310000, cashFlow: 110000, teamSize: 22 },
      { period: "2026-02", revenue: 510000, profit: 145000, customers: 18000, users: 22000, orders: 51000, expenses: 365000, cashFlow: 145000, teamSize: 25 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 156, comments: 0 },
  },
  {
    id: "bazar-compare", founderId: "founder-3", title: "BazarCompare: Price Comparison Engine",
    slug: "bazar-compare", tagline: "Real-time price comparison across 50+ online stores helping Bangladeshis save money",
    description: "## Problem\n\nBangladeshi shoppers waste hours comparing prices across Daraz, Chaldal, PriyoShop, and dozens of other sites.\n\n## Solution\n\nBazarCompare aggregates prices from 50+ stores in real-time. Users search once, see all prices, and buy from the cheapest option.\n\n## Traction\n\n- 200,000+ monthly users\n- 50+ partner stores\n- ৳850 avg savings per user/month\n- Browser extension + mobile app",
    category: "E-commerce", coverImageUrl: null, videoUrl: null, goalAmount: 2000000, raisedAmount: 1250000,
    contributorCount: 98, currency: "BDT", startDate: "2025-11-01T00:00:00Z", endDate: "2026-08-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-10-15T00:00:00Z", updatedAt: "2026-03-18T00:00:00Z",
    founder: { ...MOCK_USERS[2] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 150000, profit: 55000, customers: 180000, users: 200000, orders: 45000, expenses: 95000, cashFlow: 55000, teamSize: 6 },
      { period: "2026-02", revenue: 185000, profit: 72000, customers: 210000, users: 240000, orders: 55000, expenses: 113000, cashFlow: 72000, teamSize: 7 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 98, comments: 0 },
  },
  // ── Food & Beverage (2 more) ──
  {
    id: "cha-republic", founderId: "founder-1", title: "Cha Republic: Premium Bengali Tea Brand",
    slug: "cha-republic", tagline: "Single-origin Sylheti tea brand bringing Bangladesh's finest teas to the world",
    description: "## Story\n\nBangladesh produces some of the world's finest teas but earns only 3% of global tea revenue because it exports in bulk.\n\n## Our Brand\n\nCha Republic sources single-origin teas from Sylhet's best gardens, packages them with premium branding, and sells directly to consumers in 12 countries.\n\n## Traction\n\n- 15 tea varieties\n- Exported to 12 countries\n- 50,000+ customers globally\n- ৳1.5 crore annual revenue",
    category: "Food & Beverage", coverImageUrl: null, videoUrl: null, goalAmount: 3000000, raisedAmount: 2200000,
    contributorCount: 167, currency: "BDT", startDate: "2025-08-01T00:00:00Z", endDate: "2026-05-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-07-15T00:00:00Z", updatedAt: "2026-03-21T00:00:00Z",
    founder: { ...MOCK_USERS[0] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 620000, profit: 210000, customers: 42000, users: 50000, orders: 18000, expenses: 410000, cashFlow: 210000, teamSize: 25 },
      { period: "2026-02", revenue: 710000, profit: 250000, customers: 48000, users: 55000, orders: 21000, expenses: 460000, cashFlow: 250000, teamSize: 27 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 167, comments: 0 },
  },
  {
    id: "spice-trail", founderId: "founder-2", title: "Spice Trail BD: Organic Spice Export",
    slug: "spice-trail", tagline: "Organic Bangladeshi spices reaching premium markets in Europe and North America",
    description: "## Opportunity\n\nBangladesh grows exceptional turmeric, chili, and coriander but exports almost none as branded products.\n\n## Our Model\n\nSpice Trail works with 300+ organic farmers, processes spices in our HACCP-certified facility, and sells to premium retailers globally.\n\n## Numbers\n\n- 12 spice products\n- Sold in Whole Foods, Waitrose\n- 300+ farmer partners\n- EU Organic certified",
    category: "Food & Beverage", coverImageUrl: null, videoUrl: null, goalAmount: 4000000, raisedAmount: 2500000,
    contributorCount: 112, currency: "BDT", startDate: "2025-07-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-06-20T00:00:00Z", updatedAt: "2026-03-17T00:00:00Z",
    founder: { ...MOCK_USERS[1] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 780000, profit: 280000, customers: 85, users: 85, orders: 320, expenses: 500000, cashFlow: 280000, teamSize: 30 },
      { period: "2026-02", revenue: 890000, profit: 330000, customers: 95, users: 95, orders: 380, expenses: 560000, cashFlow: 330000, teamSize: 32 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 112, comments: 0 },
  },
  // ── Creative (2 more) ──
  {
    id: "dhallywood-stream", founderId: "founder-3", title: "Dhallywood Stream: Bengali Film Platform",
    slug: "dhallywood-stream", tagline: "Netflix for Bengali content — original series, classic films, and independent cinema",
    description: "## The Gap\n\nBengali content creators have no platform. YouTube doesn't pay enough, and Netflix ignores Bengali-language originals.\n\n## Our Platform\n\nDhallywood Stream is a subscription platform for Bengali films, series, documentaries, and short films. We fund original productions and give indie filmmakers distribution.\n\n## Traction\n\n- 85,000+ subscribers\n- 500+ titles\n- 12 original productions\n- ৳49/month subscription",
    category: "Creative", coverImageUrl: null, videoUrl: null, goalAmount: 8000000, raisedAmount: 4200000,
    contributorCount: 312, currency: "BDT", startDate: "2025-06-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-05-15T00:00:00Z", updatedAt: "2026-03-22T00:00:00Z",
    founder: { ...MOCK_USERS[2] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 420000, profit: 120000, customers: 72000, users: 85000, orders: 72000, expenses: 300000, cashFlow: 120000, teamSize: 18 },
      { period: "2026-02", revenue: 510000, profit: 155000, customers: 85000, users: 100000, orders: 85000, expenses: 355000, cashFlow: 155000, teamSize: 20 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 312, comments: 0 },
  },
  {
    id: "naksha-design", founderId: "founder-1", title: "Naksha: Bangladeshi Design Studio",
    slug: "naksha-design", tagline: "World-class product design studio showcasing Bangladeshi design talent to global startups",
    description: "## Vision\n\nBangladesh has incredible untapped design talent. Naksha is a premium design studio staffed entirely by Bangladeshi designers, serving global startups.\n\n## Services\n\n- UI/UX design\n- Brand identity\n- Motion graphics\n- Design systems\n\n## Traction\n\n- 45+ global clients (US, UK, EU)\n- 28 designers\n- $95/hr avg rate\n- 98% client retention",
    category: "Creative", coverImageUrl: null, videoUrl: null, goalAmount: 2500000, raisedAmount: 1800000,
    contributorCount: 78, currency: "BDT", startDate: "2025-09-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-08-15T00:00:00Z", updatedAt: "2026-03-19T00:00:00Z",
    founder: { ...MOCK_USERS[0] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 350000, profit: 140000, customers: 38, users: 38, orders: 52, expenses: 210000, cashFlow: 140000, teamSize: 28 },
      { period: "2026-02", revenue: 410000, profit: 170000, customers: 42, users: 42, orders: 58, expenses: 240000, cashFlow: 170000, teamSize: 30 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 78, comments: 0 },
  },
  // ── Manufacturing (2 more) ──
  {
    id: "ceramic-hub", founderId: "founder-2", title: "CeramicHub BD: Export-Quality Ceramics",
    slug: "ceramic-hub", tagline: "Handcrafted Bangladeshi ceramics for international home decor markets",
    description: "## Opportunity\n\nBangladesh's ceramics industry is worth $200M but mostly makes low-value tiles. Premium handcrafted ceramics sell for 10x more internationally.\n\n## Our Factory\n\nCeramicHub trains local artisans in contemporary design and manufactures export-quality tableware, vases, and home decor for international retailers.\n\n## Traction\n\n- Sold in West Elm, Anthropologie\n- 120 artisan employees\n- $500K annual export revenue",
    category: "Manufacturing", coverImageUrl: null, videoUrl: null, goalAmount: 3500000, raisedAmount: 2100000,
    contributorCount: 89, currency: "BDT", startDate: "2025-08-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-07-15T00:00:00Z", updatedAt: "2026-03-20T00:00:00Z",
    founder: { ...MOCK_USERS[1] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 520000, profit: 160000, customers: 25, users: 25, orders: 180, expenses: 360000, cashFlow: 160000, teamSize: 120 },
      { period: "2026-02", revenue: 590000, profit: 190000, customers: 28, users: 28, orders: 210, expenses: 400000, cashFlow: 190000, teamSize: 125 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 89, comments: 0 },
  },
  {
    id: "leather-craft-bd", founderId: "founder-3", title: "LeatherCraft BD: Premium Leather Goods",
    slug: "leather-craft-bd", tagline: "Handmade leather bags and accessories from Hazaribagh's master craftsmen for global markets",
    description: "## Heritage\n\nHazaribagh in Dhaka has been the leather capital of Bangladesh for 200 years. But craftsmen earn poverty wages making products for middlemen.\n\n## Our Brand\n\nLeatherCraft BD works directly with 80 master craftsmen, providing fair wages, design training, and access to global markets through our DTC brand.\n\n## Results\n\n- 80 craftsmen, 3x income increase\n- Sold in 20 countries\n- Featured in Vogue, GQ\n- ৳2 crore annual revenue",
    category: "Manufacturing", coverImageUrl: null, videoUrl: null, goalAmount: 4500000, raisedAmount: 3100000,
    contributorCount: 156, currency: "BDT", startDate: "2025-07-01T00:00:00Z", endDate: "2026-05-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-06-15T00:00:00Z", updatedAt: "2026-03-18T00:00:00Z",
    founder: { ...MOCK_USERS[2] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 680000, profit: 240000, customers: 4500, users: 8000, orders: 2200, expenses: 440000, cashFlow: 240000, teamSize: 85 },
      { period: "2026-02", revenue: 780000, profit: 290000, customers: 5200, users: 9500, orders: 2600, expenses: 490000, cashFlow: 290000, teamSize: 88 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 156, comments: 0 },
  },
  // ── Green Energy (2 more) ──
  {
    id: "biogas-bangla", founderId: "founder-1", title: "Biogas Bangla: Cow Dung to Clean Energy",
    slug: "biogas-bangla", tagline: "Converting cattle waste into cooking gas and organic fertilizer for rural households",
    description: "## The Opportunity\n\nBangladesh has 24 million cattle producing 240 million kg of dung daily. Most is wasted or burned inefficiently.\n\n## Our Model\n\nBiogas Bangla installs affordable biogas digesters that convert cow dung into cooking gas (replacing expensive LPG) and organic fertilizer (replacing chemical fertilizers).\n\n## Impact\n\n- 5,000+ digesters installed\n- ৳3,000/month savings per family\n- 8,000 tons CO2 offset annually",
    category: "Green Energy", coverImageUrl: null, videoUrl: null, goalAmount: 2500000, raisedAmount: 1800000,
    contributorCount: 134, currency: "BDT", startDate: "2025-09-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-08-15T00:00:00Z", updatedAt: "2026-03-21T00:00:00Z",
    founder: { ...MOCK_USERS[0] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 210000, profit: 60000, customers: 4800, users: 4800, orders: 350, expenses: 150000, cashFlow: 60000, teamSize: 20 },
      { period: "2026-02", revenue: 250000, profit: 78000, customers: 5500, users: 5500, orders: 420, expenses: 172000, cashFlow: 78000, teamSize: 22 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 134, comments: 0 },
  },
  {
    id: "e-rickshaw-bd", founderId: "founder-2", title: "E-Rickshaw BD: Electric Three-Wheeler Fleet",
    slug: "e-rickshaw-bd", tagline: "Replacing 1 million polluting auto-rickshaws with electric alternatives across Bangladesh",
    description: "## The Problem\n\nBangladesh has 1.5 million auto-rickshaws running on polluting two-stroke engines. They produce 15% of Dhaka's air pollution.\n\n## Our Solution\n\nE-Rickshaw BD manufactures affordable electric three-wheelers with swappable batteries. Our battery-swap stations mean zero downtime for drivers.\n\n## Progress\n\n- 2,000+ e-rickshaws deployed\n- 50 battery-swap stations\n- 60% fuel cost savings for drivers\n- Operating in Dhaka, Chittagong, Rajshahi",
    category: "Green Energy", coverImageUrl: null, videoUrl: null, goalAmount: 15000000, raisedAmount: 8500000,
    contributorCount: 278, currency: "BDT", startDate: "2025-05-01T00:00:00Z", endDate: "2026-05-01T00:00:00Z",
    status: "ACTIVE", isFeatured: true, platformFee: 5, createdAt: "2025-04-15T00:00:00Z", updatedAt: "2026-03-22T00:00:00Z",
    founder: { ...MOCK_USERS[1] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 2800000, profit: 850000, customers: 1800, users: 2000, orders: 180, expenses: 1950000, cashFlow: 850000, teamSize: 65 },
      { period: "2026-02", revenue: 3200000, profit: 1020000, customers: 2100, users: 2300, orders: 220, expenses: 2180000, cashFlow: 1020000, teamSize: 72 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 278, comments: 0 },
  },
  // ── Fintech (2 more) ──
  {
    id: "bachat-savings", founderId: "founder-3", title: "Bachat: Micro-Savings App",
    slug: "bachat-savings", tagline: "Helping low-income Bangladeshis save ৳10/day and build financial security",
    description: "## The Problem\n\n70% of Bangladeshis have zero savings. Traditional banks require minimum balances of ৳5,000-10,000.\n\n## Our App\n\nBachat lets users save as little as ৳10/day through auto-deductions from bKash/Nagad. We offer 8% annual returns through partner microfinance institutions.\n\n## Traction\n\n- 350,000+ savers\n- ৳85 crore total savings\n- ৳280 average monthly deposit\n- 92% retention rate",
    category: "Fintech", coverImageUrl: null, videoUrl: null, goalAmount: 5000000, raisedAmount: 3500000,
    contributorCount: 198, currency: "BDT", startDate: "2025-07-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-06-15T00:00:00Z", updatedAt: "2026-03-20T00:00:00Z",
    founder: { ...MOCK_USERS[2] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 580000, profit: 220000, customers: 320000, users: 350000, orders: 8500000, expenses: 360000, cashFlow: 220000, teamSize: 15 },
      { period: "2026-02", revenue: 680000, profit: 270000, customers: 380000, users: 410000, orders: 10200000, expenses: 410000, cashFlow: 270000, teamSize: 17 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 198, comments: 0 },
  },
  {
    id: "pay-split", founderId: "founder-1", title: "PaySplit: Bill Splitting for Groups",
    slug: "pay-split", tagline: "Split restaurant bills, rent, and group expenses instantly via bKash and Nagad",
    description: "## The Hassle\n\nEvery group dinner in Dhaka ends with 15 minutes of awkward bKash calculations. Shared expenses among roommates cause constant friction.\n\n## Our App\n\nPaySplit tracks shared expenses, calculates who owes whom, and settles balances with one tap via bKash or Nagad.\n\n## Numbers\n\n- 180,000+ users\n- ৳45 crore settled\n- 4.8/5 App Store rating\n- Used by 25,000+ friend groups",
    category: "Fintech", coverImageUrl: null, videoUrl: null, goalAmount: 1500000, raisedAmount: 1100000,
    contributorCount: 145, currency: "BDT", startDate: "2025-10-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-09-15T00:00:00Z", updatedAt: "2026-03-19T00:00:00Z",
    founder: { ...MOCK_USERS[0] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 120000, profit: 45000, customers: 160000, users: 180000, orders: 520000, expenses: 75000, cashFlow: 45000, teamSize: 8 },
      { period: "2026-02", revenue: 150000, profit: 60000, customers: 185000, users: 210000, orders: 620000, expenses: 90000, cashFlow: 60000, teamSize: 9 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 145, comments: 0 },
  },
  // ── Fashion & Lifestyle (2 more) ──
  {
    id: "aarong-online", founderId: "founder-2", title: "DeshiThreads: Sustainable Streetwear",
    slug: "deshi-threads", tagline: "Streetwear brand celebrating Bengali culture with sustainable manufacturing",
    description: "## Our Brand\n\nDeshiThreads fuses Bengali art, rickshaw painting motifs, and contemporary streetwear design. Every piece is manufactured in our zero-waste facility using organic cotton.\n\n## Traction\n\n- 35,000+ customers\n- Sold in 8 countries\n- Featured in Hypebeast Asia\n- ৳1.8 crore annual revenue\n- 100% organic cotton, zero-waste production",
    category: "Fashion & Lifestyle", coverImageUrl: null, videoUrl: null, goalAmount: 3000000, raisedAmount: 2100000,
    contributorCount: 189, currency: "BDT", startDate: "2025-08-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-07-15T00:00:00Z", updatedAt: "2026-03-21T00:00:00Z",
    founder: { ...MOCK_USERS[1] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 520000, profit: 180000, customers: 30000, users: 35000, orders: 8500, expenses: 340000, cashFlow: 180000, teamSize: 35 },
      { period: "2026-02", revenue: 610000, profit: 220000, customers: 35000, users: 42000, orders: 10200, expenses: 390000, cashFlow: 220000, teamSize: 38 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 189, comments: 0 },
  },
  {
    id: "mukti-cosmetics", founderId: "founder-3", title: "Mukti Naturals: Clean Beauty Brand",
    slug: "mukti-cosmetics", tagline: "Bangladesh's first clean beauty brand using indigenous herbs and zero harmful chemicals",
    description: "## The Problem\n\nMost affordable cosmetics in Bangladesh contain harmful chemicals. Natural alternatives are imported and expensive.\n\n## Our Products\n\nMukti Naturals creates skincare and haircare products using indigenous Bangladeshi herbs — neem, turmeric, black seed — all lab-tested and dermatologist approved.\n\n## Traction\n\n- 22 products launched\n- 45,000+ customers\n- Sold in 1,500+ pharmacies\n- Zero harmful chemicals guaranteed",
    category: "Fashion & Lifestyle", coverImageUrl: null, videoUrl: null, goalAmount: 2000000, raisedAmount: 1400000,
    contributorCount: 167, currency: "BDT", startDate: "2025-09-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z",
    status: "ACTIVE", isFeatured: false, platformFee: 5, createdAt: "2025-08-15T00:00:00Z", updatedAt: "2026-03-18T00:00:00Z",
    founder: { ...MOCK_USERS[2] }, milestones: [], metrics: [
      { period: "2026-01", revenue: 380000, profit: 130000, customers: 38000, users: 45000, orders: 12000, expenses: 250000, cashFlow: 130000, teamSize: 18 },
      { period: "2026-02", revenue: 450000, profit: 160000, customers: 45000, users: 52000, orders: 14500, expenses: 290000, cashFlow: 160000, teamSize: 20 },
    ], documents: [], updates: [], comments: [], _count: { contributions: 167, comments: 0 },
  },
];

export function getMockCampaign(idOrSlug: string) {
  return MOCK_CAMPAIGNS.find(c => c.id === idOrSlug || c.slug === idOrSlug) || null;
}

export function getMockCampaigns() {
  return MOCK_CAMPAIGNS;
}

export function getMockUser(id: string) {
  return MOCK_USERS.find(u => u.id === id) || null;
}
