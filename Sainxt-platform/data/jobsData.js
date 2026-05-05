import { Cpu, BrainCircuit, Network, MessageSquare, Eye, Server, Search } from 'lucide-react';

// AI/ML focused job data with diverse experience levels
export const jobsData = [
  // Fresher Roles (0-1 years)
  {
    id: 1,
    title: 'AI/ML Engineer - Fresher',
    company: 'TechInnovate',
    location: 'Bangalore, India',
    type: 'Full-time',
    salary: '₹6L - ₹10L',
    match: 95,
    skills: ['Python', 'Machine Learning', 'Data Structures', 'Algorithms', 'NumPy', 'Pandas'],
    posted: '2 days ago',
    aiFocus: ['Machine Learning', 'Data Science', 'AI Fundamentals'],
    experience: '0-1 years',
    experienceLevel: 'fresher',
    logo: '/images/techinnovate.png',
    isRemote: true,
    isFeatured: true,
    description: 'Great opportunity for fresh graduates to kickstart their career in AI/ML. Training will be provided.'
  },
  {
    id: 2,
    title: 'AI Research Intern',
    company: 'DeepMind AI',
    location: 'Remote',
    type: 'Internship',
    salary: 'Stipend: ₹40,000 - ₹60,000/month',
    match: 92,
    skills: ['Python', 'Machine Learning', 'Research', 'TensorFlow', 'PyTorch'],
    posted: '1 week ago',
    aiFocus: ['Deep Learning', 'Research', 'Neural Networks'],
    experience: '0-1 years',
    experienceLevel: 'fresher',
    logo: '/images/deepmind.png',
    isRemote: true,
    isFeatured: true
  },
  
  // Experienced Roles (3+ years)
  {
    id: 3,
    title: 'Senior ML Engineer',
    company: 'OpenAI',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    salary: '$200,000 - $300,000',
    match: 88,
    skills: ['Machine Learning', 'Python', 'Deep Learning', 'LLMs', 'Distributed Systems'],
    posted: '3 days ago',
    aiFocus: ['NLP', 'Large Language Models', 'Generative AI'],
    experience: '5+ years',
    experienceLevel: 'experienced',
    logo: '/images/openai.png',
    isRemote: true,
    isFeatured: true
  },
  {
    id: 4,
    title: 'Computer Vision Lead',
    company: 'Tesla AI',
    location: 'Palo Alto, CA',
    type: 'Full-time',
    salary: '$220,000 - $320,000',
    match: 90,
    skills: ['Computer Vision', 'Deep Learning', 'Python', 'OpenCV', 'Autonomous Vehicles'],
    posted: '5 days ago',
    aiFocus: ['Computer Vision', 'Autonomous Systems'],
    experience: '7+ years',
    experienceLevel: 'experienced',
    logo: '/images/tesla.png',
    isFeatured: true
  },
  
  // Mid-Level Roles (1-3 years)
  {
    id: 5,
    title: 'ML Engineer',
    company: 'Cohere',
    location: 'Remote',
    type: 'Full-time',
    salary: '₹18L - ₹35L',
    match: 87,
    skills: ['Python', 'Machine Learning', 'NLP', 'Transformers', 'MLOps'],
    posted: '1 week ago',
    aiFocus: ['NLP', 'Large Language Models'],
    experience: '2-4 years',
    experienceLevel: 'mid-level',
    logo: '/images/cohere.png',
    isRemote: true
  },
  
  // More Fresher Roles
  {
    id: 6,
    title: 'AI/ML Trainee',
    company: 'AI Forge',
    location: 'Hyderabad, India',
    type: 'Full-time',
    salary: '₹4L - ₹8L',
    match: 93,
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'],
    posted: '3 days ago',
    aiFocus: ['Machine Learning', 'Data Science'],
    experience: '0-1 years',
    experienceLevel: 'fresher',
    logo: '/images/aiforge.png',
    description: 'No prior experience required. We provide comprehensive training in AI/ML technologies.'
  },
  
  // More Experienced Roles
  {
    id: 7,
    title: 'AI Solutions Architect',
    company: 'NVIDIA',
    location: 'Bangalore, India / Remote',
    type: 'Full-time',
    salary: '₹45L - ₹80L',
    match: 89,
    skills: ['AI Architecture', 'Deep Learning', 'Cloud AI', 'MLOps', 'Kubernetes'],
    posted: '1 week ago',
    aiFocus: ['AI Infrastructure', 'ML Systems', 'Cloud AI'],
    experience: '8+ years',
    experienceLevel: 'experienced',
    logo: '/images/nvidia.png',
    isRemote: true,
    isFeatured: true
  },
  
  // Internship Roles
  {
    id: 8,
    title: 'ML Research Intern',
    company: 'Microsoft Research',
    location: 'Bangalore, India',
    type: 'Internship',
    salary: 'Stipend: ₹80,000 - ₹1,20,000/month',
    match: 94,
    skills: ['Research', 'Machine Learning', 'Python', 'PyTorch'],
    posted: '4 days ago',
    aiFocus: ['Machine Learning', 'Research'],
    experience: '0-1 years',
    experienceLevel: 'internship',
    logo: '/images/microsoft.png',
    description: 'Ideal for students pursuing PhD or Masters in CS with focus on ML/AI.'
  }
];

// AI Specializations
export const aiSpecializations = [
  { id: 'all', name: 'All AI Jobs', icon: Cpu },
  { id: 'ml', name: 'Machine Learning', icon: BrainCircuit },
  { id: 'dl', name: 'Deep Learning', icon: Network },
  { id: 'nlp', name: 'NLP', icon: MessageSquare },
  { id: 'cv', name: 'Computer Vision', icon: Eye },
  { id: 'robotics', name: 'Robotics', icon: Cpu },
  { id: 'mlops', name: 'MLOps', icon: Server },
  { id: 'ai-research', name: 'AI Research', icon: Search },
];

// Trending AI Skills
export const trendingSkills = [
  { name: 'LLMs', count: 1243 },
  { name: 'Transformers', count: 987 },
  { name: 'Diffusion Models', count: 765 },
  { name: 'Reinforcement Learning', count: 654 },
  { name: 'Generative AI', count: 543 },
  { name: 'Computer Vision', count: 987 },
  { name: 'NLP', count: 876 },
  { name: 'TensorFlow', count: 765 },
  { name: 'PyTorch', count: 876 },
  { name: 'MLOps', count: 543 },
];
