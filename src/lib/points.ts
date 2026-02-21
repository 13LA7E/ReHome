// ─── ReHome Point System ──────────────────────────────────────────────────────
// Category base points (per individual item)
export const CATEGORY_BASE_POINTS: Record<string, number> = {
  furniture:   30,
  electronics: 25,
  books:       15,
  clothes:     15,
  ewaste:       5,
};

// Reusable items earn 50% more
export const REUSABLE_MULTIPLIER = 1.5;

// Bulk bonus: +20% on the entire submission when 5+ items detected
export const BULK_THRESHOLD    = 5;
export const BULK_BONUS_PCT    = 20;   // percent

// Consecutive-day streak bonuses (descending order — first match wins)
export const STREAK_TIERS = [
  { days: 10, pts: 50, label: '10-day streak' },
  { days:  5, pts: 25, label: '5-day streak'  },
  { days:  2, pts: 10, label: '2-day streak'  },
];

// Bonus for the FIRST TIME a user donates a given category
export const FIRST_CATEGORY_BONUS = 25;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Base points for one detected instance of an item */
export function calcItemPoints(category: string, isReusable: boolean): number {
  const base = CATEGORY_BASE_POINTS[category] ?? 10;
  const mult = isReusable ? REUSABLE_MULTIPLIER : 1.0;
  return Math.round(base * mult);
}

/** Streak bonus for N consecutive donation days */
export function calcStreakBonus(streakDays: number): { pts: number; label: string } {
  for (const tier of STREAK_TIERS) {
    if (streakDays >= tier.days) return { pts: tier.pts, label: tier.label };
  }
  return { pts: 0, label: '' };
}

/** Bulk bonus on total base points */
export function calcBulkBonus(basePoints: number): number {
  return Math.round(basePoints * (BULK_BONUS_PCT / 100));
}
