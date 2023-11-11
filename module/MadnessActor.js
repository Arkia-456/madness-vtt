import { madness } from './config.js';
import Formula from './formulas/Formula.js';

export default class MadnessActor extends Actor {

  prepareBaseData() {
    super.prepareBaseData();
    this._calculateStats();
    this._calculateMagic();
    this._calculateMaxHealthPoints();
    this._calculateMaxManaPoints();
    this._calculateActualHealthPoints();
    this._calculateActualManaPoints();
  }

  prepareEmbeddedDocuments() {
    super.prepareEmbeddedDocuments();
    this._getCommonMagicSkills();
  }

  async _preUpdate(changed, options, user) {
    const healthPoints = changed.system.healthPoints;
    if (healthPoints) {
      healthPoints.missing = this.system.healthPoints.max - changed.system.healthPoints.value;
    }
    await super._preUpdate(changed, options, user);
  }

  async applyDamage(damage) {
    const remainingHealthPoints = this.system.healthPoints.value - damage;
    await this.update({
      'system.healthPoints.value': remainingHealthPoints,
      'system.healthPoints.missing': this.system.healthPoints.missing + damage
    });
    const downed = remainingHealthPoints === 0;
    return {
      downed: downed
    }
  }

  _calculateMaxHealthPoints() {
    this.system.healthPoints.max = new Formula(madness.formulas.healthPoints.max).compute({...this.system}).evaluate();
  }

  _calculateActualHealthPoints() {
    this.system.healthPoints.value = new Formula(madness.formulas.healthPoints.actual).compute({...this.system}).evaluate();
  }

  _calculateMaxManaPoints() {
    this.system.manaPoints.max = new Formula(madness.formulas.manaPoints.max).compute({...this.system}).evaluate();
  }

  _calculateActualManaPoints() {
    this.system.manaPoints.value = new Formula(madness.formulas.manaPoints.actual).compute({...this.system}).evaluate();
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
    this.system.magic.doka = new Formula(madness.formulas.magic.doka).compute({...this.system}).evaluate();
  }

  _calculateMagicNatah() {
    this.system.magic.natah = new Formula(madness.formulas.magic.natah).compute({...this.system}).evaluate();
  }

  _calculateStats() {
    this._calculateTotalPrimaryStats();
    this._calculateSecondaryStats();
    this._calculateTotalSecondaryStats();
  }

  _calculateTotalPrimaryStats() {
    for (const [key, value] of Object.entries(this.system.stats)) {
      if (value.primary) {
        this.system.stats[key].total = new Formula(madness.formulas.stats.total).compute({...this.system}, { key: key, ignoreUnknownPath: true, fallbackValue: 0 }).evaluate();
      }
    }
  }

  _calculateSecondaryStats() {
    console.log({...this.system})
    this.system.stats.parryDamageReduction = {
      base: new Formula(madness.formulas.stats.parryDamageReduction).compute({...this.system}).evaluate()
    }
    this.system.stats.critRate = {
      base: new Formula(madness.formulas.stats.critRate).compute({...this.system}).evaluate()
    }
    this.system.stats.evadeRate = {
      base: new Formula(madness.formulas.stats.evadeRate).compute({...this.system}).evaluate()
    }
    this.system.stats.maxMoveDistance = {
      base: new Formula(madness.formulas.stats.maxMoveDistance).compute({...this.system}).evaluate()
    }
    this.system.stats.initiativeBonus = {
      base: new Formula(madness.formulas.stats.initiativeBonus).compute({...this.system}).evaluate()
    }
    this.system.stats.maxEquipmentWeight = {
      base: new Formula(madness.formulas.stats.maxEquipmentWeight).compute({...this.system}).evaluate()
    }
    this.system.stats.maxWeight = {
      base: new Formula(madness.formulas.stats.maxWeight).compute({...this.system}).evaluate()
    }
  }

  _calculateTotalSecondaryStats() {
    for (const [key, value] of Object.entries(this.system.stats)) {
      if (!value.primary) {
        this.system.stats[key].total = new Formula(madness.formulas.stats.total).compute({...this.system}, { key: key, ignoreUnknownPath: true, fallbackValue: 0 }).evaluate();
      }
    }
  }

  calculateDamageReduction(damage) {
    return new Formula(madness.formulas.combat.parryDamageReduction).compute({...this.system, damage}).evaluate();
  }

  calculateArmorReduction(damage) {
    const outcome = new Formula(madness.formulas.combat.armorDamageReduction).compute({...this.system, damage}, { ignoreUnknownPath: true, fallbackValue: 0 }).evaluate();
    return outcome > 0 ? outcome : 1;
  }

}