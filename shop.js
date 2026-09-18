// ============================================================
// DEADWAVE - SHOP + UPGRADES
// ============================================================

const UPGRADES = {

    health: {
        id: "health",
        name: "REINFORCED HEALTH",
        description: "Increase your maximum health.",
        maxLevel: 5,

        apply(player) {
            player.maxHp += 25;
            player.hp += 25;
        },

        effect(player) {
            return `+25 maximum health`;
        }
    },


    speed: {
        id: "speed",
        name: "MOVEMENT SPEED",
        description: "Move faster while walking.",
        maxLevel: 5,

        apply(player) {
            player.speedMultiplier =
                (player.speedMultiplier || 1) + 0.10;
        },

        effect(player) {
            return `+10% movement speed`;
        }
    },


    reload: {
        id: "reload",
        name: "FAST RELOAD",
        description: "Reload your weapons faster.",
        maxLevel: 5,

        apply(player) {
            player.reloadMultiplier =
                (player.reloadMultiplier || 1) - 0.10;

            player.reloadMultiplier =
                Math.max(
                    0.5,
                    player.reloadMultiplier
                );
        },

        effect(player) {
            return `+10% reload speed`;
        }
    },


    damage: {
        id: "damage",
        name: "STOPPING POWER",
        description: "Increase damage from every weapon.",
        maxLevel: 5,

        apply(player) {
            player.damageMultiplier =
                (player.damageMultiplier || 1) + 0.12;
        },

        effect(player) {
            return `+12% weapon damage`;
        }
    },


    accuracy: {
        id: "accuracy",
        name: "STEADY AIM",
        description: "Reduce weapon spread.",
        maxLevel: 5,

        apply(player) {
            player.accuracyMultiplier =
                (player.accuracyMultiplier || 1) - 0.12;

            player.accuracyMultiplier =
                Math.max(
                    0.35,
                    player.accuracyMultiplier
                );
        },

        effect(player) {
            return `-12% weapon spread`;
        }
    },


    sprint: {
        id: "sprint",
        name: "ATHLETIC TRAINING",
        description: "Increase sprint speed and stamina.",
        maxLevel: 5,

        apply(player) {
            player.sprintMultiplier =
                (player.sprintMultiplier || 1) + 0.12;

            player.maxStamina += 10;
            player.stamina = player.maxStamina;
        },

        effect(player) {
            return `+12% sprint power and +10 stamina`;
        }
    },


    critical: {
        id: "critical",
        name: "CRITICAL STRIKE",
        description: "Increase your chance of dealing critical damage.",
        maxLevel: 5,

        apply(player) {
            player.critChance =
                (player.critChance || 0) + 0.06;

            player.critMultiplier =
                player.critMultiplier || 2;
        },

        effect(player) {
            return `+6% critical-hit chance`;
        }
    },


    magazine: {
        id: "magazine",
        name: "EXTENDED MAG",
        description: "Increase magazine capacity.",
        maxLevel: 5,

        apply(player) {
            player.magazineBonus =
                (player.magazineBonus || 0) + 3;

            player.ammo += 3;
        },

        effect(player) {
            return `+3 rounds per magazine`;
        }
    }

};


// ============================================================
// SHOP WEAPONS
// ============================================================

const SHOP_WEAPONS = [

    "smg",
    "shotgun",
    "rifle",
    "revolver",
    "lmg",
    "marksman"

];


// ============================================================
// SHOP OPEN / CLOSE
// ============================================================

function openShop() {

    const shop =
        document.getElementById("shop");

    if (!shop) {
        return;
    }

    shop.classList.remove("hidden");

    updateShop();

}


function closeShop() {

    const shop =
        document.getElementById("shop");

    if (!shop) {
        return;
    }

    shop.classList.add("hidden");

}


// ============================================================
// RENDER SHOP
// ============================================================

function updateShop() {

    const container =
        document.getElementById("shopItems");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    // --------------------------------------------------------
    // Weapons
    // --------------------------------------------------------

    for (const weaponId of SHOP_WEAPONS) {

        const gun =
            getGun(weaponId);

        const owned =
            window.player &&
            player.ownedWeapons &&
            player.ownedWeapons.includes(
                weaponId
            );

        const equipped =
            window.player &&
            player.weapon === weaponId;


        const card =
            document.createElement("div");

        card.className =
            "shopCard";


        card.innerHTML = `

            <h3>${gun.name}</h3>

            <p>
                ${gun.description}
            </p>

            <div class="stats">

                Damage:
                <b>${gun.damage}</b><br>

                Magazine:
                <b>${gun.magazine}</b><br>

                Fire delay:
                <b>${gun.fireRate}ms</b><br>

                Reload:
                <b>${gun.reload}ms</b><br>

                Pellets:
                <b>${gun.bullets}</b>

            </div>

        `;


        const button =
            document.createElement("button");


        if (equipped) {

            button.textContent =
                "EQUIPPED";

            button.disabled = true;

        } else if (owned) {

            button.textContent =
                "EQUIP";

            button.onclick = () => {

                equipWeapon(
                    player,
                    weaponId
                );

                updateHUDSafe();
                updateShop();

            };

        } else {

            button.textContent =
                `BUY — $${gun.price}`;


            button.onclick = () => {

                if (!window.player) {
                    return;
                }


                if (
                    player.money <
                    gun.price
                ) {

                    showShopMessage(
                        "Not enough money."
                    );

                    return;
                }


                player.money -=
                    gun.price;


                if (
                    !player.ownedWeapons
                ) {

                    player.ownedWeapons =
                        ["pistol"];

                }


                player.ownedWeapons.push(
                    weaponId
                );


                equipWeapon(
                    player,
                    weaponId
                );


                updateHUDSafe();
                updateShop();

            };

        }


        card.appendChild(button);

        container.appendChild(card);

    }


    // --------------------------------------------------------
    // Shop upgrades
    // --------------------------------------------------------

    for (const id of Object.keys(UPGRADES)) {

        const upgrade =
            UPGRADES[id];


        const level =
            getUpgradeLevel(id);


        const card =
            document.createElement("div");

        card.className =
            "shopCard";


        card.innerHTML = `

            <h3>${upgrade.name}</h3>

            <p>
                ${upgrade.description}
            </p>

            <div class="stats">

                Current level:
                <b>${level}/${upgrade.maxLevel}</b><br>

                ${upgrade.effect(player)}

            </div>

        `;


        const button =
            document.createElement("button");


        const cost =
            getShopUpgradeCost(
                id,
                level
            );


        if (
            level >=
            upgrade.maxLevel
        ) {

            button.textContent =
                "MAX LEVEL";

            button.disabled = true;

        } else {

            button.textContent =
                `BUY — $${cost}`;


            button.onclick = () => {

                buyShopUpgrade(id);

            };

        }


        card.appendChild(button);

        container.appendChild(card);

    }

}


// ============================================================
// SHOP UPGRADE LEVELS
// ============================================================

function getUpgradeLevel(id) {

    if (
        !window.player ||
        !player.upgrades
    ) {
        return 0;
    }

    return player.upgrades[id] || 0;

}


// ============================================================
// SHOP UPGRADE COST
// ============================================================

function getShopUpgradeCost(
    id,
    level
) {

    // Every level gets more expensive.
    return Math.round(
        300 *
        Math.pow(
            1.65,
            level
        )
    );

}


// ============================================================
// BUY SHOP UPGRADE
// ============================================================

function buyShopUpgrade(id) {

    if (!window.player) {
        return;
    }


    const upgrade =
        UPGRADES[id];


    if (!upgrade) {
        return;
    }


    const level =
        getUpgradeLevel(id);


    if (
        level >=
        upgrade.maxLevel
    ) {

        return;
    }


    const cost =
        getShopUpgradeCost(
            id,
            level
        );


    if (
        player.money <
        cost
    ) {

        showShopMessage(
            "Not enough money."
        );

        return;
    }


    player.money -= cost;


    if (!player.upgrades) {
        player.upgrades = {};
    }


    player.upgrades[id] =
        level + 1;


    upgrade.apply(player);


    updateHUDSafe();

    updateShop();

}


// ============================================================
// THREE UPGRADE CHOICES
// ============================================================

function showUpgradeScreen() {

    if (!window.player) {
        return;
    }


    const overlay =
        document.getElementById("upgrade");

    const container =
        document.getElementById("upgradeCards");


    if (!overlay || !container) {
        return;
    }


    container.innerHTML = "";


    // Pick three different upgrades.
    const ids =
        Object.keys(UPGRADES)
            .filter(id =>
                getUpgradeLevel(id) <
                UPGRADES[id].maxLevel
            );


    shuffleArray(ids);


    const choices =
        ids.slice(
            0,
            Math.min(3, ids.length)
        );


    for (const id of choices) {

        const upgrade =
            UPGRADES[id];


        const level =
            getUpgradeLevel(id);


        const card =
            document.createElement("div");

        card.className =
            "upgradeCard";


        card.innerHTML = `

            <h3>
                ${upgrade.name}
            </h3>

            <span class="level">
                LEVEL ${level}/${upgrade.maxLevel}
            </span>

            <p>
                ${upgrade.description}
            </p>

            <div class="stats">
                ${upgrade.effect(player)}
            </div>

        `;


        const button =
            document.createElement("button");


        button.textContent =
            "TAKE UPGRADE";


        button.onclick = () => {

            chooseUpgrade(id);

        };


        card.appendChild(button);

        container.appendChild(card);

    }


    overlay.classList.remove(
        "hidden"
    );

}


// ============================================================
// CHOOSE UPGRADE
// ============================================================

function chooseUpgrade(id) {

    if (!window.player) {
        return;
    }


    const upgrade =
        UPGRADES[id];


    if (!upgrade) {
        return;
    }


    const level =
        getUpgradeLevel(id);


    if (
        level >=
        upgrade.maxLevel
    ) {

        return;
    }


    if (!player.upgrades) {
        player.upgrades = {};
    }


    player.upgrades[id] =
        level + 1;


    upgrade.apply(player);


    const overlay =
        document.getElementById("upgrade");


    if (overlay) {

        overlay.classList.add(
            "hidden"
        );

    }


    // Resume the next wave.
    if (
        typeof resumeAfterUpgrade ===
        "function"
    ) {

        resumeAfterUpgrade();

    }


    updateHUDSafe();

}


// ============================================================
// MESSAGE
// ============================================================

function showShopMessage(message) {

    let messageBox =
        document.getElementById(
            "shopMessage"
        );


    if (!messageBox) {

        messageBox =
            document.createElement("div");

        messageBox.id =
            "shopMessage";

        messageBox.style.position =
            "fixed";

        messageBox.style.left =
            "50%";

        messageBox.style.top =
            "20px";

        messageBox.style.transform =
            "translateX(-50%)";

        messageBox.style.zIndex =
            "10000";

        messageBox.style.padding =
            "12px 18px";

        messageBox.style.border =
            "1px solid #394655";

        messageBox.style.borderRadius =
            "8px";

        messageBox.style.background =
            "rgba(10,14,19,.95)";

        messageBox.style.color =
            "white";

        messageBox.style.fontWeight =
            "800";

        document.body.appendChild(
            messageBox
        );

    }


    messageBox.textContent =
        message;


    clearTimeout(
        window.shopMessageTimeout
    );


    window.shopMessageTimeout =
        setTimeout(() => {

            messageBox.remove();

        }, 1500);

}


// ============================================================
// ARMORY
// ============================================================

function openArmory() {

    const overlay =
        document.getElementById("armory");

    if (!overlay) {
        return;
    }


    renderArmory();

    overlay.classList.remove(
        "hidden"
    );

}


function closeArmory() {

    const overlay =
        document.getElementById("armory");

    if (!overlay) {
        return;
    }


    overlay.classList.add(
        "hidden"
    );

}


// ============================================================
// RENDER ARMORY
// ============================================================

function renderArmory() {

    const container =
        document.getElementById(
            "armoryItems"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    for (
        const weaponId of
        Object.keys(GUNS)
    ) {

        const gun =
            GUNS[weaponId];


        const owned =
            window.player &&
            player.ownedWeapons &&
            player.ownedWeapons.includes(
                weaponId
            );


        const card =
            document.createElement("div");

        card.className =
            "shopCard";


        card.innerHTML = `

            <h3>
                ${gun.name}
            </h3>

            <p>
                ${gun.description}
            </p>

            <div class="stats">

                Damage:
                ${gun.damage}<br>

                Magazine:
                ${gun.magazine}<br>

                Fire rate:
                ${gun.fireRate}ms<br>

                Reload:
                ${gun.reload}ms<br>

                Accuracy:
                ${Math.round(
                    (1 - gun.spread) * 100
                )}%

            </div>

        `;


        const button =
            document.createElement("button");


        if (
            window.player &&
            player.weapon === weaponId
        ) {

            button.textContent =
                "EQUIPPED";

            button.disabled = true;

        } else if (owned) {

            button.textContent =
                "EQUIP";

            button.onclick = () => {

                equipWeapon(
                    player,
                    weaponId
                );

                renderArmory();

                updateHUDSafe();

            };

        } else {

            button.textContent =
                `LOCKED — $${gun.price}`;

            button.disabled = true;

        }


        card.appendChild(button);

        container.appendChild(card);

    }

}


// ============================================================
// SAFE HUD UPDATE
// ============================================================

function updateHUDSafe() {

    if (
        typeof updateHUD ===
        "function"
    ) {

        updateHUD();

    }

}


// ============================================================
// SHUFFLE
// ============================================================

function shuffleArray(array) {

    for (
        let i =
            array.length - 1;

        i > 0;

        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];

    }


    return array;

}


// ============================================================
// SHOP BUTTONS
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const shopButton =
            document.getElementById(
                "shopBtn"
            );


        const closeShopButton =
            document.getElementById(
                "closeShop"
            );


        const armoryButton =
            document.getElementById(
                "armoryBtn"
            );


        const closeArmoryButton =
            document.getElementById(
                "closeArmory"
            );


        if (shopButton) {

            shopButton.addEventListener(
                "click",
                () => {

                    openShop();

                }
            );

        }


        if (closeShopButton) {

            closeShopButton.addEventListener(
                "click",
                () => {

                    closeShop();

                }
            );

        }


        if (armoryButton) {

            armoryButton.addEventListener(
                "click",
                () => {

                    openArmory();

                }
            );

        }


        if (closeArmoryButton) {

            closeArmoryButton.addEventListener(
                "click",
                () => {

                    closeArmory();

                }
            );

        }

    }
);
