export type AnalysisStatus = 'SUCCESS' | 'PROCESSING' | 'FAILED'
export type DuplicateStatus = 'PENDING' | 'DUPLICATE' | 'CLEAR'
export type Confidence = 'HIGH' | 'LOW'

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
  payerId: string
  payerName: string
  analysisStatus: AnalysisStatus
  duplicateStatus: DuplicateStatus
  imageUrl: string | null
  items: ReceiptItem[]
}
