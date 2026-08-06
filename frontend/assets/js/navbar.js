document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("header");

  // Add shadow and blur to header on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      header.classList.add("shadow-md", "backdrop-blur-lg");
    } else {
      header.classList.remove("shadow-md", "backdrop-blur-lg");
    }
  });
});
