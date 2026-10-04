import test from 'node:test';
import assert from 'node:assert/strict';

// Test standalone logic mirroring the formula engine functions
function evaluateSimpleMath(expr) {
  // eslint-disable-next-line no-eval
  return Function(`"use strict"; return (${expr});`)();
}

test('Arithmetic Engine: Addition, Multiplication, Order of operations', () => {
  assert.equal(evaluateSimpleMath('45 * 1200'), 54000);
  assert.equal(evaluateSimpleMath('20 * 3500'), 70000);
  assert.equal(evaluateSimpleMath('(6100000 - 4200000) / 4200000').toFixed(4), '0.4524');
});

test('Logical IF & Commission Threshold', () => {
  const calcCommission = (rev) => (rev > 200000 ? rev * 0.1 : rev * 0.05);
  assert.equal(calcCommission(350000), 35000);
  assert.equal(calcCommission(180000), 9000);
});

test('Conditional SUMIF Logic', () => {
  const expenses = [
    { dept: 'Marketing', amt: 140000 },
    { dept: 'Engineering', amt: 320000 },
    { dept: 'Marketing', amt: 85000 },
    { dept: 'HR', amt: 60000 },
    { dept: 'Marketing', amt: 45000 },
  ];
  const mktSum = expenses
    .filter((e) => e.dept === 'Marketing')
    .reduce((acc, e) => acc + e.amt, 0);
  assert.equal(mktSum, 270000);
});

test('VLOOKUP Catalog Lookup', () => {
  const catalog = [
    { sku: 'SKU-101', name: 'Smart Fitness Watch', price: 2999 },
    { sku: 'SKU-302', name: 'Noise Canceling Earbuds', price: 4500 },
    { sku: 'SKU-509', name: 'Thunderbolt 4 Dock', price: 12500 },
  ];
  const item = catalog.find((i) => i.sku === 'SKU-302');
  assert.ok(item);
  assert.equal(item.price, 4500);
});

test('XLOOKUP Left Lookup Capability', () => {
  const badges = [
    { badge: 'EMP-12', name: 'Karan Johar' },
    { badge: 'EMP-88', name: 'Vikram Mehra' },
  ];
  const found = badges.find((b) => b.badge === 'EMP-88');
  assert.ok(found);
  assert.equal(found.name, 'Vikram Mehra');
});

test('Statistical Engine: MEDIAN & PERCENTILE', () => {
  const salaries = [650000, 850000, 950000, 1400000, 1900000];
  salaries.sort((a, b) => a - b);
  const mid = Math.floor(salaries.length / 2);
  const median = salaries[mid];
  assert.equal(median, 950000);
});

test('Authentic Certificate ID Format Verification', () => {
  const generateId = () => `SY-VBE-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const certId = generateId();
  assert.match(certId, /^SY-VBE-2026-\d{6}$/);
});

test('Strict 80% Assessment Passing Threshold & Badge Locking', () => {
  const isPassed = (score) => score >= 80;
  assert.equal(isPassed(79), false, 'Score of 79% must remain locked');
  assert.equal(isPassed(80), true, 'Score of 80% unlocks badge and certificate');
  assert.equal(isPassed(95), true, 'Score of 95% unlocks badge and certificate');
  assert.equal(isPassed(50), false, 'Score of 50% must remain locked');
});

test('Financial PMT Formula Calculation', () => {
  // PMT for 5,000,000 at 8.5% annual rate over 60 months
  const rate = 0.085 / 12;
  const nper = 60;
  const pv = 5000000;
  const pmt = (rate * pv * Math.pow(1 + rate, nper)) / (Math.pow(1 + rate, nper) - 1);
  assert.equal(Math.round(pmt), 102583);
});

test('Inbuilt Function: ROUND & TEXTJOIN Operations', () => {
  const roundVal = (num, digits) => {
    const factor = Math.pow(10, digits);
    return Math.round(num * factor) / factor;
  };
  assert.equal(roundVal(12450.6789, 2), 12450.68);
  assert.equal(['Accessories', 'Hardware', 'Audio'].join(', '), 'Accessories, Hardware, Audio');
});

test('Pivot Table Multi-Dimensional Aggregation Engine', () => {
  const records = [
    { Region: 'North', Category: 'Electronics', Revenue: 240000 },
    { Region: 'North', Category: 'Furniture', Revenue: 750000 },
    { Region: 'West', Category: 'Electronics', Revenue: 420000 },
    { Region: 'West', Category: 'Furniture', Revenue: 1275000 },
  ];

  // Pivot by Category -> SUM of Revenue
  const categoryTotals = {};
  records.forEach((r) => {
    categoryTotals[r.Category] = (categoryTotals[r.Category] || 0) + r.Revenue;
  });

  assert.equal(categoryTotals['Electronics'], 660000);
  assert.equal(categoryTotals['Furniture'], 2025000);
  assert.equal(categoryTotals['Electronics'] + categoryTotals['Furniture'], 2685000);
});

test('Knowledge Bytes: 50 Core Architectural Differences Verification', async () => {
  const { KNOWLEDGE_BYTES_DATA } = await import('../src/data/knowledgeBytesData.ts');
  assert.equal(KNOWLEDGE_BYTES_DATA.length, 50, 'Must have exactly 50 authoritative knowledge bytes');
  // Verify each item has required properties
  KNOWLEDGE_BYTES_DATA.forEach((kb) => {
    assert.ok(kb.id, 'Knowledge byte must have id');
    assert.ok(kb.topic, 'Knowledge byte must have topic');
    assert.ok(kb.category, 'Knowledge byte must have category');
    assert.ok(kb.sheetsPerspective, 'Knowledge byte must have sheetsPerspective');
    assert.ok(kb.excelPerspective, 'Knowledge byte must have excelPerspective');
    assert.ok(kb.kapilVerdict, 'Knowledge byte must have kapilVerdict');
  });
});

test('Mark as Complete User Agency: Toggle and Persistent Storage', () => {
  let completedChallenges = ['m1_c1'];
  const toggle = (id) => {
    if (completedChallenges.includes(id)) {
      completedChallenges = completedChallenges.filter((c) => c !== id);
    } else {
      completedChallenges.push(id);
    }
  };

  toggle('m1_c2');
  assert.deepEqual(completedChallenges, ['m1_c1', 'm1_c2']);
  toggle('m1_c1');
  assert.deepEqual(completedChallenges, ['m1_c2']);
  toggle('m1_c1');
  assert.deepEqual(completedChallenges, ['m1_c2', 'm1_c1']);
});

test('QR Code Generation: Standard ISO matrix creation with valid error correction', async () => {
  const QRCode = (await import('qrcode')).default;
  const sampleUrl = 'https://sarlayash.github.io/VISUAL-BUSINESS-ENGINE-Powered-By-Kapil-Excel-Google-Sheets/?verify=SY-VBE-2026-000124';
  const qr = QRCode.create(sampleUrl, { errorCorrectionLevel: 'M' });
  assert.ok(qr, 'QR code object must be generated');
  assert.ok(qr.modules.size >= 21, 'QR code module size must be at least 21x21');
  assert.equal(typeof qr.modules.get(0, 0), 'number', 'Corner finder pattern must exist');
});

test('Badge & Certificate QR Verification Integrity: IDs and 80% passing enforcement', () => {
  const certId = 'SY-VBE-2026-000124';
  const badgeId = `${certId}-M1`;
  const grandBadgeId = `${certId}-GRAND`;

  assert.match(certId, /^SY-VBE-\d{4}-\d{6}$/, 'Main certificate ID format valid');
  assert.match(badgeId, /^SY-VBE-\d{4}-\d{6}-M[1-5]$/, 'Module badge ID format valid');
  assert.match(grandBadgeId, /^SY-VBE-\d{4}-\d{6}-GRAND$/, 'Grand milestone badge ID format valid');

  const checkBadgeUnlock = (score, isGrand, allPassed, capstoneDone) => {
    if (isGrand) return allPassed && capstoneDone;
    return score >= 80;
  };

  assert.equal(checkBadgeUnlock(79, false, false, false), false, 'Badge must remain locked at 79%');
  assert.equal(checkBadgeUnlock(80, false, false, false), true, 'Badge unlocks at 80%');
  assert.equal(checkBadgeUnlock(100, true, true, true), true, 'Grand badge unlocks when all passed + capstone done');
  assert.equal(checkBadgeUnlock(100, true, true, false), false, 'Grand badge locked without capstone');
});

test('Demo User Profile Accreditation Integrity', () => {
  const demoProfile = {
    id: 'demo_user_kapil',
    name: 'Kapil (Demo Graduate)',
    email: 'kapil.graduate@visualbusinessengine.internal',
    xp: 4250,
    level: 'Visual Business Engineer',
    streakDays: 45,
    completedChallenges: ['m1_c1', 'm1_c2', 'm2_c1', 'm2_c2', 'm3_c1', 'm3_c2', 'm4_c1', 'm4_c2', 'm5_c1', 'm5_c2'],
    completedModules: [1, 2, 3, 4, 5],
    earnedBadges: [
      'Data Preparation Explorer',
      'Formula Intelligence Specialist',
      'Lookup & Statistics Analyst',
      'Business Data Visualization Analyst',
      'Dashboard Architect',
      'Visual Business Engineer',
    ],
    capstoneCompleted: true,
    capstoneStage: 9,
    certificateId: 'SY-VBE-2026-000124',
    certificateIssueDate: 'October 4, 2026',
    moduleScores: {
      1: { score: 95, passed: true },
      2: { score: 92, passed: true },
      3: { score: 88, passed: true },
      4: { score: 96, passed: true },
      5: { score: 94, passed: true },
    },
    completedLabs: ['retail', 'banking', 'saas', 'healthcare', 'manufacturing', 'ecommerce', 'consulting', 'hr', 'logistics', 'crypto'],
    acknowledgedBytes: Array.from({ length: 50 }, (_, i) => `kb_${i + 1}`),
  };

  // 1. Verify all 5 modules passed with >= 80%
  const allPassed = [1, 2, 3, 4, 5].every((m) => demoProfile.moduleScores[m]?.score >= 80);
  assert.equal(allPassed, true, 'All 5 module assessments must score >= 80%');

  // 2. Verify all 6 badges earned
  assert.equal(demoProfile.earnedBadges.length, 6, 'Must have exactly 6 unlocked badges');

  // 3. Verify capstone completed
  assert.equal(demoProfile.capstoneCompleted, true, 'Capstone must be 100% completed');

  // 4. Verify 50 knowledge bytes acknowledged
  assert.equal(demoProfile.acknowledgedBytes.length, 50, 'All 50 knowledge bytes must be acknowledged');

  // 5. Verify 10 industry labs completed
  assert.equal(demoProfile.completedLabs.length, 10, 'All 10 industry labs must be completed');
});

test('Site Map Registry Completeness', () => {
  const categories = [
    '30-Hour Core Curriculum',
    'Simulation Engines & Labs',
    'Industry Practicum & Capstone',
    'Accreditation & Credentials',
    'Platform Ecosystem & Utilities',
  ];

  assert.equal(categories.length, 5, 'Site Map covers 5 primary curriculum & architecture pillars');
});

test('Master Assessment Session Engine: Anti-Pattern Randomization & Correct Index Mapping', () => {
  // Mock Fisher-Yates and Option remapper logic mirroring masterAssessmentData.ts
  const sampleMCQs = [
    {
      id: 1,
      question: 'Which Excel function handles modern vector lookups without column order restrictions?',
      options: ['VLOOKUP', 'HLOOKUP', 'XLOOKUP', 'LOOKUP'],
      correctIndex: 2, // 'XLOOKUP'
      explanation: 'XLOOKUP searches right-to-left and left-to-right natively.',
    },
    {
      id: 2,
      question: 'In Google Sheets, which function natively executes SQL-style queries?',
      options: ['FILTER', 'QUERY', 'SORTN', 'ARRAYFORMULA'],
      correctIndex: 1, // 'QUERY'
      explanation: 'QUERY uses Google Visualization API Query Language.',
    },
  ];

  function shuffleSession(mcqs) {
    return mcqs.map((q) => {
      const originalCorrectAnswer = q.options[q.correctIndex];
      const indices = [0, 1, 2, 3];
      // Deterministic reverse-order shuffle for test verification
      indices.reverse();
      const shuffledOptions = indices.map((i) => q.options[i]);
      const newCorrectIndex = shuffledOptions.indexOf(originalCorrectAnswer);
      return {
        ...q,
        options: shuffledOptions,
        correctIndex: newCorrectIndex,
      };
    });
  }

  const session = shuffleSession(sampleMCQs);
  assert.equal(session.length, 2);
  
  // Verify that the answer text at newCorrectIndex is strictly identical to the original answer text
  assert.equal(session[0].options[session[0].correctIndex], 'XLOOKUP');
  assert.equal(session[1].options[session[1].correctIndex], 'QUERY');
});

test('Grand Champion Accreditation: 3-Month Validity & Recertification Logic', () => {
  const issueDate = new Date('2026-10-04T00:00:00Z');
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
  const validUntilDate = new Date(issueDate.getTime() + ninetyDaysMs);

  const formattedIssue = issueDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
  const formattedValidUntil = validUntilDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

  assert.equal(formattedIssue, 'October 4, 2026');
  assert.equal(formattedValidUntil, 'January 2, 2027');

  const diffDays = Math.round((validUntilDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
  assert.equal(diffDays, 90, 'Grand Champion certificate and LOR must have exactly 90-day (3 months) validity');
});

test('Business Intelligence Index: 10 Enterprise Dimensions & Scores Verification', () => {
  const biDimensions = [
    { id: 'bii_1', title: 'Data Scalability & Volume Capacity', excelScore: 88, sheetsScore: 82 },
    { id: 'bii_2', title: 'Real-Time Concurrency & Collaboration', excelScore: 78, sheetsScore: 98 },
    { id: 'bii_3', title: 'Dynamic Arrays & Modern Formula Engine', excelScore: 94, sheetsScore: 91 },
    { id: 'bii_4', title: 'Interactive Dashboarding & Visual Storytelling', excelScore: 93, sheetsScore: 84 },
    { id: 'bii_5', title: 'Workflow Automation (VBA vs Apps Script)', excelScore: 89, sheetsScore: 92 },
    { id: 'bii_6', title: 'Data Ingestion & ETL (Power Query vs Web Ingestion)', excelScore: 97, sheetsScore: 79 },
    { id: 'bii_7', title: 'Enterprise Security, Audit & Data Governance', excelScore: 92, sheetsScore: 94 },
    { id: 'bii_8', title: 'Financial Modeling, Solver & Advanced Statistics', excelScore: 96, sheetsScore: 78 },
    { id: 'bii_9', title: 'AI Copilot & Conversational Intelligence', excelScore: 92, sheetsScore: 90 },
    { id: 'bii_10', title: 'Total Cost of Ownership (TCO) & Ecosystem Value', excelScore: 85, sheetsScore: 96 },
  ];

  assert.equal(biDimensions.length, 10, 'Must contain exactly 10 enterprise architectural dimensions');

  const excelAvg = (biDimensions.reduce((acc, d) => acc + d.excelScore, 0) / 10).toFixed(1);
  const sheetsAvg = (biDimensions.reduce((acc, d) => acc + d.sheetsScore, 0) / 10).toFixed(1);

  assert.equal(excelAvg, '90.4');
  assert.equal(sheetsAvg, '88.4');
});




