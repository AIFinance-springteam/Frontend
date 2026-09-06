import { httpClient } from "../../../shared/api/httpClient";

type DashboardAmountResult = { amount: number };

type DashboardDifferenceResult = {
  myPayments: number;
  myShares: number;
  difference: number;
  isFinal: boolean;
};

export async function getTotalExpense(tripId: string) {
  const { data } = await httpClient.get<DashboardAmountResult>(`/api/v1/trips/${tripId}/dashboard/total-expense`);
  return data;
}

export async function getMyPayments(tripId: string) {
  const { data } = await httpClient.get<DashboardAmountResult>(`/api/v1/trips/${tripId}/dashboard/my-payments`);
  return data;
}

export async function getMyShares(tripId: string) {
  const { data } = await httpClient.get<DashboardAmountResult>(`/api/v1/trips/${tripId}/dashboard/my-shares`);
  return data;
}

export async function getExpectedDifference(tripId: string) {
  const { data } = await httpClient.get<DashboardDifferenceResult>(
    `/api/v1/trips/${tripId}/dashboard/expected-difference`,
  );
  return data;
}
