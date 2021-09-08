# drauu

[![NPM version](https://img.shields.io/npm/v/drauu?color=a1b858&label=)](https://www.npmjs.com/package/drauu)

SVG-based drawing tool in browser. Built for [Slidev](https://github.com/slidevjs/slidev).

[Live Demo](http://drauu.netlify.app/) (built with Vanilla JavaScript!)

## Features

- Vanilla JavaScript - integrate into any framework you like
- SVG-based - scalable, transparent and serializable
- Stylus/Touch pressure support 
- Headless (unstyled) - style it as you want
- Undo / Redo stacks
- [ ] Export to SVG / PNG

## Install

```bash
npm i drauu
```

```html
<svg id="svg"></svg>
```

```js
import { createDrauu } from 'drauu'

const drauu = createDrauu({ el: '#svg' })
```

## Credits

Inspired by

- [scribby](https://github.com/naknomum/scribby) by [naknomum](https://github.com/naknomum)
- [excalidraw](https://github.com/excalidraw/excalidraw)
- [draw](https://github.com/amoshydra/draw) by [amoshydra](https://github.com/amoshydra)
- [live-draw](https://github.com/antfu/live-draw) by [antfu](https://github.com/antfu)

Thanks!

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

MIT
