import { Outlet } from 'react-router-dom'

function AppLayout() {
  return (
    <div className="min-h-svh w-full bg-bg">
      <div className="mx-auto min-h-svh w-full max-w-[400px] bg-bg">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout
