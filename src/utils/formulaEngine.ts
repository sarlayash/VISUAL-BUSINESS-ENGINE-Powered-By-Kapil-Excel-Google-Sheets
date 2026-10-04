import { CellValue, GridData } from '../types';

// Convert Column Letter to 0-based Index (e.g. "A" -> 0, "B" -> 1, "Z" -> 25, "AA" -> 26)
export function colLetterToIndex(colStr: string): number {
  let index = 0;
  const upper = colStr.toUpperCase().replace('$', '');
  for (let i = 0; i < upper.length; i++) {
    index = index * 26 + (upper.charCodeAt(i) - 64);
  }
  return index - 1;
}

// Convert 0-based Index to Column Letter (e.g. 0 -> "A", 25 -> "Z", 26 -> "AA")
export function indexToColLetter(index: number): string {
  let temp = index + 1;
  let colLetter = '';
  while (temp > 0) {
    const rem = (temp - 1) % 26;
    colLetter = String.fromCharCode(65 + rem) + colLetter;
    temp = Math.floor((temp - 1) / 26);
  }
  return colLetter;
}

// Parse cell coordinate like "B4" or "$B$4" into { col: 1, row: 4, colStr: "B" }
export function parseCellCoord(coordStr: string): { col: number; row: number; colStr: string } | null {
  const clean = coordStr.toUpperCase().replace(/\$/g, '').trim();
  const match = clean.match(/^([A-Z]+)([0-9]+)$/);
  if (!match) return null;
  const colStr = match[1];
  const row = parseInt(match[2], 10);
  return { col: colLetterToIndex(colStr), row, colStr };
}

// Get array of cell coordinates from a range string like "A1:B3"
export function expandCellRange(rangeStr: string): string[] {
  const parts = rangeStr.split(':');
  if (parts.length === 1) return [parts[0].replace(/\$/g, '').toUpperCase().trim()];
  if (parts.length !== 2) return [];

  const start = parseCellCoord(parts[0]);
  const end = parseCellCoord(parts[1]);
  if (!start || !end) return [];

  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);
  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);

  const cells: string[] = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      cells.push(`${indexToColLetter(c)}${r}`);
    }
  }
  return cells;
}

// Helper to extract numeric values from raw or computed cell values
export function getCellNumericValue(grid: GridData, cellId: string): number | null {
  const cleanId = cellId.replace(/\$/g, '').toUpperCase().trim();
  const cell = grid[cleanId];
  if (!cell || cell.computed === null || cell.computed === undefined || cell.computed === '') return null;
  const num = typeof cell.computed === 'number' ? cell.computed : parseFloat(String(cell.computed).replace(/[$,₹% ]/g, ''));
  return isNaN(num) ? null : num;
}

// Helper to get raw or string/any value
export function getCellValue(grid: GridData, cellId: string): CellValue {
  const cleanId = cellId.replace(/\$/g, '').toUpperCase().trim();
  const cell = grid[cleanId];
  if (!cell) return null;
  return cell.computed;
}

// Main Formula Evaluator
export function evaluateFormula(formulaStr: string, grid: GridData, callingCellId?: string): { value: CellValue; error?: string } {
  if (!formulaStr.startsWith('=')) {
    // Plain literal
    const trimmed = formulaStr.trim();
    if (!isNaN(Number(trimmed)) && trimmed !== '') {
      return { value: Number(trimmed) };
    }
    if (trimmed.toUpperCase() === 'TRUE') return { value: true };
    if (trimmed.toUpperCase() === 'FALSE') return { value: false };
    return { value: trimmed };
  }

  const rawExpr = formulaStr.substring(1).trim();

  try {
    return evaluateExpression(rawExpr, grid, callingCellId);
  } catch (err: any) {
    return { value: '#ERROR!', error: err?.message || 'Formula calculation error' };
  }
}

// Expression parser & evaluator
function evaluateExpression(expr: string, grid: GridData, callingCellId?: string): { value: CellValue; error?: string } {
  const trimmed = expr.trim();
  if (!trimmed) return { value: '' };

  // Check if expression is a function call: FUNC(...)
  const funcMatch = trimmed.match(/^([A-Z0-9_]+)\s*\((.*)\)$/is);
  if (funcMatch) {
    const funcName = funcMatch[1].toUpperCase();
    const argsRaw = funcMatch[2];
    const args = splitArguments(argsRaw);
    return executeFunction(funcName, args, grid, callingCellId);
  }

  // Handle arithmetic binary operators: + - * / ^
  // We handle simple binary and arithmetic with basic precedence
  return evaluateArithmetic(trimmed, grid, callingCellId);
}

// Split function arguments by comma, respecting nested parentheses and quotes
export function splitArguments(argsStr: string): string[] {
  const args: string[] = [];
  let current = '';
  let parenDepth = 0;
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < argsStr.length; i++) {
    const char = argsStr[i];
    if ((char === '"' || char === "'") && (i === 0 || argsStr[i - 1] !== '\\')) {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
      }
      current += char;
    } else if (inQuotes) {
      current += char;
    } else if (char === '(') {
      parenDepth++;
      current += char;
    } else if (char === ')') {
      parenDepth--;
      current += char;
    } else if (char === ',' && parenDepth === 0) {
      args.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim().length > 0) {
    args.push(current.trim());
  }

  return args;
}

// Evaluate arithmetic expressions including cell references
function evaluateArithmetic(expr: string, grid: GridData, callingCellId?: string): { value: CellValue; error?: string } {
  // Replace string literals with placeholders
  const stringLiterals: string[] = [];
  let sanitised = expr.replace(/"([^"]*)"/g, (_, str) => {
    stringLiterals.push(str);
    return `__STR_${stringLiterals.length - 1}__`;
  });

  // Handle percentage sign: e.g. 10% -> 0.10
  sanitised = sanitised.replace(/([0-9.]+)\s*%/g, '($1/100)');

  // Tokenize cell references and replace with values
  // Match cell coords like A1, $B$2, C34
  const cellRefRegex = /\$?[A-Z]+\$?[0-9]+/g;
  let hasReplacedCells = false;

  const resolvedExpr = sanitised.replace(cellRefRegex, (match) => {
    hasReplacedCells = true;
    const cleanCell = match.replace(/\$/g, '').toUpperCase();
    if (callingCellId && cleanCell === callingCellId.replace(/\$/g, '').toUpperCase()) {
      throw new Error('#REF! Circular reference detected');
    }
    const val = getCellValue(grid, cleanCell);
    if (val === null || val === undefined || val === '') return '0';
    if (typeof val === 'number') return String(val);
    if (typeof val === 'boolean') return val ? '1' : '0';
    // String value
    const num = parseFloat(String(val).replace(/[$,₹% ]/g, ''));
    if (!isNaN(num)) return String(num);
    stringLiterals.push(String(val));
    return `__STR_${stringLiterals.length - 1}__`;
  });

  // If there are string placeholders and only concatenation or equality:
  if (stringLiterals.length > 0) {
    // Check for concatenation with &
    if (resolvedExpr.includes('&')) {
      const parts = resolvedExpr.split('&');
      const combined = parts.map((p) => {
        const clean = p.trim();
        const strMatch = clean.match(/^__STR_(\d+)__$/);
        if (strMatch) return stringLiterals[parseInt(strMatch[1], 10)];
        return clean.replace(/['"]/g, '');
      }).join('');
      return { value: combined };
    }
    // Simple single string
    const singleMatch = resolvedExpr.trim().match(/^__STR_(\d+)__$/);
    if (singleMatch) {
      return { value: stringLiterals[parseInt(singleMatch[1], 10)] };
    }
  }

  // Safe arithmetic evaluator
  try {
    // Security sanitization: only allow digits, operators, parentheses, decimal point
    const safeMath = resolvedExpr.replace(/[^0-9+\-*/().\s^]/g, '');
    if (!safeMath && !hasReplacedCells) return { value: expr };

    // Standard eval for safe sanitized expression
    // Replace ^ with ** for exponents
    const jsMath = safeMath.replace(/\^/g, '**');
    // eslint-disable-next-line no-eval
    const result = Function(`"use strict"; return (${jsMath});`)();
    if (typeof result === 'number' && isNaN(result)) return { value: '#VALUE!' };
    if (typeof result === 'number' && !isFinite(result)) return { value: '#DIV/0!' };
    return { value: typeof result === 'number' ? Math.round(result * 10000) / 10000 : result };
  } catch (e: any) {
    return { value: '#VALUE!', error: e?.message || 'Invalid calculation' };
  }
}

// Resolve range or cell reference into an array of values
function resolveRangeValues(arg: string, grid: GridData): CellValue[] {
  const clean = arg.trim();
  if (clean.includes(':')) {
    const cells = expandCellRange(clean);
    return cells.map((c) => getCellValue(grid, c));
  }
  // Single cell or literal
  const coord = parseCellCoord(clean);
  if (coord) {
    return [getCellValue(grid, clean)];
  }
  // Try evaluating expression
  const evalRes = evaluateExpression(clean, grid);
  return [evalRes.value];
}

// Function Implementations
function executeFunction(funcName: string, args: string[], grid: GridData, callingCellId?: string): { value: CellValue; error?: string } {
  switch (funcName) {
    // === MATHEMATICAL & BASIC AGGREGATIONS ===
    case 'SUM': {
      let sum = 0;
      for (const arg of args) {
        const values = resolveRangeValues(arg, grid);
        for (const v of values) {
          const num = typeof v === 'number' ? v : parseFloat(String(v || '').replace(/[$,₹% ]/g, ''));
          if (!isNaN(num)) sum += num;
        }
      }
      return { value: Math.round(sum * 10000) / 10000 };
    }

    case 'AVERAGE': {
      let sum = 0;
      let count = 0;
      for (const arg of args) {
        const values = resolveRangeValues(arg, grid);
        for (const v of values) {
          const num = typeof v === 'number' ? v : parseFloat(String(v || '').replace(/[$,₹% ]/g, ''));
          if (!isNaN(num)) {
            sum += num;
            count++;
          }
        }
      }
      if (count === 0) return { value: '#DIV/0!', error: 'No numeric values for AVERAGE' };
      return { value: Math.round((sum / count) * 10000) / 10000 };
    }

    case 'MIN': {
      let minVal: number | null = null;
      for (const arg of args) {
        const values = resolveRangeValues(arg, grid);
        for (const v of values) {
          const num = typeof v === 'number' ? v : parseFloat(String(v || '').replace(/[$,₹% ]/g, ''));
          if (!isNaN(num)) {
            if (minVal === null || num < minVal) minVal = num;
          }
        }
      }
      return { value: minVal === null ? 0 : minVal };
    }

    case 'MAX': {
      let maxVal: number | null = null;
      for (const arg of args) {
        const values = resolveRangeValues(arg, grid);
        for (const v of values) {
          const num = typeof v === 'number' ? v : parseFloat(String(v || '').replace(/[$,₹% ]/g, ''));
          if (!isNaN(num)) {
            if (maxVal === null || num > maxVal) maxVal = num;
          }
        }
      }
      return { value: maxVal === null ? 0 : maxVal };
    }

    case 'COUNT': {
      let count = 0;
      for (const arg of args) {
        const values = resolveRangeValues(arg, grid);
        for (const v of values) {
          const num = typeof v === 'number' ? v : parseFloat(String(v || '').replace(/[$,₹% ]/g, ''));
          if (!isNaN(num)) count++;
        }
      }
      return { value: count };
    }

    case 'COUNTA': {
      let count = 0;
      for (const arg of args) {
        const values = resolveRangeValues(arg, grid);
        for (const v of values) {
          if (v !== null && v !== undefined && String(v).trim() !== '') count++;
        }
      }
      return { value: count };
    }

    // === CONDITIONAL LOGIC ===
    case 'IF': {
      if (args.length < 2) return { value: '#ERROR!', error: 'IF requires at least condition and value_if_true' };
      const conditionRes = evaluateCondition(args[0], grid, callingCellId);
      const valIfTrue = args[1] !== undefined ? evaluateExpression(args[1], grid, callingCellId).value : true;
      const valIfFalse = args[2] !== undefined ? evaluateExpression(args[2], grid, callingCellId).value : false;
      return { value: conditionRes ? valIfTrue : valIfFalse };
    }

    case 'IFS': {
      if (args.length % 2 !== 0 && args.length < 2) return { value: '#N/A', error: 'IFS requires pairs of conditions and values' };
      for (let i = 0; i < args.length; i += 2) {
        const cond = evaluateCondition(args[i], grid, callingCellId);
        if (cond) {
          return { value: evaluateExpression(args[i + 1], grid, callingCellId).value };
        }
      }
      return { value: '#N/A', error: 'No matching IFS condition' };
    }

    case 'AND': {
      for (const arg of args) {
        if (!evaluateCondition(arg, grid, callingCellId)) return { value: false };
      }
      return { value: true };
    }

    case 'OR': {
      for (const arg of args) {
        if (evaluateCondition(arg, grid, callingCellId)) return { value: true };
      }
      return { value: false };
    }

    case 'NOT': {
      if (args.length === 0) return { value: true };
      return { value: !evaluateCondition(args[0], grid, callingCellId) };
    }

    case 'IFERROR': {
      if (args.length < 2) return { value: '#ERROR!' };
      const valRes = evaluateExpression(args[0], grid, callingCellId);
      const val = valRes.value;
      const isErr = valRes.error !== undefined || String(val).startsWith('#');
      if (isErr) {
        return { value: evaluateExpression(args[1], grid, callingCellId).value };
      }
      return { value: val };
    }

    // === CONDITIONAL AGGREGATIONS ===
    case 'COUNTIF': {
      if (args.length < 2) return { value: '#ERROR!' };
      const rangeCells = expandCellRange(args[0]);
      const criteria = evaluateExpression(args[1], grid, callingCellId).value;
      let count = 0;
      for (const cell of rangeCells) {
        const val = getCellValue(grid, cell);
        if (matchesCriteria(val, criteria)) count++;
      }
      return { value: count };
    }

    case 'COUNTIFS': {
      if (args.length < 2 || args.length % 2 !== 0) return { value: '#ERROR!' };
      const pairCount = args.length / 2;
      const rangeList: string[][] = [];
      const criteriaList: CellValue[] = [];
      for (let i = 0; i < pairCount; i++) {
        rangeList.push(expandCellRange(args[i * 2]));
        criteriaList.push(evaluateExpression(args[i * 2 + 1], grid, callingCellId).value);
      }
      const len = rangeList[0].length;
      let count = 0;
      for (let rowIdx = 0; rowIdx < len; rowIdx++) {
        let allMatch = true;
        for (let pairIdx = 0; pairIdx < pairCount; pairIdx++) {
          const cell = rangeList[pairIdx][rowIdx];
          const val = getCellValue(grid, cell);
          if (!matchesCriteria(val, criteriaList[pairIdx])) {
            allMatch = false;
            break;
          }
        }
        if (allMatch) count++;
      }
      return { value: count };
    }

    case 'SUMIF': {
      if (args.length < 2) return { value: '#ERROR!' };
      const criteriaCells = expandCellRange(args[0]);
      const criteria = evaluateExpression(args[1], grid, callingCellId).value;
      const sumCells = args[2] ? expandCellRange(args[2]) : criteriaCells;

      let sum = 0;
      for (let i = 0; i < criteriaCells.length; i++) {
        const checkVal = getCellValue(grid, criteriaCells[i]);
        if (matchesCriteria(checkVal, criteria)) {
          const sumVal = getCellNumericValue(grid, sumCells[i] || criteriaCells[i]);
          if (sumVal !== null) sum += sumVal;
        }
      }
      return { value: Math.round(sum * 10000) / 10000 };
    }

    case 'SUMIFS': {
      // SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)
      if (args.length < 3) return { value: '#ERROR!' };
      const sumCells = expandCellRange(args[0]);
      const numPairs = Math.floor((args.length - 1) / 2);
      let total = 0;

      const pairs: { cells: string[]; crit: CellValue }[] = [];
      for (let p = 0; p < numPairs; p++) {
        pairs.push({
          cells: expandCellRange(args[1 + p * 2]),
          crit: evaluateExpression(args[2 + p * 2], grid, callingCellId).value,
        });
      }

      for (let i = 0; i < sumCells.length; i++) {
        let pass = true;
        for (const pair of pairs) {
          const cell = pair.cells[i];
          const val = getCellValue(grid, cell);
          if (!matchesCriteria(val, pair.crit)) {
            pass = false;
            break;
          }
        }
        if (pass) {
          const sumVal = getCellNumericValue(grid, sumCells[i]);
          if (sumVal !== null) total += sumVal;
        }
      }
      return { value: Math.round(total * 10000) / 10000 };
    }

    case 'AVERAGEIF': {
      if (args.length < 2) return { value: '#ERROR!' };
      const criteriaCells = expandCellRange(args[0]);
      const criteria = evaluateExpression(args[1], grid, callingCellId).value;
      const avgCells = args[2] ? expandCellRange(args[2]) : criteriaCells;

      let sum = 0;
      let count = 0;
      for (let i = 0; i < criteriaCells.length; i++) {
        const checkVal = getCellValue(grid, criteriaCells[i]);
        if (matchesCriteria(checkVal, criteria)) {
          const num = getCellNumericValue(grid, avgCells[i] || criteriaCells[i]);
          if (num !== null) {
            sum += num;
            count++;
          }
        }
      }
      if (count === 0) return { value: '#DIV/0!' };
      return { value: Math.round((sum / count) * 10000) / 10000 };
    }

    case 'AVERAGEIFS': {
      if (args.length < 3) return { value: '#ERROR!' };
      const avgCells = expandCellRange(args[0]);
      const numPairs = Math.floor((args.length - 1) / 2);
      let sum = 0;
      let count = 0;

      const pairs: { cells: string[]; crit: CellValue }[] = [];
      for (let p = 0; p < numPairs; p++) {
        pairs.push({
          cells: expandCellRange(args[1 + p * 2]),
          crit: evaluateExpression(args[2 + p * 2], grid, callingCellId).value,
        });
      }

      for (let i = 0; i < avgCells.length; i++) {
        let pass = true;
        for (const pair of pairs) {
          const cell = pair.cells[i];
          const val = getCellValue(grid, cell);
          if (!matchesCriteria(val, pair.crit)) {
            pass = false;
            break;
          }
        }
        if (pass) {
          const num = getCellNumericValue(grid, avgCells[i]);
          if (num !== null) {
            sum += num;
            count++;
          }
        }
      }
      if (count === 0) return { value: '#DIV/0!' };
      return { value: Math.round((sum / count) * 10000) / 10000 };
    }

    // === ADVANCED LOOKUPS ===
    case 'VLOOKUP': {
      // VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
      if (args.length < 3) return { value: '#N/A', error: 'VLOOKUP requires at least 3 arguments' };
      const lookupVal = evaluateExpression(args[0], grid, callingCellId).value;
      const tableRange = args[1].trim();
      const parts = tableRange.split(':');
      if (parts.length !== 2) return { value: '#REF!' };

      const start = parseCellCoord(parts[0]);
      const end = parseCellCoord(parts[1]);
      if (!start || !end) return { value: '#REF!' };

      const colIdx = parseInt(String(evaluateExpression(args[2], grid, callingCellId).value), 10);
      if (isNaN(colIdx) || colIdx < 1) return { value: '#VALUE!' };

      const minCol = Math.min(start.col, end.col);
      const maxCol = Math.max(start.col, end.col);
      const minRow = Math.min(start.row, end.row);
      const maxRow = Math.max(start.row, end.row);

      if (minCol + colIdx - 1 > maxCol) return { value: '#REF!' };

      const exactMatch = args[3] !== undefined ? parseExactMatchFlag(args[3], grid, callingCellId) : true;

      // Scan rows
      for (let r = minRow; r <= maxRow; r++) {
        const firstColCell = `${indexToColLetter(minCol)}${r}`;
        const firstVal = getCellValue(grid, firstColCell);
        if (isMatchValue(firstVal, lookupVal, exactMatch)) {
          const targetCell = `${indexToColLetter(minCol + colIdx - 1)}${r}`;
          return { value: getCellValue(grid, targetCell) };
        }
      }
      return { value: '#N/A', error: `Value "${lookupVal}" not found in table` };
    }

    case 'HLOOKUP': {
      // HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])
      if (args.length < 3) return { value: '#N/A' };
      const lookupVal = evaluateExpression(args[0], grid, callingCellId).value;
      const tableRange = args[1].trim();
      const parts = tableRange.split(':');
      if (parts.length !== 2) return { value: '#REF!' };

      const start = parseCellCoord(parts[0]);
      const end = parseCellCoord(parts[1]);
      if (!start || !end) return { value: '#REF!' };

      const rowIdx = parseInt(String(evaluateExpression(args[2], grid, callingCellId).value), 10);
      const minCol = Math.min(start.col, end.col);
      const maxCol = Math.max(start.col, end.col);
      const minRow = Math.min(start.row, end.row);
      const maxRow = Math.max(start.row, end.row);

      if (minRow + rowIdx - 1 > maxRow) return { value: '#REF!' };

      for (let c = minCol; c <= maxCol; c++) {
        const firstRowCell = `${indexToColLetter(c)}${minRow}`;
        const firstVal = getCellValue(grid, firstRowCell);
        if (isMatchValue(firstVal, lookupVal, true)) {
          const targetCell = `${indexToColLetter(c)}${minRow + rowIdx - 1}`;
          return { value: getCellValue(grid, targetCell) };
        }
      }
      return { value: '#N/A' };
    }

    case 'XLOOKUP': {
      // XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode])
      if (args.length < 3) return { value: '#N/A' };
      const lookupVal = evaluateExpression(args[0], grid, callingCellId).value;
      const lookupCells = expandCellRange(args[1]);
      const returnCells = expandCellRange(args[2]);
      const ifNotFound = args[3] !== undefined ? evaluateExpression(args[3], grid, callingCellId).value : '#N/A';

      for (let i = 0; i < lookupCells.length; i++) {
        const val = getCellValue(grid, lookupCells[i]);
        if (isMatchValue(val, lookupVal, true)) {
          return { value: getCellValue(grid, returnCells[i]) };
        }
      }
      return { value: ifNotFound };
    }

    case 'MATCH': {
      // MATCH(lookup_value, lookup_array, [match_type])
      if (args.length < 2) return { value: '#N/A' };
      const lookupVal = evaluateExpression(args[0], grid, callingCellId).value;
      const cells = expandCellRange(args[1]);
      for (let i = 0; i < cells.length; i++) {
        const val = getCellValue(grid, cells[i]);
        if (isMatchValue(val, lookupVal, true)) {
          return { value: i + 1 }; // 1-based index
        }
      }
      return { value: '#N/A' };
    }

    case 'INDEX': {
      // INDEX(array, row_num, [column_num])
      if (args.length < 2) return { value: '#REF!' };
      const arrayRange = args[0].trim();
      const parts = arrayRange.split(':');
      if (parts.length !== 2) {
        // Single cell or 1D list
        return { value: getCellValue(grid, arrayRange) };
      }
      const start = parseCellCoord(parts[0]);
      const end = parseCellCoord(parts[1]);
      if (!start || !end) return { value: '#REF!' };

      const minCol = Math.min(start.col, end.col);
      const maxCol = Math.max(start.col, end.col);
      const minRow = Math.min(start.row, end.row);
      const maxRow = Math.max(start.row, end.row);

      const rowNum = parseInt(String(evaluateExpression(args[1], grid, callingCellId).value), 10);
      const colNum = args[2] !== undefined ? parseInt(String(evaluateExpression(args[2], grid, callingCellId).value), 10) : 1;

      const targetCol = minCol + colNum - 1;
      const targetRow = minRow + rowNum - 1;

      if (targetCol > maxCol || targetRow > maxRow || targetCol < minCol || targetRow < minRow) {
        return { value: '#REF!' };
      }

      const cellId = `${indexToColLetter(targetCol)}${targetRow}`;
      return { value: getCellValue(grid, cellId) };
    }

    // === ADVANCED STATISTICAL FUNCTIONS ===
    case 'MEDIAN': {
      const numbers: number[] = [];
      for (const arg of args) {
        const vals = resolveRangeValues(arg, grid);
        for (const v of vals) {
          const n = typeof v === 'number' ? v : parseFloat(String(v || '').replace(/[$,₹% ]/g, ''));
          if (!isNaN(n)) numbers.push(n);
        }
      }
      if (numbers.length === 0) return { value: '#NUM!' };
      numbers.sort((a, b) => a - b);
      const mid = Math.floor(numbers.length / 2);
      if (numbers.length % 2 !== 0) return { value: numbers[mid] };
      return { value: (numbers[mid - 1] + numbers[mid]) / 2 };
    }

    case 'MODE':
    case 'MODE.SNGL': {
      const freq: { [num: number]: number } = {};
      let maxCount = 0;
      let modeVal: number | null = null;
      for (const arg of args) {
        const vals = resolveRangeValues(arg, grid);
        for (const v of vals) {
          const n = typeof v === 'number' ? v : parseFloat(String(v || '').replace(/[$,₹% ]/g, ''));
          if (!isNaN(n)) {
            freq[n] = (freq[n] || 0) + 1;
            if (freq[n] > maxCount) {
              maxCount = freq[n];
              modeVal = n;
            }
          }
        }
      }
      if (maxCount <= 1 || modeVal === null) return { value: '#N/A' };
      return { value: modeVal };
    }

    case 'STDEV':
    case 'STDEV.S': {
      const nums: number[] = [];
      for (const arg of args) {
        const vals = resolveRangeValues(arg, grid);
        for (const v of vals) {
          const n = typeof v === 'number' ? v : parseFloat(String(v || '').replace(/[$,₹% ]/g, ''));
          if (!isNaN(n)) nums.push(n);
        }
      }
      if (nums.length <= 1) return { value: '#DIV/0!' };
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
      const variance = nums.reduce((sum, n) => sum + Math.pow(n - avg, 2), 0) / (nums.length - 1);
      return { value: Math.round(Math.sqrt(variance) * 1000) / 1000 };
    }

    case 'VAR':
    case 'VAR.S': {
      const nums: number[] = [];
      for (const arg of args) {
        const vals = resolveRangeValues(arg, grid);
        for (const v of vals) {
          const n = typeof v === 'number' ? v : parseFloat(String(v || '').replace(/[$,₹% ]/g, ''));
          if (!isNaN(n)) nums.push(n);
        }
      }
      if (nums.length <= 1) return { value: '#DIV/0!' };
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
      const variance = nums.reduce((sum, n) => sum + Math.pow(n - avg, 2), 0) / (nums.length - 1);
      return { value: Math.round(variance * 100) / 100 };
    }

    case 'LARGE': {
      if (args.length < 2) return { value: '#NUM!' };
      const k = parseInt(String(evaluateExpression(args[1], grid, callingCellId).value), 10);
      const nums: number[] = [];
      const vals = resolveRangeValues(args[0], grid);
      for (const v of vals) {
        const n = typeof v === 'number' ? v : parseFloat(String(v || '').replace(/[$,₹% ]/g, ''));
        if (!isNaN(n)) nums.push(n);
      }
      nums.sort((a, b) => b - a); // descending
      if (k < 1 || k > nums.length) return { value: '#NUM!' };
      return { value: nums[k - 1] };
    }

    case 'SMALL': {
      if (args.length < 2) return { value: '#NUM!' };
      const k = parseInt(String(evaluateExpression(args[1], grid, callingCellId).value), 10);
      const nums: number[] = [];
      const vals = resolveRangeValues(args[0], grid);
      for (const v of vals) {
        const n = typeof v === 'number' ? v : parseFloat(String(v || '').replace(/[$,₹% ]/g, ''));
        if (!isNaN(n)) nums.push(n);
      }
      nums.sort((a, b) => a - b); // ascending
      if (k < 1 || k > nums.length) return { value: '#NUM!' };
      return { value: nums[k - 1] };
    }

    case 'RANK': {
      if (args.length < 2) return { value: '#N/A!' };
      const val = parseFloat(String(evaluateExpression(args[0], grid, callingCellId).value));
      const orderDesc = args[2] ? parseInt(String(evaluateExpression(args[2], grid, callingCellId).value), 10) === 0 : true;
      const nums: number[] = [];
      const vals = resolveRangeValues(args[1], grid);
      for (const v of vals) {
        const n = typeof v === 'number' ? v : parseFloat(String(v || '').replace(/[$,₹% ]/g, ''));
        if (!isNaN(n)) nums.push(n);
      }
      if (isNaN(val)) return { value: '#N/A' };
      nums.sort((a, b) => (orderDesc ? b - a : a - b));
      const idx = nums.findIndex((n) => Math.abs(n - val) < 0.0001);
      if (idx === -1) return { value: '#N/A' };
      return { value: idx + 1 };
    }

    case 'PERCENTILE':
    case 'PERCENTILE.INC': {
      if (args.length < 2) return { value: '#NUM!' };
      const k = parseFloat(String(evaluateExpression(args[1], grid, callingCellId).value));
      if (isNaN(k) || k < 0 || k > 1) return { value: '#NUM!' };
      const nums: number[] = [];
      const vals = resolveRangeValues(args[0], grid);
      for (const v of vals) {
        const n = typeof v === 'number' ? v : parseFloat(String(v || '').replace(/[$,₹% ]/g, ''));
        if (!isNaN(n)) nums.push(n);
      }
      if (nums.length === 0) return { value: '#NUM!' };
      nums.sort((a, b) => a - b);
      const index = k * (nums.length - 1);
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      const weight = index - lower;
      return { value: Math.round((nums[lower] * (1 - weight) + nums[upper] * weight) * 100) / 100 };
    }

    // === TEXT OPERATIONS ===
    case 'TRIM': {
      if (args.length === 0) return { value: '' };
      const str = String(evaluateExpression(args[0], grid, callingCellId).value || '');
      return { value: str.trim().replace(/\s+/g, ' ') };
    }

    case 'UPPER': {
      if (args.length === 0) return { value: '' };
      return { value: String(evaluateExpression(args[0], grid, callingCellId).value || '').toUpperCase() };
    }

    case 'LOWER': {
      if (args.length === 0) return { value: '' };
      return { value: String(evaluateExpression(args[0], grid, callingCellId).value || '').toLowerCase() };
    }

    case 'PROPER': {
      if (args.length === 0) return { value: '' };
      const s = String(evaluateExpression(args[0], grid, callingCellId).value || '').toLowerCase();
      return { value: s.replace(/\b\w/g, (c) => c.toUpperCase()) };
    }

    case 'CONCATENATE':
    case 'CONCAT': {
      let result = '';
      for (const arg of args) {
        const val = evaluateExpression(arg, grid, callingCellId).value;
        result += String(val ?? '');
      }
      return { value: result };
    }

    default:
      return { value: '#NAME?', error: `Unknown function "${funcName}"` };
  }
}

// Evaluate condition helper for IF, AND, OR
function evaluateCondition(condExpr: string, grid: GridData, callingCellId?: string): boolean {
  const clean = condExpr.trim();

  // Check comparison operators: >=, <=, <>, !=, =, >, <
  const operators = ['>=', '<=', '<>', '!=', '=', '>', '<'];
  for (const op of operators) {
    const idx = clean.indexOf(op);
    if (idx !== -1) {
      const leftPart = clean.substring(0, idx).trim();
      const rightPart = clean.substring(idx + op.length).trim();

      const leftVal = evaluateExpression(leftPart, grid, callingCellId).value;
      const rightVal = evaluateExpression(rightPart, grid, callingCellId).value;

      return compareValues(leftVal, rightVal, op);
    }
  }

  // Boolean value or function like AND(..)
  const evalRes = evaluateExpression(clean, grid, callingCellId);
  return Boolean(evalRes.value);
}

function compareValues(a: CellValue, b: CellValue, op: string): boolean {
  // Normalize strings and numbers
  const aNum = typeof a === 'number' ? a : parseFloat(String(a ?? '').replace(/[$,₹% ]/g, ''));
  const bNum = typeof b === 'number' ? b : parseFloat(String(b ?? '').replace(/[$,₹% ]/g, ''));

  if (!isNaN(aNum) && !isNaN(bNum)) {
    switch (op) {
      case '>=': return aNum >= bNum;
      case '<=': return aNum <= bNum;
      case '>': return aNum > bNum;
      case '<': return aNum < bNum;
      case '=': return Math.abs(aNum - bNum) < 0.0001;
      case '<>':
      case '!=': return Math.abs(aNum - bNum) >= 0.0001;
    }
  }

  // String comparison
  const strA = String(a ?? '').toLowerCase().trim();
  const strB = String(b ?? '').toLowerCase().trim();
  switch (op) {
    case '=': return strA === strB;
    case '<>':
    case '!=': return strA !== strB;
    case '>': return strA > strB;
    case '<': return strA < strB;
    case '>=': return strA >= strB;
    case '<=': return strA <= strB;
    default: return false;
  }
}

function matchesCriteria(cellVal: CellValue, criteria: CellValue): boolean {
  if (criteria === null || criteria === undefined) return false;
  const critStr = String(criteria).trim();

  // Criteria with operator: e.g. ">500" or "<=1000" or "<>Retail"
  const opMatch = critStr.match(/^([><!=]=?|<>)(.*)$/);
  if (opMatch) {
    const op = opMatch[1];
    const target = opMatch[2].trim();
    return compareValues(cellVal, target, op);
  }

  // Exact match (case-insensitive for strings)
  return isMatchValue(cellVal, criteria, true);
}

function isMatchValue(valA: CellValue, valB: CellValue, exact: boolean): boolean {
  if (valA === valB) return true;
  if (valA === null || valB === null || valA === undefined || valB === undefined) return false;

  const aStr = String(valA).trim();
  const bStr = String(valB).trim();
  if (exact) {
    return aStr.toLowerCase() === bStr.toLowerCase();
  }
  return aStr.toLowerCase().includes(bStr.toLowerCase());
}

function parseExactMatchFlag(arg: string, grid: GridData, callingCellId?: string): boolean {
  const val = evaluateExpression(arg, grid, callingCellId).value;
  if (val === false || val === 0 || val === 'FALSE' || val === '0') return true; // in Excel, 0/FALSE means EXACT match
  return false;
}
