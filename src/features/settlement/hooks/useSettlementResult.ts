import { useCallback, useEffect, useState } from "react";
import { getCurrentUser } from "../../auth/api/authApi";
import { getTripDetail } from "../../trip/api/tripApi";
import * as settlementApi from "../api/settlementApi";
import type { SettlementSummary } from "../types/settlement";

export function useSettlementResult(tripId: string) {
  const [summary, setSummary] = useState<SettlementSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [result, currentUser, trip] = await Promise.all([
      settlementApi.getSettlementResult(tripId),
      getCurrentUser(),
      getTripDetail(tripId),
    ]);
    setError(null);
    const currentParticipant = result.participants.find((participant) => participant.userId === currentUser.userId);

    setSummary({
      tripName: trip.name,
      currentUserId: currentParticipant ? String(currentParticipant.tripMemberId) : "",
      currentUserIsOwner: trip.ownerId === currentUser.userId,
      status: result.status,
      totalAmount: result.totalAmount,
      transferCount: result.transfers.length,
      myBalance: currentParticipant?.differenceAmount ?? 0,
      transfers: result.transfers.map((transfer) => ({
        id: String(transfer.transferId),
        senderMemberId: String(transfer.senderMemberId),
        senderName: transfer.senderNickname,
        receiverMemberId: String(transfer.receiverMemberId),
        receiverName: transfer.receiverNickname,
        amount: transfer.amount,
        status: transfer.status,
      })),
      members: result.participants.map((participant) => ({
        id: String(participant.tripMemberId),
        name: participant.nickname,
        paidAmount: participant.paymentAmount,
        shareAmount: participant.shareAmount,
        balance: participant.differenceAmount,
      })),
    });
  }, [tripId]);

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(load)
      .catch((caught) => {
        if (active) setError((caught as { message?: string }).message ?? "정산 결과를 불러오지 못했습니다.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [load]);

  const runAndReload = async (request: () => Promise<unknown>) => {
    setError(null);
    try {
      await request();
      await load();
    } catch (caught) {
      const message = (caught as { message?: string }).message ?? "요청을 처리하지 못했습니다.";
      setError(message);
      throw caught;
    }
  };

  return {
    summary,
    isLoading,
    error,
    markSent: (transferId: string) => runAndReload(() => settlementApi.markTransferSent(tripId, transferId)),
    confirmTransfer: (transferId: string) => runAndReload(() => settlementApi.confirmTransfer(tripId, transferId)),
    complete: () => runAndReload(() => settlementApi.completeSettlement(tripId)),
  };
}
