import { ArrowLeft, Download, Shield, Database, Clock, UserCheck, Lock, FileText, School, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FERPA_SECTIONS = [
  {
    icon: School,
    title: '1. School Official Designation',
    content: [
      'Under FERPA (34 CFR § 99.31(a)(1)), a school may disclose personally identifiable information (PII) from education records to a contractor or consultant that qualifies as a "school official" when:',
      '• The contractor performs a service that the school would otherwise use employees to perform',
      '• The contractor is under the direct control of the school regarding the use and maintenance of education records',
      '• The contractor uses PII only for the purposes for which the disclosure was made',
      '• The contractor meets the criteria specified in the school\'s annual FERPA notification',
      'Euphoria meets all four criteria. We provide financial literacy instruction and assessment services — functions schools would otherwise perform with staff. All student data use is governed by a Data Processing Agreement (DPA) signed with each district.',
    ],
  },
  {
    icon: Database,
    title: '2. Student Data Collected',
    content: [
      'Euphoria collects only the minimum data necessary to deliver its educational services:',
    ],
    table: {
      headers: ['Data Category', 'Examples', 'Purpose'],
      rows: [
        ['Account identifiers', 'Name, email, student ID (if provided by school)', 'Authentication & account management'],
        ['Learning progress', 'Lesson completion, quiz scores, XP earned, mastery levels', 'Personalized learning path & educator reporting'],
        ['Simulation activity', 'Virtual trades, portfolio performance, scenario decisions', 'Practice-based financial education'],
        ['Engagement metrics', 'Login streaks, time on task, feature usage', 'Educator dashboards & platform improvement'],
        ['Class membership', 'Class enrollment, educator assignments', 'Roster management & grade passback'],
        ['Device/technical', 'Browser type, OS (no precise geolocation)', 'Security, accessibility, bug resolution'],
      ],
    },
    footer: [
      'We do NOT collect: Social Security numbers, financial account information, biometric data, precise geolocation, social media accounts, or any data beyond what is listed above.',
    ],
  },
  {
    icon: Lock,
    title: '3. Data Use Restrictions',
    content: [
      '• Student data is used exclusively to provide and improve educational services',
      '• We do NOT sell, rent, or trade student personal information — ever',
      '• We do NOT use student data for targeted advertising or marketing',
      '• We do NOT build advertising profiles from student information',
      '• We do NOT share student data with third parties except as required to operate the service (e.g., cloud infrastructure) or as required by law',
      '• All sub-processors are contractually bound to the same data protection obligations',
    ],
  },
  {
    icon: Eye,
    title: '4. Parental & Eligible Student Rights',
    content: [
      'Parents (or eligible students aged 18+) have the right to:',
      '• Inspect and review their child\'s education records maintained by Euphoria',
      '• Request correction of inaccurate or misleading information',
      '• Request deletion of their child\'s data (subject to contractual obligations with the school)',
      '• File a complaint with the U.S. Department of Education',
      'To exercise any of these rights, contact your school administrator or email privacy@euphoria.edu. We will respond within 30 calendar days.',
    ],
  },
  {
    icon: Clock,
    title: '5. Data Retention & Deletion',
    content: [
      'Euphoria retains student data only as long as necessary to fulfill educational purposes:',
    ],
    table: {
      headers: ['Data Type', 'Retention Period', 'Deletion Method'],
      rows: [
        ['Active student accounts', 'Duration of school contract + 60 days', 'Automated purge after contract end'],
        ['Learning progress & scores', 'Duration of enrollment + 1 academic year', 'Cascade deletion with account'],
        ['Simulation/trading history', 'Duration of enrollment', 'Cascade deletion with account'],
        ['De-identified analytics', 'Up to 3 years (aggregate only)', 'Cannot be re-identified'],
        ['Server logs (technical)', '90 days', 'Automatic rotation & deletion'],
      ],
    },
    footer: [
      'Upon contract termination or district request, all identifiable student data is permanently deleted within 60 days. Districts may request an earlier deletion timeline in their DPA.',
    ],
  },
  {
    icon: Shield,
    title: '6. Security Safeguards',
    content: [
      'Euphoria implements industry-standard security measures to protect student data:',
      '• Encryption in transit (TLS 1.3) and at rest (AES-256)',
      '• Row-Level Security (RLS) ensuring users can only access their own data',
      '• Role-based access control separating student, educator, and admin permissions',
      '• Regular security audits and vulnerability assessments',
      '• SOC 2 Type II compliant cloud infrastructure (via Supabase/AWS)',
      '• Multi-factor authentication available for educator and admin accounts',
      '• Incident response plan with 72-hour breach notification to affected districts',
    ],
  },
  {
    icon: FileText,
    title: '7. Data Processing Agreements',
    content: [
      'Euphoria offers a comprehensive Data Processing Agreement (DPA) to all school districts that includes:',
      '• Specific enumeration of data elements collected',
      '• Prohibited uses of student data',
      '• Security standards and breach notification procedures',
      '• Data return and deletion obligations',
      '• FERPA, COPPA, and state-specific compliance commitments',
      '• Sub-processor disclosure and management',
      'We also participate in the Student Data Privacy Consortium (SDPC) National Data Privacy Agreement process where available.',
    ],
  },
  {
    icon: UserCheck,
    title: '8. COPPA Compliance',
    content: [
      'For students under 13, Euphoria relies on school consent under the COPPA school authorization exception:',
      '• Schools may consent on behalf of parents for the use of educational technology',
      '• We collect no more information than reasonably necessary',
      '• We provide schools the ability to review and delete children\'s data',
      '• We do not condition participation on unnecessary data disclosure',
    ],
  },
];

const Ferpa = () => {
  const navigate = useNavigate();

  const handleDownloadPDF = () => {
    // Generate a printable version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Euphoria FERPA Compliance Documentation</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; line-height: 1.6; }
          h1 { font-size: 24px; margin-bottom: 4px; }
          h2 { font-size: 18px; margin-top: 32px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; }
          p, li { font-size: 14px; }
          ul { padding-left: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
          th, td { border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; }
          th { background: #f3f4f6; font-weight: 600; }
          .subtitle { color: #666; font-size: 14px; margin-bottom: 24px; }
          .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #666; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>Euphoria — FERPA Compliance Documentation</h1>
        <p class="subtitle">Prepared for district compliance review · Last updated: March 2026</p>
        ${FERPA_SECTIONS.map(s => `
          <h2>${s.title}</h2>
          ${s.content.map(p => p.startsWith('•') ? '' : `<p>${p}</p>`).join('')}
          ${s.content.some(p => p.startsWith('•')) ? `<ul>${s.content.filter(p => p.startsWith('•')).map(p => `<li>${p.slice(2)}</li>`).join('')}</ul>` : ''}
          ${s.table ? `<table><thead><tr>${s.table.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>` : ''}
          ${(s.footer || []).map(f => `<p><em>${f}</em></p>`).join('')}
        `).join('')}
        <div class="footer">
          <p>© 2026 Euphoria. This document is provided for informational purposes to assist school districts with FERPA compliance reviews.</p>
          <p>For questions, contact: privacy@euphoria.edu</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-hero opacity-30 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(262_83%_58%/0.15),transparent_50%)]" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-7 h-7 text-primary" />
              <h1 className="text-3xl font-bold">FERPA Compliance</h1>
            </div>
            <p className="text-muted-foreground text-sm">Last updated: March 2026</p>
          </div>
          <Button onClick={handleDownloadPDF} variant="outline" className="gap-2 shrink-0">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>

        {/* Summary card */}
        <Card className="p-5 mb-8 border-primary/20 bg-primary/5">
          <p className="text-sm text-foreground leading-relaxed">
            Euphoria is committed to protecting student privacy and complying with the{" "}
            <strong>Family Educational Rights and Privacy Act (FERPA)</strong>, the{" "}
            <strong>Children's Online Privacy Protection Act (COPPA)</strong>, and applicable state
            student data privacy laws. This page documents our compliance posture for district
            administrators and compliance officers conducting technology reviews.
          </p>
        </Card>

        {/* Sections */}
        <div className="space-y-8">
          {FERPA_SECTIONS.map((section) => (
            <section key={section.title} className="space-y-3">
              <div className="flex items-center gap-2">
                <section.icon className="w-5 h-5 text-primary shrink-0" />
                <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
              </div>

              {section.content.map((para, i) =>
                para.startsWith("•") ? (
                  <p key={i} className="text-sm text-muted-foreground pl-4">{para}</p>
                ) : (
                  <p key={i} className="text-sm text-muted-foreground">{para}</p>
                )
              )}

              {section.table && (
                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-sm border border-border/50 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-muted/40">
                        {section.table.headers.map((h) => (
                          <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-foreground border-b border-border/30">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, ri) => (
                        <tr key={ri} className="border-b border-border/20 last:border-0">
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-3 py-2 text-xs text-muted-foreground">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {section.footer?.map((f, i) => (
                <p key={i} className="text-xs text-muted-foreground italic mt-2">{f}</p>
              ))}
            </section>
          ))}
        </div>

        {/* Contact */}
        <Card className="p-5 mt-10 border-border/50 bg-muted/20">
          <h3 className="font-semibold text-sm mb-2">Questions or DPA Requests</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            For FERPA-related inquiries, DPA negotiations, or data deletion requests,
            contact us at <strong className="text-foreground">privacy@euphoria.edu</strong>.
            We aim to respond to all compliance inquiries within 5 business days.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Ferpa;
