"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Invoice from "../../Invoice";
import { Order } from "@/types/order";

export function InvoiceModal({
  onClose,
  open,
  data,
}: {
  onClose: () => void;
  open: boolean;
  data: Order | null;
}) {
  return (
    <Dialog onOpenChange={onClose} open={open} aria-describedby={undefined}>
      <DialogContent
        className="max-w-[100vw] h-[100vh] p-0"
        style={{
          width: "100vw",
          height: "100vh",
          maxWidth: "initial",
          maxHeight: "initial",
        }}
      >
        <DialogHeader className="hidden">
          <DialogTitle>Invoice</DialogTitle>
        </DialogHeader>

        <div className="w-full h-full overflow-auto bg-gray-100 flex-col flex  p-4">
          <Invoice data={data} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
