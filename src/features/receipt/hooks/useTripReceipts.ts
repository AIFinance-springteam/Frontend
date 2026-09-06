import { useEffect, useState } from "react";
import type { Receipt } from "../components/ReceiptList";
import { formatDateShort } from "../../../shared/utils/formatDate";
import * as receiptApi from "../api/receiptApi";

export function useTripReceipts(tripId: string) {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    receiptApi.getReceipts(tripId).then(async (items) => {
      const withStatus = await Promise.all(
        items.map(async (item) => {
          const unassigned = await receiptApi.getUnassignedItems(tripId, item.receiptId);
          return {
            id: String(item.receiptId),
            place: item.merchantName,
            memo: formatDateShort(item.paidAt),
            amount: item.totalAmount,
            status: (unassigned.items.length > 0 ? "unassigned" : "done") as Receipt["status"],
          };
        }),
      );
      setReceipts(withStatus);
    });
  }, [tripId]);

  const unassignedCount = receipts.filter((receipt) => receipt.status === "unassigned").length;

  return { receipts, unassignedCount };
}
