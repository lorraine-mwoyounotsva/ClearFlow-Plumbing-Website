// ClearFlow Plumbing - site scripts
(function () {
  // Always open pages at the top, never at the previous scroll position
  try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (e) {}
  function toTop() { window.scrollTo(0, 0); }
  toTop();
  window.addEventListener("load", toTop);
  window.addEventListener("pageshow", toTop);

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
  }

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Map: load Google Maps when the site runs on its own,
  // show the drawn map when it is embedded in a preview frame.
  document.querySelectorAll(".map[data-map]").forEach(function (box) {
    var embedded = false;
    try { embedded = window.self !== window.top; } catch (e) { embedded = true; }
    if (embedded) return; // keep the fallback image
    var frame = document.createElement("iframe");
    frame.src = box.getAttribute("data-map");
    frame.loading = "lazy";
    frame.title = "ClearFlow Plumbing location map";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    box.innerHTML = "";
    box.appendChild(frame);
  });

  // ZIP code checker (Areas page)
  var zipForm = document.getElementById("zip-form");
  if (zipForm) {
    var served = {
      "972": "Portland", "970": "Portland metro", "986": "Vancouver, WA"
    };
    zipForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("zip");
      var out = document.getElementById("zip-result");
      var zip = input.value.trim();
      out.className = "zip-result";
      if (!/^\d{5}$/.test(zip)) {
        out.textContent = "Please enter a 5-digit ZIP code.";
        out.classList.add("no");
        return;
      }
      var area = served[zip.slice(0, 3)];
      if (area) {
        out.textContent = "Good news, " + zip + " is inside our " + area + " service area. Same-day visits available.";
        out.classList.add("ok");
      } else {
        out.textContent = "We don't usually cover " + zip + ", but call us. We can often help or refer a trusted plumber.";
        out.classList.add("no");
      }
    });
  }

  // Quote form validation
  var form = document.getElementById("quote-form");
  if (form) {
    var rules = {
      name: function (v) { return v.trim().length > 1; },
      phone: function (v) { return v.replace(/\D/g, "").length >= 7; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      service: function (v) { return v !== ""; },
      address: function (v) { return v.trim().length > 4; },
      message: function (v) { return v.trim().length > 9; }
    };

    function check(name) {
      var el = form.elements[name];
      var field = el.closest(".field");
      var ok = rules[name](el.value);
      field.classList.toggle("error", !ok);
      return ok;
    }

    Object.keys(rules).forEach(function (name) {
      form.elements[name].addEventListener("blur", function () { check(name); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var allOk = true;
      Object.keys(rules).forEach(function (name) { if (!check(name)) allOk = false; });
      if (!allOk) {
        var first = form.querySelector(".field.error input, .field.error select, .field.error textarea");
        if (first) first.focus();
        return;
      }
      // Connect a form service (Formspree, Netlify Forms, PHP mailer) here to receive quotes by email.
      var first = form.elements.name.value.trim().split(" ")[0];
      document.getElementById("success-name").textContent = first;
      form.style.display = "none";
      document.querySelector(".form-intro").style.display = "none";
      document.getElementById("form-success").classList.add("show");
    });

    var again = document.getElementById("form-again");
    if (again) {
      again.addEventListener("click", function () {
        form.reset();
        form.style.display = "";
        document.querySelector(".form-intro").style.display = "";
        document.getElementById("form-success").classList.remove("show");
      });
    }
  }
})();
