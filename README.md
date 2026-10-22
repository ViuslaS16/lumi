# Lumi — NovaEdge Learning Assistant & HRIS L&D Suite

**Lumi** is an AI-powered Learning and Development (L&D) system built for the **HRIS (BHRM 32242) Group Assignment (Task 2)** for **NovaEdge Technologies (Pvt) Ltd**, an IT services firm headquartered in Colombo, Sri Lanka.

The application features the full **Lumi Chat Assistant** plus four dedicated modules spanning employee progress tracking, course discovery, gamified recognition, and management-level workforce analytics. All modules share a unified **MainNavbar** and cohesive warm amber visual identity.

---

## 1. Core Modules & Route Architecture

| Route | Section Name | Description & Key Capabilities |
|---|---|---|
| `/` | **Lumi Chat Assistant** | Conversational L&D assistant grounded in 42 official NovaEdge FAQs, supporting policy queries, multi-turn chat history (MongoDB NoSQL + local fallback), quick actions, and simulated workflows. |
| `/progress` | **Employee Learning Dashboard** | Individual employee progress tracking across `NE-101` through `NE-110`. Displays completion rate `(completed/assigned)*100`, progress bar, points, rank, tier badge, and pending courses. |
| `/learn` | **Course Catalogue** | Full catalog of 6 internal NovaEdge training courses with live search by title/skill, category filters (Compliance, Technical, Leadership, Security, Productivity), and simulated enrollment persisted in `localStorage`. |
| `/leaderboard` | **Learning Leaderboard** | Gamified employee recognition with Top-3 podium, Top-5 public named list, strict privacy masking for ranks 6–10 ("Anonymous Learner"), private employee rank lookup, and demo opt-out toggle. |
| `/hr-analytics` | **HR Analytics Dashboard** | Management-level analytics with 4 verified KPIs (10 employees, 61.25% completion [49/80], 3,440 total pts, 9 incomplete learners), department completion bar chart, top 5 learners, and course benchmark analytics. |

---

## 2. Shared Design System & Navigation

- **Unified Navigation (`MainNavbar`)**: Rendered persistently in `RootLayout` across every screen.
  - Left: Lumi Orb mascot, "Lumi" brand, and "NovaEdge L&D" assignment pill.
  - Center: Direct links to all 5 sections with active link indicators in warm amber.
  - Right: Personal user profile badge (click to update username across all components), real-time "Online" status, and responsive mobile hamburger drawer.
- **Amber Palette**:
  - Primary Amber: `#D97706` / Hover: `#B45309`
  - Accent Amber: `#F59E0B` / Amber Gold: `#FBBF24`
  - Warm Dark Amber: `#92400E` / Deep Stone: `#292524`
  - Amber Tint: `#FEF3C7` / Canvas Cream: `#FFFBF5` / Surface Capsule: `#EFE9E2`

---

## 3. Verified Calculations & Formulas

### Employee Dashboard (`/progress`)
- **Completion Rate (%)**: `Math.round((coursesCompleted / coursesAssigned) * 100)`
- **Points Formula**: `coursesCompleted * 50` points (e.g., 6 courses completed = 300 pts from courses + quiz bonuses = 400 pts)
- **Verified Benchmark Example (NE-104 Anika R.)**:
  - Assigned: 8 courses
  - Completed: 6 courses
  - Completion Rate: **75%** (`6 / 8 * 100`)
  - Points: **400 pts**
  - Standing: **Rank #4**, **Silver Badge**
  - Remaining: **2 courses**

### HR Analytics KPIs (`/hr-analytics`)
- **Total Employees**: `10`
- **Total Courses Assigned**: `80` (8 courses per employee × 10 employees)
- **Total Courses Completed**: `49`
- **Overall Completion Rate**: `49 / 80 = 61.25%` (rounded to `61.3%`)
- **Total Learning Points**: `3,440 pts` across all 10 employees
- **Learners with Incomplete Mandatory Training**: `9` employees (only Elena Rostova NE-108 has completed 8/8)
- **Department Completion Rates**:
  - Human Resources: `75.0%` (12 / 16 courses)
  - Customer Support: `68.8%` (11 / 16 courses)
  - Engineering: `66.7%` (16 / 24 courses)
  - Sales & Marketing: `56.3%` (9 / 16 courses)
  - Finance: `43.8%` (7 / 16 courses)

---

## 4. Technical Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database / Storage**:
  - MongoDB (via native driver) with local JSON fallback for conversation history
  - `localStorage` for enrolled courses (`lumi_enrolled_courses`) and user profile (`lumi_username`)
- **AI Grounding**: 42 curated NovaEdge L&D FAQs with local fuzzy/exact matching engine

---

## 5. Local Setup & Running

```bash
# 1. Clone repository
git clone https://github.com/ViuslaS16/lumi.git
cd lumi

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open `http://localhost:3000` in your web browser.

To run a production build:
```bash
npm run build
npm start
```

---

## 6. Demo Presentation Script (Viva Walkthrough)

1. **Lumi Chat (`/`)**:
   - Ask: *"What training is mandatory?"* or *"Can the company pay for my certification?"*.
   - Verify explainable grounding in company policy (Q35 reimbursement up to LKR 150,000).
   - Test personalizing username via the top-right profile pill.
2. **Employee Dashboard (`/progress`)**:
   - Select or search employee `NE-104`.
   - Verify Anika R. displays 75% completion (6/8), 400 pts, Rank #4, and Silver badge.
3. **Course Catalogue (`/learn`)**:
   - Filter by "Security" or search for "Python".
   - Click "Enroll Now" on an unenrolled course; observe status updates to "Enrolled" and persists in `localStorage`.
4. **Leaderboard (`/leaderboard`)**:
   - Highlight top-3 podium (1st Elena 490 pts, 2nd Carlos 460 pts, 3rd Sophia 430 pts).
   - Show privacy enforcement: ranks 6 to 10 are anonymized as "Anonymous Learner".
   - Test looking up rank privately or switching the opt-out toggle.
5. **HR Analytics (`/hr-analytics`)**:
   - Walk through the 4 executive KPIs: 10 Employees, 61.3% Completion, 3,440 Points, 9 Incomplete.
   - Review Department Completion bar chart (HR leading at 75%, Finance at 43.8%).
