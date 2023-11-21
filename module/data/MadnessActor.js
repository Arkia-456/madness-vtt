import { madness } from '../config.js';
import Formula from '../formulas/Formula.js';

export default class MadnessActor extends Actor {

  // Prepare data

  prepareDerivedData() {
    this._calculateStats();
    this._calculateMagic();
    super.prepareDerivedData();
    this._prepareAttributesPoints();
  }

  _calculateStats() {
    this._calculateTotalPrimaryStats();
    this._calculateSecondaryStats();
    this._calculateTotalSecondaryStats();
  }

  _calculateTotalPrimaryStats() {
    this._calculateTotalStats(true);
  }

  _calculateSecondaryStats() {
    for (const [key, value] of Object.entries(this.system.stats)) {
      if (!value.primary) {
        this.system.stats[key].base = new Formula(madness.formulas.stats[key]).compute({...this.system}).evaluate();
      }
    }
  }

  _calculateTotalSecondaryStats() {
    this._calculateTotalStats(false);
  }

  _calculateTotalStats(isPrimary) {
    for (const [key, value] of Object.entries(this.system.stats)) {
      if (Boolean(value.primary) === isPrimary) {
        this.system.stats[key].total = new Formula(madness.formulas.stats.total).compute({...this.system}, { key: key, ignoreUnknownPath: true, fallbackValue: 0 }).evaluate();
      }
    }
  }

  _calculateMagic() {
    this._calculateCombinedMagics();
    this._getCommonMagicSkills();
  }

  _calculateCombinedMagics() {
    Object.entries(this.system.magic).filter(([key, value]) => value.combined).forEach(([key, value]) => this._calculateCombinedMagic(key));
  }

  _calculateCombinedMagic(magicName) {
    this.system.magic[magicName].value = new Formula(madness.formulas.magic[magicName]).compute({...this.system}).evaluate();
  }

  _prepareAttributesPoints() {
    Object.keys(this.system.attributes).forEach(key => this._prepareAttributePoints(key));
  }

  _prepareAttributePoints(attribute) {
    const attr = this.system.attributes[attribute];
    attr.max = new Formula(madness.formulas[attribute].max).compute({...this.system}).evaluate();
    attr.value = new Formula(madness.formulas[attribute].value).compute({...this.system}).evaluate();
  }

  // Creation / Update

  _onCreate(data, options, userId) {
    this._getCommonMagicSkills();
    super._onCreate(data, options, userId);
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
    for (const magic of Object.values(skillRequirements)) {
      if (magic.type && magic.value) {
        const actorMagicLevel = this.system.magic[magic.type]?.value || -1;
        if (actorMagicLevel < magic.value) {
          requirementMet = false;
          break;
        }
      }
    }
    return requirementMet;
  }

  async _preUpdate(changed, options, user) {
    this._attributesChanged(changed.system?.attributes);
    await super._preUpdate(changed, options, user);
  }

  _attributesChanged(attributes) {
    if (!attributes) return;
    Object.entries(attributes).forEach(([key, value]) => value.missing = this.system.attributes[key].max - value.value)
  }

  // Attributes modification

  async applyDamage(damage) {
    const dhp = await this._removeAttributePoints('hp', damage);
    const downed = dhp === 0;
    return {
      downed: downed
    }
  }

  async removeManaPoints(damage) {
    await this._removeAttributePoints('mp', damage);
  }

  async _removeAttributePoints(attribute, damage) {
    const attr = this.system.attributes[attribute];
    const actualDamage = Math.clamped(damage, 0, attr.max);
    const delta = attr.value - actualDamage;
    const missing = attr.missing + actualDamage;
    const updates = {};
    updates[`system.attributes.${attribute}.value`] = delta;
    updates[`system.attributes.${attribute}.missing`] = missing;
    await this.update(updates);
    return delta;
  }

  // Combat

  calculateArmorReduction(damage) {
    const outcome = new Formula(madness.formulas.combat.armorDamageReduction).compute({...this.system, damage}, { ignoreUnknownPath: true, fallbackValue: 0 }).evaluate();
    return outcome > 0 ? outcome : 1;
  }

  calculateDamageReduction(damage) {
    return new Formula(madness.formulas.combat.parryDamageReduction).compute({...this.system, damage}).evaluate();
  }

}