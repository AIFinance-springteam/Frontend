import { httpClient } from '../../../shared/api/httpClient'
import type { ReceiptDetail, ReceiptDetailResponse } from '../types/receipt'

export const getReceiptDetail = async (
  tripId: string,
  receiptId: string,
): Promise<ReceiptDetail> => {
  const { data } = await httpClient.get<ReceiptDetailResponse>(
    `/api/v1/trips/${encodeURIComponent(tripId)}/receipts/${encodeURIComponent(receiptId)}`,
  )

  return {
    receiptId: String(data.receiptId),
    tripId,
    merchantName: data.merchantName ?? (data.analysisStatus === 'FAILED' ? '분석에 실패한 영수증' : '분석 중인 영수증'),
    paidAt: data.paidAt ?? '',
    totalAmount: data.totalAmount ?? 0,
    payerId: data.payerMemberId === null ? null : String(data.payerMemberId),
    payerName: data.payerMemberName ?? '미지정',
    status: data.status,
    analysisStatus: data.analysisStatus,
    duplicateStatus: data.duplicateStatus,
    imageUrl: data.imageUrl,
    items: data.items.map((item) => ({
      id: String(item.itemId),
      name: item.itemName,
      quantity: item.quantity,
      amount: item.originalAmount,
      confidence: 'UNKNOWN',
    })),
  }
}
