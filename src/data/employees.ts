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

/**
 * Assignment Badge Rules:
 * Rank 1–3: Gold
 * Rank 4–5: Silver
 * Rank 6–10: Bronze
 * Rank 11+: Keep going! (None)
 */
export function getBadgeForRank(rank: number): { badge: 'Gold' | 'Silver' | 'Bronze' | 'None'; color: string; label: string } {
  if (rank >= 1 && rank <= 3) {
    return { badge: 'Gold', color: '#FFD700', label: 'Gold Badge' };
  }
  if (rank >= 4 && rank <= 5) {
    return { badge: 'Silver', color: '#C0C0C0', label: 'Silver Badge' };
  }
  if (rank >= 6 && rank <= 10) {
    return { badge: 'Bronze', color: '#CD7F32', label: 'Bronze Badge' };
  }
  return { badge: 'None', color: '#78716C', label: 'Keep going!' };
}

/**
 * Overall HR Analytics Summary Calculations
 */
export function getOverallAnalytics() {
  const totalEmployees = EMPLOYEES_DATA.length;
  const totalCompletedCourses = EMPLOYEES_DATA.reduce((acc, e) => acc + e.coursesCompleted, 0);
  const totalAssignedCourses = EMPLOYEES_DATA.reduce((acc, e) => acc + e.coursesAssigned, 0);
  const overallCompletionRate = totalAssignedCourses > 0
    ? Number(((totalCompletedCourses / totalAssignedCourses) * 100).toFixed(2))
    : 0;
  const totalLearningPoints = EMPLOYEES_DATA.reduce((acc, e) => acc + e.points, 0);
  const incompleteCount = EMPLOYEES_DATA.filter(e => e.coursesCompleted < e.coursesAssigned).length;

  return {
    totalEmployees,
    totalCompletedCourses,
    totalAssignedCourses,
    overallCompletionRate, // Expected: 61.25%
    totalLearningPoints,   // Expected: 3440
    incompleteCount,       // Expected: 9
  };
}

/**
 * Department-Level Analytics Calculation
 * department completion rate = total completed courses / total assigned courses * 100
 */
export interface DepartmentMetric {
  department: string;
  totalCompleted: number;
  totalAssigned: number;
  completionRate: number;
  employeeCount: number;
  totalPoints: number;
}

export function getDepartmentAnalytics(): DepartmentMetric[] {
  const deptMap: Record<string, { completed: number; assigned: number; count: number; points: number }> = {};

  EMPLOYEES_DATA.forEach(emp => {
    if (!deptMap[emp.department]) {
      deptMap[emp.department] = { completed: 0, assigned: 0, count: 0, points: 0 };
    }
    deptMap[emp.department].completed += emp.coursesCompleted;
    deptMap[emp.department].assigned += emp.coursesAssigned;
    deptMap[emp.department].count += 1;
    deptMap[emp.department].points += emp.points;
  });

  return Object.keys(deptMap).map(department => {
    const data = deptMap[department];
    const completionRate = data.assigned > 0
      ? Number(((data.completed / data.assigned) * 100).toFixed(1))
      : 0;
    return {
      department,
      totalCompleted: data.completed,
      totalAssigned: data.assigned,
      completionRate,
      employeeCount: data.count,
      totalPoints: data.points,
    };
  }).sort((a, b) => b.completionRate - a.completionRate);
}

