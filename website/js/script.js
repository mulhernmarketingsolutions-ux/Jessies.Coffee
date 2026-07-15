// Jessies. — shared site behavior

// Where the event inquiry form submits to — Jessie's Google Sheet + email
// Apps Script (logs each inquiry to a Sheet, emails the business + customer).
var QUOTE_ENDPOINT = "https://script.google.com/macros/s/AKfycbxbizhe24U7WBLeY0ngmEVKVDUUGxR_OXeYZSMXn8RpsK91MuuCExz6iM-x2CfHI-8s/exec";

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

  // Inquiry form: pre-select a package from a ?package= query param
  // (used by the "Choose This Package" buttons on the Pricing page),
  // validate required fields, then submit via fetch to QUOTE_ENDPOINT.
  var form = document.querySelector("#event-form");
  if (form) {
    var params = new URLSearchParams(window.location.search);
    var pkg = params.get("package");
    if (pkg) {
      var pkgField = form.querySelector("#package");
      if (pkgField) pkgField.value = pkg;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var msg = document.querySelector("#form-msg");
      var required = form.querySelectorAll("[required]");
      var missing = false;
      required.forEach(function (field) {
        if (!field.value.trim()) missing = true;
      });
      if (missing) {
        if (msg) {
          msg.textContent = "Please fill in all required fields before submitting.";
          msg.style.color = "#b3452c";
        }
        return;
      }

      var submitBtn = form.querySelector("button[type=submit]");
      var isAppsScript = QUOTE_ENDPOINT.indexOf("script.google.com") !== -1;

      if (submitBtn) submitBtn.disabled = true;
      if (msg) {
        msg.textContent = "Sending...";
        msg.style.color = "#7a5a41";
      }

      var fetchOptions = {
        method: "POST",
        body: new FormData(form)
      };
      // Apps Script Web Apps don't return CORS headers, so the browser
      // requires "no-cors" mode — that also means the response is opaque
      // and can't be checked, so a resolved fetch is treated as success.
      if (isAppsScript) {
        fetchOptions.mode = "no-cors";
      } else {
        fetchOptions.headers = { Accept: "application/json" };
      }

      fetch(QUOTE_ENDPOINT, fetchOptions)
        .then(function (response) {
          if (!isAppsScript && response && !response.ok) {
            throw new Error("Submission failed");
          }
          if (msg) {
            msg.textContent = "Thanks! We'll follow up within a few days.";
            msg.style.color = "#3f7a4a";
          }
          form.reset();
        })
        .catch(function () {
          if (msg) {
            msg.textContent = "Something went wrong — please email hello@jessies.coffee directly.";
            msg.style.color = "#b3452c";
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
});
