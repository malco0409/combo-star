// src/store/utils/telegram.js
const BOT_TOKEN        = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_ID          = import.meta.env.VITE_TELEGRAM_ORDERS_CHAT_ID;    // buyurtmalar guruhi
const PERSONAL_CHAT_ID = import.meta.env.VITE_TELEGRAM_PERSONAL_CHAT_ID;  // lichka ID

// Mahsulot nomlarini o'zbek tiliga map (titleKey dan olish)
const titleMap = {
  // Rus tilidan
  "\u0420\u043e\u043b\u043b\u043e \u0436\u0430\u043b\u044e\u0437\u0438":           "Rollo jalyuzi",
  "\u0414\u0435\u043d\u044c \u0438 \u041d\u043e\u0447\u044c \u0436\u0430\u043b\u044e\u0437\u0438": "Kun va Tun jalyuzilari",
  "\u0412\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0435 \u0436\u0430\u043b\u044e\u0437\u0438": "Vertikal jalyuzilar",
  "\u0414\u0432\u043e\u0439\u043d\u044b\u0435 \u0440\u043e\u043b\u043b\u043e":       "Dabl Rollo",
  "\u0424\u0440\u0435\u043d\u0447\u0441\u043a\u0438\u0435 \u0436\u0430\u043b\u044e\u0437\u0438": "Plissel jalyuzilar",
  "\u0414\u0438\u043a\u043a\u0435\u0439 \u0436\u0430\u043b\u044e\u0437\u0438":      "Dikkey jalyuzilar",
  "\u041c\u043e\u0441\u043a\u0438\u0442\u043d\u0430\u044f \u0441\u0435\u0442\u043a\u0430": "Maschitiy setka",
  "\u0421\u0435\u043d\u0430\u043a\u0441":                                           "Senaks",
  "\u0420\u0430\u0437\u0434\u0432\u0438\u0436\u043d\u0430\u044f \u0441\u0435\u0442\u043a\u0430": "Suriladigan setka",
  // Ingliz tilidan (agar til ingliz bo'lsa)
  "Roller blinds":        "Rollo jalyuzi",
  "Day and Night blinds": "Kun va Tun jalyuzilari",
  "Vertical blinds":      "Vertikal jalyuzilar",
  "Double roller":        "Dabl Rollo",
  "French blinds":        "Plissel jalyuzilar",
  "Dikkey blinds":        "Dikkey jalyuzilar",
  "Mosquito net":         "Maschitiy setka",
  "Sliding net":          "Suriladigan setka",
};

// Rang nomlarini o'zbek tiliga o'girish
const colorMap = {
  // Rus tilidan
  "\u0411\u0435\u043b\u044b\u0439": "Oq",
  "\u0421\u0435\u0440\u044b\u0439": "Kulrang",
  "\u0411\u0435\u0436\u0435\u0432\u044b\u0439": "Krem",
  "\u0427\u0451\u0440\u043d\u044b\u0439": "Qora",
  "\u0421\u0438\u043d\u0438\u0439": "Ko'k",
  "\u0417\u0435\u043b\u0451\u043d\u044b\u0439": "Yashil",
  "\u041a\u043e\u0440\u0438\u0447\u043d\u0435\u0432\u044b\u0439": "Jigarrang",
  "\u041a\u0440\u0430\u0441\u043d\u044b\u0439": "Qizil",
  "\u0416\u0451\u043b\u0442\u044b\u0439": "Sariq",
  "\u0420\u043e\u0437\u043e\u0432\u044b\u0439": "Pushti",
  "\u041e\u0440\u0430\u043d\u0436\u0435\u0432\u044b\u0439": "To'q sariq",
  "\u0424\u0438\u043e\u043b\u0435\u0442\u043e\u0432\u044b\u0439": "Binafsha",
  // Ingliz tilidan
  "White": "Oq", "Gray": "Kulrang", "Grey": "Kulrang", "Beige": "Krem",
  "Black": "Qora", "Blue": "Ko'k", "Green": "Yashil",
  "Brown": "Jigarrang", "Red": "Qizil", "Yellow": "Sariq",
  "Pink": "Pushti", "Orange": "To'q sariq", "Purple": "Binafsha",
};

function normalizeColor(color) {
  return colorMap[color] || color;
}

// "Ролло жалюзи — Eron" => "Rollo jalyuzi — Eron"
function normalizeTitle(title) {
  // " — " bilan ajratilgan format (CollectionDetail dan keladi)
  const dashIdx = title.indexOf(" \u2014 ");
  if (dashIdx !== -1) {
    const main = title.slice(0, dashIdx);
    const rest = title.slice(dashIdx + 3); // " — " = 3 char
    const uzMain = titleMap[main.trim()] || main;
    return `${uzMain} \u2014 ${rest}`;
  }
  // Oddiy nom
  return titleMap[title.trim()] || title;
}

export async function sendToTelegram(items, customer = {}, orderId) {
  const itemsText = items.map((item, i) => {
    const totalPrice = (parseFloat(item.totalForeign) * item.qty).toFixed(2);
    const totalUZS   = item.totalUZS
      ? Math.round(parseInt(item.totalUZS.replace(/\D/g, "")) * item.qty).toLocaleString("uz-UZ")
      : "\u2014";

    return `
${i + 1}. \u{1F4E6} *${normalizeTitle(item.product.title)}*
   \u{1F4D0} O'lcham: ${item.width} \u00d7 ${item.height} sm
   \u{1F4CF} Maydon: ${item.area} m\u00b2
   \u{1F522} Miqdor: ${item.qty} dona
   \u{1F3A8} Rang: ${normalizeColor(item.color)}
   \u{1F4B0} Narx: ${item.symbol}${totalPrice}
   \u{1F4B5} So'mda: ${totalUZS} so'm`;
  }).join("\n");

  const grandTotal = items
    .reduce((sum, item) => sum + parseFloat(item.totalForeign) * item.qty, 0)
    .toFixed(2);

  const symbol = items[0]?.symbol || "";

  const text = `\u{1F6D2} *Yangi buyurtma!*
\u{1F194} *Zakaz ID:* \`${orderId}\`

\u{1F464} *Mijoz:* ${customer.name || "\u2014"}
\u{1F4DE} *Telefon:* ${customer.phone || "\u2014"}

${itemsText}

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u2705 *Jami ${items.length} ta mahsulot*
\u{1F4B0} *Umumiy narx: ${symbol}${grandTotal}*`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "\u{1F680} Boshlash", callback_data: `start_${orderId}` }],
        ],
      },
    }),
  });
}

export async function sendContactToTelegram({ name, email, message }) {
  const text = `\u{1F4E9} *Yangi xabar!*

\u{1F464} *Ism:* ${name}
\u{1F4E7} *Email:* ${email}
\u{1F4AC} *Xabar:* ${message || "\u2014"}`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: PERSONAL_CHAT_ID,
      text,
      parse_mode: "Markdown",
    }),
  });
}