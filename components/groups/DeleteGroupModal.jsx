"use client";

import { Dialog } from '@base-ui/react/dialog';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SpinnerGapIcon } from '@/components/ui/icons';

export default function DeleteGroupModal({ open, onClose, onConfirm, groupName, isDeleting }) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Dialog.Portal>
      <Dialog.Backdrop className="delete-modal-backdrop" />
      <Dialog.Popup className="delete-modal-popup">
        <div className="bg-bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center text-center">

          {/* Illustration */}
          <Image
            src="/deleteIcon.webp"
            alt=""
            width={88}
            height={88}
            className="select-none"
            priority
          />

          {/* Heading */}
          <Dialog.Title className="text-xl font-semibold font-display text-text-heading mt-5">
            Delete group?
          </Dialog.Title>

          {/* Body */}
          <Dialog.Description className="text-sm text-text-secondary mt-2 leading-relaxed max-w-[44ch]">
            <span className="font-medium text-text-heading">{groupName}</span> and all its
            expenses will be permanently removed. This can't be undone.
          </Dialog.Description>

          {/* Actions */}
          <div className="flex gap-2.5 w-full mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
                bg-danger text-white hover:bg-danger/90 active:scale-[0.97]
                transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <><SpinnerGapIcon size={14} className="animate-spin" />Deleting…</>
              ) : (
                'Delete group'
              )}
            </button>
          </div>

        </div>
      </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
