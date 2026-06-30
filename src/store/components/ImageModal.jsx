// src/components/ImageModal.jsx — Rasm kattalashtirish
import Modal from "./Modal";

export default function ImageModal({ isOpen, onClose, image, title }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <img
        src={image}
        alt={title}
        className="w-full rounded-2xl object-cover"
      />
    </Modal>
  );
}