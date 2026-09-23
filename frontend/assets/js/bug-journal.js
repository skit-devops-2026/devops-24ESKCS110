const bugs = [
    {
        id: 1,
        title: "Login form redirects to wrong page",
        project: "DevVault",
        date: "2026-09-18",
        status: "Resolved",
        severity: "High",
        error: "After submitting the login form, the user was redirected to the register page instead of the dashboard.",
        cause: "The form action was pointing to register.html because of an incorrect route in the login form.",
        solution: "Updated the form action and added the correct dashboard redirect after successful validation.",
        tags: ["html", "javascript", "authentication"]
    },
    {
        id: 2,
        title: "API request returns undefined data",
        project: "Student Management",
        date: "2026-09-15",
        status: "Resolved",
        severity: "Medium",
        error: "The frontend received a successful response but the expected student data was undefined.",
        cause: "The JavaScript code was reading response.data while the API returned the array directly.",
        solution: "Updated the response handling logic to use the correct response structure.",
        tags: ["javascript", "api", "debugging"]
    },
    {
        id: 3,
        title: "Tailwind styles not appearing",
        project: "DevVault",
        date: "2026-09-12",
        status: "Resolved",
        severity: "Medium",
        error: "Several Tailwind utility classes were not being applied on the page.",
        cause: "The Tailwind CDN script was missing from the HTML file.",
        solution: "Added the Tailwind CDN script before the page styles and verified the generated UI.",
        tags: ["tailwind", "css", "frontend"]
    },
    {
        id: 4,
        title: "Search does not filter cards",
        project: "DevVault",
        date: "2026-09-10",
        status: "In Progress",
        severity: "Low",
        error: "Typing in the search field did not change the displayed resources.",
        cause: "The input event listener was not connected to the filtering function.",
        solution: "Connected the input event to the render function so the list updates whenever the search value changes.",
        tags: ["javascript", "search", "ui"]
    },
    {
        id: 5,
        title: "Database connection timeout",
        project: "Faculty Dashboard",
        date: "2026-09-05",
        status: "Open",
        severity: "Critical",
        error: "The application fails to connect to the local database and eventually throws a connection timeout.",
        cause: "The database service was not running on the expected port.",
        solution: "Database service and connection configuration still need to be checked.",
        tags: ["mysql", "database", "connection"]
    },
    {
        id: 6,
        title: "Mobile sidebar covers page content",
        project: "DevVault",
        date: "2026-09-03",
        status: "Resolved",
        severity: "Low",
        error: "On smaller screens, opening the sidebar caused the main content to remain visible underneath it.",
        cause: "The mobile sidebar did not have a proper overlay and z-index configuration.",
        solution: "Added a mobile overlay and adjusted the sidebar stacking order.",
        tags: ["responsive", "tailwind", "ui"]
    }
];


let selectedBugId = null;


// DOM
const bugGrid = document.getElementById("bugGrid");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const severityFilter = document.getElementById("severityFilter");

const resultCount = document.getElementById("resultCount");
const clearFilters = document.getElementById("clearFilters");

const totalCount = document.getElementById("totalCount");
const openCount = document.getElementById("openCount");
const progressCount = document.getElementById("progressCount");
const resolvedCount = document.getElementById("resolvedCount");

const bugModal = document.getElementById("bugModal");
const viewModal = document.getElementById("viewModal");

const bugForm = document.getElementById("bugForm");

const modalTitle = document.getElementById("modalTitle");

const bugId = document.getElementById("bugId");
const bugTitle = document.getElementById("bugTitle");
const bugProject = document.getElementById("bugProject");
const bugDate = document.getElementById("bugDate");
const bugStatus = document.getElementById("bugStatus");
const bugSeverity = document.getElementById("bugSeverity");
const bugError = document.getElementById("bugError");
const bugCause = document.getElementById("bugCause");
const bugSolution = document.getElementById("bugSolution");
const bugTags = document.getElementById("bugTags");


// Utility
function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


function getSeverityClass(severity) {
    const classes = {
        Critical: "bg-red-100 text-red-700 border-red-200",
        High: "bg-orange-100 text-orange-700 border-orange-200",
        Medium: "bg-amber-100 text-amber-700 border-amber-200",
        Low: "bg-slate-100 text-slate-600 border-slate-200"
    };

    return classes[severity] || classes.Low;
}


function getStatusClass(status) {
    const classes = {
        Open: "bg-red-50 text-red-600 border-red-100",
        "In Progress": "bg-amber-50 text-amber-600 border-amber-100",
        Resolved: "bg-emerald-50 text-emerald-600 border-emerald-100"
    };

    return classes[status] || "bg-slate-50 text-slate-600 border-slate-100";
}


function updateStats() {
    totalCount.textContent = bugs.length;

    openCount.textContent = bugs.filter(
        bug => bug.status === "Open"
    ).length;

    progressCount.textContent = bugs.filter(
        bug => bug.status === "In Progress"
    ).length;

    resolvedCount.textContent = bugs.filter(
        bug => bug.status === "Resolved"
    ).length;
}


// Render
function renderBugs() {

    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;
    const selectedSeverity = severityFilter.value;

    const filteredBugs = bugs.filter(bug => {

        const searchableText = [
            bug.title,
            bug.project,
            bug.status,
            bug.severity,
            bug.error,
            bug.cause,
            bug.solution,
            ...bug.tags
        ]
            .join(" ")
            .toLowerCase();

        const matchesSearch =
            !searchTerm ||
            searchableText.includes(searchTerm);

        const matchesStatus =
            selectedStatus === "all" ||
            bug.status === selectedStatus;

        const matchesSeverity =
            selectedSeverity === "all" ||
            bug.severity === selectedSeverity;

        return matchesSearch && matchesStatus && matchesSeverity;
    });


    bugGrid.innerHTML = "";

    resultCount.textContent =
        `${filteredBugs.length} ${filteredBugs.length === 1 ? "bug" : "bugs"} found`;


    const hasFilters =
        searchInput.value.trim() !== "" ||
        statusFilter.value !== "all" ||
        severityFilter.value !== "all";

    clearFilters.classList.toggle("hidden", !hasFilters);


    if (filteredBugs.length === 0) {
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");


    filteredBugs.forEach(bug => {

        const card = document.createElement("div");

        card.className =
            "bg-white border border-slate-200 rounded-xl p-5 shadow-card hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200";


        card.innerHTML = `
            <div class="flex items-start justify-between gap-3">

                <div class="flex flex-wrap items-center gap-2">

                    <span class="inline-flex items-center px-2 py-1 rounded-md border text-[11px] font-medium ${getSeverityClass(bug.severity)}">
                        ${escapeHTML(bug.severity)}
                    </span>

                    <span class="inline-flex items-center px-2 py-1 rounded-md border text-[11px] font-medium ${getStatusClass(bug.status)}">
                        ${escapeHTML(bug.status)}
                    </span>

                </div>

                <button
                    data-action="menu"
                    data-id="${bug.id}"
                    class="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center">
                    <i data-lucide="more-horizontal" class="w-4 h-4"></i>
                </button>

            </div>


            <button
                data-action="view"
                data-id="${bug.id}"
                class="block text-left w-full mt-4">

                <h3 class="font-semibold text-slate-900 text-[15px] leading-6 hover:text-blue-600 transition">
                    ${escapeHTML(bug.title)}
                </h3>

            </button>


            <div class="flex items-center gap-2 mt-2 text-xs text-slate-400">

                <span class="flex items-center gap-1">
                    <i data-lucide="folder" class="w-3.5 h-3.5"></i>
                    ${escapeHTML(bug.project)}
                </span>

                <span>•</span>

                <span class="flex items-center gap-1">
                    <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                    ${formatDate(bug.date)}
                </span>

            </div>


            <p class="text-sm text-slate-500 leading-6 mt-4 line-clamp-3">
                ${escapeHTML(bug.error)}
            </p>


            <div class="flex flex-wrap gap-1.5 mt-4">

                ${bug.tags.slice(0, 3).map(tag => `
                    <span class="px-2 py-1 rounded-md bg-slate-50 text-slate-500 text-[11px] font-['JetBrains_Mono']">
                        #${escapeHTML(tag)}
                    </span>
                `).join("")}

                ${bug.tags.length > 3 ? `
                    <span class="px-2 py-1 rounded-md bg-slate-50 text-slate-400 text-[11px]">
                        +${bug.tags.length - 3}
                    </span>
                ` : ""}

            </div>


            <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">

                <button
                    data-action="view"
                    data-id="${bug.id}"
                    class="text-xs font-medium text-blue-600 hover:text-blue-700">
                    View details
                </button>

                <span class="text-[11px] text-slate-400">
                    Bug #${bug.id}
                </span>

            </div>
        `;

        bugGrid.appendChild(card);
    });


    lucide.createIcons();
}


// Open Add Modal
function openAddModal() {

    modalTitle.textContent = "Add Bug";

    bugForm.reset();

    bugId.value = "";

    bugDate.value = new Date().toISOString().split("T")[0];

    bugStatus.value = "Open";
    bugSeverity.value = "Medium";

    bugModal.classList.remove("hidden");
    bugModal.classList.add("flex");

    setTimeout(() => bugTitle.focus(), 100);
}


// Open Edit Modal
function openEditModal(id) {

    const bug = bugs.find(item => item.id === id);

    if (!bug) return;

    modalTitle.textContent = "Edit Bug";

    bugId.value = bug.id;
    bugTitle.value = bug.title;
    bugProject.value = bug.project;
    bugDate.value = bug.date;
    bugStatus.value = bug.status;
    bugSeverity.value = bug.severity;
    bugError.value = bug.error;
    bugCause.value = bug.cause;
    bugSolution.value = bug.solution;
    bugTags.value = bug.tags.join(", ");

    viewModal.classList.add("hidden");
    viewModal.classList.remove("flex");

    bugModal.classList.remove("hidden");
    bugModal.classList.add("flex");

    setTimeout(() => bugTitle.focus(), 100);
}


// Close Add/Edit Modal
function closeBugModal() {
    bugModal.classList.add("hidden");
    bugModal.classList.remove("flex");
}


// View Bug
function openViewModal(id) {

    const bug = bugs.find(item => item.id === id);

    if (!bug) return;

    selectedBugId = id;

    document.getElementById("viewTitle").textContent = bug.title;

    document.getElementById("viewMeta").textContent =
        `${bug.project} • ${formatDate(bug.date)}`;

    document.getElementById("viewSeverity").innerHTML = `
        <span class="inline-flex items-center px-2 py-1 rounded-md border text-[11px] font-medium ${getSeverityClass(bug.severity)}">
            ${escapeHTML(bug.severity)}
        </span>
    `;

    document.getElementById("viewStatus").innerHTML = `
        <span class="inline-flex items-center px-2 py-1 rounded-md border text-[11px] font-medium ${getStatusClass(bug.status)}">
            ${escapeHTML(bug.status)}
        </span>
    `;

    document.getElementById("viewError").textContent =
        bug.error || "No problem description added.";

    document.getElementById("viewCause").textContent =
        bug.cause || "No root cause recorded.";

    document.getElementById("viewSolution").textContent =
        bug.solution || "No solution recorded.";

    document.getElementById("viewTags").innerHTML =
        bug.tags.length
            ? bug.tags.map(tag => `
                <span class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-['JetBrains_Mono']">
                    #${escapeHTML(tag)}
                </span>
            `).join("")
            : `<span class="text-sm text-slate-400">No tags</span>`;


    viewModal.classList.remove("hidden");
    viewModal.classList.add("flex");

    lucide.createIcons();
}


// Close View Modal
function closeViewModal() {
    viewModal.classList.add("hidden");
    viewModal.classList.remove("flex");
    selectedBugId = null;
}


// Save Bug
bugForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = bugTitle.value.trim();
    const project = bugProject.value.trim();
    const date = bugDate.value;
    const status = bugStatus.value;
    const severity = bugSeverity.value;
    const error = bugError.value.trim();
    const cause = bugCause.value.trim();
    const solution = bugSolution.value.trim();

    const tags = bugTags.value
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean);


    if (!title || !project || !date) {
        showToast("Please fill the required fields.");
        return;
    }


    if (bugId.value) {

        const id = Number(bugId.value);

        const index = bugs.findIndex(
            bug => bug.id === id
        );

        if (index !== -1) {

            bugs[index] = {
                ...bugs[index],
                title,
                project,
                date,
                status,
                severity,
                error,
                cause,
                solution,
                tags
            };

            showToast("Bug updated successfully.");
        }

    } else {

        const newBug = {
            id: bugs.length
                ? Math.max(...bugs.map(bug => bug.id)) + 1
                : 1,
            title,
            project,
            date,
            status,
            severity,
            error,
            cause,
            solution,
            tags
        };

        bugs.unshift(newBug);

        showToast("Bug added successfully.");
    }


    closeBugModal();

    updateStats();
    renderBugs();
});


// Delete Bug
function deleteBug(id) {

    const index = bugs.findIndex(
        bug => bug.id === id
    );

    if (index === -1) return;

    const bugTitleText = bugs[index].title;

    const confirmed = confirm(
        `Delete "${bugTitleText}"?`
    );

    if (!confirmed) return;

    bugs.splice(index, 1);

    closeViewModal();

    updateStats();
    renderBugs();

    showToast("Bug deleted successfully.");
}


// Card Actions
bugGrid.addEventListener("click", function(event) {

    const button = event.target.closest("[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "view") {
        openViewModal(id);
    }

    if (action === "menu") {
        openViewModal(id);
    }
});


// View Edit
document.getElementById("viewEditBtn")
    .addEventListener("click", function() {

        if (!selectedBugId) return;

        openEditModal(selectedBugId);
    });


// View Delete
document.getElementById("viewDeleteBtn")
    .addEventListener("click", function() {

        if (!selectedBugId) return;

        deleteBug(selectedBugId);
    });


// Add
document.getElementById("addBugBtn")
    .addEventListener("click", openAddModal);


// Close buttons
document.getElementById("closeBugModal")
    .addEventListener("click", closeBugModal);

document.getElementById("cancelBug")
    .addEventListener("click", closeBugModal);

document.getElementById("closeViewModal")
    .addEventListener("click", closeViewModal);


// Modal backdrop
document.querySelector(".modal-backdrop")
    .addEventListener("click", closeBugModal);

document.querySelector(".view-backdrop")
    .addEventListener("click", closeViewModal);


// Search/filter
searchInput.addEventListener("input", renderBugs);
statusFilter.addEventListener("change", renderBugs);
severityFilter.addEventListener("change", renderBugs);


// Clear filters
clearFilters.addEventListener("click", function() {

    searchInput.value = "";
    statusFilter.value = "all";
    severityFilter.value = "all";

    renderBugs();
});


// Global Search
document.getElementById("globalSearch")
    .addEventListener("keydown", function(event) {

        if (event.key !== "Enter") return;

        const value = this.value.trim();

        if (!value) return;

        searchInput.value = value;

        renderBugs();

        searchInput.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        searchInput.focus();
    });


// Escape key
document.addEventListener("keydown", function(event) {

    if (event.key !== "Escape") return;

    closeBugModal();
    closeViewModal();
});


// Mobile Sidebar
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const menuBtn = document.getElementById("menuBtn");


function openSidebar() {
    sidebar.classList.remove("-translate-x-full");
    sidebarOverlay.classList.remove("hidden");
}


function closeSidebar() {
    sidebar.classList.add("-translate-x-full");
    sidebarOverlay.classList.add("hidden");
}


menuBtn.addEventListener("click", openSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);


// Toast
let toastTimeout;

function showToast(message) {

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    toastMessage.textContent = message;

    toast.classList.remove(
        "translate-y-20",
        "opacity-0"
    );

    toast.classList.add(
        "translate-y-0",
        "opacity-100"
    );


    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {

        toast.classList.add(
            "translate-y-20",
            "opacity-0"
        );

        toast.classList.remove(
            "translate-y-0",
            "opacity-100"
        );

    }, 2500);
}


// Initial render
updateStats();
renderBugs();