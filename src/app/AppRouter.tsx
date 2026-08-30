import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useReceiptSplit } from '../features/settlement/hooks/useReceiptSplit'
import { tripParticipants } from '../features/trip/mocks/tripMockData'
import { ReceiptSplitRoute } from './routes/ReceiptSplitRoute'
import { routePaths } from './routes/routePaths'
import { TripHomeRoute } from './routes/TripHomeRoute'

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

function AppRoutes() {
  const receiptSplit = useReceiptSplit(tripParticipants)

  return (
    <Routes>
      <Route path="/" element={<Navigate to={routePaths.tripHome()} replace />} />
      <Route
        path="/trips/:tripId"
        element={<TripHomeRoute unassignedCount={receiptSplit.unassignedCount} />}
      />
      <Route
        path="/receipts/:receiptId/split"
        element={
          <ReceiptSplitRoute
            items={receiptSplit.splitItems}
            unassignedCount={receiptSplit.unassignedCount}
            openRemainderFor={receiptSplit.openRemainderFor}
            onApplyAll={receiptSplit.handleApplyAllParticipants}
            onBack={receiptSplit.handleCloseRemainder}
            onCloseRemainder={receiptSplit.handleCloseRemainder}
            onOpenRemainder={receiptSplit.handleOpenRemainder}
            onUpdateItem={receiptSplit.handleUpdateItem}
          />
        }
      />
      <Route path="*" element={<Navigate to={routePaths.tripHome()} replace />} />
    </Routes>
  )
}
