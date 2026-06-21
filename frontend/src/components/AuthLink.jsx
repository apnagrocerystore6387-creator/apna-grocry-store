import { Link } from 'react-router-dom'

export default function AuthLink({ to, children }) {
  return (
    <p className="mt-4 text-sm text-slate-400">
      {children}
      {' '}
      <Link to={to} className="font-medium text-white hover:text-accent">
        {to.includes('register') ? 'Create an account' : 'Sign in'}
      </Link>
    </p>
  )
}
