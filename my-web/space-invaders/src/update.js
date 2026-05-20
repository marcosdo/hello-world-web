import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from "./config.js";
import { createAliens, createAlienBullet } from "./entities.js";
import { rectsCollide, explode } from "./utils.js";

export function update(state, keys, dt) {
    if (!state.gameRunning || state.paused || state.gameOver) {
        return;
    }

    movePlayer(state, keys, dt);
    updateBullets(state, dt);
    updateAliens(state, dt);
    updateAlienShooting(state, dt);
    updateParticles(state, dt);
    checkCollisions(state);
    checkLevelClear(state);
}

function movePlayer(state, keys, dt) {
    const player = state.player;

    if (keys.has("arrowleft") || keys.has("a")) {
        player.x -= player.speed * dt;
    }

    if (keys.has("arrowright") || keys.has("d")) {
        player.x += player.speed * dt;
    }

    player.x = Math.max(0, Math.min(CANVAS_WIDTH - player.w, player.x));

    if (player.cooldown > 0) {
        player.cooldown -= dt;
    }
}

function updateBullets(state, dt) {
    for (const bullet of state.bullets) {
        bullet.y -= bullet.speed * dt;
    }

    for (const bullet of state.alienBullets) {
        bullet.y += bullet.speed * dt;
    }

    state.bullets = state.bullets.filter((bullet) => bullet.y + bullet.h > 0);
    state.alienBullets = state.alienBullets.filter((bullet) => bullet.y < CANVAS_HEIGHT);
}

function updateAliens(state, dt) {
    const aliveAliens = state.aliens.filter((alien) => alien.alive);

    if (aliveAliens.length === 0) {
        return;
    }

    const speed = 38 + state.level * 10;
    let shouldStepDown = false;

    for (const alien of aliveAliens) {
        alien.x += state.alienDirection * speed * dt;

        if (alien.x <= 18 || alien.x + alien.w >= CANVAS_WIDTH - 18) {
            shouldStepDown = true;
        }
    }

    if (shouldStepDown) {
        state.alienDirection *= -1;

        for (const alien of aliveAliens) {
            alien.y += state.alienStepDown;
        }
    }

    for (const alien of aliveAliens) {
        if (alien.y + alien.h >= state.player.y) {
            loseLife(state);
            break;
        }
    }
}

function updateAlienShooting(state, dt) {
    state.alienShootTimer -= dt;

    if (state.alienShootTimer > 0) {
        return;
    }

    const aliveAliens = state.aliens.filter((alien) => alien.alive);

    if (aliveAliens.length === 0) {
        return;
    }

    const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];

    state.alienBullets.push(createAlienBullet(shooter, state.level));

    state.alienShootTimer = Math.max(0.35, 1.25 - state.level * 0.08);
}

function updateParticles(state, dt) {
    for (const particle of state.particles) {
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.life -= dt * 1.8;
    }

    state.particles = state.particles.filter((particle) => particle.life > 0);
}

function checkCollisions(state) {
    for (const bullet of state.bullets) {
        for (const alien of state.aliens) {
            if (alien.alive && rectsCollide(bullet, alien)) {
                alien.alive = false;
                bullet.dead = true;
                state.score += 10;

                explode(
                    state,
                    alien.x + alien.w / 2,
                    alien.y + alien.h / 2,
                    COLORS.alien
                );

                break;
            }
        }
    }

    state.bullets = state.bullets.filter((bullet) => !bullet.dead);

    for (const bullet of state.alienBullets) {
        if (rectsCollide(bullet, state.player)) {
            bullet.dead = true;
            loseLife(state);
            break;
        }
    }

    state.alienBullets = state.alienBullets.filter((bullet) => !bullet.dead);
}

function loseLife(state) {
    state.lives--;

    explode(
        state,
        state.player.x + state.player.w / 2,
        state.player.y + state.player.h / 2,
        COLORS.player
    );

    state.alienBullets = [];
    state.bullets = [];
    state.player.x = CANVAS_WIDTH / 2 - state.player.w / 2;

    if (state.lives <= 0) {
        state.gameOver = true;
        state.gameRunning = true;
    }
}

function checkLevelClear(state) {
    const remaining = state.aliens.some((alien) => alien.alive);

    if (!remaining) {
        state.level++;
        state.bullets = [];
        state.alienBullets = [];
        state.alienDirection = 1;
        state.alienShootTimer = 0;
        state.aliens = createAliens(state.level);
    }
}