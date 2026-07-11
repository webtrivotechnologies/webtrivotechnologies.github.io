export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  budget: string;
  projectType: string;
  message: string;
  fileUrl?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'qualified' | 'archived';
  notes?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  challenge: string;
  solution: string;
  results: string;
  techStack: string[];
  duration: string;
  client: string;
  category: string;
  mockupType: 'laptop' | 'phone' | 'dashboard';
  metricValue: string;
  metricLabel: string;
  featured: boolean;
  image?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string; // Lucide icon name
  features: string[];
  category: 'core' | 'enterprise' | 'growth';
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string; // Markdown supported
  category: string;
  readTime: string;
  authorName: string;
  authorRole: string;
  date: string;
  published: boolean;
  image?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatarUrl?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface CareerJob {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote';
  salary: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  active: boolean;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  primaryEmail: string;
  contactEmail: string;
  whatsappNumber: string;
  phoneNumber: string;
  address: string;
  workingHours: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  bookMeetingUrl: string; // e.g. Calendly
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface CMSData {
  inquiries: ContactInquiry[];
  portfolio: PortfolioItem[];
  services: ServiceItem[];
  blogs: BlogPost[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  careers: CareerJob[];
  subscribers: NewsletterSubscriber[];
  settings: SiteSettings;
}
