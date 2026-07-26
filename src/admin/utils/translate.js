// Rang nomini o'zbekchadan ruschaga tarjima qilish.
// 1) Avval ichki lug'at (keng tarqalgan ranglar — tez va aniq).
// 2) Topilmasa — bepul MyMemory API (kalit shart emas).

const COLOR_DICT = {
  "oq": "белый",
  "oq rang": "белый",
  "kulrang": "серый",
  "bej": "бежевый",
  "qora": "чёрный",
  "ko'k": "синий",
  "kok": "синий",
  "kók": "синий",
  "yashil": "зелёный",
  "jigarrang": "коричневый",
  "jigar rang": "коричневый",
  "krem": "кремовый",
  "krem rang": "кремовый",
  "pushti": "розовый",
  "qizil": "красный",
  "sariq": "жёлтый",
  "to'q sariq": "оранжевый",
  "toq sariq": "оранжевый",
  "binafsha": "фиолетовый",
  "kumush": "серебристый",
  "oltin": "золотой",
  "mokriy asfalt": "мокрый асфальт",
  "mokriy asvalt": "мокрый асфальт",
  "shokolad": "шоколадный",
  "sut rang": "молочный",
  "havorang": "голубой",
  "havo rang": "голубой",
};

// O'zbekcha matnни ruschaga tarjima qiladi. Topolmasa "" qaytaradi.
export async function translateUzToRu(text) {
  const raw = (text || "").trim();
  if (!raw) return "";

  const key = raw.toLowerCase();
  if (COLOR_DICT[key]) return COLOR_DICT[key];

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(raw)}&langpair=uz|ru`;
    const res = await fetch(url);
    const data = await res.json();
    const t = data?.responseData?.translatedText;
    // API xato/limit qaytarsa (katta harflar bilan ogohlantirish) — e'tiborsiz
    if (t && !/MYMEMORY|INVALID|LIMIT/i.test(t)) return t;
  } catch {
    // internet yo'q yoki API ishlamadi — bo'sh qaytaramiz
  }
  return "";
}
