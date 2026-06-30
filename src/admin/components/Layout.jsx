import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin/dashboard",     icon: "📊", label: "Dashboard",        roles: ["admin", "operator"] },
  { to: "/admin/buyurtmalar",   icon: "📋", label: "Buyurtmalar",      roles: ["admin", "operator"] },
  { to: "/admin/mijozlar",      icon: "👥", label: "Mijozlar",         roles: ["admin", "operator"] },
  { to: "/admin/ombor",         icon: "🏭", label: "Omborxona",        roles: ["admin"] },
  { to: "/admin/davomat",       icon: "🕐", label: "Davomat",          roles: ["admin", "ishchi"] },
  { to: "/admin/davomat/admin", icon: "📈", label: "Davomat hisobot",  roles: ["admin"] },
];

export default function Layout({ session, onLogout }) {
  const [open, setOpen] = useState(false);

  const visibleLinks = links.filter((l) => l.roles.includes(session?.role));

  return (
    <div className="flex min-h-screen" style={{ background: "#0f1117" }}>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300
          md:translate-x-0 md:sticky md:top-0 md:h-screen
          ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          width: "220px",
          minWidth: "220px",
          background: "#1a1f2e",
          borderRight: "1px solid #2d3748",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid #2d3748" }}>
          <div>
            <div className="text-base font-semibold" style={{ color: "#a80000" }}>Combo St★r</div>
            <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>CRM tizimi</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-sm md:hidden"
            style={{ color: "#64748b", background: "#0f1117" }}
          >✕</button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/admin/davomat"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "text-white font-medium"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                }`
              }
              style={({ isActive }) => isActive ? { background: "#a80000" } : {}}
            >
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer — user info + logout */}
        <div className="px-3 py-4" style={{ borderTop: "1px solid #2d3748" }}>
          <div className="flex items-center gap-2 px-2 mb-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "#a80000", color: "#fff" }}>
              {session?.name?.[0] || "U"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: "#e2e8f0" }}>{session?.name}</div>
              <div className="text-xs truncate" style={{ color: "#64748b" }}>{session?.role}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full text-xs py-2 rounded-lg text-left px-3"
            style={{ background: "#0f1117", border: "1px solid #2d3748", color: "#64748b" }}
          >
            🚪 Chiqish
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar */}
        <header
          className="flex items-center gap-3 px-4 py-3 sticky top-0 z-20 md:hidden"
          style={{ background: "#1a1f2e", borderBottom: "1px solid #2d3748" }}
        >
          <button
            onClick={() => setOpen(true)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-lg"
            style={{ background: "#0f1117", border: "1px solid #2d3748" }}
            aria-label="Menyu"
          >
            <span style={{ width: "16px", height: "1.5px", background: "#e2e8f0", borderRadius: "2px" }} />
            <span style={{ width: "16px", height: "1.5px", background: "#e2e8f0", borderRadius: "2px" }} />
            <span style={{ width: "16px", height: "1.5px", background: "#e2e8f0", borderRadius: "2px" }} />
          </button>
          <span className="font-semibold text-sm" style={{ color: "#a80000" }}>Combo St★r CRM</span>
        </header>

        {/* Page */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}