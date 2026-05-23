export interface PersonalInfo {
  firstName: string;
  lastName: string;
  profession: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  linkedin?: string | null;
  portfolio?: string | null;
  website?: string | null;
  summary?: string | null;
  photoUrl?: string | null;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  city?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description?: string | null;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field?: string | null;
  year: string;
  description?: string | null;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: "technical" | "computer" | "language" | "soft";
}

export interface Language {
  id: string;
  language: string;
  level: "beginner" | "intermediate" | "advanced" | "fluent" | "native";
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  year: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  technologies?: string | null;
  link?: string | null;
}

export interface Interest {
  id: string;
  name: string;
}

export interface CvCustomization {
  templateId: string;
  primaryColor: string;
  fontFamily: string;
  fontSize: "small" | "medium" | "large";
  photoStyle: "circle" | "square" | "none";
}

export interface CvData {
  id?: string;
  sessionToken?: string;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  interests: Interest[];
  customization: CvCustomization;
  isPaid?: boolean;
}

export const defaultCvData: CvData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    profession: "",
    phone: "",
    email: "",
    address: "",
    linkedin: "",
    portfolio: "",
    website: "",
    summary: "",
    photoUrl: null,
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  interests: [],
  customization: {
    templateId: "modern",
    primaryColor: "#4F46E5",
    fontFamily: "Inter",
    fontSize: "medium",
    photoStyle: "circle",
  },
};
