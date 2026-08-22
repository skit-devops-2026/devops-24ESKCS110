const notes = [
  {
    title: "React Hooks in Practice",
    category: "Web Development",
    preview:
      "Hooks let functional components use state, effects, and other React features without a class.",
    tags: ["React", "JavaScript", "Frontend"],
    updated: "Today",
  },
  {
    title: "JWT Authentication Flow",
    category: "Backend",
    preview:
      "JSON Web Tokens securely carry claims between a client and server when their lifecycle is managed carefully.",
    tags: ["JWT", "Authentication", "Node.js"],
    updated: "Yesterday",
  },
  {
    title: "MongoDB Indexing Notes",
    category: "Database",
    preview:
      "Indexes speed up common queries by helping MongoDB locate documents without scanning the entire collection.",
    tags: ["MongoDB", "Database", "Performance"],
    updated: "2 days ago",
  },
  {
    title: "Docker Image Fundamentals",
    category: "DevOps",
    preview:
      "Docker packages an application and its dependencies into portable, lightweight images that run consistently.",
    tags: ["Docker", "DevOps", "Containers"],
    updated: "3 days ago",
  },
  {
    title: "Binary Search Patterns",
    category: "Programming",
    preview:
      "Binary search repeatedly halves a sorted search space, turning a linear lookup into a logarithmic one.",
    tags: ["Algorithms", "C++", "DSA"],
    updated: "5 days ago",
  },
  {
    title: "Readable Commit Messages",
    category: "General",
    preview:
      "A concise commit subject followed by useful context makes project history easier to scan and maintain.",
    tags: ["Git", "Workflow", "Best Practices"],
    updated: "1 week ago",
  },
];

const notesGrid = document.getElementById("notesGrid");
const emptyState = document.getElementById("emptyState");
const noteSearch = document.getElementById("noteSearch");
const resultsCount = document.getElementById("resultsCount");
const categoryFilters = document.querySelectorAll(".category-filter");
let selectedCategory = "All";

function noteCard(note) {
  const tags = note.tags
    .map(
      (tag) =>
        `<span class="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">${tag}</span>`,
    )
    .join("");

  return `
    <article class="note-card relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" data-note-title="${note.title.toLowerCase()}" data-note-content="${`${note.preview} ${note.tags.join(" ")}`.toLowerCase()}">
      <div class="note-content min-w-0">
        <div class="min-w-0">
          <div class="mb-3 flex items-center gap-2">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary"><i data-lucide="notebook-pen" class="h-4 w-4"></i></span>
            <span class="truncate rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-primary">${note.category}</span>
          </div>
          <h2 class="truncate text-base font-semibold text-slate-900">${note.title}</h2>
        </div>
        <p class="note-preview mt-3 text-sm leading-6 text-slate-600">${note.preview}</p>
        <div class="note-tags mt-4 flex flex-wrap gap-1.5">${tags}</div>
      </div>
      <div class="relative ml-3 flex shrink-0 flex-col items-end justify-between gap-4">
        <button type="button" class="note-menu-btn rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="More actions for ${note.title}" aria-expanded="false"><i data-lucide="ellipsis" class="h-4 w-4"></i></button>
        <div class="note-menu absolute right-0 top-9 z-10 hidden w-28 rounded-lg border border-slate-200 bg-white p-1 shadow-card">
          <button type="button" class="flex w-full rounded-md px-2.5 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50">Open</button>
          <button type="button" class="flex w-full rounded-md px-2.5 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50">Edit</button>
          <button type="button" class="flex w-full rounded-md px-2.5 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50">Delete</button>
        </div>
        <p class="whitespace-nowrap text-xs text-slate-500">Updated ${note.updated}</p>
      </div>
    </article>`;
}

function renderNotes() {
  const query = noteSearch.value.trim().toLowerCase();
  const filteredNotes = notes.filter((note) => {
    const matchesCategory =
      selectedCategory === "All" || note.category === selectedCategory;
    const searchableText =
      `${note.title} ${note.preview} ${note.category} ${note.tags.join(" ")}`.toLowerCase();
    return matchesCategory && searchableText.includes(query);
  });

  notesGrid.innerHTML = filteredNotes.map(noteCard).join("");
  emptyState.classList.toggle("hidden", filteredNotes.length !== 0);
  resultsCount.textContent = `Showing ${filteredNotes.length} ${filteredNotes.length === 1 ? "note" : "notes"}`;
  lucide.createIcons();
}

function setCategory(category) {
  selectedCategory = category;
  categoryFilters.forEach((button) => {
    const isActive = button.dataset.category === category;
    button.classList.toggle("bg-primary", isActive);
    button.classList.toggle("text-white", isActive);
    button.classList.toggle("font-semibold", isActive);
    button.classList.toggle("text-slate-600", !isActive);
  });
  renderNotes();
}

noteSearch?.addEventListener("input", renderNotes);
categoryFilters.forEach((button) =>
  button.addEventListener("click", () => setCategory(button.dataset.category)),
);

document.addEventListener("click", (event) => {
  const menuButton = event.target.closest(".note-menu-btn");
  document
    .querySelectorAll(".note-menu")
    .forEach((menu) => menu.classList.add("hidden"));
  document
    .querySelectorAll(".note-menu-btn")
    .forEach((button) => button.setAttribute("aria-expanded", "false"));

  if (menuButton) {
    const menu = menuButton.parentElement.querySelector(".note-menu");
    menu.classList.toggle("hidden");
    menuButton.setAttribute(
      "aria-expanded",
      String(!menu.classList.contains("hidden")),
    );
  }
});

function setView(view) {
  const isList = view === "list";
  notesGrid.classList.toggle("notes-list", isList);
  notesGrid.classList.toggle("md:grid-cols-2", !isList);
  notesGrid.classList.toggle("xl:grid-cols-3", !isList);
  notesGrid.classList.toggle("grid-cols-1", isList);
  document.getElementById("gridViewBtn").className =
    `view-toggle rounded-md p-2 transition ${isList ? "text-slate-400 hover:bg-slate-50 hover:text-slate-600" : "bg-blue-50 text-primary"}`;
  document.getElementById("listViewBtn").className =
    `view-toggle rounded-md p-2 transition ${isList ? "bg-blue-50 text-primary" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`;
  document
    .getElementById("gridViewBtn")
    .setAttribute("aria-pressed", String(!isList));
  document
    .getElementById("listViewBtn")
    .setAttribute("aria-pressed", String(isList));
}

document
  .getElementById("gridViewBtn")
  ?.addEventListener("click", () => setView("grid"));
document
  .getElementById("listViewBtn")
  ?.addEventListener("click", () => setView("list"));

const sidebar = document.getElementById("sidebar");
const mobileOverlay = document.getElementById("mobileOverlay");
function closeSidebar() {
  sidebar.classList.add("-translate-x-full");
  mobileOverlay.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}
function openSidebar() {
  sidebar.classList.remove("-translate-x-full");
  mobileOverlay.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}
document
  .getElementById("openSidebarBtn")
  ?.addEventListener("click", openSidebar);
document
  .getElementById("closeSidebarBtn")
  ?.addEventListener("click", closeSidebar);
mobileOverlay?.addEventListener("click", closeSidebar);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSidebar();
    document
      .querySelectorAll(".note-menu")
      .forEach((menu) => menu.classList.add("hidden"));
  }
});

renderNotes();
