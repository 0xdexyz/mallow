'use client';

import Modal from './Modal';

interface ExclusiveModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ExclusiveModal({ open, onClose }: ExclusiveModalProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="exclusive-modal-title">
      <div className="exclusive-modal">
        <span className="exclusive-modal-badge">Preview</span>
        <h2 id="exclusive-modal-title" className="exclusive-modal-title">Mallow Exclusive is in preview</h2>
        <p className="exclusive-modal-note">
          Premium social intelligence — deeper thesis analysis, multi-post context, narrative tracking and more — is
          coming soon. There&rsquo;s nothing to purchase yet; no SOL, wallet, or payment is processed here.
        </p>
        <button type="button" className="btn-primary" onClick={onClose}>
          Got it
        </button>
      </div>
    </Modal>
  );
}
