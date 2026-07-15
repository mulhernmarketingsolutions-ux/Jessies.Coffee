// Jessies. — shared site behavior

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var navWrap = document.querySelector(".nav-wrap");

  if (toggle && navWrap) {
    toggle.addEventListener("click", function () {
      navWrap.classList.toggle("open");
    });
  }

  // Highlight current page in nav
  var path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === path) {
      link.classList.add("active");
    }
  });

  // Scroll sipper — the cup drains as you scroll down the page
  var sipper = document.querySelector(".scroll-sipper");
  if (sipper) {
    var ticking = false;
    var updateSipper = function () {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var fraction = scrollable > 0 ? window.scrollY / scrollable : 0;
      fraction = Math.max(0, Math.min(1, fraction));
      var level = (1 - fraction).toFixed(3);
      document.documentElement.style.setProperty("--drink-level", level);
      ticking = false;
    };
    updateSipper();
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(updateSipper);
        ticking = true;
      }
    });
    window.addEventListener("resize", updateSipper);
  }

  // Basic client-side validation feedback for the inquiry form
  var form = document.querySelector("#event-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      var required = form.querySelectorAll("[required]");
      var missing = false;
      required.forEach(function (field) {
        if (!field.value.trim()) missing = true;
      });
      if (missing) {
        e.preventDefault();
        var msg = document.querySelector("#form-msg");
        if (msg) {
          msg.textContent = "Please fill in all required fields before submitting.";
          msg.style.color = "#b3452c";
        }
      }
    });
  }
});
