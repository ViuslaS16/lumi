import { FAQS_DATA, FAQItem } from '../data/faqs';

export interface MatchResult {
  faq: FAQItem | null;
  confidence: number;
  answer: string;
  isFallback: boolean;
  suggestedFollowUps: string[];
}

export const FALLBACK_MESSAGE =
  "I'm not sure about that. Please contact the L&D team at learning@novaedge.example or call extension 214.";

// Common typo corrections and colloquial shortcut mappings
const TYPO_DICTIONARY: Record<string, string> = {
  '2': 'to',
  'u': 'you',
  'r': 'are',
  'ur': 'your',
  'pls': 'please',
  'plz': 'please',
  'cert': 'certificate',
  'certificat': 'certificate',
  'certifications': 'certificate',
  'certification': 'certificate',
  'register': 'enroll',
  'registration': 'enroll',
  'signup': 'enroll',
  'sign up': 'enroll',
  'leaderbord': 'leaderboard',
  'leadrboard': 'leaderboard',
  'compulsory': 'mandatory',
  'requierd': 'required',
  'requried': 'required',
  'refund': 'reimbursement',
  'reimburse': 'reimbursement',
  'pay': 'reimbursement',
  'reimbursment': 'reimbursement',
  'cant': 'cannot',
  'dont': 'do not',
};

// Common English stop words that should not drive positive FAQ matches on their own
const STOP_WORDS = new Set([
  'what', 'is', 'the', 'a', 'an', 'on', 'in', 'at', 'of', 'to', 'do', 'does', 'did',
  'can', 'i', 'my', 'me', 'for', 'and', 'or', 'it', 'are', 'was', 'were', 'about',
  'there', 'this', 'that', 'with', 'from', 'by', 'as', 'today', 'we', 'you', 'your'
]);

/**
 * Basic English stemmer for common suffixes (s, es, ies, ing)
 */
export function stem(word: string): string {
  if (word.length <= 3) return word;
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('es')) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  if (word.endsWith('ing')) return word.slice(0, -3);
  return word;
}

/**
 * Normalizes input text: lowercase, punctuation removal, whitespace trimming,
 * and common typo/slang expansion for student presentation queries.
 */
export function normalizeText(text: string): string {
  const cleaned = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // remove punctuation
    .replace(/\s+/g, ' ')
    .trim();

  // Replace discrete words based on typo dictionary
  const tokens = cleaned.split(' ').map(word => TYPO_DICTIONARY[word] || word);
  return tokens.join(' ');
}

/**
 * Matches a user query against the 42 FAQs in local knowledge base.
 */
export function findBestFAQMatch(userQuery: string): MatchResult {
  const rawNormalized = userQuery.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const normalized = normalizeText(userQuery);

  if (!normalized || normalized.length < 2) {
    return {
      faq: null,
      confidence: 0,
      answer: FALLBACK_MESSAGE,
      isFallback: true,
      suggestedFollowUps: [
        'How do I enroll in a course?',
        'Which trainings are mandatory?',
        'How do I get a certificate?',
      ],
    };
  }

  const rawTokens = normalized.split(' ').filter(t => t.length > 0);
  const meaningfulTokens = rawTokens.filter(t => !STOP_WORDS.has(t));
  const stemmedTokens = new Set(meaningfulTokens.map(stem));

  let bestMatch: FAQItem | null = null;
  let highestScore = 0;

  for (const faq of FAQS_DATA) {
    let score = 0;
    const normQuestion = normalizeText(faq.question);

    // 1. Exact match on question
    if (rawNormalized === normQuestion || normalized === normQuestion) {
      score = 1.0;
    } else {
      // 2. Exact match on alternative questions
      for (const alt of faq.alternativeQuestions) {
        const normAlt = normalizeText(alt);
        const rawAlt = alt.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
        if (rawNormalized === rawAlt || rawNormalized === normAlt || normalized === normAlt) {
          score = 1.0;
          break;
        }
        // Substring match for phrases
        if (normalized.includes(normAlt) || normAlt.includes(normalized)) {
          score = Math.max(score, 0.88);
        }
      }

      // 3. Keyword matching (deduplicate so one query token doesn't match 5 duplicate keywords)
      if (score < 1.0) {
        const matchedQueryTokens = new Set<string>();

        for (const kw of faq.keywords) {
          const normKw = normalizeText(kw);

          // If entire multi-word keyword is in query
          if (normKw.length > 3 && normalized.includes(normKw)) {
            normKw.split(' ').forEach(w => matchedQueryTokens.add(stem(w)));
            continue;
          }

          // Check distinct words
          for (const kwWord of normKw.split(' ')) {
            if (STOP_WORDS.has(kwWord)) continue;
            const stemmedKw = stem(kwWord);

            if (stemmedTokens.has(stemmedKw) && !matchedQueryTokens.has(stemmedKw)) {
              matchedQueryTokens.add(stemmedKw);
            }
          }
        }

        // 4. Token overlap with meaningful words of the canonical question
        const questionMeaningful = normQuestion
          .split(' ')
          .filter(t => !STOP_WORDS.has(t))
          .map(stem);

        let tokenOverlap = 0;
        if (questionMeaningful.length > 0) {
          for (const token of stemmedTokens) {
            if (questionMeaningful.includes(token)) {
              tokenOverlap += 1.0;
            }
          }
        }

        // Calculate score based on proportion of matched query tokens
        if (meaningfulTokens.length > 0) {
          const tokenCoverage = matchedQueryTokens.size / meaningfulTokens.length;
          const overlapScore = questionMeaningful.length > 0 ? tokenOverlap / questionMeaningful.length : 0;
          const compositeScore = (tokenCoverage * 0.6) + (overlapScore * 0.4);
          score = Math.max(score, compositeScore);
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = faq;
    }
  }

  // Acceptance threshold
  const THRESHOLD = 0.45;

  if (bestMatch && highestScore >= THRESHOLD) {
    const followUps = bestMatch.suggestedFollowUps && bestMatch.suggestedFollowUps.length > 0
      ? bestMatch.suggestedFollowUps
      : ['How do I enroll in a course?', 'What training is mandatory?', 'Talk to HR'];

    return {
      faq: bestMatch,
      confidence: Math.min(Number(highestScore.toFixed(2)), 1.0),
      answer: bestMatch.answer,
      isFallback: false,
      suggestedFollowUps: followUps,
    };
  }

  // Fallback to HR when confidence is below threshold
  return {
    faq: null,
    confidence: Math.min(Number(highestScore.toFixed(2)), 0.3),
    answer: FALLBACK_MESSAGE,
    isFallback: true,
    suggestedFollowUps: [
      'How do I enroll in a course?',
      'Which trainings are mandatory?',
      'How do I get a certificate?',
      'Talk to HR',
    ],
  };
}
