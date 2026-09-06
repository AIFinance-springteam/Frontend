import { ParticipantAvatar } from "../../../shared/components/ParticipantAvatar";
import { BottomActionBar } from "../../../shared/components/BottomActionBar";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import type { Participant } from "../../../shared/types/participant";
import { ReceiptList, type Receipt } from "../../receipt/components/ReceiptList";
import { NeedActionBox } from "../components/NeedActionBox";
import { SettlementDeltaCard } from "../components/SettlementDeltaCard";
import { TotalTripCostCard } from "../components/TotalTripCostCard";
import { SettlementCloseCard } from "../../settlement/components/SettlementCloseCard";

type TripHomePageProps = {
  participants: Participant[];
  receipts: Receipt[];
  unassignedCount: number;
  totalAmount: number;
  paidAmount: number;
  owedAmount: number;
  balanceDelta: number;
  dateRangeLabel: string;
  onNeedActionClick: () => void;
  onReceiptClick: (receiptId: string) => void;
  isOwner: boolean;
  onSettlementConfirm: () => void;
};

export function TripHomePage({
  participants,
  receipts,
  unassignedCount,
  totalAmount,
  paidAmount,
  owedAmount,
  balanceDelta,
  dateRangeLabel,
  onNeedActionClick,
  onReceiptClick,
  isOwner,
  onSettlementConfirm,
}: TripHomePageProps) {
  const duplicateCount = 0;

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-neutral-50">
      <div className="flex flex-1 flex-col gap-3 px-5 py-5">
        <div className="flex items-center gap-2 px-0.5">
          {participants.map((participant) => (
            <ParticipantAvatar key={participant.id} participant={participant} isSelected />
          ))}
          <span className="ml-1 text-xs font-medium text-neutral-400">{dateRangeLabel}</span>
        </div>

        <SettlementDeltaCard balanceDelta={balanceDelta} paidAmount={paidAmount} owedAmount={owedAmount} />
        <TotalTripCostCard totalAmount={totalAmount} />

        {(unassignedCount > 0 || duplicateCount > 0) && (
          <NeedActionBox
            unassignedCount={unassignedCount}
            duplicateCount={duplicateCount}
            onUnassignedClick={onNeedActionClick}
          />
        )}

        <SettlementCloseCard unassignedCount={unassignedCount} isOwner={isOwner} onConfirm={onSettlementConfirm} />
        <ReceiptList receipts={receipts} onUnassignedReceiptClick={onReceiptClick} />
      </div>

      <BottomActionBar>
        <PrimaryButton type="button">영수증 등록하기</PrimaryButton>
      </BottomActionBar>
    </div>
  );
}
