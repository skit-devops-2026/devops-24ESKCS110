import React from "react";
import { Plus, Search, Inbox, ArrowUpRight, X, Check } from "lucide-react";
export function PageHeader({ eyebrow, title, description, action, onAction }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <div className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-blue-600">
          {eyebrow || "Your workspace"}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
        >
          <Plus size={17} />
          {action}
        </button>
      )}
    </div>
  );
}
export function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-blue-300">
      <Search size={17} className="text-slate-400" />
      <input
        className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button onClick={() => onChange("")}>
          <X size={15} className="text-slate-400" />
        </button>
      )}
    </label>
  );
}
export function EmptyState({
  title = "Nothing here yet",
  description = "Add your first item to get started.",
}) {
  return (
    <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
        <Inbox size={22} />
      </div>
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
export function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}
export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50";
export function Badge({ children, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-600",
    purple: "bg-violet-50 text-violet-700",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${colors[color] || colors.blue}`}
    >
      {children}
    </span>
  );
}
export function Toast({ message, onClose }) {
  React.useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 2600);
    return () => clearTimeout(t);
  }, [message]);
  if (!message) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
      <Check size={17} className="text-emerald-400" />
      {message}
    </div>
  );
}
export function OutLink({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
    >
      Open resource <ArrowUpRight size={15} />
    </a>
  );
}
