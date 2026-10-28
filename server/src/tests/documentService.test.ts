import { describe, it, expect } from 'vitest';
import { DocumentService } from '../services/documentService';

describe('Document Generation Service (DOCX, PDF, CSV) Verification', () => {
  it('should generate valid PDF buffer for 100-question paper', async () => {
    const buffer = await DocumentService.generateQuestionPaperPdf();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(1000);
    // PDF magic bytes: %PDF
    const header = buffer.toString('utf-8', 0, 4);
    expect(header).toBe('%PDF');
  });

  it('should generate valid DOCX buffer for 100-question paper', async () => {
    const buffer = await DocumentService.generateQuestionPaperDocx();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(1000);
    // DOCX is a zip archive starting with PK (0x50, 0x4B)
    expect(buffer[0]).toBe(0x50);
    expect(buffer[1]).toBe(0x4b);
  });

  it('should generate valid PDF and DOCX for Official Answer Key', async () => {
    const pdfBuf = await DocumentService.generateAnswerKeyPdf(1);
    expect(pdfBuf.toString('utf-8', 0, 4)).toBe('%PDF');

    const docxBuf = await DocumentService.generateAnswerKeyDocx(1);
    expect(docxBuf[0]).toBe(0x50);
    expect(docxBuf[1]).toBe(0x4b);
  });

  it('should generate valid CSV report for admin overview', () => {
    const mockAttempts = [
      {
        student: { fullName: 'Sumanth Jagadeesh', usn: '1MS21CS045', normalizedUsn: '1MS21CS045' },
        status: 'COMPLETED',
        totalScore: 92,
        percentage: 92.0,
        totalAttempted: 98,
        totalCorrect: 92,
        totalWrong: 6,
        totalUnanswered: 2,
        totalWarnings: 1,
        startedAt: new Date(),
        completedAt: new Date(),
        moduleAttempts: [
          { moduleId: 1, score: 19 },
          { moduleId: 2, score: 18 },
          { moduleId: 3, score: 20 },
          { moduleId: 4, score: 17 },
          { moduleId: 5, score: 18 }
        ]
      }
    ];

    const csv = DocumentService.generateAdminReportCsv(mockAttempts);
    expect(typeof csv).toBe('string');
    expect(csv).toContain('Student Name,USN');
    expect(csv).toContain('Sumanth Jagadeesh,1MS21CS045');
    expect(csv).toContain('92');
  });
});

