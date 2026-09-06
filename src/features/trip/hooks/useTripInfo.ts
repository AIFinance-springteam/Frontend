import { useEffect, useState } from "react";
import type { Participant } from "../../../shared/types/participant";
import { formatDateRange } from "../../../shared/utils/formatDate";
import * as tripApi from "../api/tripApi";

export function useTripInfo(tripId: string) {
  const [tripName, setTripName] = useState("");
  const [dateRangeLabel, setDateRangeLabel] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    tripApi.getTripDetail(tripId).then((trip) => {
      setTripName(trip.name);
      setDateRangeLabel(formatDateRange(trip.startDate, trip.endDate));
    });
    tripApi.getMembers(tripId).then((members) => {
      setParticipants(
        members.map((member) => ({
          id: String(member.tripMemberId),
          name: member.nickname,
          avatar: member.nickname.charAt(0),
        })),
      );
    });
  }, [tripId]);

  return { tripName, dateRangeLabel, participants };
}
