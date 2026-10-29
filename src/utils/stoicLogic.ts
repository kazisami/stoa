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
