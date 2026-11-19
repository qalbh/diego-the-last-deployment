# Diego: The Last Deployment

Playable, self-contained HTML5 Canvas arcade farewell game for Brij.

## Run

Open `index.html` in a browser, or serve the folder locally (e.g. `python3 -m http.server 8000`) and navigate to `http://localhost:8000`.

## Project structure

```
index.html                  HUD markup + script tags (load order matters)
css/styles.css              all styling
assets/photos/*.jpg         the nine character photos
js/data/                    photos.js, dialogue.js (QUOTES, comebacks, hit jokes), levels.js (LEVELS, THEMES)
js/core/                    state.js, progression.js (startLevel, win, finale), update.js, input.js
js/audio/sound.js           synthesized arcade sounds
js/world/maze.js            maze generation, routing, Level 1 placement, wall/distance helpers
js/ui/                      overlay.js, dialogue.js, hud.js, menus.js
js/levels/level1-story.js   Level 1 intro, victory, results, same-maze retry
js/gameplay/                pickups.js, enemies.js, combat.js, abilities.js
js/render/                  effects.js, level1-art.js, characters.js, draw.js
js/main.js                  game loop and boot (loaded last)
```

The scripts are plain `<script>` tags (not ES modules) that share one global scope, so `index.html` still runs by double-clicking it with no server. Add new files to the script list in `index.html`; `js/main.js` must stay last because it boots the game.

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
