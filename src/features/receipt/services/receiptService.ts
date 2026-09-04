import { getMember, getReceipt } from '../../../mocks/tripData'
import type { ReceiptDetail } from '../types/receipt'

// 실제 API 연결 시 이 함수의 구현만 Axios 요청으로 교체합니다.
export const getReceiptDetail = async (
  tripId: string,
  receiptId: string,
): Promise<ReceiptDetail | null> => {
  const receipt = getReceipt(receiptId)

  if (!receipt || receipt.tripId !== tripId) return null

  const payer = getMember(receipt.payerId)
  const detail: ReceiptDetail = {
    receiptId: receipt.id,
    tripId: receipt.tripId,
    merchantName: receipt.merchant,
    paidAt: receipt.paidAt,
    totalAmount: receipt.totalAmount,
    payerId: receipt.payerId,
    payerName: payer?.name ?? '알 수 없음',
    analysisStatus: receipt.analysisStatus,
    duplicateStatus: receipt.duplicateStatus,
    imageUrl: receipt.imageUrl,
    items: receipt.items,
  }

  return structuredClone(detail)
}
