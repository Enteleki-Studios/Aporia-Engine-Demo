export default [
    null,
    {
        modelPath: '/resources/models/rogue/Rogue.fbx',
        texturePath: '/resources/models/rogue/Rogue_Texture.png',
        scale: 0.006,
        animations: {
            'CharacterArmature|Idle': 'idle',
            'CharacterArmature|Walk': 'walk',
            'CharacterArmature|Run': 'run',
            'CharacterArmature|Death': 'death',
            'CharacterArmature|Dagger_Attack': 'attack',
            'CharacterArmature|PickUp': 'pickUp',
            'CharacterArmature|Attacking_Idle': 'enGarde',
            'CharacterArmature|Dagger_Attack2': 'attack2',
            'CharacterArmature|Punch': 'punch',
            'CharacterArmature|RecieveHit': 'hit',
            'CharacterArmature|RecieveHit_Attacking': 'hitAttack',
            'CharacterArmature|Roll': 'roll',
        },
    },
    {
        modelPath: '/resources/models/eve/eve.fbx',
        scale: 0.015,
        animations: {
            'Take 001': 'walk',
            'mixamo.com': 'run',
        },
    },
    {
        modelPath: '/resources/models/slime/slime.fbx',
        scale: 0.05,
    },
]
