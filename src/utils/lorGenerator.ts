import QRCode from 'qrcode';
import { getVerificationUrl } from './certificateGenerator';

export interface LorConfig {
  candidateName: string;
  candidateId: string;
  issueDate: string;
  masterAssessmentScore: number; // e.g. 96%
  percentileRank: number; // e.g. 99th percentile
  validUntil?: string;
}

export function printLorToPdf(config: LorConfig): void {
  const verifyUrl = getVerificationUrl(config.candidateId);
  const qrDataUrl = QRCode.toDataURL(verifyUrl, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 140,
    color: {
      dark: '#111827',
      light: '#FFFFFF',
    },
  });

  qrDataUrl.then((qrSrc) => {
    const win = window.open('', '_blank');
    if (!win) {
      alert('Please allow popups to download or print your official Letter of Recommendation.');
      return;
    }

    win.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Executive Letter of Recommendation - ${config.candidateName} - SarlaYash Mission</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 14mm 16mm 14mm 16mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, serif;
              color: #1F2937;
              background: #FFFFFF;
              margin: 0;
              padding: 0;
              line-height: 1.6;
              font-size: 13.5px;
            }
            .header-bar {
              border-bottom: 2.5px solid #F59E0B;
              padding-bottom: 14px;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .brand-title {
              font-size: 22px;
              font-weight: 900;
              color: #111827;
              letter-spacing: 1px;
              text-transform: uppercase;
            }
            .brand-sub {
              font-size: 11px;
              font-weight: 700;
              color: #D97706;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              margin-top: 2px;
            }
            .meta-block {
              text-align: right;
              font-size: 11px;
              color: #4B5563;
              font-family: ui-monospace, monospace;
            }
            .salutation {
              font-weight: 700;
              color: #111827;
              font-size: 15px;
              margin-bottom: 12px;
            }
            p {
              margin: 0 0 12px 0;
              text-align: justify;
              color: #374151;
            }
            .highlight-badge {
              background: #FEF3C7;
              border: 1px solid #FDE68A;
              border-radius: 8px;
              padding: 10px 14px;
              margin: 14px 0;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .highlight-badge span {
              font-weight: 700;
              color: #92400E;
              font-size: 12px;
            }
            .highlight-badge strong {
              color: #111827;
              font-size: 13px;
              font-family: monospace;
            }
            .skills-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              margin: 12px 0 16px 0;
              font-size: 12px;
            }
            .skill-item {
              background: #F9FAFB;
              border-left: 3px solid #F59E0B;
              padding: 6px 10px;
              color: #1F2937;
            }
            .signoff-section {
              margin-top: 24px;
              padding-top: 16px;
              border-top: 1px solid #E5E7EB;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .signature-block {
              display: flex;
              flex-direction: column;
            }
            .signature-cursive {
              font-family: "Brush Script MT", cursive, Georgia, serif;
              font-size: 38px;
              color: #111827;
              margin-bottom: -6px;
            }
            .signatory-name {
              font-weight: 800;
              font-size: 14px;
              color: #111827;
            }
            .signatory-title {
              font-size: 11px;
              color: #6B7280;
            }
            .verification-qr {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .verification-qr img {
              width: 82px;
              height: 82px;
              border: 1px solid #E5E7EB;
              border-radius: 6px;
            }
            .qr-text {
              font-size: 10px;
              color: #6B7280;
              line-height: 1.4;
            }
            .qr-text strong {
              color: #111827;
            }
            .footer-note {
              margin-top: 18px;
              text-align: center;
              font-size: 9.5px;
              color: #9CA3AF;
              border-top: 1px solid #F3F4F6;
              padding-top: 8px;
            }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <div>
              <div class="brand-title">SarlaYash Mission</div>
              <div class="brand-sub">Visual Business Engine • Executive Endorsement Council</div>
            </div>
            <div class="meta-block">
              <div>Ref: <strong>${config.candidateId}-LOR</strong></div>
              <div>Date: <strong>${config.issueDate}</strong></div>
              <div>Validation: <strong>Official Institutional Endorsement</strong></div>
            </div>
          </div>

          <div class="salutation">
            TO WHOM IT MAY CONCERN / EXECUTIVE HIRING COMMITTEE
          </div>

          <p>
            It is my distinct professional honor to provide this institutional Letter of Recommendation on behalf of 
            <strong style="color: #111827; font-size: 14.5px;">${config.candidateName}</strong>, 
            who has demonstrated verified quantitative excellence and achieved accredited status as an elite 
            <strong>Visual Business Engineer</strong> within the SarlaYash Mission Executive Analytics curriculum.
          </p>

          <div class="highlight-badge">
            <span>Candidate Assessment Standing:</span>
            <strong>Score: ${config.masterAssessmentScore}% • Top ${100 - config.percentileRank}% (99th Percentile)</strong>
            <span>Verified Credential ID:</span>
            <strong>${config.candidateId}</strong>
          </div>

          <p>
            Unlike candidates whose credentials rest upon passive video lecture consumption, ${config.candidateName} has completed 
            over 30 intensive hours of rigorous, in-browser business simulation engineering under active timer constraints. 
            Throughout this evaluation, the candidate solved multi-channel corporate challenges with zero external software aids, 
            building resilient data architecture from first principles.
          </p>

          <p>
            Specifically, the candidate was comprehensively tested across the following core technical and strategic competencies:
          </p>

          <div class="skills-grid">
            <div class="skill-item"><strong>1. Resilient Data Architecture:</strong> Advanced data cleaning (TRIM, TEXTSPLIT, regularized mixed references), anomaly detection, and schema reconciliation.</div>
            <div class="skill-item"><strong>2. Multi-Condition Logic Modeling:</strong> Complex nested logic, multi-criteria aggregates (SUMIFS, COUNTIFS, AVERAGEIFS), and what-if sensitivity engines.</div>
            <div class="skill-item"><strong>3. High-Performance Retrieval:</strong> Two-way matrix lookups using modern XLOOKUP, INDEX+MATCH, and dynamic array operators (FILTER, SORT, UNIQUE).</div>
            <div class="skill-item"><strong>4. Financial & Statistical Math:</strong> Amortization mechanics (PMT), investment discounting (NPV, IRR), distribution analysis (PERCENTILE, STDEV).</div>
            <div class="skill-item"><strong>5. Multi-Dimensional BI Synthesis:</strong> Pivot table architecture, interactive slicers, calculated fields, and executive KPI dashboard control towers.</div>
            <div class="skill-item"><strong>6. Full-Stack Spreadsheet Agility:</strong> Fluency across both Microsoft Excel and Google Sheets enterprise ecosystems (VBA vs Apps Script, Power Query vs BigQuery).</div>
          </div>

          <p>
            In our 60-Minute Master Assessment—encompassing 100 scenario-driven evaluation MCQs and 50 live spreadsheet exercises 
            with randomized sequence controls—${config.candidateName} exhibited superior composure, flawless analytical velocity, 
            and deep conceptual grasp of the underlying business imperatives guiding corporate leadership.
          </p>

          <p>
            I endorse ${config.candidateName} with the highest degree of confidence for roles in 
            <strong>Business Intelligence, Financial Modeling, Management Consulting, Data Strategy, and Corporate Analytics</strong>. 
            The candidate possesses the rare ability to translate raw transactional data into unambiguous executive decision-making clarity.
          </p>

          <div class="signoff-section">
            <div class="signature-block">
              <div class="signature-cursive">Kapil</div>
              <div class="signatory-name">KAPIL NARULA</div>
              <div class="signatory-title">Lead Program Architect & Data Executive</div>
              <div class="signatory-title">SarlaYash Mission • Visual Business Engine</div>
              <div class="signatory-title" style="margin-top: 3px; font-family: monospace; color: #9CA3AF;">kapil@visualbusinessengine.internal</div>
            </div>

            <div class="verification-qr">
              <img src="${qrSrc}" alt="ISO Verification QR Code" />
              <div class="qr-text">
                <div><strong>ISO Scannable QR Matrix</strong></div>
                <div>Instant Portal Verification</div>
                <div>ID: ${config.candidateId}</div>
                <div>Status: Certified Active</div>
              </div>
            </div>
          </div>

          <div class="footer-note">
            SarlaYash Mission • Empowering Global Business Analytics • 10% Concept + 90% Hands-On Simulation Architecture • © 2026
          </div>

          <script>
            setTimeout(() => {
              window.focus();
              window.print();
            }, 350);
          </script>
        </body>
      </html>
    `);
    win.document.close();
  });
}
