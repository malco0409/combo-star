// Mahsulot -> interaktiv animatsiya bog'lanishi.
// Mahsulot sahifasida (/product) mos animatsiya bo'lsa ko'rsatiladi, bo'lmasa —
// hech narsa chiqmaydi va sahifa odatdagidek ishlayveradi.
//
// Yangi animatsiya qo'shish: komponentni yozib, quyidagi ikki joyga mahsulot id sini
// qo'shish kifoya. Id lar productStore.js dagi DEFAULT_PRODUCTS bilan bir xil:
// plisse, kuntun, vertikal, dikkey, rollo, dablrollo, masket, senaks, surilad.
import PlisseWindow from "./PlisseWindow";
import ZebraWindow from "./ZebraWindow";
import VerticalWindow from "./VerticalWindow";
import RolloWindow from "./RolloWindow";
import DoubleRolloWindow from "./DoubleRolloWindow";
import SetkaWindow from "./SetkaWindow";

const WITH_ANIMATION = ["plisse", "kuntun", "vertikal", "rollo", "dablrollo", "masket", "surilad"];

// eslint-disable-next-line react-refresh/only-export-components
export function hasProductAnimation(productId) {
  return WITH_ANIMATION.includes(productId);
}

export default function ProductAnimation({ productId }) {
  if (productId === "plisse") return <PlisseWindow />;   // plisse (bosh sahifada ham bor)
  if (productId === "kuntun") return <ZebraWindow />;    // "Kun va Tun" (zebra / den-noch)
  if (productId === "vertikal") return <VerticalWindow />;
  if (productId === "rollo") return <RolloWindow />;              // yaxlit mato
  if (productId === "dablrollo") return <DoubleRolloWindow />;    // tyul + qalin
  // Setka bitta komponent, ikki rejimda. Mahsulotga qarab kerakli rejim ochiladi.
  if (productId === "masket")  return <SetkaWindow initialMode="window" />;
  if (productId === "surilad") return <SetkaWindow initialMode="door" />;
  return null;
}
