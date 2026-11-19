# CLAUDE.md — Diego: The Last Deployment

> **Primary handoff for Claude Code, Claude in Antigravity, or any coding agent.** Read this document, `Chat.md`, `README.md`, and `index.html` **before making changes**. The source of truth for what runs is `index.html`. This guide documents both verified code and desired future work. Do not confuse the two.

## 0. The one-paragraph mission

Build a funny, affectionate, polished, browser-playable 2D arcade farewell game for Diego, a Brij developer leaving the company. Diego tries to escape a maze of coworkers who refuse to let him leave. Each level introduces recognizable teammates as moving enemies or bosses, signature project/engineering-themed attacks, humorous real-message-inspired dialogue, a golden-key/exit objective, and a newly unlocked skill for a fictional **Diego AI** replacement. The final boss is Zack, and the payoff is a **Diego Succession Plan** AI reveal followed by a heartfelt **Memory Wall**. Preserve humor, recognizable faces, playability, and the already approved Level 1 experience.

## 1. Rules of engagement for the coding agent

1. **Do not rebuild from scratch.** Work on the current self-contained HTML/CSS/JavaScript Canvas game in `index.html`.
2. **Treat Level 1 as an approved baseline.** Preserve its compact maze, photos, premium HUD, attacks, controls, dialogue, cutscenes, key, health, restart and exit mechanics unless explicitly asked to change them.
3. **Make incremental edits with a Git commit/checkpoint before each risky change.** Do not make sweeping renderer or layout refactors without visual testing.
4. **Never reintroduce the failed static-canvas caching optimization.** An earlier optimization corrupted the maze with repeated walls and oversized streaks/trails. The current file is the *restored pre-optimization version*.
5. **Test in a real browser**, not just `node --check`: opening/start screen, Level 1 intro, movement, enemies, attacks, health, collisions, key/exit, death/retry, escape/AI reveal, then transition onward. Use screenshots or a recorded playthrough when possible.
6. **Keep attacks inside the maze viewport**: enemy projectiles may pass *through interior maze walls* by design, but must be clipped/cancelled at the outer game bounds. This was a previously reported and fixed bug.
7. **Keep gameplay text off the maze.** Dialogue belongs in the horizontal announcement strip between ability controls and objective chip, with boss state in the small 'Current Threat' card. Hit and power notices must not obscure gameplay.
8. **Preserve all nine recognizable photo-based faces.** Do not substitute generic anonymous portraits or heavily pixelate the faces. Cartoon bodies and subtle Pac-Man-style boss treatment are welcome.
9. **Don't overload Level 1.** Add genuine new mechanics primarily to later levels. Level 1 is an introduction, not a final boss gauntlet.
10. **Flag unverified work.** Syntax checks are not a playthrough; planned future-level mechanics are not finished merely because later levels can load.
11. **Respect user wording and humor.** The exact dialogue lists are in this document and in `QUOTES` in source. Preserve quoted lines unless the user requests edits. User prefers concise, friendly communication and no em-dash punctuation.
12. **Run offline with no framework dependencies** unless user approves migration. Character pictures are embedded as data URLs in source.

## 2. Build and architecture as inspected on 19 November 2026

### Files

- `index.html`: canonical playable HTML5 Canvas game, inline CSS and JavaScript, and all nine character photos embedded as base64 data URLs in `PHOTOS`.
- `README.md`: existing run/developer notes.
- `ANTIGRAVITY_PROMPT.txt`: shorter agent onboarding prompt.
- `CLAUDE.md`: this complete handoff.
- `Chat.md`: expanded human-readable history, decisions and requests. **It is a curated conversation recap, not a verbatim export**.

### Run

Open `index.html` in Chrome, or use a static server (for example `python3 -m http.server 8000` and visit `http://localhost:8000`). No packages, build tooling or online services are currently required. On Mac, install a live preview extension or use a local server if preferred.

### Game internals

- HTML `<canvas id="game">`; Canvas 2D renderer via `ctx`. The source uses `const T=40, COLS=25, ROWS=18`, while Level 1 creates a compact active maze area (within `maxX=14,maxY=12`) and draws/positions that world with a Level-1-specific transform. **Do not casually alter canvas dimensions, T, coordinate transforms or maze generation.**
- `LEVELS` defines five bosses, titles, skill names, descriptions, basic attack icon and speed settings.
- `THEMES` defines changing palettes, backdrop names, and hazard categories per level.
- `QUOTES` contains the literal teammate dialogue. `DIEGO_COMEBACKS` contains Level 1 player replies.
- `PHOTOS` maps `diego`, `haris`, `eren`, `jake`, `zoofi`, `sush`, `arqam`, `ali`, `zack` to embedded images.
- Runtime state includes `phase`, `level`, `clock`, `score`, `health`, `hearts`, `grid`, `player`, `enemies`, `hazards`, `coins`, `projectiles`, `throws`, `goldenKey`, `pickups`, `hasGoldenKey`, `ghost`, `ghostCooldown`, `throwCooldown`, `coffeeBoost`, `dndCharges`, `shield`, `harisMode`, `unlocked`.
- Key functions to inspect: `createMaze`, `reachable`, `mazeRoute`, `placeLevelOneObjects`, `startLevel`, `update`, `draw`, `navigateEnemy`, `nextBossStep`, `hit`, `ghostMode`, `throwChappal`, `showLevelIntro`, `renderLevelOneIntro`, `beginLevelOne`, `levelOneVictoryScene`, `levelOneResults`, `replayLevelOne`, `updateUI`, `startScreen`, `show`, `hide`, `arcadeSound`.
- `copyLevelOneState` and `restoreLevelOneState` preserve the generated maze, key, power-ups, coins, hazards and enemies for **Retry Same Maze**. Fresh play generates a new maze.
- Start tutorial teaches Arrow keys/WASD movement, SPACE Ghost Mode, F Flying Chappal, P Pause. Header also provides Help, Pause and Restart actions.
- `requestAnimationFrame(frame)` drives updates and drawing. No bundled game engine; Phaser was an early idea, **not** the implementation.

## 3. Design goals and fixed game rules

- **Genre:** Pac-Man-inspired maze escape, 2D top-down arcade with faux depth and photo-head cartoon bodies.
- **Narrative:** Diego must escape coworkers; defeating each level contributes to a fictional AI replacement built from skill modules.
- **Length:** target ~18 to 23 minutes total (Level 1 2–3, Level 2 3–4, Level 3 4–5, Level 4 4–5, Level 5 5–6). These are **targets**, not measured completion times.
- **Difficulty:** intentional escalation through coordinated mechanics and hazards, not merely speed; rough aspiration L1 2/10, L2 4/10, L3 6/10, L4 8/10, L5 10/10. Never implement unfair instant kills.
- **Health:** starts at 100 HP (4 hits). **Each unprotected successful hit costs exactly 25 HP**. Ghost, shield, DND and brief post-hit invulnerability may block hits. At 0 HP show Game Over and offer same-maze retry for Level 1.
- **Controls:** Arrow keys/WASD for movement, SPACE 2-second Ghost Mode with 10-second cooldown, F Flying Chappal with 2.5-second cooldown, P pause; clickable ability buttons, optional on-screen directional controls for touch.
- **Flying Chappal:** directional projectile can eliminate snakes/beetles/hazards or projectiles and stun the boss. Haris should not be permanently killed because he must keep chasing. Golden Chappal pickup stuns him longer.
- **Bosses roam.** Haris pathfinds through maze corridors and follows Diego rather than standing still. Snakes must continually move, choose random paths at junctions and avoid sticking to walls; beetles have a different movement personality (slower patrol then burst near Diego). Enemy projectiles traverse interior walls, but do **not** leak outside the game.
- **Goal:** collect a golden key and find the exit door; more elaborate objectives can be introduced later. Level 1's key is placed on the guaranteed route toward the exit, and the maze has one unique path to the exit with branch corridors and dead ends to evade Haris.
- **Skill unlock after each successful level:** reveal a named Diego AI module, then continue. The full replacement and Memory Wall belong at the finale.
- **Cutscenes:** story introduction and victory sequence for every level; brief and skippable. Level 1 has a multi-step intro, cinematic victory, results screen and a failed-escape screen. Levels 2–5 still need bespoke sequences.

## 4. Level-by-level specification and development status

### Level 1: Haris, THE TICKET MASTER

**Status: working, designed and repeatedly user-approved; preserve.** Still perform regression tests before labeling production-ready. Theme `ASANA BACKLOG`, visual caption Brij Ticket Division. Haris is a project/program manager with endless ticket reminders. The user originally said Jira tickets, but the working code describes Asana tickets and Brij uses Asana. **Do not silently rename**; ask if the branding matters.

**Maze:** compact generated perfect maze, active ~15x13 tiles inside larger canvas; single unique solution route and multiple side branches. Random layout on fresh attempt; snapshot and exact layout reused on retry. One key on main route, locked exit until key collected. Scattered collectible data fragments provide score but are not mandatory for escape.

**Enemies:** Haris with photo-based round Pac-Man-like head and animated mouth/cartoon body; one or a small number of roaming snake/beetle hazards according to level generation (design target is one snake and one beetle; current spawning uses a `target=3` and may generate more depending on reachable tile and placement). Haris actively chases and fires ticket projectiles. Snakes randomly patrol; beetles move slower and speed up when near Diego. The hazards must stay inside maze corridors.

**Haris modes:** Polite Mode, then Reminder Mode, with periodic switching before finding key. Reminder Mode pursues/fires more aggressively. After key pickup, pressure intensifies; tiny floating bubble above Haris for ~1.65 seconds, current mode on external HUD. No giant popup on maze.

**Level 1 power-ups:** ☕ coffee = ~5-second speed boost; 🛡️ Do Not Disturb = blocks one damage hit; ❤️ Bug Fix = restores 25 HP up to 100; 🩴 Golden Chappal = stuns Haris for ~4 seconds. Ghost Mode is a persistent player action, not a pickup. Various shield effects from earlier versions may exist in code: inspect before changing.

**Damage feedback:** brief red flash/shake, funny hit toast outside gameplay, audio cue, 25 HP loss, temporary damage invulnerability. Funny damage examples: snake wants one last ticket, bug found/Zoofi wants a word, incoming ticket/Diego loses will to work. Source contains exact `HIT_JOKES` strings.

**Intro cutscene:** (1) Diego one hallway from freedom, Haris arrives; (2) Haris says "Hey Diego can you please help to check when you have a moment required your assistance here? Thanks"; (3) Diego replies "The future is finally here. The bots working for us"; screen declares **MISSION 1: ESCAPE THE BACKLOG!** The controls tutorial appears on start and can be reopened with Help. Cutscenes can be skipped.

**Victory cutscene:** celebratory confetti, fireworks/flaring particles, animated trophy, portrait face-off, **HARIS HAS BEEN ESCAPED!** headline, "MISSION 01 COMPLETE / ESCAPE APPROVED". Haris: "Thanks for help Diego". Diego: "Finally, a ticket I can close!" Followed by **UNLOCK DIEGO AI SKILL**, Level 1 results (time, health, enemies defeated; 1–3 stars based on time) and `Ticket Intelligence` module. Next button proceeds to Level 2.

**Game Over:** cinematic "ESCAPE DENIED!" and Haris reminder line. Retry Same Maze should preserve map/key/collectible placement. Check that post-hit invulnerability prevents immediate cascading damage.

**Visual standard:** premium dark navy/neon-teal HUD, player health and level/score in top cards, Haris portrait/current mode in Current Threat, Ghost/Chappal controls in the ability strip, short dialogue banner in central strip **between abilities and objective**, no right sidebar, no long instructional paragraph and no text drawn over maze. Raised blue office walls, floor tiles, filing cabinets, monitors, subtle lighting, ground shadows, detailed character bodies and recognizable face photos. Animated Ghost Mode, spinning chappal with trails, keys and doors, enemy death bursts. Large playable canvas; particles/glows should not overwhelm.

**Explicitly exclude from Level 1:** multiple human bosses, project-management deadline traps, hacker puzzles, full production disasters, larger maze, hard timers, repeated mechanics intended for later levels. The Follow-Up Storm, Jira floor traps, secret Slack room, optional fog/minimap and star rating were brainstormed; star rating was later implemented, but the others are **ideas only unless confirmed in source**.

### Level 2: Eren & Jake, THE PROJECT GUARDIANS

**Status:** currently a basic playable-level scaffold in source (`LEVELS` entry, photos, dialogue, theme and generic boss movement). **Unique mechanics and cinematic sequences are TODO.** Skill in source: **Project Mastery** (sometimes previously described as Project Intelligence/Planning; prefer source name).

**Characters:** Eren and Jake are both PMs, **two independently roaming bosses**. Visual world: Deadline Dimension, project planning board/sprint office, purple-toned theme. Slightly larger maze than Level 1, target 3–4 minutes.

**Planned unique mechanics:** Eren triggers deadlines/timed pressure, Jake creates temporary requirement barriers/blocks selected corridors. Coordinated duo attack near exit. Moderate increase in snakes/beetles, new Jira traps (slowdown, not instant loss). A golden key after a simple objective. Maintain escapable routes, avoid soft locks if barriers close paths.

**Intro:** Eren: "Diego update on the fix? We promised the customers yesterday!" Jake: "Let's plan one more sprint." Mission banner **SURVIVE SPRINT PLANNING!**

**Victory:** Eren "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"; Jake "boom". Unlock Project Mastery, with a celebratory short cinematic.

**Do not introduce yet:** full production crash chaos, three simultaneous boss combo attacks, security terminal puzzles or a marathon timer.

### Level 3: Zoofi, Sush & Arqam, THE TRIPLE THREAT

**Status:** basic scaffold + dialogue present, specialized combos/cutscenes/objectives TODO. Skill in source: **Quality & Engineering**. Target 4–5 min, ~6/10 challenge. Theme `PRODUCTION ON FIRE`, red-magenta release-day chaos, QA and engineering environment.

**Roles must stay correct:** **Zoofi = Lead QA**, throws bugs, regressions and release blockers. **Sush = Engineering Lead**, passes/reassigns tickets and production issues to Diego. **Arqam = Developer**, returns or assigns development tickets to Diego. Sush and Arqam are dev/engineering side, **not QA**. Three roaming bosses, each with distinct attacks and movement.

**Planned signature mechanic:** chain reaction: Zoofi files bug → Sush reassigns to Diego → Arqam adds/returns more tickets. Additional app crashes, production crashes, bursts of fire, harder moving hazards. Simple release checklist gates golden key; no massive real QA flow or giant modal. This is comic engineering chaos.

**Intro:** Zoofi "hello ... can you join"; Sush "I gave all my v2 tickets to diego"; Arqam "I know you just started your day, no worries". Mission **SURVIVE RELEASE DAY!**

**Victory:** Zoofi "I'll reassign this to arqam"; Sush "this is God level man!!!!!"; Arqam "I'll fix diego's bugs"; Diego "Mom Zoofi". Unlock Quality & Engineering.

**Avoid:** security-lab puzzles, permanent blocked corridors, impossible attack spam, giant dialogue boxes covering maze.

### Level 4: Ali, THE KNOWLEDGE GATEKEEPER

**Status:** basic scaffold, specialized puzzle/tech gate mechanics and cutscenes TODO. Skill: **Documentation & Knowledge Transfer** (earlier also called Architecture/KT). Ali is **Engineering Manager**. Target 4–5 min, ~8/10. Theme `KNOWLEDGE TRANSFER LAB`, turquoise/dark server-room/security environment.

**Planned:** technical requests on Diego, documentation/runbooks, staging PR checks, custom domains, security groups and infrastructure cleanup. A manageable security-terminal puzzle, security doors/firewall barriers, roaming hacker enemies, water/electric hazards, documentation collectibles. Don't require actual programming or multiple tedious real technical quizzes.

**Important provenance:** "Before you go, runbook please" is a **written-for-the-game line**, not verified as a real Ali message. Most other listed dialogue was user-supplied. Keep this distinction if quoting on behalf of real teammates.

**Intro:** Ali "Before you go, runbook please." / "Can we do this now?" Mission **COMPLETE THE HANDOVER!**

**Victory:** "Leave me alone😂😂😂". Unlock Documentation & Knowledge Transfer.

### Level 5: Zack, THE FINAL BOSS

**Status:** basic scaffold, final phases/AI finale and complete memory wall TODO. Skill: **AI Leadership**. Zack is CTO, final authority/boss. Target 5–6 min, ~10/10. Theme `FINAL DEPLOYMENT`, rich purple with alarm red and dramatic boss arena.

**Planned:** largest maze, mixed hazards learned in previous levels, increasingly intense boss phases and alarms, Zack's URGENT requests, surprises, escalation after key retrieval; final surprise promo project involving Product Registration, Signal, Sweepstakes and Reviews. Diego needs to use the abilities collected across levels. Preserve fair escape strategy.

**Intro:** Zack "Diego, are you available?"; "URGENT Diego can you look into this"; final banner **ESCAPE BRIJ!**

**Victory:** Zack "incredible Diego". Full cinematic **DIEGO SUCCESSION PLAN** (user says it was Zack's agenda item on Nov 17, 2026); finish AI v1.0 with all five skill modules, funny joke that human Diego is irreplaceable. Diego's final line: "will miss you so much guys but adiós". Transition to Memory Wall with real people, photos, messages and screenshots.

**Avoid:** unavoidable instant-death attacks, endless unskippable dialogues, impossible final objective, rushed memory wall.

## 5. EXACT dialogue library and speaker roles

The current source's `QUOTES` object is authoritative for in-game text. It is transcribed below so future agents can build cutscenes without guessing. Messages may include deliberate lowercase, typos, capitalization and emojis. Do not automatically grammar-correct them.

### Haris (Program Manager / tickets)
- Intro: “Hey Diego can you please help to check when you have a moment required your assistance here? Thanks”
- Attacks: “any updates on this please?”; “Follow up with Diego”; “please help to check this?”; “Diego, kind reminder!”; “DIEGO SOFT REMINDER!!! DIEGOOOOO!!”
- Defeated: “Thanks for help Diego”

### Eren (Project Manager)
- Intro: “did the fix for rebates get released yet?”
- Attacks: “I’d rather break staging than leave something open, please close asap”; “Diego update on the fix? We promised the customers yesterday!”
- Defeated: ten 🔥 emojis

### Jake (Project Manager)
- Intro: “this requires someone with DB access - what needs to be done is already determined fyi”
- Attacks: “resist the urge to create a million test accounts 😂”; “Let's plan one more sprint”; “Can we get hotfix for this?”
- Defeated: “boom”

### Zoofi (Lead QA)
- Intros: “hello”; “can you join”
- Attacks/taunts: “Need a 10-15 min please”; “hello diego can you fix this bug”; “the bug is still not fixed”; “we have to release, can you fix this bug”; “No I can't release without this feature, we can't reassign this ticket to arqam on release day”; “stop kicking me out 😆”
- Defeated: “I'll reassign this to arqam”

### Sush (Engineering Lead)
- Intro: “I gave all my v2 tickets to diego”
- Attacks: “it says the custom domains server prod has not been restarted since updating secrets. Can you verify?”; “can you also point klindi app to use sprint/{date} for merging the PRs path”; “I gave all my v2 tickets to diego”; “Zoofi ask diego to fix it, I am busy with v3”; “diego can you check prod bug”; “Assigning all my tickets to diego”; “Ali, Diego and SRK to look into spreadsheet and to mark it done by tomorrow”
- Defeated: “this is God level man!!!!!”

### Arqam (Developer)
- Intro: “I know you just started your day, no worries”
- Attacks: “Can we do this now? Zoofi is waiting on this for RC testing”; “Can we reallign on custom domains”; “did you just assign me al your tickets, I am giving them back”; “Sorry Diego, I have another ticket to work on”
- Defeated: “I'll fix diego's bugs”

### Ali (Engineering Manager)
- Game-script intro, not confirmed authentic: “Before you go, runbook please.”
- Attacks: “plz make the pr in staging and see the checks are failing in bd-api”; “can you create a new security group specific to custom domain and assign to it only”; “the ticket seems done, can we remove instances?”; “Can we do this now?”; “Can Diego look into rebates instead I have 500 other bugs to fix”
- Defeated: “Leave me alone😂😂😂”

### Zack (CTO, Final Boss)
- Intro: “Diego, are you available?”
- Attacks: “can you explain exactly what happened here?”; “have you done this?”; “URGENT Diego can you look into this”; “WHY IS THE CUSTOM DOMAIN DOWN AGAIN”; “YOU WILL NEVER ESCAPE US”; “we’ll also need promos for Product Registration, Signal, Sweepstakes, Reviews... You’re gonna be busy... 😂”
- Defeated: “incredible Diego”

### Diego (hero)
- Intro: “The future is finally here. The bots working for us”
- Standard line: “The bots are working for us!”
- Final victory: “will miss you so much guys but adiós”
- Zoofi moment: “Mom Zoofi”
- Level 1 comebacks: “Haris, I already said I’ll check!”; “My Slack status is now Away.”; “Please follow up next sprint.”; “Finally, a ticket I can close!”
- Ghost Mode popup: “Diego has left the meeting!”

## 6. UI/asset acceptance criteria from feedback

**Accepted current visual direction:** premium, readable HUD, dark navy + neon teal accents, large full-width maze, no right information column; Level 1 richer wall depth, tiled floor and office decorations; character photos remain recognizable and bodies move; pac-man-like circular boss face. Diegetic drama is welcome but must never cover gameplay.

Detailed UI placement:

- Top: branded title/header, mission status, Current Threat with boss portrait and mode, player health (100/100 and four hits), small score.
- Mid-toolbar: Ghost Mode and Flying Chappal buttons, **dialogue announcement in the empty central strip**, compact objective at right.
- Main: large maze without overlaid objective banner. Exact user complaint: "FIND THE GOLDEN KEY · EXIT LOCKED" was previously drawn over tiles; it was removed.
- Outside gameplay: hit notifications, if present, should not obscure maze. Long instructions appear **only in start tutorial/Help**, not permanently below.
- Start screen: instructions to control Diego before play.
- Boss mode announcement: above Haris's head briefly (and badge in HUD), not as a giant popup.
- End screen: big headline, flare/confetti/firework/sparkle entrance, two portraits, farewell dialogue, AI skill reveal; respect reduced-motion preferences.
- Keep tickets and their particle trails **clipped to maze frame**. This bug was fixed after a screenshot of tickets sticking out beyond the border.
- **Sush likeness** matters especially: ensure his real recognizable photo is shown, avoid generic inaccurate stylization.
- All nine faces supplied: Diego, Haris, Eren, Jake, Sush, Zoofi, Arqam, Ali, Zack. Embedded source photos make the game portable offline. If separating asset files, ensure legal/consent and image integrity and test paths.

## 7. Development TODO, prioritized

### A. Regression and source hygiene (do FIRST)

- [ ] **Commit the current restored working `index.html` as a known-good checkpoint.**
- [ ] Run a complete visual Level 1 playthrough on current target browser (desktop Chrome): intro → key → chase → exit → victory → module reveal.
- [ ] Deliberately test four sequential hits, Ghost immunity, Chappal hit/stun, DND shield, heal cap, damage invulnerability, random snake/beetle movement, hit text position.
- [ ] Verify **Retry Same Maze** truly preserves layout and collectible positions; fresh restart should differ.
- [ ] Verify boss projectiles travel through interior walls while never leaving the game frame.
- [ ] Verify game HUD remains clean at different window sizes and scroll/zoom settings, including dialogue banner long text.
- [ ] Test help, pause, restart, skip intro, keyboard and on-screen controls, tab visibility, victory confetti and reduced-motion preference.
- [ ] Test older/low-power laptop performance *without* reintroducing the broken caching renderer. Profile before optimizing.
- [ ] Inspect CSS/JavaScript for dead code and duplicated styling, refactor one function at a time only after baseline.
- [ ] Verify Level 1 obstacle count and pace against goal (one snake and one beetle as original design target vs actual hazard generation count).

### B. Level 2 implementation (NEXT FEATURE MILESTONE)

- [ ] Build and approve a skippable Eren-and-Jake intro with both photo faces and user dialogue.
- [ ] Create a medium, visually distinct Deadline Dimension maze, larger than Level 1, with paths guaranteed accessible.
- [ ] Implement **two independently moving bosses**, each with different behavior and telegraphed attacks.
- [ ] Eren deadline countdown pressure and Jake temporary requirement barricades, with no impossible soft locks.
- [ ] Implement coordinated duo combo near key/exit; test two-boss collision/damage fairness.
- [ ] Add moderate new traps/obstacles without Level 3 production chaos.
- [ ] Exit/key gating with clear objective, consistent health and ability HUD.
- [ ] Victory lines (10 fires + “boom”), skill reveal **Project Mastery**, and smooth transition to Level 3.
- [ ] Test full Level 2 loop including death/retry and timing, aim 3–4 minutes.

### C. Level 3 implementation

- [ ] Level 3 cutscene and tailored engineering/QA visual theme.
- [ ] Three distinct moving bosses: Zoofi bugs, Sush ticket assignment, Arqam return tickets.
- [ ] Combo attack scripting with readable cues and cooldowns; don't make all three spam simultaneously without warning.
- [ ] Production crash/app crash/fire obstacles; keep sightlines and collision fair.
- [ ] Lightweight release checklist objective, key/exit, reactions, defeat lines and "Mom Zoofi" beat.
- [ ] Skill reveal **Quality & Engineering** and difficulty/playtime tests.

### D. Level 4 implementation

- [ ] Ali intro and distinct cybersecurity/server-room maze.
- [ ] Engineer-manager documentation, staging, infrastructure, KT/runbook themed attacks.
- [ ] Manageable terminal/security puzzle, firewall doors, hacker behavior, water/electric hazards.
- [ ] Ensure no real programming knowledge is needed; avoid tedious repeating puzzles.
- [ ] Victory and **Documentation & Knowledge Transfer** module, test for path soft locks.

### E. Level 5 finale

- [ ] Zack cinematic intro, escalating but fair chase phases, surprise promo project.
- [ ] Largest maze; curated return of prior hazard mechanics, cap visual overload.
- [ ] Final escape triggers **Diego Succession Plan**, complete five module AI reveal.
- [ ] Collect actual farewell photos/screenshots/messages from team (with permission).
- [ ] Implement polished, readable **Memory Wall**, perhaps navigable pages/tiles, and closing Diego line.
- [ ] Full start-to-finish final QA and distribution package.

### F. General product polish and nice-to-haves

- [ ] Explicit mute/sound volume toggle, music only if original/licensed.
- [ ] FPS metrics available during QA only, not in shipped screen.
- [ ] Performance profiling, careful effect budget and fallback effects quality.
- [ ] Optional accessibility settings: reduced motion, high contrast, key rebinding.
- [ ] Browser compatibility and keyboard focus handling tests.
- [ ] Responsive viewport scaling without altering collision world or making HUD cover maze.
- [ ] A clean project split into JS/CSS/asset files *only when supported by screenshot/playtest regression tests*.
- [ ] Package a final offline build and backup source repository.

## 8. Explicitly rejected, rolled-back, or postponed ideas

- **ROLLED BACK:** attempted aggressive static scene caching/offscreen rendering intended to fix lag. It caused duplicate walls, streaks and misplaced visual artifacts; user explicitly asked to revert. Current restored build is preferred.
- **REJECTED FOR LEVEL 1:** expanding its maze, new bosses, a flood of additional hazards, timers/pressure puzzles that belong to future levels.
- **REPLACED:** fixed bosses standing still; Haris must roam and chase. Snakes cannot get stuck. Photo heads were preferred to heavily pixelated faces.
- **REPLACED:** long right sidebar listing Diego AI skills/instructions; full AI checklist displayed only at skill-reveal moments and final AI assembly.
- **REPLACED:** big text/dialogue popups drawn over maze; use HUD and the narrow central dialogue strip.
- **REPLACED:** tickets escaping visual bounds; must be clipped.
- **NOT YET BUILT AS COMPLETE FEATURES:** deadline countdown puzzles, Level 3 coordinated combo/release checklist, Level 4 terminal/security challenge, Level 5 multi-phase final boss and finished team Memory Wall.
- **DO NOT MISREPRESENT:** syntax validation does not guarantee bug-free performance, visuals, all level paths, or compatibility.

## 9. Acceptance tests for safe future changes

At minimum after any change, verify:

1. `index.html` opens without console errors; photos render and responsive UI does not overlap.
2. Starting the game shows instructions, then skippable three-step Level 1 intro and expected maze layout.
3. WASD/arrows move Diego; doors/walls block player; Haris, snake and beetle patrol without freezing.
4. Haris alternates mode before key, switches to Reminder Mode after key; dialogue appears in **center top banner**, not Current Threat nor over maze.
5. SPACE protects for 2 seconds with 10-second cooldown; F throws chappal with 2.5-second cooldown.
6. Hit removes 25 HP unless protected; at 0 display failure screen; retry uses same layout.
7. Key activates door; escape triggers cinematic win, then time/health/defeats and Ticket Intelligence.
8. Tickets remain clipped to viewport; no trails or duplicated walls outside map.
9. FPS measured during active movement, projectile spam and victory confetti (report measured machine/browser).
10. User can proceed from Level 1 to Level 2; if that level is unfinished, describe it accurately as scaffold.

## 10. Suggested next work session

1. `git init` and commit baseline if not already under version control.
2. Open `index.html` in Antigravity/browser and capture screenshots at start, playing, hit, key found, loss and victory.
3. Fix only regression failures. Do **not** attempt speculative performance optimization first.
4. Begin **Level 2 Eren & Jake**, implementing their dual boss behavior and intro/victory while keeping Level 1 snapshot tested.
5. Stop after a verified milestone, document findings and commit the change.

See `Chat.md` for the full design-decision history and source of feature requests.
