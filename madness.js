import MadnessCharacterSheet from './module/sheets/MadnessCharacterSheet.js';
import MadnessItemSheet from './module/sheets/MadnessItemSheet.js';

Hooks.once('init', () => {
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('madness', MadnessCharacterSheet, { makeDefault: true });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('madness', MadnessItemSheet, { makeDefault: true });
});