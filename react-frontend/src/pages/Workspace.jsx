import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  NotebookPen,
  Code2,
  Bookmark,
  Bug,
  FolderKanban,
  ArrowUpRight,
  Clock3,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  Circle,
  Activity,
  Plus,
  Search,
  Save,
} from "lucide-react";
import { loadData, saveData } from "../data";
import {
  PageHeader,
  SearchBox,
  EmptyState,
  Modal,
  Field,
  inputClass,
  Badge,
  Toast,
  OutLink,
} from "../components/UI";
const configs = {
  notes: {
    title: "Notes",
    eyebrow: "Knowledge library",
    description:
      "Capture concepts, learning notes, and the things you want to remember.",
    icon: NotebookPen,
    action: "New note",
    fields: [
      ["title", "Title"],
      ["category", "Category"],
      ["content", "Content"],
      ["tags", "Tags (comma separated)"],
    ],
  },
  snippets: {
    title: "Code Snippets",
    eyebrow: "Reusable code",
    description: "Keep useful patterns and copy-ready code close at hand.",
    icon: Code2,
    action: "New snippet",
    fields: [
      ["title", "Title"],
      ["language", "Language"],
      ["description", "Description"],
      ["code", "Code"],
      ["tags", "Tags (comma separated)"],
    ],
  },
  resources: {
    title: "Resources",
    eyebrow: "Learning shelf",
    description:
      "Collect documentation, tutorials, tools, and references worth revisiting.",
    icon: Bookmark,
    action: "Add resource",
    fields: [
      ["title", "Title"],
      ["type", "Type"],
      ["url", "URL"],
      ["description", "Description"],
      ["tags", "Tags (comma separated)"],
    ],
  },
  bugs: {
    title: "Bug Journal",
    eyebrow: "Debugging log",
    description:
      "Track bugs, record fixes, and reuse the lessons from past debugging sessions.",
    icon: Bug,
    action: "Log a bug",
    fields: [
      ["title", "Bug title"],
      ["description", "Description"],
      ["severity", "Severity"],
      ["status", "Status"],
      ["tags", "Tags (comma separated)"],
    ],
  },
  projects: {
    title: "Projects",
    eyebrow: "Project tracker",
    description:
      "Keep a lightweight overview of what you are building and the stack behind it.",
    icon: FolderKanban,
    action: "New project",
    fields: [
      ["title", "Project name"],
      ["description", "Description"],
      ["status", "Status"],
      ["stack", "Tech stack (comma separated)"],
    ],
  },
};
function normalise(field, value) {
  return ["tags", "stack"].includes(field)
    ? Array.isArray(value)
      ? value.join(", ")
      : value || ""
    : value || "";
}
function itemText(item) {
  return Object.values(item).flat().join(" ").toLowerCase();
}
export function Collection({ kind }) {
  const cfg = configs[kind];
  const [items, setItems] = useState(() => loadData(kind));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({});
  useEffect(() => saveData(kind, items), [kind, items]);
  const filtered = useMemo(
    () =>
      items.filter(
        (x) =>
          itemText(x).includes(query.toLowerCase()) &&
          (filter === "All" || x.status === filter || x.severity === filter),
      ),
    [items, query, filter],
  );
  function start(item = null) {
    setEditing(item || false);
    setForm(
      item
        ? Object.fromEntries(
            cfg.fields.map(([f]) => [f, normalise(f, item[f])]),
          )
        : {},
    );
  }
  function save(e) {
    e.preventDefault();
    const data = { ...form, id: editing?.id || `${kind[0]}${Date.now()}` };
    for (const [f] of cfg.fields) {
      if (["tags", "stack"].includes(f))
        data[f] = (form[f] || "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean);
    }
    if (kind === "bugs" && !editing) data.created = "Today";
    setItems((old) =>
      editing
        ? old.map((x) => (x.id === editing.id ? data : x))
        : [data, ...old],
    );
    setEditing(null);
    setToast(editing ? "Changes saved" : "Item added");
  }
  function remove(id) {
    if (!confirm("Delete this item?")) return;
    setItems((old) => old.filter((x) => x.id !== id));
    setToast("Item deleted");
  }
  const filters =
    kind === "bugs"
      ? [
          "All",
          "Open",
          "In Progress",
          "Resolved",
          "Critical",
          "High",
          "Medium",
          "Low",
        ]
      : kind === "projects"
        ? ["All", "Planning", "In Progress", "Completed"]
        : ["All"];
  const Icon = cfg.icon;
  return (
    <>
      <PageHeader
        eyebrow={cfg.eyebrow}
        title={cfg.title}
        description={cfg.description}
        action={cfg.action}
        onAction={() => start()}
      />
      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]">
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder={`Search ${cfg.title.toLowerCase()}...`}
        />
        <select
          className={`${inputClass} md:w-48`}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {filters.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      {kind === "bugs" && (
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Total", items.length, "text-slate-900"],
            [
              "Open",
              items.filter((x) => x.status === "Open").length,
              "text-red-600",
            ],
            [
              "In progress",
              items.filter((x) => x.status === "In Progress").length,
              "text-amber-600",
            ],
            [
              "Resolved",
              items.filter((x) => x.status === "Resolved").length,
              "text-emerald-600",
            ],
          ].map(([t, n, c]) => (
            <div
              key={t}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
            >
              <div className="text-xs font-medium text-slate-400">{t}</div>
              <div className={`mt-1 text-2xl font-bold ${c}`}>{n}</div>
            </div>
          ))}
        </div>
      )}
      <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
        <span>
          {filtered.length} {filtered.length === 1 ? "item" : "items"}
        </span>
        <span className="flex items-center gap-1">
          <Activity size={13} /> Saved in this browser
        </span>
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          title={
            query ? "No matching results" : `No ${cfg.title.toLowerCase()} yet`
          }
          description={
            query
              ? "Try another search term or filter."
              : "Add an item to start building your library."
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group flex min-w-0 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-soft"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={19} />
                </div>
                <div className="flex gap-1 opacity-70 transition group-hover:opacity-100">
                  <button
                    title="Edit"
                    onClick={() => start(item)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => remove(item.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <h2 className="text-base font-bold text-slate-900">
                {item.title}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.category && <Badge>{item.category}</Badge>}
                {item.language && <Badge color="purple">{item.language}</Badge>}
                {item.type && <Badge color="green">{item.type}</Badge>}
                {item.status && (
                  <Badge
                    color={
                      item.status === "Resolved" || item.status === "Completed"
                        ? "green"
                        : item.status === "Open"
                          ? "red"
                          : "amber"
                    }
                  >
                    {item.status}
                  </Badge>
                )}
                {item.severity && (
                  <Badge
                    color={
                      item.severity === "Critical" || item.severity === "High"
                        ? "red"
                        : item.severity === "Medium"
                          ? "amber"
                          : "slate"
                    }
                  >
                    {item.severity}
                  </Badge>
                )}
              </div>
              {item.description && (
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              )}
              {item.content && (
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                  {item.content}
                </p>
              )}
              {item.code && (
                <pre className="mt-4 max-h-36 overflow-auto rounded-xl bg-slate-950 p-3 font-mono text-xs leading-5 text-blue-200">
                  {item.code}
                </pre>
              )}
              {item.url && (
                <div className="mt-4 truncate">
                  <OutLink href={item.url} />
                </div>
              )}
              {(item.tags || item.stack || []).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(item.tags || item.stack || []).map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 mt-5 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock3 size={13} />
                  {item.updated || item.created || "Saved"}
                </span>
                {kind === "bugs" && (
                  <button
                    onClick={() => {
                      const status =
                        item.status === "Open"
                          ? "In Progress"
                          : item.status === "In Progress"
                            ? "Resolved"
                            : "Open";
                      setItems((old) =>
                        old.map((x) =>
                          x.id === item.id ? { ...x, status } : x,
                        ),
                      );
                      setToast(`Marked ${status.toLowerCase()}`);
                    }}
                    className="font-semibold text-blue-600"
                  >
                    Change status →
                  </button>
                )}
                {kind === "projects" && (
                  <span>{(item.stack || []).length} technologies</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      {editing !== null && (
        <Modal
          title={editing?.id ? "Edit item" : cfg.action}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={save} className="space-y-4">
            {cfg.fields.map(([field, label]) => (
              <Field key={field} label={label}>
                {field === "content" ||
                (field === "description" && kind !== "resources") ? (
                  <textarea
                    required
                    rows={3}
                    className={inputClass}
                    value={form[field] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                  />
                ) : field === "code" ? (
                  <textarea
                    required
                    rows={6}
                    className={`${inputClass} font-mono text-xs`}
                    value={form[field] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                  />
                ) : ["status", "severity", "type"].includes(field) ? (
                  <select
                    className={inputClass}
                    value={
                      form[field] ||
                      (field === "status"
                        ? kind === "bugs"
                          ? "Open"
                          : "Planning"
                        : field === "severity"
                          ? "Medium"
                          : "Documentation")
                    }
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                  >
                    {(field === "status"
                      ? kind === "bugs"
                        ? ["Open", "In Progress", "Resolved"]
                        : ["Planning", "In Progress", "Completed"]
                      : field === "severity"
                        ? ["Critical", "High", "Medium", "Low"]
                        : [
                            "Documentation",
                            "Tutorial",
                            "Article",
                            "Tool",
                            "Book",
                            "Video",
                          ]
                    ).map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    required={["title", "url"].includes(field)}
                    type={field === "url" ? "url" : "text"}
                    className={inputClass}
                    value={form[field] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    placeholder={
                      field === "tags" || field === "stack"
                        ? "Separate values with commas"
                        : ""
                    }
                  />
                )}
              </Field>
            ))}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
              <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
                <Save className="mr-1 inline" size={15} /> Save item
              </button>
            </div>
          </form>
        </Modal>
      )}
      <Toast message={toast} onClose={() => setToast("")} />
    </>
  );
}
export function Dashboard() {
  const [counts, setCounts] = useState({});
  useEffect(
    () =>
      setCounts(
        Object.fromEntries(
          ["notes", "snippets", "resources", "bugs", "projects"].map((k) => [
            k,
            loadData(k).length,
          ]),
        ),
      ),
    [],
  );
  const cards = [
    [
      "Notes",
      "/notes",
      NotebookPen,
      "bg-blue-50 text-blue-600",
      "Ideas, concepts and learning notes",
      counts.notes,
    ],
    [
      "Code Snippets",
      "/snippets",
      Code2,
      "bg-violet-50 text-violet-600",
      "Reusable code patterns",
      counts.snippets,
    ],
    [
      "Resources",
      "/resources",
      Bookmark,
      "bg-emerald-50 text-emerald-600",
      "Your saved learning links",
      counts.resources,
    ],
    [
      "Bug Journal",
      "/bugs",
      Bug,
      "bg-amber-50 text-amber-600",
      "Track issues and fixes",
      counts.bugs,
    ],
    [
      "Projects",
      "/projects",
      FolderKanban,
      "bg-pink-50 text-pink-600",
      "Work in progress",
      counts.projects,
    ],
  ];
  return (
    <>
      <div className="mb-9 rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-7 text-white shadow-xl shadow-blue-100 sm:p-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
          <Activity size={14} /> Your workspace at a glance
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome back,{" "}
          {
            JSON.parse(
              localStorage.getItem("devvault_user") || '{"name":"Devesh"}',
            ).name
          }
          .
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
          Keep your learning momentum. Everything you save today makes the next
          problem easier to solve.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/notes"
            className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            <Plus className="mr-1 inline" size={16} /> Capture a note
          </Link>
          <Link
            to="/search"
            className="rounded-xl border border-white/30 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            <Search className="mr-1 inline" size={16} /> Search knowledge
          </Link>
        </div>
      </div>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[.2em] text-blue-600">
            Your second brain
          </div>
          <h2 className="mt-1 text-2xl font-bold">Knowledge modules</h2>
        </div>
        <span className="text-sm text-slate-400">
          {Object.values(counts).reduce((a, b) => a + b, 0)} saved items
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([title, to, Icon, color, desc, count]) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-soft"
          >
            <div className="flex items-start justify-between">
              <div
                className={`grid h-11 w-11 place-items-center rounded-xl ${color}`}
              >
                <Icon size={20} />
              </div>
              <ArrowUpRight
                className="text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-600"
                size={19}
              />
            </div>
            <div className="mt-5 flex items-baseline gap-2">
              <h3 className="text-lg font-bold">{title}</h3>
              <span className="text-xs text-slate-400">{count ?? 0}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{desc}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2 text-blue-600">
            <CheckCircle2 size={19} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">
              Keep your knowledge reusable
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              When you solve a bug or learn a new concept, capture the fix as a
              note or snippet so you can find it again.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
export function SearchPage() {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const all = useMemo(
    () =>
      ["notes", "snippets", "resources", "bugs", "projects"].flatMap((k) =>
        loadData(k).map((item) => ({ ...item, _kind: k, _path: "/" + k })),
      ),
    [],
  );
  const results = all.filter(
    (x) =>
      q &&
      Object.values(x).flat().join(" ").toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHeader
        eyebrow="Find anything"
        title="Global Search"
        description="Search across notes, code snippets, resources, bugs, and projects."
      />
      <div className="mb-7">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder="Try React, Docker, authentication..."
        />
      </div>
      {!q ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
          <Search className="mx-auto mb-4 text-blue-500" size={28} />
          <h2 className="font-semibold">Search your second brain</h2>
          <p className="mt-2 text-sm text-slate-500">
            Start typing to find saved items across all modules.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {["React", "Docker", "Git", "Authentication"].map((t) => (
              <button
                key={t}
                onClick={() => setQ(t)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-500 hover:border-blue-200 hover:text-blue-600"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          title="No results found"
          description="Try a different keyword."
        />
      ) : (
        <div className="space-y-3">
          {results.map((item) => (
            <Link
              key={item._kind + item.id}
              to={item._path}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 hover:border-blue-200"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                {item._kind === "notes" ? (
                  <NotebookPen size={18} />
                ) : item._kind === "snippets" ? (
                  <Code2 size={18} />
                ) : item._kind === "resources" ? (
                  <Bookmark size={18} />
                ) : item._kind === "bugs" ? (
                  <Bug size={18} />
                ) : (
                  <FolderKanban size={18} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{item.title}</div>
                <div className="mt-1 truncate text-sm text-slate-500">
                  {item.description || item.content || item.code || ""}
                </div>
              </div>
              <Badge>{item._kind}</Badge>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
export function SettingsPage() {
  const [user, setUser] = useState(() =>
    JSON.parse(
      localStorage.getItem("devvault_user") || '{"name":"Devesh","email":""}',
    ),
  );
  const [message, setMessage] = useState("");
  return (
    <>
      <PageHeader
        eyebrow="Personalize"
        title="Settings"
        description="Manage your local profile and your browser-stored workspace data."
      />
      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold">Profile details</h2>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            localStorage.setItem("devvault_user", JSON.stringify(user));
            setMessage("Profile saved successfully");
          }}
        >
          <Field label="Display name">
            <input
              className={inputClass}
              value={user.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className={inputClass}
              value={user.email || ""}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </Field>
          <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white">
            Save profile
          </button>
          {message && (
            <span className="ml-3 text-sm text-emerald-600">{message}</span>
          )}
        </form>
        <div className="mt-8 border-t border-slate-100 pt-6">
          <h3 className="font-semibold">Demo data</h3>
          <p className="mt-1 text-sm text-slate-500">
            Your entries are saved in this browser using localStorage. There is
            no backend or database connection yet.
          </p>
          <button
            onClick={() => {
              if (confirm("Clear all DevVault demo data from this browser?")) {
                [
                  "notes",
                  "snippets",
                  "resources",
                  "bugs",
                  "projects",
                  "user",
                ].forEach((k) => localStorage.removeItem("devvault_" + k));
                window.location.reload();
              }
            }}
            className="mt-4 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Clear local data
          </button>
        </div>
      </div>
    </>
  );
}
