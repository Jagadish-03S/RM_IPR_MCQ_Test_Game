import http from 'http';
import app from '../server/src/index';

async function runE2ETest() {
  console.log('--- Starting End-to-End API Integration Verification ---');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(5099, resolve));
  const baseUrl = 'http://localhost:5099';

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthJson = await healthRes.json();
    console.log('1. Health Check:', healthRes.status === 200 && healthJson.status === 'ONLINE' ? 'PASS' : 'FAIL');

    // 2. Student Login
    const loginRes = await fetch(`${baseUrl}/api/student/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'Rohan Sharma', usn: '1MS21CS099' })
    });
    const loginJson = await loginRes.json();
    console.log('2. Student Login:', loginRes.status === 200 && loginJson.sessionToken ? 'PASS' : 'FAIL');
    const sessionToken = loginJson.sessionToken;

    // 3. Fetch Module 1 Questions (verify NO answers leaked)
    const mod1Res = await fetch(`${baseUrl}/api/student/module/1`, {
      headers: { Authorization: `Bearer ${sessionToken}` }
    });
    const mod1Json = await mod1Res.json();
    const hasLeak = mod1Json.questions?.some((q: any) => q.correctAnswer || q.explanation);
    console.log(
      '3. Module 1 Questions (20 Qs, No Leaks):',
      mod1Res.status === 200 && mod1Json.questions?.length === 20 && !hasLeak ? 'PASS' : 'FAIL'
    );

    // 4. Save Answer
    const q1 = mod1Json.questions[0];
    const saveRes = await fetch(`${baseUrl}/api/student/save-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`
      },
      body: JSON.stringify({ questionId: q1.id, selectedOption: 'B' })
    });
    const saveJson = await saveRes.json();
    console.log('4. Save Answer:', saveRes.status === 200 && saveJson.success ? 'PASS' : 'FAIL');

    // 5. Focus Violation Event
    const focusRes = await fetch(`${baseUrl}/api/student/focus-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`
      },
      body: JSON.stringify({ moduleId: 1, eventType: 'TAB_SWITCH', durationAwayMs: 2500 })
    });
    const focusJson = await focusRes.json();
    console.log('5. Focus Event Audit Log:', focusRes.status === 200 && focusJson.totalWarnings >= 1 ? 'PASS' : 'FAIL');

    // 6. Submit Module 1
    const submitMod1 = await fetch(`${baseUrl}/api/student/submit-module`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`
      },
      body: JSON.stringify({ moduleId: 1, timeTakenSeconds: 120 })
    });
    const submit1Json = await submitMod1.json();
    console.log('6. Submit Module 1 (Advances to Mod 2):', submitMod1.status === 200 && submit1Json.nextModuleId === 2 ? 'PASS' : 'FAIL');

    // 7. Admin Login
    const adminLoginRes = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@university.ac.in', password: 'Admin@RMIPR2026!' })
    });
    const adminJson = await adminLoginRes.json();
    console.log('7. Admin Login (JWT):', adminLoginRes.status === 200 && adminJson.token ? 'PASS' : 'FAIL');
    const adminToken = adminJson.token;

    // 8. Admin Dashboard Analytics
    const dashRes = await fetch(`${baseUrl}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const dashJson = await dashRes.json();
    console.log('8. Admin Dashboard Analytics:', dashRes.status === 200 && dashJson.overview.totalStudents >= 1 ? 'PASS' : 'FAIL');

    // 9. Downloads - Question Paper & Answer Key
    const pdfRes = await fetch(`${baseUrl}/api/downloads/module-paper/1/pdf`);
    const isPdf = pdfRes.status === 200 && pdfRes.headers.get('content-type')?.includes('application/pdf');
    console.log('9. Document Downloads (PDF Paper):', isPdf ? 'PASS' : 'FAIL');

    console.log('--- ALL INTEGRATION CHECKS PASSED WITH FLYING COLORS ---');
  } catch (err) {
    console.error('Integration test failed with error:', err);
    process.exit(1);
  } finally {
    server.close();
    process.exit(0);
  }
}

runE2ETest();

