import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const moduleTitles: Record<number, string> = {
  1: 'Module 1: Introduction to Research Methodology',
  2: 'Module 2: Literature Review and Technical Reading; Attributions and Citations',
  3: 'Module 3: Introduction to Intellectual Property; Patents; Process of Patenting',
  4: 'Module 4: Copyrights and Related Rights; Trademarks',
  5: 'Module 5: Industrial Design; Geographical Indications; Case Studies on Patents'
};

const studentsData = [
  { usn: '4JD24CS001', name: 'Abhishek Patil', score: 88 },
  { usn: '4JD24CS002', name: 'Aditi Rao', score: 94 },
  { usn: '4JD24CS003', name: 'Aishwarya M', score: 82 },
  { usn: '4JD24CS004', name: 'Ananya Sharma', score: 96 },
  { usn: '4JD24CS005', name: 'Bharath Kumar S', score: 78 },
  { usn: '4JD24CS006', name: 'Bhuvaneshwari K', score: 85 },
  { usn: '4JD24CS007', name: 'Bikash Mohanty', score: 79 },
  { usn: '4JD24CS008', name: 'Chandan Gowda', score: 83 },
  { usn: '4JD24CS009', name: 'Chetan M', score: 74 },
  { usn: '4JD24CS010', name: 'Darshan R', score: 89 },
  { usn: '4JD24CS011', name: 'Dhanush V', score: 76 },
  { usn: '4JD24CS012', name: 'Divya R', score: 92 },
  { usn: '4JD24CS013', name: 'Gagan N', score: 81 },
  { usn: '4JD24CS014', name: 'Gowtham R', score: 87 },
  { usn: '4JD24CS015', name: 'Harshitha K', score: 93 },
  { usn: '4JD24CS016', name: 'Hemanth V', score: 77 },
  { usn: '4JD24CS017', name: 'Jeevan Kumar S', score: 84 },
  { usn: '4JD24CS018', name: 'Karthik S', score: 90 },
  { usn: '4JD24CS019', name: 'Keerthi M', score: 86 },
  { usn: '4JD24CS020', name: 'Likhitha M', score: 91 },
  { usn: '4JD24CS021', name: 'Manohari B', score: 95 },
  { usn: '4JD24CS022', name: 'Manoj Kumar N', score: 73 },
  { usn: '4JD24CS023', name: 'Meghana P', score: 88 },
  { usn: '4JD24CS024', name: 'Mohan Kumar G', score: 80 },
  { usn: '4JD24CS025', name: 'Nandish G', score: 82 },
  { usn: '4JD24CS026', name: 'Naveen Gowda K', score: 75 },
  { usn: '4JD24CS027', name: 'Nikhitha R', score: 89 },
  { usn: '4JD24CS028', name: 'Pawan K', score: 84 },
  { usn: '4JD24CS029', name: 'Pooja B', score: 93 },
  { usn: '4JD24CS030', name: 'Pradeep S', score: 79 },
  { usn: '4JD24CS031', name: 'Prajwal M', score: 86 },
  { usn: '4JD24CS032', name: 'Prathiksha B M', score: 97 },
  { usn: '4JD24CS033', name: 'Preethi R', score: 90 },
  { usn: '4JD24CS034', name: 'Rakesh B', score: 77 },
  { usn: '4JD24CS035', name: 'Rakshith G', score: 85 },
  { usn: '4JD24CS036', name: 'Rahul N', score: 88 },
  { usn: '4JD24CS037', name: 'Rohith V', score: 82 },
  { usn: '4JD24CS038', name: 'Sachin M', score: 80 },
  { usn: '4JD24CS039', name: 'Sahana N', score: 94 },
  { usn: '4JD24CS040', name: 'Sandeep R', score: 83 },
  { usn: '4JD24CS041', name: 'Shreya K', score: 92 },
  { usn: '4JD24CS042', name: 'Sindhu K', score: 87 },
  { usn: '4JD24CS043', name: 'Spoorthi M', score: 91 },
  { usn: '4JD24CS044', name: 'Suhas B', score: 85 },
  { usn: '4JD24CS045', name: 'Sushma N', score: 89 },
  { usn: '4JD24CS046', name: 'Tarun S', score: 78 },
  { usn: '4JD24CS047', name: 'Tejas Gowda', score: 86 },
  { usn: '4JD24CS048', name: 'Varun K', score: 81 },
  { usn: '4JD24CS049', name: 'Vidyashree G', score: 93 },
  { usn: '4JD24CS050', name: 'Vijay Kumar R', score: 84 },
  { usn: '4JD24CS051', name: 'Vinay Kumar M', score: 79 },
  { usn: '4JD24CS052', name: 'Vishal R', score: 82 },
  { usn: '4JD24CS053', name: 'Vivek S', score: 87 },
  { usn: '4JD24CS054', name: 'Yashaswini R', score: 95 },
  { usn: '4JD24CS055', name: 'Yogesh M', score: 80 },
  { usn: '4JD24CS074', name: 'Prajwal Patil', score: 85 },
  { usn: '4JD24CS086', name: 'Siddharth M', score: 89 },
  { usn: '4JD24CS101', name: 'K Mahalakshmi', score: 96 },
  { usn: '4JD24CS111', name: 'Rahul Sharma', score: 88 },
  { usn: '4JD24CS136', name: 'Vinayaka S', score: 83 },
  { usn: '4JD24EE009', name: 'Deepak G', score: 81 },
  { usn: '4JD24EE021', name: 'Kavya S', score: 87 }
];

export async function ensureStudentsSeeded(prisma: PrismaClient) {
  const currentCount = await prisma.student.count();
  if (currentCount >= 50) {
    console.log(`Students already seeded (count: ${currentCount}). Skipping student seeding.`);
    return;
  }

  console.log(`Current student count is ${currentCount}. Auto-populating 67 student records and exam attempts...`);

  // Locate question-bank.json
  const candidatePaths = [
    path.resolve(__dirname, '../../data/question-bank.json'),
    path.resolve(process.cwd(), 'data/question-bank.json'),
    path.resolve(process.cwd(), '../data/question-bank.json'),
    '/app/data/question-bank.json'
  ];
  let qbPath = candidatePaths.find(p => fs.existsSync(p));
  let questionBank: any[] = [];
  if (qbPath) {
    try {
      questionBank = JSON.parse(fs.readFileSync(qbPath, 'utf8'));
    } catch (e) {
      console.warn('Could not parse question bank, proceeding with basic scores:', e);
    }
  }

  for (const s of studentsData) {
    const normalizedUsn = s.usn.toUpperCase().replace(/\s+/g, '');

    const student = await prisma.student.upsert({
      where: { normalizedUsn },
      update: {
        fullName: s.name,
        usn: s.usn,
        department: s.usn.includes('EE') ? 'Electrical & Electronics Engineering' : 'Computer Science & Engineering',
        semester: 3
      },
      create: {
        fullName: s.name,
        usn: s.usn,
        normalizedUsn,
        department: s.usn.includes('EE') ? 'Electrical & Electronics Engineering' : 'Computer Science & Engineering',
        semester: 3,
        createdAt: new Date('2026-11-13T09:15:00.000Z')
      }
    });

    const baseMinutes = 30 + Math.floor(Math.random() * 20);
    const startedAt = new Date(`2026-11-13T04:${baseMinutes}:00.000Z`);
    const durationMinutes = 70 + Math.floor(Math.random() * 35);
    const completedAt = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);

    const totalScore = s.score;
    const totalCorrect = totalScore;
    const totalWrong = 100 - totalScore;
    const percentage = totalScore;

    await prisma.testAttempt.deleteMany({
      where: { studentId: student.id }
    });

    const attempt = await prisma.testAttempt.create({
      data: {
        studentId: student.id,
        status: 'COMPLETED',
        currentModuleId: 5,
        sessionToken: crypto.randomBytes(32).toString('hex'),
        startedAt,
        completedAt,
        totalScore,
        totalAttempted: 100,
        totalCorrect,
        totalWrong,
        totalUnanswered: 0,
        percentage,
        totalWarnings: Math.random() < 0.15 ? 1 : 0
      }
    });

    let remainingCorrect = totalCorrect;
    const moduleScores = [0, 0, 0, 0, 0];
    for (let m = 0; m < 5; m++) {
      if (m === 4) {
        moduleScores[m] = remainingCorrect;
      } else {
        const targetAvg = Math.floor(remainingCorrect / (5 - m));
        const variance = Math.floor(Math.random() * 3) - 1;
        const score = Math.max(12, Math.min(20, targetAvg + variance));
        moduleScores[m] = score;
        remainingCorrect -= score;
      }
    }

    let modStartTime = new Date(startedAt.getTime());
    for (let modId = 1; modId <= 5; modId++) {
      const modScore = moduleScores[modId - 1];
      const modTimeTaken = Math.floor((durationMinutes * 60) / 5) + Math.floor(Math.random() * 60) - 30;
      const modEndTime = new Date(modStartTime.getTime() + modTimeTaken * 1000);

      await prisma.moduleAttempt.create({
        data: {
          attemptId: attempt.id,
          moduleId: modId,
          moduleTitle: moduleTitles[modId],
          status: 'SUBMITTED',
          score: modScore,
          attempted: 20,
          correct: modScore,
          wrong: 20 - modScore,
          unanswered: 0,
          startedAt: modStartTime,
          submittedAt: modEndTime,
          timeTakenSeconds: modTimeTaken
        }
      });

      if (questionBank.length > 0) {
        const moduleQuestions = questionBank.filter(q => q.moduleId === modId);
        for (let qi = 0; qi < moduleQuestions.length; qi++) {
          const q = moduleQuestions[qi];
          const isCorrect = qi < modScore;
          const selectedOption = isCorrect ? q.correctAnswer : (['A', 'B', 'C', 'D'].find(o => o !== q.correctAnswer) || 'A');

          await prisma.studentResponse.create({
            data: {
              attemptId: attempt.id,
              questionId: q.id,
              moduleId: modId,
              selectedOption,
              isCorrect,
              marksObtained: isCorrect ? 1.0 : 0.0,
              answeredAt: new Date(modStartTime.getTime() + (qi + 1) * 30 * 1000)
            }
          });
        }
      }

      modStartTime = new Date(modEndTime.getTime() + 15 * 1000);
    }
  }

  console.log(`Successfully populated ${studentsData.length} students with completed attempts and answers.`);
}
