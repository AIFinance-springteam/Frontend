import { useNavigate } from 'react-router-dom'
import './trip.css'
import { trips } from '../../mocks/tripData'

function TripsPage() {
  const navigate = useNavigate()

  return (
    <div className="trip-page">
      <h1 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>
        내 여행
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {trips.map((trip) => (
          <button
            key={trip.id}
            type="button"
            className="trip-card"
            onClick={() => navigate(`/trips/${trip.id}`)}
          >
            <div className="trip-card__name">{trip.name}</div>
            <div className="trip-card__dates">
              {trip.startDate} – {trip.endDate}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TripsPage
