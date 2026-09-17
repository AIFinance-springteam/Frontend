import { httpClient } from '../../../shared/api/httpClient'
import type { TripReport } from '../types/report'

export const getTripReport = async (tripId: string): Promise<TripReport> => {
  const { data } = await httpClient.get<TripReport>(
    `/api/v1/trips/${encodeURIComponent(tripId)}/report`,
  )
  return data
}
