export default class MadnessDice {

  static async statCheck({
    actor = null,
    statValue = 0,
    modValue = 0,
    sendMessage = true,
    isAttack = false,
    extraMessageData = {}
  } = {}) {

    const messageTemplate = 'systems/madness/templates/chat/stat-check.hbs';

    const rollFormula = '1d@value';
    const rollData = {
      value: statValue + modValue
    };
    
    if (!rollData.value || rollData.value <= 0) return;

    const rollResult = await new Roll(rollFormula, rollData).roll({ async: true });

    if (sendMessage) {
      MadnessDice.toCustomMessage(actor, rollResult, messageTemplate, {
        ...extraMessageData,
        isAttack
      });
    }

    return rollResult;
  }

  static async attack(attacker, type, skill) {
    const statName = type === 'skill' ? 'intelligence' : 'strength';
    MadnessDice.statCheck({
      actor: attacker,
      statValue: attacker.system.stats[statName].base,
      modValue: attacker.system.stats[statName].mod,
      isAttack: true,
      extraMessageData: {
        item: skill
      }
    });
  }

  static async toCustomMessage(actor, rollResult, template, extraData) {
    const templateContext = {
      ...extraData,
      roll: rollResult
    };

    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor }),
      roll: rollResult,
      content: await renderTemplate(template, templateContext),
      sound: CONFIG.sounds.dice,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL
    };

    ChatMessage.create(chatData);
  }

}