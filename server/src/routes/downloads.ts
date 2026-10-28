import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { prisma } from '../lib/prisma';
import { DocumentService } from '../services/documentService';
import {
  verifyAdminToken,
  verifyDownloadAccess,
  AuthenticatedAdminRequest,
  AuthenticatedStudentRequest
} from '../middleware/auth';

export const downloadsRouter = Router();

// ========================================================
// 0. OFFICIAL TEXTBOOK REFERENCE & DOWNLOAD
// ========================================================
downloadsRouter.get('/textbook', (req: Request, res: Response) => {
  try {
    const possiblePaths = [
      path.resolve(process.cwd(), 'textbook/BRMK557 RM&IPR Textbook.pdf'),
      path.resolve(process.cwd(), 'BRMK557 RM&IPR Textbook.pdf'),
      path.resolve(__dirname, '../../../textbook/BRMK557 RM&IPR Textbook.pdf'),
      path.resolve(__dirname, '../../../BRMK557 RM&IPR Textbook.pdf'),
      path.resolve(__dirname, '../../textbook/BRMK557 RM&IPR Textbook.pdf')
    ];

    let targetPath = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        targetPath = p;
        break;
      }
    }

    if (!targetPath) {
      return res.status(404).json({ error: 'Textbook PDF file not found on server storage.' });
    }

    const isInline = req.query.inline === 'true';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `${isInline ? 'inline' : 'attachment'}; filename="BRMK557_RM_IPR_Textbook.pdf"`
    );
    return res.sendFile(targetPath);
  } catch (error) {
    console.error('Error serving textbook file:', error);
    return res.status(500).json({ error: 'Failed to access textbook file.' });
  }
});

// ========================================================
// 1. MODULE QUESTION PAPER (PDF & DOCX) - PROTECTED
// Only accessible AFTER attending and completing the test or by Admin
// ========================================================
downloadsRouter.get('/module-paper/:moduleId/:format', verifyDownloadAccess, async (req: Request, res: Response) => {
  try {
    const moduleId = parseInt(req.params.moduleId, 10);
    const format = req.params.format.toLowerCase();

    if (isNaN(moduleId) || moduleId < 1 || moduleId > 5) {
      return res.status(400).json({ error: 'Valid moduleId between 1 and 5 is required.' });
    }

    if (format === 'pdf') {
      const buffer = await DocumentService.generateQuestionPaperPdf(moduleId);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="RM_IPR_Module_${moduleId}_Question_Paper.pdf"`);
      return res.send(buffer);
    } else if (format === 'docx') {
      const buffer = await DocumentService.generateQuestionPaperDocx(moduleId);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="RM_IPR_Module_${moduleId}_Question_Paper.docx"`);
      return res.send(buffer);
    } else {
      return res.status(400).json({ error: 'Format must be pdf or docx.' });
    }
  } catch (error) {
    console.error('Error downloading module paper:', error);
    return res.status(500).json({ error: 'Failed to generate module question paper.' });
  }
});

// ========================================================
// 2. COMPLETE 100-QUESTION EXAM PAPER (PDF & DOCX) - PROTECTED
// Only accessible AFTER attending and completing the test or by Admin
// ========================================================
downloadsRouter.get('/exam-paper/:format', verifyDownloadAccess, async (req: Request, res: Response) => {
  try {
    const format = req.params.format.toLowerCase();

    if (format === 'pdf') {
      const buffer = await DocumentService.generateQuestionPaperPdf();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="RM_IPR_BRMK557_Complete_100Q_Exam_Paper.pdf"');
      return res.send(buffer);
    } else if (format === 'docx') {
      const buffer = await DocumentService.generateQuestionPaperDocx();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename="RM_IPR_BRMK557_Complete_100Q_Exam_Paper.docx"');
      return res.send(buffer);
    } else {
      return res.status(400).json({ error: 'Format must be pdf or docx.' });
    }
  } catch (error) {
    console.error('Error downloading exam paper:', error);
    return res.status(500).json({ error: 'Failed to generate exam paper.' });
  }
});

// ========================================================
// 3. OFFICIAL ANSWER KEY & DETAILED SOLUTIONS - PROTECTED
// Only accessible AFTER attending and completing the test or by Admin
// ========================================================
downloadsRouter.get('/answer-key/:format', verifyDownloadAccess, async (req: Request, res: Response) => {
  try {
    const format = req.params.format.toLowerCase();
    const moduleId = req.query.moduleId ? parseInt(req.query.moduleId as string, 10) : undefined;

    const filePrefix = moduleId ? `RM_IPR_Module_${moduleId}_Answer_Key` : 'RM_IPR_Complete_100Q_Answer_Key_Solutions';

    if (format === 'pdf') {
      const buffer = await DocumentService.generateAnswerKeyPdf(moduleId);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filePrefix}.pdf"`);
      return res.send(buffer);
    } else if (format === 'docx') {
      const buffer = await DocumentService.generateAnswerKeyDocx(moduleId);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${filePrefix}.docx"`);
      return res.send(buffer);
    } else {
      return res.status(400).json({ error: 'Format must be pdf or docx.' });
    }
  } catch (error) {
    console.error('Error downloading answer key:', error);
    return res.status(500).json({ error: 'Failed to generate answer key.' });
  }
});

// ========================================================
// 4. STUDENT PERFORMANCE SCORECARD (PDF & DOCX)
// ========================================================
downloadsRouter.get('/scorecard/:attemptId/:format', async (req: Request, res: Response) => {
  try {
    const { attemptId, format } = req.params;

    const attempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        student: true,
        moduleAttempts: { orderBy: { moduleId: 'asc' } },
        focusEvents: { orderBy: { timestamp: 'asc' } }
      }
    });

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    const filename = `Scorecard_${attempt.student.usn}_${attempt.student.fullName.replace(/\s+/g, '_')}`;

    if (format.toLowerCase() === 'pdf') {
      const buffer = await DocumentService.generateStudentScorecardPdf(attempt);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
      return res.send(buffer);
    } else if (format.toLowerCase() === 'docx') {
      const buffer = await DocumentService.generateStudentScorecardDocx(attempt);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.docx"`);
      return res.send(buffer);
    } else {
      return res.status(400).json({ error: 'Format must be pdf or docx.' });
    }
  } catch (error) {
    console.error('Error generating student scorecard:', error);
    return res.status(500).json({ error: 'Failed to generate student scorecard.' });
  }
});

// ========================================================
// 5. CONSOLIDATED ADMIN REPORTS (CSV, PDF, DOCX) - PROTECTED
// ========================================================
downloadsRouter.get('/admin-report/:format', verifyAdminToken, async (req: AuthenticatedAdminRequest, res: Response) => {
  try {
    const format = req.params.format.toLowerCase();

    const attempts = await prisma.testAttempt.findMany({
      include: {
        student: true,
        moduleAttempts: { orderBy: { moduleId: 'asc' } }
      },
      orderBy: { totalScore: 'desc' }
    });

    const timestamp = new Date().toISOString().slice(0, 10);

    if (format === 'csv') {
      const csvData = DocumentService.generateAdminReportCsv(attempts);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="RM_IPR_Assessment_Report_${timestamp}.csv"`);
      return res.send(csvData);
    } else if (format === 'pdf') {
      const buffer = await DocumentService.generateAdminReportPdf(attempts);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="RM_IPR_Assessment_Report_${timestamp}.pdf"`);
      return res.send(buffer);
    } else if (format === 'docx') {
      const buffer = await DocumentService.generateAdminReportDocx(attempts);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="RM_IPR_Assessment_Report_${timestamp}.docx"`);
      return res.send(buffer);
    } else {
      return res.status(400).json({ error: 'Format must be csv, pdf, or docx.' });
    }
  } catch (error) {
    console.error('Error generating admin report:', error);
    return res.status(500).json({ error: 'Failed to generate administrator report.' });
  }
});
