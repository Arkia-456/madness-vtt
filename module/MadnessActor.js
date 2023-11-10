import MadnessUtils from './MadnessUtils.js';

export default class MadnessActor extends Actor {

  isInit = false;

  prepareBaseData() {
    super.prepareBaseData();
    this._calculateStats();
    this._calculateMagic();
    this._calculateMaxHealthPoints();
    this._calculateMaxManaPoints();
    this._calculateActualHealthPoints();
    this._calculateActualManaPoints();
    if (!this.isInit) {
      this.isInit = true;
    }
  }

  prepareEmbeddedDocuments() {
    super.prepareEmbeddedDocuments();
    this._getCommonMagicSkills();
  }

  _calculateMaxHealthPoints() {
    this.system.healthPoints.max = this.system.healthPoints.base + ( 3 * this.system.stats.constitution.total );
  }

  _calculateActualHealthPoints() {
    if (!this.isInit) {
      this.system.healthPoints.value = this.system.healthPoints.max - this.system.healthPoints.missing;
    }
  }

  _calculateMaxManaPoints() {
    this.system.manaPoints.max = this.system.manaPoints.base + ( 3 * this.system.stats.intelligence.total );
  }

  _calculateActualManaPoints() {
    if (!this.isInit) {
      this.system.manaPoints.value = this.system.manaPoints.max - this.system.manaPoints.missing;
    }
  }

  _getCommonMagicSkills() {
    Array.from(game.items.values())
      .filter(item => item.type === 'skill' && this._checkRequirements(item))
      .forEach(skill => {
        if (!this.items.find(item => item.name === skill.name)) {
          this.createEmbeddedDocuments('Item', [skill]);
        }
      });
  }

  _checkRequirements(skill) {
    let requirementMet = true;
    const skillRequirements = skill.system.requirements;
    for (const [key, value] of Object.entries(skillRequirements)) {
      const actorMagicLevel = this.system.magic[key];
      if (actorMagicLevel < value) {
        requirementMet = false;
        break;
      }
    }
    return requirementMet;
  }

  _calculateMagic() {
    this._calculateMagicDoka();
    this._calculateMagicNatah();
  }

  _calculateMagicDoka() {
    this.system.magic.doka = Math.min(MadnessUtils.convertToInt(this.system.magic.ome), MadnessUtils.convertToInt(this.system.magic.teruuk));
  }

  _calculateMagicNatah() {
    this.system.magic.natah = Math.min(...Object.values(this.system.magic));
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