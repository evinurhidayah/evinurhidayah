import { ContentData } from '../types';

export const content: ContentData = {
  hero: {
    name: "Evi Nur Hidayah", // [cite: 1]
    role: "System Analyst", // [cite: 2]
    tagline: "Translating complex business requirements into scalable system architectures and robust technical solutions.", // [cite: 5, 6]
    buttonText: "View My Resume"
  },
  about: {
    title: "System Profile",
    storyTitle: "The Origin Story",
    story: [
      "My journey is defined by bridging the gap between business needs and IT execution. As a Business System Analyst, I specialize in designing complex application ecosystems.", // [cite: 5, 20]
      "I have led development teams of 15+ programmers, ensuring that every sprint delivers value through precise technical specifications like PRD, ERD, and UML.", // [cite: 10, 6]
      "From integrating Big Data technologies like BigQuery to architecting Microservices, I focus on building solutions that are not just functional, but scalable and data-driven." // [cite: 5, 17]
    ],
    softSkills: [
      {
        title: "Team Leadership",
        desc: "Coordinated 15+ programmers and managed sprint priorities to ensure 100% on-time completion.", // [cite: 10]
        iconName: "users"
      },
      {
        title: "Strategic Analysis",
        desc: "Translating complex business requirements into actionable technical specifications (PRD/ERD).", // [cite: 6, 26]
        iconName: "brain"
      },
      {
        title: "Process Optimization",
        desc: "Identifying bottlenecks and streamlining workflows to improve operational efficiency.", // [cite: 25, 40]
        iconName: "zap"
      }
    ],
    education: [
      {
        degree: "Bachelor of Informatics", // [cite: 65]
        school: "Universitas Teknologi Yogyakarta", // [cite: 66]
        year: "2021 - 2025", // [cite: 68]
        iconName: "grad"
      },
      {
        degree: "Data Engineering Prof. Cert", // [cite: 72]
        school: "Professional Certification",
        year: "2023", // [cite: 72]
        iconName: "award"
      },
      {
        degree: "PKM-KC Funding Recipient", // [cite: 69]
        school: "SINDIKAT Deep Learning Project", // [cite: 69]
        year: "2024",
        iconName: "award"
      }
    ],
    techStack: {
        modeling: {
            title: "Modeling & Architecture",
            iconName: "layout",
            skills: ["UML & ERD Design", "BPMN", "Wireframing", "Figma", "Draw.io"] // [cite: 60, 73]
        },
        data: {
            title: "Data & Development",
            iconName: "database",
            skills: ["PostgreSQL", "BigQuery", "Big Table", "SQL", "Data Engineering"] // [cite: 61, 72]
        },
        tools: {
            title: "Management & Tools",
            iconName: "terminal",
            skills: ["Jira & ClickUp", "Apidog", "DBeaver", "Google Workspace", "Microsoft Office"] // [cite: 62, 73]
        }
    }
  },
  projects: {
    title: "Case Studies",
    items: [
      {
        id: 1,
        title: "TING", // [cite: 29, 30]
        role: "Lead Analyst", // [cite: 34]
        description: "Architected a scalable SaaS ecosystem using Microservices to support high-volume data processing.", // [cite: 32]
        challenge: "Handling massive data loads for multiple modules (Inventory, HRIS, Accounting) while integrating AI document scanning capabilities.", // [cite: 32, 33]
        solution: "Designed a comprehensive Microservices architecture with event-driven communication patterns. Implemented BigQuery for real-time analytics and Big Table for high-throughput transactional data. Created detailed ERD diagrams for each module, established API contracts using OpenAPI specifications, and developed a centralized logging system for distributed tracing. Led sprint planning with 15+ developers, ensuring each service maintained data consistency through saga patterns and eventual consistency models.", // [cite: 32, 34]
        technologies: ["Microservices", "BigQuery", "Big Table", "AI Integration", "SaaS Architecture"], // [cite: 32]
        results: [
          "Successfully led a team of 15+ programmers.", // [cite: 34]
          "Designed end-to-end business processes for 7+ major modules.", // [cite: 33]
          "Ensured precise translation of requirements into technical specs." // [cite: 34]
        ]
      },
      {
        id: 2,
        title: "RAMA SAKTI", // [cite: 35, 36]
        role: "System Analyst",
        description: "Designed database architecture and workflows for a travel ticketing system integrated with external accounting software.", // [cite: 38]
        challenge: "The client faced a slow financial reporting cycle (3 months) and disconnected data between booking systems and finance.", // [cite: 39]
        solution: "Conducted thorough analysis of existing booking and finance workflows, identifying 12 critical data touchpoints. Designed a normalized database schema with proper foreign key relationships to ensure referential integrity. Built an automated ETL pipeline that extracts booking data, transforms it into Accurate-compatible format, and loads it via their REST API. Implemented scheduled batch processing for historical data reconciliation and real-time webhooks for new transactions. Created comprehensive data flow diagrams (BPMN) and established SLA monitoring dashboards to track sync success rates.", // [cite: 38, 40]
        technologies: ["Accurate Integration", "SQL", "Database Design", "System Flow"], // [cite: 38]
        results: [
          "Reduced financial reporting cycle from 3 months to just 1 month.", // [cite: 39]
          "Achieved real-time data synchronization.", // [cite: 40]
          "Optimized financial data processing flow." // [cite: 39]
        ]
      },
      {
        id: 3,
        title: "DEMO APP", // [cite: 41]
        role: "System Analyst",
        description: "Developed system flows and structures for an interactive product demo application.", // [cite: 44]
        challenge: "Sales presentations lacked consistency and standardization across the team.", // [cite: 44, 45]
        solution: "Mapped the entire sales journey through user story mapping sessions with stakeholders. Designed wireframes in Figma for 8 presentation templates covering different product modules. Built a centralized content management database with version control to ensure all teams use the latest approved materials. Developed a role-based access system where sales managers can approve demo scenarios. Integrated analytics tracking to capture which demo features resonate most with prospects. Created KPI dashboards showing demo effectiveness, conversion rates, and content engagement metrics. Conducted hands-on training workshops for 20+ sales team members with documented SOPs.", // [cite: 44, 45]
        technologies: ["Wireframing", "Database Structure", "KPI Monitoring"], // [cite: 44, 46]
        results: [
          "Significantly improved presentation consistency and quality.", // [cite: 45]
          "Enabled data-driven decision making via KPI monitoring.", // [cite: 46]
          "Standardized sales presentations." // [cite: 44]
        ]
      },
      {
        id: 4,
        title: "SUPPORT APP", // [cite: 47]
        role: "System Analyst",
        description: "Engineered the logic and database for a ticketing system featuring payment gateway integration.", // [cite: 50]
        challenge: "Need to optimize case resolution workflows and improve performance in handling technical client issues.", // [cite: 51]
        solution: "Designed a multi-tier ticketing system with intelligent routing algorithms based on issue category, priority, and agent expertise. Created state machine diagrams defining 7 ticket lifecycle stages with automatic escalation rules for SLA violations. Integrated Midtrans payment gateway for premium support subscriptions with webhook handling for payment confirmations. Built a knowledge base system where resolved tickets automatically generate solution articles using AI categorization. Implemented real-time notification system via WebSockets and email triggers. Designed comprehensive wireframes for both client portal and agent dashboard with mobile-responsive layouts. Established database indexes for fast ticket search and reporting queries.", // [cite: 50, 51]
        technologies: ["Midtrans Gateway", "Wireframing", "Logic Design", "Database Architecture"], // [cite: 50]
        results: [
          "Directly enhanced performance in handling client issues.", // [cite: 51]
          "Increased client satisfaction and trust.", // [cite: 52]
          "Provided a transparent and user-friendly platform." // [cite: 52]
        ]
      },
      {
        id: 5,
        title: "HR MANAGEMENT",
        role: "System Analyst",
        description: "Comprehensive HRIS application for attendance tracking, leave management, and automated reporting using BigQuery.",
        challenge: "Ineffective manual attendance recording and difficulty in managing large volumes of historical attendance data for reporting.",
        solution: "Leveraged BigQuery technology to architect a scalable data warehouse capable of handling high-volume attendance logs. Designed the approval workflow logic for leave requests (Employee to HR). Structured the data models to facilitate rapid generation of attendance recaps and insights for HR administrators.",
        technologies: ["BigQuery", "HRIS Architecture", "Database Design", "System Flow"],
        results: [
            "Increased effectiveness and accuracy of attendance recording.",
            "Streamlined the leave request and approval process.",
            "Enabled fast processing of large-scale attendance data for reporting."
        ]
      },
      {
        id: 6,
        title: "ISIIN", // [cite: 53, 54]
        role: "Lead Analyst",
        description: "Designed complex business flows and system logic for a multi-biller payment application (PPOB).", // [cite: 56]
        challenge: "Ensuring transaction accuracy and speed across various payment integrations.", // [cite: 56]
        solution: "Architected a unified payment abstraction layer supporting 15+ billers (electricity, water, phone, internet) with standardized request/response formats. Designed idempotent transaction handling with unique reference IDs to prevent duplicate charges. Implemented retry mechanisms with exponential backoff for failed API calls and circuit breaker patterns to handle provider outages gracefully. Created detailed sequence diagrams showing transaction flows from user selection to settlement confirmation. Established a reconciliation engine that cross-checks transactions against biller statements daily. Collaborated closely with UI/UX team through iterative wireframe reviews, ensuring complex payment flows remained intuitive with clear error messaging and loading states. Built comprehensive test scenarios covering edge cases like network timeouts and partial failures.", // [cite: 57, 58]
        technologies: ["Payment Integration", "System Logic", "UI/UX Collaboration"], // [cite: 57, 58]
        results: [
          "Ensured transaction accuracy and speed.", // [cite: 56]
          "Delivered a seamless and secure user experience.", // [cite: 58]
          "Translated functional requirements into an intuitive interface." // [cite: 57]
        ]
      },
      {
        id: 7, 
        title: "UTY CREATIVE HUB APP",
        role: "System Analyst",
        description: "Mobile application for booking and managing workspace usage at UTY Creative Hub.",
        challenge: "Manual room booking processes often led to double-bookings, difficulty in tracking real-time availability, and inefficient space utilization.",
        solution: "Designed a relational database schema to handle complex scheduling logic, ensuring zero conflicts in room reservations. Created comprehensive system flowcharts to map the user journey from room search to booking confirmation. Defined the logic for availability status updates and user notification triggers to ensure a smooth booking experience.",
        technologies: ["Mobile App Logic", "Database Design", "System Flow", "Booking System"],
        results: [
            "Eliminated booking conflicts through robust database constraints.",
            "Streamlined the room reservation process for hub members.",
            "Improved visibility of room availability in real-time."
        ]
      },
      {
        id: 8,
        title: "SINDIKAT",
        role: "System Analyst",
        description: "Deep learning-based system for real-time detection of criminal activities via audio analysis across multiple devices.",
        challenge: "Traditional surveillance relies heavily on visual feeds, often missing critical audio cues (screams, disturbances) and suffering from delayed response times in emergencies.",
        solution: "Architected the end-to-end system flow for processing multi-device audio streams in real-time. Designed the logic for data ingestion, pre-processing, and integration with the Deep Learning model to identify specific sound patterns. Mapped the alert trigger mechanism to ensure immediate notification upon detection of suspicious audio events.",
        technologies: ["Deep Learning Integration", "System Architecture", "Real-time Analysis", "Multi-device Support"],
        results: [
            "Enabled real-time detection of suspicious audio anomalies.",
            "Facilitated smarter and faster security monitoring responses.",
            "Successfully integrated multi-device support for broader coverage."
        ]
      },
      {
        id: 9,
        title: "CREDIWISE",
        role: "System Analyst",
        description: "Web-based loan eligibility determination system utilizing the Tsukamoto Fuzzy Inference System.",
        challenge: "High rates of loan defaults caused by rigid or subjective assessment criteria that failed to account for variable applicant conditions.",
        solution: "Designed the complete database structure to store applicant variables and historical data. Architected the system flow to implement the Tsukamoto Fuzzy Inference System algorithm, translating complex fuzzy logic rules into a structured calculation engine. Defined the decision-making logic to accurately categorize loan eligibility based on multi-variable inputs.",
        technologies: ["Fuzzy Inference System (Tsukamoto)", "Database Design", "Web System Flow", "Risk Analysis"],
        results: [
            "Significantly reduced the rate of loan defaults (Non-Performing Loans).",
            "Automated the credit scoring process with consistent logic.",
            "Improved accuracy in assessing borrower eligibility."
        ]
      }
    ]
  },
  timeline: {
    title: "My Process",
    steps: [
      {
        id: 1,
        title: "Discovery",
        description: "Collaborating with stakeholders to translate business requirements into clear goals, bridging the gap between business and IT.", // [cite: 19, 20]
        icon: "search"
      },
      {
        id: 2,
        title: "Analysis",
        description: "Identifying bottlenecks in existing systems and authoring detailed Product Requirement Documents (PRD) and User Stories.", // [cite: 25, 26]
        icon: "file"
      },
      {
        id: 3,
        title: "Design",
        description: "Creating optimized ERDs, UML diagrams, and Wireframes to ensure data integrity and provide a clear guide for developers.", // [cite: 27, 60]
        icon: "design"
      }
    ]
  },
  footer: {
    brandName: "Evi", // [cite: 1]
    mission: "Architecting scalable digital solutions. Turning complex requirements into elegant system logic.", // [cite: 6]
    coordinatesTitle: "Coordinates",
    coordinates: [
      { label: 'Home', href: '#hero' },
      { label: 'About', href: '#about' },
      { label: 'Case Studies', href: '#projects' },
      { label: 'Process', href: '#timeline' }
    ],
    connectTitle: "Establish Comms",
    connectText: "Ready to optimize your system architecture? I'm available for new projects.",
    copyright: "All rights reserved.",
    socials: [
        { label: "Email", href: "mailto:evinurhidayahh@gmail.com", iconName: "mail" }, // [cite: 3]
        { label: "LinkedIn", href: "https://linkedin.com/in/evinurhidayah/", iconName: "linkedin" }, // [cite: 3]
        { label: "Website", href: "https://evinurhidayah.vercel.app", iconName: "globe" } // [cite: 3]
    ]
  },
  cv: {
      url: "https://pub-093d9db34ecc4dfbb984eac2762f7f68.r2.dev/CV%20-%20Evi%20Nur%20Hidayah%20-%20Bahasa%20Inggris%20(1).pdf", 
      filename: "Evi_Nur_Hidayah_CV.pdf"
  }
};