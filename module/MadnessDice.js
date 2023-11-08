export default class MadnessDice {

  static async statCheck({
    statValue = 0,
    modValue = 0
  } = {}) {

    const rollFormula = '1d@value';
    const rollData = {
      value: statValue + modValue
    };
    
    if (!rollData.value || rollData.value <= 0) return;

    const messageData = {
      speaker: ChatMessage.getSpeaker()
    };

    const rollResult = await new Roll(rollFormula, rollData).roll({ async: true });
    rollResult.toMessage(messageData);
  }

}