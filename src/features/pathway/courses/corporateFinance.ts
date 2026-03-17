
import { L, c, tr, fb, ds, q, tf, m, sl, sc, bi, pc, vi, cq,
  hookOpener, stakesCard, teachingSlide, microCheck, interactiveGraph,
  caseStudy, misconceptions, keyTermsCards, simulationFinale, summaryCards, whatsNext
} from '../helpers';

// ═══════════════════════════════════════════════════════════════
// UNIQUE SVG GRAPHICS FOR CORPORATE FINANCE LESSON 1
// ═══════════════════════════════════════════════════════════════

const CF1_HOOK_CHART = `<svg viewBox="0 0 700 350" style="width:100%;min-height:280px">
  <defs>
    <linearGradient id="cfGrad1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="cfGrad2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0.8"/>
    </linearGradient>
  </defs>
  <!-- Grid -->
  <line x1="80" y1="60" x2="660" y2="60" stroke="rgba(245,158,11,0.08)" stroke-width="0.5" stroke-dasharray="4 4"/>
  <line x1="80" y1="120" x2="660" y2="120" stroke="rgba(245,158,11,0.08)" stroke-width="0.5" stroke-dasharray="4 4"/>
  <line x1="80" y1="180" x2="660" y2="180" stroke="rgba(245,158,11,0.08)" stroke-width="0.5" stroke-dasharray="4 4"/>
  <line x1="80" y1="240" x2="660" y2="240" stroke="rgba(245,158,11,0.08)" stroke-width="0.5" stroke-dasharray="4 4"/>
  <!-- Revenue flow line -->
  <path d="M80,280 C160,275 200,260 260,220 C320,180 360,140 420,100 C480,60 540,45 600,30 L660,25" fill="none" stroke="url(#cfGrad2)" stroke-width="3" stroke-linecap="round"/>
  <!-- Area fill -->
  <path d="M80,280 C160,275 200,260 260,220 C320,180 360,140 420,100 C480,60 540,45 600,30 L660,25 L660,300 L80,300 Z" fill="url(#cfGrad1)"/>
  <!-- Decision nodes -->
  <circle cx="260" cy="220" r="8" fill="#f59e0b" opacity="0.9"/>
  <text x="260" y="248" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="11">Invest</text>
  <circle cx="420" cy="100" r="8" fill="#10b981" opacity="0.9"/>
  <text x="420" y="128" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="11">Finance</text>
  <circle cx="600" cy="30" r="8" fill="#8b5cf6" opacity="0.9"/>
  <text x="600" y="58" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="11">Distribute</text>
  <!-- Labels -->
  <text x="80" y="300" fill="rgba(255,255,255,0.4)" font-size="12">Revenue</text>
  <text x="660" y="20" fill="#10b981" font-size="15" font-weight="bold" text-anchor="end">$100B+</text>
  <text x="80" y="296" fill="#f59e0b" font-size="14" font-weight="bold">Apple Cash Flow</text>
  <!-- Year labels -->
  <text x="120" y="320" fill="rgba(255,255,255,0.4)" font-size="11" text-anchor="middle">2015</text>
  <text x="370" y="320" fill="rgba(255,255,255,0.4)" font-size="11" text-anchor="middle">2020</text>
  <text x="620" y="320" fill="rgba(255,255,255,0.4)" font-size="11" text-anchor="middle">2024</text>
</svg>`;

const CF1_STAKES_WITHOUT = `<svg viewBox="0 0 360 220" style="width:100%;max-width:420px">
  <!-- Building crumbling -->
  <rect x="120" y="50" width="120" height="130" rx="8" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.3)" stroke-width="1.5"/>
  <!-- Windows -->
  <rect x="138" y="68" width="24" height="18" rx="3" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.25)" stroke-width="1"/>
  <rect x="178" y="68" width="24" height="18" rx="3" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.25)" stroke-width="1"/>
  <rect x="138" y="100" width="24" height="18" rx="3" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.2)" stroke-width="1"/>
  <rect x="178" y="100" width="24" height="18" rx="3" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.2)" stroke-width="1"/>
  <rect x="138" y="132" width="24" height="18" rx="3" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.15)" stroke-width="1"/>
  <rect x="178" y="132" width="24" height="18" rx="3" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.15)" stroke-width="1"/>
  <!-- Door -->
  <rect x="165" y="155" width="30" height="25" rx="3" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.35)" stroke-width="1"/>
  <!-- Crack lines -->
  <line x1="200" y1="50" x2="220" y2="90" stroke="rgba(239,68,68,0.5)" stroke-width="1.5" stroke-dasharray="3 2"/>
  <line x1="220" y1="90" x2="210" y2="130" stroke="rgba(239,68,68,0.4)" stroke-width="1.5" stroke-dasharray="3 2"/>
  <!-- Debt label -->
  <rect x="245" y="70" width="80" height="32" rx="6" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.35)" stroke-width="1"/>
  <text x="285" y="91" text-anchor="middle" fill="#f87171" font-size="13" font-weight="bold">$7.5B debt</text>
  <!-- Down arrow -->
  <line x1="180" y1="185" x2="180" y2="210" stroke="#ef4444" stroke-width="2"/>
  <polygon points="174,207 180,218 186,207" fill="#ef4444"/>
  <text x="180" y="14" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="600">No growth investment</text>
  <text x="180" y="32" text-anchor="middle" fill="rgba(239,68,68,0.6)" font-size="11">Toys "R" Us</text>
</svg>`;

const CF1_STAKES_WITH = `<svg viewBox="0 0 320 220" style="width:100%;max-width:380px">
  <!-- Building growing upward -->
  <rect x="100" y="30" width="120" height="150" rx="8" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.35)" stroke-width="1.5"/>
  <!-- Windows (lit up) -->
  <rect x="118" y="48" width="24" height="18" rx="3" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.4)" stroke-width="1"/>
  <rect x="158" y="48" width="24" height="18" rx="3" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.4)" stroke-width="1"/>
  <rect x="118" y="80" width="24" height="18" rx="3" fill="rgba(16,185,129,0.25)" stroke="rgba(16,185,129,0.45)" stroke-width="1"/>
  <rect x="158" y="80" width="24" height="18" rx="3" fill="rgba(16,185,129,0.25)" stroke="rgba(16,185,129,0.45)" stroke-width="1"/>
  <rect x="118" y="112" width="24" height="18" rx="3" fill="rgba(16,185,129,0.3)" stroke="rgba(16,185,129,0.5)" stroke-width="1"/>
  <rect x="158" y="112" width="24" height="18" rx="3" fill="rgba(16,185,129,0.3)" stroke="rgba(16,185,129,0.5)" stroke-width="1"/>
  <!-- Door -->
  <rect x="145" y="155" width="30" height="25" rx="3" fill="rgba(16,185,129,0.25)" stroke="rgba(16,185,129,0.5)" stroke-width="1"/>
  <!-- Growth arrow -->
  <line x1="160" y1="25" x2="160" y2="5" stroke="#10b981" stroke-width="2.5"/>
  <polygon points="154,8 160,-4 166,8" fill="#10b981"/>
  <!-- Value labels -->
  <text x="160" y="200" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="11">Microsoft</text>
  <!-- Growth bars -->
  <rect x="30" y="140" width="40" height="40" rx="5" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.3)" stroke-width="1"/>
  <text x="50" y="165" text-anchor="middle" fill="#10b981" font-size="10" font-weight="bold">$300B</text>
  <rect x="250" y="60" width="40" height="120" rx="5" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.45)" stroke-width="1.5"/>
  <text x="270" y="125" text-anchor="middle" fill="#10b981" font-size="10" font-weight="bold">$3T</text>
  <!-- Arrow between bars -->
  <line x1="75" y1="155" x2="95" y2="130" stroke="rgba(16,185,129,0.4)" stroke-width="1" stroke-dasharray="4 3"/>
  <line x1="225" y1="110" x2="245" y2="110" stroke="rgba(16,185,129,0.4)" stroke-width="1" stroke-dasharray="4 3"/>
  <text x="160" y="215" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">10x growth via Azure</text>
</svg>`;

const CF1_DIAGRAM = `<svg viewBox="0 0 480 520" style="width:100%;min-height:420px">
  <!-- Central hub -->
  <circle cx="240" cy="260" r="55" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.4)" stroke-width="2"/>
  <text x="240" y="255" text-anchor="middle" fill="white" font-size="13" font-weight="bold">Maximize</text>
  <text x="240" y="273" text-anchor="middle" fill="#a78bfa" font-size="12">Value</text>
  <!-- Investment Decision (top) -->
  <rect x="155" y="40" width="170" height="80" rx="14" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.4)" stroke-width="2"/>
  <text x="240" y="72" text-anchor="middle" fill="white" font-size="14" font-weight="bold">Investment</text>
  <text x="240" y="95" text-anchor="middle" fill="#fbbf24" font-size="11">What to invest in?</text>
  <!-- Arrow from Investment to center -->
  <line x1="240" y1="125" x2="240" y2="200" stroke="rgba(245,158,11,0.4)" stroke-width="1.5"/>
  <polygon points="234,198 240,210 246,198" fill="rgba(245,158,11,0.5)"/>
  <!-- Financing Decision (bottom-left) -->
  <rect x="20" y="380" width="170" height="80" rx="14" fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.4)" stroke-width="2"/>
  <text x="105" y="412" text-anchor="middle" fill="white" font-size="14" font-weight="bold">Financing</text>
  <text x="105" y="435" text-anchor="middle" fill="#60a5fa" font-size="11">How to fund it?</text>
  <!-- Arrow from Financing to center -->
  <line x1="145" y1="378" x2="205" y2="300" stroke="rgba(59,130,246,0.4)" stroke-width="1.5"/>
  <polygon points="200,304 210,296 206,310" fill="rgba(59,130,246,0.5)"/>
  <!-- Dividend Decision (bottom-right) -->
  <rect x="290" y="380" width="170" height="80" rx="14" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.4)" stroke-width="2"/>
  <text x="375" y="412" text-anchor="middle" fill="white" font-size="14" font-weight="bold">Dividend</text>
  <text x="375" y="435" text-anchor="middle" fill="#34d399" font-size="11">How much to return?</text>
  <!-- Arrow from Dividend to center -->
  <line x1="335" y1="378" x2="275" y2="300" stroke="rgba(16,185,129,0.4)" stroke-width="1.5"/>
  <polygon points="270,304 280,296 274,310" fill="rgba(16,185,129,0.5)"/>
  <!-- Cash flow arrows (circular) -->
  <path d="M130,130 Q50,200 60,370" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="4 4"/>
  <path d="M350,130 Q430,200 420,370" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="4 4"/>
  <path d="M195,460 Q240,490 285,460" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="4 4"/>
  <!-- Label -->
  <text x="240" y="510" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="11">The Three Core Decisions</text>
</svg>`;

const lessons = [
  L(1,'What Is Corporate Finance?',30,[
    // ═══════════════════════════════════════════
    // PHASE 1 — HOOK (Steps 1–2)
    // ═══════════════════════════════════════════

    // Step 1 — Real-World Opener
    hookOpener(
      'What Is Corporate Finance?',
      'Apple generates over $100 billion in cash every year — but deciding how to spend it is the single biggest challenge a CFO faces.',
      'By the end of this lesson, you\'ll understand what corporate finance is, the three core decisions every company must make, and why these decisions determine whether a company thrives or dies.',
      'Corporate cash flow cycle showing revenue flowing into three decision buckets',
      CF1_HOOK_CHART
    ),

    // Step 2 — Stakes Card
    stakesCard(
      { label: 'Company with no financial strategy', detail: 'Toys "R" Us took on $7.5 billion in debt with no plan to invest in growth. Within 10 years the company went bankrupt, closing 800 stores and laying off 30,000 workers.' },
      { label: 'Company with disciplined corporate finance', detail: 'Microsoft reinvested profits into cloud computing (Azure), growing its market cap from $300B to over $3 trillion in a decade. Strategic capital allocation transformed the company.' },
      { withoutSvg: CF1_STAKES_WITHOUT, withSvg: CF1_STAKES_WITH, withoutLabel: 'No Strategy', withLabel: 'Disciplined Finance' }
    ),

    // ═══════════════════════════════════════════
    // PHASE 2 — TEACH (Steps 3–8)
    // ═══════════════════════════════════════════

    // Step 3 — First Teaching Slide (Core Concept)
    teachingSlide(
      'THE FOUNDATION',
      'What Is Corporate Finance?',
      [
        'Corporate finance is the area of finance that deals with how companies raise money, spend money, and manage their financial resources. Every business — from a startup in a garage to a Fortune 500 corporation — must answer three fundamental questions that define the field.',
        'The three core decisions are: (1) the Investment Decision — what projects or assets should we invest in? (2) the Financing Decision — how should we pay for those investments? And (3) the Dividend Decision — how much profit should we return to shareholders versus reinvesting in the business?',
        'The goal of corporate finance is straightforward: maximize the long-term value of the company for its shareholders. Every financial decision a company makes — from building a new factory to issuing bonds — is evaluated through this lens. A company that allocates capital well creates value; one that doesn\'t, destroys it.'
      ],
      [
        { term: 'Capital Allocation', definition: 'The process of deciding how to distribute a company\'s financial resources among different projects, divisions, and investments.', example: 'Amazon allocating $60 billion per year to AWS infrastructure, logistics, and R&D is capital allocation in action.' },
        { term: 'CFO', definition: 'Chief Financial Officer — the senior executive responsible for managing a company\'s finances, including capital allocation, fundraising, and financial reporting.', example: 'The CFO of Tesla oversees decisions about factory construction, debt issuance, and cash management.' },
        { term: 'Shareholder Value', definition: 'The total value delivered to company owners through stock price appreciation and dividends.', example: 'When Apple buys back $90 billion of its own shares, it increases shareholder value by reducing the share count.' },
        { term: 'Stakeholders', definition: 'All parties affected by a company\'s decisions: shareholders, employees, customers, suppliers, and the community.', example: 'When a company closes a factory, shareholders may benefit but employees and the local community lose out.' }
      ],
      'Three interconnected gears labeled "Invest," "Finance," and "Distribute," with arrows showing cash flowing between them and a central hub labeled "Maximize Value."',
      { company: 'Apple', metric: 'Capital allocation (2018–2024)', outcome: 'Returned $600B+ to shareholders through buybacks and dividends while still investing $25B+ per year in R&D', explanation: 'Apple generates so much cash that it can simultaneously invest heavily in new products (Vision Pro, Apple Intelligence) and return massive amounts to shareholders. This is the gold standard of corporate finance.' },
      CF1_DIAGRAM
    ),

    // Step 4 — Embedded Micro-Check
    microCheck(
      'A company earns $50 million in profit this year. The CEO wants to build a new factory ($30M), pay dividends to shareholders ($10M), and save the rest. Which of the three core corporate finance decisions does this scenario involve?',
      ['Only the Investment Decision', 'Only the Financing Decision', 'All three: Investment, Financing (implicitly), and Dividend decisions', 'None — this is accounting, not corporate finance'],
      2,
      'Correct! Building the factory is an Investment Decision. Paying dividends is a Dividend Decision. And deciding to use retained earnings (profit) rather than borrowing is implicitly a Financing Decision. All three core decisions are at play.',
      'Not quite. Building the factory is an Investment Decision ($30M). Paying dividends is a Dividend Decision ($10M). And choosing to fund it from profits rather than borrowing is implicitly a Financing Decision. All three core decisions are involved.'
    ),

    // Step 5 — Interactive Graph
    interactiveGraph(
      'THE BIG PICTURE',
      'How Companies Create (or Destroy) Value',
      'comparison',
      'See how different capital allocation strategies affect company value over time. Adjust the reinvestment rate and return on capital to see the compounding effect.',
      [
        'A company creates value when it invests in projects that earn a return higher than the cost of the capital used. This is the fundamental principle of corporate finance: if you borrow money at 5% and invest it in a project that returns 15%, you\'ve created value. If the project only returns 3%, you\'ve destroyed it.',
        'Return on Invested Capital (ROIC) is the single most important metric in corporate finance. It measures how efficiently a company turns invested dollars into profit. Companies with consistently high ROIC — like Google (30%+), Visa (25%+), and Apple (50%+) — create enormous shareholder value over time.',
        'The difference between a great company and a mediocre one often comes down to capital allocation discipline. Great companies invest in high-return projects and say no to everything else. Mediocre companies spread money across low-return projects, empire-build through bad acquisitions, or hoard cash without purpose.'
      ],
      [
        { term: 'ROIC', definition: 'Return on Invested Capital — measures how much profit a company generates per dollar of capital invested in the business.', example: 'A company that invests $100M and generates $20M in annual operating profit has a 20% ROIC.' },
        { term: 'Cost of Capital', definition: 'The minimum return a company must earn on its investments to satisfy its investors (both debt holders and shareholders).', example: 'If a company\'s cost of capital is 10%, any project returning less than 10% destroys value.' }
      ],
      [
        'Companies that consistently earn ROIC above their cost of capital outperform the market by 3-5x over 10 years.',
        'The top 20% of capital allocators generate 80% of total stock market returns.',
        'Poor capital allocation — not competition or technology — is the #1 reason established companies decline.'
      ],
      [
        { label: 'Reinvestment Rate', min: 10, max: 90, default: 50, unit: '%' },
        { label: 'Return on Capital', min: 2, max: 30, default: 15, unit: '%' }
      ],
      { company: 'Google (Alphabet)', metric: 'ROIC over 10 years', outcome: 'Maintained 25-35% ROIC while growing revenue from $66B to $307B', explanation: 'Google reinvests heavily in search, cloud, and AI — all of which generate returns far above its cost of capital. This virtuous cycle of high-return reinvestment is why its stock price increased 5x in a decade.' }
    ),

    // Step 6 — Case Study
    caseStudy(
      'GE: From Industrial Giant to Cautionary Tale',
      [
        { date: '2000', event: 'GE is the most valuable company in the world at $600B', context: 'Under Jack Welch, GE is admired globally. Its conglomerate model — owning everything from jet engines to NBC to a massive finance arm — is considered the gold standard of management.' },
        { date: '2008', event: 'GE Capital nearly collapses, stock falls 80%', context: 'GE\'s financial division had taken on massive hidden risks. When the financial crisis hit, GE needed a $139 billion government-backed loan to survive. The conglomerate model masked the danger.' },
        { date: '2018', event: 'GE is removed from the Dow Jones after 110 years', context: 'Decades of poor capital allocation — overpaying for acquisitions, underinvesting in core businesses, and hiding problems with financial engineering — finally caught up. The stock was down 75% from its peak.' },
        { date: '2024', event: 'GE splits into three separate companies', context: 'The company that once did everything now admits the conglomerate model destroyed value. Each new company (GE Aerospace, GE Vernova, GE HealthCare) focuses capital on a single business with clear returns.' }
      ],
      'GE\'s decline is the ultimate lesson in corporate finance: capital allocation is destiny. When a company invests in projects with returns below its cost of capital, acquires businesses it doesn\'t understand, and uses financial engineering to mask problems, destruction of shareholder value is inevitable — no matter how big or admired the company is.'
    ),

    // Step 7 — Misconceptions
    misconceptions(
      'CORPORATE FINANCE MYTHS',
      'What most people get wrong about how companies work',
      [
        {
          myth: 'The goal of a company is to maximize revenue and market share.',
          truth: 'The goal is to maximize long-term shareholder value. Growing revenue without earning adequate returns on capital actually destroys value.',
          explanation: 'WeWork grew revenue from $0 to $1.8 billion in 6 years but burned through $14 billion in cash doing it. Revenue growth without profitability is a recipe for bankruptcy, not success.'
        },
        {
          myth: 'Profitable companies don\'t go bankrupt.',
          truth: 'Companies can be profitable on paper but still run out of cash. Cash flow — not accounting profit — determines survival.',
          explanation: 'Enron reported billions in "profits" through accounting manipulation. When the cash ran out, it collapsed overnight. Profit is an opinion; cash is a fact.'
        },
        {
          myth: 'More debt is always bad for a company.',
          truth: 'Strategic debt can create enormous value. If a company can borrow at 4% and invest at 20%, debt amplifies shareholder returns.',
          explanation: 'Starbucks carries $13 billion in debt but earns returns far exceeding its borrowing cost. The debt allows faster expansion into high-return locations. It\'s the return on capital vs. cost of capital that matters — not the absolute level of debt.'
        }
      ]
    ),

    // Step 8 — Key Terms Reference Cards
    keyTermsCards([
      { term: 'Capital Allocation', definition: 'The process of deciding how to distribute a company\'s financial resources among competing uses: new projects, acquisitions, dividends, buybacks, or debt repayment.', example: 'Berkshire Hathaway\'s Warren Buffett is considered the greatest capital allocator in history, growing $1,000 into $37 million over 58 years.', sentence: 'The CEO\'s most important job is capital allocation — every dollar must be directed to its highest-return use.' },
      { term: 'ROIC', definition: 'Return on Invested Capital measures how efficiently a company generates profit from the money invested in its operations.', example: 'Apple\'s ROIC exceeds 50%, meaning every $1 of capital generates $0.50 in annual operating profit.', sentence: 'We only approve projects with an expected ROIC of at least 15%, which is well above our 9% cost of capital.' },
      { term: 'Cost of Capital', definition: 'The minimum rate of return a company must earn to justify an investment. It reflects what investors expect to earn for providing capital.', example: 'If a company\'s cost of capital is 10%, building a factory that only returns 7% would destroy $3 of value per $100 invested.', sentence: 'Our weighted average cost of capital is 8.5%, so any acquisition must deliver returns above that threshold.' },
      { term: 'Cash Flow', definition: 'The actual money flowing into and out of a business. Unlike accounting profit, cash flow cannot be manipulated and determines a company\'s ability to survive and grow.', example: 'Amazon reported minimal profits for 20 years but generated massive operating cash flow, which it reinvested into growth.', sentence: 'The company is profitable on paper, but its negative free cash flow means it\'s actually burning money.' },
      { term: 'Shareholder Value', definition: 'The total financial benefit delivered to a company\'s owners through a combination of stock price appreciation, dividends, and share buybacks.', example: 'Microsoft created over $2.5 trillion in shareholder value between 2014 and 2024 under Satya Nadella.', sentence: 'Our board evaluates every strategic decision based on its expected impact on long-term shareholder value.' },
      { term: 'Conglomerate', definition: 'A corporation made up of multiple unrelated businesses. Historically popular but now often considered value-destroying due to unfocused capital allocation.', example: 'GE once owned jet engines, TV networks, a bank, and a plastics division — all under one corporate umbrella.', sentence: 'The conglomerate discount means investors value the combined entity less than the sum of its individual parts.' }
    ]),

    // ═══════════════════════════════════════════
    // PHASE 3 — PRACTICE (Steps 9–16)
    // ═══════════════════════════════════════════

    // Step 9 — Fill in the Blank
    fb('The goal of corporate finance is to maximize long-term ___ for shareholders.', ['value', 'revenue', 'headcount', 'debt'], 0),

    // Step 10 — Multiple Choice (Scenario-based)
    q('TechCo earns $200M in profit and has three options: (A) Build a new data center expected to return 25%, (B) Acquire a competitor for $200M with projected 6% return, or (C) Put the cash in treasury bills at 4%. TechCo\'s cost of capital is 10%. Which option creates the most shareholder value?',
      ['Build the data center — 25% return far exceeds the 10% cost of capital', 'Acquire the competitor — growth through acquisition shows strength', 'Treasury bills — guaranteed returns are always best', 'All three create equal value since each uses the same $200M'],
      0,
      'Correct. The data center\'s 25% return exceeds the 10% cost of capital by 15 percentage points, creating significant value. The acquisition at 6% actually destroys value (below cost of capital), and treasury bills at 4% also underperform. Value creation = return on investment minus cost of capital.'
    ),

    // Step 11 — Tap to Reveal
    tr('Corporate Finance Essentials', [
      ['What are the three core decisions in corporate finance?', 'Investment (what to invest in), Financing (how to fund it), and Dividend (how much profit to return to shareholders).'],
      ['What does ROIC measure?', 'Return on Invested Capital — how many cents of profit a company generates per dollar invested. An ROIC above cost of capital creates value.'],
      ['Why did GE decline from the world\'s most valuable company?', 'Poor capital allocation: overpaying for acquisitions, hiding risks in GE Capital, and spreading resources across too many unrelated businesses.'],
      ['How can debt create value for a company?', 'If a company borrows at 4% and invests at 20%, the 16% spread amplifies shareholder returns. Debt is a tool — its value depends on how it\'s used.']
    ]),

    // Step 12 — Drag and Drop
    ds('Put these capital allocation priorities in order from highest to lowest value creation:', [
      'Invest in projects earning above cost of capital',
      'Buy back shares when stock is undervalued',
      'Pay dividends to return excess cash',
      'Acquire companies at fair prices with clear synergies',
      'Hold excess cash on the balance sheet',
      'Make acquisitions to increase company size regardless of returns'
    ]),

    // Step 13 — Scenario Simulation
    sc('You\'re the CFO of a mid-size tech company with $100M in cash. Your cost of capital is 10%. A competitor is available for acquisition at $100M, expected to generate 7% annual returns. Your board is excited about the deal. What do you recommend?', [
      { label: 'Approve the deal — growing through acquisition shows Wall Street we\'re ambitious', outcome: 'The acquisition returns 7% but your cost of capital is 10%. You\'ve destroyed $3M in value per year. The stock drops 8% on announcement day as sophisticated investors see through the growth narrative.', correct: false },
      { label: 'Reject the deal — 7% return is below the 10% cost of capital, so it destroys value', outcome: 'You saved the company from a value-destroying acquisition. The board is initially frustrated, but when the competitor struggles and your cash is deployed into a 22% return project the following quarter, your judgment is vindicated.', correct: true },
      { label: 'Negotiate a lower price that could push returns above 10%', outcome: 'Smart thinking! If you can buy at $70M instead of $100M, the same cash flows now generate 10%+ returns. Price discipline is essential to value-creating acquisitions.', correct: true }
    ]),

    // Step 14 — Slider Prediction
    sl('Apple\'s ROIC exceeds what percentage — far above its ~9% cost of capital?', 10, 80, 50, '%'),

    // Step 15 — True/False Rapid Set
    tf([
      { s: 'A company\'s primary goal is to maximize revenue', a: false },
      { s: 'Cash flow is more important than accounting profit for company survival', a: true },
      { s: 'All debt is bad for a company', a: false },
      { s: 'A project that returns 8% creates value if the cost of capital is 10%', a: false },
      { s: 'Capital allocation is the most important job of a CEO', a: true }
    ]),

    // Step 16 — Match Pairs
    m('Match the Corporate Finance Concept to Its Description', [
      ['Investment Decision', 'Choosing which projects, assets, or businesses to invest in'],
      ['Financing Decision', 'Deciding whether to use debt, equity, or retained earnings to fund operations'],
      ['Dividend Decision', 'Determining how much profit to return to shareholders vs. reinvest'],
      ['Cost of Capital', 'The minimum return required to justify an investment']
    ]),

    // ═══════════════════════════════════════════
    // PHASE 4 — APPLY (Steps 17–18)
    // ═══════════════════════════════════════════

    // Step 17 — Applied Scenario Question
    q('NovaTech has $500M in cash, a cost of capital of 9%, and three potential investments: (A) Expand cloud infrastructure — projected 22% ROIC, costs $200M. (B) Acquire a social media startup — projected 5% ROIC, costs $300M. (C) Build a new headquarters — projected 2% ROIC, costs $150M. With limited capital, what should the CFO recommend?',
      [
        'Fund all three to diversify the company',
        'Fund only the cloud expansion and return remaining $300M to shareholders via buybacks and dividends',
        'Fund the acquisition because social media is the future',
        'Hold all $500M in cash for safety'
      ],
      1,
      'The cloud expansion (22% ROIC) is the only project above the 9% cost of capital. The acquisition (5%) and headquarters (2%) both destroy value. The remaining $300M should be returned to shareholders — who can invest it in opportunities that do exceed their required return. This is disciplined capital allocation.'
    ),

    // Step 18 — Simulation Finale
    simulationFinale(
      'You\'re the New CFO',
      'You\'ve just been hired as CFO of MegaCorp, a $5 billion conglomerate with four divisions. The board wants a plan to increase shareholder value. You have $1 billion to allocate.',
      [
        {
          prompt: 'Decision 1: The semiconductor division earns 30% ROIC and wants $400M for expansion. The retail division earns 4% ROIC (below the 10% cost of capital) and also wants $400M. How do you allocate?',
          options: [
            { label: 'Give each division $400M — be fair to all business units', consequence: 'The semiconductor investment creates massive value, but the retail investment destroys it. "Fairness" in capital allocation means subsidizing underperformers with profits from winners.', score: 1 },
            { label: 'Give semiconductors $400M, begin exploring a sale of the retail division', consequence: 'Excellent. You\'re directing capital to its highest-return use and recognizing that some businesses belong in someone else\'s portfolio. This is how value-creating CFOs think.', score: 3 },
            { label: 'Give retail $400M to "turn it around" — it has more upside potential', consequence: 'Throwing money at a low-return business rarely fixes structural problems. Most turnaround investments earn below cost of capital. You\'ve likely destroyed $24M+ in annual value.', score: 0 }
          ]
        },
        {
          prompt: 'Decision 2: An investment bank pitches acquiring a logistics company for $600M. The projected ROIC is 8% — close to your 10% cost of capital. The banker says "synergies will push it to 12%." What do you do?',
          options: [
            { label: 'Approve the acquisition — synergies will create value', consequence: 'Studies show 70% of acquisitions fail to deliver projected synergies. The "synergy premium" is the most overused justification for value-destroying deals. Disciplined CFOs demand a margin of safety.', score: 0 },
            { label: 'Demand independent verification of synergies before proceeding', consequence: 'Smart move. You want third-party analysis of whether those synergies are real. If verified, the deal makes sense. If not, you\'ve avoided an expensive mistake.', score: 2 },
            { label: 'Reject the deal — the base return of 8% is below cost of capital, and promised synergies rarely materialize', consequence: 'The most disciplined approach. Without synergies the deal destroys value. With unverified synergies it\'s a gamble. Saying no to marginal deals is one of the highest-value things a CFO can do.', score: 3 }
          ]
        },
        {
          prompt: 'Decision 3: MegaCorp has $300M in excess cash after all high-return investments are funded. Your stock is trading at a historically low valuation. What do you do with the excess?',
          options: [
            { label: 'Hoard the cash — you might need it later', consequence: 'Cash sitting on the balance sheet earns near-zero returns. If you have no high-return projects, returning it to shareholders is more responsible than letting it accumulate.', score: 1 },
            { label: 'Buy back shares at the low valuation — each dollar buys more ownership', consequence: 'Perfect timing. Buying back undervalued shares is one of the highest-return uses of capital. You\'re acquiring the one asset you know best — your own company — at a discount.', score: 3 },
            { label: 'Issue a special dividend to make shareholders happy', consequence: 'Returning cash via dividends is good, but buybacks at a low valuation create more value per dollar. Dividends are taxed immediately; buybacks let shareholders defer taxes.', score: 2 }
          ]
        },
        {
          prompt: 'Decision 4: At the annual board meeting, a director asks: "Why don\'t we diversify into cryptocurrency mining? It\'s the future." How do you respond?',
          options: [
            { label: 'Agree and allocate $200M — first-mover advantage is critical', consequence: 'Investing in a business you don\'t understand, with no competitive advantage, violates the fundamental principles of capital allocation. Most corporate diversification into trendy sectors fails.', score: 0 },
            { label: 'Explain that capital should go to businesses where MegaCorp has a competitive advantage and can earn ROIC above cost of capital', consequence: 'Perfect response. Capital allocation should be driven by competitive advantage and return metrics — not trends or fear of missing out. You\'ve demonstrated CFO-level discipline.', score: 3 },
            { label: 'Suggest a small $20M pilot to test the waters', consequence: 'A measured approach, but even small investments in areas outside your expertise often become money pits. The opportunity cost — what that $20M could earn elsewhere — matters.', score: 1 }
          ]
        }
      ],
      'Funding the high-ROIC semiconductor division, rejecting the marginal acquisition, buying back undervalued shares, and staying focused on competitive advantages — scoring 12/12.',
      'The best CFOs are not empire builders — they\'re capital allocators. They direct every dollar to its highest-return use, say no to value-destroying projects (even popular ones), and return excess cash to shareholders when no high-return investments exist. Discipline, not ambition, creates shareholder value.'
    ),

    // ═══════════════════════════════════════════
    // PHASE 5 — CONSOLIDATE (Steps 20–22)
    // ═══════════════════════════════════════════

    // Step 20 — Summary Cards
    summaryCards('What Is Corporate Finance?', [
      { takeaway: 'Three core decisions define the field', detail: 'Investment (what to invest in), Financing (how to fund it), and Dividend (how much to return to shareholders). Every corporate financial action maps to one of these three.' },
      { takeaway: 'Value creation = ROIC > Cost of Capital', detail: 'If a company earns returns above its cost of capital, it creates value. Below it, it destroys value — regardless of revenue growth, market share, or profitability metrics.' },
      { takeaway: 'Capital allocation is destiny', detail: 'GE destroyed $500B+ in shareholder value through poor capital allocation. Microsoft created $2.5T+ through disciplined allocation. The difference is how leadership deploys every dollar.' }
    ]),

    // Step 22 — What's Next
    whatsNext(
      'What Is Corporate Finance?',
      'Financial Statements: The Language of Business',
      'You\'ll learn how to read the three core financial statements — the income statement, balance sheet, and cash flow statement — that reveal the true health of any company.',
      25
    )
  ],[
    // ═══════════════════════════════════════════
    // CHALLENGE ROUND — 5 Questions
    // ═══════════════════════════════════════════
    cq('A company earns 7% ROIC while its cost of capital is 10%. What is happening to shareholder value?',
      ['It\'s increasing by 7% per year', 'It\'s being destroyed — the company earns less than investors require', 'It\'s staying flat since the company is profitable', 'It\'s impossible to determine without more data'],
      1, 'When ROIC (7%) is below cost of capital (10%), the company is destroying 3% of value on every dollar invested. Being "profitable" doesn\'t matter if returns don\'t exceed what investors could earn elsewhere.'),
    cq('Which of the following is the BEST example of the Investment Decision in corporate finance?',
      ['Issuing bonds to raise $500M', 'Deciding to build a new factory in Vietnam', 'Paying a quarterly dividend of $0.50 per share', 'Hiring a new CFO'],
      1, 'Building a factory is a classic Investment Decision — committing capital to a specific project. Issuing bonds is a Financing Decision. Paying dividends is a Dividend Decision.'),
    cq('Why did GE\'s conglomerate model ultimately fail?',
      ['The stock market was unfair to large companies', 'Capital was spread across too many businesses with inadequate returns, and financial engineering masked the problems', 'GE\'s products were inferior to competitors', 'Government regulation forced the company to split'],
      1, 'GE allocated capital to businesses earning below cost of capital, overpaid for acquisitions, and used GE Capital\'s complex finances to hide poor performance. The conglomerate structure made it impossible to identify and fix underperforming divisions.'),
    cq('Starbucks carries $13B in debt but has one of the highest ROICs in the restaurant industry. How should an investor interpret this?',
      ['The debt is dangerous and Starbucks will likely go bankrupt', 'The debt is strategic — Starbucks borrows cheaply and invests at much higher returns, amplifying shareholder value', 'Debt is always negative regardless of what the company earns', 'Starbucks should pay off all debt immediately'],
      1, 'Starbucks borrows at low rates and invests in new store openings that generate 25%+ returns. The spread between borrowing cost (~4%) and ROIC (~25%) means debt actually amplifies value creation. Debt is a tool — context matters.'),
    cq('A CFO has $200M in excess cash and no projects earning above cost of capital. What should they do?',
      ['Build a new headquarters to boost employee morale', 'Return the cash to shareholders through buybacks or dividends', 'Acquire a competitor to grow revenue', 'Hold the cash indefinitely for safety'],
      1, 'When no internal projects exceed cost of capital, the most responsible action is returning cash to shareholders — who can invest it elsewhere at higher returns. Hoarding cash or making low-return acquisitions destroys value.')
  ])
];

export default lessons;
