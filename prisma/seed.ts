import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
// @ts-ignore - PrismaClient constructor typing issue with Prisma 7.5
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const passwordHash = await hash("Admin123!", 12);
  const founderHash = await hash("Founder123!", 12);
  const supporterHash = await hash("Supporter123!", 12);

  // ── Admin ──
  const admin = await prisma.user.create({
    data: {
      email: "admin@fundbd.com",
      passwordHash,
      emailVerified: true,
      role: "ADMIN",
      profile: {
        create: {
          displayName: "FundBD Admin",
          bio: "Platform administrator for FundBD.",
          phone: "+8801700000000",
          location: "Dhaka, Bangladesh",
        },
      },
    },
  });

  // ── Founders ──
  const founder1 = await prisma.user.create({
    data: {
      email: "rahim@techdhaka.com",
      passwordHash: founderHash,
      emailVerified: true,
      role: "FOUNDER",
      profile: {
        create: {
          displayName: "Rahim Uddin",
          bio: "Serial tech entrepreneur from Dhaka. Founded two successful SaaS startups serving Bangladesh's SME sector. Passionate about digital transformation in emerging markets.",
          phone: "+8801711111111",
          nidNumber: "1990123456789",
          location: "Gulshan, Dhaka",
          website: "https://techdhaka.com",
          linkedin: "https://linkedin.com/in/rahimuddin",
          companyName: "TechDhaka Ltd.",
          companyRole: "CEO & Founder",
        },
      },
      trustScore: {
        create: {
          score: 85,
          kycComplete: true,
          revenueVerified: true,
          businessReg: true,
          teamListed: true,
          financialData: true,
          updatesPosted: true,
          docsUploaded: true,
          badges: ["verified_founder", "top_rated", "revenue_verified"],
        },
      },
      verifications: {
        createMany: {
          data: [
            { type: "NID", status: "VERIFIED", notes: "National ID verified" },
            { type: "BUSINESS_REG", status: "VERIFIED", notes: "RJSC registration confirmed" },
            { type: "REVENUE_PROOF", status: "VERIFIED", notes: "Bank statements verified" },
          ],
        },
      },
    },
  });

  const founder2 = await prisma.user.create({
    data: {
      email: "fatima@greenagri.bd",
      passwordHash: founderHash,
      emailVerified: true,
      role: "FOUNDER",
      profile: {
        create: {
          displayName: "Fatima Akter",
          bio: "Agricultural innovator bringing modern farming techniques to rural Bangladesh. Former researcher at BARI with 8 years of experience in agritech solutions.",
          phone: "+8801822222222",
          nidNumber: "1992987654321",
          location: "Rajshahi, Bangladesh",
          website: "https://greenagri.bd",
          companyName: "GreenAgri Bangladesh",
          companyRole: "Founder & Managing Director",
        },
      },
      trustScore: {
        create: {
          score: 72,
          kycComplete: true,
          revenueVerified: false,
          businessReg: true,
          teamListed: true,
          financialData: true,
          updatesPosted: false,
          docsUploaded: true,
          badges: ["verified_founder", "social_impact"],
        },
      },
      verifications: {
        createMany: {
          data: [
            { type: "NID", status: "VERIFIED", notes: "National ID verified" },
            { type: "BUSINESS_REG", status: "VERIFIED", notes: "Trade license confirmed" },
          ],
        },
      },
    },
  });

  const founder3 = await prisma.user.create({
    data: {
      email: "kamal@edunext.com.bd",
      passwordHash: founderHash,
      emailVerified: true,
      role: "FOUNDER",
      profile: {
        create: {
          displayName: "Kamal Hossain",
          bio: "Education technology pioneer. Built one of the first Bangla e-learning platforms. Believes every child in Bangladesh deserves access to quality education.",
          phone: "+8801933333333",
          nidNumber: "1988456789012",
          location: "Chittagong, Bangladesh",
          website: "https://edunext.com.bd",
          linkedin: "https://linkedin.com/in/kamalhossain",
          companyName: "EduNext Bangladesh",
          companyRole: "Co-Founder & CTO",
        },
      },
      trustScore: {
        create: {
          score: 68,
          kycComplete: true,
          revenueVerified: true,
          businessReg: true,
          teamListed: false,
          financialData: false,
          updatesPosted: true,
          docsUploaded: true,
          badges: ["verified_founder", "revenue_verified"],
        },
      },
      verifications: {
        createMany: {
          data: [
            { type: "NID", status: "VERIFIED", notes: "National ID verified" },
            { type: "BUSINESS_REG", status: "VERIFIED", notes: "RJSC registration confirmed" },
            { type: "KYC_BASIC", status: "VERIFIED", notes: "Basic KYC complete" },
          ],
        },
      },
    },
  });

  // ── Supporters ──
  const supporters = await Promise.all([
    prisma.user.create({
      data: {
        email: "nusrat@gmail.com",
        passwordHash: supporterHash,
        emailVerified: true,
        role: "SUPPORTER",
        profile: {
          create: {
            displayName: "Nusrat Jahan",
            bio: "Angel investor interested in Bangladesh's tech ecosystem.",
            phone: "+8801744444444",
            location: "Dhanmondi, Dhaka",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "arif@outlook.com",
        passwordHash: supporterHash,
        emailVerified: true,
        role: "SUPPORTER",
        profile: {
          create: {
            displayName: "Arif Rahman",
            bio: "Banker turned startup enthusiast. Supporting local innovations.",
            phone: "+8801855555555",
            location: "Banani, Dhaka",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "salma@yahoo.com",
        passwordHash: supporterHash,
        emailVerified: true,
        role: "SUPPORTER",
        profile: {
          create: {
            displayName: "Salma Begum",
            bio: "Social impact advocate. Focused on women-led enterprises in Bangladesh.",
            phone: "+8801966666666",
            location: "Sylhet, Bangladesh",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "tanvir@gmail.com",
        passwordHash: supporterHash,
        emailVerified: true,
        role: "SUPPORTER",
        profile: {
          create: {
            displayName: "Tanvir Ahmed",
            bio: "NRB based in London. Keen on investing back home.",
            phone: "+447912345678",
            location: "London, UK",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "mitu@proton.me",
        passwordHash: supporterHash,
        emailVerified: true,
        role: "SUPPORTER",
        profile: {
          create: {
            displayName: "Mitu Das",
            bio: "Healthcare professional with interest in health-tech startups.",
            phone: "+8801677777777",
            location: "Khulna, Bangladesh",
          },
        },
      },
    }),
  ]);

  // ── Campaigns ──
  const campaign1 = await prisma.campaign.create({
    data: {
      founderId: founder1.id,
      title: "ShopEasy - AI-Powered E-commerce for Bangladeshi SMEs",
      slug: "shopeasy-ai-ecommerce-sme",
      tagline: "Empowering 10,000 small businesses with intelligent online storefronts",
      description:
        "ShopEasy is an AI-powered e-commerce platform tailored for Bangladesh's 7.8 million SMEs. Our platform provides instant store setup in Bangla, AI-driven inventory management, integrated bKash/Nagad payments, and logistics partnerships with Pathao and RedX. We have already onboarded 850 merchants in our beta phase generating BDT 2.3 crore in GMV. This funding round will help us scale to 10,000 merchants across all 64 districts and launch our AI recommendation engine.",
      category: "Technology",
      goalAmount: 5000000,
      raisedAmount: 3750000,
      contributorCount: 142,
      startDate: new Date("2025-11-01"),
      endDate: new Date("2026-05-01"),
      status: "ACTIVE",
      isFeatured: true,
      platformFee: 5,
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      founderId: founder2.id,
      title: "Solar Drip Irrigation for Barind Tract Farmers",
      slug: "solar-drip-irrigation-barind",
      tagline: "Sustainable water solutions for 500 drought-affected farming families",
      description:
        "The Barind Tract in northwest Bangladesh faces severe water scarcity, with groundwater levels dropping 1 meter per year. Our solar-powered drip irrigation system reduces water usage by 60% while increasing crop yields by 35%. Each unit costs BDT 45,000 and serves one bigha of farmland. We aim to install 500 systems across Rajshahi and Chapainawabganj, directly benefiting 500 families and indirectly improving food security for 3,000 people. Our pilot with 50 farmers showed a 40% increase in seasonal income.",
      category: "Agriculture",
      goalAmount: 22500000,
      raisedAmount: 22500000,
      contributorCount: 318,
      startDate: new Date("2025-08-15"),
      endDate: new Date("2026-02-15"),
      status: "FUNDED",
      isFeatured: true,
      platformFee: 3,
    },
  });

  const campaign3 = await prisma.campaign.create({
    data: {
      founderId: founder3.id,
      title: "PathShala - Interactive Bangla Learning App for Rural Schools",
      slug: "pathshala-bangla-learning-app",
      tagline: "Quality education for 50,000 children where teachers are scarce",
      description:
        "PathShala is an offline-first educational app designed for students in grades 1-8 in rural Bangladesh. With 33% of primary schools having only one teacher, our gamified Bangla-medium content fills a critical gap. The app works without internet, syncing progress when connectivity is available. Our pilot in 25 schools in Netrokona showed a 28% improvement in math scores and 22% improvement in reading comprehension. This campaign will fund content for all 8 grade levels and distribute 2,000 preloaded tablets.",
      category: "Education",
      goalAmount: 8000000,
      raisedAmount: 4200000,
      contributorCount: 203,
      startDate: new Date("2025-12-01"),
      endDate: new Date("2026-06-01"),
      status: "ACTIVE",
      isFeatured: false,
      platformFee: 4,
    },
  });

  const campaign4 = await prisma.campaign.create({
    data: {
      founderId: founder1.id,
      title: "HealthBridge - Telemedicine for Char Dwellers",
      slug: "healthbridge-telemedicine-char",
      tagline: "Connecting 100 riverine islands to qualified doctors via mobile health kiosks",
      description:
        "Over 6 million people live on chars (riverine islands) in Bangladesh with virtually no access to healthcare. HealthBridge deploys solar-powered mobile health kiosks staffed by trained community health workers, connected to qualified MBBS doctors via video consultation. Each kiosk serves approximately 5,000 people and includes basic diagnostic equipment, a pharmacy, and maternal care supplies. We have 12 operational kiosks and need funding to expand to 100 across the Jamuna and Padma river basins.",
      category: "Healthcare",
      goalAmount: 15000000,
      raisedAmount: 1200000,
      contributorCount: 67,
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-07-15"),
      status: "ACTIVE",
      isFeatured: false,
      platformFee: 3,
    },
  });

  const campaign5 = await prisma.campaign.create({
    data: {
      founderId: founder2.id,
      title: "Misti Ghor - Artisan Bengali Sweets Direct to Your Door",
      slug: "misti-ghor-artisan-sweets",
      tagline: "Preserving traditional Bengali misti-making with a modern delivery network",
      description:
        "Misti Ghor partners with 40 traditional sweet artisans across Bogura, Tangail, and Comilla to deliver authentic handmade mishti nationwide. We ensure fair wages for karigors (artisans) while maintaining the heritage recipes that make Bengali sweets world-renowned. Our cold-chain logistics solution keeps sweets fresh for 72 hours. In our soft launch, we fulfilled 1,200 orders with a 4.8/5 customer rating. This funding will build our cold storage facilities, expand our artisan network, and launch our subscription service.",
      category: "Food & Beverage",
      goalAmount: 3500000,
      raisedAmount: 0,
      contributorCount: 0,
      status: "PENDING_REVIEW",
      platformFee: 5,
    },
  });

  const campaign6 = await prisma.campaign.create({
    data: {
      founderId: founder3.id,
      title: "Bangla Boi - Digital Publishing Platform for Local Authors",
      slug: "bangla-boi-digital-publishing",
      tagline: "Democratizing book publishing for 5,000 Bangladeshi writers",
      description:
        "Bangla Boi is a self-publishing platform that lets Bangladeshi authors publish, distribute, and monetize their work digitally. We offer Bangla typesetting tools, professional cover design, ISBN registration, and distribution to major e-book stores. Authors keep 70% of royalties compared to the industry standard of 8-12%. We already have 320 published titles and 45,000 monthly active readers. Funding will go towards our audiobook production studio and partnerships with mobile operators for carrier billing.",
      category: "Creative",
      goalAmount: 4500000,
      raisedAmount: 0,
      contributorCount: 0,
      status: "DRAFT",
      platformFee: 5,
    },
  });

  const campaign7 = await prisma.campaign.create({
    data: {
      founderId: founder1.id,
      title: "NagadPay Analytics - Financial Dashboard for Micro-Merchants",
      slug: "nagadpay-analytics-micro-merchants",
      tagline: "Turning mobile money data into business insights for street vendors",
      description:
        "Bangladesh has 3.2 million micro-merchants processing payments through bKash and Nagad but with zero visibility into their business performance. NagadPay Analytics connects to existing mobile wallets and provides simple Bangla-language dashboards showing daily revenue, peak hours, customer frequency, and inventory suggestions. Our machine learning model predicts cash flow with 82% accuracy, helping vendors avoid stockouts. We have 2,100 active users in our Dhaka pilot. Funding will expand to 8 divisional cities and build our micro-lending score.",
      category: "Fintech",
      goalAmount: 7000000,
      raisedAmount: 2100000,
      contributorCount: 89,
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-08-01"),
      status: "ACTIVE",
      isFeatured: true,
      platformFee: 5,
    },
  });

  const campaign8 = await prisma.campaign.create({
    data: {
      founderId: founder2.id,
      title: "JuteCraft - Sustainable Jute Fashion for Global Markets",
      slug: "jutecraft-sustainable-fashion",
      tagline: "Reviving Bangladesh's golden fiber through contemporary fashion design",
      description:
        "JuteCraft transforms raw jute into premium fashion accessories and home decor products for export markets. Working with 200 women artisans in Mymensingh, we blend traditional jute weaving with modern design sensibility. Our products are sold in 15 countries through partnerships with ethical fashion retailers. Each artisan earns 3x the local average wage. This campaign funds our new design studio, quality control lab, and EU market expansion. Pre-orders worth BDT 85 lakh already confirmed for 2026.",
      category: "Fashion & Lifestyle",
      goalAmount: 6000000,
      raisedAmount: 4800000,
      contributorCount: 156,
      startDate: new Date("2025-10-01"),
      endDate: new Date("2026-04-01"),
      status: "ACTIVE",
      isFeatured: false,
      platformFee: 4,
    },
  });

  // ── Metrics (6 months for campaigns 1, 2, 3) ──
  const months = ["2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12"];

  // Campaign 1 - ShopEasy metrics
  for (let i = 0; i < months.length; i++) {
    await prisma.metric.create({
      data: {
        campaignId: campaign1.id,
        period: months[i],
        revenue: 180000 + i * 45000,
        profit: 25000 + i * 12000,
        customers: 120 + i * 85,
        users: 850 + i * 200,
        orders: 300 + i * 150,
        expenses: 155000 + i * 33000,
        cashFlow: 25000 + i * 12000,
        teamSize: 8 + Math.floor(i / 2),
      },
    });
  }

  // Campaign 2 - Solar Irrigation metrics
  for (let i = 0; i < months.length; i++) {
    await prisma.metric.create({
      data: {
        campaignId: campaign2.id,
        period: months[i],
        revenue: 0,
        profit: 0,
        customers: 50 + i * 75,
        users: 50 + i * 75,
        expenses: 450000 + i * 200000,
        cashFlow: -450000 + i * 50000,
        teamSize: 12 + i,
      },
    });
  }

  // Campaign 3 - PathShala metrics
  for (let i = 0; i < months.length; i++) {
    await prisma.metric.create({
      data: {
        campaignId: campaign3.id,
        period: months[i],
        revenue: 50000 + i * 20000,
        profit: -80000 + i * 25000,
        customers: 25 + i * 5,
        users: 2500 + i * 4000,
        orders: 0,
        expenses: 130000 + i * 15000,
        cashFlow: -80000 + i * 25000,
        teamSize: 6 + Math.floor(i / 3),
      },
    });
  }

  // ── Milestones ──
  const milestoneSets = [
    {
      campaignId: campaign1.id,
      milestones: [
        { title: "Beta Launch & 500 Merchants", description: "Complete beta testing and onboard first 500 merchants with full store capabilities.", budgetAllocation: 800000, targetDate: new Date("2025-12-15"), completionPct: 100, status: "COMPLETED" as const, sortOrder: 1 },
        { title: "AI Recommendation Engine", description: "Deploy machine learning-based product recommendation system for shoppers.", budgetAllocation: 1200000, targetDate: new Date("2026-02-01"), completionPct: 65, status: "IN_PROGRESS" as const, sortOrder: 2 },
        { title: "Logistics Integration", description: "Integrate with Pathao, RedX, and Paperfly for automated order fulfillment.", budgetAllocation: 600000, targetDate: new Date("2026-03-15"), completionPct: 30, status: "IN_PROGRESS" as const, sortOrder: 3 },
        { title: "Scale to 10,000 Merchants", description: "Nationwide expansion across all 64 districts with regional sales teams.", budgetAllocation: 2400000, targetDate: new Date("2026-05-01"), completionPct: 0, status: "PLANNED" as const, sortOrder: 4 },
      ],
    },
    {
      campaignId: campaign2.id,
      milestones: [
        { title: "Pilot Phase - 50 Units", description: "Install and test 50 solar drip irrigation systems in Godagari upazila.", budgetAllocation: 2250000, targetDate: new Date("2025-10-01"), completionPct: 100, status: "COMPLETED" as const, sortOrder: 1 },
        { title: "Phase 2 - 200 Units", description: "Expand to Tanore and Nachol upazilas with 200 additional systems.", budgetAllocation: 9000000, targetDate: new Date("2025-12-31"), completionPct: 100, status: "COMPLETED" as const, sortOrder: 2 },
        { title: "Phase 3 - 250 Units", description: "Final rollout covering Chapainawabganj district.", budgetAllocation: 11250000, targetDate: new Date("2026-02-15"), completionPct: 80, status: "IN_PROGRESS" as const, sortOrder: 3 },
      ],
    },
    {
      campaignId: campaign3.id,
      milestones: [
        { title: "Content for Grades 1-4", description: "Develop gamified learning modules for primary level in Bangla medium.", budgetAllocation: 2000000, targetDate: new Date("2026-01-31"), completionPct: 100, status: "COMPLETED" as const, sortOrder: 1 },
        { title: "Content for Grades 5-8", description: "Develop content aligned with NCTB curriculum for junior secondary level.", budgetAllocation: 2500000, targetDate: new Date("2026-03-31"), completionPct: 40, status: "IN_PROGRESS" as const, sortOrder: 2 },
        { title: "Tablet Distribution", description: "Procure and distribute 2,000 preloaded tablets to 50 rural schools.", budgetAllocation: 3500000, targetDate: new Date("2026-06-01"), completionPct: 0, status: "PLANNED" as const, sortOrder: 3 },
      ],
    },
    {
      campaignId: campaign4.id,
      milestones: [
        { title: "Kiosk Design & Prototype", description: "Finalize solar-powered mobile health kiosk design with diagnostic equipment.", budgetAllocation: 1500000, targetDate: new Date("2026-03-01"), completionPct: 45, status: "IN_PROGRESS" as const, sortOrder: 1 },
        { title: "Deploy 50 Kiosks - Jamuna Basin", description: "Install kiosks on 50 chars along the Jamuna river with trained health workers.", budgetAllocation: 7500000, targetDate: new Date("2026-05-15"), completionPct: 0, status: "PLANNED" as const, sortOrder: 2 },
        { title: "Deploy 50 Kiosks - Padma Basin", description: "Expand to Padma river chars covering Faridpur and Shariatpur.", budgetAllocation: 6000000, targetDate: new Date("2026-07-15"), completionPct: 0, status: "PLANNED" as const, sortOrder: 3 },
      ],
    },
  ];

  for (const set of milestoneSets) {
    for (const ms of set.milestones) {
      await prisma.milestone.create({
        data: { campaignId: set.campaignId, ...ms },
      });
    }
  }

  // ── Contributions & Transactions ──
  const contributionData = [
    { userId: supporters[0].id, campaignId: campaign1.id, amount: 50000, status: "COMPLETED" as const, provider: "BKASH" as const },
    { userId: supporters[1].id, campaignId: campaign1.id, amount: 100000, status: "COMPLETED" as const, provider: "NAGAD" as const },
    { userId: supporters[2].id, campaignId: campaign1.id, amount: 25000, status: "COMPLETED" as const, provider: "BKASH" as const },
    { userId: supporters[3].id, campaignId: campaign1.id, amount: 200000, status: "COMPLETED" as const, provider: "SSLCOMMERZ" as const },
    { userId: supporters[4].id, campaignId: campaign1.id, amount: 15000, status: "COMPLETED" as const, provider: "ROCKET" as const },
    { userId: supporters[0].id, campaignId: campaign2.id, amount: 100000, status: "COMPLETED" as const, provider: "BKASH" as const },
    { userId: supporters[1].id, campaignId: campaign2.id, amount: 250000, status: "COMPLETED" as const, provider: "SSLCOMMERZ" as const },
    { userId: supporters[3].id, campaignId: campaign2.id, amount: 500000, status: "COMPLETED" as const, provider: "CARD" as const },
    { userId: supporters[0].id, campaignId: campaign3.id, amount: 30000, status: "COMPLETED" as const, provider: "BKASH" as const },
    { userId: supporters[2].id, campaignId: campaign3.id, amount: 75000, status: "COMPLETED" as const, provider: "NAGAD" as const },
    { userId: supporters[4].id, campaignId: campaign3.id, amount: 10000, status: "PENDING" as const, provider: "BKASH" as const },
    { userId: supporters[1].id, campaignId: campaign4.id, amount: 50000, status: "COMPLETED" as const, provider: "BKASH" as const },
    { userId: supporters[3].id, campaignId: campaign7.id, amount: 150000, status: "COMPLETED" as const, provider: "SSLCOMMERZ" as const },
    { userId: supporters[2].id, campaignId: campaign8.id, amount: 80000, status: "COMPLETED" as const, provider: "NAGAD" as const },
    { userId: supporters[4].id, campaignId: campaign8.id, amount: 45000, status: "COMPLETED" as const, provider: "BKASH" as const },
  ];

  for (const cd of contributionData) {
    const contribution = await prisma.contribution.create({
      data: {
        userId: cd.userId,
        campaignId: cd.campaignId,
        amount: cd.amount,
        status: cd.status,
        paymentProvider: cd.provider,
        providerTxId: cd.status === "COMPLETED" ? `TXN${Date.now()}${Math.random().toString(36).slice(2, 8)}` : null,
      },
    });

    if (cd.status === "COMPLETED") {
      await prisma.transaction.create({
        data: {
          contributionId: contribution.id,
          provider: cd.provider,
          providerTxId: contribution.providerTxId,
          amount: cd.amount,
          fee: Math.round(Number(cd.amount) * 0.015),
          status: "SUCCESS",
        },
      });
    }
  }

  // ── Documents (Data Room) ──
  const documents = [
    { campaignId: campaign1.id, name: "Business Plan 2026", type: "pdf", fileUrl: "/uploads/docs/shopeasy-business-plan.pdf", fileSize: 2450000, visibility: "INVESTORS_ONLY" as const },
    { campaignId: campaign1.id, name: "Financial Projections", type: "xlsx", fileUrl: "/uploads/docs/shopeasy-financials.xlsx", fileSize: 890000, visibility: "INVESTORS_ONLY" as const },
    { campaignId: campaign1.id, name: "Product Demo Video", type: "mp4", fileUrl: "/uploads/docs/shopeasy-demo.mp4", fileSize: 45000000, visibility: "PUBLIC" as const },
    { campaignId: campaign1.id, name: "RJSC Registration Certificate", type: "pdf", fileUrl: "/uploads/docs/shopeasy-rjsc.pdf", fileSize: 350000, visibility: "PUBLIC" as const },
    { campaignId: campaign2.id, name: "Impact Assessment Report", type: "pdf", fileUrl: "/uploads/docs/solar-impact-report.pdf", fileSize: 5200000, visibility: "PUBLIC" as const },
    { campaignId: campaign2.id, name: "Technical Specifications", type: "pdf", fileUrl: "/uploads/docs/solar-tech-specs.pdf", fileSize: 1800000, visibility: "PUBLIC" as const },
    { campaignId: campaign2.id, name: "Pilot Results Data", type: "xlsx", fileUrl: "/uploads/docs/solar-pilot-data.xlsx", fileSize: 420000, visibility: "INVESTORS_ONLY" as const },
    { campaignId: campaign3.id, name: "Curriculum Alignment Report", type: "pdf", fileUrl: "/uploads/docs/pathshala-curriculum.pdf", fileSize: 3100000, visibility: "PUBLIC" as const },
    { campaignId: campaign3.id, name: "Pilot School Results", type: "pdf", fileUrl: "/uploads/docs/pathshala-pilot-results.pdf", fileSize: 1500000, visibility: "PUBLIC" as const },
    { campaignId: campaign4.id, name: "Health Kiosk Prototype Design", type: "pdf", fileUrl: "/uploads/docs/healthbridge-kiosk-design.pdf", fileSize: 7800000, visibility: "PUBLIC" as const },
  ];

  await prisma.document.createMany({ data: documents });

  // ── Campaign Updates ──
  await prisma.campaignUpdate.createMany({
    data: [
      { campaignId: campaign1.id, title: "Beta milestone reached!", content: "We are thrilled to announce that ShopEasy has crossed 850 active merchants on our beta platform. GMV has reached BDT 2.3 crore in just 4 months. Our merchant retention rate stands at 91%, which is well above industry average. Thank you to all our backers for making this possible!", createdAt: new Date("2026-01-15") },
      { campaignId: campaign1.id, title: "AI engine preview", content: "Here is a sneak peek at our AI recommendation engine. In A/B tests, shops using our AI suggestions saw a 23% increase in average order value. We are on track for the February release. Stay tuned for a live demo next week!", createdAt: new Date("2026-02-20") },
      { campaignId: campaign2.id, title: "Phase 2 complete - 250 systems installed!", content: "We have successfully installed 250 solar drip irrigation systems across Tanore and Nachol upazilas. Early data shows farmers are using 58% less water compared to traditional flood irrigation. Boro rice yields are up by an estimated 32%. Alhamdulillah!", createdAt: new Date("2025-12-28") },
      { campaignId: campaign2.id, title: "Featured in Daily Star!", content: "Our project was featured in The Daily Star's special report on climate-smart agriculture. The coverage has brought significant attention to the water crisis in the Barind Tract. We have received inquiries from BRAC and the World Bank for potential partnership.", createdAt: new Date("2026-01-20") },
      { campaignId: campaign3.id, title: "Grade 1-4 content is live!", content: "We have completed all learning modules for grades 1 through 4, covering Mathematics, Bangla, English, and Science. The content includes 1,200 interactive exercises, 400 animated lessons, and 80 assessment quizzes. All content is aligned with the 2024 NCTB curriculum.", createdAt: new Date("2026-02-01") },
      { campaignId: campaign8.id, title: "EU buyer commitment secured", content: "Exciting news! We have secured pre-order commitments worth BDT 85 lakh from ethical fashion retailers in Germany, Netherlands, and Sweden for our 2026 spring-summer collection. Our artisans in Mymensingh have begun production of the initial batch.", createdAt: new Date("2026-03-01") },
    ],
  });

  // ── Comments ──
  const comment1 = await prisma.comment.create({
    data: {
      campaignId: campaign1.id,
      userId: supporters[0].id,
      content: "This is exactly what Bangladesh's small businesses need. The AI inventory management feature sounds incredibly useful for shop owners who currently manage everything in paper ledgers. How will you handle onboarding for merchants who are not tech-savvy?",
    },
  });

  await prisma.comment.create({
    data: {
      campaignId: campaign1.id,
      userId: founder1.id,
      content: "Great question! We have a dedicated field team that visits merchants in person. The onboarding process takes only 15 minutes and our interface is designed with large buttons and Bangla text. We also provide a toll-free helpline in Bangla.",
      parentId: comment1.id,
    },
  });

  await prisma.comment.create({
    data: {
      campaignId: campaign2.id,
      userId: supporters[2].id,
      content: "As someone from Rajshahi, I can confirm the water crisis is very real. My family's farmland has been severely affected. This project gives me hope. JazakAllah khair to the team!",
    },
  });

  await prisma.comment.create({
    data: {
      campaignId: campaign3.id,
      userId: supporters[3].id,
      content: "Being an NRB, it is heartwarming to see technology being used to solve real educational challenges back home. The offline-first approach is brilliant given the connectivity issues in rural areas. Donated and sharing with my network in London.",
    },
  });

  // ── Notifications ──
  await prisma.notification.createMany({
    data: [
      { userId: founder1.id, title: "New contribution received", message: "Nusrat Jahan contributed BDT 50,000 to ShopEasy.", link: "/campaigns/shopeasy-ai-ecommerce-sme", read: true },
      { userId: founder1.id, title: "Campaign milestone reached", message: "ShopEasy has reached 75% of its funding goal!", link: "/campaigns/shopeasy-ai-ecommerce-sme", read: true },
      { userId: founder1.id, title: "New comment on your campaign", message: "Nusrat Jahan commented on ShopEasy.", link: "/campaigns/shopeasy-ai-ecommerce-sme", read: false },
      { userId: founder2.id, title: "Campaign fully funded!", message: "Congratulations! Solar Drip Irrigation has reached its funding goal of BDT 2,25,00,000!", link: "/campaigns/solar-drip-irrigation-barind", read: true },
      { userId: founder2.id, title: "Campaign submitted for review", message: "Misti Ghor has been submitted and is pending admin review.", link: "/campaigns/misti-ghor-artisan-sweets", read: false },
      { userId: supporters[0].id, title: "Campaign update", message: "ShopEasy posted a new update: Beta milestone reached!", link: "/campaigns/shopeasy-ai-ecommerce-sme", read: false },
      { userId: supporters[3].id, title: "Campaign update", message: "Solar Drip Irrigation posted a new update.", link: "/campaigns/solar-drip-irrigation-barind", read: false },
      { userId: admin.id, title: "Campaign pending review", message: "A new campaign 'Misti Ghor' requires admin review.", link: "/admin/campaigns", read: false },
    ],
  });

  // ── Saved Campaigns ──
  await prisma.savedCampaign.createMany({
    data: [
      { userId: supporters[0].id, campaignId: campaign1.id },
      { userId: supporters[0].id, campaignId: campaign3.id },
      { userId: supporters[1].id, campaignId: campaign2.id },
      { userId: supporters[3].id, campaignId: campaign1.id },
      { userId: supporters[3].id, campaignId: campaign4.id },
      { userId: supporters[2].id, campaignId: campaign8.id },
    ],
  });

  // ── Audit Logs ──
  await prisma.auditLog.createMany({
    data: [
      { userId: admin.id, action: "APPROVE_CAMPAIGN", entity: "Campaign", entityId: campaign1.id, metadata: { reason: "All documents verified" }, ipAddress: "103.15.245.1" },
      { userId: admin.id, action: "APPROVE_CAMPAIGN", entity: "Campaign", entityId: campaign2.id, metadata: { reason: "Social impact project approved" }, ipAddress: "103.15.245.1" },
      { userId: founder1.id, action: "CREATE_CAMPAIGN", entity: "Campaign", entityId: campaign1.id, ipAddress: "103.15.245.22" },
      { userId: founder2.id, action: "CREATE_CAMPAIGN", entity: "Campaign", entityId: campaign2.id, ipAddress: "103.15.245.35" },
      { userId: founder3.id, action: "CREATE_CAMPAIGN", entity: "Campaign", entityId: campaign3.id, ipAddress: "103.15.245.48" },
    ],
  });

  console.log("Seed complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
