// src/store/utils/telegramPolling.js
const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;

let lastUpdateId = 0;

export async function pollTelegramUpdates(onStatusChange) {
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=5`
    );
    const data = await res.json();

    if (data.result && data.result.length > 0) {
      for (const update of data.result) {
        lastUpdateId = update.update_id;

        if (update.callback_query) {
          const callbackData = update.callback_query.data;
          const messageId    = update.callback_query.message.message_id;
          const chatId       = update.callback_query.message.chat.id;

          const parts   = callbackData.split("_");
          const action  = parts[0];
          const orderId = parts[1];

          let newStatus = "";
          let nextButtons = [];

          if (action === "start") {
            newStatus = "Tayyorlanmoqda ⏳";
            // "Boshlash" bosilgandan keyin "Tugatish" tugmasi chiqadi
            nextButtons = [
              [{ text: "✅ Tugatish", callback_data: `finish_${orderId}` }],
            ];
          }

          if (action === "finish") {
            newStatus = "Zakaz tayyor! 🎉";
            nextButtons = []; // tugmalar o'chadi
          }

          if (action === "ready")    newStatus = "Zakaz tayyor! 🎉";
          if (action === "delivery") newStatus = "Yetkazilmoqda 🚚";

          if (newStatus) {
            onStatusChange(orderId, newStatus);

            // Tugmalarni yangilash (yoki o'chirish)
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageReplyMarkup`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                reply_markup: { inline_keyboard: nextButtons },
              }),
            });

            // Admin ga toast xabar
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                callback_query_id: update.callback_query.id,
                text: `✅ Status yangilandi: ${newStatus}`,
              }),
            });
          }
        }
      }
    }
  } catch (e) {
    console.error("Polling xato:", e);
  }
}