
export interface Project {
  id: number;
  title: string;
  role: string;
  description: string;
  challenge: string;
  solution: string;
  technologies: string[];
  results: string[];
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: 'search' | 'file' | 'design';
}

export interface TechCategory {
  title: string;
  iconName: 'layout' | 'database' | 'terminal';
  skills: string[];
}

export interface SoftSkill {
  title: string;
  desc: string;
  iconName: 'brain' | 'users' | 'zap';
}

export interface Education {
  degree: string;
  school: string;
  year: string;
  iconName: 'grad' | 'award';
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface SocialLink {
  label: string;
  href: string;
  iconName: 'mail' | 'linkedin' | 'github' | 'twitter' | 'instagram';
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ContentData {
  hero: {
    name: string;
    role: string;
    tagline: string;
    buttonText: string;
  };
  about: {
    title: string;
    storyTitle: string;
    story: string[];
    experienceTitle: string;
    experience: Experience[];
    softSkills: SoftSkill[];
    education: Education[];
    techStack: {
        modeling: TechCategory;
        data: TechCategory;
        tools: TechCategory;
    }
  };
  projects: {
    title: string;
    items: Project[];
  };
  timeline: {
    title: string;
    steps: ProcessStep[];
  };
  footer: {
    brandName: string;
    mission: string;
    coordinatesTitle: string;
    coordinates: NavLink[];
    connectTitle: string;
    connectText: string;
    socials: SocialLink[];
    copyright: string;
  };
  cv: {
      url: string;
      filename: string;
  }
}