import MadnessUtils from './MadnessUtils.js';

export default class MadnessActor extends Actor {

  prepareBaseData() {
    super.prepareBaseData();
    this._calculateStats();
  }

  _calculateStats() {
    this._calculateTotalPrimaryStats();
    this._calculateSecondaryStats();
    this._calculateTotalSecondaryStats();
  }

  _calculateTotalPrimaryStats() {
    for (const [key, value] of Object.entries(this.system.stats)) {
      if (value.primary) {
        this.system.stats[key].total = MadnessUtils.convertToInt(this.system.stats[key].base) + MadnessUtils.convertToInt(this.system.stats[key].mod);
      }
    }
  }

  _calculateSecondaryStats() {
    this.system.stats.parryDamageReduction = {
      base: this._calculateParryDamageReduction(MadnessUtils.convertToInt(this.system.stats.constitution.total))
    }
    this.system.stats.critRate = {
      base: this._calculateCritRate(MadnessUtils.convertToInt(this.system.stats.dexterity.total))
    }
    this.system.stats.evadeRate = {
      base: this._calculateEvadeRate(MadnessUtils.convertToInt(this.system.stats.agility.total))
    }
    this.system.stats.maxMoveDistance = {
      base: this._calculateMaxMoveDistance(MadnessUtils.convertToInt(this.system.stats.agility.total))
    }
    this.system.stats.initiativeBonus = {
      base: this._calculateInitiativeBonus(MadnessUtils.convertToInt(this.system.stats.agility.total))
    }
    this.system.stats.maxEquipmentWeight = {
      base: this._calculateMaxEquipmentWeight(MadnessUtils.convertToInt(this.system.stats.strength.total))
    }
    this.system.stats.maxWeight = {
      base: this._calculateMaxWeight(MadnessUtils.convertToInt(this.system.stats.strength.total))
    }
  }

  _calculateTotalSecondaryStats() {
    for (const [key, value] of Object.entries(this.system.stats)) {
      if (!value.primary) {
        this.system.stats[key].total = MadnessUtils.convertToInt(this.system.stats[key].base) + MadnessUtils.convertToInt(this.system.stats[key].mod);
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