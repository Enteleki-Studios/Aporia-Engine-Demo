export default [
    null,
    {
        resourcePath: '/resources/models/rogue/',
        modelPath: 'Rogue.fbx',
        texturePath: 'Rogue_Texture.png',
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
            melee: 'CharacterArmature|Punch',
            hit: 'CharacterArmature|RecieveHit',
            hitAttack: 'CharacterArmature|RecieveHit_Attacking',
            roll: 'CharacterArmature|Roll',
        },
    },
]
