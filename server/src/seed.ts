import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('Seeding RM & IPR database...');

  // 1. Seed Test Configuration
  const testConfig = await prisma.testConfig.upsert({
    where: { id: 'default' },
    update: {
      testTitle: 'RM & IPR MCQ Test Game',
      marksPerCorrect: 1.0,
      negativeMarksPerWrong: 0.0,
      marksUnanswered: 0.0,
      timeLimitMinutesPerModule: 20,
      allowAnswerReview: true,
      isTestActive: true,
      maxFocusWarnings: 5,
      usnRegexPattern: '^[0-9][A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$'
    },
    create: {
      id: 'default',
      testTitle: 'RM & IPR MCQ Test Game',
      marksPerCorrect: 1.0,
      negativeMarksPerWrong: 0.0,
      marksUnanswered: 0.0,
      timeLimitMinutesPerModule: 20,
      allowAnswerReview: true,
      isTestActive: true,
      maxFocusWarnings: 5,
      usnRegexPattern: '^[0-9][A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$'
    }
  });
  console.log('Test configuration configured:', testConfig.testTitle);

  // 2. Seed Initial Admin Account
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@university.ac.in';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@RMIPR2026!';
  const adminName = process.env.ADMIN_INITIAL_NAME || 'Chief Academic Examiner';

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash: passwordHash,
      role: 'SUPER_ADMIN'
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash: passwordHash,
      role: 'SUPER_ADMIN'
    }
  });
  console.log(`Administrator account configured: ${admin.email}`);
  console.log('Database seeding successfully finished.');
}

if (process.argv[1]?.includes('seed')) {
  seedDatabase()
    .catch((e) => {
      console.error('Error seeding database:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
