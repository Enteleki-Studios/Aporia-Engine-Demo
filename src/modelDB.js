const MF = '/resources/models' // Models folder
export default [
    null,
    {
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
    {
        modelPath: `${MF}/eve/eve.fbx`,
        scale: 0.015,
        animationsExternal: ['idle', 'walk', 'run', 'walkBack'],
    },
    {
        modelPath: `${MF}/slime/Slime.fbx`,
        scale: 0.005,
        animations: {
            idle: 'Armature|Slime_Idle',
            walk: 'Armature|Slime_Walk',
            death: 'Armature|Slime_Death',
            attack: 'Armature|Slime_Attack',
        },
    },
    {
        modelPath: `${MF}/bat/Bat.fbx`,
        scale: 0.003,
        animations: {
            idle: 'BatArmature|Bat_Flying',
            walk: 'BatArmature|Bat_Flying',
            hit: 'BatArmature|Bat_Hit',
            attack: 'BatArmature|Bat_Attack',
            attack2: 'BatArmature|Bat_Attack2',
            death: 'BatArmature|Bat_Death',
        },
    },
    {
        modelPath: `${MF}/skeleton/Skeleton.fbx`,
        scale: 0.0037,
        animations: {
            idle: 'SkeletonArmature|Skeleton_Idle',
            walk: 'SkeletonArmature|Skeleton_Running',
            run: 'SkeletonArmature|Skeleton_Running',
            attack: 'SkeletonArmature|Skeleton_Attack',
            death: 'SkeletonArmature|Skeleton_Death',
            spawn: 'SkeletonArmature|Skeleton_Spawn',
        },
    },
]
