export const madness = {};

madness.activeEffectChanges = {
  'system.stats.agility.mod': 'madness.character.stats.agility',
  'system.stats.constitution.mod': 'madness.character.stats.constitution',
  'system.stats.dexterity.mod': 'madness.character.stats.dexterity',
  'system.stats.intelligence.mod': 'madness.character.stats.intelligence',
  'system.stats.strength.mod': 'madness.character.stats.strength',
  'system.stats.critRate.mod': 'madness.character.stats.critRate',
  'system.stats.evadeRate.mod': 'madness.character.stats.evadeRate',
  'system.stats.initiativeBonus.mod': 'madness.character.stats.initiativeBonus',
  'system.stats.maxEquipmentWeight.mod': 'madness.character.stats.maxEquipmentWeight',
  'system.stats.maxMoveDistance.mod': 'madness.character.stats.maxMoveDistance',
  'system.stats.maxWeight.mod': 'madness.character.stats.maxWeight',
  'system.stats.parryDamageReduction.mod': 'madness.character.stats.parryDamageReduction',
}

madness.colors = {
  item: {
    range: {
      borderColor: '#000000',
      fillColor: '#cc8b28'
    }
  }
}

madness.formulas = {
  hp: {
    max: '@{attributes.hp.base} + 3 * @{stats.constitution.total}',
    value: '@{attributes.hp.max} - @{attributes.hp.missing}',
  },
  mp: {
    max: '@{attributes.mp.base} + 3 * @{stats.intelligence.total}',
    value: '@{attributes.mp.max} - @{attributes.mp.missing}',
  },
  magic: {
    doka: '_min(@{magic.ome.value},@{magic.teruuk.value})',
    natah: '_min(@{magic.ome.value},@{magic.erah.value},@{magic.sith.value},@{magic.shor.value},@{magic.teruuk.value})'
  },
  stats: {
    total: '@{stats.key.base} + @{stats.key.mod}',
    parryDamageReduction: '50 + ( 2 * @{stats.constitution.total} )',
    critRate: '5 + @{stats.dexterity.total}',
    evadeRate: '50 + ( 2 * @{stats.agility.total} )',
    maxMoveDistance: '3 + @{stats.agility.total}',
    initiativeBonus: '@{stats.agility.total}',
    maxEquipmentWeight: '@{stats.strength.total} * 5',
    maxWeight: '@{stats.strength.total} * 10',
  },
  combat: {
    parryDamageReduction: '(1 - (@{stats.parryDamageReduction.total} / 100)) * @{damage}',
    armorDamageReduction: '@{damage} - @{armor}'
  },
  roll: {
    statCheck: '1d@value',
    default: '1d100',
    damage: (array) => array.reduce((prev, curr) => `${prev} + ${curr[1]??0}d@{${curr[0]}.total}`, '@{damage}')
  }
}

madness.magicActiveEffects = {
  ome: {
    effect: 'decreaseSkillMPCost',
    name: 'madness.magic.ome',
    description: 'madness.effect.description.decreaseSkillMPCost',
    value: 2
  },
  erah: {
    effect: 'increaseSkillDamageAndCritFailRate',
    name: 'madness.magic.erah',
    description: 'madness.effect.description.increaseSkillDamageAndCritFailRate',
    value: 6
  },
  sith: {
    effect: 'increaseSkillCritRate',
    name: 'madness.magic.sith',
    description: 'madness.effect.description.increaseSkillCritRate',
    value: 10
  },
  shor: {
    effect: 'generateShield',
    name: 'madness.magic.shor',
    description: 'madness.effect.description.generateShield',
    value: 2
  },
  teruuk: {
    effect: 'increaseSkillRange',
    name: 'madness.magic.teruuk',
    description: 'madness.effect.description.increaseSkillRange',
    value: 8
  },
  derion: {
    effect: 'increaseSkillDamage',
    name: 'madness.magic.derion',
    description: 'madness.effect.description.increaseSkillDamage',
    value: 2
  },
}

madness.magics = {
  ome: 'madness.magic.ome',
  erah: 'madness.magic.erah',
  sith: 'madness.magic.sith',
  shor: 'madness.magic.shor',
  teruuk: 'madness.magic.teruuk',
  doka: 'madness.magic.doka',
  natah: 'madness.magic.natah',
  derion: 'madness.magic.derion',
}

madness.thresholds = {
  criticalFail: 95
}