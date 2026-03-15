import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CertificateData {
  recipientName: string;
  title: string;
  description: string;
  issueDate: string;
  credentialId: string;
  tier: string;
}

export async function downloadCertificatePDF(element: HTMLElement, data: CertificateData) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`Euphoria-Certificate-${data.credentialId}.pdf`);
}

export function generateVerificationUrl(credentialId: string) {
  return `${window.location.origin}/verify/${credentialId}`;
}

export function generateLinkedInShareUrl(data: CertificateData) {
  const params = new URLSearchParams({
    name: data.title,
    organizationName: "Euphoria",
    issueYear: new Date(data.issueDate).getFullYear().toString(),
    issueMonth: (new Date(data.issueDate).getMonth() + 1).toString(),
    certUrl: generateVerificationUrl(data.credentialId),
    certId: data.credentialId,
  });
  return `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&${params.toString()}`;
}
