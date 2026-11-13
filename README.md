# MotherEarth Tea Shop

An immersive single-page shop built with **React (Vite)**, **Tailwind CSS**, **React Three Fiber**, **Framer Motion**, **Zustand**, **React Router** and **Lucide**.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
npm run preview
```

Requires Node 18+. When deploying the build, configure your host for **SPA fallback** (all routes → `index.html`) so deep links like `/product/espresso` work on refresh.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home — swipeable 3D cup hero, brand intro, categories, favourites |
| `/shop` | Catalog (18 drinks) — filters: Coffee, Tea, Sugar-Free, Hot, Iced · search · sort. Deep-linkable: `/shop?filter=sugar-free,iced` |
| `/product/:slug` | One dedicated page per drink, e.g. `/product/espresso`, `/product/no-sugar-vanilla` |
| `/cart` · `/checkout` | Cart with totals, simulated checkout with validation |
| `/about` · `/contact` | Story, sourcing ethics, sustainability · validated contact form |
| `/auth` | Log in / Sign up |
| `/dashboard` | **Protected** — profile, order history, Members' Reserve |

## Where to edit things

- `src/lib/site.js` — owner name, email, WhatsApp link, social links, currency, tax, delivery fee, demo password
- `src/data/products.js` — the whole catalog (colours, nutrition, notes, origin, prices)
- `src/lib/pricing.js` — sizes and upcharges

## How the swipe carousel works

`components/SwipeCarousel.jsx` puts a draggable transparent layer over the 3D canvas. Its drag offset (a Framer Motion value) feeds straight into the cup's `rotation.y` every frame, so the cup follows your finger. Past a distance/velocity threshold the carousel advances, a spring adds a full turn, the background cross-fades to the next drink's palette, and the name/description slide out and in. Arrow keys and the dots work too.

## Performance notes

- Three.js is code-split and lazy-loaded; the render loop pauses when the canvas is off-screen.
- Cup: ceramic parts are merged into one mesh (3 draw calls incl. liquid + steam). Glass: ice cubes are one instanced mesh.
- Catalog cards and the cart use lightweight SVG art, so only one WebGL context ever exists.
- Pixel ratio is capped at 1.75; no HDR downloads (procedural lighting).

## Demo-only parts (be aware)

- **Authentication is client-side.** The password `michael` is hard-coded in `src/lib/site.js` and visible in the bundle. That is fine for a demo, but it is not real security — use a real backend before launch.
- **Checkout is simulated.** No payment is taken. Orders are stored in the browser's localStorage.
- **Contact form** has no backend: after validation it opens the visitor's email app with the message addressed to the shop's email.
- Social links (Instagram / Facebook / X) point at each site's homepage — replace them in `site.js`.
- About-page copy is placeholder brand writing; edit it to match the real story.
