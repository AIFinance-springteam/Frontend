import { useNavigate } from 'react-router-dom'
import { settlementSummaryMock } from '../../features/settlement/mocks/settlementMockData'
import { SettlementResultPage } from '../../features/settlement/pages/SettlementResultPage'
import { MobileHeader } from '../../shared/components/MobileHeader'
import { MobileShell } from '../../shared/components/MobileShell'
import { routePaths } from './routePaths'

export function SettlementResultRoute() {
  const navigate = useNavigate()

  return (
    <MobileShell>
      <MobileHeader
        title="정산 결과"
        subtitle={settlementSummaryMock.tripName}
        onBack={() => navigate(routePaths.tripHome())}
      />
      <SettlementResultPage
        summary={settlementSummaryMock}
        onComplete={() => navigate(routePaths.tripHome())}
      />
    </MobileShell>
  )
}
