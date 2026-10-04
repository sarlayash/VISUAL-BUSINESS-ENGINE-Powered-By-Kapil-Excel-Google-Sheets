// High-Resolution FAANG-grade Canvas Certificate Renderer & PNG/PDF Exporter
// Brand Theme: Black x Gold x White (SarlaYash Mission Presents | Powered by Kapil)

export interface CertificateConfig {
  learnerName: string;
  type: 'final' | 'module';
  moduleTitle?: string;
  certificateId: string;
  issueDate: string;
  score: number;
}

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

  // 6. Recipient Learner Name
  const nameY = config.type === 'final' ? 450 : 490;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 58px Georgia, serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(config.learnerName || 'Kapil', width / 2, nameY);

  // Underline for name
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 280, nameY + 20);
  ctx.lineTo(width / 2 + 280, nameY + 20);
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

  // Right: Certificate Verification Details + QR Code Mock
  const qrX = width - 360;
  drawSimulatedQrCode(ctx, qrX, footerY - 50, 90);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#E5E7EB';
  ctx.font = '600 15px -apple-system, sans-serif';
  ctx.fillText(`ID: ${config.certificateId}`, qrX + 105, footerY - 32);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '400 14px -apple-system, sans-serif';
  ctx.fillText(`Issued: ${config.issueDate}`, qrX + 105, footerY - 10);
  ctx.fillText(`Score: ${config.score}% Verified`, qrX + 105, footerY + 12);
  ctx.fillStyle = '#F59E0B';
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillText('Scan QR to verify on portal', qrX + 105, footerY + 34);
}

// Vector QR Code Pattern Generator
function drawSimulatedQrCode(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x, y, size, size);

  ctx.fillStyle = '#07080B';
  const cellSize = size / 21; // 21x21 QR Grid

  // Helper for QR finder patterns
  const drawFinder = (fx: number, fy: number) => {
    ctx.fillRect(x + fx * cellSize, y + fy * cellSize, 7 * cellSize, 7 * cellSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + (fx + 1) * cellSize, y + (fy + 1) * cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = '#07080B';
    ctx.fillRect(x + (fx + 2) * cellSize, y + (fy + 2) * cellSize, 3 * cellSize, 3 * cellSize);
  };

  drawFinder(0, 0);
  drawFinder(14, 0);
  drawFinder(0, 14);

  // Deterministic faux QR payload dots
  for (let r = 0; r < 21; r++) {
    for (let c = 0; c < 21; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c > 13) || (r > 13 && c < 8)) continue;
      if ((r * 13 + c * 7 + (r ^ c)) % 3 === 0) {
        ctx.fillRect(x + c * cellSize, y + r * cellSize, cellSize, cellSize);
      }
    }
  }
  ctx.restore();
}

// Download Canvas as high-resolution PNG
export function downloadCertificatePng(canvas: HTMLCanvasElement, filename: string): void {
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}

// Open Print dialog / Save as PDF
export function printCertificatePdf(canvas: HTMLCanvasElement, title: string): void {
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const win = window.open('', '_blank');
  if (!win) {
    alert('Please allow popups to download/print the certificate as PDF.');
    return;
  }
  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: landscape; margin: 0; }
          body { margin: 0; background: #07080B; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          img { width: 100vw; height: auto; max-height: 100vh; object-fit: contain; }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" onload="window.print();" />
      </body>
    </html>
  `);
  win.document.close();
}
