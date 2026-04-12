"use client";

import { Dialog } from '@base-ui/react/dialog';
import Image from 'next/image';
import { SpinnerGapIcon } from '@/components/ui/icons';

export default function ProcessingPaymentModal({ open }) {
  return (
    <Dialog.Root open={open} onOpenChange={() => {}}>
      <Dialog.Portal>
        <Dialog.Backdrop className="delete-modal-backdrop" />
        <Dialog.Popup className="delete-modal-popup">
          <div className="bg-bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center text-center">

            <Image
              src="/processingPayment.webp"
              alt=""
              width={200}
              height={200}
              className="select-none"
              priority
            />

            <Dialog.Title className="text-xl font-semibold font-display text-text-heading mt-5">
              Processing payment
            </Dialog.Title>

            <Dialog.Description className="text-sm text-text-secondary mt-2 leading-relaxed max-w-[44ch]">
              Please wait while your payment is being processed. Do not close this page.
            </Dialog.Description>

            <div className="flex items-center justify-center gap-2 w-full mt-6 rounded-lg px-4 py-2 bg-bg-primary text-text-muted text-sm font-medium">
              <SpinnerGapIcon size={14} className="animate-spin" />
              Processing…
            </div>

          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
