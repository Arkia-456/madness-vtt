import MadnessChat from './module/utils/MadnessChat.js';
import MadnessSystem from './module/utils/MadnessSystem.js';

Hooks.once('init', async () => {
  globalThis.madness = Object.assign(game.system, globalThis.madness);

  MadnessSystem.registerConfigurationValues();
  MadnessSystem.registerSheets();

  await MadnessSystem.preloadHandlebarsTemplates();
  MadnessSystem.registerHandlebarsHelpers();
});

Hooks.once('ready', () => {

  Hooks.on('hotbarDrop', (bar, data, slot) => {
    MadnessMacro.createRollItemMacro(data, slot);
    return false;
  });

});

Hooks.on('renderChatLog', (app, html, data) => MadnessChat.addChatListeners(html));
Hooks.on('getChatLogEntryContext', MadnessChat.addChatMessageContextOptions);
