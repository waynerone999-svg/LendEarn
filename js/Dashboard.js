
document.addEventListener("DOMContentLoaded", function () {

    console.log("LendEarnWorld Dashboard Loaded Successfully!");

    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");

    if (menuToggle && sidebar) {

        menuToggle.addEventListener("click", function () {

            sidebar.classList.toggle("sidebar-open");

            if (sidebar.classList.contains("sidebar-open")) {
                menuToggle.textContent = "✕";
                menuToggle.setAttribute("aria-label", "Close menu");
            } else {
                menuToggle.textContent = "☰";
                menuToggle.setAttribute("aria-label", "Open menu");
            }

        });

    }

});
