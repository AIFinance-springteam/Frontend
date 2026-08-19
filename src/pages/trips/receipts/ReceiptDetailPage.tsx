import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MobileScreen from '../../../components/layout/MobileScreen'
import PayerChangeSheet from './PayerChangeSheet'
import '../../../components/layout/screen-kit.css'
import './receipt.css'
import { formatWon, getMember, getReceipt, getTrip, getTripMembers } from '../../../mocks/tripData'

function ReceiptDetailPage() {
  const { tripId, receiptId } = useParams<{ tripId: string; receiptId: string }>()
  const navigate = useNavigate()
  const trip = tripId ? getTrip(tripId) : undefined
  const receipt = receiptId ? getReceipt(receiptId) : undefined

  const [payerId, setPayerId] = useState(receipt?.payerId ?? '')
  const [isPayerSheetOpen, setPayerSheetOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [merchant, setMerchant] = useState(receipt?.merchant ?? '')
  const [paidAt, setPaidAt] = useState(receipt?.paidAt ?? '')
  const [totalAmount, setTotalAmount] = useState(receipt?.totalAmount ?? 0)

  if (!trip || !receipt) {
    return (
      <div className="receipt-page">
        <p>영수증을 찾을 수 없습니다.</p>
      </div>
    )
  }

  const tripMembers = getTripMembers(trip)
  const payer = getMember(payerId)
  const itemsSum = receipt.items.reduce((sum, item) => sum + item.amount, 0)
  const isMatched = receipt.items.length === 0 || itemsSum === totalAmount

  return (
    <div className="receipt-page">
      <MobileScreen
        title="영수증 확인"
        onBack={() => navigate(`/trips/${trip.id}`)}
        headerRight={<span>⋯</span>}
        footer={
          <button type="button" className="btn btn-primary" onClick={() => navigate(`/trips/${trip.id}`)}>
            비용 나누기로 →
          </button>
        }
      >
        <div className="field-card">
          <div className="field-row">
            <span className="field-row__label">결제처</span>
            {isEditing ? (
              <input
                value={merchant}
                onChange={(event) => setMerchant(event.target.value)}
                style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', border: '1px solid #c9c9c9', borderRadius: 6, padding: '4px 8px' }}
              />
            ) : (
              <span className="field-row__value">{merchant}</span>
            )}
          </div>
          <div className="field-row">
            <span className="field-row__label">결제일시</span>
            {isEditing ? (
              <input
                value={paidAt}
                onChange={(event) => setPaidAt(event.target.value)}
                style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', border: '1px solid #c9c9c9', borderRadius: 6, padding: '4px 8px' }}
              />
            ) : (
              <span className="field-row__value">{paidAt}</span>
            )}
          </div>
          <div className="field-row">
            <span className="field-row__label">총액</span>
            {isEditing ? (
              <input
                type="number"
                value={totalAmount}
                onChange={(event) => setTotalAmount(Number(event.target.value))}
                style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', border: '1px solid #c9c9c9', borderRadius: 6, padding: '4px 8px', width: 100 }}
              />
            ) : (
              <span className="field-row__value tabular-nums">{formatWon(totalAmount)}</span>
            )}
          </div>
          <div className="field-row">
            <span className="field-row__label">결제자</span>
            <div className="field-row__value-group">
              <span className="field-row__value">{payer?.name}</span>
              <button type="button" className="chip-btn" onClick={() => setPayerSheetOpen(true)}>
                변경
              </button>
            </div>
          </div>
          <div className="field-row">
            <button type="button" className="link-btn" onClick={() => setIsEditing((prev) => !prev)}>
              {isEditing ? '수정 완료' : '정보 수정'} · 등록자만
            </button>
          </div>
        </div>

        <div className="field-card">
          <div className="field-row">
            <span className="field-row__label">할인·쿠폰</span>
            <button type="button" className="chip-btn">
              추가
            </button>
          </div>
          <div className="field-row">
            <span style={{ fontSize: 10, color: '#8a8a8a' }}>
              할인은 항목별로 나누지 않고 총액에 반영
            </span>
          </div>
        </div>

        {receipt.items.length > 0 && (
          <div>
            <div className="section-label" style={{ marginBottom: 8 }}>
              인식 상품 {receipt.items.length}건
            </div>
            <div className="item-list">
              {receipt.items.map((item) => (
                <div key={item.id} className={`item-row ${item.uncertain ? 'item-row--uncertain' : ''}`}>
                  <div>
                    <div className="item-row__name">{item.name}</div>
                    {item.uncertain && <div className="item-row__uncertain-tag">인식 불확실</div>}
                  </div>
                  <div className="item-row__right">
                    <span className="item-row__qty">{item.quantity}개</span>
                    <span className="item-row__amount tabular-nums">{formatWon(item.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {receipt.items.length > 0 && (
          <div className="check-card">
            <div>
              <div className="check-card__title">총금액 검산</div>
              <div className="check-card__hint">
                차이는 할인·배달비 때문일 수 있어 오류로 단정하지 않습니다
              </div>
            </div>
            <span className="match-pill">{isMatched ? '일치' : '차이 있음'}</span>
          </div>
        )}
      </MobileScreen>

      {isPayerSheetOpen && (
        <PayerChangeSheet
          members={tripMembers}
          currentPayerId={payerId}
          onSelect={(id) => {
            setPayerId(id)
            setPayerSheetOpen(false)
          }}
          onClose={() => setPayerSheetOpen(false)}
        />
      )}
    </div>
  )
}

export default ReceiptDetailPage
