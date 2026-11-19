# Diego: The Last Deployment

Playable, self-contained HTML5 Canvas arcade farewell game for Brij.

## Run

Open `index.html` in a browser, or serve the folder locally (e.g. `python3 -m http.server 8000`) and navigate to `http://localhost:8000`.

## Project structure

- `index.html` — entire working game, including inline HTML/CSS/JavaScript and embedded character photos.

## Current design and gameplay

- Five levels: 1) Haris (Ticket Master), 2) Eren & Jake (Project Guardians), 3) Zoofi, Sush & Arqam (bugs and ticket reassignments), 4) Ali (engineering handover), 5) Zack (final boss).
- Level 1 is the most developed and visually polished. It uses a compact maze, golden key, locked exit, health (100 HP, 25 per hit), pursuing boss, roaming snakes and beetles, Ghost Mode (SPACE), Flying Chappal (F), power-ups, dialogue, cutscenes, and a skill-unlock finale.
- WASD/arrow keys move, P pauses. Opening tutorial shows controls.
- Character photo portraits are embedded as data URLs.
- `index.html` is the pre-optimization restored version. A prior attempt to cache static rendering introduced severe graphical corruption; do not blindly reintroduce that change.

## Safe development workflow

1. Run and visually inspect the existing game before edits.
2. Preserve a known-good copy; use Git commits for each small change.
3. Refactor the single-file project into separate JS/CSS/assets only if all data URLs and game behavior remain intact. Prefer incremental refactoring.
4. Avoid changing the grid sizing, collision rules, projectile paths, AI behavior, visual clipping, or level progression unless explicitly requested.
5. Verify gameplay in browser after changes, including maze rendering, Haris dialogue, enemy motion, key and door, powers, victory, and restart.
6. Develop Level 2 and later levels incrementally, with their own intro/victory scenes, harder maze, special boss mechanics, skill unlocks and final memory wall.

## Important

This is an editable game source file, not a compiled application. It runs offline, no dependencies necessary.
