import MadnessDice from "../utils/MadnessDice.js";
import { madness } from "../config.js";
import Formula from "../formulas/Formula.js";

export default class MadnessItem extends Item {

  async _preCreate(data, options, userId) {
    await super._preCreate(data, options, userId);
    await this.updateSource({ 'ownership.default': 2 })
  }

  _rangeMeasuredTemplate;

  async attack(attacker) {
    if (this.type === 'skill') {
      if (attacker.system.attributes.mp.value < this.system.cost.mp) {
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
      await attacker.removeManaPoints(this.system.cost.mp);
    }
    const damageRollFormula = new Formula(madness.formulas.roll.damage(Object.entries(this.system.damage.roll))).compute({...attacker.system.stats, damage: this.system.damage.base}).computed;
    MadnessDice.taskCheck({
      actor: attacker,
      rollFormula: damageRollFormula,
      isAttack: true,
      extraMessageData: {
        item: this
      }
    });
  }

  async showRange() {
    if (this.system.range >= 1) {
      const tokens = [...canvas.tokens.controlled];
      if (tokens.length) {
        const [token] = tokens;
        const templateData = {
          t: 'circle',
          user: game.user.id,
          x: token.center.x,
          y: token.center.y,
          direction: 0,
          distance: this.system.range || 0.1,
          fillColor: madness.colors.item.range.fillColor,
          borderColor: madness.colors.item.range.borderColor
        };
        const createdTemplates = await canvas.scene.createEmbeddedDocuments('MeasuredTemplate', [templateData]);
        this._rangeMeasuredTemplate = createdTemplates[0];
      }
    }
  }

  hideRange() {
    if (this._rangeMeasuredTemplate) {
      canvas.scene.deleteEmbeddedDocuments('MeasuredTemplate', [this._rangeMeasuredTemplate.id])
    }
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