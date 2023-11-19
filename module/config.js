export const madness = {};

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
    damage: (array) => array.reduce((prev, curr) => `${prev} + ${curr[1]}d@{${curr[0]}.total}`, '@{damage}')
  }
}

madness.magics = {
  ome: 'madness.magic.ome',
  erah: 'madness.magic.erah',
  sith: 'madness.magic.sith',
  shor: 'madness.magic.shor',
  teruuk: 'madness.magic.teruuk',
  doka: 'madness.magic.doka',
  natah: 'madness.magic.natah',
}

madness.thresholds = {
  criticalFail: 95
}