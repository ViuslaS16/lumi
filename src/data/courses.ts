export interface Course {
  id: string;
  skill: string;
  name: string;
  format: string;
  duration: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  deliveryMode: 'Online' | 'Live workshop' | 'Blended' | 'Workshop';
  enrollmentStatus?: 'Open' | 'Upcoming' | 'Enrolled';
}

export const COURSES_DATA: Course[] = [
  {
    id: 'CRS-COMM-01',
    skill: 'Communication',
    name: 'Effective Workplace Communication',
    format: 'Online',
    duration: '2 hours',
    description: 'Learn active listening techniques, respectful and structured feedback, clear email writing, and handling cross-team dialogues.',
    level: 'All Levels',
    deliveryMode: 'Online',
    enrollmentStatus: 'Open',
  },
  {
    id: 'CRS-PRES-02',
    skill: 'Presentation',
    name: 'Presentation Skills Essentials',
    format: 'Live workshop',
    duration: '1 day',
    description: 'Master audience analysis, concise slide design, stage presence, and delivering technical concepts with clarity and confidence.',
    level: 'Intermediate',
    deliveryMode: 'Live workshop',
    enrollmentStatus: 'Open',
  },
  {
    id: 'CRS-LEAD-03',
    skill: 'Leadership',
    name: 'Emerging Leaders',
    format: 'Blended',
    duration: '3 months',
    description: 'Comprehensive program for prospective and current team leads focusing on delegation, coaching team members, and driving delivery.',
    level: 'Advanced',
    deliveryMode: 'Blended',
    enrollmentStatus: 'Upcoming',
  },
  {
    id: 'CRS-SEC-04',
    skill: 'Security',
    name: 'Cybersecurity Basics',
    format: 'Online',
    duration: '3 hours',
    description: 'Understand phishing defense, endpoint security, password protocols, safe remote working habits, and NovaEdge data classification.',
    level: 'Beginner',
    deliveryMode: 'Online',
    enrollmentStatus: 'Open',
  },
  {
    id: 'CRS-TECH-05',
    skill: 'Technical',
    name: 'Cloud Fundamentals',
    format: 'Online',
    duration: '6 hours',
    description: 'Core concepts of cloud computing, infrastructure as a service (IaaS), microservices architecture, and cloud security basics.',
    level: 'Beginner',
    deliveryMode: 'Online',
    enrollmentStatus: 'Open',
  },
  {
    id: 'CRS-TEAM-06',
    skill: 'Teamwork',
    name: 'Collaboration and Conflict Handling',
    format: 'Workshop',
    duration: 'Half day',
    description: 'Practical strategies for resolving interpersonal friction, aligning multidisciplinary squads, and driving shared accountability.',
    level: 'All Levels',
    deliveryMode: 'Workshop',
    enrollmentStatus: 'Open',
  },
];
