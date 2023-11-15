import MadnessActor from './MadnessActor.js';
import MadnessItem from './MadnessItem.js';
import MadnessCharacterSheet from './sheets/MadnessCharacterSheet.js';
import MadnessItemSheet from './sheets/MadnessItemSheet.js';

export default class MadnessSystem {

  static async preloadHandlebarsTemplates() {
    const partialsPath  = 'systems/madness/templates/partials';
    const partials = [
      'skill-card.hbs',
      'skill-chat.hbs',
      'skill-sheet-editable.hbs',
      'skill-sheet-readonly.hbs',
      'attack-check.hbs',
      'stat-check.hbs',
      'weapon-card.hbs'
    ];
    const paths = {};
    partials.forEach(partial => {
      paths[`madness.${partial.replace('.hbs', '')}`] = `${partialsPath}/${partial}`;
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
    CONFIG.debug.custom = true;
    CONFIG.Item.documentClass = MadnessItem;
    CONFIG.Actor.documentClass = MadnessActor;
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