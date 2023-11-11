import MadnessActor from './module/MadnessActor.js';
import MadnessChat from './module/MadnessChat.js';
import MadnessItem from './module/MadnessItem.js';
import MadnessCharacterSheet from './module/sheets/MadnessCharacterSheet.js';
import MadnessItemSheet from './module/sheets/MadnessItemSheet.js';

async function preloadHandlebarsTemplates() {
  const templatePaths = [
    'systems/madness/templates/partials/skill-card.hbs',
    'systems/madness/templates/partials/skill-chat.hbs',
    'systems/madness/templates/partials/skill-sheet-editable.hbs',
    'systems/madness/templates/partials/skill-sheet-readonly.hbs',
    'systems/madness/templates/partials/attack-check.hbs',
    'systems/madness/templates/partials/stat-check.hbs',
    'systems/madness/templates/partials/weapon-card.hbs'
  ];
  return loadTemplates(templatePaths);
}

function registerHandlebarsHelpers() {
  Handlebars.registerHelper({
    ifEquals: function (arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    },
    or: function () {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    }
  });
}

Hooks.once('init', () => {

  CONFIG.Item.documentClass = MadnessItem;
  CONFIG.Actor.documentClass = MadnessActor;

  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('madness', MadnessCharacterSheet, { makeDefault: true });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('madness', MadnessItemSheet, { makeDefault: true });

  preloadHandlebarsTemplates();
  registerHandlebarsHelpers();
});

Hooks.on('renderChatLog', (app, html, data) => MadnessChat.addChatListeners(html));
Hooks.on('getChatLogEntryContext', MadnessChat.addChatMessageContextOptions);
