/**
 * DevVault - Code Snippets Management
 * Frontend interactive features for browsing, filtering, copying, and previewing code snippets.
 */

// Initial Static Sample Snippets
let snippets = [
  {
    id: 1,
    title: "Binary Search",
    description:
      "Efficient binary search implementation for sorted integer arrays.",
    language: "C++",
    code: `int binarySearch(vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target)
            return mid;

        if (arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }

    return -1;
}`,
    tags: ["DSA", "Searching", "C++"],
    updated: "Today",
    isFavorite: true,
  },
  {
    id: 2,
    title: "Debounce Function",
    description:
      "Delays function execution until after wait milliseconds have elapsed since last invocation.",
    language: "JavaScript",
    code: `function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}`,
    tags: ["JavaScript", "Utilities", "Performance"],
    updated: "Yesterday",
    isFavorite: true,
  },
  {
    id: 3,
    title: "Fetch API Helper",
    description:
      "Reusable async fetch wrapper with JSON headers and response error handling.",
    language: "JavaScript",
    code: `async function request(url, options = {}) {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    return response.json();
}`,
    tags: ["JavaScript", "API", "Async"],
    updated: "2 days ago",
    isFavorite: false,
  },
  {
    id: 4,
    title: "Array Flattening",
    description:
      "Recursive deep array flattening implementation without external libraries.",
    language: "JavaScript",
    code: `function flattenArray(arr) {
    return arr.reduce((flat, item) => {
        return flat.concat(
            Array.isArray(item) ? flattenArray(item) : item
        );
    }, []);
}`,
    tags: ["JavaScript", "Arrays", "Algorithms"],
    updated: "3 days ago",
    isFavorite: false,
  },
  {
    id: 5,
    title: "Python File Reader",
    description:
      "Safely read file contents with context manager and robust error handling.",
    language: "Python",
    code: `def read_file_safely(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            return file.read()
    except FileNotFoundError:
        print(f"Error: {filepath} was not found.")
        return None`,
    tags: ["Python", "File I/O", "Error Handling"],
    updated: "4 days ago",
    isFavorite: false,
  },
  {
    id: 6,
    title: "SQL JOIN Example",
    description:
      "Retrieve active users and their latest order details using an INNER JOIN query.",
    language: "SQL",
    code: `SELECT 
    u.id AS user_id, 
    u.name, 
    o.order_number, 
    o.total_amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
ORDER BY o.created_at DESC;`,
    tags: ["SQL", "Database", "Queries"],
    updated: "5 days ago",
    isFavorite: false,
  },
  {
    id: 7,
    title: "Java Singleton Pattern",
    description:
      "Thread-safe singleton implementation utilizing double-checked locking mechanism.",
    language: "Java",
    code: `public class DatabaseManager {
    private static volatile DatabaseManager instance;
    private DatabaseManager() {}

    public static DatabaseManager getInstance() {
        if (instance == null) {
            synchronized (DatabaseManager.class) {
                if (instance == null) {
                    instance = new DatabaseManager();
                }
            }
        }
        return instance;
    }
}`,
    tags: ["Java", "OOP", "Design Patterns"],
    updated: "1 week ago",
    isFavorite: false,
  },
  {
    id: 8,
    title: "Responsive Auto-Grid",
    description:
      "Clean CSS Grid utility for fluid, responsive card layouts without media queries.",
    language: "CSS",
    code: `.auto-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    align-items: stretch;
}`,
    tags: ["CSS", "Responsive", "Layout"],
    updated: "2 weeks ago",
    isFavorite: false,
  },
];

// DOM Elements
const snippetsGrid = document.getElementById("snippetsGrid");
const emptyState = document.getElementById("emptyState");
const snippetSearch = document.getElementById("snippetSearch");
const resultsCount = document.getElementById("resultsCount");
const languageFilters = document.querySelectorAll(".language-filter");
const activeTagIndicator = document.getElementById("activeTagIndicator");
const activeTagName = document.getElementById("activeTagName");
const clearTagFilterBtn = document.getElementById("clearTagFilterBtn");
const toastNotification = document.getElementById("toastNotification");
const toastMessage = document.getElementById("toastMessage");
const loadMoreContainer = document.getElementById("loadMoreContainer");

// View Modal Elements
const viewModal = document.getElementById("viewModal");
const viewModalTitle = document.getElementById("viewModalTitle");
const viewModalDesc = document.getElementById("viewModalDesc");
const viewModalLang = document.getElementById("viewModalLang");
const viewModalCodeLang = document.getElementById("viewModalCodeLang");
const viewModalUpdated = document.getElementById("viewModalUpdated");
const viewModalCode = document.getElementById("viewModalCode");
const viewModalTags = document.getElementById("viewModalTags");
const closeViewModalBtn = document.getElementById("closeViewModalBtn");
const closeViewModalFooterBtn = document.getElementById(
  "closeViewModalFooterBtn",
);
const modalCopyBtn = document.getElementById("modalCopyBtn");
const modalSecondaryCopyBtn = document.getElementById("modalSecondaryCopyBtn");

// New Snippet Modal Elements
const newSnippetBtn = document.getElementById("newSnippetBtn");
const emptyStateAddBtn = document.getElementById("emptyStateAddBtn");
const newSnippetModal = document.getElementById("newSnippetModal");
const closeNewModalBtn = document.getElementById("closeNewModalBtn");
const cancelNewModalBtn = document.getElementById("cancelNewModalBtn");
const newSnippetForm = document.getElementById("newSnippetForm");

// State
let selectedLanguage = "All";
let selectedTag = null;
let currentModalSnippet = null;
let currentView = "grid";

// Language Color Palette Mapping
const languageColors = {
  JavaScript: "border-amber-200 bg-amber-50 text-amber-700",
  Python: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "C++": "border-blue-200 bg-blue-50 text-blue-700",
  Java: "border-orange-200 bg-orange-50 text-orange-700",
  HTML: "border-rose-200 bg-rose-50 text-rose-700",
  CSS: "border-cyan-200 bg-cyan-50 text-cyan-700",
  SQL: "border-purple-200 bg-purple-50 text-purple-700",
  TypeScript: "border-indigo-200 bg-indigo-50 text-indigo-700",
};

function getLangBadgeClass(lang) {
  return languageColors[lang] || "border-slate-200 bg-slate-50 text-slate-700";
}

// Escape HTML for safe rendering inside <pre><code>
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Show Toast Notification
let toastTimeout;
function showToast(message = "Copied to clipboard!") {
  if (toastMessage) toastMessage.textContent = message;
  if (!toastNotification) return;

  toastNotification.classList.remove("opacity-0", "-translate-y-2");
  toastNotification.classList.add("opacity-100", "translate-y-0");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastNotification.classList.remove("opacity-100", "translate-y-0");
    toastNotification.classList.add("opacity-0", "-translate-y-2");
  }, 2500);
}

// Copy Code to Clipboard
function copySnippetCode(codeText, buttonElement = null) {
  navigator.clipboard
    .writeText(codeText)
    .then(() => {
      showToast("Code copied to clipboard!");

      if (buttonElement) {
        const originalHtml = buttonElement.innerHTML;
        buttonElement.innerHTML = `<i data-lucide="check" class="h-3.5 w-3.5 text-emerald-400"></i><span class="text-emerald-400">Copied!</span>`;
        lucide.createIcons();
        setTimeout(() => {
          buttonElement.innerHTML = originalHtml;
          lucide.createIcons();
        }, 2000);
      }
    })
    .catch((err) => {
      console.error("Clipboard copy failed:", err);
      showToast("Failed to copy code");
    });
}

// Toggle Favorite Status
function toggleFavorite(snippetId) {
  const snippet = snippets.find((s) => s.id === snippetId);
  if (snippet) {
    snippet.isFavorite = !snippet.isFavorite;
    renderSnippets();
  }
}

// Delete Snippet
function deleteSnippet(snippetId) {
  snippets = snippets.filter((s) => s.id !== snippetId);
  showToast("Snippet deleted");
  renderSnippets();
}

// Open View Modal
function openViewModal(snippetId) {
  const snippet = snippets.find((s) => s.id === snippetId);
  if (!snippet) return;

  currentModalSnippet = snippet;
  viewModalTitle.textContent = snippet.title;
  viewModalDesc.textContent = snippet.description;
  viewModalLang.textContent = snippet.language;
  viewModalLang.className = `rounded-md border px-2 py-0.5 text-xs font-semibold ${getLangBadgeClass(snippet.language)}`;
  viewModalCodeLang.textContent = snippet.language.toLowerCase();
  viewModalUpdated.textContent = `Updated ${snippet.updated}`;
  viewModalCode.textContent = snippet.code;

  viewModalTags.innerHTML = snippet.tags
    .map(
      (tag) =>
        `<button type="button" class="tag-pill-btn rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-blue-50 hover:text-primary" data-tag="${tag}">${tag}</button>`,
    )
    .join("");

  viewModal.classList.remove("hidden");
  viewModal.classList.add("flex");
  document.body.classList.add("overflow-hidden");
  lucide.createIcons();
}

function closeViewModal() {
  if (!viewModal) return;
  viewModal.classList.add("hidden");
  viewModal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");
  currentModalSnippet = null;
}

// Open / Close New Snippet Modal
function openNewSnippetModal() {
  newSnippetModal.classList.remove("hidden");
  newSnippetModal.classList.add("flex");
  document.body.classList.add("overflow-hidden");
  document.getElementById("snippetTitleInput")?.focus();
  lucide.createIcons();
}

function closeNewSnippetModal() {
  newSnippetModal.classList.add("hidden");
  newSnippetModal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");
  newSnippetForm.reset();
}

// Render Single Snippet Card
function snippetCard(snippet) {
  const langBadgeClass = getLangBadgeClass(snippet.language);
  const escapedCode = escapeHtml(snippet.code);
  const favoriteIconClass = snippet.isFavorite
    ? "fill-amber-400 text-amber-400"
    : "text-slate-300 hover:text-amber-400";

  const tagsHtml = snippet.tags
    .map(
      (tag) =>
        `<button type="button" class="tag-pill-btn rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 transition hover:bg-blue-50 hover:text-primary" data-tag="${tag}">${tag}</button>`,
    )
    .join("");

  return `
    <article class="snippet-card relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" data-snippet-id="${snippet.id}">
      <div class="snippet-left min-w-0">
        <!-- Card Header: Language, Favorite, Menu -->
        <div class="flex items-center justify-between gap-2 mb-3">
          <div class="flex items-center gap-2">
            <span class="rounded-lg border px-2.5 py-1 text-xs font-semibold ${langBadgeClass}">
              ${snippet.language}
            </span>
            <button type="button" class="fav-btn p-1 transition" data-id="${snippet.id}" title="${snippet.isFavorite ? "Remove favorite" : "Mark as favorite"}" aria-label="Favorite snippet">
              <i data-lucide="star" class="h-4 w-4 ${favoriteIconClass}"></i>
            </button>
          </div>

          <div class="relative flex items-center gap-1">
            <button type="button" class="snippet-menu-btn rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="More actions for ${snippet.title}" aria-expanded="false">
              <i data-lucide="ellipsis" class="h-4 w-4"></i>
            </button>
            <div class="snippet-menu absolute right-0 top-8 z-20 hidden w-32 rounded-xl border border-slate-200 bg-white p-1.5 shadow-card">
              <button type="button" class="menu-view-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50" data-id="${snippet.id}">
                <i data-lucide="eye" class="h-3.5 w-3.5"></i> View Full
              </button>
              <button type="button" class="menu-copy-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50" data-id="${snippet.id}">
                <i data-lucide="copy" class="h-3.5 w-3.5"></i> Copy Code
              </button>
              <button type="button" class="menu-edit-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50" data-id="${snippet.id}">
                <i data-lucide="pencil" class="h-3.5 w-3.5"></i> Edit
              </button>
              <button type="button" class="menu-delete-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50" data-id="${snippet.id}">
                <i data-lucide="trash-2" class="h-3.5 w-3.5"></i> Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Title & Description -->
        <h2 class="view-trigger cursor-pointer text-base font-semibold text-slate-900 transition hover:text-primary" data-id="${snippet.id}">
          ${snippet.title}
        </h2>
        <p class="mt-1.5 text-xs text-slate-500 line-clamp-2">${snippet.description}</p>
      </div>

      <!-- Code Preview Container -->
      <div class="code-preview-container mt-4">
        <div class="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <div class="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-3.5 py-1.5 text-[11px] text-slate-400">
            <span class="font-mono text-slate-400">${snippet.language.toLowerCase()}</span>
            <button type="button" class="card-copy-btn inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] text-slate-300 transition hover:bg-slate-800 hover:text-white" data-id="${snippet.id}" title="Copy code">
              <i data-lucide="copy" class="h-3 w-3"></i>
              <span>Copy</span>
            </button>
          </div>
          <pre class="code-scroll max-h-36 overflow-x-auto p-3 font-mono text-xs leading-relaxed text-slate-100 select-text"><code>${escapedCode}</code></pre>
        </div>
      </div>

      <!-- Tags & Footer Actions -->
      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div class="flex flex-wrap gap-1.5 overflow-hidden">
          ${tagsHtml}
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <span class="text-[11px] text-slate-400">${snippet.updated}</span>
          <button type="button" class="view-trigger text-xs font-semibold text-primary transition hover:text-primary-dark" data-id="${snippet.id}">
            View Code &rarr;
          </button>
        </div>
      </div>
    </article>`;
}

// Render All Filtered Snippets
function renderSnippets() {
  const query = snippetSearch.value.trim().toLowerCase();

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesLanguage =
      selectedLanguage === "All" || snippet.language === selectedLanguage;
    const matchesTag =
      !selectedTag ||
      snippet.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    const searchableText =
      `${snippet.title} ${snippet.description} ${snippet.language} ${snippet.code} ${snippet.tags.join(" ")}`.toLowerCase();
    const matchesQuery = !query || searchableText.includes(query);

    return matchesLanguage && matchesTag && matchesQuery;
  });

  if (filteredSnippets.length === 0) {
    snippetsGrid.innerHTML = "";
    emptyState.classList.remove("hidden");
    loadMoreContainer.classList.add("hidden");
  } else {
    snippetsGrid.innerHTML = filteredSnippets.map(snippetCard).join("");
    emptyState.classList.add("hidden");
    loadMoreContainer.classList.remove("hidden");
  }

  resultsCount.textContent = `Showing ${filteredSnippets.length} ${filteredSnippets.length === 1 ? "snippet" : "snippets"}`;
  lucide.createIcons();
}

// Handle Language Selection
function setLanguage(lang) {
  selectedLanguage = lang;
  languageFilters.forEach((btn) => {
    const isActive = btn.dataset.language === lang;
    btn.classList.toggle("bg-primary", isActive);
    btn.classList.toggle("text-white", isActive);
    btn.classList.toggle("font-semibold", isActive);
    btn.classList.toggle("text-slate-600", !isActive);
  });
  renderSnippets();
}

// Handle Tag Filter Selection
function setTagFilter(tag) {
  selectedTag = tag;
  if (tag) {
    activeTagIndicator.classList.remove("hidden");
    activeTagIndicator.classList.add("inline-flex");
    activeTagName.textContent = tag;
  } else {
    activeTagIndicator.classList.add("hidden");
    activeTagIndicator.classList.remove("inline-flex");
  }
  renderSnippets();
}

// View Toggle (Grid / List)
function setView(view) {
  currentView = view;
  const isList = view === "list";
  snippetsGrid.classList.toggle("snippets-list", isList);
  snippetsGrid.classList.toggle("md:grid-cols-2", !isList);
  snippetsGrid.classList.toggle("xl:grid-cols-2", !isList);
  snippetsGrid.classList.toggle("grid-cols-1", isList);

  const gridBtn = document.getElementById("gridViewBtn");
  const listBtn = document.getElementById("listViewBtn");

  if (gridBtn && listBtn) {
    gridBtn.className = `view-toggle rounded-md p-2 transition ${isList ? "text-slate-400 hover:bg-slate-50 hover:text-slate-600" : "bg-blue-50 text-primary"}`;
    listBtn.className = `view-toggle rounded-md p-2 transition ${isList ? "bg-blue-50 text-primary" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`;
    gridBtn.setAttribute("aria-pressed", String(!isList));
    listBtn.setAttribute("aria-pressed", String(isList));
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Search input
  snippetSearch?.addEventListener("input", renderSnippets);

  // Language filter buttons
  languageFilters.forEach((btn) =>
    btn.addEventListener("click", () => setLanguage(btn.dataset.language)),
  );

  // Clear tag filter button
  clearTagFilterBtn?.addEventListener("click", () => setTagFilter(null));

  // Grid/List View switcher
  document
    .getElementById("gridViewBtn")
    ?.addEventListener("click", () => setView("grid"));
  document
    .getElementById("listViewBtn")
    ?.addEventListener("click", () => setView("list"));

  // Open / Close New Snippet Modal
  newSnippetBtn?.addEventListener("click", openNewSnippetModal);
  emptyStateAddBtn?.addEventListener("click", openNewSnippetModal);
  closeNewModalBtn?.addEventListener("click", closeNewSnippetModal);
  cancelNewModalBtn?.addEventListener("click", closeNewSnippetModal);

  // New Snippet Form Submission
  newSnippetForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("snippetTitleInput").value.trim();
    const language = document.getElementById("snippetLangSelect").value;
    const desc =
      document.getElementById("snippetDescInput").value.trim() ||
      "Saved snippet.";
    const code = document.getElementById("snippetCodeInput").value.trim();
    const tagsInput = document.getElementById("snippetTagsInput").value.trim();
    const tags = tagsInput
      ? tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [language];

    const newSnippet = {
      id: Date.now(),
      title,
      description: desc,
      language,
      code,
      tags,
      updated: "Just now",
      isFavorite: false,
    };

    snippets.unshift(newSnippet);
    closeNewSnippetModal();
    showToast("New snippet added!");
    renderSnippets();
  });

  // View Modal Close buttons
  closeViewModalBtn?.addEventListener("click", closeViewModal);
  closeViewModalFooterBtn?.addEventListener("click", closeViewModal);

  // Modal Copy buttons
  modalCopyBtn?.addEventListener("click", () => {
    if (currentModalSnippet) {
      copySnippetCode(currentModalSnippet.code, modalCopyBtn);
    }
  });

  modalSecondaryCopyBtn?.addEventListener("click", () => {
    if (currentModalSnippet) {
      copySnippetCode(currentModalSnippet.code);
    }
  });

  // Global Click Delegations (Cards, Dropdowns, Tags, Favorites, Copy)
  document.addEventListener("click", (event) => {
    // Menu Dropdown Toggle
    const menuBtn = event.target.closest(".snippet-menu-btn");
    const isInsideMenu = event.target.closest(".snippet-menu");

    if (!menuBtn && !isInsideMenu) {
      document
        .querySelectorAll(".snippet-menu")
        .forEach((menu) => menu.classList.add("hidden"));
      document
        .querySelectorAll(".snippet-menu-btn")
        .forEach((btn) => btn.setAttribute("aria-expanded", "false"));
    }

    if (menuBtn) {
      const menu = menuBtn.parentElement.querySelector(".snippet-menu");
      const isHidden = menu.classList.contains("hidden");
      document
        .querySelectorAll(".snippet-menu")
        .forEach((m) => m.classList.add("hidden"));
      menu.classList.toggle("hidden", !isHidden);
      menuBtn.setAttribute("aria-expanded", String(isHidden));
      return;
    }

    // Card Copy Button
    const copyBtn = event.target.closest(".card-copy-btn");
    if (copyBtn) {
      const snippetId = Number(copyBtn.dataset.id);
      const snippet = snippets.find((s) => s.id === snippetId);
      if (snippet) copySnippetCode(snippet.code, copyBtn);
      return;
    }

    // Favorite Button
    const favBtn = event.target.closest(".fav-btn");
    if (favBtn) {
      const snippetId = Number(favBtn.dataset.id);
      toggleFavorite(snippetId);
      return;
    }

    // Tag Filter Pill Click (Card or Modal)
    const tagPill = event.target.closest(".tag-pill-btn");
    if (tagPill) {
      const tag = tagPill.dataset.tag;
      if (viewModal && !viewModal.classList.contains("hidden")) {
        closeViewModal();
      }
      setTagFilter(tag);
      return;
    }

    // View Modal Trigger (Title or View Code Button or Menu View)
    const viewTrigger =
      event.target.closest(".view-trigger") ||
      event.target.closest(".menu-view-btn");
    if (viewTrigger) {
      const snippetId = Number(viewTrigger.dataset.id);
      openViewModal(snippetId);
      return;
    }

    // Menu Copy
    const menuCopyBtn = event.target.closest(".menu-copy-btn");
    if (menuCopyBtn) {
      const snippetId = Number(menuCopyBtn.dataset.id);
      const snippet = snippets.find((s) => s.id === snippetId);
      if (snippet) copySnippetCode(snippet.code);
      document
        .querySelectorAll(".snippet-menu")
        .forEach((m) => m.classList.add("hidden"));
      return;
    }

    // Menu Delete
    const menuDeleteBtn = event.target.closest(".menu-delete-btn");
    if (menuDeleteBtn) {
      const snippetId = Number(menuDeleteBtn.dataset.id);
      deleteSnippet(snippetId);
      return;
    }

    // Menu Edit (Mock Notification)
    const menuEditBtn = event.target.closest(".menu-edit-btn");
    if (menuEditBtn) {
      showToast("Snippet editor will be connected in next stage");
      document
        .querySelectorAll(".snippet-menu")
        .forEach((m) => m.classList.add("hidden"));
      return;
    }

    // Backdrop Click for Modals
    if (event.target === viewModal) {
      closeViewModal();
    }
    if (event.target === newSnippetModal) {
      closeNewSnippetModal();
    }
  });

  // Mobile Sidebar Toggle
  const sidebar = document.getElementById("sidebar");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const openSidebarBtn = document.getElementById("openSidebarBtn");
  const closeSidebarBtn = document.getElementById("closeSidebarBtn");

  function openSidebar() {
    sidebar?.classList.remove("-translate-x-full");
    mobileOverlay?.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }

  function closeSidebar() {
    sidebar?.classList.add("-translate-x-full");
    mobileOverlay?.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  openSidebarBtn?.addEventListener("click", openSidebar);
  closeSidebarBtn?.addEventListener("click", closeSidebar);
  mobileOverlay?.addEventListener("click", closeSidebar);

  // Keyboard Shortcuts (Escape closes modals, menus, sidebar)
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSidebar();
      closeViewModal();
      closeNewSnippetModal();
      document
        .querySelectorAll(".snippet-menu")
        .forEach((menu) => menu.classList.add("hidden"));
    }
  });
}

// Initialize on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  renderSnippets();
});
