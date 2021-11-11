export abstract class System {
    ECS!: { ComponentManager: object }
    // eslint-disable-next-line
    tick(delta: number) {}
}
