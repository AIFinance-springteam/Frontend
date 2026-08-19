import type { ReactNode } from 'react'
import './mobile-screen.css'

interface MobileScreenProps {
  title: string
  onBack?: () => void
  headerRight?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

function MobileScreen({ title, onBack, headerRight, children, footer }: MobileScreenProps) {
  return (
    <div className="mobile-screen">
      <header className="mobile-screen__header">
        {onBack && (
          <button
            type="button"
            className="mobile-screen__back"
            onClick={onBack}
            aria-label="뒤로가기"
          >
            ←
          </button>
        )}
        <h1 className="mobile-screen__title">{title}</h1>
        {headerRight && <div className="mobile-screen__header-right">{headerRight}</div>}
      </header>
      <div className="mobile-screen__body">{children}</div>
      {footer && <footer className="mobile-screen__footer">{footer}</footer>}
    </div>
  )
}

export default MobileScreen
