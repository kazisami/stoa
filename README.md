# Stoa — Stoic Quotes

A minimalist, distraction-free Stoic philosophy web app tailored for your iPhone Home Screen. Open it anytime to read authentic classical quotes from Marcus Aurelius, Seneca, Epictetus, Musonius Rufus, and Zeno of Citium.

---

## 🎬 Demo

<div align="center">
  <img src="assets/demo.gif" alt="Stoa App Walkthrough Demo" width="360" style="border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);" />
  <p><sub><i>Recorded on mobile viewport showcasing swipe navigation, random jump, thinker filter toggle, saved drawer, and theme switching.</i></sub></p>
  <p>
    <a href="assets/demo.mp4">▶️ Watch MP4 Video</a> &bull; 
    <a href="assets/demo.webm">▶️ Watch WebM Video</a>
  </p>
</div>

---

## ✨ Features

- **Random Quote on Every Load**: Opens immediately to a fresh, randomized quote and shuffles the 366-quote deck so every session presents a unique sequence.
- **Random Quote Jump Button**: Dedicated shuffle icon directly beside the Save bookmark to instantly jump to another random wisdom passage.
- **Thinker Filter on Demand**: Tap any philosopher's name to instantly filter the deck to only their quotes; tap their name again to return to all quotes. The numbering counter automatically updates to reflect the total count.
- **Pristine, Minimalist Interface**: Pure focus on the quote, its author, and its source work—no clutter, ads, or distractions.
- **Swipe to Browse**: Seamless touch swipe gestures (swipe left for next, swipe right for previous) crafted for one-handed mobile reading.
- **366 Authentic Stoic Quotes**: A full year's worth of authentic passages sourced from *Meditations*, *Letters from a Stoic*, *Discourses*, *Enchiridion*, and classical fragments.
- **One-Tap Save**: Tap the bookmark icon to save quotes to your personal collection stored offline in `localStorage`.
- **Saved Quotes Drawer**: Easily review all your saved passages, tap any quote to view it full-screen, or copy it to your clipboard.
- **iPhone Home Screen Ready (PWA)**:
  - Supports standalone full-screen web app mode (hides Safari browser chrome).
  - Configured with `apple-mobile-web-app-capable`, `apple-touch-icon`, and iOS safe area padding.
  - 100% offline-capable.
- **Obsidian Dark & Warm Parchment Themes**: One-tap toggle between nighttime obsidian and reading-friendly warm parchment.
- **Desktop & Keyboard Support**: Navigate with Left/Right arrow keys, Spacebar, or press `R` for random quote.

---

## 📲 Adding to iPhone Home Screen

1. Open the app in **Safari** on your iPhone.
2. Tap the **Share** button (the square with an upward arrow) in the bottom toolbar.
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add** in the top-right corner.
5. Launch **Stoa** directly from your Home Screen for a native, full-screen experience!

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `pnpm`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kazisami/stoa-quotes.git
   cd stoa-quotes
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Scripts

- `npm run dev`: Starts the Vite development server on port 3000.
- `npm run build`: Compiles TypeScript and creates an optimized production bundle in `dist/`.
- `npm run preview`: Previews the production build locally.
- `npm test`: Runs deterministic unit tests using Node's test runner (`npx tsx --test src/utils/stoicLogic.test.ts`).
- `npm run lint`: Runs TypeScript compiler check (`tsc --noEmit`).

---

## 👤 Author

Created by [@kazisami](https://github.com/kazisami).

---

## 📜 License

Apache-2.0

