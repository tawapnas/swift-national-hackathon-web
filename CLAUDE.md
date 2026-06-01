# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server at http://localhost:5173
npm run build    # tsc -b (type-check) then vite build -> dist/
npm run preview  # serve the production build
```

There are no tests or linter configured. `npm run build` is the gate — it type-checks the whole project via project-referenced tsconfigs (`tsconfig.app.json` for `src/`, `tsconfig.node.json` for `vite.config.ts`), both with `strict` + `noUnusedLocals`/`noUnusedParameters`. A removed component or unused export will fail the build, not just warn.

## Critical: Node architecture / native-dep gotcha

This machine is **arm64 (Apple Silicon)**, but `/usr/local/bin/node` is an **x64 (Rosetta)** build that may be first on PATH in some shells. The user's real node is arm64 at `~/.nvm/versions/node/v24.15.0/bin/node`.

If `npm install` runs under x64 node, it installs x64-only native binaries (`@rollup/rollup-darwin-x64`, `@esbuild/darwin-x64`, `@tailwindcss/oxide-darwin-x64`, `lightningcss-darwin-x64`). Running `npm run dev`/`build` under arm64 node then crashes with `Cannot find module @rollup/rollup-darwin-arm64`.

- Always run install/build/dev under arm64 node. Prefix commands when unsure:
  `PATH="/Users/sanpawat/.nvm/versions/node/v24.15.0/bin:$PATH" npm run build`
- Universal fix after a mismatch: `rm -rf node_modules package-lock.json && npm install` (run with arm64 node), or force arch with `npm_config_cpu=arm64 npm_config_os=darwin npm install`.

## Architecture

Single-page marketing site (no router). `src/App.tsx` composes one section component per page region, top to bottom. Each section is a presentational component that reads its copy from `src/data/content.ts`.

- **`src/data/content.ts` is the single source of truth for all (Thai) copy.** Components contain layout/styling only — never hardcode display strings in components; add/edit them here. Section components import a named export (e.g. `import { themes } from '../data/content'`).
- **`src/components/Section.tsx`** is the shared section shell enforcing the Apple-Swift-Student-Challenge rhythm (max-w container, large vertical padding, eyebrow + heading with orange underline, bottom divider). Most sections wrap their content in `<Section>`; pass `id` to make it a navbar scroll target.
- **Navbar links are data-driven.** `nav` in `content.ts` maps `{ id, label }` to `#id` anchors. If you add/remove a section, the `id` you give its `<Section>` must match a `nav` entry (and vice-versa) or the anchor scrolls nowhere. Removed sections: their data export AND component file should both be deleted (the build fails on a dangling import, but leaves dead exports otherwise).
- **`src/hooks/useReveal.ts`** is an IntersectionObserver hook that adds `is-visible` to drive the `.reveal` fade/slide-up defined in `index.css`. `Section` uses it automatically; standalone full-bleed sections (Hero, InvitationQuote, CTABanner) apply `reveal` + the hook themselves.
- **`RegisterButton.tsx`** is the only CTA. Its `onClick` is an intentional no-op (`// TODO: wire up registration form`) — registration is not yet built.

## Styling

Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js`, no PostCSS). Design tokens live in the `@theme` block of `src/index.css` and become utility classes:

- Accent: `swift-orange` (#F05138) / `swift-gold` (#FBB04D). Use `bg-swift-orange`, `text-swift-orange`, etc.
- Dark-only palette tokens: `ink` (page bg), `surface` / `surface-2` (cards), `line` (borders/dividers), `fg` (text), `muted` (secondary text). `<html>` is hardcoded `class="dark"`; there is no light theme or theme toggle.
- Thai text uses the IBM Plex Sans Thai webfont loaded in `index.html`.

## Content constraint — do NOT mention AI

The site must contain **zero** user-visible references to AI / On-device AI / Apple Intelligence / Local LLM / Foundation Models. This is a theme the organizers reveal later, so terms from the source proposal are deliberately genericized (e.g. national-round workshops are "เวิร์คช็อปพิเศษ"; the Round-2 "AI Application Usage" judging criterion is omitted; Round 2 is "หัวข้อพิเศษ ที่จะประกาศในวันงาน"). After editing copy, verify:

```bash
grep -rniE "\bAI\b|apple intelligence|\bLLM\b|foundation model|on-device" src/ index.html
```

The only acceptable match is the explanatory comment at the top of `content.ts`.
