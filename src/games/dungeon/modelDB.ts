const MF = '/resources/models' // Models folder
// const modelDB = [
//     {
//         modelPath: '',
//         scale: 0,
//         animations: {},
//     },
//     {
//         modelPath: `${MF}/slime/Slime.fbx`,
//         scale: 0.005,
//         animations: {
//             idle: 'Armature|Slime_Idle',
//             walk: 'Armature|Slime_Walk',
//             death: 'Armature|Slime_Death',
//             attack: 'Armature|Slime_Attack',
//         },
//     },
//     {
//         modelPath: `${MF}/bat/Bat.fbx`,
//         scale: 0.003,
//         animations: {
//             idle: 'BatArmature|Bat_Flying',
//             walk: 'BatArmature|Bat_Flying',
//             hit: 'BatArmature|Bat_Hit',
//             attack: 'BatArmature|Bat_Attack',
//             attack2: 'BatArmature|Bat_Attack2',
//             death: 'BatArmature|Bat_Death',
//         },
//     },
//     {
//         modelPath: `${MF}/skeleton/Skeleton.fbx`,
//         scale: 0.0037,
//         animations: {
//             idle: 'SkeletonArmature|Skeleton_Idle',
//             walk: 'SkeletonArmature|Skeleton_Running',
//             run: 'SkeletonArmature|Skeleton_Running',
//             attack: 'SkeletonArmature|Skeleton_Attack',
//             death: 'SkeletonArmature|Skeleton_Death',
//             spawn: 'SkeletonArmature|Skeleton_Spawn',
//         },
//     },
//     {
//         modelPath: `${MF}/sprig/sprig.fbx`,
//         scale: 0.01,
//         animations: {},
//     },
// ] as const
//
interface Model {
    modelPath: string,
    texturePath?: string,
    scale: number,
    animations?: Record<string, string>,
    translate?: [number, number, number],
    radius?: number,
}

const modelDB: Record<string, Model> = {
    wizard: {
        modelPath: `${MF}/characters/wizard/Wizard.fbx`,
        texturePath: `${MF}/characters/wizard/Wizard_Texture.png`,
        scale: 0.006,
        animations: {
            idle: 'CharacterArmature|Idle',
            walk: 'CharacterArmature|Walk',
            run: 'CharacterArmature|Run',
            death: 'CharacterArmature|Death',
            attack: 'CharacterArmature|Dagger_Attack',
            pickUp: 'CharacterArmature|PickUp',
            enGarde: 'CharacterArmature|Attacking_Idle',
            attack2: 'CharacterArmature|Dagger_Attack2',
            punch: 'CharacterArmature|Punch',
            hit: 'CharacterArmature|RecieveHit',
            hitAttack: 'CharacterArmature|RecieveHit_Attacking',
            roll: 'CharacterArmature|Roll',
        },
        radius: 0.5,
    },
    skeleton: {
        modelPath: `${MF}/enemies/skeleton/Skeleton.fbx`,
        scale: 0.0035,
        animations: {
            idle: 'SkeletonArmature|Skeleton_Idle',
            walk: 'SkeletonArmature|Skeleton_Running',
            run: 'SkeletonArmature|Skeleton_Running',
            attack: 'SkeletonArmature|Skeleton_Attack',
            death: 'SkeletonArmature|Skeleton_Death',
            spawn: 'SkeletonArmature|Skeleton_Spawn',
        },
        radius: 0.5,
    },
    barrel: {
        modelPath: `${MF}/items/Barrel.fbx`,
        scale: 0.01,
        radius: 0.5,
    },
    chest_gold: {
        modelPath: `${MF}/items/Chest_gold.fbx`,
        scale: 0.01,
        radius: 0.5,
    },
    column: {
        modelPath: `${MF}/items/Column.fbx`,
        scale: 0.01,
        radius: 1,
    },
    entrance: {
        modelPath: `${MF}/items/Entrance.fbx`,
        scale: 0.01,
    },
    rock_1: {
        modelPath: `${MF}/items/Rock1.fbx`,
        scale: 0.02,
    },
    torch: {
        modelPath: `${MF}/items/Torch.fbx`,
        scale: 0.005,
        radius: 0.25,
    },
    stoneWall: {
        modelPath: `${MF}/items/ModularStoneWall.fbx`,
        scale: 0.01,
        translate: [0, 0, 1],
    },

    grass: {
        modelPath: `${MF}/decorative/Grass.fbx`,
        scale: 0.005,
    },
    crate: {
        modelPath: `${MF}/decorative/Crate.fbx`,
        scale: 0.01,
        radius: 0.5,
    },
    cart: {
        modelPath: `${MF}/decorative/Cart.fbx`,
        scale: 0.01,
    },
}

export default modelDB
