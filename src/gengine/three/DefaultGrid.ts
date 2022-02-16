import { LineSegments, WireframeGeometry, PlaneGeometry, LineBasicMaterial } from 'three'

export class DefaultGrid extends LineSegments {
    constructor(size = 64) {
        super(
            new WireframeGeometry(
                new PlaneGeometry(size, size, size, size),
            ),
            new LineBasicMaterial({
                opacity: 0.25,
                transparent: true,
            }),
        )
        this.rotation.x = -Math.PI / 2
    }
}
