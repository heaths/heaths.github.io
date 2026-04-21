(function () {
  var LABELS = {
    light: "Color theme: light. Click to switch to dark.",
    dark: "Color theme: dark. Click to switch to light.",
  };
  var TITLES = {
    light: "Light theme",
    dark: "Dark theme",
  };

  function systemPreference() {
    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch (_) {
      return "light";
    }
  }

  function effectiveTheme() {
    try {
      var stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") return stored;
    } catch (_) {}
    return systemPreference();
  }

  function applyTheme(theme) {
    if (theme === systemPreference()) {
      try {
        localStorage.removeItem("theme");
      } catch (_) {}
      document.documentElement.removeAttribute("data-theme");
    } else {
      try {
        localStorage.setItem("theme", theme);
      } catch (_) {}
      document.documentElement.setAttribute("data-theme", theme);
    }
    updateButton(theme);
  }

  function updateButton(theme) {
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.setAttribute("aria-label", LABELS[theme] || LABELS.light);
      btn.setAttribute("title", TITLES[theme] || TITLES.light);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var current = effectiveTheme();
    updateButton(current);

    var btn = document.getElementById("theme-toggle");
    if (!btn) return;

    btn.addEventListener("click", function () {
      applyTheme(effectiveTheme() === "dark" ? "light" : "dark");
    });
  });
})();
