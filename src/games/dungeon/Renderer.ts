import { AmbientLight, Mesh, Group, Box3 } from 'three'

import {
    DirectionalLight,
    DirectionalLightComponent,
    ModelComponent,
    TextSprite,
    ComponentManager,
    AmbientLightComponent,
    StandardRenderer,
    PositionComponent,
    DefaultGrid,
} from 'gengine'

import loadFBX from 'dungeon/utils/loadFBX'
import modelDB from 'modelDB'

import type { CameraComponent } from 'components'

async function createModel(modelComponent: ModelComponent<typeof modelDB>) {
    const { modelName } = modelComponent

    const { modelPath, texturePath, scale, translate } = modelDB[modelName]

    const model: Group = await loadFBX(modelPath, texturePath)
    model.scale.setScalar(scale)
    if (translate) {
        const obj = model.children[0] as Mesh
        obj.geometry.translate(...translate)
    }

    return model
}

export class Renderer extends StandardRenderer {
    directionalLight?: DirectionalLight

    hasWorld = false

    constructor(params: { canvas: HTMLCanvasElement }) {
        super(params)

        this.setSize(1920, 1080)

        // this.setDebugMode('sideBySide')
        this.setDebugMode('debug')

        this.scene.add(new DefaultGrid(32, { text: 'Dungeon' }))

        // this.scene.fog = new Fog(0x161616, 1, 30)
    }

    tick(componentManager: ComponentManager) {
        componentManager.getTuplesByQueryGeneric<[ModelComponent<typeof modelDB>, PositionComponent]>(
            ['model', 'position'],
        ).forEach(([modelComponent, positionComponent]) => {
            if (modelComponent.group) {
                // Update position
                if (positionComponent.needsUpdate) {
                    modelComponent.group.position.copy(positionComponent.position)
                    modelComponent.group.quaternion.copy(positionComponent.rotation)
                    positionComponent.needsUpdate = false
                }
            } else if (!modelComponent.isLoading) {
                modelComponent.isLoading = true
                createModel(modelComponent).then((resource) => {
                    const group = new Group()
                    group.add(resource)

                    const tripcode = modelComponent.entityId.split('-')[0]
                    const sprite = new TextSprite(tripcode)
                    sprite.renderOrder = 1
                    sprite.material.depthTest = false
                    group.add(sprite)
                    this.registerHelper(sprite)

                    const box = new Box3().setFromObject(resource)
                    sprite.position.y = box.max.y + 0.15
                    sprite.center.set(0.5, 0) // Set origin to center bottom

                    modelComponent.resource = resource
                    modelComponent.group = group

                    this.scene.add(group)
                    modelComponent.isLoading = false
                })
            }
        })

        componentManager.getTuplesByQueryGeneric<[DirectionalLightComponent]>(
            ['directionalLight'],
        ).forEach(([directionalLightComponent]) => {
            if (!this.directionalLight) {
                this.directionalLight = new DirectionalLight(0xFFFFFF, 0.4)
                this.scene.add(this.directionalLight)
                this.scene.add(this.directionalLight.target)

                this.addHelpers(this.directionalLight.helper, this.directionalLight.shadowHelper)
                this.addHelpers(this.directionalLight.shadowHelper)
            } else if (directionalLightComponent.needsUpdate) {
                this.directionalLight.position.copy(directionalLightComponent.position)
                this.directionalLight.target.position.copy(directionalLightComponent.target)
                directionalLightComponent.needsUpdate = false
            }
        })

        componentManager.getTuplesByQueryGeneric<[AmbientLightComponent]>(
            ['ambientLight'],
        ).forEach(([ambientLightComponent]) => {
            if (!ambientLightComponent.resource) {
                const { color, intensity } = ambientLightComponent
                ambientLightComponent.resource = new AmbientLight(color, intensity)
                this.scene.add(ambientLightComponent.resource)
            }
        })

        componentManager.getTuplesByQueryGeneric<[CameraComponent]>(
            ['camera'],
        ).forEach(([cameraComponent]) => {
            this.camera.position.copy(cameraComponent.position)
            this.camera.lookAt(cameraComponent.lookAt)
        })
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
