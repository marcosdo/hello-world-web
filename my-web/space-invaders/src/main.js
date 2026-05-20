// Game entry point
/**
    main.js      → arranca el juego, botones, loop principal, HUD
    config.js    → constantes: tamaños, colores, velocidades
    state.js     → estado global del juego
    entities.js  → creación de jugador, aliens y balas
    input.js     → teclado
    render.js    → todo lo que dibuja en canvas
    update.js    → lógica del juego: movimiento, colisiones, niveles
    utils.js     → funciones auxiliares como colisiones y explosiones
*/

import { PLAYER } from "./config.js";
import { state, resetState } from "./state.js";
import { keys, setupInput } from "./input.js";
import { createPlayerBullet } from "./entities.js";
import { update } from "./update.js";
import { draw } from "./render.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const hud = document.getElementById("hud");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");

function updateHud() {
    hud.textContent = `Puntos: ${state.score} · Vidas: ${state.lives} · Nivel: ${state.level}`;
}

function shoot() {
    if (!state.gameRunning || state.paused || state.gameOver) {
        return;
    }

    if (state.player.cooldown > 0) {
        return;
    }

    state.bullets.push(createPlayerBullet(state.player));
    state.player.cooldown = PLAYER.cooldown;
}

function togglePause() {
    if (!state.gameRunning || state.gameOver) {
        return;
    }

    state.paused = !state.paused;
    pauseBtn.textContent = state.paused ? "Continuar" : "Pausar";
}

function loop(now) {
    const dt = Math.min((now - state.lastTime) / 1000, 0.033);
    state.lastTime = now;

    update(state, keys, dt);
    draw(ctx, state);
    updateHud();

    requestAnimationFrame(loop);
}

startBtn.addEventListener("click", () => {
    resetState();
    startBtn.textContent = "Reiniciar";
    pauseBtn.textContent = "Pausar";
});

pauseBtn.addEventListener("click", togglePause);

setupInput({
    shoot,
    togglePause
});

resetState();
state.gameRunning = false;

requestAnimationFrame(loop);