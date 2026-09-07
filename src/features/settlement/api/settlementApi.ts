import { httpClient } from "../../../shared/api/httpClient";

export type SettlementCheckIssueType =
  | "ANALYSIS_INCOMPLETE"
  | "PAYER_UNASSIGNED"
  | "ITEM_SHARE_UNASSIGNED"
  | "SHARE_AMOUNT_MISMATCH"
  | "RECEIPT_AMOUNT_MISMATCH"
  | "DUPLICATE_REVIEW_REQUIRED";

export type SettlementCheckResult = {
  tripId: number;
  readyToConfirm: boolean;
  summary: { receiptCount: number; totalAmount: number; issueCount: number };
  issues: {
    type: SettlementCheckIssueType;
    receiptId: number | null;
    itemId: number | null;
    message: string;
  }[];
};

export type SettlementStatus = "CONFIRMED" | "COMPLETED";
export type SettlementTransferStatus = "PENDING" | "SENT" | "COMPLETED";

export type SettlementResult = {
  settlementId: number;
  tripId: number;
  status: SettlementStatus;
  totalAmount: number;
  confirmedAt: string;
  completedAt: string | null;
  participants: {
    tripMemberId: number;
    userId: number;
    nickname: string;
    paymentAmount: number;
    shareAmount: number;
    differenceAmount: number;
  }[];
  transfers: {
    transferId: number;
    senderMemberId: number;
    senderNickname: string;
    receiverMemberId: number;
    receiverNickname: string;
    amount: number;
    status: SettlementTransferStatus;
    sentAt: string | null;
    confirmedAt: string | null;
  }[];
};

export async function checkSettlement(tripId: string) {
  const { data } = await httpClient.get<SettlementCheckResult>(`/api/v1/trips/${tripId}/settlement/check`);
  return data;
}

export async function confirmSettlement(tripId: string) {
  const { data } = await httpClient.put(`/api/v1/trips/${tripId}/settlement`);
  return data;
}

export async function getSettlementResult(tripId: string) {
  const { data } = await httpClient.get<SettlementResult>(`/api/v1/trips/${tripId}/settlement`);
  return data;
}

export async function markTransferSent(tripId: string, transferId: string) {
  const { data } = await httpClient.patch(`/api/v1/trips/${tripId}/transfers/${transferId}/sent`);
  return data;
}

export async function confirmTransfer(tripId: string, transferId: string) {
  const { data } = await httpClient.patch(`/api/v1/trips/${tripId}/transfers/${transferId}/confirmed`);
  return data;
}

export async function completeSettlement(tripId: string) {
  const { data } = await httpClient.patch(`/api/v1/trips/${tripId}/settlement/complete`);
  return data;
}
