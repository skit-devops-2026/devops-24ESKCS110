import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  NotebookPen, Code2, Bookmark, Bug, FolderKanban, ArrowUpRight,
  Clock3, Trash2, Edit3, Activity, Plus, Search, Save, AlertCircle,
  RefreshCw, CheckCircle2,
} from "lucide-react";
import { apiRequest, getStoredUser, itemApi } from "../api";
import {
  PageHeader, SearchBox, EmptyState, Modal, Field, inputClass,
  Badge, Toast, OutLink,
} from "../components/UI";

const kinds = ["notes", "snippets", "resources", "bugs", "projects"];
const configs = {
  notes: { title: "Notes", eyebrow: "Knowledge library", description: "Capture concepts, learning notes, and the things you want to remember.", icon: NotebookPen, action: "New note", fields: [["title", "Title", "text", true], ["category", "Category", "text"], ["content", "Content", "textarea", true], ["tags", "Tags (comma separated)", "text"]] },
  snippets: { title: "Code Snippets", eyebrow: "Reusable code", description: "Keep useful patterns and copy-ready code close at hand.", icon: Code2, action: "New snippet", fields: [["title", "Title", "text", true], ["language", "Language", "text", true], ["description", "Description", "textarea"], ["code", "Code", "code", true], ["tags", "Tags (comma separated)", "text"]] },
  resources: { title: "Resources", eyebrow: "Learning shelf", description: "Collect documentation, tutorials, tools, and references worth revisiting.", icon: Bookmark, action: "Add resource", fields: [["title", "Title", "text", true], ["type", "Type", "select", true], ["url", "URL", "url", true], ["description", "Description", "textarea"], ["tags", "Tags (comma separated)", "text"]] },
  bugs: { title: "Bug Journal", eyebrow: "Debugging log", description: "Track bugs, record fixes, and reuse the lessons from past debugging sessions.", icon: Bug, action: "Log a bug", fields: [["title", "Bug title", "text", true], ["error", "Error / description", "textarea", true], ["cause", "Root cause", "textarea", true], ["solution", "Solution / fix", "textarea", true], ["technology", "Technology", "text", true], ["resourceLink", "Related link (optional)", "url"], ["tags", "Tags (comma separated)", "text"]] },
  projects: { title: "Projects", eyebrow: "Project tracker", description: "Keep a lightweight overview of what you are building and its current status.", icon: FolderKanban, action: "New project", fields: [["title", "Project name", "text", true], ["description", "Description", "textarea"], ["status", "Status", "project-status", true], ["tags", "Technologies / tags (comma separated)", "text"]] },
};
const selectOptions = {
  type: ["Documentation", "Tutorial", "Article", "Tool", "Book", "Video", "Other"],
  status: ["Planned", "Planning", "Active", "In Progress", "Completed"],
};
const itemId = (item) => item._id || item.id;
const itemText = (item) => Object.values(item).flat().filter(Boolean).join(" ").toLowerCase();
const tagsFromForm = (value) => String(value || "").split(",").map((tag) => tag.trim()).filter(Boolean);
function displayDate(item) {
  const date = item.updatedAt || item.createdAt;
  if (!date) return "Saved";
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function Collection({ kind }) {
  const cfg = configs[kind];
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function loadItems() {
    setLoading(true); setError("");
    try { setItems(await itemApi.list(kind)); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadItems(); }, [kind]);

  const filtered = useMemo(() => items.filter((item) =>
    itemText(item).includes(query.toLowerCase()) &&
    (filter === "All" || item.status === filter)
  ), [items, query, filter]);

  function start(item = null) {
    setEditing(item || false);
    const next = {};
    cfg.fields.forEach(([field]) => {
      const value = item?.[field];
      next[field] = field === "tags" ? (value || []).join(", ") : value || "";
    });
    setForm(next); setError("");
  }

  async function save(e) {
    e.preventDefault(); setBusy(true); setError("");
    const payload = { ...form, tags: tagsFromForm(form.tags) };
    if (kind === "notes") { payload.content = String(form.content || ""); }
    try {
      if (editing && editing !== false) await itemApi.update(kind, itemId(editing), payload);
      else await itemApi.create(kind, payload);
      setEditing(null); setToast(editing && editing !== false ? "Changes saved" : "Item added");
      await loadItems();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function remove(id) {
    if (!confirm("Delete this item permanently?")) return;
    setError("");
    try { await itemApi.remove(kind, id); setItems((old) => old.filter((item) => itemId(item) !== id)); setToast("Item deleted"); }
    catch (err) { setError(err.message); }
  }

  const filters = kind === "bugs" ? ["All"] : kind === "projects" ? ["All", ...selectOptions.status] : ["All"];
  const Icon = cfg.icon;
  return <>
    <PageHeader eyebrow={cfg.eyebrow} title={cfg.title} description={cfg.description} action={cfg.action} onAction={() => start()} />
    <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]">
      <SearchBox value={query} onChange={setQuery} placeholder={`Search ${cfg.title.toLowerCase()}...`} />
      <select className={`${inputClass} md:w-48`} value={filter} onChange={(e) => setFilter(e.target.value)}>{filters.map((value) => <option key={value}>{value}</option>)}</select>
    </div>
    {error && <div role="alert" className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={17} className="mt-0.5 shrink-0" /><span>{error}</span><button className="ml-auto font-semibold" onClick={loadItems}>Retry</button></div>}
    {kind === "bugs" && <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">{[["Total", items.length, "text-slate-900"]].map(([label, count, color]) => <div key={label} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"><div className="text-xs font-medium text-slate-400">{label}</div><div className={`mt-1 text-2xl font-bold ${color}`}>{count}</div></div>)}</div>}
    <div className="mb-4 flex items-center justify-between text-xs text-slate-400"><span>{filtered.length} {filtered.length === 1 ? "item" : "items"}</span><span className="flex items-center gap-1"><Activity size={13} /> Synced with your account</span></div>
    {loading ? <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-12 text-sm text-slate-500"><RefreshCw size={17} className="animate-spin" /> Loading from DevVault API…</div> : filtered.length === 0 ? <EmptyState title={query ? "No matching results" : `No ${cfg.title.toLowerCase()} yet`} description={query ? "Try another search term or filter." : "Add an item to start building your library."} /> :
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((item) => <article key={itemId(item)} className="group flex min-w-0 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-soft">
        <div className="mb-4 flex items-start justify-between gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon size={19} /></div><div className="flex gap-1 opacity-70 transition group-hover:opacity-100"><button title="Edit" onClick={() => start(item)} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"><Edit3 size={15} /></button><button title="Delete" onClick={() => remove(itemId(item))} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button></div></div>
        <h2 className="text-base font-bold text-slate-900">{item.title}</h2>
        <div className="mt-2 flex flex-wrap gap-2">{item.category && <Badge>{item.category}</Badge>}{item.language && <Badge color="purple">{item.language}</Badge>}{item.type && <Badge color="green">{item.type}</Badge>}{item.status && <Badge color={item.status === "Completed" ? "green" : "amber"}>{item.status}</Badge>}{item.technology && <Badge color="purple">{item.technology}</Badge>}</div>
        {(item.description || item.content || item.error) && <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-slate-500">{item.description || item.content || item.error}</p>}
        {item.cause && <p className="mt-2 text-xs text-slate-500"><strong>Cause:</strong> {item.cause}</p>}{item.solution && <p className="mt-2 text-xs text-slate-500"><strong>Solution:</strong> {item.solution}</p>}
        {item.code && <pre className="mt-4 max-h-36 overflow-auto rounded-xl bg-slate-950 p-3 font-mono text-xs leading-5 text-blue-200">{item.code}</pre>}
        {(item.url || item.resourceLink) && <div className="mt-4 truncate"><OutLink href={item.url || item.resourceLink} /></div>}
        {(item.tags || []).length > 0 && <div className="mt-4 flex flex-wrap gap-1.5">{item.tags.map((tag) => <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">#{tag}</span>)}</div>}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 mt-5 text-xs text-slate-400"><span className="flex items-center gap-1"><Clock3 size={13} />{displayDate(item)}</span>{kind === "projects" && <span>{(item.tags || []).length} technologies</span>}</div>
      </article>)}</div>}
    {editing !== null && <Modal title={editing?.["_id"] || editing?.id ? "Edit item" : cfg.action} onClose={() => setEditing(null)}><form onSubmit={save} className="space-y-4">
      {cfg.fields.map(([field, label, type, required]) => <Field key={field} label={label}>{type === "textarea" || type === "code" ? <textarea required={Boolean(required)} rows={type === "code" ? 6 : 3} className={`${inputClass} ${type === "code" ? "font-mono text-xs" : ""}`} value={form[field] || ""} onChange={(e) => setForm({ ...form, [field]: e.target.value })} /> : type === "select" || type === "project-status" ? <select required={Boolean(required)} className={inputClass} value={form[field] || (field === "status" ? "Planned" : "Documentation")} onChange={(e) => setForm({ ...form, [field]: e.target.value })}>{(selectOptions[field] || selectOptions.status).map((value) => <option key={value}>{value}</option>)}</select> : <input required={Boolean(required)} type={type === "url" ? "url" : "text"} className={inputClass} value={form[field] || ""} onChange={(e) => setForm({ ...form, [field]: e.target.value })} placeholder={field === "tags" ? "Separate values with commas" : ""} />}</Field>)}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">Cancel</button><button disabled={busy} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"><Save className="mr-1 inline" size={15} />{busy ? "Saving…" : "Save item"}</button></div>
    </form></Modal>}
    <Toast message={toast} onClose={() => setToast("")} />
  </>;
}

export function Dashboard() {
  const [counts, setCounts] = useState({});
  const [error, setError] = useState("");
  const user = getStoredUser() || { name: "Developer" };
  useEffect(() => { Promise.all(kinds.map(async (kind) => [kind, (await itemApi.list(kind, { limit: 100, page: 1, archived: "false" })).length])).then((pairs) => setCounts(Object.fromEntries(pairs))).catch((err) => setError(err.message)); }, []);
  const cards = [["Notes", "/notes", NotebookPen, "bg-blue-50 text-blue-600", "Ideas, concepts and learning notes", counts.notes], ["Code Snippets", "/snippets", Code2, "bg-violet-50 text-violet-600", "Reusable code patterns", counts.snippets], ["Resources", "/resources", Bookmark, "bg-emerald-50 text-emerald-600", "Your saved learning links", counts.resources], ["Bug Journal", "/bugs", Bug, "bg-amber-50 text-amber-600", "Track issues and fixes", counts.bugs], ["Projects", "/projects", FolderKanban, "bg-pink-50 text-pink-600", "Work in progress", counts.projects]];
  return <>
    <div className="mb-9 rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-7 text-white shadow-xl shadow-blue-100 sm:p-10"><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold"><Activity size={14} /> Your workspace at a glance</div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome back, {user.name || "Developer"}.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">Your knowledge is now saved to your account and backed by the DevVault API.</p><div className="mt-6 flex flex-wrap gap-3"><Link to="/notes" className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"><Plus className="mr-1 inline" size={16} /> Capture a note</Link><Link to="/search" className="rounded-xl border border-white/30 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"><Search className="mr-1 inline" size={16} /> Search knowledge</Link></div></div>
    {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="mb-5 flex items-end justify-between"><div><div className="text-xs font-bold uppercase tracking-[.2em] text-blue-600">Your second brain</div><h2 className="mt-1 text-2xl font-bold">Knowledge modules</h2></div><span className="text-sm text-slate-400">{Object.values(counts).reduce((a, b) => a + b, 0)} saved items</span></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([title, to, Icon, color, desc, count]) => <Link key={to} to={to} className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-soft"><div className="flex items-start justify-between"><div className={`grid h-11 w-11 place-items-center rounded-xl ${color}`}><Icon size={20} /></div><ArrowUpRight className="text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-600" size={19} /></div><div className="mt-5 flex items-baseline gap-2"><h3 className="text-lg font-bold">{title}</h3><span className="text-xs text-slate-400">{count ?? "…"}</span></div><p className="mt-1 text-sm text-slate-500">{desc}</p></Link>)}</div>
    <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-5"><div className="flex items-start gap-3"><div className="rounded-xl bg-white p-2 text-blue-600"><CheckCircle2 size={19} /></div><div><h3 className="font-semibold text-slate-800">Keep your knowledge reusable</h3><p className="mt-1 text-sm leading-6 text-slate-500">Create notes, snippets, and debugging records; they will be stored in your authenticated workspace.</p></div></div></div>
  </>;
}

export function SearchPage() {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let active = true;
    if (!q.trim()) { setResults([]); return () => { active = false; }; }
    setLoading(true); setError("");
    Promise.all(kinds.map(async (kind) => (await itemApi.list(kind, { q: q.trim(), limit: 100 })).map((item) => ({ ...item, id: itemId(item), _kind: kind, _path: `/${kind}` }))))
      .then((groups) => { if (active) setResults(groups.flat()); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [q]);
  return <><PageHeader eyebrow="Find anything" title="Global Search" description="Search across notes, code snippets, resources, bugs, and projects." /><div className="mb-7"><SearchBox value={q} onChange={setQ} placeholder="Try React, Docker, authentication..." /></div>
    {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {!q ? <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center"><Search className="mx-auto mb-4 text-blue-500" size={28} /><h2 className="font-semibold">Search your second brain</h2><p className="mt-2 text-sm text-slate-500">Start typing to find saved items across all modules.</p><div className="mt-5 flex flex-wrap justify-center gap-2">{["React", "Docker", "Git", "Authentication"].map((term) => <button key={term} onClick={() => setQ(term)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-500 hover:border-blue-200 hover:text-blue-600">{term}</button>)}</div></div> : loading ? <p className="p-8 text-center text-sm text-slate-500">Searching your saved records…</p> : results.length === 0 ? <EmptyState title="No results found" description="Try a different keyword." /> : <div className="space-y-3">{results.map((item) => <Link key={item._kind + item.id} to={item._path} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 hover:border-blue-200"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">{item._kind === "notes" ? <NotebookPen size={18} /> : item._kind === "snippets" ? <Code2 size={18} /> : item._kind === "resources" ? <Bookmark size={18} /> : item._kind === "bugs" ? <Bug size={18} /> : <FolderKanban size={18} />}</div><div className="min-w-0 flex-1"><div className="font-semibold">{item.title}</div><div className="mt-1 truncate text-sm text-slate-500">{item.description || item.content || item.error || item.code || ""}</div></div><Badge>{item._kind}</Badge></Link>)}</div>}
  </>;
}

export function SettingsPage() {
  const user = getStoredUser() || { name: "Developer", email: "" };
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function verifyAccount() { setMessage(""); setError(""); try { const result = await apiRequest("/auth/me"); setMessage(`Connected as ${result.user.email}`); } catch (err) { setError(err.message); } }
  return <><PageHeader eyebrow="Account" title="Settings" description="View your authenticated DevVault account and API connection." /><div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="mb-5 text-lg font-bold">Account details</h2><div className="space-y-4"><Field label="Display name"><input readOnly className={`${inputClass} bg-slate-50`} value={user.name || ""} /></Field><Field label="Email"><input readOnly type="email" className={`${inputClass} bg-slate-50`} value={user.email || ""} /></Field><button onClick={verifyAccount} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white">Verify API connection</button>{message && <p className="text-sm text-emerald-600">{message}</p>}{error && <p role="alert" className="text-sm text-red-600">{error}</p>}</div><div className="mt-8 border-t border-slate-100 pt-6"><h3 className="font-semibold">Data storage</h3><p className="mt-1 text-sm leading-6 text-slate-500">Your records are stored in MongoDB through the authenticated DevVault API. Your browser stores the session token and basic account details.</p></div></div></>;
}
