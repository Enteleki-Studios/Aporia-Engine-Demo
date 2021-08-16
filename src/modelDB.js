const MF = '/resources/models' // Models folder
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
            // 'Take 001': 'walk',
            // 'mixamo.com': 'run',
        },
    },
    {
        modelPath: '/resources/models/slime/Slime.fbx',
        scale: 0.005,
        animations: {
            'Armature|Slime_Idle': 'idle',
            'Armature|Slime_Walk': 'walk',
            'Armature|Slime_Death': 'death',
            'Armature|Slime_Attack': 'attack',
        },
    },
    {
        modelPath: `${MF}/bat/Bat.fbx`,
        scale: 0.003,
        animations: {
            'BatArmature|Bat_Flying': 'idle',
            'BatArmature|Bat_Hit': 'hit',
            'BatArmature|Bat_Attack': 'attack',
            'BatArmature|Bat_Attack2': 'attack2',
            'BatArmature|Bat_Death': 'death',
        },
    },
]
