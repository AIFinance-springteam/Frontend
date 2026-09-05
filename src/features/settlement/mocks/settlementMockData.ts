import type { SettlementSummary, SplitItem } from '../types/settlement'

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
  {
    id: 'battery',
    name: '보조배터리',
    amount: 10000,
    mode: 'equal',
    selectedIds: [],
  },
]

export const settlementSummaryMock: SettlementSummary = {
  tripName: '부산 2박 3일',
  currentUserId: 'yu',
  currentUserIsOwner: true,
  totalAmount: 394000,
  transferCount: 3,
  myBalance: 18000,
  transfers: [
    {
      id: 'transfer-yu-min',
      senderMemberId: 'yu',
      senderName: '유진',
      receiverMemberId: 'min',
      receiverName: '민서',
      amount: 18000,
      status: 'PENDING',
    },
    {
      id: 'transfer-jun-yu',
      senderMemberId: 'jun',
      senderName: '준호',
      receiverMemberId: 'yu',
      receiverName: '유진',
      amount: 52000,
      status: 'SENT',
    },
    {
      id: 'transfer-ji-yu',
      senderMemberId: 'ji',
      senderName: '지수',
      receiverMemberId: 'yu',
      receiverName: '유진',
      amount: 65000,
      status: 'CONFIRMED',
    },
  ],
  members: [
    { id: 'yu', name: '유진', paidAmount: 240000, shareAmount: 105000, balance: 135000 },
    { id: 'min', name: '민서', paidAmount: 92000, shareAmount: 110000, balance: -18000 },
    { id: 'jun', name: '준호', paidAmount: 38000, shareAmount: 90000, balance: -52000 },
    { id: 'ji', name: '지수', paidAmount: 24000, shareAmount: 89000, balance: -65000 },
  ],
}
