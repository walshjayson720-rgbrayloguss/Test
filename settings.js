"use strict";

window.settings = {
    crosshair: true,
    healthBars: true,
    damageNumbers: true,
    screenShake: true,
    particles: true,
    autoReload: true
};

function saveSettings() {
    try {
        localStorage.setItem(
            "deadwaveSettings",
            JSON.stringify(window.settings)
        );
    } catch (error) {
        console.warn("Settings could not be saved.");
    }
}

function loadSettings() {
    try {
        const saved = localStorage.getItem("deadwaveSettings");

        if (saved) {
            const data = JSON.parse(saved);

            Object.keys(window.settings).forEach(key => {
                if (typeof data[key] === "boolean") {
                    window.settings[key] = data[key];
                }
            });
        }
    } catch (error) {
        console.warn("Settings could not be loaded.");
    }
}

function applySettings() {
    const crosshair = document.getElementById("crosshair");

    if (crosshair) {
        crosshair.style.display =
            window.settings.crosshair ? "block" : "none";
    }

    const settingsMap = {
        setCrosshair: "crosshair",
        setBars: "healthBars",
        setNumbers: "damageNumbers",
        setShake: "screenShake",
        setParticles: "particles",
        setAutoReload: "autoReload"
    };

    Object.entries(settingsMap).forEach(([id, setting]) => {
        const checkbox = document.getElementById(id);

        if (checkbox) {
            checkbox.checked = window.settings[setting];
        }
    });

    saveSettings();
}

function openSettings() {
    const settings = document.getElementById("settings");

    if (!settings) return;

    settings.classList.remove("hidden");
    settings.style.display = "flex";
    settings.style.pointerEvents = "auto";

    applySettings();
}

function closeSettings() {
    const settings = document.getElementById("settings");

    if (!settings) return;

    settings.classList.add("hidden");
}

window.openSettings = openSettings;
window.closeSettings = closeSettings;

document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    applySettings();

    const settingsMap = {
        setCrosshair: "crosshair",
        setBars: "healthBars",
        setNumbers: "damageNumbers",
        setShake: "screenShake",
        setParticles: "particles",
        setAutoReload: "autoReload"
    };

    Object.entries(settingsMap).forEach(([id, setting]) => {
        const checkbox = document.getElementById(id);

        if (checkbox) {
            checkbox.addEventListener("change", () => {
                window.settings[setting] = checkbox.checked;
                applySettings();
            });
        }
    });

    const close1 = document.getElementById("closeSettings");
    const close2 = document.getElementById("closeSettings2");

    if (close1) {
        close1.addEventListener("click", closeSettings);
    }

    if (close2) {
        close2.addEventListener("click", closeSettings);
    }
});
