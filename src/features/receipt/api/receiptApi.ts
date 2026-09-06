import { httpClient } from "../../../shared/api/httpClient";

export type ReceiptListItem = {
  receiptId: number;
  merchantName: string;
  paidAt: string;
  totalAmount: number;
};

export type UnassignedItemsResult = {
  receiptId: number;
  items: { itemId: number; itemName: string; originalAmount: number }[];
};

export async function getReceipts(tripId: string) {
  const { data } = await httpClient.get<ReceiptListItem[]>(`/api/v1/trips/${tripId}/receipts`);
  return data;
}

export async function getUnassignedItems(tripId: string, receiptId: number) {
  const { data } = await httpClient.get<UnassignedItemsResult>(
    `/api/v1/trips/${tripId}/receipts/${receiptId}/unassigned-items`,
  );
  return data;
}
