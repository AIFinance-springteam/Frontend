import { useState, type FormEvent } from 'react'
import { httpClient } from '../../shared/api/httpClient'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

interface SignupFormProps {
  onBackClick: () => void
  onSignupSuccess: () => void
}

function SignupForm({ onBackClick, onSignupSuccess }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [nicknameTouched, setNicknameTouched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailServerError, setEmailServerError] = useState<string | null>(null)
  const [nicknameServerError, setNicknameServerError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const isEmailValid = EMAIL_RE.test(email)
  const isPasswordValid = PASSWORD_RE.test(password)
  const isNicknameValid = nickname.trim().length > 0
  const isFormValid = isEmailValid && isPasswordValid && isNicknameValid

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEmailTouched(true)
    setPasswordTouched(true)
    setNicknameTouched(true)
    setEmailServerError(null)
    setNicknameServerError(null)
    setServerError(null)
    if (!isFormValid) return

    setIsSubmitting(true)
    try {
      await httpClient.post('/api/v1/auth/signup', { email, password, nickname })
      onSignupSuccess()
    } catch (err) {
      const { code, message } = (err as { code?: string; message?: string }) ?? {}
      if (code === 'AUTH_EMAIL_DUPLICATE') {
        setEmailServerError(message ?? '이미 사용 중인 이메일입니다')
      } else if (code === 'AUTH_NICKNAME_DUPLICATE') {
        setNicknameServerError(message ?? '이미 사용 중인 닉네임입니다')
      } else {
        setServerError(message ?? '회원가입에 실패했습니다')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="auth-card auth-card--signup" onSubmit={handleSubmit} noValidate>
      <header className="auth-header">
        <button type="button" className="auth-back" onClick={onBackClick} aria-label="뒤로가기">
          ←
        </button>
        <h1 className="auth-title">회원가입</h1>
      </header>

      <div className="auth-body">
        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-email">
            이메일
          </label>
          <input
            id="signup-email"
            className={`auth-input${(emailTouched && !isEmailValid) || emailServerError ? ' auth-input--error' : ''}`}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailServerError(null)
            }}
            onBlur={() => setEmailTouched(true)}
            autoComplete="email"
          />
          {emailTouched && !isEmailValid && (
            <p className="auth-error">올바른 이메일 주소를 입력해주세요</p>
          )}
          {emailServerError && <p className="auth-error">{emailServerError}</p>}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-password">
            비밀번호
          </label>
          <input
            id="signup-password"
            className={`auth-input${passwordTouched && !isPasswordValid ? ' auth-input--error' : ''}`}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            autoComplete="new-password"
          />
          <p className="auth-hint">영문·숫자 포함 8자 이상</p>
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-nickname">
            닉네임
          </label>
          <input
            id="signup-nickname"
            className={`auth-input${(nicknameTouched && !isNicknameValid) || nicknameServerError ? ' auth-input--error' : ''}`}
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value)
              setNicknameServerError(null)
            }}
            onBlur={() => setNicknameTouched(true)}
            autoComplete="nickname"
          />
          {nicknameServerError && <p className="auth-error">{nicknameServerError}</p>}
        </div>
        {serverError && <p className="auth-error">{serverError}</p>}
      </div>

      <footer className="auth-footer">
        <button
          type="submit"
          className="auth-button auth-button--primary"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? '가입 중…' : '가입하기'}
        </button>
      </footer>
    </form>
  )
}

export default SignupForm
