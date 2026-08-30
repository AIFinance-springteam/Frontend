import type { Receipt } from '../../receipt/components/ReceiptList'
import type { Participant } from '../../../shared/types/participant'

export const tripParticipants: Participant[] = [
  { id: 'yu', name: '유진', avatar: '유' },
  { id: 'min', name: '민서', avatar: '민' },
  { id: 'jun', name: '준호', avatar: '준' },
  { id: 'ji', name: '지수', avatar: '지' },
]

export const tripReceipts: Receipt[] = [
  { id: 'hotel', place: '그랜드호텔 부산', memo: '유명 · 8/1', amount: 180000, status: 'done' },
  { id: 'cu', place: 'CU 해운대점', memo: '준호 · 8/1', amount: 38000, status: 'unassigned' },
  { id: 'seafood', place: '해운대 암소갈비집', memo: '민지 · 8/1', amount: 92000, status: 'done' },
]
