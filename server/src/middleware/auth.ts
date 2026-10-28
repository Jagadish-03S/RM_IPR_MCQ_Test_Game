import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface AuthenticatedStudentRequest extends Request {
  student?: any;
  attempt?: any;
}

export interface AuthenticatedAdminRequest extends Request {
  admin?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'rm-ipr-secure-secret-token-key-university-2026-vtu';

export async function verifyStudentSession(
  req: AuthenticatedStudentRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization || (req.headers['x-session-token'] as string);
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing student authentication session token.' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();

    const attempt = await prisma.testAttempt.findUnique({
      where: { sessionToken: token },
      include: {
        student: true,
        moduleAttempts: {
          orderBy: { moduleId: 'asc' }
        }
      }
    });

    if (!attempt) {
      return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    }

    req.attempt = attempt;
    req.student = attempt.student;
    next();
  } catch (error) {
    console.error('Student auth error:', error);
    return res.status(500).json({ error: 'Internal error verifying student session.' });
  }
}

export async function verifyAdminToken(
  req: AuthenticatedAdminRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Admin authorization header required.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Admin account not found or access revoked.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired admin session token.' });
  }
}

/**
 * Access control for question papers, solutions, and scorecards.
 * Restricted strictly to:
 * 1. Authenticated Administrators, OR
 * 2. Authenticated Students who have completed and submitted the assessment.
 */
export async function verifyDownloadAccess(
  req: AuthenticatedStudentRequest & AuthenticatedAdminRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const rawToken =
      (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : req.headers.authorization) ||
      (req.headers['x-session-token'] as string) ||
      (req.query.token as string);

    if (!rawToken) {
      return res.status(401).json({
        error: 'Authentication required. Assessment papers and answer keys are accessible only after attending and completing the test.'
      });
    }

    const token = rawToken.trim();

    // 1. Check if token is Admin JWT
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
      if (admin) {
        req.admin = admin;
        return next();
      }
    } catch {
      // Not admin JWT, proceed to student attempt check
    }

    // 2. Check if token is Student Session Token
    const attempt = await prisma.testAttempt.findUnique({
      where: { sessionToken: token },
      include: { student: true }
    });

    if (!attempt) {
      return res.status(401).json({
        error: 'Invalid or expired assessment session.'
      });
    }

    // Candidate MUST have completed the test to download papers & solutions
    if (attempt.status !== 'COMPLETED') {
      return res.status(403).json({
        error: 'Access Restricted: You can only download question papers, official answer keys, and solutions after attending and submitting all modules of the assessment.'
      });
    }

    req.attempt = attempt;
    req.student = attempt.student;
    return next();
  } catch (error) {
    console.error('Download verification error:', error);
    return res.status(500).json({ error: 'Internal error verifying download permissions.' });
  }
}
