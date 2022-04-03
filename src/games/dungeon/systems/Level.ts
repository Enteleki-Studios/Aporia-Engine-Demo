// /* eslint-disable class-methods-use-this */
// // import * as ROT from 'rot-js'
// // import { Vector2 } from 'three'
// import { System } from 'gengine'
// // import { LEVEL, MODEL, POSITION } from 'components/types'
// // import type { Position, Level as LevelComponent } from 'components'

// export class Level extends System {
//     // display: ROT.Display

//     // _createDisplay() {
//     //     const display = new ROT.Display({
//     //         width: this.mapSize[0],
//     //         height: this.mapSize[1],
//     //         fontSize: 1,
//     //         fg: '#fff',
//     //         bg: '#000',
//     //     })

//     //     const debugCanvas = <HTMLElement>display.getContainer()
//     //     // const mapScale = 6

//     //     debugCanvas.id = 'mapCanvas'
//     //     // debugCanvas.style = `width: ${this.mapSize[0] * mapScale}px; height: ${this.mapSize[0] * mapScale}px`
//     //     document.getElementById('map')!.append(debugCanvas)

//     //     return display
//     // }

//     tick() {
//         // const levelComponents = (this.ECS.ComponentManager.getTuplesByQuery([LEVEL]) as unknown) as LevelComponent[]

//         // this.ECS.ComponentManager.getTuplesByQuery([MODEL, POSITION]).forEach(
//         //     ([, positionComponent]) => {
//         //         const { position: { x, z } } = positionComponent as Position
//         //         this.display.draw(Math.floor(x / 2), Math.floor(z / 2), '', '', '#cd00cd')
//         //     },
//         // )
//     }
// }
