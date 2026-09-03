import { useState, type FormEvent } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
const TAKEN_NICKNAMES = ['승준', 'admin', 'test', 'user']

interface SignupFormProps {
  onBackClick: () => void
}

function SignupForm({ onBackClick }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [nicknameTouched, setNicknameTouched] = useState(false)

  const isEmailValid = EMAIL_RE.test(email)
  const isPasswordValid = PASSWORD_RE.test(password)
  const isNicknameTaken = TAKEN_NICKNAMES.includes(nickname.trim().toLowerCase())
  const isNicknameValid = nickname.trim().length > 0 && !isNicknameTaken
  const isFormValid = isEmailValid && isPasswordValid && isNicknameValid

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEmailTouched(true)
    setPasswordTouched(true)
    setNicknameTouched(true)
    if (!isFormValid) return
    // TODO: 회원가입 API 연동
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
            className={`auth-input${emailTouched && !isEmailValid ? ' auth-input--error' : ''}`}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            autoComplete="email"
          />
          {emailTouched && !isEmailValid && (
            <p className="auth-error">올바른 이메일 주소를 입력해주세요</p>
          )}
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
            className={`auth-input${nicknameTouched && !isNicknameValid ? ' auth-input--error' : ''}`}
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onBlur={() => setNicknameTouched(true)}
            autoComplete="nickname"
          />
          {nicknameTouched && isNicknameTaken && (
            <p className="auth-error">이미 사용 중인 닉네임입니다</p>
          )}
        </div>
      </div>

      <footer className="auth-footer">
        <button type="submit" className="auth-button auth-button--primary" disabled={!isFormValid}>
          가입하기
        </button>
      </footer>
    </form>
  )
}

export default SignupForm
