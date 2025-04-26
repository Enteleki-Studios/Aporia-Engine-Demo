import {
    AmbientLight,
    BoxGeometry,
    Mesh,
    MeshStandardMaterial,
    PCFSoftShadowMap,
    PerspectiveCamera,
    ReinhardToneMapping,
    Scene,
    Vector3,
    WebGLRenderer,
} from 'three'

import { Plugin } from '@core'

class Renderer {
    renderer
    canvas
    scene
    camera

    shouldRender = false

    constructor() {
        this.renderer = new WebGLRenderer({
            powerPreference: 'high-performance',
            antialias: true,
        })

        this.renderer.toneMapping = ReinhardToneMapping
        this.renderer.toneMappingExposure = 2
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = PCFSoftShadowMap
        this.renderer.setPixelRatio(1 /* window.devicePixelRatio */)
        this.renderer.debug.checkShaderErrors = true
        // this.renderer.autoClear = false
        // this.renderer.info.autoReset = false
        this.canvas = this.renderer.domElement

        this.scene = new Scene()
        this.camera = new PerspectiveCamera(60, 1, 0.1, 100)

        this.camera.position.set(10, 10, 10)
        this.camera.lookAt(new Vector3())

        this.scene.add(new AmbientLight())

        this.scene.add(new Mesh(new BoxGeometry(), new MeshStandardMaterial({ color: '#ffffff' })))
    }

    render() {
        if (this.shouldRender) {
            this.renderer.render(this.scene, this.camera)
        }
    }

    setSize(width: number, height: number) {
        const aspect = width / height

        this.camera.aspect = aspect
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(width, height, false)
    }

    setCanvasContainer(element: HTMLElement | null) {
        if (element) {
            element.appendChild(this.canvas)
            this.shouldRender = true
        } else {
            this.shouldRender = false
        }
    }
}

type ThreeOutput = {
    render: Renderer
}

export const pluginThree = (): Plugin<object, ThreeOutput> => ({
    setup: () => {
        const renderer = new Renderer()
        renderer.setCanvasContainer(window.document.body)
        renderer.setSize(1280, 720)

        renderer.renderer.setClearColor('#003333')

        return {
            render: renderer,
        }
    },
    systems: [
        (engine) => {
            engine.render.render()
        },
    ],
})
