import { useState, useEffect } from "react";
import {
  todayKey,
  formatTime,
  formatFullDate,
  formatDateNumeric,
  formatDuration,
  getWorkIntervals,
  getWorkedMinutes,
  getPauseMinutes,
  getDayStatus,
  getUserDayList,
  filterByMonth,
  filterByWeek,
  currentWeekKey,
  summarize,
  clockIn,
  startPause,
  endPause,
  clockOut,
  loadRecords,
} from "../../data/attendanceStore";

// ─── Clock komponenti ────────────────────────────────────────────────────────

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div>
      <div style={{
        fontSize: "38px",
        fontWeight: 300,
        color: "#f1f5f9",
        letterSpacing: "2px",
        fontVariantNumeric: "tabular-nums",
      }}>
        {time.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </div>
      <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
        {time.toLocaleDateString("uz-UZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </div>
    </div>
  );
}

function StatCard({ label, value, color = "#f1f5f9", icon }) {
  return (
    <div style={{
      background: "#1a1f2e",
      border: "1px solid #2d3748",
      borderRadius: "10px",
      padding: "1rem 1.25rem",
    }}>
      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
        {icon && <span>{icon}</span>}
        {label}
      </div>
      <div style={{ fontSize: "24px", fontWeight: 500, color }}>{value}</div>
    </div>
  );
}

const STATUS_META = {
  not_started: { text: "Hali kelmadi", color: "#64748b", bg: "rgba(100,116,139,0.1)" },
  working:     { text: "● Ishda", color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
  paused:      { text: "⏸ Pauzada", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
  finished:    { text: "✓ Ish tugadi", color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
};

export default function AttendancePage({ session }) {
  const userId = session?.id || session?.username;
  const [, forceTick] = useState(0);
  const [msg, setMsg] = useState(null);

  // Faol kun (pauza/ishda) bo'lsa, har soniyada hisoblagichni yangilab turamiz
  useEffect(() => {
    const t = setInterval(() => forceTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const nowIso = new Date().toISOString();
  const today = todayKey();

  // Har safar render bo'lganda yangi holatni o'qiymiz (boshqa joyda o'zgargan bo'lishi mumkin)
  const records = loadRecords();
  const todayRecord = (records[userId] && records[userId][today]) || { in: null, out: null, pauses: [] };

  const status = getDayStatus(todayRecord);
  const meta = STATUS_META[status];

  const todayWorkedMin = getWorkedMinutes(todayRecord, nowIso);
  const todayPauseMin = getPauseMinutes(todayRecord, nowIso);
  const todayIntervals = getWorkIntervals(todayRecord, nowIso);

  const showMsg = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const safeRun = (fn, successText) => {
    try {
      fn(userId, today);
      showMsg(successText);
      forceTick((x) => x + 1);
    } catch (e) {
      showMsg(e.message, "error");
    }
  };

  const handleClockIn = () => safeRun(clockIn, "✅ Kelish vaqti belgilandi: " + formatTime(new Date().toISOString()));
  const handlePause = () => safeRun(startPause, "⏸ Pauza boshlandi");
  const handleResume = () => safeRun(endPause, "▶ Ish davom ettirildi");
  const handleClockOut = () => safeRun(clockOut, "👋 Ketish vaqti belgilandi: " + formatTime(new Date().toISOString()));

  // ─── Statistika: kun ro'yxati, hafta, oy ──────────────────────────────────
  const dayList = getUserDayList(userId, nowIso);
  const weekDays = filterByWeek(dayList, currentWeekKey());
  const monthDays = filterByMonth(dayList, today.slice(0, 7));

  const weekSummary = summarize(weekDays);
  const monthSummary = summarize(monthDays);

  return (
    <div>
      {/* Sarlavha */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: "#f1f5f9" }}>Davomat</h1>
        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
          Xush kelibsiz, <span style={{ color: "#e2e8f0" }}>{session?.name}</span>
        </p>
      </div>

      {/* Xabar */}
      {msg && (
        <div style={{
          marginBottom: "1rem",
          padding: "10px 16px",
          borderRadius: "8px",
          fontSize: "13px",
          background: msg.type === "error" ? "rgba(248,113,113,0.1)" : "rgba(74,222,128,0.1)",
          border: `1px solid ${msg.type === "error" ? "rgba(248,113,113,0.3)" : "rgba(74,222,128,0.3)"}`,
          color: msg.type === "error" ? "#f87171" : "#4ade80",
        }}>
          {msg.text}
        </div>
      )}

      {/* Stat kartalar */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "12px",
        marginBottom: "1.5rem",
      }}>
        <StatCard label="Bugungi ish vaqti" value={formatDuration(todayWorkedMin)} color="#a78bfa" icon="⏱" />
        <StatCard label="Bugungi pauza" value={formatDuration(todayPauseMin)} color="#fbbf24" icon="⏸" />
        <StatCard label="Bu hafta jami" value={weekSummary.totalFormatted} color="#60a5fa" icon="📆" />
        <StatCard label="Bu oy jami" value={monthSummary.totalFormatted} color="#34d399" icon="📅" />
        <StatCard label="Ish kunlari (oy)" value={`${monthSummary.totalDays} kun`} color="#f1f5f9" icon="🗓" />
      </div>

      {/* Soat + tugmalar */}
      <div style={{
        background: "#1a1f2e",
        border: "1px solid #2d3748",
        borderRadius: "12px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "2rem",
      }}>
        <div>
          <LiveClock />
          <div style={{
            marginTop: "10px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 500,
            background: meta.bg,
            color: meta.color,
          }}>
            {meta.text}
            {(status === "working" || status === "paused") &&
              ` · ${formatDuration(todayWorkedMin)}`}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={handleClockIn}
            disabled={status !== "not_started"}
            style={btnStyle("#4ade80", status !== "not_started")}
          >
            ✅ Keldim
          </button>

          <button
            onClick={handlePause}
            disabled={status !== "working"}
            style={btnStyle("#fbbf24", status !== "working")}
          >
            ⏸ Pauza
          </button>

          <button
            onClick={handleResume}
            disabled={status !== "paused"}
            style={btnStyle("#60a5fa", status !== "paused")}
          >
            ▶ Davom etish
          </button>

          <button
            onClick={handleClockOut}
            disabled={status !== "working"}
            style={btnStyle("#f87171", status !== "working")}
          >
            👋 Ketdim
          </button>
        </div>
      </div>

      {/* Bugungi ish oraliqlari */}
      {todayIntervals.length > 0 && (
        <div style={{
          background: "#1a1f2e",
          border: "1px solid #2d3748",
          borderRadius: "12px",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
        }}>
          <div style={{ fontSize: "13px", fontWeight: 500, color: "#e2e8f0", marginBottom: "10px" }}>
            Bugungi ish oraliqlari
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {todayIntervals.map((iv, i) => (
              <span key={i} style={{
                fontSize: "12px",
                padding: "5px 10px",
                borderRadius: "6px",
                background: "rgba(74,222,128,0.08)",
                border: "1px solid rgba(74,222,128,0.2)",
                color: "#4ade80",
                fontFamily: "monospace",
              }}>
                {formatTime(iv.start)} – {iv.end ? formatTime(iv.end) : "hozir"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tarixi: har kun alohida blok */}
      <div style={{
        background: "#1a1f2e",
        border: "1px solid #2d3748",
        borderRadius: "12px",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "1rem 1.25rem",
          borderBottom: "1px solid #2d3748",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#e2e8f0" }}>Davomat tarixi</span>
          <span style={{ fontSize: "12px", color: "#64748b" }}>{dayList.length} ta kun</span>
        </div>

        {dayList.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#475569", fontSize: "13px" }}>
            Hali hech qanday yozuv yo'q
          </div>
        ) : (
          <div>
            {dayList.map((d, i) => {
              const isToday = d.date === today;
              const dMeta = STATUS_META[d.status];
              return (
                <div
                  key={d.date}
                  style={{
                    padding: "14px 1.25rem",
                    borderBottom: i < dayList.length - 1 ? "1px solid rgba(45,55,72,0.5)" : "none",
                    background: isToday ? "rgba(168,0,0,0.04)" : "transparent",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 500, color: isToday ? "#fca5a5" : "#e2e8f0" }}>
                        {formatFullDate(d.date)}
                      </span>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>({formatDateNumeric(d.date)})</span>
                      <span style={{
                        fontSize: "11px", fontWeight: 500, padding: "2px 8px", borderRadius: "6px",
                        background: dMeta.bg, color: dMeta.color,
                      }}>
                        {dMeta.text}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <span style={{ fontSize: "13px", color: "#a78bfa", fontWeight: 500 }}>
                        ⏱ {formatDuration(d.workedMin)}
                      </span>
                      {d.pauseMin > 0 && (
                        <span style={{ fontSize: "13px", color: "#fbbf24" }}>
                          ⏸ {formatDuration(d.pauseMin)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ish oraliqlari */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {d.intervals.map((iv, j) => (
                      <span key={j} style={{
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "5px",
                        background: "rgba(74,222,128,0.08)",
                        border: "1px solid rgba(74,222,128,0.2)",
                        color: "#4ade80",
                        fontFamily: "monospace",
                      }}>
                        {formatTime(iv.start)}–{iv.end ? formatTime(iv.end) : "hozir"}
                      </span>
                    ))}
                    {d.pauseIntervals.map((iv, j) => (
                      <span key={"p" + j} style={{
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "5px",
                        background: "rgba(251,191,36,0.08)",
                        border: "1px solid rgba(251,191,36,0.2)",
                        color: "#fbbf24",
                        fontFamily: "monospace",
                      }}>
                        ⏸ {formatTime(iv.start)}–{iv.end ? formatTime(iv.end) : "hozir"}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function btnStyle(color, disabled) {
  return {
    padding: "10px 24px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    border: `1px solid ${hexToRgba(color, 0.3)}`,
    background: disabled ? hexToRgba(color, 0.05) : hexToRgba(color, 0.12),
    color: disabled ? "#475569" : color,
    opacity: disabled ? 0.5 : 1,
    transition: "all 0.15s",
  };
}

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}