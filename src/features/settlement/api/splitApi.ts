import { httpClient } from "../../../shared/api/httpClient";

export type ReceiptDetailItem = {
  itemId: number;
  itemName: string;
  originalAmount: number;
};

export type ItemParticipantsResult = {
  itemId: number;
  participants: { tripMemberId: number; shareAmount: number }[];
};

export async function fetchReceiptItems(tripId: string, receiptId: string) {
  const { data } = await httpClient.get<{ items: ReceiptDetailItem[] }>(
    `/api/v1/trips/${tripId}/receipts/${receiptId}`,
  );
  return data.items;
}

export async function selectParticipants(tripId: string, receiptId: string, itemId: number, tripMemberIds: number[]) {
  const { data } = await httpClient.post<ItemParticipantsResult>(
    `/api/v1/trips/${tripId}/receipts/${receiptId}/items/${itemId}/participants`,
    { tripMemberIds },
  );
  return data;
}

export async function selectAllParticipants(tripId: string, receiptId: string, itemId: number) {
  const { data } = await httpClient.post<ItemParticipantsResult>(
    `/api/v1/trips/${tripId}/receipts/${receiptId}/items/${itemId}/participants/all`,
  );
  return data;
}

export async function splitEqual(tripId: string, receiptId: string, itemId: number) {
  const { data } = await httpClient.post<ItemParticipantsResult>(
    `/api/v1/trips/${tripId}/receipts/${receiptId}/items/${itemId}/split/equal`,
  );
  return data;
}

export async function splitRemainder(tripId: string, receiptId: string, itemId: number, tripMemberId: number) {
  const { data } = await httpClient.post<ItemParticipantsResult>(
    `/api/v1/trips/${tripId}/receipts/${receiptId}/items/${itemId}/split/remainder`,
    { tripMemberId },
  );
  return data;
}

export async function splitIndividual(tripId: string, receiptId: string, itemId: number, tripMemberId: number) {
  const { data } = await httpClient.post<ItemParticipantsResult>(
    `/api/v1/trips/${tripId}/receipts/${receiptId}/items/${itemId}/split/individual`,
    { tripMemberId },
  );
  return data;
}

export async function splitCustom(
  tripId: string,
  receiptId: string,
  itemId: number,
  shares: { tripMemberId: number; amount: number }[],
) {
  const { data } = await httpClient.put<ItemParticipantsResult>(
    `/api/v1/trips/${tripId}/receipts/${receiptId}/items/${itemId}/split/custom`,
    { shares },
  );
  return data;
}

export async function addAdditionalCost(tripId: string, receiptId: string, itemName: string, amount: number) {
  const { data } = await httpClient.post<{ itemId: number; itemName: string; originalAmount: number }>(
    `/api/v1/trips/${tripId}/receipts/${receiptId}/items`,
    { itemName, originalAmount: amount },
  );
  return data;
}

export async function deleteAdditionalCost(tripId: string, receiptId: string, itemId: number) {
  await httpClient.delete(`/api/v1/trips/${tripId}/receipts/${receiptId}/items/${itemId}`);
}
