/**
 * Spaced Repetition System (SRS) Algorithm Implementation
 * Uses the SM-2 algorithm for calculating optimal review intervals
 */

/**
 * Current progress state for a flashcard
 */
export interface CardProgress {
  ease_factor: number;       // Difficulty multiplier (1.3 - 2.5)
  interval: number;          // Days until next review
  repetitions: number;       // Consecutive correct reviews
  last_review?: string | null; // ISO timestamp (optional for preview calculations)
  next_review?: string | null; // ISO timestamp (optional for preview calculations)
}

/**
 * Updated progress after a review
 */
export interface UpdatedProgress {
  ease_factor: number;
  interval: number;
  repetitions: number;
  last_review: string;
  next_review: string;
}

/**
 * Difficulty ratings for card reviews
 * - Again (0): Complete blackout, wrong answer
 * - Hard (1): Correct but required significant effort
 * - Good (2): Correct with hesitation
 * - Easy (3): Perfect recall, instant answer
 */
export type Difficulty = 0 | 1 | 2 | 3;

/**
 * Default values for new cards
 */
const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const MAX_EASE_FACTOR = 2.5;

/**
 * Calculate the next review schedule using the SM-2 algorithm
 * 
 * @param difficulty - User's answer quality (0=Again, 1=Hard, 2=Good, 3=Easy)
 * @param currentProgress - Current SRS progress for the card
 * @returns Updated progress with new intervals and timestamps
 * 
 * @example
 * const progress = {
 *   ease_factor: 2.5,
 *   interval: 1,
 *   repetitions: 0,
 *   last_review: null,
 *   next_review: null
 * };
 * const updated = calculateNextReview(2, progress); // Good answer
 * // Returns: { ease_factor: 2.5, interval: 1, repetitions: 1, ... }
 */
export function calculateNextReview(
  difficulty: Difficulty,
  currentProgress: CardProgress
): UpdatedProgress {
  const now = new Date().toISOString();
  
  // Initialize values for new cards or defaults
  let easeFactor = currentProgress.ease_factor || DEFAULT_EASE_FACTOR;
  let interval = currentProgress.interval || 0;
  let repetitions = currentProgress.repetitions || 0;

  // SM-2 Algorithm Implementation
  if (difficulty === 0) {
    // Again - Reset progress, review again soon
    repetitions = 0;
    interval = 0; // Review in less than a day (handled as "now" in queue)
    // Decrease ease factor on failures
    easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.2);
  } else if (difficulty === 1) {
    // Hard - Slight decrease in ease, minimal interval increase
    repetitions = 0; // Reset repetition count on hard answers
    interval = 1; // Review tomorrow
    easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.15);
  } else {
    // Good (2) or Easy (3)
    repetitions += 1;

    // Calculate new interval based on repetition count
    if (repetitions === 1) {
      interval = 1; // First review: 1 day
    } else if (repetitions === 2) {
      interval = 6; // Second review: 6 days
    } else {
      // Third review onwards: multiply by ease factor
      interval = Math.round(interval * easeFactor);
    }

    // Adjust ease factor based on difficulty
    if (difficulty === 2) {
      // Good - maintain or slightly increase ease
      easeFactor = Math.min(MAX_EASE_FACTOR, easeFactor);
    } else if (difficulty === 3) {
      // Easy - increase ease factor and add bonus interval
      easeFactor = Math.min(MAX_EASE_FACTOR, easeFactor + 0.1);
      interval = Math.round(interval * 1.3); // 30% bonus for easy answers
    }
  }

  // Ensure ease factor stays within bounds
  easeFactor = Math.max(MIN_EASE_FACTOR, Math.min(MAX_EASE_FACTOR, easeFactor));

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    ease_factor: easeFactor,
    interval,
    repetitions,
    last_review: now,
    next_review: nextReviewDate.toISOString(),
  };
}

/**
 * Get a human-readable interval preview for a difficulty rating
 * 
 * @param difficulty - The difficulty rating to preview
 * @param currentProgress - Current card progress
 * @returns Human-readable string (e.g., "<1 day", "3 days", "1 week")
 */
export function getIntervalPreview(
  difficulty: Difficulty,
  currentProgress: CardProgress
): string {
  const { interval } = calculateNextReview(difficulty, currentProgress);

  if (interval === 0) {
    return "<1 day";
  } else if (interval === 1) {
    return "1 day";
  } else if (interval < 7) {
    return `${interval} days`;
  } else if (interval < 30) {
    const weeks = Math.floor(interval / 7);
    return weeks === 1 ? "1 week" : `${weeks} weeks`;
  } else {
    const months = Math.floor(interval / 30);
    return months === 1 ? "1 month" : `${months} months`;
  }
}

/**
 * Determine if a card is due for review
 * 
 * @param nextReview - ISO timestamp of next scheduled review
 * @returns true if card should be reviewed now
 */
export function isCardDue(nextReview: string | null): boolean {
  if (!nextReview) return true; // New cards are always due
  return new Date(nextReview) <= new Date();
}

/**
 * Get the priority score for sorting the review queue
 * Higher scores = higher priority
 * 
 * @param nextReview - ISO timestamp of next scheduled review
 * @returns Priority score (higher = more urgent)
 */
export function getCardPriority(nextReview: string | null): number {
  if (!nextReview) return 1000; // New cards get high priority
  
  const now = new Date().getTime();
  const reviewTime = new Date(nextReview).getTime();
  const daysOverdue = (now - reviewTime) / (1000 * 60 * 60 * 24);
  
  // Overdue cards get higher priority based on how overdue they are
  return daysOverdue > 0 ? 1000 + daysOverdue : 0;
}
