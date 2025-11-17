import { BackSide, Color, Mesh, ShaderMaterial, SphereGeometry } from 'three'

const vertexShader = `
   varying vec3 vWorldPosition;

    void main() {

        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
`

const fragmentShader = `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;

    varying vec3 vWorldPosition;

    void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
    }
`

type SkySphereConfig = {
    topColor?: number
    bottomColor?: number
    offset?: number
    blend?: number
    radius?: number
    resolution?: number
}

export class SkySphere extends Mesh {
    constructor({
        topColor = 0x71bce1,
        bottomColor = 0x888888,
        offset = 0,
        blend = 0.6,
        radius = 60,
        resolution = 1,
    }: SkySphereConfig = {}) {
        super()

        const widthSegments = Math.floor((radius / 2) * resolution)
        const heightSegments = Math.floor((radius / 3) * resolution)

        this.geometry = new SphereGeometry(radius, widthSegments, heightSegments)
        this.material = new ShaderMaterial({
            uniforms: {
                topColor: { value: new Color(topColor) },
                bottomColor: { value: new Color(bottomColor) },
                offset: { value: offset },
                exponent: { value: blend },
            },
            vertexShader,
            fragmentShader,
            side: BackSide,
        })
    }
}
