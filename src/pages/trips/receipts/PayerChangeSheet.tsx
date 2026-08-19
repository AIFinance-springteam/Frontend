import type { Member } from '../../../mocks/tripData'
import '../../../components/layout/screen-kit.css'
import './receipt.css'

interface PayerChangeSheetProps {
  members: Member[]
  currentPayerId: string
  onSelect: (memberId: string) => void
  onClose: () => void
}

function PayerChangeSheet({ members, currentPayerId, onSelect, onClose }: PayerChangeSheetProps) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(event) => event.stopPropagation()}>
        <div className="sheet__handle" />
        <h2 className="sheet__title">실제 결제자 선택</h2>
        <div className="sheet-list">
          {members.map((member) => {
            const isCurrent = member.id === currentPayerId
            return (
              <div key={member.id} className={`sheet-row ${isCurrent ? 'sheet-row--current' : ''}`}>
                <div className="sheet-row__left">
                  <span className="avatar">{member.initial}</span>
                  <span className="sheet-row__name">{member.name}</span>
                </div>
                {isCurrent ? (
                  <span className="pill">✓ 현재</span>
                ) : (
                  <button type="button" className="chip-btn" onClick={() => onSelect(member.id)}>
                    선택
                  </button>
                )}
              </div>
            )
          })}
        </div>
        <p className="sheet__hint">여행방에 없는 사람은 선택할 수 없습니다</p>
      </div>
    </div>
  )
}

export default PayerChangeSheet
