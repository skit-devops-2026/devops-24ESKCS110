// ============================================================
// DevVault - Resources
// Frontend-only implementation
// ============================================================


// ------------------------------------------------------------
// Sample Resources
// ------------------------------------------------------------

let resources = [
    {
        id: 1,
        title: "JavaScript MDN Documentation",
        description: "Complete documentation and reference for modern JavaScript.",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        type: "Documentation",
        category: "Web Development",
        topic: "JavaScript",
        tags: ["JavaScript", "Web Development"],
        date: "Today"
    },

    {
        id: 2,
        title: "Git & GitHub Fundamentals",
        description: "Learn the basics of Git, GitHub, repositories, branches, and pull requests.",
        url: "https://docs.github.com/en/get-started",
        type: "Tutorial",
        category: "Programming",
        topic: "Git",
        tags: ["Git", "GitHub", "Version Control"],
        date: "Yesterday"
    },

    {
        id: 3,
        title: "SQL Fundamentals",
        description: "Learn SQL queries, filtering, joins, grouping, and database fundamentals.",
        url: "https://www.w3schools.com/sql/",
        type: "Course",
        category: "Database",
        topic: "SQL",
        tags: ["SQL", "Database"],
        date: "2 days ago"
    },

    {
        id: 4,
        title: "Docker Getting Started",
        description: "Official beginner guide to containers, images, Dockerfiles, and Docker commands.",
        url: "https://docs.docker.com/get-started/",
        type: "Documentation",
        category: "DevOps",
        topic: "Docker",
        tags: ["Docker", "DevOps"],
        date: "3 days ago"
    },

    {
        id: 5,
        title: "Machine Learning Basics",
        description: "Beginner-friendly introduction to machine learning concepts and workflows.",
        url: "https://www.youtube.com/results?search_query=machine+learning+basics",
        type: "Video",
        category: "Machine Learning",
        topic: "Machine Learning",
        tags: ["ML", "Python", "Machine Learning"],
        date: "5 days ago"
    },

    {
        id: 6,
        title: "Understanding REST APIs",
        description: "Understand REST APIs, HTTP methods, requests, responses, and endpoints.",
        url: "https://developer.mozilla.org/en-US/docs/Glossary/REST",
        type: "Article",
        category: "Backend",
        topic: "APIs",
        tags: ["REST", "API", "Backend"],
        date: "1 week ago"
    }
];


// ------------------------------------------------------------
// State
// ------------------------------------------------------------

let selectedCategory = "All";
let selectedType = "All";
let editingResourceId = null;
let currentViewingResource = null;


// ------------------------------------------------------------
// DOM Elements
// ------------------------------------------------------------

const resourcesGrid = document.getElementById("resourcesGrid");
const emptyState = document.getElementById("emptyState");
const resultsCount = document.getElementById("resultsCount");

const resourceSearch = document.getElementById("resourceSearch");

const newResourceBtn = document.getElementById("newResourceBtn");
const emptyStateAddBtn = document.getElementById("emptyStateAddBtn");

const resourceModal = document.getElementById("resourceModal");
const closeResourceModalBtn = document.getElementById("closeResourceModalBtn");
const cancelResourceBtn = document.getElementById("cancelResourceBtn");

const resourceForm = document.getElementById("resourceForm");

const modalTitle = document.getElementById("modalTitle");
const saveResourceBtn = document.getElementById("saveResourceBtn");

const resourceTitleInput = document.getElementById("resourceTitleInput");
const resourceTypeInput = document.getElementById("resourceTypeInput");
const resourceCategoryInput = document.getElementById("resourceCategoryInput");
const resourceUrlInput = document.getElementById("resourceUrlInput");
const resourceTopicInput = document.getElementById("resourceTopicInput");
const resourceDescriptionInput = document.getElementById("resourceDescriptionInput");
const resourceTagsInput = document.getElementById("resourceTagsInput");


// View modal

const viewResourceModal = document.getElementById("viewResourceModal");

const closeViewResourceBtn =
    document.getElementById("closeViewResourceBtn");

const closeViewResourceFooterBtn =
    document.getElementById("closeViewResourceFooterBtn");

const openResourceBtn =
    document.getElementById("openResourceBtn");

const viewResourceTitle =
    document.getElementById("viewResourceTitle");

const viewResourceDescription =
    document.getElementById("viewResourceDescription");

const viewResourceType =
    document.getElementById("viewResourceType");

const viewResourceCategory =
    document.getElementById("viewResourceCategory");

const viewResourceTopic =
    document.getElementById("viewResourceTopic");

const viewResourceTags =
    document.getElementById("viewResourceTags");


// Sidebar

const sidebar = document.getElementById("sidebar");
const mobileOverlay = document.getElementById("mobileOverlay");
const openSidebarBtn = document.getElementById("openSidebarBtn");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");


// Toast

const toastNotification =
    document.getElementById("toastNotification");

const toastMessage =
    document.getElementById("toastMessage");


// ------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ------------------------------------------------------------
// Type Colors
// ------------------------------------------------------------

function getTypeStyle(type) {

    const styles = {

        Documentation:
            "bg-blue-50 text-blue-700 border-blue-100",

        Tutorial:
            "bg-emerald-50 text-emerald-700 border-emerald-100",

        Course:
            "bg-violet-50 text-violet-700 border-violet-100",

        Video:
            "bg-red-50 text-red-700 border-red-100",

        Article:
            "bg-amber-50 text-amber-700 border-amber-100"

    };

    return styles[type] || "bg-slate-50 text-slate-600 border-slate-200";
}


// ------------------------------------------------------------
// Render Resources
// ------------------------------------------------------------

function renderResources() {

    const searchTerm =
        resourceSearch.value.trim().toLowerCase();


    const filteredResources = resources.filter(resource => {

        const matchesSearch =
            !searchTerm ||
            resource.title.toLowerCase().includes(searchTerm) ||
            resource.description.toLowerCase().includes(searchTerm) ||
            resource.topic.toLowerCase().includes(searchTerm) ||
            resource.category.toLowerCase().includes(searchTerm) ||
            resource.tags.join(" ").toLowerCase().includes(searchTerm);


        const matchesCategory =
            selectedCategory === "All" ||
            resource.category === selectedCategory;


        const matchesType =
            selectedType === "All" ||
            resource.type === selectedType;


        return (
            matchesSearch &&
            matchesCategory &&
            matchesType
        );

    });


    resourcesGrid.innerHTML = "";


    resultsCount.textContent =
        `Showing ${filteredResources.length} resource${filteredResources.length !== 1 ? "s" : ""}`;


    if (filteredResources.length === 0) {

        resourcesGrid.classList.add("hidden");
        emptyState.classList.remove("hidden");

        return;
    }


    resourcesGrid.classList.remove("hidden");
    emptyState.classList.add("hidden");


    filteredResources.forEach(resource => {

        const card = createResourceCard(resource);

        resourcesGrid.insertAdjacentHTML(
            "beforeend",
            card
        );

    });


    lucide.createIcons();

}


// ------------------------------------------------------------
// Resource Card
// ------------------------------------------------------------

function createResourceCard(resource) {

    const typeStyle = getTypeStyle(resource.type);


    const tagsHTML = resource.tags
        .map(tag => `
            <button
                type="button"
                class="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-blue-50 hover:text-primary"
                onclick="searchByTag('${escapeHTML(tag)}')">

                ${escapeHTML(tag)}

            </button>
        `)
        .join("");


    return `

        <article
            class="group flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-card">


            <!-- Card Header -->

            <div class="flex items-start justify-between gap-3">

                <div
                    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary">

                    <i
                        data-lucide="${getResourceIcon(resource.type)}"
                        class="h-5 w-5">
                    </i>

                </div>


                <span
                    class="rounded-md border px-2 py-1 text-xs font-semibold ${typeStyle}">

                    ${escapeHTML(resource.type)}

                </span>

            </div>


            <!-- Title -->

            <div class="mt-4">

                <h2
                    class="line-clamp-2 text-base font-bold text-slate-900">

                    ${escapeHTML(resource.title)}

                </h2>


                <p
                    class="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">

                    ${escapeHTML(resource.description)}

                </p>

            </div>


            <!-- Topic -->

            <div
                class="mt-4 flex items-center gap-2 text-xs">

                <i
                    data-lucide="layers-3"
                    class="h-3.5 w-3.5 text-slate-400">
                </i>

                <span class="font-medium text-slate-500">
                    ${escapeHTML(resource.topic)}
                </span>

                <span class="text-slate-300">
                    •
                </span>

                <span class="text-slate-400">
                    ${escapeHTML(resource.category)}
                </span>

            </div>


            <!-- Tags -->

            <div
                class="mt-4 flex min-h-7 flex-wrap gap-1.5">

                ${tagsHTML}

            </div>


            <!-- Bottom -->

            <div
                class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                <span
                    class="flex items-center gap-1.5 text-xs text-slate-400">

                    <i
                        data-lucide="clock-3"
                        class="h-3.5 w-3.5">
                    </i>

                    ${escapeHTML(resource.date)}

                </span>


                <div class="flex items-center gap-1.5">


                    <!-- View -->

                    <button
                        type="button"
                        title="View resource"
                        onclick="viewResource(${resource.id})"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-primary">

                        <i
                            data-lucide="eye"
                            class="h-4 w-4">
                        </i>

                    </button>


                    <!-- Open -->

                    <button
                        type="button"
                        title="Open resource"
                        onclick="openResource(${resource.id})"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-primary">

                        <i
                            data-lucide="external-link"
                            class="h-4 w-4">
                        </i>

                    </button>


                    <!-- Edit -->

                    <button
                        type="button"
                        title="Edit resource"
                        onclick="editResource(${resource.id})"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-primary">

                        <i
                            data-lucide="pencil"
                            class="h-4 w-4">
                        </i>

                    </button>


                    <!-- Delete -->

                    <button
                        type="button"
                        title="Delete resource"
                        onclick="deleteResource(${resource.id})"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">

                        <i
                            data-lucide="trash-2"
                            class="h-4 w-4">
                        </i>

                    </button>

                </div>

            </div>

        </article>

    `;
}


// ------------------------------------------------------------
// Resource Icon
// ------------------------------------------------------------

function getResourceIcon(type) {

    const icons = {

        Documentation: "book-open",
        Tutorial: "graduation-cap",
        Course: "library",
        Video: "play-circle",
        Article: "file-text"

    };

    return icons[type] || "book-marked";

}


// ------------------------------------------------------------
// Search By Tag
// ------------------------------------------------------------

function searchByTag(tag) {

    resourceSearch.value = tag;

    renderResources();

}


// ------------------------------------------------------------
// Category Filters
// ------------------------------------------------------------

document.querySelectorAll(".category-filter").forEach(button => {

    button.addEventListener("click", () => {

        selectedCategory =
            button.dataset.category;


        document
            .querySelectorAll(".category-filter")
            .forEach(btn => {

                btn.classList.remove(
                    "bg-primary",
                    "font-semibold",
                    "text-white"
                );

                btn.classList.add(
                    "font-medium",
                    "text-slate-600"
                );

            });


        button.classList.remove(
            "font-medium",
            "text-slate-600"
        );

        button.classList.add(
            "bg-primary",
            "font-semibold",
            "text-white"
        );


        renderResources();

    });

});


// ------------------------------------------------------------
// Type Filters
// ------------------------------------------------------------

document.querySelectorAll(".type-filter").forEach(button => {

    button.addEventListener("click", () => {

        selectedType =
            button.dataset.type;


        document
            .querySelectorAll(".type-filter")
            .forEach(btn => {

                btn.classList.remove(
                    "bg-slate-800",
                    "font-semibold",
                    "text-white"
                );

                btn.classList.add(
                    "font-medium",
                    "text-slate-600"
                );

            });


        button.classList.remove(
            "font-medium",
            "text-slate-600"
        );

        button.classList.add(
            "bg-slate-800",
            "font-semibold",
            "text-white"
        );


        renderResources();

    });

});


// ------------------------------------------------------------
// Search
// ------------------------------------------------------------

resourceSearch.addEventListener(
    "input",
    renderResources
);


// ------------------------------------------------------------
// Open Add Modal
// ------------------------------------------------------------

function openResourceModal() {

    editingResourceId = null;

    modalTitle.textContent =
        "Add New Resource";

    saveResourceBtn.innerHTML = `
        <i data-lucide="plus" class="h-4 w-4"></i>
        Save Resource
    `;


    resourceForm.reset();


    resourceModal.classList.remove("hidden");
    resourceModal.classList.add("flex");


    lucide.createIcons();

    resourceTitleInput.focus();

}


// ------------------------------------------------------------
// Close Add/Edit Modal
// ------------------------------------------------------------

function closeResourceModal() {

    resourceModal.classList.add("hidden");
    resourceModal.classList.remove("flex");

    editingResourceId = null;

    resourceForm.reset();

}


newResourceBtn.addEventListener(
    "click",
    openResourceModal
);


emptyStateAddBtn.addEventListener(
    "click",
    openResourceModal
);


closeResourceModalBtn.addEventListener(
    "click",
    closeResourceModal
);


cancelResourceBtn.addEventListener(
    "click",
    closeResourceModal
);


// ------------------------------------------------------------
// Save Resource
// ------------------------------------------------------------

resourceForm.addEventListener("submit", event => {

    event.preventDefault();


    const title =
        resourceTitleInput.value.trim();

    const type =
        resourceTypeInput.value;

    const category =
        resourceCategoryInput.value;

    const url =
        resourceUrlInput.value.trim();

    const topic =
        resourceTopicInput.value.trim() ||
        "General";

    const description =
        resourceDescriptionInput.value.trim() ||
        "Useful developer learning resource.";

    const tags =
        resourceTagsInput.value
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);


    if (editingResourceId !== null) {

        const resource =
            resources.find(
                item => item.id === editingResourceId
            );


        if (resource) {

            resource.title = title;
            resource.type = type;
            resource.category = category;
            resource.url = url;
            resource.topic = topic;
            resource.description = description;
            resource.tags = tags;

            showToast(
                "Resource updated successfully!"
            );

        }

    } else {

        const newResource = {

            id: Date.now(),

            title,

            description,

            url,

            type,

            category,

            topic,

            tags,

            date: "Just now"

        };


        resources.unshift(newResource);


        showToast(
            "Resource added successfully!"
        );

    }


    closeResourceModal();

    renderResources();

});


// ------------------------------------------------------------
// Edit Resource
// ------------------------------------------------------------

function editResource(id) {

    const resource =
        resources.find(item => item.id === id);


    if (!resource) {
        return;
    }


    editingResourceId = id;


    modalTitle.textContent =
        "Edit Resource";


    saveResourceBtn.innerHTML = `
        <i data-lucide="save" class="h-4 w-4"></i>
        Update Resource
    `;


    resourceTitleInput.value =
        resource.title;

    resourceTypeInput.value =
        resource.type;

    resourceCategoryInput.value =
        resource.category;

    resourceUrlInput.value =
        resource.url;

    resourceTopicInput.value =
        resource.topic;

    resourceDescriptionInput.value =
        resource.description;

    resourceTagsInput.value =
        resource.tags.join(", ");


    resourceModal.classList.remove("hidden");
    resourceModal.classList.add("flex");


    lucide.createIcons();

}


// ------------------------------------------------------------
// Delete Resource
// ------------------------------------------------------------

function deleteResource(id) {

    const resource =
        resources.find(item => item.id === id);


    if (!resource) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${resource.title}"?`
        );


    if (!confirmed) {
        return;
    }


    resources =
        resources.filter(
            item => item.id !== id
        );


    renderResources();


    showToast(
        "Resource deleted successfully!"
    );

}


// ------------------------------------------------------------
// View Resource
// ------------------------------------------------------------

function viewResource(id) {

    const resource =
        resources.find(item => item.id === id);


    if (!resource) {
        return;
    }


    currentViewingResource =
        resource;


    viewResourceTitle.textContent =
        resource.title;

    viewResourceDescription.textContent =
        resource.description;

    viewResourceType.textContent =
        resource.type;

    viewResourceCategory.textContent =
        resource.category;

    viewResourceTopic.textContent =
        resource.topic;


    viewResourceTags.innerHTML =
        resource.tags
            .map(tag => `
                <span
                    class="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">

                    ${escapeHTML(tag)}

                </span>
            `)
            .join("");


    viewResourceModal.classList.remove("hidden");
    viewResourceModal.classList.add("flex");


    lucide.createIcons();

}


// ------------------------------------------------------------
// Close View Modal
// ------------------------------------------------------------

function closeViewResourceModal() {

    viewResourceModal.classList.add("hidden");
    viewResourceModal.classList.remove("flex");

    currentViewingResource = null;

}


closeViewResourceBtn.addEventListener(
    "click",
    closeViewResourceModal
);


closeViewResourceFooterBtn.addEventListener(
    "click",
    closeViewResourceModal
);


// ------------------------------------------------------------
// Open Resource
// ------------------------------------------------------------

function openResource(id) {

    const resource =
        resources.find(item => item.id === id);


    if (!resource) {
        return;
    }


    window.open(
        resource.url,
        "_blank",
        "noopener,noreferrer"
    );

}


openResourceBtn.addEventListener("click", () => {

    if (!currentViewingResource) {
        return;
    }


    openResource(
        currentViewingResource.id
    );

});


// ------------------------------------------------------------
// Sidebar
// ------------------------------------------------------------

function openSidebar() {

    sidebar.classList.remove(
        "-translate-x-full"
    );

    mobileOverlay.classList.remove(
        "hidden"
    );

}


function closeSidebar() {

    sidebar.classList.add(
        "-translate-x-full"
    );

    mobileOverlay.classList.add(
        "hidden"
    );

}


openSidebarBtn.addEventListener(
    "click",
    openSidebar
);


closeSidebarBtn.addEventListener(
    "click",
    closeSidebar
);


mobileOverlay.addEventListener(
    "click",
    closeSidebar
);


// ------------------------------------------------------------
// Global Search
// ------------------------------------------------------------

const globalSearch =
    document.getElementById("globalSearch");


globalSearch.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Enter") {
            return;
        }


        const query =
            globalSearch.value.trim();


        if (!query) {
            return;
        }


        resourceSearch.value = query;

        renderResources();

    }
);


// ------------------------------------------------------------
// Toast
// ------------------------------------------------------------

let toastTimer;


function showToast(message) {

    toastMessage.textContent =
        message;


    toastNotification.classList.remove(
        "opacity-0",
        "translate-y-2"
    );

    toastNotification.classList.add(
        "opacity-100",
        "translate-y-0"
    );


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toastNotification.classList.remove(
            "opacity-100",
            "translate-y-0"
        );

        toastNotification.classList.add(
            "opacity-0",
            "translate-y-2"
        );

    }, 2500);

}


// ------------------------------------------------------------
// Escape Key - Close Modals / Sidebar
// ------------------------------------------------------------

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        closeResourceModal();

        closeViewResourceModal();

        closeSidebar();

    }
);


// ------------------------------------------------------------
// Close modal by clicking outside
// ------------------------------------------------------------

resourceModal.addEventListener(
    "click",
    event => {

        if (event.target === resourceModal) {
            closeResourceModal();
        }

    }
);


viewResourceModal.addEventListener(
    "click",
    event => {

        if (event.target === viewResourceModal) {
            closeViewResourceModal();
        }

    }
);


// ------------------------------------------------------------
// Initial Render
// ------------------------------------------------------------

renderResources();
