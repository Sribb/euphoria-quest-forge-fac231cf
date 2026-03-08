import jsPDF from "jspdf";
import { DpaFormData } from "../hooks/useDpaRecords";
import {
  STATE_ADDENDA,
  EXHIBIT_A_DATA_ELEMENTS,
  EXHIBIT_B_SECURITY,
  EXHIBIT_C_SUBPROCESSORS,
} from "../data/dpaContent";
import { format, addYears } from "date-fns";

const MARGIN = 20;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;

function addPage(doc: jsPDF): number {
  doc.addPage();
  return MARGIN;
}

function heading(doc: jsPDF, y: number, text: string, size = 14): number {
  if (y > 260) y = addPage(doc);
  doc.setFontSize(size).setFont("helvetica", "bold");
  doc.text(text, MARGIN, y);
  return y + size * 0.5 + 4;
}

function body(doc: jsPDF, y: number, text: string): number {
  doc.setFontSize(10).setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(text, CONTENT_W);
  for (const line of lines) {
    if (y > 275) y = addPage(doc);
    doc.text(line, MARGIN, y);
    y += 5;
  }
  return y + 2;
}

function bulletList(doc: jsPDF, y: number, items: string[]): number {
  doc.setFontSize(10).setFont("helvetica", "normal");
  for (const item of items) {
    const wrapped = doc.splitTextToSize(`• ${item}`, CONTENT_W - 6);
    for (const line of wrapped) {
      if (y > 275) y = addPage(doc);
      doc.text(line, MARGIN + 4, y);
      y += 5;
    }
    y += 1;
  }
  return y + 2;
}

export function generateDpaPdf(formData: DpaFormData): Blob {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const startDate = new Date(formData.contract_start_date);
  const endDate = addYears(startDate, formData.term_years);
  let y = MARGIN;

  // Title
  doc.setFontSize(18).setFont("helvetica", "bold");
  doc.text("DATA PROCESSING AGREEMENT", PAGE_W / 2, y, { align: "center" });
  y += 10;
  doc.setFontSize(10).setFont("helvetica", "normal");
  doc.text(`Generated: ${format(new Date(), "MMMM d, yyyy")}`, PAGE_W / 2, y, { align: "center" });
  y += 12;

  // Parties
  y = heading(doc, y, "PARTIES");
  y = body(doc, y, `This Data Processing Agreement ("Agreement") is entered into between:`);
  y += 2;
  y = body(doc, y, `DATA CONTROLLER (the "District"):\n${formData.district_name}\n${formData.district_address}\nAuthorized Signatory: ${formData.signatory_name}, ${formData.signatory_title}\nEmail: ${formData.signatory_email}`);
  y += 2;
  y = body(doc, y, `DATA PROCESSOR (the "Provider"):\nEuphoria Education, Inc.\n123 Learning Lane, Suite 400\nSan Francisco, CA 94105\nAuthorized Representative: Sarah Chen, Chief Privacy Officer\nEmail: privacy@euphoria.edu`);
  y += 4;

  // Term
  y = heading(doc, y, "1. TERM");
  y = body(doc, y, `This Agreement is effective from ${format(startDate, "MMMM d, yyyy")} through ${format(endDate, "MMMM d, yyyy")} (${formData.term_years}-year term). This Agreement covers data processing activities for approximately ${formData.student_count.toLocaleString()} students.`);

  // Purpose
  y = heading(doc, y, "2. PURPOSE AND SCOPE");
  y = body(doc, y, "The District engages the Provider to deliver the Euphoria financial literacy education platform to the District's students. In the course of providing these services, the Provider will process student education records and personally identifiable information as described in Exhibit A.");
  y = body(doc, y, "The Provider shall process student data solely for the purpose of delivering and improving the educational services described herein, and for no other commercial purpose.");

  // Obligations
  y = heading(doc, y, "3. PROVIDER OBLIGATIONS");
  y = bulletList(doc, y, [
    "Process student data only on documented instructions from the District.",
    "Ensure that persons authorized to process student data have committed to confidentiality.",
    "Implement appropriate technical and organizational security measures as described in Exhibit B.",
    "Not engage another processor without prior written authorization from the District. Current sub-processors are listed in Exhibit C.",
    "Assist the District in responding to requests from data subjects exercising their rights under FERPA.",
    "Delete or return all student data upon termination of services, at the District's election.",
    "Make available to the District all information necessary to demonstrate compliance with this Agreement.",
  ]);

  // FERPA
  y = heading(doc, y, "4. FERPA COMPLIANCE");
  y = body(doc, y, "The Provider acknowledges that it is designated as a 'school official' under FERPA (34 CFR § 99.31(a)(1)) with a 'legitimate educational interest' in the student data necessary to perform the services described herein. The Provider shall comply with all applicable requirements of FERPA, including but not limited to the prohibition on re-disclosure of education records.");

  // Breach
  y = heading(doc, y, "5. DATA BREACH NOTIFICATION");
  y = body(doc, y, "In the event of a security breach involving student data, Provider shall: (a) notify the District within 72 hours of discovery; (b) investigate and remediate the breach; (c) provide a detailed written report within 10 business days; (d) cooperate with the District and applicable regulatory authorities.");

  // Termination
  y = heading(doc, y, "6. TERMINATION AND DATA RETURN");
  y = body(doc, y, "Upon expiration or termination of this Agreement, Provider shall, at the District's election, delete or return all student data within 30 days and provide written certification of deletion. Provider may retain anonymized, aggregate data that cannot be used to identify individual students.");

  // Exhibit A
  y = addPage(doc);
  y = heading(doc, y, "EXHIBIT A: DESCRIPTION OF DATA PROCESSING", 16);
  y += 4;
  for (const group of EXHIBIT_A_DATA_ELEMENTS) {
    y = heading(doc, y, group.category, 12);
    y = body(doc, y, `Purpose: ${group.purpose}`);
    y = bulletList(doc, y, group.elements);
  }

  // Exhibit B
  y = addPage(doc);
  y = heading(doc, y, "EXHIBIT B: DATA SECURITY PRACTICES", 16);
  y += 4;
  for (const section of EXHIBIT_B_SECURITY) {
    y = heading(doc, y, section.title, 12);
    y = body(doc, y, section.description);
    y += 2;
  }

  // Exhibit C
  y = addPage(doc);
  y = heading(doc, y, "EXHIBIT C: AUTHORIZED SUB-PROCESSORS", 16);
  y += 4;
  for (const sp of EXHIBIT_C_SUBPROCESSORS) {
    y = heading(doc, y, sp.name, 11);
    y = body(doc, y, `Service: ${sp.service}\nLocation: ${sp.location}\nData Processed: ${sp.dataProcessed}`);
    y += 2;
  }

  // State-specific addenda
  const addendum = STATE_ADDENDA[formData.state];
  if (addendum) {
    y = addPage(doc);
    y = heading(doc, y, `STATE-SPECIFIC ADDENDUM`, 16);
    y += 2;
    y = heading(doc, y, addendum.title, 13);
    y = body(doc, y, addendum.summary);
    y += 2;
    y = bulletList(doc, y, addendum.clauses);
  }

  // Signature page
  y = addPage(doc);
  y = heading(doc, y, "SIGNATURE PAGE", 16);
  y += 8;

  // Provider signature (pre-signed)
  y = heading(doc, y, "DATA PROCESSOR — Euphoria Education, Inc.", 12);
  y += 4;
  doc.setFont("helvetica", "italic").setFontSize(14);
  doc.text("Sarah Chen", MARGIN, y);
  y += 6;
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.line(MARGIN, y, MARGIN + 80, y);
  y += 5;
  doc.text("Name: Sarah Chen", MARGIN, y); y += 5;
  doc.text("Title: Chief Privacy Officer", MARGIN, y); y += 5;
  doc.text(`Date: ${format(new Date(), "MMMM d, yyyy")}`, MARGIN, y);
  y += 16;

  // District signature (blank)
  y = heading(doc, y, `DATA CONTROLLER — ${formData.district_name}`, 12);
  y += 10;
  doc.line(MARGIN, y, MARGIN + 80, y);
  y += 5;
  doc.text(`Name: ${formData.signatory_name}`, MARGIN, y); y += 5;
  doc.text(`Title: ${formData.signatory_title}`, MARGIN, y); y += 5;
  doc.text("Date: ____________________", MARGIN, y);

  return doc.output("blob");
}
