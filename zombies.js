// ============================================================
// DEADWAVE - ZOMBIES
// ============================================================

const ZOMBIE_TYPES = {

    walker: {
        id: "walker",
        name: "WALKER",

        health: 100,
        speed: 1.05,
        damage: 10,
        attackRange: 28,
        attackCooldown: 900,

        radius: 19,

        reward: 10,

        color: "#71945c",
        darkColor: "#30432a",

        description:
            "Basic zombie. Slow, predictable, and dangerous in groups."
    },


    runner: {
        id: "runner",
        name: "RUNNER",

        health: 65,
        speed: 2.35,
        damage: 8,
        attackRange: 25,
        attackCooldown: 700,

        radius: 15,

        reward: 18,

        color: "#c67c68",
        darkColor: "#633d37",

        description:
            "Very fast but fragile. Can quickly close the distance."
    },


    tank: {
        id: "tank",
        name: "TANK",

        health: 420,
        speed: 0.55,
        damage: 24,
        attackRange: 34,
        attackCooldown: 1200,

        radius: 31,

        reward: 45,

        color: "#555d67",
        darkColor: "#272c32",

        description:
            "Huge health pool and heavy attacks, but extremely slow."
    },


    crawler: {
        id: "crawler",
        name: "CRAWLER",

        health: 80,
        speed: 2.0,
        damage: 7,
        attackRange: 22,
        attackCooldown: 600,

        radius: 12,

        reward: 16,

        color: "#8c8f65",
        darkColor: "#45472f",

        description:
            "Small and quick. Harder to hit because of its low profile."
    },


    armored: {
        id: "armored",
        name: "ARMORED",

        health: 190,
        speed: 0.9,
        damage: 15,
        attackRange: 29,
        attackCooldown: 900,

        radius: 21,

        reward: 30,

        damageReduction: 0.35,

        color: "#78808a",
        darkColor: "#30363d",

        description:
            "Wears protective armor that reduces incoming damage."
    },


    spitter: {
        id: "spitter",
        name: "SPITTER",

        health: 120,
        speed: 0.75,
        damage: 6,
        attackRange: 300,
        attackCooldown: 2200,

        radius: 20,

        reward: 28,

        projectileDamage: 14,
        projectileSpeed: 5,

        color: "#72b26a",
        darkColor: "#304e2e",

        description:
            "Keeps its distance and fires damaging projectiles."
    },


    exploder: {
        id: "exploder",
        name: "EXPLODER",

        health: 90,
        speed: 1.65,
        damage: 35,
        attackRange: 42,
        attackCooldown: 1000,

        radius: 18,

        reward: 32,

        explosionRadius: 95,

        color: "#d0a343",
        darkColor: "#61491d",

        description:
            "Rushes the player and creates a large explosion when defeated."
    }

};


// ============================================================
// GLOBAL ZOMBIE ARRAY
// ============================================================

if (!window.zombies) {
    window.zombies = [];
}


// ============================================================
// CREATE ZOMBIE
// ============================================================

function createZombie(typeId, x, y, wave = 1) {

    const base =
        ZOMBIE_TYPES[typeId] ||
        ZOMBIE_TYPES.walker;

    const healthScale =
        1 + Math.max(0, wave - 1) * 0.10;

    const speedScale =
        1 + Math.min(0.30, Math.max(0, wave - 1) * 0.012);

    const zombie = {

        id:
            Math.random()
            .toString(36)
            .slice(2),

        type:
            typeId,

        name:
            base.name,

        x:
            x,

        y:
            y,

        radius:
            base.radius,

        maxHealth:
            Math.round(
                base.health *
                healthScale
            ),

        health:
            Math.round(
                base.health *
                healthScale
            ),

        speed:
            base.speed *
            speedScale,

        damage:
            base.damage *
            (1 + Math.max(0, wave - 1) * 0.035),

        attackRange:
            base.attackRange,

        attackCooldown:
            base.attackCooldown,

        lastAttack:
            0,

        reward:
            Math.round(
                base.reward *
                (1 + Math.max(0, wave - 1) * 0.04)
            ),

        damageReduction:
            base.damageReduction || 0,

        projectileDamage:
            base.projectileDamage || 0,

        projectileSpeed:
            base.projectileSpeed || 0,

        explosionRadius:
            base.explosionRadius || 0,

        color:
            base.color,

        darkColor:
            base.darkColor,

        dead:
            false,

        hitFlash:
            0,

        attackAnimation:
            0,

        wobble:
            Math.random() * Math.PI * 2

    };


    zombies.push(zombie);

    return zombie;
}


// ============================================================
// CHOOSE ZOMBIE TYPE
// ============================================================

function chooseZombieType(wave) {

    const roll =
        Math.random();

    // Early waves mostly use walkers/runners.
    if (wave <= 2) {

        if (roll < 0.72)
            return "walker";

        return "runner";
    }


    // Wave 3+
    if (wave < 5) {

        if (roll < 0.52)
            return "walker";

        if (roll < 0.77)
            return "runner";

        if (roll < 0.90)
            return "crawler";

        return "armored";
    }


    // Wave 5+
    if (roll < 0.35)
        return "walker";

    if (roll < 0.53)
        return "runner";

    if (roll < 0.66)
        return "crawler";

    if (roll < 0.78)
        return "armored";

    if (roll < 0.88)
        return "spitter";

    if (roll < 0.96)
        return "exploder";

    return "tank";
}


// ============================================================
// FIND SAFE SPAWN POSITION
// ============================================================

function getZombieSpawnPosition() {

    const margin = 80;

    const side =
        Math.floor(
            Math.random() * 4
        );

    let x;
    let y;

    if (side === 0) {

        x =
            margin +
            Math.random() *
            (window.innerWidth - margin * 2);

        y =
            -margin;

    } else if (side === 1) {

        x =
            window.innerWidth + margin;

        y =
            margin +
            Math.random() *
            (window.innerHeight - margin * 2);

    } else if (side === 2) {

        x =
            margin +
            Math.random() *
            (window.innerWidth - margin * 2);

        y =
            window.innerHeight + margin;

    } else {

        x =
            -margin;

        y =
            margin +
            Math.random() *
            (window.innerHeight - margin * 2);
    }

    return {
        x,
        y
    };
}


// ============================================================
// SPAWN ZOMBIE
// ============================================================

function spawnZombie(wave) {

    const position =
        getZombieSpawnPosition();

    const type =
        chooseZombieType(wave);

    return createZombie(
        type,
        position.x,
        position.y,
        wave
    );
}


// ============================================================
// UPDATE ZOMBIES
// ============================================================

function updateZombies(delta) {

    if (!window.player) {
        return;
    }

    const now =
        performance.now();

    for (const zombie of zombies) {

        if (zombie.dead) {
            continue;
        }


        // ----------------------------------------------------
        // Move toward player
        // ----------------------------------------------------

        let dx =
            player.x - zombie.x;

        let dy =
            player.y - zombie.y;

        const distance =
            Math.hypot(dx, dy);


        if (distance > 0) {

            dx /= distance;
            dy /= distance;

        }


        // ----------------------------------------------------
        // Special behavior
        // ----------------------------------------------------

        if (zombie.type === "spitter") {

            // Keep some distance from the player.
            if (distance > 210) {

                zombie.x +=
                    dx *
                    zombie.speed *
                    delta /
                    16.67;

                zombie.y +=
                    dy *
                    zombie.speed *
                    delta /
                    16.67;

            } else if (distance < 145) {

                zombie.x -=
                    dx *
                    zombie.speed *
                    delta /
                    16.67;

                zombie.y -=
                    dy *
                    zombie.speed *
                    delta /
                    16.67;

            }


            // Shoot projectile.
            if (
                distance <= zombie.attackRange &&
                now - zombie.lastAttack >=
                    zombie.attackCooldown
            ) {

                zombie.lastAttack = now;

                createZombieProjectile(
                    zombie,
                    player
                );

            }

        } else {

            // Normal zombie movement.
            if (
                distance >
                zombie.attackRange
            ) {

                zombie.x +=
                    dx *
                    zombie.speed *
                    delta /
                    16.67;

                zombie.y +=
                    dy *
                    zombie.speed *
                    delta /
                    16.67;
            }

        }


        // ----------------------------------------------------
        // Attack player
        // ----------------------------------------------------

        const attackDistance =
            zombie.attackRange +
            player.radius;


        if (
            distance <= attackDistance &&
            now - zombie.lastAttack >=
                zombie.attackCooldown
        ) {

            zombie.lastAttack = now;

            zombie.attackAnimation = 1;

            hurtPlayer(
                zombie.damage,
                zombie
            );

        }


        // ----------------------------------------------------
        // Animation
        // ----------------------------------------------------

        if (
            zombie.attackAnimation > 0
        ) {

            zombie.attackAnimation -=
                delta / 250;

        }

        if (zombie.hitFlash > 0) {

            zombie.hitFlash -=
                delta / 100;

        }

    }

}


// ============================================================
// DAMAGE ZOMBIE
// ============================================================

function damageZombie(
    zombie,
    damage,
    hitX,
    hitY
) {

    if (!zombie || zombie.dead) {
        return;
    }


    // --------------------------------------------------------
    // Armor
    // --------------------------------------------------------

    const reduction =
        zombie.damageReduction || 0;

    damage *=
        1 - reduction;


    // --------------------------------------------------------
    // Critical hit
    // --------------------------------------------------------

    let critical = false;

    if (
        window.player &&
        player.critChance &&
        Math.random() <
            player.critChance
    ) {

        damage *=
            player.critMultiplier || 2;

        critical = true;

    }


    damage =
        Math.max(
            1,
            Math.round(damage)
        );


    zombie.health -= damage;

    zombie.hitFlash = 1;


    // --------------------------------------------------------
    // Damage number
    // --------------------------------------------------------

    if (
        window.settings &&
        settings.damageNumbers
    ) {

        createDamageNumber(
            hitX,
            hitY,
            damage,
            critical
        );

    }


    // --------------------------------------------------------
    // Hit particles
    // --------------------------------------------------------

    if (
        window.settings &&
        settings.particles
    ) {

        createBloodParticles(
            hitX,
            hitY
        );

    }


    // --------------------------------------------------------
    // Death
    // --------------------------------------------------------

    if (zombie.health <= 0) {

        killZombie(zombie);

    }

}


// ============================================================
// KILL ZOMBIE
// ============================================================

function killZombie(zombie) {

    if (zombie.dead) {
        return;
    }

    zombie.dead = true;
    zombie.health = 0;


    // Give player money.
    if (window.player) {

        player.money +=
            zombie.reward;

        player.kills =
            (player.kills || 0) + 1;

    }


    // Exploder effect.
    if (
        zombie.type === "exploder"
    ) {

        explodeZombie(zombie);

    }


    // Death particles.
    if (
        window.settings &&
        settings.particles
    ) {

        createBloodParticles(
            zombie.x,
            zombie.y,
            16
        );

    }

}


// ============================================================
// EXPLODER
// ============================================================

function explodeZombie(zombie) {

    if (!window.player) {
        return;
    }

    const dx =
        player.x - zombie.x;

    const dy =
        player.y - zombie.y;

    const distance =
        Math.hypot(dx, dy);


    if (
        distance <=
        zombie.explosionRadius
    ) {

        const damage =
            Math.round(
                zombie.damage *
                (
                    1 -
                    distance /
                    zombie.explosionRadius
                )
            );

        if (damage > 0) {

            hurtPlayer(
                damage,
                zombie
            );

        }

    }


    if (
        window.settings &&
        settings.particles
    ) {

        createExplosionParticles(
            zombie.x,
            zombie.y,
            zombie.explosionRadius
        );

    }

}


// ============================================================
// ZOMBIE PROJECTILES
// ============================================================

if (!window.zombieProjectiles) {
    window.zombieProjectiles = [];
}


function createZombieProjectile(
    zombie,
    target
) {

    let dx =
        target.x - zombie.x;

    let dy =
        target.y - zombie.y;

    const distance =
        Math.hypot(dx, dy);


    if (distance === 0) {
        return;
    }


    dx /= distance;
    dy /= distance;


    zombieProjectiles.push({

        x: zombie.x,
        y: zombie.y,

        dx: dx,
        dy: dy,

        speed:
            zombie.projectileSpeed,

        damage:
            zombie.projectileDamage,

        life: 2500,

        created:
            performance.now()

    });

}


// ============================================================
// UPDATE PROJECTILES
// ============================================================

function updateZombieProjectiles(delta) {

    if (!window.player) {
        return;
    }


    for (
        let i =
            zombieProjectiles.length - 1;

        i >= 0;

        i--
    ) {

        const projectile =
            zombieProjectiles[i];


        const movement =
            projectile.speed *
            delta /
            16.67;


        projectile.x +=
            projectile.dx *
            movement;

        projectile.y +=
            projectile.dy *
            movement;


        const dx =
            projectile.x -
            player.x;

        const dy =
            projectile.y -
            player.y;

        const distance =
            Math.hypot(dx, dy);


        // Hit player.
        if (
            distance <=
            player.radius + 7
        ) {

            hurtPlayer(
                projectile.damage
            );

            zombieProjectiles.splice(
                i,
                1
            );

            continue;
        }


        // Remove old projectile.
        if (
            performance.now() -
            projectile.created >
            projectile.life
        ) {

            zombieProjectiles.splice(
                i,
                1
            );

        }

    }

}


// ============================================================
// DRAW ZOMBIES
// ============================================================

function drawZombies(ctx) {

    if (!window.zombies) {
        return;
    }


    for (const zombie of zombies) {

        if (zombie.dead) {
            continue;
        }


        const wobble =
            Math.sin(
                performance.now() / 140 +
                zombie.wobble
            ) * 1.5;


        ctx.save();

        ctx.translate(
            zombie.x,
            zombie.y
        );


        // ----------------------------------------------------
        // Shadow
        // ----------------------------------------------------

        ctx.beginPath();

        ctx.ellipse(
            0,
            zombie.radius * 0.75,
            zombie.radius * 0.95,
            zombie.radius * 0.38,
            0,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(0,0,0,0.35)";

        ctx.fill();


        // ----------------------------------------------------
        // Body
        // ----------------------------------------------------

        ctx.beginPath();

        ctx.arc(
            0,
            wobble,
            zombie.radius,
            0,
            Math.PI * 2
        );


        if (zombie.hitFlash > 0) {

            ctx.fillStyle = "#ffffff";

        } else {

            ctx.fillStyle =
                zombie.color;

        }

        ctx.fill();


        ctx.strokeStyle =
            zombie.darkColor;

        ctx.lineWidth = 3;

        ctx.stroke();


        // ----------------------------------------------------
        // Special markings
        // ----------------------------------------------------

        if (
            zombie.type === "tank"
        ) {

            ctx.strokeStyle =
                "#22272d";

            ctx.lineWidth = 5;

            ctx.beginPath();

            ctx.arc(
                0,
                wobble,
                zombie.radius * 0.65,
                0,
                Math.PI * 2
            );

            ctx.stroke();

        }


        if (
            zombie.type === "armored"
        ) {

            ctx.strokeStyle =
                "#b5bdc6";

            ctx.lineWidth = 3;

            ctx.beginPath();

            ctx.arc(
                0,
                wobble,
                zombie.radius * 0.72,
                0,
                Math.PI * 2
            );

            ctx.stroke();

        }


        if (
            zombie.type === "exploder"
        ) {

            ctx.fillStyle =
                "#ffcf4d";

            ctx.beginPath();

            ctx.arc(
                0,
                wobble,
                zombie.radius * 0.3,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }


        // ----------------------------------------------------
        // Eyes
        // ----------------------------------------------------

        const eyeOffset =
            zombie.radius * 0.34;

        ctx.fillStyle =
            "#f2f5f7";

        ctx.beginPath();

        ctx.arc(
            -eyeOffset,
            -zombie.radius * 0.2 + wobble,
            Math.max(2, zombie.radius * 0.12),
            0,
            Math.PI * 2
        );

        ctx.arc(
            eyeOffset,
            -zombie.radius * 0.2 + wobble,
            Math.max(2, zombie.radius * 0.12),
            0,
            Math.PI * 2
        );

        ctx.fill();


        // ----------------------------------------------------
        // Health bar
        // ----------------------------------------------------

        if (
            !window.settings ||
            settings.healthBars
        ) {

            const width =
                zombie.radius * 2.2;

            const height = 5;

            const healthPercent =
                Math.max(
                    0,
                    zombie.health /
                    zombie.maxHealth
                );


            ctx.fillStyle =
                "rgba(0,0,0,0.7)";

            ctx.fillRect(
                -width / 2,
                -zombie.radius - 13,
                width,
                height
            );


            ctx.fillStyle =
                healthPercent > 0.5
                    ? "#77d66b"
                    : healthPercent > 0.25
                        ? "#e6c54c"
                        : "#ff5361";


            ctx.fillRect(
                -width / 2,
                -zombie.radius - 13,
                width * healthPercent,
                height
            );

        }


        ctx.restore();

    }

}


// ============================================================
// DRAW ZOMBIE PROJECTILES
// ============================================================

function drawZombieProjectiles(ctx) {

    if (!window.zombieProjectiles) {
        return;
    }


    for (
        const projectile of
        zombieProjectiles
    ) {

        ctx.save();

        ctx.translate(
            projectile.x,
            projectile.y
        );

        ctx.rotate(
            Math.atan2(
                projectile.dy,
                projectile.dx
            )
        );


        ctx.fillStyle =
            "#83e06d";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.restore();

    }

}


// ============================================================
// PARTICLE HELPERS
// ============================================================

function createBloodParticles(
    x,
    y,
    count = 7
) {

    if (!window.particles) {
        window.particles = [];
    }


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            1 +
            Math.random() * 4;


        particles.push({

            x: x,
            y: y,

            dx:
                Math.cos(angle) *
                speed,

            dy:
                Math.sin(angle) *
                speed,

            life:
                250 +
                Math.random() * 300,

            maxLife: 500,

            size:
                2 +
                Math.random() * 3

        });

    }

}


function createExplosionParticles(
    x,
    y,
    radius
) {

    if (!window.particles) {
        window.particles = [];
    }


    for (
        let i = 0;
        i < 30;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            2 +
            Math.random() * 7;


        particles.push({

            x: x,
            y: y,

            dx:
                Math.cos(angle) *
                speed,

            dy:
                Math.sin(angle) *
                speed,

            life:
                350 +
                Math.random() * 450,

            maxLife: 800,

            size:
                2 +
                Math.random() * 5

        });

    }

}


// ============================================================
// DAMAGE NUMBER
// ============================================================

if (!window.damageNumbers) {
    window.damageNumbers = [];
}


function createDamageNumber(
    x,
    y,
    damage,
    critical = false
) {

    damageNumbers.push({

        x: x,

        y: y,

        damage: damage,

        critical: critical,

        life: 700,

        created:
            performance.now()

    });

}


function updateDamageNumbers(delta) {

    for (
        let i =
            damageNumbers.length - 1;

        i >= 0;

        i--
    ) {

        const number =
            damageNumbers[i];


        number.y -=
            delta * 0.035;

        number.life -=
            delta;


        if (
            number.life <= 0
        ) {

            damageNumbers.splice(
                i,
                1
            );

        }

    }

}


function drawDamageNumbers(ctx) {

    if (
        !window.settings ||
        !settings.damageNumbers
    ) {
        return;
    }


    ctx.textAlign = "center";
    ctx.font = "bold 14px Arial";


    for (
        const number of
        damageNumbers
    ) {

        const alpha =
            Math.max(
                0,
                number.life / 700
            );


        ctx.globalAlpha =
            alpha;

        ctx.fillStyle =
            number.critical
                ? "#fff36b"
                : "#ffffff";


        ctx.fillText(
            number.critical
                ? "CRIT " + number.damage
                : number.damage,
            number.x,
            number.y
        );

    }


    ctx.globalAlpha = 1;

}
