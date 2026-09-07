import { useNavigate, useParams } from "react-router-dom";
import { SettlementResultPage } from "../../features/settlement/pages/SettlementResultPage";
import { useSettlementResult } from "../../features/settlement/hooks/useSettlementResult";
import { MobileHeader } from "../../shared/components/MobileHeader";
import { MobileShell } from "../../shared/components/MobileShell";
import { routePaths } from "./routePaths";

export function SettlementResultRoute() {
  const navigate = useNavigate();
  const { tripId = "" } = useParams();
  const settlement = useSettlementResult(tripId);

  if (settlement.isLoading) {
    return <MobileShell><div className="grid min-h-screen place-items-center text-sm text-neutral-400">정산 결과를 불러오는 중…</div></MobileShell>;
  }

  if (!settlement.summary) {
    return (
      <MobileShell>
        <div className="grid min-h-screen place-items-center px-6 text-center text-sm text-rose-600">
          {settlement.error ?? "정산 결과를 불러오지 못했습니다."}
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <MobileHeader
        title="정산 결과"
        subtitle={settlement.summary.tripName}
        onBack={() => navigate(routePaths.tripHome(tripId))}
      />
      <SettlementResultPage
        summary={settlement.summary}
        error={settlement.error}
        onMarkSent={settlement.markSent}
        onConfirmTransfer={settlement.confirmTransfer}
        onComplete={async () => {
          await settlement.complete();
          navigate(routePaths.tripHome(tripId));
        }}
      />
    </MobileShell>
  );
}
