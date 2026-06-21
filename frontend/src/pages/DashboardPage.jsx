export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
        <p className="mt-2 text-slate-400">Manage products, orders, and store operations from one place.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Sales Overview</h3>
          <p className="mt-2 text-slate-400">Track your revenue, inventory movement, and store health.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Stock Alerts</h3>
          <p className="mt-2 text-slate-400">Get notified when inventory levels are low or orders are pending.</p>
        </div>
      </div>
    </div>
  )
}
