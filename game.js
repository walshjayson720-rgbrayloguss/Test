// ============================================================
// DEADWAVE - SETTINGS.JS
// ============================================================

window.settings = {
    crosshair: true,
    healthBars: true,
    damageNumbers: true,
    screenShake: true,
    particles: true,
    autoReload: true
};

// ------------------------------------------------------------
// APPLY SETTINGS
// ------------------------------------------------------------

function applySettings() {
    const crosshair = document.getElementById("crosshair");

    if (crosshair) {
        crosshair.style.display = window.settings.crosshair ? "block" : "none";
    }

    // Save settings
    try {
        localStorage.setItem(
            "deadwaveSettings",
            JSON.stringify(window.settings)
        );
    } catch (error) {
        console.warn("Could not save settings.");
    }

    // Update checkbox states
    const checkboxMap = {
        setCrosshair: "crosshair",
        setBars: "healthBars",
        setNumbers: "damageNumbers",
        setShake: "screenShake",
        setParticles: "particles",
        setAutoReload: "autoReload"
    };

    Object.keys(checkboxMap).forEach(elementId => {
        const checkbox = document.getElementById(elementId);
        const settingName = checkboxMap[elementId];

        if (checkbox) {
            checkbox.checked = window.settings[settingName];
        }
    });
}

// ------------------------------------------------------------
// LOAD SAVED SETTINGS
// ------------------------------------------------------------

function loadSettings() {
    try {
        const saved = localStorage.getItem("deadwaveSettings");

        if (!saved) {
            return;
        }

        const parsed = JSON.parse(saved);

        if (typeof parsed.crosshair === "boolean") {
            window.settings.crosshair = parsed.crosshair;
        }

        if (typeof parsed.healthBars === "boolean") {
            window.settings.healthBars = parsed.healthBars;
        }

        if (typeof parsed.damageNumbers === "boolean") {
            window.settings.damageNumbers = parsed.damageNumbers;
        }

        if (typeof parsed.screenShake === "boolean") {
            window.settings.screenShake = parsed.screenShake;
        }

        if (typeof parsed.particles === "boolean") {
            window.settings.particles = parsed.particles;
        }

        if (typeof parsed.autoReload === "boolean") {
            window.settings.autoReload = parsed.autoReload;
        }

    } catch (error) {
        console.warn("Could not load saved settings.");
    }
}

// ------------------------------------------------------------
// OPEN SETTINGS
// ------------------------------------------------------------

function openSettings() {
    const settingsScreen = document.getElementById("settings");

    if (!settingsScreen) {
        return;
    }

    settingsScreen.classList.remove("hidden");

    applySettings();
}

// ------------------------------------------------------------
// CLOSE SETTINGS
// ------------------------------------------------------------

function closeSettings() {
    const settingsScreen = document.getElementById("settings");

    if (!settingsScreen) {
        return;
    }

    settingsScreen.classList.add("hidden");
}

// ------------------------------------------------------------
// SETUP CHECKBOXES
// ------------------------------------------------------------

function setupSettings() {
    const checkboxMap = {
        setCrosshair: "crosshair",
        setBars: "healthBars",
        setNumbers: "damageNumbers",
        setShake: "screenShake",
        setParticles: "particles",
        setAutoReload: "autoReload"
    };

    Object.entries(checkboxMap).forEach(([elementId, settingName]) => {
        const checkbox = document.getElementById(elementId);

        if (!checkbox) {
            return;
        }

        checkbox.addEventListener("change", () => {
            window.settings[settingName] = checkbox.checked;

            applySettings();
        });
    });

    const closeButton1 = document.getElementById("closeSettings");
    const closeButton2 = document.getElementById("closeSettings2");

    if (closeButton1) {
        closeButton1.addEventListener("click", closeSettings);
    }

    if (closeButton2) {
        closeButton2.addEventListener("click", closeSettings);
    }

    applySettings();
}

// ------------------------------------------------------------
// INITIALIZE
// ------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    setupSettings();
    applySettings();
});
