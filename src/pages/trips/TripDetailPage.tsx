import { useNavigate, useParams } from 'react-router-dom'
import MobileScreen from '../../components/layout/MobileScreen'
import '../../components/layout/screen-kit.css'
import './trip.css'
import {
  formatWon,
  getMember,
  getReceiptsByTrip,
  getTrip,
  getTripMembers,
} from '../../mocks/tripData'

function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const trip = tripId ? getTrip(tripId) : undefined

  if (!trip) {
    return (
      <div className="trip-page">
        <p className="text-muted">여행을 찾을 수 없습니다.</p>
      </div>
    )
  }

  const tripMembers = getTripMembers(trip)
  const tripReceipts = getReceiptsByTrip(trip.id)
  const balance = trip.myPaidAmount - trip.myShareAmount
  const isReceiving = balance >= 0

  return (
    <div className="trip-page">
      <MobileScreen
        title={trip.name}
        onBack={() => navigate('/trips')}
        headerRight={<span>⋯</span>}
        footer={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate(`/trips/${trip.id}/receipts/new`)}
          >
            영수증 등록하기
          </button>
        }
      >
        <button
          type="button"
          className="trip-meta"
          onClick={() => navigate(`/trips/${trip.id}/members`)}
        >
          <span className="trip-meta__avatars">
            {tripMembers.map((member) => (
              <span key={member.id} className="avatar">
                {member.initial}
              </span>
            ))}
          </span>
          <span className="trip-meta__dates">
            {trip.startDate} – {trip.endDate}
          </span>
        </button>

        <div className="balance-card">
          <div className="balance-card__label">내 예상 정산 차액</div>
          <div
            className={`balance-card__amount tabular-nums ${isReceiving ? 'text-positive' : 'text-negative'}`}
          >
            {isReceiving ? '+' : '-'}
            {formatWon(Math.abs(balance))}
          </div>
          <div className="balance-card__hint">
            {isReceiving ? '받을 예정입니다' : '보낼 예정입니다'}
          </div>
          <div className="balance-card__divider" />
          <div className="balance-card__row">
            <span>내 결제액</span>
            <span className="balance-card__row-value tabular-nums">
              {formatWon(trip.myPaidAmount)}
            </span>
          </div>
          <div className="balance-card__row">
            <span>내 부담액</span>
            <span className="balance-card__row-value tabular-nums">
              {formatWon(trip.myShareAmount)}
            </span>
          </div>
        </div>

        <div className="total-row">
          <span className="total-row__label">총 여행비</span>
          <span className="total-row__value tabular-nums">{formatWon(trip.totalAmount)}</span>
        </div>

        {(trip.unassignedReceiptCount > 0 || trip.duplicateSuspectCount > 0) && (
          <div className="alert-card">
            <div className="alert-card__title">처리가 필요합니다</div>
            {trip.unassignedReceiptCount > 0 && (
              <div className="alert-card__row">
                <span className="alert-card__row-label">부담자 미지정</span>
                <span className="alert-card__row-count">{trip.unassignedReceiptCount}건 ›</span>
              </div>
            )}
            {trip.duplicateSuspectCount > 0 && (
              <div className="alert-card__row">
                <span className="alert-card__row-label">중복 의심</span>
                <span className="alert-card__row-count">{trip.duplicateSuspectCount}건 ›</span>
              </div>
            )}
          </div>
        )}

        <div>
          <div className="section-label">영수증 {tripReceipts.length}건</div>
          <div className="receipt-list" style={{ marginTop: 8 }}>
            {tripReceipts.map((receipt) => {
              const payer = getMember(receipt.payerId)
              return (
                <button
                  key={receipt.id}
                  type="button"
                  className="receipt-row"
                  onClick={() => navigate(`/trips/${trip.id}/receipts/${receipt.id}`)}
                >
                  <span>
                    <span className="receipt-row__merchant">{receipt.merchant}</span>
                    <div className="receipt-row__sub">
                      {payer?.name} · {receipt.paidAt}
                    </div>
                  </span>
                  <span className="receipt-row__right">
                    <span className="receipt-row__amount tabular-nums">
                      {formatWon(receipt.totalAmount)}
                    </span>
                    <span className={`status-pill ${receipt.assigned ? 'status-pill--done' : ''}`}>
                      {receipt.assigned ? '완료' : '미지정 1'}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </MobileScreen>
    </div>
  )
}

export default TripDetailPage
