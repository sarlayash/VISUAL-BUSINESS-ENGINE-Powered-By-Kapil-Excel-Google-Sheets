import { BusinessIntelligenceIndexItem } from '../types';

export const BUSINESS_INTELLIGENCE_INDEX: BusinessIntelligenceIndexItem[] = [
  {
    id: 'bii_1',
    category: 'Scalability & Data Volume',
    title: 'Worksheet Row Capacity & Memory Limits',
    dimension: 'Row Scale & Memory Architecture',
    excelScore: 94,
    excelStrengths: [
      'Strict 1,048,576 rows by 16,384 columns per sheet.',
      '64-bit desktop memory engine leverages 128GB+ local RAM.',
      'Power Pivot / Data Model (xVelocity VertiPaq engine) compresses 100M+ rows efficiently.'
    ],
    excelLimitations: [
      'Single sheet hard grid cap at ~1.04M rows.',
      'High-memory local files risk freezing when formulas are poorly indexed.'
    ],
    sheetsScore: 86,
    sheetsStrengths: [
      '10,000,000 cells total across all sheets combined.',
      'Native BigQuery Connected Sheets queries billions of rows in Google Cloud without memory load.',
      'Cloud compute offloaded to Google infrastructure, preventing desktop crashes.'
    ],
    sheetsLimitations: [
      'Browser memory bottlenecks on complex calculations above 5M cells.',
      'Subject to cloud quota limits and API throttling.'
    ],
    enterpriseRecommendation: 'Microsoft Excel',
    kapilArchitecturalAnalysis:
      'For standalone desktop quantitative analysis and massive local data models, Excel’s xVelocity engine wins on pure compute. However, when connected to Google BigQuery, Sheets scales to multi-billion row enterprise data warehouses seamlessly.'
  },
  {
    id: 'bii_2',
    category: 'Collaboration & Concurrency',
    title: 'Multi-User Real-Time Editing & Concurrency',
    dimension: 'Real-Time Multiplayer Concurrency',
    excelScore: 80,
    excelStrengths: [
      'Co-authoring supported via OneDrive / SharePoint / Office 365.',
      'Show Changes history panel tracks cell edits.',
      'Desktop + Web synchronized editing.'
    ],
    excelLimitations: [
      'Co-authoring latency can cause intermittent merge collisions and file locks on complex macros.',
      'VBA execution disables simultaneous multi-user co-authoring.'
    ],
    sheetsScore: 98,
    sheetsStrengths: [
      'Industry benchmark: Built cloud-native from Day 1 with Operational Transformation (OT).',
      'Zero file-locking collisions; 100+ concurrent active editors with sub-second cursor presence.',
      'Private "Filter Views" allow individuals to sort/filter without disrupting teammates.'
    ],
    sheetsLimitations: [
      'Requires continuous internet connection for full real-time collaboration (though offline mode exists).'
    ],
    enterpriseRecommendation: 'Google Sheets',
    kapilArchitecturalAnalysis:
      'Google Sheets is the undisputed gold standard for collaborative corporate workflows. Its "Filter Views" feature alone eliminates 90% of office friction during quarterly planning cycles.'
  },
  {
    id: 'bii_3',
    category: 'Formula Ecosystem',
    title: 'Modern Formula Ecosystem & Dynamic Arrays',
    dimension: 'Formula Ecology & Dynamic Matrix Math',
    excelScore: 96,
    excelStrengths: [
      'LET() and LAMBDA() enable modular functional programming inside grid formulas.',
      'Dynamic array operators (spill #) across SORT, FILTER, UNIQUE, XLOOKUP, CHOOSEROWS, TOCOL.',
      'Extremely optimized multi-threaded local CPU calculation engine.'
    ],
    excelLimitations: [
      'Legacy functions still linger, creating version confusion between Excel 2016 and 365.'
    ],
    sheetsScore: 92,
    sheetsStrengths: [
      'Native SQL-like =QUERY() function provides full SELECT, WHERE, GROUP BY, PIVOT powers.',
      '=ARRAYFORMULA() applies single formulas across thousands of rows automatically.',
      '=IMPORTRANGE() effortlessly synchronizes data models across different cloud files.'
    ],
    sheetsLimitations: [
      'LAMBDA recursion depth is lower than desktop Excel.',
      'Complex array formulas can hit cloud execution timeouts (30s limit).'
    ],
    enterpriseRecommendation: 'Hybrid Architecture',
    kapilArchitecturalAnalysis:
      'Excel wins for pure financial modeling elegance with LET and LAMBDA. Google Sheets wins for data pipeline transformation with =QUERY() and =IMPORTRANGE(). Master both to be unstoppable.'
  },
  {
    id: 'bii_4',
    category: 'Business Intelligence & Dashboards',
    title: 'Interactive Executive BI & Visual Dashboards',
    dimension: 'Data Visualization & Executive Storytelling',
    excelScore: 95,
    excelStrengths: [
      'Deep integration with Microsoft Power BI (Analyze in Excel, Publish to Power BI).',
      'Pivot Charts, Slicers, and Timelines provide instant tactile dashboard controls.',
      'Pixel-perfect formatting controls and conditional formatting data bars.'
    ],
    excelLimitations: [
      'Sharing interactive dashboards as static files can lead to version desynchronization.'
    ],
    sheetsScore: 89,
    sheetsStrengths: [
      'Instant 1-click sync to Google Looker Studio for public or company-wide dashboards.',
      'Native Scorecard KPI charts, Timeline charts, and Geocharts.',
      'Zero-software browser embedding directly into Google Slides or Confluence/Notion.'
    ],
    sheetsLimitations: [
      'Pivot chart design controls are less granular than desktop Excel.'
    ],
    enterpriseRecommendation: 'Microsoft Excel',
    kapilArchitecturalAnalysis:
      'For boardroom presentations and executive C-Suite control towers, Excel paired with Power BI offers unmatched visual fidelity. For web-embedded, live-updating executive scorecards, Google Sheets with Looker Studio is faster to deploy.'
  },
  {
    id: 'bii_5',
    category: 'Enterprise Automation',
    title: 'Scripting, Automation & Enterprise Code',
    dimension: 'Automation Engine: VBA vs Apps Script',
    excelScore: 90,
    excelStrengths: [
      'VBA (Visual Basic) has 30+ years of battle-tested enterprise desktop automation.',
      'Access to Windows APIs, file system, registry, COM objects, and DLLs.',
      'New Office Scripts (TypeScript) offers cloud-ready automation.'
    ],
    excelLimitations: [
      'VBA does not run in Excel Online or mobile browsers.',
      'Macro-enabled files (.xlsm) face strict security blocks and email quarantine in corporate IT.'
    ],
    sheetsScore: 95,
    sheetsStrengths: [
      'Google Apps Script is built on modern ECMAScript / JavaScript V8 runtime.',
      'Serverless cloud execution: triggers run on schedule (cron) or on edit even when computer is off.',
      'Native REST APIs connect Google Sheets directly to Slack, Gmail, Twilio, and Stripe with 5 lines of code.'
    ],
    sheetsLimitations: [
      '6-minute execution limit per script trigger.'
    ],
    enterpriseRecommendation: 'Google Sheets',
    kapilArchitecturalAnalysis:
      'Apps Script is significantly superior for modern cloud automation and API webhooks because it executes on Google Cloud even when you sleep. VBA remains irreplaceable for local legacy ERP integrations.'
  },
  {
    id: 'bii_6',
    category: 'Data Ingestion & ETL',
    title: 'Data Integration Pipelines & Cloud Warehousing',
    dimension: 'ETL Pipelines: Power Query vs Cloud Connectors',
    excelScore: 97,
    excelStrengths: [
      'Power Query (M Language) is the most powerful self-service ETL tool in business history.',
      'Connects to SQL Server, Oracle, SAP HANA, Azure, Salesforce, PDF tables, web pages, and folders.',
      'Visual query editor with 300+ transformations with zero code required.'
    ],
    excelLimitations: [
      'Power Query scheduled refreshes require SharePoint / Power BI Gateway configurations.'
    ],
    sheetsScore: 88,
    sheetsStrengths: [
      'Connected Sheets connects directly to Google BigQuery, Looker, and Salesforce.',
      '=IMPORTHTML() and =IMPORTXML() scrape live websites and XML tables in real-time.',
      'Google Sheets API (v4) offers ultra-fast bidirectional read/write from Python, Node.js, and Go.'
    ],
    sheetsLimitations: [
      'No native equivalent of Power Query’s visual M step-by-step transformation recorder without third-party add-ons.'
    ],
    enterpriseRecommendation: 'Microsoft Excel',
    kapilArchitecturalAnalysis:
      'Excel’s Power Query is a masterpiece of enterprise engineering. It transforms ugly, messy accounting exports into pristine relational tables effortlessly.'
  },
  {
    id: 'bii_7',
    category: 'Security & Governance',
    title: 'Information Protection, Governance & Audit Trails',
    dimension: 'Enterprise Data Security & Revision Tracking',
    excelScore: 91,
    excelStrengths: [
      'Microsoft Purview sensitivity labels (Confidential, Highly Confidential).',
      'Granular cell password protection and workbook encryption (AES-256).',
      'Enterprise DLP (Data Loss Prevention) rules across Windows Defender.'
    ],
    excelLimitations: [
      'Cell-level worksheet protection passwords can be cracked by basic brute-force scripts on unencrypted sheets.'
    ],
    sheetsScore: 94,
    sheetsStrengths: [
      'Enterprise IAM access control governed by Google Workspace Admin console.',
      'Comprehensive Version History: every single keystroke tracked by user and timestamp forever.',
      'Named Range and Sheet Protection based on exact email permissions (cannot be bypassed by password crackers).'
    ],
    sheetsLimitations: [
      'Exporting to Excel or CSV strips Google cloud permissions.'
    ],
    enterpriseRecommendation: 'Google Sheets',
    kapilArchitecturalAnalysis:
      'Google Sheets provides far superior auditability because its Version History never loses a change and permissions are anchored to authenticated Google identities, not brittle local passwords.'
  },
  {
    id: 'bii_8',
    category: 'Financial Engineering',
    title: 'Complex Financial Modeling & Optimization Solver',
    dimension: 'Quantitative Modeling & Solver Solvers',
    excelScore: 98,
    excelStrengths: [
      'Standard Wall Street and investment banking modeling platform.',
      'Excel Solver with Simplex LP, GRG Nonlinear, and Evolutionary algorithms.',
      'Data Analysis Toolpak (Regression, ANOVA, F-Test, Exponential Smoothing).'
    ],
    excelLimitations: [
      'Circular reference calculation settings can be finicky across machines.'
    ],
    sheetsScore: 82,
    sheetsStrengths: [
      'Basic Goal Seek and standard financial functions (PMT, IRR, XNPV) fully implemented.',
      'Google Finance function (=GOOGLEFINANCE("GOOGL", "price")) fetches live stock prices and currencies.'
    ],
    sheetsLimitations: [
      'No built-in nonlinear Solver equivalent without third-party add-ons.',
      'Lack of advanced native regression ANOVA modeling packages.'
    ],
    enterpriseRecommendation: 'Microsoft Excel',
    kapilArchitecturalAnalysis:
      'For investment banking, private equity LBO models, and complex operations research optimization, Excel remains the indisputable global king.'
  },
  {
    id: 'bii_9',
    category: 'AI & Machine Learning',
    title: 'Generative AI & LLM Copilot Capabilities',
    dimension: 'Copilot vs Gemini Grid Assistants',
    excelScore: 92,
    excelStrengths: [
      'Microsoft 365 Copilot generates formulas, visual charts, and scenario analysis via natural language.',
      'Python in Excel runs scikit-learn, pandas, and matplotlib directly inside the worksheet cloud grid.'
    ],
    excelLimitations: [
      'Microsoft 365 Copilot requires expensive enterprise add-on licensing ($30/user/month).'
    ],
    sheetsScore: 90,
    sheetsStrengths: [
      'Gemini for Google Workspace auto-generates tables, schedules, formulas, and summaries.',
      '=AI() custom functions via Apps Script connect to Gemini 1.5 Flash for sub-cent sentiment analysis and classification across 10,000 cells.'
    ],
    sheetsLimitations: [
      'Python execution requires third-party Colab bridges.'
    ],
    enterpriseRecommendation: 'Hybrid Architecture',
    kapilArchitecturalAnalysis:
      'Excel’s Python integration brings full data science to spreadsheets. Meanwhile, Google Sheets’ ability to call Gemini API directly via Apps Script makes it an automated AI processing factory for text and classification.'
  },
  {
    id: 'bii_10',
    category: 'Cost & Ecosystem Agility',
    title: 'Total Cost of Ownership (TCO) & Deployment Agility',
    dimension: 'Licensing Friction & Device Portability',
    excelScore: 84,
    excelStrengths: [
      'Bundled in Microsoft 365 enterprise agreements across 90%+ of global enterprises.',
      'Standard desktop software on corporate Windows laptops.'
    ],
    excelLimitations: [
      'Requires active Microsoft license and software updates.',
      'Mobile experience on smartphones is restricted compared to desktop.'
    ],
    sheetsScore: 97,
    sheetsStrengths: [
      '100% Free for personal Google accounts; cost-effective in Google Workspace Business.',
      'Zero installation: operates in any modern web browser (Chrome, Edge, Safari, Firefox) on Mac, Windows, Linux, iPad, and Android.',
      'Zero software updates or local patch management.'
    ],
    sheetsLimitations: [
      'Heavy computation demands a stable internet link.'
    ],
    enterpriseRecommendation: 'Google Sheets',
    kapilArchitecturalAnalysis:
      'Google Sheets has transformed startup agility and global educational access by eliminating software cost barriers. A student on a $150 Chromebook has the exact same software engine as a CEO.'
  }
];
