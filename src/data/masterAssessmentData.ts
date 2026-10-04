import { AssessmentQuestion, AssessmentExercise } from '../types';

// =========================================================================
// 100 MASTER ASSESSMENT MCQS (Covering Core to Advanced Enterprise Excel & Google Sheets)
// =========================================================================
export const MASTER_ASSESSMENT_MCQS: AssessmentQuestion[] = [
  // --- Data Cleaning, Types & Core Foundations (Questions 1 - 15) ---
  {
    id: 'm_q1',
    scenario: 'An ERP database dump contains customer names with accidental leading, trailing, and multiple consecutive inner spaces.',
    question: 'Which function strips all leading and trailing spaces and normalizes multiple inner spaces to a single space in both Excel and Google Sheets?',
    options: ['CLEAN()', 'TRIM()', 'STRIP()', 'COMPACT()'],
    correctIndex: 1,
    explanation: 'TRIM() removes all leading and trailing spaces and condenses consecutive inner spaces to a single space. CLEAN() only removes non-printable characters (ASCII 0-31).'
  },
  {
    id: 'm_q2',
    scenario: 'A transaction ledger imported from a legacy mainframe has text strings formatted like "INV-2026-9842". You need only the 4-digit numeric invoice serial.',
    question: 'Which formula correctly extracts "9842" from cell A2?',
    options: ['=LEFT(A2, 4)', '=MID(A2, 10, 4)', '=RIGHT(A2, 4)', '=SUBSTITUTE(A2, "INV", "")'],
    correctIndex: 2,
    explanation: 'RIGHT(A2, 4) extracts the last 4 characters from the right of the text string.'
  },
  {
    id: 'm_q3',
    scenario: 'A dataset has employee full names in Column A like "Sundar Pichai". You want to extract the first name dynamically regardless of length.',
    question: 'Which formula dynamically extracts everything before the first space in cell A2?',
    options: [
      '=LEFT(A2, FIND(" ", A2) - 1)',
      '=RIGHT(A2, LEN(A2) - FIND(" ", A2))',
      '=MID(A2, 1, 6)',
      '=SPLIT(A2, " ")[1]'
    ],
    correctIndex: 0,
    explanation: '=LEFT(A2, FIND(" ", A2) - 1) dynamically finds the index of the first space and slices characters up to that index.'
  },
  {
    id: 'm_q4',
    scenario: 'You are auditing a column of transaction values. Cell C5 displays "2500" aligned to the left, and =ISNUMBER(C5) returns FALSE.',
    question: 'Which function or technique converts this text-stored number into a true numeric value recognized by mathematical functions?',
    options: ['=VALUE(C5)', '=TEXT(C5, "0")', '=TYPE(C5)', '=FORMAT(C5)'],
    correctIndex: 0,
    explanation: 'VALUE(C5) parses numbers stored as text into real numeric floats. Alternatively, multiplying by 1 or using double unary (--C5) achieves the same result.'
  },
  {
    id: 'm_q5',
    scenario: 'An inventory report contains SKU codes in mixed casing such as "macBOOK-pro". Standard operating procedure requires proper title case.',
    question: 'Which function formats text so the initial letter of every word is uppercase and all remaining letters are lowercase?',
    options: ['=UPPER()', '=CAPITAL()', '=PROPER()', '=TITLECASE()'],
    correctIndex: 2,
    explanation: 'PROPER() capitalizes the first character of each word and converts all other letters to lowercase.'
  },
  {
    id: 'm_q6',
    scenario: 'You are combining First Name in A2 and Last Name in B2 into a single string with a space separator.',
    question: 'Which of the following is NOT a valid method to concatenate A2 and B2 with a space in modern spreadsheets?',
    options: ['=A2 & " " & B2', '=CONCATENATE(A2, " ", B2)', '=TEXTJOIN(" ", TRUE, A2, B2)', '=MERGE(A2, " ", B2)'],
    correctIndex: 3,
    explanation: 'MERGE is not a spreadsheet formula; it is a cell formatting command. The ampersand (&), CONCATENATE, and TEXTJOIN are valid.'
  },
  {
    id: 'm_q7',
    scenario: 'You are designing an enterprise model where Column B is locked, but the row number must increment when dragged downwards.',
    question: 'Which cell reference style represents mixed referencing locking Column B while leaving Row 2 relative?',
    options: ['B2', '$B$2', '$B2', 'B$2'],
    correctIndex: 2,
    explanation: '$B2 locks column B with the absolute anchor ($) while keeping the row coordinate relative without an anchor.'
  },
  {
    id: 'm_q8',
    scenario: 'You need to know how many transactions in Column D contain numeric values, ignoring text notes and blank rows.',
    question: 'Which function strictly counts cells containing numeric values and ignores text entries?',
    options: ['COUNTA()', 'COUNT()', 'COUNTBLANK()', 'COUNTIF()'],
    correctIndex: 1,
    explanation: 'COUNT() strictly tallies cells containing numbers, whereas COUNTA() counts all non-blank cells including text and booleans.'
  },
  {
    id: 'm_q9',
    scenario: 'An auditor needs to verify all formulas on a sheet without clicking on each individual cell.',
    question: 'What is the universal keyboard shortcut in Excel to toggle Formula View on and off?',
    options: ['Ctrl + F', 'Ctrl + ~ (Tilde)', 'Alt + F11', 'Shift + F9'],
    correctIndex: 1,
    explanation: 'Ctrl + ~ (tilde) toggles displaying cell formulas instead of evaluated numerical results across the entire worksheet.'
  },
  {
    id: 'm_q10',
    scenario: 'A financial model contains #DIV/0! errors because some early-stage product categories currently have zero units sold.',
    question: 'Which modern error handling function returns a graceful fallback value like 0 or "N/A" if a formula produces an error?',
    options: ['IFERROR()', 'ISERROR()', 'ERROR.TYPE()', 'CATCH()'],
    correctIndex: 0,
    explanation: 'IFERROR(value, value_if_error) evaluates an expression and returns an alternate specified value if any error is encountered.'
  },
  {
    id: 'm_q11',
    scenario: 'You need to round financial currency figures to the nearest 2 decimal places to eliminate floating-point rounding artifacts.',
    question: 'Which formula rounds cell A1 to exactly two decimal places using standard mathematical rounding rules?',
    options: ['=ROUND(A1, 2)', '=TRUNC(A1, 2)', '=ROUNDUP(A1, 2)', '=FIXED(A1, 2, TRUE)'],
    correctIndex: 0,
    explanation: 'ROUND(A1, 2) mathematically rounds to 2 decimal places (0.005 rounds up, 0.004 rounds down).'
  },
  {
    id: 'm_q12',
    scenario: 'A date in cell A1 is "2026-10-04". You need to extract just the month as an integer between 1 and 12.',
    question: 'Which function extracts the calendar month number from a valid serial date?',
    options: ['=MONTH(A1)', '=DATEVALUE(A1)', '=TEXT(A1, "MM")', '=EXTRACT(A1, "month")'],
    correctIndex: 0,
    explanation: 'MONTH(A1) returns the integer month (1 to 12) from an underlying spreadsheet serial date.'
  },
  {
    id: 'm_q13',
    scenario: 'You want to calculate the exact number of days between an invoice due date in B2 and today’s live date.',
    question: 'Which function returns the current system date without a time component and updates dynamically upon sheet recalculation?',
    options: ['=NOW()', '=TODAY()', '=DATE()', '=CURRENTDATE()'],
    correctIndex: 1,
    explanation: '=TODAY() returns the volatile current date without a timestamp, whereas NOW() includes both date and exact time.'
  },
  {
    id: 'm_q14',
    scenario: 'In Google Sheets, you want to split a comma-separated list in cell A1 ("Apple, Banana, Mango") into separate columns.',
    question: 'Which native Google Sheets function splits strings across columns by a specified delimiter?',
    options: ['=SPLIT(A1, ", ")', '=TEXTSPLIT(A1, ", ")', '=DIVIDE(A1, ", ")', '=UNPIVOT(A1, ", ")'],
    correctIndex: 0,
    explanation: 'SPLIT() is Google Sheets’ native array function for breaking strings into multiple columns by delimiter. (Excel uses TEXTSPLIT).'
  },
  {
    id: 'm_q15',
    scenario: 'A logistics report has blank cells representing unfulfilled delivery status. You need to count how many deliveries are still unfulfilled.',
    question: 'Which function specifically counts empty blank cells within a defined range C2:C100?',
    options: ['=COUNT(C2:C100)', '=COUNTBLANK(C2:C100)', '=COUNTA(C2:C100)', '=ISBLANK(C2:C100)'],
    correctIndex: 1,
    explanation: 'COUNTBLANK(range) tallies empty cells within the specified range.'
  },

  // --- Logic, Conditionals & Multi-Criteria Models (Questions 16 - 35) ---
  {
    id: 'm_q16',
    scenario: 'A sales commission policy states: Reps who sell over $100,000 receive an 8% commission; reps selling $100,000 or less receive 3%.',
    question: 'If sales volume is in cell B2, which formula accurately computes the commission dollar payout?',
    options: [
      '=IF(B2 > 100000, B2 * 0.08, B2 * 0.03)',
      '=IF(B2 >= 100000, B2 * 0.03, B2 * 0.08)',
      '=B2 * IF(B2 > 100000, 0.03, 0.08)',
      '=SWITCH(B2, 100000, 0.08, 0.03)'
    ],
    correctIndex: 0,
    explanation: '=IF(B2 > 100000, B2 * 0.08, B2 * 0.03) returns 8% when B2 exceeds 100,000, and 3% otherwise.'
  },
  {
    id: 'm_q17',
    scenario: 'A candidate qualifies for an executive bonus only if BOTH Revenue exceeds $500,000 AND Customer Satisfaction (CSAT) score is 90 or higher.',
    question: 'Which logical structure validates that both conditions are simultaneously met?',
    options: [
      '=AND(Revenue > 500000, CSAT >= 90)',
      '=OR(Revenue > 500000, CSAT >= 90)',
      '=IF(Revenue > 500000 + CSAT >= 90)',
      '=BOTH(Revenue > 500000, CSAT >= 90)'
    ],
    correctIndex: 0,
    explanation: 'AND(condition1, condition2) returns TRUE only if all evaluated conditions are TRUE.'
  },
  {
    id: 'm_q18',
    scenario: 'A credit approval rule grants pre-approval if EITHER credit score is at least 750 OR annual household income exceeds $120,000.',
    question: 'Which logical function returns TRUE if at least one of these two conditions is satisfied?',
    options: ['AND()', 'OR()', 'XOR()', 'NOT()'],
    correctIndex: 1,
    explanation: 'OR() returns TRUE if one or more evaluated conditions evaluate to TRUE.'
  },
  {
    id: 'm_q19',
    scenario: 'You want to sum total revenue in Column D, but only for orders where Region in Column B is "North".',
    question: 'Which function computes a conditional sum based on a single criterion?',
    options: ['SUMIF()', 'SUMIFS()', 'DSUM()', 'All of the above can perform this sum'],
    correctIndex: 3,
    explanation: 'All of these functions can perform conditional summation, though SUMIF / SUMIFS are the modern standard practices.'
  },
  {
    id: 'm_q20',
    scenario: 'In Excel, you need to sum Sales in Column D where Region is "West" (Col B) AND Category is "Electronics" (Col C).',
    question: 'What is the correct argument syntax order for the SUMIFS() function?',
    options: [
      '=SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2)',
      '=SUMIFS(criteria_range1, criteria1, sum_range, criteria_range2, criteria2)',
      '=SUMIFS(criteria1, criteria_range1, criteria2, criteria_range2, sum_range)',
      '=SUMIFS(sum_range, criteria1, criteria_range1, criteria2, criteria_range2)'
    ],
    correctIndex: 0,
    explanation: 'SUMIFS begins with the sum_range first, followed by pairs of (criteria_range, criteria).'
  },
  {
    id: 'm_q21',
    scenario: 'You need to calculate average deal size in Column E where Quarter is "Q3" and Salesperson is "Kapil".',
    question: 'Which multi-criteria statistical function performs this calculation?',
    options: ['AVERAGEIF()', 'AVERAGEIFS()', 'DAVERAGE()', 'MEDIANIF()'],
    correctIndex: 1,
    explanation: 'AVERAGEIFS(average_range, criteria_range1, criteria1, criteria_range2, criteria2) averages cells that meet all conditions.'
  },
  {
    id: 'm_q22',
    scenario: 'An operations manager wants to count how many orders had a shipping duration greater than 5 days in Column F.',
    question: 'Which formula correctly counts orders exceeding 5 days?',
    options: [
      '=COUNTIF(F2:F100, ">5")',
      '=COUNTIF(F2:F100, >5)',
      '=COUNTIF(F2:F100, ">=5")',
      '=COUNTIFS(F2:F100 > 5)'
    ],
    correctIndex: 0,
    explanation: 'Comparison operators in COUNTIF / SUMIF must be passed as strings enclosed in double quotes: ">5".'
  },
  {
    id: 'm_q23',
    scenario: 'You have a customer tier code in cell A2: "G" for Gold, "S" for Silver, "B" for Bronze, and any other letter for Standard.',
    question: 'Which modern spreadsheet function cleanly handles multiple discrete exact matches without deeply nested IF statements?',
    options: ['SWITCH()', 'LOOKUP()', 'CHOOSE()', 'MATCH()'],
    correctIndex: 0,
    explanation: 'SWITCH(A2, "G", "Gold", "S", "Silver", "B", "Bronze", "Standard") cleanly evaluates an expression against a list of value matches.'
  },
  {
    id: 'm_q24',
    scenario: 'A grade assignment model assigns "A" for score >= 90, "B" for score >= 80, "C" for score >= 70, and "F" otherwise.',
    question: 'Which function evaluates multiple sequential conditions and returns the value corresponding to the first TRUE condition?',
    options: ['IFS()', 'SWITCH()', 'CASE()', 'COND()'],
    correctIndex: 0,
    explanation: 'IFS(score>=90, "A", score>=80, "B", score>=70, "C", TRUE, "F") tests multiple boolean conditions sequentially.'
  },
  {
    id: 'm_q25',
    scenario: 'You want to check if cell A1 is between 10 and 50 inclusive.',
    question: 'Which formula correctly tests this boundary condition?',
    options: [
      '=10 <= A1 <= 50',
      '=AND(A1 >= 10, A1 <= 50)',
      '=IF(A1 >= 10 AND A1 <= 50)',
      '=BETWEEN(A1, 10, 50)'
    ],
    correctIndex: 1,
    explanation: 'Spreadsheets do not support mathematical chained comparisons like 10 <= A1 <= 50. You must use AND(A1 >= 10, A1 <= 50).'
  },
  {
    id: 'm_q26',
    scenario: 'A financial analyst wants to sum sales for all products that start with the prefix "PRO-" in Column A.',
    question: 'Which wildcard character represents any sequence of zero or more characters in SUMIF / COUNTIF criteria?',
    options: ['? (Question Mark)', '* (Asterisk)', '~ (Tilde)', '# (Hash)'],
    correctIndex: 1,
    explanation: '* (asterisk) matches any sequence of characters. ? (question mark) matches any single character.'
  },
  {
    id: 'm_q27',
    scenario: 'You need to count items with exactly 5-character SKU codes in Column A.',
    question: 'Which criteria string uses wildcard characters to match any exact 5-character string?',
    options: ['"*****"', '"????? "', '"?????"', '"LEN=5"'],
    correctIndex: 2,
    explanation: 'Five consecutive question marks ("?????") match any string of exactly 5 characters.'
  },
  {
    id: 'm_q28',
    scenario: 'A discount table gives a 10% discount if an order is in "Q4" OR total amount is over $50,000.',
    question: 'Which formula accurately returns 0.10 if either condition is met, and 0 otherwise?',
    options: [
      '=IF(OR(Quarter = "Q4", Amount > 50000), 0.10, 0)',
      '=IF(AND(Quarter = "Q4", Amount > 50000), 0.10, 0)',
      '=OR(IF(Quarter = "Q4", 0.10), IF(Amount > 50000, 0.10))',
      '=IF(Quarter = "Q4" + Amount > 50000, 0.10, 0)'
    ],
    correctIndex: 0,
    explanation: '=IF(OR(Quarter = "Q4", Amount > 50000), 0.10, 0) tests if either condition is true.'
  },
  {
    id: 'm_q29',
    scenario: 'What is the boolean return value of the expression =NOT(5 > 3)?',
    question: 'Evaluating =NOT(5 > 3) returns which result?',
    options: ['TRUE', 'FALSE', '#VALUE!', '0'],
    correctIndex: 1,
    explanation: '5 > 3 evaluates to TRUE. The NOT function inverts TRUE into FALSE.'
  },
  {
    id: 'm_q30',
    scenario: 'You want to check if a project status cell C2 is NOT equal to "Completed".',
    question: 'Which comparison operator represents "not equal to" in Excel and Google Sheets formulas?',
    options: ['!=', '<>', '=/=', 'NOT ='],
    correctIndex: 1,
    explanation: '<> is the standard spreadsheet inequality operator (e.g. C2 <> "Completed").'
  },
  {
    id: 'm_q31',
    scenario: 'A retail warehouse needs to calculate total inventory value where item status is NOT "Discontinued".',
    question: 'Which criteria syntax in SUMIF excludes discontinued items?',
    options: ['"<>Discontinued"', '"!=Discontinued"', '"NOT Discontinued"', '"-Discontinued"'],
    correctIndex: 0,
    explanation: '"<>Discontinued" is the correct criteria string syntax for inequality in SUMIF/COUNTIF.'
  },
  {
    id: 'm_q32',
    scenario: 'You have two logical expressions, CondA and CondB. You want a formula that returns TRUE if EXACTLY ONE condition is true, but FALSE if both are true or both are false.',
    question: 'Which modern logical function computes Exclusive OR (XOR)?',
    options: ['XOR()', 'EITHER()', 'UNIQUE_OR()', 'EXOR()'],
    correctIndex: 0,
    explanation: 'XOR(logical1, [logical2], ...) returns a logical Exclusive OR of all arguments.'
  },
  {
    id: 'm_q33',
    scenario: 'In an inventory ledger, you want to highlight rows where Stock is less than Reorder Level using Conditional Formatting.',
    question: 'When writing a custom formula for conditional formatting starting at row 2 across columns A through E, how should the formula be formatted if Stock is in Column C and Reorder Level is in Column D?',
    options: ['=$C2 < $D2', '=C$2 < D$2', '=C2 < D2', '=$C$2 < $D$2'],
    correctIndex: 0,
    explanation: '=$C2 < $D2 locks the columns ($C, $D) so every cell in the row evaluates the same columns, while allowing the row index (2) to increment.'
  },
  {
    id: 'm_q34',
    scenario: 'You need to count orders placed in year 2026 where date is stored in Column A (A2:A500).',
    question: 'Which COUNTIFS formula counts all orders between January 1, 2026 and December 31, 2026 inclusive?',
    options: [
      '=COUNTIFS(A2:A500, ">=2026-01-01", A2:A500, "<=2026-12-31")',
      '=COUNTIFS(A2:A500, "=2026")',
      '=COUNTIF(A2:A500, YEAR=2026)',
      '=COUNT(A2:A500, "2026")'
    ],
    correctIndex: 0,
    explanation: 'Using two criteria ranges for the date boundary correctly counts orders within the calendar year.'
  },
  {
    id: 'm_q35',
    scenario: 'A commission rate table has varying rates based on continuous ranges: 0-10k is 2%, 10k-50k is 5%, 50k+ is 10%.',
    question: 'Which lookup formula type is ideal for tiered volume pricing when using a sorted lookup table?',
    options: ['Approximate match VLOOKUP or XLOOKUP', 'Exact match VLOOKUP only', 'CONCATENATE', 'INDEX only'],
    correctIndex: 0,
    explanation: 'Approximate match (VLOOKUP with TRUE or XLOOKUP with match_mode -1) is designed specifically for tiered range lookups.'
  },

  // --- Lookups, Index/Match & Dynamic Arrays (Questions 36 - 55) ---
  {
    id: 'm_q36',
    scenario: 'You are using VLOOKUP to retrieve Employee Salary from a master table located in A2:D100. Employee ID is in Column A, and Salary is in Column D.',
    question: 'What is the required column index number (col_index_num) for Salary?',
    options: ['1', '2', '3', '4'],
    correctIndex: 3,
    explanation: 'In range A2:D100, Column A is 1, B is 2, C is 3, and D is 4.'
  },
  {
    id: 'm_q37',
    scenario: 'You write =VLOOKUP("EMP-104", A2:D100, 4) without specifying the fourth argument [range_lookup].',
    question: 'What does VLOOKUP default to if the fourth argument is omitted, and what risk does this create?',
    options: [
      'Defaults to FALSE (Exact Match); causes no risk',
      'Defaults to TRUE (Approximate Match); may return wrong data if table is not sorted alphabetically/numerically',
      'Defaults to #N/A error immediately',
      'Defaults to returning the entire row'
    ],
    correctIndex: 1,
    explanation: 'Omitting the 4th argument defaults to TRUE (Approximate match), which requires the first column to be sorted and can return catastrophic wrong data.'
  },
  {
    id: 'm_q38',
    scenario: 'You need to retrieve Product Name in Column A based on a Barcode scanned in Column B.',
    question: 'Why does traditional VLOOKUP fail when attempting to look up a value to the left of the lookup key column?',
    options: [
      'VLOOKUP can only search the leftmost column of the table range and retrieve values to its right',
      'VLOOKUP cannot process barcodes',
      'VLOOKUP only works with numbers',
      'Traditional VLOOKUP requires at least 10 columns'
    ],
    correctIndex: 0,
    explanation: 'Traditional VLOOKUP can only search the first column of the supplied table array and read to the right.'
  },
  {
    id: 'm_q39',
    scenario: 'You are using modern Excel or Google Sheets and want to look up a value to the left without table arrangement restrictions.',
    question: 'Which next-generation lookup function searches any column and returns values from any corresponding return column in any direction?',
    options: ['XLOOKUP()', 'ZLOOKUP()', 'SUPERLOOKUP()', 'SEARCHROW()'],
    correctIndex: 0,
    explanation: 'XLOOKUP(lookup_value, lookup_array, return_array) can look both left and right, and defaults to exact match.'
  },
  {
    id: 'm_q40',
    scenario: 'What does XLOOKUP default to for its match mode when the match_mode argument is not specified?',
    question: 'Unlike traditional VLOOKUP, XLOOKUP defaults to which matching behavior?',
    options: ['Exact Match (0)', 'Approximate Match (1)', 'Wildcard Match (2)', 'Soundex Match (3)'],
    correctIndex: 0,
    explanation: 'XLOOKUP defaults to Exact Match (0), preventing the classic sorting bugs caused by VLOOKUP’s default.'
  },
  {
    id: 'm_q41',
    scenario: 'You want XLOOKUP to return "Customer Not Found" instead of an ugly #N/A error when a key does not exist.',
    question: 'Which argument in XLOOKUP directly handles missing values without needing an external IFERROR() wrapper?',
    options: ['Argument 4: [if_not_found]', 'Argument 5: [match_mode]', 'Argument 6: [search_mode]', 'Argument 2: [lookup_array]'],
    correctIndex: 0,
    explanation: 'XLOOKUP has a built-in 4th argument [if_not_found] that supplies fallback values directly.'
  },
  {
    id: 'm_q42',
    scenario: 'In legacy Excel workbooks, financial modelers prefer INDEX + MATCH over VLOOKUP.',
    question: 'What formula syntax correctly combines INDEX and MATCH to return a salary from C2:C100 for Employee ID in cell E2 matching Column A2:A100?',
    options: [
      '=INDEX(C2:C100, MATCH(E2, A2:A100, 0))',
      '=MATCH(C2:C100, INDEX(E2, A2:A100, 0))',
      '=INDEX(A2:A100, MATCH(E2, C2:C100, 0))',
      '=INDEX(E2, MATCH(C2:C100, A2:A100))'
    ],
    correctIndex: 0,
    explanation: 'INDEX(return_range, MATCH(lookup_value, lookup_range, 0)) is the gold-standard robust lookup pattern.'
  },
  {
    id: 'm_q43',
    scenario: 'What does the third argument (0) represent in the function =MATCH(lookup_val, lookup_range, 0)?',
    question: 'In the MATCH function, what does 0 specify?',
    options: ['Exact Match', 'Greater Than Match (-1)', 'Less Than Match (1)', 'Case-Sensitive Match'],
    correctIndex: 0,
    explanation: 'In MATCH, 0 specifies an exact match; 1 specifies less-than (sorted ascending); -1 specifies greater-than (sorted descending).'
  },
  {
    id: 'm_q44',
    scenario: 'You want to perform a 2-way matrix lookup (finding the intersection of a specific Department Row and Month Column).',
    question: 'Which formula pattern executes a dynamic two-dimensional grid lookup?',
    options: [
      '=INDEX(DataGrid, MATCH(RowKey, RowHeaders, 0), MATCH(ColKey, ColHeaders, 0))',
      '=VLOOKUP(RowKey, DataGrid, MATCH(ColKey, ColHeaders, 0))',
      '=XLOOKUP(RowKey, RowHeaders, XLOOKUP(ColKey, ColHeaders, DataGrid))',
      'All of the above are valid two-way lookups'
    ],
    correctIndex: 3,
    explanation: 'All three patterns are valid methods to execute dynamic 2-way horizontal and vertical intersection lookups.'
  },
  {
    id: 'm_q45',
    scenario: 'In modern Excel and Google Sheets, you type =UNIQUE(A2:A100) in cell C2. Multiple values populate cells C2 through C15 automatically.',
    question: 'What is this behavior called where a single formula returns an array that fills adjacent empty cells?',
    options: ['Formula Spilling (Dynamic Arrays)', 'Cell Bleed', 'Array Explosion', 'Data Cascade'],
    correctIndex: 0,
    explanation: 'Dynamic Array formulas automatically "spill" results into neighboring cells across rows and columns.'
  },
  {
    id: 'm_q46',
    scenario: 'A dynamic array formula attempts to spill into cells below it, but cell C5 contains a manual user note "Draft".',
    question: 'Which error code is displayed when a dynamic array’s spill path is blocked by non-empty cells?',
    options: ['#SPILL!', '#BLOCKED!', '#OVERFLOW!', '#REF!'],
    correctIndex: 0,
    explanation: '#SPILL! occurs when one or more cells in the required spill range are not completely blank.'
  },
  {
    id: 'm_q47',
    scenario: 'You want to reference the entire dynamic array that spilled starting from cell C2.',
    question: 'Which reference syntax refers to the full spilled array originating at cell C2?',
    options: ['=C2#', '=C2:*', '=#C2', '=SPILL(C2)'],
    correctIndex: 0,
    explanation: 'The hash symbol (#) appended to the origin cell (C2#) is the Spilled Range Operator in modern spreadsheets.'
  },
  {
    id: 'm_q48',
    scenario: 'You want to filter a master transactions table A2:E100 to show only records where Department (Column C) is "Marketing".',
    question: 'Which dynamic array formula accomplishes this without creating pivot tables or macro scripts?',
    options: [
      '=FILTER(A2:E100, C2:C100 = "Marketing")',
      '=EXTRACT(A2:E100, C2:C100 = "Marketing")',
      '=SELECT(A2:E100, C2:C100 = "Marketing")',
      '=QUERY(A2:E100, "where C = Marketing")'
    ],
    correctIndex: 0,
    explanation: '=FILTER(array, include, [if_empty]) dynamically returns records matching the boolean criteria.'
  },
  {
    id: 'm_q49',
    scenario: 'You want to dynamically sort a sales report in A2:D50 by Revenue (Column D) in descending order (highest sales first).',
    question: 'Which dynamic array formula produces this sorted view?',
    options: [
      '=SORT(A2:D50, 4, -1)',
      '=SORT(A2:D50, 4, 1)',
      '=ORDERBY(A2:D50, 4, "DESC")',
      '=SORTBY(A2:D50, -4)'
    ],
    correctIndex: 0,
    explanation: '=SORT(array, [sort_index], [sort_order]) uses 1 for ascending and -1 for descending order.'
  },
  {
    id: 'm_q50',
    scenario: 'In Google Sheets, you need to query a table using SQL-like syntax: SELECT A, B, SUM(C) WHERE D = "Completed" GROUP BY A, B.',
    question: 'Which uniquely powerful Google Sheets function supports structured SQL-style queries natively?',
    options: ['=QUERY()', '=SQL()', '=SELECT()', '=DATABASE()'],
    correctIndex: 0,
    explanation: 'Google Sheets’ =QUERY() function uses the Google Visualization API Query Language to perform SQL-like operations.'
  },
  {
    id: 'm_q51',
    scenario: 'You need to pull data from a completely separate, closed Google Spreadsheet file located in Google Drive.',
    question: 'Which native Google Sheets function imports live data ranges from another external Google Sheet URL?',
    options: ['=IMPORTRANGE()', '=IMPORTDATA()', '=EXTERNAL()', '=LINKEDDATA()'],
    correctIndex: 0,
    explanation: '=IMPORTRANGE(spreadsheet_url, range_string) connects and synchronizes data across different Google Sheet files.'
  },
  {
    id: 'm_q52',
    scenario: 'In Excel 365, you are creating a complex calculation where the sub-expression (A2 * 1.18 - B2) is repeated 4 times.',
    question: 'Which modern Excel function allows you to declare local intermediate variables to boost calculation speed and formula readability?',
    options: ['=LET()', '=VAR()', '=DEFINE()', '=SET()'],
    correctIndex: 0,
    explanation: 'LET(var1, val1, [var2, val2], calculation) defines named variables within a formula scope to avoid recomputing identical math.'
  },
  {
    id: 'm_q53',
    scenario: 'You want to create a custom reusable function formula in Excel without writing VBA code.',
    question: 'Which advanced Excel function enables the creation of custom, user-defined functions using native spreadsheet formula language?',
    options: ['=LAMBDA()', '=CUSTOM()', '=FUNCTION()', '=DEF()'],
    correctIndex: 0,
    explanation: 'LAMBDA(param1, [param2], ..., calculation) allows authoring pure-formula custom functions that can be named in Name Manager.'
  },
  {
    id: 'm_q54',
    scenario: 'You want to look up the last entry (bottom-most row) in a historical price log using XLOOKUP.',
    question: 'How do you configure XLOOKUP to search from the bottom up (last-to-first)?',
    options: [
      'Set search_mode (Argument 6) to -1',
      'Set match_mode to -1',
      'Sort the table backwards first',
      'Use LOOKUP_REVERSE()'
    ],
    correctIndex: 0,
    explanation: 'XLOOKUP’s 6th argument [search_mode] set to -1 executes a bottom-to-top reverse search.'
  },
  {
    id: 'm_q55',
    scenario: 'A table has headers in Column A and data values across Row 1 through Row 5 (horizontal layout).',
    question: 'Which traditional function performs horizontal row lookups across columns from left to right?',
    options: ['HLOOKUP()', 'VLOOKUP()', 'ROWLOOKUP()', 'TRANSPOSE()'],
    correctIndex: 0,
    explanation: 'HLOOKUP searches the top row of a horizontal table and returns values down the designated row index.'
  },

  // --- Statistics, Financial Math & Business Analysis (Questions 56 - 75) ---
  {
    id: 'm_q56',
    scenario: 'A company has 10 salaries: nine employees earn $50,000 each, while the CEO earns $5,000,000.',
    question: 'Why is MEDIAN() a better metric than AVERAGE() to describe the typical employee compensation in this dataset?',
    options: [
      'MEDIAN is insensitive to extreme outlier skew, whereas AVERAGE is severely distorted upward by the single CEO salary',
      'MEDIAN is faster to calculate in Excel',
      'AVERAGE cannot process numbers greater than 1,000,000',
      'MEDIAN always returns a whole integer'
    ],
    correctIndex: 0,
    explanation: 'The median represents the exact 50th percentile midpoint and resists outlier distortion, making it ideal for skewed distributions like compensation and real estate.'
  },
  {
    id: 'm_q57',
    scenario: 'A marketing team wants to find the most frequently occurring purchase price in an e-commerce order ledger.',
    question: 'Which statistical function returns the mode (most common value) in a dataset?',
    options: ['MODE.SNGL()', 'MEDIAN()', 'FREQUENCY()', 'RANK()'],
    correctIndex: 0,
    explanation: 'MODE.SNGL() (or legacy MODE()) calculates the statistical mode—the value appearing with the highest frequency.'
  },
  {
    id: 'm_q58',
    scenario: 'An investment committee is evaluating a commercial loan of $1,000,000 at 8% annual interest over 5 years (60 monthly payments).',
    question: 'Which financial function calculates the fixed monthly loan payment?',
    options: ['=PMT()', '=PPMT()', '=IPMT()', '=PV()'],
    correctIndex: 0,
    explanation: 'PMT(rate, nper, pv, [fv], [type]) calculates periodic fixed payments for an amortizing loan at a constant interest rate.'
  },
  {
    id: 'm_q59',
    scenario: 'When calculating monthly loan payments with =PMT(rate, nper, pv) where annual interest is 12% and loan term is 5 years, how must the rate and nper arguments be adjusted?',
    question: 'What are the correct periodic inputs for rate and nper for monthly compounding?',
    options: [
      'rate: 12%/12, nper: 5*12',
      'rate: 12%, nper: 5',
      'rate: 12%*12, nper: 5/12',
      'rate: 12%, nper: 60*12'
    ],
    correctIndex: 0,
    explanation: 'Interest rate and term must match payment frequency: divide annual interest by 12 and multiply annual years by 12.'
  },
  {
    id: 'm_q60',
    scenario: 'Why does PMT(0.08/12, 60, 1000000) return a negative number like -$20,276.39?',
    question: 'In Excel financial accounting convention, why is the payment output negative?',
    options: [
      'Cash outflow convention: money leaving your bank account to service debt is treated as a negative cash flow',
      'Because loan interest is an expense penalty',
      'It represents an arithmetic underflow bug',
      'Because banks charge interest in advance'
    ],
    correctIndex: 0,
    explanation: 'Financial functions adhere to cash flow direction: cash received is positive, while cash paid out is negative.'
  },
  {
    id: 'm_q61',
    scenario: 'A capital investment project has an initial cash outflow of -$500,000 followed by cash inflows of $150,000, $200,000, and $350,000 over 3 years.',
    question: 'Which financial function calculates the Net Present Value (NPV) given a discount hurdle rate of 10%?',
    options: ['=NPV()', '=IRR()', '=XNPV()', '=RATE()'],
    correctIndex: 0,
    explanation: 'NPV(rate, value1, [value2], ...) calculates the present discounted value of an investment’s future cash flows.'
  },
  {
    id: 'm_q62',
    scenario: 'What is the classic trap when using Excel’s native =NPV(rate, range) function with an upfront initial investment in Year 0?',
    question: 'Why does =NPV(10%, A1:A4) miscalculate if cell A1 contains the immediate Year 0 initial cash outlay?',
    options: [
      'Excel’s NPV assumes the first value occurs at the END of Period 1, thereby incorrectly discounting Year 0 cash outlay',
      'NPV does not accept negative numbers',
      'NPV requires text dates',
      'NPV only works with 10 or more years'
    ],
    correctIndex: 0,
    explanation: 'Native NPV discounts Period 1 immediately. The standard financial model rule is: =Initial_Outlay + NPV(rate, Future_Cash_Flows).'
  },
  {
    id: 'm_q63',
    scenario: 'A private equity firm needs to calculate the internal rate of return for irregular cash flows occurring on specific calendar dates.',
    question: 'Which function handles non-periodic cash flows occurring on exact dates?',
    options: ['=XIRR()', '=IRR()', '=MIRR()', '=YIELD()'],
    correctIndex: 0,
    explanation: 'XIRR(values, dates, [guess]) calculates the internal rate of return for non-periodic cash flows on exact schedule dates.'
  },
  {
    id: 'm_q64',
    scenario: 'A Quality Assurance engineer wants to measure the dispersion and volatility of battery lifespan tests around the arithmetic mean.',
    question: 'Which statistical function computes the standard deviation of a sample dataset?',
    options: ['=STDEV.S()', '=VAR.S()', '=DEVSQ()', '=AVEDEV()'],
    correctIndex: 0,
    explanation: 'STDEV.S() calculates the sample standard deviation based on a sample of the population.'
  },
  {
    id: 'm_q65',
    scenario: 'A university exam board wants to find the 90th percentile score to award magna cum laude honors.',
    question: 'Which function returns the value at the 90th percentile of an array of exam marks?',
    options: ['=PERCENTILE.INC(Scores, 0.9)', '=PERCENTRANK(Scores, 90)', '=QUARTILE(Scores, 3)', '=RANK(Scores, 0.9)'],
    correctIndex: 0,
    explanation: 'PERCENTILE.INC(array, k) returns the k-th percentile value where k is between 0 and 1 inclusive (0.9 = 90th percentile).'
  },
  {
    id: 'm_q66',
    scenario: 'A product manager wants to identify the 3rd highest sales transaction in a list of 5,000 orders.',
    question: 'Which function returns the k-th largest value in a dataset range?',
    options: ['=LARGE(Range, 3)', '=MAX(Range, 3)', '=TOP(Range, 3)', '=RANK(Range, 3)'],
    correctIndex: 0,
    explanation: 'LARGE(array, k) returns the k-th largest value; SMALL(array, k) returns the k-th smallest.'
  },
  {
    id: 'm_q67',
    scenario: 'You want to determine an employee’s rank in sales performance relative to their 50 peer colleagues.',
    question: 'Which function ranks a numeric value within a list of numbers?',
    options: ['=RANK.EQ()', '=POSITION()', '=INDEX.RANK()', '=ORDER()'],
    correctIndex: 0,
    explanation: 'RANK.EQ(number, ref, [order]) returns the rank of a number in a list of numbers.'
  },
  {
    id: 'm_q68',
    scenario: 'A risk model evaluates loan default likelihood as a probability between 0 and 1.',
    question: 'What is the sum of probabilities across all mutually exclusive and collectively exhaustive outcomes in a standard statistical model?',
    options: ['Exactly 1.0 (100%)', '0.5', '100', 'Undefined'],
    correctIndex: 0,
    explanation: 'The axiomatic sum of probabilities for all mutually exclusive events in a sample space always equals 1.0.'
  },
  {
    id: 'm_q69',
    scenario: 'An accounting team needs to calculate the Year-to-Date (YTD) cumulative variance between Actual and Budgeted spend.',
    question: 'What is the formula to calculate Variance Percentage if Actual is in A2 and Budget is in B2?',
    options: [
      '=(A2 - B2) / B2',
      '=(A2 - B2) / A2',
      '=B2 / A2 - 1',
      '=A2 / (A2 + B2)'
    ],
    correctIndex: 0,
    explanation: 'Variance % = (Actual - Budget) / Budget, representing percentage over- or under-spend relative to plan.'
  },
  {
    id: 'm_q70',
    scenario: 'A retail company has Gross Sales of $1,000,000, Cost of Goods Sold (COGS) of $600,000, and Operating Expenses of $250,000.',
    question: 'What is the Operating Margin percentage?',
    options: ['15%', '40%', '75%', '25%'],
    correctIndex: 0,
    explanation: 'Operating Income = $1M - $600k - $250k = $150k. Operating Margin = $150,000 / $1,000,000 = 15%.'
  },
  {
    id: 'm_q71',
    scenario: 'A SaaS business has 1,000 active subscribers on Jan 1. During the year, 80 cancel their subscriptions.',
    question: 'What is the annual customer churn rate?',
    options: ['8.0%', '9.2%', '12.5%', '0.8%'],
    correctIndex: 0,
    explanation: 'Churn Rate = 80 churned / 1,000 starting customers = 8.0%.'
  },
  {
    id: 'm_q72',
    scenario: 'You want to generate a random decimal number between 0 and 1 for Monte Carlo simulation trials.',
    question: 'Which volatile function generates a pseudorandom number uniformly distributed between 0 and 1?',
    options: ['=RAND()', '=RANDBETWEEN(0, 1)', '=RANDOMLIST()', '=PROB()'],
    correctIndex: 0,
    explanation: '=RAND() returns a random floating point number in [0, 1) and recalculates upon sheet changes.'
  },
  {
    id: 'm_q73',
    scenario: 'You need random integer sample order numbers between 1000 and 9999 for simulation stress testing.',
    question: 'Which function generates random integers within a specified range?',
    options: ['=RANDBETWEEN(1000, 9999)', '=RAND(1000, 9999)', '=INT(RAND() * 9999)', '=RANDOM.INT(1000, 9999)'],
    correctIndex: 0,
    explanation: 'RANDBETWEEN(bottom, top) returns a random integer between specified lower and upper bounds.'
  },
  {
    id: 'm_q74',
    scenario: 'A manufacturing plant tracks the Days Sales of Inventory (DSI). If Average Inventory is $200,000 and COGS is $800,000, what is DSI (assuming 365 days)?',
    question: 'Which formula accurately computes DSI?',
    options: ['=(200000 / 800000) * 365', '=(800000 / 200000) * 365', '=(200000 * 800000) / 365', '=365 / 800000'],
    correctIndex: 0,
    explanation: 'DSI = (Average Inventory / COGS) * 365 = 0.25 * 365 = 91.25 days.'
  },
  {
    id: 'm_q75',
    scenario: 'An executive wants to know the Compound Annual Growth Rate (CAGR) of revenue growing from $100,000 in Year 0 to $200,000 in Year 3.',
    question: 'What is the mathematical CAGR formula in spreadsheets?',
    options: [
      '=(200000 / 100000)^(1/3) - 1',
      '=(200000 - 100000) / 3',
      '=(200000 / 100000) / 3',
      '=(200000 / 100000) * (1/3)'
    ],
    correctIndex: 0,
    explanation: 'CAGR = (Ending Value / Beginning Value)^(1/Years) - 1. Here: 2^(1/3) - 1 ≈ 25.99%.'
  },

  // --- Pivot Tables, Visual BI & Dashboard Engineering (Questions 76 - 90) ---
  {
    id: 'm_q76',
    scenario: 'You are summarizing 500,000 rows of transaction data to see Total Sales by Region and Product Category.',
    question: 'What core spreadsheet tool provides immediate multi-dimensional aggregation without writing manual formulas?',
    options: ['Pivot Table', 'What-If Goal Seek', 'Subtotal Command', 'AutoFilter'],
    correctIndex: 0,
    explanation: 'Pivot Tables allow dynamic aggregation, grouping, and multi-dimensional cross-tabulation of large datasets.'
  },
  {
    id: 'm_q77',
    scenario: 'In a Pivot Table, you drag "Customer Name" to the Values area. Instead of calculating a sum, it automatically displays "Count of Customer Name".',
    question: 'Why does a Pivot Table default to COUNT instead of SUM for this field?',
    options: [
      'Customer Name contains text data; Pivot Tables automatically default to COUNT for non-numeric fields',
      'Because the field contains duplicates',
      'Because customer names are too long',
      'It is an error and must be converted to numbers first'
    ],
    correctIndex: 0,
    explanation: 'Pivot Tables default to COUNT for text or blank cells, and SUM for columns containing purely numbers.'
  },
  {
    id: 'm_q78',
    scenario: 'A CFO wants to see each Region’s sales expressed as a percentage of total corporate sales in a Pivot Table.',
    question: 'Which Pivot Table feature transforms raw values into proportional percentages?',
    options: ['Show Values As > % of Grand Total', 'Calculate Field (% of Sum)', 'Custom Number Format 0.0%', 'Group Field %'],
    correctIndex: 0,
    explanation: 'Value Field Settings > "Show Values As" > "% of Grand Total" converts raw values into percentage shares.'
  },
  {
    id: 'm_q79',
    scenario: 'You want to add interactive clickable visual buttons to a dashboard to filter multiple Pivot Tables and Pivot Charts simultaneously.',
    question: 'Which interactive UI control delivers visual 1-click filtering across connected Pivot Tables?',
    options: ['Slicers', 'Drop-down Lists', 'Scroll Bars', 'Checkboxes'],
    correctIndex: 0,
    explanation: 'Slicers provide interactive visual button filtering that can be connected to multiple Pivot Tables via Report Connections.'
  },
  {
    id: 'm_q80',
    scenario: 'You add new transaction rows to your source data table. Why does the Pivot Table NOT immediately reflect the new numbers?',
    question: 'What step is required to update a standard Excel Pivot Table after source data changes?',
    options: [
      'Right-click Pivot Table and click "Refresh" (or Alt + F5)',
      'Close and restart Microsoft Excel',
      'Re-create the entire Pivot Table from scratch',
      'Format the cells as Currency'
    ],
    correctIndex: 0,
    explanation: 'Excel Pivot Tables cache their underlying data model and require a Refresh command to ingest updated source records.'
  },
  {
    id: 'm_q81',
    scenario: 'How can you guarantee that a Pivot Table automatically expands its source data range whenever new rows are appended to the bottom?',
    question: 'What is the best practice data structure for Pivot Table source data?',
    options: [
      'Format the source data as an official Excel Table (Ctrl + T)',
      'Reference the entire column (A:Z)',
      'Leave 100 blank rows at the bottom',
      'Use the INDIRECT function'
    ],
    correctIndex: 0,
    explanation: 'Formatting source data as an official Table (Ctrl + T) ensures new rows automatically expand the table boundary, making Pivot Refreshes seamless.'
  },
  {
    id: 'm_q82',
    scenario: 'You need to display micro trend lines inside individual spreadsheet cells next to monthly KPI summary metrics.',
    question: 'What feature renders miniature in-cell visual charts in Excel and Google Sheets?',
    options: ['Sparklines', 'MicroCharts', 'Data Bars', 'MiniGraphs'],
    correctIndex: 0,
    explanation: 'Sparklines are compact, single-cell data visualizations that display trends (Line, Column, Win/Loss) directly inside grid cells.'
  },
  {
    id: 'm_q83',
    scenario: 'In an executive boardroom dashboard, which chart type is strongly discouraged by top visualization experts for comparing 8 categories?',
    question: 'Why are Pie Charts considered poor practice for complex categorical comparisons?',
    options: [
      'Human perception struggles to accurately judge non-adjacent 2D slice angles and areas; Bar Charts are far more precise',
      'Pie charts cannot render in color',
      'Pie charts only work with negative numbers',
      'Excel limits pie charts to 2 slices'
    ],
    correctIndex: 0,
    explanation: 'Human visual cognition struggles to estimate angle degrees and curved sector areas compared to aligned linear bars.'
  },
  {
    id: 'm_q84',
    scenario: 'You need to display actual sales against a pre-set budget target for 12 sales divisions on a single compact chart.',
    question: 'Which chart type is the gold-standard BI visual for comparing actual performance against a target benchmark?',
    options: ['Bullet Chart (or Gauge/Bar Target line)', 'Pie Chart', 'Scatter Plot', 'Radar Chart'],
    correctIndex: 0,
    explanation: 'Bullet charts (developed by Stephen Few) are the executive standard for displaying actual performance against target benchmarks in minimal space.'
  },
  {
    id: 'm_q85',
    scenario: 'You want cells to automatically change their background color to red if a metric falls below a critical threshold.',
    question: 'Which spreadsheet feature automatically alters cell formatting (colors, icons, borders) based on cell values or formulas?',
    options: ['Conditional Formatting', 'Cell Styler', 'Theme Switcher', 'Dynamic Templating'],
    correctIndex: 0,
    explanation: 'Conditional Formatting applies rules-based visual styling dynamically according to cell contents or logical formulas.'
  },
  {
    id: 'm_q86',
    scenario: 'You want to group daily dates in a Pivot Table into Quarters and Years automatically.',
    question: 'How do you group date fields in an Excel Pivot Table?',
    options: [
      'Right-click any date cell in the Pivot Table > Group > Select "Months", "Quarters", "Years"',
      'Manually add helper columns to the raw data',
      'Use the TEXT function on the pivot',
      'Date grouping is only available via VBA'
    ],
    correctIndex: 0,
    explanation: 'Right-clicking any date cell in a Pivot Table and selecting "Group" allows instant grouping into Months, Quarters, and Years.'
  },
  {
    id: 'm_q87',
    scenario: 'You need to calculate a new metric (e.g., Commission = Revenue * 0.05) inside a Pivot Table without modifying the underlying raw table.',
    question: 'Which Pivot Table tool creates new virtual calculation fields based on existing field mathematics?',
    options: ['Calculated Field', 'Custom Formula Cell', 'Virtual Dimension', 'Synthetic Metric'],
    correctIndex: 0,
    explanation: 'PivotTable Analyze > Fields, Items, & Sets > "Calculated Field" injects custom formula logic directly into the Pivot engine.'
  },
  {
    id: 'm_q88',
    scenario: 'You are designing an executive KPI dashboard. What is the recommended visual layout hierarchy for the most critical metrics?',
    question: 'Where should top-level summary KPI cards be positioned according to visual UX reading patterns (F-pattern/Z-pattern)?',
    options: [
      'Top-Left corner of the screen',
      'Bottom-Right corner',
      'Hidden in a pop-up modal',
      'Bottom-Center'
    ],
    correctIndex: 0,
    explanation: 'Users naturally scan screens in an F-pattern starting from the top-left; primary macro KPIs belong in the prominent top-left header zone.'
  },
  {
    id: 'm_q89',
    scenario: 'In Google Sheets, you want to build an interactive dashboard with a searchable dropdown list in cell B2 containing a list of employees.',
    question: 'Which feature creates in-cell dropdown selection lists constrained to a designated range of valid options?',
    options: ['Data Validation', 'Filter View', 'Form Control', 'Cell Restriction'],
    correctIndex: 0,
    explanation: 'Data Validation > "List from a range" (or "Dropdown") creates clean, constrained in-cell dropdown selection menus.'
  },
  {
    id: 'm_q90',
    scenario: 'In a collaborative Google Sheet with 20 concurrent team members, you want to filter and sort rows without disrupting what your colleagues see.',
    question: 'Which Google Sheets feature allows an individual user to filter and sort data independently without affecting other simultaneous viewers?',
    options: ['Filter Views', 'Private Sheets', 'Personal Locks', 'Shadow Mode'],
    correctIndex: 0,
    explanation: 'Google Sheets "Filter Views" create private, saved filter/sort configurations that only affect the creator’s view without altering the shared canvas.'
  },

  // --- Automation, Macros, Scripting & Architectural Differences (Questions 91 - 100) ---
  {
    id: 'm_q91',
    scenario: 'You record a macro in Microsoft Excel to automate formatting an imported weekly bank reconciliation file.',
    question: 'In which programming language does Excel record and execute desktop macros?',
    options: ['Visual Basic for Applications (VBA)', 'Google Apps Script (JavaScript)', 'Python', 'C#'],
    correctIndex: 0,
    explanation: 'Excel desktop macros are written in VBA (Visual Basic for Applications). Modern Excel also supports Office Scripts (TypeScript).'
  },
  {
    id: 'm_q92',
    scenario: 'You need to automate weekly reporting and email dispatch from a Google Sheet stored in Google Drive.',
    question: 'Which cloud programming environment is native to Google Workspace for automating Google Sheets, Docs, and Gmail?',
    options: ['Google Apps Script (based on modern JavaScript)', 'VBA for Google', 'PowerShell', 'Swift'],
    correctIndex: 0,
    explanation: 'Google Apps Script is a cloud-native JavaScript runtime hosted on Google servers for automating Workspace applications.'
  },
  {
    id: 'm_q93',
    scenario: 'You send an Excel workbook containing custom VBA automation macros to a colleague. Which file format extension preserves VBA macro code?',
    question: 'Which file format must be used to save an Excel workbook with embedded VBA macros?',
    options: ['.xlsm (Excel Macro-Enabled Workbook)', '.xlsx', '.csv', '.pdf'],
    correctIndex: 0,
    explanation: '.xlsx strictly strips all macro code for security. Workbooks with VBA must be saved as .xlsm (or .xlsb).'
  },
  {
    id: 'm_q94',
    scenario: 'An enterprise data architecture team is deciding between Microsoft Excel and Google Sheets for corporate financial reporting.',
    question: 'What is the maximum row limit of a single worksheet in modern Microsoft Excel?',
    options: ['1,048,576 rows', '65,536 rows', '10,000,000 rows', 'Unlimited rows'],
    correctIndex: 0,
    explanation: 'A modern Excel worksheet grid is strictly capped at 1,048,576 rows by 16,384 columns (XFD).'
  },
  {
    id: 'm_q95',
    scenario: 'A data engineer is pushing data into Google Sheets via API. What is the fundamental cell capacity limitation of a Google Sheets workbook?',
    question: 'What is the maximum cell limit of a Google Sheets workbook as of current cloud infrastructure?',
    options: ['10,000,000 cells across all tabs combined', '1,048,576 cells', '1,000,000 rows', 'Unlimited'],
    correctIndex: 0,
    explanation: 'Google Sheets imposes a ceiling of 10 million cells total across all sheets/tabs in a single workbook.'
  },
  {
    id: 'm_q96',
    scenario: 'You need to automate combining and cleaning 50 monthly CSV files stored in a folder into a unified data model inside Excel.',
    question: 'Which built-in ETL (Extract, Transform, Load) engine inside Excel handles automated data ingestion and transformations without writing VBA?',
    options: ['Power Query (Get & Transform Data)', 'Data Analysis Toolpak', 'Pivot Builder', 'Solver'],
    correctIndex: 0,
    explanation: 'Power Query (built into Data > Get Data) is Excel’s premier ETL pipeline engine for automated data ingestion and reshaping.'
  },
  {
    id: 'm_q97',
    scenario: 'A company needs 25 financial analysts across London, New York, and Mumbai to simultaneously edit financial projections during a live budget call.',
    question: 'Why does Google Sheets have a native architectural advantage over traditional desktop Excel files shared on network drives for real-time concurrency?',
    options: [
      'Google Sheets was built cloud-native from inception with real-time Operational Transformation (OT) concurrency and zero file-locking collisions',
      'Excel cannot be edited by more than one person ever',
      'Google Sheets runs on supercomputers',
      'Network drives do not support passwords'
    ],
    correctIndex: 0,
    explanation: 'Google Sheets was engineered from the ground up as a cloud multi-tenant application with real-time operational transformation, eliminating file lock collisions.'
  },
  {
    id: 'm_q98',
    scenario: 'You want to protect an executive model in Excel so users can only enter numbers in input cells B2:B10 while all formula cells remain locked and uneditable.',
    question: 'What two-step process correctly implements this worksheet security model?',
    options: [
      'Unlock input cells B2:B10 (Format Cells > Protection > uncheck Locked), then enable "Protect Sheet"',
      'Password protect the entire workbook file only',
      'Hide Column B',
      'Delete the formulas from the sheet'
    ],
    correctIndex: 0,
    explanation: 'Cells in Excel are locked by default. You must explicitly uncheck "Locked" on the input cells first, then activate Protect Sheet.'
  },
  {
    id: 'm_q99',
    scenario: 'An auditor wants to trace which precedent cells feed into a complex valuation formula in cell G20.',
    question: 'Which Formula Auditing feature draws blue arrows directly on the worksheet showing all upstream cells supplying values to cell G20?',
    options: ['Trace Precedents', 'Trace Dependents', 'Error Checking', 'Evaluate Formula'],
    correctIndex: 0,
    explanation: 'Formulas > Trace Precedents visually draws graphic arrows pointing from all precedent input cells into the active formula cell.'
  },
  {
    id: 'm_q100',
    scenario: 'What is the primary architectural mission of the "Visual Business Engine" curriculum developed by Kapil?',
    question: 'According to Kapil’s core program philosophy, what distinguishes a true "Visual Business Engineer" from an ordinary spreadsheet user?',
    options: [
      'They do not just memorize formulas; they build end-to-end business intelligence decision engines that transform raw data into executive boardroom clarity',
      'They write 10,000 lines of complex VBA code for every problem',
      'They use 3D pie charts in every presentation',
      'They avoid using Google Sheets altogether'
    ],
    correctIndex: 0,
    explanation: 'A Visual Business Engineer is an analytics architect who connects data cleaning, robust multi-condition modeling, dynamic lookups, and visual storytelling directly to executive business decisions.'
  }
];

// =========================================================================
// 50 MASTER ASSESSMENT LIVE EXERCISES (Interactive Spreadsheet Calculations)
// =========================================================================
export const MASTER_ASSESSMENT_EXERCISES: AssessmentExercise[] = [
  // 1-10: Foundations & Data Arithmetic
  {
    id: 'me_1',
    title: 'Calculate Gross Revenue',
    scenario: 'Order line item revenue calculation.',
    task: 'In cell D2, calculate Total Revenue by multiplying Units (B2) by Unit Price (C2).',
    targetCell: 'D2',
    dataset: {
      headers: ['Item', 'Units', 'Unit Price', 'Total Revenue'],
      rows: [
        ['Enterprise License', 50, 4200, ''],
        ['Standard License', 120, 1500, ''],
      ]
    },
    expectedValue: 210000,
    expectedFormulaKeywords: ['*', 'B2', 'C2'],
    hint: 'Use multiplication: =B2*C2',
    explanation: '50 * 4,200 = 210,000.',
    starterFormula: '=B2*C2'
  },
  {
    id: 'me_2',
    title: 'Calculate Net Profit Margin',
    scenario: 'Quarterly financial performance review.',
    task: 'In cell D2, calculate Net Profit by subtracting Total Cost (C2) from Gross Revenue (B2).',
    targetCell: 'D2',
    dataset: {
      headers: ['Quarter', 'Revenue', 'Cost', 'Net Profit'],
      rows: [
        ['Q1', 850000, 520000, ''],
        ['Q2', 940000, 580000, ''],
      ]
    },
    expectedValue: 330000,
    expectedFormulaKeywords: ['-', 'B2', 'C2'],
    hint: '=B2-C2',
    explanation: '850,000 - 520,000 = 330,000.',
    starterFormula: '=B2-C2'
  },
  {
    id: 'me_3',
    title: 'Aggregate Total Portfolio Revenue',
    scenario: 'Executive financial summary.',
    task: 'In cell B5, calculate the total sum of revenues from B2 to B4 using SUM().',
    targetCell: 'B5',
    dataset: {
      headers: ['Division', 'Revenue (₹)'],
      rows: [
        ['North', 450000],
        ['West', 620000],
        ['South', 380000],
        ['Total', '']
      ]
    },
    expectedValue: 1450000,
    expectedFormulaKeywords: ['SUM', 'B2', 'B4'],
    hint: '=SUM(B2:B4)',
    explanation: 'Sum of 450k + 620k + 380k = 1,450,000.',
    starterFormula: '=SUM(B2:B4)'
  },
  {
    id: 'me_4',
    title: 'Calculate Average Deal Size',
    scenario: 'Sales team performance assessment.',
    task: 'In cell B5, calculate the average deal size across rows B2 to B4 using AVERAGE().',
    targetCell: 'B5',
    dataset: {
      headers: ['Rep', 'Deal Value ($)'],
      rows: [
        ['Sarah', 120000],
        ['Alex', 95000],
        ['Kapil', 175000],
        ['Average', '']
      ]
    },
    expectedValue: 130000,
    expectedFormulaKeywords: ['AVERAGE', 'B2', 'B4'],
    hint: '=AVERAGE(B2:B4)',
    explanation: '(120k + 95k + 175k) / 3 = 130,000.',
    starterFormula: '=AVERAGE(B2:B4)'
  },
  {
    id: 'me_5',
    title: 'Count Valid Closed Deals',
    scenario: 'Deal flow audit.',
    task: 'In cell B5, count the total number of numeric deals recorded in B2:B4 using COUNT().',
    targetCell: 'B5',
    dataset: {
      headers: ['Account', 'Revenue ($)'],
      rows: [
        ['Alpha Corp', 50000],
        ['Beta Tech', 80000],
        ['Gamma LLC', 65000],
        ['Total Count', '']
      ]
    },
    expectedValue: 3,
    expectedFormulaKeywords: ['COUNT', 'B2', 'B4'],
    hint: '=COUNT(B2:B4)',
    explanation: '3 deals counted.',
    starterFormula: '=COUNT(B2:B4)'
  },
  {
    id: 'me_6',
    title: 'Calculate Maximum Transaction',
    scenario: 'High-value transaction surveillance.',
    task: 'In cell B5, find the highest value in B2:B4 using MAX().',
    targetCell: 'B5',
    dataset: {
      headers: ['Transaction', 'Amount ($)'],
      rows: [
        ['TX-101', 45000],
        ['TX-102', 89000],
        ['TX-103', 62000],
        ['Max Deal', '']
      ]
    },
    expectedValue: 89000,
    expectedFormulaKeywords: ['MAX', 'B2', 'B4'],
    hint: '=MAX(B2:B4)',
    explanation: 'Maximum value is 89,000.',
    starterFormula: '=MAX(B2:B4)'
  },
  {
    id: 'me_7',
    title: 'Calculate Minimum Operating Expense',
    scenario: 'Cost optimization audit.',
    task: 'In cell B5, find the lowest operating cost in B2:B4 using MIN().',
    targetCell: 'B5',
    dataset: {
      headers: ['Department', 'Expense ($)'],
      rows: [
        ['Marketing', 35000],
        ['Engineering', 75000],
        ['HR', 22000],
        ['Lowest Cost', '']
      ]
    },
    expectedValue: 22000,
    expectedFormulaKeywords: ['MIN', 'B2', 'B4'],
    hint: '=MIN(B2:B4)',
    explanation: 'Minimum expense is 22,000 (HR).',
    starterFormula: '=MIN(B2:B4)'
  },
  {
    id: 'me_8',
    title: 'Clean Text with TRIM',
    scenario: 'Customer database cleanup.',
    task: 'In cell B2, clean the spaces in A2 using TRIM().',
    targetCell: 'B2',
    dataset: {
      headers: ['Raw Customer Name', 'Cleaned Name'],
      rows: [
        ['   Apex Solutions   ', ''],
      ]
    },
    expectedValue: 'Apex Solutions',
    expectedFormulaKeywords: ['TRIM', 'A2'],
    hint: '=TRIM(A2)',
    explanation: 'Strips irregular leading and trailing spaces.',
    starterFormula: '=TRIM(A2)'
  },
  {
    id: 'me_9',
    title: 'Capitalize Names with PROPER',
    scenario: 'Standardize directory capitalization.',
    task: 'In cell B2, format the lowercase name in A2 into Title Case using PROPER().',
    targetCell: 'B2',
    dataset: {
      headers: ['Raw Name', 'Formatted Name'],
      rows: [
        ['kapil narula', ''],
      ]
    },
    expectedValue: 'Kapil Narula',
    expectedFormulaKeywords: ['PROPER', 'A2'],
    hint: '=PROPER(A2)',
    explanation: 'Converts "kapil narula" to "Kapil Narula".',
    starterFormula: '=PROPER(A2)'
  },
  {
    id: 'me_10',
    title: 'Convert Text to Uppercase',
    scenario: 'ISO country code normalization.',
    task: 'In cell B2, convert the text in A2 into UPPERCASE.',
    targetCell: 'B2',
    dataset: {
      headers: ['Country Code', 'ISO Upper'],
      rows: [
        ['ind', ''],
      ]
    },
    expectedValue: 'IND',
    expectedFormulaKeywords: ['UPPER', 'A2'],
    hint: '=UPPER(A2)',
    explanation: 'Converts "ind" to "IND".',
    starterFormula: '=UPPER(A2)'
  },

  // 11-20: Conditionals & Logic
  {
    id: 'me_11',
    title: 'Conditional Sales Commission (IF)',
    scenario: 'Compute tier 1 sales bonus.',
    task: 'In cell C2, write an IF statement: If Sales (B2) > 100000, bonus is 5000, otherwise 1000.',
    targetCell: 'C2',
    dataset: {
      headers: ['Rep', 'Sales ($)', 'Bonus ($)'],
      rows: [
        ['Rohan', 125000, ''],
      ]
    },
    expectedValue: 5000,
    expectedFormulaKeywords: ['IF', 'B2', '100000', '5000', '1000'],
    hint: '=IF(B2>100000, 5000, 1000)',
    explanation: 'Sales 125,000 exceeds 100,000, so bonus is 5,000.',
    starterFormula: '=IF(B2>100000, 5000, 1000)'
  },
  {
    id: 'me_12',
    title: 'Discount Qualification (IF)',
    scenario: 'Enterprise pricing discount engine.',
    task: 'In cell C2, evaluate: If Quantity (B2) >= 50, assign Discount Rate 0.15, otherwise 0.',
    targetCell: 'C2',
    dataset: {
      headers: ['Product', 'Quantity', 'Discount Rate'],
      rows: [
        ['Server Rack', 60, ''],
      ]
    },
    expectedValue: 0.15,
    expectedFormulaKeywords: ['IF', 'B2', '50', '0.15'],
    hint: '=IF(B2>=50, 0.15, 0)',
    explanation: 'Quantity 60 >= 50 qualifies for 0.15 discount.',
    starterFormula: '=IF(B2>=50, 0.15, 0)'
  },
  {
    id: 'me_13',
    title: 'Dual Qualification Test (AND)',
    scenario: 'Executive credit validation.',
    task: 'In cell C2, return TRUE if Score (A2) >= 700 AND Income (B2) >= 50000, else FALSE.',
    targetCell: 'C2',
    dataset: {
      headers: ['Credit Score', 'Annual Income ($)', 'Approved?'],
      rows: [
        [740, 65000, ''],
      ]
    },
    expectedValue: true,
    expectedFormulaKeywords: ['AND', 'A2', 'B2'],
    hint: '=AND(A2>=700, B2>=50000)',
    explanation: 'Both criteria are met, returns TRUE.',
    starterFormula: '=AND(A2>=700, B2>=50000)'
  },
  {
    id: 'me_14',
    title: 'Flexible Eligibility (OR)',
    scenario: 'Grant eligibility check.',
    task: 'In cell C2, test if EITHER Experience (A2) >= 5 OR Has Degree (B2) == "Yes".',
    targetCell: 'C2',
    dataset: {
      headers: ['Years Exp', 'Degree', 'Eligible'],
      rows: [
        [3, 'Yes', ''],
      ]
    },
    expectedValue: true,
    expectedFormulaKeywords: ['OR', 'A2', 'B2'],
    hint: '=OR(A2>=5, B2="Yes")',
    explanation: 'Has Degree is "Yes", so OR returns TRUE.',
    starterFormula: '=OR(A2>=5, B2="Yes")'
  },
  {
    id: 'me_15',
    title: 'Conditional Sum with SUMIF',
    scenario: 'Regional revenue subtotaling.',
    task: 'In cell C5, calculate total revenue for Region "North" from B2:B4 using SUMIF().',
    targetCell: 'C5',
    dataset: {
      headers: ['Region', 'Division', 'Sales ($)'],
      rows: [
        ['North', 'Retail', 30000],
        ['South', 'Retail', 40000],
        ['North', 'Online', 50000],
        ['North Total', '', '']
      ]
    },
    expectedValue: 80000,
    expectedFormulaKeywords: ['SUMIF', 'North', 'C2:C4'],
    hint: '=SUMIF(A2:A4, "North", C2:C4)',
    explanation: '30,000 + 50,000 = 80,000.',
    starterFormula: '=SUMIF(A2:A4, "North", C2:C4)'
  },
  {
    id: 'me_16',
    title: 'Conditional Count with COUNTIF',
    scenario: 'High-performing employee tally.',
    task: 'In cell B5, count how many scores in B2:B4 are greater than 80 using COUNTIF().',
    targetCell: 'B5',
    dataset: {
      headers: ['Candidate', 'Exam Score'],
      rows: [
        ['Alice', 85],
        ['Bob', 72],
        ['Charlie', 94],
        ['Passed Count', '']
      ]
    },
    expectedValue: 2,
    expectedFormulaKeywords: ['COUNTIF', '>80'],
    hint: '=COUNTIF(B2:B4, ">80")',
    explanation: '85 and 94 are >80, so count is 2.',
    starterFormula: '=COUNTIF(B2:B4, ">80")'
  },
  {
    id: 'me_17',
    title: 'Conditional Average with AVERAGEIF',
    scenario: 'Departmental salary benchmark.',
    task: 'In cell C5, calculate average salary for Department "Tech" in A2:A4.',
    targetCell: 'C5',
    dataset: {
      headers: ['Department', 'Role', 'Salary ($)'],
      rows: [
        ['Tech', 'Engineer', 90000],
        ['HR', 'Generalist', 60000],
        ['Tech', 'Lead', 110000],
        ['Tech Avg', '', '']
      ]
    },
    expectedValue: 100000,
    expectedFormulaKeywords: ['AVERAGEIF', 'Tech'],
    hint: '=AVERAGEIF(A2:A4, "Tech", C2:C4)',
    explanation: '(90k + 110k) / 2 = 100,000.',
    starterFormula: '=AVERAGEIF(A2:A4, "Tech", C2:C4)'
  },
  {
    id: 'me_18',
    title: 'Multi-Condition Sum with SUMIFS',
    scenario: 'Targeted division revenue calculation.',
    task: 'In cell D5, sum Sales (C2:C4) where Region is "West" (A2:A4) AND Status is "Shipped" (B2:B4).',
    targetCell: 'D5',
    dataset: {
      headers: ['Region', 'Status', 'Sales ($)'],
      rows: [
        ['West', 'Shipped', 45000],
        ['West', 'Pending', 30000],
        ['West', 'Shipped', 55000],
        ['West Shipped Total', '', '']
      ]
    },
    expectedValue: 100000,
    expectedFormulaKeywords: ['SUMIFS', 'West', 'Shipped'],
    hint: '=SUMIFS(C2:C4, A2:A4, "West", B2:B4, "Shipped")',
    explanation: '45k + 55k = 100,000.',
    starterFormula: '=SUMIFS(C2:C4, A2:A4, "West", B2:B4, "Shipped")'
  },
  {
    id: 'me_19',
    title: 'Error Handling with IFERROR',
    scenario: 'Safe division calculation.',
    task: 'In cell C2, calculate Cost Per Lead (=A2/B2) wrapped in IFERROR returning 0 if error occurs.',
    targetCell: 'C2',
    dataset: {
      headers: ['Ad Spend ($)', 'Leads Generated', 'Cost / Lead'],
      rows: [
        [5000, 0, ''],
      ]
    },
    expectedValue: 0,
    expectedFormulaKeywords: ['IFERROR', 'A2', 'B2', '0'],
    hint: '=IFERROR(A2/B2, 0)',
    explanation: 'Avoids #DIV/0! error by gracefully returning 0.',
    starterFormula: '=IFERROR(A2/B2, 0)'
  },
  {
    id: 'me_20',
    title: 'Round to 2 Decimals (ROUND)',
    scenario: 'Financial pricing rounding.',
    task: 'In cell B2, round the unit cost in A2 to exactly 2 decimal places.',
    targetCell: 'B2',
    dataset: {
      headers: ['Raw Price', 'Rounded Price'],
      rows: [
        [149.8564, ''],
      ]
    },
    expectedValue: 149.86,
    expectedFormulaKeywords: ['ROUND', 'A2', '2'],
    hint: '=ROUND(A2, 2)',
    explanation: 'Rounds 149.8564 to 149.86.',
    starterFormula: '=ROUND(A2, 2)'
  },

  // 21-30: Lookups & Data Retrieval
  {
    id: 'me_21',
    title: 'Exact Match VLOOKUP',
    scenario: 'Product price catalog lookup.',
    task: 'In cell B5, look up the price of "Product B" in catalog A2:B4 using VLOOKUP.',
    targetCell: 'B5',
    dataset: {
      headers: ['Product', 'Price ($)'],
      rows: [
        ['Product A', 150],
        ['Product B', 280],
        ['Product C', 420],
        ['Lookup: Product B', '']
      ]
    },
    expectedValue: 280,
    expectedFormulaKeywords: ['VLOOKUP', 'Product B', '2', 'FALSE'],
    hint: '=VLOOKUP("Product B", A2:B4, 2, FALSE)',
    explanation: 'Retrieves 280 from Column 2.',
    starterFormula: '=VLOOKUP("Product B", A2:B4, 2, FALSE)'
  },
  {
    id: 'me_22',
    title: 'Next-Gen XLOOKUP',
    scenario: 'Employee department lookup.',
    task: 'In cell C5, look up Department for ID "EMP-102" from IDs (A2:A4) and Departments (B2:B4) using XLOOKUP.',
    targetCell: 'C5',
    dataset: {
      headers: ['Emp ID', 'Department', 'Location'],
      rows: [
        ['EMP-101', 'Finance', 'NY'],
        ['EMP-102', 'Analytics', 'SFO'],
        ['EMP-103', 'Marketing', 'LDN'],
        ['EMP-102 Dept', '', '']
      ]
    },
    expectedValue: 'Analytics',
    expectedFormulaKeywords: ['XLOOKUP', 'EMP-102'],
    hint: '=XLOOKUP("EMP-102", A2:A4, B2:B4)',
    explanation: 'Returns "Analytics" matching EMP-102.',
    starterFormula: '=XLOOKUP("EMP-102", A2:A4, B2:B4)'
  },
  {
    id: 'me_23',
    title: 'INDEX + MATCH Left Lookup',
    scenario: 'Reverse lookup from barcode.',
    task: 'In cell C5, look up Item Name (A2:A4) matching Barcode "BC-99" (B2:B4) using INDEX & MATCH.',
    targetCell: 'C5',
    dataset: {
      headers: ['Item Name', 'Barcode', 'Price'],
      rows: [
        ['Ergo Chair', 'BC-88', 12000],
        ['Monitor Stand', 'BC-99', 3500],
        ['Desk Mat', 'BC-77', 1500],
        ['Lookup Item', '', '']
      ]
    },
    expectedValue: 'Monitor Stand',
    expectedFormulaKeywords: ['INDEX', 'MATCH', 'BC-99'],
    hint: '=INDEX(A2:A4, MATCH("BC-99", B2:B4, 0))',
    explanation: 'Returns "Monitor Stand" from column to the left of the barcode.',
    starterFormula: '=INDEX(A2:A4, MATCH("BC-99", B2:B4, 0))'
  },
  {
    id: 'me_24',
    title: 'MATCH Row Position',
    scenario: 'Determine relative index.',
    task: 'In cell B5, find the relative row position of "Gold" in tier list A2:A4 using MATCH().',
    targetCell: 'B5',
    dataset: {
      headers: ['Tier Level', 'Code'],
      rows: [
        ['Bronze', 'B1'],
        ['Silver', 'S1'],
        ['Gold', 'G1'],
        ['Gold Index', '']
      ]
    },
    expectedValue: 3,
    expectedFormulaKeywords: ['MATCH', 'Gold', '0'],
    hint: '=MATCH("Gold", A2:A4, 0)',
    explanation: '"Gold" is the 3rd item in range A2:A4.',
    starterFormula: '=MATCH("Gold", A2:A4, 0)'
  },
  {
    id: 'me_25',
    title: 'Concatenate with TEXTJOIN',
    scenario: 'Combine tags with comma separation.',
    task: 'In cell D2, join tags in A2:C2 with delimiter ", " using TEXTJOIN, ignoring empty cells.',
    targetCell: 'D2',
    dataset: {
      headers: ['Tag 1', 'Tag 2', 'Tag 3', 'Combined Tags'],
      rows: [
        ['High-Priority', 'Enterprise', 'Q4-Renew', ''],
      ]
    },
    expectedValue: 'High-Priority, Enterprise, Q4-Renew',
    expectedFormulaKeywords: ['TEXTJOIN', ', ', 'TRUE'],
    hint: '=TEXTJOIN(", ", TRUE, A2:C2)',
    explanation: 'Merges the three text tokens with a comma and space separator.',
    starterFormula: '=TEXTJOIN(", ", TRUE, A2:C2)'
  },
  {
    id: 'me_26',
    title: 'Calculate Length with LEN',
    scenario: 'Account number length audit.',
    task: 'In cell B2, find the character length of the code in A2 using LEN().',
    targetCell: 'B2',
    dataset: {
      headers: ['Client Code', 'Character Length'],
      rows: [
        ['ACCT-2026-X9', ''],
      ]
    },
    expectedValue: 12,
    expectedFormulaKeywords: ['LEN', 'A2'],
    hint: '=LEN(A2)',
    explanation: '"ACCT-2026-X9" has 12 characters.',
    starterFormula: '=LEN(A2)'
  },
  {
    id: 'me_27',
    title: 'Extract Substring with MID',
    scenario: 'Parse serial numbers.',
    task: 'In cell B2, extract 4 characters starting at position 6 from A2 using MID().',
    targetCell: 'B2',
    dataset: {
      headers: ['Serial String', 'Extracted Code'],
      rows: [
        ['PROD-9842-US', ''],
      ]
    },
    expectedValue: '9842',
    expectedFormulaKeywords: ['MID', 'A2', '6', '4'],
    hint: '=MID(A2, 6, 4)',
    explanation: 'Extracts "9842" starting at character 6.',
    starterFormula: '=MID(A2, 6, 4)'
  },
  {
    id: 'me_28',
    title: 'Substitute String with SUBSTITUTE',
    scenario: 'Replace currency ticker symbol.',
    task: 'In cell B2, replace "USD" with "INR" in A2 using SUBSTITUTE().',
    targetCell: 'B2',
    dataset: {
      headers: ['Original Currency', 'Converted String'],
      rows: [
        ['Price in USD', ''],
      ]
    },
    expectedValue: 'Price in INR',
    expectedFormulaKeywords: ['SUBSTITUTE', 'USD', 'INR'],
    hint: '=SUBSTITUTE(A2, "USD", "INR")',
    explanation: 'Replaces "USD" with "INR".',
    starterFormula: '=SUBSTITUTE(A2, "USD", "INR")'
  },
  {
    id: 'me_29',
    title: 'Find Substring Index with FIND',
    scenario: 'Locate delimiter index.',
    task: 'In cell B2, find the position of the hyphen "-" in code A2 using FIND().',
    targetCell: 'B2',
    dataset: {
      headers: ['Serial ID', 'Hyphen Position'],
      rows: [
        ['ORDER-901', ''],
      ]
    },
    expectedValue: 6,
    expectedFormulaKeywords: ['FIND', '-', 'A2'],
    hint: '=FIND("-", A2)',
    explanation: 'The hyphen is at character index 6.',
    starterFormula: '=FIND("-", A2)'
  },
  {
    id: 'me_30',
    title: 'Extract Left Characters with LEFT',
    scenario: 'Extract category code prefix.',
    task: 'In cell B2, extract the first 3 characters from A2 using LEFT().',
    targetCell: 'B2',
    dataset: {
      headers: ['SKU String', 'Category Prefix'],
      rows: [
        ['TECH-8821', ''],
      ]
    },
    expectedValue: 'TEC',
    expectedFormulaKeywords: ['LEFT', 'A2', '3'],
    hint: '=LEFT(A2, 3)',
    explanation: 'First 3 characters are "TEC".',
    starterFormula: '=LEFT(A2, 3)'
  },

  // 31-40: Statistical & Financial Calculations
  {
    id: 'me_31',
    title: 'Calculate Median Salary',
    scenario: 'Resistant median wage evaluation.',
    task: 'In cell B6, calculate the MEDIAN of salaries B2:B5.',
    targetCell: 'B6',
    dataset: {
      headers: ['Employee', 'Compensation ($)'],
      rows: [
        ['Staff 1', 50000],
        ['Staff 2', 60000],
        ['Staff 3', 70000],
        ['Executive', 300000],
        ['Median Comp', '']
      ]
    },
    expectedValue: 65000,
    expectedFormulaKeywords: ['MEDIAN', 'B2:B5'],
    hint: '=MEDIAN(B2:B5)',
    explanation: 'Median of (60k + 70k) / 2 = 65,000.',
    starterFormula: '=MEDIAN(B2:B5)'
  },
  {
    id: 'me_32',
    title: 'Calculate 2nd Largest Value with LARGE',
    scenario: 'Silver medal performance lookup.',
    task: 'In cell B5, find the 2nd largest revenue in B2:B4 using LARGE().',
    targetCell: 'B5',
    dataset: {
      headers: ['Deal', 'Amount ($)'],
      rows: [
        ['Deal Alpha', 150000],
        ['Deal Beta', 220000],
        ['Deal Gamma', 180000],
        ['2nd Largest', '']
      ]
    },
    expectedValue: 180000,
    expectedFormulaKeywords: ['LARGE', 'B2:B4', '2'],
    hint: '=LARGE(B2:B4, 2)',
    explanation: '180,000 is 2nd highest after 220,000.',
    starterFormula: '=LARGE(B2:B4, 2)'
  },
  {
    id: 'me_33',
    title: 'Calculate 2nd Smallest Value with SMALL',
    scenario: 'Low-cost vendor identification.',
    task: 'In cell B5, find the 2nd smallest bid in B2:B4 using SMALL().',
    targetCell: 'B5',
    dataset: {
      headers: ['Vendor', 'Bid Quote ($)'],
      rows: [
        ['Vendor A', 45000],
        ['Vendor B', 32000],
        ['Vendor C', 61000],
        ['2nd Lowest', '']
      ]
    },
    expectedValue: 45000,
    expectedFormulaKeywords: ['SMALL', 'B2:B4', '2'],
    hint: '=SMALL(B2:B4, 2)',
    explanation: '45,000 is 2nd lowest after 32,000.',
    starterFormula: '=SMALL(B2:B4, 2)'
  },
  {
    id: 'me_34',
    title: 'Amortization Loan Payment with PMT',
    scenario: 'Monthly corporate financing obligation.',
    task: 'In cell B5, calculate the monthly payment for Loan $120,000 at 12% annual interest over 12 months using =PMT(12%/12, 12, 120000).',
    targetCell: 'B5',
    dataset: {
      headers: ['Parameter', 'Value'],
      rows: [
        ['Principal Loan', 120000],
        ['Annual Interest', 0.12],
        ['Term Months', 12],
        ['Monthly PMT', '']
      ]
    },
    expectedValue: -10661.85,
    tolerance: 5,
    expectedFormulaKeywords: ['PMT', 'B2', 'B3', 'B4'],
    hint: '=PMT(B3/12, B4, B2)',
    explanation: 'Monthly payment is -$10,661.85.',
    starterFormula: '=PMT(B3/12, B4, B2)'
  },
  {
    id: 'me_35',
    title: 'Calculate Net Present Value with NPV',
    scenario: 'Project investment hurdle review.',
    task: 'In cell B5, compute the NPV of cash flows B2:B4 at 10% discount rate using =NPV(0.10, B2:B4).',
    targetCell: 'B5',
    dataset: {
      headers: ['Period', 'Cash Flow ($)'],
      rows: [
        ['Year 1', 50000],
        ['Year 2', 60000],
        ['Year 3', 70000],
        ['NPV @ 10%', '']
      ]
    },
    expectedValue: 147633.36,
    tolerance: 10,
    expectedFormulaKeywords: ['NPV', 'B2:B4'],
    hint: '=NPV(0.10, B2:B4)',
    explanation: 'NPV of the 3 periods discounted at 10% is ~$147,633.',
    starterFormula: '=NPV(0.10, B2:B4)'
  },
  {
    id: 'me_36',
    title: 'Calculate Percentile with PERCENTILE.INC',
    scenario: '80th percentile threshold evaluation.',
    task: 'In cell B6, compute the 80th percentile (0.8) of test scores B2:B5.',
    targetCell: 'B6',
    dataset: {
      headers: ['Student', 'Score'],
      rows: [
        ['Alex', 50],
        ['Priya', 70],
        ['Sam', 80],
        ['Yash', 100],
        ['80th Percentile', '']
      ]
    },
    expectedValue: 88,
    expectedFormulaKeywords: ['PERCENTILE', 'B2:B5', '0.8'],
    hint: '=PERCENTILE.INC(B2:B5, 0.8)',
    explanation: '80th percentile interpolated value is 88.',
    starterFormula: '=PERCENTILE.INC(B2:B5, 0.8)'
  },
  {
    id: 'me_37',
    title: 'Calculate Variance with VAR.S',
    scenario: 'Sample variance calculation.',
    task: 'In cell B5, compute the sample variance of returns B2:B4 using VAR.S().',
    targetCell: 'B5',
    dataset: {
      headers: ['Asset', 'Return (%)'],
      rows: [
        ['Bond Fund', 10],
        ['Equity Index', 20],
        ['Real Estate', 30],
        ['Sample Variance', '']
      ]
    },
    expectedValue: 100,
    expectedFormulaKeywords: ['VAR', 'B2:B4'],
    hint: '=VAR.S(B2:B4)',
    explanation: 'Sample variance of [10, 20, 30] is 100.',
    starterFormula: '=VAR.S(B2:B4)'
  },
  {
    id: 'me_38',
    title: 'Calculate Standard Deviation with STDEV.S',
    scenario: 'Volatility metric.',
    task: 'In cell B5, compute the sample standard deviation of B2:B4 using STDEV.S().',
    targetCell: 'B5',
    dataset: {
      headers: ['Asset', 'Monthly Return (%)'],
      rows: [
        ['Asset A', 10],
        ['Asset B', 20],
        ['Asset C', 30],
        ['Standard Deviation', '']
      ]
    },
    expectedValue: 10,
    expectedFormulaKeywords: ['STDEV', 'B2:B4'],
    hint: '=STDEV.S(B2:B4)',
    explanation: 'Square root of 100 variance is 10.',
    starterFormula: '=STDEV.S(B2:B4)'
  },
  {
    id: 'me_39',
    title: 'Calculate Growth Rate Percentage',
    scenario: 'Year-over-Year revenue expansion.',
    task: 'In cell C2, calculate the growth rate from Year 1 (A2) to Year 2 (B2) using =(B2-A2)/A2.',
    targetCell: 'C2',
    dataset: {
      headers: ['Year 1 ($)', 'Year 2 ($)', 'YoY Growth Rate'],
      rows: [
        [200000, 250000, ''],
      ]
    },
    expectedValue: 0.25,
    expectedFormulaKeywords: ['A2', 'B2', '-'],
    hint: '=(B2-A2)/A2',
    explanation: '(250,000 - 200,000) / 200,000 = 0.25 (25%).',
    starterFormula: '=(B2-A2)/A2'
  },
  {
    id: 'me_40',
    title: 'Calculate Compound Interest Future Value (FV)',
    scenario: 'Long-term corporate treasury deposit.',
    task: 'In cell B5, compute Future Value of deposit $100,000 at 5% annual rate for 2 years with no PMT using =FV(0.05, 2, 0, -100000).',
    targetCell: 'B5',
    dataset: {
      headers: ['Parameter', 'Value'],
      rows: [
        ['Principal', 100000],
        ['Rate', 0.05],
        ['Years', 2],
        ['Future Value', '']
      ]
    },
    expectedValue: 110250,
    expectedFormulaKeywords: ['FV', 'B2', 'B3', 'B4'],
    hint: '=FV(B3, B4, 0, -B2)',
    explanation: '100,000 * (1.05)^2 = 110,250.',
    starterFormula: '=FV(B3, B4, 0, -B2)'
  },

  // 41-50: Advanced Functions, Dynamic Arrays & Matrix Analytics
  {
    id: 'me_41',
    title: 'Dynamic Array Extraction with UNIQUE',
    scenario: 'De-duplicate customer regions.',
    task: 'In cell C2, extract unique regions from A2:A5 using =UNIQUE(A2:A5).',
    targetCell: 'C2',
    dataset: {
      headers: ['Region Log', 'Dummy', 'Unique Regions'],
      rows: [
        ['North', '', ''],
        ['South', '', ''],
        ['North', '', ''],
        ['East', '', '']
      ]
    },
    expectedValue: 'North',
    expectedFormulaKeywords: ['UNIQUE', 'A2:A5'],
    hint: '=UNIQUE(A2:A5)',
    explanation: 'First spilled item is "North".',
    starterFormula: '=UNIQUE(A2:A5)'
  },
  {
    id: 'me_42',
    title: 'Sort Data with SORT',
    scenario: 'Sort revenue descending.',
    task: 'In cell B5, extract the sorted array of sales B2:B4 descending using =SORT(B2:B4, 1, -1).',
    targetCell: 'B5',
    dataset: {
      headers: ['Rep', 'Sales ($)'],
      rows: [
        ['John', 15000],
        ['Kapil', 45000],
        ['Sara', 30000],
        ['Top Sorted Deal', '']
      ]
    },
    expectedValue: 45000,
    expectedFormulaKeywords: ['SORT', 'B2:B4', '-1'],
    hint: '=SORT(B2:B4, 1, -1)',
    explanation: 'The top spilled value is 45,000.',
    starterFormula: '=SORT(B2:B4, 1, -1)'
  },
  {
    id: 'me_43',
    title: 'Dynamic Filter with FILTER',
    scenario: 'Filter active projects.',
    task: 'In cell C5, filter Project Names A2:A4 where Status B2:B4 is "Active".',
    targetCell: 'C5',
    dataset: {
      headers: ['Project', 'Status', 'Active Projects'],
      rows: [
        ['Project Titan', 'Active', ''],
        ['Project Phoenix', 'Closed', ''],
        ['Project Nova', 'Active', ''],
        ['Filter Result', '', '']
      ]
    },
    expectedValue: 'Project Titan',
    expectedFormulaKeywords: ['FILTER', 'A2:A4', 'B2:B4', 'Active'],
    hint: '=FILTER(A2:A4, B2:B4="Active")',
    explanation: 'First filtered active project is "Project Titan".',
    starterFormula: '=FILTER(A2:A4, B2:B4="Active")'
  },
  {
    id: 'me_44',
    title: 'Intermediate Variables with LET',
    scenario: 'Optimize formula computation.',
    task: 'In cell C2, use LET to set rev=A2 and tax=0.18, returning rev*tax.',
    targetCell: 'C2',
    dataset: {
      headers: ['Revenue ($)', 'Blank', 'Tax Due'],
      rows: [
        [100000, '', ''],
      ]
    },
    expectedValue: 18000,
    expectedFormulaKeywords: ['LET', 'rev', 'tax', 'A2'],
    hint: '=LET(rev, A2, tax, 0.18, rev * tax)',
    explanation: '100,000 * 0.18 = 18,000.',
    starterFormula: '=LET(rev, A2, tax, 0.18, rev * tax)'
  },
  {
    id: 'me_45',
    title: 'Absolute Value with ABS',
    scenario: 'Variance magnitude computation.',
    task: 'In cell B2, return the absolute magnitude of budget variance in A2 using ABS().',
    targetCell: 'B2',
    dataset: {
      headers: ['Variance ($)', 'Absolute Deviation'],
      rows: [
        [-45000, ''],
      ]
    },
    expectedValue: 45000,
    expectedFormulaKeywords: ['ABS', 'A2'],
    hint: '=ABS(A2)',
    explanation: 'Removes the negative sign, returning 45,000.',
    starterFormula: '=ABS(A2)'
  },
  {
    id: 'me_46',
    title: 'Integer Truncation with INT',
    scenario: 'Floor conversion of shipping weights.',
    task: 'In cell B2, extract the integer portion of 48.75 in A2 using INT().',
    targetCell: 'B2',
    dataset: {
      headers: ['Raw Weight', 'Integer Weight'],
      rows: [
        [48.75, ''],
      ]
    },
    expectedValue: 48,
    expectedFormulaKeywords: ['INT', 'A2'],
    hint: '=INT(A2)',
    explanation: 'Rounds down to nearest integer 48.',
    starterFormula: '=INT(A2)'
  },
  {
    id: 'me_47',
    title: 'Modular Remainder with MOD',
    scenario: 'Batch packing remainder check.',
    task: 'In cell C2, compute the remainder when Units (A2) is divided by Batch Size (B2) using MOD().',
    targetCell: 'C2',
    dataset: {
      headers: ['Total Units', 'Batch Size', 'Remainder Units'],
      rows: [
        [105, 10, ''],
      ]
    },
    expectedValue: 5,
    expectedFormulaKeywords: ['MOD', 'A2', 'B2'],
    hint: '=MOD(A2, B2)',
    explanation: '105 divided by 10 leaves remainder 5.',
    starterFormula: '=MOD(A2, B2)'
  },
  {
    id: 'me_48',
    title: 'Square Root with SQRT',
    scenario: 'Statistical dispersion math.',
    task: 'In cell B2, compute the square root of Variance in A2 using SQRT().',
    targetCell: 'B2',
    dataset: {
      headers: ['Variance', 'Standard Deviation'],
      rows: [
        [144, ''],
      ]
    },
    expectedValue: 12,
    expectedFormulaKeywords: ['SQRT', 'A2'],
    hint: '=SQRT(A2)',
    explanation: 'Square root of 144 is 12.',
    starterFormula: '=SQRT(A2)'
  },
  {
    id: 'me_49',
    title: 'Power Exponent with POWER',
    scenario: 'Exponential compound multiplier.',
    task: 'In cell C2, compute Base (A2) raised to the Exponent (B2) using POWER().',
    targetCell: 'C2',
    dataset: {
      headers: ['Base', 'Exponent', 'Result'],
      rows: [
        [5, 3, ''],
      ]
    },
    expectedValue: 125,
    expectedFormulaKeywords: ['POWER', 'A2', 'B2'],
    hint: '=POWER(A2, B2)',
    explanation: '5 cubed (5^3) = 125.',
    starterFormula: '=POWER(A2, B2)'
  },
  {
    id: 'me_50',
    title: 'Final Executive KPI Metric Synthesis',
    scenario: 'Grand Champion Master Assessment finale.',
    task: 'In cell D2, calculate Total Net Revenue: (Units * Price) * (1 - Discount Rate).',
    targetCell: 'D2',
    dataset: {
      headers: ['Units', 'Price ($)', 'Discount Rate', 'Total Net Revenue'],
      rows: [
        [100, 2000, 0.10, ''],
      ]
    },
    expectedValue: 180000,
    expectedFormulaKeywords: ['A2', 'B2', 'C2', '*', '-'],
    hint: '=(A2*B2)*(1-C2)',
    explanation: '(100 * 2000) * (1 - 0.10) = 200,000 * 0.90 = 180,000.',
    starterFormula: '=(A2*B2)*(1-C2)'
  }
];

// =========================================================================
// SESSION SHUFFLER (Fisher-Yates) WITH ANSWER OPTION RANDOMIZATION
// "no same sequence of answers....learners will understand pattern which we dont wait"
// =========================================================================

export interface ShuffledMCQ extends AssessmentQuestion {
  originalId: string;
}

export function getShuffledMasterExamSession(): {
  questions: ShuffledMCQ[];
  exercises: AssessmentExercise[];
} {
  // 1. Clone MCQs
  const clonedMCQs: AssessmentQuestion[] = JSON.parse(JSON.stringify(MASTER_ASSESSMENT_MCQS));

  // 2. Shuffle each question's answer options AND update correctIndex
  const randomizedMCQs: ShuffledMCQ[] = clonedMCQs.map((q) => {
    const originalCorrectText = q.options[q.correctIndex];
    const shuffledOptions = [...q.options];

    // Fisher-Yates shuffle on options
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }

    const newCorrectIndex = shuffledOptions.indexOf(originalCorrectText);

    return {
      ...q,
      originalId: q.id,
      options: shuffledOptions,
      correctIndex: newCorrectIndex,
    };
  });

  // 3. Shuffle question order
  for (let i = randomizedMCQs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomizedMCQs[i], randomizedMCQs[j]] = [randomizedMCQs[j], randomizedMCQs[i]];
  }

  // 4. Clone and shuffle Live Exercises
  const clonedExercises: AssessmentExercise[] = JSON.parse(JSON.stringify(MASTER_ASSESSMENT_EXERCISES));
  for (let i = clonedExercises.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clonedExercises[i], clonedExercises[j]] = [clonedExercises[j], clonedExercises[i]];
  }

  return {
    questions: randomizedMCQs,
    exercises: clonedExercises,
  };
}
