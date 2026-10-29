import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Copy,
  Moon,
  Shuffle,
  Sun,
  X,
  Check,
} from 'lucide-react';
import { Quote, STOIC_QUOTES } from './data/stoicData';
import {
  getNextIndex,
  getPrevIndex,
  getRandomIndex,
  shuffleQuotes,
  toggleSaveQuoteId,
} from './utils/stoicLogic';

const STORAGE_SAVED_KEY = 'stoa_saved_quotes_v3';
const STORAGE_THEME_KEY = 'stoa_theme_v3';

const FALLBACK_QUOTE: Quote = {
  id: 'quote-fallback',
  text: 'You have power over your mind, not outside events. Realize this, and you will find strength.',
  author: 'Marcus Aurelius',
  source: 'Meditations 4.3',
};

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'parchment'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      return saved === 'parchment' ? 'parchment' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SAVED_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter((id) => typeof id === 'string');
        }
      }
    } catch {
      // ignore
    }
    return ['quote-1', 'quote-2'];
  });

  // Shuffle quote ordering randomly every time the app loads
  const quotesList = useMemo(() => {
    if (!STOIC_QUOTES || STOIC_QUOTES.length === 0) return [FALLBACK_QUOTE];
    return shuffleQuotes(STOIC_QUOTES);
  }, []);

  // Pick a random starting quote on load (never starts from the same quote)
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const total = STOIC_QUOTES && STOIC_QUOTES.length > 0 ? STOIC_QUOTES.length : 1;
    return Math.floor(Math.random() * total);
  });

  const [showSavedDrawer, setShowSavedDrawer] = useState<boolean>(false);
  const [animating, setAnimating] = useState<boolean>(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  const activeQuote: Quote = quotesList[currentIndex] || quotesList[0] || FALLBACK_QUOTE;
  const isCurrentSaved = activeQuote?.id ? savedIds.includes(activeQuote.id) : false;

  // Sync state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedIds));
    } catch {
      // ignore
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Next / Prev handlers
  const handleNext = useCallback(() => {
    if (animating) return;
    setSlideDirection('next');
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => getNextIndex(prev, quotesList.length));
      setAnimating(false);
    }, 120);
  }, [animating, quotesList.length]);

  const handlePrev = useCallback(() => {
    if (animating) return;
    setSlideDirection('prev');
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => getPrevIndex(prev, quotesList.length));
      setAnimating(false);
    }, 120);
  }, [animating, quotesList.length]);

  // Random quote handler
  const handleRandom = useCallback(() => {
    if (animating) return;
    setSlideDirection('next');
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => getRandomIndex(prev, quotesList.length));
      setAnimating(false);
    }, 120);
  }, [animating, quotesList.length]);

  // Touch swipe detection for mobile / iPhone
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Horizontal swipe threshold 40px
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSavedDrawer) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRandom();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleRandom, showSavedDrawer]);

  // Toggle Save (Only Icon, no text)
  const handleToggleSave = (quoteId: string) => {
    setSavedIds((prev) => toggleSaveQuoteId(prev, quoteId));
  };

  // Select quote from saved drawer
  const handleSelectSaved = (quoteId: string) => {
    const idx = quotesList.findIndex((q) => q.id === quoteId);
    if (idx !== -1) {
      setCurrentIndex(idx);
    }
    setShowSavedDrawer(false);
  };

  // Copy quote
  const handleCopyQuote = async () => {
    try {
      await navigator.clipboard.writeText(`“${activeQuote.text}” — ${activeQuote.author}`);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 1800);
    } catch {
      // ignore
    }
  };

  const isParchment = theme === 'parchment';

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`fixed inset-0 select-none overflow-hidden flex flex-col justify-between transition-colors duration-300 ${
        isParchment
          ? 'bg-[#f6f2e9] text-[#1c1a17]'
          : 'bg-[#0c0c0e] text-[#f4f1ea]'
      }`}
    >
      {/* Top Header: Pure, clean, minimalist */}
      <header className="pt-safe px-6 sm:px-10 flex items-center justify-between z-20 shrink-0">
        {/* Subtle Stoa wordmark */}
        <span className="font-quote text-xl tracking-tight opacity-40 font-medium">
          Stoa
        </span>

        {/* Top Right: Theme Toggle and Saved Quotes Trigger */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Icon */}
          <button
            type="button"
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'parchment' : 'dark'))}
            aria-label="Toggle theme"
            className={`min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-colors ${
              isParchment ? 'hover:bg-black/5 text-stone-700' : 'hover:bg-white/10 text-stone-400'
            }`}
          >
            {isParchment ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#c89d66]" />}
          </button>

          {/* Saved Quotes Icon Button with Count Badge */}
          <button
            type="button"
            onClick={() => setShowSavedDrawer(true)}
            aria-label="View saved quotes"
            className={`min-w-[44px] min-h-[44px] px-3 rounded-full flex items-center gap-1.5 text-xs font-mono transition-colors border ${
              savedIds.length > 0
                ? isParchment
                  ? 'border-black/15 bg-black/5 text-stone-900'
                  : 'border-white/15 bg-white/5 text-stone-200'
                : 'border-transparent opacity-40 hover:opacity-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-[#c89d66] fill-[#c89d66]" />
            <span>{savedIds.length}</span>
          </button>
        </div>
      </header>

      {/* Main Screen: Clean Quote & Author */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 md:px-24 max-w-3xl mx-auto w-full text-center relative z-10">
        <div
          className={`transition-all duration-120 transform ${
            animating
              ? slideDirection === 'next'
                ? '-translate-x-4 opacity-0'
                : 'translate-x-4 opacity-0'
              : 'translate-x-0 opacity-100'
          }`}
        >
          {/* The Quote */}
          <blockquote>
            <p
              style={{ textWrap: 'balance' }}
              className="font-quote text-2xl sm:text-3xl md:text-4xl font-normal leading-[1.38] tracking-tight selection:bg-[#c89d66]/30"
            >
              “{activeQuote.text}”
            </p>
          </blockquote>

          {/* Who Said It */}
          <div className="mt-8 pt-2 flex flex-col items-center justify-center">
            <cite className="not-italic text-base sm:text-lg font-semibold tracking-wide text-[#c89d66]">
              {activeQuote.author}
            </cite>
            {activeQuote.source && (
              <span className="text-xs opacity-50 font-sans mt-1">
                {activeQuote.source}
              </span>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Bar: Touch Navigation, Random Quote Icon, ONLY Save Icon, and Next Button */}
      <footer className="pb-safe px-6 sm:px-12 flex items-center justify-between z-20 shrink-0">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous quote"
          className={`min-w-[48px] min-h-[48px] rounded-full flex items-center justify-center transition-transform active:scale-95 ${
            isParchment ? 'hover:bg-black/5 text-stone-700' : 'hover:bg-white/10 text-stone-400'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Center: Subtle Copy Icon & Counter */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono opacity-40 tracking-wider">
            {currentIndex + 1} / {quotesList.length}
          </span>
          <button
            type="button"
            onClick={handleCopyQuote}
            aria-label="Copy quote"
            className={`min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center transition-colors ${
              isParchment ? 'hover:bg-black/5 text-stone-600' : 'hover:bg-white/10 text-stone-400'
            }`}
          >
            {copyFeedback ? <Check className="w-3.5 h-3.5 text-[#c89d66]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right Section: Random Icon on the left of Save Icon, then Next Button */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Random Quote Icon on the left of Save Icon */}
          <button
            type="button"
            onClick={handleRandom}
            aria-label="Random quote"
            className={`min-w-[48px] min-h-[48px] rounded-full flex items-center justify-center transition-transform active:scale-90 ${
              isParchment ? 'hover:bg-black/5 text-stone-600' : 'hover:bg-white/10 text-stone-400'
            }`}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* ONLY Save Icon (NO text) */}
          <button
            type="button"
            onClick={() => handleToggleSave(activeQuote.id)}
            aria-label={isCurrentSaved ? 'Remove from saved quotes' : 'Save quote'}
            className={`min-w-[48px] min-h-[48px] rounded-full flex items-center justify-center transition-transform active:scale-90 ${
              isCurrentSaved
                ? 'text-[#c89d66]'
                : isParchment
                ? 'hover:bg-black/5 text-stone-600'
                : 'hover:bg-white/10 text-stone-400'
            }`}
          >
            <Bookmark
              className={`w-5 h-5 transition-transform ${
                isCurrentSaved ? 'fill-[#c89d66] scale-110' : ''
              }`}
            />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next quote"
            className={`min-w-[48px] min-h-[48px] rounded-full flex items-center justify-center transition-transform active:scale-95 ${
              isParchment ? 'hover:bg-black/5 text-stone-700' : 'hover:bg-white/10 text-stone-400'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </footer>

      {/* ========================================================
          DRAWER: SAVED QUOTES
         ======================================================== */}
      {showSavedDrawer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Saved quotes"
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm"
        >
          <div
            className={`w-full max-w-xl mx-auto rounded-t-3xl border-t p-6 max-h-[82vh] flex flex-col transition-colors ${
              isParchment
                ? 'bg-[#f6f2e9] border-[#dcd4c4] text-[#1c1a17]'
                : 'bg-[#141418] border-white/10 text-[#f4f1ea]'
            }`}
          >
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-current opacity-20 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-4 border-b border-current/10">
              <div>
                <h2 className="text-xl font-quote font-bold">Saved Quotes</h2>
                <p className="text-xs opacity-60">
                  {savedIds.length} preserved passage{savedIds.length === 1 ? '' : 's'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSavedDrawer(false)}
                aria-label="Close saved quotes"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quotes List */}
            <div className="flex-1 overflow-y-auto divide-y divide-current/10 py-2">
              {savedIds.length === 0 ? (
                <div className="py-16 text-center opacity-50 text-sm">
                  No saved quotes yet. Tap the bookmark icon on any quote to save it here.
                </div>
              ) : (
                quotesList
                  .filter((q) => savedIds.includes(q.id))
                  .map((quote) => (
                    <div
                      key={quote.id}
                      className="py-4 flex items-start justify-between gap-4 group"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectSaved(quote.id)}
                        className="text-left flex-1"
                      >
                        <p className="font-quote text-base leading-snug line-clamp-3">
                          “{quote.text}”
                        </p>
                        <p className="text-xs text-[#c89d66] font-medium mt-1">
                          {quote.author} {quote.source && `· ${quote.source}`}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleSave(quote.id)}
                        aria-label="Remove saved quote"
                        className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#c89d66] opacity-80 hover:opacity-100"
                      >
                        <Bookmark className="w-4 h-4 fill-[#c89d66]" />
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
