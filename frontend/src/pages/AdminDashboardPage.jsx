export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Admin Dashboard</h2>
        <p className="mt-2 text-slate-400">
          Manage users, inventory, orders, and system settings from one secure console.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">User Management</h3>
          <p className="mt-2 text-slate-400">Create, update, and assign roles to store employees.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">System Settings</h3>
          <p className="mt-2 text-slate-400">Configure store preferences, tax rates, and security policies.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Reports</h3>
          <p className="mt-2 text-slate-400">View sales performance, stock status, and operational analytics.</p>
          <a
            href="/admin/reports"
            className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Open Reports
          </a>
        </div>
      </div>
    </div>
  )
}
