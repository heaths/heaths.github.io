(function () {
  var LABELS = {
    light: "Color theme: light. Click to switch to dark.",
    dark: "Color theme: dark. Click to switch to light.",
  };
  var TITLES = {
    light: "Click to switch to dark theme",
    dark: "Click to switch to light theme",
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

  // The stylesheet keys off html[data-theme], so always set it. Only save a
  // choice that differs from the system preference.
  function applyTheme(theme) {
    try {
      if (theme === systemPreference()) {
        localStorage.removeItem("theme");
      } else {
        localStorage.setItem("theme", theme);
      }
    } catch (_) {}
    document.documentElement.setAttribute("data-theme", theme);
    updateButton(theme);
  }

  // Follow system changes unless a choice was saved.
  try {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function () {
        var theme = effectiveTheme();
        document.documentElement.setAttribute("data-theme", theme);
        updateButton(theme);
      });
  } catch (_) {}

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
