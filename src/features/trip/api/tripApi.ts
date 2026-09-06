import { httpClient } from "../../../shared/api/httpClient";

export type TripDetailResult = {
  tripId: number;
  name: string;
  startDate: string;
  endDate: string;
};

export type TripMemberResult = {
  tripMemberId: number;
  nickname: string;
};

export async function getTripDetail(tripId: string) {
  const { data } = await httpClient.get<TripDetailResult>(`/api/v1/trips/${tripId}`);
  return data;
}

export async function getMembers(tripId: string) {
  const { data } = await httpClient.get<TripMemberResult[]>(`/api/v1/trips/${tripId}/members`);
  return data;
}
