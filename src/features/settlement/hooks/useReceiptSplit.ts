import { useState } from 'react'
import type { Participant } from '../../../shared/types/participant'
import { initialSplitItems } from '../mocks/settlementMockData'
import type { SplitItem } from '../types/settlement'

export function useReceiptSplit(participants: Participant[]) {
  const [splitItems, setSplitItems] = useState<SplitItem[]>(initialSplitItems)
  const [openRemainderFor, setOpenRemainderFor] = useState<string | null>(null)

  const unassignedCount = splitItems.filter((item) => item.selectedIds.length === 0).length

  const handleUpdateItem = (itemId: string, updater: (item: SplitItem) => SplitItem) => {
    setSplitItems((items) => items.map((item) => (item.id === itemId ? updater(item) : item)))
  }

  const handleApplyAllParticipants = () => {
    setSplitItems((items) =>
      items.map((item) => ({
        ...item,
        mode: 'equal',
        selectedIds: participants.map((participant) => participant.id),
        remainderPayerId: undefined,
      })),
    )
  }

  const handleCloseRemainder = () => {
    setOpenRemainderFor(null)
  }

  return {
    splitItems,
    unassignedCount,
    openRemainderFor,
    handleApplyAllParticipants,
    handleCloseRemainder,
    handleOpenRemainder: setOpenRemainderFor,
    handleUpdateItem,
  }
}
