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
  openRemainderFor: string | null;
  onApplyAll: () => void;
  onCloseRemainder: () => void;
  onOpenRemainder: (itemId: string) => void;
  onToggleParticipant: (itemId: string, participantId: string) => void;
  onChangeMode: (itemId: string, mode: SplitMode) => void;
  onChangeRemainderPayer: (itemId: string, participantId: string) => void;
  onSubmitCustom: (itemId: string, shares: { participantId: string; amount: number }[]) => void;
  onAddAdditionalCost: (name: string, amount: number) => void;
  onDeleteAdditionalCost: (itemId: string) => void;
};

export function ReceiptSplitPage({
  items,
  participants,
  unassignedCount,
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
}: ReceiptSplitPageProps) {
  const hasUnassignedItem = unassignedCount > 0;
  const regularItems = items.filter((item) => !item.additionalCost);
  const additionalCostItems = items.filter((item) => item.additionalCost);

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
        <button
          type="button"
          onClick={onApplyAll}
          className="h-11 rounded-xl border border-neutral-300 bg-white text-[13px] font-bold shadow-sm active:bg-neutral-50"
        >
          전체 참여자로 지정
        </button>

        {regularItems.map(renderItem)}

        <AdditionalCostPanel onAdd={onAddAdditionalCost}>{additionalCostItems.map(renderItem)}</AdditionalCostPanel>
      </div>

      <BottomActionBar
        helperText={hasUnassignedItem ? `미지정 ${unassignedCount}건 · 저장 불가` : "모든 항목 지정 완료"}
      >
        <PrimaryButton type="button" disabled={hasUnassignedItem}>
          저장
        </PrimaryButton>
      </BottomActionBar>
    </div>
  );
}
