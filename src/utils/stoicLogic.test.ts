import test from 'node:test';
import assert from 'node:assert/strict';
import { STOIC_QUOTES } from '../data/stoicData';
import {
  filterQuotesByAuthor,
  getNextIndex,
  getPrevIndex,
  getRandomIndex,
  shuffleQuotes,
  toggleAuthorFilter,
  toggleSaveQuoteId,
} from './stoicLogic';

test('STOIC_QUOTES contains full internet quotes dataset (>350 quotes)', () => {
  assert.ok(STOIC_QUOTES.length >= 350, `Expected at least 350 quotes, found ${STOIC_QUOTES.length}`);
  assert.ok(STOIC_QUOTES[0].text.length > 5);
  assert.ok(STOIC_QUOTES[0].author.length > 0);
});

test('getNextIndex and getPrevIndex cycle within range', () => {
  assert.equal(getNextIndex(0, 366), 1);
  assert.equal(getNextIndex(365, 366), 0);
  assert.equal(getPrevIndex(0, 366), 365);
  assert.equal(getPrevIndex(5, 366), 4);
});

test('toggleSaveQuoteId adds and removes quote IDs', () => {
  const initial: string[] = ['quote-1'];
  const added = toggleSaveQuoteId(initial, 'quote-2');
  assert.deepEqual(added, ['quote-1', 'quote-2']);

  const removed = toggleSaveQuoteId(added, 'quote-1');
  assert.deepEqual(removed, ['quote-2']);
});

test('shuffleQuotes preserves all items and randomizes ordering', () => {
  const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const shuffled = shuffleQuotes(original);
  assert.equal(shuffled.length, original.length);
  assert.deepEqual([...shuffled].sort((a, b) => a - b), original);
});

test('getRandomIndex returns a valid distinct index', () => {
  const idx = getRandomIndex(3, 10);
  assert.ok(idx >= 0 && idx < 10);
  assert.notEqual(idx, 3);
});

test('filterQuotesByAuthor filters quotes accurately and handles clearing', () => {
  const mockQuotes = [
    { id: '1', author: 'Marcus Aurelius', text: 'M1' },
    { id: '2', author: 'Seneca', text: 'S1' },
    { id: '3', author: 'Marcus Aurelius', text: 'M2' },
  ];
  const filtered = filterQuotesByAuthor(mockQuotes, 'Marcus Aurelius');
  assert.equal(filtered.length, 2);
  assert.ok(filtered.every((q) => q.author === 'Marcus Aurelius'));

  const all = filterQuotesByAuthor(mockQuotes, null);
  assert.equal(all.length, 3);
});

test('toggleAuthorFilter toggles author filter on and off', () => {
  // First click sets the author filter
  const selected = toggleAuthorFilter(null, 'Marcus Aurelius');
  assert.equal(selected, 'Marcus Aurelius');

  // Clicking a different author switches filter
  const switched = toggleAuthorFilter('Marcus Aurelius', 'Seneca');
  assert.equal(switched, 'Seneca');

  // Clicking the same author toggles back to null (all quotes)
  const toggledOff = toggleAuthorFilter('Seneca', 'Seneca');
  assert.equal(toggledOff, null);

  // Case-insensitive toggle off
  const caseInsensitiveOff = toggleAuthorFilter('Epictetus', 'epictetus');
  assert.equal(caseInsensitiveOff, null);
});

