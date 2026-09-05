import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useReceiptSplit } from '../features/settlement/hooks/useReceiptSplit'
import { tripParticipants } from '../features/trip/mocks/tripMockData'
import { tokenStorage } from '../shared/api/tokenStorage'
import { ReceiptSplitRoute } from './routes/ReceiptSplitRoute'
import { routePaths } from './routes/routePaths'
import { TripHomeRoute } from './routes/TripHomeRoute'
import { SettlementResultRoute } from './routes/SettlementResultRoute'
import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'
import TripsPage from '../pages/trips/TripsPage'
import TripMembersPage from '../pages/trips/TripMembersPage'
import InvitedTripPage from '../pages/trips/InvitedTripPage'
import ReceiptNewPage from '../pages/trips/receipts/ReceiptNewPage'
import ReceiptDetailPage from '../pages/trips/receipts/ReceiptDetailPage'

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
      <Route
        path="/"
        element={<Navigate to={tokenStorage.get() ? routePaths.tripHome() : '/login'} replace />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/trips" element={<TripsPage />} />
      <Route
        path="/trips/:tripId"
        element={<TripHomeRoute unassignedCount={receiptSplit.unassignedCount} />}
      />
      <Route path="/trips/:tripId/members" element={<TripMembersPage />} />
      <Route path="/trips/:tripId/receipts/new" element={<ReceiptNewPage />} />
      <Route path="/trips/:tripId/receipts/:receiptId" element={<ReceiptDetailPage />} />
      <Route path="/trips/:tripId/settlement" element={<SettlementResultRoute />} />
      <Route path="/invite/:inviteCode" element={<InvitedTripPage />} />
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
            onAddAdditionalCost={receiptSplit.handleAddAdditionalCost}
            onDeleteAdditionalCost={receiptSplit.handleDeleteAdditionalCost}
          />
        }
      />
      <Route path="*" element={<Navigate to={routePaths.tripHome()} replace />} />
    </Routes>
  )
}
