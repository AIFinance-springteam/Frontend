import { BottomActionBar } from '../../../shared/components/BottomActionBar'
import { PrimaryButton } from '../../../shared/components/PrimaryButton'
import type { Participant } from '../../../shared/types/participant'
import type { SplitItem } from '../types/settlement'
import { SplitItemCard } from '../components/SplitItemCard'
import { AdditionalCostPanel } from '../components/AdditionalCostPanel'

type ReceiptSplitPageProps = {
  items: SplitItem[]
  participants: Participant[]
  unassignedCount: number
  openRemainderFor: string | null
  onApplyAll: () => void
  onCloseRemainder: () => void
  onOpenRemainder: (itemId: string) => void
  onUpdateItem: (itemId: string, updater: (item: SplitItem) => SplitItem) => void
  onAddAdditionalCost: (name: string, amount: number) => void
  onDeleteAdditionalCost: (itemId: string) => void
  onSave: () => void
}

export function ReceiptSplitPage({
  items,
  participants,
  unassignedCount,
  openRemainderFor,
  onApplyAll,
  onCloseRemainder,
  onOpenRemainder,
  onUpdateItem,
  onAddAdditionalCost,
  onDeleteAdditionalCost,
  onSave,
}: ReceiptSplitPageProps) {
  const hasUnassignedItem = unassignedCount > 0
  const assignedItems = items.filter((item) => !item.additionalCost && item.selectedIds.length > 0)
  const additionalCostItems = items.filter((item) => item.additionalCost)
  const unassignedItems = items.filter((item) => !item.additionalCost && item.selectedIds.length === 0)

  const renderItem = (item: SplitItem) => (
    <SplitItemCard
      key={item.id}
      item={item}
      participants={participants}
      isRemainderOpen={openRemainderFor === item.id}
      onCloseRemainder={onCloseRemainder}
      onOpenRemainder={() => onOpenRemainder(item.id)}
      onUpdate={(updater) => onUpdateItem(item.id, updater)}
      onDelete={item.additionalCost ? () => onDeleteAdditionalCost(item.id) : undefined}
    />
  )

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

        {assignedItems.map(renderItem)}

        <AdditionalCostPanel onAdd={onAddAdditionalCost}>
          {additionalCostItems.map(renderItem)}
        </AdditionalCostPanel>

        {unassignedItems.map(renderItem)}
      </div>

      <BottomActionBar helperText={hasUnassignedItem ? `미지정 ${unassignedCount}건 · 저장 불가` : '모든 항목 지정 완료'}>
        <PrimaryButton type="button" disabled={hasUnassignedItem} onClick={onSave}>
          저장
        </PrimaryButton>
      </BottomActionBar>
    </div>
  )
}
