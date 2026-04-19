(function () {
    var THEMES = ["system", "light", "dark"];
    var LABELS = {
        system: "Color theme: system. Click to switch to light.",
        light: "Color theme: light. Click to switch to dark.",
        dark: "Color theme: dark. Click to switch to system.",
    };
    var TITLES = {
        system: "System theme",
        light: "Light theme",
        dark: "Dark theme",
    };

    function safeGet() {
        try {
            var val = localStorage.getItem("theme");
            return THEMES.indexOf(val) > 0 ? val : "system";
        } catch (_) {
            return "system";
        }
    }

    function safeSet(theme) {
        try {
            if (theme === "system") {
                localStorage.removeItem("theme");
            } else {
                localStorage.setItem("theme", theme);
            }
        } catch (_) {}
    }

    function applyTheme(theme) {
        safeSet(theme);
        if (theme === "system") {
            document.documentElement.removeAttribute("data-theme");
        } else {
            document.documentElement.setAttribute("data-theme", theme);
        }
        updateButton(theme);
    }

    function updateButton(theme) {
        var btn = document.getElementById("theme-toggle");
        if (btn) {
            btn.setAttribute("aria-label", LABELS[theme] || LABELS.system);
            btn.setAttribute("title", TITLES[theme] || TITLES.system);
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        var current = safeGet();
        updateButton(current);

        var btn = document.getElementById("theme-toggle");
        if (!btn) return;

        btn.addEventListener("click", function () {
            var idx = THEMES.indexOf(safeGet());
            applyTheme(THEMES[(idx + 1) % THEMES.length]);
        });
    });
})();
