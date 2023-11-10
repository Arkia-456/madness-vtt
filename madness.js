import MadnessActor from './module/MadnessActor.js';
import MadnessChat from './module/MadnessChat.js';
import MadnessItem from './module/MadnessItem.js';
import MadnessCharacterSheet from './module/sheets/MadnessCharacterSheet.js';
import MadnessItemSheet from './module/sheets/MadnessItemSheet.js';

async function preloadHandlebarsTemplates() {
  const templatePaths = [
    'systems/madness/templates/partials/skill-card.hbs',
    'systems/madness/templates/partials/weapon-card.hbs'
  ];
  return loadTemplates(templatePaths);
}

Hooks.once('init', () => {

  CONFIG.Item.documentClass = MadnessItem;
  CONFIG.Actor.documentClass = MadnessActor;

  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('madness', MadnessCharacterSheet, { makeDefault: true });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('madness', MadnessItemSheet, { makeDefault: true });

  preloadHandlebarsTemplates();
});

Hooks.on('renderChatLog', (app, html, data) => MadnessChat.addChatListeners(html));
Hooks.on('getChatLogEntryContext', MadnessChat.addChatMessageContextOptions);
