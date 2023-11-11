export default class MadnessDice {

  static async taskCheck({
    actor = null,
    rollFormula = '',
    rollData = {},
    sendMessage = true,
    isAttack = false,
    isStatCheck = false,
    extraMessageData = {}
  } = {}) {

    const messageTemplate = 'systems/madness/templates/chat/task-check.hbs';

    const rollResult = await new Roll(rollFormula, rollData).roll({ async: true });

    if (sendMessage) {
      MadnessDice.toCustomMessage(actor, rollResult, messageTemplate, {
        ...extraMessageData,
        isAttack,
        isStatCheck
      });
    }

    return rollResult;
  }

  static async statCheck({
    statValue = 0,
    modValue = 0,
    statName = ''
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
      rollData: rollData,
      extraMessageData: {
        statName: statName
      },
      isStatCheck: true
    });
  }

  static async attack(attacker, type, item) {
    let rollFormula = `${item.system.damage}`;
    Object.entries(item.system.damageRoll).forEach(([stat, value]) => {
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
        item: item
      }
    });
  }

  static async rollCritDice(actor) {
    const messageTemplate = 'systems/madness/templates/chat/critical-check.hbs';
    const rollFormula = '1d100';
    const rollResult = await new Roll(rollFormula).roll({ async: true });
    const isCriticalSuccess = rollResult.total <= actor.system.stats.critRate.total;
    const isCriticalFail = rollResult.total > 95;
    await MadnessDice.toCustomMessage(actor, rollResult, messageTemplate, {
      isCriticalSuccess: isCriticalSuccess,
      isCriticalFail: isCriticalFail
    });
    return {
      isCriticalSuccess,
      isCriticalFail
    }
  }

  static async rollEvade(actor) {
    const messageTemplate = 'systems/madness/templates/chat/evade-check.hbs';
    const rollFormula = '1d100';
    const rollResult = await new Roll(rollFormula).roll({ async: true });
    const thresholds = {
      criticalSuccess: actor.system.stats.critRate.total,
      success: actor.system.stats.evadeRate.total,
      criticalFail: 95
    };
    let result = {
      isCriticalSuccess: rollResult.total <= thresholds.criticalSuccess,
      isCriticalFail: rollResult.total > thresholds.criticalFail,
      isSuccess: rollResult.total <= thresholds.success
    };
    await MadnessDice.toCustomMessage(actor, rollResult, messageTemplate, {
      ...result
    });
    return result;
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