import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { clearSession, getStoredUser } from "../api";
import {
  BookOpen,
  LayoutDashboard,
  NotebookPen,
  Code2,
  Bookmark,
  Bug,
  FolderKanban,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Command,
} from "lucide-react";
const links = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Notes", "/notes", NotebookPen],
  ["Code Snippets", "/snippets", Code2],
  ["Resources", "/resources", Bookmark],
  ["Bug Journal", "/bugs", Bug],
  ["Projects", "/projects", FolderKanban],
  ["Global Search", "/search", Search],
];
export default function Layout({ children }) {
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const user = getStoredUser() || { name: "Developer", email: "" };
  const side = (
    <>
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
          <BookOpen size={21} />
        </div>
        <div>
          <div className="text-lg font-bold tracking-tight">
            DevVault<span className="text-blue-600">.</span>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[.18em] text-slate-400">
            Developer second brain
          </div>
        </div>
      </div>
      <div className="px-4 pb-3 pt-2 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">
        Workspace
      </div>
      <nav className="space-y-1 px-3">
        {links.map(([label, to, Icon]) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobile(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? "nav-active" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mx-5 my-5 border-t border-slate-100" />
      <NavLink
        to="/settings"
        onClick={() => setMobile(false)}
        className={({ isActive }) =>
          `mx-3 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${isActive ? "nav-active" : "text-slate-500 hover:bg-slate-100"}`
        }
      >
        <Settings size={18} />
        Settings
      </NavLink>
      <div className="mt-auto p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 font-bold text-blue-700">
            {user.name?.[0]?.toUpperCase() || "D"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">
              {user.name || "Developer"}
            </div>
            <div className="truncate text-xs text-slate-400">
              Personal workspace
            </div>
          </div>
          <button
            title="Log out"
            onClick={() => {
              clearSession();
              navigate("/login", { replace: true });
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-red-500"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </>
  );
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-slate-200/70 bg-white/90 lg:flex">
        {side}
      </aside>
      {mobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
          onClick={() => setMobile(false)}
        >
          <aside
            className="flex h-full w-[280px] flex-col bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {side}
            <button
              onClick={() => setMobile(false)}
              className="absolute left-[230px] top-5 rounded-lg p-2"
            >
              <X />
            </button>
          </aside>
        </div>
      )}
      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center gap-4 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl sm:px-8">
          <button
            onClick={() => setMobile(true)}
            className="rounded-xl border border-slate-200 p-2 lg:hidden"
          >
            <Menu size={19} />
          </button>
          <div className="hidden items-center gap-2 text-sm text-slate-400 sm:flex">
            <span>Workspace</span>
            <span>/</span>
            <span className="font-semibold text-slate-700">
              {links.find((x) => x[1] === location.pathname)?.[0] || "Settings"}
            </span>
          </div>
          <form
            className="ml-auto flex w-full max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-blue-300 focus-within:bg-white"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/search?q=" + encodeURIComponent(query));
            }}
          >
            <Search size={17} className="text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your second brain..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400 sm:block">
              <Command size={10} />
            </kbd>
          </form>
          <Link
            to="/notes"
            className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 sm:flex"
          >
            <Plus size={16} /> New note
          </Link>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
