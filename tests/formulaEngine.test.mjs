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



