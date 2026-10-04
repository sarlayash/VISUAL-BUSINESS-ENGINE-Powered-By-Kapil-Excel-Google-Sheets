// High-Resolution FAANG-grade Canvas Certificate & Badge Renderer & PNG/PDF Exporter
// Brand Theme: Black x Gold x White (SarlaYash Mission Presents | Powered by Kapil)
import QRCode from 'qrcode';

export interface CertificateConfig {
  learnerName: string;
  type: 'final' | 'module';
  moduleTitle?: string;
  certificateId: string;
  issueDate: string;
  score: number;
}

export interface BadgeConfig {
  badgeTitle: string;
  badgeModule: string;
  badgeIcon: string;
  badgeDesc: string;
  learnerName: string;
  certificateId: string;
  score: number;
  issueDate: string;
  isGrand?: boolean;
}

// Generate the public verification URL
export function getVerificationUrl(certId: string): string {
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    const pathname = window.location.pathname.replace(/\/$/, '');
    return `${origin}${pathname}/?verify=${encodeURIComponent(certId)}`;
  }
  return `https://sarlayash.github.io/VISUAL-BUSINESS-ENGINE-Powered-By-Kapil-Excel-Google-Sheets/?verify=${encodeURIComponent(certId)}`;
}

// Draw a real, ISO-compliant scannable QR Code onto a Canvas 2D context
export function drawRealQrCode(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number
): void {
  try {
    const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
    const moduleCount = qr.modules.size;
    const padding = 6; // white quiet zone
    const innerSize = size - padding * 2;
    const cellSize = innerSize / moduleCount;

    ctx.save();
    // 1. Crisp white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x, y, size, size);

    // 2. Gold border card framing
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, size, size);

    // 3. Render real dark modules
    ctx.fillStyle = '#07080B';
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (qr.modules.get(r, c)) {
          ctx.fillRect(
            x + padding + c * cellSize,
            y + padding + r * cellSize,
            cellSize + 0.4,
            cellSize + 0.4
          );
        }
      }
    }
    ctx.restore();
  } catch (err) {
    console.error('Failed to generate QR code', err);
  }
}

// Draw Full Enterprise Certificate to Canvas (1600 x 1130)
export function drawCertificateToCanvas(
  canvas: HTMLCanvasElement,
  config: CertificateConfig
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 1600;
  const height = 1130;
  canvas.width = width;
  canvas.height = height;

  // 1. Deep Obsidian Background
  ctx.fillStyle = '#07080B';
  ctx.fillRect(0, 0, width, height);

  // Subtle radial gradient backdrop
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 800);
  bgGrad.addColorStop(0, '#151722');
  bgGrad.addColorStop(0.6, '#0B0D14');
  bgGrad.addColorStop(1, '#050608');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Multi-tier Gold Guilloche Borders
  // Outer Gold Border
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Inner Thin Gold Line
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(55, 55, width - 110, height - 110);

  // Corner Ornaments
  const drawCorner = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(40, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 40);
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(8, 8, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawCorner(40, 40, 0);
  drawCorner(width - 40, 40, Math.PI / 2);
  drawCorner(width - 40, height - 40, Math.PI);
  drawCorner(40, height - 40, -Math.PI / 2);

  // 3. Header: SarlaYash Mission Presents
  ctx.textAlign = 'center';
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '600 20px -apple-system, sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('SARLAYASH MISSION PRESENTS', width / 2, 130);

  // 4. Main Title
  const goldGrad = ctx.createLinearGradient(width / 2 - 400, 0, width / 2 + 400, 0);
  goldGrad.addColorStop(0, '#FDE68A');
  goldGrad.addColorStop(0.5, '#F59E0B');
  goldGrad.addColorStop(1, '#D97706');

  ctx.fillStyle = goldGrad;
  ctx.font = 'bold 54px -apple-system, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('VISUAL BUSINESS ENGINE', width / 2, 205);

  // Subtitle
  ctx.fillStyle = '#E5E7EB';
  ctx.font = '500 22px -apple-system, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('EXCEL + GOOGLE SHEETS BUSINESS ANALYTICS PROGRAM', width / 2, 250);

  // Thin separator with star
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 250, 280);
  ctx.lineTo(width / 2 - 30, 280);
  ctx.moveTo(width / 2 + 30, 280);
  ctx.lineTo(width / 2 + 250, 280);
  ctx.stroke();

  ctx.fillStyle = '#F59E0B';
  ctx.font = '24px sans-serif';
  ctx.fillText('✦', width / 2, 288);

  // 5. Certification Type
  ctx.fillStyle = '#D1D5DB';
  ctx.font = '300 24px -apple-system, sans-serif';
  ctx.letterSpacing = '1px';
  if (config.type === 'final') {
    ctx.fillText('THIS IS TO CERTIFY THAT', width / 2, 360);
  } else {
    ctx.fillText('MODULE CERTIFICATE OF COMPLETION', width / 2, 340);
    ctx.fillStyle = '#FBBF24';
    ctx.font = '600 26px -apple-system, sans-serif';
    ctx.fillText(config.moduleTitle || 'Advanced Business Analytics', width / 2, 380);
    ctx.fillStyle = '#D1D5DB';
    ctx.font = '300 22px -apple-system, sans-serif';
    ctx.fillText('Awarded To', width / 2, 420);
  }

  // 6. Recipient Learner Name with Auto-Scale (Prevents cropping of long names)
  const nameY = config.type === 'final' ? 450 : 490;
  ctx.fillStyle = '#FFFFFF';

  let nameFontSize = 58;
  ctx.font = `bold ${nameFontSize}px Georgia, serif`;
  ctx.letterSpacing = '2px';
  const rawName = config.learnerName || 'Kapil';
  let nameWidth = ctx.measureText(rawName).width;

  // Dynamically downscale font if name is very long to avoid overflow
  while (nameWidth > 860 && nameFontSize > 26) {
    nameFontSize -= 2;
    ctx.font = `bold ${nameFontSize}px Georgia, serif`;
    nameWidth = ctx.measureText(rawName).width;
  }
  ctx.fillText(rawName, width / 2, nameY);

  // Responsive Underline scaled to match learner name
  const underlinePadding = Math.min(60, Math.max(30, nameWidth * 0.12));
  const underlineHalfWidth = Math.min(460, (nameWidth / 2) + underlinePadding);
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - underlineHalfWidth, nameY + 20);
  ctx.lineTo(width / 2 + underlineHalfWidth, nameY + 20);
  ctx.stroke();

  // 7. Statement of Completion
  const descY = nameY + 80;
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '400 22px -apple-system, sans-serif';
  ctx.letterSpacing = '0.5px';
  if (config.type === 'final') {
    ctx.fillText(
      'has demonstrated exceptional mastery in real-world business simulations, data cleaning,',
      width / 2,
      descY
    );
    ctx.fillText(
      'advanced formula modeling, lookup engines, pivot analytics, and executive dashboard architecture.',
      width / 2,
      descY + 34
    );
    ctx.fillStyle = '#F59E0B';
    ctx.font = '600 22px -apple-system, sans-serif';
    ctx.fillText('30 Hours | 100% Hands-On | Zero-Software Architecture | Capstone Verified', width / 2, descY + 76);
  } else {
    ctx.fillText(
      'has successfully solved all industry challenges and passed real-time formula validations.',
      width / 2,
      descY
    );
    ctx.fillStyle = '#F59E0B';
    ctx.font = '600 22px -apple-system, sans-serif';
    ctx.fillText('6 Hours Rigorous Simulation Lab | Verified Analytical Competence', width / 2, descY + 45);
  }

  // 8. Signatures & Metadata Footer
  const footerY = height - 190;

  // Left: Authorized Signatory - Kapil
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'italic 34px "Brush Script MT", cursive, Georgia, serif';
  ctx.fillText('Kapil', 180, footerY);

  ctx.strokeStyle = '#4B5563';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(170, footerY + 12);
  ctx.lineTo(390, footerY + 12);
  ctx.stroke();

  ctx.fillStyle = '#F59E0B';
  ctx.font = '700 16px -apple-system, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('KAPIL', 180, footerY + 36);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '400 14px -apple-system, sans-serif';
  ctx.fillText('Lead Mentor & Program Architect', 180, footerY + 56);
  ctx.fillText('SarlaYash Mission', 180, footerY + 76);

  // Center: Official Gold Foil Seal Badge
  const sealX = width / 2;
  const sealY = height - 200;

  ctx.save();
  ctx.translate(sealX, sealY);

  // Outer scalloped gold circle
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(0, 0, 68, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#111319';
  ctx.beginPath();
  ctx.arc(0, 0, 58, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#FDE68A';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('SARLAYASH', 0, -22);
  ctx.font = 'bold 24px -apple-system, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('VERIFIED', 0, 4);
  ctx.font = '700 11px -apple-system, sans-serif';
  ctx.fillStyle = '#F59E0B';
  ctx.fillText('EXCELLENCE', 0, 24);

  // Ribbons hanging down
  ctx.fillStyle = '#D97706';
  ctx.beginPath();
  ctx.moveTo(-32, 45);
  ctx.lineTo(-44, 95);
  ctx.lineTo(-30, 85);
  ctx.lineTo(-16, 95);
  ctx.lineTo(-14, 45);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(14, 45);
  ctx.lineTo(16, 95);
  ctx.lineTo(30, 85);
  ctx.lineTo(44, 95);
  ctx.lineTo(32, 45);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Right: Certificate Verification Details + Real Scannable QR Code
  const qrSize = 100;
  const qrX = width - 420;
  const qrY = footerY - 45;

  const verifyUrl = getVerificationUrl(config.certificateId);
  drawRealQrCode(ctx, verifyUrl, qrX, qrY, qrSize);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#E5E7EB';
  ctx.font = '600 16px -apple-system, sans-serif';
  ctx.fillText(`ID: ${config.certificateId}`, qrX + qrSize + 16, qrY + 22);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '400 14px -apple-system, sans-serif';
  ctx.fillText(`Issued: ${config.issueDate}`, qrX + qrSize + 16, qrY + 46);
  ctx.fillText(`Score: ${config.score}% Verified`, qrX + qrSize + 16, qrY + 70);

  ctx.fillStyle = '#F59E0B';
  ctx.font = '600 13px -apple-system, sans-serif';
  ctx.fillText('Scan QR to Verify ↗', qrX + qrSize + 16, qrY + 94);
}

// Draw Standalone Badge Accreditation Card to Canvas (800 x 800)
export function drawBadgeToCanvas(
  canvas: HTMLCanvasElement,
  config: BadgeConfig
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const size = 800;
  canvas.width = size;
  canvas.height = size;

  // 1. Deep Obsidian Gradient
  const bgGrad = ctx.createRadialGradient(size / 2, size / 2, 50, size / 2, size / 2, 450);
  bgGrad.addColorStop(0, '#161826');
  bgGrad.addColorStop(0.6, '#0B0D14');
  bgGrad.addColorStop(1, '#050608');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // 2. Gold Foil Framing
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, size - 60, size - 60);

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(42, 42, size - 84, size - 84);

  // 3. Top Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '600 13px -apple-system, sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('SARLAYASH MISSION • ACCREDITED BADGE', size / 2, 85);

  // 4. Large Glowing Badge Shield Emblem
  const sealX = size / 2;
  const sealY = 195;

  ctx.save();
  ctx.translate(sealX, sealY);

  // Gold outer glow circle
  ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
  ctx.beginPath();
  ctx.arc(0, 0, 75, 0, Math.PI * 2);
  ctx.fill();

  // Solid gold outer rim
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(0, 0, 62, 0, Math.PI * 2);
  ctx.fill();

  // Dark inner core
  ctx.fillStyle = '#0F1118';
  ctx.beginPath();
  ctx.arc(0, 0, 54, 0, Math.PI * 2);
  ctx.fill();

  // Badge icon
  ctx.font = '54px sans-serif';
  ctx.fillText(config.badgeIcon || '🥇', 0, 18);
  ctx.restore();

  // 5. Badge Title
  ctx.textAlign = 'center';
  const goldGrad = ctx.createLinearGradient(size / 2 - 250, 0, size / 2 + 250, 0);
  goldGrad.addColorStop(0, '#FDE68A');
  goldGrad.addColorStop(0.5, '#F59E0B');
  goldGrad.addColorStop(1, '#D97706');
  ctx.fillStyle = goldGrad;
  ctx.font = 'bold 30px -apple-system, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(config.badgeTitle, size / 2, 310);

  // Module Category pill
  ctx.fillStyle = '#E5E7EB';
  ctx.font = '600 14px -apple-system, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(config.badgeModule.toUpperCase(), size / 2, 342);

  // Description
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '400 14px -apple-system, sans-serif';
  ctx.letterSpacing = '0.5px';
  ctx.fillText(config.badgeDesc, size / 2, 375);

  // 6. Recipient Section
  ctx.fillStyle = '#D1D5DB';
  ctx.font = '300 14px -apple-system, sans-serif';
  ctx.fillText('Accreditation Awarded To', size / 2, 430);

  ctx.fillStyle = '#FFFFFF';
  let nameFontSize = 36;
  ctx.font = `bold ${nameFontSize}px Georgia, serif`;
  const learnerName = config.learnerName || 'Kapil';
  let nWidth = ctx.measureText(learnerName).width;
  while (nWidth > 580 && nameFontSize > 20) {
    nameFontSize -= 2;
    ctx.font = `bold ${nameFontSize}px Georgia, serif`;
    nWidth = ctx.measureText(learnerName).width;
  }
  ctx.fillText(learnerName, size / 2, 470);

  // 7. QR Code and Verification Strip
  const qrSize = 105;
  const qrX = size / 2 - 190;
  const qrY = 530;

  const verifyUrl = getVerificationUrl(config.certificateId);
  drawRealQrCode(ctx, verifyUrl, qrX, qrY, qrSize);

  // Metadata beside QR
  ctx.textAlign = 'left';
  const metaX = qrX + qrSize + 22;

  ctx.fillStyle = '#10B981';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.fillText(`✓ ${config.score}% Assessment Score Verified`, metaX, qrY + 24);

  ctx.fillStyle = '#E5E7EB';
  ctx.font = '600 14px monospace';
  ctx.fillText(`ID: ${config.certificateId}`, metaX, qrY + 48);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '400 13px -apple-system, sans-serif';
  ctx.fillText(`Issued: ${config.issueDate}`, metaX, qrY + 70);

  ctx.fillStyle = '#F59E0B';
  ctx.font = '600 12px -apple-system, sans-serif';
  ctx.fillText('Publicly Verified on Registry ↗', metaX, qrY + 92);

  // 8. Footer Credit
  ctx.textAlign = 'center';
  ctx.fillStyle = '#6B7280';
  ctx.font = '400 11px -apple-system, sans-serif';
  ctx.fillText('SarlaYash Mission Presents • Powered by Kapil • 100% Verifiable PWA Credential', size / 2, 735);
}

// Download Canvas as high-resolution PNG
export function downloadCertificatePng(canvas: HTMLCanvasElement, filename: string): void {
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}

// Download Badge as high-resolution PNG
export function downloadBadgePng(canvas: HTMLCanvasElement, filename: string): void {
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}

// Open Print dialog / Save Certificate as PDF with zero cropping
export function printCertificatePdf(canvas: HTMLCanvasElement, title: string): void {
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const win = window.open('', '_blank');
  if (!win) {
    alert('Please allow popups to download/print the certificate as PDF.');
    return;
  }
  win.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 0;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background: #07080B !important;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
          }
          .cert-container {
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #07080B;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          img {
            max-width: 100vw;
            max-height: 100vh;
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
            margin: auto;
          }
        </style>
      </head>
      <body>
        <div class="cert-container">
          <img id="cert-img" src="${dataUrl}" alt="${title}" />
        </div>
        <script>
          const img = document.getElementById('cert-img');
          const triggerPrint = () => {
            setTimeout(() => {
              window.focus();
              window.print();
            }, 300);
          };
          if (img.complete) {
            triggerPrint();
          } else {
            img.onload = triggerPrint;
          }
        </script>
      </body>
    </html>
  `);
  win.document.close();
}

// Open Print dialog / Save Badge as PDF with zero cropping
export function printBadgePdf(canvas: HTMLCanvasElement, title: string): void {
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const win = window.open('', '_blank');
  if (!win) {
    alert('Please allow popups to download/print the badge.');
    return;
  }
  win.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          @page {
            size: auto;
            margin: 0;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background: #07080B !important;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .badge-container {
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #07080B;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          img {
            max-width: 90vmin;
            max-height: 90vmin;
            object-fit: contain;
            display: block;
            margin: auto;
            border-radius: 16px;
          }
        </style>
      </head>
      <body>
        <div class="badge-container">
          <img id="badge-img" src="${dataUrl}" alt="${title}" />
        </div>
        <script>
          const img = document.getElementById('badge-img');
          const triggerPrint = () => {
            setTimeout(() => {
              window.focus();
              window.print();
            }, 300);
          };
          if (img.complete) {
            triggerPrint();
          } else {
            img.onload = triggerPrint;
          }
        </script>
      </body>
    </html>
  `);
  win.document.close();
}
