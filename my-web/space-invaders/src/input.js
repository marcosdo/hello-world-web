export const keys = new Set();

export function setupInput({ shoot, togglePause }) {
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
}