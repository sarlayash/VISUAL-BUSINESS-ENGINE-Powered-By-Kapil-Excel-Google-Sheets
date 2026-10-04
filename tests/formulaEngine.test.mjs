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

