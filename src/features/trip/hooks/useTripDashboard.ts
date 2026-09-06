import { useEffect, useState } from "react";
import * as dashboardApi from "../api/dashboardApi";

export function useTripDashboard(tripId: string) {
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [owedAmount, setOwedAmount] = useState(0);
  const [balanceDelta, setBalanceDelta] = useState(0);

  useEffect(() => {
    dashboardApi.getTotalExpense(tripId).then((result) => setTotalAmount(result.amount));
    dashboardApi.getMyPayments(tripId).then((result) => setPaidAmount(result.amount));
    dashboardApi.getMyShares(tripId).then((result) => setOwedAmount(result.amount));
    dashboardApi.getExpectedDifference(tripId).then((result) => setBalanceDelta(result.difference));
  }, [tripId]);

  return { totalAmount, paidAmount, owedAmount, balanceDelta };
}
