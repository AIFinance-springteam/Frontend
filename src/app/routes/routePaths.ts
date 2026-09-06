export const routePaths = {
  tripHome: (tripId: string) => `/trips/${tripId}`,
  receiptDetail: (tripId: string, receiptId: string) => `/trips/${tripId}/receipts/${receiptId}`,
  receiptSplit: (tripId: string, receiptId: string) => `/trips/${tripId}/receipts/${receiptId}/split`,
  settlementResult: (tripId: string) => `/trips/${tripId}/settlement`,
};
