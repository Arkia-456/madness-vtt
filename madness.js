import MadnessActor from './module/MadnessActor.js';
import MadnessCharacterSheet from './module/sheets/MadnessCharacterSheet.js';
import MadnessItemSheet from './module/sheets/MadnessItemSheet.js';

async function preloadHandlebarsTemplates() {
  const templatePaths = [
    'systems/madness/templates/partials/weapon-card.hbs'
  ];
  return loadTemplates(templatePaths);
}

Hooks.once('init', () => {

  CONFIG.Actor.documentClass = MadnessActor;

  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('madness', MadnessCharacterSheet, { makeDefault: true });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('madness', MadnessItemSheet, { makeDefault: true });

  preloadHandlebarsTemplates();
});