export type AnalysisStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED'
export type DuplicateStatus = 'PENDING' | 'UNIQUE' | 'DUPLICATE'
export type ReceiptStatus = 'ACTIVE' | 'CONFIRMED' | 'DELETED'
export type Confidence = 'HIGH' | 'LOW' | 'UNKNOWN'

export type ReceiptItemResponse = {
  itemId: number
  itemName: string
  quantity: number
  originalAmount: number
  settlementAmount: number
}

export type ReceiptDetailResponse = {
  receiptId: number
  imageUrl: string | null
  merchantName: string | null
  paidAt: string | null
  totalAmount: number | null
  payerMemberId: number | null
  payerMemberName: string | null
  status: ReceiptStatus
  analysisStatus: AnalysisStatus
  duplicateStatus: DuplicateStatus
  items: ReceiptItemResponse[]
}

export type ReceiptItem = {
  id: string
  name: string
  quantity: number
  amount: number
  confidence: Confidence
}

export type ReceiptDetail = {
  receiptId: string
  tripId: string
  merchantName: string
  paidAt: string
  totalAmount: number
  payerId: string | null
  payerName: string
  status: ReceiptStatus
  analysisStatus: AnalysisStatus
  duplicateStatus: DuplicateStatus
  imageUrl: string | null
  items: ReceiptItem[]
}
