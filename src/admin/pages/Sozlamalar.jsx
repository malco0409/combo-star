import { useState, useEffect } from "react";
import { useSetting, saveSetting, parseVideo } from "../../store/data/settingsStore";

const card = { background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: "12px" };
const text = "#e2e8f0";
const muted = "#64748b";
const inputStyle = {
  background: "#0f1117", border: "1px solid #2d3748",
  borderRadius: "8px", color: "#e2e8f0", fontSize: "13px",
  padding: "9px 12px", width: "100%", fontFamily: "inherit",
};

export default function Sozlamalar() {
  const savedVideo = useSetting("measuringVideo");
  const [video, setVideo] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  // Firestore dan kelgan qiymatni bir marta inputga joylaymiz
  useEffect(() => { setVideo(savedVideo || ""); }, [savedVideo]);

  const preview = parseVideo(video);

  const save = async () => {
    setSaving(true); setDone(false);
    try {
      await saveSetting("measuringVideo", video.trim());
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch (err) {
      alert("Saqlashda xatolik: " + (err?.message || ""));
    }
    setSaving(false);
  };

  const clear = async () => {
    if (window.confirm("Videoni olib tashlaysizmi?")) {
      setVideo("");
      try { await saveSetting("measuringVideo", ""); }
      catch (err) { alert("Xatolik: " + (err?.message || "")); }
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1" style={{ color: text }}>Sozlamalar</h1>
      <p className="text-xs mb-5" style={{ color: muted }}>Sayt bo'yicha umumiy sozlamalar</p>

      <div style={card} className="p-5" >
        <h2 className="font-medium mb-1" style={{ color: text }}>“Qanday o'lchash kerak” videosi</h2>
        <p className="text-xs mb-4" style={{ color: muted }}>
          YouTube (yoki Vimeo) havolasini qo'ying — u o'lchash sahifasida ko'rinadi.
          Havolani bo'sh qoldirsangiz, video o'rniga “tez orada” yozuvi turadi.
        </p>

        <label className="text-xs block mb-1" style={{ color: muted }}>Video havolasi</label>
        <input style={inputStyle}
          placeholder="https://youtu.be/... yoki https://www.youtube.com/watch?v=..."
          value={video} onChange={(e) => setVideo(e.target.value)} />

        {/* Ko'rinishi (preview) */}
        {preview && (
          <div className="mt-4">
            <div className="text-xs mb-2" style={{ color: muted }}>Ko'rinishi:</div>
            <div className="rounded-xl overflow-hidden bg-black" style={{ aspectRatio: "16 / 9", maxWidth: 480 }}>
              {preview.type === "file" ? (
                <video src={preview.src} controls className="w-full h-full" />
              ) : (
                <iframe src={preview.src} title="video" className="w-full h-full"
                  style={{ border: 0 }} allowFullScreen />
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-5">
          <button onClick={save} disabled={saving}
            className="text-sm px-4 py-2 rounded-lg text-white font-medium"
            style={{ background: "#a80000", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Saqlanmoqda…" : "Saqlash"}
          </button>
          {video && (
            <button onClick={clear}
              className="text-sm px-4 py-2 rounded-lg"
              style={{ background: "#0f1117", border: "1px solid #3d0d0d", color: "#f87171" }}>
              Videoni olib tashlash
            </button>
          )}
          {done && <span className="text-sm" style={{ color: "#34d399" }}>✓ Saqlandi</span>}
        </div>
      </div>
    </div>
  );
}
