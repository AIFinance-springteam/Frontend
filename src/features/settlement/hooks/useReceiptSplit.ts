import { useEffect, useState } from "react";
import type { SplitItem, SplitMode } from "../types/settlement";
import * as splitApi from "../api/splitApi";
import type { ItemParticipantsResult } from "../api/splitApi";

export function useReceiptSplit(tripId: string, receiptId: string) {
  const [splitItems, setSplitItems] = useState<SplitItem[]>([]);
  const [openRemainderFor, setOpenRemainderFor] = useState<string | null>(null);

  useEffect(() => {
    splitApi.fetchReceiptItems(tripId, receiptId).then((items) => {
      setSplitItems(
        items.map((item) => ({
          id: String(item.itemId),
          name: item.itemName,
          amount: item.originalAmount,
          mode: "equal" as SplitMode,
          selectedIds: [],
        })),
      );
    });
  }, [tripId, receiptId]);

  const unassignedCount = splitItems.filter((item) => !item.additionalCost && item.selectedIds.length === 0).length;

  const applyResult = (itemId: string, result: ItemParticipantsResult, mode: SplitMode, remainderPayerId?: string) => {
    setSplitItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? { ...item, mode, selectedIds: result.participants.map((p) => String(p.tripMemberId)), remainderPayerId }
          : item,
      ),
    );
  };

  const handleToggleParticipant = async (itemId: string, participantId: string) => {
    const item = splitItems.find((i) => i.id === itemId);
    if (!item) return;

    if (item.mode === "personal") {
      const result = await splitApi.splitIndividual(tripId, receiptId, Number(itemId), Number(participantId));
      applyResult(itemId, result, "personal");
      return;
    }

    const nextIds = item.selectedIds.includes(participantId)
      ? item.selectedIds.filter((id) => id !== participantId)
      : [...item.selectedIds, participantId];

    await splitApi.selectParticipants(tripId, receiptId, Number(itemId), nextIds.map(Number));

    if (nextIds.length > 0 && item.mode === "equal") {
      const result = await splitApi.splitEqual(tripId, receiptId, Number(itemId));
      applyResult(itemId, result, "equal");
    } else {
      setSplitItems((items) => items.map((i) => (i.id === itemId ? { ...i, selectedIds: nextIds } : i)));
    }
  };

  const handleChangeMode = async (itemId: string, mode: SplitMode) => {
    const item = splitItems.find((i) => i.id === itemId);
    if (!item || item.selectedIds.length === 0) return;

    if (mode === "personal") {
      const result = await splitApi.splitIndividual(tripId, receiptId, Number(itemId), Number(item.selectedIds[0]));
      applyResult(itemId, result, "personal");
    } else if (mode === "equal") {
      const result = await splitApi.splitEqual(tripId, receiptId, Number(itemId));
      applyResult(itemId, result, "equal");
    } else {
      setSplitItems((items) => items.map((i) => (i.id === itemId ? { ...i, mode: "custom" } : i)));
    }
  };

  const handleChangeRemainderPayer = async (itemId: string, participantId: string) => {
    const result = await splitApi.splitRemainder(tripId, receiptId, Number(itemId), Number(participantId));
    applyResult(itemId, result, "equal", participantId);
  };

  const handleSubmitCustom = async (itemId: string, shares: { participantId: string; amount: number }[]) => {
    const result = await splitApi.splitCustom(
      tripId,
      receiptId,
      Number(itemId),
      shares.map((s) => ({ tripMemberId: Number(s.participantId), amount: s.amount })),
    );
    applyResult(itemId, result, "custom");
  };

  const handleApplyAllParticipants = async () => {
    for (const item of splitItems.filter((i) => !i.additionalCost)) {
      await splitApi.selectAllParticipants(tripId, receiptId, Number(item.id));
      const result = await splitApi.splitEqual(tripId, receiptId, Number(item.id));
      applyResult(item.id, result, "equal");
    }
  };

  const handleAddAdditionalCost = async (name: string, amount: number) => {
    const item = await splitApi.addAdditionalCost(tripId, receiptId, name, amount);
    setSplitItems((items) => [
      ...items,
      {
        id: String(item.itemId),
        name: item.itemName,
        amount: item.originalAmount,
        additionalCost: true,
        mode: "equal",
        selectedIds: [],
      },
    ]);
  };

  const handleDeleteAdditionalCost = async (itemId: string) => {
    await splitApi.deleteAdditionalCost(tripId, receiptId, Number(itemId));
    setSplitItems((items) => items.filter((item) => item.id !== itemId));
  };

  return {
    splitItems,
    unassignedCount,
    openRemainderFor,
    handleApplyAllParticipants,
    handleCloseRemainder: () => setOpenRemainderFor(null),
    handleOpenRemainder: setOpenRemainderFor,
    handleToggleParticipant,
    handleChangeMode,
    handleChangeRemainderPayer,
    handleSubmitCustom,
    handleAddAdditionalCost,
    handleDeleteAdditionalCost,
  };
}
