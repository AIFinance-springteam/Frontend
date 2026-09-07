import { useEffect, useState } from "react";
import type { Participant } from "../../../shared/types/participant";
import { formatDateRange } from "../../../shared/utils/formatDate";
import * as tripApi from "../api/tripApi";
import { getCurrentUser } from "../../auth/api/authApi";

export function useTripInfo(tripId: string) {
  const [tripName, setTripName] = useState("");
  const [dateRangeLabel, setDateRangeLabel] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [tripStatus, setTripStatus] = useState<"ACTIVE" | "SETTLING" | "COMPLETED">("ACTIVE");

  useEffect(() => {
    Promise.all([tripApi.getTripDetail(tripId), getCurrentUser()]).then(([trip, currentUser]) => {
      setTripName(trip.name);
      setDateRangeLabel(formatDateRange(trip.startDate, trip.endDate));
      setTripStatus(trip.status);
      setIsOwner(trip.ownerId === currentUser.userId);
    });
    tripApi.getMembers(tripId).then((members) => {
      setParticipants(
        members.map((member) => ({
          id: String(member.userId),
          name: member.nickname,
          avatar: member.nickname.charAt(0),
        })),
      );
    });
  }, [tripId]);

  return { tripName, dateRangeLabel, participants, isOwner, tripStatus };
}
