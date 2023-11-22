import MadnessDice from '../utils/MadnessDice.js';
import { madness } from '../config.js';
import Formula from '../formulas/Formula.js';
import MadnessUtils from '../utils/MadnessUtils.js';

export default class MadnessItem extends Item {

  async _preCreate(data, options, userId) {
    await super._preCreate(data, options, userId);
    await this.updateSource({ 'ownership.default': 2 })
  }

  async _onUpdate(changed, options, user) {
    this._updateMagicActiveEffects(changed);
    await super._onUpdate(changed, options, user);
  }

  _updateMagicActiveEffects(data) {
    const magicRequirements = data.system?.requirements;
    const magic1TypeChange = magicRequirements?.magic1?.type;
    const magic2TypeChange = magicRequirements?.magic2?.type;

    const hasMagic1TypeChanged = magic1TypeChange !== undefined;
    const hasMagic2TypeChanged = magic2TypeChange !== undefined;
    if (!hasMagic1TypeChanged && !hasMagic2TypeChanged) return;

    const magic1Type = magic1TypeChange ?? this.system.requirements.magic1.type;
    const magic2Type = magic2TypeChange ?? this.system.requirements.magic2.type;
    const isMonomagic = this._isMonomagic(magic1Type, magic2Type);

    const magicActiveEffectsToAdd = [];
    const magicActiveEffectsToRemove = [];
    magicActiveEffectsToRemove.push(...this.effects.filter(effect => effect.flags.hasOwnProperty('magicType')).map(effect => effect.id));
    if (isMonomagic) {
      magicActiveEffectsToAdd.push(this._onMagicTypeChange(0, magic1Type || magic2Type));
    } else {
      magicActiveEffectsToAdd.push(this._onMagicTypeChange(1, magic1Type));
      magicActiveEffectsToAdd.push(this._onMagicTypeChange(2, magic2Type));
    }
    this.deleteEmbeddedDocuments('ActiveEffect', magicActiveEffectsToRemove);
    this.createEmbeddedDocuments('ActiveEffect', magicActiveEffectsToAdd.filter(Boolean));
  }

  _isMonomagic(magic1, magic2) {
    return !magic1 || !magic2 || magic1 === magic2;
  }

  _onMagicTypeChange(magicOrder, magicType) {
    const activeEffect = madness.magicActiveEffects[magicType];
    return activeEffect
      ? {
        name: game.i18n.localize(activeEffect.name) ?? 'New effect',
        description: game.i18n.localize(activeEffect.description) ?? '',
        icon: activeEffect.icon ?? 'icons/svg/aura.svg',
        origin: this.uuid,
        disabled: false,
        transfer: false,
        flags: { 
          effect: activeEffect.effect,
          magicOrder: magicOrder,
          magicType: magicType,
          value: magicOrder === 0 ? activeEffect.value : activeEffect.value / 2
        }
      }
      : null ;
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
      magic1Type: game.i18n.localize(`madness.magic.${this.system.requirements.magic1.type}`),
      magic2Type: game.i18n.localize(`madness.magic.${this.system.requirements.magic2.type}`),
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

  static rollCrit(card) {
    const { actor, item } = MadnessUtils.getActorAndItemFromCard(card);
    MadnessDice.rollCritDice(actor, item);
  }

  getActiveEffectCritBonus() {
    const effect = this.effects.find(effect => effect.flags.effect === 'increaseSkillCritRate');
    return effect ? effect.flags.value : 0;
  }
}