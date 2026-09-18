// ============================================================
// DEADWAVE - GUNS
// ============================================================

const GUNS = {

    pistol: {
        id: "pistol",
        name: "M9 PISTOL",
        description: "Reliable semi-automatic sidearm.",
        damage: 25,
        fireRate: 280,
        magazine: 12,
        reload: 1100,
        spread: 0.025,
        bullets: 1,
        range: 900,
        price: 0,
        recoil: 2
    },

    smg: {
        id: "smg",
        name: "VECTOR SMG",
        description: "Extremely fast firing. Lower damage per shot.",
        damage: 14,
        fireRate: 85,
        magazine: 30,
        reload: 1500,
        spread: 0.075,
        bullets: 1,
        range: 850,
        price: 450,
        recoil: 3
    },

    shotgun: {
        id: "shotgun",
        name: "BREACH SHOTGUN",
        description: "Fires a powerful spread of pellets.",
        damage: 16,
        fireRate: 650,
        magazine: 6,
        reload: 1800,
        spread: 0.24,
        bullets: 8,
        range: 650,
        price: 700,
        recoil: 9
    },

    rifle: {
        id: "rifle",
        name: "ASSAULT RIFLE",
        description: "Balanced automatic rifle with good accuracy.",
        damage: 30,
        fireRate: 150,
        magazine: 25,
        reload: 1700,
        spread: 0.045,
        bullets: 1,
        range: 1100,
        price: 900,
        recoil: 4
    },

    revolver: {
        id: "revolver",
        name: "MAGNUM REVOLVER",
        description: "Slow firing but devastating damage.",
        damage: 70,
        fireRate: 600,
        magazine: 6,
        reload: 1900,
        spread: 0.018,
        bullets: 1,
        range: 1200,
        price: 1100,
        recoil: 10
    },

    lmg: {
        id: "lmg",
        name: "RAVAGER LMG",
        description: "Huge magazine and sustained fire.",
        damage: 21,
        fireRate: 120,
        magazine: 60,
        reload: 2500,
        spread: 0.11,
        bullets: 1,
        range: 950,
        price: 1500,
        recoil: 5
    },

    marksman: {
        id: "marksman",
        name: "MARKSMAN RIFLE",
        description: "High damage and excellent accuracy.",
        damage: 85,
        fireRate: 750,
        magazine: 8,
        reload: 1700,
        spread: 0.008,
        bullets: 1,
        range: 1500,
        price: 1800,
        recoil: 7
    }

};


// ============================================================
// GET GUN
// ============================================================

function getGun(id) {

    return GUNS[id] || GUNS.pistol;

}


// ============================================================
// CREATE A MAGAZINE
// ============================================================

function createGunAmmo(id) {

    const gun = getGun(id);

    return {
        ammo: gun.magazine,
        reloading: false,
        reloadStart: 0,
        lastShot: 0
    };

}


// ============================================================
// WEAPON DESCRIPTION
// ============================================================

function getGunDescription(id) {

    const gun = getGun(id);

    return `
        <strong>${gun.name}</strong><br>
        ${gun.description}<br><br>

        Damage: ${gun.damage}<br>
        Magazine: ${gun.magazine}<br>
        Fire delay: ${gun.fireRate}ms<br>
        Reload: ${gun.reload}ms<br>
        Pellets: ${gun.bullets}
    `;

}


// ============================================================
// FIRE GUN
// ============================================================

function fireGun(player, gunId, targetX, targetY) {

    if (!player) return;

    const gun = getGun(gunId);

    const now = performance.now();

    if (player.reloading) {
        return;
    }

    if (player.ammo <= 0) {
        startReload(player);
        return;
    }

    if (now - player.lastShot < gun.fireRate) {
        return;
    }

    player.lastShot = now;

    player.ammo--;

    // --------------------------------------------------------
    // Direction
    // --------------------------------------------------------

    let dx = targetX - player.x;
    let dy = targetY - player.y;

    const distance = Math.hypot(dx, dy);

    if (distance === 0) {
        return;
    }

    dx /= distance;
    dy /= distance;


    // --------------------------------------------------------
    // Fire pellets / bullets
    // --------------------------------------------------------

    for (let i = 0; i < gun.bullets; i++) {

        let angle = Math.atan2(dy, dx);

        angle +=
            (Math.random() - 0.5) *
            gun.spread;

        const bulletDX = Math.cos(angle);
        const bulletDY = Math.sin(angle);

        createBullet(
            player.x,
            player.y,
            bulletDX,
            bulletDY,
            gun
        );

    }


    // --------------------------------------------------------
    // Recoil
    // --------------------------------------------------------

    player.recoil =
        (player.recoil || 0) +
        gun.recoil;


    // --------------------------------------------------------
    // Empty magazine
    // --------------------------------------------------------

    if (player.ammo <= 0) {

        if (
            window.settings &&
            settings.autoReload
        ) {
            startReload(player);
        }

    }

}


// ============================================================
// BULLET
// ============================================================

function createBullet(x, y, dx, dy, gun) {

    if (!window.bullets) {
        window.bullets = [];
    }

    bullets.push({

        x: x,
        y: y,

        dx: dx,
        dy: dy,

        speed: 18,

        damage: gun.damage,

        distance: 0,

        maxDistance: gun.range,

        life: 1000,

        created: performance.now()

    });

}


// ============================================================
// UPDATE BULLETS
// ============================================================

function updateBullets(delta) {

    if (!window.bullets) {
        return;
    }

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        const bullet = bullets[i];

        const movement =
            bullet.speed * delta / 16.67;

        bullet.x += bullet.dx * movement;
        bullet.y += bullet.dy * movement;

        bullet.distance += movement;

        const age =
            performance.now() -
            bullet.created;


        // ----------------------------------------------------
        // Hit zombies
        // ----------------------------------------------------

        if (window.zombies) {

            let hit = false;

            for (const zombie of zombies) {

                if (zombie.dead) {
                    continue;
                }

                const dx =
                    bullet.x - zombie.x;

                const dy =
                    bullet.y - zombie.y;

                const distance =
                    Math.hypot(dx, dy);

                const hitRadius =
                    zombie.radius || 20;


                if (distance <= hitRadius) {

                    damageZombie(
                        zombie,
                        bullet.damage,
                        bullet.x,
                        bullet.y
                    );

                    hit = true;
                    break;

                }

            }

            if (hit) {

                bullets.splice(i, 1);

                continue;

            }

        }


        // ----------------------------------------------------
        // Remove old bullets
        // ----------------------------------------------------

        if (
            bullet.distance >=
            bullet.maxDistance ||
            age >= bullet.life
        ) {

            bullets.splice(i, 1);

        }

    }

}


// ============================================================
// RELOAD
// ============================================================

function startReload(player) {

    if (!player) {
        return;
    }

    const gun =
        getGun(player.weapon);


    if (player.reloading) {
        return;
    }

    if (player.ammo >= gun.magazine) {
        return;
    }


    player.reloading = true;

    player.reloadStart =
        performance.now();

}


// ============================================================
// UPDATE RELOAD
// ============================================================

function updateReload(player) {

    if (!player || !player.reloading) {
        return;
    }

    const gun =
        getGun(player.weapon);

    const elapsed =
        performance.now() -
        player.reloadStart;


    if (elapsed >= gun.reload) {

        player.ammo =
            gun.magazine;

        player.reloading = false;

        player.reloadStart = 0;

    }

}


// ============================================================
// SWITCH WEAPON
// ============================================================

function equipWeapon(player, weaponId) {

    if (!player) {
        return false;
    }

    if (!GUNS[weaponId]) {
        return false;
    }

    player.weapon = weaponId;

    const gun =
        getGun(weaponId);

    player.ammo =
        gun.magazine;

    player.reloading = false;

    player.reloadStart = 0;

    player.lastShot = 0;

    return true;

}


// ============================================================
// GUN STAT FORMAT
// ============================================================

function getGunStatsText(id) {

    const gun =
        getGun(id);

    return (
        `${gun.damage} DMG · ` +
        `${gun.magazine} MAG · ` +
        `${gun.fireRate}ms FIRE · ` +
        `${gun.reload}ms RELOAD`
    );

}
