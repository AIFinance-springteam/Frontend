import { BottomActionBar } from "../../../shared/components/BottomActionBar";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import type { Participant } from "../../../shared/types/participant";
import type { SplitItem, SplitMode } from "../types/settlement";
import { AdditionalCostPanel } from "../components/AdditionalCostPanel";
import { SplitItemCard } from "../components/SplitItemCard";

type ReceiptSplitPageProps = {
  items: SplitItem[];
  participants: Participant[];
  unassignedCount: number;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  openRemainderFor: string | null;
  onApplyAll: () => void;
  onCloseRemainder: () => void;
  onOpenRemainder: (itemId: string) => void;
  onToggleParticipant: (itemId: string, participantId: string) => void;
  onChangeMode: (itemId: string, mode: SplitMode) => void;
  onChangeRemainderPayer: (itemId: string, participantId: string) => void;
  onSubmitCustom: (itemId: string, shares: { participantId: string; amount: number }[]) => void;
  onAddAdditionalCost: (name: string, amount: number) => Promise<void>;
  onDeleteAdditionalCost: (itemId: string) => void;
  onSave: () => void;
};

export function ReceiptSplitPage({
  items,
  participants,
  unassignedCount,
  isLoading,
  isMutating,
  error,
  openRemainderFor,
  onApplyAll,
  onCloseRemainder,
  onOpenRemainder,
  onToggleParticipant,
  onChangeMode,
  onChangeRemainderPayer,
  onSubmitCustom,
  onAddAdditionalCost,
  onDeleteAdditionalCost,
  onSave,
}: ReceiptSplitPageProps) {
  const hasUnassignedItem = unassignedCount > 0;
  const assignedItems = items.filter((item) => !item.additionalCost && item.selectedIds.length > 0);
  const additionalCostItems = items.filter((item) => item.additionalCost);
  const unassignedItems = items.filter((item) => !item.additionalCost && item.selectedIds.length === 0);

  const renderItem = (item: SplitItem) => (
    <SplitItemCard
      key={item.id}
      item={item}
      participants={participants}
      isRemainderOpen={openRemainderFor === item.id}
      onCloseRemainder={onCloseRemainder}
      onOpenRemainder={() => onOpenRemainder(item.id)}
      onToggleParticipant={(participantId) => onToggleParticipant(item.id, participantId)}
      onChangeMode={(mode) => onChangeMode(item.id, mode)}
      onChangeRemainderPayer={(participantId) => onChangeRemainderPayer(item.id, participantId)}
      onSubmitCustom={(shares) => onSubmitCustom(item.id, shares)}
      onDelete={item.additionalCost ? () => onDeleteAdditionalCost(item.id) : undefined}
    />
  );

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-neutral-50">
      <div className="flex flex-1 flex-col gap-3 px-5 py-5 pb-4">
        {error ? <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-[11px] text-rose-700">{error}</div> : null}
        {isLoading ? <div className="py-8 text-center text-[12px] text-neutral-400">상품을 불러오는 중…</div> : null}
        <button
          type="button"
          onClick={onApplyAll}
          disabled={isLoading || isMutating}
          className="h-11 rounded-xl border border-neutral-300 bg-white text-[13px] font-bold shadow-sm active:bg-neutral-50"
        >
          전체 참여자로 지정
        </button>

        {assignedItems.map(renderItem)}

        <AdditionalCostPanel onAdd={onAddAdditionalCost}>{additionalCostItems.map(renderItem)}</AdditionalCostPanel>

        {unassignedItems.map(renderItem)}
      </div>

      <BottomActionBar
        helperText={hasUnassignedItem ? `미지정 ${unassignedCount}건 · 저장 불가` : "모든 항목 지정 완료"}
      >
        <PrimaryButton type="button" disabled={hasUnassignedItem || isLoading || isMutating} onClick={onSave}>
          저장
        </PrimaryButton>
      </BottomActionBar>
    </div>
  );
}
