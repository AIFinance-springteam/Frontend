import { useNavigate, useParams } from 'react-router-dom'
import MobileScreen from '../../components/layout/MobileScreen'
import '../../components/layout/screen-kit.css'
import './trip.css'
import { getTripMembers, trips } from '../../mocks/tripData'

function InvitedTripPage() {
  const { inviteCode } = useParams<{ inviteCode: string }>()
  const navigate = useNavigate()
  const trip = trips[0]
  const tripMembers = getTripMembers(trip)
  const inviterName = tripMembers[0]?.name ?? '초대자'

  return (
    <div className="trip-page">
      <MobileScreen
        title="초대받은 여행"
        onBack={() => navigate('/trips')}
        footer={
          <button type="button" className="btn btn-primary" onClick={() => navigate(`/trips/${trip.id}`)}>
            참여하기
          </button>
        }
      >
        <div
          style={{
            background: '#ededed',
            border: '1px solid #c9c9c9',
            borderRadius: 8,
            padding: '24px 16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{trip.name}</div>
          <div style={{ fontSize: 12, color: '#8a8a8a', marginTop: 8 }}>
            {trip.startDate} – {trip.endDate} · {tripMembers[0]?.name} 외 {tripMembers.length - 1}명
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 16 }}>
            {tripMembers.slice(0, 3).map((member) => (
              <span key={member.id} className="avatar">
                {member.initial}
              </span>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 11, color: '#8a8a8a', textAlign: 'center', margin: 0 }}>
          {inviterName}님이 이 여행에 초대했습니다
        </p>

        {inviteCode && (
          <p style={{ fontSize: 9, color: '#c9c9c9', textAlign: 'center', margin: 0 }}>
            초대 코드: {inviteCode}
          </p>
        )}
      </MobileScreen>
    </div>
  )
}

export default InvitedTripPage
