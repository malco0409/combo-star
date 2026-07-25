import { useState } from "react";
import {
  todayKey,
  formatTime,
  formatFullDate,
  formatDateNumeric,
  formatDuration,
  getWorkedMinutes,
  getDayStatus,
  getUserDayList,
  filterByMonth,
  summarize,
  loadRecords,
  loadLog,
  adminAddRecord,
  adminUpdateField,
  adminAddPause,
  adminUpdatePause,
  adminDeletePause,
  adminDeleteRecord,
} from "../../data/attendanceStore";

const card = { background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: "12px" };
const text = "#e2e8f0";
const muted = "#64748b";
const inputStyle = {
  background: "#0f1117", border: "1px solid #2d3748", borderRadius: "8px",
  color: "#e2e8f0", fontSize: "13px", padding: "7px 10px", fontFamily: "inherit",
};

const STATUS_META = {
  not_started: { text: "Kelmadi", color: "#f87171", bg: "rgba(248,113,113,0.08)" },
  working:     { text: "● Ishda", color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
  paused:      { text: "⏸ Pauzada", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
  finished:    { text: "✓ Tugadi", color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
};

// datetime-local input uchun "YYYY-MM-DDTHH:mm" formatiga o'tkazish
function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(val) {
  if (!val) return null;
  return new Date(val).toISOString();
}

export default function AdminAttendancePage({ session, employees }) {
  const adminName = session?.name || session?.username || "Admin";
  const [, forceTick] = useState(0);
  const refresh = () => forceTick((x) => x + 1);

  const records = loadRecords();
  const log = loadLog();
  const today = todayKey();
  const thisMonth = today.slice(0, 7);

  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(thisMonth);
  const [editTarget, setEditTarget] = useState(null); // { userId, date }
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [newRec, setNewRec] = useState({ userId: "", date: today, in: "", out: "" });

  const userIds = Object.keys(records);
  const empMap = {};
  if (employees) employees.forEach((e) => { empMap[e.id] = e; });
  const nameOf = (uid) => empMap[uid]?.name || uid;

  // ─── Bugungi holat ──────────────────────────────────────────────────────
  const todayStats = userIds.map((uid) => {
    const day = (records[uid] || {})[today] || { in: null, out: null, pauses: [] };
    return {
      uid,
      name: nameOf(uid),
      day,
      status: getDayStatus(day),
      workedMin: getWorkedMinutes(day, new Date().toISOString()),
    };
  });

  // ─── Tarixiy hisobot ────────────────────────────────────────────────────
  const uidsForHistory = selectedUser === "all" ? userIds : [selectedUser];
  let historyRows = [];
  uidsForHistory.forEach((uid) => {
    const dayList = getUserDayList(uid);
    const monthRows = filterByMonth(dayList, selectedMonth);
    monthRows.forEach((r) => historyRows.push({ ...r, uid, name: nameOf(uid) }));
  });
  historyRows.sort((a, b) => b.date.localeCompare(a.date));

  const monthSummary = summarize(historyRows);

  const months = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(d.toISOString().slice(0, 7));
  }

  // ─── Admin amallari ─────────────────────────────────────────────────────

  const handleFieldChange = (uid, date, field, value) => {
    try {
      adminUpdateField(adminName, uid, date, field, fromLocalInput(value));
      refresh();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleAddPause = (uid, date) => {
    adminAddPause(adminName, uid, date, new Date().toISOString(), null);
    refresh();
  };

  const handlePauseChange = (uid, date, idx, field, value) => {
    const day = (records[uid] || {})[date] || { pauses: [] };
    const p = day.pauses[idx];
    const start = field === "start" ? fromLocalInput(value) : p.start;
    const end = field === "end" ? fromLocalInput(value) : p.end;
    adminUpdatePause(adminName, uid, date, idx, start, end);
    refresh();
  };

  const handleDeletePause = (uid, date, idx) => {
    if (!window.confirm("Pauzani o'chirishni tasdiqlaysizmi?")) return;
    adminDeletePause(adminName, uid, date, idx);
    refresh();
  };

  const handleDeleteRecord = (uid, date) => {
    if (!window.confirm(`${formatDateNumeric(date)} kunidagi yozuvni butunlay o'chirishni tasdiqlaysizmi?`)) return;
    adminDeleteRecord(adminName, uid, date);
    refresh();
  };

  const handleAddRecord = () => {
    if (!newRec.userId || !newRec.date) return alert("Xodim va sanani tanlang!");
    adminAddRecord(adminName, newRec.userId, newRec.date, {
      in: fromLocalInput(newRec.in),
      out: fromLocalInput(newRec.out),
      pauses: [],
    });
    setShowAddModal(false);
    setNewRec({ userId: "", date: today, in: "", out: "" });
    refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 500, color: text }}>Davomat — Admin panel</h1>
          <p style={{ fontSize: "13px", color: muted, marginTop: "4px" }}>
            Barcha xodimlarning davomat ma'lumotlari
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLog(true)}
            className="text-sm px-4 py-2 rounded-lg"
            style={{ background: "#0f1117", border: "1px solid #2d3748", color: text }}
          >
            📜 O'zgartirishlar tarixi ({log.length})
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-sm px-4 py-2 rounded-lg text-white"
            style={{ background: "#a80000" }}
          >
            + Yozuv qo'shish
          </button>
        </div>
      </div>

      {/* Bugungi holat */}
      <div style={{ ...card, overflow: "hidden", marginBottom: "1.5rem" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #2d3748", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "14px", fontWeight: 500, color: text }}>Bugungi holat</span>
          <span style={{ fontSize: "12px", color: muted }}>{formatDateNumeric(today)}</span>
        </div>

        {todayStats.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#475569", fontSize: "13px" }}>
            Bugun hech kim kelmagan
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #2d3748" }}>
                  {["Xodim", "Keldi", "Pauzalar", "Ketdi", "Ish vaqti", "Holat"].map((h) => (
                    <th key={h} style={{ padding: "10px 1.25rem", textAlign: "left", fontSize: "12px", color: muted, fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todayStats.map((s, i) => {
                  const meta = STATUS_META[s.status];
                  return (
                    <tr key={s.uid} style={{ borderBottom: i < todayStats.length - 1 ? "1px solid rgba(45,55,72,0.5)" : "none" }}>
                      <td style={{ padding: "12px 1.25rem", fontSize: "13px", fontWeight: 500, color: text }}>{s.name}</td>
                      <td style={{ padding: "12px 1.25rem", fontSize: "13px", color: "#4ade80" }}>{formatTime(s.day.in)}</td>
                      <td style={{ padding: "12px 1.25rem", fontSize: "12px", color: "#fbbf24" }}>
                        {(s.day.pauses || []).length || "—"}
                      </td>
                      <td style={{ padding: "12px 1.25rem", fontSize: "13px", color: "#94a3b8" }}>{formatTime(s.day.out)}</td>
                      <td style={{ padding: "12px 1.25rem", fontSize: "13px", color: "#a78bfa" }}>{formatDuration(s.workedMin)}</td>
                      <td style={{ padding: "12px 1.25rem" }}>
                        <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 500, background: meta.bg, color: meta.color }}>
                          {meta.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tarixiy hisobot */}
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #2d3748", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: 500, color: text }}>Tarixiy hisobot</span>

          <select style={inputStyle} value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="all">Barcha xodimlar</option>
            {userIds.map((uid) => <option key={uid} value={uid}>{nameOf(uid)}</option>)}
          </select>

          <select style={inputStyle} value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {months.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <div style={{ marginLeft: "auto", display: "flex", gap: "16px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: muted }}>Jami ish vaqti</div>
              <div style={{ fontSize: "15px", fontWeight: 500, color: "#fbbf24" }}>{monthSummary.totalFormatted}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: muted }}>Jami pauza</div>
              <div style={{ fontSize: "15px", fontWeight: 500, color: "#a78bfa" }}>{monthSummary.pauseFormatted}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: muted }}>Ish kunlari</div>
              <div style={{ fontSize: "15px", fontWeight: 500, color: "#60a5fa" }}>{monthSummary.totalDays} kun</div>
            </div>
          </div>
        </div>

        {historyRows.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#475569", fontSize: "13px" }}>
            Bu oy uchun ma'lumot yo'q
          </div>
        ) : (
          <div>
            {historyRows.map((r) => {
              const isEditing = editTarget && editTarget.userId === r.uid && editTarget.date === r.date;
              const meta = STATUS_META[r.status];
              return (
                <div key={`${r.uid}-${r.date}`} style={{ padding: "14px 1.25rem", borderBottom: "1px solid rgba(45,55,72,0.5)" }}>
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontSize: "13px", fontWeight: 500, color: text }}>{formatFullDate(r.date)}</span>
                      <span style={{ fontSize: "11px", color: muted }}>({formatDateNumeric(r.date)})</span>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>· {r.name}</span>
                      <span style={{ padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 500, background: meta.bg, color: meta.color }}>
                        {meta.text}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: "13px", color: "#a78bfa", fontWeight: 500 }}>⏱ {formatDuration(r.workedMin)}</span>
                      {r.pauseMin > 0 && <span style={{ fontSize: "13px", color: "#fbbf24" }}>⏸ {formatDuration(r.pauseMin)}</span>}
                      <button
                        onClick={() => setEditTarget(isEditing ? null : { userId: r.uid, date: r.date })}
                        className="text-xs px-3 py-1 rounded"
                        style={{ background: "#1e3a5f", color: "#60a5fa" }}
                      >
                        {isEditing ? "Yopish" : "✎ Tahrirlash"}
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(r.uid, r.date)}
                        className="text-xs px-3 py-1 rounded"
                        style={{ background: "#3d0d0d", color: "#f87171" }}
                      >
                        O'chirish
                      </button>
                    </div>
                  </div>

                  {/* Ish/pauza oraliqlari ko'rinishi */}
                  {!isEditing && (
                    <div className="flex flex-wrap gap-2">
                      {r.intervals.map((iv, j) => (
                        <span key={j} style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "5px", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80", fontFamily: "monospace" }}>
                          {formatTime(iv.start)}–{iv.end ? formatTime(iv.end) : "hozir"}
                        </span>
                      ))}
                      {r.pauseIntervals.map((iv, j) => (
                        <span key={"p" + j} style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "5px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24", fontFamily: "monospace" }}>
                          ⏸ {formatTime(iv.start)}–{iv.end ? formatTime(iv.end) : "hozir"}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tahrirlash paneli */}
                  {isEditing && (
                    <div style={{ background: "#0f1117", border: "1px solid #2d3748", borderRadius: "8px", padding: "12px", marginTop: "8px" }}>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-xs block mb-1" style={{ color: muted }}>Keldi</label>
                          <input type="datetime-local" style={{ ...inputStyle, width: "100%" }}
                            defaultValue={toLocalInput(r.day.in)}
                            onBlur={(e) => handleFieldChange(r.uid, r.date, "in", e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs block mb-1" style={{ color: muted }}>Ketdi</label>
                          <input type="datetime-local" style={{ ...inputStyle, width: "100%" }}
                            defaultValue={toLocalInput(r.day.out)}
                            onBlur={(e) => handleFieldChange(r.uid, r.date, "out", e.target.value)} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs" style={{ color: muted }}>Pauzalar</label>
                        <button onClick={() => handleAddPause(r.uid, r.date)}
                          className="text-xs px-2 py-1 rounded" style={{ background: "#1a1f2e", border: "1px solid #2d3748", color: text }}>
                          + Pauza qo'shish
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(r.day.pauses || []).map((p, idx) => (
                          <div key={idx} className="flex items-center gap-2 flex-wrap">
                            <input type="datetime-local" style={inputStyle}
                              defaultValue={toLocalInput(p.start)}
                              onBlur={(e) => handlePauseChange(r.uid, r.date, idx, "start", e.target.value)} />
                            <span style={{ color: muted }}>→</span>
                            <input type="datetime-local" style={inputStyle}
                              defaultValue={toLocalInput(p.end)}
                              onBlur={(e) => handlePauseChange(r.uid, r.date, idx, "end", e.target.value)} />
                            <button onClick={() => handleDeletePause(r.uid, r.date, idx)}
                              className="text-xs px-2 py-1 rounded" style={{ background: "#3d0d0d", color: "#f87171" }}>
                              ✕
                            </button>
                          </div>
                        ))}
                        {(r.day.pauses || []).length === 0 && (
                          <div style={{ fontSize: "12px", color: "#475569" }}>Pauza yo'q</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Yangi yozuv qo'shish modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
          <div style={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: "16px", padding: "24px", width: "380px", maxWidth: "95%" }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: text }}>Qo'lda yozuv qo'shish</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs block mb-1" style={{ color: muted }}>Xodim</label>
                <select style={{ ...inputStyle, width: "100%" }} value={newRec.userId}
                  onChange={(e) => setNewRec((p) => ({ ...p, userId: e.target.value }))}>
                  <option value="">— tanlang —</option>
                  {(employees || []).map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: muted }}>Sana</label>
                <input type="date" style={{ ...inputStyle, width: "100%" }} value={newRec.date}
                  onChange={(e) => setNewRec((p) => ({ ...p, date: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: muted }}>Keldi</label>
                <input type="datetime-local" style={{ ...inputStyle, width: "100%" }} value={newRec.in}
                  onChange={(e) => setNewRec((p) => ({ ...p, in: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: muted }}>Ketdi</label>
                <input type="datetime-local" style={{ ...inputStyle, width: "100%" }} value={newRec.out}
                  onChange={(e) => setNewRec((p) => ({ ...p, out: e.target.value }))} />
              </div>
              <div style={{ fontSize: "11px", color: muted }}>
                Pauzalarni saqlagandan keyin "Tahrirlash" orqali qo'shishingiz mumkin.
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowAddModal(false)} className="text-sm px-4 py-2 rounded-lg"
                style={{ background: "#0f1117", border: "1px solid #2d3748", color: text }}>Bekor</button>
              <button onClick={handleAddRecord} className="text-sm px-4 py-2 rounded-lg text-white"
                style={{ background: "#a80000" }}>Saqlash</button>
            </div>
          </div>
        </div>
      )}

      {/* O'zgartirishlar tarixi (log) modal */}
      {showLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowLog(false); }}>
          <div style={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: "16px", padding: "24px", width: "560px", maxWidth: "95%", maxHeight: "80vh", overflowY: "auto" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold" style={{ color: text }}>O'zgartirishlar tarixi</h2>
              <button onClick={() => setShowLog(false)} style={{ color: muted, background: "transparent" }}>✕</button>
            </div>
            {log.length === 0 ? (
              <div style={{ textAlign: "center", color: "#475569", fontSize: "13px", padding: "2rem 0" }}>
                Hali hech qanday o'zgartirish bo'lmagan
              </div>
            ) : (
              <div className="space-y-2">
                {log.map((entry) => (
                  <div key={entry.id} style={{ background: "#0f1117", border: "1px solid #2d3748", borderRadius: "8px", padding: "10px 12px" }}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontSize: "12px", fontWeight: 500, color: "#fbbf24" }}>{entry.admin}</span>
                      <span style={{ fontSize: "11px", color: muted }}>
                        {new Date(entry.timestamp).toLocaleString("uz-UZ")}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: text }}>{entry.description}</div>
                    <div style={{ fontSize: "11px", color: muted, marginTop: "2px" }}>
                      {nameOf(entry.userId)} · {formatDateNumeric(entry.date)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}