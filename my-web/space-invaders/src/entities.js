import { CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER, ALIEN } from "./config.js";

export function createPlayer() {
    return {
        x: CANVAS_WIDTH / 2 - PLAYER.width / 2,
        y: CANVAS_HEIGHT - 58,
        w: PLAYER.width,
        h: PLAYER.height,
        speed: PLAYER.speed,
        cooldown: 0
    };
}

export function createAliens(level) {
    const aliens = [];

    const rows = Math.min(3 + level, 6);
    const cols = 10;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            aliens.push({
                x: ALIEN.startX + col * (ALIEN.width + ALIEN.gapX),
                y: ALIEN.startY + row * (ALIEN.height + ALIEN.gapY),
                w: ALIEN.width,
                h: ALIEN.height,
                alive: true
            });
        }
    }

    return aliens;
}

export function createPlayerBullet(player) {
    return {
        x: player.x + player.w / 2 - 3,
        y: player.y - 12,
        w: 6,
        h: 14,
        speed: 520
    };
}

export function createAlienBullet(alien, level) {
    return {
        x: alien.x + alien.w / 2 - 3,
        y: alien.y + alien.h,
        w: 6,
        h: 14,
        speed: 180 + level * 18
    };
}