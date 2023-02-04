# ponczek
*Deep-fried game framework with sweet filling.*

<img src="./resources/logo.svg" alt="Project logo" width="500">

## 🤔 Why?
I wanted something that would make it easier for me to create 2D games during game jams. This framework's design and future development reflects the type of games I like to make.

I've made this for myself, but anyone is welcome to use it. Expect breaking changes though.

## 👩‍💻 What it is?
- Very opinionated
- Software rendering
- Easy to use with *fantasy console*-like API
- Prioritizes performance over memory usage and bundle size
- Tries really hard to avoid GC in game loop
- Provides API that makes it easy to avoid GC in game loop
- (almost) zero dependencies _*_
- Easy to understand and extend code base

_* Only uses minimal amount of high quality runtime dependencies that are in and of themselves no dependency libraries._

## 🙅‍♀️ What it is not?
- Not made for high fidelity games
- Not a fully featured game engine
- Does not support mobile

## 🍩 Features
*For example usage of these feature check out the [demo page](https://deseteral.github.io/ponczek) and its [source](/Deseteral/ponczek/tree/main/examples).*

- 2D software rendering
  - Primitive shape rendering (lines, rectangles, circles)
  - Drawing textures
  - Drawing nine slices
  - Drawing monospaced sprite fonts
  - Color utilities
  - *Fragment shader*-like effect system
    - Custom effects support
    - Built-in RGB filtering effect
    - Built-in color replacement effect
  - Camera
  - Spritesheets
  - Clipping
  - Allows dropping to [browser's Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) for unsupported features
- Simple sound effects player
- Keyboard and mouse input system
  - Supports binding
- Math module
  - Data structures and algorithms (Vector2, Rectangle)
  - Random number generator
  - Simplex noise generator
  - A* pathfinding
- GUI
  - Grid component with keyboard navigation
- Data structures
  - Tilemap
  - Priority queue (via [heapify](https://github.com/luciopaiva/heapify) package)
- Asset loader
- Scene manager
  - Stack based
  - Scene transition animation system
- Data storage for save data (uses `localStorage`)
- Timers

Uses fantastic font [Monogram by datagoblin](https://datagoblin.itch.io/monogram) as a default font.

Works in every major browser.

## 🔋 Quickstart
To create new project use:
```sh
npm create ponczek-game
```

# 🧰 Development
Install dependencies using `yarn`.

You can start examples project in watch mode using:
```sh
npm run examples:dev
```

For type checking in watch mode during development use:
```sh
npm run test:type-check:watch
```

## 📝 License
This project is licensed under the [MIT license](LICENSE).
