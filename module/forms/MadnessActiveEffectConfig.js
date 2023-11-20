import { madness } from '../config.js';

export default class MadnessActiveEffectConfig extends ActiveEffectConfig {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: 'systems/madness/templates/sheets/active-effect-config.hbs'
    });
  }

  async getData() {
    const context = await super.getData();
    context.changeKeys = madness.activeEffectChanges;
    return context;
  }

}