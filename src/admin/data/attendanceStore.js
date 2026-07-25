// ============================================================================
// attendanceStore.js
// Davomat tizimi uchun yagona data-layer.
//
// Saqlash strukturasi (localStorage key: "attendance_records"):
// {
//   [userId]: {
//     [dateKey /* "YYYY-MM-DD" */]: {
//       in: isoString | null,      // "Keldi"
//       out: isoString | null,     // "Ketdi"
//       pauses: [                  // cheksiz miqdorda pauza
//         { start: isoString, end: isoString | null }
//       ]
//     }
//   }
// }
//
// Admin o'zgartirishlar tarixi (key: "attendance_log"):
// [
//   {
//     id, timestamp, admin,           // kim, qachon
//     userId, date,                   // qaysi yozuv
//     action: "create" | "update" | "delete",
//     field,                          // "in" | "out" | "pause_add" | ... (ixtiyoriy)
//     oldValue, newValue,
//     description                     // o'qiladigan matn
//   }
// ]
// ============================================================================

const RECORDS_KEY = "attendance_records";
const LOG_KEY = "attendance_log";

// ─── Asosiy helperlar ────────────────────────────────────────────────────────

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function dateKeyOf(d) {
  return new Date(d).toISOString().slice(0, 10);
}

export function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem(RECORDS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveRecords(records) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function loadLog() {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveLog(log) {
  localStorage.setItem(LOG_KEY, JSON.stringify(log));
}

function pushLog(entry) {
  const log = loadLog();
  log.unshift({
    id: "L" + Date.now() + Math.random().toString(36).slice(2, 6),
    timestamp: new Date().toISOString(),
    ...entry,
  });
  saveLog(log);
}

function emptyDay() {
  return { in: null, out: null, pauses: [] };
}

function getDay(records, userId, date) {
  return (records[userId] && records[userId][date]) || emptyDay();
}

function setDay(records, userId, date, dayRecord) {
  const updated = { ...records };
  updated[userId] = { ...(updated[userId] || {}) };
  updated[userId][date] = dayRecord;
  return updated;
}

// ─── Vaqt hisoblash mantiqi ──────────────────────────────────────────────────

// Bitta kunlik yozuvdan "ishlangan oraliqlar" ro'yxatini chiqaradi.
// Misol: in=10:00, pauses=[{12:00-15:00}], out=22:00
//   => [ {start:10:00, end:12:00}, {start:15:00, end:22:00} ]
export function getWorkIntervals(day, nowIso = null) {
  if (!day || !day.in) return [];

  const pauses = [...(day.pauses || [])].sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );

  const intervals = [];
  let cursor = day.in;

  for (const p of pauses) {
    if (cursor) {
      intervals.push({ start: cursor, end: p.start });
    }
    // Agar pauza tugamagan bo'lsa (hali davom etilmagan), cursor null bo'ladi —
    // ish oralig'i shu yerda to'xtaydi.
    cursor = p.end || null;
  }

  if (cursor) {
    // Ish hali tugamagan bo'lsa (out yo'q) va "hozir" gacha hisoblash kerak bo'lsa
    const end = day.out || nowIso;
    if (end) intervals.push({ start: cursor, end });
  }

  return intervals;
}

// Pauza oraliqlarini chiqaradi (faol pauzani ham "hozirgacha" deb hisoblaydi)
export function getPauseIntervals(day, nowIso = null) {
  if (!day || !day.pauses) return [];
  return day.pauses.map((p) => ({
    start: p.start,
    end: p.end || nowIso || null,
  }));
}

function sumMinutes(intervals) {
  return intervals.reduce((sum, iv) => {
    if (!iv.start || !iv.end) return sum;
    const diffMs = new Date(iv.end) - new Date(iv.start);
    return sum + Math.max(0, diffMs / 1000 / 60);
  }, 0);
}

// Ishlangan vaqt (daqiqada), pauzalar chiqarib tashlangan
export function getWorkedMinutes(day, nowIso = null) {
  return sumMinutes(getWorkIntervals(day, nowIso));
}

// Pauza vaqti (daqiqada)
export function getPauseMinutes(day, nowIso = null) {
  return sumMinutes(getPauseIntervals(day, nowIso));
}

// "8 soat 37 daqiqa" formatida chiqaradi
export function formatDuration(totalMinutes) {
  if (totalMinutes == null || isNaN(totalMinutes)) return "—";
  const mins = Math.round(totalMinutes);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} daqiqa`;
  if (m === 0) return `${h} soat`;
  return `${h} soat ${m} daqiqa`;
}

// To'liq sana: "23 Iyun 2026"
export function formatFullDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });
}

// "23.06.2026"
export function formatDateNumeric(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

export function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
}

// ─── Holat aniqlash ──────────────────────────────────────────────────────────

export function getDayStatus(day) {
  if (!day || !day.in) return "not_started";          // hali kelmagan
  const activePause = (day.pauses || []).find((p) => !p.end);
  if (activePause) return "paused";                    // pauzada
  if (day.out) return "finished";                       // tugagan
  return "working";                                      // ishlayapti
}

// ─── Xodim tomonidan bajariladigan amallar ──────────────────────────────────

export function clockIn(userId, date = todayKey()) {
  const records = loadRecords();
  const day = getDay(records, userId, date);
  if (day.in) throw new Error("Siz bugun allaqachon keldingiz!");
  const now = new Date().toISOString();
  const updated = setDay(records, userId, date, { ...day, in: now });
  saveRecords(updated);
  return now;
}

export function startPause(userId, date = todayKey()) {
  const records = loadRecords();
  const day = getDay(records, userId, date);
  if (!day.in) throw new Error("Avval 'Keldim' ni bosing!");
  if (day.out) throw new Error("Ish kuni allaqachon tugagan!");
  if ((day.pauses || []).some((p) => !p.end)) throw new Error("Siz allaqachon pauzadasiz!");
  const now = new Date().toISOString();
  const updated = setDay(records, userId, date, {
    ...day,
    pauses: [...(day.pauses || []), { start: now, end: null }],
  });
  saveRecords(updated);
  return now;
}

export function endPause(userId, date = todayKey()) {
  const records = loadRecords();
  const day = getDay(records, userId, date);
  const idx = (day.pauses || []).findIndex((p) => !p.end);
  if (idx === -1) throw new Error("Siz pauzada emassiz!");
  const now = new Date().toISOString();
  const pauses = day.pauses.map((p, i) => (i === idx ? { ...p, end: now } : p));
  const updated = setDay(records, userId, date, { ...day, pauses });
  saveRecords(updated);
  return now;
}

export function clockOut(userId, date = todayKey()) {
  const records = loadRecords();
  const day = getDay(records, userId, date);
  if (!day.in) throw new Error("Avval 'Keldim' ni bosing!");
  if (day.out) throw new Error("Siz bugun allaqachon ketgansiz!");
  if ((day.pauses || []).some((p) => !p.end)) throw new Error("Avval pauzani tugatib, 'Davom etish' ni bosing!");
  const now = new Date().toISOString();
  const updated = setDay(records, userId, date, { ...day, out: now });
  saveRecords(updated);
  return now;
}

// ─── Admin tomonidan bajariladigan amallar (CRUD + log) ─────────────────────

// Yangi yozuv qo'shish (qo'lda)
export function adminAddRecord(adminName, userId, date, dayRecord) {
  const records = loadRecords();
  const updated = setDay(records, userId, date, {
    in: dayRecord.in || null,
    out: dayRecord.out || null,
    pauses: dayRecord.pauses || [],
  });
  saveRecords(updated);
  pushLog({
    admin: adminName,
    userId,
    date,
    action: "create",
    oldValue: null,
    newValue: updated[userId][date],
    description: `Yangi davomat yozuvi qo'shdi (${date})`,
  });
  return updated[userId][date];
}

// Keldi / Ketdi vaqtini o'zgartirish
export function adminUpdateField(adminName, userId, date, field, isoValue) {
  const records = loadRecords();
  const day = getDay(records, userId, date);
  const oldValue = day[field];
  const newDay = { ...day, [field]: isoValue || null };
  const updated = setDay(records, userId, date, newDay);
  saveRecords(updated);
  pushLog({
    admin: adminName,
    userId,
    date,
    action: "update",
    field,
    oldValue,
    newValue: isoValue || null,
    description: `"${field}" vaqtini o'zgartirdi: ${formatTime(oldValue)} → ${formatTime(isoValue)}`,
  });
  return newDay;
}

// Pauzani qo'lda qo'shish
export function adminAddPause(adminName, userId, date, start, end = null) {
  const records = loadRecords();
  const day = getDay(records, userId, date);
  const newPauses = [...(day.pauses || []), { start, end }];
  const newDay = { ...day, pauses: newPauses };
  const updated = setDay(records, userId, date, newDay);
  saveRecords(updated);
  pushLog({
    admin: adminName,
    userId,
    date,
    action: "update",
    field: "pause_add",
    oldValue: null,
    newValue: { start, end },
    description: `Pauza qo'shdi: ${formatTime(start)} – ${formatTime(end)}`,
  });
  return newDay;
}

// Mavjud pauzani tahrirlash (index bo'yicha)
export function adminUpdatePause(adminName, userId, date, pauseIndex, newStart, newEnd) {
  const records = loadRecords();
  const day = getDay(records, userId, date);
  const oldPause = day.pauses[pauseIndex];
  const newPauses = day.pauses.map((p, i) =>
    i === pauseIndex ? { start: newStart, end: newEnd } : p
  );
  const newDay = { ...day, pauses: newPauses };
  const updated = setDay(records, userId, date, newDay);
  saveRecords(updated);
  pushLog({
    admin: adminName,
    userId,
    date,
    action: "update",
    field: "pause_edit",
    oldValue: oldPause,
    newValue: { start: newStart, end: newEnd },
    description: `Pauzani tahrirladi: ${formatTime(oldPause?.start)}–${formatTime(oldPause?.end)} → ${formatTime(newStart)}–${formatTime(newEnd)}`,
  });
  return newDay;
}

// Pauzani o'chirish
export function adminDeletePause(adminName, userId, date, pauseIndex) {
  const records = loadRecords();
  const day = getDay(records, userId, date);
  const oldPause = day.pauses[pauseIndex];
  const newPauses = day.pauses.filter((_, i) => i !== pauseIndex);
  const newDay = { ...day, pauses: newPauses };
  const updated = setDay(records, userId, date, newDay);
  saveRecords(updated);
  pushLog({
    admin: adminName,
    userId,
    date,
    action: "delete",
    field: "pause_delete",
    oldValue: oldPause,
    newValue: null,
    description: `Pauzani o'chirdi: ${formatTime(oldPause?.start)}–${formatTime(oldPause?.end)}`,
  });
  return newDay;
}

// Butun kunlik yozuvni o'chirish
export function adminDeleteRecord(adminName, userId, date) {
  const records = loadRecords();
  const oldValue = getDay(records, userId, date);
  const updated = { ...records };
  if (updated[userId]) {
    const { [date]: _, ...rest } = updated[userId];
    updated[userId] = rest;
  }
  saveRecords(updated);
  pushLog({
    admin: adminName,
    userId,
    date,
    action: "delete",
    oldValue,
    newValue: null,
    description: `Butun kunlik yozuvni o'chirdi (${date})`,
  });
}

// ─── Davr bo'yicha jamlash (kunlik / haftalik / oylik) ──────────────────────

function isoWeekKey(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  // Hafta boshini Dushanba deb olamiz
  const day = (d.getDay() + 6) % 7; // Mon=0 ... Sun=6
  const monday = new Date(d);
  monday.setDate(d.getDate() - day);
  const y = monday.getFullYear();
  // Yil ichidagi hafta raqami (oddiy, ISO ga yaqin)
  const firstDay = new Date(y, 0, 1);
  const weekNum = Math.ceil((((monday - firstDay) / 86400000) + firstDay.getDay() + 1) / 7);
  return `${y}-W${String(weekNum).padStart(2, "0")}`;
}

// userId bo'yicha barcha kunlarni { date, day, workedMin, pauseMin } shaklida qaytaradi
export function getUserDayList(userId, nowIso = null) {
  const records = loadRecords();
  const userRecs = records[userId] || {};
  return Object.entries(userRecs)
    .map(([date, day]) => ({
      date,
      day,
      intervals: getWorkIntervals(day, nowIso),
      pauseIntervals: getPauseIntervals(day, nowIso),
      workedMin: getWorkedMinutes(day, nowIso),
      pauseMin: getPauseMinutes(day, nowIso),
      status: getDayStatus(day),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function summarize(dayList, { week = false, month = false } = {}) {
  const totalMin = dayList.reduce((s, d) => s + d.workedMin, 0);
  const totalPauseMin = dayList.reduce((s, d) => s + d.pauseMin, 0);
  return {
    totalMin,
    totalPauseMin,
    totalDays: dayList.length,
    totalFormatted: formatDuration(totalMin),
    pauseFormatted: formatDuration(totalPauseMin),
  };
}

export function filterByMonth(dayList, monthKey /* "2026-06" */) {
  return dayList.filter((d) => d.date.startsWith(monthKey));
}

export function filterByWeek(dayList, weekKey) {
  return dayList.filter((d) => isoWeekKey(d.date) === weekKey);
}

export function currentWeekKey() {
  return isoWeekKey(todayKey());
}

export { isoWeekKey };