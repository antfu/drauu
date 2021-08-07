# drauu

SVG-based drawing tool in browser.

[Live Demo](http://drauu.netlify.app/)

## Features

- Vanilla JavaScript - integrate into any framework you like
- SVG-based - scabable, transparent and seraializable
- Stylus/Touch pressure support 
- Headless (unstyled) - style it as you want
- Undo / Redo stacks
- [ ] Eraser
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
