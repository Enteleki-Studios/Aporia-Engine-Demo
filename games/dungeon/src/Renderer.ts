import {
    DirectionalLight,
    StandardRenderer,
    // DefaultGrid,
    SkySphere,
} from 'gengine'
import {
    MeshStandardMaterial,
    PlaneGeometry,
    Mesh,
    TextureLoader,
    RepeatWrapping,
    // Fog,
    Color,
} from 'three'

export class Renderer extends StandardRenderer {
    directionalLight?: DirectionalLight // TODO: is this the best place for this?

    hasWorld = false

    constructor(params: { canvas?: HTMLCanvasElement }) {
        super(params)

        this.setSize(1920, 1080)

        // this.setDebugMode('sideBySide')

        // this.scene.add(new DefaultGrid(32, { text: 'Dungeon' }))

        const dirtTex = new TextureLoader().load('/resources/textures/floor.jpg')
        dirtTex.wrapS = RepeatWrapping
        dirtTex.wrapT = RepeatWrapping
        dirtTex.repeat.set(32, 32)
        const dirtMat = new MeshStandardMaterial({
            map: dirtTex,
        })
        const dirtGeo = new PlaneGeometry(32, 32)
        const dirtMesh = new Mesh(dirtGeo, dirtMat)
        dirtMesh.rotation.x = -Math.PI / 2
        dirtMesh.receiveShadow = true
        this.scene.add(dirtMesh)

        // const pointLight = new PointLight(0xffee88, 3, 0, 2)
        // pointLight.castShadow = true
        // pointLight.position.y = 2
        // pointLight.shadow.radius = 5
        // // pointLight.visible = false
        // this.scene.add(pointLight)
        // const pointLightHelper = new PointLightHelper(pointLight, 0.5)
        // this.scene.add(pointLightHelper)

        // this.scene.fog = new Fog(0x161616, 15, 40)
        this.scene.background = new Color(0x161616)
        this.scene.add(new SkySphere())
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
