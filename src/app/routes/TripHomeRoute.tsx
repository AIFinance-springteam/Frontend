import { useNavigate, useParams } from "react-router-dom";
import { useTripReceipts } from "../../features/receipt/hooks/useTripReceipts";
import { useTripDashboard } from "../../features/trip/hooks/useTripDashboard";
import { useTripInfo } from "../../features/trip/hooks/useTripInfo";
import { TripHomePage } from "../../features/trip/pages/TripHomePage";
import { MobileHeader } from "../../shared/components/MobileHeader";
import { MobileShell } from "../../shared/components/MobileShell";
import { routePaths } from "./routePaths";

export function TripHomeRoute() {
  const { tripId = "" } = useParams();
  const navigate = useNavigate();
  const tripInfo = useTripInfo(tripId);
  const dashboard = useTripDashboard(tripId);
  const { receipts, unassignedCount } = useTripReceipts(tripId);

  return (
    <MobileShell>
      <MobileHeader title={tripInfo.tripName || "여행 정산"} />
      <TripHomePage
        participants={tripInfo.participants}
        receipts={receipts}
        unassignedCount={unassignedCount}
        totalAmount={dashboard.totalAmount}
        paidAmount={dashboard.paidAmount}
        owedAmount={dashboard.owedAmount}
        balanceDelta={dashboard.balanceDelta}
        dateRangeLabel={tripInfo.dateRangeLabel}
        onNeedActionClick={() => {}}
        onReceiptClick={(receiptId) => navigate(routePaths.receiptSplit(tripId, receiptId))}
        isOwner={false}
        onSettlementConfirm={() => navigate(routePaths.settlementResult(tripId))}
      />
    </MobileShell>
  );
}
