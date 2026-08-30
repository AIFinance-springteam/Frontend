export type SplitMode = 'equal' | 'personal'

export type SplitItem = {
  id: string
  name: string
  amount: number
  mode: SplitMode
  selectedIds: string[]
  remainderPayerId?: string
}
