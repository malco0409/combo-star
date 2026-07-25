# CLAUDE.md — Combo Star (yagona ilova)

## Loyiha haqida
Bitta React + Vite ilova ichida 2 qism:
- **Storefront** (`src/store/`) — mijozlar sayti, route `/`.
- **CRM** (`src/admin/`) — boshqaruv tizimi, route `/admin`.

Ular `src/shared/orderBridge.js` orqali bog'langan: saytdagi buyurtma `localStorage`
(`crm_orders`) ga yoziladi va CRM Buyurtmalar bo'limida ko'rinadi.

## Stack
React 19 · Vite 8 · Tailwind v4 (`@tailwindcss/vite`) · react-router-dom v7 · react-i18next.

## Buyruqlar
- Dev: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`

## Muhim qoidalar
- Yagona router `src/App.jsx` da. Store route'lari `StoreLayout` ostida, CRM `/admin/*` → `AdminApp`.
- CRM ichidagi navigatsiya **`/admin/...` prefiks** bilan bo'lishi shart.
- CRM qora mavzu `.crm-root` ichida scoped — storefront (light) ga ta'sir qilmasligi kerak.
- Telegram token/chat ID lar `.env` (`VITE_*`) dan. Kodga hardcode qilinmaydi. `.env` git'ga tushmaydi.
- Yangi kutubxona qo'shishdan oldin so'ra; mavjud uslub/pattern'ga amal qil.
- O'zgartirishdan keyin `npm run lint` bilan tekshir.

## Ma'lum cheklovlar (kelajakda)
- Ma'lumotlar faqat `localStorage` — backend yo'q, qurilmaga bog'liq.
- Telegram token frontend build'da ko'rinadi — backend proxy kerak.
- CRM parollari `auth.js` da ochiq — hash + backend kerak.
