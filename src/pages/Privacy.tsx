import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-hero opacity-30 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(262_83%_58%/0.15),transparent_50%)]" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-3xl font-semibold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8 text-sm">Last updated: March 2026</p>

        <div className="space-y-6">
          <Section title="1. Information We Collect">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Account details: name, email address, grade level, and school (if provided)</li>
              <li>Usage data: lesson progress, quiz scores, trading simulation activity, and XP earned</li>
              <li>Technical data: browser type, device info, and IP address for security purposes</li>
              <li>We do <strong className="text-foreground">not</strong> collect financial, payment, or banking information</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Data">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>To provide and personalize your learning experience</li>
              <li>To track progress, award achievements, and maintain streaks</li>
              <li>To allow educators to monitor class performance (educator accounts only)</li>
              <li>To improve platform features and fix bugs</li>
              <li>We will <strong className="text-foreground">never</strong> sell your personal data to third parties</li>
            </ul>
          </Section>

          <Section title="3. Data Sharing">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Educators can view aggregated and individual progress of students in their classes</li>
              <li>Community features (posts, comments) are visible to other authenticated users</li>
              <li>We may share anonymized, aggregated data for research or improvement purposes</li>
              <li>We will disclose data only if required by law or to protect platform safety</li>
            </ul>
          </Section>

          <Section title="4. Data Security">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>All data is encrypted in transit and at rest</li>
              <li>Access to user data is restricted to authorized personnel only</li>
              <li>We use industry-standard security practices to protect your information</li>
              <li>Passwords are hashed and never stored in plain text</li>
            </ul>
          </Section>

          <Section title="5. Your Rights">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>You can view and update your profile information at any time</li>
              <li>You can request deletion of your account and associated data</li>
              <li>You can opt out of non-essential communications</li>
              <li>For data requests, contact us at privacy@euphoria.app</li>
            </ul>
          </Section>

          <Section title="6. Minors">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Euphoria is designed for students and may be used by minors with parental/guardian or educator consent</li>
              <li>We comply with applicable child privacy regulations</li>
              <li>Parents or guardians may request access to or deletion of their child's data</li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    {children}
  </div>
);

export default Privacy;
