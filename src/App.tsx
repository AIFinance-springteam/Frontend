import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import TripsPage from './pages/trips/TripsPage'
import TripDetailPage from './pages/trips/TripDetailPage'
import TripMembersPage from './pages/trips/TripMembersPage'
import InvitedTripPage from './pages/trips/InvitedTripPage'
import ReceiptNewPage from './pages/trips/receipts/ReceiptNewPage'
import ReceiptDetailPage from './pages/trips/receipts/ReceiptDetailPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/:tripId" element={<TripDetailPage />} />
        <Route path="/trips/:tripId/members" element={<TripMembersPage />} />
        <Route path="/trips/:tripId/receipts/new" element={<ReceiptNewPage />} />
        <Route path="/trips/:tripId/receipts/:receiptId" element={<ReceiptDetailPage />} />
        <Route path="/invite/:inviteCode" element={<InvitedTripPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  )
}

export default App
