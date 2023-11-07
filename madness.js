import MadnessCharacterSheet from './module/sheets/MadnessCharacterSheet.js';

Hooks.once('init', () => {
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('madness', MadnessCharacterSheet, { makeDefault: true });
});