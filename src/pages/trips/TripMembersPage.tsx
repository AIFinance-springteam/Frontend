import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MobileScreen from '../../components/layout/MobileScreen'
import '../../components/layout/screen-kit.css'
import './trip.css'
import { getTrip, getTripMembers } from '../../mocks/tripData'

function TripMembersPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const trip = tripId ? getTrip(tripId) : undefined
  const [leaving, setLeaving] = useState(false)

  if (!trip) {
    return (
      <div className="trip-page">
        <p>여행을 찾을 수 없습니다.</p>
      </div>
    )
  }

  const tripMembers = getTripMembers(trip)

  function handleLeave() {
    if (!leaving) {
      setLeaving(true)
      return
    }
    navigate('/trips')
  }

  return (
    <div className="trip-page">
      <MobileScreen title="참여자" onBack={() => navigate(`/trips/${trip.id}`)}>
        <div>
          {tripMembers.map((member) => (
            <div key={member.id} className="member-row">
              <div className="member-row__left">
                <span className="avatar">{member.initial}</span>
                <span className="member-row__name">{member.name}</span>
              </div>
              <span className={member.isOwner ? 'pill' : 'pill pill--outline'}>
                {member.isOwner ? '방장' : '참여자'}
              </span>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: '#c9c9c9' }} />

        <button type="button" className="btn btn-danger" onClick={handleLeave}>
          {leaving ? '정말 나가시겠어요? 다시 눌러 확인' : '여행방 나가기'}
        </button>
        <p style={{ fontSize: 9, color: '#8a8a8a', lineHeight: 1.5, margin: 0 }}>
          이미 참여한 정산 내역은 유지됩니다. 이후 신규 항목 부담자에서만 제외됩니다.
        </p>
      </MobileScreen>
    </div>
  )
}

export default TripMembersPage
