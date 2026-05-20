import { ALIEN } from "./config.js";
import { createPlayer, createAliens } from "./entities.js";

export const state = {
    player: null,
    bullets: [],
    alienBullets: [],
    aliens: [],
    particles: [],

    score: 0,
    lives: 3,
    level: 1,

    gameRunning: false,
    paused: false,
    gameOver: false,

    lastTime: performance.now(),
    alienDirection: 1,
    alienStepDown: ALIEN.stepDown,
    alienShootTimer: 0
};

export function resetState() {
    state.player = createPlayer();

    state.bullets = [];
    state.alienBullets = [];
    state.aliens = [];
    state.particles = [];

    state.score = 0;
    state.lives = 3;
    state.level = 1;

    state.gameRunning = true;
    state.paused = false;
    state.gameOver = false;

    state.lastTime = performance.now();
    state.alienDirection = 1;
    state.alienStepDown = ALIEN.stepDown;
    state.alienShootTimer = 0;

    state.aliens = createAliens(state.level);
}