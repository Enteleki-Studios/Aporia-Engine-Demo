import {
    Mesh,
    Color,
    SphereGeometry,
    ShaderMaterial,
    BackSide,
} from 'three'

export class SkyBox extends Mesh {
    constructor() {
        super()

        const vertexShader = `
           varying vec3 vWorldPosition;

            void main() {

                vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
                vWorldPosition = worldPosition.xyz;

                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

            }`
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

        const uniforms = {
            topColor: { value: new Color(0xbd93f9) },
            bottomColor: { value: new Color(0x44475a) },
            offset: { value: 33 },
            exponent: { value: 0.6 },
        }

        this.geometry = new SphereGeometry(400, 32, 15)
        this.material = new ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
            side: BackSide,
        })
    }
}
export default SkyBox
