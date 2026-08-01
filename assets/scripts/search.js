(function () {
  // cspell:ignore contenteditable
  function isEditableTarget(target) {
    if (!(target instanceof Element)) {
      return false;
    }

    return !!target.closest(
      "input, textarea, select, [contenteditable], [contenteditable='plaintext-only']",
    );
  }

  function searchUrl(query) {
    var terms = "site:heaths.dev";
    if (query) {
      terms = query + " " + terms;
    }
    return "https://duckduckgo.com/?q=" + encodeURIComponent(terms);
  }

  function isMacOS() {
    var platform =
      (navigator.userAgentData && navigator.userAgentData.platform) ||
      navigator.platform ||
      "";

    return /mac/i.test(platform);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var macOS = isMacOS();
    var root = document.getElementById("header-search");
    var form = document.getElementById("header-search-form");
    var input = document.getElementById("header-search-input");
    var toggle = document.getElementById("search-toggle");

    if (!root || !form || !input || !toggle) {
      return;
    }

    var shortcutLabel = macOS ? "\u2318K" : "Ctrl+K";
    toggle.setAttribute(
      "aria-label",
      "Search on DuckDuckGo. Press " + shortcutLabel + " to open.",
    );
    toggle.title = "Search on DuckDuckGo (" + shortcutLabel + ")";

    function isOpen() {
      return root.classList.contains("is-open");
    }

    function openSearch() {
      root.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      input.focus();
      input.select();
    }

    function closeSearch(focusToggle) {
      root.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");

      if (focusToggle) {
        toggle.focus();
      }
    }

    toggle.addEventListener("click", function (event) {
      event.preventDefault();

      if (isOpen()) {
        closeSearch(false);
        return;
      }

      openSearch();
    });

    root.addEventListener("focusout", function () {
      window.setTimeout(function () {
        if (!root.contains(document.activeElement)) {
          closeSearch(false);
        }
      }, 0);
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeSearch(true);
      }
    });

    document.addEventListener("keydown", function (event) {
      var isShortcut = event.ctrlKey || (macOS && event.metaKey);

      if (
        event.defaultPrevented ||
        event.altKey ||
        !isShortcut ||
        event.key.toLowerCase() !== "k" ||
        (event.ctrlKey && event.metaKey) ||
        isEditableTarget(event.target)
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      openSearch();
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      window.location.assign(searchUrl(input.value.trim()));
    });
  });
})();
