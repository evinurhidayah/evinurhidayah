import { ContentData } from '../types';

export const content: ContentData = {
  hero: {
    name: "Evi Nur Hidayah", // [cite: 1]
    role: "System Analyst", // [cite: 2]
    tagline: "Translating business requirements into scalable SaaS architectures and Microservices ecosystems.", // [cite: 5, 6]
    buttonText: "Initialize Protocol: CV"
  },
  about: {
    title: "System Profile",
    storyTitle: "The Origin Story",
    story: [
      "My journey is defined by bridging the gap between business needs and IT execution. As a Business System Analyst, I specialize in designing complex application ecosystems.", // [cite: 5, 20]
      "I have led development teams of 15+ programmers, ensuring that every sprint delivers value through precise technical specifications like PRD, ERD, and UML.", // [cite: 6, 10]
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
        desc: "Translating complex business requirements into actionable technical specifications (PRD/ERD).", // [cite: 6, 20]
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
        title: "TING - AI Driven SaaS", // [cite: 29, 30]
        role: "Lead Analyst", // [cite: 34]
        description: "Architected a scalable SaaS ecosystem using Microservices to support high-volume data processing.", // [cite: 32]
        challenge: "The system required handling massive data loads for multiple modules (Inventory, HRIS, Accounting) while integrating AI document scanning capabilities.", // [cite: 33]
        solution: "Designed a Microservices architecture utilizing BigQuery and Big Table for data handling, and led a team of 15+ developers to execute the vision.", // [cite: 32, 34]
        technologies: ["Microservices", "BigQuery", "Big Table", "AI Integration", "SaaS Architecture"], // [cite: 32]
        results: [
          "successfully led a team of 15+ programmers.", // [cite: 34]
          "Designed end-to-end business processes for 7+ major modules.", // [cite: 33]
          "Ensured precise translation of requirements into technical specs." // [cite: 34]
        ]
      },
      {
        id: 2,
        title: "RAMA SAKTI Integration", // [cite: 35]
        role: "System Analyst", // [cite: 2]
        description: "Designed database architecture and workflows for a travel ticketing system integrated with external accounting software.", // [cite: 38]
        challenge: "The client faced a slow financial reporting cycle and disconnected data between booking systems and the finance department.", // [cite: 39, 40]
        solution: "Implemented a seamless integration with Accurate Accounting Software and streamlined operational workflows for real-time sync.", // [cite: 38, 40]
        technologies: ["Accurate Integration", "SQL", "Database Design", "System Flow"], // [cite: 38]
        results: [
          "Reduced financial reporting cycle from 3 months to just 1 month.", // [cite: 39]
          "Achieved real-time data synchronization.", // [cite: 40]
          "Optimized financial data processing flow." // [cite: 39]
        ]
      },
      {
        id: 3,
        title: "Customer Support App", // [cite: 47]
        role: "System Analyst",
        description: "Engineered the logic and database for a ticketing system featuring payment gateway integration.", // [cite: 50]
        challenge: "The company needed to optimize case resolution workflows and improve performance in handling technical client issues.", // [cite: 51]
        solution: "Developed a transparent platform with Midtrans payment integration and optimized case resolution logic.", // [cite: 50, 51]
        technologies: ["Midtrans Gateway", "Wireframing", "Logic Design", "Database Architecture"], // [cite: 50]
        results: [
          "Directly enhanced performance in handling client issues.", // [cite: 51]
          "Increased client satisfaction and trust.", // [cite: 52]
          "Created a user-friendly platform for issue reporting." // [cite: 52]
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
        description: "Creating optimized ERDs, UML diagrams, and Wireframes to ensure data integrity and provide a clear guide for developers.", // [cite: 27, 44]
        icon: "design"
      }
    ]
  },
  footer: {
    brandName: "Evi", // [cite: 1]
    mission: "Architecting scalable digital solutions. Turning complex requirements into elegant system logic.", // [cite: 5, 6]
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
        { label: "Email", href: "mailto:evinurhidayahh@gmail.com", iconName: "mail" }, // 
        { label: "LinkedIn", href: "https://linkedin.com/in/evinurhidayah/", iconName: "linkedin" }, // 
        { label: "Website", href: "https://evinurhidayah.vercel.app", iconName: "globe" } // 
    ]
  },
  cv: {
      url: "https://pub-093d9db34ecc4dfbb984eac2762f7f68.r2.dev/CV%20-%20Evi%20Nur%20Hidayah%20-%20Bahasa%20Inggris.pdf", // Placeholder path based on user context
      filename: "Evi_Nur_Hidayah_CV.pdf"
  }
};