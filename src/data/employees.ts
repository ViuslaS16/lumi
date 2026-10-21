export interface EmployeeRecord {
  id: string;
  name: string;
  department: string;
  coursesCompleted: number;
  coursesAssigned: number;
  points: number;
  rank: number;
  badge: 'Gold' | 'Silver' | 'Bronze' | 'None';
  badgeColor: string;
  topSkill?: string;
  pendingCourse?: string;
  pendingDueDate?: string;
}

export const EMPLOYEES_DATA: EmployeeRecord[] = [
  {
    id: 'NE-101',
    name: 'Nimal P.',
    department: 'Engineering',
    coursesCompleted: 8,
    coursesAssigned: 8,
    points: 540,
    rank: 1,
    badge: 'Gold',
    badgeColor: '#FFD700',
    topSkill: 'Cloud Computing',
  },
  {
    id: 'NE-102',
    name: 'Sara F.',
    department: 'Support',
    coursesCompleted: 7,
    coursesAssigned: 8,
    points: 480,
    rank: 2,
    badge: 'Gold',
    badgeColor: '#FFD700',
    topSkill: 'Client Experience',
    pendingCourse: 'Cybersecurity Awareness',
    pendingDueDate: '30 Nov',
  },
  {
    id: 'NE-103',
    name: 'Kasun D.',
    department: 'Sales',
    coursesCompleted: 6,
    coursesAssigned: 8,
    points: 430,
    rank: 3,
    badge: 'Gold',
    badgeColor: '#FFD700',
    topSkill: 'Negotiation',
    pendingCourse: 'Data Privacy',
    pendingDueDate: '30 Nov',
  },
  {
    id: 'NE-104',
    name: 'Anika R.',
    department: 'HR',
    coursesCompleted: 6,
    coursesAssigned: 8,
    points: 400,
    rank: 4,
    badge: 'Silver',
    badgeColor: '#C0C0C0',
    topSkill: 'Communication',
    pendingCourse: 'Cybersecurity Awareness',
    pendingDueDate: '30 Nov',
  },
  {
    id: 'NE-105',
    name: 'Dilan W.',
    department: 'Engineering',
    coursesCompleted: 5,
    coursesAssigned: 8,
    points: 360,
    rank: 5,
    badge: 'Silver',
    badgeColor: '#C0C0C0',
    topSkill: 'DevOps',
    pendingCourse: 'Code of Conduct',
    pendingDueDate: '30 Nov',
  },
  {
    id: 'NE-106',
    name: 'Mala S.',
    department: 'Finance',
    coursesCompleted: 5,
    coursesAssigned: 8,
    points: 330,
    rank: 6,
    badge: 'Bronze',
    badgeColor: '#CD7F32',
    topSkill: 'Risk Analysis',
    pendingCourse: 'Information Security Awareness',
    pendingDueDate: '30 Nov',
  },
  {
    id: 'NE-107',
    name: 'Ravi K.',
    department: 'Support',
    coursesCompleted: 4,
    coursesAssigned: 8,
    points: 290,
    rank: 7,
    badge: 'Bronze',
    badgeColor: '#CD7F32',
    topSkill: 'Conflict Resolution',
    pendingCourse: 'Workplace Health and Safety',
    pendingDueDate: '30 Nov',
  },
  {
    id: 'NE-108',
    name: 'Tharushi A.',
    department: 'Engineering',
    coursesCompleted: 3,
    coursesAssigned: 8,
    points: 240,
    rank: 8,
    badge: 'Bronze',
    badgeColor: '#CD7F32',
    topSkill: 'Python Programming',
    pendingCourse: 'Information Security Awareness',
    pendingDueDate: '30 Nov',
  },
  {
    id: 'NE-109',
    name: 'Imran Z.',
    department: 'Sales',
    coursesCompleted: 3,
    coursesAssigned: 8,
    points: 210,
    rank: 9,
    badge: 'Bronze',
    badgeColor: '#CD7F32',
    topSkill: 'Presentation Skills',
    pendingCourse: 'Data Privacy',
    pendingDueDate: '30 Nov',
  },
  {
    id: 'NE-110',
    name: 'Chamari L.',
    department: 'Finance',
    coursesCompleted: 2,
    coursesAssigned: 8,
    points: 160,
    rank: 10,
    badge: 'Bronze',
    badgeColor: '#CD7F32',
    topSkill: 'Financial Compliance',
    pendingCourse: 'Code of Conduct',
    pendingDueDate: '30 Nov',
  },
];

export function getEmployeeById(id: string): EmployeeRecord | undefined {
  const normalized = id.trim().toUpperCase();
  return EMPLOYEES_DATA.find(emp => emp.id.toUpperCase() === normalized);
}

export function getTopEmployees(count: number = 5): EmployeeRecord[] {
  return [...EMPLOYEES_DATA].sort((a, b) => a.rank - b.rank).slice(0, count);
}
