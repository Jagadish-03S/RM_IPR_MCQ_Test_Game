# RM & IPR MCQ Test Game and Student Performance Management System

An educational assessment, proctoring, and student performance management system tailored for the **Visvesvaraya Technological University (VTU)** 5th Semester course:
**Research Methodology & Intellectual Property Rights (Course Code: BRMK557)**.

Built directly from the prescribed textbook `BRMK557 RM&IPR Textbook.pdf`.

---

## 🌟 Key Highlights & Architectural Features

1. **100% Textbook-Derived Question Bank**:
   - All 120 pages of the official textbook were inspected and analyzed.
   - Exactly **100 unique, validated multiple-choice questions** (20 MCQs per module across Modules 1 to 5).
   - Every single question features 4 distinct options (A–D), a single verified correct answer, chapter reference, page number citation, and explanation.
   - **Zero Answer Leakage**: Public frontend bundles and test-taking APIs strictly strip correct answers and explanations until formal release.

2. **Ordered 5-Module Test Engine**:
   - Sequential progression: Module 1 ➔ Module 2 ➔ Module 3 ➔ Module 4 ➔ Module 5.
   - 20 MCQs per module, presented one at a time with instant autosave.
   - Complete 1–20 question navigator with answered, unanswered, and active indicators.
   - Configurable module countdown timer (default 20 minutes) with auto-submission on expiry.
   - Module answer locking: Once a module is confirmed and submitted, its answers are permanently locked before unlocking the next module.

3. **Active Proctoring & Focus Integrity Monitoring**:
   - Employs the HTML5 Page Visibility API (`document.visibilitychange`) and `window.blur`/`window.focus` event listeners.
   - Real-time warning badge and urgent modal alerts when students switch tabs or minimize the browser.
   - Cumulative warning counter logged directly to the backend database with exact event type, timestamp, and duration away.
   - Examiner audit trail inspects every focus event alongside candidate scores.

4. **Automated Server-Side Scoring**:
   - Default: +1 mark for correct, 0 marks for wrong, 0 marks for unanswered (100 marks maximum).
   - Validated on the server: Never trusts score inputs from client browsers.
   - Formulas:
     $$\text{Attempted} = \text{Correct} + \text{Wrong}$$
     $$\text{Unanswered} = \text{Total Questions} - \text{Attempted}$$
     $$\text{Percentage} = \left(\frac{\text{Obtained Marks}}{\text{Maximum Possible Marks}}\right) \times 100$$

5. **Certified Document & Report Generation**:
   - Pure Node.js binary file generation (`docx` and `pdfkit`) with zero headless browser or external cloud dependencies.
   - **Complete 100-Question Exam Paper** (PDF & DOCX).
   - **Official Master Answer Key & Detailed Solutions** with citations (PDF & DOCX).
   - **Module-Wise Question Papers & Answer Keys** for Modules 1 to 5 (PDF & DOCX).
   - **Candidate Scorecard Transcript** with module breakdown and proctoring audit (PDF & DOCX).
   - **Consolidated Cohort Performance Report** for administrators (CSV, PDF, and DOCX).

6. **Examiner & Administrator Console**:
   - Secure hashed authentication (`bcryptjs` + JWT).
   - Cohort summary metrics: Total Candidates, Completed Tests, Average Score, Highest Score, Lowest Score, Focus Warnings.
   - Attempt Management Table: Search by Name/USN, filter by completion status, and sort by score, warnings, or submission date.
   - Drill-down Modal: Detailed candidate answer review + proctoring event timeline.
   - Attempt Reset: Secure examiner tool to clear an attempt and permit a retake.
   - Test Configuration Management: Configure marks per question, penalties, time limits, test active switch, review visibility, and USN regex patterns.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Canvas Confetti |
| **Backend** | Node.js, Express, TypeScript, Zod validation |
| **Database & ORM**| SQLite / PostgreSQL with Prisma ORM (`prisma/dev.db`) |
| **Authentication** | Student Session Tokens (Crypto UUID), Admin JWT + Bcrypt Password Hashing |
| **Document Generation** | `pdfkit` (Binary PDF), `docx` (Word Documents), `csv-stringify` (Spreadsheets) |
| **Testing** | Vitest (16 unit and integration test suites) |

---

## 🚀 Quick Start Guide (Windows / VS Code / Antigravity)

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Database Seeding
The database (`prisma/dev.db`) is already pushed and seeded. To re-seed fresh test settings and the Super Admin account at any time:
```powershell
cd server
npm run prisma:seed
cd ..
```

### 2. Start the Backend Server
In your first terminal:
```powershell
npm run server
```
*The server will start on `http://localhost:5000`.*
*Health check endpoint: `http://localhost:5000/api/health`.*

### 3. Start the Frontend Application
In a second terminal:
```powershell
npm run client
```
*Vite will launch the web application on `http://localhost:5173`.*

---

## 🔑 Default Administrator Credentials

For academic examiners and evaluators:
- **Portal URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@university.ac.in`
- **Password**: `Admin@RMIPR2026!`

*(Note: Admin password hashes are securely generated via bcrypt with salt rounds of 10. You can change these credentials in `.env` or from the Admin Console.)*

---

## 📚 Curriculum & Module Structure (BRMK557)

- **Module 1: Introduction to Research Methodology** (Chapter 1)
  - Research cycle, problem space formulation, knowledge categories (declarative, procedural, recognizing, orchestrating), exploratory vs. confirmatory research, engineering research methods.
- **Module 2: Literature Review & Citations** (Chapters 2 & 3)
  - Literature survey protocols, indexing bodies (Scopus, Web of Science, Google Scholar), citation taxonomy (IEEE, ACM, Harvard, APA), attribution ethics, plagiarism prevention.
- **Module 3: Introduction to Intellectual Property & Patents** (Chapters 4, 5 & 6)
  - Nature of IPR, Indian Patent Act 1970, patentability triad (novelty, inventive step/non-obviousness, industrial applicability), provisional vs. complete specifications, Patent Cooperation Treaty (PCT).
- **Module 4: Copyrights and Related Rights; Trademarks** (Chapters 7 & 8)
  - Berne Convention, original expression vs. ideas, fair dealing doctrine, economic rights, trademark distinctiveness, trademark classes, infringement vs. passing off.
- **Module 5: Industrial Design, GI & Landmark Case Studies** (Chapters 9, 10 & 11)
  - Design Act 2000 novelty requirements, Geographical Indications of Goods Act 1999 (Darjeeling tea, Mysore silk, Basmati rice, Turmeric patent revocation, Diamond v. Chakrabarty).

---

## 🧪 Automated Test Suite Verification

Run all test suites locally:
```powershell
npm test
```

Verification Output:
```text
 ✓ src/tests/usnValidation.test.ts (3 tests)
 ✓ src/tests/questionBank.test.ts (5 tests)
 ✓ src/tests/scoring.test.ts (4 tests)
 ✓ src/tests/documentService.test.ts (4 tests)

 Test Files  4 passed (4)
      Tests  16 passed (16)
```

Test coverage includes:
1. **Question Bank**: 100 questions, 20 per module, 4 non-empty options, 1 valid answer, non-empty explanation, chapter reference, page citations, and zero public data leaks.
2. **Scoring Engine**: Full score computation, zero score, attempted, unanswered, percentage formulas, and single module calculations.
3. **USN Validation**: Whitespace trimming, uppercase normalization, and VTU pattern enforcement (`^[0-9][A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$`).
4. **Document Generation**: Magic-byte verification of generated PDF buffers (`%PDF`), DOCX ZIP buffers (`PK`), and CSV strings.

---

## ⚠️ Integrity & Security Limitations Disclaimer

1. **Student Identification**: Candidate Full Name and University Seat Number (USN) function as institutional identifiers for test routing and record grouping. They do not constitute biometric or cryptographic authentication.
2. **Proctoring Boundaries**: Browser-based focus monitoring is constrained by standard browser JavaScript security sandboxes. The system accurately logs Page Visibility changes and window blur/focus events. It does not and cannot observe external physical devices, hardware video capture, or second screens without native operating system privileges.

---

## 📂 Project Directory Structure

```text
RM_IPR_MCQ_Test_Game/
├── client/                     # Frontend React + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/         # FocusMonitor, Navbar, QuestionCard, QuestionGrid, Timer, SubmitModal
│   │   ├── pages/              # StudentLogin, TestInstructions, ActiveTest, FinalResults, AdminDashboard, DownloadCentre
│   │   ├── services/           # Axios API client with session & JWT interceptors
│   │   ├── App.tsx             # React Router structure
│   │   └── main.tsx            # Application entry point
│   └── package.json
├── server/                     # Backend Node.js + Express + TypeScript Engine
│   ├── src/
│   │   ├── lib/prisma.ts       # Database client instance
│   │   ├── middleware/auth.ts  # Student session & Admin JWT verification
│   │   ├── routes/             # Student, Admin, and Download endpoints
│   │   ├── services/           # QuestionBank, Scoring, and Document Generation (PDF/DOCX/CSV)
│   │   ├── tests/              # 16 Vitest test suites
│   │   ├── seed.ts             # Super Admin and TestConfig database seed script
│   │   └── index.ts            # Express server initialization
│   └── package.json
├── data/
│   └── question-bank.json      # 100 textbook-verified MCQs with page citations
├── prisma/
│   ├── schema.prisma           # Prisma schema definition
│   └── dev.db                  # Local SQLite database
├── textbook/
│   └── BRMK557 RM&IPR Textbook.pdf # 120-page source curriculum
└── README.md                   # Complete system documentation
```

---

## 👨‍💻 Author & Developer

**Designed & Developed by Jagadish S**
- **GitHub**: [github.com/sjaga](https://github.com/sjaga)
- **Email**: [sjagadish89772@gmail.com](mailto:sjagadish89772@gmail.com)
- **Institution**: Visvesvaraya Technological University (VTU)

*Crafted with distinction for the academic community and students of Visvesvaraya Technological University (VTU).*

