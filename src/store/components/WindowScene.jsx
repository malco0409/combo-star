// WindowScene — deraza ortidagi manzara (osmon, quyosh, bulutlar, tog', yo'l, logotip).
// Barcha jalyuzi animatsiyalari (plisse, zebra, ...) shu komponentdan foydalanadi.
// Ota-element `position: relative` bo'lishi va kesib turishi (overflow: hidden) kerak.
import { useTranslation } from "react-i18next";
import "./WindowScene.css";

const STAR_PATH =
  "M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 Z";

export default function WindowScene() {
  const { t } = useTranslation();

  return (
    <div className="window-scene">
      <div className="sky">
        <div className="sun" />
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
      </div>

      <div className="mountains" />

      <div className="ground">
        <div className="road"><div className="road-line" /></div>
      </div>

      <div className="logo-container">
        <svg className="bordo-star" viewBox="-4 -4 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d={STAR_PATH} stroke="#cc0000" strokeWidth="4" strokeLinejoin="round" />
          <path d={STAR_PATH} stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
        </svg>
        <p className="logo-text">COMBO STAR</p>
        <p className="logo-tagline">{t("scene.tagline")}</p>
      </div>
    </div>
  );
}
