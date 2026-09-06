import { useNavigate, useParams } from "react-router-dom";
import { useReceiptSplit } from "../../features/settlement/hooks/useReceiptSplit";
import { ReceiptSplitPage } from "../../features/settlement/pages/ReceiptSplitPage";
import { useTripInfo } from "../../features/trip/hooks/useTripInfo";
import { MobileHeader } from "../../shared/components/MobileHeader";
import { MobileShell } from "../../shared/components/MobileShell";
import { routePaths } from "./routePaths";

export function ReceiptSplitRoute() {
  const { tripId = "", receiptId = "" } = useParams();
  const navigate = useNavigate();
  const split = useReceiptSplit(tripId, receiptId);
  const tripInfo = useTripInfo(tripId);

  return (
    <MobileShell>
      <MobileHeader title="비용 나누기" onBack={() => navigate(routePaths.tripHome(tripId))} />
      <ReceiptSplitPage
        items={split.splitItems}
        participants={tripInfo.participants}
        unassignedCount={split.unassignedCount}
        openRemainderFor={split.openRemainderFor}
        onApplyAll={split.handleApplyAllParticipants}
        onCloseRemainder={split.handleCloseRemainder}
        onOpenRemainder={split.handleOpenRemainder}
        onToggleParticipant={split.handleToggleParticipant}
        onChangeMode={split.handleChangeMode}
        onChangeRemainderPayer={split.handleChangeRemainderPayer}
        onSubmitCustom={split.handleSubmitCustom}
        onAddAdditionalCost={split.handleAddAdditionalCost}
        onDeleteAdditionalCost={split.handleDeleteAdditionalCost}
      />
    </MobileShell>
  );
}
