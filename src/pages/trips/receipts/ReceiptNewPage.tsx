import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { routePaths } from '../../../app/routes/routePaths'
import MobileScreen from '../../../components/layout/MobileScreen'
import '../../../components/layout/screen-kit.css'
import './receipt.css'

const STEPS = ['OCR 완료', '결제정보 추출 중', '상품 추출'] as const

function ReceiptNewPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const libraryInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<number>(-1)

  const isProcessing = step >= 0 && step < STEPS.length

  function startAnalysis() {
    if (isProcessing) return
    setStep(0)
    let current = 0
    const timer = window.setInterval(() => {
      current += 1
      setStep(current)
      if (current >= STEPS.length) {
        window.clearInterval(timer)
        window.setTimeout(() => {
          navigate(routePaths.receiptDetail(tripId ?? '', '12'))
        }, 400)
      }
    }, 700)
  }

  return (
    <div className="receipt-page">
      <MobileScreen title="영수증 등록" onBack={() => navigate(`/trips/${tripId}`)}>
        {step < 0 ? (
          <>
            <div className="capture-box">
              <div className="capture-box__icon">▢</div>
              <div className="capture-box__title">영수증을 촬영하세요</div>
              <div className="capture-box__hint">
                접힌 자국 없이 펴서 찍으면
                <br />
                인식이 잘 됩니다
              </div>
            </div>

            <button type="button" className="btn btn-primary" onClick={() => cameraInputRef.current?.click()}>
              카메라로 촬영
            </button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="file-input"
              onChange={startAnalysis}
            />

            <button type="button" className="btn btn-secondary" onClick={() => libraryInputRef.current?.click()}>
              사진 보관함에서 선택
            </button>
            <input
              ref={libraryInputRef}
              type="file"
              accept="image/*"
              className="file-input"
              onChange={startAnalysis}
            />

            <p style={{ fontSize: 9, color: '#8a8a8a', margin: 0 }}>
              지원 형식·용량·손상 이미지를 검증합니다
            </p>
          </>
        ) : (
          <div className="progress-card">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(100, (step / STEPS.length) * 100)}%` }}
              />
            </div>
            {STEPS.map((label, index) => (
              <div
                key={label}
                className={`progress-step ${index < step ? 'progress-step--done' : ''}`}
              >
                {index < step ? '✓' : '·'} {label}
              </div>
            ))}
            <div className="progress-hint">보통 5초 정도 걸립니다</div>
          </div>
        )}
      </MobileScreen>
    </div>
  )
}

export default ReceiptNewPage
