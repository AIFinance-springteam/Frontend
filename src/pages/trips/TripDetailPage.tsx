import { useParams } from 'react-router-dom'

function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>()
  return <div className="p-4 text-ink">TripDetailPage: {tripId}</div>
}

export default TripDetailPage
