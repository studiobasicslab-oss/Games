MASTER PROMPT — Interactive Rubik's Cube Ring Puzzle Game
1. Core concept

Build a fully interactive browser game based on a standard 3×3 Rubik's Cube, but do NOT make the conventional 3D Rubik's Cube the primary interaction.

The main game mechanic is:

Map the Rubik's Cube onto a system of overlapping circular rings. Rotate the rings to rotate the corresponding parts of the cube. Solve the cube using the ring interface.

The experience should feel like a puzzle game, not a technical simulator.

The player should be able to understand the game by interacting with it rather than reading a large instruction manual.

The tagline/concept is:

Map the cube onto circles. Rotate rings. Solve the puzzle.

2. IMPORTANT: Do not make it a static visualisation

The current implementation looks like a visual demo with:

circles
coloured dots
a small 3D cube
buttons
move counter

That is NOT enough.

The new implementation must feel like an actual game.

The player must:

Start with a solved cube.
Scramble it.
Understand which pieces belong to which rings.
Click/drag the rings.
See the pieces physically move around the rings.
Understand that every ring rotation corresponds to a legitimate Rubik's Cube move.
Manipulate the puzzle until the cube is solved.
Receive feedback when solved.
Be able to restart, scramble, undo, and continue playing.
3. Game structure

The application should have three major areas.

A. Main puzzle area

This is the ring interface.

It should occupy most of the screen.

This is where the player actually plays.

B. Secondary 3D cube

Show a small 3D Rubik's Cube somewhere on the side.

The 3D cube is not the primary interaction.

Its purpose is:

show the physical cube state
help the player understand the relationship between the rings and cube
provide visual feedback
make the transformation understandable

Every ring movement must immediately update the 3D cube.

Every cube state change must immediately update the ring representation.

They must NEVER become out of sync.

C. Game controls

Include:

Scramble
Reset
Undo
Redo
Move counter
Timer
Pause
Help / How to Play
New Game

Do not make the controls dominate the screen.

4. The actual puzzle model

Implement a real mathematical 3×3 Rubik's Cube state.

Do NOT fake the animation.

Do NOT independently move coloured dots.

The application must maintain a real cube state consisting of:

6 faces
9 stickers per face
54 stickers total
8 corner cubies
12 edge cubies
6 centres

Use a proper cube representation internally.

For example:

U
D
F
B
L
R

Each face has:

0 1 2
3 4 5
6 7 8

The centre sticker of each face identifies that face's colour.

5. Standard cube colours

Use the standard six colours:

White
Yellow
Green
Blue
Red
Orange

Use a consistent colour scheme.

Do not randomly change colours.

The centre pieces must remain fixed relative to the cube.

6. Standard Rubik's Cube moves

The game must support all standard face rotations:

U
U'

D
D'

L
L'

R
R'

F
F'

B
B'

A clockwise rotation is one move.

A counter-clockwise rotation is the inverse move.

A 180° rotation can optionally be supported:

U2
D2
L2
R2
F2
B2

Internally, every move must be represented as a permutation of the actual cube pieces/stickers.

7. THE RING SYSTEM — most important part

The ring interface is the heart of the game.

Do not simply draw random concentric circles.

The circles must have a mathematical relationship with the cube.

Each ring represents a particular orbit/group of cube stickers.

When the player rotates a ring:

The corresponding cube pieces must undergo the exact permutation produced by the associated Rubik's Cube move.

The ring system should therefore be a different visual representation of the same cube state.

8. Ring visualisation

Create a large central circular puzzle.

Use multiple overlapping circular rings.

The rings should look like:

       ○
   ○       ○
 ○     ●     ○
   ○       ○
       ○

but the final design should be much more sophisticated and visually appealing.

The circles should overlap in a deliberate structure representing the cube.

Avoid making it look like a generic Venn diagram.

9. Important: The dots are cube stickers

Every coloured dot in the ring interface represents a specific cube sticker or cubie.

The dots are NOT decorative.

Each dot must correspond to an actual sticker in the cube state.

For example:

red dot → specific sticker on the cube
blue dot → specific sticker on the cube
white dot → specific sticker on the cube

The application must know exactly which sticker each dot represents.

Therefore:

cube state
      ↓
sticker positions
      ↓
ring positions
      ↓
rendered dots
10. Ring rotations

The player should rotate a ring by:

Mouse

Click and drag inside the ring.

Trackpad

Click-drag or swipe.

Touchscreen

Touch and drag.

The rotation should feel physical.

For example:

drag clockwise
      ↓
ring rotates clockwise
      ↓
stickers travel around the ring
      ↓
cube performs corresponding face move

Do not require the player to click a tiny button.

The ring itself is the control.

11. Snap-to-move behaviour

Do not allow arbitrary rotation angles.

The cube only supports discrete quarter-turns.

Therefore the ring should behave like a physical puzzle.

While dragging:

0°
   ↓
45°
   ↓
90°

The ring follows the cursor.

When the player releases:

determine whether they intended clockwise or counter-clockwise
snap to the nearest valid 90° increment
perform exactly one cube move

Optionally support:

90°  → 1 move
180° → 2 moves
270° → inverse move

But avoid accidental moves.

Use a threshold before committing.

12. Physical feeling

This is extremely important.

The interaction should feel satisfying.

When the user drags a ring:

the ring should follow the pointer
stickers should move smoothly
nearby rings should remain stable
the movement should have inertia/easing
the ring should snap into place
there should be a subtle click/snap animation
the corresponding cube face should rotate simultaneously

The user should feel:

"I am physically turning this part of the puzzle."

Not:

"I clicked a button and the website changed some dots."

13. Ring highlighting

When the cursor enters a ring:

Highlight the active ring.

For example:

inactive:
thin dark ring

hover:
brighter ring + subtle glow

dragging:
strong highlight + rotation indicator

Also show a small label such as:

U
F
R

when the player is interacting with a ring.

Do not permanently clutter the interface with labels.

14. Move feedback

Whenever the player performs a move, show a subtle move indicator.

For example:

R
R'
U
F'

The latest move can briefly appear near the puzzle.

Also maintain:

MOVES
27

Do not show a giant technical notation panel unless the player opens the move history.

15. Move history

Provide a collapsible move history.

Example:

MOVE HISTORY

1. R
2. U
3. R'
4. F
5. D'
...

Allow the player to:

undo
redo
clear history

Undo must reverse the actual cube permutation.

Do not reset the cube.

16. Scramble system

Create a real scramble generator.

Do not simply apply random moves without restrictions.

Generate a legitimate Rubik's Cube scramble.

For example:

R U' F L2 D R' B U ...

Avoid unnecessary consecutive moves on the same face.

For example, don't generate:

R R' R R2

Instead generate a realistic scramble sequence.

The scramble should be applied to the actual cube state.

17. Scramble animation

When the player presses:

SCRAMBLE

do not instantly teleport the cube to a new state.

Instead:

Generate scramble.
Display:
SCRAMBLING...
Animate each move.
Rotate the corresponding rings.
Update the cube.
Finish with:
SCRAMBLED

Then start the timer.

18. Timer

When the player starts solving:

00:00

Start the timer after scrambling finishes.

Display:

TIME
01:37.42

Stop the timer when the cube is solved.

Do not start the timer while the player is looking at the menu.

19. Solved detection

The game must automatically detect when the cube is solved.

A cube is solved when:

all stickers on each face have the same colour

When solved:

stop timer
freeze move counter
play a satisfying animation
highlight the completed rings
animate the cube
display a success message

Something like:

SOLVED!

01:42.83
37 MOVES

Nice.

Do not make it childish or overly flashy.

The celebration should fit the elegant puzzle aesthetic.

20. Game loop

The basic game loop should be:

START
 ↓
SOLVED CUBE
 ↓
SCRAMBLE
 ↓
SCRAMBLED CUBE
 ↓
PLAYER ROTATES RINGS
 ↓
CUBE STATE CHANGES
 ↓
CHECK SOLVED
 ↓
NOT SOLVED → CONTINUE
 ↓
SOLVED
 ↓
STOP TIMER
 ↓
SHOW RESULT
21. Game modes

Build the architecture so additional modes can be added later.

Initially implement:

Mode 1 — Free Solve

Player gets:

unlimited time
unlimited undo
move counter
no hints
Mode 2 — Timed

Player tries to solve as quickly as possible.

Mode 3 — Challenge

Generate a scramble and give the player:

TIME LIMIT
MOVES LIMIT
Mode 4 — Learn

Explain the ring system interactively.

Do not implement all of these if it compromises the core experience.

The Free Solve mode must be excellent first.

22. Tutorial / onboarding

When the player opens the game for the first time, don't dump a wall of instructions on them.

Instead create an interactive tutorial.

Step 1:

THIS IS A RUBIK'S CUBE.

Show the cube.

Step 2:

WE'VE MAPPED IT ONTO RINGS.

Highlight corresponding pieces.

Step 3:

DRAG A RING.

Let the user drag it.

Step 4:

THE RING ROTATES.
THE CUBE ROTATES WITH IT.

Step 5:

NOW TRY IT YOURSELF.

Then let them play.

23. Visual relationship between ring and cube

This is one of the most important UX features.

The user should be able to understand:

"Which part of the cube does this ring control?"

When hovering a ring:

highlight that ring
highlight the corresponding face on the 3D cube

For example:

Hover R ring
      ↓
R ring glows
      ↓
Right face of 3D cube glows

And vice versa:

Hovering the R face of the cube should highlight the corresponding ring.

This creates a visual bridge between the two representations.

24. Optional "Show connection" interaction

Add a subtle educational feature.

If the player clicks a ring once without dragging:

show temporary lines connecting:

RING
 ↓
cube stickers
 ↓
3D cube face

After 1–2 seconds, the lines disappear.

This helps players learn the mapping.

25. Do NOT make the 3D cube independently draggable

The 3D cube should primarily be a visual reference.

The ring interface is the main game.

However, optionally allow:

rotate camera
zoom
inspect cube

But do not allow the user to perform arbitrary cube moves from the 3D model unless explicitly enabled in an "advanced controls" setting.

Otherwise users may ignore the ring mechanic.

26. The ring interface must be the star

The visual hierarchy should be:

          RING PUZZLE
              ↓
          MAIN FOCUS

      3D CUBE → secondary

      controls → tertiary

Do NOT make the 3D cube larger than the ring puzzle.

27. Design language

The aesthetic should feel like:

futuristic puzzle
mathematical
elegant
slightly mysterious
satisfying
premium
experimental

Think:

"What if a Rubik's Cube became a digital puzzle from a sci-fi laboratory?"

Avoid:

generic SaaS dashboard
corporate UI
spreadsheet aesthetic
excessive cards
excessive text
childish game graphics
huge buttons everywhere
28. Background

Use a dark background.

Something around:

#080B12

or similar.

The puzzle should appear to float in space.

Use subtle:

gradients
glow
shadows
depth
particle-like background details

But keep it restrained.

29. Ring styling

Rings should be:

thin
luminous
elegant
slightly transparent

Use subtle gradients/glows.

The coloured cube stickers/dots should stand out against the dark background.

Do not make every ring extremely bright.

Only the active ring should become prominent.

30. Sticker/dot design

Each sticker marker should be visually distinctive.

Use:

circular or slightly rounded pieces
subtle 3D shading
tiny highlight
shadow
colour glow

For example:

      ✦
    ●

The dots should feel like physical puzzle pieces projected onto a digital interface.

31. Animations

Animations should be fast and responsive.

Target approximately:

200–500ms

for normal moves.

Use easing.

Avoid slow animations that make solving annoying.

For example:

drag
 ↓
ring follows pointer
 ↓
release
 ↓
snap
 ↓
cube rotates
 ↓
settle

The entire move should feel almost instantaneous but satisfying.

32. Sound design

If sound is enabled:

Normal ring movement:

soft mechanical movement

Move completion:

subtle click

Solved:

pleasant layered chime

Scramble:

rapid mechanical clicks

Include a mute button.

Sound should be subtle.

33. Mobile support

The game must work on:

desktop
laptop
tablet
mobile

On mobile:

drag rings with touch
pinch/zoom if necessary
UI rearranges vertically
ring puzzle remains the main focus

Do not require a mouse.

34. Responsive desktop layout

Desktop:

┌──────────────────────────────────────────────┐
│                 RING PUZZLE                  │
│                                              │
│             ○       ○                       │
│         ○       ●       ○                    │
│             ○       ○                       │
│                                              │
│                    ┌──────────┐              │
│                    │  3D CUBE │              │
│                    └──────────┘              │
│                                              │
├──────────────────────────────────────────────┤
│ TIME     MOVES      UNDO      SCRAMBLE       │
└──────────────────────────────────────────────┘

But the actual design should be much more polished.

35. Game HUD

Keep the HUD minimal.

Top:

RING CUBE

Then:

TIME
01:24

MOVES
31

Controls:

↶ Undo
↷ Redo
🎲 Scramble
↻ Reset
?

Avoid a large right-side dashboard like the current prototype.

The game should feel like a game, not a control panel.

36. Keyboard controls

Add keyboard support.

For example:

U = U
Shift + U = U'

R = R
Shift + R = R'

F = F
Shift + F = F'

D = D
Shift + D = D'

L = L
Shift + L = L'

B = B
Shift + B = B'

Also:

Space = pause
Z = undo
Y = redo
S = scramble
R = reset

Avoid conflicts between keyboard shortcuts and UI controls.

37. Accessibility

Include:

colour-blind-friendly option
keyboard controls
visible focus states
reduced-motion option
sound toggle
sufficient contrast
labels for screen readers where practical

Do not rely exclusively on colour to communicate state.

38. Technical architecture

Separate the application into:

Cube Engine
    ↓
Move Engine
    ↓
Ring Mapping
    ↓
Ring Renderer
    ↓
3D Cube Renderer
    ↓
Game/UI Layer

The Cube Engine is the source of truth.

Never let the UI independently determine the cube state.

39. Cube engine

Create functions conceptually like:

createSolvedCube()

scrambleCube()

applyMove(move)

undoMove()

redoMove()

isSolved()

getStickerState()

getCubieState()

Moves must be deterministic.

For example:

applyMove("R")
applyMove("U")
applyMove("R'")

must produce the exact state expected from a real Rubik's Cube.

40. Ring mapping

Create an explicit mapping layer:

ring → cube permutation

For example conceptually:

RING_1 → U
RING_2 → R
RING_3 → F

But DO NOT simply assign rings arbitrarily.

The mapping must correspond to the actual mathematical representation you are implementing.

Document this mapping clearly in the code.

41. Critical mathematical requirement

The ring representation must be lossless.

It must be possible to reconstruct the complete cube state from the ring representation.

That means:

Cube state A
      ↓
Ring representation A

Cube state B
      ↓
Ring representation B

Different cube states must not accidentally produce the same ring state.

Every sticker must have a unique identity.

42. No fake animation

This is a hard requirement.

DO NOT implement:

ring rotates visually
but cube state remains unchanged

or:

cube rotates
but ring dots are merely shuffled visually

Every visual action must originate from the same underlying cube-state engine.

43. Synchronisation

At all times:

CUBE STATE
     ↓
 ┌───┴────┐
 ↓        ↓
RINGS    3D CUBE

Both are views of the same state.

Never:

RINGS → independent state

3D CUBE → independent state
44. Scramble → ring state

When scrambled:

Solved cube
     ↓
scramble sequence
     ↓
new cube state
     ↓
calculate ring representation
     ↓
render rings

Do NOT randomly place dots on the circles.

45. Reset

Reset must return the cube to:

Solved state

and reset:

timer
move counter
history
redo stack
46. Undo

Undo should:

current state
     ↓
reverse last move
     ↓
previous state

Example:

R U F

Undo:

R U

Undo again:

R

Undo again:

Solved
47. Redo

If the player:

R U F

then:

Undo

and then performs a new move:

L

the old redo history should be cleared.

This should behave like a standard undo/redo system.

48. Move counting

Count moves according to actual cube moves.

For example:

R = 1
R' = 1
R2 = 2

Do not count mouse events.

Dragging halfway around a ring is not automatically a move.

Only committed cube rotations count.

49. Invalid interactions

If the player clicks outside a ring:

Do nothing.

If the player begins dragging but doesn't cross the movement threshold:

Cancel the interaction.

Do not accidentally modify the cube.

If the puzzle is solved:

Disable normal movement until the player chooses:

New Game

or

Continue / Explore
50. Hints

Add an optional hint system.

A hint should NOT simply solve the entire puzzle.

Instead:

HINT
Try rotating this ring clockwise.

Highlight the relevant ring.

For an advanced hint:

NEXT MOVE
R'

But keep hints optional.

Hints can be tracked separately from normal play.

51. Beginner mode

Add an optional beginner mode where:

active ring is highlighted strongly
corresponding cube face is highlighted
move notation appears
hints are available
tutorial explanations appear

Advanced mode can remove these assists.

52. Challenge scoring

Do NOT initially overcomplicate scoring.

Track:

Time
Moves
Hints used

Potential score later:

score = time efficiency + move efficiency

But do not artificially reward random actions.

53. Leaderboard-ready architecture

Even if there is no backend initially, structure the game so a leaderboard could eventually be added.

Store:

scramble
time
moves
hints
date
difficulty

This makes future online competitions possible.

54. Visualisation of piece identity

One particularly fun feature:

When hovering over a coloured dot, show:

CORNER
White / Green / Red

or:

EDGE
Blue / Orange

This helps players understand the underlying cube mechanics.

Optional advanced mode:

Sticker #37
55. Educational layer

The game should secretly teach:

permutations
cycles
orbits
spatial reasoning
Rubik's Cube mechanics
group operations

But don't make it feel like a maths lesson.

For example, when a ring rotates:

12 pieces moved
3 pieces remained fixed

could optionally appear.

This is an advanced visualisation mode.

56. "Matrix / Orbit mode"

Add a separate optional mode called:

ORBIT VIEW

This mode visualises the mathematical structure.

Show:

A → B → C → D → A

for the pieces affected by a move.

This is where the original image's mathematical aesthetic can be used.

Normal gameplay should remain clean.

57. Game progression

Eventually allow:

LEVEL 1
Understand rings

LEVEL 2
Simple scramble

LEVEL 3
Medium scramble

LEVEL 4
Advanced scramble

LEVEL 5
Timed challenge

But don't lock the basic game behind progression.

58. The most important UX principle

The player should gradually realise:

"Oh! These circles aren't just a representation. They ARE the cube."

That should be the central experience.

The game should create an "aha!" moment.

59. What NOT to do

Absolutely avoid these mistakes:

❌ Do not make it a dashboard

No giant collection of cards.

❌ Do not make the 3D cube the primary interface

The ring puzzle is the game.

❌ Do not use fake dots

Every dot corresponds to a real cube sticker.

❌ Do not use random ring mappings

The mapping must be mathematically valid.

❌ Do not make every ring independently rotate arbitrarily

Only rotations corresponding to legal cube operations should be possible.

❌ Do not make the user press buttons for every move

Dragging the ring should be the main interaction.

❌ Do not instantly teleport pieces

Animate movement.

❌ Do not make the interface overly instructional

Teach through interaction.

❌ Do not sacrifice correctness for visual effects

The cube engine comes first.

60. Implementation priority

Build this in stages.

PHASE 1 — Cube engine

Implement:

solved cube
sticker state
all 12 moves
scramble
reset
undo
redo
solved detection

Do not work on fancy UI yet.

PHASE 2 — Ring mapping

Implement:

sticker → ring mapping
ring → cube move mapping
correct ring rendering
correct sticker movement
PHASE 3 — Interaction

Implement:

drag
rotation detection
snapping
move commitment
animations
PHASE 4 — 3D cube

Connect the real cube state to the 3D renderer.

PHASE 5 — Game UX

Add:

timer
move counter
scramble
hints
tutorial
game completion
PHASE 6 — Polish

Add:

sound
particles
transitions
hover effects
responsive design
accessibility
mobile support
61. Acceptance criteria

The implementation is NOT complete until all of these work:

Cube correctness
 Standard 3×3 cube
 54 stickers
 Correct colours
 Correct face rotations
 Correct inverse moves
 Correct scramble
 Correct solved detection
Ring interaction
 Rings are draggable
 Dragging corresponds to legitimate cube moves
 Rings snap to valid positions
 Stickers animate
 No invalid cube states can be created
Synchronisation
 Ring state matches cube state
 3D cube matches ring state
 Scramble updates both
 Undo updates both
 Redo updates both
 Reset updates both
Game
 Timer
 Move counter
 Scramble
 Reset
 Undo
 Redo
 Solved animation
 Tutorial
UX
 Ring is the primary focus
 3D cube is secondary
 Responsive
 Mouse interaction
 Touch interaction
 Keyboard interaction
 No accidental moves
 Smooth animations
62. Final design goal

The final experience should feel like this:

The player sees a beautiful dark screen.

In the centre is an intricate arrangement of glowing rings and coloured pieces.

They drag one ring.

Click.

The pieces travel around their paths.

The corresponding face of the 3D cube rotates.

The player looks at the puzzle.

They realise:

"Wait... I am actually manipulating the Rubik's Cube through these circles."

They scramble it.

They experiment.

They learn the relationship between the rings.

Eventually:

Solved.

The entire system lights up subtly.

Timer stops.