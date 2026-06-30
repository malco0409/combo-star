# Combo Star — yagona ilova (Storefront + CRM)

Combo Star (jaluzi va parda) uchun **bitta React + Vite** ilovasi:

- **`/`** — mijozlar uchun sayt (storefront): katalog, mahsulot, savat, o'lchov, buyurtma.
- **`/admin`** — ichki boshqaruv tizimi (CRM): login, dashboard, buyurtmalar, mijozlar, ombor, davomat.

Saytdan berilgan buyurtma avtomat ravishda CRM **Buyurtmalar** bo'limida paydo bo'ladi (`localStorage` orqali bog'langan).

## Texnologiyalar
React 19 · Vite 8 · Tailwind CSS v4 · react-router-dom v7 · react-i18next

## Ishga tushirish
```bash
npm install
cp .env.example .env   # va qiymatlarni to'ldiring
npm run dev
```

- Typecheck/Lint: `npm run lint`
- Build: `npm run build` · Preview: `npm run preview`

## Muhit o'zgaruvchilari (`.env`)
| O'zgaruvchi | Tavsif |
|---|---|
| `VITE_TELEGRAM_BOT_TOKEN` | Telegram bot tokeni |
| `VITE_TELEGRAM_ORDERS_CHAT_ID` | Buyurtmalar guruhi chat ID |
| `VITE_TELEGRAM_PERSONAL_CHAT_ID` | Aloqa xabarlari uchun lichka ID |

> ⚠️ **Xavfsizlik:** Vite frontend bo'lgani uchun bu qiymatlar build ichida baribir ko'rinadi.
> To'liq xavfsizlik uchun keyinchalik Telegram chaqiruvlarini backend proxy orqali yuborish kerak.

## Struktura
```
src/
├── App.jsx           # yagona router (store + /admin)
├── main.jsx
├── index.css         # Tailwind + storefront/admin stillari
├── store/            # storefront (komponent, sahifa, context, data, utils, i18n)
├── admin/            # CRM (AdminApp, komponent, sahifa, data)
└── shared/           # umumiy ko'prik (orderBridge: store → CRM)
```

## CRM kirish (demo)
| Rol | Login | Parol |
|---|---|---|
| admin | `admin` | `admin123` |
| operator | `abdullox` | `abd850` |
| ishchi | `fozil` | `fozil` |

> ⚠️ Parollar hozir `src/admin/data/auth.js` ichida ochiq. Production uchun backend + hash kerak.
