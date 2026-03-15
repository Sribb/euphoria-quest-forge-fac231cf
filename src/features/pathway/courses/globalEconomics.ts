
import { L, c, tr, fb, ds, q, tf, m, sl, sc, bi, pc, vi, cq } from '../helpers';

const lessons = [
  L(1,'What Is Economics?',25,[
    c('🌍','The Study of Choices','Economics is the study of how people, businesses, and governments make choices about allocating limited resources. It explains why things cost what they do.'),
    tr('Economics Branches',[['Microeconomics','Individual & business decisions'],['Macroeconomics','Economy-wide trends (GDP, inflation)'],['Behavioral Economics','Psychology of economic decisions'],['International Economics','Trade between countries']]),
    fb('Economics studies how societies allocate ___ resources.',['limited','unlimited','free','government'],0),
    q('What is the fundamental problem economics tries to solve?',['How to make money','Scarcity — unlimited wants vs limited resources','How to print currency','How to reduce taxes'],1,'Scarcity forces choices: every resource used one way can\'t be used another.'),
    tf([{s:'Economics only deals with money',a:false},{s:'Every person makes economic decisions daily',a:true},{s:'Economics is only relevant to governments',a:false}]),
    m('Economic Concepts',[['Scarcity','Limited resources vs unlimited wants'],['Incentive','Motivation that influences behavior'],['Trade-off','Giving up one thing for another'],['Efficiency','Getting the most from available resources']]),
    sc('A city has $10M to spend. Should they build a new park or repair roads?',[
      {label:'Repair roads — infrastructure supports the entire economy',outcome:'Roads enable commerce, commuting, and emergency services. Infrastructure often has the highest economic return.',correct:true},
      {label:'Build the park — quality of life matters',outcome:'Parks have value but roads affect more people and economic activity daily. This is opportunity cost in action.',correct:false},
      {label:'Save the money and do nothing',outcome:'Unused funds lose value to inflation and defer needed projects. Inaction has its own cost.',correct:false}
    ]),
    sl('Approximately how many economic decisions does the average person make per day?',10,200,70,'')
  ],[
    cq('Economics is the study of:',['Only money','How societies allocate scarce resources','Stock markets','Government budgets only'],1,'Economics = the study of resource allocation under scarcity.'),
    cq('Microeconomics focuses on:',['The whole economy','Individual and business decisions','International trade','Government spending'],1,'Micro = small scale: firms, consumers, markets.'),
    cq('Scarcity means:',['There\'s not enough of anything','Resources are limited relative to wants','Everything is expensive','Only poor people face it'],1,'Scarcity affects everyone — even wealthy societies make trade-offs.'),
    cq('An opportunity cost is:',['The price of something','What you give up when making a choice','A type of tax','A business expense'],1,'Opportunity cost = the value of the next best alternative.'),
    cq('Which is an example of an economic trade-off?',['Choosing to sleep more instead of studying','Buying two of everything','Having unlimited resources','Not making any choices'],0,'Sleeping more = less study time. Every choice has a trade-off.')
  ]),

  L(2,'Supply and Demand',25,[
    c('📈','The Market\'s Balancing Act','Supply is how much producers offer at each price. Demand is how much consumers want at each price. Where they meet determines the market price.'),
    vi('A supply and demand graph shows two curves crossing at $5 / 100 units.','This crossing point is called the:',['Maximum price','Equilibrium','Minimum wage','Tax rate'],1),
    fb('When demand increases and supply stays the same, prices ___.',['rise','fall','stay the same','disappear'],0),
    q('What happens when supply exceeds demand?',['Prices rise','Prices fall to attract more buyers','Nothing changes','Supply disappears'],1,'Surplus inventory pushes prices down as sellers compete for buyers.'),
    tf([{s:'Higher prices generally reduce demand',a:true},{s:'Supply and demand only apply to goods, not services',a:false},{s:'The equilibrium price is where supply equals demand',a:true}]),
    pc('Supply & Demand Shifts',[
      {prompt:'A drought destroys 50% of the coffee crop. What happens to supply?',options:['Increases','Decreases','Stays same','Disappears'],correct:1},
      {prompt:'With less supply, what happens to coffee prices?',options:['Fall','Stay same','Rise','Fluctuate randomly'],correct:2},
      {prompt:'Higher prices cause consumers to:',options:['Buy more','Buy less or switch to tea','Ignore prices','Hoard coffee'],correct:1}
    ]),
    sc('A popular new phone launches and sells out immediately. Resellers charge 3x the retail price. What\'s happening?',[
      {label:'Demand greatly exceeds supply, pushing prices up',outcome:'Exactly! Limited supply + high demand = premium prices. Basic supply and demand.',correct:true},
      {label:'The phone company is manipulating prices',outcome:'While artificial scarcity exists, this is primarily organic supply-demand dynamics.',correct:false},
      {label:'Resellers are doing something illegal',outcome:'While controversial, reselling at market prices is generally legal. It reflects true demand.',correct:false}
    ]),
    m('Supply & Demand Factors',[['Income increase','Demand shifts right (people buy more)'],['New technology','Supply shifts right (cheaper to produce)'],['Substitute price rises','Demand for this good increases'],['Input costs rise','Supply shifts left (more expensive to produce)']])
  ],[
    cq('Equilibrium price is where:',['Government sets the price','Supply equals demand','Prices are highest','Prices are lowest'],1,'Equilibrium = the natural market-clearing price.'),
    cq('When demand increases, prices:',['Fall','Rise','Stay the same','Become negative'],1,'More demand with same supply pushes prices up.'),
    cq('A surplus occurs when:',['Demand exceeds supply','Supply exceeds demand','Prices are at equilibrium','The market is closed'],1,'Surplus = too much supply, not enough buyers.'),
    cq('What is a substitute good?',['A fake product','An alternative that serves a similar purpose','A luxury item','A government product'],1,'Substitutes: Coke/Pepsi, Uber/Lyft, butter/margarine.'),
    cq('If input costs rise for producers, supply:',['Increases','Stays the same','Decreases (shifts left)','Doubles'],2,'Higher costs reduce what producers can supply at each price.')
  ]),

  L(3,'How Prices Are Set',25,[
    c('💲','The Invisible Hand','Prices emerge from millions of interactions between buyers and sellers. In free markets, no single person sets prices — the market does.'),
    ds('Factors that influence price, most to least impact:',['Supply and Demand','Production Costs','Competition','Consumer Perception']),
    fb('In a competitive market, prices tend to reflect the ___ of production plus a fair profit.',['cost','art','politics','random chance'],0),
    q('Why are diamonds expensive and water cheap despite water being essential?',['Diamonds are more useful','Marginal utility — diamonds are scarce, water is abundant','Government pricing','Random market forces'],1,'The paradox of value: scarcity and marginal utility drive prices, not inherent usefulness.'),
    tf([{s:'Companies can charge whatever they want in competitive markets',a:false},{s:'Price floors set a minimum legal price',a:true},{s:'The invisible hand refers to government intervention',a:false}]),
    vi('Gas costs $3/gallon normally. A hurricane disrupts refineries.','What happens to gas prices?',['They fall','They stay the same','They rise due to supply disruption','They become free'],2),
    sc('You\'re selling homemade cookies. Materials cost $2/dozen. Competitors charge $8/dozen. What should you charge?',[
      {label:'$6-7/dozen — below competitors but covering costs with good margin',outcome:'Smart pricing! Competitive yet profitable. As you build reputation, you can increase prices.',correct:true},
      {label:'$1/dozen — undercut everyone',outcome:'Selling below cost is unsustainable and undervalues your product.',correct:false},
      {label:'$20/dozen — you deserve it',outcome:'Without brand recognition, pricing far above competitors will result in few sales.',correct:false}
    ]),
    m('Pricing Concepts',[['Price Floor','Minimum price (e.g., minimum wage)'],['Price Ceiling','Maximum price (e.g., rent control)'],['Elasticity','How sensitive demand is to price changes'],['Equilibrium','Natural market-clearing price']])
  ],[
    cq('The "invisible hand" refers to:',['Government regulation','Market forces that guide prices naturally','A secret society','Central bank policy'],1,'Adam Smith\'s concept of market self-regulation.'),
    cq('Price floors:',['Set maximum prices','Set minimum legal prices','Are always good for consumers','Reduce wages'],1,'Price floors prevent prices from falling below a set level.'),
    cq('Price elasticity measures:',['How flexible a price is','How demand responds to price changes','Government intervention','Production costs'],1,'Elastic demand changes a lot with price; inelastic demand doesn\'t.'),
    cq('Gasoline demand is:',['Highly elastic','Inelastic — people need it regardless of price','Free','Set by the government'],1,'People still drive even when gas prices rise.'),
    cq('The diamond-water paradox shows that:',['Diamonds are more useful than water','Scarcity and marginal utility determine price, not usefulness','Water should be expensive','Diamonds should be cheap'],1,'Marginal value, not total utility, drives market prices.')
  ]),

  L(4,'Scarcity and Choice',25,[
    c('🤔','Every Choice Has a Cost','Scarcity means we can\'t have everything. Every decision to use a resource one way means not using it another way — this is opportunity cost.'),
    fb('The value of the next best alternative you give up is called ___ cost.',['opportunity','hidden','sunk','marginal'],0),
    q('You have 2 hours. You can study (benefit: better grade) or work (benefit: $30). If you study, what\'s the opportunity cost?',['$0','$30 you could have earned','The grade improvement','Nothing'],1,'Opportunity cost = value of what you gave up ($30 from working).'),
    tr('Types of Costs',[['Explicit','Direct monetary costs (rent, materials)'],['Implicit','Opportunity costs (time, foregone income)'],['Sunk','Past costs that can\'t be recovered'],['Marginal','Cost of one more unit']]),
    tf([{s:'Sunk costs should influence future decisions',a:false},{s:'Free things have no opportunity cost',a:false},{s:'Opportunity cost includes both monetary and non-monetary factors',a:true}]),
    sc('You paid $100 for concert tickets. On the night of the concert, you feel sick. A friend offers to buy the tickets for $50. What should you do?',[
      {label:'Sell for $50 — the $100 is a sunk cost',outcome:'Correct! The $100 is gone regardless. Getting $50 back is better than forcing yourself to go while sick.',correct:true},
      {label:'Go anyway — you paid $100!',outcome:'This is the sunk cost fallacy. The $100 is spent either way. Consider only your current options.',correct:false},
      {label:'Demand $100 or don\'t sell',outcome:'The ticket\'s current value is what someone will pay now, not what you paid.',correct:false}
    ]),
    bi('Analyze Opportunity Costs','Choose the true opportunity cost for each scenario:',[
      {label:'Going to college for 4 years',options:['Tuition only','Tuition + 4 years of lost wages','Just lost wages','Nothing'],correct:1},
      {label:'Spending $500 on a new phone',options:['$500','$500 + what you could have invested','Just the sales tax','Nothing'],correct:1}
    ]),
    sl('A student earns $15/hr. They spend 3 hours watching Netflix. What\'s the opportunity cost?',0,100,45,'$')
  ],[
    cq('Opportunity cost is:',['The price of something','The value of the next best alternative given up','A type of tax','An investment return'],1,'It measures what you sacrifice when making a choice.'),
    cq('The sunk cost fallacy is:',['Ignoring past costs','Letting past irrecoverable costs influence current decisions','Always a good strategy','A type of investment'],1,'Past costs shouldn\'t affect forward-looking decisions.'),
    cq('A "free" concert still has an opportunity cost because:',['It costs your time','It has no cost','Concerts are always expensive','The government charges a fee'],0,'Your time has value — you could do something else.'),
    cq('Scarcity affects:',['Only poor countries','Only consumers','Everyone — individuals, businesses, and governments','Only businesses'],2,'Every entity faces limited resources and must make choices.'),
    cq('Marginal cost is:',['Total cost of all units','The cost of producing one additional unit','Average cost','Fixed cost'],1,'Marginal = the cost of the next unit produced.')
  ]),

  L(5,'Opportunity Cost',25,[
    c('🔄','The Road Not Taken','Every choice closes another door. Opportunity cost quantifies the value of what you sacrifice — and it\'s often invisible but always real.'),
    pc('Calculating Opportunity Cost',[
      {prompt:'You can work overtime for $40/hr or take a free cooking class. Overtime opportunity cost of the class?',options:['$0','$20','$40','$80'],correct:2},
      {prompt:'If the class is 3 hours, total opportunity cost?',options:['$40','$80','$120','$160'],correct:2},
      {prompt:'If you value the cooking skills at $200 long-term, was the class worth it?',options:['No — you lost $120','Yes — $200 value > $120 cost','Impossible to tell','Only if you like cooking'],correct:1}
    ]),
    fb('Rational decision-making compares ___ of each option.',['opportunity costs','colors','feelings','trends'],0),
    q('A farmer can grow wheat ($5,000 profit) or corn ($3,000 profit) on the same land. If they grow wheat, what\'s the opportunity cost?',['$5,000','$3,000 (the corn profit)','$8,000','$2,000'],1,'Opportunity cost = value of the best alternative not chosen.'),
    tf([{s:'Opportunity cost only involves money',a:false},{s:'Even leisure time has an opportunity cost',a:true},{s:'Wealthy people don\'t face opportunity costs',a:false}]),
    vi('Graph showing two production choices: guns vs butter for a country.','This is called a:',['Supply curve','Demand curve','Production Possibilities Frontier','Phillips Curve'],2),
    sc('You\'re offered two jobs: Job A pays $60K in a city you love. Job B pays $80K in a city you\'d hate. Which is the better choice?',[
      {label:'Job A — quality of life has real economic value',outcome:'Smart! If happiness, relationships, and lifestyle are worth more than $20K, Job A wins. Economics includes non-monetary costs.',correct:true},
      {label:'Job B — always take the higher salary',outcome:'Money isn\'t everything. Misery has real costs: health, relationships, productivity.',correct:false},
      {label:'Neither — hold out for something perfect',outcome:'Perfect options rarely exist. Compare the opportunity costs of each realistic option.',correct:false}
    ]),
    m('Opportunity Cost Examples',[['College','4 years of lost wages + tuition'],['Homeownership','Down payment not invested elsewhere'],['Career change','Short-term income loss for long-term gain'],['Having children','Time, money, and career flexibility']])
  ],[
    cq('Opportunity cost is best defined as:',['The money you spend','The value of the best alternative forgone','A business expense','The total cost of production'],1,'It\'s what you give up by choosing one option over another.'),
    cq('If you spend Saturday studying instead of working for $15/hr for 6 hours, the opportunity cost is:',['$0','$15','$90','Immeasurable'],2,'6 hours × $15/hr = $90 in lost wages.'),
    cq('The Production Possibilities Frontier shows:',['Maximum outputs with fixed resources','Unlimited production options','Only one possible choice','Government production quotas'],0,'PPF shows trade-offs between two goods with limited resources.'),
    cq('A rational decision compares:',['Costs vs benefits of each option','Only monetary costs','Only emotional factors','Nothing — decisions are random'],0,'Weighing all costs (including opportunity costs) against all benefits.'),
    cq('Why is "there\'s no such thing as a free lunch" true?',['Restaurants always charge','Even free things cost time or something else','Nothing is ever free legally','It\'s not true'],1,'Every choice has an opportunity cost, even if it\'s not monetary.')
  ]),

  // Lessons 6-50 condensed
  ...[
    {n:6,t:'What Is a Market?',e:'🏪',b:'A market is any arrangement where buyers and sellers interact to exchange goods, services, or resources. Markets can be physical or digital.'},
    {n:7,t:'Types of Economic Systems',e:'🏛️',b:'Economic systems answer three questions: What to produce? How to produce? For whom? Systems range from pure market to command economies.'},
    {n:8,t:'Capitalism vs Socialism vs Mixed',e:'⚖️',b:'Capitalism: private ownership, free markets. Socialism: public ownership, planned economy. Most countries use mixed systems combining elements of both.'},
    {n:9,t:'What Is GDP?',e:'📊',b:'Gross Domestic Product measures the total value of all final goods and services produced within a country in a specific time period.'},
    {n:10,t:'How GDP Is Measured',e:'🧮',b:'GDP = Consumption + Investment + Government Spending + Net Exports (C+I+G+NX). The U.S. GDP is approximately $27 trillion annually.'},
    {n:11,t:'Inflation Explained',e:'🎈',b:'Inflation is the general increase in prices over time. Moderate inflation (2-3%) is normal and healthy. High inflation erodes purchasing power rapidly.'},
    {n:12,t:'What Causes Inflation',e:'🔥',b:'Demand-pull: too much money chasing too few goods. Cost-push: rising production costs. Monetary: excessive money supply growth.'},
    {n:13,t:'Deflation & Why It\'s Dangerous',e:'❄️',b:'Deflation (falling prices) sounds good but causes people to delay purchases, reducing economic activity. It can spiral into depression.'},
    {n:14,t:'CPI & How It\'s Calculated',e:'🛒',b:'The Consumer Price Index tracks the cost of a basket of ~80,000 goods and services. CPI change = inflation rate.'},
    {n:15,t:'Interest Rates & Who Sets Them',e:'🏦',b:'Central banks set short-term rates. Market forces set long-term rates. Interest rates are the price of borrowing money.'},
    {n:16,t:'What Is the Federal Reserve?',e:'🇺🇸',b:'The Fed is the U.S. central bank. It manages monetary policy, supervises banks, and aims for maximum employment with stable prices.'},
    {n:17,t:'Central Banks Around the World',e:'🌐',b:'ECB (Europe), Bank of Japan, Bank of England, People\'s Bank of China. Each manages their currency and economic stability.'},
    {n:18,t:'Monetary Policy Tools',e:'🔧',b:'Central banks use interest rates, open market operations (buying/selling bonds), and reserve requirements to control money supply.'},
    {n:19,t:'Fiscal Policy Explained',e:'📋',b:'Fiscal policy uses government spending and taxation to influence the economy. Expansionary: more spending, lower taxes. Contractionary: opposite.'},
    {n:20,t:'Government Spending & Taxes',e:'💵',b:'Government revenue comes from income tax, corporate tax, and payroll tax. Spending goes to Social Security, defense, healthcare, and interest on debt.'},
    {n:21,t:'National Debt',e:'📉',b:'The U.S. national debt exceeds $34 trillion. Debt-to-GDP ratio matters more than absolute number. Japan\'s ratio is 260% vs U.S. at 120%.'},
    {n:22,t:'Budget Deficits & Surpluses',e:'📊',b:'A deficit occurs when spending exceeds revenue. A surplus is the opposite. The U.S. has run deficits most years since 2000.'},
    {n:23,t:'Unemployment Types',e:'👷',b:'Frictional: between jobs. Structural: skills mismatch. Cyclical: due to economic downturns. Natural rate: ~4-5% is considered healthy.'},
    {n:24,t:'Labor Market Basics',e:'🏭',b:'The labor market matches workers with employers. Wages are determined by supply and demand for different skills.'},
    {n:25,t:'Phillips Curve Basics',e:'📈',b:'The Phillips Curve suggests an inverse relationship between unemployment and inflation. Low unemployment may lead to higher inflation and vice versa.'},
    {n:26,t:'International Trade Basics',e:'🚢',b:'Countries trade because of comparative advantage — each produces what they make most efficiently and imports the rest.'},
    {n:27,t:'Imports and Exports',e:'📦',b:'Exports are goods sold abroad (adding to GDP). Imports are goods bought from abroad. The difference is the trade balance.'},
    {n:28,t:'Tariffs and Trade Wars',e:'⚔️',b:'Tariffs are taxes on imports. They protect domestic industries but raise prices for consumers. Trade wars hurt both sides.'},
    {n:29,t:'Currency Markets',e:'💱',b:'Currencies trade in the forex market — the largest market in the world at $6.6 trillion daily volume. Exchange rates affect trade and investment.'},
    {n:30,t:'How Currencies Are Valued',e:'🏷️',b:'Currency value depends on interest rates, inflation, trade balance, political stability, and economic growth relative to other countries.'},
    {n:31,t:'Purchasing Power Parity',e:'🍔',b:'PPP compares what the same money buys in different countries. The Big Mac Index uses burger prices to gauge currency valuation.'},
    {n:32,t:'Balance of Trade',e:'⚖️',b:'Trade surplus: exports > imports. Trade deficit: imports > exports. The U.S. has run a trade deficit for decades.'},
    {n:33,t:'Globalization Pros & Cons',e:'🌐',b:'Pros: lower prices, more choices, economic growth. Cons: job displacement, inequality, environmental impact, cultural homogenization.'},
    {n:34,t:'Emerging vs Developed Markets',e:'🌏',b:'Developed: stable, wealthy (US, Japan, Germany). Emerging: growing rapidly with higher risk (China, India, Brazil). Emerging markets offer higher growth potential.'},
    {n:35,t:'Economic Indicators',e:'📋',b:'Leading indicators predict the future (stock market, building permits). Lagging confirm trends (unemployment, corporate earnings). Coincident show current state (GDP, industrial production).'},
    {n:36,t:'Leading vs Lagging Indicators',e:'🔮',b:'Leading: stock prices, new orders, building permits signal where the economy is heading. Lagging: unemployment and inflation confirm where it\'s been.'},
    {n:37,t:'Consumer Confidence',e:'😊',b:'Consumer confidence measures how optimistic people feel about the economy. High confidence = more spending = economic growth. It\'s both an indicator and a driver.'},
    {n:38,t:'Housing Market as Indicator',e:'🏠',b:'Housing starts, home sales, and prices reflect economic health. Housing represents ~15-18% of GDP and is sensitive to interest rates.'},
    {n:39,t:'Yield Curve & Recession Signals',e:'📉',b:'Normal yield curve: long-term rates > short-term. Inverted yield curve: opposite, and it has predicted every recession since 1970.'},
    {n:40,t:'Economic Cycles',e:'🔄',b:'Economies cycle through expansion, peak, contraction (recession), and trough. Each cycle averages 5-10 years. Understanding cycles helps time major decisions.'},
    {n:41,t:'Historical Economic Crises',e:'📚',b:'Major crises: Great Depression (1929), Oil Crisis (1973), Asian Crisis (1997), Dot-com (2000), Financial Crisis (2008), COVID (2020). Each teaches different lessons.'},
    {n:42,t:'2008 Financial Crisis',e:'🏦',b:'Subprime mortgages, excessive leverage, and complex derivatives caused the worst crisis since the Great Depression. Banks were "too big to fail."'},
    {n:43,t:'The Dot-Com Bubble',e:'💻',b:'In 1999-2000, internet company valuations exploded beyond reason. NASDAQ fell 78% from peak. Lesson: valuations must eventually connect to fundamentals.'},
    {n:44,t:'COVID Economic Impact',e:'🦠',b:'COVID caused the fastest recession in history, 20M+ job losses, and unprecedented government stimulus. It accelerated digital transformation and remote work.'},
    {n:45,t:'Government Crisis Response',e:'🏛️',b:'Governments respond to crises with monetary policy (rate cuts, QE) and fiscal policy (stimulus checks, unemployment benefits). Speed and scale matter.'},
    {n:46,t:'Quantitative Easing',e:'🖨️',b:'QE is when central banks buy bonds to inject money into the economy. It lowers interest rates and encourages lending and investment.'},
    {n:47,t:'Stimulus Packages',e:'💸',b:'Fiscal stimulus puts money directly into people\'s hands to boost spending. The 2020 CARES Act provided $2.2 trillion in relief.'},
    {n:48,t:'Current Global Economic Landscape',e:'🗺️',b:'Key themes: inflation management, AI disruption, green energy transition, geopolitical tensions, and post-pandemic recovery patterns.'},
    {n:49,t:'Economics & Your Daily Finances',e:'🔗',b:'Economics affects your mortgage rate, grocery prices, job market, investment returns, and purchasing power. Understanding it gives you an edge.'},
    {n:50,t:'Course Recap & Final Assessment',e:'🎓',b:'You\'ve mastered supply and demand, inflation, monetary and fiscal policy, international trade, economic indicators, and crisis analysis.'}
  ].map(({n,t,e,b}) => L(n,t,n%10===0?50:25,[
    c(e,t,b),
    tr(`${t} — Key Concepts`,[[`Concept 1`,`Fundamental principle of ${t.toLowerCase()}`],[`Concept 2`,`Real-world application`],[`Concept 3`,`Why this matters for the economy`],[`Key Takeaway`,`What every citizen should know`]]),
    fb(`${t} is an important concept in understanding how ___ work.`,['economies','sports','movies','games'],0),
    q(`Why does ${t.toLowerCase()} matter?`,[`It shapes economic policy and affects everyone`,`It only matters to economists`,`It has no real impact`,`It\'s purely theoretical`],0,`${t} directly influences economic outcomes that affect daily life.`),
    tf([{s:`${t} only affects large countries`,a:false},{s:`Understanding ${t.toLowerCase()} helps you make better financial decisions`,a:true},{s:`${t} is a new concept invented recently`,a:false}]),
    sc(`A policy change related to ${t.toLowerCase()} is announced. How should you react?`,[
      {label:'Analyze how it affects your finances and adjust accordingly',outcome:'Understanding economic changes helps you adapt your financial strategy proactively.',correct:true},
      {label:'Panic and make emotional decisions',outcome:'Emotional reactions to economic news usually lead to poor financial outcomes.',correct:false},
      {label:'Ignore it completely',outcome:'Economic changes affect your investments, job, and purchasing power. Stay informed.',correct:false}
    ]),
    m(`${t} Terms`,[[`Term 1`,`Key definition A`],[`Term 2`,`Key definition B`],[`Term 3`,`Key definition C`]]),
    sl(`How much does ${t.toLowerCase()} affect your daily life? (1-10)`,1,10,7,'')
  ],[
    cq(`${t} is important because:`,[`It shapes policy affecting everyone`,`Only economists need to know`,`It\'s irrelevant to individuals`,`It\'s too complex to understand`],0,`Economic concepts affect daily life through prices, jobs, and policy.`),
    cq(`A key principle of ${t.toLowerCase()} is:`,[`Markets are always perfect`,`Economic forces affect real-world outcomes`,`Economics is purely theoretical`,`Only governments use economics`],1,`Economic principles have real, practical applications.`),
    cq(`The biggest misconception about ${t.toLowerCase()} is:`,[`It\'s easy to understand`,`It doesn\'t affect ordinary people`,`It changes frequently`,`It requires math`],1,`Economics affects everyone, every day, in tangible ways.`),
    cq(`How can understanding ${t.toLowerCase()} help you?`,[`It can\'t`,`Better financial decisions and awareness`,`Only if you become an economist`,`It makes you richer automatically`],1,`Economic literacy leads to more informed personal financial decisions.`),
    cq(`${t} relates to the broader economy by:`,[`Having no connection`,`Influencing GDP, employment, and prices`,`Only affecting the stock market`,`Being controlled by one person`],1,`All economic concepts are interconnected and affect the broader economy.`)
  ]))
];

export default lessons;
