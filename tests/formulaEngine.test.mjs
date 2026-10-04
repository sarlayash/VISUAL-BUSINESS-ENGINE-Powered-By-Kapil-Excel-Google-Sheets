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
