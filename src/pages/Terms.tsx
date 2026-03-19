import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
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

        <h1 className="text-3xl font-semibold mb-2">Terms &amp; Conditions</h1>
        <p className="text-muted-foreground mb-8 text-sm">Last updated: March 2026</p>

        <div className="space-y-6">
          <Section title="1. Acceptance of Terms">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>By creating an account or using Euphoria, you agree to these Terms &amp; Conditions</li>
              <li>If you do not agree, you may not access or use the platform</li>
              <li>We may update these terms at any time — continued use constitutes acceptance</li>
            </ul>
          </Section>

          <Section title="2. Educational Purpose Only">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Euphoria is a <strong className="text-foreground">simulated learning environment</strong> for financial education</li>
              <li>All trading activities use virtual currency — no real money is involved</li>
              <li>Content does <strong className="text-foreground">not</strong> constitute financial, investment, or trading advice</li>
              <li>You should consult a qualified professional before making any real investment decisions</li>
            </ul>
          </Section>

          <Section title="3. User Accounts">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>You must provide accurate and complete information during registration</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>One account per person — sharing accounts is not permitted</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
            </ul>
          </Section>

          <Section title="4. Acceptable Use">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Use the platform only for lawful, educational purposes</li>
              <li>Do not attempt to exploit, hack, or reverse-engineer any part of the platform</li>
              <li>Do not harass, bully, or share inappropriate content in community features</li>
              <li>Do not impersonate other users, educators, or staff</li>
            </ul>
          </Section>

          <Section title="5. Intellectual Property">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>All lessons, games, simulations, and content are owned by Euphoria</li>
              <li>You may not reproduce, distribute, or commercially use any platform content</li>
              <li>User-generated content (posts, comments) remains yours, but you grant us a license to display it</li>
            </ul>
          </Section>

          <Section title="6. Limitation of Liability">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Euphoria is provided "as is" without warranties of any kind</li>
              <li>We are not liable for any losses arising from decisions based on platform content</li>
              <li>Simulated results do not guarantee real-world performance</li>
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

export default Terms;
