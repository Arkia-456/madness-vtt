import MadnessUtils from './MadnessUtils.js';

export default class MadnessActor extends Actor {

  prepareData() {
    super.prepareData();
    const stats = this.system.stats;
    this._calculateTotalPrimaryStats(stats);
    this._calculateSecondaryStats(stats);
    this._calculateTotalSecondaryStats(stats);
  }

  _calculateTotalPrimaryStats(stats) {
    for (const [key, value] of Object.entries(stats)) {
      if (value.primary) {
        stats[key].total = MadnessUtils.convertToInt(stats[key].base) + MadnessUtils.convertToInt(stats[key].mod)
      }
    }
  }

  _calculateSecondaryStats(stats) {
    stats.parryDamageReduction = {
      base: this._calculateParryDamageReduction(MadnessUtils.convertToInt(stats.constitution.total))
    }
    stats.critRate = {
      base: this._calculateCritRate(MadnessUtils.convertToInt(stats.dexterity.total))
    }
    stats.evadeRate = {
      base: this._calculateEvadeRate(MadnessUtils.convertToInt(stats.agility.total))
    }
    stats.maxMoveDistance = {
      base: this._calculateMaxMoveDistance(MadnessUtils.convertToInt(stats.agility.total))
    }
    stats.initiativeBonus = {
      base: this._calculateInitiativeBonus(MadnessUtils.convertToInt(stats.agility.total))
    }
    stats.maxEquipmentWeight = {
      base: this._calculateMaxEquipmentWeight(MadnessUtils.convertToInt(stats.strength.total))
    }
    stats.maxWeight = {
      base: this._calculateMaxWeight(MadnessUtils.convertToInt(stats.strength.total))
    }
  }

  _calculateTotalSecondaryStats(stats) {
    for (const [key, value] of Object.entries(stats)) {
      if (!value.primary) {
        stats[key].total = MadnessUtils.convertToInt(stats[key].base) + MadnessUtils.convertToInt(stats[key].mod)
      }
    }
  }

  _calculateParryDamageReduction(value) {
    return 50 + ( 2 * value );
  }

  _calculateCritRate(value) {
    return 5 + value;
  }

  _calculateEvadeRate(value) {
    return 50 + ( 2 * value );
  }

  _calculateMaxMoveDistance(value) {
    return 3 + value;
  }

  _calculateInitiativeBonus(value) {
    return value;
  }

  _calculateMaxEquipmentWeight(value) {
    return value * 5;
  }
  
  _calculateMaxWeight(value) {
    return value * 10;
  }

}