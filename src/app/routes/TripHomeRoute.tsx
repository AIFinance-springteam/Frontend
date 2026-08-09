import { useNavigate } from 'react-router-dom'
import { tripParticipants, tripReceipts } from '../../features/trip/mocks/tripMockData'
import { TripHomePage } from '../../features/trip/pages/TripHomePage'
import { MobileHeader } from '../../shared/components/MobileHeader'
import { MobileShell } from '../../shared/components/MobileShell'
import { routePaths } from './routePaths'

type TripHomeRouteProps = {
  unassignedCount: number
}

export function TripHomeRoute({ unassignedCount }: TripHomeRouteProps) {
  const navigate = useNavigate()

  return (
    <MobileShell>
      <MobileHeader title="부산 2박 3일" />
      <TripHomePage
        participants={tripParticipants}
        receipts={tripReceipts}
        unassignedCount={unassignedCount}
        onNeedActionClick={() => navigate(routePaths.receiptSplit())}
        onReceiptClick={(receiptId) => navigate(routePaths.receiptSplit(receiptId))}
      />
    </MobileShell>
  )
}
