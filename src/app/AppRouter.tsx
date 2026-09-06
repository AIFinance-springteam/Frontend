import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import TripsPage from "../pages/trips/TripsPage";
import TripMembersPage from "../pages/trips/TripMembersPage";
import InvitedTripPage from "../pages/trips/InvitedTripPage";
import ReceiptNewPage from "../pages/trips/receipts/ReceiptNewPage";
import ReceiptDetailPage from "../pages/trips/receipts/ReceiptDetailPage";
import { tokenStorage } from "../shared/api/tokenStorage";
import { ReceiptSplitRoute } from "./routes/ReceiptSplitRoute";
import { SettlementResultRoute } from "./routes/SettlementResultRoute";
import { TripHomeRoute } from "./routes/TripHomeRoute";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={tokenStorage.get() ? "/trips" : "/login"} replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/:tripId" element={<TripHomeRoute />} />
        <Route path="/trips/:tripId/members" element={<TripMembersPage />} />
        <Route path="/trips/:tripId/receipts/new" element={<ReceiptNewPage />} />
        <Route path="/trips/:tripId/receipts/:receiptId" element={<ReceiptDetailPage />} />
        <Route path="/trips/:tripId/receipts/:receiptId/split" element={<ReceiptSplitRoute />} />
        <Route path="/trips/:tripId/settlement" element={<SettlementResultRoute />} />
        <Route path="/invite/:inviteCode" element={<InvitedTripPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
