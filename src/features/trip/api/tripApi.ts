import { httpClient } from "../../../shared/api/httpClient";

export type TripDetailResult = {
  tripId: number;
  name: string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "SETTLING" | "COMPLETED";
  ownerId: number;
  ownerNickname: string;
};

export type TripMemberResult = {
  userId: number;
  nickname: string;
  role: "OWNER" | "MEMBER";
};

export async function getTripDetail(tripId: string) {
  const { data } = await httpClient.get<TripDetailResult>(`/api/v1/trips/${tripId}`);
  return data;
}

export async function getMembers(tripId: string) {
  const { data } = await httpClient.get<TripMemberResult[]>(`/api/v1/trips/${tripId}/members`);
  return data;
}
