import MadnessActor from '../data/MadnessActor.js';
import MadnessItem from '../data/MadnessItem.js';
import MadnessSidebar from '../apps/sidebar/MadnessSidebar.js';
import { madness } from '../config.js';
import MadnessCharacterSheet from '../forms/MadnessCharacterSheet.js';
import MadnessItemSheet from '../forms/MadnessItemSheet.js';
import MadnessActiveEffect from '../data/MadnessActiveEffect.js';
import MadnessActiveEffectConfig from '../forms/MadnessActiveEffectConfig.js';

export default class MadnessSystem {

  static async preloadHandlebarsTemplates() {
    const templatesPath  = 'systems/madness/templates';

    const appPartials = {
      characters: [
        'equipment.hbs',
        'equipments.hbs',
        'inventory.hbs'
      ],
      chat: [
        'skill-card.hbs'
      ],
      items: [
        'item-description.hbs'
      ]
    };

    const paths = {};

    Object.entries(appPartials).forEach(([folder, partials]) => {
      partials.forEach(partial => {
        paths[`madness.${folder}.${partial.replace('.hbs', '')}`] = `${templatesPath}/${folder}/partials/${partial}`;
      });
    });

    const orphPartials = [
      'skill-card.hbs',
      'skill-chat.hbs',
      'skill-sheet-editable.hbs',
      'skill-sheet-readonly.hbs',
      'attack-check.hbs',
      'stat-check.hbs',
      'weapon-card.hbs'
    ];
    orphPartials.forEach(partial => {
      paths[`madness.${partial.replace('.hbs', '')}`] = `${templatesPath}/partials/${partial}`;
    });
    return await loadTemplates(paths);
  }

  static registerHandlebarsHelpers() {
    Handlebars.registerHelper({
      ifEquals: function (arg1, arg2, options) {
        return arg1 === arg2 ? options.fn(this) : options.inverse(this);
      },
      or: function () {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
      }
    });
  }

  static registerConfigurationValues() {
    CONFIG.madness = madness;
    CONFIG.debug.custom = true;
    CONFIG.Item.documentClass = MadnessItem;
    CONFIG.Actor.documentClass = MadnessActor;
    CONFIG.ActiveEffect.documentClass = MadnessActiveEffect;
    DocumentSheetConfig.registerSheet(ActiveEffect, 'madness', MadnessActiveEffectConfig, { makeDefault: true });
  }

  static registerSheets() {
    MadnessSystem._registerActorSheet();
    MadnessSystem._registerItemSheet();
  }

  static _registerActorSheet() {
    Actors.unregisterSheet('core', ActorSheet);
    Actors.registerSheet('madness', MadnessCharacterSheet, { makeDefault: true });
  }
  
  static _registerItemSheet() {
    Items.unregisterSheet('core', ItemSheet);
    Items.registerSheet('madness', MadnessItemSheet, { makeDefault: true });
  }

}