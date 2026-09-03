import { useNavigate } from 'react-router-dom'
import LoginForm from './LoginForm'
import './auth.css'

function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4">
      <LoginForm
        onSignupClick={() => navigate('/signup')}
        onLoginSuccess={() => navigate('/trips')}
      />
    </div>
  )
}

export default LoginPage
