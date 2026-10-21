import { MongoClient, Collection } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { EmployeeRecord } from '@/data/employees';

export interface ChatMessageData {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'deepseek' | 'local';
  widgetType?: 'progress' | 'leaderboard' | 'quiz' | 'assessment' | 'courses' | 'hr' | 'id_prompt';
  employeeData?: EmployeeRecord | null;
  suggestedFollowUps?: string[];
  isFallback?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessageData[];
  employeeId?: string;
}

// Global cached client for Next.js and Vercel serverless functions
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'lumi_chat';
const COLLECTION_NAME = 'conversations';

// Local file fallback path (in case MongoDB is stopped during offline presentation)
const FALLBACK_DIR = path.join(process.cwd(), 'data', 'nosql');
const FALLBACK_FILE = path.join(FALLBACK_DIR, 'conversations.json');

// In-memory fallback cache in case filesystem is read-only (such as Vercel serverless)
let inMemoryFallback: ChatSession[] | null = null;

function ensureFallbackDir() {
  try {
    if (!fs.existsSync(FALLBACK_DIR)) {
      fs.mkdirSync(FALLBACK_DIR, { recursive: true });
    }
    if (!fs.existsSync(FALLBACK_FILE)) {
      fs.writeFileSync(FALLBACK_FILE, JSON.stringify(INITIAL_SEEDED_CONVERSATIONS, null, 2), 'utf-8');
    }
  } catch {
    // Expected on read-only cloud filesystems like Vercel
  }
}

function readFallback(): ChatSession[] {
  if (inMemoryFallback) {
    return inMemoryFallback;
  }
  ensureFallbackDir();
  try {
    const raw = fs.readFileSync(FALLBACK_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    inMemoryFallback = parsed;
    return parsed;
  } catch {
    inMemoryFallback = [...INITIAL_SEEDED_CONVERSATIONS];
    return inMemoryFallback;
  }
}

function writeFallback(data: ChatSession[]) {
  inMemoryFallback = [...data];
  ensureFallbackDir();
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Handled in memory if filesystem is read-only on Vercel
  }
}

// Seed data
const now = new Date();
const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

export const INITIAL_SEEDED_CONVERSATIONS: ChatSession[] = [
  {
    id: 'seed-1',
    title: 'How do I enroll in a course?',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    employeeId: 'NE-104',
    messages: [
      {
        id: 'msg-s1-1',
        sender: 'user',
        text: 'How do I enroll in a course?',
        timestamp: '09:15 AM',
      },
      {
        id: 'msg-s1-2',
        sender: 'assistant',
        text: 'Log in to NovaLearn (novalearn.novaedge.example), navigate to the Course Catalogue, select your course, and click Enroll. Internal self-paced courses are auto-approved.',
        timestamp: '09:15 AM',
        source: 'local',
        suggestedFollowUps: ['How many courses can I take at the same time?', 'Do I get time off from work for training?'],
      },
      {
        id: 'msg-s1-3',
        sender: 'user',
        text: 'How many courses can I take at the same time?',
        timestamp: '09:17 AM',
      },
      {
        id: 'msg-s1-4',
        sender: 'assistant',
        text: 'You can be enrolled in up to two courses at any given time to ensure work-learning balance. Once you finish one, you can immediately enroll in your next program.',
        timestamp: '09:17 AM',
        source: 'local',
        suggestedFollowUps: ['Do I get time off from work for training?', 'Browse Course Catalog'],
      },
      {
        id: 'msg-s1-5',
        sender: 'user',
        text: 'Do I get time off from work for training?',
        timestamp: '09:20 AM',
      },
      {
        id: 'msg-s1-6',
        sender: 'assistant',
        text: 'Yes. For mandatory training, up to 2 hours per week during work hours is permitted with manager alignment. For elective courses, self-paced learning outside core hours is standard, but you are eligible for up to 2 days of paid study leave for exams.',
        timestamp: '09:20 AM',
        source: 'local',
        suggestedFollowUps: ['How do I claim reimbursement for a course fee?', 'Talk to HR'],
      },
    ],
  },
  {
    id: 'seed-2',
    title: 'Which trainings are mandatory?',
    createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    employeeId: 'NE-104',
    messages: [
      {
        id: 'msg-s2-1',
        sender: 'user',
        text: 'Which trainings are mandatory?',
        timestamp: '11:30 AM',
      },
      {
        id: 'msg-s2-2',
        sender: 'assistant',
        text: 'All employees must complete Code of Conduct, Information Security Awareness, Data Privacy, and Workplace Health and Safety. InfoSec must be repeated every 6 months.',
        timestamp: '11:30 AM',
        source: 'local',
        suggestedFollowUps: ['When is the deadline for mandatory training?', 'What happens if I miss a deadline?'],
      },
      {
        id: 'msg-s2-3',
        sender: 'user',
        text: 'When is the deadline for mandatory training?',
        timestamp: '11:32 AM',
      },
      {
        id: 'msg-s2-4',
        sender: 'assistant',
        text: 'For new joiners: complete all modules within 30 days of your joining date. For existing employees: the annual refresher cycle is due by 30 November.',
        timestamp: '11:32 AM',
        source: 'local',
        suggestedFollowUps: ['What happens if I miss a deadline?', 'Check My Progress'],
      },
      {
        id: 'msg-s2-5',
        sender: 'user',
        text: 'What happens if I miss a mandatory training deadline?',
        timestamp: '11:35 AM',
      },
      {
        id: 'msg-s2-6',
        sender: 'assistant',
        text: 'If you miss a compliance deadline, an automated notification is sent to your line manager and HR. Repeated non-compliance affects your annual performance appraisal and halts approval for elective company-sponsored courses.',
        timestamp: '11:35 AM',
        source: 'local',
        suggestedFollowUps: ['Check Progress: NE-104', 'Talk to HR'],
      },
    ],
  },
  {
    id: 'seed-3',
    title: 'Check Progress: NE-104',
    createdAt: yesterday.toISOString(),
    updatedAt: yesterday.toISOString(),
    employeeId: 'NE-104',
    messages: [
      {
        id: 'msg-s3-1',
        sender: 'user',
        text: 'NE-104',
        timestamp: '02:20 PM',
      },
      {
        id: 'msg-s3-2',
        sender: 'assistant',
        text: 'Found employee record for Anika R. (NE-104). Here is your latest learning progress summary:',
        timestamp: '02:20 PM',
        source: 'local',
        widgetType: 'progress',
        employeeData: {
          id: 'NE-104',
          name: 'Anika R.',
          department: 'Human Resources',
          coursesAssigned: 8,
          coursesCompleted: 6,
          points: 400,
          badge: 'Silver',
          badgeColor: '#C0C0C0',
          rank: 4,
          pendingCourse: 'Effective Workplace Communication',
          pendingDueDate: '15 Nov',
        },
        suggestedFollowUps: ['View Leaderboard', 'How are learning points calculated?'],
      },
      {
        id: 'msg-s3-3',
        sender: 'user',
        text: 'View Leaderboard',
        timestamp: '02:22 PM',
      },
      {
        id: 'msg-s3-4',
        sender: 'assistant',
        text: 'Here is the current NovaEdge learning leaderboard showing the top 5 learners and badge standings:',
        timestamp: '02:22 PM',
        source: 'local',
        widgetType: 'leaderboard',
        employeeData: {
          id: 'NE-104',
          name: 'Anika R.',
          department: 'Human Resources',
          coursesAssigned: 8,
          coursesCompleted: 6,
          points: 400,
          badge: 'Silver',
          badgeColor: '#C0C0C0',
          rank: 4,
        },
        suggestedFollowUps: ['How are learning points calculated?', 'What do the gold, silver and bronze badges mean?'],
      },
      {
        id: 'msg-s3-5',
        sender: 'user',
        text: 'How are learning points calculated?',
        timestamp: '02:25 PM',
      },
      {
        id: 'msg-s3-6',
        sender: 'assistant',
        text: 'You earn points for every learning milestone:\n• Course completion: 50 points per self-paced module, 80 points per interactive workshop.\n• Knowledge checks & quizzes: Up to 20 points per quiz based on score.\n• Continuous monthly learning streak: +15 bonus points.',
        timestamp: '02:25 PM',
        source: 'local',
        suggestedFollowUps: ['Take a Quiz', 'Browse Course Catalog'],
      },
    ],
  },
  {
    id: 'seed-4',
    title: 'Can company pay my cert?',
    createdAt: yesterday.toISOString(),
    updatedAt: yesterday.toISOString(),
    employeeId: 'NE-104',
    messages: [
      {
        id: 'msg-s4-1',
        sender: 'user',
        text: 'Can company pay my cert?',
        timestamp: '04:45 PM',
      },
      {
        id: 'msg-s4-2',
        sender: 'assistant',
        text: 'Yes! NovaEdge reimburses up to LKR 150,000 per employee per year for approved external professional certifications. Pre-approval from your manager and HR is required.',
        timestamp: '04:45 PM',
        source: 'local',
        suggestedFollowUps: ['How do I claim reimbursement?', 'Do I need to stay with the company after an expensive course?'],
      },
      {
        id: 'msg-s4-3',
        sender: 'user',
        text: 'How do I claim reimbursement?',
        timestamp: '04:48 PM',
      },
      {
        id: 'msg-s4-4',
        sender: 'assistant',
        text: 'Submit an expense reimbursement request in the NovaEdge ERP within 30 days of passing your examination. Attach your official fee invoice, payment receipt, completion certificate, and prior manager approval email.',
        timestamp: '04:48 PM',
        source: 'local',
        suggestedFollowUps: ['Do I need to stay with the company after an expensive course?', 'Talk to HR'],
      },
      {
        id: 'msg-s4-5',
        sender: 'user',
        text: 'Do I need to stay with the company after an expensive course?',
        timestamp: '04:50 PM',
      },
      {
        id: 'msg-s4-6',
        sender: 'assistant',
        text: 'For training investments exceeding LKR 100,000, a standard 12-month retention agreement applies. If an employee resigns voluntarily within 12 months of course completion, a prorated recovery applies.',
        timestamp: '04:50 PM',
        source: 'local',
        suggestedFollowUps: ['Talk to HR', 'Browse Course Catalog'],
      },
    ],
  },
  {
    id: 'seed-5',
    title: 'Take a Quiz',
    createdAt: threeDaysAgo.toISOString(),
    updatedAt: threeDaysAgo.toISOString(),
    employeeId: 'NE-104',
    messages: [
      {
        id: 'msg-s5-1',
        sender: 'user',
        text: 'Take a Quiz',
        timestamp: '10:00 AM',
      },
      {
        id: 'msg-s5-2',
        sender: 'assistant',
        text: 'You can take our 5-question Communication Skills Quiz right here to test your knowledge and earn up to 20 learning points!',
        timestamp: '10:00 AM',
        source: 'local',
        widgetType: 'quiz',
        suggestedFollowUps: ['Can I retake a quiz?', 'Leaderboard'],
      },
      {
        id: 'msg-s5-3',
        sender: 'user',
        text: 'Can I retake a quiz?',
        timestamp: '10:05 AM',
      },
      {
        id: 'msg-s5-4',
        sender: 'assistant',
        text: 'Yes! You can attempt practice knowledge checks up to 3 times. Your highest score is recorded on the leaderboard. Low scores never reflect on your performance appraisal.',
        timestamp: '10:05 AM',
        source: 'local',
        suggestedFollowUps: ['How are learning points calculated?', 'Check Progress: NE-104'],
      },
    ],
  },
  {
    id: 'seed-6',
    title: 'Do you offer presentation skills training?',
    createdAt: sevenDaysAgo.toISOString(),
    updatedAt: sevenDaysAgo.toISOString(),
    employeeId: 'NE-104',
    messages: [
      {
        id: 'msg-s6-1',
        sender: 'user',
        text: 'Do you offer presentation skills training?',
        timestamp: '03:15 PM',
      },
      {
        id: 'msg-s6-2',
        sender: 'assistant',
        text: 'Yes. Presentation Skills Essentials (Course ID: COMM-102) is offered as a half-day interactive workshop every alternate month.',
        timestamp: '03:15 PM',
        source: 'local',
        suggestedFollowUps: ['How do I enroll in a course?', 'Can I enroll in courses outside my job role?'],
      },
      {
        id: 'msg-s6-3',
        sender: 'user',
        text: 'Can I enroll in courses outside my job role?',
        timestamp: '03:18 PM',
      },
      {
        id: 'msg-s6-4',
        sender: 'assistant',
        text: 'Yes! Employees are encouraged to build cross-functional skills. For specialized technical or leadership workshops with limited cohort capacity, manager endorsement is required.',
        timestamp: '03:18 PM',
        source: 'local',
        suggestedFollowUps: ['Browse Course Catalog', 'Skill-Gap Assessment'],
      },
    ],
  },
];

async function getCollection(): Promise<Collection<ChatSession> | null> {
  // If in production on Vercel and MONGODB_URI is still local 127.0.0.1, skip to fallback
  const isLocalUri = !process.env.MONGODB_URI || 
    process.env.MONGODB_URI.includes('127.0.0.1') || 
    process.env.MONGODB_URI.includes('localhost');

  if (process.env.NODE_ENV === 'production' && isLocalUri) {
    console.warn('Vercel Notice: MONGODB_URI is not set to a cloud MongoDB Atlas URI in Vercel settings. Using resilient fallback.');
    return null;
  }

  try {
    if (!global._mongoClientPromise) {
      const c = new MongoClient(MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
      global._mongoClientPromise = c.connect();
    }
    const client = await global._mongoClientPromise;
    const db = client.db(DB_NAME);
    const col = db.collection<ChatSession>(COLLECTION_NAME);

    // Auto-seed if empty
    const count = await col.countDocuments();
    if (count === 0) {
      await col.insertMany(INITIAL_SEEDED_CONVERSATIONS);
    }
    return col;
  } catch (err) {
    console.warn('MongoDB not reachable, using resilient NoSQL fallback:', (err as Error).message);
    global._mongoClientPromise = undefined; // Reset promise so next request can retry
    return null;
  }
}

// ================= CRUD OPERATIONS =================

/**
 * CREATE: Insert a new chat session document
 */
export async function createChat(session: ChatSession): Promise<ChatSession> {
  const col = await getCollection();
  if (col) {
    try {
      await col.updateOne(
        { id: session.id },
        { $set: session },
        { upsert: true }
      );
      return session;
    } catch (err) {
      console.error('Mongo insert error, falling back:', err);
    }
  }

  // Fallback
  const list = readFallback();
  const existingIndex = list.findIndex(item => item.id === session.id);
  if (existingIndex >= 0) {
    list[existingIndex] = session;
  } else {
    list.unshift(session);
  }
  writeFallback(list);
  return session;
}

/**
 * READ ALL: List all chat sessions sorted by updatedAt descending
 */
export async function getAllChats(): Promise<ChatSession[]> {
  const col = await getCollection();
  if (col) {
    try {
      const items = await col
        .find({})
        .sort({ updatedAt: -1 })
        .toArray();
      return items.map(item => ({
        id: item.id,
        title: item.title,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        employeeId: item.employeeId,
        messages: item.messages || [],
      }));
    } catch (err) {
      console.error('Mongo find error, falling back:', err);
    }
  }

  // Fallback
  const list = readFallback();
  return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

/**
 * READ ONE: Get a single chat session by ID
 */
export async function getChatById(id: string): Promise<ChatSession | null> {
  const col = await getCollection();
  if (col) {
    try {
      const doc = await col.findOne({ id });
      if (doc) {
        return {
          id: doc.id,
          title: doc.title,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          employeeId: doc.employeeId,
          messages: doc.messages || [],
        };
      }
    } catch (err) {
      console.error('Mongo findOne error, falling back:', err);
    }
  }

  const list = readFallback();
  return list.find(item => item.id === id) || null;
}

/**
 * UPDATE: Update title, messages, or metadata of a chat session (with upsert)
 */
export async function updateChat(
  id: string,
  updates: Partial<Omit<ChatSession, 'id' | 'createdAt'>> & { title?: string; employeeId?: string }
): Promise<ChatSession | null> {
  const timestamp = new Date().toISOString();
  const col = await getCollection();
  if (col) {
    try {
      const res = await col.findOneAndUpdate(
        { id },
        {
          $set: { ...updates, updatedAt: timestamp },
          $setOnInsert: {
            id,
            createdAt: timestamp,
            title: updates.title || 'New Conversation',
            employeeId: updates.employeeId || 'NE-104',
          },
        },
        { returnDocument: 'after', upsert: true }
      );
      if (res) {
        return {
          id: res.id,
          title: res.title,
          createdAt: res.createdAt,
          updatedAt: res.updatedAt,
          employeeId: res.employeeId,
          messages: res.messages || [],
        };
      }
    } catch (err) {
      console.error('Mongo findOneAndUpdate error, falling back:', err);
    }
  }

  const list = readFallback();
  const idx = list.findIndex(item => item.id === id);
  if (idx >= 0) {
    list[idx] = {
      ...list[idx],
      ...updates,
      updatedAt: timestamp,
    };
    writeFallback(list);
    return list[idx];
  } else {
    const newSession: ChatSession = {
      id,
      title: updates.title || 'New Conversation',
      createdAt: timestamp,
      updatedAt: timestamp,
      messages: updates.messages || [],
      employeeId: updates.employeeId || 'NE-104',
    };
    list.unshift(newSession);
    writeFallback(list);
    return newSession;
  }
}

/**
 * DELETE: Delete a chat session by ID
 */
export async function deleteChat(id: string): Promise<boolean> {
  const col = await getCollection();
  if (col) {
    try {
      const res = await col.deleteOne({ id });
      return res.deletedCount > 0;
    } catch (err) {
      console.error('Mongo deleteOne error, falling back:', err);
    }
  }

  const list = readFallback();
  const filtered = list.filter(item => item.id !== id);
  const deleted = filtered.length !== list.length;
  if (deleted) {
    writeFallback(filtered);
  }
  return deleted;
}

/**
 * CLEAR ALL: Delete all conversations
 */
export async function clearAllChats(): Promise<boolean> {
  const col = await getCollection();
  if (col) {
    try {
      await col.deleteMany({});
      return true;
    } catch (err) {
      console.error('Mongo deleteMany error, falling back:', err);
    }
  }

  writeFallback([]);
  return true;
}
