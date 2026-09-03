import { useState, type FormEvent } from 'react'
import { httpClient } from '../../shared/api/httpClient'
import { tokenStorage } from '../../shared/api/tokenStorage'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface LoginResult {
  accessToken: string
  userId: number
  nickname: string
}

interface LoginFormProps {
  onSignupClick: () => void
  onLoginSuccess: () => void
}

function LoginForm({ onSignupClick, onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const emailError = submitted && !EMAIL_RE.test(email)
  const passwordError = submitted && password.length === 0

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
    setServerError(null)
    if (!EMAIL_RE.test(email) || password.length === 0) return

    setIsSubmitting(true)
    try {
      const response = await httpClient.post<LoginResult>('/api/v1/auth/login', {
        email,
        password,
      })
      tokenStorage.set(response.data.accessToken)
      onLoginSuccess()
    } catch (err) {
      const message = (err as { message?: string })?.message
      setServerError(message ?? '로그인에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
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

      {serverError && <p className="auth-error">{serverError}</p>}

      <div className="auth-actions">
        <button type="submit" className="auth-button auth-button--primary" disabled={isSubmitting}>
          {isSubmitting ? '로그인 중…' : '로그인'}
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
