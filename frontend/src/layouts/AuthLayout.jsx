import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="app-shell min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/30">
        <Outlet />
      </div>
    </div>
  )
}
