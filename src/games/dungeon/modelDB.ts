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
}

const modelDB: Record<string, Model> = {
    rogue: {
        modelPath: `${MF}/rogue/Rogue.fbx`,
        texturePath: `${MF}/rogue/Rogue_Texture.png`,
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
    },
    wizard: {
        modelPath: `${MF}/wizard/Wizard.fbx`,
        texturePath: `${MF}/wizard/Wizard_Texture.png`,
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
    },
    warrior: {
        modelPath: `${MF}/warrior/Warrior.fbx`,
        texturePath: `${MF}/warrior/Warrior_Texture.png`,
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
    },
    skeleton: {
        modelPath: `${MF}/skeleton/Skeleton.fbx`,
        scale: 0.0035,
        animations: {
            idle: 'SkeletonArmature|Skeleton_Idle',
            walk: 'SkeletonArmature|Skeleton_Running',
            run: 'SkeletonArmature|Skeleton_Running',
            attack: 'SkeletonArmature|Skeleton_Attack',
            death: 'SkeletonArmature|Skeleton_Death',
            spawn: 'SkeletonArmature|Skeleton_Spawn',
        },
    },
    barrel: {
        modelPath: `${MF}/items/Barrel.fbx`,
        scale: 0.01,
    },
    chest_gold: {
        modelPath: `${MF}/items/Chest_gold.fbx`,
        scale: 0.01,
    },
    column: {
        modelPath: `${MF}/items/Column.fbx`,
        scale: 0.01,
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
    },
    stoneWall: {
        modelPath: `${MF}/items/ModularStoneWall.fbx`,
        scale: 0.01,
        translate: [0, 0, 1],
    },
}

export default modelDB
