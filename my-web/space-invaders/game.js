const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const hud = document.getElementById("hud");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");

const W = canvas.width;
const H = canvas.height;

const keys = new Set();

let player;
let bullets;
let alienBullets;
let aliens;
let particles;
let score;
let lives;
let level;
let gameRunning;
let paused;
let gameOver;
let lastTime;
let alienDirection;
let alienStepDown;
let alienShootTimer;

function resetGame() {
    player = {
        x: W / 2 - 24,
        y: H - 58,
        w: 48,
        h: 22,
        speed: 360,
        cooldown: 0
    };

    bullets = [];
    alienBullets = [];
    particles = [];
    score = 0;
    lives = 3;
    level = 1;
    gameRunning = true;
    paused = false;
    gameOver = false;
    lastTime = performance.now();
    alienDirection = 1;
    alienStepDown = 24;
    alienShootTimer = 0;

    createAliens();
    updateHud();
}

function createAliens() {
    aliens = [];

    const rows = Math.min(3 + level, 6);
    const cols = 10;
    const gapX = 18;
    const gapY = 16;
    const alienW = 42;
    const alienH = 28;
    const startX = 72;
    const startY = 70;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            aliens.push({
                x: startX + col * (alienW + gapX),
                y: startY + row * (alienH + gapY),
                w: alienW,
                h: alienH,
                alive: true
            });
        }
    }
}

function updateHud() {
    hud.textContent = `Puntos: ${score} · Vidas: ${lives} · Nivel: ${level}`;
}

function drawBackground() {
    ctx.fillStyle = "#03050d";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";

    for (let i = 0; i < 70; i++) {
        const x = (i * 113) % W;
        const y = (i * 71) % H;
        ctx.fillRect(x, y, 1.5, 1.5);
    }
}

function drawPlayer() {
    ctx.fillStyle = "#7cf7ff";
    ctx.fillRect(player.x, player.y + 8, player.w, player.h - 8);
    ctx.fillRect(player.x + 16, player.y, 16, 12);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(player.x + 21, player.y + 4, 6, 6);
}

function drawAlien(alien) {
    ctx.fillStyle = "#b6ff7c";
    ctx.fillRect(alien.x + 6, alien.y, alien.w - 12, alien.h);
    ctx.fillRect(alien.x, alien.y + 8, alien.w, 12);

    ctx.fillStyle = "#03050d";
    ctx.fillRect(alien.x + 10, alien.y + 8, 6, 6);
    ctx.fillRect(alien.x + alien.w - 16, alien.y + 8, 6, 6);
}

function drawBullets() {
    ctx.fillStyle = "#ffffff";

    for (const bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
    }

    ctx.fillStyle = "#ff5b7a";

    for (const bullet of alienBullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
    }
}

function drawParticles() {
    for (const p of particles) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    }

    ctx.globalAlpha = 1;
}

function drawTextOverlay(title, subtitle) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px system-ui";
    ctx.fillText(title, W / 2, H / 2 - 22);

    ctx.fillStyle = "#8fa3c7";
    ctx.font = "20px system-ui";
    ctx.fillText(subtitle, W / 2, H / 2 + 20);

    ctx.textAlign = "start";
}

function draw() {
    drawBackground();

    for (const alien of aliens) {
        if (alien.alive) {
            drawAlien(alien);
        }
    }

    drawPlayer();
    drawBullets();
    drawParticles();

    if (!gameRunning) {
        drawTextOverlay("SPACE INVADERS", "Pulsa Empezar para jugar");
    } else if (paused) {
        drawTextOverlay("PAUSA", "Pulsa P o el botón Pausar para continuar");
    } else if (gameOver) {
        drawTextOverlay("GAME OVER", "Pulsa Empezar para reiniciar");
    }
}

function update(dt) {
    if (!gameRunning || paused || gameOver) {
        return;
    }

    movePlayer(dt);
    updateBullets(dt);
    updateAliens(dt);
    updateAlienShooting(dt);
    updateParticles(dt);
    checkCollisions();
    checkLevelClear();
    updateHud();
}

function movePlayer(dt) {
    if (keys.has("arrowleft") || keys.has("a")) {
        player.x -= player.speed * dt;
    }

    if (keys.has("arrowright") || keys.has("d")) {
        player.x += player.speed * dt;
    }

    player.x = Math.max(0, Math.min(W - player.w, player.x));

    if (player.cooldown > 0) {
        player.cooldown -= dt;
    }
}

function shoot() {
    if (!gameRunning || paused || gameOver) {
        return;
    }

    if (player.cooldown > 0) {
        return;
    }

    bullets.push({
        x: player.x + player.w / 2 - 3,
        y: player.y - 12,
        w: 6,
        h: 14,
        speed: 520
    });

    player.cooldown = 0.28;
}

function updateBullets(dt) {
    for (const bullet of bullets) {
        bullet.y -= bullet.speed * dt;
    }

    for (const bullet of alienBullets) {
        bullet.y += bullet.speed * dt;
    }

    bullets = bullets.filter((bullet) => bullet.y + bullet.h > 0);
    alienBullets = alienBullets.filter((bullet) => bullet.y < H);
}

function updateAliens(dt) {
    const aliveAliens = aliens.filter((alien) => alien.alive);

    if (aliveAliens.length === 0) {
        return;
    }

    const speed = 38 + level * 10;
    let shouldStepDown = false;

    for (const alien of aliveAliens) {
        alien.x += alienDirection * speed * dt;

        if (alien.x <= 18 || alien.x + alien.w >= W - 18) {
            shouldStepDown = true;
        }
    }

    if (shouldStepDown) {
        alienDirection *= -1;

        for (const alien of aliveAliens) {
            alien.y += alienStepDown;
        }
    }

    for (const alien of aliveAliens) {
        if (alien.y + alien.h >= player.y) {
            loseLife();
            break;
        }
    }
}

function updateAlienShooting(dt) {
    alienShootTimer -= dt;

    if (alienShootTimer > 0) {
        return;
    }

    const aliveAliens = aliens.filter((alien) => alien.alive);

    if (aliveAliens.length === 0) {
        return;
    }

    const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];

    alienBullets.push({
        x: shooter.x + shooter.w / 2 - 3,
        y: shooter.y + shooter.h,
        w: 6,
        h: 14,
        speed: 180 + level * 18
    });

    alienShootTimer = Math.max(0.35, 1.25 - level * 0.08);
}

function updateParticles(dt) {
    for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt * 1.8;
    }

    particles = particles.filter((p) => p.life > 0);
}

function rectsCollide(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

function checkCollisions() {
    for (const bullet of bullets) {
        for (const alien of aliens) {
            if (alien.alive && rectsCollide(bullet, alien)) {
                alien.alive = false;
                bullet.dead = true;
                score += 10;
                explode(alien.x + alien.w / 2, alien.y + alien.h / 2, "#b6ff7c");
                break;
            }
        }
    }

    bullets = bullets.filter((bullet) => !bullet.dead);

    for (const bullet of alienBullets) {
        if (rectsCollide(bullet, player)) {
            bullet.dead = true;
            loseLife();
            break;
        }
    }

    alienBullets = alienBullets.filter((bullet) => !bullet.dead);
}

function loseLife() {
    lives--;
    explode(player.x + player.w / 2, player.y + player.h / 2, "#7cf7ff");

    alienBullets = [];
    bullets = [];
    player.x = W / 2 - player.w / 2;

    if (lives <= 0) {
        gameOver = true;
        gameRunning = true;
    }
}

function checkLevelClear() {
    const remaining = aliens.some((alien) => alien.alive);

    if (!remaining) {
        level++;
        bullets = [];
        alienBullets = [];
        createAliens();
    }
}

function explode(x, y, color) {
    for (let i = 0; i < 18; i++) {
        particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 180,
            vy: (Math.random() - 0.5) * 180,
            size: 3 + Math.random() * 3,
            life: 0.6 + Math.random() * 0.4,
            color
        });
    }
}

function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.033);
    lastTime = now;

    update(dt);
    draw();

    requestAnimationFrame(loop);
}

function togglePause() {
    if (!gameRunning || gameOver) {
        return;
    }

    paused = !paused;
    pauseBtn.textContent = paused ? "Continuar" : "Pausar";
}

window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    keys.add(key);

    if (event.code === "Space") {
        event.preventDefault();
        shoot();
    }

    if (key === "p") {
        togglePause();
    }
});

window.addEventListener("keyup", (event) => {
    keys.delete(event.key.toLowerCase());
});

startBtn.addEventListener("click", () => {
    resetGame();
    startBtn.textContent = "Reiniciar";
    pauseBtn.textContent = "Pausar";
});

pauseBtn.addEventListener("click", togglePause);

gameRunning = false;
paused = false;
gameOver = false;
lastTime = performance.now();

resetGame();
gameRunning = false;

requestAnimationFrame(loop);