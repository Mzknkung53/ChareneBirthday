# Charene9 Birthday Wishes ♡

An interactive birthday page for **Charene9** — hero + live countdown, a wish composer with live card preview, the wish wall with reactions, a special message, a polaroid memory gallery and a footer of links.

Built as a Next.js App Router project with TypeScript, Tailwind CSS and Framer Motion. It runs fully on mock data — **no database or credentials needed** to develop or deploy.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
```

Node 18.17+ (Node 20 recommended).

## Project structure

```
src/
├── app/                  layout, page, global styles + keyframes
├── components/
│   ├── birthday/         Navbar, HeroSection, BirthdayCountdown, PetalField,
│   │                     ConfettiBurst, SpecialMessage, Footer
│   ├── wishes/           WishSection, WishForm, WishPreview, WishWall,
│   │                     WishCard, ReactionButton
│   ├── gallery/          MemoryGallery, MemoryCard
│   └── ui/               Button, GlassCard, Badge, SectionHeading,
│                         TextField, MessageField, StickerPicker, PhotoDrop
├── data/                 site.ts (dates, links, special message),
│                         mock-wishes.ts, memories.ts
├── hooks/                useWishes, useCountdown, useIsMobile,
│                         usePrefersReducedMotion
├── lib/
│   ├── services/         wishes.ts, reactions.ts, uploads.ts  ← data access
│   └── supabase/         client.ts (safe with no env vars)
├── types/                BirthdayWish, WishDraft, MemoryPhoto, …
└── utils/                cn, format (relative time, tints), validation
```

Components never talk to a backend directly — they call the services in `src/lib/services`, which currently return mock data from `src/data`.

## Editing the content

Everything personal lives in `src/data/site.ts`: the birthday date (`birthdayISO`, Asia/Bangkok), the badge label, the social links and the special message. Memory photos are listed in `src/data/memories.ts`.

## Connecting Supabase later

1. `cp .env.example .env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. `npm i @supabase/supabase-js` and finish `src/lib/supabase/client.ts` (one `createClient` call).
3. Replace the mock bodies at the `// TODO: Replace mock implementation` markers in
   `src/lib/services/wishes.ts`, `reactions.ts` and `uploads.ts`.

Suggested tables: `wishes` (status pending/approved/rejected), `wish_media`, `wish_reactions`.
Moderation, admin auth, rate limiting and Turnstile all belong in route handlers / server actions — the service layer is the only place the UI touches, so none of the components need to change.

## Design notes

- Pastel-only palette; text is `#4A3B47` (soft plum-brown). No dark sections, no pure black.
- Fonts: **Mali** (headings, captions), **Prompt** (UI/body, Thai + Latin), **Playfair Display** (countdown numerals).
- Buttons are always pills, min 44px tall; focus is a soft rose ring.
- Confetti fires only on wish submit and on the birthday date. `prefers-reduced-motion` disables petals, confetti and card motion.
- Mobile-first: no fixed widths, grids collapse with `minmax(min(100%,…),1fr)`, tested 320px → 2560px.

## Still to replace

- 3 of the 4 memory polaroids are labelled placeholders (`src/data/memories.ts`).
- `public/images/charene-profile-placeholder.png` — swap for the final artwork, same path.
- The special message text is a stand-in.
