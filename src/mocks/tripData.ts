export interface Member {
  id: string
  name: string
  initial: string
  isOwner: boolean
}

export interface ReceiptItem {
  id: string
  name: string
  quantity: number
  amount: number
  uncertain?: boolean
}

export interface Receipt {
  id: string
  tripId: string
  merchant: string
  payerId: string
  paidAt: string
  totalAmount: number
  items: ReceiptItem[]
  assigned: boolean
}

export interface Trip {
  id: string
  name: string
  startDate: string
  endDate: string
  memberIds: string[]
  totalAmount: number
  myPaidAmount: number
  myShareAmount: number
  unassignedReceiptCount: number
  duplicateSuspectCount: number
}

export const currentUserId = 'u-junho'

export const members: Member[] = [
  { id: 'u-yuyeong', name: '유녕', initial: '유', isOwner: true },
  { id: 'u-minji', name: '민지', initial: '민', isOwner: false },
  { id: 'u-junho', name: '준호', initial: '준', isOwner: false },
  { id: 'u-jisu', name: '지수', initial: '지', isOwner: false },
]

export const trips: Trip[] = [
  {
    id: 'busan-2508',
    name: '부산 2박 3일',
    startDate: '8월 1일',
    endDate: '8월 3일',
    memberIds: ['u-yuyeong', 'u-minji', 'u-junho', 'u-jisu'],
    totalAmount: 394000,
    myPaidAmount: 240000,
    myShareAmount: 105000,
    unassignedReceiptCount: 1,
    duplicateSuspectCount: 1,
  },
]

export const receipts: Receipt[] = [
  {
    id: '10',
    tripId: 'busan-2508',
    merchant: '그랜드호텔 부산',
    payerId: 'u-yuyeong',
    paidAt: '8/1',
    totalAmount: 180000,
    items: [],
    assigned: true,
  },
  {
    id: '11',
    tripId: 'busan-2508',
    merchant: '해운대 암소갈비집',
    payerId: 'u-minji',
    paidAt: '8/1',
    totalAmount: 92000,
    items: [],
    assigned: true,
  },
  {
    id: '12',
    tripId: 'busan-2508',
    merchant: 'CU 해운대점',
    payerId: 'u-junho',
    paidAt: '8월 1일 19:45',
    totalAmount: 38000,
    items: [
      { id: 'i1', name: '생수 500ml', quantity: 4, amount: 4000 },
      { id: 'i2', name: '포카칩', quantity: 2, amount: 6000 },
      { id: 'i3', name: '선크림 SPF50', quantity: 1, amount: 18000, uncertain: true },
      { id: 'i4', name: '보조배터리', quantity: 1, amount: 10000 },
    ],
    assigned: false,
  },
]

export function getTrip(tripId: string): Trip | undefined {
  return trips.find((trip) => trip.id === tripId)
}

export function getMember(memberId: string): Member | undefined {
  return members.find((member) => member.id === memberId)
}

export function getTripMembers(trip: Trip): Member[] {
  return trip.memberIds
    .map((id) => getMember(id))
    .filter((member): member is Member => member !== undefined)
}

export function getReceiptsByTrip(tripId: string): Receipt[] {
  return receipts.filter((receipt) => receipt.tripId === tripId)
}

export function getReceipt(receiptId: string): Receipt | undefined {
  return receipts.find((receipt) => receipt.id === receiptId)
}

export function formatWon(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}
