import PDFDocument from 'pdfkit';
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  Packer,
  BorderStyle
} from 'docx';
import { stringify } from 'csv-stringify/sync';
import { questionService, Question } from './questionService';

export class DocumentService {
  // Helper for PDF Document stream to Buffer
  private static async generatePdf(buildDoc: (doc: PDFKit.PDFDocument) => void): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        margin: 45,
        size: 'A4',
        info: {
          Title: 'RM & IPR Academic Assessment',
          Author: 'VTU Research Methodology & Intellectual Property Rights Assessment System'
        }
      });
      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      try {
        buildDoc(doc);
        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  // ==========================================
  // 1. QUESTION PAPERS (PDF & DOCX)
  // ==========================================

  public static async generateQuestionPaperPdf(moduleId?: number): Promise<Buffer> {
    const questions = moduleId ? questionService.getQuestionsByModule(moduleId) : questionService.getAllQuestions();
    const title = moduleId
      ? questionService.getModuleTitle(moduleId).toUpperCase()
      : 'RESEARCH METHODOLOGY & IPR (BRMK557) - COMPREHENSIVE 100-MCQ EXAMINATION';

    return this.generatePdf((doc) => {
      // Header
      doc.fontSize(16).font('Helvetica-Bold').text('VISVESVARAYA TECHNOLOGICAL UNIVERSITY', { align: 'center' });
      doc.moveDown(0.2);
      doc.fontSize(12).font('Helvetica-Bold').text('DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING / ALLIED BRANCHES', { align: 'center' });
      doc.moveDown(0.2);
      doc.fontSize(13).font('Helvetica-Bold').fillColor('#0f2b5c').text(title, { align: 'center' });
      doc.fillColor('#000000');
      doc.moveDown(0.4);

      // Metadata Box
      doc.fontSize(9).font('Helvetica');
      doc.text(`Time Allowed: ${moduleId ? '20 Minutes' : '100 Minutes'} | Total Marks: ${questions.length} | Format: Multiple Choice Questions`, { align: 'center' });
      doc.moveDown(0.2);
      doc.text('Instructions: Each question has 4 options. Select the single most appropriate answer derived from the prescribed textbook.', { align: 'center' });
      doc.moveDown(0.8);
      doc.strokeColor('#cccccc').lineWidth(1).moveTo(45, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.8);

      // Questions
      questions.forEach((q, idx) => {
        // Page break safety
        if (doc.y > 700) {
          doc.addPage();
        }

        doc.fontSize(10).font('Helvetica-Bold').text(`Q${idx + 1}. [${q.chapterReference}]`);
        doc.fontSize(10).font('Helvetica').text(q.question);
        doc.moveDown(0.3);

        const options = q.options;
        doc.fontSize(9.5).font('Helvetica');
        doc.text(`    (A) ${options.A}`);
        doc.text(`    (B) ${options.B}`);
        doc.text(`    (C) ${options.C}`);
        doc.text(`    (D) ${options.D}`);
        doc.moveDown(0.6);
      });
    });
  }

  public static async generateQuestionPaperDocx(moduleId?: number): Promise<Buffer> {
    const questions = moduleId ? questionService.getQuestionsByModule(moduleId) : questionService.getAllQuestions();
    const title = moduleId
      ? questionService.getModuleTitle(moduleId).toUpperCase()
      : 'RESEARCH METHODOLOGY & IPR (BRMK557) - COMPREHENSIVE 100-MCQ EXAMINATION';

    const paragraphs: Paragraph[] = [
      new Paragraph({
        text: 'VISVESVARAYA TECHNOLOGICAL UNIVERSITY',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Time Allowed: ${moduleId ? '20 Minutes' : '100 Minutes'} | Total Questions: ${questions.length} | Max Marks: ${questions.length}`,
            italics: true
          })
        ],
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({ text: '' })
    ];

    questions.forEach((q, idx) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Q${idx + 1}. [${q.chapterReference}] `, bold: true }),
            new TextRun({ text: q.question })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `A) ${q.options.A}\n` }),
            new TextRun({ text: `B) ${q.options.B}\n` }),
            new TextRun({ text: `C) ${q.options.C}\n` }),
            new TextRun({ text: `D) ${q.options.D}` })
          ],
          indent: { left: 400 }
        }),
        new Paragraph({ text: '' })
      );
    });

    const doc = new Document({
      sections: [{ children: paragraphs }]
    });

    return Packer.toBuffer(doc);
  }

  // ==========================================
  // 2. OFFICIAL ANSWER KEY & SOLUTIONS (PDF & DOCX)
  // ==========================================

  public static async generateAnswerKeyPdf(moduleId?: number): Promise<Buffer> {
    const questions = moduleId ? questionService.getQuestionsByModule(moduleId) : questionService.getAllQuestions();
    const title = moduleId
      ? `OFFICIAL ANSWER KEY & SOLUTIONS - ${questionService.getModuleTitle(moduleId).toUpperCase()}`
      : 'RESEARCH METHODOLOGY & IPR (BRMK557) - OFFICIAL ANSWER KEY & DETAILED SOLUTIONS';

    return this.generatePdf((doc) => {
      doc.fontSize(16).font('Helvetica-Bold').text('VISVESVARAYA TECHNOLOGICAL UNIVERSITY', { align: 'center' });
      doc.moveDown(0.2);
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#0b4f6c').text(title, { align: 'center' });
      doc.fillColor('#000000');
      doc.moveDown(0.3);
      doc.fontSize(9).font('Helvetica').text('Verified against BRMK557 Textbook with Exact Citations and Page References', { align: 'center' });
      doc.moveDown(0.6);
      doc.strokeColor('#cccccc').lineWidth(1).moveTo(45, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.8);

      questions.forEach((q, idx) => {
        if (doc.y > 670) {
          doc.addPage();
        }

        doc.fontSize(10).font('Helvetica-Bold').text(`Q${idx + 1}. ${q.question}`);
        doc.moveDown(0.2);

        const correctText = q.options[q.correctAnswer];
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#006600').text(`   Correct Answer: [Option ${q.correctAnswer}] ${correctText}`);
        doc.fillColor('#000000');

        doc.fontSize(9).font('Helvetica').text(`   Reference: ${q.chapterReference} (Page ${q.pageReference})`);
        doc.fontSize(9).font('Helvetica-Oblique').text(`   Explanation: ${q.explanation}`);
        doc.moveDown(0.6);
      });
    });
  }

  public static async generateAnswerKeyDocx(moduleId?: number): Promise<Buffer> {
    const questions = moduleId ? questionService.getQuestionsByModule(moduleId) : questionService.getAllQuestions();
    const title = moduleId
      ? `OFFICIAL ANSWER KEY & SOLUTIONS - ${questionService.getModuleTitle(moduleId).toUpperCase()}`
      : 'RESEARCH METHODOLOGY & IPR (BRMK557) - OFFICIAL ANSWER KEY & DETAILED SOLUTIONS';

    const paragraphs: Paragraph[] = [
      new Paragraph({
        text: 'VISVESVARAYA TECHNOLOGICAL UNIVERSITY',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Textbook Verified Answers with Explanations and Page Citations',
            italics: true
          })
        ],
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({ text: '' })
    ];

    questions.forEach((q, idx) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Q${idx + 1}. `, bold: true }),
            new TextRun({ text: q.question })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Correct Answer: Option ${q.correctAnswer} - ${q.options[q.correctAnswer]}`,
              bold: true
            })
          ],
          indent: { left: 400 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Reference: ${q.chapterReference} (Page ${q.pageReference})\n`, italics: true }),
            new TextRun({ text: `Explanation: ${q.explanation}` })
          ],
          indent: { left: 400 }
        }),
        new Paragraph({ text: '' })
      );
    });

    const doc = new Document({
      sections: [{ children: paragraphs }]
    });

    return Packer.toBuffer(doc);
  }

  // ==========================================
  // 3. STUDENT SCORECARD / PERFORMANCE REPORT
  // ==========================================

  public static async generateStudentScorecardPdf(attemptData: any): Promise<Buffer> {
    const student = attemptData.student;
    const moduleAttempts = attemptData.moduleAttempts || [];
    const focusEvents = attemptData.focusEvents || [];

    return this.generatePdf((doc) => {
      // Header
      doc.fontSize(16).font('Helvetica-Bold').text('VISVESVARAYA TECHNOLOGICAL UNIVERSITY', { align: 'center' });
      doc.moveDown(0.2);
      doc.fontSize(13).font('Helvetica-Bold').fillColor('#0b4f6c').text('STUDENT ASSESSMENT SCORECARD & AUDIT REPORT', { align: 'center' });
      doc.fillColor('#000000');
      doc.moveDown(0.2);
      doc.fontSize(10).font('Helvetica').text('Course: Research Methodology & Intellectual Property Rights (BRMK557)', { align: 'center' });
      doc.moveDown(0.6);
      doc.strokeColor('#0b4f6c').lineWidth(1.5).moveTo(45, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.8);

      // Student Info Table
      doc.fontSize(10).font('Helvetica-Bold').text('CANDIDATE CREDENTIALS:');
      doc.fontSize(9.5).font('Helvetica');
      doc.text(`Full Name: ${student.fullName}`);
      doc.text(`University Seat Number (USN): ${student.usn}`);
      doc.text(`Attempt ID: ${attemptData.id}`);
      doc.text(`Examination Date: ${new Date(attemptData.startedAt).toLocaleString()}`);
      doc.text(`Completion Status: ${attemptData.status}`);
      doc.moveDown(0.8);

      // Performance Summary
      doc.fontSize(10).font('Helvetica-Bold').text('OVERALL PERFORMANCE METRICS:');
      doc.fontSize(9.5).font('Helvetica');
      doc.text(`Total Score: ${attemptData.totalScore} / 100.00 (${attemptData.percentage.toFixed(2)}%)`);
      doc.text(`Total Attempted: ${attemptData.totalAttempted} | Correct: ${attemptData.totalCorrect} | Incorrect: ${attemptData.totalWrong} | Unanswered: ${attemptData.totalUnanswered}`);
      doc.text(`Integrity & Focus Warnings: ${attemptData.totalWarnings} recorded event(s)`);
      doc.moveDown(0.8);

      // Module-wise Table
      doc.fontSize(10).font('Helvetica-Bold').text('MODULE-WISE BREAKDOWN:');
      doc.moveDown(0.3);

      const tableTop = doc.y;
      doc.fontSize(9).font('Helvetica-Bold');
      doc.text('Module', 45, tableTop);
      doc.text('Title', 100, tableTop);
      doc.text('Attempted', 310, tableTop);
      doc.text('Correct', 375, tableTop);
      doc.text('Wrong', 430, tableTop);
      doc.text('Score', 485, tableTop);

      doc.strokeColor('#aaaaaa').lineWidth(0.5).moveTo(45, tableTop + 14).lineTo(550, tableTop + 14).stroke();

      let currentY = tableTop + 20;
      doc.font('Helvetica');
      for (const m of moduleAttempts) {
        doc.text(`Module ${m.moduleId}`, 45, currentY);
        doc.text(m.moduleTitle.substring(0, 32), 100, currentY);
        doc.text(`${m.attempted}/20`, 310, currentY);
        doc.text(`${m.correct}`, 375, currentY);
        doc.text(`${m.wrong}`, 430, currentY);
        doc.text(`${m.score}/20`, 485, currentY);
        currentY += 18;
      }

      doc.strokeColor('#aaaaaa').lineWidth(0.5).moveTo(45, currentY + 2).lineTo(550, currentY + 2).stroke();
      doc.y = currentY + 15;

      // Integrity Monitoring Section
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold').text('BROWSER INTEGRITY & FOCUS AUDIT TRAIL:');
      if (focusEvents.length === 0) {
        doc.fontSize(9).font('Helvetica').text('No tab-switch or window blur anomalies detected during the assessment.');
      } else {
        doc.fontSize(8.5).font('Helvetica');
        focusEvents.forEach((ev: any, idx: number) => {
          doc.text(`[${idx + 1}] Timestamp: ${new Date(ev.timestamp).toLocaleTimeString()} | Module: ${ev.moduleId} | Event: ${ev.eventType} | Away Duration: ${(ev.durationAwayMs / 1000).toFixed(1)}s`);
        });
      }

      doc.moveDown(1.5);
      doc.fontSize(8.5).font('Helvetica-Oblique').text('Note: This document is computer-generated by the RM & IPR MCQ Test Assessment Engine and represents a formal academic transcript record.', { align: 'center' });
    });
  }

  public static async generateStudentScorecardDocx(attemptData: any): Promise<Buffer> {
    const student = attemptData.student;
    const moduleAttempts = attemptData.moduleAttempts || [];

    const rows: TableRow[] = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Module', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Module Title', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Attempted', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Correct', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Wrong', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Score', bold: true })] })] })
        ]
      })
    ];

    moduleAttempts.forEach((m: any) => {
      rows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(`Module ${m.moduleId}`)] }),
            new TableCell({ children: [new Paragraph(m.moduleTitle)] }),
            new TableCell({ children: [new Paragraph(`${m.attempted}/20`)] }),
            new TableCell({ children: [new Paragraph(`${m.correct}`)] }),
            new TableCell({ children: [new Paragraph(`${m.wrong}`)] }),
            new TableCell({ children: [new Paragraph(`${m.score}/20`)] })
          ]
        })
      );
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'VISVESVARAYA TECHNOLOGICAL UNIVERSITY',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER
            }),
            new Paragraph({
              text: 'STUDENT SCORECARD & PERFORMANCE TRANSCRIPT',
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER
            }),
            new Paragraph({
              text: `Candidate Name: ${student.fullName} | USN: ${student.usn}`
            }),
            new Paragraph({
              text: `Total Score: ${attemptData.totalScore} / 100 (${attemptData.percentage.toFixed(2)}%) | Integrity Warnings: ${attemptData.totalWarnings}`
            }),
            new Paragraph({
              text: `Attempt Date: ${new Date(attemptData.startedAt).toLocaleString()} | Status: ${attemptData.status}`
            }),
            new Paragraph({ text: '' }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows
            })
          ]
        }
      ]
    });

    return Packer.toBuffer(doc);
  }

  // ==========================================
  // 4. CONSOLIDATED ADMIN REPORTS (CSV, PDF, DOCX)
  // ==========================================

  public static generateAdminReportCsv(attempts: any[]): string {
    const data = attempts.map((att, idx) => {
      const mod1 = att.moduleAttempts?.find((m: any) => m.moduleId === 1)?.score ?? 0;
      const mod2 = att.moduleAttempts?.find((m: any) => m.moduleId === 2)?.score ?? 0;
      const mod3 = att.moduleAttempts?.find((m: any) => m.moduleId === 3)?.score ?? 0;
      const mod4 = att.moduleAttempts?.find((m: any) => m.moduleId === 4)?.score ?? 0;
      const mod5 = att.moduleAttempts?.find((m: any) => m.moduleId === 5)?.score ?? 0;

      return {
        Rank: idx + 1,
        'Student Name': att.student.fullName,
        USN: att.student.usn,
        'Normalized USN': att.student.normalizedUsn,
        Status: att.status,
        'Module 1 Score': mod1,
        'Module 2 Score': mod2,
        'Module 3 Score': mod3,
        'Module 4 Score': mod4,
        'Module 5 Score': mod5,
        'Total Score (/100)': att.totalScore,
        'Percentage (%)': att.percentage.toFixed(2),
        Attempted: att.totalAttempted,
        Correct: att.totalCorrect,
        Wrong: att.totalWrong,
        Unanswered: att.totalUnanswered,
        'Focus Warnings': att.totalWarnings,
        'Started At': new Date(att.startedAt).toISOString(),
        'Completed At': att.completedAt ? new Date(att.completedAt).toISOString() : 'N/A'
      };
    });

    return stringify(data, { header: true });
  }

  public static async generateAdminReportPdf(attempts: any[]): Promise<Buffer> {
    return this.generatePdf((doc) => {
      doc.fontSize(15).font('Helvetica-Bold').text('VISVESVARAYA TECHNOLOGICAL UNIVERSITY', { align: 'center' });
      doc.moveDown(0.2);
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#0b4f6c').text('CONSOLIDATED STUDENT PERFORMANCE & INTEGRITY REPORT', { align: 'center' });
      doc.fillColor('#000000');
      doc.moveDown(0.2);
      doc.fontSize(9).font('Helvetica').text(`Generated on ${new Date().toLocaleString()} | Total Candidates: ${attempts.length}`, { align: 'center' });
      doc.moveDown(0.6);
      doc.strokeColor('#cccccc').lineWidth(1).moveTo(45, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.6);

      // Table Header
      const tableTop = doc.y;
      doc.fontSize(8.5).font('Helvetica-Bold');
      doc.text('Rank', 45, tableTop);
      doc.text('Candidate Name', 75, tableTop);
      doc.text('USN', 185, tableTop);
      doc.text('M1', 255, tableTop);
      doc.text('M2', 280, tableTop);
      doc.text('M3', 305, tableTop);
      doc.text('M4', 330, tableTop);
      doc.text('M5', 355, tableTop);
      doc.text('Total', 385, tableTop);
      doc.text('%', 425, tableTop);
      doc.text('Warn', 465, tableTop);
      doc.text('Status', 500, tableTop);

      doc.strokeColor('#999999').lineWidth(0.5).moveTo(45, tableTop + 12).lineTo(550, tableTop + 12).stroke();

      let currentY = tableTop + 16;
      doc.font('Helvetica').fontSize(8);

      attempts.forEach((att, idx) => {
        if (currentY > 740) {
          doc.addPage();
          currentY = 50;
        }

        const mod1 = att.moduleAttempts?.find((m: any) => m.moduleId === 1)?.score ?? 0;
        const mod2 = att.moduleAttempts?.find((m: any) => m.moduleId === 2)?.score ?? 0;
        const mod3 = att.moduleAttempts?.find((m: any) => m.moduleId === 3)?.score ?? 0;
        const mod4 = att.moduleAttempts?.find((m: any) => m.moduleId === 4)?.score ?? 0;
        const mod5 = att.moduleAttempts?.find((m: any) => m.moduleId === 5)?.score ?? 0;

        doc.text(`${idx + 1}`, 45, currentY);
        doc.text(att.student.fullName.substring(0, 18), 75, currentY);
        doc.text(att.student.usn, 185, currentY);
        doc.text(`${mod1}`, 255, currentY);
        doc.text(`${mod2}`, 280, currentY);
        doc.text(`${mod3}`, 305, currentY);
        doc.text(`${mod4}`, 330, currentY);
        doc.text(`${mod5}`, 355, currentY);
        doc.text(`${att.totalScore}`, 385, currentY);
        doc.text(`${att.percentage.toFixed(1)}%`, 425, currentY);
        doc.text(`${att.totalWarnings}`, 465, currentY);
        doc.text(att.status === 'COMPLETED' ? 'Done' : 'Prog', 500, currentY);

        currentY += 15;
      });
    });
  }

  public static async generateAdminReportDocx(attempts: any[]): Promise<Buffer> {
    const rows: TableRow[] = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Rank', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Candidate Name', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'USN', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Total (/100)', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Percentage', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Warnings', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Status', bold: true })] })] })
        ]
      })
    ];

    attempts.forEach((att, idx) => {
      rows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(`${idx + 1}`)] }),
            new TableCell({ children: [new Paragraph(att.student.fullName)] }),
            new TableCell({ children: [new Paragraph(att.student.usn)] }),
            new TableCell({ children: [new Paragraph(`${att.totalScore}`)] }),
            new TableCell({ children: [new Paragraph(`${att.percentage.toFixed(2)}%`)] }),
            new TableCell({ children: [new Paragraph(`${att.totalWarnings}`)] }),
            new TableCell({ children: [new Paragraph(att.status)] })
          ]
        })
      );
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'VISVESVARAYA TECHNOLOGICAL UNIVERSITY',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER
            }),
            new Paragraph({
              text: 'CONSOLIDATED STUDENT ASSESSMENT AUDIT REPORT',
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER
            }),
            new Paragraph({
              text: `Total Candidates: ${attempts.length} | Generated: ${new Date().toLocaleString()}`,
              alignment: AlignmentType.CENTER
            }),
            new Paragraph({ text: '' }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows
            })
          ]
        }
      ]
    });

    return Packer.toBuffer(doc);
  }
}
