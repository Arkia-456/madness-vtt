import MadnessDice from "./MadnessDice.js";
import { madness } from "./config.js";
import Formula from "./formulas/Formula.js";

export default class MadnessItem extends Item {

  async attack(attacker) {
    if (this.type === 'skill') {
      if (attacker.system.manaPoints.value < this.system.cost) {
        const notEnoughManaTemplate = 'systems/madness/templates/chat/not-enough-mana.hbs';
        const notEnoughManaData = {
          item: this,
          actor: game.actors.get(this.actor.id)
        };
        ChatMessage.create({
          user: game.user.id,
          speaker: ChatMessage.getSpeaker({ attacker }),
          content: await renderTemplate(notEnoughManaTemplate, notEnoughManaData),
          whisper: game.users.filter(user => this.actor.testUserPermission(user, 'OWNER'))
        });
        return;
      }
      await attacker.removeManaPoints(this.system.cost);
    }
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