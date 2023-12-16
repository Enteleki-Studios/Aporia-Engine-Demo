import {
    DirectionalLight,
    StandardRenderer,
    // DefaultGrid,
    // SkySphere,
} from 'gengine'
import {
    // Fog,
    // Color,
    // EquirectangularReflectionMapping,
    // SRGBColorSpace,
    // TextureLoader,
} from 'three'

export class Renderer extends StandardRenderer {
    directionalLight?: DirectionalLight // TODO: is this the best place for this?

    hasWorld = false

    constructor(params: { canvas?: HTMLCanvasElement }) {
        super(params)

        this.setSize(1920, 1080)

        // this.setDebugMode('sideBySide')

        // this.scene.add(new DefaultGrid(32, { text: 'Dungeon' }))

        // dirtMesh.receiveShadow = true
        // this.scene.add(dirtMesh)

        // this.scene.fog = new Fog(0x161616, 15, 40)
        // this.scene.background = new Color(0x161616)
        // this.scene.add(new SkySphere())
        // const sky = new TextureLoader().load('/resources/sky/PurplyBlueSky.png')
        // sky.mapping = EquirectangularReflectionMapping
        // sky.colorSpace = SRGBColorSpace
        // this.scene.background = sky
        // this.scene.overrideMaterial = new MeshBasicMaterial({ wireframe: true, color: '#0089cc' })
    }
}

// if (!this.hasWorld) {
//     const [levelComponent] = componentManager.getTuplesByQueryGeneric<[LevelComponent]>([LEVEL])[0]
//     this.addWorld(levelComponent)
// }

// addWorld(levelComponent: LevelComponent) {
//     const wallGeometries = []
//     const { tiles } = levelComponent

//     const createWall = (x: number, y: number) => {
//         const b = new THREE.BoxBufferGeometry(1, 4, 1)
//         const mat4 = new THREE.Matrix4()
//         mat4.makeTranslation(x, 2, y)
//         b.applyMatrix4(mat4)
//         return b
//     }
//     for (let x = 0, maxX = tiles.length; x < maxX; x += 1) {
//         for (let y = 0, maxY = tiles[0].length; y < maxY; y += 1) {
//             const tile = tiles[x][y]
//             if (tile[1]) {
//                 wallGeometries.push(createWall(x, y))
//             }
//         }
//     }

//     const mergedWallGeometries = mergeBufferGeometries(wallGeometries, false)

//     const wallTexture = new THREE.TextureLoader().load('/resources/textures/wall.jpg')
//     wallTexture.wrapS = THREE.RepeatWrapping
//     wallTexture.wrapT = THREE.RepeatWrapping
//     wallTexture.repeat.set(1, 3)
//     const wallMaterial = new THREE.MeshStandardMaterial({
//         map: wallTexture,
//         flatShading: true,
//         side: THREE.FrontSide,
//     })
//     const wallMesh = new THREE.Mesh(mergedWallGeometries, wallMaterial)
//     wallMesh.receiveShadow = true
//     wallMesh.castShadow = true
//     this.scene.add(wallMesh)

//     this.hasWorld = true
// }
