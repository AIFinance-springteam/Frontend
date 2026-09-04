import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { routePaths } from '../../../app/routes/routePaths'
import { Modal } from '../../../components/Modal'
import { getReceiptDetail } from '../../../features/receipt/services/receiptService'
import type { ReceiptDetail, ReceiptItem } from '../../../features/receipt/types/receipt'
import { getMember, getTrip, getTripMembers } from '../../../mocks/tripData'
import PayerChangeSheet from './PayerChangeSheet'
import './ReceiptDetailPage.css'

type Notice = { message: string; tone?: 'default' | 'danger' }

const won = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
  maximumFractionDigits: 0,
})

const dateTime = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
})

function formatDateTime(value: string) {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : dateTime.format(parsed)
}

function Icon({ name }: { name: 'arrow' | 'edit' | 'trash' | 'receipt' | 'plus' | 'check' }) {
  const paths = {
    arrow: <><path d="m15 18-6-6 6-6"/><path d="M9 12h10"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
    trash: <><path d="M3 6h18"/><path d="M8 6V4h8v2M19 6l-1 14H6L5 6"/></>,
    receipt: <><path d="M6 2h12v20l-3-2-3 2-3-2-3 2Z"/><path d="M9 7h6M9 11h6"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function ReceiptDetailPage() {
  const navigate = useNavigate()
  const { tripId = '', receiptId = '' } = useParams<{
    tripId: string
    receiptId: string
  }>()
  const [receipt, setReceipt] = useState<ReceiptDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [infoOpen, setInfoOpen] = useState(false)
  const [itemsOpen, setItemsOpen] = useState(false)
  const [payerSheetOpen, setPayerSheetOpen] = useState(false)
  const [draftInfo, setDraftInfo] = useState({ merchantName: '', paidAt: '', totalAmount: 0 })
  const [draftItems, setDraftItems] = useState<ReceiptItem[]>([])
  const [duplicateChoice, setDuplicateChoice] = useState<'keep' | 'cancel' | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)

  useEffect(() => {
    let active = true
    getReceiptDetail(tripId, receiptId)
      .then((data) => {
        if (active) setReceipt(data)
      })
      .catch(() => {
        if (active) setReceipt(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [tripId, receiptId])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 3000)
    return () => window.clearTimeout(timer)
  }, [notice])

  const itemTotal = useMemo(
    () => receipt?.items.reduce((sum, item) => sum + item.amount, 0) ?? 0,
    [receipt],
  )

  if (loading) return <div className="receipt-detail-page"><main className="state-page"><div className="loader"/><p>영수증을 불러오는 중입니다.</p></main></div>
  if (!receipt) return <div className="receipt-detail-page"><main className="state-page"><h1>영수증을 찾을 수 없어요.</h1><p>여행 홈에서 다시 확인해 주세요.</p></main></div>

  const openInfoEditor = () => {
    setDraftInfo({
      merchantName: receipt.merchantName,
      paidAt: receipt.paidAt,
      totalAmount: receipt.totalAmount,
    })
    setInfoOpen(true)
  }

  const saveInfo = (event: FormEvent) => {
    event.preventDefault()
    setReceipt({ ...receipt, ...draftInfo })
    setInfoOpen(false)
    setNotice({ message: '영수증 정보를 화면에 반영했습니다.' })
  }

  const openItemEditor = () => {
    setDraftItems(receipt.items.map((item) => ({ ...item })))
    setItemsOpen(true)
  }

  const updateDraftItem = (id: string, field: 'name' | 'quantity' | 'amount', value: string) => {
    setDraftItems((items) => items.map((item) => item.id === id
      ? { ...item, [field]: field === 'name' ? value : Math.max(0, Number(value)) }
      : item))
  }

  const addDraftItem = () => {
    const nextId = `draft-${Date.now()}`
    setDraftItems((items) => [
      ...items,
      { id: nextId, name: '', quantity: 1, amount: 0, confidence: 'HIGH' },
    ])
  }

  const saveItems = (event: FormEvent) => {
    event.preventDefault()
    if (draftItems.some((item) => !item.name.trim() || item.quantity < 1)) {
      setNotice({ message: '상품명과 1개 이상의 수량을 입력해 주세요.', tone: 'danger' })
      return
    }
    setReceipt({ ...receipt, items: draftItems })
    setItemsOpen(false)
    setNotice({ message: '상품 목록을 화면에 반영했습니다.' })
  }

  const temporaryAction = (message: string, tone: Notice['tone'] = 'default') => {
    setNotice({ message, tone })
  }

  const changePayer = (payerId: string) => {
    const payer = getMember(payerId)
    if (!payer) return

    setReceipt({ ...receipt, payerId, payerName: payer.name })
    setPayerSheetOpen(false)
    setNotice({ message: '결제자를 화면에 반영했습니다.' })
  }

  const totalMatches = receipt.items.length === 0 || itemTotal === receipt.totalAmount
  const trip = getTrip(receipt.tripId)
  const tripMembers = trip ? getTripMembers(trip) : []
  const analysisLabel = receipt.analysisStatus === 'SUCCESS'
    ? 'AI 분석 완료'
    : receipt.analysisStatus === 'PROCESSING'
      ? 'AI 분석 중'
      : 'AI 분석 실패'

  return (
    <div className="receipt-detail-page">
      <header className="topbar">
        <div className="title-group">
          <button className="back-link" type="button" onClick={() => navigate(routePaths.tripHome(tripId))}><Icon name="arrow"/>여행 홈</button>
          <div className="title-copy">
            <div className="merchant-line">
              <h1>{receipt.merchantName}</h1>
              <span className="status-badge"><span/><Icon name="check"/>{analysisLabel}</span>
            </div>
            <p>{formatDateTime(receipt.paidAt)} · {receipt.payerName}님 결제</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="button button-quiet" type="button" onClick={() => setPayerSheetOpen(true)}>
            결제자 변경
          </button>
          <button className="button button-danger" type="button" onClick={() => temporaryAction('삭제는 아직 서버에 반영되지 않습니다.', 'danger')}>
            <Icon name="trash"/>삭제
          </button>
          <button className="button button-primary" type="button" onClick={() => navigate(routePaths.receiptSplit(receiptId))}>
            비용 나누기 <span aria-hidden="true">→</span>
          </button>
        </div>
      </header>

      <main className="page-content">
        <section className="receipt-column" aria-labelledby="original-title">
          <div className="section-heading">
            <div><span className="eyebrow">Original</span><h2 id="original-title">원본 영수증</h2></div>
          </div>
          <div className="receipt-image">
            {receipt.imageUrl ? (
              <img src={receipt.imageUrl} alt={`${receipt.merchantName} 영수증 원본`} />
            ) : (
              <div className="image-placeholder"><span className="receipt-icon"><Icon name="receipt"/></span><strong>원본 이미지가 없어요</strong><p>이미지가 저장되지 않았습니다.</p></div>
            )}
          </div>
          <div className="summary-card">
            <div className="summary-title"><h2>결제 정보</h2><button className="text-button" type="button" onClick={openInfoEditor}><Icon name="edit"/>정보 수정</button></div>
            <dl>
              <div><dt>결제처</dt><dd>{receipt.merchantName}</dd></div>
              <div><dt>결제일시</dt><dd>{formatDateTime(receipt.paidAt)}</dd></div>
              <div className="amount-row"><dt>총액</dt><dd>{won.format(receipt.totalAmount)}</dd></div>
              <div><dt>등록·결제자</dt><dd>{receipt.payerName}</dd></div>
            </dl>
          </div>
        </section>

        <section className="analysis-column" aria-labelledby="items-title">
          <div className="section-heading items-heading">
            <div><span className="eyebrow">OCR Result</span><h2 id="items-title">인식된 상품 <em>{receipt.items.length}</em></h2></div>
            <button className="button button-outline" type="button" onClick={openItemEditor}><Icon name="edit"/>항목 추가·수정</button>
          </div>

          <div className="items-table" role="table" aria-label="OCR 인식 상품 목록">
            <div className="table-row table-head" role="row">
              <span role="columnheader">상품</span><span role="columnheader">수량</span><span role="columnheader">금액</span><span role="columnheader">신뢰도</span>
            </div>
            {receipt.items.map((item) => (
              <div className={`table-row ${item.confidence === 'LOW' ? 'low-confidence' : ''}`} role="row" key={item.id}>
                <div className="product-cell" role="cell"><strong>{item.name}</strong>{item.confidence === 'LOW' && <small>인식 불확실 — 확인 필요</small>}</div>
                <span role="cell">{item.quantity}개</span>
                <strong role="cell">{won.format(item.amount)}</strong>
                <span role="cell" className={`confidence ${item.confidence.toLowerCase()}`}>{item.confidence === 'LOW' ? '낮음' : '높음'}</span>
              </div>
            ))}
          </div>

          <section className={`validation-card ${totalMatches ? 'is-valid' : 'needs-check'}`}>
            <div className="validation-icon"><Icon name={totalMatches ? 'check' : 'receipt'}/></div>
            <div className="validation-copy"><div className="validation-title"><h3>총액 검증</h3><span>{totalMatches ? '일치' : '확인 필요'}</span></div>
              <p className="calculation">상품 합계 <strong>{won.format(itemTotal)}</strong> <b>{totalMatches ? '=' : '≠'}</b> 결제 총액 <strong>{won.format(receipt.totalAmount)}</strong></p>
              <p className="helper">{totalMatches ? '인식된 상품의 합계와 결제 총액이 일치합니다.' : '할인, 쿠폰, 배달비 등으로 상품 합계와 결제 총액이 다를 수 있습니다. 확인이 필요합니다.'}</p>
            </div>
          </section>

          <section className="discount-row"><div><h3>할인·쿠폰 반영</h3><p>할인은 별도 항목으로 나누지 않고 최종 총액에 반영됩니다.</p></div><span>해당 없음</span></section>

          {receipt.duplicateStatus !== 'CLEAR' && <section className="duplicate-card">
            <div className="duplicate-content"><span className="duplicate-mark">?</span><div><h3>중복 영수증이 의심돼요</h3><p>비슷한 시간과 금액의 영수증이 있습니다. 자동으로 삭제하지 않으니 등록 여부를 선택해 주세요.</p></div></div>
            <div className="duplicate-actions">
              <button className={`button ${duplicateChoice === 'keep' ? 'button-primary' : 'button-outline'}`} type="button" onClick={() => { setDuplicateChoice('keep'); temporaryAction('계속 등록을 선택했습니다. 서버에는 저장되지 않습니다.') }}>계속 등록</button>
              <button className={`button ${duplicateChoice === 'cancel' ? 'button-cancel-active' : 'button-quiet'}`} type="button" onClick={() => { setDuplicateChoice('cancel'); temporaryAction('등록 취소를 선택했습니다. 서버에는 반영되지 않습니다.', 'danger') }}>등록 취소</button>
            </div>
          </section>}
        </section>
      </main>

      <Modal isOpen={infoOpen} title="결제 정보 수정" description="변경 내용은 현재 화면에만 반영됩니다." onClose={() => setInfoOpen(false)}>
        <form onSubmit={saveInfo}>
          <div className="form-grid">
            <label><span>가맹점명</span><input required value={draftInfo.merchantName} onChange={(e) => setDraftInfo({ ...draftInfo, merchantName: e.target.value })}/></label>
            <label><span>결제일시</span><input required value={draftInfo.paidAt} onChange={(e) => setDraftInfo({ ...draftInfo, paidAt: e.target.value })}/></label>
            <label><span>총액</span><div className="input-with-unit"><input required min="0" type="number" value={draftInfo.totalAmount} onChange={(e) => setDraftInfo({ ...draftInfo, totalAmount: Number(e.target.value) })}/><span>원</span></div></label>
          </div>
          <div className="modal-actions"><button className="button button-quiet" type="button" onClick={() => setInfoOpen(false)}>취소</button><button className="button button-primary" type="submit">변경 내용 적용</button></div>
        </form>
      </Modal>

      <Modal isOpen={itemsOpen} title="상품 항목 수정" description="상품명, 수량과 상품별 금액을 확인해 주세요." onClose={() => setItemsOpen(false)}>
        <form onSubmit={saveItems}>
          <div className="item-editor-head"><span>상품명</span><span>수량</span><span>금액</span></div>
          <div className="item-editor-list">
            {draftItems.map((item) => (
              <div className="item-editor-row" key={item.id}>
                <label><span className="sr-only">상품명</span><input required placeholder="상품명" value={item.name} onChange={(e) => updateDraftItem(item.id, 'name', e.target.value)}/></label>
                <label><span className="sr-only">수량</span><input required min="1" type="number" value={item.quantity} onChange={(e) => updateDraftItem(item.id, 'quantity', e.target.value)}/></label>
                <label><span className="sr-only">금액</span><div className="input-with-unit"><input required min="0" type="number" value={item.amount} onChange={(e) => updateDraftItem(item.id, 'amount', e.target.value)}/><span>원</span></div></label>
              </div>
            ))}
          </div>
          <button className="add-item-button" type="button" onClick={addDraftItem}><Icon name="plus"/>새 항목 추가</button>
          <div className="modal-actions"><button className="button button-quiet" type="button" onClick={() => setItemsOpen(false)}>취소</button><button className="button button-primary" type="submit">목록에 적용</button></div>
        </form>
      </Modal>

      {payerSheetOpen && tripMembers.length > 0 && (
        <PayerChangeSheet
          members={tripMembers}
          currentPayerId={receipt.payerId}
          onSelect={changePayer}
          onClose={() => setPayerSheetOpen(false)}
        />
      )}

      {notice && <div className={`toast ${notice.tone === 'danger' ? 'toast-danger' : ''}`} role="status">{notice.message}</div>}
    </div>
  )
}

export default ReceiptDetailPage
