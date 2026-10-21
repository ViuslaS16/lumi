# Lumi — NovaEdge Learning Assistant

**Lumi** is an AI-powered Learning and Development (L&D) chatbot built for the **HRIS (BHRM 32242) Group Assignment (Task 2)** for **NovaEdge Technologies (Pvt) Ltd**, an IT services firm headquartered in Colombo, Sri Lanka.

Lumi operates entirely within a **single-page application** at `/` to streamline navigation, avoid separate dashboard pages, and allow interactive, conversational exploration of training policies, employee progress, leaderboard gamification, and skill development.

---

## 1. What Lumi Does
- **Answers 42 Official L&D FAQs**: Covers courses, enrollment limits, mandatory compliance deadlines, mentoring, certification reimbursement, study leave, and HR escalation.
- **My Progress Lookup**: Allows employees to look up their course completion rate, points, rank, and tier badge directly in the chat feed (e.g. `NE-104` Anika R. — 75% completion, Silver badge, Rank #4).
- **Gamified Leaderboard**: Displays the top 5 learners with Gold, Silver, and Bronze badges while maintaining learner privacy (ranks 6–10 and opt-out policy).
- **Interactive Knowledge Quiz**: Features an embedded 5-question Communication Skills Quiz with instant answer feedback, point accumulation, and 3-attempt best score tracking.
- **Skill-Gap Assessment**: A 3-question self-assessment (Communication, Presentation, Security) recommending tailored courses from the NovaEdge catalog.
- **Simulated Course Enrollment**: Inline course cards with simulated enrollment confirmation.
- **HR Contact Escalation**: Direct contact card displaying `learning@novaedge.example`, extension `214`, and operational hours.

---

## 2. Technical Stack & Architecture
- **Framework**: Next.js (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Strictly tailored Amber Palette: `#D97706`, `#92400E`, `#FBBF24`, `#FEF3C7`, `#FFFBF5`)
- **Icons**: Lucide React
- **AI SDK**: OpenAI JavaScript SDK configured for **DeepSeek API** (`https://api.deepseek.com`, model: `deepseek-chat`)
- **Offline / Local Execution**: Runs 100% locally with zero external API dependencies required.

---

## 3. Project File Organization
```
Lumi/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts       # Server-side API route for DeepSeek & grounding
│   │   ├── globals.css             # Amber theme tokens & warm ivory layout
│   │   ├── layout.tsx              # Root HTML & metadata definition
│   │   └── page.tsx                # Single-page chat interface at /
│   ├── components/
│   │   ├── ChatMessage.tsx         # Message bubbles & rich widget dispatcher
│   │   ├── CourseCatalogWidget.tsx # Filterable course catalog with simulated enroll
│   │   ├── Header.tsx              # Brand logo, online status, demo badge & clear chat
│   │   ├── HRContactCard.tsx       # L&D team contacts (email, extension 214)
│   │   ├── LeaderboardCard.tsx     # Top 5 leaderboard with privacy disclaimer
│   │   ├── ProgressCard.tsx        # Employee completion stats & badge (NE-104)
│   │   ├── QuickActionMenu.tsx     # 8 quick-action flow chips
│   │   ├── QuizWidget.tsx          # 5-question interactive communication quiz
│   │   ├── SkillAssessmentWidget.tsx # 3-question confidence check & recommendations
│   │   └── WelcomeBanner.tsx       # Greeting & starter question suggestions
│   ├── data/
│   │   ├── courses.ts              # 6 internal courses from assignment catalog
│   │   ├── employees.ts            # 10 fictional demo employees (NE-101 to NE-110)
│   │   ├── faqs.ts                 # All 42 assignment FAQs across categories A-H
│   │   └── quizzes.ts              # 5 communication quiz questions & topics
│   └── lib/
│       └── faqMatcher.ts           # Explainable local FAQ matcher & typo engine
├── .env.example                    # Placeholder DeepSeek environment variables
├── package.json
└── README.md
```

---

## 4. How the Chatbot Works

### A. Local FAQ Retrieval Engine (`src/lib/faqMatcher.ts`)
The chatbot uses an explainable, deterministic natural language matching engine that works completely offline:
1. **Normalization**: Removes punctuation, lowercases strings, and expands common colloquial abbreviations and typos:
   - `"how 2"` → `"how to"`
   - `"certificat"` / `"cert"` → `"certificate"`
   - `"register"` / `"signup"` → `"enroll"`
   - `"compulsory"` → `"mandatory"`
2. **Stop Word Filtering**: Removes generic words (`what`, `is`, `the`, `a`, `to`, `for`) so they do not produce false positive matches.
3. **Basic Word Stemming**: Normalizes word forms (`badges` / `badge`, `courses` / `course`, `training` / `train`).
4. **Exact & Semantic Scoring**:
   - Canonical question exact match: **1.0**
   - Alternative phrasing match: **1.0**
   - Keyword token coverage ratio: **weighted scoring**
5. **Smart Fallback**: If the query does not meet the confidence threshold (e.g. questions outside the knowledge base like *"what is for lunch in the cafeteria"*), Lumi returns the verified escalation answer:
   > *"I'm not sure about that. Please contact the L&D team at learning@novaedge.example or call extension 214."*

### B. Optional DeepSeek AI Integration (`src/app/api/chat/route.ts`)
- If `DEEPSEEK_API_KEY` is provided in `.env.local`, the server passes the matched FAQ context to DeepSeek (`https://api.deepseek.com`, model `deepseek-chat`).
- A strict system prompt ensures responses remain under 100 words, warm, encouraging, and strictly grounded in company policy without inventing facts.
- **Fail-safe fallback**: If DeepSeek is unavailable, times out, or the API key is missing, Lumi instantly serves the verified local FAQ answer with zero disruption.

---

## 5. How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Setup
1. Clone or open the project folder in your terminal:
   ```bash
   cd Lumi
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Configure DeepSeek API key:
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Add your key:
     ```env
     DEEPSEEK_API_KEY=sk-your-actual-deepseek-api-key
     DEEPSEEK_MODEL=deepseek-chat
     ```
   - *Note: If you do not have a DeepSeek key, you can skip this step entirely! Lumi will run using its local matching engine.*

4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

To run a production build:
```bash
npm run build
npm start
```

---

## 6. Demo Presentation Script (for Viva)

You can demonstrate all key features in under 3 minutes using this flow:
1. **Welcome & Quick Suggestions**: Click *"How do I enroll in a course?"* or *"What training is mandatory?"*.
2. **Typo / Informal Query Test**:
   - Type `"how 2 get certificat"` → answers with certificate download policy (Q34).
   - Type `"can company pay my cert"` → answers with LKR 150,000 reimbursement policy (Q35).
   - Type `"my course not showing"` → answers with the 24-hour update lag policy (Q23).
3. **My Progress Flow**:
   - Click the **My Progress** button in Quick Actions.
   - Enter `NE-104` (or click the sample chip).
   - Shows **Anika R. (HR)**, 6 of 8 courses (75%), 400 points, Rank #4, and Silver badge.
4. **Leaderboard Flow**:
   - Click **Leaderboard** from the Progress card or Quick Actions.
   - Shows top 5 learners (ranks 1–3 Gold, 4–5 Silver).
   - Highlights user rank and shows the required privacy notice.
5. **Interactive Quiz**:
   - Click **Take a Quiz** → select **Communication Skills**.
   - Answer the 5 questions (e.g. active listening = summarizing what speaker said).
   - View final score, points earned (+20 pts), and retake attempt counter.
6. **Skill-Gap Assessment**:
   - Click **Skills Development** → answer the 3 Low/Medium/High prompts.
   - View recommended courses with simulated Enroll button.
7. **HR Escalation & Fallback**:
   - Ask an unknown question (e.g., *"What is on the cafeteria menu today?"*).
   - Lumi outputs the fallback directing to `learning@novaedge.example` or extension 214.
   - Click **Talk to HR** to reveal the full contact card.
8. **Clear Chat**: Click **Clear Chat** in the top right to reset the conversation.

---

## 7. Fictional Data Disclosure
As per the assignment requirements, all employee names (`Nimal P.`, `Anika R.`, etc.), policy limits (`LKR 150,000`), bond periods (`12 months for courses > LKR 100,000`), phone extensions (`214`), and email addresses (`learning@novaedge.example`) are purely fictional demonstration data created for NovaEdge Technologies (Pvt) Ltd.
