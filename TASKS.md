- Animation

- Collision
    - Collisions should work in 3D without a hard-coded axis
    - Support for rectangular hitboxes (non-axis aligned)
    - Add spacial manager for efficient entity selection

- Combat

- Movement
    - Split move position component velocity data to separate component

- Input
    - implement addEventListener
    - support keycode => many actions in constructor
    - improve typing
    - support debug view that doesn't capture pointer

- Camera
    - make camera system generic and move to gengine

- Rendering
    - Renderer system should use a resource manager instead of using the renderer directly

- Resources
    - implement proper resource manager
    - improve ModelComponent typing
    - abiliy to add models to scene without creating entities (eg grass)
