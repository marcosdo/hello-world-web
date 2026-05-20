export function rectsCollide(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

export function explode(state, x, y, color) {
    for (let i = 0; i < 18; i++) {
        state.particles.push({
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