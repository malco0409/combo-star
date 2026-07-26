// Rasm havolasini ("img:<id>" yoki oddiy URL/dataURL) ko'rsatadigan komponent.
// Yuklanmaguncha yoki bo'sh bo'lsa — fallback ko'rsatiladi.
import { useResolvedImage } from "../data/remote";

export default function Img({ src, fallback = null, ...rest }) {
  const url = useResolvedImage(src);
  if (!url) return fallback;
  return <img src={url} {...rest} />;
}
