// src/components/MeasuringModal.jsx — O'lchash qo'llanmasi
import Modal from "./Modal";

const steps = [
  {
    num: 1,
    title: "Asboblarni tayyorlang",
    desc: "Metall o'lchov lentasi, qalam va daftar tayyorlang. Oddiy ip yoki yog'och qadoq ishlatmang.",
  },
  {
    num: 2,
    title: "Kenglikni o'lchang",
    desc: "Derazaning ichki tomonidan kengligini o'lchang. Yuqori, o'rta va pastki qismlaridan alohida o'lchab, eng kichik raqamni yozing.",
  },
  {
    num: 3,
    title: "Balandlikni o'lchang",
    desc: "Derazaning ichki tomonidan balandligini o'lchang. Chap, o'rta va o'ng qismlaridan alohida o'lchab, eng kichik raqamni yozing.",
  },
  {
    num: 4,
    title: "O'lchamlarni yuboring",
    desc: "Olingan o'lchamlarni bizga yuboring. Mutaxassislarimiz siz uchun eng mos jaluziyani tavsiya qiladi.",
  },
];

export default function MeasuringModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Derazani qanday o'lchash kerak">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-3">
          <svg width="26" height="26" viewBox="0 0 24 24"
            fill="none" stroke="#a80000" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M2 12h20M12 2v20" />
            <rect x="2" y="2" width="20" height="20" rx="3" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">
          Maxsus jaluziyalaringiz uchun mukammal o'lchamlarni olish uchun
          qadam-baqadam qo'llanmamizga amal qiling
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {steps.map((step) => (
          <div key={step.num} className="flex gap-4 items-start bg-gray-50 rounded-2xl p-4">
            <div className="w-9 h-9 min-w-[36px] rounded-full bg-[#a80000]
                            flex items-center justify-center text-white font-bold text-sm">
              {step.num}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm mb-1">{step.title}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}