import type { SplitItem } from '../types/settlement'

export const initialSplitItems: SplitItem[] = [
  { id: 'water', name: '생수 500ml', amount: 4000, mode: 'equal', selectedIds: ['yu', 'min', 'jun', 'ji'] },
  {
    id: 'chips',
    name: '포카칩 2개',
    amount: 5000,
    mode: 'equal',
    selectedIds: ['yu', 'min', 'jun'],
    remainderPayerId: 'jun',
  },
  { id: 'suncream', name: '선크림', amount: 18000, mode: 'personal', selectedIds: ['ji'] },
  { id: 'battery', name: '보조배터리', amount: 10000, mode: 'equal', selectedIds: [] },
]
