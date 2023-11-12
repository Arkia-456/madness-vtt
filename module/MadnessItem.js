import MadnessDice from "./MadnessDice.js";
import { madness } from "./config.js";
import Formula from "./formulas/Formula.js";

export default class MadnessItem extends Item {

  async attack(attacker) {
    const damageRollFormula = new Formula(madness.formulas.roll.damage(Object.entries(this.system.damageRoll))).compute({...attacker.system.stats, damage: this.system.damage}).computed;
    MadnessDice.taskCheck({
      actor: attacker,
      rollFormula: damageRollFormula,
      isAttack: true,
      extraMessageData: {
        item: this
      }
    });
  }

  async roll() {
    const cardData = {
      item: this,
      id: this.id,
      ownerId: this.actor.id,
      owner: game.actors.get(this.actor.id)
    };
    const template = 'systems/madness/templates/chat/item-chat.hbs';
    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: await renderTemplate(template, cardData),
      whisper: game.users.filter(user => this.actor.testUserPermission(user, 'OWNER'))
    };
    return ChatMessage.create(chatData);
  }
}