import { useNavigate } from 'react-router-dom'
import { ReceiptSplitPage } from '../../features/settlement/pages/ReceiptSplitPage'
import type { SplitItem } from '../../features/settlement/types/settlement'
import { tripParticipants } from '../../features/trip/mocks/tripMockData'
import { MobileHeader } from '../../shared/components/MobileHeader'
import { MobileShell } from '../../shared/components/MobileShell'
import { routePaths } from './routePaths'

type ReceiptSplitRouteProps = {
  items: SplitItem[]
  openRemainderFor: string | null
  unassignedCount: number
  onApplyAll: () => void
  onBack: () => void
  onCloseRemainder: () => void
  onOpenRemainder: (itemId: string) => void
  onUpdateItem: (itemId: string, updater: (item: SplitItem) => SplitItem) => void
}

export function ReceiptSplitRoute({
  items,
  openRemainderFor,
  unassignedCount,
  onApplyAll,
  onBack,
  onCloseRemainder,
  onOpenRemainder,
  onUpdateItem,
}: ReceiptSplitRouteProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    onBack()
    navigate(routePaths.tripHome())
  }

  return (
    <MobileShell>
      <MobileHeader title="비용 나누기" subtitle="CU 해운대점" onBack={handleBack} />
      <ReceiptSplitPage
        items={items}
        participants={tripParticipants}
        unassignedCount={unassignedCount}
        openRemainderFor={openRemainderFor}
        onApplyAll={onApplyAll}
        onCloseRemainder={onCloseRemainder}
        onOpenRemainder={onOpenRemainder}
        onUpdateItem={onUpdateItem}
      />
    </MobileShell>
  )
}
