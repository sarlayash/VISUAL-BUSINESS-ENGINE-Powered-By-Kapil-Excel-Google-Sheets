export type CellValue = string | number | boolean | null;

export interface CellData {
  raw: string; // User input e.g. "=SUM(B2:B5)" or "1500"
  computed: CellValue;
  formatted?: string;
  isFormula?: boolean;
  isError?: boolean;
  errorMessage?: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    align?: 'left' | 'center' | 'right';
    format?: 'text' | 'number' | 'currency_inr' | 'currency_usd' | 'percent';
    bgColor?: string;
    textColor?: string;
  };
}

export type GridData = { [cellId: string]: CellData }; // e.g. "A1", "B2"

export interface Hint {
  level: 1 | 2 | 3;
  title: string;
  text: string;
  penaltyXp: number;
}

export interface ValidationRule {
  targetCell: string; // e.g. "E2" or "D10"
  description: string;
  expectedFormulaKeywords?: string[]; // e.g. ["VLOOKUP", "XLOOKUP"] or ["SUM"]
  expectedValue?: CellValue;
  expectedType?: 'number' | 'string' | 'boolean';
  tolerance?: number; // for floating point calculations
  customValidator?: (val: CellValue, raw: string, grid: GridData) => boolean;
}

export interface Challenge {
  id: string;
  moduleId: number;
  lessonId: string;
  title: string;
  difficulty: 'Explorer' | 'Practitioner' | 'Analyst' | 'Strategist' | 'Business Architect';
  businessDomain: string; // e.g. "Retail", "HR", "Finance"
  businessStory: string;
  businessGoal: string;
  instructions: string[];
  initialData: {
    headers: string[];
    rows: (string | number)[][];
    startCell?: string; // default "A1"
  };
  validationRules: ValidationRule[];
  hints: Hint[];
  solutionExplanation: string;
  excelFormula: string;
  googleSheetsFormula: string;
  xpReward: number;
}

export interface ModuleInfo {
  id: number;
  title: string;
  subtitle: string;
  hours: number;
  badgeName: string;
  badgeIcon: string;
  topics: string[];
  businessSimulationLab: string;
  challenges: Challenge[];
  excelVsSheetsHighlights: {
    concept: string;
    excelWay: string;
    sheetsWay: string;
    proTip: string;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  level: string;
  streakDays: number;
  lastActiveDate: string;
  completedChallenges: string[]; // Challenge IDs
  completedModules: number[]; // Module IDs [1, 2, 3...]
  earnedBadges: string[]; // Badge names
  capstoneCompleted: boolean;
  capstoneStage: number; // 1 to 9
  certificateId?: string;
  certificateIssueDate?: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  challengesSolved: number;
  accuracy: number;
  isCurrentUser?: boolean;
}

export interface IndustryLab {
  id: string;
  industry: string;
  icon: string;
  title: string;
  companyName: string;
  scenario: string;
  datasetName: string;
  challengesCount: number;
  difficulty: string;
  dataset: {
    headers: string[];
    rows: (string | number)[][];
  };
  keyQuestions: string[];
  starterFormulaHint: string;
}

export interface CapstoneStage {
  stageNumber: number;
  title: string;
  objective: string;
  instructions: string[];
  datasetDescription: string;
  targetCells: string[];
  expectedConcept: string;
  xpReward: number;
}
