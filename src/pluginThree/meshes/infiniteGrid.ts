/**
 * Based on
 * https://github.com/pmndrs/drei/blob/master/src/core/Grid.tsx
 */
import {
    BackSide,
    Color,
    type ColorRepresentation,
    Mesh,
    PlaneGeometry,
    ShaderMaterial,
    type Side,
    Vector3,
} from 'three'

export type GridConfig = {
    /** Cell size, default: 1 */
    cellSize?: number
    /** Cell thickness, default: 0.5 */
    cellThickness?: number
    /** Cell color, default: #000000 */
    cellColor?: ColorRepresentation
    /** Section size, default: 5 */
    sectionSize?: number
    /** Section thickness, default: 1 */
    sectionThickness?: number
    /** Section color, default: #00BFFF */
    sectionColor?: ColorRepresentation
    /** Follow camera, default: false */
    followCamera?: boolean
    /** Display the grid infinitely, default: true */
    infiniteGrid?: boolean
    /** Fade distance, default: 100 */
    fadeDistance?: number
    /** Fade strength, default: 1 */
    fadeStrength?: number
    /** Fade from camera (1) or origin (0), or somewhere in between, default: camera */
    fadeFrom?: number
    /** Material side, default: THREE.BackSide */
    side?: Side
}

export class InfiniteGrid extends Mesh {
    constructor(config: GridConfig = {}) {
        const geometry = new PlaneGeometry(2, 2, 1, 1)
        const material = new ShaderMaterial({
            side: config.side ?? BackSide,
            uniforms: {
                cellSize: { value: config.cellSize ?? 1 },
                sectionSize: { value: config.sectionSize ?? 5 },
                fadeDistance: { value: config.fadeDistance ?? 100 },
                fadeStrength: { value: config.fadeStrength ?? 1 },
                fadeFrom: { value: config.fadeFrom ?? 1 },
                cellThickness: { value: config.cellThickness ?? 0.5 },
                sectionThickness: { value: config.sectionThickness ?? 1 },
                cellColor: { value: new Color(config.cellColor ?? 0x000000) },
                sectionColor: { value: new Color(config.sectionColor ?? 0x00bfff) },
                infiniteGrid: { value: config.infiniteGrid ?? true },
                followCamera: { value: config.followCamera ?? false },
                worldCamProjPosition: { value: new Vector3() },
                worldPlanePosition: { value: new Vector3() },
            },
            transparent: true,
            vertexShader: `
                varying vec3 localPosition;
                varying vec4 worldPosition;

                uniform vec3 worldCamProjPosition;
                uniform vec3 worldPlanePosition;
                uniform float fadeDistance;
                uniform bool infiniteGrid;
                uniform bool followCamera;

                void main() {
                    localPosition = position.xzy;
                    if (infiniteGrid) localPosition *= 1.0 + fadeDistance;

                    worldPosition = modelMatrix * vec4(localPosition, 1.0);
                    if (followCamera) {
                        worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
                        localPosition = (inverse(modelMatrix) * worldPosition).xyz;
                    }

                    gl_Position = projectionMatrix * viewMatrix * worldPosition;
                }
            `,
            fragmentShader: `
                varying vec3 localPosition;
                varying vec4 worldPosition;

                uniform vec3 worldCamProjPosition;
                uniform float cellSize;
                uniform float sectionSize;
                uniform vec3 cellColor;
                uniform vec3 sectionColor;
                uniform float fadeDistance;
                uniform float fadeStrength;
                uniform float fadeFrom;
                uniform float cellThickness;
                uniform float sectionThickness;

                float getGrid(float size, float thickness) {
                    vec2 r = localPosition.xz / size;
                    vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
                    float line = min(grid.x, grid.y) + 1.0 - thickness;
                    return 1.0 - min(line, 1.0);
                }

                void main() {
                    float g1 = getGrid(cellSize, cellThickness);
                    float g2 = getGrid(sectionSize, sectionThickness);

                    vec3 from = worldCamProjPosition*vec3(fadeFrom);
                    float dist = distance(from, worldPosition.xyz);
                    float d = 1.0 - min(dist / fadeDistance, 1.0);
                    vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));

                    gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength));
                    gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
                    if (gl_FragColor.a <= 0.0) discard;

                    #include <tonemapping_fragment>
                    #include <colorspace_fragment>
                }
            `,
        })

        super(geometry, material)

        this.frustumCulled = false
    }
}
