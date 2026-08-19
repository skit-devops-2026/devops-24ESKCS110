const sidebar = document.getElementById("sidebar");
const openSidebarBtn = document.getElementById("openSidebarBtn");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");
const mobileOverlay = document.getElementById("mobileOverlay");

function openSidebar() {
  sidebar.classList.remove("-translate-x-full");
  mobileOverlay.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function closeSidebar() {
  sidebar.classList.add("-translate-x-full");
  mobileOverlay.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

openSidebarBtn?.addEventListener("click", openSidebar);
closeSidebarBtn?.addEventListener("click", closeSidebar);
mobileOverlay?.addEventListener("click", closeSidebar);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSidebar();
  }
});
