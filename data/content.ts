
import { ContentData } from '../types';

export const content: ContentData = {
  hero: {
    name: "Evi",
    role: "System Analyst",
    tagline: "Translating complex requirements into elegant system architectures in the depths of the digital universe.",
    buttonText: "Initialize Protocol: CV"
  },
  about: {
    title: "System Profile",
    storyTitle: "The Origin Story",
    story: [
      "My journey didn't start with spreadsheets; it started with console.log('Hello World'). Starting as a developer, I loved the logic of code but often found myself frustrated by the ambiguity of requirements.",
      "I realized that the most critical bugs weren't in the code, but in the communication between business needs and technical implementation. I pivoted to System Analysis to become that missing link.",
      "Today, I leverage my technical background to design architectures that are not only theoretically sound but practically scalable."
    ],
    softSkills: [
      {
        title: "Analytical Thinking",
        desc: "Deconstructing complex chaos into logical, actionable components.",
        iconName: "brain"
      },
      {
        title: "Bridge Communication",
        desc: "Translating 'Dev-Speak' to Business goals and vice versa.",
        iconName: "message"
      },
      {
        title: "Strategic Solving",
        desc: "Identifying bottlenecks before they become blockers.",
        iconName: "zap"
      }
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        school: "University of Technology",
        year: "2018 - 2022",
        iconName: "grad"
      },
      {
        degree: "Google Data Analytics",
        school: "Professional Cert",
        year: "2023",
        iconName: "award"
      },
      {
        degree: "Certified Business Analysis",
        school: "IIBA (In Progress)",
        year: "2024",
        iconName: "award"
      }
    ],
    techStack: {
        modeling: {
            title: "Modeling & Architecture",
            iconName: "layout",
            skills: ["UML Design", "BPMN 2.0", "Sequence Diagrams", "Figma", "System Architecture"]
        },
        data: {
            title: "Data & Development",
            iconName: "database",
            skills: ["SQL (Advanced)", "Python", "REST/GraphQL", "JSON/XML", "PostgreSQL"]
        },
        tools: {
            title: "Management & Tools",
            iconName: "terminal",
            skills: ["JIRA / Confluence", "Git", "Postman", "Tableau", "Agile/Scrum"]
        }
    }
  },
  projects: {
    title: "Case Studies",
    items: [
      {
        id: 1,
        title: "Nebula ERP Integration",
        role: "Lead Analyst",
        description: "Designed the data flow and integration architecture for a large-scale enterprise resource planning migration.",
        challenge: "The client was operating on three disconnected legacy systems, causing a 48-hour delay in data synchronization between sales, inventory, and finance.",
        solution: "I architected a centralized middleware solution using an Event-Driven Architecture. We utilized a message queue system to ensure real-time data consistency.",
        technologies: ["Kafka", "REST APIs", "Python", "PostgreSQL", "UML Modeling"],
        results: [
          "Reduced data synchronization time from 48 hours to < 2 seconds.",
          "Eliminated data integrity errors by 99.9%.",
          "Automated 12 manual reporting workflows."
        ]
      },
      {
        id: 2,
        title: "Stellar FinTech Core",
        role: "System Architect",
        description: "Analyzed security requirements and transaction latency for a high-frequency trading platform.",
        challenge: "The existing platform suffered from latency spikes during market open, leading to failed transactions. Additionally, new compliance regulations required stricter audit trails.",
        solution: "Designed a low-latency microservices architecture. I defined the strict non-functional requirements for throughput (10k TPS) and introduced a dedicated immutable ledger.",
        technologies: ["Golang", "gRPC", "Redis", "AWS", "Sequence Diagrams"],
        results: [
          "Achieved consistent sub-millisecond latency for 99th percentile.",
          "100% compliance with new financial audit regulations.",
          "Scalability increased to handle 5x peak load."
        ]
      },
      {
        id: 3,
        title: "Orbit Inventory System",
        role: "Business Analyst",
        description: "Conducted stakeholder interviews and requirement gathering for a global warehouse management system.",
        challenge: "Warehouse staff were using paper-based tracking which led to 'ghost inventory'—items listed in the system but physically missing.",
        solution: "I led the requirements gathering phase for a new RFID-based tracking system. I conducted 20+ stakeholder interviews and created user stories.",
        technologies: ["JIRA", "BPMN 2.0", "Tableau", "RFID Logic", "SQL"],
        results: [
          "Reduced inventory discrepancies (ghost stock) by 40%.",
          "Cut warehouse picking time by 35%.",
          "Improved order fulfillment accuracy to 99.5%."
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
        description: "Understanding the universe of the problem. Gathering requirements from stakeholders, identifying constraints, and defining the scope of the mission.",
        icon: "search"
      },
      {
        id: 2,
        title: "Analysis",
        description: "Processing the data. Creating detailed use cases, data flow diagrams, and entity-relationship models to map out the system logic.",
        icon: "file"
      },
      {
        id: 3,
        title: "Design",
        description: "Architecting the solution. Delivering technical specifications, API contracts, and wireframes to guide the engineering crew.",
        icon: "design"
      }
    ]
  },
  footer: {
    brandName: "Evi",
    mission: "Architecting digital solutions across the vastness of the web. Turning chaos into logic, one system at a time.",
    coordinatesTitle: "Coordinates",
    coordinates: [
      { label: 'Home', href: '#hero' },
      { label: 'About', href: '#about' },
      { label: 'Case Studies', href: '#projects' },
      { label: 'Process', href: '#timeline' }
    ],
    connectTitle: "Establish Comms",
    connectText: "Ready to launch your next mission? I'm currently available for new system architecture projects.",
    copyright: "All rights reserved.",
    socials: [
        { label: "Email", href: "#", iconName: "mail" },
        { label: "LinkedIn", href: "#", iconName: "linkedin" },
        { label: "GitHub", href: "#", iconName: "github" },
        { label: "Twitter", href: "#", iconName: "twitter" }
    ]
  },
  cv: {
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      filename: "Evi_SystemAnalyst_CV.pdf"
  }
};
