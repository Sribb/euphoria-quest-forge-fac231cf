
import { L, c, tr, fb, ds, q, tf, m, sl, sc, bi, pc, vi, cq } from '../helpers';

const lessons = [
  L(1,'Why Personal Finance Matters',25,[
    c('💰','Your Money, Your Future','Personal finance is how you manage your money — earning, spending, saving, and investing. It determines whether you build wealth or live paycheck to paycheck.'),
    tr('The 4 Pillars',[['Earn','Maximize your income through skills and career growth'],['Spend','Spend intentionally below your means'],['Save','Build emergency funds and save for goals'],['Invest','Grow wealth through compound returns']]),
    fb('Personal finance is about managing your money to build ___.',['wealth','debt','stress','popularity'],0),
    q('What percentage of Americans live paycheck to paycheck?',['25%','40%','60%','80%'],2,'Studies show ~60% of Americans struggle with basic expenses.'),
    tf([{s:'Personal finance is only for rich people',a:false},{s:'Financial literacy can be learned at any age',a:true},{s:'Making more money automatically solves financial problems',a:false}]),
    sc('You just got your first paycheck of $2,000. What should you do first?',[
      {label:'Create a budget and pay essential bills',outcome:'Smart! Budgeting first ensures your basics are covered before discretionary spending.',correct:true},
      {label:'Celebrate by spending it all',outcome:'Spending everything leaves you vulnerable to unexpected expenses.',correct:false},
      {label:'Invest everything immediately',outcome:'You need to cover essentials and build an emergency fund before investing.',correct:false}
    ]),
    sl('What percentage of your income should you aim to save?',0,50,20,'%'),
    m('Financial Health Indicators',[['Net Worth','Assets minus liabilities'],['Cash Flow','Money coming in minus going out'],['Debt-to-Income','Monthly debt payments / monthly income'],['Savings Rate','Percentage of income saved']])
  ],[
    cq('Personal finance includes:',['Only investing','Earning, spending, saving, and investing','Only budgeting','Only saving'],1,'It encompasses all money management areas.'),
    cq('The first step in personal finance is:',['Investing in stocks','Creating a budget','Buying a house','Getting a credit card'],1,'Budgeting creates the foundation for all financial decisions.'),
    cq('Net worth equals:',['Income minus taxes','Assets minus liabilities','Savings only','Investments only'],1,'Net worth = what you own minus what you owe.'),
    cq('Financial literacy:',['Is innate — you\'re born with it','Can be learned and improved','Only matters for accountants','Is unnecessary'],1,'Anyone can learn to manage money effectively.'),
    cq('Living paycheck to paycheck means:',['You\'re wealthy','You spend everything you earn each month','You have savings','You invest wisely'],1,'No financial cushion between pay periods.')
  ]),

  L(2,'Income vs Expenses',25,[
    c('📊','Money In, Money Out','Income is all money coming in (salary, freelance, investments). Expenses are money going out (rent, food, subscriptions). The gap between them is your path to wealth.'),
    bi('Categorize Your Expenses','Sort each expense into the right category:',[
      {label:'Rent/Mortgage',options:['Need','Want','Savings','Investment'],correct:0},
      {label:'Netflix subscription',options:['Need','Want','Savings','Investment'],correct:1},
      {label:'Groceries',options:['Need','Want','Savings','Investment'],correct:0},
      {label:'Emergency fund contribution',options:['Need','Want','Savings','Investment'],correct:2}
    ]),
    fb('The gap between income and expenses is your ___.',['surplus','debt','credit score','tax rate'],0),
    q('Which is a "fixed" expense?',['Dining out','Entertainment','Rent','Clothing'],2,'Fixed expenses are the same amount each month.'),
    tf([{s:'Tracking expenses is the first step to controlling spending',a:true},{s:'Small daily expenses don\'t add up',a:false},{s:'Income is only from your salary',a:false}]),
    pc('Monthly Income Analysis',[
      {prompt:'Salary: $4,000. Side hustle: $500. Total income?',options:['$4,000','$4,500','$5,000','$3,500'],correct:1},
      {prompt:'Rent: $1,200. Utilities: $200. Food: $400. Fixed costs?',options:['$1,400','$1,600','$1,800','$2,000'],correct:2},
      {prompt:'Income $4,500 - Fixed costs $1,800 = Remaining?',options:['$2,200','$2,500','$2,700','$3,000'],correct:2}
    ]),
    vi('A pie chart shows: Housing 35%, Food 15%, Transport 12%, Entertainment 20%, Savings 8%, Other 10%.','What should change first?',['Reduce entertainment from 20% to 10%','Increase housing','Eliminate food spending','Remove savings'],0),
    sl('The average American spends what % of income on housing?',15,50,33,'%')
  ],[
    cq('Fixed expenses are:',['Variable each month','The same amount every month','Optional spending','Investment returns'],1,'Fixed = predictable, recurring amounts like rent.'),
    cq('Your financial surplus is:',['Total income','Income minus expenses','Total debt','Savings account balance'],1,'Surplus = what\'s left after expenses.'),
    cq('Which is a variable expense?',['Rent','Car payment','Dining out','Insurance premium'],2,'Dining out changes month to month.'),
    cq('Tracking expenses helps you:',['Earn more money','Identify spending patterns and cut waste','Pay less taxes','Get better credit'],1,'Awareness enables better spending decisions.'),
    cq('A $5 daily latte costs approximately per year:',['$500','$1,000','$1,825','$2,500'],2,'$5 × 365 = $1,825 per year.')
  ]),

  L(3,'Creating Your First Budget',25,[
    c('📝','Your Money Plan','A budget is a plan for every dollar you earn. It\'s not about restriction — it\'s about intentionality and making your money work toward your goals.'),
    bi('Build a Monthly Budget','Allocate your $4,000 monthly income:',[
      {label:'Housing (rent, utilities)',options:['$800','$1,200','$1,600','$2,000'],correct:1},
      {label:'Necessities (food, transport)',options:['$400','$600','$800','$1,200'],correct:1},
      {label:'Savings & Investing',options:['$200','$400','$800','$1,200'],correct:2},
      {label:'Wants (entertainment, dining)',options:['$200','$400','$800','$1,000'],correct:1}
    ]),
    fb('The most popular budgeting method splits income into ___, wants, and savings.',['needs','taxes','debts','investments'],0),
    ds('Steps to create a budget:',['Calculate total monthly income','List all fixed expenses','List variable expenses','Set savings goals','Track spending weekly']),
    q('What is zero-based budgeting?',['Having no money','Assigning every dollar a purpose until $0 remains','Spending nothing','Having zero debt'],1,'Every dollar gets a job — income minus all allocations equals zero.'),
    tf([{s:'A budget should feel restrictive and painful',a:false},{s:'Budgets need to be reviewed and adjusted regularly',a:true},{s:'One budget method works for everyone',a:false}]),
    sc('It\'s the end of the month and you\'re $200 over budget on dining out. What\'s the best response?',[
      {label:'Adjust next month\'s budget and find ways to reduce dining costs',outcome:'Correct! Budgets evolve. Identify patterns and make realistic adjustments.',correct:true},
      {label:'Give up budgeting entirely',outcome:'One bad month doesn\'t mean budgeting fails. Adjust and continue.',correct:false},
      {label:'Cut all fun spending next month as punishment',outcome:'Extreme restriction leads to budget burnout. Make sustainable adjustments.',correct:false}
    ]),
    m('Budget Methods',[['50/30/20','Needs/Wants/Savings split'],['Envelope System','Cash in physical/digital envelopes per category'],['Zero-Based','Every dollar assigned a purpose'],['Pay Yourself First','Save first, then spend the rest']])
  ],[
    cq('A budget is:',['A restriction on spending','A plan for every dollar','Only for people in debt','A one-time exercise'],1,'Budgets are intentional money plans, not restrictions.'),
    cq('Zero-based budgeting means:',['Having no money','Every dollar is assigned a purpose','Spending zero dollars','Having no savings'],1,'Income minus all allocations = zero.'),
    cq('How often should you review your budget?',['Once when you create it','Never','Monthly at minimum','Only when you\'re broke'],2,'Regular review ensures your budget stays relevant.'),
    cq('The envelope method involves:',['Mailing money','Allocating cash to spending categories','Saving all your money','Using only credit cards'],1,'Each category gets its own spending limit.'),
    cq('If you overspend one month, you should:',['Abandon budgeting','Analyze why and adjust next month','Double restrictions','Ignore it'],1,'Learn from overages and make realistic adjustments.')
  ]),

  L(4,'The 50/30/20 Rule',25,[
    c('📐','A Simple Budget Framework','The 50/30/20 rule divides after-tax income: 50% for needs (housing, food, insurance), 30% for wants (dining, entertainment), and 20% for savings and debt repayment.'),
    bi('Apply the 50/30/20 Rule','Your take-home pay is $5,000/month:',[
      {label:'Needs (50%)',options:['$1,500','$2,000','$2,500','$3,000'],correct:2},
      {label:'Wants (30%)',options:['$1,000','$1,500','$2,000','$2,500'],correct:1},
      {label:'Savings & Debt (20%)',options:['$500','$750','$1,000','$1,500'],correct:2}
    ]),
    fb('In the 50/30/20 rule, ___ percent goes to needs like housing and food.',['50','30','20','10'],0),
    q('Which is a "need" vs a "want"?',['Netflix is a need','Groceries are a need, restaurants are a want','All food is a want','Everything is a need'],1,'Basic groceries = need. Restaurant meals = want.'),
    tf([{s:'Gym membership is always a need',a:false},{s:'50/30/20 is a starting point, not a rigid rule',a:true},{s:'Savings should come from whatever is left over',a:false}]),
    vi('Budget chart: Needs 65%, Wants 25%, Savings 10%.','What needs adjustment according to 50/30/20?',['Reduce needs spending from 65% to 50%','Everything is fine','Increase wants spending','Eliminate savings'],0),
    sc('Your rent is 40% of income alone, making needs 65% of budget. What can you do?',[
      {label:'Find ways to reduce housing costs — roommate, cheaper area',outcome:'Correct! Housing is usually the biggest expense lever. Even small reductions help.',correct:true},
      {label:'Give up saving entirely',outcome:'Eliminating savings creates long-term problems. Attack the root cause: expenses.',correct:false},
      {label:'Take on more debt',outcome:'More debt makes the situation worse. Focus on reducing the 65% needs.',correct:false}
    ]),
    sl('If you earn $60,000/year after tax, how much should go to savings annually (20%)?',5000,20000,12000,'$')
  ],[
    cq('The 50/30/20 rule splits income into:',['Stocks, bonds, cash','Needs, wants, savings','Rent, food, fun','Past, present, future'],1,'50% needs, 30% wants, 20% savings/debt.'),
    cq('50% of a $4,000 income for needs is:',['$1,200','$1,600','$2,000','$2,400'],2,'$4,000 × 0.50 = $2,000.'),
    cq('Which is a "want" not a "need"?',['Rent','Basic groceries','Streaming subscription','Health insurance'],2,'Entertainment subscriptions are wants.'),
    cq('If needs exceed 50%, you should:',['Increase income or reduce expenses','Give up budgeting','Borrow more','Ignore the rule entirely'],0,'Find ways to bring needs closer to 50%.'),
    cq('The 20% savings portion includes:',['Only retirement savings','Savings, investments, and extra debt payments','Only emergency fund','Only checking account'],1,'It covers all savings and debt reduction above minimums.')
  ]),

  L(5,'Tracking Spending',25,[
    c('🔍','Know Where Every Dollar Goes','You can\'t manage what you don\'t measure. Tracking spending reveals patterns, hidden costs, and opportunities to save.'),
    tr('Tracking Methods',[['App-Based','Mint, YNAB, or bank apps auto-categorize'],['Spreadsheet','Manual entry gives maximum control'],['Envelope Method','Physical or digital cash envelopes'],['Receipt Review','Weekly review of all receipts']]),
    fb('The first step to reducing spending is ___ where your money goes.',['tracking','ignoring','borrowing','guessing'],0),
    q('What is a "latte factor"?',['Coffee addiction','Small daily expenses that add up to large annual costs','A banking fee','A type of investment'],1,'Named after daily coffee purchases that total $1,500+/year.'),
    ds('Steps to track spending effectively:',['Choose a tracking method','Record every expense for 30 days','Categorize each expense','Identify patterns and surprises','Set reduction targets']),
    tf([{s:'Small purchases don\'t need tracking',a:false},{s:'Most people underestimate their spending by 20-30%',a:true},{s:'Tracking spending is only for people in debt',a:false}]),
    vi('After tracking for a month, you find: Subscriptions $85, Coffee $120, Impulse Amazon $200, Dining Out $350.','What\'s the total "invisible spending"?',['$555','$655','$755','$855'],2),
    sc('You discover you spend $300/month on subscriptions you barely use. What do you do?',[
      {label:'Cancel unused subscriptions — redirect to savings',outcome:'Correct! That\'s $3,600/year redirected to building wealth. Review subscriptions quarterly.',correct:true},
      {label:'Keep them — you might use them eventually',outcome:'Paying for "might use" wastes money. Cancel and resubscribe only if needed.',correct:false},
      {label:'Ignore it — $300 isn\'t much',outcome:'$300/month = $3,600/year. Invested at 8% for 20 years = $178,000!',correct:false}
    ])
  ],[
    cq('Why track spending?',['It\'s legally required','To identify patterns and reduce waste','To impress your bank','Only if you\'re in debt'],1,'Tracking reveals where money actually goes.'),
    cq('The "latte factor" refers to:',['Coffee prices','Small daily expenses adding up over time','A banking fee','A type of savings account'],1,'Small recurring costs compound to large amounts annually.'),
    cq('$5/day in misc spending equals per year:',['$500','$1,000','$1,825','$2,500'],2,'$5 × 365 = $1,825.'),
    cq('How long should you track spending to see patterns?',['1 day','1 week','At least 30 days','1 year'],2,'One month reveals most spending patterns.'),
    cq('Most people underestimate their spending by:',['1-5%','5-10%','20-30%','50%+'],2,'Studies show we consistently underestimate by 20-30%.')
  ]),

  // Lessons 6-50 condensed
  ...[
    {n:6,t:'Checking vs Savings Accounts',e:'🏦',b:'Checking accounts are for daily transactions with easy access. Savings accounts earn interest but have withdrawal limits. Both serve different purposes.'},
    {n:7,t:'How Interest Works on Savings',e:'💹',b:'Banks pay you interest for keeping money in savings. APY (Annual Percentage Yield) shows your true annual return including compounding.'},
    {n:8,t:'Emergency Funds',e:'🆘',b:'An emergency fund covers 3-6 months of essential expenses. It\'s your financial safety net for job loss, medical bills, or unexpected repairs.'},
    {n:9,t:'Setting Financial Goals',e:'🎯',b:'SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound. "Save $10,000 for a car down payment in 18 months" is a SMART goal.'},
    {n:10,t:'Needs vs Wants',e:'⚖️',b:'Needs are required for survival and basic functioning. Wants improve quality of life but aren\'t essential. The line between them is personal.'},
    {n:11,t:'Credit Scores Explained',e:'📊',b:'Credit scores range from 300-850. They\'re calculated from payment history (35%), utilization (30%), length (15%), mix (10%), and new credit (10%).'},
    {n:12,t:'How Credit Scores Are Calculated',e:'🔢',b:'Payment history is #1 at 35%. Credit utilization (how much of your limit you use) is #2 at 30%. Keep utilization below 30%, ideally under 10%.'},
    {n:13,t:'Building Credit from Scratch',e:'🧱',b:'Start with a secured credit card, become an authorized user, or use a credit-builder loan. Pay every bill on time and keep balances low.'},
    {n:14,t:'Credit Cards vs Debit Cards',e:'💳',b:'Credit cards borrow money and build credit. Debit cards spend your own money. Credit cards offer better fraud protection and rewards.'},
    {n:15,t:'Reading a Credit Card Statement',e:'📄',b:'Key items: statement balance, minimum payment, due date, interest rate (APR), and transactions. Always pay at least the statement balance.'},
    {n:16,t:'Avoiding Credit Card Debt',e:'🚫',b:'Pay your full statement balance every month. If you can\'t afford it on a credit card, you can\'t afford it. Period.'},
    {n:17,t:'Types of Debt',e:'📋',b:'Secured debt has collateral (mortgages, car loans). Unsecured debt doesn\'t (credit cards, personal loans). Secured usually has lower rates.'},
    {n:18,t:'Good Debt vs Bad Debt',e:'👍',b:'Good debt builds wealth (mortgage, education). Bad debt funds consumption (credit cards, payday loans). The key is whether it generates returns.'},
    {n:19,t:'Student Loans Explained',e:'🎓',b:'Federal loans offer income-based repayment and forgiveness options. Private loans have fewer protections. Always exhaust federal options first.'},
    {n:20,t:'Debt Repayment: Snowball vs Avalanche',e:'❄️',b:'Snowball: pay smallest debts first for motivation wins. Avalanche: pay highest interest first to save money. Avalanche is mathematically optimal.'},
    {n:21,t:'The Minimum Payment Trap',e:'⏳',b:'Paying only minimums on a $5,000 credit card at 20% APR takes 25+ years and costs $8,000+ in interest. Always pay more than the minimum.'},
    {n:22,t:'How Interest Compounds on Debt',e:'📈',b:'Credit card interest compounds daily. A $5,000 balance at 20% APR accrues $2.74/day in interest. That\'s $1,000/year just in interest.'},
    {n:23,t:'Negotiating Bills',e:'📞',b:'Call providers and ask for lower rates on phone, internet, insurance, and medical bills. Success rate is 70%+ just by asking.'},
    {n:24,t:'Subscription Audit',e:'🔎',b:'Review all subscriptions quarterly. Cancel what you haven\'t used in 30 days. The average person wastes $200+/month on unused subscriptions.'},
    {n:25,t:'Automating Finances',e:'🤖',b:'Automate bill payments, savings transfers, and investments. "Pay yourself first" means savings auto-transfer the day you get paid.'},
    {n:26,t:'Tax Basics for Young Adults',e:'📝',b:'Everyone earning above the standard deduction (~$14,600) must file taxes. Understanding tax brackets, deductions, and credits saves you money.'},
    {n:27,t:'W-2 vs 1099',e:'📋',b:'W-2: employer withholds taxes. 1099: you\'re responsible for all taxes (income + self-employment). Set aside 25-30% of 1099 income for taxes.'},
    {n:28,t:'How to File Taxes',e:'📁',b:'Gather W-2/1099 forms, use free filing software, claim all deductions and credits, file by April 15. Most young adults can file free.'},
    {n:29,t:'Standard vs Itemized Deductions',e:'🧮',b:'Standard deduction ($14,600 single) or itemize if your qualifying expenses exceed that. Most people benefit from the standard deduction.'},
    {n:30,t:'Tax Brackets Explained',e:'📊',b:'Tax brackets are marginal, not flat. Earning $50,000 doesn\'t mean all of it is taxed at 22%. Each bracket only applies to income in that range.'},
    {n:31,t:'Health Insurance Basics',e:'🏥',b:'Key terms: premium (monthly cost), deductible (what you pay before insurance kicks in), copay (fixed amount per visit), out-of-pocket max.'},
    {n:32,t:'Renters Insurance',e:'🏠',b:'Renters insurance covers your belongings against theft, fire, and damage for $15-30/month. It\'s one of the best value insurance products.'},
    {n:33,t:'Car Insurance',e:'🚗',b:'Required by law in most states. Covers liability (others\' damages), collision (your car), and comprehensive (theft, weather). Higher deductible = lower premiums.'},
    {n:34,t:'Life Insurance Overview',e:'🛡️',b:'Term life is affordable and covers a set period. Whole life is expensive with an investment component. Most young adults need term life only if they have dependents.'},
    {n:35,t:'What Is Net Worth?',e:'💎',b:'Net worth = assets (what you own) - liabilities (what you owe). It\'s the truest measure of financial health, not income.'},
    {n:36,t:'Calculating Your Net Worth',e:'🧮',b:'Add up: cash, investments, property value. Subtract: student loans, credit card debt, mortgage. Update quarterly to track progress.'},
    {n:37,t:'Saving for Large Purchases',e:'🎯',b:'For goals 1-5 years away, use high-yield savings or CDs. Don\'t invest short-term money in stocks — a market drop could derail your timeline.'},
    {n:38,t:'High-Yield Savings Accounts',e:'💰',b:'Online banks offer 4-5% APY vs 0.01% at traditional banks. On $10,000, that\'s $500/year vs $1/year. Same FDIC insurance, way better returns.'},
    {n:39,t:'Certificates of Deposit',e:'📜',b:'CDs lock your money for a set period (3 months to 5 years) at a fixed rate. Longer terms usually mean higher rates. Early withdrawal has penalties.'},
    {n:40,t:'Money Market Accounts',e:'🏛️',b:'Money markets blend savings and checking features: higher interest rates with limited check-writing ability. Good for large cash reserves.'},
    {n:41,t:'Estate Planning Basics',e:'📋',b:'Estate planning isn\'t just for the wealthy. Everyone needs a will, beneficiary designations, and basic healthcare directives.'},
    {n:42,t:'What Is a Will?',e:'📝',b:'A will specifies who gets your assets and who cares for your children. Without one, the state decides — often not what you\'d want.'},
    {n:43,t:'Power of Attorney',e:'⚖️',b:'A POA authorizes someone to make financial or medical decisions if you\'re unable. Everyone over 18 should have one.'},
    {n:44,t:'Beneficiary Designations',e:'👥',b:'Beneficiaries on retirement accounts, insurance, and bank accounts override your will. Review them after major life changes.'},
    {n:45,t:'Long-Term Wealth Building',e:'🏗️',b:'Wealth = income - spending + investment returns. Maximize all three: grow income, live below means, invest the difference consistently.'},
    {n:46,t:'Generational Wealth',e:'👨‍👩‍👧‍👦',b:'Generational wealth passes financial advantages to your children: funded education accounts, property, investment knowledge, and financial literacy.'},
    {n:47,t:'Financial Independence Basics',e:'🔓',b:'FI means having enough invested to live on 4% withdrawals annually. A $1M portfolio generates ~$40K/year. FI number = annual expenses × 25.'},
    {n:48,t:'Personal Finance Case Studies',e:'📚',b:'Study real examples of financial wins (paid off $100K in debt) and fails (bankruptcy from lifestyle inflation) to learn from others\' experiences.'},
    {n:49,t:'Building Your Financial Plan',e:'🗺️',b:'Your plan: 1) Track net worth monthly 2) Budget using 50/30/20 3) Build 6-month emergency fund 4) Eliminate high-interest debt 5) Invest 15%+ of income.'},
    {n:50,t:'Course Recap & Final Assessment',e:'🎓',b:'You\'ve mastered budgeting, credit, debt management, taxes, insurance, and wealth building. Time to prove your knowledge!'}
  ].map(({n,t,e,b}) => L(n,t,n%10===0?50:25,[
    c(e,t,b),
    tr(`${t} — Key Points`,[[`Key Concept 1`,`Core principle of ${t.toLowerCase()}`],[`Key Concept 2`,`Why this matters for your finances`],[`Key Concept 3`,`How to take action on this`],[`Common Mistake`,`What most people get wrong`]]),
    fb(`Understanding ${t.toLowerCase()} helps you make better ___ decisions.`,['financial','emotional','random','political'],0),
    q(`Why should you learn about ${t.toLowerCase()}?`,[`It directly impacts your financial wellbeing`,`It guarantees wealth`,`It\'s only for experts`,`It doesn\'t matter`],0,`${t} is essential knowledge for managing your personal finances.`),
    tf([{s:`${t} only matters for wealthy people`,a:false},{s:`Taking action on ${t.toLowerCase()} can improve your finances`,a:true},{s:`You should wait until you\'re older to learn about this`,a:false}]),
    sc(`You face a decision related to ${t.toLowerCase()}. What approach works best?`,[
      {label:'Apply the principles you\'ve learned and make an informed choice',outcome:'Making informed decisions is the foundation of good personal finance.',correct:true},
      {label:'Avoid making any decision',outcome:'Inaction is itself a decision — usually a costly one in personal finance.',correct:false},
      {label:'Copy what your friends are doing',outcome:'Everyone\'s financial situation is different. Make decisions based on your own circumstances.',correct:false}
    ]),
    m(`${t} Concepts`,[[`Term A`,`Definition of key concept A`],[`Term B`,`Definition of key concept B`],[`Term C`,`Definition of key concept C`]]),
    sl(`How important is ${t.toLowerCase()} for financial health? (1-10)`,1,10,8,'')
  ],[
    cq(`${t} is important because:`,[`It\'s required by law`,`It helps you manage money effectively`,`Only accountants need it`,`It guarantees wealth`],1,`${t} provides practical knowledge for better financial management.`),
    cq(`A key principle of ${t.toLowerCase()} is:`,[`Spend everything you earn`,`Make informed, intentional decisions`,`Ignore financial details`,`Follow trends blindly`],1,`Intentionality is the foundation of personal finance.`),
    cq(`The biggest mistake with ${t.toLowerCase()} is:`,[`Learning about it early`,`Procrastinating and not taking action`,`Asking too many questions`,`Being too careful`],1,`Procrastination is the enemy of financial progress.`),
    cq(`When should you apply knowledge of ${t.toLowerCase()}?`,[`Only during tax season`,`Continuously throughout life`,`Only when in debt`,`Never`],1,`Personal finance is an ongoing practice, not a one-time event.`),
    cq(`The best resource for ${t.toLowerCase()} is:`,[`Social media influencers only`,`A combination of education, practice, and professional advice`,`Guessing`,`Doing nothing`],1,`Combine learning with action for best results.`)
  ]))
];

export default lessons;
