// 120 Achievement Badges organized by category
export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  icon: string; // euphoria icon name
  category: BadgeCategory;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  requirement: {
    type: string;
    value: number;
    label: string;
  };
}

export type BadgeCategory =
  | "learning"
  | "streaks"
  | "trading"
  | "games"
  | "social"
  | "xp"
  | "coins"
  | "time"
  | "daily-challenge"
  | "special";

export const BADGE_CATEGORIES: { id: BadgeCategory; label: string; icon: string }[] = [
  { id: "learning", label: "Learning", icon: "open-book" },
  { id: "streaks", label: "Streaks", icon: "flame" },
  { id: "trading", label: "Trading", icon: "line-up" },
  { id: "games", label: "Games", icon: "controller" },
  { id: "social", label: "Social", icon: "chat" },
  { id: "xp", label: "XP & Levels", icon: "star" },
  { id: "coins", label: "Coins", icon: "coin" },
  { id: "time", label: "Time-Based", icon: "radiate" },
  { id: "daily-challenge", label: "Daily Challenge", icon: "shop-calendar" },
  { id: "special", label: "Special", icon: "sparkles" },
];

export const RARITY_CONFIG = {
  common: { label: "Common", color: "from-slate-400 to-slate-500", border: "border-slate-400/40", bg: "bg-slate-500/10", text: "text-slate-400" },
  uncommon: { label: "Uncommon", color: "from-emerald-400 to-green-500", border: "border-emerald-400/40", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  rare: { label: "Rare", color: "from-blue-400 to-cyan-500", border: "border-blue-400/40", bg: "bg-blue-500/10", text: "text-blue-400" },
  epic: { label: "Epic", color: "from-purple-400 to-pink-500", border: "border-purple-400/40", bg: "bg-purple-500/10", text: "text-purple-400" },
  legendary: { label: "Legendary", color: "from-amber-400 to-orange-500", border: "border-amber-400/40", bg: "bg-amber-500/10", text: "text-amber-400" },
};

export const ALL_BADGES: BadgeDefinition[] = [
  // ═══════════════════════════════════════════
  // LEARNING (20 badges)
  // ═══════════════════════════════════════════
  { id: "first-lesson", title: "First Lesson", description: "Complete your very first lesson.", icon: "grad-cap", category: "learning", rarity: "common", requirement: { type: "lessons_completed", value: 1, label: "Complete 1 lesson" } },
  { id: "curious-mind", title: "Curious Mind", description: "Complete 3 lessons.", icon: "brain", category: "learning", rarity: "common", requirement: { type: "lessons_completed", value: 3, label: "Complete 3 lessons" } },
  { id: "knowledge-seeker", title: "Knowledge Seeker", description: "Complete 5 lessons.", icon: "research", category: "learning", rarity: "common", requirement: { type: "lessons_completed", value: 5, label: "Complete 5 lessons" } },
  { id: "studious", title: "Studious", description: "Complete 10 lessons.", icon: "open-book", category: "learning", rarity: "uncommon", requirement: { type: "lessons_completed", value: 10, label: "Complete 10 lessons" } },
  { id: "half-scholar", title: "Half Scholar", description: "Complete 25 lessons.", icon: "textbook", category: "learning", rarity: "uncommon", requirement: { type: "lessons_completed", value: 25, label: "Complete 25 lessons" } },
  { id: "dedicated-learner", title: "Dedicated Learner", description: "Complete 50 lessons.", icon: "target", category: "learning", rarity: "rare", requirement: { type: "lessons_completed", value: 50, label: "Complete 50 lessons" } },
  { id: "lesson-centurion", title: "Lesson Centurion", description: "Complete 100 lessons.", icon: "perfect", category: "learning", rarity: "epic", requirement: { type: "lessons_completed", value: 100, label: "Complete 100 lessons" } },
  { id: "budgeting-beginner", title: "Budgeting Beginner", description: "Complete your first Personal Finance lesson.", icon: "money-bag", category: "learning", rarity: "common", requirement: { type: "pathway_personal-finance", value: 1, label: "Complete 1 Personal Finance lesson" } },
  { id: "budget-boss", title: "Budget Boss", description: "Complete 10 Personal Finance lessons.", icon: "crown", category: "learning", rarity: "uncommon", requirement: { type: "pathway_personal-finance", value: 10, label: "Complete 10 Personal Finance lessons" } },
  { id: "investing-initiate", title: "Investing Initiate", description: "Complete your first Investing lesson.", icon: "bar-chart", category: "learning", rarity: "common", requirement: { type: "pathway_investing", value: 1, label: "Complete 1 Investing lesson" } },
  { id: "investment-expert", title: "Investment Expert", description: "Complete 15 Investing lessons.", icon: "bank", category: "learning", rarity: "rare", requirement: { type: "pathway_investing", value: 15, label: "Complete 15 Investing lessons" } },
  { id: "trading-trainee", title: "Trading Trainee", description: "Complete your first Trading lesson.", icon: "trend-line", category: "learning", rarity: "common", requirement: { type: "pathway_trading", value: 1, label: "Complete 1 Trading lesson" } },
  { id: "trading-titan", title: "Trading Titan", description: "Complete 15 Trading lessons.", icon: "shark", category: "learning", rarity: "rare", requirement: { type: "pathway_trading", value: 15, label: "Complete 15 Trading lessons" } },
  { id: "corp-finance-starter", title: "Corporate Curious", description: "Complete your first Corporate Finance lesson.", icon: "building", category: "learning", rarity: "common", requirement: { type: "pathway_corporate-finance", value: 1, label: "Complete 1 Corporate Finance lesson" } },
  { id: "corp-finance-pro", title: "Corporate Pro", description: "Complete 15 Corporate Finance lessons.", icon: "capitol", category: "learning", rarity: "rare", requirement: { type: "pathway_corporate-finance", value: 15, label: "Complete 15 Corporate Finance lessons" } },
  { id: "alt-assets-explorer", title: "Alt Explorer", description: "Complete your first Alternative Assets lesson.", icon: "diamond", category: "learning", rarity: "common", requirement: { type: "pathway_alternative-assets", value: 1, label: "Complete 1 Alt Assets lesson" } },
  { id: "alt-assets-expert", title: "Alt Expert", description: "Complete 15 Alternative Assets lessons.", icon: "gallery", category: "learning", rarity: "rare", requirement: { type: "pathway_alternative-assets", value: 15, label: "Complete 15 Alt Assets lessons" } },
  { id: "perfect-quiz", title: "Perfect Score", description: "Score 100% on any quiz.", icon: "diamond", category: "learning", rarity: "uncommon", requirement: { type: "perfect_quiz", value: 1, label: "Get a perfect quiz score" } },
  { id: "quiz-master", title: "Quiz Master", description: "Score 100% on 10 quizzes.", icon: "trophy", category: "learning", rarity: "epic", requirement: { type: "perfect_quiz", value: 10, label: "Get 10 perfect quiz scores" } },
  { id: "all-pathways", title: "Renaissance Investor", description: "Complete at least 1 lesson in all 5 pathways.", icon: "glow-star", category: "learning", rarity: "rare", requirement: { type: "all_pathways_started", value: 5, label: "Start all 5 pathways" } },

  // ═══════════════════════════════════════════
  // STREAKS (15 badges)
  // ═══════════════════════════════════════════
  { id: "streak-3", title: "Getting Started", description: "Maintain a 3-day streak.", icon: "flame", category: "streaks", rarity: "common", requirement: { type: "streak_days", value: 3, label: "3-day streak" } },
  { id: "streak-7", title: "Week Warrior", description: "Maintain a 7-day streak.", icon: "flame", category: "streaks", rarity: "common", requirement: { type: "streak_days", value: 7, label: "7-day streak" } },
  { id: "streak-14", title: "Two-Week Titan", description: "Maintain a 14-day streak.", icon: "flame", category: "streaks", rarity: "uncommon", requirement: { type: "streak_days", value: 14, label: "14-day streak" } },
  { id: "streak-21", title: "Habit Former", description: "Maintain a 21-day streak.", icon: "flame", category: "streaks", rarity: "uncommon", requirement: { type: "streak_days", value: 21, label: "21-day streak" } },
  { id: "streak-30", title: "Monthly Master", description: "Maintain a 30-day streak.", icon: "moon", category: "streaks", rarity: "rare", requirement: { type: "streak_days", value: 30, label: "30-day streak" } },
  { id: "streak-60", title: "Iron Will", description: "Maintain a 60-day streak.", icon: "sword", category: "streaks", rarity: "rare", requirement: { type: "streak_days", value: 60, label: "60-day streak" } },
  { id: "streak-90", title: "Quarter Champion", description: "Maintain a 90-day streak.", icon: "shield", category: "streaks", rarity: "epic", requirement: { type: "streak_days", value: 90, label: "90-day streak" } },
  { id: "streak-180", title: "Half-Year Hero", description: "Maintain a 180-day streak.", icon: "streak-crown", category: "streaks", rarity: "epic", requirement: { type: "streak_days", value: 180, label: "180-day streak" } },
  { id: "streak-365", title: "Unstoppable", description: "Maintain a 365-day streak.", icon: "streak-trophy", category: "streaks", rarity: "legendary", requirement: { type: "streak_days", value: 365, label: "365-day streak" } },
  { id: "streak-freeze-saver", title: "Freeze Saver", description: "Use a streak freeze to save your streak.", icon: "ice", category: "streaks", rarity: "common", requirement: { type: "freeze_used", value: 1, label: "Use 1 streak freeze" } },
  { id: "comeback-kid", title: "Comeback Kid", description: "Rebuild a streak to 7 days after losing one.", icon: "flex", category: "streaks", rarity: "uncommon", requirement: { type: "streak_rebuild", value: 7, label: "Rebuild to 7-day streak" } },
  { id: "streak-50", title: "Fifty & Fierce", description: "Maintain a 50-day streak.", icon: "flame", category: "streaks", rarity: "rare", requirement: { type: "streak_days", value: 50, label: "50-day streak" } },
  { id: "streak-100", title: "Century Streak", description: "Maintain a 100-day streak.", icon: "hundred", category: "streaks", rarity: "epic", requirement: { type: "streak_days", value: 100, label: "100-day streak" } },
  { id: "streak-150", title: "Relentless", description: "Maintain a 150-day streak.", icon: "lightning", category: "streaks", rarity: "epic", requirement: { type: "streak_days", value: 150, label: "150-day streak" } },
  { id: "streak-250", title: "Legendary Streak", description: "Maintain a 250-day streak.", icon: "volcano", category: "streaks", rarity: "legendary", requirement: { type: "streak_days", value: 250, label: "250-day streak" } },

  // ═══════════════════════════════════════════
  // TRADING (15 badges)
  // ═══════════════════════════════════════════
  { id: "first-trade", title: "First Trade", description: "Execute your very first trade.", icon: "line-up", category: "trading", rarity: "common", requirement: { type: "trades_completed", value: 1, label: "Complete 1 trade" } },
  { id: "active-trader", title: "Active Trader", description: "Complete 10 trades.", icon: "analytics", category: "trading", rarity: "common", requirement: { type: "trades_completed", value: 10, label: "Complete 10 trades" } },
  { id: "seasoned-trader", title: "Seasoned Trader", description: "Complete 25 trades.", icon: "gains", category: "trading", rarity: "uncommon", requirement: { type: "trades_completed", value: 25, label: "Complete 25 trades" } },
  { id: "trading-veteran", title: "Trading Veteran", description: "Complete 50 trades.", icon: "medal", category: "trading", rarity: "rare", requirement: { type: "trades_completed", value: 50, label: "Complete 50 trades" } },
  { id: "trading-legend", title: "Trading Legend", description: "Complete 100 trades.", icon: "champion", category: "trading", rarity: "epic", requirement: { type: "trades_completed", value: 100, label: "Complete 100 trades" } },
  { id: "diversifier", title: "Diversifier", description: "Hold 5 different stocks at once.", icon: "palette", category: "trading", rarity: "uncommon", requirement: { type: "unique_stocks_held", value: 5, label: "Hold 5 different stocks" } },
  { id: "portfolio-builder", title: "Portfolio Builder", description: "Hold 10 different stocks at once.", icon: "builder", category: "trading", rarity: "rare", requirement: { type: "unique_stocks_held", value: 10, label: "Hold 10 different stocks" } },
  { id: "bull-run", title: "Bull Run", description: "Achieve a portfolio value of $15,000.", icon: "bull", category: "trading", rarity: "uncommon", requirement: { type: "portfolio_value", value: 15000, label: "Portfolio value $15,000" } },
  { id: "big-gains", title: "Big Gains", description: "Achieve a portfolio value of $25,000.", icon: "rocket", category: "trading", rarity: "rare", requirement: { type: "portfolio_value", value: 25000, label: "Portfolio value $25,000" } },
  { id: "whale-status", title: "Whale Status", description: "Achieve a portfolio value of $50,000.", icon: "whale", category: "trading", rarity: "epic", requirement: { type: "portfolio_value", value: 50000, label: "Portfolio value $50,000" } },
  { id: "millionaire", title: "Millionaire", description: "Achieve a portfolio value of $100,000.", icon: "gem", category: "trading", rarity: "legendary", requirement: { type: "portfolio_value", value: 100000, label: "Portfolio value $100,000" } },
  { id: "buy-the-dip", title: "Buy the Dip", description: "Buy a stock that dropped 5%+ in a day.", icon: "cart", category: "trading", rarity: "uncommon", requirement: { type: "buy_dip", value: 1, label: "Buy during a dip" } },
  { id: "penny-pincher", title: "Penny Pincher", description: "Complete a trade under $10 total.", icon: "coin", category: "trading", rarity: "common", requirement: { type: "small_trade", value: 1, label: "Make a small trade" } },
  { id: "big-spender", title: "Big Spender", description: "Complete a single trade over $5,000.", icon: "cash", category: "trading", rarity: "rare", requirement: { type: "large_trade", value: 5000, label: "Single trade over $5,000" } },
  { id: "profit-maker", title: "Profit Maker", description: "Close a position with 20%+ profit.", icon: "rich", category: "trading", rarity: "rare", requirement: { type: "profit_percent", value: 20, label: "20%+ profit on a trade" } },

  // ═══════════════════════════════════════════
  // GAMES (12 badges)
  // ═══════════════════════════════════════════
  { id: "first-game", title: "Player One", description: "Play your first game.", icon: "controller", category: "games", rarity: "common", requirement: { type: "games_played", value: 1, label: "Play 1 game" } },
  { id: "game-5", title: "Gamer", description: "Play 5 games.", icon: "joystick", category: "games", rarity: "common", requirement: { type: "games_played", value: 5, label: "Play 5 games" } },
  { id: "game-25", title: "Game Master", description: "Play 25 games.", icon: "game-medal", category: "games", rarity: "uncommon", requirement: { type: "games_played", value: 25, label: "Play 25 games" } },
  { id: "game-50", title: "Game Legend", description: "Play 50 games.", icon: "alien", category: "games", rarity: "rare", requirement: { type: "games_played", value: 50, label: "Play 50 games" } },
  { id: "game-100", title: "Arcade King", description: "Play 100 games.", icon: "joystick", category: "games", rarity: "epic", requirement: { type: "games_played", value: 100, label: "Play 100 games" } },
  { id: "high-scorer", title: "High Scorer", description: "Score 90+ on any game.", icon: "bullseye", category: "games", rarity: "uncommon", requirement: { type: "high_score", value: 90, label: "Score 90+ in a game" } },
  { id: "perfect-game", title: "Flawless Victory", description: "Score 100 on any game.", icon: "game-perfect", category: "games", rarity: "rare", requirement: { type: "high_score", value: 100, label: "Score 100 in a game" } },
  { id: "game-streak-3", title: "Winning Streak", description: "Win 3 games in a row.", icon: "hot-streak", category: "games", rarity: "uncommon", requirement: { type: "game_win_streak", value: 3, label: "Win 3 games in a row" } },
  { id: "game-streak-5", title: "Hot Hand", description: "Win 5 games in a row.", icon: "high-five", category: "games", rarity: "rare", requirement: { type: "game_win_streak", value: 5, label: "Win 5 games in a row" } },
  { id: "game-streak-10", title: "Unbeatable", description: "Win 10 games in a row.", icon: "king", category: "games", rarity: "epic", requirement: { type: "game_win_streak", value: 10, label: "Win 10 games in a row" } },
  { id: "coins-from-games", title: "Game Earner", description: "Earn 500 coins from games.", icon: "token", category: "games", rarity: "uncommon", requirement: { type: "game_coins_earned", value: 500, label: "Earn 500 coins from games" } },
  { id: "coins-from-games-pro", title: "Casino Royale", description: "Earn 2,000 coins from games.", icon: "jackpot", category: "games", rarity: "rare", requirement: { type: "game_coins_earned", value: 2000, label: "Earn 2,000 coins from games" } },

  // ═══════════════════════════════════════════
  // SOCIAL (10 badges)
  // ═══════════════════════════════════════════
  { id: "first-post", title: "First Post", description: "Create your first community post.", icon: "post", category: "social", rarity: "common", requirement: { type: "posts_created", value: 1, label: "Create 1 post" } },
  { id: "social-butterfly", title: "Social Butterfly", description: "Create 10 community posts.", icon: "butterfly", category: "social", rarity: "uncommon", requirement: { type: "posts_created", value: 10, label: "Create 10 posts" } },
  { id: "influencer", title: "Influencer", description: "Create 50 community posts.", icon: "announce", category: "social", rarity: "rare", requirement: { type: "posts_created", value: 50, label: "Create 50 posts" } },
  { id: "first-comment", title: "Commentator", description: "Leave your first comment.", icon: "chat", category: "social", rarity: "common", requirement: { type: "comments_made", value: 1, label: "Leave 1 comment" } },
  { id: "active-commenter", title: "Discussion Leader", description: "Leave 25 comments.", icon: "speaker", category: "social", rarity: "uncommon", requirement: { type: "comments_made", value: 25, label: "Leave 25 comments" } },
  { id: "first-like", title: "Thumbs Up", description: "Like your first post.", icon: "like", category: "social", rarity: "common", requirement: { type: "likes_given", value: 1, label: "Like 1 post" } },
  { id: "generous-liker", title: "Generous", description: "Like 50 posts.", icon: "heart", category: "social", rarity: "uncommon", requirement: { type: "likes_given", value: 50, label: "Like 50 posts" } },
  { id: "popular-post", title: "Viral", description: "Get 10 likes on a single post.", icon: "spotlight", category: "social", rarity: "rare", requirement: { type: "post_likes_received", value: 10, label: "Get 10 likes on a post" } },
  { id: "community-pillar", title: "Community Pillar", description: "Create 100 posts.", icon: "forum", category: "social", rarity: "epic", requirement: { type: "posts_created", value: 100, label: "Create 100 posts" } },
  { id: "mentor-mode", title: "Mentor Activated", description: "Enable Mentor Mode.", icon: "mentor", category: "social", rarity: "uncommon", requirement: { type: "mentor_enabled", value: 1, label: "Enable Mentor Mode" } },

  // ═══════════════════════════════════════════
  // XP & LEVELS (12 badges)
  // ═══════════════════════════════════════════
  { id: "xp-100", title: "XP Starter", description: "Earn 100 XP.", icon: "star", category: "xp", rarity: "common", requirement: { type: "total_xp", value: 100, label: "Earn 100 XP" } },
  { id: "xp-500", title: "Rising Star", description: "Earn 500 XP.", icon: "glow-star", category: "xp", rarity: "common", requirement: { type: "total_xp", value: 500, label: "Earn 500 XP" } },
  { id: "xp-1000", title: "XP Collector", description: "Earn 1,000 XP.", icon: "sparkles", category: "xp", rarity: "uncommon", requirement: { type: "total_xp", value: 1000, label: "Earn 1,000 XP" } },
  { id: "xp-2500", title: "XP Hoarder", description: "Earn 2,500 XP.", icon: "burst", category: "xp", rarity: "uncommon", requirement: { type: "total_xp", value: 2500, label: "Earn 2,500 XP" } },
  { id: "xp-5000", title: "XP Machine", description: "Earn 5,000 XP.", icon: "shooting", category: "xp", rarity: "rare", requirement: { type: "total_xp", value: 5000, label: "Earn 5,000 XP" } },
  { id: "xp-10000", title: "XP Legend", description: "Earn 10,000 XP.", icon: "trophy", category: "xp", rarity: "epic", requirement: { type: "total_xp", value: 10000, label: "Earn 10,000 XP" } },
  { id: "xp-25000", title: "XP Overlord", description: "Earn 25,000 XP.", icon: "xp-crown", category: "xp", rarity: "legendary", requirement: { type: "total_xp", value: 25000, label: "Earn 25,000 XP" } },
  { id: "level-2", title: "Level Up!", description: "Reach Level 2.", icon: "line-up", category: "xp", rarity: "common", requirement: { type: "level", value: 2, label: "Reach Level 2" } },
  { id: "level-5", title: "Rising Talent", description: "Reach Level 5.", icon: "radiate", category: "xp", rarity: "uncommon", requirement: { type: "level", value: 5, label: "Reach Level 5" } },
  { id: "level-7", title: "Expert", description: "Reach Level 7.", icon: "ribbon", category: "xp", rarity: "rare", requirement: { type: "level", value: 7, label: "Reach Level 7" } },
  { id: "level-9", title: "Master", description: "Reach Level 9.", icon: "medal", category: "xp", rarity: "epic", requirement: { type: "level", value: 9, label: "Reach Level 9" } },
  { id: "level-10", title: "Max Level", description: "Reach the maximum Level 10.", icon: "glow-star", category: "xp", rarity: "legendary", requirement: { type: "level", value: 10, label: "Reach Level 10" } },

  // ═══════════════════════════════════════════
  // COINS (8 badges)
  // ═══════════════════════════════════════════
  { id: "coins-100", title: "Pocket Change", description: "Earn 100 coins.", icon: "coin", category: "coins", rarity: "common", requirement: { type: "total_coins", value: 100, label: "Earn 100 coins" } },
  { id: "coins-500", title: "Coin Collector", description: "Earn 500 coins.", icon: "money-bag", category: "coins", rarity: "common", requirement: { type: "total_coins", value: 500, label: "Earn 500 coins" } },
  { id: "coins-1000", title: "Money Bags", description: "Earn 1,000 coins.", icon: "cash", category: "coins", rarity: "uncommon", requirement: { type: "total_coins", value: 1000, label: "Earn 1,000 coins" } },
  { id: "coins-2500", title: "Rich Kid", description: "Earn 2,500 coins.", icon: "rich", category: "coins", rarity: "uncommon", requirement: { type: "total_coins", value: 2500, label: "Earn 2,500 coins" } },
  { id: "coins-5000", title: "Wealthy", description: "Earn 5,000 coins.", icon: "gem", category: "coins", rarity: "rare", requirement: { type: "total_coins", value: 5000, label: "Earn 5,000 coins" } },
  { id: "coins-10000", title: "Tycoon", description: "Earn 10,000 coins.", icon: "bank", category: "coins", rarity: "epic", requirement: { type: "total_coins", value: 10000, label: "Earn 10,000 coins" } },
  { id: "coins-25000", title: "Mogul", description: "Earn 25,000 coins.", icon: "crown", category: "coins", rarity: "epic", requirement: { type: "total_coins", value: 25000, label: "Earn 25,000 coins" } },
  { id: "coins-50000", title: "Financial Emperor", description: "Earn 50,000 coins.", icon: "capitol", category: "coins", rarity: "legendary", requirement: { type: "total_coins", value: 50000, label: "Earn 50,000 coins" } },

  // ═══════════════════════════════════════════
  // TIME-BASED (12 badges)
  // ═══════════════════════════════════════════
  { id: "night-owl", title: "Night Owl", description: "Complete a lesson after 10 PM.", icon: "moon", category: "time", rarity: "uncommon", requirement: { type: "night_owl", value: 1, label: "Learn after 10 PM" } },
  { id: "early-bird", title: "Early Bird", description: "Complete a lesson before 7 AM.", icon: "radiate", category: "time", rarity: "uncommon", requirement: { type: "early_bird", value: 1, label: "Learn before 7 AM" } },
  { id: "midnight-scholar", title: "Midnight Scholar", description: "Complete a lesson at midnight.", icon: "moon", category: "time", rarity: "rare", requirement: { type: "midnight_lesson", value: 1, label: "Learn at midnight" } },
  { id: "weekend-warrior", title: "Weekend Warrior", description: "Complete 5 lessons on weekends.", icon: "star-burst", category: "time", rarity: "uncommon", requirement: { type: "weekend_lessons", value: 5, label: "Complete 5 weekend lessons" } },
  { id: "speed-demon", title: "Speed Demon", description: "Complete a lesson in under 2 minutes.", icon: "lightning", category: "time", rarity: "rare", requirement: { type: "speed_completion", value: 1, label: "Sub-2-minute lesson" } },
  { id: "marathon-learner", title: "Marathon Learner", description: "Study for 60+ minutes in one session.", icon: "shooting", category: "time", rarity: "rare", requirement: { type: "session_minutes", value: 60, label: "60+ min session" } },
  { id: "five-a-day", title: "Five-a-Day", description: "Complete 5 lessons in a single day.", icon: "sparkle", category: "time", rarity: "rare", requirement: { type: "lessons_in_day", value: 5, label: "5 lessons in one day" } },
  { id: "ten-a-day", title: "Learning Machine", description: "Complete 10 lessons in a single day.", icon: "orb", category: "time", rarity: "epic", requirement: { type: "lessons_in_day", value: 10, label: "10 lessons in one day" } },
  { id: "new-year", title: "New Year Learner", description: "Complete a lesson on January 1st.", icon: "sparkles", category: "time", rarity: "rare", requirement: { type: "new_year_lesson", value: 1, label: "Learn on Jan 1st" } },
  { id: "holiday-hustle", title: "Holiday Hustle", description: "Complete a lesson on a holiday.", icon: "star-burst", category: "time", rarity: "uncommon", requirement: { type: "holiday_lesson", value: 1, label: "Learn on a holiday" } },
  { id: "lunch-learner", title: "Lunch Break Learner", description: "Complete a lesson between 12-1 PM.", icon: "badge", category: "time", rarity: "common", requirement: { type: "lunch_lesson", value: 1, label: "Learn during lunch" } },
  { id: "consistent-time", title: "Creature of Habit", description: "Learn at the same hour 7 days in a row.", icon: "radiate", category: "time", rarity: "epic", requirement: { type: "same_hour_streak", value: 7, label: "Same time 7 days" } },

  // ═══════════════════════════════════════════
  // DAILY CHALLENGE (10 badges)
  // ═══════════════════════════════════════════
  { id: "dc-first", title: "Challenge Accepted", description: "Complete your first daily challenge.", icon: "shop-calendar", category: "daily-challenge", rarity: "common", requirement: { type: "daily_challenges_completed", value: 1, label: "Complete 1 daily challenge" } },
  { id: "dc-7", title: "Weekly Challenger", description: "Complete 7 daily challenges.", icon: "shop-calendar", category: "daily-challenge", rarity: "common", requirement: { type: "daily_challenges_completed", value: 7, label: "Complete 7 daily challenges" } },
  { id: "dc-30", title: "Monthly Challenger", description: "Complete 30 daily challenges.", icon: "shop-calendar", category: "daily-challenge", rarity: "uncommon", requirement: { type: "daily_challenges_completed", value: 30, label: "Complete 30 daily challenges" } },
  { id: "dc-100", title: "Challenge Veteran", description: "Complete 100 daily challenges.", icon: "medal", category: "daily-challenge", rarity: "rare", requirement: { type: "daily_challenges_completed", value: 100, label: "Complete 100 daily challenges" } },
  { id: "dc-365", title: "Year of Challenges", description: "Complete all 365 daily challenges.", icon: "trophy", category: "daily-challenge", rarity: "legendary", requirement: { type: "daily_challenges_completed", value: 365, label: "Complete all 365 challenges" } },
  { id: "dc-streak-7", title: "Challenge Streak 7", description: "7-day daily challenge streak.", icon: "flame", category: "daily-challenge", rarity: "uncommon", requirement: { type: "dc_streak", value: 7, label: "7-day challenge streak" } },
  { id: "dc-streak-30", title: "Challenge Streak 30", description: "30-day daily challenge streak.", icon: "flex", category: "daily-challenge", rarity: "rare", requirement: { type: "dc_streak", value: 30, label: "30-day challenge streak" } },
  { id: "dc-streak-100", title: "Challenge Streak 100", description: "100-day daily challenge streak.", icon: "volcano", category: "daily-challenge", rarity: "epic", requirement: { type: "dc_streak", value: 100, label: "100-day challenge streak" } },
  { id: "dc-perfect-10", title: "Perfect Ten", description: "Answer 10 daily challenges correctly in a row.", icon: "hundred", category: "daily-challenge", rarity: "rare", requirement: { type: "dc_correct_streak", value: 10, label: "10 correct in a row" } },
  { id: "dc-accuracy-90", title: "Sharp Mind", description: "Maintain 90%+ accuracy on daily challenges.", icon: "target", category: "daily-challenge", rarity: "epic", requirement: { type: "dc_accuracy", value: 90, label: "90%+ accuracy rate" } },

  // ═══════════════════════════════════════════
  // SPECIAL (6 badges)
  // ═══════════════════════════════════════════
  { id: "onboarding-complete", title: "Welcome Aboard", description: "Complete the onboarding quiz.", icon: "rocket", category: "special", rarity: "common", requirement: { type: "onboarding_completed", value: 1, label: "Complete onboarding" } },
  { id: "profile-complete", title: "Identity Set", description: "Set your display name and avatar.", icon: "badge", category: "special", rarity: "common", requirement: { type: "profile_completed", value: 1, label: "Complete your profile" } },
  { id: "joined-class", title: "Enrolled", description: "Join a class with a class code.", icon: "forum", category: "special", rarity: "common", requirement: { type: "class_joined", value: 1, label: "Join a class" } },
  { id: "league-promotion", title: "Moving Up!", description: "Get promoted in the weekly league.", icon: "line-up", category: "special", rarity: "uncommon", requirement: { type: "league_promoted", value: 1, label: "Get promoted" } },
  { id: "diamond-league", title: "Diamond League", description: "Reach the Diamond division.", icon: "xp-diamond", category: "special", rarity: "legendary", requirement: { type: "league_division", value: 4, label: "Reach Diamond league" } },
  { id: "completionist", title: "Completionist", description: "Earn 100 badges.", icon: "glow-star", category: "special", rarity: "legendary", requirement: { type: "badges_earned", value: 100, label: "Earn 100 badges" } },
];
