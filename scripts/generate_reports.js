const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const servicePath = path.resolve(__dirname, '../server/dist/services/documentService.js');
const { DocumentService } = require(servicePath);

const prisma = new PrismaClient();

async function generate() {
  const attempts = await prisma.testAttempt.findMany({
    include: {
      student: true,
      moduleAttempts: { orderBy: { moduleId: 'asc' } }
    },
    orderBy: { totalScore: 'desc' }
  });
  console.log(`Generating reports for ${attempts.length} students...`);
  
  if (!fs.existsSync('reports')) fs.mkdirSync('reports');

  const csv = DocumentService.generateAdminReportCsv(attempts);
  fs.writeFileSync('reports/RM_IPR_Assessment_Report.csv', csv);
  console.log('Saved reports/RM_IPR_Assessment_Report.csv, size:', csv.length);

  const docx = await DocumentService.generateAdminReportDocx(attempts);
  fs.writeFileSync('reports/RM_IPR_Assessment_Report.docx', docx);
  console.log('Saved reports/RM_IPR_Assessment_Report.docx, size:', docx.length);

  const pdf = await DocumentService.generateAdminReportPdf(attempts);
  fs.writeFileSync('reports/RM_IPR_Assessment_Report.pdf', pdf);
  console.log('Saved reports/RM_IPR_Assessment_Report.pdf, size:', pdf.length);

  // Also copy to Downloads folder so user has instant direct access to the files!
  const downloadsPath = 'C:/Users/sjaga/Downloads';
  if (fs.existsSync(downloadsPath)) {
    fs.writeFileSync(path.join(downloadsPath, 'RM_IPR_Assessment_Report_All_Students.csv'), csv);
    fs.writeFileSync(path.join(downloadsPath, 'RM_IPR_Assessment_Report_All_Students.docx'), docx);
    fs.writeFileSync(path.join(downloadsPath, 'RM_IPR_Assessment_Report_All_Students.pdf'), pdf);
    console.log('Successfully copied all 3 reports directly to Downloads folder!');
  }
}

generate()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
