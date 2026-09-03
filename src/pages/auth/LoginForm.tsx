import { useState, type FormEvent } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface LoginFormProps {
  onSignupClick: () => void
}

function LoginForm({ onSignupClick }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const emailError = submitted && !EMAIL_RE.test(email)
  const passwordError = submitted && password.length === 0

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
    if (!EMAIL_RE.test(email) || password.length === 0) return
    // TODO: 로그인 API 연동
  }

  return (
    <form className="auth-card auth-card--login" onSubmit={handleSubmit} noValidate>
      <div className="auth-logo">로고 · 서비스명 미정</div>
      <p className="auth-tagline">
        각자 결제해도
        <br />
        영수증만 모으면 한 번에 정산됩니다
      </p>

      <div className="auth-field">
        <label className="auth-label" htmlFor="login-email">
          이메일
        </label>
        <input
          id="login-email"
          className={`auth-input${emailError ? ' auth-input--error' : ''}`}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        {emailError && <p className="auth-error">올바른 이메일 주소를 입력해주세요</p>}
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="login-password">
          비밀번호
        </label>
        <input
          id="login-password"
          className={`auth-input${passwordError ? ' auth-input--error' : ''}`}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {passwordError && <p className="auth-error">비밀번호를 입력해주세요</p>}
      </div>

      <div className="auth-actions">
        <button type="submit" className="auth-button auth-button--primary">
          로그인
        </button>
        <button
          type="button"
          className="auth-button auth-button--secondary"
          onClick={onSignupClick}
        >
          회원가입
        </button>
      </div>

      <p className="auth-helper">이메일·닉네임 중복, 비밀번호 형식을 검증합니다</p>
    </form>
  )
}

export default LoginForm
