export const routePaths = {
  tripHome: (tripId = 'busan-2508') => `/trips/${tripId}`,
  receiptDetail: (tripId: string, receiptId: string) =>
    `/trips/${tripId}/receipts/${receiptId}`,
  receiptSplit: (receiptId = 'cu') => `/receipts/${receiptId}/split`,
}
