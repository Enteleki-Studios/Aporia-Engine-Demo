import {
    LinearFilter,
    Mesh,
    MeshStandardMaterial,
    PlaneGeometry,
    RepeatWrapping,
    Texture,
} from 'three'

import { CustomGridTexture, CustomGridSettings } from './CustomGridTexture'

interface DefaultGridSettings extends CustomGridSettings {
    texture?: Texture
    gridWidth?: number
}

export class DefaultGrid extends Mesh {
    constructor(
        size: number,
        settings?: DefaultGridSettings,
    ) {
        const floorTexture = settings?.texture || new CustomGridTexture(settings)
        floorTexture.wrapS = RepeatWrapping
        floorTexture.wrapT = RepeatWrapping
        floorTexture.minFilter = LinearFilter

        const gridWidth = settings?.gridWidth || 4
        floorTexture.repeat.set(size / gridWidth, size / gridWidth)

        super(
            new PlaneGeometry(size, size),
            new MeshStandardMaterial({
                map: floorTexture,
            }),
        )

        this.receiveShadow = true

        this.rotation.x = -Math.PI / 2
    }
}
