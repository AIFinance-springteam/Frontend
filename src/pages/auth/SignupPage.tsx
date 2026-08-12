import { useNavigate } from 'react-router-dom'
import SignupForm from './SignupForm'
import './auth.css'

function SignupPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4">
      <SignupForm onBackClick={() => navigate('/login')} />
    </div>
  )
}

export default SignupPage
