import MadnessItem from '../data/MadnessItem.js';
import MadnessDice from './MadnessDice.js';

export default class MadnessChat {

  static addChatListeners(html) {
    html.on('click', 'button.item-crit', MadnessChat.onItemCritic)
    html.on('click', 'button.item-attack', MadnessChat.onItemAttack)
    html.on('mouseover', 'button.item-attack', MadnessChat.onItemAttackMouseOver)
    html.on('mouseout', 'button.item-attack', MadnessChat.onItemAttackMouseOut)
  }

  static onItemCritic(event) {
    const card = event.currentTarget.closest('.item');
    MadnessItem.onItemCardCriticClick(card);
  }

  static onItemAttack(event) {
    const card = event.currentTarget.closest('.item');
    const {actor: attacker, item} = MadnessChat._getActorAndItem(card);
    item.attack(attacker);
  }

  static onItemAttackMouseOver(event) {
    const card = event.currentTarget.closest('.item');
    const {item} = MadnessChat._getActorAndItem(card);
    item.showRange();
  }

  static onItemAttackMouseOut(event) {
    const card = event.currentTarget.closest('.item');
    const {item} = MadnessChat._getActorAndItem(card);
    item.hideRange();
  }

  static _getActorAndItem(card) {
    const actor = game.actors.get(card.dataset.ownerId);
    return {
      actor: actor,
      item: actor.items.get(card.dataset.itemId)
    }
  }

  static addChatMessageContextOptions(html, options) {
    const canDefend = (li) => canvas.tokens.controlled.length && li.find('.task-check.attack').length;
    options.push(
      {
        name: game.i18n.localize('madness.chat.actions.defend'),
        icon: '<i class="fas fa-shield-alt"></i>',
        condition: canDefend,
        callback: (li) => MadnessChat.defend(li)
      },
      {
        name: game.i18n.localize('madness.chat.actions.dodge'),
        icon: '<i class="fas fa-person-running"></i>',
        condition: canDefend,
        callback: (li) => MadnessChat.defend(li, true)
      }
    );
    return options;
  }

  static async defend(attack, dodge = false) {
    const [item] = attack.find('.attack').find('.item');
    const itemDamage = parseInt(item.dataset.itemDamage)
    const defenders = [...canvas.tokens.controlled];
    const [defender] = defenders;
    const defenderActor = defender.actor;

    if (dodge) {
      const dodgeResult = await MadnessDice.rollEvade(defenderActor);
      if (Object.entries(dodgeResult).some(([key, value]) => value)) return;
    } else {
      const result = await MadnessDice.rollCritDice(defenderActor);
      if (result.isCriticalSuccess || result.isCriticalFail) return;
    }

    const finalOutcome = MadnessChat._calculateOutcome(itemDamage, defenderActor, dodge)

    const template = 'systems/madness/templates/chat/attack-success.hbs';
    
    const templateData = {
      damage: finalOutcome,
      actor: defenderActor,
      ...await defenderActor.applyDamage(finalOutcome)
    }
    defender.refresh();
    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ defenderActor }),
      content: await renderTemplate(template, templateData)
    });

  }

  static _calculateOutcome(damage, actor, dodge) {
    let reducedDamage = damage;
    if (!dodge) {
      reducedDamage = actor.calculateDamageReduction(damage);
    }
    const outcome = actor.calculateArmorReduction(reducedDamage);
    return Math.ceil(outcome);
  }

}