export default class MadnessDice {

  static async taskCheck({
    actor = null,
    rollFormula = '',
    rollData = {},
    sendMessage = true,
    isAttack = false,
    extraMessageData = {}
  } = {}) {

    const messageTemplate = 'systems/madness/templates/chat/stat-check.hbs';

    const rollResult = await new Roll(rollFormula, rollData).roll({ async: true });

    if (sendMessage) {
      MadnessDice.toCustomMessage(actor, rollResult, messageTemplate, {
        ...extraMessageData,
        isAttack
      });
    }

    return rollResult;
  }

  static async statCheck({
    statValue = 0,
    modValue = 0
  }) {
    const rollFormula = '1d@value';
    const rollData = {
      value: statValue + modValue
    };

    if (!rollData.value || rollData.value <= 0) {
      console.log(`No value to roll: ${statValue}, ${modValue}`);
      return;
    };

    MadnessDice.taskCheck({
      rollFormula: rollFormula,
      rollData: rollData
    });
  }

  static async attack(attacker, type, skill) {
    let rollFormula = `${skill.system.damage}`;
    Object.entries(skill.system.damageRoll).forEach(([stat, value]) => {
      if (value) {
        const statValue = attacker.system.stats[stat].total;
        rollFormula += ` + ${value}d${statValue}`
      }
    });
    MadnessDice.taskCheck({
      actor: attacker,
      rollFormula: rollFormula,
      isAttack: true,
      extraMessageData: {
        item: skill
      }
    });
  }

  static async rollCritDice(attacker, type, skill) {
    const messageTemplate = 'systems/madness/templates/chat/critical-check.hbs';
    const rollFormula = '1d100';
    const rollResult = await new Roll(rollFormula).roll({ async: true });
    console.log(rollResult)
    const isCriticalSuccess = rollResult.total <= attacker.system.stats.critRate.total;
    const isCriticalFail = rollResult.total > 95;
    MadnessDice.toCustomMessage(attacker, rollResult, messageTemplate, {
      isCriticalSuccess: isCriticalSuccess,
      isCriticalFail: isCriticalFail
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