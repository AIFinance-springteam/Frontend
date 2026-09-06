import { formatWon } from "../../../shared/utils/formatCurrency";
import type { Participant } from "../../../shared/types/participant";
import type { SplitItem, SplitMode } from "../types/settlement";
import { CustomShareInputs } from "./CustomShareInputs";
import { ParticipantSelector } from "./ParticipantSelector";
import { RemainderPayerBox } from "./RemainderPayerBox";
import { SplitModeToggle } from "./SplitModeToggle";

type SplitItemCardProps = {
  item: SplitItem;
  participants: Participant[];
  isRemainderOpen: boolean;
  onCloseRemainder: () => void;
  onOpenRemainder: () => void;
  onToggleParticipant: (participantId: string) => void;
  onChangeMode: (mode: SplitMode) => void;
  onChangeRemainderPayer: (participantId: string) => void;
  onSubmitCustom: (shares: { participantId: string; amount: number }[]) => void;
  onDelete?: () => void;
};

export function SplitItemCard({
  item,
  participants,
  isRemainderOpen,
  onCloseRemainder,
  onOpenRemainder,
  onToggleParticipant,
  onChangeMode,
  onChangeRemainderPayer,
  onSubmitCustom,
  onDelete,
}: SplitItemCardProps) {
  const selectedCount = item.selectedIds.length;
  const remainder = selectedCount ? item.amount % selectedCount : 0;
  const selectedPerson = participants.find((p) => p.id === item.selectedIds[0]);

  const splitSummary =
    selectedCount === 0
      ? ""
      : item.mode === "personal"
        ? `${selectedPerson?.name ?? ""} ${formatWon(item.amount)}`
        : item.mode === "custom"
          ? "직접 입력"
          : `1인 ${formatWon(Math.floor(item.amount / selectedCount))}`;

  return (
    <article className="relative rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-[15px] font-bold">{item.name}</h2>
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="h-6 shrink-0 rounded-full border border-neutral-300 bg-white px-2.5 !text-[10px] font-bold leading-none text-neutral-500 active:bg-neutral-50"
            >
              삭제
            </button>
          ) : null}
        </div>
        <strong className="shrink-0 text-[15px] font-bold">{formatWon(item.amount)}</strong>
      </div>

      {selectedCount === 0 ? (
        <div className="flex min-h-16 items-end justify-between gap-3">
          <ParticipantSelector item={item} participants={participants} onToggle={onToggleParticipant} />
          <span className="rounded-full bg-neutral-950 px-2.5 py-1 text-[10px] font-bold text-white">미지정</span>
        </div>
      ) : (
        <>
          <SplitModeToggle value={item.mode} onChange={onChangeMode} />
          <div className="mt-3.5 flex items-center justify-between gap-3">
            <ParticipantSelector item={item} participants={participants} onToggle={onToggleParticipant} />
            <strong className="shrink-0 text-[15px] font-bold">{splitSummary}</strong>
          </div>
        </>
      )}

      {item.mode === "custom" && selectedCount > 0 ? (
        <CustomShareInputs
          amount={item.amount}
          selectedIds={item.selectedIds}
          participants={participants}
          onSubmit={onSubmitCustom}
        />
      ) : null}

      {item.mode === "equal" && remainder > 0 && selectedCount > 0 ? (
        <RemainderPayerBox
          remainder={remainder}
          selectedIds={item.selectedIds}
          participants={participants}
          payerId={item.remainderPayerId}
          isOpen={isRemainderOpen}
          onOpen={onOpenRemainder}
          onClose={onCloseRemainder}
          onChange={onChangeRemainderPayer}
        />
      ) : null}
    </article>
  );
}
