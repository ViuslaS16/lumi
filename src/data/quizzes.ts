export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizTopic {
  id: string;
  title: string;
  description: string;
  available: boolean;
  questionCount: number;
  timeEstimate: string;
  badgeEligible: boolean;
}

export const QUIZ_TOPICS: QuizTopic[] = [
  {
    id: 'communication',
    title: 'Communication Skills',
    description: 'Active listening, concise emails, interpersonal feedback, and conflict handling.',
    available: true,
    questionCount: 5,
    timeEstimate: '3 mins',
    badgeEligible: true,
  },
  {
    id: 'presentation',
    title: 'Presentation Skills',
    description: 'Structure, slide design, storytelling, and managing audience Q&A.',
    available: false,
    questionCount: 5,
    timeEstimate: '3 mins',
    badgeEligible: false,
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Basics',
    description: 'Phishing detection, credential security, data classification, and remote safety.',
    available: false,
    questionCount: 5,
    timeEstimate: '3 mins',
    badgeEligible: false,
  },
];

export const COMMUNICATION_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which is an example of active listening?',
    options: [
      'Waiting quietly for your turn to speak',
      'Summarizing what the speaker said',
      'Thinking about your counter-argument while they speak',
      'Checking your email while nodding occasionally',
    ],
    correctIndex: 1,
    explanation: 'Active listening involves paraphrasing and summarizing what the speaker said to verify understanding and demonstrate engagement.',
  },
  {
    id: 2,
    question: 'What is the best way to give feedback?',
    options: [
      'Focusing on personal traits rather than actions',
      'Waiting until the annual appraisal before mentioning issues',
      'Be specific, respectful and focus on the behavior',
      'Sending a vague one-liner to avoid awkward discussions',
    ],
    correctIndex: 2,
    explanation: 'Constructive feedback focuses specifically on observable behavior and impact, delivered with respect and actionable suggestions.',
  },
  {
    id: 3,
    question: 'Which channel is best for urgent, sensitive matters?',
    options: [
      'A message on a public team Slack channel',
      'An email with high importance mark and 10 CCs',
      'A direct call or face-to-face conversation',
      'A scheduled meeting request for next week',
    ],
    correctIndex: 2,
    explanation: 'Direct calls or face-to-face conversations allow immediate clarification, tone sensing, and privacy for sensitive or urgent issues.',
  },
  {
    id: 4,
    question: 'In a presentation, what should you do first?',
    options: [
      'Choose slide transitions and animated templates',
      'Understand your audience and set a clear goal',
      'Write out a 50-page detailed appendix',
      'Start speaking immediately without an outline',
    ],
    correctIndex: 1,
    explanation: 'Effective presentations begin with defining the audience’s needs and establishing a clear, measurable objective for the talk.',
  },
  {
    id: 5,
    question: 'What does a clear email subject line do?',
    options: [
      'Helps the reader understand the purpose at a glance',
      'Contains as many urgent keywords as possible',
      'Summarizes the entire body text in one run-on sentence',
      'Leaves the subject blank to pique curiosity',
    ],
    correctIndex: 0,
    explanation: 'A concise subject line conveys the email purpose and required urgency immediately so the recipient can prioritize effectively.',
  },
];
