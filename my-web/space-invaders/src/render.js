import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from "./config.js";

export function draw(ctx, state) {
    drawBackground(ctx);

    for (const alien of state.aliens) {
        if (alien.alive) {
            drawAlien(ctx, alien);
        }
    }

    drawPlayer(ctx, state.player);
    drawBullets(ctx, state.bullets, state.alienBullets);
    drawParticles(ctx, state.particles);

    if (!state.gameRunning) {
        drawTextOverlay(ctx, "SPACE INVADERS", "Pulsa Empezar para jugar");
    } else if (state.paused) {
        drawTextOverlay(ctx, "PAUSA", "Pulsa P o el botón Pausar para continuar");
    } else if (state.gameOver) {
        drawTextOverlay(ctx, "GAME OVER", "Pulsa Empezar para reiniciar");
    }
}

function drawBackground(ctx) {
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";

    for (let i = 0; i < 70; i++) {
        const x = (i * 113) % CANVAS_WIDTH;
        const y = (i * 71) % CANVAS_HEIGHT;
        ctx.fillRect(x, y, 1.5, 1.5);
    }
}

function drawPlayer(ctx, player) {
    if (!player) return;

    ctx.fillStyle = COLORS.player;
    ctx.fillRect(player.x, player.y + 8, player.w, player.h - 8);
    ctx.fillRect(player.x + 16, player.y, 16, 12);

    ctx.fillStyle = COLORS.text;
    ctx.fillRect(player.x + 21, player.y + 4, 6, 6);
}

function drawAlien(ctx, alien) {
    ctx.fillStyle = COLORS.alien;
    ctx.fillRect(alien.x + 6, alien.y, alien.w - 12, alien.h);
    ctx.fillRect(alien.x, alien.y + 8, alien.w, 12);

    ctx.fillStyle = COLORS.background;
    ctx.fillRect(alien.x + 10, alien.y + 8, 6, 6);
    ctx.fillRect(alien.x + alien.w - 16, alien.y + 8, 6, 6);
}

function drawBullets(ctx, bullets, alienBullets) {
    ctx.fillStyle = COLORS.bullet;

    for (const bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
    }

    ctx.fillStyle = COLORS.alienBullet;

    for (const bullet of alienBullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
    }
}

function drawParticles(ctx, particles) {
    for (const particle of particles) {
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    }

    ctx.globalAlpha = 1;
}

function drawTextOverlay(ctx, title, subtitle) {
    ctx.fillStyle = COLORS.overlay;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.textAlign = "center";

    ctx.fillStyle = COLORS.text;
    ctx.font = "bold 42px system-ui";
    ctx.fillText(title, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 22);

    ctx.fillStyle = COLORS.muted;
    ctx.font = "20px system-ui";
    ctx.fillText(subtitle, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);

    ctx.textAlign = "start";
}