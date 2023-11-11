export const madness = {};

madness.formulas = {
  healthPoints: {
    max: '@{healthPoints.base} + 3 * @{stats.constitution.total}',
    actual: '@{healthPoints.max} - @{healthPoints.missing}',
  },
  manaPoints: {
    max: '@{manaPoints.base} + 3 * @{stats.intelligence.total}',
    actual: '@{manaPoints.max} - @{manaPoints.missing}',
  },
  magic: {
    doka: '_min(@{magic.ome},@{magic.teruuk})',
    natah: '_min(@{magic.ome},@{magic.erah},@{magic.sith},@{magic.shor},@{magic.teruuk})'
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
    damage: (array) => array.reduce((prev, curr) => `${prev} + ${curr[1]}d@{${curr[0]}.total}`, '@{damage}')
  }
}

madness.thresholds = {
  criticalFail: 95
}