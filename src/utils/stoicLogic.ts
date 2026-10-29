export function getNextIndex(
  currentIndex: number,
  totalQuotes: number
): number {
  if (totalQuotes <= 0) return 0;
  return (currentIndex + 1) % totalQuotes;
}

export function getPrevIndex(
  currentIndex: number,
  totalQuotes: number
): number {
  if (totalQuotes <= 0) return 0;
  return (currentIndex - 1 + totalQuotes) % totalQuotes;
}

export function toggleSaveQuoteId(
  currentSavedIds: string[],
  quoteId: string
): string[] {
  if (currentSavedIds.includes(quoteId)) {
    return currentSavedIds.filter((id) => id !== quoteId);
  }
  return [...currentSavedIds, quoteId];
}

/**
 * Fisher-Yates array shuffle for random quote deck ordering
 */
export function shuffleQuotes<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Pick a random index distinct from the current one
 */
export function getRandomIndex(
  currentIndex: number,
  totalQuotes: number
): number {
  if (totalQuotes <= 1) return 0;
  let next = Math.floor(Math.random() * totalQuotes);
  if (next === currentIndex) {
    next = (currentIndex + 1) % totalQuotes;
  }
  return next;
}
