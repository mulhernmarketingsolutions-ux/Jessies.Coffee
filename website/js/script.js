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

  // Generic handler: validates required fields, then submits a form via
  // fetch to QUOTE_ENDPOINT (shared by the event inquiry form and every
  // lead-magnet signup form). successMsg is shown when the submit resolves.
  function wireForm(form, msg, successMsg) {
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var required = form.querySelectorAll("[required]");
      var missing = false;
      required.forEach(function (field) {
        if (!field.value.trim()) missing = true;
      });
      if (missing) {
        if (msg) {
          msg.textContent = "Please fill in the required field(s) before submitting.";
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
            msg.textContent = successMsg;
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

  // Event inquiry form: pre-select a package from a ?package= query param
  // (used by the "Choose This Package" buttons on the Pricing page).
  var eventForm = document.querySelector("#event-form");
  if (eventForm) {
    var params = new URLSearchParams(window.location.search);
    var pkg = params.get("package");
    if (pkg) {
      var pkgField = eventForm.querySelector("#package");
      if (pkgField) pkgField.value = pkg;
    }
    wireForm(eventForm, document.querySelector("#form-msg"), "Thanks! We'll follow up within a few days.");
  }

  // Lead magnet signup forms (there may be more than one on a page's
  // worth of copy — Home and Menu both have one). Each form's message
  // paragraph is the element immediately after it in the markup.
  document.querySelectorAll(".lead-magnet-form").forEach(function (lmForm) {
    wireForm(lmForm, lmForm.nextElementSibling, "Sent! Check your inbox for the guide.");
  });
});
